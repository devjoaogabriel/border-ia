# Feature Specification: Itens Restantes do Review e Hardening de Seguranca

**Feature**: `009-itens-restantes-review`
**Created**: 2026-11-07
**Status**: Ready for Planning
**Input**: Handoff 10 (`docs/handoff/10-itens-restantes-review.md`), Relatorio de Code Review (`docs/review/01-code-review.md`), Relatorio de Seguranca (`docs/review/02-seguranca.md`) e desvios documentados em `specs/008-correcoes-review/tasks.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hardening de Seguranca HTTP e Blindagem de Configuracao (NV-01, SA-INFO-01, SE-03, SE-04) (Priority: P1)

Como desenvolvedor e mantenedor da aplicacao, desejo que a landing page sirva cabecalhos HTTP de seguranca modernos, que o cabecalho de divulgacao do framework seja desativado, que strings de caminho vetorial sejam sanitizadas antes da criacao de prismas 3D e que o projeto esteja protegido contra downgrades destrutivos de dependencias.

**Why this priority**: Conclui todos os apontamentos da auditoria de seguranca (`docs/review/02-seguranca.md`), eliminando divulgacao desnecessaria de stack e blindando a aplicacao contra clickjacking, MIME sniffing e injecoes de caminho SVG.

**Independent Test**: Pode ser testado executando a suite `src/security/source-and-config.test.ts` para verificar os cabecalhos em `next.config.ts`, a presenca de `poweredByHeader: false`, a sanitizacao de `LOGO_MARK` e a trava de versao de dependencias.

**Acceptance Scenarios**:

1. **Given** o arquivo de configuracao `next.config.ts`, **When** uma requisicao e processada, **Then** a resposta HTTP inclui `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` e CSP compativel com Next 16 App Router.
2. **Given** a configuracao de cabecalhos do servidor, **When** inspecionada, **Then** o cabecalho `X-Powered-By` esta explicitamente desativado (`poweredByHeader: false`).
3. **Given** a funcao de criacao de prismas 3D (`PluginPrismLogo3D.tsx`), **When** um caminho de SVG e processado, **Then** a string do atributo `d` e validada por expressao regular estrita antes de ser interpolada no parser XML.
4. **Given** a suite de seguranca estatica, **When** `npm.cmd test` e executado, **Then** ha teste que valida que `eslint-config-next` e `eslint` mantem versoes compativeis com Next 16 e Flat Config, prevenindo execucoes acidentais de `npm audit fix --force`.

---

### User Story 2 - Nitidez Dinamica do Cursor e Parametrizacao do Shader (CR-06, CR-12) (Priority: P1)

Como usuario navegando em monitores de alta densidade de pixels (Retina / 4K) ou alternando entre monitores com diferentes escalas de exibicao, desejo que a malha do cursor mantenha nitidez cristalina sem distorcoes, e que o shader de ondas do Hero adapte suas dimensoes verticais dinamicamente sem valores estaticos engessados.

**Why this priority**: `CR-06` corrige a perda de nitidez dos pontos do cursor ao arrastar a janela entre monitores ou aplicar zoom. `CR-12` elimina literais magicos no fragment shader do Three.js e assegura que mudancas de propriedades apos a montagem sincronizem com o material.

**Independent Test**: Testar a funcao de sincronizacao de resolucao em `src/lib/cursor-mesh-math.test.ts` e verificar a derivacao matematica da mascara no shader do Hero.

**Acceptance Scenarios**:

1. **Given** o componente `CursorDotMesh`, **When** ocorre mudanca de `devicePixelRatio` (evento de resize ou zoom), **Then** as dimensoes fisicas do canvas e a escala do contexto 2D sao reconfiguradas dinamicamente mantendo a densidade de pixels correta.
2. **Given** o shader `HeroBeamCanvas`, **When** `uSize.y` e definido, **Then** o centro vertical e o raio da mascara de corte sao derivados dinamicamente da altura util informada, sem recorrer aos literais fixos `278.5` e `218.5`.
3. **Given** o componente `BeamPlane`, **When** as props de dimensao mudam apos a montagem, **Then** os uniforms do material Three.js sao sincronizados de forma reativa.

---

### User Story 3 - Otimizacao de Memoria GPU, Tickers e QuickTo no Card (CR-07, CR-08, CR-09) (Priority: P2)

Como visitante interagindo com o card 3D Magic Copy e navegando pela pagina, desejo que a resposta ao ponteiro seja suave e livre de engasgos de alocacao de memoria, que geometrias 3D nao vazem na GPU e que a conexao entre o card e a corda do feixe nao apresente defasagem temporal de frames.

**Why this priority**: Evita vazamentos de VRAM na GPU (`ExtrudeGeometry.dispose()`), remove sobrecarga de layout thrashing no evento de hover do card (`getBoundingClientRect` a cada quadro) e elimina 1 frame de atraso visual entre o path SVG da corda e o shader.

**Independent Test**: Validar os helpers de reset em `src/lib/hero-beam-math.test.ts` e inspecionar o ciclo de vida do card e do logotipo no navegador.

**Acceptance Scenarios**:

1. **Given** os testes unitarios de movimento do feixe e do card, **When** uma suite e finalizada, **Then** o helper `resetHeroCardMotion()` restaura o estado inicial do singleton sem contaminar suites vizinhas.
2. **Given** o movimento de hover em `MagicCopyCard`, **When** o mouse se move sobre o card, **Then** as dimensoes da caixa sao lidas de cache estavel e os angulos sao animados via `gsap.quickTo` preservando a mesma sensibilidade de amortecimento aprovada.
3. **Given** a desmontagem de `PluginPrismLogo3D`, **When** o componente e desmontado, **Then** as instancias de `ExtrudeGeometry` tem seus buffers liberados via `dispose()`, e o listener de `pointermove` e registrado com a flag `{ passive: true }`.

---

### User Story 4 - Acessibilidade Semantica, Foco de Teclado e Otimizacao de Assets (CR-13) (Priority: P3)

Como usuario que navega por teclado ou tecnologias assistivas, desejo poder pular rapidamente para o conteudo principal da pagina, que o identificador do titulo principal esteja no elemento semantico correto, que o foco de teclado nao cause consumo infinito de animacao quando estacionario e que assets estaticos pesados sejam otimizados sem qualquer alteracao visual.

**Why this priority**: Melhora a navegabilidade semantica da pagina (WCAG), evita gasto de bateria com animacoes infinitas em foco de teclado estatico e reduz o peso do projeto limpando arquivos orfaos e avaliando a substituicao de SVG pesado no banner.

**Independent Test**: Navegar exclusivamente por tecla Tab no navegador confirmando o link de pular conteudo, inspecionar a arvore de acessibilidade do `<h1>`, monitorar consumo de GPU no foco estatico de `.btn-shine` e conferir a equivalencia visual do banner.

**Acceptance Scenarios**:

1. **Given** a navegacao por teclado, **When** o usuario pressiona Tab ao entrar na pagina, **Then** um link "Pular para o conteudo principal" torna-se visivel e foca diretamente em `<main id="conteudo-principal">`.
2. **Given** a estrutura de titulos da pagina, **When** inspecionada, **Then** o identificador `id="hero-heading"` esta presente diretamente no elemento `<h1>` semantico em vez de uma `<div>` estrutural.
3. **Given** um botao `.btn-shine` focado exclusivamente por teclado e estacionario, **When** o foco permanece ativo sem movimento de mouse, **Then** o giro continuo de `@property --shine-angle` e limitado ou pausado apos feedback inicial, evitando repaint continuo.
4. **Given** a decoracao do banner, **When** comparada com a versao CSS `DotMatrixDecor variant="css"`, **Then** a aparencia visual e estritamente identica a versao anterior, permitindo a remocao de dependencia do arquivo `dot-matrix.svg` de 254 KB.
5. **Given** o arquivo orfao `public/icons/stroke-scribble.svg`, **When** inspecionado, **Then** ele e removido sem causar quebra em nenhum componente.

---

### Edge Cases

- **Troca de monitor em janela aberta no meio de duas telas**: A deteccao de mudanca de densidade de pixels deve ser suave, recalculando a matriz do canvas sem piscar ou perder a posicao do cursor.
- **Navegador sem suporte a Content Security Policy moderna**: Os cabecalhos devem usar diretivas padronizadas com fallback seguro sem quebrar navegadores mais antigos.
- **Zoom continuo do navegador com Ctrl + roda do mouse**: O redimensionamento do canvas do cursor nao pode criar vazamentos de memoria ou estourar o limite de `dpr <= 2`.
- **String de SVG corrompida em logotipo**: A validacao de caminho vetorial deve lancar erro claro de seguranca caso receba caracteres estranhos fora da gramatica de paths SVG.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O arquivo `next.config.ts` DEVE configurar cabecalhos HTTP de seguranca via metodo `headers()`, incluindo `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` e CSP estatica compativel com Next 16 App Router e GSAP (`'self' 'unsafe-inline'` para scripts e estilos locais, `frame-ancestors 'none'`, `object-src 'none'`).
- **FR-002**: O arquivo `next.config.ts` DEVE conter explicitamente a propriedade `poweredByHeader: false`, desativando a emissao do cabecalho `X-Powered-By: Next.js`.
- **FR-003**: A criacao de prismas 3D em `PluginPrismLogo3D.tsx` DEVE validar o caminho vetorial `d` por expressao regular estrita antes de interpolar no parser XML, ou consumir helper puro de sanitizacao.
- **FR-004**: A suite `src/security/source-and-config.test.ts` DEVE conter assercoes que validem as configuracoes de `next.config.ts`, a sanitizacao de caminhos SVG e a trava de dependencias de linting para prevenir os riscos de `npm audit fix --force`.
- **FR-005**: O componente `CursorDotMesh.tsx` DEVE escutar mudancas de escala/resolucao (`resize` com comparacao de `devicePixelRatio`) e atualizar o tamanho fisico do canvas e a matriz `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` para manter os pontos nitidos em qualquer zoom ou monitor.
- **FR-006**: O fragment shader em `HeroBeamCanvas.tsx` DEVE derivar as constantes verticais da mascara em funcao da altura informada `uSize.y`, eliminando os literais fixos `278.5` e `218.5`.
- **FR-007**: O componente `BeamPlane` em `HeroBeamCanvas.tsx` DEVE atualizar os uniforms do material Three.js sempre que as props de dimensao forem modificadas apos o primeiro mount.
- **FR-008**: O modulo `src/lib/hero-beam-math.ts` (ou `src/lib/gsap.ts`) DEVE disponibilizar o helper puro `resetHeroCardMotion()`, restaurando os valores neutros de repouso para uso em testes automatizados.
- **FR-009**: O componente `MagicCopyCard.tsx` DEVE cachear o retangulo delimitador lido do DOM no evento `pointerenter` (invalidando em scroll ou resize) e utilizar `gsap.quickTo` para aplicar `rotationX` e `rotationY`, preservando integralmente o comportamento visual de amortecimento.
- **FR-010**: O componente `PluginPrismLogo3D.tsx` DEVE descartar as geometrias `ExtrudeGeometry` via metodo `dispose()` na desmontagem do componente, e registrar o listener de `pointermove` com a opcao `{ passive: true }`.
- **FR-011**: A aplicacao DEVE incluir um link acessivel no topo da pagina para pular direto para `<main id="conteudo-principal">`, e o identificador `id="hero-heading"` DEVE ser aplicado diretamente na tag `<h1>` de `animated-shiny-text.tsx`.
- **FR-012**: O efeito `.btn-shine` DEVE limitar a execucao continua do giro quando o botao estiver apenas focado por teclado de forma estacionaria, evitando repaint infinito em segundo plano.
- **FR-013**: A secao `BannerSection.tsx` DEVE avaliar a substituicao de `DotMatrixDecor variant="asset"` por `variant="css"`, confirmando previamente que a renderizacao permanece 100% identica ao design aprovado; o arquivo orfao `stroke-scribble.svg` DEVE ser excluido.
- **FR-014**: Todas as alteracoes DEVEM seguir o ciclo TDD com testes Vitest correspondentes, mantendo os 124 testes existentes verdes, sem adicionar novas dependencias ao `package.json` e com zero travessoes (`U+2014`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O total de testes no Vitest sobe de 124 testes para pelo menos 135 testes passando com sucesso em menos de 2s no ambiente `node` nativo.
- **SC-002**: As metricas do Lighthouse Mobile e Desktop (`lighthouse@12.8.2`, 3 rodadas) mantem ou melhoram os resultados alcancados na spec 008 (Mobile Performance >= 58, TBT <= 2000 ms, Desktop Performance >= 79, e notas 100 em Acessibilidade, Melhores Praticas e SEO).
- **SC-003**: Inspecao das respostas HTTP locais comprova a ausencia de `X-Powered-By` e a presenca dos 5 cabecalhos de seguranca configurados.
- **SC-004**: O link de pular para o conteudo e operavel via teclado, e a tecla Tab leva o foco diretamente ao conteudo principal.
- **SC-005**: Inspecao de memoria comprova a liberacao de buffers de geometria 3D na desmontagem de `PluginPrismLogo3D`.

---

## Assumptions

- **A-01 (Compatibilidade de CSP com App Router Estatico)**: A CSP proposta nao utiliza nonces dinamicos por requisicao para nao quebrar a diretiva `cacheComponents: true` e a geracao estatica da landing page.
- **A-02 (Fidelidade do Banner)**: A troca da variante da matriz de pontos no banner so e efetivada se a renderizacao em CSS for indistinguivel do SVG original. Caso haja diferenca de padrao ou opacidade, a variante de asset e mantida.
