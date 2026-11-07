import { describe, expect, it } from "vitest";
import { CARD_TILT_CONFIG as T, computeCardHoverAngles } from "@/lib/card-tilt-math";

describe("inclinação do card no hover", () => {
  it("fica reto com o mouse no centro", () => {
    const a = computeCardHoverAngles(0, 0, false);
    expect(a.rotationX).toBeCloseTo(0, 9);
    expect(a.rotationY).toBeCloseTo(0, 9);
  });

  it("satura com tanh e nunca passa dos tetos de 10 e 12 graus", () => {
    const edge = computeCardHoverAngles(1, 1, false);
    expect(edge.rotationY).toBeCloseTo(Math.tanh(1.15) * T.hoverMaxRotateY, 9);
    for (const n of [1, 3, 50]) {
      const a = computeCardHoverAngles(n, -n, false);
      expect(Math.abs(a.rotationY)).toBeLessThanOrEqual(T.hoverMaxRotateY);
      expect(Math.abs(a.rotationX)).toBeLessThanOrEqual(T.hoverMaxRotateX);
    }
  });

  it("inclina para o lado do mouse e espelha nos dois eixos", () => {
    const a = computeCardHoverAngles(0.6, 0.4, false);
    const b = computeCardHoverAngles(-0.6, -0.4, false);
    expect(a.rotationY).toBeGreaterThan(0);
    // Mouse embaixo inclina a borda de baixo para trás: rotationX negativo.
    expect(a.rotationX).toBeLessThan(0);
    expect(b.rotationY).toBeCloseTo(-a.rotationY, 9);
    expect(b.rotationX).toBeCloseTo(-a.rotationX, 9);
  });

  it("amortece a 35% sobre o botão para não fugir do clique", () => {
    const free = computeCardHoverAngles(0.8, -0.5, false);
    const cta = computeCardHoverAngles(0.8, -0.5, true);
    expect(T.hoverCtaDamping).toBe(0.35);
    expect(cta.rotationY).toBeCloseTo(free.rotationY * 0.35, 9);
    expect(cta.rotationX).toBeCloseTo(free.rotationX * 0.35, 9);
  });
});
