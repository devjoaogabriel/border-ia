# Phase 0 Research: Onda Continua na Malha do Hero, Cursor Pontilhado e Brilho de Botoes (`006-onda-e-malha-cursor`)

**Feature**: `006-onda-e-malha-cursor`
**Date**: 2026-11-07
**Base Codebase**: Branch `main` (`HEAD` em `333c3a4`, sincronizado com a implementacao da `006` e os ajustes aprovados no `Handoff 07`)

## R-01: Limpeza do Hover da `005`, Preservacao dos `247px` e Largura do Canvas em `1024px`

- **Decision**:
  1. Manter de forma intacta na malha do Hero: a **grade unica alinhada** (`DotMatrixDecor` com `opacity-0` apos `onCreated` + pontos fixos desenhados no shader em `gridOrigin = vec2(-uMeshHalf, 60.0)`), a folga sobre o fio (`cordClearance = smoothstep(1.8, 4.5, beamDist)`) e o **campo simetrico de `MESH_HALF_WIDTH = 247`** (`-inset-x-[77px]`, `13` celulas de `19px` para cada lado da corda, sem aumentar mais).
  2. Remover integralmente o hover local da malha: `BeamMeshPointerState` em `src/types/landing.ts`, `pointerRef` + constantes `SENSE_*` + `smoothstep` + `useEffect` de `pointermove`/`scroll`/`resize`/`blur`/`pointerleave` em `HeroBeamLazy.tsx`, e uniforms `uMouse`/`uHover` + amortecimento em `useFrame` + `innerGlow`/`ringWave`/`hoverDots`/`cursorHalo` em `HeroBeamCanvas.tsx`.
  3. Reduzir `CANVAS_WIDTH` de `680` para **`504` (`2 * 247 + 10px`)** e restaurar `src/components/sections/HeroSection.tsx` sem `lg:overflow-x-clip`.
- **Rationale**:
  - Com `CANVAS_WIDTH = 504` (`±252px` a partir de `BEAM_CENTER = 170`), na menor viewport Desktop (`1024px` menos `17px` de barra de rolagem = `1007px`), a borda direita do canvas fica em `0.621 * 1007 + 97 + 252 = 974.3px < 1007px`. Isso reduz `26%` de pixels processados por quadro no WebGL e mantem `HeroSection.tsx` identico ao commit `333c3a4`.

## R-02: Geometria da Onda Continua em Tempo Integral na Malha do Hero (`HeroBeamCanvas.tsx`)

- **Decision**: Implementar no fragment shader de `HeroBeamCanvas.tsx` uma **onda progressiva simetrica ancorada na curva viva da corda**, rodando `100%` do tempo via `uTime`:
  - Para cada celula `cellCenter`, calcular a posicao horizontal real da corda naquela altura (`cellCurveX` avaliando a Bezier cubica em `tCell = clamp(cellCenter.y / max(uTipY, 1.0), 0.0, 1.0)`) e a distancia lateral ao fio `cordDist = abs(cellCenter.x - cellCurveX)`.
  - Definir a fase `wavePhase = cordDist * 0.036 + cellCenter.y * 0.015 - uTime * 2.0`: quando `uTime` cresce, as cristas (`waveCrest = pow(0.5 + 0.5 * sin(wavePhase), 2.2)`) deslizam de cima para baixo ao longo do fio (`dy/dt > 0`) enquanto se abrem simetricamente para os lados (`dd/dt > 0`, comprimento de onda `~175px`, periodo `~3.14s`).
  - Multiplicar toda a modulacao da onda por `baseMask * exp(-cordDist / 155.0)`, garantindo **zero expansao do campo de `247px`** e preservando o formato em gradiente mais forte perto da corda e mais fraco longe dela.
  - Modular brilho (`+0.36` de alpha nas cristas perto do fio), raio do ponto (`1.4px -> 1.85px`), cor (`#7A67FF -> #C082FF -> #E9D4FF`) e micro-ondulacao espacial (`<= 1.3px` dentro da celula de `19px`), somando `pulseWake` quando `beamPulse` (`uPulse`) desce pela corda.

## R-03: Inspecao de `https://kc1t.com/pt-br` e Escolha de Canvas 2D Compacto (`translate3d`)

