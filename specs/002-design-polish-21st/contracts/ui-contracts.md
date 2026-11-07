# UI & Motion Contracts: Feature 002 (Design Polish 21st.dev)

**Feature**: `002-design-polish-21st`
**Date**: 2026-11-06

## 1. Contrato de Tokens `shadcn/ui` em `src/app/globals.css` (`S1`)

O mapeamento em `src/app/globals.css` DEVE preservar todas as variaveis existentes (`--color-gray-01..11`, `--color-purple-01..11`, `--color-indigo-01..11`, `--gradient-linear-degrade`, `--gradient-banner-heading`) e expor os tokens semanticos do `shadcn/ui` mapeados diretamente para elas:

| Token `shadcn` | Mapeamento Obrigatorio | Hex Equivalente |
|----------------|------------------------|-----------------|
| `--background` | `var(--color-gray-11)` | `#09090B` |
| `--foreground` | `var(--color-gray-01)` | `#FFFFFF` |
| `--card` | `var(--color-gray-10)` | `#101014` |
| `--card-foreground` | `var(--color-gray-01)` | `#FFFFFF` |
| `--popover` | `var(--color-gray-10)` | `#101014` |
| `--popover-foreground` | `var(--color-gray-01)` | `#FFFFFF` |
| `--primary` | `var(--color-purple-05)` | `#C082FF` |
| `--primary-foreground` | `var(--color-gray-11)` | `#09090B` |
| `--secondary` | `var(--color-gray-09)` | `#16161B` |
| `--secondary-foreground` | `var(--color-gray-01)` | `#FFFFFF` |
| `--muted` | `var(--color-gray-09)` | `#16161B` |
| `--muted-foreground` | `var(--color-gray-04)` | `#A2A2AC` |
| `--accent` | `var(--color-indigo-06)` | `#7967FF` |
| `--accent-foreground` | `var(--color-gray-01)` | `#FFFFFF` |
| `--border` | `var(--color-gray-08)` | `#1E1E26` |
| `--input` | `var(--color-gray-08)` | `#1E1E26` |
| `--ring` | `var(--color-purple-05)` | `#C082FF` |

**Invariante**: As classes `.container-page`, `.t-h1`, `.t-h2`, `.t-h-banner`, `.t-tag`, `.t-p` e `.text-gradient` em `@layer components` NAO podem ser removidas nem ter suas metricas tipograficas alteradas.

---

## 2. Contrato de Seletores Coreografados (`LandingMotionController.tsx`)

Todos os componentes substituidos ou evoluídos DEVEM preservar os atributos `data-m` esperados pelo controlador global do GSAP:

1. `Header.tsx` (`D5`): O `<header>` raiz DEVE manter `data-m="header"`.
2. `FeaturesSection.tsx` (`D1`): Cada `<article>` dos 4 cards DEVE manter `data-m="feat-card"`.
3. `BannerSection.tsx` (`CM-10` + `D6`): O card container DEVE manter `data-m="banner"` e incluir obrigatoriamente os subalvos `data-m="banner-avatars"`, `data-m="banner-proof"`, `data-m="banner-heading"` e `data-m="banner-cta"`.
4. `Footer.tsx` (`D7`): O `<footer>` raiz DEVE manter `data-m="footer"`.

---

## 3. Contratos Especificos por Item (`CM-10`, `D1` a `D7`)

### 3.1 `CM-10` - Sequencia `0.65s` e Onda Luminosa Radial nas Malhas
- **Sequencia**: `LandingMotionController.tsx` revela `banner -> banner-avatars -> banner-proof -> banner-heading -> banner-cta` em `<= 0.65s` totais no primeiro scroll ate `#depoimentos`.
- **Onda radial**: `DotMatrixDecor.tsx` aceita prop `animatedWave?: boolean` (ativa em `BannerSection.tsx`). Quando ativa e em `(prefers-reduced-motion: no-preference)`, renderiza onda radial luminosa nos tons `purple-05` / `indigo-05` mascarada exatamente pelos pontos de `/images/dot-matrix-banner.svg`, pausada fora da viewport por `ScrollTrigger` / `IntersectionObserver`. Em `prefers-reduced-motion: reduce`, exibe apenas a malha estatica padrao (`opacity: 0.9`, sem loop).

### 3.2 `D4` - 6 Pontos Exatos de Hover CSS sob `prefers-reduced-motion`
Toda transicao e transformacao de hover nos 6 pontos abaixo DEVE usar prefixo `motion-safe:` (ou `@media (prefers-reduced-motion: no-preference)`):
1. `src/components/sections/Header.tsx`: links de navegacao (`motion-safe:transition-colors motion-safe:duration-300`, ou equivalente no novo `ElevateNavbar` de `D5`).
2. `src/components/ui/BorderIaLogo.tsx`: link do logotipo (`motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.03]`).
3. `src/components/ui/CtaButton.tsx`: classe base do botao (`motion-safe:transition motion-safe:duration-300` e `motion-safe:hover:brightness-110`).
4. `src/components/sections/FeaturesSection.tsx`: caixa `48x48` do icone (`motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-0.5`).
5. `src/components/sections/Footer.tsx`: links sociais (`motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-0.5`, preservado tambem na migracao para `D7`).
6. `src/components/ui/MagicCopyCard.tsx`: botao `"Start now"` (`motion-safe:transition motion-safe:duration-300`).

