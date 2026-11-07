# Implementation Plan: Onda Continua na Malha do Hero, Cursor Pontilhado e Brilho de Botoes

**Branch**: `main` (fluxo do projeto sem criar branch; pasta `specs/006-onda-e-malha-cursor`) | **Date**: 2026-11-07 | **Spec**: [spec.md](file:///C:/Users/joao.g.ferreira/orca/projects/border-ia/specs/006-onda-e-malha-cursor/spec.md)

**Input**: Feature specification from `/specs/006-onda-e-malha-cursor/spec.md`, `docs/handoff/06-onda-e-malha-cursor.md` e ajustes aprovados pos-implementacao em `docs/handoff/07-ajustes-pos-006.md`.

## Summary

Apos revisao visual da spec `005` e refinamento direto pos-`006`, a entrega consolidada na `main` reune quatro frentes aprovadas pelo Joao:
1. **Malha do Hero com onda continua full-time sem hover local**: preserva a grade unica de `19px` e o campo simetrico travado em `247px` para cada lado da corda (`494px` totais, `CANVAS_WIDTH = 504`, `HeroSection.tsx` limpo sem `lg:overflow-x-clip`), remove todo o hover local da `005` e anima no fragment shader de `HeroBeamCanvas.tsx` uma onda continua (`wavePhase = cordDist * 0.036 + cellCenter.y * 0.015 - uTime * 2.0`, periodo `~3.14s`) ancorada na curva viva da corda.
2. **A malha do cursor virou o proprio cursor (`CursorDotMesh.tsx`)**: inspirada em `https://kc1t.com/pt-br`, renderiza um `<canvas>` 2D compacto de `88 x 88 px` com reticulado ordenado Bayer `4x4` em `fixed inset-0 z-50` acima de toda a pagina (visivel inclusive sobre o card `"Magic copy"` e sobre o `Banner` e seu botao claro, com blending normal, cor `#C9B3FF`, `MAX_ALPHA = 0.9` e `FOLLOW_RATE = 24`), aplicando `.cursor-mesh` (`cursor: none !important`) em `<html>` apenas quando o canvas esta pronto em ambiente `canHover && !reduceMotion` e hibernando (`rafId = -1`) quando parado ou fora da janela.
3. **Selecao de texto na cor da marca**: `::selection` em `src/app/globals.css` com fundo `rgb(167 81 251 / 0.45)` e texto `#fff`.
4. **Brilho interativo nos botoes (`.btn-shine`)**: reconstrucao em CSS puro dentro de `@layer components` (`@property --shine-angle` + `@keyframes shine-spin` de `2.4s`), fiel ao Figma em repouso, com arco conico na borda, pontos varridos de `4px` e glow no hover/foco (`#fff`, `#A751FB` ou `#C082FF` por variante em `CtaButton.tsx` e no `"Start now"` de `MagicCopyCard.tsx`) e leve compressao + glow intenso no clique, respeitando `prefers-reduced-motion`.

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), GLSL (fragment shader em `ShaderMaterial`), CSS moderno (`@property`, `@layer`, `color-mix`, mascaras compostas), React 19.2.4, Next.js 16.2.4 (App Router)

**Primary Dependencies**: `three` (`^0.183.2`), `@react-three/fiber` (`^9.6.0`), `gsap` (`^3.15.0`) + `@gsap/react`, `lenis` (`^1.3.23`), Tailwind CSS v4 (zero novas dependencias no `package.json`)

**Storage**: N/A (landing page estatica sem persistencia)

**Testing**: `npm run lint` (ESLint 9), verificacao de tipos TypeScript, `npm run build` (`next build` de producao), inspecao visual e interativa em Playwright Chromium + Playwright WebKit (Desktop `1440x900` e `1024x768`, Mobile/iPhone `390x844` e `430x932`) e auditoria Lighthouse Mobile e Desktop (mediana de 3 execucoes antes/depois em `T001`/`T010`)

**Target Platform**: Web moderna responsiva: Desktop (`1024px` a `1440px+`, Chromium e Safari/WebKit) e Mobile/iPhone (`390px` a `430px`, Safari/WebKit e Chrome Mobile)

**Project Type**: Landing page promocional single-page (Next.js App Router)

**Performance Goals**: `60fps` estaveis na onda continua do Hero, no cursor 2D e no giro CSS de `.btn-shine`; `0` impacto no LCP/CLS/TBT inicial (`CursorDotMesh` inicia com `rafId = -1` e `.btn-shine` inicia `paused`); `CANVAS_WIDTH` enxuto em `504px` (`-26%` de fill-rate ante a `005`); `frameloop="never"` no Hero fora da viewport; notas Lighthouse Mobile e Desktop pos-mudanca maiores ou iguais a linha de base `333c3a4`

**Constraints**: Zero novas dependencias em `package.json`; maximo de 2 contextos WebGL restritos ao Hero (`CursorDotMesh` usa exclusivamente Canvas 2D `getContext("2d")`); `MESH_HALF_WIDTH` travado em `247px`; seta nativa do sistema sempre preservada em toque, movimento reduzido e falha de JS; zero ocorrencias de travessao (`U+2014`)

