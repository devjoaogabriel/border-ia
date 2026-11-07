# Feature Specification: Balance Sutil e Arraste 3D com Retorno Elastico no Card Magic Copy

**Feature Branch**: `003-card-balance-3d` (mantido na branch `main` por regra do projeto)

**Created**: 2026-11-06

**Status**: Approved Scope (Handoff 03)

**Input**: User description: "Adicionar ao card Magic copy do Hero um efeito de balance sutil continuo em repouso e possibilitar movimenta-lo em escala 3D (inclinacao em perspectiva sem sair do lugar) ao pressionar o mouse sobre o card e arrastar para cima, baixo ou lados, retornando com bounce ao soltar e retomando o balance original, sem novas dependencias e respeitando feixe, Start now, toque mobile, scroll suave, pausa fora de tela, acessibilidade e movimento reduzido."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Balance Tridimensional Sutil em Repouso com Ancoragem no Feixe (Priority: P1)

Um visitante que abre a pagina do Border-IA em Desktop (`1440px`) ou Mobile (`430px`) com configuracao padrao de movimento percebe que o card `"Magic copy"` no Hero possui presenca fisica viva: em repouso, o cartao executa um balanco tridimensional sutil, lento e continuo em perspectiva, sem sair de sua posicao fixa no layout e sem descolar do feixe vertical de luz roxa que toca sua borda superior. Todos os elementos internos do card (emblema tridimensional, titulo, prompt, indicador `"Generating..."`, brilho de chegada do feixe e botao `"Start now"`) permanecem nitidos, recortados dentro das bordas arredondadas e funcionando em harmonia. Quando o visitante rola a pagina para as secoes inferiores e o card sai da tela, o balanco pausa para poupar processamento e retoma suavemente ao voltar para o topo.

**Why this priority**: Entrega a camada visual imediata visivel para 100% dos visitantes em Desktop e Mobile logo na abertura do Hero, resolvendo desde a base o palco de perspectiva, a uniao sem fresta com o feixe superior e a pausa fora de tela.

**Independent Test**: Pode ser testada isoladamente abrindo o Hero em `1440px` e `430px`, observando um ciclo completo de `5.6s` do balance em repouso, inspecionando o ponto de contato entre o feixe vertical e o topo do card (zero fresta visivel) e verificando que a animacao pausa ao rolar ate o rodape e retoma ao voltar ao Hero.

**Acceptance Scenarios**:

1. **Given** que o visitante abre o Hero em Desktop (`1440px`) ou Mobile (`430px`) com movimento padrao ativo, **When** observa o card `"Magic copy"` sem interagir com ele, **Then** o card oscila continuamente de forma sutil em perspectiva (`±2.0°` no eixo vertical, `±2.8°` no eixo horizontal e `±0.6°` de inclinacao planar ao longo de um ciclo de `5.6s`), mantendo sua posicao fixa no layout e a escala reduzida prevista no Mobile.
2. **Given** que o visitante observa o encontro entre o feixe luminoso vertical e a borda superior do card no Desktop, **When** o card inclina durante o balance ou atinge seu angulo maximo, **Then** o feixe permanece visualmente conectado ao topo do card sem abrir vao escuro entre os dois elementos, mantendo em repouso a mesma aparencia do layout aprovado.
3. **Given** que o visitante rola a pagina ate que o card `"Magic copy"` saia completamente da area visivel da janela, **When** permanece nas secoes inferiores e depois retorna ao topo, **Then** o ciclo de balance fica pausado enquanto fora de tela e retoma suavemente assim que o card volta a ficar visivel.

---

### User Story 2 - Inclinacao 3D por Pressionar e Arrastar com Retorno Elastico (Priority: P2)

Em um computador com mouse ou trackpad preciso, o visitante posiciona o cursor sobre o card `"Magic copy"`, pressiona o botao principal do ponteiro e arrasta para cima, para baixo, para a esquerda ou para a direita. Imediatamente apos cruzar o limiar minimo de arraste, o balance autonomo cede controle a mao do visitante e o card inclina-se em perspectiva tridimensional acompanhando a direcao do arraste com resistencia progressiva nos limites, permanecendo ancorado em seu lugar na tela e sem selecionar textos internos por acidente. Ao soltar o botao do ponteiro em qualquer posicao (dentro ou fora do card), o cartao retorna ao plano central com um movimento elastico amortecido (`bounce`) e emenda novamente no balance sutil sem tranco visual, preservando intacto o funcionamento do botao `"Start now"`.

**Why this priority**: Concretiza a interacao tatil 3D solicitada pelo autor (pressionar, arrastar nas quatro direcoes, soltar com bounce e retomar o balance) sobre a base de perspectiva e feixe estabelecida na historia `P1`.

