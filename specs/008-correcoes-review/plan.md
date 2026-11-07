# Implementation Plan: Correcoes do Code Review e Investigacao do TBT Mobile

**Branch**: `main` (fluxo sem criar branch; pasta `specs/008-correcoes-review`) | **Date**: 2026-11-07 | **Spec**: [spec.md](file:///C:/Users/joao.g.ferreira/orca/projects/border-ia/specs/008-correcoes-review/spec.md)

**Input**: Feature specification de `/specs/008-correcoes-review/spec.md`, `docs/handoff/09-correcoes-review.md`, `docs/review/01-code-review.md` e medicao Lighthouse de `specs/007-testes-vitest/tasks.md`.

---

## Summary

Executar sob `test-driven-development` e `verification-before-completion` as correcoes selecionadas no Handoff 09: `CR-01` (cursor dinamico aceitando caneta, ativacao tardia de `.cursor-mesh`, `pointerdown` e celula central acesa), `CR-02` (corte de Three.js no Mobile em `PluginPrismLogoLazy`), `CR-03` (reset de `canvasReady` em `!connected` e `webglcontextlost`), `CR-04` (quebra de linha no titulo de Recursos em 1024px com `xl:whitespace-nowrap`), `CR-05` (pausa de loops GSAP e ticker fora da tela e em `reduceMotion`), `CR-11` (restricao de fonte do Tailwind em `globals.css` para `src/`, eliminacao de classes mortas e ajuste de especificidade em `.btn-shine`), alem da investigacao e mitigacao da causa raiz do TBT Mobile (3571 ms -> 5569 ms), incluindo a estabilizacao de `useMediaQuery` (`CR-10`). Todas as correcoes com logica testavel ganham testes unitarios no Vitest antes da implementacao, mantendo os 90 testes existentes rigorosamente verdes.

---

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), Node.js 20 (`@types/node: ^20`), React 19.3.0, Next.js 16.4.5
**Primary Dependencies**: `vitest` (`^4.1.12`), `gsap` (`^3.14.0`), `three` (`^0.182.0`), `tailwindcss` (`^4.0.0`), `lenis` (`^1.3.17`)
**Storage**: N/A
**Testing**: `npm.cmd test` (`vitest run` em `environment: "node"`), `npm.cmd run lint`, `npm.cmd run build` e medicao Lighthouse Mobile + Desktop (mediana de 3 execucoes antes vs depois com `lighthouse@12.8.2`)
**Target Platform**: Execucao de testes em Node.js (`vitest.config.mts`) e validacao visual/performance em navegadores Chromium e WebKit (desktop e mobile emulado)
**Project Type**: Landing page promocional Next.js App Router
**Performance Goals**: Reducao do TBT Mobile para a faixa de <= 3500 ms; preservacao de 100% dos testes Vitest (< 1,5s); zero bytes de Three.js baixados no Mobile; eliminacao de seletores mortos no CSS de producao.
**Constraints**: Zero novas dependencias sem liberacao do Joao; ciclo TDD obrigatorio (teste RED -> verificacao -> codigo GREEN -> verificacao); zero alteracao visual nos elementos aprovados; trabalhar direto na `main` sem commit nem push; proibicao absoluta de travessoes (`U+2014`).

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Design & Copy Fidelity)**: **PASS**. Nenhuma mudanca em copy, cores, assets ou tipografia do Figma; a correcao em Recursos (`CR-04`) apenas permite que "Amplificador de imagem" quebre linha elegante sem colidir lateralmente.
- **Principle II (Motion First & Progressive 3D)**: **PASS**. O Three.js passa a ser progressivo de fato: Desktop recebe a experiencia rica e Mobile carrega imediatamente com o vetor SVG otimizado.
- **Principle III (Respeito Integral a prefers-reduced-motion)**: **PASS**. Reforco transversal em `PluginPrismLogoLazy`, `SmoothScrollProvider` e `MagicCopyCard`, eliminando tickers ociosos quando o usuario escolhe movimento reduzido.
- **Principle IV (Performance & Render Budget)**: **PASS**. Foco direto na reducao do TBT Mobile e na eliminacao de classes zumbis do Tailwind v4.
- **Principle V (Semantic Accessibility & Git/Security Governance)**: **PASS**. Suporte completo a caneta/stylus (`CR-01`), preservacao do cursor nativo ate interacao comprovada, trabalho estritamente na `main` sem commits automaticos.

---

## Project Structure

### Documentation (this feature)

```text
specs/008-correcoes-review/
├── spec.md                                           # Especificacao funcional detalhada
├── plan.md                                           # Este plano de implementacao
├── research.md                                       # Investigacao do TBT e decisoes arquiteturais R-01 a R-06
├── data-model.md                                     # Modelos, funcoes puras e mapa de extracao
├── quickstart.md                                     # Roteiro TDD e protocolo de medicao Lighthouse
├── checklists/
│   └── requirements.md                               # Checklist de completude da especificacao
├── contracts/
│   └── correcoes-review-contract.md                  # Contratos TypeScript exatos e invariantes
└── tasks.md                                          # Lista ordenada de tarefas para Claude Code
```