**Scale/Scope**: 1 componente novo (`src/components/motion/CursorDotMesh.tsx`) e 7 arquivos rastreados ajustados em relacao ao `HEAD` (`globals.css`, `LandingMotionController.tsx`, `HeroBeamCanvas.tsx`, `HeroBeamLazy.tsx`, `CtaButton.tsx`, `MagicCopyCard.tsx`, `landing.ts`; `HeroSection.tsx` revertido ao estado limpo de `333c3a4`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design and Handoff 07 adjustments.*

### Gate Evaluation (Constitution v1.1.0 - Post Handoff 07)

- **Principle I (Design & Copy Fidelity)**: **PASS**. Todos os textos, tokens, espacamentos e estados de repouso permanecem fieis ao Figma (incluindo todos os botoes `.btn-shine` em repouso, com `opacity: 0` nos pseudo-elementos). A selecao `::selection` e as cores de brilho (`#fff`, `#A751FB`, `#C082FF`, `#C9B3FF`) usam estritamente a paleta `Purple`/`White` do projeto.
- **Principle II (Motion First & Progressive 3D)**: **PASS**. `HeroBeamCanvas` permanece sob `next/dynamic(..., { ssr: false })` restrito ao Desktop sem movimento reduzido, com transicao suave a partir de `DotMatrixDecor`. `CursorDotMesh` move-se apenas por `transform: translate3d(...)`, e `.btn-shine` anima um unico `@property --shine-angle` pausado fora de `:hover`/`:focus-visible`.
- **Principle III (Respeito Integral a prefers-reduced-motion)**: **PASS**. Sob `(prefers-reduced-motion: reduce)`, `HeroBeamLazy` mantem apenas `DotMatrixDecor` estatico sem onda, `CursorDotMesh` desmonta e remove `.cursor-mesh` devolvendo a seta nativa imediatamente, e `.btn-shine` desativa `animation`, `translate` e `scale`.
- **Principle IV (Performance, Accessibility & Render Budget)**: **PASS**. Continuam existindo no maximo 2 contextos WebGL restritos ao Hero (`CursorDotMesh` usa Canvas 2D `88x88`). O loop `rAF` do cursor hiberna quando parado/fora da janela, e `HeroBeamCanvas` usa `frameloop="never"` fora da tela.
- **Principle V (Semantic Accessibility & Navigability)**: **PASS**. `CursorDotMesh` tem `aria-hidden="true"` e `pointer-events-none`, nunca bloqueia cliques e so oculta a seta nativa quando o substituto visual esta comprovadamente ativo em ponteiro fino. `.btn-shine` responde tambem a `:focus-visible` mantendo o `outline` acessivel da pagina.

## Project Structure

### Documentation (this feature)

```text
specs/006-onda-e-malha-cursor/
├── spec.md                                           # Especificacao funcional consolidada (Handoff 06 + 07)
├── plan.md                                           # Este plano tecnico consolidado
├── research.md                                       # Decisoes R-01 a R-05 (kc1t, z-50, .cursor-mesh, .btn-shine)
├── data-model.md                                     # Estados e parametros reais da onda, cursor e botoes
├── quickstart.md                                     # Roteiro de validacao (Chromium, WebKit, iPhone e Lighthouse)
├── checklists/
│   └── requirements.md                               # Checklist de qualidade validada
├── contracts/
│   └── hero-wave-and-cursor-mesh-contract.md         # Contrato GLSL, Canvas 2D z-50 e CSS .btn-shine
└── tasks.md                                          # Lista de tarefas com status real (T002..T009, T011..T012 [x]; T001, T010 [ ])
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css                                   # [MOD] ::selection da marca, .cursor-mesh e @layer components .btn-shine
│   └── page.tsx                                      # [INTOCAVEL] Permanece limpo igual a 333c3a4
├── components/
│   ├── motion/
│   │   ├── CursorDotMesh.tsx                         # [NEW] Cursor pontilhado 88x88 Bayer 4x4 em z-50 (#C9B3FF, FOLLOW_RATE=24, .cursor-mesh)
│   │   └── LandingMotionController.tsx               # [MOD] Monta <CursorDotMesh /> antes de {children}
│   ├── sections/
│   │   ├── HeroSection.tsx                           # [REVERTED TO HEAD] Sem lg:overflow-x-clip da 005
│   │   ├── Header.tsx                                # [INTOCAVEL]
│   │   └── Footer.tsx                                # [INTOCAVEL]
│   ├── three/
│   │   ├── HeroBeamLazy.tsx                          # [MOD] MESH_HALF_WIDTH=247, CANVAS_WIDTH=504, handoff CSS; corda <svg> intocada
│   │   └── HeroBeamCanvas.tsx                        # [MOD] Onda continua full-time ancorada na corda dentro de 247px
│   └── ui/
│       ├── CtaButton.tsx                             # [MOD] Classe btn-shine e variavel [--shine:...] por variante
│       ├── MagicCopyCard.tsx                         # [MOD] Apenas classe btn-shine no botao "Start now" (3D e mola intocados)
│       ├── DotMatrixDecor.tsx                        # [INTOCAVEL]
│       ├── animated-shiny-text.tsx                   # [INTOCAVEL]
│       ├── AnimatedStrokeWord.tsx                    # [INTOCAVEL]
│       └── BorderIaLogo.tsx                          # [INTOCAVEL]
└── types/
    └── landing.ts                                    # [MOD] Interface CursorMeshRuntimeState (sem cardMute)
```

**Structure Decision**: Arquitetura single-project Next.js App Router existente em `src/`. A onda continua do Hero fica encapsulada em `src/components/three/`, o cursor global pontilhado vive em `src/components/motion/CursorDotMesh.tsx`, e os estilos reutilizaveis de selecao, ocultacao condicional da seta e brilho `.btn-shine` ficam centralizados em `src/app/globals.css` (`@layer components`).

## Complexity Tracking

> Nenhuma violacao da Constituicao (`v1.1.0`). Tabela nao aplicavel.
