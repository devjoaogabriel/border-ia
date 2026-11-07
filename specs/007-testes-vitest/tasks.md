---

description: "TDD task list for 007-testes-vitest implementation"
---

# Tasks: Suite de Testes Unitarios Vitest e Extracao de Funcoes Puras

**Input**: Design documents from `/specs/007-testes-vitest/`, `/docs/handoff/08-review-e-testes.md`, `/docs/review/01-code-review.md` e `/docs/review/02-seguranca.md`

**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/pure-functions-and-test-suites-contract.md`, `quickstart.md`

**Tests**: Esta feature E a propria suite de testes. Toda extracao de codigo DEVE obedecer a lei de ferro de `test-driven-development`: escrever o arquivo `*.test.ts` primeiro, rodar `npx vitest run` e assistir a falha esperada (`RED`) antes de criar o modulo em `src/lib/` (`GREEN`).

**Organization**: Tarefas agrupadas por User Story (`US1` Desempenho, `US2` Seguranca, `US3` Escalabilidade + Lighthouse) e encerradas pelo portao `verification-before-completion`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta)
- **[Story]**: User Story atendida pela tarefa (`[US1]`, `[US2]`, `[US3]`)
- Caminhos exatos de arquivo incluidos em todas as descricoes

---

## Phase 1: Setup (Baseline Lighthouse `antes`)

**Purpose**: Capturar a linha de base limpa do commit `333c3a4` nunca medida nas specs `005` e `006`, garantindo comparacao real de performance Mobile e Desktop antes das mudancas da `007`.

- [ ] T001 Medir e registrar a mediana de 3 execucoes do Lighthouse Mobile e Desktop sobre o build de producao da base limpa `333c3a4` (usando `git stash push -u` temporario e `git stash pop` imediato) conforme `specs/007-testes-vitest/quickstart.md` e `specs/006-onda-e-malha-cursor/tasks.md`

---

## Phase 2: Foundational (Verificacao do Ambiente `node` do Vitest)

**Purpose**: Confirmar a configuracao existente do runner sem adicionar pacotes ao `package.json`.

- [ ] T002 Auditar `vitest.config.ts` (`environment: "node"`, alias `@/` para `./src`, padrao `src/**/*.test.{ts,tsx}`) e criar a pasta `src/security/` mantendo `package.json` sem `jsdom` nem `@testing-library/react`

**Checkpoint**: Baseline registrada e runner pronto para iniciar os ciclos Red-Green-Refactor.

---

## Phase 3: User Story 1 - Testes Unitarios de Desempenho e Fisica de Animacao via Funcoes Puras (Priority: P1) - MVP

**Goal**: Extrair e testar deterministicamente em `node` os tres motores matematicos por quadro da pagina (`CursorDotMesh`, `HeroBeamLazy` e `MagicCopyCard`), cobrindo contagem de iteracoes, descartes geometricos, clamp de `dt`, hibernacao do `rAF`, projecao 3D da corda, mola amortecida e saturacao `tanh`.

**Independent Test**: Rodar `npx vitest run src/lib/cursor-mesh-math.test.ts src/lib/hero-beam-math.test.ts src/lib/card-tilt-math.test.ts` e confirmar aprovacao integral em `< 1s`.

### Tests for User Story 1 (RED - escrever primeiro e assistir falhar)

- [ ] T003 [P] [US1] Escrever os testes de desempenho e hibernacao do cursor (`484` celulas, `168` descartes em `OUTER_CUTOFF = 40`, matriz `BAYER`, `MAX_ALPHA <= 0.9`, expansao `+22%`, `dt` grampeado em `0.05s` e convergencia para `rafId = -1`) em `src/lib/cursor-mesh-math.test.ts` e executar `npx vitest run src/lib/cursor-mesh-math.test.ts` confirmando falha RED
- [ ] T004 [P] [US1] Escrever os testes de projecao 3D da ponta da corda (`tipX = 0, tipY = 511` em repouso, simetria `±rotationY`), convergencia estavel de `stepBeamSpring` ate `dt = 0.05s` e validade de `beamPath` em `src/lib/hero-beam-math.test.ts` e executar `npx vitest run src/lib/hero-beam-math.test.ts` confirmando falha RED
- [ ] T005 [P] [US1] Escrever os testes da curva `Math.tanh`, tetos `10`/`12` graus e atenuacao `hoverCtaDamping = 0.35` em `src/lib/card-tilt-math.test.ts` e executar `npx vitest run src/lib/card-tilt-math.test.ts` confirmando falha RED

### Implementation for User Story 1 (GREEN + REFACTOR)

- [ ] T006 [P] [US1] Extrair as constantes e funcoes puras (`smoothstep`, `approach`, `createInitialCursorState`, `computeCursorCellAlpha`, `advanceCursorMeshState`) para `src/lib/cursor-mesh-math.ts`, reconectar `src/components/motion/CursorDotMesh.tsx` e confirmar GREEN em `src/lib/cursor-mesh-math.test.ts`
- [ ] T007 [P] [US1] Extrair `BEAM_GEOMETRY`, `beamPath`, `BEAM_REST_PATH`, `projectBeamContact` e `stepBeamSpring` para `src/lib/hero-beam-math.ts`, reconectar `src/components/three/HeroBeamLazy.tsx` e `src/lib/gsap.ts` (`tipY: BEAM_GEOMETRY.BEAM_REST_TIP`) e confirmar GREEN em `src/lib/hero-beam-math.test.ts`
- [ ] T008 [P] [US1] Extrair `CARD_TILT_CONFIG` e `computeCardHoverAngles` para `src/lib/card-tilt-math.ts`, reconectar `src/components/ui/MagicCopyCard.tsx` e confirmar GREEN em `src/lib/card-tilt-math.test.ts`

**Checkpoint**: User Story 1 concluida; todos os calculos de animacao testados em `node` sem alterar um unico pixel na interface.

---

## Phase 4: User Story 2 - Testes Automatizados de Seguranca e Blindagem contra Sharp Edges (Priority: P1)

**Goal**: Eliminar os sharp edges `SE-01` e `SE-02` com helpers puros testados via TDD e proteger continuamente o repositorio contra links externos sem `rel="noopener noreferrer"`, SVGs com conteudo ativo (`<script>`, `<foreignObject>`, `on*`), sinks de XSS e vazamento de `.env*`.

**Independent Test**: Rodar `npx vitest run src/lib/links.test.ts src/lib/mask-style.test.ts src/security/` e confirmar aprovacao integral sobre o repositorio real e rejeicao de entradas maliciosas nos casos negativos.

### Tests for User Story 2 (RED - escrever primeiro e assistir falhar)

- [ ] T009 [P] [US2] Escrever os testes de `resolveSiteLinkAttributes` e de integridade de `SITE_LINKS` (exigindo `https://` + `target="_blank"` + `rel="noopener noreferrer"` quando `external: true`, `#anchor` quando `external: false`, erro em `javascript:`/`data:`/`http:` e verificacao de `public/icons/social-${id}.svg`) em `src/lib/links.test.ts` e confirmar falha RED no Vitest
- [ ] T010 [P] [US2] Escrever os testes de `buildMaskStyle` (allowlist `/^\/icons\/[a-z0-9-]+\.svg$/i`, aspas em `url("...")`, rejeicao de `..`, espacos, parenteses, `;` e URLs externas) e validacao dos paths de `LOGO_MARK` em `src/lib/mask-style.test.ts` e confirmar falha RED no Vitest

