# Feature Specification: Onda Continua na Malha do Hero, Cursor de Espectro Pontilhado e Polimento Interativo

**Feature Branch**: `006-onda-e-malha-cursor` (mantido na branch `main` por regra de governanca do projeto)

**Created**: 2026-11-07

**Status**: Implemented & Approved on `main` (Handoff 06 + Ajustes Pos-006 do Handoff 07; pendente medicao Lighthouse `T001`/`T010`)

**Input**: User description: "Retirar o efeito de hover do mouse com brilho mais forte na malha da regiao da corda (preservando a grade unica e o campo simetrico de 247px), adicionar um efeito de onda continuo em tempo integral nessa regiao do card sem aumentar o campo, transformar a seta do mouse na propria malha pontilhada ondulante visivel sobre toda a pagina (inclusive sobre o Banner) como em https://kc1t.com/pt-br, aplicar a cor da marca na selecao de texto e adicionar brilho visivel de hover e clique nos botoes."

## Referencias Visuais Analisadas e Decisoes Pos-Revisao (`Handoff 06` + `Handoff 07`)

1. **Cursor representado apenas pelo espectro ondulante (`https://kc1t.com/pt-br`)**:
   - Na inspecao da versao padrao `Vitrine` de `https://kc1t.com/pt-br`, o efeito desenha um quadro compacto de micro-pontos em reticulado ordenado (`4x4`) que viaja com o ponteiro e substitui a seta nativa em dispositivos com mouse.
   - Na primeira iteracao da `006`, a malha ficou atras do conteudo (`z-0`) com seta nativa visivel, mas nao aparecia sobre o bloco opaco do `Banner`. Na revisao pos-`006` (`Handoff 07`), Joao aprovou duas mudancas diretas: a malha subiu para `fixed inset-0 z-50` acima de toda a interface com blending normal (um teste intermediario com `mix-blend-screen` foi descartado porque sumia sobre o botao claro do `Banner`) e **a seta nativa passou a ser escondida (`.cursor-mesh`) para que o ponteiro seja representado apenas pelo espectro pontilhado ondulante**.
   - Para funcionar como cursor real sem atraso incomodo nem perda de contraste, a cor subiu para lilas claro `#C9B3FF` com opacidade maxima `0.9`, o acompanhamento ficou quase colado ao ponteiro (`FOLLOW_RATE = 24`) e a atenuacao sobre o card `"Magic copy"` foi removida para que o cursor nunca suma. Em telas de toque, sob movimento reduzido ou caso o JavaScript nao monte o canvas, a classe `.cursor-mesh` nao entra e a seta nativa permanece disponivel.
2. **Selecao de texto na cor da marca**:
   - Substituicao do destaque azul padrao do navegador por roxo translucido da marca (`rgb(167 81 251 / 0.45)`) com texto branco (`#fff`).
3. **Brilho interativo nos botoes em hover e clique (`https://21st.dev/@designali-in/components/shiny-button`)**:
   - Em repouso, todos os botoes permanecem identicos ao Figma. No hover e no `:focus-visible`, entram um arco conico giratorio na borda (`2.4s`), uma varredura pontilhada de `4px` e um brilho interno/externo colorido conforme cada variante (`#fff` no gradiente primario, `#A751FB` no botao claro do `Banner` e `#C082FF` no botao escuro secundario, alem do `"Start now"` dentro do `MagicCopyCard`). No clique (`:active`), o botao afunda sutilmente (`translate: 0 1px`, `scale: 0.98`) e intensifica o brilho, desligando giro e afundamento quando `prefers-reduced-motion: reduce` estiver ativo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Onda Continua em Tempo Integral na Malha do Hero sem Hover Local (Priority: P1)

Em um computador Desktop (`>= 1024px`) com movimento padrao ativo, o visitante observa a regiao da corda luminosa acima do card `"Magic copy"`. O antigo brilho reativo ao mouse naquela malha deixa de existir, preservando a **grade unica sem pontos duplicados** e o **campo simetrico de `247px` para cada lado do fio** (`494px` totais, sem aumentar mais) com intensidade em gradiente mais forte perto da corda e mais suave nas laterais. Em tempo integral, independentemente de onde esteja o mouse, uma **onda luminosa continua e ritmica** propaga-se simetricamente a partir da curva viva da corda em direcao as bordas laterais e em leve descida ate o topo do card (ciclo calmo em torno de `3.1s`), modulando brilho, matiz violeta/lilas, sutil respiracao de tamanho e micro-ondulacao dos pontos (`<= 1.3px`), em harmonia com o piscar aleatorio existente e ganhando um discreto reforco quando o pulso periodico desce pelo fio.

