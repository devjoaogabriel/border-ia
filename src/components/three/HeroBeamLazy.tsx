"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { DotMatrixDecor } from "@/components/ui/DotMatrixDecor";
import {
  useInViewport,
  useMediaQuery,
  useMotionEnvironment,
} from "@/hooks/useMotionEnvironment";
import { gsap, heroCardMotion } from "@/lib/gsap";
import {
  BEAM_GEOMETRY,
  BEAM_REST_PATH,
  beamPath,
  projectBeamContact,
  stepBeamSpring,
} from "@/lib/hero-beam-math";
import { WebGLSafeBoundary } from "./WebGLSafeBoundary";

const HeroBeamCanvas = dynamic(() => import("./HeroBeamCanvas"), { ssr: false });

const {
  BEAM_WIDTH,
  BEAM_HEIGHT,
  BEAM_CENTER,
  BEAM_REST_TIP,
  MESH_HALF_WIDTH,
  CANVAS_WIDTH,
} = BEAM_GEOMETRY;

// O feixe só existe no frame Desktop. Em Mobile, o Three.js nem é baixado.
export function HeroBeamLazy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inViewport = useInViewport(rootRef);
  const { reduceMotion } = useMotionEnvironment();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const connected = isDesktop && !reduceMotion;
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !connected || !inViewport) return;
    let bendX = heroCardMotion.bendX;
    let velocity = 0;

    const follow = () => {
      // A ponta acompanha o card na hora. O meio do fio chega depois, com mola.
      const { tipX, tipY, targetBendX } = projectBeamContact(heroCardMotion);
      const dt = gsap.ticker.deltaRatio(60) / 60;
      ({ bendX, velocity } = stepBeamSpring(bendX, velocity, targetBendX, dt));

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
      {/* Primeiro paint e movimento reduzido. Com o canvas pronto, o shader desenha estes pontos. */}
      <DotMatrixDecor
        variant="css"
        className={`-inset-x-[77px] top-[60px] bottom-7 ${connected && canvasReady ? "opacity-0" : ""}`}
      />
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
        <div
          className="absolute top-0"
          style={{ left: BEAM_CENTER - CANVAS_WIDTH / 2, width: CANVAS_WIDTH, height: BEAM_HEIGHT }}
        >
          <WebGLSafeBoundary>
            <HeroBeamCanvas
              isActive={inViewport}
              width={CANVAS_WIDTH}
              height={BEAM_HEIGHT}
              meshHalfWidth={MESH_HALF_WIDTH}
              onReady={() => setCanvasReady(true)}
            />
          </WebGLSafeBoundary>
        </div>
      )}
    </div>
  );
}
