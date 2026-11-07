# Feature Specification: Landing Page do Plugin Border-IA

**Feature Branch**: `001-border-ia-landing` (mantido na branch `main` por regra do projeto)

**Created**: 2026-11-06

**Status**: Clarified

**Input**: User description: "Landing page de alta fidelidade do plugin de Figma Border-IA em Desktop (1440px) e Mobile (430px), com header, hero, 4 cards de recursos, banner CTA e footer, incorporando coreografia de movimento presente, shapes realistas, performance de primeiro paint, acessibilidade e suporte integral a prefers-reduced-motion."

## Clarifications

### Session 2026-11-06

- Q: Para onde apontam os links de navegacao `"Recursos"`, `"Sobre"` e `"Depoimentos"` no Header Desktop e os botoes externos sem URL definida no Figma? -> A: Links internos rolam ate `#recursos` (`section-itens`), `#sobre` (vitrine do plugin no Hero) e `#depoimentos` (`section-banner` com prova social); links externos (`Usar no Figma`, `Comunidade`, `Discord`, `GitHub`, `Instagram`) consomem um mapa unico de constantes configuraveis abrindo em nova aba segura (Premissas P-01 e P-02).
- Q: Como compor a vitrine visual do Hero entre a janela de fundo do Figma (`WebProcess 2.0`) e o card flutuante `"Magic copy"`? -> A: O card `"Magic copy"` DEVE ser componente real de interface (suportando emblema 3D realista, animacao `"Generating..."` e clique demonstrativo local em `"Start now"`), enquanto a janela do editor Figma ao fundo DEVE ser asset local otimizado exportado do Figma com fade na base e marcacao decorativa oculta para leitores de tela (Premissa P-03).
- Q: Como resolver a diferenca entre Desktop (`307:78`) e Mobile (`335:10650`) quanto aos links do Header e ao botao `"Usar no Figma"` do Hero? -> A: Cada faixa responsiva segue estritamente seu node aprovado no Figma (`< 1024px` segue `335:10650` sem links de texto no Header e respeitando a visibilidade exata do CTA do Hero no node Mobile; `>= 1024px` segue `307:78` completo), sem rolagem horizontal desde `320px` (Premissa P-04).
- Q: Como os efeitos reativos a ponteiro e os shapes realistas se comportam em dispositivos de toque (`pointer: coarse`)? -> A: Em telas de toque com movimento padrao ativo, desativa-se a inclinacao dependente de cursor, aplicando apenas variacao autonoma sutil de angulo no emblema do Hero e feedback imediato de toque nos botoes (Premissa P-05).
- Q: Quais metadados institucionais de pagina (titulo e descricao) devem substituir os textos genericos iniciais? -> A: Titulo `"Border-IA | Acelere sua criação de interfaces no Figma"` e descricao `"Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde. Plugin de Figma com IA para designers."` em PT-BR (Premissa P-06).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descoberta de Valor e Conversao no Topo: Header e Hero (Priority: P1)

Um designer de interfaces acessa a pagina do Border-IA pelo computador ou celular e compreende imediatamente o proposito do plugin: acelerar a criacao de interfaces no Figma com auxilio de inteligencia artificial. No topo, encontra a identidade da marca, atalhos de navegacao (em telas amplas) e acesso a comunidade. Logo abaixo, visualiza a proposta de valor principal com destaque grafico na palavra `"interfaces"`, acao direta para usar no Figma e uma vitrine visual da interface do editor com o card flutuante `"Magic copy"` recebendo um feixe vertical de luz roxa.

**Why this priority**: Concentra a primeira impressao, o entendimento imediato do produto e a principal chamada para acao acima e logo abaixo da primeira dobra, constituindo o nucleo minimo demonstravel da landing page.

**Independent Test**: Pode ser testada isoladamente carregando a pagina inicial em viewports de 1440px (Desktop) e 430px (Mobile) e verificando paridade visual com os alvos de design, textos exatos, ausencia da barra de status de mockup no celular e funcionamento dos botoes do topo.

**Acceptance Scenarios**:

1. **Given** que o visitante abre a pagina em uma tela Desktop (1440px), **When** o topo e renderizado, **Then** visualiza o cabecalho (altura de referencia 110px e largura util de 1216px) com o logo Border-IA a esquerda, os links `"Recursos"`, `"Sobre"` e `"Depoimentos"`, e o botao `"Comunidade"` a direita.
2. **Given** que o visitante esta na secao Hero em Desktop, **When** le o bloco principal, **Then** visualiza a tag `"Plugin Figma"`, o titulo principal `"Acelere sua criação de interfaces"` com um oval desenhado ao redor de `"interfaces"`, o paragrafo `"Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde."` alinhado ao lado do botao `"Usar no Figma"`, o feixe de luz vertical roxo com malha de pontos descendo ate o card flutuante `"Magic copy"` (`"Crie exemplos de headline para meu produto"`, `"Generating..."`, `"Start now"`) e o mockup da interface do editor desaparecendo em fade suave na base.
3. **Given** que o visitante abre a pagina em uma tela Mobile (430px), **When** visualiza o topo e o Hero, **Then** encontra apenas o logo Border-IA e o botao `"Comunidade"` no cabecalho (sem barra de status simulada do sistema operacional e sem menu hamburgue inexistente no layout), seguidos pela tag, titulo com oval em `"interfaces"`, paragrafo e composicao do card `"Magic copy"` sobreposto a interface do editor com fade na base.

---

### User Story 2 - Exploracao de Recursos, Prova Social e Credito Institucional (Priority: P2)

Ao rolar a pagina apos o Hero, o visitante explora como o Border-IA resolve tarefas repetitivas do cotidiano de design por meio de quatro capacidades claras, valida a adocao do produto pela comunidade de mais de cinco mil designers no banner de conversao e consulta os canais sociais e autoria no rodape.

**Why this priority**: Completa o argumento de convencimento do produto (funcionalidades praticas + prova social + segunda oportunidade de conversao + autoria de portfolio), entregando a pagina inteira de ponta a ponta.

**Independent Test**: Pode ser testada navegando ate as secoes Recursos, Banner CTA e Footer em 1440px e 430px, conferindo alinhamentos responsivos, textos obrigatorios corrigidos e funcionamento de todos os links e botoes.

**Acceptance Scenarios**:

1. **Given** que o visitante alcanca a secao Recursos, **When** visualiza o cabecalho e a grade de itens, **Then** ve a tag `"Recursos"`, o titulo `"Como o Border-IA te ajuda no dia a dia"` com rabisco roxo sob `"Border-IA"` e os 4 cards (`"Removedor de fundo"`, `"Gerador de texto"`, `"Amplificador de imagem"` e `"Gerador de avatar"` com a descricao exata `"Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."`), dispostos em 4 colunas alinhadas a esquerda no Desktop e em 1 coluna centralizada no Mobile.
2. **Given** que o visitante chega a secao Banner CTA, **When** examina o card destacado com malha de pontos nos cantos superior esquerdo e inferior direito, **Then** visualiza os 4 avatares circulares sobrepostos de pessoas reais, o texto corrigido `"Mais de +5.000 designers já estão utilizando"`, o titulo `"Concentre-se no design, não na rotina."` com destaque em gradiente e o botao claro `"Usar no Figma"`.
3. **Given** que o visitante chega ao rodape da pagina, **When** confere as informacoes finais abaixo da linha divisoria, **Then** encontra o logo Border-IA, os links para `"Discord"`, `"GitHub"` e `"Instagram"` e obrigatoriamente o credito `"Desenvolvido por: João Gabriel"` (em linha horizontal distribuida no Desktop e empilhados a esquerda no Mobile).

---

### User Story 3 - Coreografia de Movimento e Shapes Realistas em Fluxo Continuo (Priority: P3)

Um visitante com configuracao padrao de movimento vivencia uma pagina viva e fluida: a rolagem tem cadencia suave, a abertura do Hero conduz o olhar da mensagem ate o card do plugin atraves do feixe luminoso, os tracos manuais desenham-se no tempo certo, elementos-chave apresentam volume e luz realistas e cada secao subsequente revela-se progressivamente conforme entra no campo de visao, sem atrasar a exibicao inicial da pagina.

