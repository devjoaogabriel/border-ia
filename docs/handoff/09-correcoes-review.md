# Handoff 09: correções do code review e TBT no Mobile

## Pedido do João

Projetar a spec `008` com as correções do code review (`docs/review/01-code-review.md`) e a investigação do TBT no Mobile.

## Estado atual (`main`, commit `9d823c0`)

- A spec 007 foi implementada: 8 suítes Vitest e 90 testes em ambiente `node`, rodando em cerca de 1 s.
- A lógica saiu dos componentes para `src/lib`:
  - `cursor-mesh-math.ts`, `hero-beam-math.ts` e `card-tilt-math.ts`;
  - `links.ts` (`resolveSiteLinkAttributes`) e `mask-style.ts` (`buildMaskStyle`).
- Guardas de repositório em `src/security/`. Escalabilidade em `src/lib/scalability-budget.test.ts`.
- Config: `vitest.config.mts` (renomeada de `.ts` por aviso do Vite).
- Desvio da 007: a corda não é simétrica entre `±rotationY` por causa da perspectiva. O teste cobre a propriedade real (curva para o lado do giro).

## Itens da spec 008

Os itens marcados como confirmados foram verificados no código pelo Claude Code.

1. **CR-01:** cursor some com caneta ou stylus, antes do primeiro movimento e ao clicar depois de `blur`. Aceitar `pen`, aplicar `.cursor-mesh` só no primeiro evento válido, acordar com `pointerdown` e garantir o ponto central aceso.
2. **CR-02 (confirmado):** `PluginPrismLogoLazy` só checa `reduceMotion` e baixa o Three.js no Mobile (cerca de 250 KB gzip) para um ícone de 56 px. Montar o 3D só em Desktop e manter o `BorderIaMark` no Mobile.
3. **CR-03:** `canvasReady` e `ready` nunca voltam a `false` ao sair do Desktop ou perder o contexto WebGL, e o fallback some.
4. **CR-04 (confirmado):** na seção Recursos, entre 1024 e cerca de 1260 px, o título "Amplificador de imagem" invade a coluna vizinha (`lg:whitespace-nowrap`).
5. **CR-05:** giro do arco, pulso do card e `gsap.ticker` continuam rodando fora da tela, no Mobile e com movimento reduzido.
6. **CR-11 (confirmado):** o Tailwind lê `docs/` e `specs/` e gera classes mortas no CSS de produção (`mix-blend-screen`, `cursor-grab`). Além disso, `transition-property` da `.btn-shine` é anulado pelo utilitário `transition`.
7. **TBT no Mobile:** o Lighthouse foi de 54 para 52, com TBT de 3,6 s para 5,6 s entre `333c3a4` e o estado atual. O aumento apareceu nas 3 rodadas e está na execução do chunk do React (hidratação), não no Three.js nem no shader. Investigar a causa, com hipóteses a testar: `CursorDotMesh` montando no Mobile emulado, `useMediaQuery` sem `subscribe` estável (CR-10), re-render pós-hidratação. Os números completos estão no fim de `specs/007-testes-vitest/tasks.md`.

Os demais achados (CR-06 a CR-13 e o relatório de segurança, como cabeçalhos e CSP) ficam fora. Se algum deles for barato e cair no mesmo arquivo, sugira incluir.

## Regras para a spec

- Cada correção com lógica testável ganha teste Vitest antes (TDD). Os 90 testes atuais precisam continuar verdes.
- Medir o Lighthouse antes e depois (3 rodadas Mobile e 3 Desktop, `lighthouse@12.8.2`), com meta de recuperar o TBT Mobile.
- Testar em Chromium e WebKit.
- Sem dependência nova sem liberação do João. Não alterar o visual aprovado (brilho do H1, oval, rabisco, logo, card, corda, onda, cursor e botões).
- Trabalhar na `main`, sem branch, sem commit e sem push.
- Proibido travessão (U+2014).
