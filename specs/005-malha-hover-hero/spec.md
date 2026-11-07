# Feature Specification: Brilho Reativo ao Mouse na Malha de Pontos do Hero

**Feature Branch**: `005-malha-hover-hero` (mantido na branch `main` por regra de governanca do projeto)

**Created**: 2026-11-07

**Status**: Parcialmente Aceito na Revisao HITL; Hover Substituido pela `006-onda-e-malha-cursor` (Handoff 06)

**Input**: User description: "Adicionar um efeito de hover seguindo o mouse na malha de pontos ao fundo da corda e do card no Hero Desktop, mantendo em repouso o brilho padrao e os efeitos atuais e aumentando suavemente o brilho acompanhando o cursor ao passar o mouse, inspirado na referencia https://antigravity.google/ sem competir com a corda nem alterar o card."

## Resultado da Revisao HITL e Estado Real na `main` (Handoff 06)

Apos a implementacao inicial na branch `main` (sem commit) e revisao visual pelo Joao Gabriel, o escopo desta especificacao teve desfecho dividido em quatro pontos concretos:

1. **Grade unica sem pontos fantasmas (ACEITO E MANTIDO)**: Depois que a superficie animada monta, ela assume o desenho dos pontos fixos na mesma origem geometrica da malha estatica inicial, ocultando a copia estatica redundante (`opacity-0`) e eliminando o desalinhamento anterior de cerca de `3px` entre as duas grades, enquanto preserva o primeiro paint e o modo de movimento reduzido.
2. **Campo simetrico alargado para `247px` de cada lado da corda (ACEITO E TRAVADO)**: Durante a revisao, o campo da malha foi ampliado de `110px` para `247px` para cada lado do fio (`494px` de largura total, correspondente a `13` celulas simetricas de `19px` e alinhado ao final da palavra `"criacao"` no `H1`, medida em `243px` nas larguras `1280px`, `1440px` e `1920px`), mantendo formato em gradiente mais intenso perto da corda e mais suave longe dela. O Joao aprovou essa medida e determinou nao aumentar mais o campo.
3. **Protecao contra transbordo horizontal no Desktop em `1024px` (APLICADO NA `005`, REAVALIADO NA `006`)**: Como a area grafica ampliada para o hover (`680px`) ultrapassava `43px` da borda direita em `1024px`, a secao do Hero recebeu recorte horizontal exclusivo no Desktop (`>= 1024px`), sem afetar o Mobile/iPhone onde recortes em ancestrais ja haviam cortado o card 3D. Na `006`, com a retirada da margem extra do hover, a largura da superficie volta a acompanhar apenas o campo de `247px` sem transbordo.
4. **Brilho de hover seguindo o mouse na malha do Hero (REJEITADO E REMOVIDO NA `006`)**: O foco gaussiano com coroa, crescimento e recuo radial sob o cursor foi testado primeiro no campo original, depois no campo alargado e por fim em escala reduzida (raio `~34px`, halo `0.05`), mas nao agradou ao Joao Gabriel e **sai do codigo** na feature `006-onda-e-malha-cursor`, dando lugar a uma onda continua em tempo integral na malha do Hero e a uma malha pontilhada que acompanha o ponteiro na pagina toda (`https://kc1t.com/pt-br`).

## Referencia Visual Analisada na Epoca (`https://antigravity.google/`)

A inspecao do Hero de `https://antigravity.google/` havia extraido quatro mecanismos testados nesta iteracao:

1. **Captura passiva sem interceptar cliques**: Camada visual transparente a eventos de clique, lendo a posicao do cursor na janela sem bloquear botoes, links ou o hover do card.
2. **Foco com leve inercia fluida**: Perseguicao amortecida do cursor e desaceleracao gradual na saida.
3. **Perfil duplo de luz (foco central + coroa respirante)**: Calibrado ate `~34px` de raio e halo `0.05` durante o ajuste fino na `main` (posteriormente descartado na revisao).
4. **Micro-afastamento radial contido**: Deslocamento radial de ate `1.6px` dentro da celula de `19px` (posteriormente descartado junto com o hover).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grade Unica e Campo Simetrico de `247px` na Malha do Hero (Priority: P1 - ACEITO)

