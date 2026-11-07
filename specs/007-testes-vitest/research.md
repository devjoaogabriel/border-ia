# Phase 0 Research: Suite de Testes Vitest e Extracao de Funcoes Puras (`007-testes-vitest`)

**Feature**: `007-testes-vitest`
**Date**: 2026-11-07
**Inputs**: `docs/handoff/08-review-e-testes.md`, `docs/review/01-code-review.md`, `docs/review/02-seguranca.md`
**Skills**: `test-driven-development`, `verification-before-completion`, `vercel-react-best-practices`, `gsap-performance`

## R-01: Estrategia de Testabilidade em `environment: "node"` sem Novas Dependencias

- **Decision**: Manter `vitest.config.ts` exatamente com `environment: "node"` e extrair os calculos matematicos, fisicos e de validacao de seguranca para 5 modulos TypeScript puros em `src/lib/`, deixando componentes `.tsx` apenas como camadas finas de ligacao com DOM/Canvas/GSAP.
- **Rationale**:
  1. `vitest@4.1.12` ja esta instalado e configurado (`@/` -> `./src`, `include: ["src/**/*.test.{ts,tsx}"]`), sem `jsdom` nem `@testing-library/react`.
  2. Os algoritmos mais sensiveis a regressao de desempenho e seguranca (`computeCursorCellAlpha`, `advanceCursorMeshState`, `projectBeamContact`, `stepBeamSpring`, `computeCardHoverAngles`, `resolveSiteLinkAttributes`, `buildMaskStyle`) sao funcoes puras de numeros/strings que nao dependem de DOM; testa-las em `node` executa em `< 500ms`, zero flakiness e zero mocks artificiais (cumprindo a regra de `test-driven-development`: *"Real code, no mocks unless unavoidable"*).
  3. Verificacoes estruturais sobre assets (`public/**/*.svg`), CSS (`src/app/globals.css`), codigo-fonte (`src/**/*.{ts,tsx}`) e `next.config.ts` usam `node:fs` e `node:path` nativos do Node 20.

## R-02: Aplicacao Estrita de `test-driven-development` em Codigo Existente (Extracao)

- **Decision**: Para cada um dos 5 modulos extraidos e das suites estaticas, o implementador (Claude Code) DEVE seguir a sequencia obrigatoria:
  1. **RED**: Criar o arquivo `*.test.ts` importando a assinatura desejada do novo modulo puro em `src/lib/` (ou testando o caso de borda ainda nao protegido, como `resolveSiteLinkAttributes({ href: "https://...", external: false })`).
  2. **Verify RED**: Executar `npx vitest run <arquivo.test.ts>` e confirmar falha real pela ausencia do modulo/validacao.
  3. **GREEN**: Criar o modulo puro em `src/lib/` com o codigo minimo exato e religar o componente consumidor (`CursorDotMesh.tsx`, `HeroBeamLazy.tsx`, `MagicCopyCard.tsx`, `CtaButton.tsx`/`Header.tsx`/`Footer.tsx`, `MaskIcon.tsx`).
  4. **Verify GREEN**: Executar `npx vitest run <arquivo.test.ts>` confirmando `0` falhas.
  5. **REFACTOR**: Limpar duplicacoes (como o literal `tipY: 511` em `src/lib/gsap.ts`) mantendo todos os testes verdes.

## R-03: Fronteira entre Testes Unitarios (`node`) e Lighthouse / Navegador

- **Decision**: Confirmada pelo Joao Gabriel a Opcao 1 (ambiente `node` nativo sem `jsdom`).
  - **Camada 1 - Suite Unitarias Vitest (`node`, zero novas deps)**: Matematica por quadro, hibernacao do estado do cursor, limites da mola e do tilt, orcamento geometrico/escalabilidade (`4K`, `1024px`, `--shine-angle`), seguranca de links, sanitizacao de SVGs servidos e invariantes do codigo-fonte.
  - **Camada 2 - DOM em memoria (`jsdom` + `@testing-library/react`)**: Descartada por decisao do Joao Gabriel.
  - **Camada 3 - Obrigatoria em Navegador Real / Lighthouse (`verification-before-completion`)**: Executar a medicao comparativa pendente do Lighthouse Mobile e Desktop (`3` rodadas em `333c3a4` via stash temporario vs `3` rodadas na arvore final em `next build` + `next start`), pois metricas de GPU, Paint de `@property --shine-angle`, LCP, TBT e CLS nao existem em `node` nem em `jsdom`.
