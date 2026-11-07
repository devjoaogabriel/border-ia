"use client";

import { useRef } from "react";
import {
  useInViewport,
  useMotionEnvironment,
} from "@/hooks/useMotionEnvironment";
import { cn } from "@/lib/utils";
import type { MotionSafeWrapperProps } from "@/types/landing";

// As guardas de CSS ficam em globals.css, em [data-motion-state].
export function MotionSafeWrapper({
  children,
  className,
  staticFallbackClassName,
  observeVisibility = false,
}: MotionSafeWrapperProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduceMotion, canHover } = useMotionEnvironment();
  const inViewport = useInViewport(rootRef);
  const isInView = !observeVisibility || inViewport;
  const state = reduceMotion ? "reduced" : isInView ? "running" : "paused";

  return (
    <div
      ref={rootRef}
      data-motion-state={state}
      className={cn(className, reduceMotion && staticFallbackClassName)}
    >
      {typeof children === "function"
        ? children({ prefersReducedMotion: reduceMotion, canHover, isInView })
        : children}
    </div>
  );
}
