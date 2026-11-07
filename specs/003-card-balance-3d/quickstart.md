# Quickstart & Validation Guide: Feature 003 (`003-card-balance-3d`)

**Feature**: `003-card-balance-3d`
**Date**: 2026-11-06

## Pre-requisitos

- Repositorio na branch `main` (base `commit 325dbfb` + efeito aprovado do `H1` em `src/components/ui/animated-shiny-text.tsx`).
- Zero pacotes novos a instalar (`gsap` ja instalado contem `gsap/Draggable`).
- Proibido criar branches, executar `git commit` ou `git push`, ou ler `.env*`.

---

## Cenario 1: Validacao Estatica e Build de Producao

```powershell
npm run lint
npm run build
```

**Resultado esperado**: Ambos encerram com codigo `0`, sem avisos de TypeScript ou ESLint e sem qualquer modificacao em `package.json`.

---

## Cenario 2: Balance Sutil e Encontro com o Feixe (`US1`)

1. Subir a aplicacao (`npm run dev` ou `npm run start`) e abrir `http://localhost:3000` em viewport Desktop (`1440px`) e Mobile (`430px`) com `prefers-reduced-motion: no-preference`.
2. Observar o card `"Magic copy"` em repouso por pelo menos `6s`:
   - O card executa um balanco tridimensional sutil e continuo (~`5.6s` por ciclo) sem sair de sua posicao no layout.
   - No Desktop (`1440px`), o feixe vertical roxo permanece colado a borda superior do card durante todo o ciclo (`0px` de fresta escura), e a altura visivel do feixe acima do card permanece identica ao layout original.
   - No Mobile (`430px`), a perspectiva funciona normalmente dentro do container escalado (`scale-[0.885]`) e o recorte arredondado (`overflow-hidden`) nao vaza o brilho interno.
3. Rolar ate o rodape (`Footer`) de modo que o Hero saia completamente da tela:
   - Confirmar que a timeline de balance do card entra em pausa enquanto fora da viewport e retoma suavemente ao voltar ao topo.

---

## Cenario 3: Arraste 3D nas 4 Direcoes, Bounce e `"Start now"` (`US2`)

1. Em Desktop (`1440px`) com mouse:
   - Passar o cursor sobre o corpo do card (fora de `"Start now"`): cursor exibe `grab`.
   - Pressionar e arrastar `>= 6px` para cima, baixo, esquerda, direita e diagonais: o balance autonomo pausa, o cursor muda para `grabbing`, nenhum texto interno e selecionado, o card inclina-se em 3D acompanhando o mouse ate ~`±14°/±16°` sem sair do lugar e **sem abrir vao em relacao ao feixe no topo**.
2. Soltar o botao do mouse (testar soltando sobre o card e tambem arrastando ate fora da janela antes de soltar):
   - O card retorna ao centro `(0°, 0°, 0°)` com bounce elastico visivel (~`0.9s`) e, ao estabilizar, retoma o balance sutil sem nenhum tranco ou pulo de angulo.
   - Repetir um segundo arraste imediatamente em seguida: confirmar que o angulo parte de `0°` (sem acumular offset do arraste anterior) e que interromper o bounce no meio funciona sem conflito.
3. Clicar em `"Start now"` `5` vezes seguidas (incluindo cliques rapidos e cliques com leve oscilacao do mouse sobre o botao):
   - Em `100%` das tentativas, nenhum arraste do card e iniciado; o burst roxo do card, a aceleracao de `"Generating..."` e o giro do emblema 3D disparam normalmente.

---

## Cenario 4: Toque no Celular, Lenis, Movimento Reduzido e Teclado (`US3`)

1. No DevTools em modo Mobile (`430px`, emulacao de toque ativa):
   - Apoiar o toque diretamente no meio do card `"Magic copy"` e deslizar verticalmente para cima e para baixo: a pagina DEVE rolar livremente sem travar o gesto no card.
2. No Desktop com movimento padrao:
   - Rolar a pagina com a roda do mouse (`Lenis` ativo) antes, durante e apos interagir com o card: scroll suave flui sem disputa.
3. Ativar `prefers-reduced-motion: reduce` (testar com a pagina ja aberta e tambem recarregando):
   - O balance cessa instantaneamente, o card fica plano (`0°`), o cursor `grab` desaparece e tentar pressionar/arrastar o card nao produz nenhuma inclinacao nem bounce.
4. Navegar pelo Hero exclusivamente com `Tab`, `Shift+Tab` e `Enter`/`Space`:
   - O foco chega diretamente ao botao `"Start now"` (sem tab stops fantasmas de arraste) com `:focus-visible` nitido e aciona o feedback demonstrativo normalmente.
5. Verificar preservacao da `main`:
   - Brilho animado do `H1`, oval de `"interfaces"` e rabisco de `"Border-IA"` intactos; zero ocorrencias de `U+2014` nos arquivos editados.

---

## Resultado da Implementacao (Claude Code, 2026-11-07)

Validado em build de producao na porta `3112`, porque a `3000` pertence ao gestao-termos.

**Desvios tecnicos da spec, com o mesmo comportamento:**

- Sem `gsap.quickTo` nem `overwrite: "auto"`: o overwrite apagava trechos da timeline `balanceTl` pausada e o balance parava de voltar depois de alguns arrastes. Um unico tween de inclinacao e trocado manualmente.
- Sem `data-no-card-drag`: `dragClickables: false` ja protege o botao `"Start now"`.
- O deslocamento e medido por `pointerX` e `pointerY`, sem depender do proxy.
- `scale 1.015` entra junto com a inclinacao, sem tween separado de `0.2s`.
- `uPulse` nao foi renormalizado: a diferenca de chegada no topo do card e de cerca de `0.03s`.
