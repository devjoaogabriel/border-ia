"use client";

import { type LenisRef, ReactLenis, useLenis } from "lenis/react";
import { type ReactNode, useEffect, useRef } from "react";
import { useMotionEnvironment } from "@/hooks/useMotionEnvironment";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const { reduceMotion } = useMotionEnvironment();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        smoothWheel: !reduceMotion,
        anchors: !reduceMotion,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
