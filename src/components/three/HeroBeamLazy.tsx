"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { DotMatrixDecor } from "@/components/ui/DotMatrixDecor";
import {
  useInViewport,
  useMediaQuery,
  useMotionEnvironment,
} from "@/hooks/useMotionEnvironment";
import { gsap, heroCardMotion } from "@/lib/gsap";
import { WebGLSafeBoundary } from "./WebGLSafeBoundary";

const HeroBeamCanvas = dynamic(() => import("./HeroBeamCanvas"), { ssr: false });

const BEAM_WIDTH = 340;
const BEAM_VISIBLE_HEIGHT = 497;
// Fica atrás do card e cobre a retração da perspectiva quando ele inclina.
const BEAM_OVERLAP = 28;
const BEAM_HEIGHT = BEAM_VISIBLE_HEIGHT + BEAM_OVERLAP;
const BEAM_CENTER = BEAM_WIDTH / 2;
const BEAM_TUCK = 14;
const BEAM_REST_TIP = BEAM_VISIBLE_HEIGHT + BEAM_TUCK;

// Ponto do topo do card onde a linha encosta, a partir do centro do card.
const CONTACT_X = -65;
const CONTACT_Y = -202.5;
const PERSPECTIVE = 900;

const SPRING_STIFFNESS = 140;
const SPRING_DAMPING = 14;
const SWAY_GAIN = 95;
const ROLL_GAIN = 40;

function beamPath(bendX: number, tipX: number, tipY: number) {
  const first = (tipY / 3).toFixed(2);
  const second = ((2 * tipY) / 3).toFixed(2);
  const bend = (BEAM_CENTER + bendX).toFixed(2);
  const tip = (BEAM_CENTER + tipX).toFixed(2);
  return `M ${BEAM_CENTER} 0 C ${BEAM_CENTER} ${first}, ${bend} ${second}, ${tip} ${tipY.toFixed(2)}`;
}

const BEAM_REST_PATH = beamPath(0, 0, BEAM_REST_TIP);

// O feixe só existe no frame Desktop. Em Mobile, o Three.js nem é baixado.
export function HeroBeamLazy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inViewport = useInViewport(rootRef);
  const { reduceMotion } = useMotionEnvironment();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const connected = isDesktop && !reduceMotion;

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !connected || !inViewport) return;
    let bendX = heroCardMotion.bendX;
    let velocity = 0;

    const follow = () => {
      const rx = gsap.utils.clamp(-1, 1, (heroCardMotion.rotationX * Math.PI) / 180);
      const ry = gsap.utils.clamp(-1, 1, (heroCardMotion.rotationY * Math.PI) / 180);
      const rz = gsap.utils.clamp(-1, 1, (heroCardMotion.rotation * Math.PI) / 180);

      // Projeta o ponto de contato na mesma ordem do CSS: rotateZ, rotateY, rotateX.
      const y1 = CONTACT_Y * Math.cos(rx);
      const z1 = CONTACT_Y * Math.sin(rx);
      const x2 = CONTACT_X * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -CONTACT_X * Math.sin(ry) + z1 * Math.cos(ry);
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
      const depth = PERSPECTIVE / (PERSPECTIVE - z2);
      const tipX = x3 * depth - CONTACT_X;
      const tipY = BEAM_REST_TIP + y3 * depth - CONTACT_Y;

      // A ponta acompanha o card na hora. O meio do fio chega depois, com mola.
      const target = tipX + Math.sin(ry) * SWAY_GAIN + Math.sin(rz) * ROLL_GAIN;
      const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.05);
      velocity += ((target - bendX) * SPRING_STIFFNESS - velocity * SPRING_DAMPING) * dt;
      bendX += velocity * dt;

      Object.assign(heroCardMotion, { bendX, tipX, tipY });
      path.setAttribute("d", beamPath(bendX, tipX, tipY));
    };

    gsap.ticker.add(follow);
    return () => {
      gsap.ticker.remove(follow);
      Object.assign(heroCardMotion, { bendX: 0, tipX: 0, tipY: BEAM_REST_TIP });
      path.setAttribute("d", BEAM_REST_PATH);
    };
  }, [connected, inViewport]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[calc(100%-28px)] left-[97px] z-0 hidden -translate-x-1/2 lg:block"
      style={{ width: BEAM_WIDTH, height: BEAM_HEIGHT }}
    >
      <div className="absolute -inset-x-10 top-0 bottom-7 bg-[radial-gradient(50%_85%_at_50%_10%,rgb(122_103_255/0.22),transparent)]" />
      <DotMatrixDecor variant="css" className="inset-x-[60px] top-[60px] bottom-7" />
      <svg
        width={BEAM_WIDTH}
        height={BEAM_HEIGHT}
        viewBox={`0 0 ${BEAM_WIDTH} ${BEAM_HEIGHT}`}
        fill="none"
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          {/* userSpaceOnUse: reta vertical tem caixa de largura zero e sumiria sem isso. */}
          <linearGradient
            id="hero-beam-line"
            gradientUnits="userSpaceOnUse"
            x1={BEAM_CENTER}
            y1="0"
            x2={BEAM_CENTER}
            y2={BEAM_REST_TIP}
          >
            <stop stopColor="#fff" />
            <stop offset="0.52" stopColor="#C2BAFE" />
            <stop offset="1" stopColor="#8A6DFE" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={BEAM_REST_PATH}
          stroke="url(#hero-beam-line)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {connected && (
        <WebGLSafeBoundary>
          <HeroBeamCanvas
            isActive={inViewport}
            width={BEAM_WIDTH}
            height={BEAM_HEIGHT}
          />
        </WebGLSafeBoundary>
      )}
    </div>
  );
}
