"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { BorderIaMark } from "@/components/ui/BorderIaLogo";
import {
  useInViewport,
  useMediaQuery,
  useMotionEnvironment,
} from "@/hooks/useMotionEnvironment";
import { shouldLoadPrismLogo3D } from "@/lib/prism-logo-policy";
import { WebGLSafeBoundary } from "./WebGLSafeBoundary";

const PluginPrismLogo3D = dynamic(() => import("./PluginPrismLogo3D"), {
  ssr: false,
});

export function PluginPrismLogoLazy({ burstSignal }: { burstSignal: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(rootRef);
  const { reduceMotion, canHover } = useMotionEnvironment();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // No celular o Three.js nem é baixado: fica o logo em SVG.
  const load3D = shouldLoadPrismLogo3D({ isDesktop, reduceMotion });
  const [ready, setReady] = useState(false);
  // Ao desligar o 3D, "pronto" zera durante o render: o próximo canvas precisa avisar de novo.
  const [wasLoading, setWasLoading] = useState(load3D);
  if (load3D !== wasLoading) {
    setWasLoading(load3D);
    if (!load3D) setReady(false);
  }
  const show3D = ready && load3D;

  return (
    <div ref={rootRef} className="relative h-10 w-14">
      <BorderIaMark className={show3D ? "opacity-0" : ""} />
      {load3D && (
        <div className="absolute -inset-3">
          <WebGLSafeBoundary onError={() => setReady(false)}>
            <PluginPrismLogo3D
              isActive={inViewport}
              burstSignal={burstSignal}
              canHover={canHover}
              onReady={() => setReady(true)}
              onLost={() => setReady(false)}
            />
          </WebGLSafeBoundary>
        </div>
      )}
    </div>
  );
}
