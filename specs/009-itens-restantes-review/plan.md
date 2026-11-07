# Implementation Plan: Itens Restantes do Review e Hardening de Seguranca

**Branch**: `main` (fluxo sem criar branch; pasta `specs/009-itens-restantes-review`) | **Date**: 2026-11-07 | **Spec**: [spec.md](file:///C:/Users/joao.g.ferreira/orca/projects/border-ia/specs/009-itens-restantes-review/spec.md)

**Input**: Feature specification de `/specs/009-itens-restantes-review/spec.md`, `docs/handoff/10-itens-restantes-review.md`, `docs/review/01-code-review.md`, `docs/review/02-seguranca.md` e desvios documentados no encerramento de `specs/008-correcoes-review/tasks.md`.

---

## Summary

Implementar sob o ciclo estrito de `test-driven-development` e `verification-before-completion` os dez itens pendentes do code review e da auditoria de seguranca:
1. **Seguranca**: cabecalhos HTTP de seguranca e CSP estatica compativel com App Router em `next.config.ts` (`NV-01`), remocao do cabecalho `X-Powered-By` (`SA-INFO-01`), sanitizacao de caminhos vetoriais com regex antes de parser XML em `PluginPrismLogo3D.tsx` (`SE-03`) e trava de testes contra downgrades do ESLint por `npm audit fix --force` (`SE-04`).
2. **Graficos e Interatividade**: recalculo dinamico de densidade de pixels no cursor para telas Retina / 4K (`CR-06`), derivacao dinamica da mascara vertical no fragment shader do Hero e sincronizacao de uniforms pos-mount (`CR-12`), helper de reset do singleton `heroCardMotion` para isolamento de testes (`CR-07`), cache de retangulo e `gsap.quickTo` no hover do card (`CR-08`), descarte de geometrias `ExtrudeGeometry` via `dispose()` e eventos passivos no logotipo 3D (`CR-09`).
3. **Acessibilidade e Assets**: link "Pular para o conteudo principal", aplicacao de `id="hero-heading"` na tag `<h1>` semantica, contencao do giro de `.btn-shine` sob foco estatico de teclado, avaliacao da adocao de `DotMatrixDecor variant="css"` no banner mantendo fidelidade visual estrita e remocao de asset orfao (`CR-13`).

---

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), Node.js 20 (`@types/node: ^20`), React 19.3.0, Next.js 16.4.5
**Primary Dependencies**: `vitest` (`^4.1.12`), `gsap` (`^3.14.0`), `three` (`^0.182.0`), `tailwindcss` (`^4.0.0`), `lenis` (`^1.3.17`)
**Storage**: N/A
**Testing**: `npm.cmd test` (`vitest run` em `environment: "node"`), `npm.cmd run lint`, `npm.cmd run build` e medicao Lighthouse Mobile + Desktop (mediana de 3 execucoes antes vs depois com `lighthouse@12.8.2`)
**Target Platform**: Node.js (`vitest.config.mts`) e navegadores Chromium e WebKit (desktop e mobile emulado)
**Project Type**: Landing page promocional Next.js App Router
**Performance Goals**: Manter TBT Mobile <= 2000 ms e notas 100 em A11y, Melhores Praticas e SEO; alcancar >= 135 testes Vitest passando (< 2s); zero vazamentos de VRAM.
**Constraints**: Zero novas dependencias sem liberacao do Joao; ciclo TDD obrigatorio (teste RED -> verificacao -> codigo GREEN -> verificacao); zero alteracao visual nos elementos aprovados; trabalhar direto na `main` sem commit nem push; proibicao absoluta de travessoes (`U+2014`).

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Design & Copy Fidelity)**: **PASS**. Preserva integralmente todas as copys, cores, tipografia e assets visuais aprovados; a eventual substituicao do SVG do banner por CSS so sera efetuada mediante confirmacao visual identica.
- **Principle II (Motion First & Progressive 3D)**: **PASS**. Mantem as timelines do GSAP e shaders WebGL com gestao adequada de recursos e memoria.
- **Principle III (Respeito Integral a prefers-reduced-motion)**: **PASS**. Preserva todas as guardas existentes e introduz contencao para foco estatico de teclado em `.btn-shine`.
- **Principle IV (Performance & Render Budget)**: **PASS**. A adocao de `quickTo` elimina instanciacao repetida de objetos no hover do card, e a atualizacao dinamica de dpr garante renderizacao otimizada em qualquer monitor.
- **Principle V (Semantic Accessibility & Git/Security Governance)**: **PASS**. Introduz skip-link acessivel, corrige semantica de heading, implementa cabecalhos de seguranca HTTP e sanitiza caminhos SVG, operando estritamente na branch `main` sem commits automaticos.

---

## Project Structure

### Documentation (this feature)

```text
specs/009-itens-restantes-review/
├── spec.md                                           # Especificacao funcional detalhada
├── plan.md                                           # Este plano de implementacao
├── research.md                                       # Decisoes tecnicas detalhadas R-01 a R-08
├── data-model.md                                     # Modelos, helpers e mapeamento de arquivos
├── quickstart.md                                     # Roteiro TDD e protocolo de validacao
├── checklists/
│   └── requirements.md                               # Checklist de completude da especificacao
├── contracts/
│   └── itens-restantes-review-contract.md            # Contratos TypeScript e cabecalhos de seguranca
└── tasks.md                                          # Lista ordenada de tarefas para Claude Code
```

