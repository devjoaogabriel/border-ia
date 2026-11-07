import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURE_ITEMS } from "@/lib/constants";
import { buildMaskStyle } from "@/lib/mask-style";

describe("estilo de máscara do ícone", () => {
  it("gera a máscara com a URL entre aspas e o tamanho pedido", () => {
    expect(buildMaskStyle("/icons/figma-mark.svg")).toEqual({
      width: 24,
      height: 24,
      mask: 'url("/icons/figma-mark.svg") center / contain no-repeat',
    });
    expect(buildMaskStyle("/icons/feature-text-gen.svg", 32)).toMatchObject({ width: 32, height: 32 });
  });

  it.each([
    "../secrets.svg",
    "/icons/../../etc/passwd.svg",
    '/icons/x.svg") center; background: url("//evil.example',
    "/icons/x.svg);background:url(//evil.example)",
    "https://evil.example/x.svg",
    "/icons/a b.svg",
    "/images/hero-figma-ui.svg",
    "/icons/x.png",
  ])("recusa o caminho %s", (src) => {
    expect(() => buildMaskStyle(src)).toThrow();
  });

  it.each([0, -4, Number.NaN, Number.POSITIVE_INFINITY])("recusa tamanho %s", (size) => {
    expect(() => buildMaskStyle("/icons/figma-mark.svg", size)).toThrow();
  });

  it("aceita todos os ícones usados no site, e eles existem em public", () => {
    const used = new Set(FEATURE_ITEMS.map((f) => f.iconPath));
    for (const file of [
      "src/components/sections/HeroSection.tsx",
      "src/components/sections/BannerSection.tsx",
      "src/components/ui/MagicCopyCard.tsx",
    ]) {
      const source = readFileSync(join(process.cwd(), file), "utf8");
      for (const [, path] of source.matchAll(/(?:icon|src)="(\/icons\/[^"]+)"/g)) used.add(path);
    }
    expect(used.size).toBeGreaterThanOrEqual(5);
    for (const path of used) {
      expect(() => buildMaskStyle(path)).not.toThrow();
      expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
    }
  });
});
