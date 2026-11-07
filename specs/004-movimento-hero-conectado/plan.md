# Implementation Plan: Movimento Conectado no Hero (Bounce da Janela, Feixe Flexivel e Hover 3D no Card)

**Branch**: `004-movimento-hero-conectado` (trabalho mantido na branch `main`) | **Date**: 2026-11-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-movimento-hero-conectado/spec.md`

## Summary

Conectar organicamente o movimento dos tres elementos visuais do Hero da landing page **Border-IA** sem adicionar nenhuma dependencia: (1) remover o arraste com clique (`Draggable`) e substituir a interacao do card `"Magic copy"` (`src/components/ui/MagicCopyCard.tsx`) exclusivamente por inclinacao 3D direta no `hover` do mouse (`±10°` vertical, `±12°` horizontal, entrada sem salto a partir do balance, atenuacao suave sobre `"Start now"`, bounce elastico de `0.85s` ao sair e reducao de `MAX_TILT` do emblema 3D para `4.5°`); (2) transformar a linha rigida do feixe Desktop (`src/components/three/HeroBeamLazy.tsx` + `src/components/three/HeroBeamCanvas.tsx`) em uma curva Cubic Bezier em `<svg>` (`gradientUnits="userSpaceOnUse"`) acoplada por mola amortecida ao ponto 3D real de contato no topo do card e sincronizada algebricamente com o rastro do shader (`y(t) = t * H`), sem fresta em nenhum angulo; e (3) adicionar flutuacao vertical continua sutil (`±6px` Desktop / `±4px` Mobile em `4.8s`) a janela da interface Figma (`src/components/sections/HeroSection.tsx` + `src/components/motion/LandingMotionController.tsx`) em wrapper dedicado externo a imagem mascarada, preservando o parallax `y: -28`, a compatibilidade WebKit (iPhone/Safari) e a nota de Lighthouse Mobile (~`63`).

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), React `19.3.0`, Next.js `16.4.5` (App Router)

**Primary Dependencies**: `gsap` `^3.15.1` (`ScrollTrigger`, `DrawSVGPlugin`), `@gsap/react` `^2.1.2`, `lenis` `^1.3.27`, `three` `^0.187.0`, `@react-three/fiber` `^9.8.2`, `tailwindcss` `^4` (mais `framer-motion` restrito exclusivamente ao `H1` em `src/components/ui/animated-shiny-text.tsx` conforme Constituicao `v1.1.0`)

**Storage**: N/A (ponte de movimento quadro a quadro via objeto plano mutavel `heroCardMotion` em `src/lib/gsap.ts`, zero estado React por frame)

**Testing**: `npm run lint`, `npm run build`, validacao cruzada em **Playwright Chromium e Playwright WebKit** (`1440x900` e `430x932` iPhone) e comparativo **Lighthouse Mobile e Desktop (mediana de 3 antes vs depois)** conforme `quickstart.md`

**Target Platform**: Navegadores modernos Desktop (`1440px`, motores Blink e WebKit/Safari) e Mobile (`430px`, especialmente iOS WebKit/iPhone e Android Chrome)

**Project Type**: Web application (Single-page landing page em Next.js App Router)

**Performance Goals**: Zero pacotes novos (e remocao do registro de `Draggable` do bundle cliente), zero re-renders React a 60/120fps, zero re-rasterizacao por frame da mascara linear de `hero-figma-ui.svg`, inicio do bounce da janela apos `1.1s` (fora da janela de medicao do LCP Mobile), pausa integral fora da tela e manutencao ou melhoria do Lighthouse Mobile atual (~`63`)

**Constraints**: Zero novas dependencias em `package.json`; proibido alterar `animated-shiny-text.tsx`, `AnimatedStrokeWord.tsx` (oval e rabisco) e `BorderIaLogo.tsx`; trabalhar na `main` sem criar branch, sem `git commit` e sem `git push`; proibido ler `.env*`; proibido usar travessao (`U+2014`)

**Scale/Scope**: Evolucao cirurgica concentrada em 8 arquivos existentes do Hero e infraestrutura de movimento (`src/types/landing.ts`, `src/lib/gsap.ts`, `src/components/ui/MagicCopyCard.tsx`, `src/components/three/PluginPrismLogo3D.tsx`, `src/components/three/HeroBeamLazy.tsx`, `src/components/three/HeroBeamCanvas.tsx`, `src/components/sections/HeroSection.tsx` e `src/components/motion/LandingMotionController.tsx`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio da Constituicao (v1.1.0) | Avaliacao Pre-Pesquisa | Avaliacao Pos-Design (Phase 1) |
|------------------------------------|------------------------|--------------------------------|
| **I. Fidelidade Visual e Contratual ao Figma** | APROVADO: Pose de repouso `(0°, 0°, 0°)` do card, altura visivel `497px` do feixe e recorte `660px` da janela permanecem identicos ao Figma | APROVADO: `<svg>` do feixe usa `gradientUnits="userSpaceOnUse"` com as mesmas paradas `#FFFFFF -> #C2BAFE -> #8A6DFE` e `4px` de espessura; sangria `14px` fica oculta atras do card (`z-10 isolate`) |
| **II. Movimento Intencional e Shapes Realistas** | APROVADO: Usa apenas GSAP (`useGSAP`, `ScrollTrigger`, `ticker`), SVG e o shader R3F ja existente | APROVADO: Mola amortecida em Cubic Bezier + shader sincronizado (`y(t) = t * H`) entregam fisica realista de fio conectado com fallback SVG estatico imediato |
| **III. Respeito Integral a `prefers-reduced-motion`** | APROVADO: Desligamento completo de bounce da janela, curvatura/pulso do feixe e balance/hover do card previsto | APROVADO: `gsap.matchMedia()` e `useMotionEnvironment()` mantem janela parada, `<path>` reto estatico em `x = 170` e card plano em `0°` |
| **IV. Performance de Primeiro Paint e Renderizacao** | APROVADO: Zero contextos WebGL novos; atencao especial ao LCP Mobile (~`63`) na imagem mascarada | APROVADO: Remocao do `Draggable` reduz JS; `[mask-image]` fica estatica no `<Image>` filho enquanto `[data-m="window-float"]` move na GPU apos `1.1s`; tudo pausa fora de tela |
| **V. Acessibilidade Semantica e Navegabilidade** | APROVADO: Feixe e bounce da janela sao `aria-hidden`; `"Start now"` mantem teclado e foco | APROVADO: Sem `cursor: grab` enganoso, atenuacao de `35%` sobre `"Start now"` estabiliza o clique e teclado segue inalterado |
| **Restricoes de Stack (v1.1.0), Git e Conteudo** | APROVADO: Zero pacotes novos, H1/oval/rabisco/logo intocaveis, branch `main`, PT-BR sem `U+2014` | APROVADO: Todos os artefatos verificados sem `U+2014`, sem leitura de `.env*` e sem operacoes de branch/commit/push |

