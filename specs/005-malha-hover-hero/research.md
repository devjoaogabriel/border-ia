# Phase 0 Research & Post-Review Outcome (`005-malha-hover-hero`)

**Feature**: `005-malha-hover-hero`
**Date**: 2026-11-07
**Base Codebase**: Branch `main` (`commit 333c3a4`, com alteracoes sem commit inspecionadas em `git diff`)

## R-01: Desfecho do Hover Inspirado em `https://antigravity.google/` (REJEITADO NA REVISAO -> SAI NA `006`)

- **O que foi testado na `main`**: Foi implementado no shader de `HeroBeamCanvas.tsx` o foco radial seguindo o cursor (`uMouse`, `uHover`) com amortecimento exponencial em `useFrame`, coroa respirante e recuo radial dos pontos, calibrado durante a revisao ate valores sutis (`sigma = 34px`, `ringR = 44px`, `push <= 1.6px` e `cursorHalo = 0.05`) sobre um `<Canvas>` alargado para `CANVAS_WIDTH = 680px`.
- **Resultado da revisao pelo Joao Gabriel (Handoff 06)**: Na primeira versao a area pareceu curta; apos alargar o campo da malha, o circulo de brilho pareceu grande; mesmo reduzido para `~34px` de raio, o efeito de foco de hover na regiao da corda **nao foi aceito e sai**.
- **Destino**: Removido integralmente na feature `006-onda-e-malha-cursor`, substituido por uma onda continua em tempo integral na malha do Hero e uma malha pontilhada que acompanha o ponteiro em qualquer local da pagina (`https://kc1t.com/pt-br`).

## R-02: Campo Simetrico de `247px` com Gradiente (ACEITO E MANTIDO)

- **Decision**: Ampliar a meia-largura da malha do Hero de `110px` (`inset-x-[60px]`) para **`MESH_HALF_WIDTH = 247`** (`-inset-x-[77px]` sobre o container de `340px`, totalizando `494px` centrados em `BEAM_CENTER = 170`).
- **Rationale**:
  - `243px` para a esquerda do fio alcanca exatamente o fim da palavra `"criacao"` no `H1` (medido em `1280px`, `1440px` e `1920px`).
  - Arredondar para **`247px` (`13 * 19px`)** posiciona exatamente `13` celulas inteiras de `19px` para cada lado da corda, deixando os pontos perfeitamente simetricos e em formato de gradiente (mais visiveis perto do fio por `fall = exp(-dist / 90.0)` + mascara eliptica `baseMask` e mais suaves longe dele).
  - **Regra fixa do Joao**: Campo aceito em `247px`, **nao aumentar mais**.

## R-03: Grade Unica Alinhada entre `DotMatrixDecor` e Shader (ACEITO E MANTIDO)

- **Decision**: Manter `DotMatrixDecor variant="css"` (`-inset-x-[77px] top-[60px] bottom-7`) visivel no SSR, no primeiro paint e sob `prefers-reduced-motion: reduce`, e aplicar `opacity-0` assim que `HeroBeamCanvas` disparar `onCreated` (`canvasReady = true`). A partir desse instante, o shader desenha tambem os pontos fixos em `gridOrigin = vec2(-uMeshHalf, 60.0)` com raio solido ate `1.4px` sumindo em `1.8px` e mascara `closest-side` de `25%` (`baseMask`).
- **Rationale**: Elimina o desalinhamento de `~3px` que existia entre as duas grades sobrepostas, permitindo que animacoes nos pontos (como a onda continua da `006`) atuem sobre uma unica grade coesa sem sombras estaticas atras.

## R-04: Folga da Corda (`cordClearance`) e Recorte Desktop (`lg:overflow-x-clip`)

- **Decision**:
  1. Manter `cordClearance = smoothstep(1.8, 4.5, beamDist)` multiplicando os pontos da malha para nunca encobrir o `<svg>` de `4px` da corda.
  2. Durante a `005`, `HeroSection.tsx` recebeu `lg:overflow-x-clip` porque `CANVAS_WIDTH = 680` ultrapassava `43px` da borda direita em `1024px` (restrito a `lg:` para nunca recortar o card 3D no iPhone). Na `006`, com a remocao do hover externo, a largura do canvas reduz-se ao necessario para o campo de `247px`, permitindo reavaliar e limpar `lg:overflow-x-clip` caso nao haja mais sobra alem da viewport.
