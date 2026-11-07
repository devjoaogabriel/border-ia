---

description: "TDD task list for 009-itens-restantes-review implementation"
---

# Tasks: Itens Restantes do Review e Hardening de Seguranca

**Input**: Design documents from `/specs/009-itens-restantes-review/`, `/docs/handoff/10-itens-restantes-review.md`, `/docs/review/01-code-review.md` e `/docs/review/02-seguranca.md`

**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/itens-restantes-review-contract.md`, `quickstart.md`

**Tests**: Cada correcao com logica testavel DEVE receber teste unitario Vitest antes da implementacao no codigo (lei de ferro de `test-driven-development`). Os 124 testes existentes DEVEM permanecer rigorosamente verdes.

**Organization**: Tarefas agrupadas por User Story e organizadas em fases ordenadas para execucao progressiva com checkpoints de qualidade.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta)
- **[Story]**: User Story atendida pela tarefa (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Caminhos exatos de arquivo incluidos em todas as descricoes

---

## Phase 1: Setup & Linha de Base de Performance

**Purpose**: Confirmar o estado inicial da base apos a spec 008 e auditar a linha de base de testes e Lighthouse.

- [x] T001 Auditar que todos os 124 testes atuais passam com `npm.cmd test` e registrar os dados de baseline do Lighthouse medidos no encerramento da spec 008 (Mobile Performance 58 / TBT 1928 ms, Desktop Performance 79 / TBT 462 ms) em `specs/009-itens-restantes-review/quickstart.md`

---

## Phase 2: User Story 1 - Hardening de Seguranca HTTP e Blindagem de Configuracao (NV-01, SA-INFO-01, SE-03, SE-04) (Priority: P1)

**Goal**: Configurar cabecalhos de seguranca e CSP estatica em `next.config.ts`, desativar `X-Powered-By`, sanitizar caminhos SVG em geradores 3D e travar versoes de dependencias contra downgrades do ESLint.

**Independent Test**: Executar `src/lib/svg-path-sanitizer.test.ts` e `src/security/source-and-config.test.ts`.

### Tests for User Story 1 (RED)

- [x] T002 [P] [US1] Escrever testes em `src/lib/svg-path-sanitizer.test.ts` para `sanitizeSvgPathD` (caminhos com sintaxe valida retornam string limpa, strings com caracteres perigosos como `<` ou `>` lancam erro explicito) e executar `npx vitest run src/lib/svg-path-sanitizer.test.ts` confirmando falha RED
- [x] T003 [P] [US1] Escrever testes em `src/security/source-and-config.test.ts` validando presenca de `poweredByHeader === false`, presenca do metodo `headers()` com os 5 cabecalhos de seguranca configurados em `next.config.ts` e trava de versoes de `eslint-config-next` / `eslint` no `package.json`, confirmando falha RED

### Implementation for User Story 1 (GREEN + REFACTOR)

- [x] T004 [P] [US1] Implementar `src/lib/svg-path-sanitizer.ts`, conectar em `createPrism` de `src/components/three/PluginPrismLogo3D.tsx` e confirmar GREEN em `src/lib/svg-path-sanitizer.test.ts`
- [x] T005 [P] [US1] Atualizar `next.config.ts` com `poweredByHeader: false` e cabecalhos de seguranca no metodo `headers()`, confirmando GREEN no teste `src/security/source-and-config.test.ts`

**Checkpoint**: Aplicacao blindada com cabecalhos HTTP modernos, sem divulgacao de stack, com caminhos 3D sanitizados e protegida contra downgrades.

---

## Phase 3: User Story 2 - Nitidez Dinamica do Cursor e Parametrizacao do Shader (CR-06, CR-12) (Priority: P1)

**Goal**: Manter nitidez dos pontos do cursor em qualquer resolucao ou zoom, e derivar as dimensoes verticais do shader dinamicamente.

**Independent Test**: Executar testes em `src/lib/cursor-mesh-math.test.ts` e `src/lib/hero-beam-math.test.ts`.

### Tests for User Story 2 (RED)

- [x] T006 [P] [US2] Escrever testes em `src/lib/cursor-mesh-math.test.ts` para `computeCursorDprMetrics` (grampeando dpr entre 1 e 2 e calculando dimensoes fisicas) e executar teste confirmando falha RED
- [x] T007 [P] [US2] Escrever testes em `src/lib/hero-beam-math.test.ts` para `deriveShaderVerticalMask(525)` retornando estritamente `{ halfH: 218.5, centerY: 278.5 }` e executar teste confirmando falha RED

### Implementation for User Story 2 (GREEN + REFACTOR)

- [x] T008 [P] [US2] Implementar `computeCursorDprMetrics` em `src/lib/cursor-mesh-math.ts` e atualizar `src/components/motion/CursorDotMesh.tsx` adicionando listener de `resize` `{ passive: true }` para recalcular dimensoes e escala do canvas quando `devicePixelRatio` mudar, confirmando GREEN
- [x] T009 [P] [US2] Implementar `deriveShaderVerticalMask` em `src/lib/hero-beam-math.ts` e atualizar `src/components/three/HeroBeamCanvas.tsx` para derivar `halfH` e `centerY` dinamicamente no GLSL a partir de `uSize.y`, alem de adicionar `useEffect` em `BeamPlane` para sincronizar uniforms quando props mudarem pos-mount, confirmando GREEN

**Checkpoint**: Cursor sempre nitido em monitores Retina e shader com geometria vertical adaptativa sem literais fixos.

---

## Phase 4: User Story 3 - Eficiencia de CPU e Gestao de Memoria WebGL / GSAP (CR-07, CR-08, CR-09) (Priority: P2)

**Goal**: Eliminar alocacao de tweens no hover do card, descartar geometrias 3D na GPU e isolar o estado do singleton para testes.

**Independent Test**: Executar suite `src/lib/hero-beam-math.test.ts` e testar a interatividade do card no navegador.

### Tests for User Story 3 (RED)

- [x] T010 [P] [US3] Escrever teste em `src/lib/hero-beam-math.test.ts` para `resetHeroCardMotion()` confirmando restauracao integral para valores de repouso e executar teste confirmando falha RED

### Implementation for User Story 3 (GREEN + REFACTOR)

- [x] T011 [P] [US3] Implementar `resetHeroCardMotion()` em `src/lib/hero-beam-math.ts`, exportar em `src/lib/gsap.ts` e confirmar GREEN
- [x] T012 [US3] Atualizar `src/components/ui/MagicCopyCard.tsx`: cachear `stage.getBoundingClientRect()` em `pointerenter` (invalidando em scroll e resize da janela) e utilizar `gsap.quickTo` para `rotationX` e `rotationY`, mantendo 100% da resposta visual aprovada
- [x] T013 [US3] Atualizar `src/components/three/PluginPrismLogo3D.tsx`: adicionar descarte de `back` e `front` via `dispose()` no cleanup de `useEffect` e adicionar `{ passive: true }` no listener de `pointermove`

**Checkpoint**: Zero vazamento de geometrias na VRAM, zero alocacoes no hover do card e testes isolados sem estado residual.

---

## Phase 5: User Story 4 - Acessibilidade Semantica, Foco de Teclado e Otimizacao de Assets (CR-13) (Priority: P3)

**Goal**: Prover navegacao semantica e por teclado completa, limitar animacoes sob foco estacionario e avaliar simplificacao de assets no banner.

**Independent Test**: Navegar por teclado Tab na pagina inicial e conferir a equivalencia visual do banner.

### Implementation for User Story 4

- [x] T014 [P] [US4] Criar `src/components/ui/SkipToContent.tsx` com link de ancoragem visivel sob foco para `#conteudo-principal` e incluir no topo de `src/app/page.tsx` ou `src/app/layout.tsx`
- [x] T015 [P] [US4] Atualizar `src/components/ui/animated-shiny-text.tsx` aplicando `id="hero-heading"` diretamente na tag `<motion.h1>` interna
- [x] T016 [P] [US4] Atualizar `src/app/globals.css` com regra para `.btn-shine:is(:focus-visible:not(:hover))` para limitar a execucao continua do giro sob foco de teclado estacionario
- [ ] T017 [P] [US4] Avaliar no `src/components/sections/BannerSection.tsx` a substituicao de `DotMatrixDecor variant="asset"` por `variant="css"` garantindo equivalencia visual estritamente identica; se aprovada, excluir o arquivo orfao `public/icons/stroke-scribble.svg`

