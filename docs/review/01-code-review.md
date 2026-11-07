# Relatorio de Code Review, Differential Review, Desempenho e Escalabilidade

**Data**: 2026-11-07
**Escopo analisado**: Diff sem commit contra `HEAD` (`333c3a4`, 9 arquivos modificados + `CursorDotMesh.tsx` e `vitest.config.ts`) e base completa do projeto (`29` arquivos em `src/**/*`, configuracoes, build `.next/` e `public/`).
**Skills aplicadas**: `requesting-code-review`, `differential-review`, `vercel-react-best-practices` e `gsap-performance`.
**Cobertura de testes automatizados atual**: **0%** (`vitest@4.1.12` instalado, `0` arquivos `*.test.{ts,tsx}`).

---

## Parte 1: Pontos Fortes da Base Atual

1. **Respeito transversal a `prefers-reduced-motion`**: `LandingMotionController` (`gsap.matchMedia`), `MagicCopyCard`, `HeroBeamLazy`, `PluginPrismLogoLazy`, `CursorDotMesh`, `SmoothScrollProvider`, `animated-shiny-text` e `@media (prefers-reduced-motion: reduce)` em `src/app/globals.css:279-289` desligam rotacoes, ondas e deslocamentos sem ocultar conteudo.
2. **Degradacao graciosa de WebGL (`src/components/three/WebGLSafeBoundary.tsx`)**: Valida `webgl2` uma unica vez em cache de modulo, libera imediatamente o contexto de teste via `WEBGL_lose_context` e envolve os canvases em `ErrorBoundary` preservando `DotMatrixDecor` e `BorderIaMark`.
3. **Estabilidade numerica nos integradores fisicos**: Tanto a mola Euler semi-implicita em `src/components/three/HeroBeamLazy.tsx:85-87` (`k = 140, c = 14`) quanto o amortecimento exponencial `1 - Math.exp(-rate * dt)` em `src/components/motion/CursorDotMesh.tsx:32-33,97` limitam `dt <= 0.05s`, impedindo explosao de valores ao retornar de abas em segundo plano.
4. **Zero re-renders React por quadro**: `CursorDotMesh`, `MagicCopyCard`, `HeroBeamLazy` e `HeroBeamCanvas` atualizam canvas, atributos SVG e uniforms diretamente fora do ciclo de renderizacao do React.

---

## Parte 2: Achados de Code Review e Differential Review (por Severidade)

*(Nenhum bug de severidade `Critical` / perda de dados / crash de build foi encontrado. Os 5 primeiros itens abaixo sao `Important` por afetarem usabilidade direta de ponteiro, performance Mobile, layout em breakpoint suportado ou consumo continuo de bateria.)*

### `CR-01` [Important | Introduzido no diff] - Cursor desaparece com caneta/stylus, antes do primeiro `pointermove` e ao clicar apos `blur`
- **Arquivos e linhas**: `src/components/motion/CursorDotMesh.tsx:45, 119-146` e `src/app/globals.css:67-70`.
- **Raio de impacto**: Pagina inteira (`<html class="cursor-mesh">`) em qualquer dispositivo com `(hover: hover) and (pointer: fine)` e `!reduceMotion`.
- **Cenario de falha**:
  1. Na montagem do `useEffect` (`linha 142`), `html.classList.add("cursor-mesh")` aplica `cursor: none !important` imediatamente em toda a arvore DOM, antes de o usuario mover o mouse.
  2. Em notebooks hibridos Windows (Surface, Yoga) ou mesas digitalizadoras (Wacom), `(hover: hover) and (pointer: fine)` retorna `true` (escondendo a seta do sistema), mas `onMove` (`linha 120`) ignora `event.pointerType === "pen"` por exigir `event.pointerType !== "mouse"`. O usuario com stylus fica `100%` sem cursor visivel.
  3. Ao voltar de `Alt+Tab` (`blur` zera `targetPresence`), clicar sem mover o mouse (`pointerdown` sem `pointermove`) nao acorda o espectro.
  4. No centro exato (`dist < 10px`, `linhas 85-90`), `core` atinge no maximo `0.52`, apagando metade das celulas `BAYER` no ponto exato do clique.
- **Correcao sugerida**: Aceitar `event.pointerType === "mouse" || event.pointerType === "pen"`, so aplicar `.cursor-mesh` no primeiro evento valido (removendo-a se entrar `pointerdown` de `touch`), escutar `pointerdown` para despertar apos `blur` e garantir o ponto central (`row === 11 && col === 11`) aceso quando `presence > 0`.

