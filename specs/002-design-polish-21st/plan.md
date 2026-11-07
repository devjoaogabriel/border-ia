# Implementation Plan: Polimento Visual e Componentes Elevados da Landing Page Border-IA

**Branch**: `002-design-polish-21st` (trabalho mantido na branch `main`) | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-design-polish-21st/spec.md`

## Summary

Elevar o acabamento visual e interativo da landing page **Border-IA** sobre o codigo implementado na feature `001` (`commit 325dbfb`), incorporando a fundacao `shadcn/ui` mapeada aos tokens atuais (`S1`), o pacote `motion` convivendo com GSAP (`S2`), a importacao/adaptacao dos componentes aprovados da `21st.dev` (`S3`) e um envoltorio reutilizavel de movimento reduzido e carregamento sob demanda (`S4`). Em seguida, resolver integralmente as duas pendencias da entrega anterior (`CM-10` com sequencia de 5 etapas em `0.65s` + onda radial real nas malhas do banner, e `D4` protegendo os 6 hovers CSS sob `prefers-reduced-motion`) e aplicar por ordem de prioridade as melhorias `P1` (`D1` Glowing Effect em `FeaturesSection`, `D2` Animated Border sincronizado a `beamPulse` em `MagicCopyCard`, `D3` Shiny Button em `CtaButton` `primary-gradient`), `P2` (`D5` Elevate Navbar com menu mobile acessivel em `Header`) e `P3` (`D6` Testimonial Marquee com avatares locais, selo visivel provisorio e trava `verify:release` em `BannerSection`, e `D7` Light Beam Footer recolorido em `Footer`), garantindo Lighthouse Performance `>= 90` frente a linha de base medida antes de `S1`.

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), React `19.3.0`, Next.js `16.4.5` (App Router)

**Primary Dependencies**: `tailwindcss` `^4` (`@tailwindcss/turbopack`), `shadcn/ui` (`clsx`, `tailwind-merge`, `components.json` + `src/lib/utils.ts`), `gsap` `^3.15.1` (`ScrollTrigger`, `DrawSVGPlugin`), `@gsap/react` `^2.1.2`, `motion` (Framer Motion `motion/react` restrito a componentes `21st.dev`), `lenis` `^1.3.27`, `three` `^0.187.0`, `@react-three/fiber` `^9.8.2`

**Storage**: N/A (configuracoes, links e itens de depoimento tipados em `src/lib/constants.ts`; assets locais em `public/`)

**Testing**: `npm run lint`, `npm run build`, auditoria Lighthouse CLI pre-`S1` e pos-implementacao (`Performance >= 90`), script verificador de bloqueio de release `npm run verify:release` (`scripts/verify-release-ready.mjs`) e roteiro completo em `quickstart.md`

**Target Platform**: Navegadores web modernos em Desktop (`1440px` referencia, suporte fluido ate `2560px+`) e Mobile (`430px` referencia, zero overflow horizontal desde `320px`)

**Project Type**: Web application (Single-page marketing/portfolio landing page em Next.js App Router)

**Performance Goals**: Nota de Performance no Lighthouse `>= 90` comparada a linha de base pre-`S1`, zero novos contextos WebGL fora dos 2 ja existentes no Hero, animacoes continuas pausadas fora da viewport (`CM-10`, `D6`) e carregamento sob demanda (`next/dynamic`) para componentes pesados abaixo da dobra

**Constraints**: `API_KEY_21ST` ausente no ambiente (usar `get_component` do MCP Magic por ordem `P1 -> P2 -> P3` com contingencia para limite de cota diaria); proibido ler `.env*`; proibido fazer commit, push ou criar branches (permanecer em `main`); proibido publicar depoimentos provisorios sem selo visivel e sem bloqueio em `verify:release`; proibido usar travessao (`U+2014`) em qualquer arquivo ou comentario

**Scale/Scope**: 4 tarefas de infraestrutura (`S1`-`S4`) + medicao de linha de base, 2 pendencias estruturais (`CM-10` em duas partes e `D4` em 6 arquivos) e 6 componentes elevados da `21st.dev` distribuidos em `D1`-`D3`, `D5`, `D6` e `D7`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio da Constituicao (v2.0.0) | Avaliacao Pre-Pesquisa | Avaliacao Pos-Design (Phase 1) |
|------------------------------------|------------------------|--------------------------------|
| **I. Base Visual no Figma com Elevacoes Autorizadas (21st.dev)** | APROVADO: Emenda `v2.0.0` autoriza `D1` a `D7` mantendo paleta, fonte `Space Grotesk` e regras de copy | APROVADO: `contracts/ui-contracts.md` preserva copy contratual, crédito `"Desenvolvido por: João Gabriel"`, assets locais e define selo visivel + `verify:release` para `D6` |
| **II. Movimento Intencional, Componentes Elevados e Shapes Realistas** | APROVADO: `motion` autorizado apenas para componentes `21st.dev`; GSAP segue dono das timelines globais | APROVADO: `D2` desliga loop proprio e acopla-se a `beamPulse`; seletores `[data-m]` mantidos nas cascas externas sem conflito GSAP vs `motion` |
| **III. Respeito Integral a `prefers-reduced-motion`** | APROVADO: `S4` e `D4` enderecam lacunas nativas de componentes e hovers CSS | APROVADO: `MotionSafeWrapper.tsx`, regras `@media (prefers-reduced-motion: reduce)` para `ShinyButton`/`DotMatrixDecor`/`TestimonialMarquee` e `motion-safe:` nos 6 pontos de `D4` |
| **IV. Performance de Primeiro Paint e Orcamento de Renderizacao** | APROVADO: Linha de base do Lighthouse planejada antes de `S1` | APROVADO: Zero novos contextos WebGL; `CM-10` usa mascara CSS leve pausada fora da tela e `D6` carrega sob demanda com pausa fora da viewport |
| **V. Acessibilidade Semantica e Navegabilidade** | APROVADO: Novo menu mobile (`D5`), marquee (`D6`) e footer (`D7`) seguem semantica estrita | APROVADO: `aria-expanded`/`aria-controls`/`Escape` no menu mobile, `aria-hidden="true"` em trilhas duplicadas e feixes luminosos, foco visivel preservado |
| **Restricoes de Stack, Git e Conteudo** | APROVADO: `shadcn/ui` e `motion` oficializados em `constitution.md` e `AGENTS.md`; branch `main`; zero `U+2014` | APROVADO: Nenhum acesso a `.env*` (nem no script `verify-release-ready.mjs`); zero commits/branches por agente |

## Project Structure

### Documentation (this feature)

```text
specs/002-design-polish-21st/
├── spec.md              # Especificacao funcional, historias de usuario (P1, P2, P3) e criterios SC-001..SC-007
├── plan.md              # Este plano de implementacao tecnica
├── research.md          # Decisoes da Fase 0 (shadcn + Tailwind 4, motion + GSAP, cota MCP 21st, CM-10, D2, D6)
├── data-model.md        # Entidades TestimonialItem, estado TESTIMONIALS_VERIFIED, alvos CM-10 e mapa 21st.dev
├── quickstart.md        # Roteiro executavel com baseline Lighthouse pre-S1, reduced-motion e verify:release
├── contracts/
│   └── ui-contracts.md  # Contratos de tokens shadcn, seletores data-m, 6 hovers D4 e regras D1..D7
├── checklists/
│   └── requirements.md  # Checklist de qualidade da especificacao (16/16 validado)
└── tasks.md             # Lista ordenada e verificavel de tarefas (/speckit-tasks)
```

### Source Code (repository root)

```text
components.json                                  # [NOVO - S1] Configuracao shadcn/ui compativel com Tailwind v4 e Next 16
scripts/
└── verify-release-ready.mjs                     # [NOVO - D6] Trava de publicacao contra depoimentos provisorios (exit 1 enquanto nao verificados)
src/
├── app/
│   ├── globals.css                              # [MOD - S1, S4] Variaveis shadcn mapeadas para gray/purple/indigo + guardas CSS reduced-motion
│   ├── layout.tsx                               # [MANTIDO] Space Grotesk + SmoothScrollProvider
│   └── page.tsx                                 # [MANTIDO] Composicao das secoes dentro de LandingMotionController
├── components/
│   ├── motion/
│   │   ├── LandingMotionController.tsx          # [MOD - CM-10] Sequencia de 5 elementos do banner em 0.65s + gatilho de visibilidade
│   │   ├── MotionSafeWrapper.tsx                # [NOVO - S4] Envoltorio reativo para prefers-reduced-motion, canHover e visibilidade
│   │   └── SmoothScrollProvider.tsx             # [MANTIDO]
│   ├── sections/
│   │   ├── Header.tsx                           # [MOD - D4, D5] Elevate Navbar pill glass + links diretos + menu mobile acessivel (< 1024px)
│   │   ├── HeroSection.tsx                      # [MANTIDO] Consome CtaButton primary-gradient (D3) e MagicCopyCard (D2)
│   │   ├── FeaturesSection.tsx                  # [MOD - D4, D1] Glowing Effect / Spotlight nos 4 cards + hover motion-safe nos icones
│   │   ├── BannerSection.tsx                    # [MOD - CM-10, D6] Subalvos data-m, onda nas malhas e TestimonialMarquee provisorio
│   │   └── Footer.tsx                           # [MOD - D4, D7] Light Beam Footer em gray-11/purple/indigo + SITE_LINKS + credito fixo
│   └── ui/
│       ├── 21st/
│       │   ├── GlowingEffect.tsx                # [NOVO - S3/D1] Componente adaptado da 21st.dev (ID 1567 / alt 35180)
│       │   ├── AnimatedBorder.tsx               # [NOVO - S3/D2] Componente adaptado da 21st.dev (ID 35188) dirigido por beamPulse
│       │   ├── ShinyButton.tsx                  # [NOVO - S3/D3] Componente adaptado da 21st.dev (ID 27265 / alt 833) com guarda S4
│       │   ├── ElevateNavbar.tsx                # [NOVO - S3/D5] Componente adaptado da 21st.dev (ID 26786) sem dropdowns
│       │   ├── TestimonialMarquee.tsx           # [NOVO - S3/D6] Componente adaptado da 21st.dev (ID 24457) com badge provisorio
│       │   └── LightBeamFooter.tsx              # [NOVO - S3/D7] Componente adaptado da 21st.dev (ID 35251) recolorido
│       ├── BorderIaLogo.tsx                     # [MOD - D4] Hover scale protegido com motion-safe:
│       ├── CtaButton.tsx                        # [MOD - D4, D3] Hover base motion-safe: + integracao ShinyButton em primary-gradient
│       ├── DotMatrixDecor.tsx                   # [MOD - CM-10] Onda radial luminosa em ciclo curto enquanto visivel
│       └── MagicCopyCard.tsx                    # [MOD - D4, D2] Hover motion-safe em "Start now" + AnimatedBorder acoplado a beamPulse
├── hooks/
│   └── useMotionEnvironment.ts                  # [MANTIDO] Consumido por MotionSafeWrapper e novos componentes
├── lib/
│   ├── constants.ts                             # [MOD - D6] TESTIMONIALS_VERIFIED = false e TESTIMONIAL_ITEMS com avatares locais
│   ├── gsap.ts                                  # [MANTIDO] Exporta gsap, ScrollTrigger, DrawSVGPlugin e beamPulse
│   └── utils.ts                                 # [NOVO - S1] Helper cn() com clsx + tailwind-merge
└── types/
    └── landing.ts                               # [MOD - D6, S4] Contratos TestimonialItem e MotionSafeWrapperProps
```

**Structure Decision**: Mantem a estrutura enxuta de projeto unico Next.js App Router criada na feature `001`, concentrando os primitivos importados e adaptados da `21st.dev` em `src/components/ui/21st/` para separar nitidamente a camada de efeitos visuais dos contratos semanticos de secao em `src/components/sections/`, alem de isolar o verificador de liberacao de prova social em `scripts/verify-release-ready.mjs`.

## Complexity Tracking

Nenhuma violacao constitucional identificada. Tabela nao aplicavel.
