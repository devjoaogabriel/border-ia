# Phase 0 Research: Movimento Conectado no Hero (`004-movimento-hero-conectado`)

**Feature**: `004-movimento-hero-conectado`
**Date**: 2026-11-07
**Base Codebase**: Branch `main` (`commit 7affc54`, apos `003-card-balance-3d` e atualizacao de SVGs/halos)

## R-01: Substituicao do Arraste (`Draggable`) por Hover 3D Continuo no `MagicCopyCard`

- **Decision**: Por decisao confirmada do Joao Gabriel (`FR-001`), remover o `Draggable` de `src/components/ui/MagicCopyCard.tsx` e seu registro/exportacao em `src/lib/gsap.ts`, substituindo a interacao Desktop (`canHover: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"`) exclusivamente por listeners `pointerenter`, `pointermove` e `pointerleave` escopados ao palco do card (`[data-card-stage]`).
- **Rationale**: Com a inclinacao 3D acompanhando diretamente o ponteiro em hover, o arraste com clique sai de cena, eliminando o cursor `grab` e qualquer disputa de `transform`. Calibrar os angulos maximos de `14°/16°` (pensados para esforco de arraste) para **`±10°` (`rotationX`) e `±12°` (`rotationY`)** com `scale: 1` evita inclinacao excessiva em passagens casuais do cursor.
- **Transicao sem salto na entrada e saida**:
  - Na entrada (`pointerenter` / `pointermove`), `balance.pause()` congela o card exatamente no angulo instantaneo atual e `tiltTo` interpola a partir desse estado ate o alvo do cursor com `duration: 0.28s` e `ease: "power2.out"` (`0.00°` de salto mesmo entrando pelas quinas).
  - Sobre o botao `"Start now"` (`buttonRef`), o ganho de inclinacao reduz-se suavemente a `0.35` (`35%`) para manter o botao firme sob o clique com `cursor-pointer` normal.
  - Na saida (`pointerleave` ou `window` `blur`), `tiltTo` retorna a `(0, 0, 0)` com `duration: 0.85s` e `ease: "elastic.out(1, 0.45)"`, chamando `balance.restart()` no `onComplete` (sem salto, pois `balance` inicia em `0°`).
- **Alternatives considered**:
  - Manter hover + arraste simultaneos: descartado por decisao expressa do autor no Handoff 04.

## R-02: Coexistencia com o Logo 3D (`PluginPrismLogo3D`)

- **Decision**: Reduzir `MAX_TILT` em `src/components/three/PluginPrismLogo3D.tsx` de `8°` para **`4.5°`** (`MathUtils.degToRad(4.5)`).
- **Rationale**: `PluginPrismLogo3D` escuta `pointermove` global na janela. Com o card inclinando ate `12°` em hover, `12° + 8° = 20°` somava rotacao excessiva no mesmo sentido. Em `4.5°`, o prisma continua vivo quando o mouse passeia fora do card e atua como paralaxe especular discreta quando o mouse esta sobre o card.
- **Alternatives considered**:
  - Desligar o `pointermove` do logo 3D: descartado porque empobreceria o brilho especular dos chanfros `meshPhysicalMaterial` quando o cursor se move fora do card no Hero.

## R-03: Geometria 3D e Fisica de Fio Flexivel na Linha do Feixe (`HeroBeamLazy` + `HeroBeamCanvas`)

- **Decision**: Substituir a `div.w-1` rigida de `src/components/three/HeroBeamLazy.tsx` por um `<svg>` com `<path>` Cubic Bezier parametrizado verticalmente de forma exata (`P0 = (170, 0)`, `P1 = (170, H/3)`, `P2 = (170 + bendX, 2H/3)`, `P3 = (170 + tipX, H)`) usando `<linearGradient gradientUnits="userSpaceOnUse">`, sincronizado a cada quadro ativo com o shader de `src/components/three/HeroBeamCanvas.tsx` pelos uniforms `uBendX`, `uTipX` e `uTipY`.
- **Rationale**:
  1. **Projecao 3D exata da ponta (`tipX`, `tipY`)**: No espaco local do card (`324x405`, centro `(162, 202.5)`, `perspective: 900px`), o feixe toca a borda superior em `(px, py, pz) = (-65, -202.5, 0)`. Projetando esse ponto pelas rotacoes instantaneas `(rotationX, rotationY, rotation)` do card e somando `BEAM_TUCK = 14px` de sangria oculta atras do card opaco (`z-10` com `isolate`, container do feixe com `BEAM_OVERLAP = 28px`, `height: 525px`, `bottom-[calc(100%-28px)]`), a ponta acompanha a borda superior com **`0px` de fresta em qualquer angulo**.
  2. **Curvatura realista com inercia (`bendX`)**: Uma rotacao pura `rotateY(12°)` desloca geometricamente o ponto `x = -65` em apenas `~1.4px` na horizontal, o que deixaria uma reta de `497px` visualmente estatica. Ja um fio flexivel plugado perpendicularmente na face superior do card sofre flexao na barriga inferior proporcional a inclinacao angular da face (`targetBendX = tipX + Math.sin(ry) * 95 + Math.sin(rz) * 40`), filtrada por uma mola amortecida de 2a ordem (`stiffness = 140`, `damping = 14`). Isso gera `~±4.6px` de onda sutil no balance, ate `~±20px` de curvatura organica no hover e oscilacao amortecida realista no bounce de saida.
  3. **Identidade algebrica exata entre SVG e Shader (`y(t) = t * H`)**: Como as ordenadas dos pontos de controle sao `0`, `H/3`, `2H/3` e `H`, o polinomio de Bezier cubico em `y` reduz-se exatamente a `y(t) = t * H` para todo `t` em `[0, 1]`. Assim, no fragment shader basta calcular `t = clamp(px.y / uTipY, 0.0, 1.0)` e `curveX = 3.0 * (1.0 - t) * t * t * uBendX + t * t * t * uTipX`, garantindo que o rastro do `beamPulse` percorra **exatamente** o centro da linha curva sem custo de iteracao numerica e sem jamais descolar.
  4. **Protecao WebKit/SVG em `0°`**: Em SVG, um `<path>` perfeitamente vertical (`bendX = 0, tipX = 0`) tem bounding box de largura `0`, o que faz `<linearGradient>` padrao (`objectBoundingBox`) desaparecer por divisao por zero no Safari/WebKit e Chrome. Declarar `gradientUnits="userSpaceOnUse"` mantem a linha 100% visivel em `0°` e em `prefers-reduced-motion: reduce`.