**Why this priority**: Substitui diretamente o efeito rejeitado na `005` pelo movimento continuo em tempo integral pedido pelo autor para dar vida permanente a regiao acima do card, respeitando o limite exato de `247px` ja aprovado.

**Independent Test**: Pode ser testada em Desktop (`1024px`, `1440px` e `1920px`) deixando o mouse totalmente parado fora da coluna direita: a onda continua deve fluir sem interrupcao dentro do campo de `247px`, acompanhar suavemente a curvatura da corda quando o card inclina, nao reagir localmente a passagem do mouse pela malha e nao criar rolagem horizontal.

**Acceptance Scenarios**:

1. **Given** que o visitante abre o Hero em Desktop (`1440px`) com movimento padrao ativo e mantem o mouse imovel em qualquer canto, **When** observa a regiao acima do card `"Magic copy"`, **Then** frentes suaves de onda propagam-se continuamente a partir da corda pelo campo simetrico de `247px` de cada lado, mantendo mais intensidade junto ao fio e decaindo suavemente ate zero antes das extremidades, sem expandir o campo.
2. **Given** que a malha do Hero esta exibindo a onda continua, **When** o visitante passa o ponteiro sobre a regiao da corda, **Then** a malha do Hero nao cria nenhum foco extra de hover local nem altera seu ritmo por causa do mouse.
3. **Given** que o pulso periodico de energia desce pela corda ou o card `"Magic copy"` inclina, **When** a corda se curva, **Then** a origem da onda acompanha naturalmente a curvatura do fio, o piscar aleatorio dos pontos continua visivel e o traco de `4px` da corda permanece `100%` nitido sem pontos pintados por cima dele.

---

### User Story 2 - Espectro Pontilhado Como Proprio Cursor em Toda a Pagina (Priority: P2)

Em qualquer ponto da landing page em dispositivos com ponteiro preciso (`Header`, `Hero`, `Recursos`, `Banner` e `Footer`) e movimento padrao ativo, a seta tradicional do sistema e ocultada e o cursor passa a ser representado diretamente pelo espectro pontilhado ondulante (`#C9B3FF`, opacidade ate `0.9`, em reticulado ordenado `4x4` inspirado em `https://kc1t.com/pt-br`). Posicionado na camada superior (`z-50`) com blending normal e `pointer-events: none`, o espectro acompanha o movimento quase colado ao ponteiro com leve resto de inercia, permanece nitidamente visivel sobre fundos escuros, sobre o card `"Magic copy"` e tambem sobre o bloco e o botao claro do `Banner`, expande discretamente sua coroa ao passar sobre links e botoes sem bloquear nenhum clique e esmaece ate hibernar quando o mouse deixa a janela.

**Why this priority**: Materializa fielmente a experiencia do `kc1t.com/pt-br` aprovada pelo autor, garantindo que o cursor pontilhado funcione como indicador primario visivel sobre qualquer secao ou superficie da pagina.

**Independent Test**: Pode ser testada percorrendo todas as secoes da pagina, passando sobre o card `"Magic copy"`, o bloco e o botao claro do `Banner` e todos os links/botoes, verificando ausencia da seta nativa, visibilidade continua do espectro e resposta normal de cliques.

**Acceptance Scenarios**:

1. **Given** que o visitante utiliza mouse ou trackpad preciso com movimento padrao permitido, **When** o canvas do cursor e inicializado e o ponteiro se move em qualquer secao (`Header`, `Hero`, `Recursos`, `Banner` ou `Footer`), **Then** a seta padrao do navegador fica oculta e apenas o espectro pontilhado `#C9B3FF` representa o ponteiro com resposta rapida e fluida.
2. **Given** que o visitante move o ponteiro por cima do card `"Magic copy"`, da janela do Figma ou do `Banner` (incluindo o botao claro `"Usar no Figma"`), **When** o espectro cruza essas superficies, **Then** ele permanece plenamente visivel acima delas em blending normal (sem sumir no card nem no botao claro) e sem interceptar cliques ou hovers.
3. **Given** que o espectro do cursor esta ativo, **When** o ponteiro passa sobre um link ou botao interativo, **Then** a coroa pontilhada expande-se sutilmente (`+22%`) mantendo `100%` da clicabilidade.
4. **Given** que o espectro esta visivel na pagina, **When** o visitante retira o ponteiro da janela ou alterna de janela/aba, **Then** o espectro esmaece suavemente em cerca de `0.3s` e encerra seu loop de animacao ate o retorno do mouse.

---

