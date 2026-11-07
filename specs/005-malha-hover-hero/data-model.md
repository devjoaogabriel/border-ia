# Phase 1 Data Model: Estado Real no Diff da `main` (`005-malha-hover-hero`)

**Feature**: `005-malha-hover-hero`
**Date**: 2026-11-07
**Source Files no Diff Atual**: `src/types/landing.ts`, `src/components/three/HeroBeamLazy.tsx`, `src/components/three/HeroBeamCanvas.tsx`, `src/components/sections/HeroSection.tsx`

## 1. Constantes Espaciais Aceitas e Mantidas para a `006`

| Parametro | Valor no Codigo Atual | Status Pos-Revisao | Papel |
|-----------|-----------------------|--------------------|-------|
| `BEAM_WIDTH` | `340` (`px`) | **MANTIDO** | Largura da raiz da corda (`BEAM_CENTER = 170`). |
| `BEAM_VISIBLE_HEIGHT` | `497` (`px`) | **MANTIDO** | Altura visivel acima do topo do `MagicCopyCard`. |
| `BEAM_HEIGHT` | `525` (`px`) | **MANTIDO** | `497 + 28px` de sobreposicao atras do card. |
| `MESH_HALF_WIDTH` | `247` (`px`) | **ACEITO E TRAVADO** | `13` celulas de `19px` para cada lado do fio (`494px` totais, `-inset-x-[77px]` no CSS). |
| `gridOrigin` | `vec2(-uMeshHalf, 60.0)` | **ACEITO E MANTIDO** | Origem unificada entre `DotMatrixDecor` e shader (`0` pontos fantasmas). |
| `cordClearance` | `smoothstep(1.8, 4.5, beamDist)` | **ACEITO E MANTIDO** | Abre espaco limpo sobre o `<svg>` de `4px` da corda. |

## 2. Estruturas de Hover Rejeitadas (Presentes no Diff Atual -> Removidas na `006`)

| Item no Diff Atual | Arquivo | Destino na `006-onda-e-malha-cursor` |
|--------------------|---------|--------------------------------------|
| `BeamMeshPointerState` | `src/types/landing.ts` | **REMOVER** |
| `pointerRef`, `SENSE_*`, `smoothstep` e `useEffect` de `pointermove`/`scroll`/`resize` | `src/components/three/HeroBeamLazy.tsx` | **REMOVER** |
| `CANVAS_WIDTH = 680` (sobra de `93px` para o hover) | `src/components/three/HeroBeamLazy.tsx` | **ENXUGAR** para `504` (`2 * 247 + 10px`) |
| `uMouse`, `uHover`, `POSITION_DAMP`, `HOVER_*_DAMP`, `innerGlow`, `ringWave`, `hoverDots`, `cursorHalo` | `src/components/three/HeroBeamCanvas.tsx` | **REMOVER** e substituir pela onda continua em tempo integral |
| `lg:overflow-x-clip` | `src/components/sections/HeroSection.tsx` | **REMOVER** apos reduzir `CANVAS_WIDTH` para `504` (nao transborda em `1024px`) |