**Checkpoint**: Acessibilidade semantica impecavel (WCAG), sem gasto de bateria em foco parado e assets otimizados.

---

## Phase 6: Verification Gate & Medicao Lighthouse

**Purpose**: Comprovar com dados concretos que todas as entregas foram atingidas sem nenhuma regressao.

- [x] T018 Executar a bateria de verificacao final:
  1. `npm.cmd test` (confirmar >= 135 testes passando com 100% de sucesso).
  2. `npm.cmd run lint` (confirmar exit 0 e zero erros).
  3. `npm.cmd run build` (confirmar exit 0 e build estatico integro).
  4. Executar 3 rodadas comparativas do Lighthouse Mobile e 3 Desktop com `lighthouse@12.8.2`, comprovando a manutencao do TBT Mobile <= 2000 ms e notas 100 em A11y, Melhores Praticas e SEO.
  5. Testar nos navegadores Chromium e WebKit (Playwright).
  6. Confirmar zero ocorrencias de travessao (`U+2014`) em todo o repositorio.

---

## Dependencies & Sequence

- **Phase 1 (T001)**: Linha de base da suite anterior.
- **Phase 2 (T002..T005)** e **Phase 3 (T006..T009)**: Podem ser executadas em paralelo (ambas P1).
- **Phase 4 (T010..T013)**: Independente das anteriores (P2).
- **Phase 5 (T014..T017)**: Ajustes de a11y e CSS (P3).
- **Phase 6 (T018)**: Portao final obrigatorio com testes e Lighthouse antes vs depois.

