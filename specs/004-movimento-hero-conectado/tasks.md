---

description: "Lista ordenada e verificavel de tarefas de implementacao da feature 004-movimento-hero-conectado"
---

# Tasks: Movimento Conectado no Hero (Bounce da Janela, Feixe Flexivel e Hover 3D no Card)

**Input**: Documentos de design em `/specs/004-movimento-hero-conectado/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/hero-connected-motion-contract.md`, `quickstart.md`)

**Prerequisites**: `plan.md` (obrigatorio), `spec.md` (obrigatorio para as user stories), `research.md`, `data-model.md`, `contracts/hero-connected-motion-contract.md`

**Tests**: Validacao estatica (`lint`, `build`), validacao cruzada em **Chromium e WebKit** (`1440x900` e `430x932`) e comparativo **Lighthouse Mobile/Desktop antes vs depois** estao integrados nas Fases 1 e 6 conforme `quickstart.md`.

**Organization**: Tarefas organizadas por historia de usuario (`US1`, `US2`, `US3`) para entrega incremental e validacao isolada de cada incremento na branch `main`, sem novas dependencias, sem criacao de branch, sem commit e sem push.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta)
- **[Story]**: Historia de usuario correspondente (`[US1]`, `[US2]`, `[US3]`, presente apenas nas fases de historias)
- Todas as descricoes trazem caminhos exatos de arquivos e criterios objetivos de aceite

## Path Conventions

- **Aplicacao Next.js (App Router)**: `src/types/`, `src/lib/`, `src/components/ui/`, `src/components/three/`, `src/components/sections/`, `src/components/motion/`

---

## Phase 1: Setup & Linha de Base de Performance

**Purpose**: Registrar a linha de base objetiva de performance antes de tocar no codigo da `main`.

- [x] T001 Medir e registrar a mediana de 3 execucoes de Lighthouse Mobile e Desktop em build de producao (`npm run build` + `npm run start`) no estado atual da branch `main` (referencia atual Mobile em torno de `63`) conforme `specs/004-movimento-hero-conectado/quickstart.md` | Aceite: Valores medianos `antes` (Mobile e Desktop, junto com LCP Mobile) registrados para comparacao direta na Fase 6 (`FR-012`, `SC-005`).

---

## Phase 2: Foundational (Contratos de Tipo e Ponte Zero-Rerender)

**Purpose**: Preparar os tipos de física/estado e o objeto compartilhado `heroCardMotion` sem re-renderizacoes React antes de implementar as tres historias.

**CRITICAL**: Concluir esta fase antes de iniciar as historias `US1`, `US2` e `US3`.

- [x] T002 [P] Atualizar `CardTiltInteractionState` (`"balancing" | "hovering" | "rebounding"`) e `CardTiltPhysicsConfig` (`balanceSegmentSec`, `balanceKeyframes`, `hoverMaxRotateX`, `hoverMaxRotateY`, `hoverFollowSec`, `hoverCtaDamping`, `reboundSec`, `reboundEase`) em `src/types/landing.ts` conforme `data-model.md` | Aceite: Tipos refletem a substituicao de `drag*` por `hover*` sem uso de `any`.
- [x] T003 [P] Exportar o objeto mutavel compartilhado `heroCardMotion` (`{ rotationX: 0, rotationY: 0, rotation: 0, bendX: 0, tipX: 0, tipY: 511 }`) e remover a importacao, o registro e a exportacao de `Draggable` em `src/lib/gsap.ts` | Aceite: `src/lib/gsap.ts` mantem apenas `useGSAP`, `ScrollTrigger` e `DrawSVGPlugin` registrados, sem alterar `package.json` (`FR-001`, `FR-012`).

**Checkpoint**: Ponte `heroCardMotion` e contratos tipados prontos.

---

## Phase 3: User Story 1 - Inclinacao 3D do Card por Hover do Mouse com Retorno Elastico (Priority: P1) - MVP

**Goal**: Trocar o arraste com clique do card `"Magic copy"` por inclinacao 3D direta no hover do mouse (`±10°` vertical, `±12°` horizontal), sem salto na entrada, com atenuacao firme sobre `"Start now"`, retorno em bounce (`0.85s`) ao sair, harmonizacao do emblema 3D (`4.5°`) e publicacao em tempo real dos angulos em `heroCardMotion`.

