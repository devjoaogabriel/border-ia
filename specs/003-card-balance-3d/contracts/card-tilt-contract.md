# UI & Interaction Contract: Card Balance & 3D Drag (`003-card-balance-3d`)

**Feature**: `003-card-balance-3d`
**Date**: 2026-11-06

## 1. Contrato de Registro GSAP (`src/lib/gsap.ts`)

- Importar `Draggable` de `"gsap/Draggable"` e inclui-lo na chamada unica `gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, Draggable)` dentro da guarda `if (typeof window !== "undefined")`.
- Exportar `Draggable` junto a `gsap`, `ScrollTrigger`, `DrawSVGPlugin`, `useGSAP` e `beamPulse`.
- Zero pacotes novos em `package.json`.

---

## 2. Contrato DOM e Camadas entre Feixe e Card

### 2.1 `HeroBeamLazy.tsx` (`src/components/three/HeroBeamLazy.tsx`)
- Constantes geometricas:
  - `BEAM_WIDTH = 340`
  - `BEAM_VISIBLE_HEIGHT = 497`
  - `BEAM_OVERLAP = 20`
  - `BEAM_TOTAL_HEIGHT = BEAM_VISIBLE_HEIGHT + BEAM_OVERLAP` (`517`)
- Posicionamento:
  - Container raiz mantem `pointer-events-none absolute left-[97px] z-0 hidden -translate-x-1/2 lg:block`, alterando `bottom-full` para `bottom-[calc(100%-20px)]` (mantendo o topo do container a exatos `497px` acima do card e descendo a base `20px` para tras do topo do card) e `height: BEAM_TOTAL_HEIGHT`. As camadas decorativas largas (`DotMatrixDecor` e o `radial-gradient`) mantem `bottom-5` (`bottom: 20px`) para nao vazar nas laterais, enquanto a linha central `w-1` e o `HeroBeamCanvas` cobrem os `517px` completos.
  - Em repouso (`0°`), o topo do feixe continua exatamente a `497px` acima do card e os `20px` inferiores permanecem ocultos atras de `bg-gray-11` (`z-10` no palco do card).
  - Sob inclinacao maxima (`±14°` vertical / `±16°` horizontal), os `20px` cobrem integralmente a retracao perspectiva maxima (`~16.2px`), garantindo `0px` de vao escuro.

### 2.2 `MagicCopyCard.tsx` (`src/components/ui/MagicCopyCard.tsx`)
- Estrutura de dois niveis para preservar perspectiva + `overflow-hidden` + compatibilidade com `scale-[0.885]` do pai:
  ```html
  <div ref={stageRef} data-card-stage class="relative z-10 [perspective:900px]">
    <div
      ref={cardRef}
      data-card-body
      role="group"
      aria-label="Demonstração do plugin Magic copy"
      class="relative h-[405px] w-[324px] touch-pan-y overflow-hidden rounded-xl border border-[#9C7BFF] bg-gray-11 p-10 will-change-transform ..."
    >
      <!-- camadas internas de glow, header com PluginPrismLogoLazy, prompt, Generating... e button Start now -->
    </div>
  </div>
  ```
- Atributos de acessibilidade e interacao:
  - Nenhum `tabIndex`, `role="button"` ou `aria-grabbed` e adicionado ao card (o arraste e 100% decorativo).
  - O `<button ref={buttonRef} type="button" data-no-card-drag ...>` de `"Start now"` mantem `cursor-pointer` explicito para sobressair sobre o `cursor: grab` da superficie do card no Desktop.
  - Durante o arraste ativo no mouse, o card aplica `select-none` (ou `userSelect: "none"` gerenciado pelo `Draggable`) para impedir selecao acidental dos textos internos.

---

## 3. Contrato Matematico do Mapeamento Ponteiro -> Inclinacao 3D

Dentro de `mm.add({ canAnimate: "(prefers-reduced-motion: no-preference)", canDrag: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)" }, ...)`:

1. **Reset do Proxy sem Acumulo entre Arrastes**:
   - Criar `const proxy = document.createElement("div");` em memoria (sem anexar ao DOM visivel ou oculto sem impacto de layout).
   - Em `onDragStart`: registrar `originX = this.x`, `originY = this.y` e medir `rect = cardEl.getBoundingClientRect()` (garantindo compensacao automatica de `scale-[0.885]` abaixo de `lg`). Cancelar qualquer tween de `rebound` em andamento, pausar `balanceTl` e animar `scale -> 1.015` (`0.2s`, `power2.out`).
2. **Direcao Fisica Natural nas 4 Direcoes (`onDrag`)**:
   - `dx = this.x - originX` (positivo para a direita, negativo para a esquerda).
   - `dy = this.y - originY` (positivo para baixo, negativo para cima).
   - `normX = dx / Math.max(rect.width * 0.5, 120)`
   - `normY = dy / Math.max(rect.height * 0.5, 150)`
   - `targetRotateY = Math.tanh(normX * 1.35) * 16` (`[-16°, +16°]`)
   - `targetRotateX = -Math.tanh(normY * 1.35) * 14` (`[-14°, +14°]`: arrastar para cima inclina para cima `+rotationX`; arrastar para baixo inclina para baixo `-rotationX`).
   - Aplicar via `quickRotateX(targetRotateX)` e `quickRotateY(targetRotateY)` (`duration: 0.12`, `ease: "power2.out"`), mantendo `x: 0` e `y: 0`.
3. **Retorno com Bounce e Retomada do Balance (`onDragEnd`)**:
   - Animar `cardEl` para `{ rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" }`.
   - Em `onComplete`: se `inViewportRef.current === true` e nao estiver em novo `dragging`, executar `balanceTl.restart()`.
4. **Cliques Curtos (`< 6px`) e Cliques em `"Start now"`**:
   - Como `minimumMovement: 6` e `dragClickables: false` estao ativos no `Draggable`, cliques `< 6px` em qualquer ponto do card e cliques sobre `"Start now"` **nao disparam `onDragStart` nem `onDragEnd`**, preservando `balanceTl` continua e `100%` dos cliques no botao.

---

## 4. Contrato de Preservação da Branch `main`

- **PROIBIDO** alterar `src/components/ui/animated-shiny-text.tsx` (brilho aprovado do `H1`), `src/components/ui/AnimatedStrokeWord.tsx` (oval de `"interfaces"` e rabisco de `"Border-IA"`) ou adicionar pacotes em `package.json`.
- **FORA DE ESCOPO**: `CM-10` do banner e `prefers-reduced-motion` geral nos hovers CSS fora do card permanecem como estao na `main`.