### Implementation & Repository Guards for User Story 2 (GREEN + REFACTOR)

- [ ] T011 [P] [US2] Implementar `resolveSiteLinkAttributes` em `src/lib/links.ts`, reconectar `src/components/ui/CtaButton.tsx`, `src/components/sections/Header.tsx` e `src/components/sections/Footer.tsx`, e confirmar GREEN em `src/lib/links.test.ts`
- [ ] T012 [P] [US2] Implementar `buildMaskStyle` em `src/lib/mask-style.ts`, reconectar `src/components/ui/MaskIcon.tsx`, e confirmar GREEN em `src/lib/mask-style.test.ts`
- [ ] T013 [P] [US2] Implementar o validador puro de markup SVG e a suite que inspeciona todos os `.svg` em `public/` e `src/app/` (testando primeiro que o validador rejeita fixtures com `<script>`, `<foreignObject>`, `onload=` e `https://evil.example` antes de aprovar os `13` SVGs reais) em `src/security/svg-assets.test.ts`
- [ ] T014 [P] [US2] Implementar a suite de invariantes de seguranca sobre `src/**/*.{ts,tsx}`, `.gitignore` e `next.config.ts` (zero `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval(`, `new Function(`, `document.write(`, `process.env` e `\u2014`; `rel="noopener noreferrer"` junto a `target="_blank"`; `.env*` em `.gitignore`; `dangerouslyAllowSVG !== true`) em `src/security/source-and-config.test.ts`

