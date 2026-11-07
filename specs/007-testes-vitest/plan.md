# Implementation Plan: Suite de Testes Unitarios Vitest e Extracao de Funcoes Puras

**Branch**: `main` (fluxo do projeto sem criar branch; pasta `specs/007-testes-vitest`) | **Date**: 2026-11-07 | **Spec**: [spec.md](file:///C:/Users/joao.g.ferreira/orca/projects/border-ia/specs/007-testes-vitest/spec.md)

**Input**: Feature specification from `/specs/007-testes-vitest/spec.md`, `docs/handoff/08-review-e-testes.md`, `docs/review/01-code-review.md` e `docs/review/02-seguranca.md`.

## Summary

Projetar e organizar sob `test-driven-development` e `verification-before-completion` a primeira suite automatizada do projeto em `vitest@4.1.12` (`environment: "node"`, zero novas dependencias em `package.json`), cobrindo **desempenho**, **escalabilidade** e **seguranca**. Para testar a logica real sem montar React nem instalar `jsdom`, o plano extrai cinco modulos puros em `src/lib/` (`cursor-mesh-math.ts`, `hero-beam-math.ts`, `card-tilt-math.ts`, `links.ts` e `mask-style.ts`), conecta-os de volta aos componentes consumidores sem alterar nenhum comportamento visual aprovado, adiciona `8` suites de teste (`*.test.ts`), lista separadamente para decisao do Joao os testes de DOM que exigiriam `jsdom` + `@testing-library/react`, e incorpora o procedimento obrigatorio de medicao do Lighthouse Mobile e Desktop (`antes` em `333c3a4` vs `depois` na `main`) pendente desde as specs `005` e `006`.

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), Node.js 20 (`@types/node: ^20`), React 19.3.0, Next.js 16.4.5

**Primary Dependencies**: `vitest` (`^4.1.12`, ja instalado em `devDependencies`), `node:fs` e `node:path` nativos (zero novas dependencias no `package.json`)

**Storage**: N/A

**Testing**: `npm test` (`vitest run` em `environment: "node"`), `npm run lint`, `npm run build` e auditoria Lighthouse Mobile + Desktop (mediana de 3 execucoes antes/depois)

**Target Platform**: Execucao de testes em Node.js (`vitest.config.ts`) + validacao de build/performance em navegador headless (Chromium/WebKit/Lighthouse)

**Project Type**: Landing page promocional Next.js App Router

**Performance Goals**: Execucao completa de `npm test` em `< 2s`; preservacao integral dos `60fps` e das notas Lighthouse Mobile e Desktop (`mediana depois >= mediana antes` ou identificacao documentada do impacto de `PluginPrismLogoLazy` no Mobile para decisao do autor)

**Constraints**: Zero novas dependencias sem liberacao do Joao (`jsdom` e `@testing-library/react` ficam listados a parte); ciclo TDD obrigatorio (escrever teste -> rodar e ver falhar -> extrair codigo minimo -> rodar e ver passar); zero mudanca visual nos efeitos aprovados; trabalhar direto na `main` sem commit nem push; zero ocorrencias de travessao (`U+2014`)

**Scale/Scope**: `5` modulos puros novos em `src/lib/`, `8` arquivos de teste (`6` em `src/lib/` + `2` em `src/security/`), `8` arquivos existentes religados (`CursorDotMesh.tsx`, `HeroBeamLazy.tsx`, `gsap.ts`, `MagicCopyCard.tsx`, `CtaButton.tsx`, `Header.tsx`, `Footer.tsx`, `MaskIcon.tsx`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Design & Copy Fidelity)**: **PASS**. Extracoes puramente estruturais; zero alteracao em layout, cores, tipografia, textos ou assets do Figma.
- **Principle II (Motion First & Progressive 3D)**: **PASS**. A fisica da corda, a onda do Hero, a inclinacao 3D do card e o espectro do cursor mantem exatamente as mesmas equacoes e constantes aprovadas.
- **Principle III (Respeito Integral a prefers-reduced-motion)**: **PASS**. Todas as guardas `prefers-reduced-motion` permanecem intactas e a guarda CSS de `.btn-shine` passa a ser verificada por teste automatizado.
- **Principle IV (Performance & Render Budget)**: **PASS**. Nenhum byte extra de biblioteca entra no bundle cliente; os limites de resolucao (`504 x 525` e `88 x 88`) passam a ter testes de regressao dedicados, e o Lighthouse antes/depois entra como portao final obrigatorio.
- **Principle V (Semantic Accessibility & Git/Security Governance)**: **PASS**. `resolveSiteLinkAttributes` garante `rel="noopener noreferrer"` tambem em `Header.tsx` caso links externos surjam no futuro, nenhum `.env*` e lido, e todo o trabalho permanece na `main` sem commits automaticos.

