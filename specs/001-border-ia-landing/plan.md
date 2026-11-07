# Implementation Plan: Landing Page do Plugin Border-IA

**Branch**: `001-border-ia-landing` (trabalho mantido na branch `main`) | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-border-ia-landing/spec.md`

## Summary

Implementar a landing page responsiva de alta fidelidade do plugin de Figma **Border-IA** (Desktop `1440px` / container util `1216px` e Mobile `430px`) sobre a stack oficial do projeto: Next.js 16 (App Router com `cacheComponents: true`), React 19, TypeScript, Tailwind CSS v4, GSAP (`@gsap/react`, `ScrollTrigger`, `DrawSVGPlugin`), Lenis e Three.js com `@react-three/fiber`. A arquitetura renderiza um shell estatico instantaneo em Server Components para proteger o primeiro paint (LCP), sincroniza rolagem suave do Lenis ao clock do GSAP, executa a coreografia completa (`CM-01` a `CM-12`) incluindo tracado caligrafico SVG e vitrine interativa `"Magic copy"`, carrega sob demanda dois shapes realistas restritos ao Hero (shader volumetrico do feixe roxo + prismas 3D chanfrados em losango com `MeshPhysicalMaterial`) com pausa automatica fora de tela e garante respeito integral e reativo a `prefers-reduced-motion: reduce`.

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), React `19.3.0`, Next.js `16.4.5` (App Router)

**Primary Dependencies**: `tailwindcss` `^4` (`@tailwindcss/turbopack`), `gsap` `^3.15.1` (`ScrollTrigger`, `DrawSVGPlugin`), `@gsap/react` `^2.1.2`, `lenis` `^1.3.27` (`lenis/react`), `three` `^0.187.0`, `@react-three/fiber` `^9.8.2`

**Storage**: N/A (pagina estatica; configuracao e copy tipados em codigo em `src/lib/constants.ts` e assets locais em `public/`)

**Testing**: Validacao estatica via `npm run lint` e `npm run build` + roteiro de verificacao visual, performance, teclado e `prefers-reduced-motion` em `quickstart.md`

**Target Platform**: Navegadores web modernos em Desktop (`1440px` alvo de design, suporte fluido ate `2560px+`) e Mobile (`430px` alvo de design, zero scroll horizontal desde `320px`)

**Project Type**: Web application (Single-page marketing/portfolio landing page em Next.js App Router)

**Performance Goals**: Primeiro conteudo principal visivel sem bloqueio por JS 3D (`LCP < 1.8s` em banda larga padrao), `CLS <= 0.05`, fluidez alvo de `60fps` em animacoes de entrada e scroll, no maximo 2 contextos WebGL leves restritos ao Hero e pausados (`frameloop="never"`) fora da viewport

**Constraints**: Proibido substituir bibliotecas da stack de `AGENTS.md`; proibido usar URLs temporarias do Figma no codigo; obrigatorio carregar a skill `figma-design-to-code` antes de `get_design_context`; proibido fazer commit, push ou criar branches autonomamente (permanecer em `main`); proibido ler `.env*`; proibido usar travessao (`U+2014`) em qualquer arquivo ou comentario

**Scale/Scope**: Pagina unica com 5 secoes (`Header`, `Hero`, `Recursos`, `Banner CTA`, `Footer`), 12 unidades coreografadas (`CM-01` a `CM-12`), 2 componentes WebGL carregados sob demanda e conjunto completo de tokens/assets locais

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio da Constituicao | Avaliacao Pre-Pesquisa | Avaliacao Pos-Design (Phase 1) |
|---------------------------|------------------------|--------------------------------|
| **I. Fidelidade Visual e Contratual ao Figma** | APROVADO: Alvos `307:78`, `335:10650` e `21:3195` mapeados; overrides de copy e exclusao da Status Bar mobile incorporados | APROVADO: `contracts/ui-contracts.md` exige extracao de `Linear-degrade`, unidades de `letter-spacing` e assets locais via `figma-design-to-code` + `get_design_context` |
| **II. Movimento Intencional e Shapes Realistas** | APROVADO: GSAP + `@gsap/react` + Lenis + Three.js/R3F definidos sem alterar silhueta do layout | APROVADO: `HeroBeamCanvas` (GLSL volumetrico) e `PluginPrismLogo3D` (`ExtrudeGeometry` + `MeshPhysicalMaterial`) contam com fallbacks SVG/CSS identicos e `WebGLSafeBoundary` |
| **III. Respeito Integral a `prefers-reduced-motion`** | APROVADO: `gsap.matchMedia()` e desativacao do Lenis planejados | APROVADO: `SmoothScrollProvider`, hooks GSAP e wrappers 3D reagem em tempo real a `(prefers-reduced-motion: reduce)` exibindo tracos e textos 100% completos |
| **IV. Performance de Primeiro Paint e Renderizacao** | APROVADO: Server Components no shell + dynamic import para 3D | APROVADO: `next/dynamic({ ssr: false })` isolado em client wrappers, animacoes apenas em `transform`/`opacity`/`drawSVG`, pausa via `IntersectionObserver` fora do Hero |
| **V. Acessibilidade Semantica e Navegabilidade** | APROVADO: `lang="pt-BR"`, hierarquia `h1->h2->h3` e navegacao por teclado | APROVADO: Contrato DOM define marcos semanticos, `aria-label` em redes sociais, `:focus-visible` nitido e `aria-hidden="true"` em camadas decorativas |
| **Restricoes de Stack, Git e Conteudo** | APROVADO: Zero pacotes extras fora de `package.json`, branch `main`, PT-BR sem `U+2014` | APROVADO: Nenhum pacote adicional exigido (nem `@react-three/drei`), tudo resolvido com as dependencias instaladas |

## Project Structure

### Documentation (this feature)

```text
specs/001-border-ia-landing/
├── spec.md              # Especificacao funcional, historias de usuario e matriz CM-01..CM-12
├── plan.md              # Este plano de implementacao tecnica
├── research.md          # Decisoes arquiteturais da Fase 0 (Next 16, Tailwind 4, GSAP+Lenis, R3F)
├── data-model.md        # Entidades tipadas de conteudo, links e estados de movimento
├── quickstart.md        # Roteiro executavel de validacao visual, performance e a11y
├── contracts/
│   └── ui-contracts.md  # Contratos de tokens Figma, DOM semantico, responsividade e props
├── checklists/
│   └── requirements.md  # Checklist de qualidade da especificacao
└── tasks.md             # Lista ordenada e verificavel de tarefas (/speckit-tasks)
```

### Source Code (repository root)

```text
public/
├── icons/
│   ├── figma-mark.svg
│   ├── sparkle.svg
│   ├── menu-lines.svg
│   ├── feature-bg-remover.svg
│   ├── feature-text-gen.svg
│   ├── feature-image-upscaler.svg
│   ├── feature-avatar-gen.svg
│   ├── social-discord.svg
│   ├── social-github.svg
│   └── social-instagram.svg
└── images/
    ├── hero-figma-ui-desktop.webp
    ├── hero-figma-ui-mobile.webp
    └── avatars/
        ├── avatar-1.webp
        ├── avatar-2.webp
        ├── avatar-3.webp
        └── avatar-4.webp

