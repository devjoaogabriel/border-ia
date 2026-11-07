# Quickstart & Validation Guide: Feature 004 (`004-movimento-hero-conectado`)

**Feature**: `004-movimento-hero-conectado`
**Date**: 2026-11-07

## Pre-requisitos e Linha de Base (Antes de Implementar)

1. Permanecer na branch `main` (zero branches, zero commits, zero pushes, zero novas dependencias, zero leitura de `.env*`).
2. **Medicao previa de referencia (Lighthouse)**:
   - Rodar `npm run build` e iniciar `npm run start` (ex.: porta `3111` para nao colidir com outros projetos locais).
   - Medir 3 rodadas de Lighthouse Mobile e 3 rodadas de Lighthouse Desktop no estado atual da `main` e anotar a mediana `antes` (referencia conhecida Mobile ~`63`).

---

## Cenario 1: Validacao Estatica e Build de Producao

```powershell
npm run lint
npm run build
```

**Resultado esperado**: Codigo de saida `0` em ambos, sem avisos de TypeScript/ESLint e sem alteracao em `package.json`.

---

## Cenario 2: Hover 3D no Card, `"Start now"` e Logo 3D (`US1`)

1. Abrir a aplicacao em Desktop (`1440x900`) com ponteiro preciso e movimento padrao:
   - Confirmar que o card **nao** exibe cursor `grab` e inclina suavemente ao simples entrar e mover o mouse (sem clicar), dentro de `±10°` vertical e `±12°` horizontal, sem salto na entrada (inclusive entrando pelas quinas) e sem deslocar-se do lugar.
   - Passar o mouse sobre `"Start now"` e clicar `5` vezes: cursor `pointer` normal, inclinacao suavemente atenuada para firmeza do clique e `100%` dos cliques disparando o burst roxo.
   - Confirmar que o emblema 3D (`PluginPrismLogoLazy`) acompanha de forma contida (`<= 4.5°`) sem exagerar a soma de rotacao.
   - Tirar o mouse do card: retorno elastico (`~0.85s`) ate `(0°, 0°, 0°)` e retomada sem tranco do balance (`5.6s`). Reentrar no meio do bounce: retomada imediata e suave do hover.

---

## Cenario 3: Linha do Feixe Conectada e Pulso Curvo (`US2`)

1. Em Desktop (`1440x900`):
   - Em repouso (`0°` e durante o balance), confirmar que a linha vertical esta `100%` visivel com seu gradiente original (`white -> #C2BAFE -> #8A6DFE`) e oscila sutilmente junto ao card.
   - Mover o cursor entre esquerda, direita, topo e base do card e tirar rapidamente: o topo do feixe fica cravado no alto, a metade inferior curva-se com leve atraso/amortecimento de fio fisico e a ponta no topo do card mantem **`0px` de fresta** em todos os angulos.
   - Aguardar a passagem do pulso luminoso (`beamPulse`) enquanto mantem o card inclinado para a esquerda e para a direita: o pulso do shader percorre **exatamente o centro da linha curva**, sem seguir uma reta separada, acendendo o brilho interno do card na chegada.

---

## Cenario 4: Bounce da Janela Figma, Mobile, WebKit, Reduced Motion e Lighthouse (`US3`)

1. **Janela do Figma (Desktop `1440x900` e Mobile `430x932`)**:
   - Apos o reveal inicial (~`1.1s`), a janela flutua suavemente na vertical (`±6px` Desktop / `±4px` Mobile, ciclo `4.8s`) sem conflitar com o parallax `y: -28` durante a rolagem, sem revelar corte na base mascarada nem nas laterais e com `document.documentElement.scrollWidth <= window.innerWidth`.
2. **Dupla verificacao de motor: Chromium + WebKit (iPhone / Safari)**:
   - Executar verificacao em **Playwright Chromium** e **Playwright WebKit** em `1440x900` e `430x932` (iPhone):
     - Confirmar visibilidade da linha SVG em `0°` no WebKit (`gradientUnits="userSpaceOnUse"`).
     - Confirmar ausencia de intersecao 3D (`Z-fighting`) entre o card inclinado e a janela/feixe atras dele no WebKit (`isolate` em `[data-card-stage]`).
     - Confirmar no Mobile (`430x932` com toque) que o card apenas executa o balance sutil (sem hover preso) e que deslizar verticalmente sobre o card e sobre a janela rola a pagina livremente.
3. **Fora da tela e `prefers-reduced-motion: reduce`**:
   - Rolar ate o `Footer`: bounce da janela, ticker/WebGL do feixe, balance do card e logo 3D ficam pausados.
   - Ativar `prefers-reduced-motion: reduce`: janela parada, linha reta estatica visivel, card plano (`0°`) sem balance, sem hover e sem bounce.
4. **Medicao pos-implementacao (Lighthouse)**:
   - Medir novamente 3 rodadas de Lighthouse Mobile e 3 rodadas Desktop em build de producao (`npm run build && npm run start`) e confirmar que a mediana Mobile **nao piorou** em relacao a medicao `antes`.

---

## Medicao de Referencia (T001, Claude Code, 2026-11-07)

Build de producao de `7affc54` na porta `3112`, Lighthouse 12, mediana de 3 execucoes: **Desktop `67`** (67, 67, 69; TBT `980 ms`) e **Mobile `52`** (50, 52, 56; TBT `5.450 ms`, LCP `4.6 s`). A referencia de `63` citada na spec era anterior ao card 3D e ao SVG.


## Resultado da Implementacao (Claude Code, 2026-11-07)

Validado em Chromium e WebKit, Desktop e Mobile, no build de producao.

| Perfil | Antes | Depois | Execucoes |
|--------|-------|--------|-----------|
| Desktop | `67` | `75` | 66, 75, 80 |
| Mobile | `52` | `56` | 55, 56, 60 |

As medicoes oscilam bastante nesta maquina. A meta `>= 90` da constituicao segue nao atingida nos dois perfis.

**Desvios tecnicos da spec, com o mesmo comportamento:**

- A flutuacao usa `fromTo` de `+6` a `-6` (`+4` a `-4` no Mobile), sem `delay`, para cumprir o `±6px` do `FR-007`. O codigo sugerido em `T009` iria so de `0` a `-6`.
- A inclinacao mede o palco a cada `pointermove`, nao so no `pointerenter`, para continuar certa se a pagina rolar durante o hover.
- O hover ignora ponteiros que nao sejam mouse (`pointerType`), o que cobre notebooks com tela de toque.
- Se o bounce terminar com o card fora da tela, o balance volta ao inicio pausado, para nao saltar ao retornar.
