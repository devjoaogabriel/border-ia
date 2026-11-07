---

description: "Registro real de execucao e revisao HITL das tarefas da feature 005-malha-hover-hero (Handoff 06)"
---

# Tasks: Brilho Reativo ao Mouse na Malha de Pontos do Hero (Estado Real Pos-Revisao)

**Input**: Documentos atualizados em `/specs/005-malha-hover-hero/` e `docs/handoff/06-onda-e-malha-cursor.md`

**Status Geral**: `T002` a `T008` foram implementadas no `git diff` atual da `main`. Na revisao HITL do Joao Gabriel, **ficaram aprovados** a grade unica sem pontos fantasmas e o campo simetrico alargado para `247px` de cada lado da corda, enquanto **o brilho de hover seguindo o mouse na malha nao foi aceito e sai** na feature `006-onda-e-malha-cursor`. As medicoes Lighthouse (`T001` e `T009`) nao rodaram na `005` e foram transferidas para `specs/006-onda-e-malha-cursor/tasks.md`.

---

## Phase 1: Setup & Linha de Base de Performance

- [ ] T001 *(Transferida para `006-onda-e-malha-cursor`)* Medicao de linha de base Lighthouse Mobile e Desktop em build de producao sobre o `HEAD` `333c3a4` nao foi executada antes do descarte do hover e passa a integrar a Fase 1 da `006`.

---

## Phase 2: Foundational (Contrato de Estado do Cursor na Malha)

- [x] T002 *(Executada na `005` -> removida na `006`)* Interface `BeamMeshPointerState` declarada em `src/types/landing.ts` (sera removida na `006` com o fim do hover local da malha).

---

## Phase 3: User Story 1 - Grade Unica, Campo de `247px` e Prototipo de Hover

- [x] T003 [US1] *(Grade unica + campo `247px` ACEITOS; hover `uMouse`/`uHover` REJEITADO -> sai na `006`)* `src/components/three/HeroBeamCanvas.tsx` atualizado com `uMeshHalf = 247`, `gridOrigin = vec2(-uMeshHalf, 60.0)`, `baseMask` alinhada ao CSS, `cordClearance` e prototipo de hover (`sigma = 34px`, `ringR = 44px`, `push <= 1.6px`, `cursorHalo = 0.05`).
- [x] T004 [US1] *(REJEITADO -> sai na `006`)* Captura passiva em `window` (`pointermove`, `scroll`, `resize`, `blur`, `pointerleave`) adicionada em `src/components/three/HeroBeamLazy.tsx` para alimentar o hover local da malha.

---

## Phase 4: User Story 2 - Handoff sem Pontos Fantasmas, Campo Largo e Folga da Corda

- [x] T005 [US2] *(ACEITO E MANTIDO: `MESH_HALF_WIDTH = 247`, `-inset-x-[77px]` e `canvasReady`)* Implementado em `src/components/three/HeroBeamLazy.tsx` o handoff `opacity-0` em `<DotMatrixDecor variant="css" />` apos `onCreated`, o campo simetrico de `247px` (`13` celulas de `19px`) e `lg:overflow-x-clip` em `src/components/sections/HeroSection.tsx` para o canvas de `680px`.
- [x] T006 [US2] *(ACEITO E MANTIDO)* Mascara `cordClearance = smoothstep(1.8, 4.5, beamDist)` validada em `src/components/three/HeroBeamCanvas.tsx` preservando `100%` da nitidez da corda `<svg>`.

---

## Phase 5: User Story 3 - Guardas de Ambiente

- [x] T007 [US3] *(ACEITO E MANTIDO para `connected`/`inViewport`)* Guardas de `isDesktop`, `!reduceMotion` e `inViewport` verificadas em `src/components/three/HeroBeamLazy.tsx`.

---

## Phase 6: Validacao Executada na `005` e Passagem para a `006`

- [x] T008 Validacao de `npm run lint`, `npm run build` e inspecao visual conduzida na `005`, culminando na revisao HITL registrada em `docs/handoff/06-onda-e-malha-cursor.md`.
- [ ] T009 *(Transferida para `006-onda-e-malha-cursor`)* Bateria comparativa de 3 rodadas Lighthouse Mobile e Desktop (antes vs depois) e auditoria final de arquivos antes do commit passam para o fechamento da `006-onda-e-malha-cursor`.