### User Story 3 - Toque, iPhone/WebKit, Movimento Reduzido, Pausa Fora de Tela e Performance (Priority: P3)

Visitantes em dispositivos de toque (especialmente iPhone / WebKit), usuarios com preferencia de movimento reduzido ou situacoes sem JS encontram navegacao integra e acessivel: em telas de toque ou com movimento reduzido ativo, a malha do cursor nao e montada e **a seta nativa do sistema permanece normal**; no Hero Desktop sob movimento reduzido resta apenas a malha estatica de `247px` sem onda e os botoes nao giram nem afundam; em Mobile/iPhone o card 3D nao sofre nenhum recorte; quando o Hero sai de vista, sua onda pausa integralmente; e a performance Mobile e Desktop permanece preservada em Chromium e WebKit.

**Why this priority**: Protege usabilidade essencial (nunca esconder o cursor sem substituto ativo), acessibilidade vestibular, compatibilidade com iPhone e metricas de carregamento.

**Independent Test**: Pode ser testada em Chromium e WebKit nas larguras Desktop (`1024px` e `1440px`) e Mobile iPhone (`390px` e `430px`), alternando movimento reduzido ao vivo, rolando ate o rodape e comparando medicoes Lighthouse antes e depois.

**Acceptance Scenarios**:

1. **Given** que o visitante acessa a pagina em um dispositivo de toque como o iPhone (`390px`/`430px`, motor WebKit), **When** toca e rola pela pagina inteira, **Then** nenhuma malha de cursor nem regra de ocultar cursor e aplicada, a malha Desktop do Hero nao e baixada e o card `"Magic copy"` exibe suas bordas sem nenhum corte.
2. **Given** que a preferencia de sistema para movimento reduzido esta ativa (no carregamento ou alternada ao vivo), **When** o visitante navega em Desktop, **Then** a seta padrao do sistema permanece visivel, a malha do Hero fica estatica sem onda e os botoes exibem apenas o brilho estatico de hover sem giro animado nem afundamento no clique.
3. **Given** que o visitante rola a pagina ate que o Hero saia completamente da area visivel, **When** permanece nas secoes inferiores, **Then** a onda da malha do Hero fica `100%` pausada.

---

### User Story 4 - Selecao de Texto na Cor da Marca e Brilho Interativo nos Botoes (Priority: P3)

Ao selecionar qualquer texto da pagina, o visitante ve o destaque na cor roxa da marca com letras brancas em vez do azul padrao do navegador. Ao passar o ponteiro (ou focar via teclado) e clicar nos botoes de acao da pagina (`Header`, `Hero`, card `"Magic copy"` e `Banner`), cada botao preserva sua aparencia exata do Figma em repouso, acende no hover/foco com um arco luminoso giratorio na borda, micro-pontos varridos e aura suave na cor da sua variante, e responde ao clique com leve pressao tatil e reforco imediato de brilho.

**Why this priority**: Completa o acabamento visual aprovado na revisao pos-`006`, reforcando identidade de marca na selecao de texto e feedback claro de hover e clique em todos os CTAs sem alterar o layout em repouso.

**Independent Test**: Pode ser testada selecionando trechos de texto em diferentes secoes e testando repouso, hover, `:focus-visible` via `Tab` e clique (`:active`) nas tres variantes de `CtaButton` e no botao `"Start now"` do `MagicCopyCard`.

**Acceptance Scenarios**:

1. **Given** que a pagina esta aberta em qualquer navegador, **When** o visitante seleciona texto de titulos ou paragrafos, **Then** o fundo da selecao exibe roxo translucido da marca (`rgb(167 81 251 / 0.45)`) com texto `#ffffff`.
2. **Given** que os botoes de CTA estao em repouso sem hover nem foco, **When** comparados a referencia do Figma, **Then** cores, tamanhos e bordas permanecem identicos ao layout original.
3. **Given** que o visitante posiciona o ponteiro ou foca com teclado um `CtaButton` (`primary-gradient`, `primary-light` ou `secondary-dark`) ou o botao `"Start now"` do card, **When** mantem o hover/foco e em seguida pressiona o clique, **Then** surgem arco luminoso giratorio na borda, textura pontilhada e glow na cor propria da variante (`#fff`, `#A751FB` ou `#C082FF`), seguidos no clique por leve compressao (`scale 0.98`, `translate 0 1px`) e brilho mais intenso.

---

### Edge Cases

