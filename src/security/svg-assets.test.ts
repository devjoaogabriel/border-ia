import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// SVG servido de public/ roda script se for aberto direto na aba. Nenhum asset pode ter conteúdo ativo.
const UNSAFE_SVG_RULES: [string, RegExp][] = [
  ["<script>", /<script\b/i],
  ["<foreignObject>", /<foreignObject\b/i],
  ["iframe, embed ou object", /<(iframe|embed|object)\b/i],
  ["atributo on*", /\son[a-z]+\s*=/i],
  ["javascript: em atributo", /=\s*["']\s*javascript:/i],
  // O namespace do SVG é a única URL externa permitida.
  ["URL externa", /https?:\/\/(?!www\.w3\.org\/)/i],
];

function findUnsafeSvgMarkup(markup: string): string[] {
  return UNSAFE_SVG_RULES.filter(([, rule]) => rule.test(markup)).map(([name]) => name);
}

const ROOT = process.cwd();
const svgFiles = ["public", "src/app"].flatMap((dir) =>
  (readdirSync(join(ROOT, dir), { recursive: true }) as string[])
    .filter((f) => f.endsWith(".svg"))
    .map((f) => join(dir, f)),
);

describe("validador de SVG", () => {
  it.each([
    ['<svg><script>alert(1)</script></svg>', "<script>"],
    ['<svg><foreignObject><div/></foreignObject></svg>', "<foreignObject>"],
    ['<svg onload="alert(1)"></svg>', "atributo on*"],
    ['<svg><a href="javascript:alert(1)"/></svg>', "javascript: em atributo"],
    ['<svg><image href="https://evil.example/x.png"/></svg>', "URL externa"],
  ])("pega %s", (markup, rule) => {
    expect(findUnsafeSvgMarkup(markup)).toContain(rule);
  });

  it("aceita um SVG comum com o namespace do W3C", () => {
    expect(findUnsafeSvgMarkup('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1"/></svg>')).toEqual([]);
  });
});

describe("SVGs do repositório", () => {
  it("encontra os assets", () => {
    expect(svgFiles.length).toBeGreaterThanOrEqual(13);
  });

  it.each(svgFiles)("%s não tem conteúdo ativo", (file) => {
    expect(findUnsafeSvgMarkup(readFileSync(join(ROOT, file), "utf8"))).toEqual([]);
  });
});
