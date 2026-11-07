# Quickstart & Validation Guide: Feature 006 (`006-onda-e-malha-cursor`)

**Feature**: `006-onda-e-malha-cursor`
**Date**: 2026-11-07 (atualizado com os ajustes aprovados no `Handoff 07`)
**References**: [data-model.md](./data-model.md) | [hero-wave-and-cursor-mesh-contract.md](./contracts/hero-wave-and-cursor-mesh-contract.md)

## Pre-requisitos e Linha de Base (Antes de Fechar Performance)

1. Permanecer na branch `main` (sem criar branch, sem `git commit`, sem `git push`, sem novas dependencias e sem ler `.env*`).
2. **Medicao de referencia Lighthouse (`antes` - `T001`)**:
   - Medir 3 rodadas de Lighthouse Mobile e 3 rodadas de Lighthouse Desktop em build de producao (`npm run build` + `npm run start`) sobre o commit base limpo `333c3a4` (usando `git stash push -u` temporario com `git stash pop` imediato) e registrar as medianas `antes`.

---

## Cenario 1: Validacao Estatica, Tipos e Build de Producao (Validado)

```powershell
npm run lint
npm run build
```

**Resultado esperado**: Codigo `0` em ambos, sem avisos de TypeScript/ESLint e sem alteracao em `package.json`.

---

## Cenario 2: Onda Continua na Malha do Hero e Ausencia de Hover Local (`US1` - Validado)

1. Abrir em Desktop (`1440x900` e `1024x768`) mantendo o mouse parado longe da coluna direita:
   - Confirmar que a malha do Hero ocupa exatamente `247px` para cada lado da corda (alinhada a `"criacao"` no `H1`), opera como grade unica (`0` pontos duplicados) e exibe **onda continua em tempo integral** descendo pelo fio e abrindo-se para as laterais, sem barra de rolagem horizontal em `1024px`.
2. Passar o mouse sobre a malha acima do card:
   - Confirmar que **nao existe mais** foco de hover local na malha da corda (`uMouse`/`uHover` removidos).
3. Inclinar o card `"Magic copy"` e observar a chegada do `beamPulse`:
   - Confirmar que a origem da onda acompanha a curva viva da corda, o traco `<svg>` de `4px` permanece `100%` nitido (`cordClearance`) e o card continua inclinando normalmente.

---

## Cenario 3: Espectro Como Proprio Cursor, Selecao da Marca e Brilho dos Botoes (`US2` e `US4` - Validado)

1. Mover o ponteiro por `Header`, `Hero`, `Recursos`, `Banner` e `Footer`:
   - Confirmar que `<html>` recebe `.cursor-mesh`, a seta padrao do navegador fica oculta e o ponteiro e representado apenas pelo espectro pontilhado Bayer `4x4` (`#C9B3FF`, `z-50`, `FOLLOW_RATE = 24`).
2. Cruzar o `MagicCopyCard`, a janela do Figma e o bloco + botao claro `"Usar no Figma"` do `Banner`:
   - Confirmar que o espectro permanece visivel acima de todas essas superficies com blending normal (sem sumir no card nem no botao claro), expande `+22%` sobre links/botoes e nao bloqueia nenhum clique.
3. Retirar o ponteiro da janela (`pointerleave` / `blur`):
   - Confirmar desaparecimento suave (`~0.3s`) e encerramento do `requestAnimationFrame` (`rafId = -1`).
4. Selecionar texto em titulos e paragrafos:
   - Confirmar destaque roxo `rgb(167 81 251 / 0.45)` com texto `#fff`.
5. Testar repouso, hover/`:focus-visible` e clique (`:active`) nas tres variantes de `CtaButton` e no `"Start now"` do `MagicCopyCard`:
   - Confirmar fidelidade ao Figma em repouso, arco conico giratorio (`2.4s`) + pontos `4px` + glow na cor da variante (`#fff`, `#A751FB`, `#C082FF`) no hover/foco, e leve pressao (`translate: 0 1px`, `scale: 0.98`) com glow intenso no clique.

---

## Cenario 4: Chromium + WebKit (Desktop e iPhone), Movimento Reduzido e Lighthouse (`US3` - Parcial: falta Lighthouse `T001`/`T010`)

1. **Playwright Chromium e Playwright WebKit (Validado)**:
   - Desktop (`1440x900` e `1024x768`) nos dois motores com transparencia limpa do shader e da mascara de `.btn-shine`.
   - Mobile iPhone em WebKit (`390x844` e `430x932`) confirmando `0` nos DOM de `CursorDotMesh`, ausencia de `.cursor-mesh`, malha Desktop do Hero nao carregada e `MagicCopyCard` sem nenhum corte.
2. **Movimento reduzido e pausa fora da tela (Validado)**:
   - Com `prefers-reduced-motion: reduce`, confirmar que `CursorDotMesh` desmonta e devolve a seta nativa, o Hero Desktop exibe apenas `DotMatrixDecor` estatico de `247px` sem onda e `.btn-shine` desativa giro e afundamento.
   - Rolando ate o `Footer`, confirmar pausa de `HeroBeamCanvas` (`frameloop="never"`).
3. **Medicao Lighthouse (`depois` - `T010`, Pendente)**:
   - Repetir 3 rodadas Mobile e 3 rodadas Desktop em build de producao e confirmar medianas `depois >= antes` (`T001`).