**Independent Test**: Em Desktop (`1440x900`) com mouse, entrar no card por qualquer borda/quina e mover nas 4 direcoes sem clicar, clicar `5` vezes em `"Start now"`, observar a contencao do logo 3D e retirar o cursor verificando o bounce e a retomada sem salto do balance.

### Implementation for User Story 1

- [x] T004 [P] [US1] Reduzir `MAX_TILT` de `MathUtils.degToRad(8)` para `MathUtils.degToRad(4.5)` em `src/components/three/PluginPrismLogo3D.tsx` | Aceite: Emblema 3D continua reagindo sutilmente ao ponteiro sem somar rotacao exagerada durante o hover do card (`FR-004`, `SC-001`).
- [x] T005 [US1] Atualizar `src/components/ui/MagicCopyCard.tsx`: adicionar `isolate` ao palco `[data-card-stage]`; remover `Draggable` e cursores `grab`/`grabbing`; implementar sob `canHover` (`(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`) os listeners `pointerenter`, `pointermove` e `pointerleave` (+ `window` `blur`) com limites `±10°` (`rotationX`) e `±12°` (`rotationY`), `scale: 1`, transicao macia `hoverFollowSec: 0.28` (`power2.out`) a partir do angulo instantaneo do balance, fator `hoverCtaDamping: 0.35` quando sobre `buttonRef` (`"Start now"`), e retorno em `pointerleave`/`blur` via `elastic.out(1, 0.45)` (`0.85s`) chamando `balance.restart()` se `inViewport`; atualizar `heroCardMotion.rotationX`, `rotationY` e `rotation` a cada frame do card (e zerar no cleanup/`reduce`) | Aceite: Card inclina no hover sem clicar, sem salto na entrada ou saida, `"Start now"` mantem `cursor-pointer` e `100%` dos cliques funcionais, Mobile mantem apenas balance + `touch-pan-y`, e `prefers-reduced-motion: reduce` zera todo movimento (`FR-001`, `FR-002`, `FR-003`, `FR-009`, `FR-010`, `FR-011`, `SC-001`).

**Checkpoint**: User Story 1 funcional e validavel isoladamente em Desktop e Mobile.

---

## Phase 4: User Story 2 - Linha do Feixe Fisicamente Conectada ao Movimento do Card (Priority: P2)

**Goal**: Substituir a linha reta rigida do feixe Desktop por uma curva `<svg>` Cubic Bezier fisicamente conectada ao ponto 3D de contato no topo do card com mola amortecida e sincronizar o rastro luminoso do shader para percorrer exatamente a mesma curva, sem abrir fresta em nenhum angulo.

**Independent Test**: Em Desktop (`1440x900`), observar a linha conectada durante o balance, inclinar o card nos quatro extremos pelo hover, provocar o bounce de saida e aguardar o pulso `beamPulse` com o card inclinado: zero fresta no topo do card, curvatura organica com inercia e pulso 100% colado a linha curva (inclusive visivel a `0°` no WebKit).

### Implementation for User Story 2

- [x] T006 [P] [US2] Atualizar `src/components/three/HeroBeamCanvas.tsx` adicionando os uniforms `uBendX`, `uTipX` e `uTipY` sincronizados em `useFrame` a partir de `heroCardMotion` e calculando no fragment shader `t = clamp(px.y / max(uTipY, 1.0), 0.0, 1.0)` e `curveX = 3.0 * (1.0 - t) * t * t * uBendX + t * t * t * uTipX` para `beamDist = abs(px.x - curveX)` no nucleo e halo do pulso, mantendo a grade `dots` referenciada a `abs(px.x)` fixo | Aceite: O rastro luminoso de `beamPulse` percorre com precisao algebrica exata a linha curva ate a borda superior do card sem deslocar os pontos cintilantes de fundo (`FR-006`, `SC-002`).
- [x] T007 [US2] Atualizar `src/components/three/HeroBeamLazy.tsx` (`BEAM_OVERLAP = 28`, `BEAM_HEIGHT = 525`, `bottom-[calc(100%-28px)]`, `DotMatrixDecor` e `radial-gradient` com `bottom-7`) substituindo a `div.w-1` por `<svg width="340" height="525">` com `<linearGradient gradientUnits="userSpaceOnUse" x1="170" y1="0" x2="170" y2="511">` (`#FFFFFF -> #C2BAFE -> #8A6DFE`) e `<path ref={pathRef}>` atualizado em `gsap.ticker` (somente quando `isDesktop && !reduceMotion && inViewport`) pela projecao 3D de `(-65, -202.5, 0)` com `BEAM_TUCK = 14` e mola amortecida (`stiffness = 140`, `damping = 14`, `TETHER_SWAY_GAIN = 95`), gravando `bendX`, `tipX` e `tipY` em `heroCardMotion` e resetando para a reta estatica `M 170 0 C 170 170.33, 170 340.67, 170 511` sob `reduceMotion` | Aceite: Linha 100% visivel em `0°` no Chrome e no WebKit, topo fixo, ponta colada ao card com `0px` de fresta em todos os angulos, curvatura suave com inercia no balance/hover/bounce e pausa total fora da tela (`FR-005`, `FR-006`, `FR-010`, `FR-011`, `SC-002`).

