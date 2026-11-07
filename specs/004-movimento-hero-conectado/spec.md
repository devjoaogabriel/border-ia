# Feature Specification: Movimento Conectado no Hero (Bounce da Janela, Feixe Flexivel e Hover 3D no Card)

**Feature Branch**: `004-movimento-hero-conectado` (mantido na branch `main` por regra de governanca do projeto)

**Created**: 2026-11-07

**Status**: Approved Scope (Handoff 04 atualizado com decisao confirmada pelo Joao)

**Input**: User description: "Adicionar um bounce effect sutil sobre a janela interface-figma para integrar-se ao movimento do Hero, tornar a linha do feixe conectada ao card com movimento fisico realista acompanhando o ponto de contato, e mudar a inclinacao 3D do card Magic copy exclusivamente para o hover do mouse com retorno em bounce ao sair, removendo o arraste com clique."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inclinacao 3D do Card por Hover do Mouse com Retorno Elastico (Priority: P1)

Em um computador com mouse ou trackpad preciso e movimento padrao ativo, o visitante passa o cursor sobre o card `"Magic copy"` no Hero sem precisar clicar nem segurar nenhum botao. Assim que o ponteiro entra na area do card, o balanco autonomo em repouso cede lugar suavemente (sem pulo de angulo) a uma inclinacao tridimensional em perspectiva que acompanha a posicao do cursor nas quatro direcoes dentro de limites confortaveis para leitura continua, mantendo o card preso ao seu lugar no layout e preservando a clicabilidade estavel do botao `"Start now"`. Quando o cursor sai da area do card, o cartao retorna ao centro com efeito elastico (`bounce`) e retoma sem tranco o ciclo sutil de balance.

**Why this priority**: Atende diretamente a mudanca principal de interacao pedida pelo autor (trocar a necessidade de pressionar e arrastar pela resposta imediata ao hover do mouse) e define os angulos em tempo real que alimentam a conexao fisica da linha do feixe na historia seguinte.

**Independent Test**: Pode ser testada isoladamente em Desktop (`1440px`) movendo o cursor para dentro, ao redor das quatro bordas, sobre o botao `"Start now"` e para fora do card, verificando ausencia de salto na entrada, acompanhamento 3D calibrado, cliques perfeitos no botao, bounce ao sair e retomada fluida do balance.

**Acceptance Scenarios**:

1. **Given** que o visitante utiliza um dispositivo com ponteiro preciso e movimento padrao ativo, **When** move o cursor para dentro do card `"Magic copy"` e o desloca para cima, baixo, esquerda ou direita sem pressionar nenhum botao, **Then** o card transita suavemente do angulo instantaneo do balance para a inclinacao 3D correspondente ao cursor (limitada a ate `10°` no eixo vertical e `12°` no eixo horizontal, sem alterar a escala nem deslocar o card do lugar) e sem exigir cursor de agarrar.
2. **Given** que o card esta inclinado acompanhando o hover do mouse, **When** o cursor deixa a area do card, **Then** o card retorna a pose neutra `(0°, 0°, 0°)` com efeito elastico amortecido (`bounce`) em cerca de `0.85s` e emenda na sequencia no ciclo continuo de balance (`5.6s`) sem salto visual.
3. **Given** que o visitante leva o cursor ate o botao `"Start now"` dentro do card, **When** repousa o ponteiro sobre o botao e clica repetidamente, **Then** a inclinacao do card atenua-se suavemente para manter o alvo firme sob o cursor, o ponteiro exibe cursor de clique padrao de botao e `100%` dos cliques acionam o feedback demonstrativo do card.
4. **Given** que o emblema tridimensional no topo esquerdo do card tambem responde sutilmente ao ponteiro, **When** o visitante percorre o card em hover, **Then** a rotacao interna do emblema permanece contida (`<= 4.5°`) para compor profundidade sem somar movimento excessivo com a inclinacao do card.

---

### User Story 2 - Linha do Feixe Fisicamente Conectada ao Movimento do Card (Priority: P2)

Ao observar o Hero em Desktop (`1440px`) tanto durante o balance autonomo em repouso quanto durante a inclinacao do card pelo hover do mouse ou no bounce de saida, o visitante ve o feixe luminoso vertical comportar-se como um fio de energia flexivel preso ao topo da secao e plugado na borda superior do card. Quando o card inclina em qualquer direcao, o topo do feixe permanece fixo no alto enquanto sua metade inferior curva-se suavemente com leve inercia e amortecimento acompanhando o ponto de contato no topo do card, sem abrir vao escuro em nenhum angulo e mantendo o pulso luminoso periodico percorrendo exatamente o interior da linha curva ate iluminar o card.

