# Phase 0 Research: Balance Sutil e Arraste 3D no Card Magic Copy

**Feature**: `003-card-balance-3d`
**Date**: 2026-11-06
**Base Codebase**: Branch `main` (`commit 325dbfb` + brilho aprovado no `H1` em `src/components/ui/animated-shiny-text.tsx`)

## R-01: Mecanismo de Arraste 3D sem Novas Dependencias (`Draggable` Proxy vs Eventos Manuais)

- **Decision**: Utilizar `Draggable` do pacote `gsap` ja instalado (`import { Draggable } from "gsap/Draggable"`, registrado uma unica vez em `src/lib/gsap.ts`) operando sobre um elemento `proxy` desconectado (`document.createElement("div")`) com `trigger: cardRef.current`, `type: "x,y"`, `minimumMovement: 6` e `dragClickables: false`, criado exclusivamente dentro da condicao `canHover && !reduceMotion` de `gsap.matchMedia()`. Os deltas `(dx, dy)` lidos em `onDrag` (relativos a posicao do `proxy` no `onDragStart`) alimentam funcoes `gsap.quickTo` para `rotationX` e `rotationY` no card, mantendo `x: 0` e `y: 0` fixos no DOM.
- **Rationale**: `Draggable` nao possui modo nativo `rotationX/rotationY`, mas o padrao oficial de `proxy` invisivel aproveita toda a infraestrutura robusta do plugin (limiar `minimumMovement: 6`, exclusao automatica de `<button>` via `dragClickables: false`, captura global de ponteiro fora da janela, prevencao de selecao de texto e troca de cursor `grab`/`grabbing`) sem deslocar o card do lugar e sem instalar nenhum pacote novo.
- **Alternatives considered**:
  - `Draggable` direto no card com `type: "x,y"`: descartado porque desloca fisicamente o card pela tela, abrindo vao em relacao ao feixe do Hero e saindo da composicao do Figma.
  - Listeners manuais de `pointerdown`/`pointermove`/`pointerup`: descartado porque reimplementaria manualmente tratamento de `minimumMovement`, captura de janela, cancelamento de clique e exclusao de clicaveis que o `Draggable` ja resolve e reverte junto ao GSAP.

## R-02: Curva de Retorno com Bounce (`elastic.out` vs `CustomBounce` / `InertiaPlugin`)

- **Decision**: Adotar `ease: "elastic.out(1, 0.45)"` com `duration: 0.9` no `gsap.to` disparado em `onDragEnd` para retornar `rotationX`, `rotationY`, `rotationZ` a `0` e `scale` a `1`, sem carregar `InertiaPlugin` nem `CustomBounce`.
- **Rationale**: Fisicamente, `CustomBounce` simula colisao unilateral contra um piso rigido (valores sempre do mesmo lado de `0`), o que parece artificial para um cartao suspenso em perspectiva 3D. Ja `elastic.out(1, 0.45)` faz parte do core do GSAP (custo zero de bundle, essencial diante do Lighthouse Mobile atual em `63` e Desktop em `75`) e produz exatamente o bounce de mola amortecida passando levemente pelo plano central `0°` antes de estabilizar.
- **Alternatives considered**:
  - `CustomBounce`: descartado por quicar apenas de um lado do eixo sem cruzar `0°` como um pendulo/mola 3D e adicionar peso extra de plugin.
  - `back.out(2)`: descartado por ter apenas um unico overshoot curto em vez da sensacao clara de bounce pedida pelo Joao.

## R-03: Transicao Sem Salto entre Bounce de Retorno e Balance Continuo

- **Decision**: Estruturar a `gsap.timeline({ repeat: -1 })` do balance sutil em 4 segmentos senoidais (`ease: "sine.inOut"`, `1.4s` cada, totalizando `5.6s`) partindo exatamente da pose neutra `(rotationX: 0, rotationY: 0, rotationZ: 0)` em `t = 0` e retornando a `(0, 0, 0)` no fechamento do ciclo:
  1. `0.0s -> 1.4s`: `rotationX: 2.0`, `rotationY: -2.8`, `rotationZ: -0.5`
  2. `1.4s -> 2.8s`: `rotationX: -1.4`, `rotationY: 2.4`, `rotationZ: 0.6`
  3. `2.8s -> 4.2s`: `rotationX: 1.6`, `rotationY: 2.8`, `rotationZ: -0.4`
  4. `4.2s -> 5.6s`: `rotationX: 0`, `rotationY: 0`, `rotationZ: 0`
  Pausar a timeline apenas em `onDragStart` (nao em `onPress`, preservando cliques `< 6px`) e, no `onComplete` do tween de retorno elastico (`onDragEnd`), chamar `balanceTl.restart()` caso o card esteja visivel na viewport.
- **Rationale**: Como o tween de bounce termina exatamente em `(0, 0, 0)` e o frame `t = 0` da `balanceTl` tambem e `(0, 0, 0)` com derivada inicial suave (`sine.inOut`), `balanceTl.restart()` retoma o movimento autonomo com continuidade geometrica exata (`0.00°` de salto).
- **Alternatives considered**:
  - Dois wrappers aninhados somando `balance` (pai) + `drag` (filho) ao mesmo tempo: descartado porque o card continuaria balancando sozinho enquanto o usuario segura o mouse parado, reduzindo a sensacao de controle tatil direto, alem de exigir `transform-style: preserve-3d`.

