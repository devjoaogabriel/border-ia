# Phase 0 Research: Correcoes do Code Review e Investigacao do TBT Mobile (`008-correcoes-review`)

**Feature**: `008-correcoes-review`
**Date**: 2026-11-07
**Inputs**: `docs/handoff/09-correcoes-review.md`, `docs/review/01-code-review.md`, `specs/007-testes-vitest/tasks.md`
**Skills**: `test-driven-development`, `verification-before-completion`, `vercel-react-best-practices`, `gsap-performance`

---

## R-01: Diagnostico e Mitigacao do TBT Mobile (CR-02, CR-10 e Hidratacao)

- **Contexto**: O Lighthouse Mobile mediu mediana de TBT de 3571 ms em `333c3a4` e 5569 ms no estado atual. O aumento esta concentrado na avaliacao e execucao de scripts JS durante a hidratacao do React, e nao na GPU ou Three.js diretamente.
- **Causas Raiz Identificadas**:
  1. **Three.js baixado no Mobile (CR-02)**: `PluginPrismLogoLazy.tsx` verifica apenas `!reduceMotion`. No Mobile, o Next.js baixa e compila cerca de 250 KB gzip (~946 KB brutos) de Three.js + R3F + SVGLoader, consumindo tempo de parse/compilacao do V8 em dispositivos moveis simulados.
  2. **Instabilidade de `useMediaQuery` (CR-10)**: O hook `useMediaQuery` em `src/hooks/useMotionEnvironment.ts` recria a funcao `subscribe` passada ao `useSyncExternalStore` a cada ciclo de render. Com 7 chamadas simultaneas espalhadas pela pagina (`SmoothScrollProvider`, `CursorDotMesh`, `HeroBeamLazy`, `PluginPrismLogoLazy`), ocorre uma avalanche de chamadas a `window.matchMedia().addEventListener / removeEventListener` durante a hidratacao inicial.
  3. **Montagem de `CursorDotMesh` em Mobile Emulado**: O emulador do Lighthouse utiliza viewport mobile (`412x823`), mas em certos ambientes CDP pode avaliar `hover: hover` ou montar hooks antes da verificacao completa.
- **Decisao**:
  1. Condicionar o carregamento dinamico de `PluginPrismLogo3D` a `isDesktop && !reduceMotion`. No Mobile (< 1024px) ou com `reduceMotion`, renderizar `BorderIaMark` SVG puro estatico.
  2. Memoizar `subscribe` e `getSnapshot` em `useMotionEnvironment.ts` com cache estável por consulta (`query`), estabilizando a inscricao no `useSyncExternalStore` (resolvendo `CR-10`).
  3. Garantir retorno `null` imediato em `CursorDotMesh` quando `!canHover || !isDesktop || reduceMotion`.
  4. Executar 3 rodadas comparativas do Lighthouse Mobile antes e depois para certificar a recuperacao do TBT.

---

## R-02: Ativacao Progressiva de `.cursor-mesh` e Suporte a Stylus / Caneta (CR-01)

- **Contexto**: A adicao de `cursor: none !important` no mount via `html.classList.add("cursor-mesh")` oculta o cursor nativo antes de o usuario mover o mouse. Alem disso, notebooks hibridos e mesas digitalizadoras emitem `pointerType === "pen"`, que era ignorado por `onMove`, deixando usuarios de caneta sem cursor. No ponto central `(11, 11)`, o dither Bayer podia apagar os pixels centrais no clique.
- **Decisao**:
  1. Nao injetar `.cursor-mesh` no `useEffect` de montagem.
  2. Injetar `.cursor-mesh` somente no primeiro evento de ponteiro valido (`pointerType === "mouse" || pointerType === "pen"`).
  3. Escutar `pointerdown` alem de `pointermove` para despertar imediatamente o cursor apos `blur` ou troca de janelas.
  4. Se um evento `pointerdown` com `pointerType === "touch"` for detectado, remover imediatamente a classe `.cursor-mesh` de `<html>`.
  5. Extrair e cobrir com testes unitarios em `src/lib/cursor-mesh-math.ts` a funcao `computeCentralDotAlpha(presence)` garantindo que o ponto central nunca tenha alfa menor que 0.7 quando `presence > 0`.

---

## R-03: Resiliencia de WebGL e Reset de `canvasReady` (CR-03)

- **Contexto**: Em `HeroBeamLazy.tsx` e `PluginPrismLogoLazy.tsx`, apos o primeiro mount com sucesso, `canvasReady = true` fica retido mesmo se a tela diminuir para Mobile ou ocorrer descarte de contexto GPU (`webglcontextlost`), deixando o fallback SVG invisivel.
- **Decisao**:
  1. Adicionar `useEffect` em `HeroBeamLazy` resetando `setCanvasReady(false)` quando `!connected`.
  2. Registrar listener de `webglcontextlost` em `gl.domElement` no Three.js chamando `setCanvasReady(false)`.
  3. Estender `WebGLSafeBoundary` para aceitar callback `onContextLost` / `onError` propagado para os componentes pais reativarem o fallback SVG imediatamente.

---

## R-04: Resolucao da Colisao em Recursos (CR-04)

- **Contexto**: Em `src/components/sections/FeaturesSection.tsx:47`, o titulo "Amplificador de imagem" usa `lg:whitespace-nowrap`. Em 1024px, a coluna tem ~220px e o texto mede ~278px, invadindo a coluna vizinha em cerca de 58px.
- **Decisao**: Substituir `lg:whitespace-nowrap` por `xl:whitespace-nowrap` no `<h3>` dos cards de recursos, permitindo quebra de linha natural em viewports de 1024px a 1260px e mantendo uma linha apenas a partir de `1280px` (onde ha espaco suficiente).

---

## R-05: Higiene do Tailwind CSS v4 e Desambiguacao de `.btn-shine` (CR-11)

- **Contexto**: O Tailwind v4 varre o repositorio inteiro se nao houver restricao explícita de fonte. Arquivos de documentacao em `docs/` e `specs/` introduziram classes mortas como `.mix-blend-screen` e `.cursor-grab` no bundle CSS final. Em `.btn-shine`, o utilitario `transition` sobrescreve a declaracao de `transition-property` da camada de componentes.
- **Decisao**:
  1. Especificar a diretiva `@source "../src";` ou `@import "tailwindcss" source("../src");` em `src/app/globals.css`.
  2. Limpar o comentario com colchetes `/* [--shine:...] */` na linha 197 de `globals.css`.
  3. Unificar `transition-property` e `transition-duration` explicitas em `.btn-shine` e remover a classe utilitaria redundante `transition duration-300` onde `.btn-shine` ja for utilizado.

---

## R-06: Desativacao de Loops e Tickers GSAP em Repouso (CR-05)

- **Contexto**: Em `MagicCopyCard.tsx`, o ScrollTrigger pausa apenas a timeline `balance`. O giro continuo do arco `spinRef`, o pulso `beamPulse` e o listener `gsap.ticker.add(syncMotion)` continuam executando fora da viewport e em telas Mobile. Em `SmoothScrollProvider.tsx`, o Lenis registra update no ticker mesmo com `reduceMotion === true`.
- **Decisao**:
  1. No ScrollTrigger `visibility` de `MagicCopyCard`, pausar `spinRef` e `beamPulse` em `onLeave` e retomar em `onEnter` / `onEnterBack`.
  2. Condicionar o registro de `syncMotion` no `gsap.ticker` a `isDesktop && inViewport && !reduceMotion`.
  3. Em `SmoothScrollProvider.tsx`, registrar `gsap.ticker.add(update)` apenas quando `!reduceMotion`.