### `CR-02` [Important | Preexistente] - `PluginPrismLogoLazy` baixa e executa Three.js + shader PBR no Mobile (~946 KB brutos)
- **Arquivos e linhas**: `src/components/three/PluginPrismLogoLazy.tsx:26-37`, `src/components/three/PluginPrismLogo3D.tsx:69-88` vs comentario em `src/components/three/HeroBeamLazy.tsx:51`.
- **Raio de impacto**: Carregamento pos-hidratacao e bateria em todos os celulares (iPhone/Android) sem movimento reduzido.
- **Cenario de falha**: `HeroBeamLazy.tsx:51` documenta *"Em Mobile, o Three.js nem e baixado"*, mas `MagicCopyCard` monta no Mobile (`HeroSection.tsx:88-90`) e `PluginPrismLogoLazy.tsx:26` verifica apenas `!reduceMotion` (sem `useMediaQuery("(min-width: 1024px)")`). No smartphone, o navegador baixa e compila **945,9 KB brutos (250,5 KB gzip)** de `three` + `@react-three/fiber` + `SVGLoader` e mantem um `<Canvas>` com `antialias: true` e dois `meshPhysicalMaterial` (`clearcoat={1}`) a `60fps` apenas para inclinar um icone de `56x40px` em `4,5` graus, penalizando diretamente o TBT e a nota do Lighthouse Mobile.
- **Correcao sugerida**: Restringir a montagem de `PluginPrismLogo3D` a `isDesktop && !reduceMotion` (exibindo `BorderIaMark` SVG no Mobile).

### `CR-03` [Important | Introduzido/Agravado no diff] - `canvasReady` e `ready` nunca voltam a `false` em desmontagem ou perda de contexto WebGL
- **Arquivos e linhas**: `src/components/three/HeroBeamLazy.tsx:59, 110-113, 144-159` e `src/components/three/PluginPrismLogoLazy.tsx:20-25, 33`.
- **Raio de impacto**: Handoff visual de `DotMatrixDecor` (malha do Hero) e `BorderIaMark` (logo do card).
- **Cenario de falha**:
  1. Depois que `onCreated` define `canvasReady = true`, redimensionar a janela abaixo de `1024px` (`connected = false`) desmonta `<HeroBeamCanvas>`, mas `canvasReady` permanece `true`. Ao voltar para `>= 1024px`, `DotMatrixDecor` nasce invisivel (`opacity-0`) antes de o novo canvas inicializar.
  2. Se o navegador descartar o contexto GPU (`webglcontextlost`, comum ao suspender o sistema ou abrir abas pesadas) ou `CanvasErrorBoundary` capturar erro pos-mount, o fallback continua em `opacity-0`, deixando um buraco vazio no Hero ou no card.
- **Correcao sugerida**: Resetar `canvasReady` quando `!connected`, escutar `webglcontextlost` em `gl.domElement` chamando `onLost={() => setCanvasReady(false)}` e propagar callback `onError` em `WebGLSafeBoundary`.

### `CR-04` [Important | Preexistente] - Colisao horizontal de titulo na secao `Recursos` entre `1024px` e `~1260px`
- **Arquivos e linhas**: `src/components/sections/FeaturesSection.tsx:32, 47` e `src/lib/constants.ts:76`.
- **Raio de impacto**: Grid de 4 colunas de `FeaturesSection` em notebooks/tablets landscape (`1024px` a `1260px`).
- **Cenario de falha**: Em `1024px`, `.container-page` tem `976px` uteis (`4` colunas de `220px` + `3` gaps de `32px`). Na `linha 47`, o `<h3>` aplica `text-[24px] font-medium lg:whitespace-nowrap`. O texto `"Amplificador de imagem"` (`22` caracteres em Space Grotesk 500 `24px`) ocupa `~278px`, transbordando `~58px` sobre a 4a coluna (`"Gerador de avatar"`).
- **Correcao sugerida**: Trocar `lg:whitespace-nowrap` por `xl:whitespace-nowrap` (ou escalonar a fonte em `lg:` antes de `xl:`).

