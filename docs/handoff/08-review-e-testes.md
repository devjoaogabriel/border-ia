# Handoff 08: code review e testes de desempenho, escalabilidade e segurança

## Pedido do João

Code review do projeto e testes unitários de desempenho, escalabilidade e segurança, usando as skills recomendadas.

## Estado atual

- Última versão commitada: `333c3a4` (favicon). Sem commit desde então: specs 005 e 006 com os ajustes do handoff 07, a onda no hero, a malha que vira cursor, a seleção de texto, o brilho dos botões e o Vitest.
- **Vitest 4.1.12** instalado (o 5.1 exige `@types/node` 22+, e o projeto está no 20). `vitest.config.ts` tem o alias `@/`, ambiente `node` e testes em `src/**/*.test.{ts,tsx}`. Scripts: `npm test` (`vitest run`) e `npm run test:watch`. Ainda não há nenhum teste.
- Não há `jsdom` nem `@testing-library/react`. Testar componente React precisa deles, e dependência nova só entra com liberação do João.
- O `npm audit` já tinha 8 avisos moderados antes do Vitest, todos na cadeia do ESLint (`minimatch`). A correção sugerida rebaixa o `eslint-config-next`.

## Entregas

### 1. Code review (relatório, sem alterar código)

- **Escopo:** o diff sem commit (`git diff` mais os arquivos novos) e o projeto inteiro, com foco em `src/components/three`, `src/components/motion`, `src/components/ui`, `src/lib` e `src/app/globals.css`.
- **Skills:** `requesting-code-review` conduz a revisão e `differential-review` analisa o diff, com raio de impacto, regressão e falta de teste.
- **Saída:** `docs/review/01-code-review.md`, com achados por severidade, arquivo e linha, cenário de falha e correção sugerida.

### 2. Desempenho e escalabilidade

- **Skills:** `vercel-react-best-practices` (bundle, renderização, carregamento sob demanda, imagens, fontes) e `gsap-performance` (animações, `will-change`, custo por quadro).
- **Pontos a olhar:** shader do hero (custo por pixel, canvas de 504 px, pausa fora da tela), `CursorDotMesh` (484 iterações por quadro, hibernação do `rAF`), `.btn-shine` (`@property` animada, `box-shadow`), listeners globais, e a carga inicial do Three.js e do framer-motion.
- Na landing, escalabilidade é o peso do bundle, o custo por quadro e o comportamento em telas grandes e muitos elementos. Diga o que é mensurável em teste unitário e o que só o Lighthouse ou o navegador medem.
- O Lighthouse das specs 005 e 006 (T001 e T010) nunca foi medido. Inclua a medição antes e depois no plano.

### 3. Segurança

- **Skills:** `audit-context-building` antes da caça, depois `security-audit` e `sharp-edges`, e `fp-check` para confirmar cada achado.
- **Pontos a olhar:** links externos (`target="_blank"` com `rel`), cabeçalhos e CSP no `next.config.ts`, conteúdo injetado (`dangerouslySetInnerHTML`, SVG inline), dependências (os 8 avisos do audit), dados no cliente e `.env` exposto no bundle. Não leia arquivos `.env`.
- **Saída:** `docs/review/02-seguranca.md`.

### 4. Testes (spec 007)

- **Skills:** `test-driven-development` para o desenho dos testes e `verification-before-completion` para o critério de pronto.
- Crie a spec `007` com Spec-Kit (spec, plan e tasks) listando os testes Vitest por área: desempenho (por exemplo, iterações e hibernação do cursor, limites do amortecimento), escalabilidade e segurança (por exemplo, `rel` nos links externos, ausência de HTML injetado).
- Para tornar a lógica testável sem React, proponha extrair funções puras (por exemplo, o cálculo do campo do cursor, a projeção do ponto de contato da corda e o amortecimento) e diga em quais arquivos.
- Se algum teste exigir `jsdom` ou `@testing-library/react`, liste à parte, com o motivo, para o João decidir.

## Governança

- Relatórios e spec são documentação. Não altere código-fonte. O Claude Code implementa a spec 007 depois da aprovação.
- Sem dependência nova sem liberação do João.
- Trabalhe na `main`, sem branch, sem commit e sem push.
- Proibido travessão (U+2014).
