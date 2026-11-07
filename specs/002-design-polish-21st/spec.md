# Feature Specification: Polimento Visual e Componentes Elevados da Landing Page Border-IA

**Feature Branch**: `002-design-polish-21st` (mantido na branch `main` por regra do projeto)

**Created**: 2026-11-06

**Status**: Approved Scope (Handoff 02)

**Input**: User description: "Elevar o visual da landing page Border-IA com melhorias aprovadas da 21st.dev (S1-S4, pendencias CM-10 e reduced motion nos hovers CSS D4, e melhorias D1 a D7 por prioridade P1, P2 e P3), preservando identidade cromatica, tipografia, copy contratual, acessibilidade, prefers-reduced-motion e nota de performance >= 90 frente a linha de base."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Microinteracoes Luminosas nos Pontos de Conversao e Recursos (Priority: P1)

Um designer que visita a pagina do Border-IA em um computador ou celular percebe acabamento refinado nos pontos centrais da proposta de valor. No topo, o botao principal `"Usar no Figma"` exibe um brilho perimetral sutil sem alterar seu formato ou legibilidade, enquanto o card `"Magic copy"` acende sua borda em sincronia exata com a chegada do pulso de luz vertical e com cliques demonstrativos em `"Start now"`. Na secao Recursos, ao mover o cursor sobre os quatro cards em telas com ponteiro preciso, a borda de cada card responde a posicao do cursor com o gradiente oficial da marca. Mais abaixo, ao alcancar o banner de conversao, container, avatares, prova social, titulo e botao revelam-se em sequencia cadenciada, acompanhados por uma onda luminosa radial ativa nas malhas de pontos dos cantos. Visitantes com reducao de movimento ativa veem todos esses elementos estaticos, nitidos e sem deslocamentos de hover.

**Why this priority**: Reune todas as entregas de prioridade maxima (`P1`: `D1`, `D2`, `D3`, `D4` e a pendencia `CM-10`), elevando imediatamente a percepcao de qualidade nos pontos de maior impacto visual e conversao sem alterar a estrutura macro das secoes existentes.

**Independent Test**: Pode ser testada isoladamente comparando a pagina em `1440px` e `430px` com movimento padrao e com preferencia de movimento reduzido ativada, verificando: resposta de borda ao cursor nos 4 cards de Recursos apenas em dispositivos com ponteiro, sincronismo unico entre feixe vertical e borda do card `"Magic copy"`, brilho perimetral restrito ao CTA principal do Hero, sequencia de 5 etapas + onda radial no banner e ausencia total de movimento nos 6 hovers e nos brilhos quando a reducao de movimento estiver ativa.

**Acceptance Scenarios**:

1. **Given** que o visitante utiliza um dispositivo com ponteiro preciso (`hover` disponivel) e movimento padrao ativo, **When** desloca o cursor sobre qualquer um dos 4 cards da secao Recursos, **Then** a borda do card ilumina-se acompanhando o cursor com o gradiente roxo-indigo da marca, cessando suavemente ao retirar o cursor.
2. **Given** que o visitante observa o card `"Magic copy"` no Hero, **When** o pulso descendente do feixe principal atinge o topo do card ou o visitante aciona `"Start now"`, **Then** a luz percorre a borda do card em sincronia direta com esse pulso unico, sem executar um segundo ciclo autonomo concorrente.
3. **Given** que o visitante visualiza o botao `"Usar no Figma"` em gradiente no Hero com movimento padrao ativo, **When** observa o controle em repouso ou interage com ele, **Then** percebe um brilho continuo percorrendo sua borda mantendo tamanho, cores e rotulo originais, enquanto o botao interno `"Start now"` do card permanece sem esse efeito perimetral.
4. **Given** que o visitante rola ate o banner de conversao com movimento padrao ativo, **When** a secao entra no campo de visao, **Then** o container, os avatares, o texto `"Mais de +5.000 designers já estão utilizando"`, o titulo e o botao revelam-se em sequencia ordenada dentro de `0.65s` totais, e as duas malhas de pontos nos cantos exibem uma onda radial de luminancia em ciclo curto enquanto o banner permanecer visivel.
5. **Given** que o visitante ativa a preferencia de sistema para movimento reduzido antes ou durante a visita, **When** percorre toda a pagina e passa o cursor sobre logotipo, links do topo, botoes, cards de recursos, `"Start now"` e links sociais, **Then** nenhum brilho perimetral gira, nenhuma onda pulsa nas malhas e nenhum elemento sofre deslocamento, escala ou transicao animada de hover.

