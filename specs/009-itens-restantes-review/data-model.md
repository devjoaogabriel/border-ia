# Data Model e Mapa de Extracao: Itens Restantes do Review (`009-itens-restantes-review`)

**Feature**: `009-itens-restantes-review`
**Date**: 2026-11-07

---

## 1. Funcoes Puras e Helpers de Seguranca a Extrair/Testar

### 1.1 Sanitizador de Caminhos SVG (`src/lib/svg-path-sanitizer.ts`)

```typescript
const SVG_PATH_D_REGEX = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;

/**
 * Valida se uma string de caminho vetorial contem apenas comandos permitidos.
 * Lanca erro caso encontre caracteres de injecao (como "<" ou ">").
 */
export function sanitizeSvgPathD(d: string): string {
  const trimmed = d.trim();
  if (!trimmed || !SVG_PATH_D_REGEX.test(trimmed)) {
    throw new Error(`Invalid or unsafe SVG path d attribute: "${d.slice(0, 30)}..."`);
  }
  return trimmed;
}
```

### 1.2 Geometria Dinamica do Shader (`src/lib/hero-beam-math.ts`)

```typescript
export interface ShaderVerticalMaskConfig {
  halfH: number;
  centerY: number;
}

/**
 * Deriva os parametros de centro e raio da mascara vertical do shader em funcao da altura total.
 * Mantem 100% de compatibilidade com uSize.y = 525 (halfH = 218.5, centerY = 278.5).
 */
export function deriveShaderVerticalMask(height: number): ShaderVerticalMaskConfig {
  const halfH = (height - 88.0) * 0.5;
  const centerY = 60.0 + halfH;
  return { halfH, centerY };
}

/**
 * Restaura o singleton heroCardMotion para o estado neutro de repouso.
 */
export function resetHeroCardMotion(): void {
  heroCardMotion.rotationX = 0;
  heroCardMotion.rotationY = 0;
  heroCardMotion.rotation = 0;
  heroCardMotion.bendX = 0;
  heroCardMotion.tipX = 0;
  heroCardMotion.tipY = BEAM_GEOMETRY.BEAM_REST_TIP;
}
```

### 1.3 Recalculo de Densidade de Pixels do Cursor (`src/lib/cursor-mesh-math.ts`)

```typescript
export interface CursorCanvasDprMetrics {
  dpr: number;
  physicalSize: number;
}

/**
 * Calcula as dimensoes fisicas em pixels do canvas para uma dada densidade de tela.
 * Grampeia o dpr entre 1 e 2 para evitar estouro de VRAM em telas 4K.
 */
export function computeCursorDprMetrics(rawDpr: number): CursorCanvasDprMetrics {
  const dpr = Math.min(Math.max(rawDpr || 1, 1), 2);
  const physicalSize = Math.round(C.PATCH * dpr);
  return { dpr, physicalSize };
}
```

---

## 2. Mapa de Arquivos Afetados

| Arquivo | Tipo | Natureza da Alteracao |
|---|---|---|
| `next.config.ts` | Configuracao | Adiciona `poweredByHeader: false` e cabecalhos de seguranca via `headers()` |
| `src/lib/svg-path-sanitizer.ts` | Modulo puro | Helper de validacao regex de caminhos SVG (SE-03) |
| `src/lib/svg-path-sanitizer.test.ts` | Teste Vitest | Cobertura TDD para caminhos validos e rejeicao de injecoes |
| `src/lib/hero-beam-math.ts` | Modulo puro | Adiciona `deriveShaderVerticalMask` e `resetHeroCardMotion` |
| `src/lib/hero-beam-math.test.ts` | Teste Vitest | Cobertura TDD para derivacao da mascara e reset do singleton |
| `src/lib/cursor-mesh-math.ts` | Modulo puro | Adiciona `computeCursorDprMetrics` |
| `src/lib/cursor-mesh-math.test.ts` | Teste Vitest | Cobertura TDD para recalculo de dpr |
| `src/security/source-and-config.test.ts` | Teste Vitest | Valida cabecalhos de `next.config.ts` e trava de versoes do ESLint |
| `src/components/motion/CursorDotMesh.tsx` | Componente | Listener de resize para atualizar resolucao do canvas com mudanca de dpr (CR-06) |
| `src/components/three/PluginPrismLogo3D.tsx` | Componente | Sanitiza `d`, invoca `dispose()` em geometrias e torna `pointermove` passivo (CR-09, SE-03) |
| `src/components/three/HeroBeamCanvas.tsx` | Componente | Usa derivacao dinamica de mascara no GLSL e sincroniza uniforms pos-mount (CR-12) |
| `src/components/ui/MagicCopyCard.tsx` | Componente | Cache de retangulo e uso de `gsap.quickTo` no hover (CR-08) |
| `src/components/ui/animated-shiny-text.tsx` | Componente | Aplica `id="hero-heading"` na tag `<h1>` interna em vez da `<div>` (CR-13) |
| `src/components/sections/BannerSection.tsx` | Componente | Avalia adocao de `DotMatrixDecor variant="css"` mantendo equivalencia visual (CR-13) |
| `src/components/ui/SkipToContent.tsx` | Componente | Link acessivel para pular para `#conteudo-principal` (CR-13) |
| `src/app/layout.tsx` ou `page.tsx` | Pagina | Renderiza `SkipToContent` no inicio do body (CR-13) |
| `src/app/globals.css` | Estilos | Ajusta `:focus-visible:not(:hover)` em `.btn-shine` contra repaint continuo (CR-13) |
| `public/icons/stroke-scribble.svg` | Asset | Remocao de arquivo orfao (CR-13) |

---

## 3. Matriz de Cobertura de Testes

| Item do Handoff 10 | Teste Unitario Vitest | Validacao em Navegador / Deploy |
|---|---|---|
| **NV-01 / SA-INFO-01 (Headers e PoweredBy)** | `src/security/source-and-config.test.ts` (verifica `next.config.ts`) | Inspecao de cabecalhos de resposta em servidor de producao |
| **SE-03 (Sanitizacao de SVG d)** | `src/lib/svg-path-sanitizer.test.ts` (caminhos validos vs payloads) | Renderizacao do prisma 3D no Desktop |
| **SE-04 (Trava de ESLint)** | `src/security/source-and-config.test.ts` (valida versoes do package.json) | Auditoria do arquivo `package.json` |
| **CR-06 (Dpr dinamico do cursor)** | `src/lib/cursor-mesh-math.test.ts` (`computeCursorDprMetrics`) | Teste em monitor Retina e zoom de navegador |
| **CR-07 (Reset do singleton)** | `src/lib/hero-beam-math.test.ts` (`resetHeroCardMotion`) | Verificacao de ordem de atualizacao no `gsap.ticker` |
| **CR-08 (QuickTo e cache de box)** | `src/lib/card-tilt-math.test.ts` | Teste manual de fluidez do hover no card sem alocacao |
| **CR-09 (Dispose de ExtrudeGeometry)** | Inspecao de codigo e ciclo de vida | Monitoramento de VRAM no desmonte do canvas 3D |
| **CR-12 (Parametrizacao do shader)** | `src/lib/hero-beam-math.test.ts` (`deriveShaderVerticalMask`) | Renderizacao do shader em diferentes alturas |
| **CR-13 (Acessibilidade e assets)** | Testes estaticos e de integridade de SVGs | Navegacao por teclado Tab e inspecao visual do banner |