**Why this priority**: Eleva a entrega de uma reproducao estatica para uma peca de portfolio de alto nivel tecnico e estetico, cumprindo o objetivo central de somar movimento presente e shapes realistas mantendo fidelidade ao layout.

**Independent Test**: Pode ser testada recarregando a pagina e percorrendo-a do topo ao rodape com preferencia de movimento padrao ativa, verificando que o primeiro quadro util carrega instantaneamente sem bloqueio, que cada gatilho da matriz de coreografia dispara no momento previsto a 60 quadros por segundo e que os shapes realistas mantem exatamente as proporcoes e posicoes do design aprovado.

**Acceptance Scenarios**:

1. **Given** que o visitante carrega a pagina com movimento padrao habilitado, **When** a sequencia de abertura do Hero executa (concluindo em ate 1,8 segundo), **Then** o cabecalho e os textos entram com suavidade, o oval ao redor de `"interfaces"` e desenhado progressivamente, o feixe vertical roxo projeta luz volumetrica descendente ate o card `"Magic copy"`, o emblema de dois losangos dentro do card exibe volume tridimensional chanfrado reagindo sutilmente a luz e ao ponteiro, e o indicador `"Generating..."` permanece ativo em pulso controlado.
2. **Given** que o visitante rola a pagina ou clica no atalho `"Recursos"`, **When** a rolagem suave conduz a tela ate as secoes inferiores, **Then** o mockup do editor no Hero apresenta leve deslocamento de profundidade, o rabisco sob `"Border-IA"` desenha-se ao entrar na janela visivel seguido pela entrada escalonada dos 4 cards de recursos, e o Banner CTA revela seus elementos com brilho sutil nas malhas de pontos dos cantos.
3. **Given** que o visitante interage com os elementos da vitrine (passando o cursor sobre cards, botoes, logos ou acionando `"Start now"` no card do plugin), **When** ocorre a interacao, **Then** recebe resposta visual imediata e contida (inclinacao sutil, realce de brilho ou reinicio demonstrativo do ciclo `"Generating..."`), sem deslocar o layout ao redor.

---

### User Story 4 - Acessibilidade Plena, Teclado e Respeito a Movimento Reduzido (Priority: P4)

Um visitante sensivel a movimento vestibular, usuario de teclado ou usuario em dispositivo sem suporte grafico tridimensional acessa toda a landing page com conforto, contraste adequado, foco visivel e zero perda de informacao ou de elementos graficos de destaque.

**Why this priority**: Inegociavel pela Constituicao do projeto; garante inclusao, seguranca vestibular e resiliencia tecnica em qualquer navegador ou dispositivo.

**Independent Test**: Pode ser testada ativando a preferencia de reducao de movimento do sistema operacional, navegando do primeiro ao ultimo link apenas com a tecla `Tab`/`Enter` e simulando indisponibilidade de aceleracao 3D, confirmando que todos os textos, tracos e botoes permanecem 100% visiveis e funcionais desde o primeiro instante.

**Acceptance Scenarios**:

1. **Given** que o visitante possui reducao de movimento ativada no sistema operacional, **When** abre e rola a pagina, **Then** nenhum deslocamento de entrada, paralaxe, inercia artificial de rolagem ou loop continuo ocorre, e o oval em `"interfaces"`, o rabisco sob `"Border-IA"`, o feixe roxo e os cards ja aparecem imediatamente em seu estado final completo.
2. **Given** que o visitante navega exclusivamente por teclado, **When** percorre a pagina com `Tab`, **Then** alcanca todos os links do cabecalho, botoes de acao e links sociais na ordem visual logica, sempre com anel de foco de alto contraste visivel sobre o fundo escuro, ignorando elementos puramente decorativos.
3. **Given** que o dispositivo do visitante nao suporta renderizacao tridimensional ou ainda esta baixando recursos secundarios, **When** a secao Hero e exibida, **Then** a versao vetorial/estatica fiel ao design permanece visivel sem espacos vazios, erros visuais ou salto de layout.

---

### Edge Cases

