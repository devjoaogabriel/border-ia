# UI, Geometry & Shader Contract: Movimento Conectado no Hero (`004-movimento-hero-conectado`)

**Feature**: `004-movimento-hero-conectado`
**Date**: 2026-11-07

## 1. Contrato de Ponte Zero-Rerender (`src/lib/gsap.ts`)

- Remover a importacao, registro e exportacao de `Draggable` (conforme decisao do Joao em `FR-001`).
- Manter `gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin)` dentro de `if (typeof window !== "undefined")`.
- Exportar o objeto mutavel compartilhado `heroCardMotion`:
  ```ts
  export const heroCardMotion = {
    rotationX: 0,
    rotationY: 0,
    rotation: 0,
    bendX: 0,
    tipX: 0,
    tipY: 511,
  };
  ```
- Nenhuma assinatura React (`useState`/`Context`) deve trafegar angulos quadro a quadro.

---

## 2. Contrato da Janela do Figma (`HeroSection.tsx` + `LandingMotionController.tsx`)

### 2.1 Estrutura DOM obrigatoria em `src/components/sections/HeroSection.tsx`
```html
<div
  data-m="window"
  class="absolute top-[71px] left-[23px] w-[725px] max-w-none lg:static lg:block lg:w-full lg:max-w-[1216px]"
>
  <div data-m="window-float" class="will-change-transform">
    <Image
      src="/images/hero-figma-ui.svg"
      alt="Interface do Figma com a estrutura de camadas de um projeto"
      width={1216}
      height={660}
      unoptimized
      priority
      class="block aspect-[1216/660] w-full rounded-lg object-cover object-top [mask-image:linear-gradient(to_bottom,#000,transparent)] lg:rounded-xl"
    />
  </div>
</div>
```
- **Invariante de performance / WebKit**: `[mask-image:...]` permanece exclusivamente no `<Image>` interno estatico; `[data-m="window-float"]` recebe apenas `translate3d(0, y, 0)`; `[data-m="window"]` recebe exclusivamente o reveal inicial e o scrub `y: -28` de `LandingMotionController.tsx`.

### 2.2 Loop de Bounce em `src/components/motion/LandingMotionController.tsx`
- Dentro de `mm.add("(prefers-reduced-motion: no-preference)", () => { ... })` (ou `mm.add` com `isDesktop: "(min-width: 1024px)"`):
  - `const floatY = isDesktop ? -6 : -4;`
  - `const windowFloat = gsap.to("[data-m='window-float']", { y: floatY, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.1 });`
  - `ScrollTrigger.create({ trigger: "#sobre", start: "top bottom", end: "bottom top", onToggle: ({ isActive }) => windowFloat.paused(!isActive) });`

---

## 3. Contrato de Hover 3D do Card (`MagicCopyCard.tsx` + `PluginPrismLogo3D.tsx`)

### 3.1 Camada de Palco e Stacking WebKit (`MagicCopyCard.tsx`)
- `<div ref={rootRef} data-card-stage className="relative z-10 isolate [perspective:900px] ...">`
- Corpo do card (`ref={cardRef}`) **sem** `cursor-grab` e **sem** `Draggable`.
- A cada atualizacao de `balance` ou `tiltTo` (`onUpdate` ou leitura `gsap.getProperty` no ticker), atualizar `heroCardMotion.rotationX`, `heroCardMotion.rotationY` e `heroCardMotion.rotation` (e zerar os tres valores no cleanup de `matchMedia`).

### 3.2 Mapeamento Ponteiro -> Inclinacao (`canHover`)
- Condicao: `canHover: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"`.
- Eventos anexados ao palco (`rootRef.current`):
  - `pointerenter` / `pointermove`:
    - `state = "hovering"`; `balance.pause()`.
    - Medir `box = card.getBoundingClientRect()` em `pointerenter` (e em `resize`/`scroll` se necessario).
    - `normX = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1))`
    - `normY = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1))`
    - `overCta = buttonRef.current?.contains(event.target as Node) ?? false`
    - `gain = overCta ? TILT.hoverCtaDamping : 1` (`0.35` sobre `"Start now"`, `1.0` no restante do card)
    - `tiltTo({ rotationY: Math.tanh(normX * 1.15) * TILT.hoverMaxRotateY * gain, rotationX: -Math.tanh(normY * 1.15) * TILT.hoverMaxRotateX * gain, rotation: 0, duration: TILT.hoverFollowSec, ease: "power2.out" })`
  - `pointerleave` (e `window` `blur` quando `state === "hovering"`):
    - `state = "rebounding"`.
    - `tiltTo({ rotationX: 0, rotationY: 0, rotation: 0, duration: TILT.reboundSec, ease: TILT.reboundEase, onComplete: () => { state = "balancing"; if (inViewport) balance.restart(); } })`

### 3.3 Calibracao do Logo 3D (`PluginPrismLogo3D.tsx`)
- Alterar `const MAX_TILT = MathUtils.degToRad(4.5);` (antes `8`).

---

## 4. Contrato da Linha Conectada e Shader (`HeroBeamLazy.tsx` + `HeroBeamCanvas.tsx`)

