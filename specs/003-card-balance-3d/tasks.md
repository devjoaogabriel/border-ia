---

description: "Lista ordenada e verificavel de tarefas de implementacao da feature 003-card-balance-3d"
---

# Tasks: Balance Sutil e Arraste 3D com Retorno Elastico no Card Magic Copy

**Input**: Documentos de design em `/specs/003-card-balance-3d/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/card-tilt-contract.md`, `quickstart.md`)

**Prerequisites**: `plan.md` (obrigatorio), `spec.md` (obrigatorio para as user stories), `research.md`, `data-model.md`, `contracts/card-tilt-contract.md`

**Tests**: Testes automatizados unitarios nao foram solicitados na especificacao; cada fase inclui criterios objetivos de aceite e a Fase 6 executa `npm run lint`, `npm run build` e os 4 cenarios de validacao de `quickstart.md`.

**Organization**: As tarefas estao agrupadas por historia de usuario (`US1`, `US2`, `US3`) para permitir implementacao incremental e validacao independente em cada checkpoint, mantendo todo o trabalho na branch `main` sem commits, pushes ou novas dependencias.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta)
- **[Story]**: Historia de usuario correspondente (`[US1]`, `[US2]`, `[US3]`, presente apenas nas fases de historias)
- Todas as descricoes incluem caminhos exatos de arquivos do repositorio e criterio verificavel de aceite

## Path Conventions

- **Aplicacao Next.js (App Router)**: `src/lib/`, `src/types/`, `src/components/three/`, `src/components/ui/` na raiz do repositorio

---

## Phase 1: Setup (Registro GSAP e Tipagem Base)

**Purpose**: Disponibilizar o plugin `Draggable` ja presente no pacote `gsap` instalado e tipar a configuracao fisica do efeito sem adicionar nenhuma dependencia ao `package.json`.

- [x] T001 Registrar e reexportar `Draggable` (`import { Draggable } from "gsap/Draggable"`) dentro da guarda `typeof window !== "undefined"` em `src/lib/gsap.ts` | Aceite: `Draggable` fica disponivel via `@/lib/gsap` junto a `gsap`, `ScrollTrigger`, `DrawSVGPlugin`, `useGSAP` e `beamPulse`, sem alterar `package.json` (`FR-013`).
- [x] T002 [P] Declarar a interface `CardTiltPhysicsConfig` e o tipo `CardTiltInteractionState` (`"static" | "balancing" | "dragging" | "rebounding"`) em `src/types/landing.ts` conforme `data-model.md` | Aceite: `npx tsc --noEmit` passa sem erros e os parametros fisicos possuem contrato tipado unico.

---

## Phase 2: Foundational (Emenda Oculta do Feixe e Palco 3D do Card)

**Purpose**: Preparar a ancoragem sem fresta do feixe vertical do Hero e o envoltorio dedicado de perspectiva (`900px`) externo ao container `overflow-hidden` do card antes de ligar qualquer rotacao 3D.

**CRITICAL**: Nenhuma historia de usuario deve iniciar antes da conclusao desta fase.

- [x] T003 [P] Adicionar sobreposicao inferior oculta de `20px` (`BEAM_OVERLAP = 20`, `BEAM_TOTAL_HEIGHT = 517`, `bottom-[calc(100%-20px)]`, `z-0`) em `src/components/three/HeroBeamLazy.tsx` (mantendo `bottom-5` no `DotMatrixDecor` e no `radial-gradient` lateral, e estendendo a linha central `w-1` e o `HeroBeamCanvas` pelos `517px`; ajustar normalizacao de `uPulse` em `src/components/three/HeroBeamCanvas.tsx` apenas se necessario para manter o tempo visual de chegada no topo do card) | Aceite: Em repouso (`0°`) o feixe exibe exatamente os mesmos `497px` visiveis acima do card do layout aprovado, enquanto os `20px` extras ficam ocultos atras do card opaco para cobrir ate `~16.2px` de retracao perspectiva sob inclinacao maxima (`FR-005`, `SC-001`).
- [x] T004 Estruturar o palco externo `<div ref={stageRef} data-card-stage className="relative z-10 [perspective:900px]">` ao redor do corpo `<div ref={cardRef} data-card-body>` (`overflow-hidden rounded-xl bg-gray-11 touch-pan-y will-change-transform`) e marcar o botao `"Start now"` com `data-no-card-drag` e `cursor-pointer` explicito em `src/components/ui/MagicCopyCard.tsx` | Aceite: O recorte arredondado das sombras internas (`[data-card-glow]`, `[data-card-burst]`) permanece identico ao Figma tanto em `>= 1024px` (`scale-100`) quanto dentro do container pai `scale-[0.885] origin-top-right` abaixo de `1024px`, posicionado em `z-10` sobre a sangria `z-0` do feixe (`FR-001`, `FR-006`, `FR-008`, `FR-012`).