### `CR-05` [Important | Preexistente] - Loops GSAP e `gsap.ticker` continuam rodando fora da viewport, no Mobile e em `reduceMotion`
- **Arquivos e linhas**: `src/components/ui/MagicCopyCard.tsx:56-76, 89-106` e `src/components/motion/SmoothScrollProvider.tsx:17-22`.
- **Raio de impacto**: CPU e bateria durante toda a sessao da pagina.
- **Cenario de falha**:
  1. Em `MagicCopyCard.tsx:89-97`, o `ScrollTrigger` `visibility` pausa somente a timeline `balance`. O giro infinito `spinRef` (`[data-card-arc]`), a timeline infinita de `beamPulse` + `[data-card-glow]` e o listener `gsap.ticker.add(syncMotion)` continuam executando `60-144` vezes por segundo quando o usuario esta no rodape, e tambem no Mobile (`< 1024px`) onde nao ha `HeroBeamLazy`.
  2. Em `SmoothScrollProvider.tsx:19`, `gsap.ticker.add(update)` e registrado mesmo quando `reduceMotion === true`, impedindo o auto-sleep do `gsap.ticker` durante toda a sessao.
- **Correcao sugerida**: Pausar `spinRef` e a timeline `beamPulse` dentro de `visibility.onToggle`, registrar `syncMotion` apenas em Desktop com Hero visivel e condicionar `gsap.ticker.add(update)` em `SmoothScrollProvider` a `!reduceMotion` (`[reduceMotion]`).

### `CR-06` [Medium | Introduzido no diff] - `CursorDotMesh` nao atualiza resolucao se `devicePixelRatio` mudar
- **Arquivo e linhas**: `src/components/motion/CursorDotMesh.tsx:47-51`.
- **Raio de impacto**: Nitidez do cursor ao mover a janela entre monitor `1x` e tela Retina/HiDPI `2x` ou dar zoom (`Ctrl +`/`Ctrl -`).
- **Cenario de falha**: `dpr` e lido apenas uma vez no mount. Abrir em monitor `1x` (`88x88`) e arrastar para tela `2x` estica o bitmap em `176x176` pixels fisicos com pontos borrados.
- **Correcao sugerida**: Extrair `syncDpr()` em `resize` (`{ passive: true }`), reconfigurando `canvas.width/height`, `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` e `ctx.fillStyle = COLOR` quando `dpr` mudar.

### `CR-07` [Medium | Preexistente, ampliado no diff] - Singleton mutavel `heroCardMotion` acopla modulos e duplica `tipY = 511`
- **Arquivos e linhas**: `src/lib/gsap.ts:11-22`, `src/components/ui/MagicCopyCard.tsx:68, 102-104`, `src/components/three/HeroBeamLazy.tsx:23, 68-90`, `src/components/three/HeroBeamCanvas.tsx:112, 121-125`.
- **Raio de impacto**: Sincronismo entre `MagicCopyCard`, `<svg>` da corda e `HeroBeamCanvas`.
- **Cenario de falha**: `gsap.ts:21` hardcoda `tipY: 511` duplicando `BEAM_REST_TIP = 497 + 14` de `HeroBeamLazy.tsx:23`; a ordem de execucao entre `syncMotion` e `follow` no `gsap.ticker` inverte apos scroll out/in (gerando `1` frame de atraso entre o `<path>` SVG e `cordClearance` no shader); e testes unitarios compartilham estado sujo sem helper de reset.
- **Correcao sugerida**: Unificar `BEAM_REST_TIP` em um modulo puro compartilhado (`src/lib/hero-beam-math.ts`) com `resetHeroCardMotion()` (ou `ref` no ancestral comum).

### `CR-08` [Medium | Preexistente] - `getBoundingClientRect()` e `gsap.to` recriados a cada `pointermove` em `MagicCopyCard`
- **Arquivo e linhas**: `src/components/ui/MagicCopyCard.tsx:82-88, 113-135`.
- **Raio de impacto**: Fluidez do hover 3D no Hero Desktop.
- **Cenario de falha**: Todo `pointermove` (`60-240Hz`) chama `stage.getBoundingClientRect()` e mata/aloca uma nova instancia `gsap.to` em vez de `gsap.quickTo`, alem de o primeiro keyframe de `balance` usar `.to()` (podendo capturar angulo inclinado caso o mouse ja inicie sobre o card).
- **Correcao sugerida**: Cachear `stage.getBoundingClientRect()` em `pointerenter` (invalidando em `scroll`/`resize`), usar `gsap.quickTo` para `rotationX`/`rotationY` no hover e iniciar `balance` com `.fromTo(card, { rotationX: 0, rotationY: 0, rotation: 0 }, TILT.balanceKeyframes[0])`.