---

### User Story 2 - Navegacao Translucida Elevada com Menu Mobile Acessivel (Priority: P2)

Ao entrar na pagina em qualquer tamanho de tela, o visitante encontra no topo uma barra de navegacao em formato de capsula translucida integrada a paleta escura da marca. No Desktop (`1440px`), os atalhos diretos `"Recursos"`, `"Sobre"` e `"Depoimentos"` respondem com destaque fluido de foco e ponteiro sem abrir submenus vazios, ladeados pelo logotipo oficial a esquerda e pelo botao `"Comunidade"` a direita. No Mobile (`430px` e demais larguras abaixo de `1024px`), o visitante passa a contar com um controle de menu acessivel que abre e fecha os mesmos atalhos de navegacao e a acao da comunidade, permitindo ir direto a qualquer secao pelo celular ou pelo teclado.

**Why this priority**: Entrega a evolucao estrutural de prioridade `P2` (`D5`), modernizando o cabecalho e resolvendo a ausencia anterior de navegacao por ancoras em telas menores sem comprometer a abertura da pagina.

**Independent Test**: Pode ser testada em `1440px` e `430px` acionando todos os links do cabecalho por clique, toque e teclado (`Tab`, `Enter`, `Escape`), verificando a ausencia de paineis suspensos vazios, a preservacao do logotipo e do botao `"Comunidade"` e o funcionamento completo do menu mobile.

**Acceptance Scenarios**:

1. **Given** que o visitante abre a pagina em tela Desktop (`>= 1024px`), **When** interage com o cabecalho em capsula translucida, **Then** visualiza o logotipo Border-IA, os links diretos `"Recursos"`, `"Sobre"` e `"Depoimentos"` (sem setas ou paineis suspensos vazios) e o botao `"Comunidade"`, com destaque suave ao passar o cursor quando movimento padrao estiver ativo.
2. **Given** que o visitante abre a pagina em tela Mobile (`430px`, `< 1024px`), **When** aciona o botao de abertura do menu de navegacao por toque ou teclado, **Then** o painel mobile exibe os links `"Recursos"`, `"Sobre"` e `"Depoimentos"` e o acesso a `"Comunidade"`, fecha automaticamente ao selecionar uma secao ou pressionar `Escape` e devolve o foco de forma previsivel.

---

### User Story 3 - Prova Social Dinamica Protegida e Fechamento Editorial de Marca (Priority: P3)

Ao chegar ao trecho final da pagina, o visitante encontra a prova social enriquecida por uma faixa em movimento continuo de cartoes de depoimentos ilustrados com os quatro retratos reais da comunidade, seguida por um novo rodape de fechamento com feixe de luz diagonal em tons escuros e roxos da marca, a marca tipografica `"Border-IA"` em escala de destaque, os atalhos reais do projeto e o credito autoral obrigatorio `"Desenvolvido por: João Gabriel"`. Enquanto os textos definitivos de depoimentos ainda aguardam envio pelo autor, cada cartao exibe sinalizacao explicita de conteudo provisorio e o projeto mantem trava ativa contra publicacao definitiva com declaracoes ficticias.

**Why this priority**: Consolida as entregas de prioridade `P3` (`D6` e `D7`), ampliando o peso visual da prova social e do encerramento da pagina sem bloquear as entregas de maior prioridade (`P1` e `P2`) nem expor depoimentos provisorios como reais.

**Independent Test**: Pode ser testada rolando ate a secao de prova social e o rodape em `1440px` e `430px`, verificando a exibicao dos avatares locais, a pausa ou parada da faixa sob reducao de movimento, a presenca inequivoca do selo provisorio nos depoimentos, a reprovacao intencional da verificacao de liberacao publica enquanto houver texto provisorio e a fidelidade cromatica e textual do novo rodape.

**Acceptance Scenarios**:

1. **Given** que o visitante alcanca a secao de prova social com movimento padrao ativo, **When** visualiza a nova faixa de depoimentos junto ao banner `"Mais de +5.000 designers já estão utilizando"`, **Then** ve os cartoes deslizando suavemente com os avatares reais locais e identificacao visual explicita de texto provisorio em cada item ate a chegada dos depoimentos definitivos.
2. **Given** que o visitante possui preferencia de movimento reduzido ativa, **When** alcanca a faixa de depoimentos e o rodape, **Then** os cartoes de depoimento permanecem totalmente parados sem deslocamento continuo e o feixe diagonal do rodape permanece estatico.
3. **Given** que um responsavel executa a verificacao de prontidao para publicacao enquanto os depoimentos ainda estiverem sinalizados como provisorios, **When** a checagem avalia o estado da prova social, **Then** o processo indica bloqueio explicito impedindo que declaracoes provisorias sejam tratadas como aprovadas para producao publica.
4. **Given** que o visitante chega ao novo rodape em Desktop (`1440px`) ou Mobile (`430px`), **When** examina seus elementos visuais e links, **Then** visualiza fundo escuro alinhado ao restante da pagina com feixe luminoso nos tons roxos/indigo da marca, a marca tipografica `"Border-IA"` em destaque, exclusivamente os links existentes do projeto (sem colunas ficticias) e o credito exato `"Desenvolvido por: João Gabriel"`.

---

### Edge Cases

