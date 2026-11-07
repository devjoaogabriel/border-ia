"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { DotMatrixDecor } from "@/components/ui/DotMatrixDecor";
import {
  useInViewport,
  useMediaQuery,
  useMotionEnvironment,
} from "@/hooks/useMotionEnvironment";
import { WebGLSafeBoundary } from "./WebGLSafeBoundary";

const HeroBeamCanvas = dynamic(() => import("./HeroBeamCanvas"), { ssr: false });

const BEAM_WIDTH = 340;
const BEAM_VISIBLE_HEIGHT = 497;
// Fica atrás do card e cobre a retração da perspectiva quando ele inclina.
const BEAM_OVERLAP = 20;
const BEAM_HEIGHT = BEAM_VISIBLE_HEIGHT + BEAM_OVERLAP;

// O feixe só existe no frame Desktop. Em Mobile, o Three.js nem é baixado.
export function HeroBeamLazy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(rootRef);
  const { reduceMotion } = useMotionEnvironment();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[calc(100%-20px)] left-[97px] z-0 hidden -translate-x-1/2 lg:block"
      style={{ width: BEAM_WIDTH, height: BEAM_HEIGHT }}
    >
      <div className="absolute -inset-x-10 top-0 bottom-5 bg-[radial-gradient(50%_85%_at_50%_10%,rgb(122_103_255/0.22),transparent)]" />
      <DotMatrixDecor variant="css" className="inset-x-[60px] top-[60px] bottom-5" />
      <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-linear-to-b from-white via-[#C2BAFE] to-[#8A6DFE]" />
      {isDesktop && !reduceMotion && (
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
