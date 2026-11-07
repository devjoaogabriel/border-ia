# Relatorio de Auditoria de Seguranca: Border-IA

**Data**: 2026-11-07
**Base analisada**: Branch `main` (`HEAD` `333c3a4` + worktree atual com specs `005`/`006`, ajustes pos-`006` e `vitest@4.1.12`)
**Metodologia**: `audit-context-building` -> `security-audit` -> `sharp-edges` -> `fp-check`
**Escopo de seguranca operacional**: Nenhum arquivo `.env` ou `.env.*` foi lido durante esta auditoria.

---

## Sumario Executivo

- **Vulnerabilidades exploraveis confirmadas (`Critical` / `High` / `Medium` / `Low`)**: **0**.
- **Observacoes confirmadas (`informational` / hardening)**: **1** (`SA-INFO-01`: `poweredByHeader` ativo por padrao em `next.config.ts`).
- **Hipoteses dependentes de ambiente externo (`needs_validation`)**: **1** (`NV-01`: cabecalhos HTTP de seguranca ausentes em `next.config.ts`, dependendo da borda de hospedagem).
- **Footguns / Sharp Edges identificados para prevencao**: **4** (`SE-01` a `SE-04`).
- **Candidatos auditados e descartados por `fp-check` (`FALSE POSITIVE`)**: **6** (`FP-01` a `FP-06`, incluindo os 8 avisos de `minimatch` no `npm audit`).

---

## 1. Contexto Estrutural (`audit-context-building`)

A aplicacao e uma landing page estatica/cliente em Next.js `16.4.5` (App Router com `cacheComponents: true`), React `19.3.0`, Tailwind CSS v4, GSAP `3.15.1`, Lenis `1.3.27`, Framer Motion `14.10.1` e Three.js `0.187.0`. Nao existem rotas `src/app/api/*`, Server Actions (`"use server"`), `middleware.ts`, `proxy.ts`, banco de dados, sessao, autenticacao, formularios ou chamadas HTTP controladas pelo visitante.

### Matriz de Premissas, Garantias e Lacunas (`nothing found`)

| Modulo / Funcao | O que garante hoje (com linhas) | O que assume sem validacao em runtime/tipo (`nothing found`) |
|-----------------|---------------------------------|--------------------------------------------------------------|
| `SiteLink` (`src/types/landing.ts:1-7`) e `SITE_LINKS` (`src/lib/constants.ts:9-57`) | `navItems` usa apenas `#recursos`, `#sobre`, `#depoimentos` (`external: false`); `ctas` e `socialLinks` usam apenas `https://...` (`external: true`). | Assume que `href: string` sempre usa protocolo seguro (`https:` ou `#`) e que `external: boolean` nunca diverge do `href` real (`nothing found`). |
| `CtaButton` (`src/components/ui/CtaButton.tsx:20-31`) | Quando `link.external === true`, adiciona `target="_blank"` e `rel="noopener noreferrer"` (`linha 24`). | Assume que nenhum link externo chegara com `external: false` e que `link.href` nao contem `javascript:` ou `data:` (`nothing found`). |
| `Header` (`src/components/sections/Header.tsx:13-22`) | Renderiza `<a href={item.href}>{item.label}</a>` para `SITE_LINKS.navItems`. | **Ignora `item.external` por completo**: assume que `navItems` (`SiteLink[]`) jamais contera item com `external: true` (`nothing found`). |
| `Footer` (`src/components/sections/Footer.tsx:16-33`) | Fixa `target="_blank"` e `rel="noopener noreferrer"` (`linhas 20-21`) para `socialLinks`. | Interpola `/icons/social-${link.id}.svg` (`linha 26`) assumindo `link.id` restrito a nomes de arquivos existentes em `public/icons/` (`nothing found`). |
| `MaskIcon` (`src/components/ui/MaskIcon.tsx:2-14`) | Aplica `width`/`height` numericos e `mask: url(${src}) center / contain no-repeat` (`linha 10`). | Assume `src` local, sem espacos, parenteses, aspas ou URL externa (`nothing found`). |
| `createPrism` (`src/components/three/PluginPrismLogo3D.tsx:12-25`) | Privada ao modulo; recebe apenas `LOGO_MARK.back.d` e `LOGO_MARK.front.d` (`linhas 36-37`) e converte em `ExtrudeGeometry` fora do DOM HTML. | Interpola `<path d="${d}"/>` (`linha 14`) sem validar gramatica de path SVG caso reutilizada (`nothing found`). |
| `next.config.ts` (`next.config.ts:1-17`) | Mantem defaults seguros de `next/image` (`dangerouslyAllowSVG: false`, `remotePatterns: []`, CSP sandbox em imagens). | Nao define `async headers()` (`nothing found`) e omite `poweredByHeader: false`. |