### 4.1 Projecao 3D e Mola Amortecida (`HeroBeamLazy.tsx`)
- Container raiz: `width: 340`, `height: 525` (`497 + 28`), `bottom-[calc(100%-28px)] left-[97px] z-0 hidden -translate-x-1/2 lg:block`. `DotMatrixDecor` e `radial-gradient` mantem `bottom-7` (`28px`) para manter identica a area decorativa visivel de `497px`.
- Em cada tick ativo (`gsap.ticker.add` apenas quando `isDesktop && !reduceMotion && inViewport`):
  - Ler `rx = degToRad(heroCardMotion.rotationX)`, `ry = degToRad(heroCardMotion.rotationY)`, `rz = degToRad(heroCardMotion.rotation)`.
  - Ponto de ancoragem local no topo do card: `px = -65`, `py = -202.5`, `pz = 0`, `P = 900`.
  - Rotacao 3D compativel com CSS (`rotateZ` / `rotateY` / `rotateX`):
    - `y1 = py * Math.cos(rx)`, `z1 = py * Math.sin(rx)`
    - `x2 = px * Math.cos(ry) + z1 * Math.sin(ry)`, `z2 = -px * Math.sin(ry) + z1 * Math.cos(ry)`
    - `x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz)`, `y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz)`
    - `persp = P / (P - z2)`
    - `contactX = 65 + x3 * persp` (deslocamento em `px` relativo a `x = 97`)
    - `contactY = 202.5 + y3 * persp` (deslocamento em `px` relativo a `y = 0`)
  - Alvo da barriga flexivel: `targetBendX = contactX + Math.sin(ry) * 95 + Math.sin(rz) * 40`.
  - Integracao semi-implicita de Euler (`dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 0.05)`):
    - `velBendX += ((targetBendX - bendX) * 140 - velBendX * 14) * dt`
    - `bendX += velBendX * dt`
  - Coordenadas finais da ponta com sangria oculta `BEAM_TUCK = 14`:
    - `tipX = contactX`
    - `tipY = 497 + contactY + 14`
  - Atualizar `heroCardMotion.bendX = bendX`, `heroCardMotion.tipX = tipX`, `heroCardMotion.tipY = tipY`.
  - Atualizar o `<path>` SVG:
    `d = \`M 170 0 C 170 ${(tipY / 3).toFixed(2)}, ${(170 + bendX).toFixed(2)} ${((2 * tipY) / 3).toFixed(2)}, ${(170 + tipX).toFixed(2)} ${tipY.toFixed(2)}\``

### 4.2 Regra Critica de SVG para WebKit e Chrome (`gradientUnits="userSpaceOnUse"`)
```xml
<svg width="340" height="525" viewBox="0 0 340 525" fill="none" class="absolute inset-0">
  <defs>
    <linearGradient id="hero-beam-line-grad" gradientUnits="userSpaceOnUse" x1="170" y1="0" x2="170" y2="511">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="52%" stop-color="#C2BAFE" />
      <stop offset="100%" stop-color="#8A6DFE" />
    </linearGradient>
  </defs>
  <path
    ref={pathRef}
    d="M 170 0 C 170 170.33, 170 340.67, 170 511"
    stroke="url(#hero-beam-line-grad)"
    stroke-width="4"
    stroke-linecap="round"
  />
</svg>
```
- **PROIBIDO** omitir `gradientUnits="userSpaceOnUse"`: sem ele, a linha reta vertical (`width = 0` no bounding box) desaparece completamente em repouso (`0°`) e sob `prefers-reduced-motion: reduce`.

### 4.3 Alinhamento Exato do Pulso no Shader (`HeroBeamCanvas.tsx`)
- Uniforms adicionados: `uBendX: { value: 0 }`, `uTipX: { value: 0 }`, `uTipY: { value: 511 }`, atualizados em `useFrame` a partir de `heroCardMotion`.
- No fragment shader:
  ```glsl
  vec2 px = vec2((vUv.x - 0.5) * uSize.x, (1.0 - vUv.y) * uSize.y);
  float t = clamp(px.y / max(uTipY, 1.0), 0.0, 1.0);
  float omt = 1.0 - t;
  float curveX = 3.0 * omt * t * t * uBendX + t * t * t * uTipX;
  float insideRange = step(px.y, uTipY);
  float dist = abs(px.x - curveX);
  float running = step(0.001, uPulse) * step(uPulse, 0.999) * insideRange;
  float trail = smoothstep(uPulse - 0.3, uPulse, t) * smoothstep(uPulse + 0.05, uPulse, t) * running;
  ```
- Nota: `px` dos pontos cintilantes de fundo (`dots`) continua usando `abs(px.x)` da grade fixa para que a matriz decorativa ao fundo nao balance junto com o fio, movendo apenas o nucleo energetico `beam` (`core + halo`) sobre `curveX`!

---

## 5. Contrato de Preservacao da Branch `main`

- **PROIBIDO** alterar `src/components/ui/animated-shiny-text.tsx`, `src/components/ui/AnimatedStrokeWord.tsx`, `src/components/ui/BorderIaLogo.tsx` ou adicionar pacotes em `package.json`.
- **PROIBIDO** usar o caractere travessao (`U+2014`) em comentarios, strings ou documentacao.
