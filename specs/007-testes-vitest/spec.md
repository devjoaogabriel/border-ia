# Feature Specification: Suite de Testes Unitarios Vitest (Desempenho, Escalabilidade e Seguranca) e Extracao de Funcoes Puras

**Feature Branch**: `007-testes-vitest` (mantido na branch `main` por regra de governanca do projeto)

**Created**: 2026-11-07

**Status**: Draft Ready for Approval & Implementation (`Handoff 08`)

**Input**: User description: "Criar a spec 007 de testes Vitest usando test-driven-development e verification-before-completion, listando os testes por area (desempenho, escalabilidade e seguranca), propondo a extracao de funcoes puras para testar a logica sem React em environment node, listando a parte os testes que exigiriam jsdom/@testing-library/react para decisao do Joao e incluindo a medicao pendente do Lighthouse antes e depois."

## Contexto e Escopo

O projeto conta com `vitest@4.1.12` configurado em `vitest.config.ts` (`environment: "node"`, alias `@/` apontando para `src/`, padrao `src/**/*.test.{ts,tsx}`), mas possui hoje **0 arquivos de teste**. Como `jsdom` e `@testing-library/react` nao estao instalados e novas dependencias exigem liberacao previa do Joao Gabriel, esta especificacao projeta uma suite `100%` executavel no ambiente `node` atual por meio da extracao cirurgica da logica matematica, fisica e de validacao em funcoes puras, complementada pelo protocolo obrigatorio de comparacao Lighthouse Mobile e Desktop (`antes` vs `depois`) nunca executado nas specs `005` e `006`. Os cenarios que exigiriam `jsdom` e `@testing-library/react` ficam isolados em secao propria para decisao explicita do autor.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Testes Unitarios de Desempenho e Fisica de Animacao via Funcoes Puras (Priority: P1)

Ao executar `npm test`, o desenvolvedor valida deterministicamente toda a matematica critica por quadro da landing page sem precisar subir navegador nem WebGL: o calculo da malha do cursor (`484` celulas, descarte geometrico de `168` celulas fora do raio `40`, reticulado Bayer `4x4`, limite `MAX_ALPHA = 0.9`, clamp `dt <= 0.05s`, snap na primeira entrada e hibernacao `rafId = -1` apos saida da janela), a projecao 3D da ponta da corda e estabilidade da mola amortecida em `HeroBeamLazy`, e a curva `tanh` com amortecimento sobre o CTA em `MagicCopyCard`.

**Why this priority**: Protege com execucao sub-segundo os tres motores matematicos que rodam a `60-144fps` na pagina e elimina o acoplamento opaco dentro de closures `useEffect`/`useGSAP`, seguindo o ciclo Red-Green-Refactor de `test-driven-development`.

**Independent Test**: Executar `npm test` em ambiente `node` puro e verificar aprovacao integral das suites `cursor-mesh-math.test.ts`, `hero-beam-math.test.ts` e `card-tilt-math.test.ts`, comprovando falha previa (RED) antes de cada funcao extraida ser conectada (GREEN).

**Acceptance Scenarios**:

1. **Given** o modulo puro do cursor extraido de `CursorDotMesh.tsx`, **When** a suite `src/lib/cursor-mesh-math.test.ts` executa no Vitest, **Then** comprova que exatamente `168` das `484` celulas retornam `0` pelo corte `OUTER_CUTOFF = 40`, nenhum ponto ultrapassa `0.9` de alpha, saltos de tempo de `10s` sao limitados a `0.05s` sem overshoot e o estado converge para hibernacao (`presence === 0` e `rafId === -1`) em menos de `60` quadros a `60Hz` quando `targetPresence = 0`.
2. **Given** o modulo puro do feixe extraido de `HeroBeamLazy.tsx` (unificando `BEAM_REST_TIP = 511` com `src/lib/gsap.ts`), **When** a suite `src/lib/hero-beam-math.test.ts` executa, **Then** comprova que angulos `(0, 0, 0)` projetam `(tipX = 0, tipY = 511)`, inclinacoes simetricas `±rotationY` geram `tipX` espelhados, a mola `stepBeamSpring` converge sem divergir ate `dt = 0.05s` e `beamPath` produz comando SVG Bezier valido.
3. **Given** o modulo puro de inclinacao extraido de `MagicCopyCard.tsx`, **When** a suite `src/lib/card-tilt-math.test.ts` executa, **Then** comprova que `rotationX` e `rotationY` nunca excedem `10` e `12` graus mesmo para entradas extremas e que `overCta = true` reduz ambos os angulos pelo fator exato `0.35`.

---