---

## 2. Fronteiras de Confianca e Achados (`security-audit`)

### Fronteiras de confianca reais do projeto
1. **Navegador do visitante <-> Resposta HTTP da origem**: protecao contra injecao de script (XSS), enquadramento malicioso (clickjacking / UI redressing sobre os CTAs para Figma e Discord), reverse tabnabbing em abas externas e conteudo ativo em SVGs servidos diretamente.
2. **Ambiente de desenvolvimento/CI (`npm`, `eslint`, `vitest`) <-> Artefatos de producao (`.next/`)**: isolamento de pacotes `devDependencies` fora do runtime e nao vazamento de variaveis `.env*` no bundle cliente.

### `NV-01` [Status: `needs_validation`] - Cabecalhos HTTP de seguranca e CSP ausentes no repositorio
- **Localizacao**: `next.config.ts:3-15` (ausencia de `headers()`, ausencia de `vercel.json` / `proxy.ts`).
- **Fronteira afetada**: Navegador do visitante <-> Origem HTTP da aplicacao.
- **Analise objetiva**:
  - O build atual gera `"headers": []` em `.next/routes-manifest.json`.
  - Provedores como Vercel injetam `Strict-Transport-Security` (HSTS) na borda HTTPS, mas **nao** injetam por padrao `Content-Security-Policy`, `frame-ancestors` / `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` ou `Permissions-Policy`.
  - Sem `frame-ancestors 'none'` e `X-Frame-Options: DENY` na resposta final, a landing page pode ser embutida em um `<iframe>` transparente de terceiro para induzir cliques (clickjacking) nos CTAs externos.
  - Conforme a disciplina de `security-audit`, como cabecalhos podem existir no CDN/proxy de deploy fora do repositorio, o registro permanece `needs_validation` ate verificacao no ambiente publicado ou adicao explicita em `next.config.ts`.
- **Correcao minima recomendada em `next.config.ts`**:
  Adicionar `poweredByHeader: false` e `async headers()` para `source: "/:path*"` emitindo:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - `Content-Security-Policy` compativel com pagina estatica do Next.js 16 App Router (ver restricao critica sobre nonces e `'unsafe-inline'` em `SE-04`).

### `SA-INFO-01` [Status: `confirmed` | Severidade: `informational`] - Cabecalho `X-Powered-By: Next.js` ativo por default
- **Localizacao**: `next.config.ts:3-15` (herda `poweredByHeader: true` do Next.js).
- **Impacto**: Divulgacao trivial de stack (`informational`, dado que rotas `/_next/static/` ja sao publicas no HTML).
- **Correcao minima**: Definir `poweredByHeader: false` em `next.config.ts`.

---

## 3. Analise de APIs Propensas a Erro e Configuracao (`sharp-edges`)

### `SE-01` [Medium] - Desacoplamento entre `SiteLink.href` e `SiteLink.external` + omissao silenciosa em `Header.tsx`
- **Arquivos**: `src/types/landing.ts:1-7`, `src/components/sections/Header.tsx:15-20`, `src/components/ui/CtaButton.tsx:22-25`, `src/components/sections/Footer.tsx:19-26`.
- **Problema (Primitive vs Semantic API + Silent Failure)**:
  1. `SiteLink` aceita qualquer `href: string` junto com um booleano manual `external: boolean`. Cadastrar `{ href: "https://...", external: false }` passa na compilacao e suprime `target="_blank"` e `rel="noopener noreferrer"` em `CtaButton.tsx:24`.
  2. `Header.tsx:15-20` consome `SiteLink[]`, mas renderiza `<a href={item.href}>` **ignorando completamente `item.external`**. Se um link externo for adicionado a `SITE_LINKS.navItems` com `external: true`, a intencao do autor falha em silencio.
  3. Nenhum tipo ou helper bloqueia esquemas executaveis (`javascript:`, `data:`) ou restringe `link.id` usado em `/icons/social-${link.id}.svg` (`Footer.tsx:26`).
- **Mitigacao recomendada**: Extrair um helper puro `resolveSiteLinkAttributes(link)` em `src/lib/links.ts` (validando allowlist `https://` vs `#anchor` e derivando `target` e `rel` automaticamente do proprio protocolo) e tipar `SiteLink` como uniao discriminada ou template literal.

