---

description: "Task list for 006-onda-e-malha-cursor implementation (synchronized with Handoff 07)"
---

# Tasks: Onda Continua na Malha do Hero, Cursor Pontilhado e Polimento Interativo

**Input**: Design documents from `/specs/006-onda-e-malha-cursor/`, `/docs/handoff/06-onda-e-malha-cursor.md` e `/docs/handoff/07-ajustes-pos-006.md`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/hero-wave-and-cursor-mesh-contract.md`, `quickstart.md`

**Tests**: Validado via `npm run lint`, verificacao de tipos, `npm run build` e Playwright Chromium + Playwright WebKit (Desktop e iPhone). Permanecem abertas apenas as medicoes comparativas do Lighthouse Mobile e Desktop antes/depois (`T001` e `T010`).

**Organization**: Tarefas agrupadas por User Story (`US1`..`US4`) refletindo o estado real implementado e aprovado na `main`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta)
- **[Story]**: User Story atendida pela tarefa (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Caminhos exatos de arquivo incluidos em todas as descricoes

---

## Phase 1: Setup (Baseline de Performance Previa)

**Purpose**: Registrar a linha de base de performance da `main` limpa (`333c3a4`) para comparacao objetiva de Lighthouse Mobile e Desktop (`FR-013`, `SC-005`).

- [ ] T001 Medir e registrar a mediana de 3 execucoes do Lighthouse Mobile e Desktop sobre o build de producao da base limpa `333c3a4` (usando `git stash push -u` temporario e `git stash pop` imediato para preservar o diff local) conforme roteiro em `specs/006-onda-e-malha-cursor/quickstart.md`

---

## Phase 2: Foundational (Limpeza do Hover Rejeitado da `005` e Tipos Compartilhados)

**Purpose**: Remover os artefatos do hover rejeitado na `005`, preservar a grade unica e o campo travado de `247px`, restaurar `HeroSection.tsx` e declarar o estado tipado do cursor pontilhado.

- [x] T002 Substituir a interface `BeamMeshPointerState` por `CursorMeshRuntimeState` (`targetX`, `targetY`, `x`, `y`, `presence`, `targetPresence`, `interactive`, `targetInteractive`, `elapsed`, `rafId`; sem `cardMute`/`targetCardMute`) em `src/types/landing.ts` conforme `specs/006-onda-e-malha-cursor/data-model.md`
- [x] T003 [P] Remover `lg:overflow-x-clip` e o comentario da `005` em `src/components/sections/HeroSection.tsx`, restaurando `<section id="hero" aria-labelledby="hero-heading" className="relative pt-20 lg:pb-20">` identico ao commit `333c3a4`
- [x] T004 Remover o rastreamento de ponteiro da `005` (`pointerRef`, `canHover`, `SENSE_*`, `smoothstep` e `useEffect` de ponteiro) e atualizar `CANVAS_WIDTH = 504` em `src/components/three/HeroBeamLazy.tsx`, mantendo `MESH_HALF_WIDTH = 247`, `-inset-x-[77px]`, `canvasReady` e `100%` do `<svg>` + mola fisica da corda intocados

**Checkpoint**: Concluido na `main`.

---

## Phase 3: User Story 1 - Onda Continua em Tempo Integral na Malha do Hero sem Hover Local (Priority: P1) - MVP

**Goal**: Exibir em tempo integral na malha do Hero Desktop uma onda luminosa continua e suave que nasce na curva viva da corda e propaga-se simetricamente ate o limite travado de `247px` para cada lado (`494px` totais), sem nenhuma reacao local ao hover do mouse, sem pontos duplicados e sem cobrir o traco da corda.

**Independent Test**: Em Desktop (`1024px` e `1440px`) com movimento padrao ativo e mouse parado fora da coluna direita, confirmar frentes de onda continuas a partir da corda dentro de `247px`, sem mudanca por hover local e sem overflow horizontal.

### Implementation for User Story 1

- [x] T005 [US1] Remover `pointerRef`, `POSITION_DAMP`, `HOVER_IN_DAMP`, `HOVER_OUT_DAMP`, `uMouse` e `uHover` e implementar no fragment shader a onda continua full-time ancorada a curva cubica da corda (`wavePhase = cordDist * 0.036 + cellCenter.y * 0.015 - uTime * 2.0`, `waveCrest`, `lateralFalloff`, `pulseWake`, `shift <= 1.3px`, `dotRadius` `1.4..1.85px` e `dotColor` violeta/lilas contidos em `baseMask` e `cordClearance`) em `src/components/three/HeroBeamCanvas.tsx`

**Checkpoint**: Concluido e validado na `main`.

---

## Phase 4: User Story 2 - Espectro Pontilhado Como Proprio Cursor em Toda a Pagina (Priority: P2)

**Goal**: Representar o ponteiro do mouse em toda a pagina pelo espectro pontilhado ondulante (`88x88` Canvas 2D Bayer `4x4`, `#C9B3FF`, `MAX_ALPHA = 0.9`, `FOLLOW_RATE = 24`) em `fixed inset-0 z-50` com blending normal, escondendo a seta nativa via `.cursor-mesh` apenas quando ativo, permanecendo visivel sobre cards e sobre o `Banner` (incluindo o botao claro) e hibernando quando ocioso ou fora da janela.