- **Alternancia em tempo real de `prefers-reduced-motion`**: Se o usuario ativar ou desativar a reducao de movimento no sistema operacional com a pagina ja aberta, todas as animacoes ativas e a rolagem suave devem adaptar-se imediatamente sem exigir recarregamento e sem deixar elementos invisiveis ou pela metade.
- **Larguras intermediarias e extremas de tela (`320px` a `2560px+`)**: Em celulares compactos (`320px` a `375px`), o titulo principal, o oval em `"interfaces"` e o card `"Magic copy"` devem ajustar escala proporcional sem gerar barra de rolagem horizontal; em monitores ultrawide (`> 1440px`), o container util permanece centralizado em `1216px` e o fundo `#09090B` expande sem cortar o fade ou o feixe luminoso.
- **Indisponibilidade ou perda de contexto grafico 3D**: Caso o navegador bloqueie aceleracao grafica tridimensional ou descarte o contexto de video em segundo plano, os shapes realistas no Hero devem degradar silenciosamente para a camada grafica estatica equivalente ao design aprovado.
- **Atraso no carregamento da fonte tipografica**: Enquanto a fonte principal carrega ou em conexoes lentas, a troca tipografica nao deve desalinhar o oval sobre `"interfaces"` nem o rabisco sob `"Border-IA"`, recalculando ancoragens visuais assim que as fontes estiverem prontas.
- **Cliques repetidos em `"Start now"` ou links de ancora**: Acionamentos rapidos e consecutivos nao devem empilhar animacoes conflitantes nem travar a rolagem da pagina.
- **Dispositivos de toque sem ponteiro fino**: Em celulares e tablets, interacoes projetadas para cursor (como inclinacao continua do emblema no card do Hero) nao devem travar em angulos inclinados apos um toque; o sistema deve substituir rastreamento de ponteiro por repouso ou oscilacao autonoma leve (quando movimento padrao estiver ativo).

## Requirements *(mandatory)*

### Matriz de Coreografia de Movimento e Shapes Realistas

A tabela abaixo define obrigatoriamente o que recebe tratamento de shape realista, o que anima por tracado ou transicao de camada, o momento exato, o gatilho e o comportamento em movimento reduzido:

| ID | Elemento Visual | Tratamento Visual | Gatilho e Momento | Comportamento Padrao | Comportamento em Movimento Reduzido / Fallback |
|----|-----------------|-------------------|-------------------|----------------------|------------------------------------------------|
| **CM-01** | Cabecalho (logo, links e botao Comunidade) | Camada de interface coreografada; logo em vetor nitido com micro-separacao dos dois losangos em hover | Carregamento inicial (`t = 0.0s` a `0.45s`) e foco/hover | Entrada sutil em opacidade e leve acomodacao vertical (`8px` -> `0px`); hover separa discretamente os dois losangos | Exibido estatico e 100% opaco desde `t = 0s`; apenas mudanca discreta de cor/opacidade em hover/foco |
| **CM-02** | Bloco textual do Hero (tag, H1, paragrafo e CTA) | Camada tipografica escalonada | Carregamento inicial (`t = 0.10s` a `0.75s`) | Revelacao sequencial (tag -> linhas do H1 -> paragrafo e CTA) com deslocamento curto ascendente (`16px` -> `0px`) | Exibido estatico e 100% opaco desde `t = 0s` |
| **CM-03** | Oval desenhado em volta de `"interfaces"` no H1 | Tracado vetorial progressivo com gradiente da marca | Carregamento inicial, logo apos a revelacao do H1 (`t = 0.55s` a `1.20s`) | O traco desenha-se de `0%` a `100%` no sentido natural da escrita manual, encerrando com leve acomodacao de brilho | Traco renderizado `100%` completo e estatico desde `t = 0s` |
| **CM-04** | Feixe de luz vertical roxo e malha de pontos no Hero | **Shape realista (cena luminosa volumetrica sob demanda)** com camada estatica imediata no primeiro quadro | Carregamento inicial (`t = 0.25s` a `1.15s`) + pulso ambiente continuo de baixa frequencia (`~4.5s` por ciclo) | Um pulso luminoso desce do topo ate tocar a borda superior do card `"Magic copy"`, iluminando radialmente a malha de pontos vizinha; mantem fluxo energetico sutil enquanto visivel na tela e pausa fora da viewport | Camada estatica de feixe, brilho radial e malha de pontos fiel ao layout, sem pulso nem renderizacao continua |
| **CM-05** | Emblema de dois losangos dentro do card `"Magic copy"` no Hero | **Shape realista 3D (par de prismas chanfrados translucidos com reflexo especular roxo-indigo)** carregado sob demanda sobre placeholder vetorial identico | Hidratacao pos-primeiro quadro + resposta a chegada do feixe (`t ~ 1.0s`) + inclinacao do ponteiro no card | Os dois prismas em losango exibem chanfro arredondado, profundidade sutil entre o plano frontal e traseiro, reflexo da luz roxa superior e leve rotacao reativa (`ate 8 graus`) conforme o cursor move sobre o card | Emblema vetorial 2D estatico identico ao design, sem rotacao nem animacao continua |
| **CM-06** | Card do plugin `"Magic copy"` e estado `"Generating..."` | Vitrine interativa coreografada com borda luminosa | Entrada em `t = 0.45s` a `1.05s`; estado `"Generating..."` sincronizado a chegada do feixe (`t >= 1.0s`); clique em `"Start now"` | O card emerge com leve ganho de escala (`0.97` -> `1.0`), acende sutilmente a borda superior ao receber o feixe, gira suavemente o arco `"Generating..."` com pulso discreto no texto e reinicia um ciclo demonstrativo curto quando `"Start now"` e acionado | Card estatico em escala `1.0`, arco `"Generating..."` parado no angulo do layout aprovado; clique em `"Start now"` altera apenas estado textual/opacidade instantaneo sem rotacao |
| **CM-07** | Mockup da interface do Figma com fade na base | Camada de profundidade com mascara de dissolucao inferior | Entrada em `t = 0.35s` a `1.00s` + rolagem da secao Hero | Emerge suavemente do fundo (`24px` -> `0px`) mantendo mascara de dissolucao suave na base; durante o scroll do Hero, aplica leve deslocamento de profundidade diferencial (`ate 28px`) em relacao ao card flutuante | Posicionado estatico com fade na base, sem deslocamento vinculado ao scroll |
| **CM-08** | Secao Recursos: tag, H2 e rabisco sob `"Border-IA"` | Entrada ao entrar na viewport + tracado vetorial progressivo do rabisco | Topo da secao Recursos atinge `80%` da altura da viewport (disparo unico) | Tag e H2 revelam-se em `0.5s`, seguidos imediatamente pelo desenho progressivo (`0%` -> `100%` em `0.65s`) do rabisco sob `"Border-IA"` | Texto e rabisco `100%` visiveis e estaticos desde o carregamento |
| **CM-09** | Grade dos 4 cards de Recursos e respectivos icones | Entrada escalonada + micro-interacao nos icones | Entrada logo apos o cabecalho da secao (`~78%` da viewport, intervalo de `0.10s` entre cards) + hover/foco individual | Os 4 cards sobem suavemente em cascata (`18px` -> `0px` em `0.5s`); ao passar o cursor ou focar um card, o container do icone ganha realce de borda e micro-movimento tematico contido (`escala 1.06`) | Cards estaticos desde o carregamento; realce instantaneo de borda/contraste em foco ou hover |
| **CM-10** | Secao Banner CTA e malha de pontos nos cantos | Revelacao de container + cintilacao radial discreta nos dois cantos | Topo do Banner atinge `80%` da viewport + ciclo curto enquanto visivel | Container, avatares empilhados, prova social, titulo e botao revelam-se em sequencia (`0.65s` total); as malhas de pontos superior esquerda e inferior direita executam onda suave de luminancia radial | Banner e malhas de pontos totalmente estaticos e visiveis desde o inicio |
| **CM-11** | Rodape (divisor, logo, redes sociais e credito) | Revelacao limpa de fechamento + estados de hover/foco | Topo do Footer atinge `90%` da viewport | Linha divisoria e itens entram suavemente em opacidade (`0.4s`); botoes sociais e logo apresentam resposta imediata de contraste e leve elevacao (`-2px`) no hover | Totalmente estatico; mudanca instantanea de cor/borda em hover e foco |
| **CM-12** | Rolagem global da pagina e navegacao por ancoras | Rolagem suavizada sincronizada aos gatilhos de secao | Rolagem por roda/toque e clique nos links de secao do cabecalho | Interpolacao fluida de rolagem e deslocamento suave ate a secao de destino ao acionar links internos | Rolagem nativa imediata do navegador, sem interpolacao inercial |

