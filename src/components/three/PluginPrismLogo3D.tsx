"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { ExtrudeGeometry, type Group, MathUtils } from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { LOGO_MARK } from "@/lib/constants";

const MAX_TILT = MathUtils.degToRad(8);
const DEPTH = 5;

function createPrism(d: string) {
  const [path] = new SVGLoader().parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`,
  ).paths;
  return new ExtrudeGeometry(path.toShapes(), {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: 1.2,
    bevelSize: 0.7,
    bevelOffset: -0.7,
    bevelSegments: 4,
    curveSegments: 16,
  });
}

interface PrismsProps {
  burstSignal: number;
  canHover: boolean;
}

function Prisms({ burstSignal, canHover }: PrismsProps) {
  const groupRef = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const back = useMemo(() => createPrism(LOGO_MARK.back.d), []);
  const front = useMemo(() => createPrism(LOGO_MARK.front.d), []);

  useEffect(() => {
    if (!canHover) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [canHover]);

  useEffect(() => {
    if (burstSignal > 0) spin.current = Math.PI * 2;
  }, [burstSignal]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const time = clock.elapsedTime;
    const targetX = canHover ? pointer.current.y * MAX_TILT : Math.sin(time * 0.9) * MAX_TILT * 0.6;
    const targetY = canHover ? pointer.current.x * MAX_TILT : Math.cos(time * 0.7) * MAX_TILT * 0.6;
    spin.current = MathUtils.damp(spin.current, 0, 3.5, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 5, delta);
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 5, delta);
    group.children[0].rotation.y = spin.current;
  });

  const offset: [number, number] = [-LOGO_MARK.width / 2, LOGO_MARK.height / 2];
  return (
    <group ref={groupRef}>
      <group>
        <mesh geometry={back} position={[offset[0], offset[1], -DEPTH - 3]} scale={[1, -1, 1]}>
          <meshPhysicalMaterial
            color={LOGO_MARK.back.color}
            emissive={LOGO_MARK.back.color}
            emissiveIntensity={0.42}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.25}
          />
        </mesh>
        <mesh geometry={front} position={[offset[0], offset[1], 0]} scale={[1, -1, 1]}>
          <meshPhysicalMaterial
            color={LOGO_MARK.front.color}
            emissive={LOGO_MARK.front.color}
            emissiveIntensity={0.42}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}

interface PluginPrismLogo3DProps extends PrismsProps {
  isActive: boolean;
  onReady: () => void;
}

export default function PluginPrismLogo3D({
  isActive,
  onReady,
  ...prisms
}: PluginPrismLogo3DProps) {
  return (
    <Canvas
      aria-hidden="true"
      flat
      orthographic
      dpr={[1, 2]}
      frameloop={isActive ? "always" : "never"}
      camera={{ position: [0, 0, 100], zoom: 1 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={onReady}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[-20, 40, 60]} intensity={1.4} />
      <pointLight position={[0, 34, 26]} color="#C082FF" intensity={1800} />
      <Prisms {...prisms} />
    </Canvas>
  );
}