**Checkpoint**: User Stories 1 e 2 integradas (card em hover 3D + linha e pulso conectados em tempo real).

---

## Phase 5: User Story 3 - Bounce Sutil na Janela da Interface Figma e Coesao Multi-Dispositivo (Priority: P3)

**Goal**: Adicionar flutuacao vertical continua sutil (`±6px` Desktop / `±4px` Mobile em `4.8s`) a janela `interface-figma` sem conflitar com a entrada nem com o parallax `y: -28`, sem re-rasterizar a mascara linear a cada frame e sem revelar cortes ou overflow no Mobile.

**Independent Test**: Verificar em `1440x900` e `430x932` (Chromium e WebKit) que a janela flutua suavemente na vertical apos `1.1s` convivendo com a rolagem da pagina, sem expor cortes na base ou laterais, sem rolagem horizontal e parando sob `prefers-reduced-motion: reduce` ou fora da tela.

### Implementation for User Story 3

- [x] T008 [US3] Reestruturar o bloco da janela em `src/components/sections/HeroSection.tsx` em `<div data-m="window"> > <div data-m="window-float" className="will-change-transform"> > <Image src="/images/hero-figma-ui.svg" />`, preservando posicionamento responsivo no wrapper `[data-m="window"]` e mantendo `[mask-image:linear-gradient(to_bottom,#000,transparent)]`, `priority` e `unoptimized` exclusivamente no `<Image>` estatico interno | Aceite: Layout estatico em `1440px` e `430px` permanece pixel a pixel identico ao estado atual e a mascara fica isolada da camada animada (`FR-007`, `FR-008`, `SC-003`).
- [x] T009 [US3] Adicionar em `src/components/motion/LandingMotionController.tsx` (escopado a `(prefers-reduced-motion: no-preference)`) o tween continuo `gsap.to("[data-m='window-float']", { y: isDesktop ? -6 : -4, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.1 })` e seu `ScrollTrigger.create({ trigger: "#sobre", start: "top bottom", end: "bottom top", onToggle })` para pausar fora da tela | Aceite: Janela flutua sutilmente sem disputar com o reveal nem com o scrub `y: -28` de `[data-m="window"]`, pausa fora da tela e fica `100%` imovel em `prefers-reduced-motion: reduce` (`FR-007`, `FR-008`, `FR-009`, `FR-010`, `FR-011`, `SC-003`, `SC-004`).

**Checkpoint**: Todas as tres entregas do Hero (`US1`, `US2`, `US3`) completas e harmonizadas.

---

## Phase 6: Polish, Dupla Verificacao Chromium + WebKit e Comparativo Lighthouse

**Purpose**: Garantir qualidade entre navegadores (incluindo WebKit/iPhone), nao-regressao de performance Mobile e conformidade integral com as regras da branch `main`.