### Functional Requirements

- **FR-001**: A pagina DEVE reproduzir com alta fidelidade visual a estrutura de 5 secoes sequenciais (`header`, `section-hero`, `section-itens`, `section-banner` e `section-footer`) para Desktop (`1440px`, largura util centralizada de `1216px` com margem lateral de `112px`) e Mobile (`430px`, margem lateral aproximada de `22px`), sobre fundo escuro `#09090B` (`Gray-11`).
- **FR-002**: A pagina NAO DEVE incluir no codigo nem exibir em nenhuma largura de tela a barra de status superior simulada (relogio, sinal e bateria) presente apenas como mockup na exportacao Mobile.
- **FR-003**: A pagina DEVE aplicar exclusivamente a familia tipografica `Space Grotesk` e a paleta de cores `Gray`, `Purple` e `Indigo` (incluindo o gradiente `Linear-degrade` extraido diretamente da fonte de design oficial, sem valores inventados).
- **FR-004**: O Cabecalho DEVE exibir o logo Border-IA (dois losangos com gradiente + nome `"Border-IA"`) e o botao `"Comunidade"` em todas as larguras de tela, exibindo os links `"Recursos"`, `"Sobre"` e `"Depoimentos"` apenas na composicao Desktop, exatamente como nos alvos visuais aprovados.
- **FR-005**: Os links de navegacao interna do Cabecalho Desktop DEVEM conduzir o visitante a pontos reais da pagina: `"Recursos"` para a secao de recursos (`#recursos`), `"Sobre"` para a vitrine demonstrativa do plugin no Hero (`#sobre`) e `"Depoimentos"` para a secao de prova social no Banner CTA (`#depoimentos`).
- **FR-006**: A secao Hero DEVE apresentar a tag `"Plugin Figma"`, o titulo principal unico (`h1`) `"Acelere sua criação de interfaces"` com o oval vetorial ao redor de `"interfaces"`, o paragrafo `"Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde."`, o botao `"Usar no Figma"` (obrigatorio na composicao Desktop `307:78` e seguindo em `< 1024px` a visibilidade exata do frame Mobile `335:10650`), o feixe vertical roxo com malha de pontos e a janela de fundo do editor Figma (`WebProcess 2.0`) servida como asset local otimizado com dissolucao em fade na base sob o card flutuante `"Magic copy"`.
- **FR-007**: O card flutuante `"Magic copy"` no Hero DEVE ser implementado como componente real de interface (nao imagem achatada), exibindo o emblema de dois losangos, icone de menu decorativo, titulo `"Magic copy"`, caixa de prompt com `"Crie exemplos de headline para meu produto"`, indicador `"Generating..."` e botao interativo `"Start now"`, que ao ser acionado executa um feedback demonstrativo local do ciclo de geracao sem tirar o visitante da pagina.
- **FR-008**: A secao Recursos DEVE apresentar a tag `"Recursos"`, o titulo `"Como o Border-IA te ajuda no dia a dia"` com rabisco vetorial sob `"Border-IA"` e exatamente 4 cards com icones proprios:
  1. `"Removedor de fundo"`: `"Torne o fundo transparente em qualquer foto."`
  2. `"Gerador de texto"`: `"Gere textos de espaço reservado para suas interfaces."`
  3. `"Amplificador de imagem"`: `"Amplie imagens e melhore sua resolução."`
  4. `"Gerador de avatar"`: `"Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."`
