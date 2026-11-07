# Phase 0 Research: Itens Restantes do Review e Seguranca (`009-itens-restantes-review`)

**Feature**: `009-itens-restantes-review`
**Date**: 2026-11-07
**Inputs**: `docs/handoff/10-itens-restantes-review.md`, `docs/review/01-code-review.md`, `docs/review/02-seguranca.md`, `specs/008-correcoes-review/tasks.md`
**Skills**: `test-driven-development`, `verification-before-completion`, `security-audit`, `sharp-edges`, `gsap-performance`

---

## R-01: Cabecalhos HTTP de Seguranca e CSP sem Nonce (NV-01 e SA-INFO-01)

- **Contexto**: A landing page roda no Next.js 16 com App Router e a flag `cacheComponents: true` (`next.config.ts:5`).
- **Analise de Seguranca e Restricoes**:
  1. **CSP com Nonce vs Cache Estatico**: Utilizar nonces dinamicos via middleware ou `proxy.ts` exigiria gerar um nonce criptografico por requisicao, o que forcaria execucao dinamica a cada request no servidor e anularia o cache estatico de componentes (`cacheComponents`) e o partial prefetching.
  2. **Interacao com GSAP, Three.js e Estilos Dinamicos**: Varios componentes do projeto (`MaskIcon.tsx`, `CursorDotMesh.tsx`, `HeroBeamLazy.tsx`, `animated-shiny-text.tsx` e plugins do GSAP) manipulam atributos `style` e dependem de estilos locais em tempo real.
  3. **HSTS (`Strict-Transport-Security`)**: So e aplicavel e seguro em ambientes de producao com dominio proprio e certificado SSL valido; se emitido em `localhost` sem HTTPS, bloqueia o desenvolvimento local.
- **Decisao**:
  1. Configurar `poweredByHeader: false` no objeto raiz de `nextConfig`.
  2. Adicionar o metodo `async headers()` em `next.config.ts` aplicando para todas as rotas (`source: "/(.*)"`):
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
     - CSP estatica compativel:
       `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`
  3. Documentar formalmente que HSTS e politicas de dominio com nonce ficam reservadas para a infraestrutura de borda (Cloudflare / Vercel Edge / CDN) no momento do deploy em producao.

---

## R-02: Sanitizacao de XML e Prevencao de Downgrades (SE-03 e SE-04)

- **Contexto**: Em `PluginPrismLogo3D.tsx`, `createPrism` interpola a string `d` diretamente em `<svg xmlns="..."><path d="${d}"/></svg>`. Em `package.json`, `npm audit` emite 8 alertas para `minimatch` na cadeia do ESLint.
- **Decisao**:
  1. Extrair a funcao pura `sanitizeSvgPathD(d: string): string` que valida o caminho contra a gramatica estrita de comandos SVG (`/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/`). Se a string contiver caracteres estranhos (como `<` ou `>`), o helper rejeita antes de passar ao `SVGLoader`.
  2. Adicionar teste automatizado em `src/security/source-and-config.test.ts` travando as dependencias de linting (`eslint-config-next@^16.4.5` e `eslint@^9.0.0`), documentando que `npm audit fix --force` quebraria o Flat Config e e proibido no projeto.

---

## R-03: Atualizacao Dinamica de Densidade de Pixels no Cursor (CR-06)

- **Contexto**: `CursorDotMesh.tsx` le `devicePixelRatio` apenas no mount. Quando a janela muda de monitor (1x vs 2x) ou sofre zoom, a matriz 2D do canvas fica borrada ou desalinhada.
- **Decisao**:
  1. Criar um listener de `resize` `{ passive: true }` no `useEffect` do componente.
  2. Inspecionar se `window.devicePixelRatio` difere do valor armazenado.
  3. Ao detectar mudanca, reexecutar o ajuste de resolucao fisica e escala:
     ```typescript
     const dpr = Math.min(window.devicePixelRatio || 1, 2);
     canvas.width = C.PATCH * dpr;
     canvas.height = C.PATCH * dpr;
     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
     ctx.fillStyle = C.COLOR;
     ```
  4. Cobrir a logica de recalculo em `src/lib/cursor-mesh-math.test.ts`.

---

## R-04: Parametrizacao Dinamica do Fragment Shader (CR-12)