- **Inspection Summary (`https://kc1t.com/pt-br`)**: A versao padrao `v3` (`/_next/static/chunks/4070-d1fd57b5a2b109f0.js`, modulo `17429`) usa um `<canvas>` **2D** compacto filtrado por uma **matriz ordenada de Bayer `4x4`** (`[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]] / 16`), coroa respirante (`0.78 + 0.09 * sin(3 * theta - 2.2 * t) + 0.05 * sin(1.4 * t)`), perseguicao inercial por `transform: translate3d(...)` (`will-change: transform`), expansao ao passar sobre `a, button, [role='button']` e substituicao da seta nativa em ponteiros finos.
- **Comparativo de Custo Global**:
  - **Alternativa descartada**: Camada CSS `fixed inset-0` com `mask-image: radial-gradient(circle at var(--mx) var(--my), ...)` re-rasteriza `~2.07M` pixels por frame na thread de pintura.
  - **Solucao implementada**: `<canvas>` 2D compacto (`88 x 88 px`, `getContext("2d")`, `22 x 22 = 484` celulas de passo `4px`, pontos `2x2 px`) movido por `translate3d`, com **zero contextos WebGL novos** e **loop `rAF` hibernante** (`rafId = -1` no carregamento inicial e apos `pointerleave`/`blur`/`visibilitychange`).

## R-04: Evolucao Pos-Revisao: A Malha Virou o Proprio Cursor (`z-50` + `.cursor-mesh`)

- **Decision (`Handoff 07`)**:
  1. **Camada superior `z-50` com blending normal**: Na revisao visual inicial, a malha em `z-0` atras do conteudo nao aparecia sobre o bloco opaco do `Banner`. Joao pediu que o efeito aparecesse sobre o `Banner` e que **a seta do mouse fosse representada apenas pelo espectro ondulante**, igual ao `kc1t.com/pt-br`. Por isso, `CursorDotMesh` passou para `fixed inset-0 z-50` acima de tudo, e os wrappers `relative isolate` em `LandingMotionController.tsx` e `relative z-10` em `page.tsx` e `Footer.tsx` foram desfeitos.
  2. **Descarte de `mix-blend-screen`**: Um teste intermediario com `mix-blend-screen` fazia o espectro sumir sobre o botao claro (`bg-purple-01`) do `Banner`. O blending normal com cor `#C9B3FF` e `MAX_ALPHA = 0.9` (`field * 0.95`) mantem legibilidade nitida tanto no fundo `#09090B` quanto sobre o botao claro.
  3. **Seta nativa oculta com fallback seguro**: Quando o canvas monta em ambiente `canHover && !reduceMotion`, `document.documentElement.classList.add("cursor-mesh")` ativa `.cursor-mesh, .cursor-mesh * { cursor: none !important }` em `globals.css`, removendo a classe no cleanup. Em toque, movimento reduzido ou falha de JS, a seta nativa permanece ativa.
  4. **Resposta rapida e visibilidade continua no card**: Como a malha faz o papel da seta, `FOLLOW_RATE` subiu de `11` para `24` (seguindo quase colado ao mouse, com leve resto de inercia) e `cardMute`/`targetCardMute` foram removidos de `CursorMeshRuntimeState` para que o cursor nunca suma sobre `[data-card-stage]`.

## R-05: Selecao de Texto da Marca e Brilho Interativo `.btn-shine` em `@layer components`

- **Decision (`Handoff 07`)**:
  1. **Selecao global**: `::selection { background: rgb(167 81 251 / 0.45); color: #fff; }` em `src/app/globals.css`.
  2. **Brilho dos botoes (`.btn-shine`)**: Com a referencia visual de `https://21st.dev/@designali-in/components/shiny-button` (cota do MCP esgotada e pacotes externos vedados pela Constituicao), o efeito foi reconstruido em CSS puro com `@property --shine-angle` (`<angle>`) e `@keyframes shine-spin` (`2.4s linear infinite`):
     - Em repouso: `opacity: 0` e `animation-play-state: paused` nos pseudo-elementos, mantendo `100%` da aparencia do Figma.
     - Em `:hover` / `:focus-visible`: `::before` desenha um arco conico giratorio de `1.5px` na borda usando mascara composta (`content-box exclude` / `-webkit-mask ... xor`), `::after` varre micro-pontos de `4px x 4px` (`opacity: 0.45`) e `box-shadow` cria glow interno e externo misturando `var(--shine)` via `color-mix(in srgb, ...)`.
     - Em `:active` (clique): `translate: 0 1px`, `scale: 0.98`, `::after` em `opacity: 0.8` e `box-shadow` mais intenso (`80%`/`90%`).
     - Sob `prefers-reduced-motion: reduce`: `animation: none` e `translate: none; scale: none`.
  3. **Precedencia CSS (`@layer components`)**: `.btn-shine` define `--shine: #fff` dentro de `@layer components` para que os utilitarios arbitrarios de cada variante em `CtaButton.tsx` (`[--shine:#fff]`, `[--shine:#A751FB]`, `[--shine:#C082FF]`, gerados em `@layer utilities`) sobrescrevam o padrao sem conflito de especificidade. O botao `"Start now"` de `MagicCopyCard.tsx` usa o padrao `--shine: #fff` recebendo apenas a classe `btn-shine`.