### `CR-09` [Medium | Preexistente] - Vazamento de `ExtrudeGeometry` e `pointermove` nao-passivo sempre ativo em `PluginPrismLogo3D`
- **Arquivo e linhas**: `src/components/three/PluginPrismLogo3D.tsx:36-47, 62`.
- **Raio de impacto**: Memoria GPU WebGL e eventos globais de janela.
- **Cenario de falha**: `back` e `front` sao criados via `new ExtrudeGeometry(...)` em `useMemo` sem `back.dispose(); front.dispose();` na desmontagem; e `window.addEventListener("pointermove", onMove)` (`linha 45`) omite `{ passive: true }` e continua rodando fora da viewport (`!isActive`).
- **Correcao sugerida**: Descartar `back` e `front` em `useEffect` cleanup e condicionar o listener passivo a `canHover && isActive`.

### `CR-10` [Medium | Preexistente, ampliado no diff] - `useMediaQuery` recria `matchMedia` e re-assina listeners a cada re-render
- **Arquivo e linhas**: `src/hooks/useMotionEnvironment.ts:6-23`.
- **Raio de impacto**: `SmoothScrollProvider`, `CursorDotMesh`, `HeroBeamLazy` e `PluginPrismLogoLazy` (`7` chamadas ativas).
- **Cenario de falha**: A funcao `subscribe` inline passada a `useSyncExternalStore` muda de referencia a cada render, forcando `removeEventListener` + novo `window.matchMedia(query)` + `addEventListener` em todo re-render de `inViewport`, `canvasReady` ou `burstSignal`.
- **Correcao sugerida**: Memorizar `subscribe` e `getSnapshot` com `useCallback(..., [query])` ou deduplicar via `Map` em nivel de modulo por `query`.

### `CR-11` [Medium | Introduzido no diff] - Tailwind v4 varre `docs/`/`specs/` e comentarios gerando classes invalidas, e `.transition` sobrescreve `.btn-shine`
- **Arquivos e linhas**: `src/app/globals.css:1, 197-205`, `src/components/ui/CtaButton.tsx:25`, `src/components/ui/MagicCopyCard.tsx:289`.
- **Raio de impacto**: CSS global de producao (`29,4 KB`) e os `4` botoes `.btn-shine`.
- **Cenario de falha**:
  1. No CSS compilado em `.next/static/chunks/*.css`, `@import "tailwindcss";` sem `source("../")` extrai candidatos literais de `docs/`, `specs/` e comentarios, emitindo seletores mortos como `.\[--shine\:\.\.\.\]{--shine:...}` (vindo do comentario da `linha 197`!), `.mix-blend-screen` e `.cursor-grab`.
  2. `.btn-shine` (`@layer components`) declara `transition-property` sem `transition-duration`, enquanto `transition duration-300` (`@layer utilities`) vence a cascata e anula a `linha 204` de `globals.css`.
- **Correcao sugerida**: Usar `@import "tailwindcss" source("../");` em `src/app/globals.css:1`, limpar `[--shine:...]` do comentario e unificar `transition-property` + `transition-duration` em `.btn-shine`.

### `CR-12` [Medium | Introduzido no diff] - Constantes verticais fixas no shader e `uniforms` sem sync pos-mount em `HeroBeamCanvas`
- **Arquivo e linhas**: `src/components/three/HeroBeamCanvas.tsx:61-64, 105-116`.
- **Raio de impacto**: `BeamPlane` caso `BEAM_HEIGHT` ou `MESH_HALF_WIDTH` sejam ajustados.
- **Cenario de falha**: `maskUv` (`linha 63`) usa `278.5` e `218.5` literais (validos apenas para `uSize.y === 525`), e `ShaderMaterial` ignora mudanca de referencia da prop `uniforms` apos o primeiro mount.
- **Correcao sugerida**: Derivar `halfH = (uSize.y - 88.0) * 0.5` e `centerY = 60.0 + halfH` de `uSize.y` no GLSL e atualizar `materialRef.current.uniforms` via `useEffect`.

### `CR-13` [Minor] - Acessibilidade complementar, foco estacionario em `.btn-shine` e peso de `dot-matrix.svg`
- **Arquivos e linhas**:
  1. `src/app/page.tsx:12` e `src/components/ui/animated-shiny-text.tsx:50-52`: `<main id="conteudo-principal">` sem link skip-to-content visivel no foco; `id="hero-heading"` aplicado na `<div>` externa de `AnimatedText` em vez do `<h1>`.
  2. `src/app/globals.css:249-257`: `.btn-shine:is(:hover, :focus-visible)` mantem `shine-spin` rodando indefinidamente com foco de teclado parado.
  3. `public/icons/dot-matrix.svg` (`254,3 KB`, `2.878` `<path>`s) usado `2x` em `BannerSection.tsx:31,37`, quando `DotMatrixDecor` ja possui `variant="css"` de `0 KB`; `public/icons/stroke-scribble.svg` (`803 B`) esta orfao.

