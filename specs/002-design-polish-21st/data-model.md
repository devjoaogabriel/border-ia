# Phase 1 Data Model: Polimento Visual e Componentes Elevados

**Feature**: `002-design-polish-21st`
**Date**: 2026-11-06
**Source Files**: `src/types/landing.ts`, `src/lib/constants.ts`

## 1. Entidades Novas e Estendidas (`src/types/landing.ts`)

### 1.1 `TestimonialItem` (`D6`)

Representa cada cartao exibido no `TestimonialMarquee` dentro de `BannerSection`.

| Campo | Tipo | Obrigatorio | Regras de Validacao |
|-------|------|-------------|---------------------|
| `id` | `string` | Sim | Identificador unico estavel (ex.: `"testimonial-01"` a `"testimonial-04"`). |
| `authorName` | `string` | Sim | Enquanto provisorio, usar identificacao generica clara (ex.: `"Designer de Produto #1"`), nunca atribuindo citacao inventada a pessoa real identificavel. |
| `authorRole` | `string` | Sim | Papel profissional curto compativel com o publico do plugin (ex.: `"UI/UX Designer"`). |
| `quote` | `string` | Sim | Texto curto em PT-BR sem `U+2014`; enquanto provisorio, descreve claramente espaco reservado para depoimento real. |
| `avatar` | `AvatarAsset` | Sim | Referencia direta a um item existente de `SOCIAL_PROOF_AVATARS` (`/images/avatar-01.webp` a `/images/avatar-04.webp`, `40x40`). Zero URLs externas. |
| `isPlaceholder` | `boolean` | Sim | `true` enquanto o texto oficial nao for enviado pelo Joao Gabriel; obriga renderizacao do selo visivel de conteudo provisorio e bloqueia `verify:release`. |

### 1.2 `TestimonialsReleaseState` (`D6`)

Configuracao centralizada em `src/lib/constants.ts` para controle de publicacao:

| Constante | Tipo | Valor Inicial na Feature 002 | Regra de Negocio |
|-----------|------|------------------------------|------------------|
| `TESTIMONIALS_VERIFIED` | `boolean` | `false` | Somente muda para `true` quando Joao Gabriel fornecer a copy real e todos os itens tiverem `isPlaceholder: false`. |
| `TESTIMONIAL_PROVISIONAL_LABEL` | `string` | `"Conteúdo provisório"` | Rotulo exibido em cada card enquanto `TESTIMONIALS_VERIFIED === false` ou `item.isPlaceholder === true`. |
| `TESTIMONIAL_ITEMS` | `readonly TestimonialItem[]` | 4 itens baseados em `SOCIAL_PROOF_AVATARS` | Reutiliza os 4 avatares locais existentes na pagina; duplicacao visual para loop continuo ocorre apenas na camada de apresentacao do marquee com `aria-hidden="true"` nas copias. |

### 1.3 `MotionSafeWrapperProps` (`S4`)

Contrato do envoltorio de seguranca de movimento em `src/components/motion/MotionSafeWrapper.tsx`:

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `children` | `ReactNode \| ((ctx: { prefersReducedMotion: boolean; canHover: boolean; isInView: boolean }) => ReactNode)` | Sim | Permite renderizar o componente da `21st.dev` repassando flags reativas ou aplicando classe estatica de bloqueio de animacao. |
| `staticFallbackClassName` | `string` | Nao | Classes aplicadas quando `prefersReducedMotion === true` para travar `@keyframes` / transicoes no estado final estatico. |
| `observeVisibility` | `boolean` | Nao | Quando `true`, usa `IntersectionObserver` para pausar animacoes continuas fora da viewport (`CM-10`, `D6`). |

### 1.4 `BannerMotionSubtargets` (`CM-10`)

Extensao dos seletores `data-m` consumidos por `LandingMotionController.tsx` em `#depoimentos`:

| Atributo `data-m` | Elemento Alvo em `BannerSection.tsx` | Ordem na Sequencia (`0.65s` total) |
|-------------------|--------------------------------------|------------------------------------|
| `banner` | Card container principal de `#depoimentos` | Etapa 1 (`t = 0.00s -> 0.25s`) |
| `banner-avatars` | Pilha horizontal dos 4 `SOCIAL_PROOF_AVATARS` | Etapa 2 (`t = 0.10s -> 0.32s`) |
| `banner-proof` | Texto `"Mais de +5.000 designers já estão utilizando"` | Etapa 3 (`t = 0.18s -> 0.40s`) |
| `banner-heading` | `h2#depoimentos-heading` (`"Concentre-se no design, não na rotina."`) | Etapa 4 (`t = 0.26s -> 0.51s`) |
| `banner-cta` | Wrapper do botao `"Usar no Figma"` (`white-solid`) | Etapa 5 (`t = 0.41s -> 0.65s`) |
| `banner-marquee` | Faixa `TestimonialMarquee` (`D6`) | Revelacao suave acoplada ao final do banner sem ultrapassar `0.65s` dos 5 itens canonicos |

## 2. Mapa de Componentes `21st.dev` (`S3`)

| Codigo | Prioridade | Componente Principal (ID MCP) | Alternativa (ID MCP) | Destino no Codigo | Dependencia de Movimento |
|--------|------------|-------------------------------|----------------------|-------------------|--------------------------|
| `D1` | `P1` | `manuarora700/glowing-effect` (`1567`) | `kevingirelli/spotlight` (`35180`) | `src/components/ui/21st/GlowingEffect.tsx` -> usado em `FeaturesSection.tsx` | `motion` ou ponteiro RAF (ativo so em `(hover: hover)` + `no-preference`) |
| `D2` | `P1` | `kevingirelli/animated-border` (`35188`) | N/A | `src/components/ui/21st/AnimatedBorder.tsx` -> usado em `MagicCopyCard.tsx` | Dirigido exclusivamente por `beamPulse` (GSAP); loop proprio desligado |
| `D3` | `P1` | `hyperiux/shiny-button` (`27265`) | `dillionverma/shimmer-button` (`833`) | `src/components/ui/21st/ShinyButton.tsx` -> integrado em `CtaButton.tsx` (`primary-gradient`) | CSS `@property` / conic-gradient envolto por `S4` para parar em reduced motion |
| `D5` | `P2` | `hyperiux/elevate-navbar` (`26786`) | N/A | `src/components/ui/21st/ElevateNavbar.tsx` -> integrado em `Header.tsx` | GSAP hover + estado React acessivel no drawer mobile |
| `D6` | `P3` | `harshjadhavconnect/testimonial-marquee` (`24457`) | N/A | `src/components/ui/21st/TestimonialMarquee.tsx` -> integrado em `BannerSection.tsx` | CSS marquee ou `motion`, pausado fora de tela e parado em reduced motion |
| `D7` | `P3` | `kedhareswer/beam-wordmark-footer` (`35251`) | N/A | `src/components/ui/21st/LightBeamFooter.tsx` -> integrado em `Footer.tsx` | Feixe diagonal em gradiente roxo/indigo + hover protegido por `motion-safe:` |

## 3. Entidades Existentes Preservadas Inalteradas

- `SITE_LINKS` (`navItems`: `"Recursos"`, `"Sobre"`, `"Depoimentos"`; `ctas`: `"Usar no Figma"`, `"Comunidade"`; `socialLinks`: `"Discord"`, `"GitHub"`, `"Instagram"`).
- `FEATURE_CARDS` (os 4 cards em `src/lib/constants.ts`, incluindo a copy corrigida do `"Gerador de avatar"`).
- `BANNER_SOCIAL_PROOF_TEXT` (`"Mais de +5.000 designers já estão utilizando"`).
- `FOOTER_CREDIT` (`"Desenvolvido por: João Gabriel"`).