- **Alternatives considered**:
  - Rotacionar a `div.w-1` com `transform: rotate(...)`: descartado porque uma haste rigida nao dobra como fio fisico e deslocaria ou quebraria o topo.
  - Desenhar a linha estatica dentro do proprio shader WebGL: descartado porque violaria o Principio II da Constituicao (fallback estatico em CSS/SVG identico ao layout no primeiro paint e sob movimento reduzido).

## R-04: Bounce Sutil na Janela `interface-figma` Sem Conflito de `transform`, Sem Repintura de Mascara e Sem Regressao de LCP

- **Decision**: Em `src/components/sections/HeroSection.tsx`, envolver o `<Image src="/images/hero-figma-ui.svg" />` em dois niveis semanticamente limpos:
  1. Externo `<div data-m="window">` (assume o posicionamento `absolute top-[71px] left-[23px] w-[725px] lg:static lg:w-full lg:max-w-[1216px]` e continua recebendo do `LandingMotionController` o reveal inicial e o scrub `y: -28`).
  2. Intermediario `<div data-m="window-float" className="will-change-transform">` (recebe exclusivamente a flutuacao vertical continua em `LandingMotionController.tsx`: `gsap.to("[data-m='window-float']", { y: isDesktop ? -6 : -4, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.1 })`, pausada fora da tela por `ScrollTrigger` em `#sobre`).
  3. Interno `<Image>` (mantem `[mask-image:linear-gradient(to_bottom,#000,transparent)]`, `aspect-[1216/660]`, `rounded-lg lg:rounded-xl`, `priority` e `unoptimized`, completamente estatico dentro de `[data-m="window-float"]`).
- **Rationale**:
  - **Zero conflito de `transform`**: `LandingMotionController` continua animando `[data-m="window"]` (`y: -28` no scroll) enquanto o loop continuo atua apenas em `[data-m="window-float"]`.
  - **Zero re-rasterizacao da mascara a cada frame**: Como `[mask-image:...]` fica no `<Image>` filho estatico e a translacao ocorre no pai `[data-m="window-float"]`, tanto Blink quanto WebKit (iOS Safari) promovem a camada ja mascarada uma unica vez na GPU e apenas transladam a textura no compositor.
  - **Protecao do LCP Mobile (~63)**: O `delay: 1.1` inicia a oscilacao somente apos a pintura inicial e o reveal da dobra, evitando mutacoes continuas durante a medicao do LCP.
  - **Zero corte visivel no Mobile**: Movimento estritamente vertical (`x = 0`, sem rotacao) de `-4px` mantem a lateral esquerda cravada em `23px`, nao gera overflow horizontal e mantem a base dentro da zona `transparent` do fade linear acima de `446px`.
- **Alternatives considered**:
  - Animar o proprio `<Image data-m="window">`: descartado porque colidiria diretamente com o `y: -28` do `ScrollTrigger` existente em `LandingMotionController.tsx`.
  - Reagir apenas ao scroll ou apenas ao mouse: descartado porque ficaria imovel sempre que o visitante parasse de rolar no Desktop e 100% inerte em telas de toque (iPhone).

## R-05: Compatibilidade WebKit (Safari / iPhone) e Governanca de Performance

- **Decision**:
  1. Adicionar `isolate` em `[data-card-stage]` (`src/components/ui/MagicCopyCard.tsx`) para blindar o contexto de empilhamento 3D no WebKit contra intersecao de profundidade (`Z-fighting`) com `hero-figma-ui.svg` e `HeroBeamLazy` atras do card.
  2. Exigir validacao automatizada/interativa em **Chromium e WebKit** (Playwright `chromium` + `webkit` em `1440x900` e `430x932`) cobrindo visibilidade da linha em `0°`, recorte Mobile de `#sobre`, ausencia de `scrollWidth > clientWidth` e fluidez do hover/bounce.
  3. Exigir medicao de Lighthouse Mobile e Desktop (mediana de 3 execucoes em build de producao) **antes e depois** da implementacao para comprovar nao-regressao frente a base Mobile (~`63`).
- **Rationale**: Atende diretamente o alerta do Handoff 04 sobre bugs recentes exclusivos do WebKit no iPhone do Joao e sobre a meta de nao degradar o Lighthouse Mobile.