### User Story 2 - Testes Automatizados de Seguranca e Blindagem contra Sharp Edges (Priority: P1)

Ao rodar `npm test`, a suite verifica automaticamente as invariantes de seguranca levantadas em `docs/review/02-seguranca.md`: todos os links de `SITE_LINKS` obedecem ao protocolo esperado e geram `target="_blank"` + `rel="noopener noreferrer"` sempre que externos (corrigindo tambem a omissao silenciosa em `Header.tsx` via helper puro compartilhado), o estilo de mascara de `MaskIcon` aceita apenas caminhos locais seguros entre aspas, nenhum arquivo `.svg` servido em `public/` ou `src/app/` contem scripts, `<foreignObject>`, handlers `on*` ou URLs externas, nenhum arquivo em `src/` usa sinks de injecao (`dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`) ou expoe `process.env`, e `.gitignore` + `next.config.ts` preservam suas guardas seguras.

**Why this priority**: Transforma as garantias hoje mantidas apenas por disciplina manual (`nothing found` no `audit-context-building`) em portoes automatizados que falham imediatamente se um link inseguro, um SVG bruto do Figma com `<foreignObject>` ou um sink de XSS for introduzido.

**Independent Test**: Executar `npm test src/lib/links.test.ts src/lib/mask-style.test.ts src/security/` e confirmar que entradas maliciosas (`javascript:alert(1)`, `https://...` com `external: false`, `/icons/x");background:url(//evil.com)` e SVGs com `<script>`/`<foreignObject>`) sao rejeitadas.

**Acceptance Scenarios**:

1. **Given** o helper puro `resolveSiteLinkAttributes` em `src/lib/links.ts` consumido por `CtaButton`, `Header` e `Footer`, **When** `src/lib/links.test.ts` testa `SITE_LINKS` e casos de borda, **Then** garante `target="_blank"` e `rel="noopener noreferrer"` para todo `https://...`, ancora local `#...` para links internos, rejeicao de `javascript:`/`data:`/`http:` e existencia real de cada `/icons/social-${id}.svg` em `public/`.
2. **Given** todos os arquivos `.svg` servidos em `public/` e `src/app/`, **When** `src/security/svg-assets.test.ts` inspeciona seu conteudo, **Then** aprova os `13` SVGs atuais e falha caso exista `<script`, `<foreignObject`, atributo `on*`, `javascript:`, `data:` ou referencia externa.
3. **Given** todo o codigo-fonte em `src/**/*`, `next.config.ts` e `.gitignore`, **When** `src/security/source-and-config.test.ts` executa, **Then** comprova zero sinks de injecao HTML/JS, zero leituras nao autorizadas de `process.env`, zero ocorrencias de travessao (`U+2014`), `dangerouslyAllowSVG` desativado e `.env*` protegido no `.gitignore`.

---

### User Story 3 - Testes de Escalabilidade Estatica e Medicao Lighthouse Antes/Depois (Priority: P2)

Ao rodar `npm test`, uma suite de orcamento e escalabilidade garante que as dimensoes de renderizacao permanecem limitadas independentemente da resolucao do monitor (`4K`/`2560px` vs `1024px`), que o Hero de `247px` de meia-largura (`CANVAS_WIDTH = 504`) nunca estoura a largura util de `1024px`, que `@property --shine-angle` permanece com `inherits: false` e pausada em repouso, e que todos os assets referenciados existem dentro do orcamento de peso. Em complemento, o protocolo Lighthouse Mobile e Desktop (`antes` em `333c3a4` vs `depois` na `main`) e executado e registrado com evidencias reais conforme `verification-before-completion`.

**Why this priority**: Conecta o que e verificavel por invariantes estaticas no Vitest com o que somente o navegador real mede (LCP, TBT, CLS e score Lighthouse pendentes desde as specs `005` e `006`).

**Independent Test**: Executar `npm test src/lib/scalability-budget.test.ts` e conferir o relatorio comparativo de 3 rodadas Mobile + 3 rodadas Desktop do Lighthouse antes e depois.

**Acceptance Scenarios**:

1. **Given** as constantes geometricas do Hero e do cursor e o arquivo `src/app/globals.css`, **When** `src/lib/scalability-budget.test.ts` roda, **Then** comprova que a borda direita do canvas de `504px` cabe dentro da viewport de `1024px` (`1007px` uteis com scrollbar), que o teto de fragmentos (`504 x 525` em `dpr <= 2`) e o grid do cursor (`88 x 88`, `484` celulas) sao constantes em `4K`, e que `--shine-angle` mantem `inherits: false` e animacao `paused` fora de hover/foco.
2. **Given** a exigencia pendente das specs `005` e `006` (`T001` e `T010`), **When** a medicao Lighthouse Mobile e Desktop (mediana de 3 execucoes em build de producao) e executada sobre `333c3a4` e sobre o estado final na `main`, **Then** os resultados numericos (Performance, Accessibility, Best Practices, SEO, LCP, TBT, CLS) ficam documentados com evidencia verificavel antes de declarar a entrega concluida.

