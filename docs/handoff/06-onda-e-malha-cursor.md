# Handoff 06: onda contínua na malha e malha que segue o cursor

## Pedido do João

> Não curti muito o resultado mas tive uma ideia. Retire o efeito hover do mouse com brilho mais forte na região e adicione um efeito de onda contínuo que fica full time naquela região do card. Não precisa aumentar o campo. Agora, semelhante ao site https://kc1t.com/pt-br, adicione um efeito daquela malha que acompanha o ponteiro do mouse em qualquer local.

Pedido ao agy: analisar o que foi feito da spec 005 e o que não foi aceito, ajustar a documentação ao estado real e projetar a mudança abaixo.

## O que foi feito da spec 005 (sem commit, na `main`)

Implementado conforme a spec, com estes desvios pedidos pelo João durante a revisão:

1. **Grade única:** o shader desenha os pontos fixos depois de montado e o `DotMatrixDecor` CSS fica `opacity-0`. As duas grades antigas, desalinhadas uns 3 px, viraram uma só. **Aceito.**
2. **Campo mais largo:** a malha passou de 110 px para 247 px de cada lado do fio. 247 px é o fim da palavra "criação" no H1 (243 px medidos em 1280, 1440 e 1920), arredondado para 13 células de 19 px para os pontos ficarem simétricos. Tem forma de gradiente: mais forte perto do fio e mais fraca longe dele. O canvas tem 680 px de largura, centrado no fio, e a raiz da corda continua com 340 px. **Aceito, e o João pediu para não aumentar mais.**
3. **Corte lateral:** `HeroSection` ganhou `lg:overflow-x-clip`, porque o canvas passava 43 px da borda em 1024 px. Só no Desktop, porque no Mobile o recorte em ancestral do card já cortou o card no iPhone. **Mantido.**
4. **Brilho do hover seguindo o mouse:** foco gaussiano, coroa, crescimento e recuo dos pontos sob o cursor. Na primeira versão o João achou a área curta. Depois de alargar, achou o círculo grande demais. Ficou mais sutil (raio de cerca de 34 px, halo 0.05), e mesmo assim **não foi aceito. Sai.**

Arquivos tocados: `src/components/three/HeroBeamCanvas.tsx`, `src/components/three/HeroBeamLazy.tsx`, `src/types/landing.ts` (`BeamMeshPointerState`), `src/components/sections/HeroSection.tsx`. As tarefas T002 a T008 estão marcadas, e T001 e T009 (Lighthouse) não rodaram. Leia o diff (`git diff`) para o estado exato.

## O que a nova spec precisa resolver

**1. Remover o hover da malha do hero**
- Sai o brilho que segue o mouse na região da corda: `uMouse`, `uHover`, a escuta de ponteiro em `HeroBeamLazy`, `BeamMeshPointerState` e o `lg:overflow-x-clip` se o canvas largo deixar de ser necessário.
- Fica a grade única e o campo de 247 px com gradiente.

**2. Onda contínua na malha do hero**
- Sempre ligada, sem depender do mouse, na mesma área da malha (sem aumentar o campo).
- Definir a forma: anéis saindo do fio ou do ponto de contato com o card, faixa descendo junto com o pulso, ondulação de brilho ou de posição dos pontos. Precisa combinar com o pulso do feixe e o piscar que já existem, sem competir com a corda e o card.
- Movimento reduzido: sem onda. Fora da tela: pausa.

**3. Malha que segue o ponteiro em qualquer lugar da página (referência: https://kc1t.com/pt-br)**
- Abrir o site e descrever na spec o que acontece lá: se é uma grade de pontos revelada ao redor do cursor, se ela existe só no hero ou na página toda, o tamanho, a intensidade e a inércia.
- Definir onde aparece no Border-IA (página toda ou seções), em que camada fica (atrás do conteúdo, sem cobrir texto nem bloquear clique) e como convive com a malha do hero e o card.
- Custo: é um efeito global. Avaliar CSS (máscara radial com variáveis de posição) contra canvas, e não piorar o Lighthouse. Medir antes e depois.
- Toque e movimento reduzido: desligado. Fora da janela: some suave.

**Geral**
- Testar em WebKit além do Chrome. O João usa iPhone.
- Sem dependência nova.
- Não alterar o brilho do H1, o oval, o rabisco, a logo, o card nem a corda.
- Decidir se a mudança atualiza a spec 005 ou abre a 006. Sugestão: atualizar a 005 com o estado real (o que ficou e o que saiu) e projetar o novo na `006`.
- Trabalhar na `main`, sem branch, sem commit e sem push.