**Independent Test**: Mover o mouse por `Header`, `Hero`, `Recursos`, `Banner` e `Footer`, cruzando `MagicCopyCard` e o botao claro do `Banner`, confirmando seta nativa oculta, espectro nitido acima de tudo, expansao `+22%` em links/botoes e hibernacao em `~0.3s` ao retirar o mouse da janela.

### Implementation for User Story 2

- [x] T006 [P] [US2] Criar e ajustar `CursorDotMesh` em `src/components/motion/CursorDotMesh.tsx` como o proprio cursor em `fixed inset-0 z-50` (Canvas 2D `88x88` com `dpr <= 2`, matriz Bayer `4x4`, `#C9B3FF`, `MAX_ALPHA = 0.9`, `FOLLOW_RATE = 24`, expansao `+22%` sobre `a, button, [role='button']`, sem `cardMute`, classe `cursor-mesh` em `document.documentElement` com cleanup e loop `rAF` hibernante)
- [x] T007 [US2] Montar `<CursorDotMesh />` antes de `{children}` em `src/components/motion/LandingMotionController.tsx` (sem `relative isolate` e mantendo `src/app/page.tsx` e `src/components/sections/Footer.tsx` sem `z-10` extras)

**Checkpoint**: Concluido e aprovado pelo Joao na `main`.

---

## Phase 5: User Story 3 - Toque, iPhone/WebKit, Movimento Reduzido, Pausa Fora de Tela e Performance (Priority: P3)

**Goal**: Garantir preservacao da seta nativa em toque, movimento reduzido e falha de JS, desligamento de loops continuos sob `prefers-reduced-motion: reduce`, pausa integral da onda do Hero fora da viewport e ausencia de recortes no card 3D em Mobile/WebKit.

**Independent Test**: Testar em emulacao iPhone (`390x844` e `430x932`, WebKit), com `prefers-reduced-motion: reduce` em Desktop (`1440x900`) e rolando ate o `Footer`.

### Implementation for User Story 3

- [x] T008 [US3] Consolidar as guardas de ambiente (`enabled = canHover && !reduceMotion` retornando `null` e removendo `cursor-mesh` + `requestAnimationFrame` no cleanup em `src/components/motion/CursorDotMesh.tsx`; `connected = isDesktop && !reduceMotion` e `frameloop={isActive ? "always" : "never"}` em `src/components/three/HeroBeamLazy.tsx` e `src/components/three/HeroBeamCanvas.tsx`)

**Checkpoint**: Concluido e validado na `main`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validacao cruzada em Chromium e WebKit (Desktop e iPhone), verificacao de lint/tipos/build e comparativo Lighthouse antes/depois.

- [x] T009 Executar `npm run lint`, verificacao de tipos e `npm run build` com zero erros e validar os cenarios interativos e responsivos em Playwright Chromium e Playwright WebKit (`1440x900`, `1024x768`, `390x844` e `430x932`)
- [ ] T010 Medir a mediana de 3 execucoes do Lighthouse Mobile e Desktop pos-implementacao (confirmando notas >= baseline de `T001` conforme `specs/006-onda-e-malha-cursor/quickstart.md`) e auditar `git diff` garantindo zero ocorrencias de travessao (`U+2014`)

---

## Phase 7: User Story 4 - Selecao de Texto na Cor da Marca e Brilho Interativo nos Botoes (Handoff 07 - Priority: P3)

**Goal**: Aplicar a cor da marca na selecao de texto (`::selection`) e adicionar brilho visivel no hover/foco e no clique (`.btn-shine`) nas tres variantes de `CtaButton` e no botao `"Start now"` do `MagicCopyCard`, mantendo repouso identico ao Figma e respeitando `prefers-reduced-motion`.

**Independent Test**: Selecionar textos na pagina e testar repouso, hover/`:focus-visible`, `:active` e `prefers-reduced-motion: reduce` em todas as variantes de `CtaButton` e no `"Start now"` em Chromium e WebKit.

### Implementation for User Story 4

- [x] T011 [P] [US4] Adicionar `::selection` (`rgb(167 81 251 / 0.45)` / `#fff`), `.cursor-mesh, .cursor-mesh * { cursor: none !important }` e `.btn-shine` em `@layer components` com `@property --shine-angle`, `@keyframes shine-spin` (`2.4s`) e guarda `@media (prefers-reduced-motion: reduce)` em `src/app/globals.css`
- [x] T012 [US4] Aplicar `btn-shine` e variaveis `--shine` por variante (`#fff`, `#A751FB`, `#C082FF`) em `src/components/ui/CtaButton.tsx` e adicionar a classe `btn-shine` ao botao `"Start now"` em `src/components/ui/MagicCopyCard.tsx`

**Checkpoint**: Concluido, testado em Chromium + WebKit e aprovado pelo Joao na `main`.

---

## Dependencies & Execution Status

- **Concluidas (`[x]`)**: `T002`, `T003`, `T004`, `T005`, `T006`, `T007`, `T008`, `T009`, `T011`, `T012` (10/12 tarefas concluidas e validadas em Chromium e WebKit).
- **Pendentes (`[ ]`)**: `T001` (baseline Lighthouse `333c3a4`) e `T010` (Lighthouse pos-implementacao Mobile e Desktop).

---

## Notes

- **Regra Git inviolavel**: Trabalhar direto na branch `main`. NAO criar branch, NAO executar `git commit` e NAO executar `git push`.
- **Regra de escrita inviolavel**: Zero ocorrencias de travessao (`U+2014`) em codigo, comentarios ou documentacao.
