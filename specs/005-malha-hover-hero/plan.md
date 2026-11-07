# Implementation Plan: Brilho Reativo ao Mouse na Malha de Pontos do Hero (Registro Pos-Revisao Handoff 06)

**Branch**: `005-malha-hover-hero` (trabalho mantido na branch `main`) | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Estado real implementado na `main` e revisado pelo Joao Gabriel conforme `docs/handoff/06-onda-e-malha-cursor.md`.

## Summary

Documenta o estado real deixado na branch `main` (sem commit) apos a execucao e revisao HITL da feature `005`:
- **Mantido para a `006`**: unificacao em **grade unica** entre `DotMatrixDecor` (CSS estatico de primeiro paint / `reduced-motion`, ocultado com `opacity-0` apos `onCreated`) e o fragment shader de `HeroBeamCanvas.tsx`, **campo simetrico de `247px` para cada lado do fio** (`MESH_HALF_WIDTH = 247`, `-inset-x-[77px]`, `13` celulas de `19px` por lado com decaimento em gradiente rumo as bordas) e folga limpa `cordClearance` sobre a corda `<svg>`.
- **Descartado e removido na `006`**: o brilho de hover seguindo o mouse na malha do Hero (`uMouse`, `uHover`, `BeamMeshPointerState`, listeners passivos de ponteiro em `HeroBeamLazy.tsx` e `CANVAS_WIDTH = 680` + `lg:overflow-x-clip` motivados pela sobra do hover), substituido em `specs/006-onda-e-malha-cursor/` por onda continua na malha do Hero e malha pontilhada acompanhando o ponteiro na pagina toda.

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), React `19.3.0`, Next.js `16.4.5` (App Router)

**Primary Dependencies**: `three` `^0.187.0`, `@react-three/fiber` `^9.8.2`, `gsap` `^3.15.1`, `@gsap/react` `^2.1.2`, `tailwindcss` `^4` (zero novos pacotes)

**Storage**: N/A

**Testing**: `npm run lint`, `npm run build` e verificacao visual executadas em `T002`..`T008`; bateria comparativa Lighthouse Mobile e Desktop (`T001`/`T009`) transferida para o fechamento da `006-onda-e-malha-cursor` antes do commit.

**Target Platform**: Desktop (`>= 1024px`) para a malha do feixe; Mobile (`< 1024px`, incluindo iPhone WebKit) intocado no carregamento 3D e sem recorte em ancestrais do card.

**Project Type**: Web application (Single-page landing page em Next.js App Router)

**Performance Goals**: Manter no maximo 2 contextos WebGL restritos ao Hero, pausa total fora da tela (`frameloop="never"`) e preservacao das notas de Lighthouse Mobile e Desktop.

**Constraints**: Zero novas dependencias; proibido alterar `MagicCopyCard.tsx`, o `<svg>`/mola da corda, `animated-shiny-text.tsx`, `AnimatedStrokeWord.tsx` e `BorderIaLogo.tsx`; trabalhar na `main` sem branch, sem commit e sem push; proibido usar `U+2014`.

**Scale/Scope**: No diff atual da `main`, foram tocados 4 arquivos: `src/components/sections/HeroSection.tsx`, `src/components/three/HeroBeamCanvas.tsx`, `src/components/three/HeroBeamLazy.tsx` e `src/types/landing.ts`.

## Constitution Check

| Principio da Constituicao (v1.1.0) | Estado Real na `main` Pos-Revisao |
|------------------------------------|-----------------------------------|
| **I. Fidelidade Visual e Contratual ao Figma** | APROVADO COM DESVIO AUTORIZADO PELO USUARIO: Campo da malha ampliado simetricamente para `247px` de cada lado (alinhado a `"criacao"` no `H1`), travado pelo Joao sem novo aumento |
| **II. Movimento Intencional e Shapes Realistas** | APROVADO: Grade unica alinhada sem pontos fantasmas (`onCreated` -> `opacity-0` no CSS) e `cordClearance` preservando a corda |
| **III. Respeito Integral a `prefers-reduced-motion`** | APROVADO: `connected = isDesktop && !reduceMotion` mantem apenas `DotMatrixDecor` estatico quando `reduce` esta ativo |
| **IV. Performance de Primeiro Paint e Renderizacao** | APROVADO: 2 contextos WebGL restritos ao Hero e pausa fora da viewport; medicao Lighthouse consolidada na `006` |
| **V. Acessibilidade Semantica e Navegabilidade** | APROVADO: `aria-hidden="true"` e `pointer-events-none` preservados |
| **Restricoes de Stack, Git e Conteudo** | APROVADO: Zero pacotes novos, elementos protegidos intocados, branch `main` sem commit/push e zero `U+2014` |

## Project Structure

### Documentation (this feature)

```text
specs/005-malha-hover-hero/
├── spec.md                              # Especificacao atualizada com o resultado real da revisao HITL (Handoff 06)
├── plan.md                              # Este plano refletindo o diff real na main e a transicao para a 006
├── research.md                          # Registro das decisoes e do que ficou vs saiu apos revisao
├── data-model.md                        # Parametros reais no diff atual (MESH_HALF_WIDTH=247, etc.) e destino na 006
├── quickstart.md                        # Notas de validacao e passagem do gate Lighthouse para a 006
├── contracts/
│   └── mesh-hover-contract.md           # Contrato real presente no diff atual (base de partida da limpeza na 006)
├── checklists/
│   └── requirements.md                  # Checklist atualizado pos-revisao
└── tasks.md                             # T002..T008 concluidas no diff atual; T001/T009 transferidas para a 006
```

### Source Code no `git diff` Atual (ponto de partida da `006`)

```text
src/
├── components/
│   ├── sections/
│   │   └── HeroSection.tsx              # [NO DIFF ATUAL] lg:overflow-x-clip (sera reavaliado/limpo na 006 com canvas enxuto)
│   └── three/
│       ├── HeroBeamCanvas.tsx           # [NO DIFF ATUAL] Grade unica + uMeshHalf=247 (FICAM) + uMouse/uHover (SAEM na 006)
│       └── HeroBeamLazy.tsx             # [NO DIFF ATUAL] MESH_HALF_WIDTH=247 + canvasReady (FICAM) + pointerRef/listeners (SAEM na 006)
└── types/
    └── landing.ts                       # [NO DIFF ATUAL] BeamMeshPointerState (SAI na 006)
```

## Complexity Tracking

Nenhuma violacao constitucional identificada.