### `SE-02` [Low] - Interpolacao CSS sem aspas e sem validacao de path em `MaskIcon.tsx`
- **Arquivo**: `src/components/ui/MaskIcon.tsx:2-13`.
- **Problema (Stringly-Typed Security)**: `mask: \`url(${src}) center / contain no-repeat\`` recebe `src: string` sem aspas e sem restringir ao prefixo local `/icons/`. Nomes com espaco ou parenteses quebram a regra CSS silenciosamente, e eventual uso futuro com URL dinamica permitiria requisicoes externas indesejadas.
- **Mitigacao recomendada**: Extrair `buildMaskStyle(src, size)` validando `/^\/icons\/[a-z0-9-]+\.svg$/i` e emitindo `url("${src}") center / contain no-repeat`.

### `SE-03` [Low] - Concatenacao manual de XML em `createPrism` (`PluginPrismLogo3D.tsx`)
- **Arquivo**: `src/components/three/PluginPrismLogo3D.tsx:12-15`.
- **Problema**: `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>` concatena `d` diretamente antes de `SVGLoader().parse(...)`. Seguro enquanto privado e alimentado por `LOGO_MARK`, mas fragil caso exportado no futuro sem validar `/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/`.

### `SE-04` [High Operacional - Configuration Cliff] - Armadilhas em `npm audit fix --force` e em CSP com Nonce no Next.js 16
- **Arquivos**: `package.json:32-33`, `eslint.config.mjs:1-18`, `next.config.ts:5`.
- **Armadilha 1 (`npm audit fix --force`)**: Executar a correcao forcada sugerida pelo `npm audit` para `minimatch` faz downgrade destrutivo de `eslint-config-next` (`16.4.5` -> versao antiga incompativel com Flat Config e Next 16), quebrando `npm run lint` sem trazer nenhum ganho de seguranca em producao.
- **Armadilha 2 (CSP incompativel com App Router estatico + GSAP)**:
  - Uma CSP com `script-src 'self'` puro bloqueia os scripts inline de hidratacao RSC gerados pelo Next.js.
  - Migrar para CSP baseada em nonce por requisicao (`proxy.ts`) conflita com `cacheComponents: true` (`next.config.ts:5`), pois obriga renderizacao dinamica a cada request e anula o cache estatico da landing.
  - Uma CSP com `style-src 'self'` sem `'unsafe-inline'` quebra os atributos `style` dinamicos usados por `MaskIcon.tsx`, `CursorDotMesh.tsx`, `HeroBeamLazy.tsx`, `animated-shiny-text.tsx` e GSAP.
  - Portanto, qualquer CSP adicionada a `next.config.ts` deve manter `'self' 'unsafe-inline'` em `script-src` e `style-src`, concentrando a protecao real em `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` e `connect-src 'self'`.

---

## 4. Verificacao Sistematica de Falsos Positivos (`fp-check`)

Cada hipotese levantada no escopo do Handoff 08 passou pelo rastreamento completo de fonte a sumidouro:

| ID | Hipotese Verificada | Fluxo Fonte -> Sumidouro e Evidencia | Veredito `fp-check` |
|----|---------------------|--------------------------------------|---------------------|
| `FP-01` | Links externos `target="_blank"` sem `rel="noopener noreferrer"` | `SITE_LINKS.ctas` (`constants.ts:20-33`) -> `CtaButton.tsx:24` emite `target="_blank" rel="noopener noreferrer"`. `SITE_LINKS.socialLinks` (`constants.ts:34-56`) -> `Footer.tsx:20-21` emite ambos fixos. `navItems` (`Header.tsx:15-20`) e `BorderIaLogo.tsx:7` usam apenas ancoras `#...` na mesma aba. | **FALSE POSITIVE** |
| `FP-02` | Injecao CSS / XSS via `MaskIcon.tsx` (`mask: url(${src})`) | Unicos 3 chamadores (`HeroSection.tsx:44`, `BannerSection.tsx:61`, `MagicCopyCard.tsx:291`) passam literais fixos `"/icons/figma-mark.svg"` e `"/icons/feature-bg-remover.svg"`. Alem disso, `element.style.mask` no React nao permite criar propriedades arbitrarias via `;` e imagens de mascara CSS nao executam scripts. | **FALSE POSITIVE** |
| `FP-03` | Uso de `dangerouslySetInnerHTML`, `innerHTML`, `eval` ou DOM XSS | Busca integral em `src/`: **0 ocorrencias** de `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `new Function` ou `document.write`. `SVGLoader.parse` em `PluginPrismLogo3D.tsx:13-15` usa `DOMParser` desconectado do documento e le constantes fixas. `HeroBeamLazy.tsx:90` grava `d` apenas com floats `.toFixed(2)` apos `clamp(-1, 1)`. | **FALSE POSITIVE** |
| `FP-04` | Scripts, eventos `on*`, `<foreignObject>` ou URLs externas em SVGs servidos | Todos os **13 SVGs servidos** (`11` em `public/icons/*.svg`, `public/images/hero-figma-ui.svg` e `src/app/icon.svg`) contem exclusivamente primitivas vetoriais e filtros (`0` `<script>`, `0` `on*`, `0` `<foreignObject>`, `0` URLs externas), e `dangerouslyAllowSVG` permanece `false`. *(Nota: `docs/design/screens/Interface-figma.svg` possui `<foreignObject>`, mas esta em `docs/` e nao entra no build nem em `public/`.)* | **FALSE POSITIVE** |
| `FP-05` | 8 avisos moderados de `minimatch` no `npm audit` afetando producao ou trazidos pelo Vitest | Em `package-lock.json`, a unica instancia vulneravel e `node_modules/minimatch@3.1.5` (`linhas 5981-5993`, `"dev": true`), puxada exclusivamente por `eslint@9.39.5`, `@eslint/config-array`, `@eslint/eslintrc`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react` e `eslint-config-next@16.4.5` (totalizando os 8 nos reportados). `vitest@4.1.12` usa `picomatch`/`tinyglobby` (nao usa `minimatch`), e `@typescript-eslint` usa `minimatch@10.2.6` isolado. `.next/next-server.js.nft.json` e `.next/static/` confirmam **0 referencias** a `minimatch` ou `eslint` em producao. | **FALSE POSITIVE** (para runtime/producao) |
| `FP-06` | Exposicao de `.env*` / `NEXT_PUBLIC_*` no bundle ou dados sensiveis no cliente | `.gitignore:34` ignora `.env*` sem brechas; busca em todo `src/`, configs e chunks compilados em `.next/static/` confirma **0 leituras** de `process.env`, `NEXT_PUBLIC_`, `localStorage`, `sessionStorage`, `indexedDB` ou `cookie`. | **FALSE POSITIVE** |

---

## 5. Invariantes de Seguranca Recomendadas para a Spec `007` (Vitest em `node`)

Todas as verificacoes abaixo podem rodar em `npm test` (`vitest.config.ts` com `environment: "node"`), sem `jsdom` e sem novas dependencias:

1. **Integridade de `SITE_LINKS` e helper `resolveSiteLinkAttributes`** (`src/lib/links.test.ts`):
   - Garantir que `external: true` exige `https://...` valido, `external: false` exige ancora `#...` valida, protocolos perigosos (`javascript:`, `data:`, `http:`) sao rejeitados e todos os icones `public/icons/social-${link.id}.svg` existem.
2. **Varredura de seguranca sobre todos os SVGs servidos** (`src/security/svg-assets.test.ts`):
   - Inspecionar todos os `.svg` em `public/` e `src/app/` bloqueando `<script`, `<foreignObject`, handlers `on*`, `javascript:`, `data:` e URLs externas (evitando que arquivos brutos de documentacao como `Interface-figma.svg` sejam copiados para `public/`).
3. **Invariantes estaticas do codigo-fonte** (`src/security/source-invariants.test.ts`):
   - Confirmar zero ocorrencias de `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval(`, `new Function(` e `process.env` em `src/`, e confirmar que todo `target="_blank"` em `.tsx` vem acompanhado de `rel="noopener noreferrer"`.
4. **Validacao de caminhos em `MaskIcon` e geometria `LOGO_MARK`** (`src/components/ui/MaskIcon.test.ts`):
   - Testar `buildMaskStyle` (aceitando apenas `/icons/*.svg` seguros com aspas e rejeitando payloads invalidos) e validar `LOGO_MARK.back.d` / `LOGO_MARK.front.d` contra a gramatica estrita de comandos SVG path.
5. **Guardas de `next.config.ts` e `.gitignore`** (`src/security/config-security.test.ts`):
   - Verificar `dangerouslyAllowSVG !== true`, `.env*` presente no `.gitignore` e (quando aplicado na implementacao) `poweredByHeader === false` mais cabecalhos de seguranca em `nextConfig.headers()`.
