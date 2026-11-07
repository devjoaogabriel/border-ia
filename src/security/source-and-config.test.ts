import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const sources = (readdirSync(join(ROOT, "src"), { recursive: true }) as string[])
  .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => ({ file: join("src", f), text: readFileSync(join(ROOT, "src", f), "utf8") }));

const FORBIDDEN: [string, RegExp][] = [
  ["dangerouslySetInnerHTML", /dangerouslySetInnerHTML/],
  ["innerHTML", /\.innerHTML\b/],
  ["outerHTML", /\.outerHTML\b/],
  ["eval", /\beval\s*\(/],
  ["new Function", /new\s+Function\s*\(/],
  ["document.write", /document\.write\s*\(/],
  // A landing é estática: nenhuma variável de ambiente deve chegar ao bundle do cliente.
  ["process.env", /process\.env/],
  // Montado pelo código numérico (U+2014) para o próprio arquivo não conter o caractere.
  ["travessão", new RegExp(String.fromCharCode(0x2014))],
];

describe("código-fonte", () => {
  it("encontra os arquivos de src", () => {
    expect(sources.length).toBeGreaterThan(20);
  });

  it.each(FORBIDDEN)("não usa %s", (_name, pattern) => {
    expect(sources.filter((s) => pattern.test(s.text)).map((s) => s.file)).toEqual([]);
  });

  it("todo target _blank vem acompanhado de noopener noreferrer", () => {
    const blank = sources.filter((s) => /target(=|:\s*)["']_blank["']/.test(s.text));
    expect(blank.map((s) => s.file)).toEqual([join("src", "lib", "links.ts")]);
    for (const s of blank) expect(s.text).toContain("noopener noreferrer");
  });
});

describe("configuração", () => {
  it("mantém os arquivos .env fora do git", () => {
    expect(readFileSync(join(ROOT, ".gitignore"), "utf8")).toMatch(/^\.env\*$/m);
  });

  it("não libera SVG no otimizador de imagens do Next", () => {
    expect(readFileSync(join(ROOT, "next.config.ts"), "utf8")).not.toMatch(/dangerouslyAllowSVG\s*:\s*true/);
  });
});

describe("CSS e layout (CR-04 e CR-11)", () => {
  const css = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");

  it("o Tailwind só procura classes dentro de src", () => {
    expect(css).toMatch(/@import "tailwindcss" source\("\.\."\);/);
  });

  it("nenhum comentário do CSS tem classe arbitrária entre colchetes", () => {
    const comments = css.match(/\/\*[\s\S]*?\*\//g) ?? [];
    expect(comments.filter((c) => /\[[^\]]*:[^\]]*\]/.test(c))).toEqual([]);
  });

  it("a transição da btn-shine não é anulada por utilitário", () => {
    expect(css).toMatch(/\.btn-shine\s*\{[^}]*transition-duration:\s*300ms/);
    const buttons = ["src/components/ui/CtaButton.tsx", "src/components/ui/MagicCopyCard.tsx"].map((f) =>
      readFileSync(join(ROOT, f), "utf8"),
    );
    for (const b of buttons) expect(b).not.toMatch(/btn-shine[^"`]*\btransition\b/);
  });

  it("o título dos recursos pode quebrar linha entre 1024 e 1279px", () => {
    const features = readFileSync(join(ROOT, "src/components/sections/FeaturesSection.tsx"), "utf8");
    expect(features).not.toMatch(/\blg:whitespace-nowrap\b/);
  });
});

describe("cabeçalhos e dependências (NV-01, SA-INFO-01, SE-04)", () => {
  const config = readFileSync(join(ROOT, "next.config.ts"), "utf8");

  it("não anuncia o Next no X-Powered-By", () => {
    expect(config).toMatch(/poweredByHeader:\s*false/);
  });

  it.each([
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Content-Security-Policy",
  ])("envia %s em todas as rotas", (header) => {
    expect(config).toMatch(/async headers\(\)/);
    expect(config).toContain(`"${header}"`);
  });

  it("só libera eval na CSP em desenvolvimento", () => {
    expect(config).toMatch(/isDev\s*\?\s*" 'unsafe-eval'"/);
  });

  it("mantém eslint 9+ e eslint-config-next 16+ (npm audit fix --force rebaixaria)", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    expect(Number(String(pkg.devDependencies["eslint-config-next"]).match(/\d+/)?.[0])).toBeGreaterThanOrEqual(16);
    expect(Number(String(pkg.devDependencies.eslint).match(/\d+/)?.[0])).toBeGreaterThanOrEqual(9);
  });
});

describe("acessibilidade e GPU (CR-09, CR-12, CR-13)", () => {
  const src = (f: string) => readFileSync(join(ROOT, f), "utf8");

  it("tem link para pular ao conteúdo no topo da página", () => {
    expect(src("src/components/ui/SkipToContent.tsx")).toContain('href="#conteudo-principal"');
    expect(src("src/app/page.tsx")).toMatch(/<SkipToContent \/>/);
  });

  it("o id do título do hero fica no h1", () => {
    expect(src("src/components/ui/animated-shiny-text.tsx")).toMatch(/<motion\.h1[\s\S]{0,40}id=\{headingId\}/);
    expect(src("src/components/sections/HeroSection.tsx")).toMatch(/headingId="hero-heading"/);
  });

  it("o shader não fixa a altura do canvas", () => {
    expect(src("src/components/three/HeroBeamCanvas.tsx")).not.toMatch(/278\.5|218\.5/);
  });

  it("o logo 3D libera a geometria e escuta o ponteiro em modo passivo", () => {
    const logo = src("src/components/three/PluginPrismLogo3D.tsx");
    expect(logo).toMatch(/back\.dispose\(\)/);
    expect(logo).toMatch(/front\.dispose\(\)/);
    expect(logo).toMatch(/addEventListener\("pointermove", onMove, \{ passive: true \}\)/);
    expect(logo).toMatch(/sanitizeSvgPathD\(/);
  });

  it("o giro do botão para com foco de teclado parado", () => {
    expect(src("src/app/globals.css")).toMatch(/\.btn-shine:focus-visible:not\(:hover\)::before/);
  });
});