**Why this priority**: Concretiza a segunda mudanca central pedida pelo autor para o conjunto feixe-card, transformando uma linha estatica independente em uma conexao fisica viva e crivel entre o topo do Hero e o card 3D.

**Independent Test**: Pode ser testada em Desktop (`1440px`) observando o feixe durante o balance em repouso, movendo o mouse entre os extremos esquerdo, direito, superior e inferior do card e tirando o mouse rapidamente para ver o bounce: a linha curva-se com leve atraso elastico, o pulso luminoso segue o mesmo trajeto curvo sem descolar da linha e o ponto de encontro no topo do card mantem `0px` de fresta.

**Acceptance Scenarios**:

1. **Given** que o visitante visualiza o Hero em Desktop (`1440px`) com movimento padrao ativo, **When** o card oscila no balance em repouso ou inclina ate os limites de hover (`±10°` vertical e `±12°` horizontal), **Then** a extremidade superior do feixe permanece imovel enquanto o corpo inferior e a ponta conectada ao topo do card curvam-se de forma continua com leve inercia amortecida, mantendo `0px` de fresta visivel na borda superior do card.
2. **Given** que o card esta inclinado (curvando a linha do feixe) no momento em que o pulso periodico de energia desce pelo feixe, **When** o pulso percorre do topo ate o card, **Then** o rastro luminoso acompanha exatamente a curvatura instantanea da linha (sem seguir uma reta descolada por fora) e acende o brilho interno do card no instante de chegada.
3. **Given** que o visitante retira rapidamente o cursor do card provocando o bounce elastico de retorno, **When** o card oscila ate estabilizar no centro, **Then** a linha conectada acompanha e amortece essa oscilacao como um fio flexivel antes de assentar no movimento sutil do balance.

---

### User Story 3 - Bounce Sutil na Janela da Interface Figma e Coesao Multi-Dispositivo (Priority: P3)

Tanto em Desktop (`1440px`) quanto em Mobile (`430px`, incluindo navegadores de iPhone), o visitante percebe que a grande janela ilustrativa da interface do Figma atras do card deixou de parecer uma imagem estatica isolada: ela exibe um movimento vertical sutil e continuo de flutuacao elastica (`bounce` suave) em segundo plano, harmonizado com sua revelacao de entrada e com o parallax de rolagem existente, sem competir visualmente com o card em primeiro plano, sem revelar bordas recortadas, sem abrir rolagem lateral, sem atrasar nem encarecer o carregamento principal no celular e respeitando integralmente pausa fora da tela e movimento reduzido.

**Why this priority**: Integra o maior elemento grafico de fundo a linguagem viva do Hero sem prejudicar o protagonismo do card nem a performance critica em dispositivos moveis.

**Independent Test**: Pode ser testada em Desktop (`1440px`) e Mobile (`430px`, motores Chromium e WebKit) verificando o movimento vertical sutil da janela combinado sem conflito com a rolagem da pagina, ausencia de cortes visiveis nas laterais ou na base mascarada, rolagem por toque intacta no celular, desligamento completo sob movimento reduzido e manutencao do desempenho Mobile.

**Acceptance Scenarios**:

1. **Given** que o visitante abre o Hero em Desktop (`1440px`) ou Mobile (`430px`) com movimento padrao ativo, **When** a animacao inicial de entrada conclui e a pagina permanece em repouso ou e rolada verticalmente, **Then** a janela da interface do Figma executa uma flutuacao vertical continua e sutil (`±6px` no Desktop e `±4px` no Mobile em ciclos suaves de `4.8s`) que soma-se sem conflito ao deslocamento de rolagem existente e permanece visualmente subordinada ao card em primeiro plano.
2. **Given** que o visitante acessa a pagina em um celular (`430px`, incluindo WebKit/iPhone), **When** observa o Hero e desliza o dedo para rolar a pagina, **Then** o movimento da janela nao expoe cortes duros na mascara inferior nem nas laterais, nao cria barra de rolagem horizontal, o card mantem apenas seu balance sutil sem prender o toque e a janela nao sofre piscadas nem sobreposicao incorreta com o card.
3. **Given** que a preferencia de sistema para movimento reduzido esta ativa (no carregamento inicial ou ativada em tempo real), **When** o visitante visualiza ou interage com o Hero, **Then** a janela da interface do Figma, a linha do feixe (reta em sua posicao original) e o card `"Magic copy"` permanecem `100%` estaticos e planos, sem balance, sem hover 3D e sem bounce.
4. **Given** que o visitante rola a pagina ate que a secao Hero saia completamente da area visivel, **When** permanece nas secoes inferiores, **Then** o movimento da janela, a fisica da linha/feixe e o balance do card ficam simultaneamente pausados ate que o Hero volte a entrar em tela.

---

### Edge Cases