**Checkpoint**: Base geometrica 3D e sobreposicao oculta do feixe prontas; o card em repouso permanece visualmente identico ao Figma.

---

## Phase 3: User Story 1 - Balance Tridimensional Sutil em Repouso com Ancoragem no Feixe (Priority: P1) - MVP

**Goal**: Entregar o ciclo continuo de balance 3D sutil (`5.6s`) em Desktop e Mobile sem deslocar o card do lugar, sem abrir fresta no feixe superior, convivendo com os efeitos internos existentes e pausando automaticamente fora da viewport.

**Independent Test**: Abrir `http://localhost:3000` em `1440px` e `430px` com movimento padrao ativo, observar um ciclo completo de `5.6s` do balance em repouso com `0px` de fresta entre o feixe e o topo do card, confirmar convivencia com `beamPulse`, `"Generating..."` e `PluginPrismLogoLazy`, e rolar ate o rodape para verificar pausa fora da tela e retomada ao voltar ao Hero.

### Implementation for User Story 1

- [x] T005 [US1] Declarar a constante calibrada `CARD_TILT_PHYSICS: CardTiltPhysicsConfig` (`perspectivePx: 900`, `balanceAmplitudeX: 2.0`, `balanceAmplitudeY: 2.8`, `balanceAmplitudeZ: 0.6`, `balancePeriodSec: 5.6`, `dragMinMovementPx: 6`, `dragMaxRotateX: 14`, `dragMaxRotateY: 16`, `dragPressScale: 1.015`, `dragFollowDuration: 0.12`, `reboundDurationSec: 0.9`, `reboundEase: "elastic.out(1, 0.45)"`, `beamOverlapPx: 20`) e os `useRef` de estado transiente (`interactionStateRef`, `inViewportRef`) em `src/components/ui/MagicCopyCard.tsx` | Aceite: Zero estados React adicionais sao criados para frames de animacao (zero re-renders durante o ciclo continuo).
- [x] T006 [US1] Implementar dentro de `useGSAP` + `gsap.matchMedia()` (`canAnimate: "(prefers-reduced-motion: no-preference)"`) a timeline continua `balanceTl` (`repeat: -1`, `transformOrigin: "50% 50%"`, 4 segmentos de `1.4s` com `ease: "sine.inOut"` partindo de `(0, 0, 0)`, passando por `(2.0, -2.8, -0.5)`, `(-1.4, 2.4, 0.6)`, `(1.6, 2.8, -0.4)` e encerrando exatamente em `(0, 0, 0)`) acoplada a `ScrollTrigger.create({ trigger: stageRef.current, start: "top bottom", end: "bottom top", onToggle })` para pausar fora de tela e retomar em viewport quando em estado `"balancing"` em `src/components/ui/MagicCopyCard.tsx` | Aceite: Card oscila suavemente em `5.6s` em `1440px` e `430px` sem sair do lugar, sem abrir fresta no feixe, sem interferir em `beamPulse`, `[data-card-glow]`, `[data-card-arc]` ou `PluginPrismLogoLazy`, e fica `100%` pausado quando fora da viewport (`FR-001`, `FR-002`, `FR-007`, `FR-011`, `SC-001`).

**Checkpoint**: User Story 1 funcional e validavel isoladamente como incremento MVP em Desktop e Mobile.

---

## Phase 4: User Story 2 - Inclinacao 3D por Pressionar e Arrastar com Retorno Elastico (Priority: P2)

**Goal**: Permitir que visitantes em Desktop com ponteiro preciso pressionem e arrastem o card nas quatro direcoes para inclina-lo em perspectiva 3D sem tira-lo do lugar, retornando com bounce elastico (`0.9s`) ao soltar e retomando o balance sem salto visual, com protecao integral dos cliques em `"Start now"`.

**Independent Test**: Em `1440px` com mouse, arrastar o card para cima, baixo, esquerda, direita e diagonais (`>= 6px`), conferir o limite amortecido (`±14°` / `±16°`) sem selecao de texto e sem fresta no feixe, soltar dentro e fora da janela conferindo o bounce de `0.9s` e a retomada sem tranco do balance, e clicar `5` vezes em `"Start now"` confirmando `100%` de disparo sem arraste acidental.

### Implementation for User Story 2

