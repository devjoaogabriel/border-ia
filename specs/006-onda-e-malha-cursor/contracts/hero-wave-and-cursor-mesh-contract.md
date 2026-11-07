# Shader, Cursor Spectrum & Interactive Shine Contract (`006-onda-e-malha-cursor`)

**Feature**: `006-onda-e-malha-cursor`
**Date**: 2026-11-07 (atualizado com os ajustes aprovados no `Handoff 07`)

## 1. Limpeza do Hover da `005` e Preservacao do Campo de `247px`

### 1.1 `src/components/sections/HeroSection.tsx`
- `lg:overflow-x-clip` e o comentario temporario adicionados na `005` foram removidos, restaurando `<section id="hero" aria-labelledby="hero-heading" className="relative pt-20 lg:pb-20">` (identico ao commit `333c3a4`).
- **Garantia**: Com `CANVAS_WIDTH = 504` (`±252px` a partir de `BEAM_CENTER`), a borda direita em `1024px` alcanca no maximo `974.3px`, sem transbordar a viewport.

### 1.2 `src/types/landing.ts`
- `BeamMeshPointerState` removida e substituida por `CursorMeshRuntimeState` (`targetX`, `targetY`, `x`, `y`, `presence`, `targetPresence`, `interactive`, `targetInteractive`, `elapsed`, `rafId`; sem `cardMute` nem `targetCardMute`).

### 1.3 `src/components/three/HeroBeamLazy.tsx`
- **Mantido**:
  - `MESH_HALF_WIDTH = 247` (`13` celulas de `19px` para cada lado da corda; nao aumentar mais).
  - `const [canvasReady, setCanvasReady] = useState(false);`
  - `<DotMatrixDecor variant="css" className={`-inset-x-[77px] top-[60px] bottom-7 ${connected && canvasReady ? "opacity-0" : ""}`} />`
  - Todo o `<svg>` da corda e seu `useEffect` (`follow`) com mola fisica **100% intocados**.
- **Alterado / Removido**:
  - `CANVAS_WIDTH = MESH_HALF_WIDTH * 2 + 10` (`504`).
  - Removidos `pointerRef`, `canHover`, `SENSE_*`, `smoothstep` e o `useEffect` de ponteiro da `005`.
  - `<HeroBeamCanvas />` recebe `isActive={inViewport}`, `width={CANVAS_WIDTH}`, `height={BEAM_HEIGHT}`, `meshHalfWidth={MESH_HALF_WIDTH}` e `onReady={() => setCanvasReady(true)}`.

---

## 2. Contrato da Onda Continua no Fragment Shader (`src/components/three/HeroBeamCanvas.tsx`)

### 2.1 Props, Uniforms e `useFrame`
- Removidos `pointerRef`, `POSITION_DAMP`, `HOVER_IN_DAMP`, `HOVER_OUT_DAMP`, `uMouse` e `uHover`.
- Uniforms de `BeamPlane`: `uPulse`, `uTime`, `uSize`, `uBendX`, `uTipX`, `uTipY`, `uMeshHalf`.
- Em `useFrame(({ clock }) => ...)`: atualiza apenas `uPulse`, `uTime`, `uBendX`, `uTipX` e `uTipY`.

