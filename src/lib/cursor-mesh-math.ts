import type { CursorMeshRuntimeState } from "@/types/landing";

export const CURSOR_MESH_CONSTANTS = {
  PATCH: 88,
  HALF: 44,
  STEP: 4,
  CROWN_RADIUS: 24,
  OUTER_CUTOFF: 40,
  // Faz o papel da seta: segue quase colado, só com um resto de inércia.
  FOLLOW_RATE: 24,
  PRESENCE_IN: 9,
  PRESENCE_OUT: 6.5,
  INTERACTIVE_RATE: 8,
  MAX_ALPHA: 0.9,
  COLOR: "#C9B3FF",
  // Reticulado ordenado: o campo vira pontos acesos ou apagados, sem degradê borrado.
  BAYER: [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ],
} as const;

const C = CURSOR_MESH_CONSTANTS;
const MAX_DT = 0.05;

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Amortecimento exponencial: igual em 60 Hz ou 144 Hz. */
export function approach(from: number, to: number, rate: number, dt: number): number {
  return from + (to - from) * (1 - Math.exp(-rate * dt));
}

export function createInitialCursorState(): CursorMeshRuntimeState {
  return {
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
}

/** Alpha do ponto 2x2 na célula (col, row) do canvas; 0 quando a célula fica apagada. */
export function computeCursorCellAlpha(
  col: number,
  row: number,
  interactive: number,
  presence: number,
  elapsed: number,
): number {
  if (presence <= 0) return 0;
  const dx = col * C.STEP + 1 - C.HALF;
  const dy = row * C.STEP + 1 - C.HALF;
  const dist = Math.hypot(dx, dy);
  if (dist >= C.OUTER_CUTOFF) return 0;

  const crown = C.CROWN_RADIUS * (1 + 0.22 * interactive);
  const band = 0.34 - 0.08 * interactive;
  const angle = Math.atan2(dy, dx);
  const wave = 0.78 + 0.09 * Math.sin(3 * angle - 2.2 * elapsed) + 0.05 * Math.sin(1.4 * elapsed);
  const ring = Math.max(0, 1 - Math.abs(dist / crown - wave) / band);
  const core = Math.max(0, 1 - (dist / (crown * 0.85)) ** 2) * 0.52;
  const field = Math.max(ring, core) * (1 - smoothstep(crown * 1.15, C.OUTER_CUTOFF, dist));
  if (field <= C.BAYER[row & 3][col & 3] / 16) return 0;
  return Math.min(C.MAX_ALPHA, field * 0.95) * presence;
}

/**
 * Avança um quadro com o passo limitado a [0, 0.05] s.
 * Retorna true quando deve hibernar: sem mouse na janela e presença já apagada.
 */
export function advanceCursorMeshState(state: CursorMeshRuntimeState, rawDtSec: number): boolean {
  const dt = Math.min(Math.max(rawDtSec, 0), MAX_DT);
  state.elapsed += dt;
  state.x = approach(state.x, state.targetX, C.FOLLOW_RATE, dt);
  state.y = approach(state.y, state.targetY, C.FOLLOW_RATE, dt);
  const rate = state.targetPresence > state.presence ? C.PRESENCE_IN : C.PRESENCE_OUT;
  state.presence = approach(state.presence, state.targetPresence, rate, dt);
  state.interactive = approach(state.interactive, state.targetInteractive, C.INTERACTIVE_RATE, dt);

  if (state.targetPresence === 0 && state.presence < 0.01) {
    state.presence = 0;
    state.rafId = -1;
    return true;
  }
  return false;
}
