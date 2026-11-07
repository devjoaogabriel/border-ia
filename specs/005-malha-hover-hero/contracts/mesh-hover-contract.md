# Post-Review Contract Snapshot (`005-malha-hover-hero`)

**Feature**: `005-malha-hover-hero`
**Date**: 2026-11-07
**Status**: Registro do estado real na `main` (Handoff 06); substituido em `specs/006-onda-e-malha-cursor/contracts/hero-wave-and-cursor-mesh-contract.md`.

## 1. Parcela Aceita e Preservada como Base para a `006`

### 1.1 Handoff de Grade Unica e Campo de `247px` (`src/components/three/HeroBeamLazy.tsx`)
- `MESH_HALF_WIDTH = 247` (`13` celulas simetricas de `19px` para cada lado de `BEAM_CENTER = 170`).
- `<DotMatrixDecor variant="css" className={`-inset-x-[77px] top-[60px] bottom-7 ${connected && canvasReady ? "opacity-0" : ""}`} />`: garante primeiro paint SSR e modo `prefers-reduced-motion: reduce`, ocultando-se assim que `HeroBeamCanvas` dispara `onCreated` (`setCanvasReady(true)`).
- `<HeroBeamCanvas />` posicionado centrado em `BEAM_CENTER` com `meshHalfWidth={MESH_HALF_WIDTH}`.
- A corda `<svg>` e sua mola fisica (`follow`) permanecem inalteradas.

### 1.2 Grade Unificada e Folga da Corda no Shader (`src/components/three/HeroBeamCanvas.tsx`)
- Uniform `uMeshHalf` (`247`).
- Origem unificada `vec2 gridOrigin = vec2(-uMeshHalf, 60.0);`, `cell = floor((px - gridOrigin) / 19.0)` e `cellCenter = gridOrigin + (cell + 0.5) * 19.0`.
- Forma base do ponto identica ao CSS (`1.0 - clamp((r - 1.4) / 0.4, 0.0, 1.0)`), mascara eliptica `closest-side` de `25%` (`baseMask`), `blink` aleatorio e decaimento lateral `fall = exp(-dist / 90.0)`.
- `cordClearance = smoothstep(1.8, 4.5, beamDist)` preservando a nitidez do traco `<svg>` da corda.

---

## 2. Parcela Rejeitada na Revisao HITL (Sai na `006-onda-e-malha-cursor`)

Os itens abaixo encontram-se atualmente no `git diff` da `main` como resultado da implementacao inicial da `005` (calibrados ate `sigma = 34px`, `ringR = 44px`, `push <= 1.6px` e `cursorHalo = 0.05`) e **serao removidos** nas primeiras tarefas da `006-onda-e-malha-cursor`:

- `BeamMeshPointerState` em `src/types/landing.ts`.
- `pointerRef`, constantes `SENSE_*`, `smoothstep` e o `useEffect` de `pointermove`/`scroll`/`resize`/`blur`/`pointerleave` em `src/components/three/HeroBeamLazy.tsx`.
- `CANVAS_WIDTH = 680` (sera reduzido para `504`, eliminando tambem a necessidade de `lg:overflow-x-clip` em `src/components/sections/HeroSection.tsx`).
- Uniforms `uMouse` e `uHover`, amortecimento de ponteiro em `useFrame` e termos `innerGlow`, `ringWave`, `hoverDots` e `cursorHalo` em `src/components/three/HeroBeamCanvas.tsx`.