- **Carregamento inicial da pagina sem movimento do mouse**: Enquanto o usuario (ou auditor Lighthouse) ainda nao moveu o ponteiro na janela, o canvas do cursor permanece em repouso absoluto (`0` quadros agendados), nascendo diretamente sob a coordenada exata do primeiro movimento real do mouse sem cruzar a tela desde o canto.
- **Seguranca da seta nativa em fallback**: A classe `.cursor-mesh` que esconde o cursor nativo so entra em `<html>` dentro do `useEffect` apos confirmar `canHover && !reduceMotion` e contexto 2D pronto, e e removida imediatamente no cleanup; assim, falha de JS, SSR, toque ou movimento reduzido nunca deixam o usuario sem cursor.
- **Contraste do cursor sobre o botao claro do Banner**: Como o botao `"Usar no Figma"` no `Banner` tem fundo claro (`purple-01`), o cursor usa blending normal com lilas `#C9B3FF` e alpha ate `0.9` (sem `mix-blend-screen`, que fazia os pontos desaparecerem sobre superficies claras).
- **Viewport Desktop estreita (`1024px`)**: Com `CANVAS_WIDTH = 504`, a malha de `247px` para cada lado da corda nao transborda a largura da viewport nem exige `overflow-x-clip` no `HeroSection`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Todo o comportamento de brilho local seguindo o mouse na malha da regiao da corda do Hero (prototipo da `005`) DEVE permanecer removido, preservando a grade unica alinhada (sem pontos duplicados), a folga sobre o fio da corda e o campo simetrico de `247px` para cada lado da corda (`494px` totais, sem aumentar mais), alem de manter `HeroSection.tsx` sem `lg:overflow-x-clip`.
- **FR-002**: Em Desktop (`>= 1024px`) com movimento padrao permitido, a malha do Hero DEVE exibir em tempo integral uma onda continua e suave que emana simetricamente da curva viva da corda rumo as laterais e desce levemente ate o card, contida no envelope em gradiente de `247px`.
- **FR-003**: A onda continua da malha do Hero DEVE modular brilho, matiz violeta/lilas, diametro (`1.4px` a `1.85px`) e micro-ondulacao (`<= 1.3px` dentro da celula de `19px`), convivendo com o piscar aleatorio existente e recebendo reforco sincronizado da passagem de `beamPulse` sem cobrir o traco da corda.
- **FR-004**: Em dispositivos com ponteiro preciso (`canHover`) e movimento padrao permitido (`!reduceMotion`), a pagina inteira DEVE renderizar o espectro pontilhado compacto (`88x88px` Canvas 2D com reticulado ordenado Bayer `4x4`, cor `#C9B3FF` e opacidade maxima `0.9`) em camada fixa superior (`z-50`, blending normal e `pointer-events: none`), acompanhando o mouse com alta responsividade (`FOLLOW_RATE = 24`).
- **FR-005**: Quando e somente quando o canvas de `CursorDotMesh` estiver ativo e pronto no cliente, o elemento `<html>` DEVE receber a classe `.cursor-mesh` (`cursor: none !important` em toda a pagina) para que o ponteiro seja representado apenas pelo espectro ondulante, removendo essa classe na desmontagem ou mudanca de ambiente.
- **FR-006**: O espectro do cursor DEVE permanecer visivel sem atenuacao sobre todas as secoes e cards (incluindo o card `"Magic copy"` e o `Banner` com seu botao claro), expandir discretamente seu raio (`+22%`) sobre controles interativos (`a, button, [role='button']`) e nunca exibir bordas quadradas de recorte.
- **FR-007**: O espectro do cursor DEVE iniciar em repouso absoluto (`rafId = -1`, `0` quadros antes do primeiro `pointermove`), posicionar-se diretamente sob o cursor na primeira entrada, esmaecer suavemente (`~0.3s`) ao sair da janela ou ocultar a aba e encerrar seu `requestAnimationFrame` ao ficar invisivel.
- **FR-008**: Em dispositivos de toque (incluindo iPhone) ou sob `prefers-reduced-motion: reduce`, o espectro do cursor e a classe `.cursor-mesh` DEVEM ficar desativados (mantendo o ponteiro nativo intacto), e a onda continua do Hero DEVE dar lugar apenas a malha estatica `DotMatrixDecor` de `247px`.
- **FR-009**: Quando a secao Hero sair da area visivel durante a rolagem, a renderizacao da onda continua da malha do Hero DEVE pausar `100%` (`frameloop="never"`).
- **FR-010**: A selecao de texto global (`::selection`) DEVE exibir fundo `rgb(167 81 251 / 0.45)` e texto `#fff`.
- **FR-011**: Todos os botoes `CtaButton` (`primary-gradient` com `--shine: #fff`, `primary-light` com `--shine: #A751FB`, `secondary-dark` com `--shine: #C082FF`) e o botao `"Start now"` em `MagicCopyCard` DEVEM receber a classe `.btn-shine` (definida em `@layer components`), preservando fidelidade visual ao Figma em repouso, exibindo arco conico giratorio (`2.4s`), pontos de `4px` e glow no `:hover`/`:focus-visible`, aplicando compressao (`translate: 0 1px`, `scale: 0.98`) e glow reforcado no `:active`, e desativando animacao de giro e transformacao de clique sob `prefers-reduced-motion: reduce`.
- **FR-012**: A solucao NAO deve adicionar dependencias em `package.json`, NAO deve criar novos contextos WebGL alem dos dois do Hero e NAO deve alterar o brilho do `H1`, o oval de `"interfaces"`, o rabisco de `"Border-IA"`, a logo, a corda `<svg>` + mola fisica nem a inclinacao 3D do `MagicCopyCard` (tocando neste arquivo apenas para incluir a classe `btn-shine` no botao `"Start now"`).
- **FR-013**: O resultado DEVE passar em `npm run lint`, `npm run build` e validacao em Chromium e WebKit (Desktop e Mobile/iPhone), mantendo a mediana de 3 execucoes do Lighthouse Mobile e Desktop maior ou igual a linha de base previa da `main`.

