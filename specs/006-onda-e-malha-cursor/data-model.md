# Phase 1 Data Model: Onda Continua do Hero, Cursor Pontilhado e Brilho de Botoes (`006-onda-e-malha-cursor`)

**Feature**: `006-onda-e-malha-cursor`
**Date**: 2026-11-07
**Source Files**: `src/types/landing.ts`, `src/components/three/HeroBeamLazy.tsx`, `src/components/three/HeroBeamCanvas.tsx`, `src/components/motion/CursorDotMesh.tsx`, `src/app/globals.css`, `src/components/ui/CtaButton.tsx`, `src/components/ui/MagicCopyCard.tsx`

## 1. Parametros da Malha e Onda Continua do Hero (`HERO_WAVE_CONFIG`)

Constantes geometricas (JS em `HeroBeamLazy.tsx`) e de shader (GLSL em `HeroBeamCanvas.tsx`):

| Parametro | Valor | Papel Visual e Tecnico |
|-----------|-------|------------------------|
| `MESH_HALF_WIDTH` | `247` (`px`) | Meia-largura aprovada e travada (`13` celulas simetricas de `19px` para cada lado da corda; `494px` totais). |
| `CANVAS_WIDTH` | `504` (`px`) | `2 * 247 + 10px` de margem limpa: cobre `100%` dos pontos da malha sem transbordar a tela em `1024px`. |
| `WAVE_K_DIST` | `0.036` (`rad/px`) | Numero de onda lateral a partir da corda viva `cellCurveX` (comprimento de onda `~175px`). |
| `WAVE_K_Y` | `0.015` (`rad/px`) | Inclinacao descendente da frente de onda rumo ao card (`dy/dt > 0`). |
| `WAVE_SPEED` | `2.0` (`rad/s`) | Velocidade angular continua full-time (periodo `~3.14s`). |
| `WAVE_FALLOFF` | `155.0` (`px`) | Decaimento lateral `exp(-cordDist / 155.0)` mantendo a onda mais intensa perto do fio e suave longe dele. |
| `WAVE_MAX_SHIFT` | `1.3` (`px`) | Micro-ondulacao maxima dos pontos (`vec2(side * 1.1, 0.55)`, dentro da celula de `19px`). |
| `DOT_RADIUS_RANGE` | `1.4` a `1.85` (`px`) | Respiracao contida do diametro dos pontos entre vale e crista da onda. |
| `BASE_DOT_ALPHA` | `0.28` | Opacidade base dos pontos fixos sob `baseMask`. |
| `WAVE_CREST_ALPHA` | `0.36` | Ganho maximo de opacidade nas cristas junto a corda (limitado por `baseMask * lateralFalloff`). |

## 2. Estado em Tempo de Execucao do Cursor Pontilhado (`CursorMeshRuntimeState`)

Interface em `src/types/landing.ts`, mantida em `useEffect` / escopo de execucao dentro de `src/components/motion/CursorDotMesh.tsx` (zero re-renders React por quadro; `cardMute` e `targetCardMute` removidos no ajuste pos-`006` porque o cursor nao pode desaparecer sobre o card):

| Campo | Tipo | Valor Inicial | Descricao |
|-------|------|---------------|-----------|
| `targetX` | `number` | `-999` | Posicao `clientX` mais recente do ponteiro na janela. |
| `targetY` | `number` | `-999` | Posicao `clientY` mais recente do ponteiro na janela. |
| `x` | `number` | `-999` | Posicao `X` suavizada com amortecimento exponencial (`translate3d`). |
| `y` | `number` | `-999` | Posicao `Y` suavizada com amortecimento exponencial (`translate3d`). |
| `presence` | `number` | `0` | Opacidade global suavizada (`0` invisivel/hibernando ate `1` presente na janela). |
| `targetPresence` | `number` | `0` | Meta de presenca (`1` apos `pointermove` dentro da janela; `0` em `pointerleave`/`blur`/`hidden`). |
| `interactive` | `number` | `0` | Nivel suavizado (`0` a `1`) de sobreposicao a `a, button, [role='button']` (expande o raio em `+22%`). |
| `targetInteractive` | `number` | `0` | Meta instantanea (`0` ou `1`) de sobreposicao a elemento clicavel. |
| `elapsed` | `number` | `0` | Tempo acumulado em segundos para a respiracao angular da coroa Bayer `4x4`. |
| `rafId` | `number` | `-1` | Identificador do `requestAnimationFrame` ativo (`-1` quando hibernando com custo zero). |

## 3. Parametros Calibrados do Cursor Pontilhado (`CURSOR_MESH_CONFIG`)

