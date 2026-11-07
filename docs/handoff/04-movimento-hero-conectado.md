# Handoff 04: movimento conectado no hero

## Estado atual

- A spec 003 foi implementada e está na `main`: balance do card, inclinação 3D ao arrastar com o mouse, bounce ao soltar.
- Depois dela vieram correções no hero: halo e brilho do card medidos no design, recorte do card no Mobile e a janela do Figma como SVG (`public/images/hero-figma-ui.svg`).
- O Figma MCP segue bloqueado por cota. As fontes do design são `docs/design/screens/` (PNGs dos frames e `Interface-figma.svg`, `Plugin-interface.svg`, `Logo.svg`).

## Pedido do João

> Adicione um bounce effect sobre a interface-figma. Ela estatica sem movimento não combina com o restante do site. Outro ponto é, o efeito sobre o card é bom mas não foi o esperado e por isso quero duas mudanças. A primeira é que a linha conectada ao card tenha movimento conectado e realista ao card e que o efeito do card não fique mais somente no click mas no hover do mouse.

São três entregas:

1. **Janela do Figma:** ganha um movimento de bounce, para deixar de ser o único elemento parado do hero.
2. **Linha do feixe:** passa a se mover ligada ao card, de forma realista. Quando o card balança ou inclina, a linha acompanha o ponto onde toca nele, como um fio preso ao card e ao topo.
3. **Card:** a inclinação 3D reage ao hover do mouse, sem precisar pressionar.

**Decisão do João:** o arraste com clique sai. A inclinação do card é só por hover.

## Como funciona hoje

- **Janela:** `Image` com `data-m="window"` em `src/components/sections/HeroSection.tsx`, com máscara de fade linear e recorte em 660 px.
- **Linha:** `src/components/three/HeroBeamLazy.tsx` tem a linha reta em CSS (`w-1`, 517 px, 20 px atrás do card), e `HeroBeamCanvas.tsx` desenha o pulso e os pontos em shader. Só existe no Desktop.
- **Card:** `src/components/ui/MagicCopyCard.tsx`, com `Draggable` sobre um proxy, timeline `balance` e tween único `tiltTo`. O palco tem `[perspective:900px]`.

## Pontos que a spec precisa resolver

**Janela**
- O `LandingMotionController` já move `[data-m='window']` com a entrada e o parallax de `y: -28`. O bounce não pode disputar esse `transform`: definir se entra em um elemento pai.
- Definir o que "bounce" significa aqui: flutuação contínua, reação ao scroll ou reação ao ponteiro, com amplitude sutil. Não pode competir com o card.
- A janela fica atrás do card, e a borda superior dela aparece atrás dele.
- No Mobile, o `#sobre` recorta os lados e a base (`clip-path` e `overflow-x-clip`). O movimento não pode revelar corte nem abrir rolagem lateral.
- É o maior elemento do hero e a imagem de LCP no Mobile: avaliar custo de repintura com a máscara.

**Linha**
- O topo fica fixo e a ponta segue o ponto de contato com o card. Definir como calcular esse ponto com a inclinação 3D e a perspectiva.
- A linha reta não dobra. Definir a forma da curva, por exemplo um path SVG com curva e atraso, com leve inércia e amortecimento para parecer um fio físico.
- O pulso do `beamPulse` e o shader assumem uma reta. Definir como o pulso percorre a linha curva, ou como os dois convivem sem descolar.
- Hoje a ponta se esconde 20 px atrás do card. A conexão não pode abrir vão em nenhum ângulo.

**Card**
- Entrada do mouse: sair do balance para o ângulo do cursor sem salto.
- Saída do mouse: voltar com bounce e retomar o balance.
- "Start now" continua clicável, com o cursor adequado. Definir se o card inclina com o mouse sobre o botão.
- Limites de ângulo: revisar 14° e 16°, porque hover é mais constante que arraste.
- O logo 3D do card também reage ao ponteiro: evitar soma exagerada de movimento.
- Remover o `Draggable`.

**Geral**
- Telas de toque não têm hover: definir o comportamento do card e da janela no celular.
- Movimento reduzido: tudo estático, inclusive a linha.
- Pausar tudo fora da tela.
- Testar em WebKit, além de Chrome: o João usa iPhone, e dois bugs recentes só apareceram lá.
- Lighthouse Mobile está em torno de 63, abaixo da meta da constituição: não piorar, e medir antes e depois.

## Governança

- Numerar como `004`.
- Sem dependência nova: GSAP, SVG e o shader existente devem bastar.
- Não alterar o brilho do H1, o oval, o rabisco nem a logo.
- Trabalhar na `main`, sem criar branch, sem commit e sem push.
