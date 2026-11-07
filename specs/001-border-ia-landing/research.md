# Research & Decisoes Tecnicas: Landing Page do Plugin Border-IA

**Feature**: `001-border-ia-landing` | **Data**: 2026-11-06

## 1. Integracao Next.js 16.4.5 (`cacheComponents: true`) e Limite Server/Client

- **Decision**: Manter `src/app/layout.tsx` e `src/app/page.tsx` como Server Components estaticos que renderizam todo o HTML semantico, textos, SVGs estaticos e estilos base no servidor, isolando `"use client"` apenas em adaptadores de movimento (`SmoothScrollProvider`, hooks/controladores GSAP, `MagicCopyCard`) e carregando cenas 3D via `next/dynamic(..., { ssr: false })` dentro de wrappers client-side.
- **Rationale**: O projeto utiliza Next.js `16.4.5` com `cacheComponents: true` e `partialPrefetching: true` em `next.config.ts`. Manter o shell da landing page em Server Components garante prerenderizacao estatica imediata (FCP/LCP minimos e SEO completo), enquanto os componentes client hidratam progressivamente sem bloquear o primeiro quadro util. Em Next.js 16, `next/dynamic` com `{ ssr: false }` deve ser declarado dentro de um Client Component (e nao diretamente em um Server Component), evitando erro de compilacao do App Router.
- **Alternatives considered**:
  - Marcar `src/app/page.tsx` inteiro como `"use client"`: rejeitado por inflar o bundle de hidratacao inicial e degradar a entrega estatica do App Router.
  - Carregar `three` e `@react-three/fiber` sincronamente no topo do Hero: rejeitado por violar o Principio IV da Constituicao e a regra de `AGENTS.md` ("Codigo 3D carrega sob demanda, sem pesar o primeiro paint").

## 2. Configuracao de Tokens e Tipografia no Tailwind CSS v4 (`@tailwindcss/turbopack`)

- **Decision**: Carregar `Space_Grotesk` (pesos `400` e `500`, `subsets: ["latin"]`, `display: "swap"`, variavel `--font-space-grotesk`) via `next/font/google` no `RootLayout` e mapear em `src/app/globals.css` (usando `@theme inline` do Tailwind v4 + custom properties) todas as 33 cores (`Gray-01..11`, `Purple-01..11`, `Indigo-01..11`), o gradiente `--gradient-linear-degrade` e utilitarios tipograficos (`H1` a `H8`, `p-18` a `p-14`, `tag-text`).
- **Rationale**: O repositorio usa Tailwind CSS v4 com `@tailwindcss/turbopack` (sem `tailwind.config.js` legado). Centralizar tokens em `@theme inline` em `globals.css` expoe classes nativas (`bg-gray-11`, `text-purple-05`, `border-gray-09`) com zero custo de runtime. Os stops exatos de `Linear-degrade` e a unidade de `letter-spacing` (`1` vs `10`) ausentes no resumo estatico serao extraidos pelo Claude Code via `get_design_context` (com a skill `figma-design-to-code` carregada antes) nos nodes `21:3195`, `307:78` e `335:10650`.
- **Alternatives considered**:
  - Valores arbitrarios espalhados nos componentes (`bg-[#09090B]`): rejeitado por dificultar manutencao e propiciar divergencia de tokens.
  - Estimar manualmente os stops de `Linear-degrade`: rejeitado pelo `AGENTS.md` e pelo handoff ("sem inventar valor").

## 3. Sincronizacao entre Lenis (`1.3.27`) e GSAP ScrollTrigger (`3.15.1`)

- **Decision**: Utilizar `ReactLenis` de `lenis/react` com `options={{ autoRaf: false }}` acoplado ao `gsap.ticker` (`lenis.raf(time * 1000)` + `gsap.ticker.lagSmoothing(0)`) e `useLenis(ScrollTrigger.update)`, desativando completamente a instancia inercial do Lenis quando `(prefers-reduced-motion: reduce)` estiver ativo.
- **Rationale**: Quando Lenis e GSAP rodam loops `requestAnimationFrame` independentes, ocorrem micro-trepidacoes (jitter) em elementos vinculados a `ScrollTrigger` com `scrub`. Dirigir o Lenis pelo `gsap.ticker` unifica o clock de frame. Desmontar ou desabilitar o Lenis sob `prefers-reduced-motion: reduce` restaura o scroll nativo imediato do navegador, atendendo integralmente ao Principio III da Constituicao.
- **Alternatives considered**:
  - `ScrollSmoother` do GSAP: rejeitado porque `AGENTS.md` determina explicitamente o uso de `Lenis` para scroll suave.
  - `autoRaf: true` no Lenis em paralelo ao GSAP: rejeitado por risco de dessincronia em `ScrollTrigger`.

## 4. Tracado Vetorial Caligrafico (Oval de `"interfaces"` e Rabisco de `"Border-IA"`)