### Key Entities

- **Onda Continua da Malha do Hero (`HeroMeshWave`)**: Frente de onda periodica em tempo integral ancorada na distancia horizontal ate a curva viva da corda e na altura vertical ate o card, restrita ao envelope eliptico de `247px` para cada lado do fio.
- **Espectro Pontilhado do Cursor (`CursorDotMesh`)**: Quadro `88x88px` de micro-pontos `#C9B3FF` em reticulado ordenado Bayer `4x4` renderizado em `z-50` acima da pagina, substituindo a seta nativa via `.cursor-mesh` quando ativo.
- **Superficie de Brilho de Botao (`.btn-shine`)**: Camada CSS declarativa em `@layer components` parametrizada por `--shine` e `--shine-angle`, inativa em repouso e acionada em `:hover`, `:focus-visible` e `:active`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em Desktop (`1024px`, `1440px` e `1920px`) com movimento padrao ativo e mouse parado fora da coluna direita, a malha acima do card exibe onda continua fluida em `100%` do tempo dentro de `247px` para cada lado da corda, com `0` reacao de hover local, `0` pontos duplicados e `0` barras de rolagem horizontal.
- **SC-002**: Movendo o mouse por todas as secoes (`Header`, `Hero`, `Recursos`, `Banner` e `Footer`), a seta nativa permanece oculta enquanto apenas o espectro pontilhado `#C9B3FF` acompanha o ponteiro em `z-50`, permanecendo visivel sobre cards e sobre o `Banner`, preservando `100%` dos cliques/hovers e hibernando em ate `0.4s` ao sair da janela.
- **SC-003**: A selecao de texto usa a cor da marca em toda a pagina, e todas as variantes de `CtaButton` mais o botao `"Start now"` permanecem identicos ao Figma em repouso e exibem brilho conico/pontilhado no hover/foco e resposta tatil no clique.
- **SC-004**: Em dispositivos de toque / Mobile (`390px` e `430px` em WebKit/iPhone) e sob `prefers-reduced-motion: reduce`, a seta nativa nunca fica escondida sem substituto, `0` animacoes continuas de onda, cursor ou giro de `.btn-shine` sao executadas, `0` recortes afetam o card 3D e o Hero fora de tela pausa `100%` do seu canvas.
- **SC-005**: `npm run lint` e `npm run build` concluem com `0` erros e `0` novos pacotes, a validacao passa em **Chromium e WebKit** e a mediana de 3 medicoes do Lighthouse Mobile e Desktop nao piora em relacao a linha de base previa da `main`.

## Assumptions

- **Premissa Confirmada A-01 (Espectro como unico cursor ativo em Desktop)**: Apos revisao visual da primeira versao da `006`, o autor definiu explicitamente que a malha pontilhada substitui a seta do mouse em `z-50` com blending normal (como em `https://kc1t.com/pt-br`), garantindo visibilidade tambem sobre o `Banner` e o card `"Magic copy"`.
- **Premissa Confirmada A-02 (Reconstrucao CSS limpa do Shiny Button)**: Diante do limite de cota da ferramenta externa e da restricao constitucional contra pacotes extras, o brilho dos botoes foi construido em CSS nativo (`@property --shine-angle` em `@layer components`), preservando `100%` da fidelidade ao Figma em estado de repouso.
