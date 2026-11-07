"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { NoBlending, type ShaderMaterial } from "three";
import { beamPulse } from "@/lib/gsap";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Só desenha o que se move. O feixe parado vem do fallback CSS, fiel ao Figma.
const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uPulse;
  uniform float uTime;
  uniform vec2 uSize;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 px = vec2((vUv.x - 0.5) * uSize.x, (1.0 - vUv.y) * uSize.y);
    float y = 1.0 - vUv.y;
    float dist = abs(px.x);

    float running = step(0.001, uPulse) * step(uPulse, 0.999);
    float trail = smoothstep(uPulse - 0.3, uPulse, y) * smoothstep(uPulse + 0.05, uPulse, y) * running;
    float core = exp(-dist * dist / 10.0);
    float halo = exp(-dist / 30.0) * 0.32;
    float beam = (core + halo) * trail;

    vec2 cell = floor(px / 19.0);
    vec2 local = fract(px / 19.0) - 0.5;
    float seed = hash(cell);
    float blink = pow(0.5 + 0.5 * sin(uTime * (0.6 + seed) + seed * 6.28), 6.0);
    float dotShape = smoothstep(0.14, 0.05, length(local));
    float fall = exp(-dist / 90.0);
    float dots = dotShape * blink * fall * 0.32;

    vec3 purple = vec3(0.753, 0.51, 1.0);
    vec3 color = mix(purple, vec3(1.0), core * trail) * beam + vec3(0.48, 0.4, 1.0) * dots;
    float alpha = clamp(beam + dots, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

function BeamPlane({ width, height }: { width: number; height: number }) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uPulse: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: [width, height] },
    }),
    [width, height],
  );

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uPulse.value = beamPulse.value;
    material.uniforms.uTime.value = clock.elapsedTime;
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
}

export default function HeroBeamCanvas({
  isActive,
  width,
  height,
}: HeroBeamCanvasProps) {
  return (
    <Canvas
      aria-hidden="true"
      flat
      dpr={[1, 2]}
      frameloop={isActive ? "always" : "never"}
      gl={{ alpha: true, antialias: false }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <BeamPlane width={width} height={height} />
    </Canvas>
  );
}
