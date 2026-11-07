"use client";

import { useEffect, useRef } from "react";
import { useMotionEnvironment } from "@/hooks/useMotionEnvironment";

// shortcut: reconstrução local do Glowing Effect (21st 1567), código bloqueado pela cota
// do MCP até 08/11. Comparar com o original quando a cota voltar.
export function GlowingEffect() {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduceMotion, canHover } = useMotionEnvironment();

  useEffect(() => {
    const glow = ref.current;
    const card = glow?.parentElement;
    if (!glow || !card || !canHover || reduceMotion) return;

    const onMove = (event: PointerEvent) => {
      const box = glow.getBoundingClientRect();
      glow.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
      glow.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
      glow.style.opacity = "1";
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      glow.style.opacity = "0";
    };
  }, [canHover, reduceMotion]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="border-ring-mask glow-border hidden lg:block"
    />
  );
}