Em um computador Desktop (`>= 1024px`), o visitante observa a malha de pontos roxos atras da corda luminosa acima do card `"Magic copy"` ocupando `247px` para cada lado da corda (`13` colunas de `19px` por lado, alinhadas ao fim da palavra `"criacao"` no titulo principal), com intensidade em gradiente mais forte junto ao fio e mais suave nas extremidades, operando como uma unica grade coesa sem pontos duplicados entre o carregamento inicial e a animacao ativa.

**Why this priority**: Consolida a melhoria estrutural e espacial efetivamente aprovada pelo Joao Gabriel nesta iteracao e preservada como base para a `006-onda-e-malha-cursor`.

**Independent Test**: Abrir o Hero em Desktop (`1024px`, `1440px` e `1920px`) e confirmar que a malha se estende simetricamente por `247px` para cada lado do fio sem gerar rolagem horizontal e sem apresentar pontos duplicados ("fantasmas") atras da animacao.

**Acceptance Scenarios**:

1. **Given** que o visitante abre o Hero em Desktop (`1440px`), **When** a renderizacao animada da malha entra em operacao apos o primeiro paint, **Then** a grade estatica inicial cede lugar a grade animada na mesma posicao exata (`19px` de passo, `247px` para cada lado), exibindo `0` pontos duplicados ou deslocados.
2. **Given** que o visitante visualiza o Hero em `1024px`, `1440px` e `1920px`, **When** observa a largura da malha acima do card, **Then** os pontos estao distribuidos em `13` celulas simetricas para cada lado do fio com decaimento suave em gradiente ate sumir antes das bordas, sem barra de rolagem horizontal.

---

### User Story 2 - Foco Luminoso Seguindo o Cursor na Malha do Hero (Priority: P2 - REJEITADO NA REVISAO HITL, REMOVIDO NA `006`)

*(Historia implementada em prototipo na `main` e descartada pelo autor no Handoff 06: o foco luminoso sob o mouse na regiao da corda nao foi aceito mesmo com raio reduzido para `34px` e halo `0.05`, sendo removido pela `006-onda-e-malha-cursor`.)*

**Why this priority**: Mantida no registro historico para documentar o experimento realizado e o motivo da mudanca de direcao para a `006`.

**Independent Test**: Substituido na `006-onda-e-malha-cursor` pela verificacao de ausencia de hover local na malha do Hero e presenca de onda continua em tempo integral.

**Acceptance Scenarios**:

1. **Given** a revisao final do Handoff 06, **When** a feature `006-onda-e-malha-cursor` for aplicada sobre este estado, **Then** nenhum brilho local seguindo o mouse deve restar na malha da corda, permanecendo apenas a grade unica de `247px` para receber a onda continua.

---

### User Story 3 - Respeito a Dispositivos de Toque, Movimento Reduzido e Fora de Tela (Priority: P3 - ACEITO)

Visitantes em celulares e telas de toque (incluindo iPhone), usuarios com preferencia de sistema para movimento reduzido ou visitantes que rolam a pagina para as secoes inferiores encontram comportamento limpo: no celular (`< 1024px`) a malha Desktop permanece oculta e nenhum recorte corta o card 3D; com movimento reduzido ativo, exibe-se apenas a grade estatica de `247px` para cada lado; e fora da tela a renderizacao animada pausa `100%`.

**Why this priority**: Protege acessibilidade vestibular, compatibilidade com iPhone/WebKit e economia de processamento fora da dobra.

**Independent Test**: Alternar movimento reduzido em tempo real, inspecionar viewport Mobile (`390px`/`430px`) e rolar ate o rodape confirmando pausa da malha.

**Acceptance Scenarios**:

1. **Given** preferencia de sistema para movimento reduzido ativa, **When** o visitante abre o Hero em Desktop, **Then** apenas a malha estatica de `247px` para cada lado e exibida, sem animacao continua.
2. **Given** navegacao em Mobile (`< 1024px`, como no iPhone), **When** o visitante visualiza o Hero, **Then** a malha Desktop nao e carregada e o card 3D nao sofre nenhum recorte nas bordas.
3. **Given** rolagem ate que o Hero saia da area visivel, **When** o visitante permanece nas secoes inferiores, **Then** o processamento animado da malha fica `100%` pausado.

