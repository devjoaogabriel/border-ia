import { describe, expect, it } from "vitest";
import {
  BEAM_GEOMETRY as G,
  BEAM_REST_PATH,
  beamPath,
  projectBeamContact,
  stepBeamSpring,
} from "@/lib/hero-beam-math";

describe("geometria do feixe", () => {
  it("deriva as medidas umas das outras", () => {
    expect(G.BEAM_HEIGHT).toBe(G.BEAM_VISIBLE_HEIGHT + G.BEAM_OVERLAP);
    expect(G.BEAM_REST_TIP).toBe(G.BEAM_VISIBLE_HEIGHT + G.BEAM_TUCK);
    expect(G.BEAM_CENTER).toBe(G.BEAM_WIDTH / 2);
    expect(G.CANVAS_WIDTH).toBe(G.MESH_HALF_WIDTH * 2 + 10);
    // 13 células de 19px: os pontos ficam simétricos em relação ao fio.
    expect(G.MESH_HALF_WIDTH).toBe(13 * 19);
  });

  it("monta o path a partir do topo fixo do fio", () => {
    expect(BEAM_REST_PATH).toBe(beamPath(0, 0, G.BEAM_REST_TIP));
    expect(BEAM_REST_PATH).toBe("M 170 0 C 170 170.33, 170.00 340.67, 170.00 511.00");
    expect(beamPath(12.5, -4, 400)).toBe("M 170 0 C 170 133.33, 182.50 266.67, 166.00 400.00");
  });
});

describe("projeção da ponta da corda no card", () => {
  it("fica no ponto de repouso com o card reto", () => {
    const rest = projectBeamContact({ rotationX: 0, rotationY: 0, rotation: 0 });
    expect(rest.tipX).toBeCloseTo(0, 6);
    expect(rest.tipY).toBeCloseTo(G.BEAM_REST_TIP, 6);
    expect(rest.targetBendX).toBeCloseTo(0, 6);
  });

  it("curva o fio para o lado em que o card gira", () => {
    const right = projectBeamContact({ rotationX: 0, rotationY: 10, rotation: 0 });
    const left = projectBeamContact({ rotationX: 0, rotationY: -10, rotation: 0 });
    expect(right.targetBendX).toBeGreaterThan(0);
    expect(left.targetBendX).toBeLessThan(0);
    // A perspectiva desloca o ponto de contato, então os dois lados não são espelho exato.
    expect(Math.abs(right.targetBendX + left.targetBendX)).toBeLessThan(2);
  });

  it("limita ângulos absurdos a 1 radiano", () => {
    const huge = projectBeamContact({ rotationX: 400, rotationY: -900, rotation: 720 });
    const capped = projectBeamContact({
      rotationX: 180 / Math.PI,
      rotationY: -180 / Math.PI,
      rotation: 180 / Math.PI,
    });
    expect(huge.tipX).toBeCloseTo(capped.tipX, 9);
    expect(huge.tipY).toBeCloseTo(capped.tipY, 9);
    expect(huge.targetBendX).toBeCloseTo(capped.targetBendX, 9);
  });
});

describe("mola do meio do fio", () => {
  const run = (dt: number, steps: number, target = 30) => {
    let s = { bendX: 0, velocity: 0 };
    let peak = 0;
    for (let i = 0; i < steps; i++) {
      s = stepBeamSpring(s.bendX, s.velocity, target, dt);
      peak = Math.max(peak, Math.abs(s.bendX));
    }
    return { ...s, peak };
  };

  it("assenta no alvo a 60 Hz com pouco overshoot", () => {
    const end = run(1 / 60, 600);
    expect(end.bendX).toBeCloseTo(30, 2);
    expect(Math.abs(end.velocity)).toBeLessThan(0.01);
    expect(end.peak).toBeLessThan(30 * 1.15);
  });

  it("segue estável no passo máximo de 0.05s", () => {
    const end = run(0.05, 400);
    expect(Number.isFinite(end.bendX)).toBe(true);
    expect(end.bendX).toBeCloseTo(30, 2);
    expect(end.peak).toBeLessThan(30 * 2);
  });

  it("limita o passo a 0.05s e ignora passo negativo", () => {
    expect(stepBeamSpring(0, 0, 30, 9)).toEqual(stepBeamSpring(0, 0, 30, 0.05));
    expect(stepBeamSpring(4, 2, 30, -1)).toEqual({ bendX: 4, velocity: 2 });
  });
});