- [x] T007 [US2] Instanciar `Draggable.create(proxy, ...)` sobre um elemento `proxy` em memoria (`document.createElement("div")`) exclusivamente sob a condicao `canDrag: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"` de `gsap.matchMedia()`, configurando `trigger: cardEl`, `type: "x,y"`, `minimumMovement: 6`, `dragClickables: false`, `cursor: "grab"` e `activeCursor: "grabbing"`, alem de protecao explícita em `onPress` caso `event.target` esteja dentro de `[data-no-card-drag]` em `src/components/ui/MagicCopyCard.tsx` | Aceite: Cliques simples (`< 6px`) na superficie do card e `100%` dos cliques sobre `"Start now"` nunca iniciam arraste nem interrompem o feedback demonstrativo do botao (`FR-004`, `FR-009`, `SC-003`).
- [x] T008 [US2] Implementar `onDragStart` e `onDrag` no `Draggable` de `src/components/ui/MagicCopyCard.tsx`: capturar `originX = this.x` e `originY = this.y` (evitando acumulo de offset entre arrastes consecutivos), medir `cardEl.getBoundingClientRect()` (respeitando `scale-[0.885]` abaixo de `1024px`), cancelar qualquer tween de `rebound` ativo, pausar `balanceTl`, animar `scale -> 1.015` (`0.2s`, `power2.out`), bloquear selecao de texto durante o gesto e mapear `dx`/`dy` via `Math.tanh(norm * 1.35)` e `gsap.quickTo` (`0.12s`, `power2.out`) para `rotationY` (`±16°`) e `rotationX` (`±14°`, com `-dy -> +rotationX`), mantendo `x: 0` e `y: 0` | Aceite: Arrastar nas 4 direcoes e diagonais inclina o card suavemente sem desloca-lo na tela, sem selecionar texto, sem abrir vao no feixe e aceitando interrupcao imediata caso o usuario volte a agarrar o card no meio de um bounce (`FR-001`, `FR-003`, `FR-005`, `FR-006`, `FR-009`, `SC-002`).
- [x] T009 [US2] Implementar `onDragEnd` (cobrindo tambem `onRelease` apos arraste ativo e perda de foco `window` `blur` durante `"dragging"`) em `src/components/ui/MagicCopyCard.tsx` animando `cardEl` de volta a `{ rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" }` e executando `balanceTl.restart()` no `onComplete` quando `inViewportRef.current === true` e o estado nao for `"dragging"` | Aceite: Soltar o botao do mouse dentro ou fora da janela retorna o card ao centro com bounce elastico visivel em `0.9s` e emenda em `(0, 0, 0)` no inicio de `balanceTl` com `0.00°` de salto angular (`FR-003`, `SC-002`).

**Checkpoint**: User Stories 1 e 2 completas e integradas (balance continuo + arraste 3D + bounce elastico + `"Start now"` intacto).

---

## Phase 5: User Story 3 - Protecao de Rolagem no Celular, Movimento Reduzido e Acessibilidade (Priority: P3)

**Goal**: Garantir rolagem vertical livre por toque em celulares (`430px`), ausencia de disputa com o `SmoothScrollProvider` (Lenis), desligamento total e reversivel sob `prefers-reduced-motion: reduce` e preservacao da navegacao por teclado.

**Independent Test**: Testar em `430px` com emulacao de toque deslizando verticalmente sobre o card para rolar a pagina, testar `wheel` do mouse com Lenis no Desktop, alternar `prefers-reduced-motion: reduce` em tempo real no DevTools e navegar pelo Hero com `Tab` + `Enter`/`Space`.

### Implementation for User Story 3

- [x] T010 [US3] Garantir limpeza completa e reversao em tempo real no teardown de `gsap.matchMedia()` e `useGSAP` em `src/components/ui/MagicCopyCard.tsx`: matar tweens de `rebound`, destruir instancia `Draggable`, remover listener auxiliar de `blur` e executar `gsap.set(cardEl, { clearProps: "transform,cursor,userSelect" })` sempre que `prefers-reduced-motion: reduce` entrar em vigor, preservando `touch-pan-y` no Mobile (`canDrag === false`) e sem adicionar `tabIndex` ou `role="button"` ao card | Aceite: Em `430px` o gesto vertical sobre o card rola a pagina sem bloqueio; sob `prefers-reduced-motion: reduce` (inicial ou alternado ao vivo) o card fica `100%` plano e estatico (`0°`, sem balance, sem cursor `grab`, sem arraste e sem bounce); o scroll suave do Lenis nao sofre interferencia; e o foco por teclado vai direto ao botao `"Start now"` (`FR-008`, `FR-009`, `FR-010`, `FR-012`, `SC-004`, `SC-005`).

**Checkpoint**: Todas as tres historias (`US1`, `US2` e `US3`) completas e independentemente verificaveis.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validacao final de tipagem, lint, build de producao, roteiro `quickstart.md` e auditoria das restricoes de preservacao da branch `main`.