### 3.3 `D1` - `FeaturesSection` (`Glowing Effect` `1567` / `Spotlight` `35180`)
- Borda iluminada utiliza as cores de `--gradient-linear-degrade` (`#C082FF` -> `#7967FF`).
- Ativa exclusivamente quando `window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches` for verdadeiro.
- Camada luminosa marcada com `aria-hidden="true"` e `pointer-events-none`.

### 3.4 `D2` - `MagicCopyCard` (`Animated Border` `35188`)
- Loop autonomo interno do `Animated Border` DESLIGADO.
- O deslocamento angular da luz na borda e controlado pelo mesmo `beamPulse` (`src/lib/gsap.ts`) animado na timeline de `MagicCopyCard.tsx` e pelo pulso imediato de `handleStartNow`, sem duplicar o efeito de `[data-card-glow]`.
- Em `prefers-reduced-motion: reduce`, a borda exibe contorno sutil estatico sem rotacao.

### 3.5 `D3` - `CtaButton` Variante `primary-gradient` (`Shiny Button` `27265` / `Shimmer Button` `833`)
- Aplicado SOMENTE quando `variant === "primary-gradient"` em `src/components/ui/CtaButton.tsx` (atualmente o CTA `"Usar no Figma"` em `HeroSection.tsx`).
- Variantes `"outline-gradient"` (`"Comunidade"`) e `"white-solid"` (`"Usar no Figma"` no Banner) e o botao proprio `"Start now"` em `MagicCopyCard.tsx` NAO recebem o efeito `Shiny Button`.
- Preserva altura (`56px`), padding, raio (`rounded-lg`), tipografia `Space Grotesk` e cores do Figma.
- Envolvido pela guarda de `S4` para interromper 100% da rotacao conic em `prefers-reduced-motion: reduce`.

### 3.6 `D5` - `Header` (`Elevate Navbar` `26786`)
- Substitui o layout interno de `src/components/sections/Header.tsx` por barra em capsula translucida (`bg-gray-10/75 backdrop-blur-md border border-gray-08`).
- Mantem `BorderIaLogo` a esquerda, links diretos de `SITE_LINKS.navItems` (`#recursos`, `#sobre`, `#depoimentos`) ao centro em `>= 1024px` (com hover em GSAP apenas em `no-preference`, **sem nenhum dropdown/painel flutuante**) e `CtaButton` (`SITE_LINKS.ctas.comunidade`) a direita.
- Abaixo de `1024px` (`lg:hidden`), exibe botao de menu acessivel (`min-h-11 min-w-11`, `aria-expanded`, `aria-controls="mobile-nav-panel"`, `aria-label` claro em PT-BR) que abre painel contendo os 3 links diretos e o CTA `"Comunidade"`, fechando ao clicar em link ou pressionar `Escape` (sem animacao de deslocamento quando em reduced motion).

### 3.7 `D6` - `BannerSection` (`Testimonial Marquee` `24457`)
- Integrado a `src/components/sections/BannerSection.tsx` complementando o card CTA sem remover `"Mais de +5.000 designers já estão utilizando"`, os 4 avatares empilhados, o titulo nem o botao.
- Consome `TESTIMONIAL_ITEMS` e `SOCIAL_PROOF_AVATARS` locais. Copias duplicadas da trilha para continuidade visual recebem `aria-hidden="true"`.
- Enquanto `TESTIMONIALS_VERIFIED === false` ou `item.isPlaceholder === true`, cada card exibe badge visivel `"Conteúdo provisório"` e `npm run verify:release` encerra com codigo `1`.
- Pausa quando fora da viewport e renderiza estatico (sem animacao de translação) sob `prefers-reduced-motion: reduce`.

### 3.8 `D7` - `Footer` (`Light Beam Footer` `35251`)
- Substitui `src/components/sections/Footer.tsx` recolorindo integralmente do azul-marinho original para `bg-gray-11` (`#09090B`), bordas `gray-08` e feixe diagonal usando `purple-05` / `indigo-06` (`--gradient-linear-degrade`).
- Remove colunas de links inexistentes: renderiza apenas atalhos reais de `SITE_LINKS.navItems` e `SITE_LINKS.socialLinks`.
- Exibe wordmark monumental `"Border-IA"` em `Space Grotesk` responsivo (sem gerar overflow em `320px`/`430px`), preserva `data-m="footer"` e mantem de forma imutavel o texto `"Desenvolvido por: João Gabriel"`.
