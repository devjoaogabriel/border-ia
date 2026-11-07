# Handoff 05: brilho da malha do hero seguindo o mouse

## Pedido do João

> A nova implementação é na área hero onde existe o card e a corda. Um efeito hover daquela malha de fundo. Sem o mouse ela mantém o brilho padrão e os efeitos. Ao passar o mouse, o brilho aumenta e acompanha o mouse. Existe um efeito parecido no próprio site do Antigravity: https://antigravity.google/

Em resumo:

1. **Sem mouse:** a malha fica como está hoje (brilho padrão, pontos piscando, pulso do feixe).
2. **Com mouse sobre a malha:** um brilho mais forte aparece sob o cursor e segue o movimento.
3. **Referência:** a malha de pontos do hero de https://antigravity.google/, que reage ao cursor. Vale abrir o site e descrever na spec o que for aproveitado.

## Como a malha funciona hoje

A malha é a área atrás da corda, acima do card. Fica em `src/components/three/HeroBeamLazy.tsx`, só no Desktop (`hidden lg:block`), com 340 x 525 px e `pointer-events-none`. Tem três camadas:

- **Halo:** gradiente radial roxo em CSS (`rgb(122 103 255 / 0.22)`).
- **Pontos fixos:** `DotMatrixDecor variant="css"`.
- **Shader:** `HeroBeamCanvas.tsx` desenha pontos em grade de 19 px que piscam (`blink`) e somem para os lados (`exp(-dist / 90)`), além do pulso do feixe. Os uniforms vêm de `useFrame`. O canvas para fora da tela (`frameloop`).

O card fica logo abaixo, com hover próprio (spec 004): inclina com o mouse e retoma o balance ao sair.

## Pontos que a spec precisa resolver

**Área e detecção**
- A área inteira tem `pointer-events-none` e fica atrás do card. Definir a zona que responde ao mouse: só o retângulo da malha, ou também o entorno (coluna do card, até o header). Escutar o ponteiro sem bloquear clique nem o hover do card.
- O que acontece quando o mouse passa da malha para o card: o brilho some, fica parado ou acompanha por cima.
- A malha some para os lados (sem borda visível). O brilho não pode revelar a borda do retângulo nem cortar em linha reta.

**Efeito**
- Forma do brilho: raio, intensidade, cor. Só os pontos acendem perto do cursor ou também o halo de fundo.
- Se os pontos reagem além do brilho (deslocamento, escala ou repulsão, como no Antigravity). Manter sutil para não competir com a corda e o card.
- Entrada e saída suaves: o brilho segue o mouse com leve atraso e desaparece ao sair, sem corte seco.
- Convivência com o pulso do feixe e com o piscar dos pontos que já existem.

**Implementação**
- Preferir o shader existente (um uniform de posição do mouse e outro de intensidade) a um canvas novo.
- Os pontos fixos em CSS e os pontos do shader precisam acender juntos, ou a spec define que só o shader reage.

**Geral**
- Telas de toque não têm hover: definir o comportamento (provavelmente só o padrão). A malha já não aparece no Mobile.
- Movimento reduzido: sem brilho seguindo o mouse.
- Pausar fora da tela, como o resto do hero.
- Testar em WebKit além do Chrome.
- Lighthouse: não piorar. Medir antes e depois.

## Governança

- Numerar como `005`.
- Sem dependência nova: shader, GSAP e CSS devem bastar.
- Não alterar o brilho do H1, o oval, o rabisco, a logo, o card nem a corda.
- Trabalhar na `main`, sem branch, sem commit e sem push.