| Parametro | Valor | Papel Visual e Tecnico |
|-----------|-------|------------------------|
| `PATCH` | `88` (`px`) | Tamanho logico do `<canvas>` 2D movido por `translate3d(x - 44, y - 44, 0)` em `fixed inset-0 z-50`. |
| `STEP` | `4` (`px`) | Passo da micro-grade (`22 x 22 = 484` celulas; cada ponto desenha `2 x 2 px` com `2px` de respiro). |
| `CROWN_RADIUS` | `24` (`px`) | Raio medio da coroa pontilhada (`~58px` de diametro visivel; sobe para `~29.3px` sobre controles). |
| `OUTER_CUTOFF` | `40` (`px`) | Limite onde o campo zera suavemente (`4px` antes da borda de `44px`: zero corte quadrado). |
| `FOLLOW_RATE` | `24` (`1/s`) | Resposta rapida quase colada ao ponteiro com leve resto de inercia (`~0.33`/frame em `60Hz`). |
| `PRESENCE_IN` | `9` (`1/s`) | Subida suave na entrada do ponteiro (`~0.22s`). |
| `PRESENCE_OUT` | `6.5` (`1/s`) | Saida suave ao deixar a janela (`~0.30s`), encerrando o `rAF` ao cruzar `< 0.01`. |
| `INTERACTIVE_RATE` | `8` (`1/s`) | Velocidade de abertura/fechamento da coroa sobre links e botoes. |
| `MAX_ALPHA` | `0.9` | Opacidade maxima (`Math.min(0.9, field * 0.95) * fade`) com blending normal. |
| `COLOR` | `#C9B3FF` | Lilas claro de alto contraste visivel sobre `#09090B`, cards escuros e botao claro do `Banner`. |

## 4. Tokens CSS de Selecao e Brilho Interativo dos Botoes (`globals.css` + `CtaButton.tsx`)

| Alvo / Variante | Token / Regra | Valor | Comportamento |
|-----------------|---------------|-------|---------------|
| `::selection` | `background` / `color` | `rgb(167 81 251 / 0.45)` / `#fff` | Selecao de texto com a cor da marca em toda a pagina. |
| `.cursor-mesh, .cursor-mesh *` | `cursor` | `none !important` | Aplicado em `<html>` apenas enquanto `CursorDotMesh` esta montado e pronto. |
| `.btn-shine` (`primary-gradient` / `MagicCopyCard`) | `--shine` | `#fff` | Arco conico branco (`2.4s`), pontos `4px` e glow em `:hover`/`:focus-visible` + compressao em `:active`. |
| `.btn-shine` (`primary-light` no `Banner`) | `--shine` | `#A751FB` | Arco e glow purpura contrastando sobre o fundo claro `bg-purple-01`. |
| `.btn-shine` (`secondary-dark` no `Header`) | `--shine` | `#C082FF` | Arco e glow lilas sobre `bg-gray-09` e borda `border-gray-08`. |

## 5. Matriz de Operacao por Ambiente

| Ambiente | Malha do Hero (`HeroBeamLazy` / `Canvas`) | Cursor Pontilhado (`CursorDotMesh`) e Seta Nativa | Botoes (`.btn-shine`) |
|----------|-------------------------------------------|--------------------------------------------------|-----------------------|
| **iPhone / Mobile (`< 1024px`, toque, WebKit)** | Oculta (`hidden lg:block`), Three.js nao baixado | Desmontado (`return null`), sem `.cursor-mesh` | Sem giro se `reduceMotion`; toque sem hover fantasma |
| **Tablet / Notebook Touch sem mouse (`!canHover`)** | Em `>= 1024px`: onda continua ativa no Hero | Desmontado (`return null`), seta/toque nativo preservado | Estado padrao |
| **Qualquer tela + `prefers-reduced-motion: reduce`** | Em `>= 1024px`: apenas `DotMatrixDecor` estatico de `247px` | Desmontado (`return null`), **seta nativa preservada** | Glow estatico; `animation: none`, sem `scale`/`translate` |
| **Desktop (`canHover`) no carregamento inicial (sem mover mouse)** | Onda continua ativa no Hero | Montado em `z-50` com `rafId = -1` (`0%` CPU / Lighthouse intacto) | Repouso identico ao Figma (`paused`, `opacity: 0`) |
| **Desktop (`canHover`) movendo mouse na pagina** | Onda continua ativa (sem hover local) | Seguindo ponteiro em `z-50` (`#C9B3FF`), seta oculta via `.cursor-mesh` | Arco `2.4s` + pontos + glow no hover; pressao no clique |
| **Desktop (`canHover`) rolando nas secoes inferiores** | **Pausada (`frameloop="never"`)** | Ativo em `z-50` sobre `Recursos`, `Banner` e `Footer` | Ativo |
| **Desktop (`canHover`) com mouse fora da janela / aba oculta** | Visivel apenas com Hero em tela | Esmaece em `~0.3s`, limpa o canvas e **cancela `rAF` (`rafId = -1`)** | Repouso |