## Project Structure

### Documentation (this feature)

```text
specs/004-movimento-hero-conectado/
├── spec.md                                     # Especificacao funcional, US1-US3, FR-001..012 e SC-001..005
├── plan.md                                     # Este plano de implementacao tecnica
├── research.md                                 # Decisoes R-01..R-05 (hover vs drag, Bezier=shader, mascara/LCP, WebKit)
├── data-model.md                               # Tipos, ponte heroCardMotion, constantes de mola e estados
├── quickstart.md                               # Roteiro de validacao (lint/build, Chromium + WebKit, Lighthouse antes/depois)
├── contracts/
│   └── hero-connected-motion-contract.md       # Contratos DOM, projecao 3D, SVG userSpaceOnUse e GLSL
├── checklists/
│   └── requirements.md                         # Checklist de qualidade da especificacao (16/16 validado)
└── tasks.md                                    # Lista ordenada e verificavel de tarefas (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── motion/
│   │   └── LandingMotionController.tsx         # [MOD] Loop vertical suave [data-m="window-float"] (delay 1.1s + pausa fora de tela)
│   ├── sections/
│   │   └── HeroSection.tsx                     # [MOD] Envoltorios [data-m="window"] > [data-m="window-float"] > <Image mascarado>
│   ├── three/
│   │   ├── HeroBeamCanvas.tsx                  # [MOD] Uniforms uBendX, uTipX, uTipY e curva cubica exata no fragment shader
│   │   ├── HeroBeamLazy.tsx                    # [MOD] SVG <path> Cubic Bezier com gradientUnits="userSpaceOnUse" e mola amortecida
│   │   ├── PluginPrismLogo3D.tsx               # [MOD] Reducao de MAX_TILT de 8° para 4.5° para harmonizar com hover do card
│   │   └── PluginPrismLogoLazy.tsx             # [MANTIDO]
│   └── ui/
│       ├── animated-shiny-text.tsx             # [INTOCAVEL] Brilho aprovado no H1
│       ├── AnimatedStrokeWord.tsx              # [INTOCAVEL] Oval de "interfaces" e rabisco de "Border-IA"
│       ├── BorderIaLogo.tsx                    # [INTOCAVEL] Logo principal
│       └── MagicCopyCard.tsx                   # [MOD] Hover 3D (±10°/±12°), isolate no palco, sem Draggable, escrita em heroCardMotion
├── lib/
│   └── gsap.ts                                 # [MOD] Exporta heroCardMotion e remove registro/exportacao de Draggable
└── types/
    └── landing.ts                              # [MOD] Atualiza CardTiltInteractionState ("hovering") e CardTiltPhysicsConfig
```

**Structure Decision**: Arquitetura mantida integralmente nos modulos existentes da `main`, reutilizando o padrao de objeto mutavel compartilhado em `src/lib/gsap.ts` (`beamPulse` + `heroCardMotion`) para acoplar card, SVG e shader WebGL sem re-renderizacoes React e sem novas dependencias.

## Complexity Tracking

Nenhuma violacao constitucional identificada. Tabela nao aplicavel.