- **Reentrada rapida do cursor durante o bounce de saida do card**: Se o visitante tirar o mouse do card e voltar a entrar antes do termino dos `0.85s` de bounce, o retorno elastico DEVE ser interrompido imediatamente e a inclinacao DEVE convergir suavemente a partir do angulo atual para a nova posicao do cursor, sem salto nem tremida na linha do feixe.
- **Entrada do cursor pelas quinas extremas do card**: Ao cruzar a borda do card diretamente por um canto (onde o alvo angular ja e proximo ao limite de `10°` / `12°`), a transicao inicial DEVE amortecer a chegada ao angulo alvo sem dar chicote abrupto em um unico quadro.
- **Perda de foco da janela (`blur`) ou rolagem sob cursor parado**: Se o card estiver inclinado em hover e o usuario alternar de aplicativo (`blur`) ou a janela sair da tela, o card e a linha DEVEM retornar suavemente ao estado neutro/pausado sem ficarem travados tortos.
- **Renderizacao em WebKit (Safari / iPhone)**: A combinacao de mascara de transparencia na janela do Figma, recorte do container Mobile, gradiente vertical da linha em `0°` e perspectiva 3D do card DEVE renderizar sem sumico da linha reta, sem serrilhado/corte de camada 3D contra a janela de fundo e sem repintura cara de mascara a cada quadro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Por decisao do autor, o arraste com clique DEVE ser removido e, em dispositivos com ponteiro preciso (`hover` e ponteiro fino disponiveis) com movimento padrao permitido, o card `"Magic copy"` DEVE inclinar-se em perspectiva 3D (`rotateX` e `rotateY`, mantendo sua posicao fixa no layout e escala `1.0`) exclusivamente em resposta a movimentacao do cursor em `hover` sobre sua area.
- **FR-002**: Os limites maximos de inclinacao em hover do card DEVEM ser calibrados em `±10°` no eixo vertical e `±12°` no eixo horizontal com amortecimento progressivo nos extremos, transicionando a partir do angulo instantaneo do balance na entrada do cursor sem salto visual e retornando a `(0°, 0°, 0°)` ao sair do card com efeito elastico (`bounce`) de aproximadamente `0.85s` antes de retomar o ciclo de balance (`5.6s`) sem tranco.
- **FR-003**: O card NAO DEVE exibir cursor de agarrar (`grab`/`grabbing`); sobre o botao `"Start now"`, o cursor DEVE permanecer o indicador padrao de clique, a inclinacao de hover DEVE atenuar-se suavemente para preservar estabilidade do alvo e `100%` dos cliques DEVEM acionar normalmente o pulso demonstrativo do card.
- **FR-004**: A amplitude maxima de resposta ao ponteiro do emblema 3D interno do card DEVE ser reduzida para ate `4.5°` (em vez de `8°`), evitando soma exagerada de movimento quando combinada a inclinacao de hover do proprio card.
- **FR-005**: Em Desktop (`>= 1024px`) com movimento padrao ativo, a linha vertical do feixe do Hero DEVE manter sua extremidade superior fixa no ponto original e conectar sua extremidade inferior ao ponto de contato projetado na borda superior do card (com margem oculta atras do topo opaco do card), curvando-se de forma continua e realista com leve inercia e amortecimento sempre que o card oscilar no balance, inclinar no hover ou retornar em bounce, sem abrir fresta visivel em nenhum angulo.
- **FR-006**: O pulso luminoso periodico que desce pelo feixe do Hero DEVE percorrer exatamente a mesma trajetoria curva instantanea da linha conectada ate tocar o card e acender seu brilho interno, nunca deslocando-se em linha reta separada da linha visivel, e a linha DEVE permanecer plenamente visivel mesmo quando perfeitamente vertical (`0°` de curvatura).
- **FR-007**: A janela ilustrativa da interface do Figma no Hero DEVE exibir uma flutuacao vertical continua e sutil com carater elastico suave (`±6px` em Desktop e `±4px` em Mobile, periodo de `4.8s`, iniciada apos a conclusao da entrada inicial e sem deslocamento lateral nem rotacao), aplicada em camada independente para nao conflitar com a animacao de entrada nem com o parallax de rolagem existente (`-28px`) e sem competir visualmente com o card.
- **FR-008**: A flutuacao da janela da interface do Figma DEVE preservar intacta a mascara de fade inferior sem provocar re-rasterizacao da mascara a cada quadro, sem expor bordas cortadas no container Mobile, sem gerar rolagem horizontal e sem atrasar a pintura inicial do maior elemento visual da dobra no Mobile.
- **FR-009**: Em dispositivos de toque sem ponteiro fino (celulares e tablets), a inclinacao por hover do card DEVE permanecer inativa, mantendo no Mobile o balance sutil continuo do card (`5.6s`), a flutuacao vertical sutil da janela (`±4px`) e a rolagem vertical por toque (`pan-y`) completamente livre sobre toda a secao.
- **FR-010**: Sob preferencia de sistema para movimento reduzido (ativa no carregamento inicial ou alternada em tempo real), a flutuacao da janela do Figma, a curvatura dinamica e o pulso do feixe, o balance do card, a inclinacao de hover e o bounce de saida DEVEM ficar `100%` desativados, mantendo janela, linha reta original e card completamente planos e estaticos.
- **FR-011**: Todos os loops continuos do Hero (flutuacao da janela do Figma, fisica e renderizacao do feixe conectado, balance do card e emblema 3D) DEVEM pausar automaticamente sempre que seus respectivos containers sairem da area visivel da tela e retomar apenas ao voltarem ao campo de visao.
- **FR-012**: A entrega NAO DEVE adicionar novas dependencias ao projeto, NAO DEVE degradar a pontuacao atual de performance Mobile em relacao a medicao previa na branch `main` e DEVE preservar intactos o brilho aprovado no `H1`, o oval de `"interfaces"`, o rabisco de `"Border-IA"` e a logo principal, funcionando de forma consistente tanto em Chromium quanto em WebKit.

