"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery, useMotionEnvironment } from "@/hooks/useMotionEnvironment";
import {
  advanceCursorMeshState,
  computeCentralDotAlpha,
  computeCursorCellAlpha,
  computeCursorDprMetrics,
  createInitialCursorState,
  CURSOR_MESH_CONSTANTS as C,
  isValidCursorPointerType,
} from "@/lib/cursor-mesh-math";

const SIDE = C.PATCH / C.STEP;
// Célula cujo ponto 2x2 cobre o centro do canvas: é a mira do clique.
const CENTER = C.HALF / C.STEP;

// Substitui a seta do mouse: fica acima de tudo e a página ganha cursor: none.
// Só existe com mouse e movimento liberado; no toque e no movimento reduzido a seta volta.
export function CursorDotMesh() {
  const { reduceMotion, canHover } = useMotionEnvironment();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const enabled = canHover && isDesktop && !reduceMotion;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !canvas || !ctx) return;

    // Trocar de monitor ou dar zoom muda o devicePixelRatio: o bitmap acompanha para não borrar.
    let dpr = 0;
    const syncDpr = () => {
      const metrics = computeCursorDprMetrics(window.devicePixelRatio);
      if (metrics.dpr === dpr) return;
      dpr = metrics.dpr;
      canvas.width = metrics.physicalSize;
      canvas.height = metrics.physicalSize;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = C.COLOR;
    };
    syncDpr();

    const state = createInitialCursorState();
    let lastTime = 0;

    const draw = () => {
      ctx.clearRect(0, 0, C.PATCH, C.PATCH);
      for (let row = 0; row < SIDE; row++) {
        for (let col = 0; col < SIDE; col++) {
          const alpha =
            row === CENTER && col === CENTER
              ? computeCentralDotAlpha(state.presence)
              : computeCursorCellAlpha(col, row, state.interactive, state.presence, state.elapsed);
          if (alpha === 0) continue;
          ctx.globalAlpha = alpha;
          ctx.fillRect(col * C.STEP, row * C.STEP, 2, 2);
        }
      }
    };

    const frame = (now: number) => {
      const hibernate = advanceCursorMeshState(state, lastTime ? (now - lastTime) / 1000 : 0);
      lastTime = now;
      canvas.style.transform = `translate3d(${state.x - C.HALF}px, ${state.y - C.HALF}px, 0)`;

      // Hiberna: sem mouse na janela, nenhum quadro é agendado.
      if (hibernate) {
        ctx.clearRect(0, 0, C.PATCH, C.PATCH);
        lastTime = 0;
        return;
      }
      draw();
      state.rafId = requestAnimationFrame(frame);
    };

    const html = document.documentElement;
    const onMove = (event: PointerEvent) => {
      if (!isValidCursorPointerType(event.pointerType)) {
        // Toque num aparelho híbrido: a seta nativa volta e a malha some.
        if (event.pointerType === "touch") {
          html.classList.remove("cursor-mesh");
          hide();
        }
        return;
      }
      // A seta só some depois que a malha tem posição para aparecer no lugar dela.
      html.classList.add("cursor-mesh");
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
    function hide() {
      state.targetPresence = 0;
      state.targetInteractive = 0;
    }
    const onVisibility = () => {
      if (document.hidden) hide();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    // Clique sem mover, por exemplo logo depois de um Alt+Tab, também acorda a malha.
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", syncDpr, { passive: true });
    html.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", syncDpr);
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
        style={{ width: C.PATCH, height: C.PATCH, transform: "translate3d(-999px, -999px, 0)" }}
      />
    </div>
  );
}
