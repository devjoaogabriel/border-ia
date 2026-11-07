"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { NoBlending, type ShaderMaterial } from "three";
import { beamPulse, heroCardMotion } from "@/lib/gsap";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Desenha o pulso, a onda e, depois de montado, também os pontos fixos da malha.
// O feixe parado vem do SVG.
const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uPulse;
  uniform float uTime;
  uniform vec2 uSize;
  uniform float uBendX;
  uniform float uTipX;
  uniform float uTipY;
  uniform float uMeshHalf;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 px = vec2((vUv.x - 0.5) * uSize.x, (1.0 - vUv.y) * uSize.y);

    // Mesma curva de Bézier do path SVG: em y ela é linear, então t sai direto da altura.
    float t = clamp(px.y / max(uTipY, 1.0), 0.0, 1.0);
    float curveX = 3.0 * (1.0 - t) * t * t * uBendX + t * t * t * uTipX;
    float beamDist = abs(px.x - curveX);

    float running = step(0.001, uPulse) * step(uPulse, 0.999) * step(px.y, uTipY);
    float trail = smoothstep(uPulse - 0.3, uPulse, t) * smoothstep(uPulse + 0.05, uPulse, t) * running;
    float core = exp(-beamDist * beamDist / 10.0);
    float halo = exp(-beamDist / 30.0) * 0.32;
    float beam = (core + halo) * trail;

    // Pontos abrem espaço para a corda, que fica atrás do canvas.
    float cordClearance = smoothstep(1.8, 4.5, beamDist);

    // Grade única na posição do DotMatrixDecor (uMeshHalf para cada lado, top 60px, passo 19px).
    vec2 gridOrigin = vec2(-uMeshHalf, 60.0);
    vec2 cell = floor((px - gridOrigin) / 19.0);
    vec2 cellCenter = gridOrigin + (cell + 0.5) * 19.0;

    // A onda parte da curva viva da corda na altura da célula: acompanha o balanço do fio.
    float tCell = clamp(cellCenter.y / max(uTipY, 1.0), 0.0, 1.0);
    float cellCurveX = 3.0 * (1.0 - tCell) * tCell * tCell * uBendX + tCell * tCell * tCell * uTipX;
    float side = cellCenter.x >= cellCurveX ? 1.0 : -1.0;
    float cordDist = abs(cellCenter.x - cellCurveX);

    // Máscara closest-side de 25%, igual ao CSS: gradiente sem borda reta.
    float inArea = step(-uMeshHalf, cellCenter.x) * step(cellCenter.x, uMeshHalf)
      * step(60.0, cellCenter.y) * step(cellCenter.y, uSize.y - 28.0);
    vec2 maskUv = vec2(cellCenter.x / uMeshHalf, (cellCenter.y - 278.5) / 218.5);
    float baseMask = clamp((1.0 - length(maskUv)) / 0.75, 0.0, 1.0) * inArea;

    // Onda contínua: desce ao longo do fio e se abre para os lados (período de ~3.14s).
    float lateralFalloff = exp(-cordDist / 155.0);
    float wavePhase = cordDist * 0.036 + cellCenter.y * 0.015 - uTime * 2.0;
    float waveCrest = pow(0.5 + 0.5 * sin(wavePhase), 2.2);
    float pulseWake = exp(-pow((tCell - uPulse) / 0.14, 2.0)) * exp(-cordDist / 95.0) * running;
    float waveEnv = clamp(waveCrest * lateralFalloff + pulseWake * 0.55, 0.0, 1.0) * baseMask;

    // Ondulação de no máximo 1.3px: o ponto nunca sai da própria célula.
    vec2 shift = vec2(side * 1.1, 0.55) * sin(wavePhase) * baseMask * lateralFalloff;
    float r = length(px - (cellCenter + shift));
    float dotRadius = mix(1.4, 1.85, waveEnv);
    float dotShape = 1.0 - clamp((r - dotRadius) / 0.45, 0.0, 1.0);

    float seed = hash(cell);
    float blink = pow(0.5 + 0.5 * sin(uTime * (0.6 + seed) + seed * 6.28), 6.0);
    float fall = exp(-cordDist / 90.0) * inArea;
    float dots = clamp(dotShape * (baseMask * 0.28 + blink * fall * 0.24 + waveEnv * 0.36), 0.0, 1.0) * cordClearance;

    vec3 baseDot = vec3(0.478, 0.404, 1.0);
    vec3 crestDot = vec3(0.753, 0.51, 1.0);
    vec3 peakDot = vec3(0.914, 0.831, 1.0);
    vec3 dotColor = mix(baseDot, mix(crestDot, peakDot, waveEnv * 0.45), clamp(waveEnv * 1.15, 0.0, 1.0));

    vec3 color = mix(crestDot, vec3(1.0), core * trail) * beam + dotColor * dots;
    float alpha = clamp(beam + dots, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

function BeamPlane({
  width,
  height,
  meshHalfWidth,
}: {
  width: number;
  height: number;
  meshHalfWidth: number;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uPulse: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: [width, height] },
      uBendX: { value: 0 },
      uTipX: { value: 0 },
      uTipY: { value: heroCardMotion.tipY },
      uMeshHalf: { value: meshHalfWidth },
    }),
    [width, height, meshHalfWidth],
  );

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uPulse.value = beamPulse.value;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uBendX.value = heroCardMotion.bendX;
    material.uniforms.uTipX.value = heroCardMotion.tipX;
    material.uniforms.uTipY.value = heroCardMotion.tipY;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        blending={NoBlending}
        depthTest={false}
      />
    </mesh>
  );
}

interface HeroBeamCanvasProps {
  isActive: boolean;
  width: number;
  height: number;
  meshHalfWidth: number;
  onReady?: () => void;
}

export default function HeroBeamCanvas({
  isActive,
  width,
  height,
  meshHalfWidth,
  onReady,
}: HeroBeamCanvasProps) {
  return (
    <Canvas
      aria-hidden="true"
      flat
      dpr={[1, 2]}
      frameloop={isActive ? "always" : "never"}
      gl={{ alpha: true, antialias: false }}
      onCreated={onReady}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <BeamPlane width={width} height={height} meshHalfWidth={meshHalfWidth} />
    </Canvas>
  );
}