### Source Code Modifications

```text
src/
├── lib/
│   ├── svg-path-sanitizer.ts                         # [NEW] Helper puro sanitizeSvgPathD (SE-03)
│   ├── svg-path-sanitizer.test.ts                    # [NEW] Testes TDD de sanitizacao de caminhos SVG
│   ├── hero-beam-math.ts                             # [MOD] deriveShaderVerticalMask e resetHeroCardMotion
│   ├── hero-beam-math.test.ts                        # [MOD] Testes TDD da mascara do shader e reset do singleton
│   ├── cursor-mesh-math.ts                           # [MOD] computeCursorDprMetrics
│   └── cursor-mesh-math.test.ts                      # [MOD] Testes TDD de recalculo de dpr
├── security/
│   └── source-and-config.test.ts                     # [MOD] Testes de headers, poweredByHeader e travas de deps
├── components/
│   ├── motion/
│   │   └── CursorDotMesh.tsx                         # [MOD] Listener de resize com recalculo de dpr (CR-06)
│   ├── three/
│   │   ├── PluginPrismLogo3D.tsx                     # [MOD] dispose de geometrias, pointermove passivo e sanitize (CR-09, SE-03)
│   │   └── HeroBeamCanvas.tsx                        # [MOD] Formula derivada de mascara no GLSL e sync de uniforms (CR-12)
│   ├── ui/
│   │   ├── MagicCopyCard.tsx                         # [MOD] Cache de rect e quickTo no hover (CR-08)
│   │   ├── animated-shiny-text.tsx                   # [MOD] id="hero-heading" no <h1> interno (CR-13)
│   │   └── SkipToContent.tsx                         # [NEW] Link acessivel de pular para conteudo principal (CR-13)
│   └── sections/
│       └── BannerSection.tsx                         # [MOD] Adocao avaliada de DotMatrixDecor variant="css" (CR-13)
├── app/
│   ├── layout.tsx                                    # [MOD] Inclui SkipToContent no topo
│   └── globals.css                                   # [MOD] Contencao de foco estatico em .btn-shine (CR-13)
├── next.config.ts                                    # [MOD] poweredByHeader: false e headers de seguranca (NV-01, SA-INFO-01)
└── public/
    └── icons/
        └── stroke-scribble.svg                       # [DEL] Remocao de arquivo orfao (CR-13)
```

---

## Implementation Phases

### Phase 1: Security Hardening (NV-01, SA-INFO-01, SE-03, SE-04)
1. Escrever testes em `src/lib/svg-path-sanitizer.test.ts` e `src/security/source-and-config.test.ts` (RED).
2. Criar `src/lib/svg-path-sanitizer.ts` e conectar em `PluginPrismLogo3D.tsx`.
3. Atualizar `next.config.ts` com `poweredByHeader: false` e `headers()` de seguranca. Confirmar testes passando (GREEN).

### Phase 2: Shader Dynamics & Cursor Precision (CR-06, CR-12)
1. Escrever testes para `deriveShaderVerticalMask` em `src/lib/hero-beam-math.test.ts` e `computeCursorDprMetrics` em `src/lib/cursor-mesh-math.test.ts` (RED).
2. Implementar funcoes puras em `hero-beam-math.ts` e `cursor-mesh-math.ts`.
3. Atualizar fragment shader de `HeroBeamCanvas.tsx` e `useEffect` de `CursorDotMesh.tsx` para sincronizar `dpr` em resize. Confirmar testes passando (GREEN).

### Phase 3: GPU Memory & Interaction Performance (CR-07, CR-08, CR-09)
1. Adicionar `resetHeroCardMotion` em `hero-beam-math.ts` e cobrir com teste unitario.
2. Em `MagicCopyCard.tsx`, cachear retangulo delimitador e trocar `gsap.to` por `gsap.quickTo` no hover.
3. Em `PluginPrismLogo3D.tsx`, adicionar descarte via `dispose()` nas geometrias e `{ passive: true }` no listener de movimento.

### Phase 4: Semantic Accessibility & Asset Optimization (CR-13)
1. Criar `src/components/ui/SkipToContent.tsx` e renderizar no topo do documento.
2. Mover `id="hero-heading"` para o elemento `<motion.h1>` em `animated-shiny-text.tsx`.
3. Ajustar `.btn-shine` em `globals.css` contra loops infinitos de animacao sob foco de teclado estacionario.
4. Testar a variante CSS no banner e confirmar equivalencia visual identica; excluir `public/icons/stroke-scribble.svg`.

### Phase 5: Verification Gate & Lighthouse Benchmarking
1. Executar bateria de testes: `npm.cmd test` (confirmar >= 135 testes verdes).
2. Executar linter: `npm.cmd run lint`.
3. Executar compilacao de producao: `npm.cmd run build`.
4. Executar 3 rodadas comparativas do Lighthouse Mobile e Desktop com `lighthouse@12.8.2`.
5. Verificar ausencia de travessoes (`U+2014`).

---

## Complexity Tracking

> Nenhuma violacao da Constituicao (`v1.1.0`). Tabela nao aplicavel.