---

## Parte 3: Desempenho e Escalabilidade (`vercel-react-best-practices` + `gsap-performance`)

### 3.1 Analise Tecnica dos Subsistemas Criticos

1. **Shader do Hero (`HeroBeamCanvas.tsx` + `HeroBeamLazy.tsx`)**:
   - **Taxa de preenchimento**: Com `CANVAS_WIDTH = 504` e `BEAM_HEIGHT = 525`, a area logica e de **`264.600 px`** (`-26%` frente aos `680px` do prototipo `005`). Em `dpr = 1`, processa `264.600` fragmentos/quadro (`15,88 M/s` a `60Hz`). Em `dpr = 2` (teto atual de `dpr={[1, 2]}`), sobe para **`1.058.400` fragmentos/quadro** (`63,5 M/s` a `60Hz`; `127 M/s` a `120Hz`).
   - **Operacoes por fragmento**: `6` `exp()`, `3-4` `sin()`, `3` `pow()`, `2` `length()` e `2` curvas de Bezier cubicas em `100%` dos pixels, embora **`95,4%` da area de cada celula `19x19` tenha `dotShape == 0.0`** e `~35%` do canvas tenha `baseMask == 0.0`. Pular `hash`/`blink`/`fall` quando `dotShape <= 0.0`, trocar `pow(x, 2.0)`/`pow(x, 6.0)` por multiplicacoes diretas e limitar `dpr={[1, 1.5]}` corta mais da metade da carga de GPU em telas Retina sem mudanca perceptivel.
   - **Fora da tela**: `frameloop={isActive ? "always" : "never"}` + remocao de `follow` do `gsap.ticker` zeram o custo do feixe ao rolar para `Recursos`.

2. **Malha do Cursor (`CursorDotMesh.tsx`)**:
   - **Custo CPU por quadro**: `22 x 22 = 484` iteracoes; o early-exit `dist >= 40` descarta **168 celulas (`34,7%`)**, restando **316 celulas (`65,3%`)** com trigonometria e `~80 a 130` chamadas `fillRect(2x2)` (`< 0,08ms`/quadro). Icar `0.05 * Math.sin(1.4 * state.elapsed)` para fora do loop e pre-calcular a tabela `22x22` de `(dist, angle)` elimina quase toda a trigonometria por quadro. Cachear `lastTarget` em `onMove` evita chamar `el.closest(...)` dezenas de vezes sobre o mesmo elemento.
   - **Hibernacao do `rAF`**: Inicia em `rafId = -1` (`0` custo no carregamento / Lighthouse) e volta a `rafId = -1` em `~0,71s` (`~43` quadros a `60Hz`) apos `pointerleave`/`blur`/`visibilitychange`. Enquanto o ponteiro permanece parado **dentro** da janela (`targetPresence = 1`), o `rAF` segue ativo para sustentar a ondulacao viva do espectro.
   - **Composicao**: `translate3d` + `will-change-transform` sobre textura fixa `176x176 px` (`123,9 KB` de VRAM em `dpr = 2`), zero Layout na arvore da pagina.

3. **Brilho dos Botoes (`.btn-shine` em `globals.css`)**:
   - **Custo de Paint vs Compositor**: Animar `@property --shine-angle` (`inherits: false`) **nao** roda apenas no compositor: invalida `conic-gradient` em `background` e `mask-image` a cada frame, disparando Paint na caixa do botao, somado a `box-shadow` duplo e `filter: brightness(110%)`.
   - **Contencao**: Em repouso, `animation-play-state: paused` e `opacity: 0` tem **custo zero**. Em hover, `isolation: isolate` + `overflow: hidden` restringem o repaint a `1` botao por vez (`~208 x 50 CSS px`). Se no futuro varios elementos precisarem brilhar ao mesmo tempo sem depender de hover, recomenda-se substituir a animacao de `--shine-angle` por `transform: rotate()` em um pseudo-elemento quadrado maior (`100%` compositor).