---

### Edge Cases

- **Transicao entre primeiro paint estatico e malha animada**: A ocultacao da camada estatica ocorre apenas apos a camada animada sinalizar prontidao, evitando piscada vazia no carregamento.
- **Nitidez sobre a corda conectada**: Os pontos abrem folga suave (`1.8px` a `4.5px`) ao redor da curva viva da corda para nao lavar o traco vetorial de `4px`, enquanto o pulso do feixe continua brilhando sobre ela.
- **Largura `1024px` vs Mobile iPhone**: Qualquer protecao contra transbordo horizontal da malha aplica-se exclusivamente em `>= 1024px`, nunca em ancestrais do card no Mobile.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (ACEITO)**: Em Desktop (`>= 1024px`), a malha de pontos acima do card `"Magic copy"` DEVE ocupar `247px` simetricos para cada lado da corda (`494px` de largura util em grade de `19px`), com intensidade em gradiente mais forte perto do fio e mais suave rumo as bordas, sem novas expansoes de largura.
- **FR-002 (ACEITO)**: A camada estatica de primeiro carregamento e a camada animada da malha DEVEM operar como uma grade unica alinhada na mesma origem (`-247px`, `top 60px`), ocultando a camada estatica assim que a camada animada estiver pronta para evitar pontos duplicados.
- **FR-003 (ACEITO)**: Os pontos da malha DEVEM abrir folga visual suave sobre a curva viva da corda conectada para preservar `100%` da nitidez do fio vetorial enquanto o pulso periodico continua descendo normalmente.
- **FR-004 (ACEITO)**: Em Mobile (`< 1024px`), a malha do feixe DEVE permanecer inativa sem impor recortes ao card 3D; sob `prefers-reduced-motion: reduce`, apenas a grade estatica de `247px` DEVE ser exibida; e fora da tela a animacao DEVE pausar integralmente.
- **FR-005 (REJEITADO -> REMOVIDO NA `006`)**: O foco luminoso reativo ao mouse sobre a malha do Hero (incluindo rastreamento de ponteiro na regiao da corda, halo sob o cursor e crescimento/recuo radial por hover) NAO foi aceito na revisao HITL e DEVE ser integralmente removido na feature `006-onda-e-malha-cursor`.

### Key Entities

- **Campo Simetrico da Malha (`HeroMeshField`)**: Grade unificada de pontos em passo de `19px`, estendendo-se `247px` (`13` celulas) para cada lado do centro da corda (`x = 170px`), entre `y = 60px` e `y = 497px`, com mascara radial de bordas suaves e folga sobre a corda.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em Desktop (`1024px`, `1440px` e `1920px`), a malha exibe `13` colunas simetricas de pontos para cada lado da corda (`247px` de meia-largura) com `0` pontos duplicados na transicao entre carregamento estatico e animacao ativa e `0` barras de rolagem horizontal.
- **SC-002**: O traco da corda conectada, o card `"Magic copy"`, o brilho do `H1`, o oval de `"interfaces"`, o rabisco de `"Border-IA"` e a logo permanecem `100%` preservados, com `100%` dos cliques e hovers livres de obstrucao.
- **SC-003**: Em Mobile/iPhone (`< 1024px`), `0` recortes afetam o card 3D; sob `prefers-reduced-motion: reduce`, `0` animacoes continuas rodam na malha; e fora da dobra a renderizacao animada permanece `100%` pausada.
- **SC-004**: A remocao da parcela rejeitada (hover na malha) e a medicao comparativa antes/depois de performance seguem consolidadas na feature sucessora `006-onda-e-malha-cursor` antes do commit final na `main`.

## Assumptions

- **Premissa A-01**: Os artefatos desta pasta `005-malha-hover-hero` documentam fielmente o estado intermediario implementado na `main` e o resultado da revisao do Joao Gabriel (Handoff 06), servindo de linha de base exata para a especificacao `006-onda-e-malha-cursor`.