---

## Resultado (T018)

Lighthouse `12.8.2`, build de produção em `localhost:3099`, mediana de 3 rodadas, em 2026-11-07.

| Cenário | Performance | LCP | TBT | A11y / BP / SEO |
|---|---|---|---|---|
| Mobile antes (fim da 008) | 58 | 4039 ms | 1928 ms | 100 / 100 / 100 |
| Mobile depois | 62 (58/62/62) | 4064 ms | 1343 ms | 100 / 100 / 100 |
| Desktop antes (fim da 008) | 79 | 889 ms | 462 ms | 100 / 100 / 100 |
| Desktop depois | 78 (78/78/74) | 971 ms | 484 ms | 100 / 100 / 100 |

- Cabeçalhos conferidos com `curl -I` no build de produção: os 5 de segurança presentes e sem `X-Powered-By`. Zero violação de CSP no console em Chromium e WebKit (build de produção e dev server).
- Testes: 11 suítes, 154 testes. Lint, tipos e build com código 0.

### Desvios e itens não feitos

- **CSP:** `'unsafe-eval'` (e `ws:` no `connect-src`) só em desenvolvimento, via `NODE_ENV`; o build de produção não precisa deles. `'unsafe-inline'` em `script-src` segue necessário porque o Next injeta scripts de hidratação inline sem nonce.
- **T012 (CR-08), parcial:** o retângulo do palco agora é medido uma vez e só refeito após scroll ou resize. O `gsap.quickTo` não foi aplicado: ele disputaria `rotationX`/`rotationY` com o tween de volta (`elastic.out`) e poderia mudar a sensação do hover aprovada.
- **CR-07, parcial:** `heroCardMotion` e `resetHeroCardMotion` agora vivem em `src/lib/hero-beam-math.ts` (o `gsap.ts` reexporta). A ordem entre `syncMotion` e `follow` no `gsap.ticker` não foi alterada.
- **T017 (CR-13), não feito:** trocar `dot-matrix.svg` pela versão CSS exige comparação visual do banner. Ficou para depois. O `stroke-scribble.svg` órfão também foi mantido.
- **CR-12:** os uniforms são criados uma vez (`useState`) e atualizados pelo ref do material quando as props mudam, porque o lint do React proíbe mutar o valor do `useState`.
- **Safari:** por padrão, o Tab do Safari não foca links (só controles de formulário). O link "Pular para o conteúdo" aparece no Chromium e no Safari com "Pressionar Tab para destacar cada item" ligado.
