# Contratos de Codigo e Invariantes: Correcoes do Code Review (`008-correcoes-review`)

**Feature**: `008-correcoes-review`
**Date**: 2026-11-07

---

## 1. Contratos TypeScript Exatos

### 1.1 `src/lib/cursor-mesh-math.ts`

```typescript
/**
 * Valida se o ponteiro informado deve receber o espectro pontilhado customizado.
 * Aceita estritamente "mouse" e "pen".
 * Rejeita "touch", strings vazias, valores nulos ou indefinidos.
 */
export function isValidCursorPointerType(pointerType: string | undefined | null): boolean;

/**
 * Calcula o nivel de opacidade do ponto central (linha 11, coluna 11) do cursor.
 * - Se presence <= 0: retorna 0 (oculto).
 * - Se presence > 0: garante piso minimo de 0.70 ate o teto de 1.0, impedindo
 *   que o dither Bayer apague o pixel de clique no ponto de contato.
 */
export function computeCentralDotAlpha(presence: number): number;
```

### 1.2 `src/lib/card-tilt-math.ts`

```typescript
export interface CardMotionPolicyInput {
  inViewport: boolean;
  isDesktop: boolean;
  reduceMotion: boolean;
}

/**
 * Regra para animacoes continuas do card (giro do arco e pulso luminoso).
 * Retorna true exclusivamente quando o card esta visivel na tela E o usuario
 * nao tem preferencia por movimento reduzido.
 */
export function shouldRunCardContinuousMotion(input: CardMotionPolicyInput): boolean;

/**
 * Regra para adicao da sincronizacao de movimento no gsap.ticker.
 * Retorna true exclusivamente quando o card esta visivel, em resolucao Desktop
 * (onde o HeroBeam existe) E sem reducao de movimento.
 */
export function shouldSyncHeroTicker(input: CardMotionPolicyInput): boolean;
```

### 1.3 `src/lib/prism-logo-policy.ts`

```typescript
export interface PrismLogoPolicyInput {
  isDesktop: boolean;
  reduceMotion: boolean;
}

/**
 * Regra para carregamento do modulo 3D e renderizacao do canvas Three.js do logotipo.
 * Retorna true apenas em Desktop (>= 1024px) e sem reducao de movimento.
 */
export function shouldLoadPrismLogo3D(input: PrismLogoPolicyInput): boolean;
```

---

## 2. Invariantes Estruturais e Guardas de Seguranca / CSS

### 2.1 CSS do Tailwind v4 (`src/app/globals.css`)
- **Invariante CSS-01**: O arquivo `globals.css` DEVE conter explicitamente a diretiva `@source "../src";` ou `@import "tailwindcss" source("../src");`, restringindo o escopo de varredura de seletores ao codigo da aplicacao.
- **Invariante CSS-02**: O CSS final compilado NAO DEVE conter seletores `.mix-blend-screen`, `.cursor-grab` ou variantes originadas de comentarios com colchetes.
- **Invariante CSS-03**: A classe `.btn-shine` DEVE manter `transition-property: opacity, border-color, box-shadow;` e `transition-duration: 300ms;` explicitas sem ser sobrescrita por utilitarios genericos.

### 2.2 Integridade de Layout (`src/components/sections/FeaturesSection.tsx`)
- **Invariante LAYOUT-01**: O titulo "Amplificador de imagem" NAO DEVE possuir a classe `lg:whitespace-nowrap`. Em resolucoes `lg` (1024px a 1279px), o texto deve poder quebrar linha normalmente para respeitar a largura da coluna de 220px.

### 2.3 Resiliencia WebGL (`src/components/three/HeroBeamLazy.tsx`)
- **Invariante WEBGL-01**: `canvasReady` DEVE voltar imediatamente para `false` quando a condicao de conexao Desktop (`connected`) se tornar falsa.
- **Invariante WEBGL-02**: Ao receber o evento DOM `webglcontextlost`, o canvas DEVE invocar `preventDefault()` e emitir callback de reset para restaurar a visibilidade do fallback SVG.

---

## 3. Regras de Portao `verification-before-completion`

Para declarar a feature 008 pronta:
1. **Vitest**: `npm.cmd test` DEVE passar com 100% de sucesso (>= 100 testes, 0 falhas).
2. **Lint**: `npm.cmd run lint` DEVE concluir com saida limpa (exit 0).
3. **Build**: `npm.cmd run build` DEVE compilar o Next.js com sucesso (exit 0).
4. **Lighthouse**: Execucao comparativa de 3 rodadas Mobile e 3 Desktop com `lighthouse@12.8.2`, comprovando a reducao da mediana de TBT Mobile.
5. **Travessoes**: Zero ocorrencias de `U+2014` em todo o repositorio.