- [x] T011 Executar `npm run lint`, `npm run build` e os 4 cenarios de `specs/003-card-balance-3d/quickstart.md`, auditando tambem que `package.json`, `src/components/ui/animated-shiny-text.tsx` e `src/components/ui/AnimatedStrokeWord.tsx` nao sofreram alteracoes e que os arquivos editados nao contem o caractere proibido `U+2014` | Aceite: `lint` e `build` retornam codigo `0`, todos os criterios `SC-001` a `SC-006` sao comprovados, zero pacotes novos foram instalados, o brilho aprovado do `H1` e os tracos SVG seguem intactos na branch `main`, e nenhum commit ou push automatico e executado (`FR-013`, `SC-006`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependencias; inicia imediatamente (`T001` e `T002` podem rodar em paralelo por tocarem arquivos distintos: `src/lib/gsap.ts` e `src/types/landing.ts`).
- **Foundational (Phase 2)**: Depende da Phase 1; bloqueia o inicio das historias (`T003` em `src/components/three/HeroBeamLazy.tsx` e `T004` em `src/components/ui/MagicCopyCard.tsx` podem rodar em paralelo).
- **User Story 1 (Phase 3 - P1 MVP)**: Depende da conclusao da Phase 2 (`T005` -> `T006` em `src/components/ui/MagicCopyCard.tsx`).
- **User Story 2 (Phase 4 - P2)**: Depende de `US1` (`T006`) por compartilhar o mesmo componente `src/components/ui/MagicCopyCard.tsx` e pausar/retomar `balanceTl` (`T007` -> `T008` -> `T009`).
- **User Story 3 (Phase 5 - P3)**: Depende de `US2` (`T009`) para consolidar o teardown ao vivo de `prefers-reduced-motion`, toque mobile, Lenis e teclado em `src/components/ui/MagicCopyCard.tsx` (`T010`).
- **Polish (Phase 6)**: Depende da conclusao de todas as fases anteriores (`T011`).

### User Story Dependencies

- **US1 (P1)**: Independente apos a Phase 2; entrega sozinho o MVP visual do balance 3D sutil com ancoragem perfeita no feixe e pausa fora da viewport.
- **US2 (P2)**: Conecta-se diretamente a `balanceTl` criada na `US1` para pausar no `onDragStart` e reiniciar sem salto no `onComplete` do bounce elastico.
- **US3 (P3)**: Valida e blinda o comportamento transversal de toque mobile, scroll suave, `prefers-reduced-motion` e acessibilidade sobre o conjunto `US1 + US2`.

### Parallel Opportunities

- **Phase 1**: `T001` (`src/lib/gsap.ts`) e `T002` (`src/types/landing.ts`) em paralelo.
- **Phase 2**: `T003` (`src/components/three/HeroBeamLazy.tsx`) e `T004` (`src/components/ui/MagicCopyCard.tsx`) em paralelo.

---

## Parallel Example: Foundational Phase (Phase 2)

```bash
# Podem ser executadas simultaneamente por atuarem em arquivos independentes:
Task T003: "Sobreposicao oculta de 20px no feixe em src/components/three/HeroBeamLazy.tsx"
Task T004: "Palco [perspective:900px] externo ao overflow-hidden em src/components/ui/MagicCopyCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Phase 1 (`T001`, `T002`).
2. Concluir Phase 2 (`T003`, `T004`).
3. Concluir Phase 3 (`T005`, `T006`).
4. **PARAR E VALIDAR**: Conferir o balance de `5.6s`, `0px` de fresta no feixe e pausa fora de tela antes de acoplar o `Draggable`.

### Incremental Delivery (Escopo Completo na `main`)

1. `Phase 1 + Phase 2` -> Fundacao 3D pronta sem alterar a aparencia estatica aprovada.
2. `Phase 3 (US1)` -> Balance continuo em repouso + pausa fora da viewport validados.
3. `Phase 4 (US2)` -> Arraste 3D nas 4 direcoes + bounce elastico de `0.9s` + protecao de `"Start now"` validados.
4. `Phase 5 (US3)` -> Toque mobile livre + Lenis + `prefers-reduced-motion: reduce` + teclado validados.
5. `Phase 6` -> `npm run lint`, `npm run build` e checklist final sem commit nem push.

---

## Notes

- Manter todo o trabalho na branch `main` (nao criar branch, nao executar `git commit` nem `git push`).
- Nao instalar nenhum pacote novo em `package.json`.
- Nao tocar em `src/components/ui/animated-shiny-text.tsx` nem em `src/components/ui/AnimatedStrokeWord.tsx`.
- Respeitar a proibicao global de uso de travessao (`U+2014`) em comentarios, strings e documentacao.