- **Contexto**: Em `HeroBeamCanvas.tsx:63`, o shader utiliza os literais fixos `278.5` e `218.5` para posicionar o centro e raio da mascara vertical.
- **Calculo Geometrico**:
  - Area util do feixe: de `60.0` a `uSize.y - 28.0`.
  - Altura util: `(uSize.y - 28.0) - 60.0 = uSize.y - 88.0`.
  - Raio vertical (`halfH`): `(uSize.y - 88.0) * 0.5`.
  - Centro vertical (`centerY`): `60.0 + halfH`.
  - Para `uSize.y = 525.0`: `halfH = (525.0 - 88.0) * 0.5 = 218.5` e `centerY = 60.0 + 218.5 = 278.5`.
- **Decisao**:
  1. No GLSL, substituir os literais pelas expressoes derivadas de `uSize.y`. O resultado numerico para 525px e identico ao atual, tornando o shader generico para qualquer altura de tela.
  2. No componente `BeamPlane`, adicionar `useEffect` que sincroniza `materialRef.current.uniforms.uSize.value` e `uMeshHalf.value` caso as props de dimensao se alterem pos-mount.

---

## R-05: Sincronismo do Singleton e Isolamento de Testes (CR-07)

- **Contexto**: `heroCardMotion` e um objeto mutavel compartilhado entre `MagicCopyCard`, `HeroBeamLazy` e `HeroBeamCanvas`. Em testes, o estado anterior pode vazar entre suites. Alem disso, ha potencial atraso de 1 frame entre o path SVG e o shader.
- **Decisao**:
  1. Exportar a funcao `resetHeroCardMotion()` em `src/lib/hero-beam-math.ts` (ou `src/lib/gsap.ts`), redefinindo todos os campos para os valores neutros de repouso.
  2. Utilizar `resetHeroCardMotion()` nas suites de teste que manipulam o feixe.
  3. Garantir que a atualizacao dos angulos no `gsap.ticker` ocorra antes do `useFrame` do Three.js, unificando a leitura no mesmo ciclo temporal.

---

## R-06: Cache de BoundingRect e quickTo no Hover do Card (CR-08)

- **Contexto**: A cada evento `pointermove` (60Hz a 240Hz), `MagicCopyCard.tsx` chama `stage.getBoundingClientRect()` e aloca um novo tween `gsap.to`.
- **Decisao**:
  1. Cachear o retangulo delimitador em `pointerenter` em um `ref` local (`boxRef`).
  2. Invalidar o cache em eventos de `scroll` e `resize` da janela.
  3. Utilizar `gsap.quickTo(card, "rotationX", ...)` e `gsap.quickTo(card, "rotationY", ...)` no manipulador de movimento, garantindo que nao ocorra alocacao de novos objetos por frame e preservando 100% da sensacao tatil do hover aprovada pelo Joao Gabriel.

---

## R-07: Descarte de Memoria GPU em PluginPrismLogo3D (CR-09)

- **Contexto**: `ExtrudeGeometry` aloca buffers de vertices na memoria da GPU. Quando o componente e desmontado (por exemplo, ao redimensionar para Mobile), os buffers permanecem retidos na VRAM se nao houver descarte explicito.
- **Decisao**:
  1. Adicionar `useEffect` cleanup invocando `back.dispose()` e `front.dispose()`.
  2. Adicionar `{ passive: true }` no `window.addEventListener("pointermove", onMove, { passive: true })`.

---

## R-08: Acessibilidade e Otimizacao de Assets (CR-13)

- **Decisao**:
  1. Adicionar o componente de acessibilidade `SkipToContent` no topo da arvore, visivel apenas sob foco do teclado, apontando para `#conteudo-principal`.
  2. Mover `id="hero-heading"` para o elemento `<motion.h1>` em `animated-shiny-text.tsx`.
  3. No CSS de `.btn-shine`, adicionar regra para que em `:focus-visible:not(:hover)` a animacao execute apenas uma rodada (`animation-iteration-count: 1`) ou permaneça pausada com contorno destacado, evitando repaint continuo quando o usuario para no teclado.
  4. Comparar a aparencia visual de `DotMatrixDecor variant="css"` com `variant="asset"` no banner. Se a equivalencia for perfeita, adotar `variant="css"` eliminando a carga de 254 KB do arquivo `dot-matrix.svg`.
  5. Remover o arquivo orfao `public/icons/stroke-scribble.svg`.
