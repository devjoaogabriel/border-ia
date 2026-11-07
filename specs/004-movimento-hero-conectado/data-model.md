# Phase 1 Data Model: Movimento Conectado no Hero (`004-movimento-hero-conectado`)

**Feature**: `004-movimento-hero-conectado`
**Date**: 2026-11-07
**Source Files**: `src/types/landing.ts`, `src/lib/gsap.ts`, `src/components/ui/MagicCopyCard.tsx`, `src/components/three/HeroBeamLazy.tsx`, `src/components/three/HeroBeamCanvas.tsx`, `src/components/three/PluginPrismLogo3D.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/motion/LandingMotionController.tsx`

## 1. Configuracao de Hover e Balance do Card (`CardTiltPhysicsConfig`)

Atualizacao da interface em `src/types/landing.ts` (substituindo os campos de `drag*` pelos campos de `hover*` conforme `FR-001`):

| Parametro | Tipo | Valor Calibrado | Papel Fisico |
|-----------|------|-----------------|--------------|
| `balanceSegmentSec` | `number` | `1.4` | Duracao de cada um dos 4 trechos senoidais (`5.6s` por ciclo completo). |
| `balanceKeyframes` | `readonly object[]` | `(2, -2.8, -0.5)` -> `(-1.4, 2.4, 0.6)` -> `(1.6, 2.8, -0.4)` -> `(0, 0, 0)` | Oscilacao em repouso iniciando e encerrando exatamente em `(0°, 0°, 0°)`. |
| `hoverMaxRotateX` | `number` | `10` | Limite maximo vertical (`±10°`) em hover (reduzido dos `14°` do antigo arraste). |
| `hoverMaxRotateY` | `number` | `12` | Limite maximo horizontal (`±12°`) em hover (reduzido dos `16°` do antigo arraste). |
| `hoverFollowSec` | `number` | `0.28` | Janela de interpolacao `power2.out` para transicao sem salto na entrada e acompanhamento macio. |
| `hoverCtaDamping` | `number` | `0.35` | Fator multiplicador (`35%`) quando o ponteiro esta sobre o botao `"Start now"`. |
| `reboundSec` | `number` | `0.85` | Duracao do retorno elastico a `(0, 0, 0)` em `pointerleave` / `blur`. |
| `reboundEase` | `string` | `"elastic.out(1, 0.45)"` | Curva de mola amortecida centrada em `0°` no retorno ao balance. |

## 2. Ponte de Estado em Tempo Real Card -> Feixe (`HeroCardMotionBridge`)

Objeto mutavel leve exportado em `src/lib/gsap.ts` (seguindo o mesmo padrao zero-rerender ja usado por `beamPulse`):

| Campo | Tipo | Valor Inicial | Descricao |
|-------|------|---------------|-----------|
| `rotationX` | `number` | `0` | Inclinacao vertical instantanea do card em graus (`[-10, +10]`). |
| `rotationY` | `number` | `0` | Inclinacao horizontal instantanea do card em graus (`[-12, +12]`). |
| `rotation` | `number` | `0` | Rotacao planar instantanea do card em graus (`[-0.6, +0.6]`). |
| `bendX` | `number` | `0` | Deslocamento horizontal amortecido (em `px`) do ponto de controle `P2` da curva do feixe, escrito pelo loop do feixe e lido pelo shader. |
| `tipX` | `number` | `0` | Deslocamento horizontal projetado (em `px`, relativo a `x = 97`) da ponta `P3` no topo do card. |
| `tipY` | `number` | `497 + 14` (`511`) | Coordenada vertical total (em `px` a partir do topo do feixe) da ponta `P3` incluindo a sangria oculta `BEAM_TUCK = 14`. |

## 3. Parametros Fisicos da Linha Conectada (`ConnectedBeamPhysics`)

Constantes internas de `src/components/three/HeroBeamLazy.tsx` (Desktop `>= 1024px`):

| Constante | Valor | Papel Geometrico / Fisico |
|-----------|-------|---------------------------|
| `BEAM_WIDTH` | `340` | Largura do container e do `<svg>`/`<Canvas>` (`centro X = 170`). |
| `BEAM_VISIBLE_HEIGHT` | `497` | Altura visivel acima do topo do card em repouso (`0°`), identica ao Figma. |
| `BEAM_OVERLAP` | `28` | Margem inferior oculta atras do card (`height = 525`, `bottom-[calc(100%-28px)]`). |
| `BEAM_TUCK` | `14` | Penetracao da ponta `P3` atras da borda superior opaca do card para `0px` de fresta. |
| `CARD_ANCHOR_LOCAL_X` | `-65` | `97 - 162`: posicao X do feixe relativa ao centro do card (`324px / 2 = 162`). |
| `CARD_ANCHOR_LOCAL_Y` | `-202.5` | `0 - 202.5`: borda superior do card relativa ao centro (`405px / 2 = 202.5`). |
| `CARD_PERSPECTIVE` | `900` | Mesma distancia de perspectiva CSS aplicada em `[data-card-stage]`. |
| `TETHER_SWAY_GAIN` | `95` | Ganho lateral (`px`) de flexao da barriga `P2` por `sin(rotationY)`. |
| `SPRING_STIFFNESS` | `140` | Constante de mola `k` de `bendX` para resposta viva sem vibracao excessiva. |
| `SPRING_DAMPING` | `14` | Coeficiente de amortecimento `c` de `bendX` (leve overshoot organico e estabilizacao limpa). |

## 4. Maquina de Estados de Interacao do Card (`CardTiltInteractionState`)

`export type CardTiltInteractionState = "balancing" | "hovering" | "rebounding";`

| Estado | Entrada | Comportamento | Saida |
|--------|---------|---------------|-------|
| `balancing` | Inicial (com `no-preference`) ou fim de `rebounding` | `balance` timeline ativa em loop de `5.6s` (pausada se `!inViewport`). | -> `hovering` em `pointerenter` (`canHover`). |
| `hovering` | `pointerenter` / `pointermove` em `canHover` | `balance.pause()`; `tiltTo` segue cursor (`±10°`/`±12°`, ou `35%` sobre `"Start now"`). | -> `rebounding` em `pointerleave`, `window` `blur` ou perda de visibilidade. |
| `rebounding` | `pointerleave` ou `blur` a partir de `hovering` | `tiltTo` retorna a `(0, 0, 0)` com `elastic.out(1, 0.45)` em `0.85s`. | -> `balancing` em `onComplete` (`balance.restart()`); -> `hovering` se `pointerenter` ocorrer no meio do bounce. |

## 5. Camada de Bounce da Janela do Figma (`FigmaWindowFloatConfig`)

Configuracao escopada em `src/components/motion/LandingMotionController.tsx`:

| Parametro | Desktop (`>= 1024px`) | Mobile (`< 1024px`) | Regra |
|-----------|-----------------------|---------------------|-------|
| Seletor | `[data-m="window-float"]` | `[data-m="window-float"]` | Filho de `[data-m="window"]` e pai do `<Image>` mascarado. |
| Deslocamento `y` | `0 -> -6px -> 0` | `0 -> -4px -> 0` | Estritamente vertical (`x = 0`, `rotation = 0`). |
| Duracao / Ciclo | `2.4s` por meia-onda (`4.8s` ciclo total) | `2.4s` por meia-onda (`4.8s` ciclo total) | `ease: "sine.inOut"`, `repeat: -1`, `yoyo: true`, `delay: 1.1`. |
| Pausa fora de tela | `ScrollTrigger` em `#sobre` | `ScrollTrigger` em `#sobre` | `paused(!isActive)` em `start: "top bottom", end: "bottom top"`. |