- **Decision**: Utilizar `DrawSVGPlugin` (incluso gratuitamente em `gsap@3.15.1` em `gsap/DrawSVGPlugin`) registrado em `src/lib/gsap.ts`, animando `<path>` vetoriais exportados/extraidos do Figma com `stroke="url(#linear-degrade)"`, `strokeLinecap="round"` e `vectorEffect="non-scaling-stroke"` quando aplicavel.
- **Rationale**: Desde a abertura completa dos plugins GSAP, `DrawSVGPlugin.js` ja esta instalado localmente em `node_modules/gsap/DrawSVGPlugin.js`. Ele normaliza diferencas de `getTotalLength()` entre navegadores, redimensionamentos responsivos e viewBox escalados, permitindo `fromTo(path, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" })` limpo e reversao imediata para `"0% 100%"` em `prefers-reduced-motion: reduce`.
- **Alternatives considered**:
  - Calculo manual de `strokeDasharray` / `strokeDashoffset`: funcional, mas inferior ao `DrawSVGPlugin` ja presente no pacote instalado para lidar com redimensionamento responsivo.

## 5. Arquitetura de Shapes Realistas em Three.js (`0.187.0`) + `@react-three/fiber` (`9.8.2`)

- **Decision**: Construir exatamente dois componentes 3D/shader leves e isolados no Hero usando apenas `three` e `@react-three/fiber` puros (sem adicionar `@react-three/drei`), carregados sob demanda apos o primeiro paint sobre placeholders estaticos SVG/CSS identicos ao Figma:
  1. `HeroBeamCanvas` (`CM-04`): `<Canvas>` transparente posicionado na camada atmosferica do Hero, com `THREE.ShaderMaterial` customizado em GLSL para renderizar o filamento luminoso vertical roxo, halo volumetrico difuso, pulso descendente sincronizado a timeline de abertura e cintilacao radial da malha de pontos.
  2. `PluginPrismLogo3D` (`CM-05`): `<Canvas>` compacto (`~56x44px`) no cabecalho do card `"Magic copy"`, com dois losangos chanfrados (`THREE.Shape` + `THREE.ExtrudeGeometry` com bevel suave) e `THREE.MeshPhysicalMaterial` (`clearcoat`, `roughness` baixa, tons `Purple`/`Indigo` e luz pontual roxa superior), reagindo sutilmente ao cursor em dispositivos `hover: hover` e em oscilacao suave em telas de toque.
  Ambos usam `IntersectionObserver` para alternar `frameloop="never"` fora da viewport, `ErrorBoundary` para fallback silencioso sem WebGL e nao montam loop animado sob `prefers-reduced-motion: reduce`.
- **Rationale**: `package.json` contem `three` e `@react-three/fiber` sem `@react-three/drei`, e nao devemos adicionar pacotes desnecessarios. Separar os dois micro-canvases evita conflito de `z-index` com o fundo opaco do card DOM `"Magic copy"`, mantem area de pixels minima na GPU, respeita o limite constitucional de ate 2 contextos leves restritos ao Hero e entrega tanto shader volumetrico visivel em escala ampla quanto geometria 3D fisica realista no emblema do plugin.
- **Alternatives considered**:
  - Unico `<Canvas>` cobrindo todo o Hero em `z-index` unico: rejeitado porque o fundo opaco do card DOM `"Magic copy"` fica entre o feixe traseiro (`z-10`) e o emblema interno do card (`z-30`).
  - Usar Three.js tambem nos logos pequenos do Header/Footer ou nos cantos do Banner CTA: rejeitado por criar multiplos contextos WebGL espalhados pela pagina sem ganho perceptivel sobre SVG vetorial nitido.

## 6. Composicao Hibrida da Vitrine do Hero (`WebProcess 2.0` + Card `"Magic copy"`)

- **Decision**: Exportar a janela de fundo do editor Figma (`WebProcess 2.0`) do node `307:74` / `335:10650` como asset local otimizado (`SVG` ou `WebP`/`PNG` 2x servido localmente em `public/images/hero-figma-ui.webp` ou `.svg`) com mascara CSS `mask-image: linear-gradient(to bottom, #000 55%, transparent 100%)` e `aria-hidden="true"`, enquanto o card flutuante `"Magic copy"` e construido integralmente como componente React real (`MagicCopyCard.tsx`).
- **Rationale**: A janela de fundo do Figma e um cenario escuro ornamental complexo que some em fade na base; servi-la como asset local otimizado garante fidelidade pixel-perfect ao Figma e zero peso de DOM. Ja o card `"Magic copy"` exige interatividade real, nitidez tipografica, animacao do spinner `"Generating..."`, botao clicavel `"Start now"` e hospedagem do emblema 3D `PluginPrismLogo3D`.
- **Alternatives considered**:
  - Exportar toda a composicao do Hero (incluindo `"Magic copy"`) como uma unica imagem estatica: rejeitado por inviabilizar `CM-05`, `CM-06` e a interatividade do card.
  - Recriar centenas de camadas internas do painel lateral do Figma em HTML/CSS: rejeitado por adicionar complexidade fragil sem valor funcional ou visual superior ao asset exportado do proprio node.
