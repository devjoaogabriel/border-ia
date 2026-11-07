"use client";

import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";
import type { MotionEnvironment } from "@/types/landing";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useMotionEnvironment(): MotionEnvironment {
  return {
    reduceMotion: useMediaQuery("(prefers-reduced-motion: reduce)"),
    canHover: useMediaQuery("(hover: hover) and (pointer: fine)"),
  };
}

export function useInViewport(ref: RefObject<Element | null>): boolean {
  const [inViewport, setInViewport] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInViewport(entry.isIntersecting),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inViewport;
}