- [x] T010 Executar `npm run lint`, `npm run build` e validar os Cenarios 1 a 4 de `specs/004-movimento-hero-conectado/quickstart.md` em **Playwright Chromium e Playwright WebKit** (`1440x900` Desktop e `430x932` Mobile iPhone), verificando visibilidade da linha SVG em `0°`, `0px` de fresta no feixe, pulso curvo alinhado, ausencia de `Z-fighting` no card 3D, ausencia de overflow horizontal ou corte duro na janela Mobile, rolagem por toque livre e `prefers-reduced-motion: reduce` | Aceite: Zero erros de console/build e comportamento visual consistente nos dois motores (`FR-005`..`FR-012`, `SC-001`..`SC-004`).
- [x] T011 Executar nova bateria de 3 medicoes Lighthouse Mobile e Desktop em build de producao comparando a mediana `depois` contra a linha de base de `T001`, e auditar que `package.json`, `src/components/ui/animated-shiny-text.tsx`, `src/components/ui/AnimatedStrokeWord.tsx` e `src/components/ui/BorderIaLogo.tsx` nao foram alterados e que nenhum arquivo modificado contem `U+2014` | Aceite: Mediana Mobile `depois >= antes`, zero novas dependencias, arquivos protegidos intactos na branch `main` e nenhum commit/push realizado (`FR-012`, `SC-005`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup / Baseline)**: Inicia imediatamente (`T001`).
- **Phase 2 (Foundational)**: Depende de `T001`; `T002` e `T003` rodam em paralelo e bloqueiam `US1` e `US2`.
- **Phase 3 (US1 - Hover 3D do Card, P1)**: Depende da Phase 2 (`T004` e `T005`, podendo `T004` rodar em paralelo com `T005`).
- **Phase 4 (US2 - Feixe Conectado, P2)**: Depende da Phase 2 para ler `heroCardMotion` e integra-se plenamente com `US1` (`T006` em `HeroBeamCanvas.tsx` e `T007` em `HeroBeamLazy.tsx` podem iniciar em paralelo).
- **Phase 5 (US3 - Bounce da Janela Figma, P3)**: Independente de `US1`/`US2` (atua em `HeroSection.tsx` e `LandingMotionController.tsx`, `T008` -> `T009`).
- **Phase 6 (Polish & Verificacao)**: Depende da conclusao das Fases 3, 4 e 5 (`T010` -> `T011`).

### Parallel Opportunities

- `T002` (`src/types/landing.ts`) + `T003` (`src/lib/gsap.ts`) em paralelo.
- `T004` (`src/components/three/PluginPrismLogo3D.tsx`) + `T006` (`src/components/three/HeroBeamCanvas.tsx`) + `T008` (`src/components/sections/HeroSection.tsx`) em paralelo por atuarem em arquivos independentes.

---

## Parallel Example: Independent Component Updates

```bash
# Podem rodar simultaneamente apos a Phase 2 por tocarem arquivos distintos:
Task T004: "Reduzir MAX_TILT para 4.5 graus em src/components/three/PluginPrismLogo3D.tsx"
Task T006: "Uniforms uBendX/uTipX/uTipY e curva cubica no shader em src/components/three/HeroBeamCanvas.tsx"
Task T008: "Envoltorio [data-m='window-float'] externo ao <Image> mascarado em src/components/sections/HeroSection.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Concluir `T001` (linha de base Lighthouse) e Phase 2 (`T002`, `T003`).
2. Concluir Phase 3 (`T004`, `T005`).
3. Validar isoladamente o hover 3D do card, `"Start now"` e o retorno elastico.

### Incremental Delivery na `main`

1. `Phase 1 + Phase 2` -> Baseline medido e ponte `heroCardMotion` pronta.
2. `Phase 3 (US1)` -> Hover 3D do card + bounce de saida + logo 3D calibrada.
3. `Phase 4 (US2)` -> Linha SVG flexivel + shader curvo conectados ao card sem fresta.
4. `Phase 5 (US3)` -> Bounce vertical da janela Figma isolado da mascara e do parallax.
5. `Phase 6` -> Testes Chromium + WebKit + comparativo Lighthouse sem commit nem push.

---

## Notes

- Trabalhar exclusivamente na branch `main`, sem criar branch, sem `git commit` e sem `git push`.
- Zero novas dependencias em `package.json`.
- Proibido tocar em `animated-shiny-text.tsx`, `AnimatedStrokeWord.tsx` e `BorderIaLogo.tsx`.
- Proibido usar o caractere travessao (`U+2014`) em qualquer arquivo.
