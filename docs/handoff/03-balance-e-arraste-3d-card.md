# Handoff 03: balance e arraste 3D do card Magic copy

## O que mudou desde a spec 002

- O João rejeitou a versão da spec 002. Os 6 componentes foram reconstruções locais, porque a cota do MCP da 21st bloqueou o código original.
- Essa versão, com a spec 002 e o handoff 02, está só na branch local `design-polish-21st` (commit `c11955b`). Não existem na `main`.
- A `main` voltou ao commit `325dbfb`, mais um único acréscimo ainda sem commit: o brilho animado no H1 (`src/components/ui/animated-shiny-text.tsx`, `src/lib/utils.ts`, `framer-motion`, `clsx`, `tailwind-merge`). O João aprovou esse efeito.
- A linha ondulada foi testada e rejeitada. O oval de "interfaces" e o rabisco de "Border-IA" continuam como no original e não devem ser alterados.
- CM-10 e o movimento reduzido nos hovers CSS continuam abertos na `main`, porque as correções ficaram na branch. Não fazem parte desta feature.
- Lighthouse medido na `main` com o efeito do H1, mediana de 3: Desktop 75, Mobile 63.

## Nova feature

Pedido do João sobre o card "Magic copy" do hero:

> Quero um efeito de balance sobre o cartão sutil. Além de possibilitar em uma escala 3d movimentar o card ao pressionar o mouse por cima e arrastar pra cima, baixo ou lados e ao soltar, volta ao balance/bounce original.

O card é o `src/components/ui/MagicCopyCard.tsx`: 324 x 405 px, fundo escuro, borda roxa, logo 3D, título, prompt, "Generating..." e botão "Start now". O feixe de luz desce e toca o topo do card.

**Comportamento esperado:**

1. Em repouso, o card balança de forma sutil e contínua.
2. Ao pressionar e arrastar, ele se move em 3D nas quatro direções, acompanhando o ponteiro.
3. Ao soltar, volta com bounce e retoma o balance.

**Decisão do João:** "movimentar em escala 3D" é só inclinar, em `rotateX` e `rotateY` com perspectiva e limite de ângulo. O card não sai do lugar.

## Pontos que a spec precisa resolver

- **"Start now":** o clique tem que continuar funcionando. Definir o limiar entre clique e arraste, e se o arraste pode começar em cima do botão.
- **Feixe:** ele encosta no topo do card. Definir como a inclinação convive com esse encontro, sem abrir vão visível.
- **Elemento transformado:** o card tem `overflow-hidden`, e o pai usa `scale-[0.885]` com `origin-top-right` abaixo de `lg`. A perspectiva precisa funcionar nos dois casos.
- **Efeitos existentes:** o logo 3D inclina seguindo o ponteiro, e a timeline de `beamPulse` acende `[data-card-glow]`. Nada disso pode quebrar nem somar movimento demais.
- **Toque:** no celular, arrastar o card não pode prender a rolagem da página. Definir `touch-action` ou se o arraste é só para mouse.
- **Lenis:** o arraste não pode disputar com o scroll suave.
- **Movimento reduzido:** sem balance e sem bounce. Definir se o arraste fica desligado ou sem animação.
- **Fora da tela:** o balance pausa.
- **Acessibilidade:** o arraste é decorativo, sem substituir nenhuma função. Teclado e foco seguem iguais.
- **Parâmetros:** amplitude e período do balance, ângulo máximo, duração e ease do retorno.

## Ferramentas

Sem dependência nova. O pacote `gsap` já traz `Draggable` e `InertiaPlugin`, e o retorno pode usar `elastic.out` ou `CustomBounce`. Skills: `gsap-plugins`, `gsap-react`, `gsap-core`. Seguir o padrão do projeto com `useGSAP`, `gsap.matchMedia` e `contextSafe`.

## Governança

- Numerar como `003`, porque `002` já existe na branch.
- A constituição da `main` ainda proíbe Framer Motion, e o H1 aprovado usa `framer-motion`. Registrar uma emenda mínima só para isso, sem liberar shadcn nem desvios gerais do Figma.
- Não reabrir a spec 002 nem usar componentes da 21st.