### Source Code Modifications

```text
src/
├── lib/
│   ├── cursor-mesh-math.ts                           # [MOD] isValidCursorPointerType e computeCentralDotAlpha
│   ├── cursor-mesh-math.test.ts                      # [MOD] Testes TDD de stylus e alfa central
│   ├── card-tilt-math.ts                             # [MOD] shouldRunCardContinuousMotion e shouldSyncHeroTicker
│   ├── card-tilt-math.test.ts                        # [MOD] Testes TDD de regras de ticker e loops GSAP
│   └── scalability-budget.test.ts                    # [MOD] Assercoes de CSS restrito e layout sem overflow
├── security/
│   └── source-and-config.test.ts                     # [MOD] Assercoes estaticas de Three.js lazy e CSS hygiene
├── hooks/
│   └── useMotionEnvironment.ts                       # [MOD] Memoizacao estavel de subscribe/getSnapshot (CR-10)
├── components/
│   ├── motion/
│   │   ├── CursorDotMesh.tsx                         # [MOD] Ativacao tardia de .cursor-mesh, pen e pointerdown
│   │   └── SmoothScrollProvider.tsx                  # [MOD] Condiciona ticker do Lenis a !reduceMotion
│   ├── three/
│   │   ├── PluginPrismLogoLazy.tsx                   # [MOD] Condiciona 3D a isDesktop && !reduceMotion
│   │   └── HeroBeamLazy.tsx                          # [MOD] Reset de canvasReady em !connected e webglcontextlost
│   ├── sections/
│   │   └── FeaturesSection.tsx                       # [MOD] Substitui lg:whitespace-nowrap por xl:whitespace-nowrap
│   └── ui/
│       └── MagicCopyCard.tsx                         # [MOD] Pausa spinRef, beamPulse e ticker fora da tela
└── app/
    └── globals.css                                   # [MOD] @source "../src", limpeza de comentarios e .btn-shine
```

---

## Implementation Phases

### Phase 1: Test-Driven Development (Red -> Green)
1. **Cursor e Caneta (`CR-01`)**:
   - Escrever testes para `isValidCursorPointerType` e `computeCentralDotAlpha` em `src/lib/cursor-mesh-math.test.ts` (RED).
   - Implementar funcoes em `src/lib/cursor-mesh-math.ts` (GREEN).
   - Atualizar `CursorDotMesh.tsx` para aplicar `.cursor-mesh` apenas no primeiro evento valido, tratar `pen`, escutar `pointerdown` e remover em `touch`.
2. **Loops e Tickers do Card (`CR-05`)**:
   - Escrever testes para `shouldRunCardContinuousMotion` e `shouldSyncHeroTicker` em `src/lib/card-tilt-math.test.ts` (RED).
   - Implementar funcoes em `src/lib/card-tilt-math.ts` (GREEN).
   - Atualizar `MagicCopyCard.tsx` e `SmoothScrollProvider.tsx`.
3. **Guardas de Three.js e useMediaQuery (`CR-02` + `CR-10`)**:
   - Escrever assercoes em `src/security/source-and-config.test.ts` verificando que `PluginPrismLogoLazy` requer `isDesktop` (RED).
   - Ajustar `PluginPrismLogoLazy.tsx` com `isDesktop && !reduceMotion` (GREEN).
   - Estabilizar `useMediaQuery` em `useMotionEnvironment.ts` com cache estável de `subscribe`.
4. **Higiene de CSS e Layout em Recursos (`CR-04` + `CR-11`)**:
   - Escrever assercoes em `src/lib/scalability-budget.test.ts` verificando `@source "../src"` e ausencia de `lg:whitespace-nowrap` (RED).
   - Atualizar `FeaturesSection.tsx` e `globals.css` (GREEN).
5. **Resiliencia de WebGL (`CR-03`)**:
   - Resetar `canvasReady = false` quando `!connected` em `HeroBeamLazy.tsx`.
   - Adicionar listener de `webglcontextlost` no canvas.

### Phase 2: Performance Benchmarking & Verification
1. Rodar suite completa do Vitest: `npm.cmd test` (confirmar >= 100 testes verdes).
2. Rodar linter: `npm.cmd run lint`.
3. Executar medicao comparativa Lighthouse Mobile e Desktop antes vs depois com `lighthouse@12.8.2`.
4. Verificar ausencia de travessoes (`U+2014`).

---

## Complexity Tracking

> Nenhuma violacao da Constituicao (`v1.1.0`). Tabela nao aplicavel.
