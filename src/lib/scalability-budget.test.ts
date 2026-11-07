import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURE_ITEMS, SOCIAL_PROOF_AVATARS } from "@/lib/constants";
import { CURSOR_MESH_CONSTANTS as CURSOR } from "@/lib/cursor-mesh-math";
import { BEAM_GEOMETRY as G } from "@/lib/hero-beam-math";

const ROOT = process.cwd();
const read = (file: string) => readFileSync(join(ROOT, file), "utf8");
const maxDpr = (file: string) => {
  const match = read(file).match(/dpr=\{\[\s*1\s*,\s*([\d.]+)\s*\]\}/);
  if (!match) throw new Error(`dpr sem teto em ${file}`);
  return Number(match[1]);
};

describe("custo de render independe do tamanho da tela", () => {
  it("o shader do hero tem teto fixo de fragmentos, inclusive em 4K", () => {
    const dpr = maxDpr("src/components/three/HeroBeamCanvas.tsx");
    expect(dpr).toBeLessThanOrEqual(2);
    expect(G.CANVAS_WIDTH * G.BEAM_HEIGHT * dpr ** 2).toBe(1_058_400);
  });

  it("o cursor desenha sempre 484 células num canvas de no máximo 176px", () => {
    expect((CURSOR.PATCH / CURSOR.STEP) ** 2).toBe(484);
    expect(CURSOR.PATCH * 2).toBeLessThanOrEqual(176);
  });

  // Centro do fio medido no Playwright (Chromium e WebKit) em cada largura do Desktop.
  it.each([
    [1024, 727],
    [1280, 885],
    [1440, 965],
    [1920, 1205],
  ])("em %ipx o canvas do hero não passa da borda da tela", (viewport, beamCenter) => {
    expect(beamCenter + G.CANVAS_WIDTH / 2).toBeLessThanOrEqual(viewport);
  });
});

describe("brilho dos botões", () => {
  const css = read("src/app/globals.css");

  it("o ângulo animado não herda, então o repaint fica no botão", () => {
    expect(css).toMatch(/@property --shine-angle\s*\{[^}]*inherits:\s*false/);
  });

  it("o giro fica pausado em repouso e só roda no hover ou foco", () => {
    expect(css).toMatch(/animation:\s*shine-spin[^;]*\bpaused\b/);
    expect(css).toMatch(/\.btn-shine:is\(:hover, :focus-visible\)::before\s*\{[^}]*animation-play-state:\s*running/);
  });
});

describe("assets", () => {
  it("todo ícone e avatar referenciado existe em public", () => {
    const paths = [...FEATURE_ITEMS.map((f) => f.iconPath), ...SOCIAL_PROOF_AVATARS.map((a) => a.src)];
    for (const p of paths) expect(existsSync(join(ROOT, "public", p)), p).toBe(true);
  });

  it("nenhum arquivo de public passa de 300 KB e o total fica abaixo de 600 KB", () => {
    const files = (readdirSync(join(ROOT, "public"), { recursive: true }) as string[])
      .map((f) => join(ROOT, "public", f))
      .filter((f) => statSync(f).isFile());
    const sizes = files.map((f) => statSync(f).size);
    // O maior hoje é o dot-matrix.svg (254 KB), candidato a troca pela versão CSS (CR-13).
    expect(Math.max(...sizes)).toBeLessThanOrEqual(300 * 1024);
    expect(sizes.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(600 * 1024);
  });
});