### Key Entities

- **Estado de Hover e Balance do Card (`CardHoverTiltState`)**: Conjunto de orientacao instantanea (`rotationX`, `rotationY`, `rotation`) e modo ativo (`balancing`, `hovering`, `rebounding`) do card `"Magic copy"`, lido em tempo real pela linha do feixe sem provocar re-renderizacoes de interface.
- **Curva Fisica do Feixe (`ConnectedBeamCurve`)**: Geometria curva ancorada no topo fixo do feixe e no ponto projetado de contato no topo do card, governada por um ponto de controle intermediario com mola amortecida que sincroniza simultaneamente o traco vetorial visivel e o rastro do pulso luminoso.
- **Camada de Flutuacao da Janela (`FigmaWindowBounceLayer`)**: Envoltorio intermediario dedicado exclusivamente a oscilacao vertical continua (`±6px` Desktop / `±4px` Mobile), isolado tanto do container externo de entrada/parallax quanto da imagem interna mascarada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em Desktop (`1440px`) com ponteiro preciso, `100%` das entradas de cursor sobre o card iniciam a inclinacao 3D sem exigir clique e com `0` saltos bruscos de angulo, mantendo a inclinacao dentro de `±10°` vertical e `±12°` horizontal, `100%` dos cliques em `"Start now"` funcionais e retorno em bounce (`~0.85s`) ao retirar o cursor.
- **SC-002**: Em Desktop (`1440px`), durante todo o balance, hover nos quatro cantos e bounce de saida, o feixe mantem `0px` de fresta visivel no topo do card e `0px` de descolamento entre a linha curva e o rastro do pulso luminoso, inclusive com a linha perfeitamente visivel em repouso vertical (`0°`) tanto em Chromium quanto em WebKit.
- **SC-003**: Em Desktop (`1440px`) e Mobile (`430px`, Chromium e WebKit), a janela da interface do Figma executa flutuacao vertical sutil (`<= 6px` no Desktop, `<= 4px` no Mobile) sem conflitar com o parallax de rolagem, sem revelar cortes na mascara inferior ou nas laterais e com `0px` de rolagem horizontal excedente.
- **SC-004**: Com preferencia de movimento reduzido ativa, `0` animacoes continuas ou reativas ocorrem na janela, na linha do feixe ou no card; e com a secao Hero fora da tela, `100%` dos loops continuos do Hero permanecem pausados.
- **SC-005**: A mediana de 3 medicoes de performance Mobile (e Desktop) apos a implementacao mantem nota igual ou superior a medicao de referencia colhida antes da mudanca na branch `main` (referencia atual Mobile em torno de `63`), com validacao estatica e build de producao concluidos com `0` erros e `0` novas dependencias.

## Assumptions

- **Premissa A-01 (Interpretacao do bounce na janela interface-figma)**: Para que a janela deixe de parecer estatica mesmo quando o visitante para de rolar a pagina (inclusive no celular, onde nao ha ponteiro), o efeito de bounce da janela e definido como uma flutuacao vertical continua, elastica e de baixa amplitude (`±6px` Desktop / `±4px` Mobile em `4.8s`), subordinada ao protagonismo 3D do card em primeiro plano.
- **Premissa A-02 (Feixe permanece exclusivo do Desktop)**: Seguindo fielmente o design aprovado no Figma (onde o feixe vertical existe apenas no frame Desktop `1440px` e nao existe no frame Mobile `430px`), a linha conectada ao card atua em viewports Desktop (`>= 1024px`), enquanto o Mobile exibe o bounce da janela e o balance sutil do card.
