import { describe, expect, it } from "vitest";
import {
  advanceCursorMeshState,
  approach,
  createInitialCursorState,
  computeCentralDotAlpha,
  computeCursorCellAlpha,
  computeCursorDprMetrics,
  isValidCursorPointerType,
  CURSOR_MESH_CONSTANTS as C,
} from "@/lib/cursor-mesh-math";

const SIDE = C.PATCH / C.STEP;
const cells = Array.from({ length: SIDE * SIDE }, (_, i) => ({
  col: i % SIDE,
  row: Math.floor(i / SIDE),
}));
const distOf = ({ col, row }: { col: number; row: number }) =>
  Math.hypot(col * C.STEP + 1 - C.HALF, row * C.STEP + 1 - C.HALF);
const litCells = (interactive: number, elapsed = 0) =>
  cells.filter((c) => computeCursorCellAlpha(c.col, c.row, interactive, 1, elapsed) > 0);

describe("custo por quadro do cursor", () => {
  it("percorre 484 células e descarta 168 fora do raio de corte", () => {
    expect(cells).toHaveLength(484);
    const outside = cells.filter((c) => distOf(c) >= C.OUTER_CUTOFF);
    expect(outside).toHaveLength(168);
    for (const c of outside) {
      for (const interactive of [0, 1]) {
        expect(computeCursorCellAlpha(c.col, c.row, interactive, 1, 1.3)).toBe(0);
      }
    }
  });

  it("usa uma matriz Bayer 4x4 com os limiares 0 a 15 sem repetir", () => {
    expect([...C.BAYER.flat()].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 16 }, (_, i) => i),
    );
  });

  it("nunca passa do alpha máximo e some sem presença", () => {
    for (const elapsed of [0, 0.7, 2.9]) {
      for (const c of cells) {
        const alpha = computeCursorCellAlpha(c.col, c.row, 1, 1, elapsed);
        expect(alpha).toBeGreaterThanOrEqual(0);
        expect(alpha).toBeLessThanOrEqual(C.MAX_ALPHA);
        expect(computeCursorCellAlpha(c.col, c.row, 1, 0, elapsed)).toBe(0);
      }
    }
  });

  it("abre o anel sobre elementos clicáveis", () => {
    const reach = (interactive: number) =>
      Math.max(...litCells(interactive).map(distOf));
    expect(litCells(0).length).toBeGreaterThan(0);
    expect(reach(1)).toBeGreaterThan(reach(0));
  });
});

describe("amortecimento e hibernação do cursor", () => {
  it("approach chega mais perto sem ultrapassar o alvo", () => {
    const next = approach(0, 10, 24, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
    expect(approach(5, 10, 24, 0)).toBe(5);
  });

  it("limita o passo a 0.05s, mesmo depois de uma aba em segundo plano", () => {
    const longPause = createInitialCursorState();
    const capped = createInitialCursorState();
    for (const s of [longPause, capped]) {
      Object.assign(s, { x: 0, y: 0, targetX: 500, targetY: 300, targetPresence: 1 });
    }
    advanceCursorMeshState(longPause, 12);
    advanceCursorMeshState(capped, 0.05);
    expect(longPause).toEqual(capped);
    expect(longPause.elapsed).toBeCloseTo(0.05);
  });

  it("ignora passo negativo", () => {
    const state = createInitialCursorState();
    Object.assign(state, { x: 10, targetX: 90, targetPresence: 1 });
    advanceCursorMeshState(state, -1);
    expect(state.x).toBe(10);
    expect(state.elapsed).toBe(0);
  });

  it("hiberna em menos de um segundo depois que o mouse sai", () => {
    const state = createInitialCursorState();
    Object.assign(state, { presence: 1, targetPresence: 0, rafId: 7 });
    let frames = 0;
    while (!advanceCursorMeshState(state, 1 / 60)) {
      frames++;
      expect(frames).toBeLessThan(60);
    }
    expect(state.presence).toBe(0);
    expect(state.rafId).toBe(-1);
  });

  it("não hiberna enquanto o mouse está na janela", () => {
    const state = createInitialCursorState();
    Object.assign(state, { targetPresence: 1 });
    for (let i = 0; i < 300; i++) expect(advanceCursorMeshState(state, 1 / 60)).toBe(false);
    expect(state.presence).toBeGreaterThan(0.99);
  });
});

describe("cursor com caneta e ponto de clique (CR-01)", () => {
  it.each([
    ["mouse", true],
    ["pen", true],
    ["touch", false],
    ["", false],
    [null, false],
    [undefined, false],
  ])("ponteiro %s vale %s", (type, expected) => {
    expect(isValidCursorPointerType(type)).toBe(expected);
  });

  it("o ponto central nunca some enquanto o cursor existe", () => {
    expect(computeCentralDotAlpha(0)).toBe(0);
    expect(computeCentralDotAlpha(0.05)).toBe(0.7);
    expect(computeCentralDotAlpha(0.9)).toBe(0.9);
    expect(computeCentralDotAlpha(1)).toBe(1);
  });
});

describe("nitidez ao trocar de tela (CR-06)", () => {
  it.each([
    [1, 1, 88],
    [1.5, 1.5, 132],
    [2, 2, 176],
    [3, 2, 176],
    [0.5, 1, 88],
    [0, 1, 88],
    [Number.NaN, 1, 88],
  ])("dpr %s vira %s, canvas de %spx", (raw, dpr, physicalSize) => {
    expect(computeCursorDprMetrics(raw)).toEqual({ dpr, physicalSize });
  });
});
