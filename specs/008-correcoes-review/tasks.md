---

description: "TDD task list for 008-correcoes-review implementation"
---

# Tasks: Correcoes do Code Review e Investigacao do TBT Mobile

**Input**: Design documents from `/specs/008-correcoes-review/`, `/docs/handoff/09-correcoes-review.md` e `/docs/review/01-code-review.md`

**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/correcoes-review-contract.md`, `quickstart.md`

**Tests**: Cada correcao com logica testavel DEVE receber teste unitario Vitest antes da implementacao no componente (lei de ferro de `test-driven-development`). Os 90 testes existentes DEVEM permanecer rigorosamente verdes.

**Organization**: Tarefas agrupadas por User Story e organizadas em fases ordenadas para execucao progressiva com checkpoints de qualidade.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta)
- **[Story]**: User Story atendida pela tarefa (`[US1]`, `[US2]`, `[US3]`, `[US4]`, `[US5]`)
- Caminhos exatos de arquivo incluidos em todas as descricoes

---

## Phase 1: Setup & Linha de Base de Performance

**Purpose**: Confirmar o estado inicial da base e registrar a linha de base do Lighthouse para posterior comparacao.

- [x] T001 Auditar que todos os 90 testes atuais passam com `npm.cmd test` e registrar os dados de baseline do Lighthouse medidos no encerramento da spec 007 (Mobile Score 52, TBT 5569 ms) em `specs/008-correcoes-review/quickstart.md`

---

## Phase 2: User Story 1 - Performance Mobile e Investigacao do TBT (CR-02, CR-10 e TBT) (Priority: P1)

**Goal**: Cortar o download e execucao de Three.js no Mobile (CR-02), estabilizar `useMediaQuery` contra tempestade de listeners (CR-10) e evitar execucoes desnecessarias na hidratacao mobile.

**Independent Test**: Executar build de producao e inspecionar a arvore de rede no Mobile para confirmar zero carregamento do chunk de Three.js, alem de conferir testes de estabilidade.

### Tests for User Story 1 (RED)

- [x] T002 [US1] Escrever teste em `src/security/source-and-config.test.ts` verificando que `PluginPrismLogoLazy.tsx` requer `isDesktop` alem de `!reduceMotion` para montar 3D e executar `npx vitest run src/security/source-and-config.test.ts` confirmando falha RED

### Implementation for User Story 1 (GREEN + REFACTOR)

- [x] T003 [US1] Atualizar `src/components/three/PluginPrismLogoLazy.tsx` para condicionar a carga de `PluginPrismLogo3D` a `isDesktop && !reduceMotion`, renderizando `BorderIaMark` SVG no Mobile, e confirmar GREEN no teste
- [x] T004 [US1] Estabilizar `useMediaQuery` em `src/hooks/useMotionEnvironment.ts` com cache estável por consulta (`query`) para `subscribe` e `getSnapshot` (CR-10), evitando recriacao de listeners no `window.matchMedia`
- [x] T005 [US1] Adicionar retorno `null` estatico em `src/components/motion/CursorDotMesh.tsx` quando `!canHover || !isDesktop || reduceMotion`, evitando overhead de hooks em dispositivos moveis

**Checkpoint**: Three.js completamente isolado do Mobile e `useMediaQuery` estabilizado sem re-inscricoes em cascata.

---

## Phase 3: User Story 2 - Robustez do Cursor Dinamico e Suporte a Caneta / Stylus (CR-01) (Priority: P1)

**Goal**: Eliminar o desaparecimento precoce do cursor, suportar caneta/stylus e garantir presenca imediata no clique apos `blur`.

**Independent Test**: Testar em `src/lib/cursor-mesh-math.test.ts` e em navegador desktop com mouse e stylus.

### Tests for User Story 2 (RED)

- [x] T006 [P] [US2] Escrever testes em `src/lib/cursor-mesh-math.test.ts` para `isValidCursorPointerType` ("mouse" e "pen" validos; "touch", vazio e nulo invalidos) e `computeCentralDotAlpha` (piso de 0.70 quando presence > 0) e executar `npx vitest run src/lib/cursor-mesh-math.test.ts` confirmando falha RED

### Implementation for User Story 2 (GREEN + REFACTOR)

- [x] T007 [P] [US2] Implementar `isValidCursorPointerType` e `computeCentralDotAlpha` em `src/lib/cursor-mesh-math.ts` e executar teste ate ficar GREEN
- [x] T008 [US2] Atualizar `src/components/motion/CursorDotMesh.tsx`: remover adicao de `.cursor-mesh` no mount do `useEffect`, aplicar a classe somente no primeiro evento valido (`isValidCursorPointerType`), escutar `pointerdown` para despertar apos `blur`, remover a classe em `touch` e aplicar `computeCentralDotAlpha` na celula central `(11, 11)`

**Checkpoint**: Cursor padrao nunca mais desaparece antes da hora e usuarios de stylus navegam normalmente.

---

## Phase 4: User Story 3 - Resiliencia e Ciclo de Vida de WebGL (CR-03) (Priority: P2)

**Goal**: Garantir que fallbacks visuais SVG reaparecam de imediato ao redimensionar para Mobile ou sofrer perda de contexto GPU.

**Independent Test**: Simular redimensionamento e perda de contexto confirmando que `canvasReady` volta a `false` e o SVG fica visivel.

### Implementation for User Story 3

- [x] T009 [US3] Atualizar `src/components/three/HeroBeamLazy.tsx` com efeito de reset `setCanvasReady(false)` sempre que a condicao `connected` se tornar falsa (ao sair de Desktop)
- [x] T010 [US3] Adicionar listener de `webglcontextlost` em `gl.domElement` no Three.js chamando `setCanvasReady(false)` e prevenindo o default em `HeroBeamLazy.tsx`
- [x] T011 [US3] Estender `src/components/three/WebGLSafeBoundary.tsx` para aceitar callback `onLost` / `onError` propagado aos componentes pais

**Checkpoint**: Sem buracos visuais na tela quando WebGL falha ou a tela encolhe.

---

## Phase 5: User Story 4 - Integridade de Layout e Higiene do CSS (CR-04 e CR-11) (Priority: P2)

**Goal**: Eliminar invasao de titulo em Recursos entre 1024px e 1260px e limpar o CSS final de seletores mortos.

**Independent Test**: Inspecionar quebra de linha de "Amplificador de imagem" em 1024px e analisar arquivo CSS compilado de producao.

### Tests for User Story 4 (RED)

- [x] T012 [P] [US4] Escrever assercoes em `src/lib/scalability-budget.test.ts` e `src/security/source-and-config.test.ts` validando ausencia de `lg:whitespace-nowrap` em `FeaturesSection.tsx`, presenca de `@source "../src"` em `globals.css` e ausencia de `.mix-blend-screen` e executar testes confirmando falha RED

### Implementation for User Story 4 (GREEN + REFACTOR)

- [x] T013 [P] [US4] Atualizar `src/components/sections/FeaturesSection.tsx` substituindo `lg:whitespace-nowrap` por `xl:whitespace-nowrap` no titulo dos cards de recursos
- [x] T014 [P] [US4] Atualizar `src/app/globals.css` adicionando `@source "../src";` (ou restricao de importacao do Tailwind), limpar comentario com colchetes na linha 197 e ajustar especificidade de `.btn-shine` sem conflito com o utilitario `transition`

**Checkpoint**: Layout de Recursos 100% integro em qualquer largura e CSS enxuto sem classes zumbis.

---

## Phase 6: User Story 5 - Pausa de Loops GSAP e Tickers em Repouso (CR-05) (Priority: P3)

**Goal**: Zerar consumo de CPU fora da viewport e em modo de movimento reduzido.

**Independent Test**: Verificar se os loops de animacao continua do card sao pausados ao rolar para o rodape e se o ticker do Lenis respeita `reduceMotion`.

### Tests for User Story 5 (RED)

- [x] T015 [P] [US5] Escrever testes em `src/lib/card-tilt-math.test.ts` para `shouldRunCardContinuousMotion` e `shouldSyncHeroTicker` e executar teste confirmando falha RED

### Implementation for User Story 5 (GREEN + REFACTOR)

- [x] T016 [P] [US5] Implementar `shouldRunCardContinuousMotion` e `shouldSyncHeroTicker` em `src/lib/card-tilt-math.ts` e confirmar GREEN
- [x] T017 [US5] Conectar em `src/components/ui/MagicCopyCard.tsx`: pausar `spinRef` e `beamPulse` em `onLeave` do ScrollTrigger, condicionar adicao de `syncMotion` no `gsap.ticker` a `isDesktop && inViewport && !reduceMotion`, e condicionar ticker do Lenis em `src/components/motion/SmoothScrollProvider.tsx` a `!reduceMotion`

**Checkpoint**: CPU e GPU entram em repouso absoluto fora da viewport e sob reducao de movimento.

---

## Phase 7: Verification Gate & Medicao Lighthouse

**Purpose**: Provar com dados concretos que todas as metas foram alcancadas antes de concluir a entrega.

- [x] T018 Executar a bateria de verificacao final:
  1. `npm.cmd test` (confirmar >= 100 testes passando e zero falhas).
  2. `npm.cmd run lint` (confirmar exit 0 e zero erros).
  3. `npm.cmd run build` (confirmar exit 0 e build estatico integro).
  4. Executar 3 rodadas comparativas do Lighthouse Mobile e 3 Desktop com `lighthouse@12.8.2`, registrando a tabela comparativa antes vs depois comprovando a reducao do TBT Mobile.
  5. Testar nos navegadores Chromium e WebKit (Playwright).
  6. Confirmar zero ocorrencias de travessao (`U+2014`) em todo o repositorio.

---

## Dependencies & Sequence

- **Phase 1 (T001)**: Auditoria da baseline antes de qualquer alteracao.
- **Phase 2 (T002..T005)** e **Phase 3 (T006..T008)**: Podem ser trabalhadas de forma independente (ambas P1).
- **Phase 4 (T009..T011)** e **Phase 5 (T012..T014)**: Independentes entre si (P2).
- **Phase 6 (T015..T017)**: Depende apenas das constantes do card (P3).
- **Phase 7 (T018)**: Portao final obrigatorio de verificacao com Lighthouse antes vs depois.

---

## Resultado (T018)

Lighthouse `12.8.2`, build de produção em `localhost:3099`, mediana de 3 rodadas, em 2026-11-07.

| Cenário | Performance | LCP | TBT | CLS | A11y / BP / SEO |
|---|---|---|---|---|---|
| Mobile antes (fim da 007) | 52 | 4638 ms | 5569 ms | 0 | 100 / 100 / 100 |
| Mobile depois | 58 (58/58/64) | 4039 ms | 1928 ms | 0 | 100 / 100 / 100 |
| Desktop antes (fim da 007) | 72 | 963 ms | 725 ms | 0 | 100 / 100 / 100 |
| Desktop depois | 79 (76/79/83) | 889 ms | 462 ms | 0 | 100 / 100 / 100 |

- TBT Mobile caiu 65%. O maior ganho veio do CR-02: o celular não baixa mais nenhum chunk com `WebGLRenderer`.
- CSS de produção: de 29,4 KB para 27,0 KB. `mix-blend-screen`, `cursor-grab` e a classe vinda do comentário sumiram; `lg:*`, `xl:whitespace-nowrap` e `[--shine:...]` continuam presentes.
- Testes: 10 suítes, 124 testes. Chromium e WebKit validados com Playwright (CR-01 a CR-05 e CR-11).

### Desvios da spec

- **CSS-01:** `@source "../src"` apontaria para `src/src` a partir de `src/app`. Usado `@import "tailwindcss" source("..")`.
- **CSS-03:** a lista `opacity, border-color, box-shadow` mataria a transição de cor, filtro e do clique. A `.btn-shine` mantém a lista completa com `transition-duration: 300ms`, e os botões com `btn-shine` deixaram de usar o utilitário `transition duration-300`.
- **WEBGL-01:** o reset de `canvasReady` e `ready` é feito durante o render (padrão do React para ajustar estado quando uma prop muda), porque `setState` dentro de efeito é bloqueado pelo lint.
- **T002:** além do teste de fonte, a regra virou função pura (`src/lib/prism-logo-policy.ts`) com teste próprio.
- **CR-10:** a assinatura estável ficou em `src/hooks/media-query-store.ts`, com teste.
