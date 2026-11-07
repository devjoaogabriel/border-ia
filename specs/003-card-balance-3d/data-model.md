# Phase 1 Data Model: Balance Sutil e Arraste 3D no Card Magic Copy

**Feature**: `003-card-balance-3d`
**Date**: 2026-11-06
**Source Files**: `src/types/landing.ts`, `src/lib/gsap.ts`, `src/components/ui/MagicCopyCard.tsx`, `src/components/three/HeroBeamLazy.tsx`

## 1. Configuracao Calibrada de Fisica e Movimento (`CardTiltPhysicsConfig`)

Constante tipada a ser declarada em `src/components/ui/MagicCopyCard.tsx` (ou exportada em `src/types/landing.ts` + `src/lib/constants.ts`) para manter todos os parametros auditaveis em um unico ponto:

| Parametro | Tipo | Valor Calibrado | Regra e Papel Fisico |
|-----------|------|-----------------|----------------------|
| `perspectivePx` | `number` | `900` | Distancia da camera CSS no wrapper `[data-card-stage]` (`[perspective:900px]`). |
| `balanceAmplitudeX` | `number` | `2.0` | Inclinacao maxima vertical (`rotationX`, em graus) durante o balance em repouso. |
| `balanceAmplitudeY` | `number` | `2.8` | Inclinacao maxima horizontal (`rotationY`, em graus) durante o balance em repouso. |
| `balanceAmplitudeZ` | `number` | `0.6` | Micro-oscilacao planar (`rotationZ`, em graus) para organicidade do balance. |
| `balancePeriodSec` | `number` | `5.6` | Duracao total de 1 ciclo completo (`4` trechos de `1.4s` com `sine.inOut`), iniciando e fechando em `(0, 0, 0)`. |
| `dragMinMovementPx` | `number` | `6` | Limiar `minimumMovement` do `Draggable` entre clique simples (`< 6px`) e arraste (`>= 6px`). |
| `dragMaxRotateX` | `number` | `14` | Limite assintotico vertical (`±14°`) durante o arraste (`-dy` -> `+rotationX`). |
| `dragMaxRotateY` | `number` | `16` | Limite assintotico horizontal (`±16°`) durante o arraste (`+dx` -> `+rotationY`). |
| `dragPressScale` | `number` | `1.015` | Destaque sutil de escala enquanto `dragging` estiver ativo (`x = 0`, `y = 0` fixos). |
| `dragFollowDuration` | `number` | `0.12` | Janela de suavizacao do `gsap.quickTo` durante o arraste (`power2.out`). |
| `reboundDurationSec` | `number` | `0.9` | Duracao do retorno ao soltar o ponteiro ate `(0, 0, 0)` e `scale: 1`. |
| `reboundEase` | `string` | `"elastic.out(1, 0.45)"` | Curva elastica amortecida centrada em `0°` para o bounce de retorno. |
| `beamOverlapPx` | `number` | `20` | Sobreposicao oculta do feixe (`HeroBeamLazy`) atras do topo opaco do card no Desktop. |

## 2. Maquina de Estados de Interacao (`CardTiltInteractionState`)

Estado interno (mantido em `useRef` dentro de `useGSAP` para zero re-renders React a 60/120fps):

| Estado | Condicao de Entrada | Comportamento Ativo | Transicoes Permitidas |
|--------|---------------------|---------------------|-----------------------|
| `static` | `prefers-reduced-motion: reduce` OU card fora da viewport (`!inViewport`) | `balanceTl` pausada/inexistente; `rotationX = 0`, `rotationY = 0`, `rotationZ = 0`, `scale = 1`. | -> `balancing` (quando `no-preference` e entra na viewport). |
| `balancing` | `no-preference` E card em viewport E sem arraste/retorno ativo | `balanceTl` executando loop continuo de `5.6s` ao redor de `(0, 0, 0)`. | -> `dragging` (`onDragStart` apos `>= 6px` em `canHover`); -> `static` (saiu da tela ou ativou `reduce`). |
| `dragging` | `onDragStart` disparado no `Draggable` (fora de `"Start now"`) | `balanceTl.pause()`; tween de `rebound` anterior cancelado; `quickTo` atualiza `rotationX`/`rotationY` e `scale: 1.015`. | -> `rebounding` (`onDragEnd` / soltar / `blur`); -> `static` (ativou `reduce`). |
| `rebounding` | `onDragEnd` apos um arraste real | `gsap.to` retorna card para `(0, 0, 0)` e `scale: 1` em `0.9s` com `elastic.out(1, 0.45)`. | -> `balancing` (`onComplete` com `balanceTl.restart()` se `inViewport`); -> `dragging` (novo `onDragStart` interrompe o bounce); -> `static` (saiu da tela ou ativou `reduce`). |

## 3. Relacao com Estados Existentes do `MagicCopyCard`

| Mecanismo Existente | Propriedade Animada | Isolamento / Convivencia com a Feature 003 |
|---------------------|---------------------|--------------------------------------------|
| `beamPulse` + `[data-card-glow]` | `beamPulse.value` (`0..1`) + `opacity` em `[data-card-glow]` | Intacto; opera em elementos filhos internos sem tocar em `transform` do `[data-card-body]`. |
| Spinner `"Generating..."` (`[data-card-arc]`) | `rotation` no `<svg data-card-arc>` | Intacto; escopado ao SVG interno. |
| Botao `"Start now"` (`buttonRef`) | `burstSignal` (React state) + `opacity`/`borderColor` em `[data-card-burst]`/`[data-card-prompt]` | Protegido por `dragClickables: false` e `data-no-card-drag`; cliques nunca iniciam arraste. |
| `PluginPrismLogoLazy` / `PluginPrismLogo3D` | Rotacao interna WebGL (`±8°` em `pointermove`) | Convive como paralaxe interna sutil dentro da janela `56x40px` recortada pelo card. |