src/
├── app/
│   ├── favicon.ico
│   ├── globals.css                      # Tokens @theme inline (Gray, Purple, Indigo, Space Grotesk, Linear-degrade)
│   ├── layout.tsx                       # Server Component: lang="pt-BR", Space_Grotesk, Metadata, SmoothScrollProvider
│   └── page.tsx                         # Server Component: composicao Header + main (Hero, Recursos, Banner) + Footer
├── components/
│   ├── sections/
│   │   ├── Header.tsx                   # Secao Header (Desktop com nav + Comunidade; Mobile com Logo + Comunidade)
│   │   ├── HeroSection.tsx              # Secao Hero (texto, oval H1, feixe luminoso, vitrine WebProcess 2.0 + MagicCopyCard)
│   │   ├── FeaturesSection.tsx          # Secao Recursos (tag, H2 com rabisco, grade responsiva de 4 cards)
│   │   ├── BannerSection.tsx            # Secao Banner CTA (malhas de pontos nos cantos, avatares, prova social, H2, CTA claro)
│   │   └── Footer.tsx                   # Secao Footer (divisor, logo, redes sociais, credito "João Gabriel")
│   ├── ui/
│   │   ├── BorderIaLogo.tsx             # Logo vetorial dois losangos + wordmark com micro-hover
│   │   ├── TagBadge.tsx                 # Tag reutilizavel ("Plugin Figma", "Recursos")
│   │   ├── CtaButton.tsx                # Botao primario ("Usar no Figma" gradiente/claro) e secundario ("Comunidade")
│   │   ├── AnimatedStrokeWord.tsx       # Palavra com SVG ancorado para oval ("interfaces") e rabisco ("Border-IA")
│   │   ├── DotMatrixDecor.tsx           # Malha de pontos SVG/CSS para fallback do Hero e cantos do Banner CTA
│   │   └── MagicCopyCard.tsx            # Componente client interativo do card flutuante no Hero
│   ├── motion/
│   │   ├── SmoothScrollProvider.tsx     # Integracao ReactLenis + gsap.ticker + ScrollTrigger + ancoras suaves
│   │   └── LandingMotionController.tsx  # Orquestracao useGSAP + gsap.matchMedia() para CM-01..CM-11 (ou hooks por secao)
│   └── three/
│       ├── WebGLSafeBoundary.tsx        # Deteccao de suporte WebGL + ErrorBoundary com fallback silencioso
│       ├── HeroBeamCanvas.tsx           # R3F + ShaderMaterial GLSL do feixe vertical roxo e halo volumetrico (CM-04)
│       ├── HeroBeamLazy.tsx             # Wrapper client com next/dynamic({ ssr: false }) + HeroBeamFallback
│       ├── PluginPrismLogo3D.tsx        # R3F + ExtrudeGeometry + MeshPhysicalMaterial dos dois losangos (CM-05)
│       └── PluginPrismLogoLazy.tsx      # Wrapper client com next/dynamic({ ssr: false }) + placeholder SVG
├── hooks/
│   └── useMotionEnvironment.ts          # Hook client reativo para prefers-reduced-motion, hover/pointer e IntersectionObserver
├── lib/
│   ├── constants.ts                     # SITE_LINKS, FEATURE_ITEMS, SOCIAL_PROOF_AVATARS e COPY_CONTRACT
│   └── gsap.ts                          # Registro centralizado unico de useGSAP, ScrollTrigger e DrawSVGPlugin
└── types/
    └── landing.ts                       # Interfaces TypeScript das entidades de conteudo e movimento
```

**Structure Decision**: Adota-se a estrutura nativa de projeto unico do Next.js App Router com `src/` na raiz do repositorio (conforme `tsconfig.json` existente `@/* -> ./src/*`), separando claramente secoes de pagina (`components/sections`), primitivos visuais (`components/ui`), coordenacao GSAP/Lenis (`components/motion`) e shapes realistas carregados sob demanda (`components/three`).

## Complexity Tracking

Nenhuma violacao a Constituicao foi introduzida; tabela nao aplicavel.