**Checkpoint**: User Story 2 concluida; todas as invariantes de seguranca automatizadas em `npm test`.

---

## Phase 5: User Story 3 - Testes de Escalabilidade Estatica e Medicao Lighthouse Antes/Depois (Priority: P2)

**Goal**: Assegurar limites geometricos constantes em telas grandes (`4K`) e estreitas (`1024px`), isolamento CSS de `--shine-angle`, integridade dos assets em `public/` e comparativo completo do Lighthouse Mobile e Desktop (`antes` vs `depois`).

**Independent Test**: Rodar `npx vitest run src/lib/scalability-budget.test.ts` e conferir os numeros de mediana das 3 execucoes Mobile e 3 Desktop do Lighthouse.

### Implementation for User Story 3

- [ ] T015 [US3] Criar e validar a suite de escalabilidade e orcamento estatico (`CANVAS_WIDTH === 504` sem overflow em `1024px`, teto constante de `1.058.400` fragmentos em `4K` `dpr=2`, `484` celulas no cursor, existencia de todos os arquivos de `FEATURE_ITEMS` e `SOCIAL_PROOF_AVATARS` em `public/`, `@property --shine-angle` com `inherits: false` e `paused` em `src/app/globals.css`) em `src/lib/scalability-budget.test.ts`
- [ ] T016 [US3] Medir a mediana de 3 execucoes do Lighthouse Mobile e Desktop sobre o build de producao final (`depois`), marcar `T001` e `T010` em `specs/006-onda-e-malha-cursor/tasks.md` e registrar a tabela comparativa `antes vs depois` conforme `specs/007-testes-vitest/quickstart.md`

**Checkpoint**: Todas as tres User Stories (`US1`, `US2`, `US3`) completas.

---

## Phase 6: Polish & Verification Gate (`verification-before-completion`)

**Purpose**: Executar a verificacao fresca integral exigida pela skill `verification-before-completion` antes de emitir qualquer declaracao de pronto.

- [ ] T017 Executar na sessao final `npm test`, `npm run lint` e `npm run build` confirmando codigo `0` e `8/8` suites verdes, auditar `git diff` garantindo zero dependencias novas em `package.json` e zero ocorrencias de travessao (`U+2014`), e reportar as evidencias literais de saida

---

## Dependencies & Execution Order

- **Setup (`T001`) + Foundational (`T002`)**: Executar primeiro para registrar o baseline `333c3a4` antes de editar `src/`.
- **User Story 1 (`T003`..`T008`)**: `T003`, `T004` e `T005` (RED) rodam em paralelo -> `T006`, `T007` e `T008` (GREEN) rodam em paralelo logo apos seus respectivos testes falharem.
- **User Story 2 (`T009`..`T014`)**: Independente da `US1`; `T009` e `T010` (RED) precedem `T011` e `T012` (GREEN), enquanto `T013` e `T014` rodam em paralelo.
- **User Story 3 (`T015`..`T016`)**: `T015` depende de `T006` e `T007` (constantes exportadas de `cursor-mesh-math.ts` e `hero-beam-math.ts`); `T016` roda apos todas as alteracoes em `src/` estarem prontas.
- **Verification Gate (`T017`)**: Ultimo passo obrigatorio.

---

## Notes

- **Lista separada (`jsdom` + `@testing-library/react`)**: NAO instalar nem implementar testes `jsdom` a menos que o Joao aprove expressamente a instalacao dessas duas `devDependencies`.
- **Governanca Git**: Trabalhar direto na `main`, sem criar branch, sem `git commit` e sem `git push`.
- **Regra anti-travessao**: Zero ocorrencias de `U+2014` em qualquer arquivo.