---

### Edge Cases

- **Tab em segundo plano por longo periodo (`dt` gigante)**: Ao voltar de uma aba inativa apos varios segundos (`rawDtSec = 12`), tanto `advanceCursorMeshState` quanto `stepBeamSpring` DEVEM grampear `dt <= 0.05s`, evitando salto abrupto ou instabilidade numerica.
- **Coordenadas de ponteiro fora da caixa do card**: Se um evento entregar `normX` ou `normY` acima de `1` ou abaixo de `-1` nas bordas do palco, `computeCardHoverAngles` DEVE manter os angulos estritamente limitados por `Math.tanh`.
- **Link externo cadastrado em `navItems` ou sem flag `external`**: `resolveSiteLinkAttributes` DEVE lancar erro explicito se houver divergencia entre o esquema de `href` (`https://` vs `#`) e o campo `external`, impedindo falha silenciosa em `Header.tsx` ou `CtaButton.tsx`.
- **Exportacao bruta do Figma copiada para `public/`**: Caso um SVG contendo `<foreignObject>` ou `<div>` (como `docs/design/screens/Interface-figma.svg`) seja copiado para `public/`, `svg-assets.test.ts` DEVE falhar imediatamente com o caminho exato do arquivo.

## Decisao Aprovada pelo Joao Gabriel: Escopo em `node` Puro (Sem `jsdom`)

Em 2026-11-07, o Joao Gabriel confirmou a **Opcao 1**: manter o ambiente `node` nativo do Vitest (`environment: "node"`), sem instalar `jsdom` ou `@testing-library/react`, preservando o `package.json` enxuto e focando a suite nos calculos matematicos, escalabilidade e seguranca em `src/lib/`.

Os testes de ciclo de vida de componentes React listados abaixo permanecem fora da suite unitaria e continuam validados em navegador real (Playwright / Lighthouse):

| Teste Candidato em DOM Simulado | Por que exige `jsdom` + `@testing-library/react` | Como fica coberto sem essas deps |
|---------------------------------|--------------------------------------------------|----------------------------------|
| Ciclo da classe `.cursor-mesh` em `document.documentElement` (montagem, cleanup e troca ao vivo de `reduceMotion`/`canHover`) | Requer `window`, `document.documentElement.classList` e montagem de `useEffect` do componente `<CursorDotMesh />`. | Verificado em navegador real via Playwright (Chromium + WebKit). |
| Filtro de `PointerEvent.pointerType` (`mouse` vs `pen` vs `touch`) e despertar em `pointerdown` apos `blur` | Requer disparo de eventos DOM em `window` e leitura de `canvas.style.transform`. | Matematica de estado coberta em `node`; eventos reais cobertos via Playwright. |
| Deduplicacao de assinaturas `matchMedia` em `useMotionEnvironment` / `useMediaQuery` | Requer ciclo de renderizacao React (`useSyncExternalStore`) e mock de `window.matchMedia`. | Auditado em code review (`CR-10`). |
| Fallback visual de `WebGLSafeBoundary` e reset de `canvasReady` / `ready` quando `webgl2` falha | Requer arvore React montada (`ErrorBoundary`) e `HTMLCanvasElement.prototype.getContext`. | Validado em Playwright. |

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A implementacao da Spec `007` DEVE seguir estritamente o ciclo `test-driven-development` (`RED -> Verify RED -> GREEN -> Verify GREEN -> REFACTOR`) para cada funcao pura extraida e cada invariante adicionada, sem instalar nenhum pacote novo em `package.json` (mantendo `environment: "node"` em `vitest.config.ts`).
- **FR-002**: A matematica pura de `CursorDotMesh.tsx` DEVE ser extraida para `src/lib/cursor-mesh-math.ts` (`smoothstep`, `approach`, `computeCursorCellAlpha`, `advanceCursorMeshState` e constantes geometricas) e reimportada por `CursorDotMesh.tsx` sem alterar nenhum pixel ou comportamento visual aprovado na `006`/`Handoff 07`.
- **FR-003**: A matematica pura de projecao 3D, mola amortecida e Bezier de `HeroBeamLazy.tsx` DEVE ser extraida para `src/lib/hero-beam-math.ts` (`BEAM_REST_TIP`, `projectBeamContact`, `stepBeamSpring`, `beamPath`), eliminando tambem o literal duplicado `511` em `src/lib/gsap.ts` e mantendo o movimento da corda identico ao aprovado na `004`.
- **FR-004**: O calculo puro de inclinacao por hover de `MagicCopyCard.tsx` DEVE ser extraido para `src/lib/card-tilt-math.ts` (`TILT_CONFIG`, `computeCardHoverAngles`) e consumido por `MagicCopyCard.tsx` sem alterar a resposta 3D do card.
- **FR-005**: A resolucao segura de atributos de link e mascara CSS DEVE ser extraida para `src/lib/links.ts` (`resolveSiteLinkAttributes`, consumido por `CtaButton.tsx`, `Header.tsx` e `Footer.tsx`) e `src/lib/mask-style.ts` (`buildMaskStyle`, consumido por `MaskIcon.tsx`), eliminando os sharp edges `SE-01` e `SE-02` sem alterar a aparencia dos componentes.
- **FR-006**: A suite Vitest DEVE cobrir as tres areas exigidas no `Handoff 08`:
  1. **Desempenho**: `src/lib/cursor-mesh-math.test.ts`, `src/lib/hero-beam-math.test.ts`, `src/lib/card-tilt-math.test.ts`.
  2. **Escalabilidade**: `src/lib/scalability-budget.test.ts`.
  3. **Seguranca**: `src/lib/links.test.ts`, `src/lib/mask-style.test.ts`, `src/security/svg-assets.test.ts`, `src/security/source-and-config.test.ts`.
