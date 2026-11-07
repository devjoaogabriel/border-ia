# Data Model e Mapa de Extracao: Correcoes do Code Review (`008-correcoes-review`)

**Feature**: `008-correcoes-review`
**Date**: 2026-11-07

---

## 1. Funcoes Puras e Regras de Negocio a Extrair/Testar

Para manter a conformidade rigorosa com `test-driven-development` em ambiente `node` nativo do Vitest (sem dependencias extras de DOM), as regras de decisao, validacao de ponteiro e politicas de carregamento sao encapsuladas em modulos puros de TypeScript em `src/lib/`:

### 1.1 Politica de Carregamento 3D do Icone (`src/lib/prism-logo-policy.ts` ou colocalizada)

```typescript
export interface PrismLogoPolicyInput {
  isDesktop: boolean;
  reduceMotion: boolean;
}

export function shouldLoadPrismLogo3D(input: PrismLogoPolicyInput): boolean {
  return input.isDesktop && !input.reduceMotion;
}
```

### 1.2 Politica de Ativacao do Cursor e Alfa Central (`src/lib/cursor-mesh-math.ts`)

```typescript
/**
 * Determina se o tipo de ponteiro e elegivel para ativar a malha interativa.
 * Aceita "mouse" e "pen". Rejeita "touch" ou valores vazios/desconhecidos.
 */
export function isValidCursorPointerType(pointerType: string | undefined): boolean {
  return pointerType === "mouse" || pointerType === "pen";
}

/**
 * Garante piso de opacidade para a celula central (11, 11) no clique.
 * Retorna alfa >= 0.7 quando presence > 0, evitando apagamento pelo dither Bayer.
 */
export function computeCentralDotAlpha(presence: number): number {
  if (presence <= 0) return 0;
  return Math.min(1.0, Math.max(0.7, presence));
}
```

### 1.3 Politica de Animacao e Tickers do Card (`src/lib/card-tilt-math.ts`)

```typescript
export interface CardMotionPolicyInput {
  inViewport: boolean;
  isDesktop: boolean;
  reduceMotion: boolean;
}

/**
 * Determina se loops continuos do card (arco e pulso) devem rodar.
 */
export function shouldRunCardContinuousMotion(input: CardMotionPolicyInput): boolean {
  return input.inViewport && !input.reduceMotion;
}

/**
 * Determina se a sincronizacao com HeroBeam via gsap.ticker deve ser registrada.
 */
export function shouldSyncHeroTicker(input: CardMotionPolicyInput): boolean {
  return input.inViewport && input.isDesktop && !input.reduceMotion;
}
```

---

## 2. Mapa de Arquivos Afetados

| Arquivo | Tipo | Natureza da Alteracao |
|---|---|---|
| `src/lib/cursor-mesh-math.ts` | Modulo puro | Adiciona `isValidCursorPointerType` e `computeCentralDotAlpha` |
| `src/lib/cursor-mesh-math.test.ts` | Teste Vitest | Cobertura TDD para aceitacao de `pen` e alfa minimo central |
| `src/lib/card-tilt-math.ts` | Modulo puro | Adiciona `shouldRunCardContinuousMotion` e `shouldSyncHeroTicker` |
| `src/lib/card-tilt-math.test.ts` | Teste Vitest | Cobertura TDD para as condicoes de parada e execucao do ticker |
| `src/lib/scalability-budget.test.ts` | Teste Vitest | Valida ausencia de `lg:whitespace-nowrap` e fonte restrita do Tailwind |
| `src/security/source-and-config.test.ts` | Teste Vitest | Valida que `PluginPrismLogoLazy` so monta em Desktop e ausencia de classes mortas no CSS |
| `src/hooks/useMotionEnvironment.ts` | Hook | Estabiliza `subscribe` e `getSnapshot` com cache por query (CR-10) |
| `src/components/motion/CursorDotMesh.tsx` | Componente | Ativacao tardia de `.cursor-mesh`, suporte a `pen`, `pointerdown` e central aceso |
| `src/components/three/PluginPrismLogoLazy.tsx` | Componente | Condiciona carregamento 3D a `isDesktop && !reduceMotion` (CR-02) |
| `src/components/three/HeroBeamLazy.tsx` | Componente | Reseta `canvasReady = false` quando `!connected` e escuta `webglcontextlost` (CR-03) |
| `src/components/sections/FeaturesSection.tsx` | Componente | Substitui `lg:whitespace-nowrap` por `xl:whitespace-nowrap` (CR-04) |
| `src/components/ui/MagicCopyCard.tsx` | Componente | Pausa `spinRef`, `beamPulse` e desliga ticker fora da viewport (CR-05) |
| `src/components/motion/SmoothScrollProvider.tsx` | Componente | Condiciona ticker do Lenis a `!reduceMotion` (CR-05) |
| `src/app/globals.css` | Estilos globais | Restringe escaneamento do Tailwind a `src/`, limpa comentarios e fixa `.btn-shine` (CR-11) |

---

## 3. Matriz de Cobertura de Testes

| Item do Handoff 09 | Teste Unitario Vitest (Antes de Codificar) | Validacao em Navegador / Build |
|---|---|---|
| **CR-01 (Cursor e caneta)** | `src/lib/cursor-mesh-math.test.ts` (`isValidCursorPointerType`, `computeCentralDotAlpha`) | Teste manual com stylus e navegadores Chromium / WebKit |
| **CR-02 (PrismLogo no Mobile)** | `src/security/source-and-config.test.ts` (verifica `isDesktop` no lazy loader) | Inspecao de rede no Lighthouse Mobile (0 chunks de Three.js) |
| **CR-03 (Resiliencia WebGL)** | `src/security/source-and-config.test.ts` (valida listeners de `webglcontextlost` e reset) | Inspecao de redimensionamento e perda de contexto GPU |
| **CR-04 (Colisao em Recursos)** | `src/lib/scalability-budget.test.ts` (valida ausencia de `lg:whitespace-nowrap`) | Inspecao visual em viewport de 1024px a 1260px |
| **CR-05 (Ticker e loops fora da tela)** | `src/lib/card-tilt-math.test.ts` (`shouldRunCardContinuousMotion`, `shouldSyncHeroTicker`) | Monitoramento de CPU / timeline GSAP ao rolar a pagina |
| **CR-11 (Higiene Tailwind e btn-shine)** | `src/lib/scalability-budget.test.ts` (valida `@source` e ausencia de classes mortas) | Analise do arquivo `.next/static/chunks/*.css` |
| **TBT Mobile (Investigacao + CR-10)** | Testes de estabilidade do snapshot e bundle | Lighthouse Mobile com mediana de 3 rodadas antes e depois |
