"use client";

import { useEffect, useRef } from "react";
import { useMotionEnvironment } from "@/hooks/useMotionEnvironment";
import type { CursorMeshRuntimeState } from "@/types/landing";

const PATCH = 88;
const HALF = PATCH / 2;
const STEP = 4;
const CROWN_RADIUS = 24;
const OUTER_CUTOFF = 40;
// Faz o papel da seta: segue quase colado, só com um resto de inércia.
const FOLLOW_RATE = 24;
const PRESENCE_IN = 9;
const PRESENCE_OUT = 6.5;
const INTERACTIVE_RATE = 8;
const MAX_ALPHA = 0.9;
const COLOR = "#C9B3FF";
// Reticulado ordenado: o campo vira pontos acesos ou apagados, sem degradê borrado.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const approach = (from: number, to: number, rate: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-rate * dt));

// Substitui a seta do mouse: fica acima de tudo e a página ganha cursor: none.
// Só existe com mouse e movimento liberado; no toque e no movimento reduzido a seta volta.
export function CursorDotMesh() {
  const { reduceMotion, canHover } = useMotionEnvironment();
  const enabled = canHover && !reduceMotion;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = PATCH * dpr;
    canvas.height = PATCH * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = COLOR;

    const state: CursorMeshRuntimeState = {
      targetX: -999,
      targetY: -999,
      x: -999,
      y: -999,
      presence: 0,
      targetPresence: 0,
      interactive: 0,
      targetInteractive: 0,
      elapsed: 0,
      rafId: -1,
    };
    let lastTime = 0;

    const draw = () => {
      ctx.clearRect(0, 0, PATCH, PATCH);
      const crown = CROWN_RADIUS * (1 + 0.22 * state.interactive);
      const band = 0.34 - 0.08 * state.interactive;
      const fade = state.presence;
      for (let row = 0; row < PATCH / STEP; row++) {
        for (let col = 0; col < PATCH / STEP; col++) {
          const cx = col * STEP;
          const cy = row * STEP;
          const dx = cx + 1 - HALF;
          const dy = cy + 1 - HALF;
          const dist = Math.hypot(dx, dy);
          if (dist >= OUTER_CUTOFF) continue;
          const angle = Math.atan2(dy, dx);
          const wave =
            0.78 +
            0.09 * Math.sin(3 * angle - 2.2 * state.elapsed) +
            0.05 * Math.sin(1.4 * state.elapsed);
          const ring = Math.max(0, 1 - Math.abs(dist / crown - wave) / band);
          const core = Math.max(0, 1 - (dist / (crown * 0.85)) ** 2) * 0.52;
          const field =
            Math.max(ring, core) * (1 - smoothstep(crown * 1.15, OUTER_CUTOFF, dist));
          if (field <= BAYER[row & 3][col & 3] / 16) continue;
          ctx.globalAlpha = Math.min(MAX_ALPHA, field * 0.95) * fade;
          ctx.fillRect(cx, cy, 2, 2);
        }
      }
    };

    const frame = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      state.elapsed += dt;
      state.x = approach(state.x, state.targetX, FOLLOW_RATE, dt);
      state.y = approach(state.y, state.targetY, FOLLOW_RATE, dt);
      const rate = state.targetPresence > state.presence ? PRESENCE_IN : PRESENCE_OUT;
      state.presence = approach(state.presence, state.targetPresence, rate, dt);
      state.interactive = approach(state.interactive, state.targetInteractive, INTERACTIVE_RATE, dt);
      canvas.style.transform = `translate3d(${state.x - HALF}px, ${state.y - HALF}px, 0)`;

      // Hiberna: sem mouse na janela, nenhum quadro é agendado.
      if (state.targetPresence === 0 && state.presence < 0.01) {
        ctx.clearRect(0, 0, PATCH, PATCH);
        state.presence = 0;
        state.rafId = -1;
        lastTime = 0;
        return;
      }
      draw();
      state.rafId = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Entrada a frio: nasce sob o cursor em vez de atravessar a tela.
      if (state.presence < 0.01 && state.targetPresence === 0) {
        state.x = event.clientX;
        state.y = event.clientY;
      }
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      state.targetPresence = 1;
      const el = event.target instanceof Element ? event.target : null;
      state.targetInteractive = el?.closest("a, button, [role='button']") ? 1 : 0;
      if (state.rafId === -1) state.rafId = requestAnimationFrame(frame);
    };
    const hide = () => {
      state.targetPresence = 0;
      state.targetInteractive = 0;
    };
    const onVisibility = () => {
      if (document.hidden) hide();
    };

    const html = document.documentElement;
    html.classList.add("cursor-mesh");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", hide);
    html.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", hide);
      html.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", onVisibility);
      if (state.rafId !== -1) cancelAnimationFrame(state.rafId);
      html.classList.remove("cursor-mesh");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ width: PATCH, height: PATCH, transform: "translate3d(-999px, -999px, 0)" }}
      />
    </div>
  );
}
