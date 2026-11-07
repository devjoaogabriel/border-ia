"use client";

import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";
import type { MotionEnvironment } from "@/types/landing";
import { getMediaQueryStore } from "./media-query-store";

const serverSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  const { subscribe, getSnapshot } = getMediaQueryStore(query);
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
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