- **FR-009**: Os 4 cards da secao Recursos DEVEM alinhar icone, titulo e descricao a esquerda em grade de 4 colunas no Desktop e centralizar icone, titulo e descricao em pilha vertical de 1 coluna no Mobile, conforme os alvos visuais aprovados.
- **FR-010**: A secao Banner CTA DEVE exibir um container escuro arredondado com malha de pontos nos cantos superior esquerdo e inferior direito, grupo de 4 avatares circulares sobrepostos de pessoas reais, texto corrigido `"Mais de +5.000 designers já estão utilizando"`, titulo `"Concentre-se no design, não na rotina."` com realce em gradiente e botao claro `"Usar no Figma"`.
- **FR-011**: A secao Footer DEVE exibir uma linha divisoria superior, o logo Border-IA, links acessiveis para `"Discord"`, `"GitHub"` e `"Instagram"` e obrigatoriamente o credito `"Desenvolvido por: João Gabriel"`, sendo proibido exibir os nomes originais do arquivo de layout.
- **FR-012**: Todos os botoes de conversao externa (`"Usar no Figma"`, `"Comunidade"`) e links sociais (`"Discord"`, `"GitHub"`, `"Instagram"`) DEVEM ler seus enderecos de uma fonte unica e centralizada de configuracao e abrir destinos externos com atributos seguros de nova aba.
- **FR-013**: A pagina DEVE implementar integralmente os itens `CM-01` a `CM-12` da Matriz de Coreografia de Movimento e Shapes Realistas, garantindo que o feixe luminoso do Hero (`CM-04`) e o emblema de dois losangos do card `"Magic copy"` (`CM-05`) recebam tratamento realista sob demanda sem bloquear a exibicao estatica inicial e substituindo rastreamento de cursor por repouso/flutuacao autonoma discreta em dispositivos de toque.
- **FR-014**: Todos os assets graficos (avatares, icones, vetores e elementos da vitrine do Figma) DEVEM residir localmente no projeto, sem nenhuma dependencia de enderecos temporarios externos da ferramenta de design.
- **FR-015**: A pagina DEVE respeitar integralmente a preferencia de reducao de movimento do sistema operacional em todos os comportamentos (`CM-01` a `CM-12`), desativando deslocamentos, rolagem inercial e loops continuos e exibindo imediatamente o estado visual completo.
- **FR-016**: A pagina DEVE atender aos requisitos de acessibilidade e semantica: idioma `pt-BR`, hierarquia logica de cabecalhos (`h1` unico no Hero, `h2` nas secoes Recursos e Banner CTA, `h3` nos 4 cards de recursos), navegacao integral por teclado com indicador de foco de alto contraste, nomes acessiveis explicitos em controles somente com icone e marcacao decorativa oculta para leitores de tela em camadas ornamentais (feixe, malhas de pontos, rabiscos, cena 3D e mockup de fundo).
- **FR-017**: O documento da pagina DEVE publicar metadados institucionais em portugues brasileiro, com titulo `"Border-IA | Acelere sua criação de interfaces no Figma"` e descricao `"Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde. Plugin de Figma com IA para designers."`.

### Key Entities

- **Configuracao de Navegacao e Destinos**: Conjunto centralizado dos rotulos e enderecos de ancoras internas (`Recursos`, `Sobre`, `Depoimentos`), chamadas de conversao (`Usar no Figma`, `Comunidade`) e redes sociais (`Discord`, `GitHub`, `Instagram`).
- **Card de Recurso**: Unidade informativa da secao Recursos composta por identificador unico, icone vetorial local, titulo curto e descricao funcional validada pelo contrato de conteudo.
- **Elemento Coreografado / Shape Realista**: Unidade visual catalogada (`CM-01` a `CM-12`) com definicao de camada estatica base, gatilho de ativacao, parametros de movimento padrao e estado equivalente para movimento reduzido ou ausencia de suporte 3D.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em comparacao visual direta nas resolucoes de referencia (`1440px` Desktop e `430px` Mobile), 100% das 5 secoes preservam estrutura, proporcoes, alinhamentos, paleta de cores e textos contratuais aprovados, sem barra de rolagem horizontal em nenhuma largura entre `320px` e `2560px`.
- **SC-002**: O conteudo principal acima da primeira dobra (cabecalho, titulo principal do Hero, subtitulo, chamada para acao e representacao inicial da vitrine) torna-se visivel em menos de 1,8 segundo em conexao banda larga padrao, sem atraso provocado pelo carregamento sob demanda dos shapes realistas e sem deslocamento inesperado de layout (`CLS <= 0.05`).
- **SC-003**: Durante a sequencia de entrada e a rolagem completa do topo ao rodape em hardware padrao, a animacao sustenta fluidez alvo de 60 quadros por segundo, limitando o uso de aceleracao grafica 3D a no maximo 2 contextos leves restritos a secao Hero e pausando calculos continuos de elementos fora da janela visivel.
- **SC-004**: Com a preferencia de reducao de movimento ativada no sistema operacional, 100% dos deslocamentos automaticos, loops continuos e interpolacoes de rolagem cessam em menos de 100ms, mantendo 100% dos textos e tracos graficos (`"interfaces"` e `"Border-IA"`) legiveis e completos.
- **SC-005**: 100% dos elementos interativos da pagina podem ser alcancados e acionados exclusivamente por teclado com foco visivel nitido, e auditoria automatizada de acessibilidade na pagina nao registra nenhuma violacao critica ou seria de semantica, contraste ou rotulagem.
- **SC-006**: 0 referencias a URLs temporarias externas de assets e 0 ocorrencias de nomes incorretos de autoria ou de erros ortograficos divergentes do contrato de conteudo existem na entrega final.

