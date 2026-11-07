# Feature Specification: Correcoes do Code Review e Investigacao do TBT Mobile

**Feature**: `008-correcoes-review`
**Created**: 2026-11-07
**Status**: Ready for Planning
**Input**: Handoff 09 (`docs/handoff/09-correcoes-review.md`), Relatorio de Code Review (`docs/review/01-code-review.md`) e resultados Lighthouse de `specs/007-testes-vitest/tasks.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Investigacao e Recuperacao de Performance Mobile (CR-02, CR-10 e TBT) (Priority: P1)

Como visitante acessando a landing page em um smartphone ou conexao movel, desejo que a pagina inicial carregue rapidamente sem engasgos de thread principal (TBT elevado), para que o conteudo fique interativo e fluido de imediato, sem consumir bateria ou franquia de dados baixando bibliotecas 3D desnecessarias para telas pequenas.

**Why this priority**: O TBT Mobile saltou de 3,6s para 5,6s no Lighthouse entre o commit `333c3a4` e o estado atual. Alem disso, `PluginPrismLogoLazy` baixa cerca de 250 KB gzip de Three.js no Mobile apenas para inclinar um icone de 56px, penalizando a experiencia em celulares.

**Independent Test**: Pode ser testado executando a auditoria Lighthouse Mobile (3 rodadas) e comprovando a reducao do TBT para a faixa de <= 3,5s, alem de inspecionar a arvore de rede no Mobile comprovando que nenhum chunk de Three.js e transferido.

**Acceptance Scenarios**:

1. **Given** um dispositivo movel (largura de tela menor que 1024px), **When** a pagina e carregada, **Then** `PluginPrismLogoLazy` renderiza `BorderIaMark` SVG estatico e nao carrega o chunk dinamico do Three.js nem instancia contexto WebGL.
2. **Given** a montagem inicial da pagina e re-renderizacoes de estado, **When** `useMotionEnvironment` e executado, **Then** `useMediaQuery` utiliza funcao `subscribe` e `getSnapshot` estaveis (CR-10), evitando re-inscricoes continuas no `window.matchMedia`.
3. **Given** execucao do Lighthouse em modo Mobile (simulacao de CPU lenta e viewport 412x823), **When** a auditoria roda 3 vezes em build de producao, **Then** a mediana de TBT e reduzida expressivamente frente aos 5569 ms medidos no fim da spec 007.

---

### User Story 2 - Robustez do Cursor Dinamico e Suporte a Stylus / Caneta (CR-01) (Priority: P1)

Como usuario navegando em notebook hibrido, mesa digitalizadora ou desktop tradicional, desejo que o cursor do sistema nunca desapareca indevidamente, que canetas stylus sejam reconhecidas e que o espectro acorde de imediato em cliques apos perda de foco.

**Why this priority**: `CR-01` afeta a usabilidade basica de navegacao. Aplicar `cursor: none !important` na montagem oculta a seta do sistema antes do primeiro movimento, e ignorar `pointerType === "pen"` deixa usuarios de caneta 100% sem cursor visivel na tela.

**Independent Test**: Testar em ambiente de navegador com stylus e mouse comprovando que o cursor nativo so e substituido apos o primeiro evento valido de ponteiro fino, e que cliques apos `blur` despertam o ponto central imediatamente.

**Acceptance Scenarios**:

1. **Given** a carga inicial da pagina em Desktop, **When** o usuario ainda nao moveu o mouse, **Then** a classe `.cursor-mesh` NAO esta presente em `<html>` e o cursor padrao do sistema permanece visivel.
2. **Given** um usuario interagindo com caneta ou stylus (`pointerType === "pen"`), **When** a caneta se aproxima ou toca a tela, **Then** a malha responde normalmente sem suprimir o ponteiro de forma invisivel.
3. **Given** a janela apos perder foco (`blur`), **When** o usuario clica diretamente na pagina (`pointerdown` sem `pointermove` previo), **Then** a malha desperta imediatamente com a celula central `(11, 11)` visivel no ponto do clique.
4. **Given** um toque de tela touch em dispositivo hibrido (`pointerType === "touch"`), **When** o evento e detectado, **Then** a classe `.cursor-mesh` e removida imediatamente de `<html>`.

---

### User Story 3 - Resiliencia e Ciclo de Vida de WebGL (CR-03) (Priority: P2)

Como usuario redimensionando a janela entre Desktop e Mobile ou utilizando um navegador com pressao de memoria GPU, desejo que os fallbacks visuais em SVG reaparecam de forma confiavel quando o WebGL for desativado ou perder contexto.

**Why this priority**: Evita buracos visuais e handoff quebrado. Hoje `canvasReady` permanece `true` apos sair do Desktop ou sofrer `webglcontextlost`, deixando o Hero sem malha e o card sem logotipo.

**Independent Test**: Simular perda de contexto via extensao `WEBGL_lose_context` e redimensionamento abaixo de 1024px, comprovando que `canvasReady` volta a `false` e os elementos SVG estaticos ficam imediatamente visiveis.

**Acceptance Scenarios**:

1. **Given** um canvas WebGL ativo no Hero em tela Desktop, **When** a janela e redimensionada para largura menor que 1024px, **Then** `canvasReady` volta para `false` e o fallback SVG permanece pronto para reexibicao.
2. **Given** um evento `webglcontextlost` emitido pelo navegador, **When** o evento e disparado, **Then** o estado `canvasReady` e resetado para `false` e o componente exibe o fallback visual estatico em vez de um quadro vazio.

---

### User Story 4 - Integridade de Layout em Recursos e Higiene do CSS (CR-04 e CR-11) (Priority: P2)

Como visitante navegando em telas intermediarias de notebooks ou tablets (1024px a 1260px), desejo que os titulos dos cards de recursos nao invadam as colunas vizinhas, e que o CSS de producao seja enxuto sem seletores invalidos.

**Why this priority**: `CR-04` quebra a grade de 4 colunas em telas de 1024px a 1260px por forcar `lg:whitespace-nowrap` em um texto de 22 caracteres. `CR-11` polui o bundle CSS de producao com classes mortas extraidas indevidamente de `docs/` e `specs/`.

**Independent Test**: Inspecionar visualmente e via testes automatizados a quebra do titulo em 1024px sem transbordamento lateral, e verificar o CSS gerado no build sem classes zumbis.

**Acceptance Scenarios**:

1. **Given** uma viewport de 1024px de largura, **When** a secao Recursos e renderizada, **Then** o titulo "Amplificador de imagem" quebra linha de forma elegante dentro da largura da sua coluna, sem sobrepor o card "Gerador de avatar".
2. **Given** a configuracao de importacao do Tailwind CSS em `globals.css`, **When** o build de producao e executado, **Then** o compilador varre apenas a pasta `src/`, impedindo que textos de documentacao em `docs/` e `specs/` gerem classes no CSS final.
3. **Given** os botoes `.btn-shine`, **When** inspecionados em hover e repouso, **Then** as transicoes de opacidade e angulo de brilho ocorrem sem serem anuladas por utilitarios `transition` conflitantes.

---

### User Story 5 - Hibernacao de Loops GSAP Fora da Viewport e Reducao de Movimento (CR-05) (Priority: P3)

Como visitante navegando por secoes inferiores da pagina ou utilizando modo de economia de energia, desejo que animacoes continuas do card e tickers do GSAP pausem quando fora da tela ou quando movimento reduzido estiver ativo.

**Why this priority**: Mantem consumo de CPU e bateria estritamente zero quando o Hero nao esta visivel, preservando a autonomia do dispositivo do usuario.

**Independent Test**: Verificar se os loops de animacao continua do card (`spinRef`, `beamPulse` e `gsap.ticker.add(syncMotion)`) sao pausados ao rolar para fora da viewport e desativados sob `prefers-reduced-motion`.

**Acceptance Scenarios**:

1. **Given** o card Magic Copy fora da viewport (scroll no Banner ou Footer), **When** o estado de visibilidade e atualizado, **Then** o giro do arco, o pulso luminoso e a sincronizacao com o ticker do GSAP ficam pausados.
2. **Given** usuario com preferencia de movimento reduzido ativada, **When** a aplicacao e inicializada, **Then** `SmoothScrollProvider` nao registra listener continuo de update no `gsap.ticker`.

---

### Edge Cases

- **Alternancia rapida entre touch e stylus em notebook hibrido**: Se o usuario tocar a tela com o dedo apos usar a caneta, o handler de `pointerdown` deve remover `.cursor-mesh` de imediato. Ao voltar com a caneta, deve reativar a malha no primeiro movimento valido.
- **Redimensionamento continuo cruzando 1024px repetidas vezes**: A transicao entre SVG estatico e Three.js deve ser limpa, sem acumulo de contextos WebGL orfaos e sem piscar em tela vazia.
- **Perda e restauracao de contexto WebGL (`webglcontextrestored`)**: Se a GPU restaurar o contexto, o canvas pode reinicializar e reassumir `canvasReady = true` suavemente.
- **Janela aberta diretamente com foco fora da aba**: A classe `.cursor-mesh` nao pode ser injetada ate que haja interacao direta comprovada na janela ativa.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O carregamento de `PluginPrismLogo3D` DEVE ser restrito a `isDesktop && !reduceMotion`. Em telas menores que 1024px ou com reducao de movimento, o componente DEVE renderizar `BorderIaMark` SVG estatico sem baixar Three.js nem R3F.
- **FR-002**: O hook `useMediaQuery` em `useMotionEnvironment.ts` DEVE estabilizar a referencia das funcoes `subscribe` e `getSnapshot`, eliminando re-inscricoes desnecessarias no `window.matchMedia` durante a hidratacao e re-renderizacao dos componentes.
- **FR-003**: A aplicacao da classe `.cursor-mesh` em `<html>` DEVE ocorrer exclusivamente apos o recebimento do primeiro evento de ponteiro valido (`mouse` ou `pen`). Ela DEVE ser removida imediatamente caso um evento de `touch` seja disparado.
- **FR-004**: O componente `CursorDotMesh` DEVE escutar eventos de `pointerdown` alem de `pointermove`, despertando imediatamente o espectro com presenca total apos eventos de `blur` ou perda de foco.
- **FR-005**: A funcao de calculo visual do cursor DEVE garantir que a celula central `(11, 11)` mantenha intensidade minima de alfa visivel quando `presence > 0`, garantindo ponto de referencia no clique.
- **FR-006**: Os componentes `HeroBeamLazy` e `PluginPrismLogoLazy` DEVEM resetar `canvasReady = false` sempre que a condicao de conexao Desktop for desfeita (`!connected`) ou houver emissao de `webglcontextlost` no canvas.
- **FR-007**: O elemento `WebGLSafeBoundary` DEVE capturar erros e perdas de contexto propagando callback para reativar os fallbacks estaticos SVG sem deixar espaco vazio na tela.
- **FR-008**: Na secao `FeaturesSection.tsx`, o titulo "Amplificador de imagem" DEVE remover a classe `lg:whitespace-nowrap`, utilizando `xl:whitespace-nowrap` ou quebra fluida, eliminando invasao horizontal na coluna vizinha entre 1024px e 1260px.
- **FR-009**: O arquivo `globals.css` DEVE restringir a fonte de escaneamento de classes do Tailwind CSS exclusivamente ao diretorio `src/`, eliminando a emissao de seletores mortos gerados a partir de `docs/` e `specs/`.
- **FR-010**: A classe `.btn-shine` DEVE ter suas propriedades de transicao declaradas sem conflito com o utilitario `transition` (`transition-all`), e o comentario com sintaxe de colchetes DEVE ser corrigido.
- **FR-011**: O componente `MagicCopyCard.tsx` DEVE pausar o giro do arco `spinRef`, o pulso `beamPulse` e a sincronizacao no `gsap.ticker` quando fora da viewport, e nao deve registrar o ticker em telas Mobile.
- **FR-012**: O componente `SmoothScrollProvider.tsx` NAO deve registrar atualizacoes no `gsap.ticker` quando `reduceMotion === true`.
- **FR-013**: Cada correcao com logica testavel DEVE receber teste unitario Vitest antes da implementacao no codigo consumidor (ciclo TDD), mantendo os 90 testes existentes rigorosamente verdes.
- **FR-014**: Nenhuma dependencia externa nova pode ser adicionada ao `package.json`, e todo codigo deve respeitar a proibicao absoluta de travessoes (`U+2014`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O conjunto total de testes no Vitest sobe de 90 testes para pelo menos 100 testes passando em menos de 1,5s no ambiente `node` nativo.
- **SC-002**: A mediana de TBT Mobile no Lighthouse em 3 rodadas consecutivas apresenta queda significativa frente aos 5569 ms medidos na spec 007, buscando a faixa de <= 3500 ms sem regressao nas notas de Acessibilidade (100), Best Practices (100) e SEO (100).
- **SC-003**: Nenhum chunk do Three.js e transferido em navegadores com viewport menor que 1024px, comprovando o isolamento do 3D no Mobile.
- **SC-004**: O arquivo CSS compilado de producao nao contem classes residuais de `docs/` ou `specs/` (como `mix-blend-screen`, `cursor-grab` ou seletores de comentarios).
- **SC-005**: Inspecao visual e testes de layout comprovam zero colisao de texto no card de Recursos em larguras entre 1024px e 1260px.

---

## Assumptions

- **A-01 (Preservacao visual)**: Nenhuma das correcoes de layout, animacao ou TBT altera o design aprovado pelo Joao Gabriel (brilho do H1, formatos dos botoes, cores, tipografia e movimento em Desktop).
- **A-02 (Ambiente de testes em Node puro)**: As novas assercoes seguem a decisao confirmada da spec 007 de rodar no ambiente `node` puro do Vitest, cobrindo regras puras e guardas estaticas de repositorio sem necessidade de instalar `jsdom`.
