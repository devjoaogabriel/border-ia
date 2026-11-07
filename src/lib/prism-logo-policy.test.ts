import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { shouldLoadPrismLogo3D } from "@/lib/prism-logo-policy";

describe("logo 3D do card (CR-02)", () => {
  it.each([
    [true, false, true],
    [true, true, false],
    [false, false, false],
    [false, true, false],
  ])("isDesktop=%s reduceMotion=%s carrega 3D: %s", (isDesktop, reduceMotion, expected) => {
    expect(shouldLoadPrismLogo3D({ isDesktop, reduceMotion })).toBe(expected);
  });

  it("o componente usa a regra, então o celular não baixa o Three.js", () => {
    const source = readFileSync(join(process.cwd(), "src/components/three/PluginPrismLogoLazy.tsx"), "utf8");
    expect(source).toMatch(/shouldLoadPrismLogo3D\(/);
    expect(source).toMatch(/min-width: 1024px/);
  });
});