### 2.2 Matematica GLSL da Grade Unica + Onda Continua Full-Time
```glsl
float cordClearance = smoothstep(1.8, 4.5, beamDist);

// Grade unica na posicao do DotMatrixDecor (uMeshHalf para cada lado, top 60px, passo 19px).
vec2 gridOrigin = vec2(-uMeshHalf, 60.0);
vec2 cell = floor((px - gridOrigin) / 19.0);
vec2 cellCenter = gridOrigin + (cell + 0.5) * 19.0;

// A onda parte da curva viva da corda na altura da celula: acompanha o balanco do fio.
float tCell = clamp(cellCenter.y / max(uTipY, 1.0), 0.0, 1.0);
float cellCurveX = 3.0 * (1.0 - tCell) * tCell * tCell * uBendX + tCell * tCell * tCell * uTipX;
float side = cellCenter.x >= cellCurveX ? 1.0 : -1.0;
float cordDist = abs(cellCenter.x - cellCurveX);

// Mascara closest-side de 25%, igual ao CSS: gradiente sem borda reta.
float inArea = step(-uMeshHalf, cellCenter.x) * step(cellCenter.x, uMeshHalf)
  * step(60.0, cellCenter.y) * step(cellCenter.y, uSize.y - 28.0);
vec2 maskUv = vec2(cellCenter.x / uMeshHalf, (cellCenter.y - 278.5) / 218.5);
float baseMask = clamp((1.0 - length(maskUv)) / 0.75, 0.0, 1.0) * inArea;

// Onda continua: desce ao longo do fio e se abre para os lados (periodo de ~3.14s).
float lateralFalloff = exp(-cordDist / 155.0);
float wavePhase = cordDist * 0.036 + cellCenter.y * 0.015 - uTime * 2.0;
float waveCrest = pow(0.5 + 0.5 * sin(wavePhase), 2.2);
float pulseWake = exp(-pow((tCell - uPulse) / 0.14, 2.0)) * exp(-cordDist / 95.0) * running;
float waveEnv = clamp(waveCrest * lateralFalloff + pulseWake * 0.55, 0.0, 1.0) * baseMask;

// Ondulacao de no maximo 1.3px: o ponto nunca sai da propria celula.
vec2 shift = vec2(side * 1.1, 0.55) * sin(wavePhase) * baseMask * lateralFalloff;
float r = length(px - (cellCenter + shift));
float dotRadius = mix(1.4, 1.85, waveEnv);
float dotShape = 1.0 - clamp((r - dotRadius) / 0.45, 0.0, 1.0);

float seed = hash(cell);
float blink = pow(0.5 + 0.5 * sin(uTime * (0.6 + seed) + seed * 6.28), 6.0);
float fall = exp(-cordDist / 90.0) * inArea;
float dots = clamp(dotShape * (baseMask * 0.28 + blink * fall * 0.24 + waveEnv * 0.36), 0.0, 1.0) * cordClearance;

vec3 baseDot = vec3(0.478, 0.404, 1.0);
vec3 crestDot = vec3(0.753, 0.51, 1.0);
vec3 peakDot = vec3(0.914, 0.831, 1.0);
vec3 dotColor = mix(baseDot, mix(crestDot, peakDot, waveEnv * 0.45), clamp(waveEnv * 1.15, 0.0, 1.0));

vec3 color = mix(crestDot, vec3(1.0), core * trail) * beam + dotColor * dots;
float alpha = clamp(beam + dots, 0.0, 1.0);
gl_FragColor = vec4(color, alpha);
```

---

## 3. Contrato do Espectro Pontilhado Como Proprio Cursor (`CursorDotMesh`)

### 3.1 Camada Superior (`z-50`) e Seta Nativa Oculta (`.cursor-mesh`)
- `src/components/motion/LandingMotionController.tsx`:
  - Mantem `<div ref={rootRef}>` sem `relative isolate` e renderiza `<CursorDotMesh />` imediatamente antes de `{children}`.
  - `src/app/page.tsx` e `src/components/sections/Footer.tsx` permanecem identicos ao `HEAD` (`333c3a4`), sem `z-10` extras.
- `src/app/globals.css`:
  - `.cursor-mesh, .cursor-mesh * { cursor: none !important; }`.
- **Invariante**: `<CursorDotMesh />` fica em `fixed inset-0 z-50` acima de todas as secoes, cards e do `Banner` com blending normal (`pointer-events-none`), enquanto `html.classList.add("cursor-mesh")` oculta a seta nativa somente depois do canvas pronto em ambiente `canHover && !reduceMotion` (e remove a classe no cleanup).

### 3.2 Regras do Componente `src/components/motion/CursorDotMesh.tsx`
1. **Guarda de ambiente**:
   - `const { reduceMotion, canHover } = useMotionEnvironment(); const enabled = canHover && !reduceMotion;`.
   - Se `!enabled`, retorna `null` (zero DOM e seta/toque nativo preservados em iPhone/Mobile, telas de toque, SSR e `prefers-reduced-motion: reduce`).
2. **Estrutura DOM**:
   - `<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">` contendo `<canvas ref={canvasRef} className="absolute top-0 left-0 will-change-transform" style={{ width: 88, height: 88, transform: "translate3d(-999px, -999px, 0)" }} />` com `dpr = Math.min(window.devicePixelRatio || 1, 2)`.