**Independent Test**: Pode ser testada pressionando e arrastando o card nas quatro direcoes cardeais e nas diagonais em Desktop (`1440px`), soltando o ponteiro dentro e fora da janela para conferir o bounce e a retomada sem salto do balance, e clicando repetidamente em `"Start now"` para comprovar ausencia de interferencia.

**Acceptance Scenarios**:

1. **Given** que o visitante utiliza um dispositivo com ponteiro preciso e movimento padrao ativo, **When** pressiona sobre a superficie do card (fora do botao `"Start now"`) e arrasta por `6px` ou mais para cima, baixo, esquerda ou direita, **Then** o balance em repouso pausa e o card inclina-se em perspectiva 3D acompanhando o ponteiro ate o limite amortecido de `±14°` vertical e `±16°` horizontal (com leve destaque de escala `1.015x`), sem deslocar sua coordenada espacial na pagina e sem selecionar texto.
2. **Given** que o visitante esta inclinando o card durante um arraste ativo, **When** solta o botao do mouse (mesmo com o cursor fora da area do card), **Then** o card retorna ao alinhamento neutro `(0°, 0°, 0°)` com efeito elastico de mola ao longo de `0.9s` e, ao concluir o retorno, retoma o ciclo de balance continuo a partir do centro sem salto abrupto de angulo.
3. **Given** que o visitante deseja testar a acao demonstrativa do card, **When** clica diretamente sobre o botao `"Start now"` (mesmo com pequeno deslocamento involuntario do ponteiro sobre o botao) ou realiza um clique rapido no card menor que `6px`, **Then** nenhum arraste 3D e iniciado e o pulso demonstrativo de `"Start now"` dispara normalmente em todas as tentativas.

---

### User Story 3 - Protecao de Rolagem no Celular, Movimento Reduzido e Acessibilidade (Priority: P3)

Um visitante que acessa a pagina pelo celular (`430px`), navega exclusivamente por teclado ou utiliza a preferencia de sistema para movimento reduzido encontra uma experiencia previsivel e sem barreiras: no celular, deslizar o dedo verticalmente sobre o card rola a pagina sem qualquer bloqueio ou disputa com a rolagem suave; sob movimento reduzido, o card permanece completamente plano e estatico (sem balance, sem arraste 3D e sem bounce); e por teclado, o foco e o acionamento de `"Start now"` continuam diretos e inalterados.

**Why this priority**: Garante que o efeito tatil decorativo nunca degrade a rolagem mobile, a rolagem suave da pagina, o conforto vestibular de quem pede reducao de movimento nem a navegacao acessivel por teclado.

**Independent Test**: Pode ser testada em `430px` simulando gestos verticais de toque diretamente sobre o card para rolar a pagina, ativando e desativando a preferencia de movimento reduzido em tempo real e percorrendo o Hero com `Tab` e `Enter`.

**Acceptance Scenarios**:

1. **Given** que o visitante navega em uma tela de toque (`430px`), **When** apoia o dedo sobre o card `"Magic copy"` e desliza para cima ou para baixo para ler o restante da pagina, **Then** a rolagem vertical da pagina responde livremente sem ser capturada ou travada pelo card.
2. **Given** que o visitante possui preferencia de sistema para movimento reduzido ativa (no carregamento inicial ou ativada durante o uso), **When** visualiza o card ou tenta pressiona-lo e arrasta-lo, **Then** o card permanece totalmente plano e imovel (`0°` nos tres eixos, sem balance, sem inclinacao de arraste e sem bounce), mantendo `"Start now"` funcional.
3. **Given** que o visitante navega pela pagina usando apenas o teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`), **When** atravessa a secao Hero, **Then** o card nao cria paradas extras de foco para o gesto decorativo de arraste e o botao `"Start now"` preserva seu anel de foco visivel e seu acionamento imediato.

---

### Edge Cases

- **Arraste rapido interrompido durante o bounce**: Se o visitante soltar o card e voltar a pressiona-lo e arrasta-lo no meio da animacao elastica de `0.9s`, o retorno anterior DEVE ser cancelado imediatamente sem conflito de interpolacao, assumindo de forma suave a nova inclinacao comandada pelo ponteiro.
- **Saida do ponteiro da janela (`pointerup` externo / `pointercancel` / perda de foco da janela `blur`)**: Se o visitante arrastar ate fora da janela do navegador ou alternar de aplicativo antes de soltar, a liberacao ou perda de captura DEVE acionar normalmente o retorno elastico ao centro, nunca deixando o card travado torto.
- **Escala reduzida abaixo de `1024px` (`scale-[0.885]` com `origin-top-right`)**: Em janelas estreitas de computador com mouse (`< 1024px`), tanto a projecao de perspectiva quanto a sensibilidade do arraste DEVEM respeitar as dimensoes renderizadas reais do card escalado sem distorcer o recorte arredondado nem achatar o efeito 3D.
- **Simultaneidade com `beamPulse` e `"Start now"`**: Quando o pulso periodico do feixe acende o brilho interno do card durante um arraste ou durante o balance, ambos os efeitos convivem sem reiniciar nem travar um ao outro.
- **Uso da roda do mouse (`wheel`) durante o arraste**: Girar a roda de rolagem enquanto o card estiver inclinado nao deve travar a rolagem suave da pagina nem corromper o retorno do card quando o ponteiro for solto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Por decisao do autor, "movimentar em escala 3D" DEVE ser implementado exclusivamente como inclinacao tridimensional em perspectiva nos eixos vertical e horizontal (`rotateX` e `rotateY`, com angulo limitado e leve componente planar apenas no balance), mantendo o card fixo em seu lugar original no layout sem desloca-lo pela tela.
- **FR-002**: Em repouso e com movimento padrao permitido, o card `"Magic copy"` DEVE executar um ciclo continuo e sutil de balance tridimensional com periodo total de `5.6s`, iniciando e encerrando na pose neutra `(0°, 0°, 0°)` e atingindo amplitudes maximas de `±2.0°` no eixo vertical, `±2.8°` no eixo horizontal e `±0.6°` no eixo planar.
- **FR-003**: Em dispositivos com ponteiro preciso (`hover` e ponteiro fino disponiveis) e movimento padrao permitido, pressionar o botao principal do mouse sobre o card e arrastar a partir do limiar minimo DEVE pausar o balance, inclinar o card nas quatro direcoes acompanhando o ponteiro com amortecimento progressivo ate `±14°` no eixo vertical e `±16°` no eixo horizontal (aplicando leve escala tatil de `1.015x`) e, ao soltar ou perder a captura do ponteiro, retornar a `(0°, 0°, 0°)` e escala `1.0` com efeito elastico (`bounce`) de `0.9s`, retomando em seguida o ciclo de balance a partir da pose neutra sem salto visual.
- **FR-004**: A diferenciacao entre clique e arraste DEVE adotar limiar minimo de `6px` de deslocamento do ponteiro, e o gesto de arraste NAO DEVE iniciar quando o pressionamento ocorrer sobre o botao `"Start now"` (nem sobre qualquer controle interativo interno), garantindo que cliques em `"Start now"` funcionem em 100% das tentativas sem interferencia.
- **FR-005**: O ponto de encontro entre a base do feixe luminoso vertical do Hero e a borda superior do card no Desktop DEVE incluir margem oculta de sobreposicao (`20px` posicionados atras do corpo opaco do card, mantendo identica a extensao visivel do feixe em repouso), impedindo a abertura de qualquer fresta ou vao visivel mesmo sob a inclinacao maxima de `±14°` / `±16°`.
- **FR-006**: A perspectiva tridimensional (`900px`) DEVE ser aplicada em um envoltorio de palco dedicado imediatamente externo ao corpo recortado (`overflow-hidden`) do card, preservando o recorte das sombras internas e funcionando de forma consistente tanto na escala `1.0` do Desktop (`>= 1024px`) quanto dentro do container pai escalado em `0.885` (`origin-top-right`) abaixo de `1024px`.
- **FR-007**: O balance, o arraste 3D e o bounce DEVEM coexistir sem quebrar nem amplificar de forma excessiva os efeitos ja presentes no card: a inclinacao sutil do emblema 3D interno, o giro continuo do icone ao lado de `"Generating..."`, a timeline periodica do pulso do feixe que acende o brilho interno e o feedback do botao `"Start now"`.
- **FR-008**: Em dispositivos de toque sem ponteiro fino (celulares e tablets), o arraste interativo 3D do card DEVE permanecer desativado e a superficie do card DEVE preservar integralmente a acao nativa de rolagem vertical por toque, impedindo que o usuario fique preso ao deslizar o dedo sobre o card.
- **FR-009**: Durante o arraste com mouse no Desktop, o card DEVE impedir selecao acidental de texto interno, exibir cursor visual condizente com agarrar/arrastar e operar sem disputar eventos de rolagem com o controlador de scroll suave da pagina.
- **FR-010**: Quando a preferencia de sistema para movimento reduzido estiver ativa (no carregamento inicial ou alternada em tempo real), o balance continuo, o arraste 3D e o retorno com bounce DEVEM ficar completamente desligados, mantendo o card plano, estatico e sem cursores de arraste.
- **FR-011**: O ciclo continuo de balance em repouso DEVE pausar automaticamente sempre que o card sair da area visivel da janela e retomar apenas quando o card estiver visivel e fora de estado de arraste ou retorno elastico.
- **FR-012**: O gesto de arraste 3D DEVE ser tratado como puramente decorativo, sem adicionar tab stops extras, sem alterar o papel semantico do grupo demonstrativo e mantendo inalterados o foco visivel e a operacao por teclado do botao `"Start now"`.
- **FR-013**: A implementacao NAO DEVE adicionar novas dependencias ao projeto e DEVE preservar intactos todos os demais elementos da branch `main`, incluindo o brilho animado ja aprovado no titulo principal `H1`, o oval de `"interfaces"` e o rabisco de `"Border-IA"`.

### Key Entities

- **Configuracao Fisica do Card (`CardTiltPhysicsConfig`)**: Conjunto imutavel de parametros calibrados do efeito: distancia de perspectiva (`900px`), amplitudes e periodo do balance (`±2.0°`, `±2.8°`, `±0.6°`, `5.6s`), limiar de arraste (`6px`), limites angulares amortecidos (`±14°`, `±16°`), escala de captura (`1.015`) e duracao/curva elastica de retorno (`0.9s`).
- **Estado de Interacao do Card (`CardTiltInteractionState`)**: Maquina de estados mutuamente exclusivos que governa a inclinacao do card entre `static` (movimento reduzido ou fora de tela), `balancing` (repouso visivel), `dragging` (ponteiro de mouse capturado apos `6px`) e `rebounding` (retorno elastico de `0.9s` ate `(0°, 0°, 0°)` antes de voltar a `balancing`).
- **Ancoragem Feixe-Card (`BeamOverlapSeam`)**: Sobreposicao geometrica oculta (`20px`) entre a extremidade inferior do feixe do Hero e a face traseira do topo opaco do card para absorver a retracao aparente de perspectiva durante inclinacoes 3D.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em Desktop (`1440px`) e Mobile (`430px`) com movimento padrao ativo, o card executa o balance continuo em ciclos regulares de `5.6s` dentro dos limites sutis definidos (`<= 2.8°` em repouso) sem deslocar sua posicao no layout e com `0px` de fresta visivel entre o feixe superior e o topo do card em qualquer angulo permitido (ate `14°` vertical e `16°` horizontal).
- **SC-002**: Em Desktop com mouse, `100%` dos arrastes iniciados fora do botao `"Start now"` com deslocamento `>= 6px` inclinam suavemente o card nas quatro direcoes sem selecionar texto, e `100%` das liberacoes (dentro ou fora do card) retornam ao centro com bounce visivel em aproximadamente `0.9s`, retomando o balance com `0` saltos bruscos de angulo.
- **SC-003**: `100%` dos cliques diretos sobre o botao `"Start now"` (incluindo cliques com micro-oscilacao natural de ate `6px` ou cliques sobre a area do botao) acionam imediatamente o feedback demonstrativo do card sem iniciar arraste indevido.
- **SC-004**: Em viewport Mobile (`430px`) com simulacao de toque, `100%` dos gestos verticais de deslize iniciados sobre o card rolam a pagina normalmente, sem captura nem travamento da rolagem.
- **SC-005**: Com preferencia de sistema para movimento reduzido ativa (no carregamento inicial ou alternada em tempo real), `0` animacoes de balance, inclinacao de arraste ou bounce ocorrem no card em qualquer tentativa de interacao, e fora do campo de visao o ciclo de balance permanece `100%` pausado.
- **SC-006**: A entrega conclui validacao estatica e build de producao com `0` erros, `0` pacotes novos adicionados ao manifesto de dependencias e preservacao integral do brilho aprovado no `H1`, do oval de `"interfaces"` e do rabisco de `"Border-IA"`.

## Assumptions

- **Premissa A-01 (Exclusao de controles clicaveis no inicio do arraste)**: Iniciar o arraste a partir da superficie do botao `"Start now"` fica desabilitado de forma intencional para proteger cliques com micro-movimento involutario do mouse; toda a area restante do card (`~88%` da superficie de `324 x 405 px`) atua como area livre de pega para o arraste 3D.
- **Premissa A-02 (Arraste exclusivo para ponteiro preciso)**: Como o arraste exige movimento livre para cima e para baixo que conflita diretamente com o gesto nativo de rolagem vertical em celulares, a interacao de arraste 3D atende ponteiros precisos (`mouse`/trackpad em Desktop), enquanto dispositivos de toque exibem o balance sutil em repouso e preservam rolagem livre.
- **Premissa A-03 (Escopo estrito na main)**: Pendencias herdadas que ficaram isoladas na branch rejeitada (`CM-10` do banner e movimento reduzido geral nos hovers CSS fora do card) permanecem fora do escopo desta feature `003`, conforme delimitacao expressa do Handoff 03.
