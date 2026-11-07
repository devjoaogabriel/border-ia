"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { BorderIaMark } from "@/components/ui/BorderIaLogo";
import {
  useInViewport,
  useMotionEnvironment,
} from "@/hooks/useMotionEnvironment";
import { WebGLSafeBoundary } from "./WebGLSafeBoundary";

const PluginPrismLogo3D = dynamic(() => import("./PluginPrismLogo3D"), {
  ssr: false,
});

export function PluginPrismLogoLazy({ burstSignal }: { burstSignal: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(rootRef);
  const { reduceMotion, canHover } = useMotionEnvironment();
  const [ready, setReady] = useState(false);
  const show3D = ready && !reduceMotion;

  return (
    <div ref={rootRef} className="relative h-10 w-14">
      <BorderIaMark className={show3D ? "opacity-0" : ""} />
      {!reduceMotion && (
        <div className="absolute -inset-3">
          <WebGLSafeBoundary>
            <PluginPrismLogo3D
              isActive={inViewport}
              burstSignal={burstSignal}
              canHover={canHover}
              onReady={() => setReady(true)}
            />
          </WebGLSafeBoundary>
        </div>
      )}
    </div>
  );
}