## Assumptions

- **P-01 (Ancoras do Cabecalho Desktop)**: Como o layout aprovado contem 5 blocos (`header`, `hero`, `recursos`, `banner`, `footer`) e nao possui secoes isoladas intituladas `"Sobre"` ou `"Depoimentos"`, assume-se que `"Recursos"` rola ate a secao Recursos (`#recursos`), `"Sobre"` rola ate a vitrine demonstrativa da interface no Hero (`#sobre`) e `"Depoimentos"` rola ate o Banner CTA (`#depoimentos`), onde reside a prova social com avatares reais de mais de 5.000 designers.
- **P-02 (URLs de CTAs Externos e Redes Sociais)**: Como o pacote de design nao define URLs finais de producao para o plugin publicado nem para redes sociais, todos os links externos apontam para destinos padrao seguros e validos centralizados em um unico arquivo de constantes (ex.: pagina da comunidade Figma, Discord, perfil GitHub do autor e Instagram), facilitando substituicao imediata sem alterar componentes.
- **P-03 (Composicao da Vitrine e Botao `"Start now"` no Hero)**: A janela de fundo do editor Figma (`WebProcess 2.0`) e decorativa e servida como asset local otimizado com fade inferior, enquanto o card `"Magic copy"` sobreposto e construido como componente real de interface; acionar `"Start now"` executa um feedback visual curto de geracao no proprio card sem redirecionar o visitante, deixando a conversao externa dedicada aos botoes `"Usar no Figma"` e `"Comunidade"`.
- **P-04 (Transicao Responsiva entre Mobile e Desktop)**: Os frames de referencia sao `430px` (Mobile, node `335:10650`) e `1440px` (Desktop, node `307:78`). Assume-se ponto de mudanca estrutural principal em `1024px`: abaixo de `1024px` segue-se a estrutura Mobile aprovada (sem links textuais no Header e com a visibilidade exata do CTA do Hero definida em `335:10650`); a partir de `1024px` adota-se o cabecalho completo, CTA ao lado do subtitulo no Hero e grade de 4 colunas em Recursos.
- **P-05 (Escopo de Shapes Realistas, Vetores 2D e Telas de Toque)**: O tratamento de shape realista 3D/volumetrico concentra-se no feixe de luz vertical com atmosfera luminosa do Hero e no par de prismas em losango do card `"Magic copy"`, enquanto logos menores (Header e Footer), icones dos cards e tracos caligraficos permanecem em vetor 2D ultra-nitido; em dispositivos de toque (`pointer: coarse`), efeitos dependentes de cursor cedem lugar a repouso ou oscilacao autonoma sutil.
- **P-06 (Metadados de Pagina e Portfolio)**: Como o projeto compoe o portfolio tecnico de Joao Gabriel, o titulo e a descricao da pagina substituem os textos padrao do template inicial por metadados em PT-BR alinhados a proposta de valor aprovada no Hero.