- **Alternancia de movimento reduzido em tempo real**: Se o visitante ativar a reducao de movimento com a pagina ja aberta, o percurso de borda do card, o brilho do botao principal, a onda radial nas malhas, o deslocamento da faixa de depoimentos e as animacoes de hover DEVEM cessar imediatamente, assumindo estado visual completo e estatico.
- **Dispositivos de toque sem hover (`hover: none`)**: Nos celulares e tablets sem ponteiro fino, o rastreamento luminoso de borda por cursor nos 4 cards de Recursos permanece inativo para evitar estados visuais presos apos o toque, preservando a leitura limpa dos cards.
- **Restricao de cota externa na obtencao de referencia visual**: Caso a consulta automatizada de algum componente de referencia atinja limite diario externo durante a preparacao, a implementacao DEVE preservar integralmente o comportamento visual, cromatico e acessivel especificado para o item sem comprometer a integridade das demais secoes.
- **Pausa fora do campo de visao**: Quando o banner de conversao ou a faixa de depoimentos saem da area visivel da janela, seus ciclos continuos (onda radial nas malhas e deslocamento da faixa) pausam para evitar consumo desnecessario de processamento.
- **Larguras extremas e textos provisorios no Mobile (`320px` a `430px`)**: Nem a capsula do novo cabecalho, nem a faixa de depoimentos, nem a marca tipografica monumental `"Border-IA"` no rodape podem gerar rolagem horizontal em telas estreitas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Antes de qualquer alteracao estrutural desta entrega, o projeto DEVE registrar uma linha de base auditavel de desempenho da pagina atual em modo de producao (Desktop e Mobile) para servir de referencia objetiva de comparacao ao final.
- **FR-002**: A base de componentes e estilos do projeto DEVE ser preparada para suportar os novos elementos visuais mapeando todas as cores semanticas para as escalas oficiais existentes (`Gray`, `Purple`, `Indigo`, fundo `#09090B`), tipografia `Space Grotesk` e gradiente da marca, sem descaracterizar nem quebrar as regras tipograficas e de layout ja em vigor.
- **FR-003**: Todo componente visual adicionado ou adaptado DEVE respeitar a preferencia de movimento reduzido exibindo estado final estatico (recebendo camada protetora quando nao possuir suporte proprio) e carregar sob demanda quando situado abaixo da primeira dobra ou quando adicionar peso relevante ao carregamento inicial.
- **FR-004**: Na secao do banner de conversao (`CM-10`), a entrada ao rolar a pagina DEVE revelar em sequencia ordenada o container, o grupo de avatares, o indicador de prova social, o titulo e o botao dentro da janela total de `0.65s`, e as duas malhas de pontos nos cantos DEVEM exibir uma onda radial de luminancia em ciclo curto enquanto a secao estiver visivel (permanecendo estaticas sob movimento reduzido).
- **FR-005**: Todas as seis interacoes de hover preexistentes da interface (links de navegacao do topo, escala do logotipo oficial, transicao base dos botoes de acao, elevacao dos icones nos cards de Recursos, elevacao dos links sociais do rodape e transicao do botao `"Start now"` no card do Hero) DEVEM condicionar suas transicoes e deslocamentos exclusivamente ao modo sem restricao de movimento (`D4`).
- **FR-006**: Os quatro cards da secao Recursos DEVEM exibir iluminacao de borda no gradiente roxo-indigo da marca que acompanha a posicao do cursor (`D1`), ativa somente em dispositivos com capacidade real de hover e com movimento padrao permitido, preservando a entrada escalonada da secao.
- **FR-007**: O card `"Magic copy"` no Hero DEVE exibir uma trilha luminosa percorrendo sua borda (`D2`) controlada diretamente pelo mesmo pulso temporal que ja ilumina o card na chegada do feixe vertical e no acionamento de `"Start now"`, mantendo desligado qualquer loop paralelo proprio para evitar duplicidade visual.
- **FR-008**: A variante principal em gradiente do botao de chamada para acao (aplicada ao `"Usar no Figma"` no Hero) DEVE incorporar efeito de brilho perimetral continuo (`D3`) mantendo dimensoes, cores e rotulo originais do projeto, parando completamente sob movimento reduzido e sem afetar o botao independente `"Start now"` interno ao card do Hero.
- **FR-009**: O cabecalho atual DEVE ser substituido por uma barra de navegacao em capsula translucida (`D5`) que preserve o gatilho de coreografia de abertura do topo, o logotipo oficial e o botao `"Comunidade"`, utilize apenas links diretos para `"Recursos"`, `"Sobre"` e `"Depoimentos"` (sem paineis suspensos vazios) e ofereca menu mobile expansivel e acessivel abaixo de `1024px`.
- **FR-010**: A secao do banner de conversao DEVE incorporar uma faixa continua de cartoes de depoimentos (`D6`) ilustrados com os quatro retratos locais ja existentes da comunidade, pausada fora da area visivel e totalmente estatica quando a preferencia de movimento reduzido estiver ativa, mantendo intacto o texto `"Mais de +5.000 designers já estão utilizando"`.
- **FR-011**: Enquanto os textos definitivos de depoimentos nao forem fornecidos pelo autor do projeto, cada cartao da faixa de depoimentos (`D6`) DEVE exibir marcacao visual clara de conteudo provisorio na propria interface, e o projeto DEVE dispor de verificacao automatizada de liberacao que reprove explicitamente a publicacao definitiva enquanto essa condicao persistir.
- **FR-012**: O rodape atual DEVE ser substituido pelo modelo com feixe luminoso diagonal e marca tipografica `"Border-IA"` em grande escala (`D7`), recolorido para o fundo escuro `#09090B` e tons roxos/indigo da marca, exibindo somente os links reais de navegacao e redes sociais ja previstos no projeto (sem colunas ficticias), preservando o gatilho de coreografia de entrada do rodape e mantendo obrigatoriamente o credito `"Desenvolvido por: João Gabriel"`.
- **FR-013**: Exceto pelas evolucoes visuais explicitamente aprovadas nesta especificacao (`D1` a `D7` e `CM-10`), todas as demais areas, proporcoes em Desktop (`1440px`) e Mobile (`430px`), assets locais sem URLs externas temporarias e decisoes contratuais de texto DEVEM permanecer fieis a base aprovada na entrega anterior.
- **FR-014**: O novo menu mobile do cabecalho, a faixa de depoimentos e o novo rodape DEVEM manter semantica correta de navegacao, operacao integral por teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`), foco visivel de alto contraste e ocultacao de camadas puramente decorativas para tecnologias assistivas.

### Key Entities

- **Item de Depoimento (`TestimonialItem`)**: Representa cada declaracao exibida na faixa de prova social, contendo identificador, nome de exibicao, papel/contexto, texto da citacao, referencia a um dos quatro avatares locais existentes e indicador booleano explicito de conteudo provisorio.
- **Estado de Liberacao de Prova Social (`TestimonialsReleaseGate`)**: Indicador unico e auditavel que determina se os depoimentos exibidos ja foram substituidos por textos reais aprovados pelo autor ou se permanecem bloqueados para publicacao definitiva.
- **Alvos de Coreografia Preservados (`MotionTargetContract`)**: Conjunto de marcadores estruturais nas secoes (`header`, `feat-card`, subelementos sequenciais de `banner` e `footer`) que garantem continuidade entre os novos componentes visuais e a orquestracao de abertura e rolagem da pagina.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em verificacao comparativa nas larguras de referencia Desktop (`1440px`) e Mobile (`430px`) e na largura minima (`320px`), `0` secoes apresentam quebra de alinhamento ou rolagem horizontal, e `100%` das diferencas visuais em relacao as telas originais restringem-se aos itens aprovados (`CM-10` e `D1` a `D7`).
- **SC-002**: Com a preferencia de sistema para movimento reduzido ativada (no carregamento inicial ou alternada com a pagina aberta), `0` elementos exibem brilho perimetral em movimento, percurso de borda, onda luminosa nas malhas, deslocamento da faixa de depoimentos ou animacao/deslocamento de hover nos controles auditados.
- **SC-003**: A nota auditada de desempenho de carregamento da pagina em modo de producao permanece igual ou superior a `90` (`>= 90`), avaliada diretamente contra a linha de base registrada antes do inicio das alteracoes.
- **SC-004**: Na secao do banner de conversao com movimento padrao ativo, os `5` subelementos (container, avatares, prova social, titulo e botao) completam sua revelacao sequencial em `0.65s` totais, acompanhados pela onda radial visivel nas duas malhas de canto enquanto a secao permanece na tela.
- **SC-005**: Em telas menores que `1024px` (incluindo `430px`), `100%` dos atalhos de secao (`"Recursos"`, `"Sobre"`, `"Depoimentos"`) e o acesso a `"Comunidade"` podem ser alcancados e acionados a partir do novo menu do cabecalho tanto por toque quanto exclusivamente por teclado.
- **SC-006**: Enquanto os depoimentos reais nao forem inseridos, `100%` dos cartoes na faixa de prova social exibem rotulo visivel de conteudo provisorio e a verificacao de prontidao para publicacao encerra com status de bloqueio (`100%` de deteccao de pendencia antes de publicacao publica).
- **SC-007**: `100%` das regras contratuais de texto e autoria permanecem integras na interface renderizada: `"Mais de +5.000 designers já estão utilizando"` no banner, texto corrigido no card de avatar, `"Desenvolvido por: João Gabriel"` no novo rodape e zero caracteres de travessao longo em todo o projeto.

## Assumptions

- **Premissa A-01 (Escopo do botao com brilho perimetral D3)**: O brilho perimetral animado aplica-se exclusivamente a variante primaria em gradiente do componente padrao de chamada para acao (usada no `"Usar no Figma"` do Hero); o botao demonstrativo `"Start now"` dentro do card `"Magic copy"` possui papel funcional proprio e permanece fora de `D3`, recebendo apenas a guarda de movimento reduzido de `D4`.
- **Premissa A-02 (Simplificacao de navegacao em D5 e D7)**: Como o produto possui uma unica pagina com tres ancoras internas e tres redes sociais externas, paineis suspensos multi-coluna no cabecalho e colunas extras institucionais/legais no rodape dos modelos de referencia sao suprimidos para exibir apenas links reais e funcionais.
- **Premissa A-03 (Bloqueio de publicacao sem quebrar build de performance)**: Para permitir medicao real de desempenho em modo de producao local (requisito do portao `>= 90`) e ao mesmo tempo impedir publicacao acidental de depoimentos ficticios, o bloqueio de `D6` combina aviso visual explicito na interface com um comando verificador dedicado de liberacao (`verify:release`) que falha enquanto a prova social estiver marcada como provisoria.
- **Premissa A-04 (Contingencia de obtencao dos componentes de referencia)**: Na ausencia de chave dedicada de linha de comando no ambiente do agente implementador, a obtencao prioriza a ferramenta de catalogo disponivel por ordem `P1 -> P2 -> P3` e, caso algum item sofra limite diario de cota, admite construcao local fiel ao contrato visual e de movimento definido no plano tecnico.