## Project Structure

### Documentation (this feature & reviews)

```text
docs/review/
├── 01-code-review.md                                 # Code review, differential review, desempenho e escalabilidade
└── 02-seguranca.md                                   # Context building, security audit, sharp edges e fp-check

specs/007-testes-vitest/
├── spec.md                                           # Especificacao funcional e lista separada sobre jsdom
├── plan.md                                           # Este plano tecnico
├── research.md                                       # Estrategia TDD em node e fronteira com Lighthouse
├── data-model.md                                     # Mapa de modulos extraidos e catalogo das 8 suites
├── quickstart.md                                     # Ciclo Red-Green e protocolo Lighthouse antes/depois
├── checklists/
│   └── requirements.md                               # Checklist de qualidade da especificacao
├── contracts/
│   └── pure-functions-and-test-suites-contract.md    # Assinaturas TS exatas e portao verification-before-completion
└── tasks.md                                          # Tarefas TDD ordenadas para implementacao (/speckit-tasks)
```

### Source Code (target layout when Spec `007` is implemented)

```text
src/
├── lib/
│   ├── cursor-mesh-math.ts                           # [NEW] Matematica Bayer 4x4, inercia e hibernacao do cursor
│   ├── cursor-mesh-math.test.ts                      # [NEW] Testes de desempenho do cursor (484 celulas, dt, rAF)
│   ├── hero-beam-math.ts                             # [NEW] Geometria 504px/247px, projecao 3D, mola e beamPath
│   ├── hero-beam-math.test.ts                        # [NEW] Testes de projecao 3D e estabilidade da mola
│   ├── card-tilt-math.ts                             # [NEW] Calculo tanh e hoverCtaDamping do card
│   ├── card-tilt-math.test.ts                        # [NEW] Testes de limites angulares e amortecimento no CTA
│   ├── links.ts                                      # [NEW] Helper puro resolveSiteLinkAttributes (fecha SE-01)
│   ├── links.test.ts                                 # [NEW] Testes de seguranca de URLs, rel e icones sociais
│   ├── mask-style.ts                                 # [NEW] Helper puro buildMaskStyle com allowlist (fecha SE-02)
│   ├── mask-style.test.ts                            # [NEW] Testes de injecao CSS em mascara e paths LOGO_MARK
│   ├── scalability-budget.test.ts                    # [NEW] Testes de orcamento 4K/1024px, assets e @property CSS
│   └── gsap.ts                                       # [MOD] Consome BEAM_REST_TIP de hero-beam-math.ts
├── security/
│   ├── svg-assets.test.ts                            # [NEW] Varredura de todos os SVGs servidos em public/ e src/app/
│   └── source-and-config.test.ts                     # [NEW] Varredura de sinks XSS, process.env, U+2014, .gitignore e next.config.ts
└── components/
    ├── motion/CursorDotMesh.tsx                      # [MOD] Consome src/lib/cursor-mesh-math.ts
    ├── sections/{Header,Footer}.tsx                  # [MOD] Consomem resolveSiteLinkAttributes de src/lib/links.ts
    ├── three/HeroBeamLazy.tsx                        # [MOD] Consome src/lib/hero-beam-math.ts
    └── ui/{MagicCopyCard,CtaButton,MaskIcon}.tsx     # [MOD] Consomem card-tilt-math.ts, links.ts e mask-style.ts
```

**Structure Decision**: Colocar os modulos puros extraidos diretamente em `src/lib/` com seus respectivos `*.test.ts` colocalizados (seguindo o padrao `src/**/*.test.{ts,tsx}` ja definido em `vitest.config.ts`) e agrupar as duas suites transversais de varredura de repositorio em `src/security/`.

## Decisao Aprovada pelo Joao Gabriel: Escopo em `node` Puro (Sem `jsdom`)

Em 2026-11-07, o Joao Gabriel aprovou a **Opcao 1** (manter `environment: "node"` sem dependencias adicionais).

Ficam descartadas as dependencias `jsdom` e `@testing-library/react`. Os testes de efeitos colaterais de DOM React em memoria (montagem de `.cursor-mesh`, `window.matchMedia` e `<WebGLSafeBoundary />`) permanecem delegados para testes em navegador real (Playwright e auditoria Lighthouse).

## Complexity Tracking

> Nenhuma violacao da Constituicao (`v1.1.0`). Tabela nao aplicavel.