4. **Bundle Inicial, Fontes e Escalabilidade**:
   - **Bundle JS Eager (medido em `.next/static/chunks`)**: **`890,3 KB` brutos / `286,8 KB` gzip** (`React 19 + Next 16` `~167,1 KB` gzip; `GSAP + ScrollTrigger + DrawSVGPlugin` `~58 KB` gzip; **`framer-motion` `~38 KB` gzip carregado sincronamente no LCP apenas para `animated-shiny-text.tsx`**; `lenis` `~9,6 KB` gzip).
   - **Bundle JS Lazy (`next/dynamic`)**: **`950,8 KB` brutos / `252,6 KB` gzip** (`three` + R3F + `SVGLoader`), hoje baixado tambem no Mobile por causa de `CR-02`.
   - **Fontes**: `Space Grotesk` via `next/font/google` com `48,0 KB` totais em `.woff2` (`display: swap`).
   - **Telas `2560x1440` e `4K` (`dpr = 2`)**: Tanto `HeroBeamCanvas` (`504x525` fixo) quanto `CursorDotMesh` (`88x88` fixo) tem resolucao independente do tamanho do monitor, mantendo consumo constante em `4K`. Para escalar para multiplos cards no futuro, e necessario resolver `CR-07` (singleton `heroCardMotion`) e usar `ScrollTrigger.batch` se a lista de recursos passar de `~12` cards.

---

### 3.2 O Que e Mensuravel em Teste Unitario vs Somente Lighthouse / Navegador

| Dimensao | Mensuravel em Vitest `node` (0 deps novas) | Exige Vitest + `jsdom` / `@testing-library/react` | Exige Navegador Real / Lighthouse |
|----------|--------------------------------------------|---------------------------------------------------|-----------------------------------|
| Descarte de celulas (`OUTER_CUTOFF = 40` -> `168/484`), matriz `BAYER`, limite `MAX_ALPHA <= 0.9`, clamp `dt <= 0.05` e convergencia para hibernacao (`rafId = -1`) | **Sim** (funcoes puras extraidas) | Desnecessario | Nao |
| Projecao 3D da ponta da corda (`tipX`, `tipY`), mola amortecida e formato do path Bezier SVG | **Sim** (funcoes puras extraidas) | Desnecessario | Alinhamento visual 3D real |
| Curva `tanh`, limites `hoverMaxRotateX/Y` e `hoverCtaDamping` do `MagicCopyCard` | **Sim** (funcao pura extraida) | Desnecessario | Ausencia de jank / forced reflow |
| Orcamento de assets estaticos (`public/`), ausencia de seletores invalidos no CSS e contratos de links/seguranca | **Sim** (`node:fs` + imports TS) | Desnecessario | Nao |
| Ciclo DOM de `.cursor-mesh` em `<html>`, eventos `pointerType` (`mouse`/`pen`/`touch`) e deduplicacao de `useMediaQuery` | Nao | **Sim** | Cursor nativo real do SO |
| Fill-rate GPU do shader GLSL, custo de Paint de `@property --shine-angle`, compilacao PBR `clearcoat`, LCP, TBT, CLS, INP e colisao visual em `1024px` | Nao | Nao (`jsdom` nao tem layout nem GPU) | **Exclusivo de Lighthouse e Playwright (Chromium + WebKit)** |

---

### 3.3 Plano de Medicao Pendente do Lighthouse (`T001` e `T010` das Specs `005`/`006`)

Como o comparativo Lighthouse antes e depois nunca foi executado nas specs `005` e `006`, o procedimento deterministico incorporado ao plano da **Spec `007`** consiste em:
1. **Baseline limpa (`antes` - `333c3a4`)**: Salvar temporariamente a arvore atual com `git stash push -u -m "wip-pos-006"`, rodar `npm run build` + `npm run start` em porta local dedicada, executar **3 rodadas Mobile** e **3 rodadas Desktop** via Lighthouse CLI headless (`--only-categories=performance,accessibility,best-practices,seo`), extrair a mediana de Score, LCP, TBT e CLS e restaurar imediatamente o trabalho com `git stash pop`.
2. **Estado pos-mudancas (`depois` - `main` atual + Spec `007`)**: Rodar `npm run build` + `npm run start`, repetir **3 rodadas Mobile** e **3 rodadas Desktop** nas mesmas flags e registrar a tabela comparativa `antes vs depois` (observando especialmente o impacto de `CR-02` no TBT Mobile caso o Joao aprove corrigir `PluginPrismLogoLazy` no Mobile).