## R-04: Geometria do Encontro entre o Feixe Vertical e o Topo Inclinado do Card

- **Decision**: Em `src/components/three/HeroBeamLazy.tsx`, adicionar uma sangria inferior oculta `BEAM_OVERLAP = 20` (`height: BEAM_HEIGHT + BEAM_OVERLAP = 517`, posicionado com `bottom: calc(100% - 20px)` e `z-0`), mantendo o palco do `MagicCopyCard` em `relative z-10`. Ajustar proporcionalmente o limite util de `uPulse` ou manter o feixe CSS/WebGL estendido nesses `20px` atras do fundo opaco `bg-gray-11` do card.
- **Rationale**: O `MagicCopyCard` mede `324 x 405 px` (semialtura `202.5px`). Sob inclinacao maxima de `rotationX = ±14°` e `rotationY = ±16°` com `perspective: 900px` e `transformOrigin: "50% 50%"`, a projecao 2D da borda superior em `x = 97px` retrai ate `~16.2px` para baixo na tela. Com `20px` de sangria atras do card opaco (`bg-gray-11`), em repouso (`0°`) os `20px` ficam 100% ocultos (aparencia identica ao Figma, `497px` visiveis acima do card) e, sob inclinacao maxima, o feixe permanece visualmente colado a borda superior sem abrir qualquer fresta escura.
- **Alternatives considered**:
  - Usar `transformOrigin: "50% 0%"` (pivo cravado na borda superior): descartado porque arrastar para cima e para baixo girando apenas pela aresta do topo faz a metade inferior deslocar quase o dobro em Z (`405 * sin(14°) ≈ 98px`), distorcendo demais o botao `"Start now"` e parecendo uma portinhola pendurada em vez de um card 3D equilibrado nas quatro direcoes.

## R-05: Palco de Perspectiva com `overflow-hidden` e Container Pai `scale-[0.885]`

- **Decision**: Envolver o `div` principal do `MagicCopyCard` (`overflow-hidden rounded-xl`) em um container imediato `[data-card-stage]` com `className="relative z-10 [perspective:900px]"`, aplicando `rotationX`, `rotationY`, `rotationZ` e `scale` no proprio elemento do card (`[data-card-body]`) com `transformOrigin: "50% 50%"`. Na conversao de pixels arrastados para graus, normalizar `dx` e `dy` pela largura/altura renderizada lida via `cardRef.current.getBoundingClientRect()` no inicio do arraste, aplicando curva suave `Math.tanh(norm * 1.35)` multiplicada pelos limites `16°` e `14°`.
- **Rationale**: Separar o no que declara `perspective: 900px` (`[data-card-stage]`) do no rotacionado com `overflow-hidden` (`[data-card-body]`) evita o achatamento de `preserve-3d` imposto pela especificacao CSS Filter/Transforms quando `overflow != visible`, preserva o recorte arredondado dos halos internos (`[data-card-glow]`, `[data-card-burst]`) e funciona identicamente dentro do wrapper `scale-[0.885] origin-top-right` usado em `HeroSection.tsx` abaixo de `1024px`.
- **Alternatives considered**:
  - Remover `overflow-hidden` do `MagicCopyCard`: descartado porque vazaria o `blur-[50px]` (`bg-indigo-10/35`) para fora das bordas do card, quebrando a fidelidade ao Figma.

## R-06: Toque Mobile, Scroll Suave (Lenis), Pausa Fora de Tela e Movimento Reduzido

- **Decision**:
  1. **Toque e Lenis**: Usar a sintaxe de condicoes nomeadas do `gsap.matchMedia()` (`canAnimate: "(prefers-reduced-motion: no-preference)"`, `canDrag: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"`). Em telas de toque (`canDrag === false`), `Draggable` nem e instanciado e o card mantem `touch-action: pan-y` padrao, garantindo zero bloqueio da rolagem vertical no celular e zero conflito com o Lenis. No Desktop (`canDrag === true`), o `Draggable` atua sobre o `proxy` em eventos de ponteiro sem interceptar eventos `wheel` do Lenis.
  2. **Fora da tela**: Criar `ScrollTrigger.create({ trigger: stageRef.current, start: "top bottom", end: "bottom top", onToggle: ... })` dentro de `canAnimate` para pausar `balanceTl` quando o Hero sai de vista e dar `play()` ao retornar (respeitando se nao estiver em `dragging` ou `rebounding`).
  3. **Movimento reduzido**: Quando `prefers-reduced-motion: reduce` estiver ativo, `gsap.matchMedia()` nao executa (ou reverte imediatamente em tempo real) tanto a `balanceTl` quanto a instancia `Draggable` e qualquer tween de bounce, mantendo o card plano, sem `cursor-grab` e sem animacao residual.
- **Rationale**: Atende simultaneamente todos os criterios de UX mobile, coexistencia com Lenis, economia de CPU fora da viewport e conformidade estrita com o Principio III da Constituicao (`v1.1.0`).
- **Alternatives considered**:
  - Permitir arraste instantaneo sem bounce em `prefers-reduced-motion: reduce`: descartado porque a propria inclinacao perspectiva `rotateX/rotateY` sob movimento do mouse e um estimulo vestibular desnecessario para interacao puramente decorativa (WCAG 2.3.3).