- **FR-007**: Conforme `verification-before-completion`, a entrega SO pode ser declarada pronta apos executar e comprovar com saida limpa: `npm test` (`0` falhas), `npm run lint` (`0` erros), `npm run build` (`exit 0`) e o comparativo Lighthouse Mobile e Desktop (`antes` em `333c3a4` vs `depois` na `main`, mediana de 3 execucoes, preenchendo `T001` e `T010` da `006`).
- **FR-008**: Todo codigo, teste e documentacao DEVE respeitar a proibicao absoluta do caractere travessao (`U+2014`) e manter o trabalho na branch `main` sem commits nem pushes automaticos.

### Key Entities

- **Modulo Puro do Cursor (`cursor-mesh-math.ts`)**: Funcoes deterministas sem DOM para campo radial + Bayer `4x4`, transicao inercial e criterio de hibernacao do loop de quadros.
- **Modulo Puro do Feixe (`hero-beam-math.ts`)**: Projecao ortografica/perspectiva da ponta da corda a partir de Euler `Z-Y-X`, integrador de mola amortecida e gerador do caminho cubico SVG.
- **Modulo Puro de Tilt (`card-tilt-math.ts`)**: Mapeamento `tanh` normalizado com atenuacao sobre o botao CTA.
- **Guardas de Seguranca e Escalabilidade (`links.ts`, `mask-style.ts`, `src/security/*.test.ts`, `scalability-budget.test.ts`)**: Contratos executaveis sobre URLs, atributos `rel`, SVGs servidos, codigo-fonte, configuracao Next.js e limites geometricos de renderizacao.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm test` executa em menos de `2s` no ambiente `node` atual (`0` novas dependencias) com `100%` dos testes passando nas suites de desempenho, escalabilidade e seguranca.
- **SC-002**: Cada funcao pura extraida possui prova documentada do ciclo Red-Green durante a implementacao e preserva `100%` do comportamento visual existente em `Hero`, `MagicCopyCard`, `CursorDotMesh`, `CtaButton`, `Header`, `Footer` e `MaskIcon`.
- **SC-003**: `npm run lint` e `npm run build` concluem com codigo `0`, zero avisos e zero ocorrencias de `U+2014`.
- **SC-004**: As medianas de 3 rodadas Mobile e 3 rodadas Desktop do Lighthouse para `333c3a4` (`antes`) e para a arvore final (`depois`) estao medidas e registradas objetivamente, encerrando a pendencia herdada das specs `005` e `006`.

## Assumptions

- **Premissa A-01 (Ambiente `node` confirmado pelo Joao)**: Manter `vitest.config.ts` com `environment: "node"` e zero pacotes adicionais, sem instalar `jsdom` ou `@testing-library/react`.
- **Premissa A-02 (Refatoracao preservadora de comportamento)**: As extracoes propostas em `src/lib/*` apenas movem calculos puros ja existentes (e blindam `resolveSiteLinkAttributes` / `buildMaskStyle`), sem alterar layout, cores, tempos de animacao ou shaders aprovados.