3. **Ciclo de vida hibernante (`0` custo antes de mover o mouse)**:
   - `rafId = -1` na montagem (zero quadros agendados ate o primeiro movimento real).
   - Em `window` `pointermove` (`{ passive: true }`, `event.pointerType === "mouse"`):
     - Se `state.presence < 0.01 && state.targetPresence === 0`, faz snap `state.x = event.clientX; state.y = event.clientY`.
     - Atualiza `targetX`, `targetY`, `targetPresence = 1` e `targetInteractive = el?.closest("a, button, [role='button']") ? 1 : 0` (sem `cardMute`).
     - Se `state.rafId === -1`, agenda `requestAnimationFrame(frame)`.
   - Em `html` `pointerleave`, `window` `blur` e `document` `visibilitychange` (`document.hidden`): define `targetPresence = 0` e `targetInteractive = 0`.
   - Em `frame(now)`: amortece `x`, `y` (`FOLLOW_RATE = 24`), `presence` (`9` subindo, `6.5` descendo) e `interactive` (`8`); aplica `translate3d(state.x - 44px, state.y - 44px, 0)`; quando `targetPresence === 0 && presence < 0.01`, limpa o canvas, zera `presence`, define `rafId = -1` e retorna sem reagendar `rAF`.
4. **Desenho 2D com Reticulado Ordenado Bayer `4x4`**:
   - Matriz Bayer `4x4`: `[[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]`.
   - Passo `4px` (`22 x 22` celulas; centro em `44`, corte externo em `40px`):
     - `crown = 24 * (1 + 0.22 * state.interactive)`, `band = 0.34 - 0.08 * state.interactive`.
     - `wave = 0.78 + 0.09 * Math.sin(3 * angle - 2.2 * state.elapsed) + 0.05 * Math.sin(1.4 * state.elapsed)`.
     - `ring = Math.max(0, 1 - Math.abs(dist / crown - wave) / band)`.
     - `core = Math.max(0, 1 - (dist / (crown * 0.85)) ** 2) * 0.52`.
     - `field = Math.max(ring, core) * (1 - smoothstep(crown * 1.15, 40, dist))`.
     - Se `field > BAYER[row & 3][col & 3] / 16`: desenha `ctx.fillRect(cx, cy, 2, 2)` com `fillStyle = "#C9B3FF"` e `ctx.globalAlpha = Math.min(0.9, field * 0.95) * state.presence`.

---

## 4. Contrato da Selecao de Texto e Brilho dos Botoes (`globals.css`, `CtaButton.tsx`, `MagicCopyCard.tsx`)

1. **Selecao global (`src/app/globals.css`)**:
   - `::selection { background: rgb(167 81 251 / 0.45); color: #fff; }`.
2. **Classe `.btn-shine` (`src/app/globals.css` dentro de `@layer components`)**:
   - `@property --shine-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }` e `@keyframes shine-spin { to { --shine-angle: 360deg; } }` (`2.4s linear infinite`).
   - `.btn-shine`: `--shine: #fff; position: relative; isolation: isolate; overflow: hidden;` com `::before` (borda conica `1.5px` mascarada via `content-box exclude` / `-webkit-mask ... xor`) e `::after` (grade radial de pontos `4px x 4px` varrida por `conic-gradient`), ambos em `opacity: 0` e `paused` em repouso.
   - `:is(:hover, :focus-visible)`: acende `box-shadow` interno/externo via `color-mix(in srgb, var(--shine) ...)` e coloca `::before` (`opacity: 1`) e `::after` (`opacity: 0.45`) em `running`.
   - `:active`: aplica `translate: 0 1px; scale: 0.98;`, `::after` em `opacity: 0.8` e `box-shadow` mais intenso.
   - `@media (prefers-reduced-motion: reduce)`: desativa `animation`, `translate` e `scale`.
3. **Variantes e alvos**:
   - `src/components/ui/CtaButton.tsx`: classe base recebe `btn-shine`; `primary-gradient` define `[--shine:#fff]`, `primary-light` define `[--shine:#A751FB]` e `secondary-dark` define `[--shine:#C082FF]`.
   - `src/components/ui/MagicCopyCard.tsx`: apenas a classe `btn-shine` adicionada ao `<button>` `"Start now"`, preservando integralmente a inclinacao 3D e o restante do componente.

---

## 5. Governanca e Restricoes

- Zero alteracoes em `package.json`, `src/components/ui/animated-shiny-text.tsx`, `src/components/ui/AnimatedStrokeWord.tsx`, `src/components/ui/BorderIaLogo.tsx` e no `<svg>` + mola fisica da corda em `HeroBeamLazy.tsx`.
- Proibido usar o caractere travessao (`U+2014`) em qualquer arquivo ou comentario.
