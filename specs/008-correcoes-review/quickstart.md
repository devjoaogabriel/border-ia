# Guia de Execucao Rapida e TDD: Correcoes do Code Review (`008-correcoes-review`)

**Feature**: `008-correcoes-review`
**Date**: 2026-11-07

---

## 1. Ciclo de Implementacao TDD (Obrigatorio)

Para cumprir a regra de `test-driven-development`, cada correcao que envolve logica deve seguir o ciclo `RED -> GREEN -> REFACTOR`:

### Passo 1: CR-01 (Cursor e Caneta)
1. Abrir `src/lib/cursor-mesh-math.test.ts` e adicionar casos de teste para:
   - `isValidCursorPointerType("mouse") === true`
   - `isValidCursorPointerType("pen") === true`
   - `isValidCursorPointerType("touch") === false`
   - `computeCentralDotAlpha(1.0) >= 0.70`
2. Executar `npx vitest run src/lib/cursor-mesh-math.test.ts` e confirmar falha (RED).
3. Implementar as funcoes em `src/lib/cursor-mesh-math.ts` e rodar o teste ate passar (GREEN).
4. Conectar em `CursorDotMesh.tsx`: remover adicao no mount, adicionar listeners de `pointermove` e `pointerdown`, filtrar com `isValidCursorPointerType` e remover `.cursor-mesh` em `touch`.

### Passo 2: CR-05 (Ticker e Loops do Card)
1. Abrir `src/lib/card-tilt-math.test.ts` e adicionar casos de teste para:
   - `shouldRunCardContinuousMotion` (pausa quando fora da tela ou reduceMotion).
   - `shouldSyncHeroTicker` (pausa quando fora da tela, no Mobile ou reduceMotion).
2. Executar `npx vitest run src/lib/card-tilt-math.test.ts` e confirmar falha (RED).
3. Implementar as funcoes em `src/lib/card-tilt-math.ts` e verificar sucesso (GREEN).
4. Conectar em `MagicCopyCard.tsx` no ScrollTrigger e ticker, e em `SmoothScrollProvider.tsx`.

### Passo 3: CR-02 (Three.js no Mobile) e CR-10 (useMediaQuery)
1. Adicionar teste em `src/security/source-and-config.test.ts` validando que `PluginPrismLogoLazy` importa e checa `isDesktop` antes de carregar o componente 3D.
2. Executar teste e confirmar falha (RED).
3. Atualizar `PluginPrismLogoLazy.tsx` com `isDesktop && !reduceMotion` e renderizar `BorderIaMark` no Mobile.
4. Em `src/hooks/useMotionEnvironment.ts`, memoizar `subscribe` e `getSnapshot` com cache por query. Confirmar que todos os testes passam (GREEN).

### Passo 4: CR-04 (Colisao em Recursos) e CR-11 (Higiene Tailwind)
1. Adicionar assercoes em `src/lib/scalability-budget.test.ts`:
   - Checar que `FeaturesSection.tsx` nao contem `lg:whitespace-nowrap`.
   - Checar que `globals.css` restringe a fonte com `@source "../src"`.
   - Checar que o CSS compilado nao emite `.mix-blend-screen` nem `.cursor-grab`.
2. Executar teste e confirmar falha (RED).
3. Atualizar `FeaturesSection.tsx` para `xl:whitespace-nowrap` e `globals.css` com `@source "../src";`.
4. Limpar o comentario de `globals.css` e ajustar especificidade de `.btn-shine`. Rodar teste ate passar (GREEN).

### Passo 5: CR-03 (Resiliencia WebGL)
1. Atualizar `HeroBeamLazy.tsx` para resetar `setCanvasReady(false)` quando `!connected`.
2. Adicionar listener de `webglcontextlost` em `gl.domElement` no Canvas do Three.js.

---

## 2. Protocolo de Medicao do Lighthouse (Antes vs Depois)

Conforme exigido no Handoff 09:

1. **Estado Inicial ("Antes")**:
   - Compilar build de producao: `npm.cmd run build`.
   - Iniciar servidor de producao: `npx next start -p 3099`.
   - Executar 3 rodadas Mobile e 3 Desktop com `lighthouse@12.8.2`:
     ```powershell
     # Mobile (3 rodadas)
     npx lighthouse http://localhost:3099 --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --output=json --output-path=./lh-mobile-before-1.json --chrome-flags="--headless"
     # Desktop (3 rodadas)
     npx lighthouse http://localhost:3099 --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --output=json --output-path=./lh-desktop-before-1.json --chrome-flags="--headless"
     ```
   - Extrair a mediana de Performance, A11y, Best Practices, SEO, LCP, TBT e CLS.

2. **Estado Final ("Depois")**:
   - Recompilar build de producao com todas as correcoes aplicadas.
   - Repetir exatamente as mesmas 3 rodadas Mobile e 3 Desktop nas mesmas condicoes.
   - Registrar a tabela comparativa comprovando o ganho de TBT no Mobile.

---

## 3. Comandos de Validacao do Portao

```powershell
# 1. Executar todos os testes unitarios
npm.cmd test

# 2. Executar linter sem erros
npm.cmd run lint

# 3. Compilar versao de producao
npm.cmd run build

# 4. Validar ausencia de travessoes (U+2014)
Get-ChildItem -Path src, specs, docs -Recurse -File | Select-String -Pattern "\u2014"
```
