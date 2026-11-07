# Quickstart & Validation Guide: Feature 002 (Design Polish 21st.dev)

**Feature**: `002-design-polish-21st`
**Date**: 2026-11-06

## Pre-requisitos

- Node.js LTS e dependencias atuais instaladas (`npm install`).
- Branch ativa: `main` (proibido criar branches, commits ou push autonomamente).
- Proibido ler arquivos `.env` ou `.env.*`.

---

## Cenario 0: Linha de Base do Lighthouse ANTES de `S1` (Obrigatorio em `T001`)

Antes de modificar qualquer arquivo de codigo ou instalar pacotes:

1. Gerar build de producao atual (`commit 325dbfb`):
   ```powershell
   npm run build
   ```
2. Iniciar servidor de producao em background (ex.: porta `3000`) e medir Performance no Lighthouse CLI (Desktop e Mobile):
   ```powershell
   npx lighthouse http://localhost:3000 --only-categories=performance --preset=desktop --chrome-flags="--headless=new" --output=json --output-path=./.lighthouse-baseline-desktop.json
   npx lighthouse http://localhost:3000 --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=./.lighthouse-baseline-mobile.json
   ```
   *(Remover arquivos JSON temporarios apos extrair os valores para nao sujar o repositorio.)*
3. Registrar os valores medidos abaixo durante a execucao de `T001`:
   - **Baseline Desktop Performance (`commit 325dbfb`)**: `80` (mediana de 3: 76, 80, 82; TBT 450 ms, LCP 0.8 s)
   - **Baseline Mobile Performance (`commit 325dbfb`)**: `64` (mediana de 3: 61, 64, 64; TBT 2.510 ms, LCP 3.3 s)

---

## Cenario 1: Portao de Integridade Pos-Setup (`S1` a `S3`)

Logo apos configurar `shadcn/ui` (`S1`), instalar `motion` (`S2`) e importar/adaptar os componentes base da `21st.dev` (`S3`):

```powershell
npm run lint
npm run build
```

**Resultado esperado**: Ambos os comandos encerram com codigo `0`, confirmando que `components.json`, `src/lib/utils.ts`, `src/app/globals.css` e os componentes em `src/components/ui/21st/` compilam sem erros de TypeScript ou CSS no Tailwind v4.

---

## Cenario 2: Fidelidade Responsiva (`1440px` e `430px`) e Navegacao Mobile

1. Abrir a aplicacao em `http://localhost:3000` nas larguras `1440px` (Desktop), `430px` (Mobile) e `320px` (estreita).
2. Verificar ausencia de rolagem horizontal em todas as larguras:
   `document.documentElement.scrollWidth <= window.innerWidth`.
3. Conferir contra `docs/design/screens/` que as unicas mudancas visuais sao as aprovadas na lista (`CM-10` e `D1` a `D7`):
   - `D5`: Capsula translucida no topo com `BorderIaLogo`, links diretos (`"Recursos"`, `"Sobre"`, `"Depoimentos"`, zero dropdowns) e `"Comunidade"`; abaixo de `1024px`, botao de menu mobile abre/fecha por toque, `Enter` e `Escape`.
   - `D1`: Borda luminosa acompanha o cursor nos 4 cards de `#recursos` no Desktop e fica inativa em simulacao touch (`hover: none`).
   - `D2`: Luz na borda de `MagicCopyCard` corre sincronizada ao pulso do feixe e ao clique em `"Start now"`, sem loop concorrente.
   - `D3`: Brilho conic ativo apenas no CTA `"Usar no Figma"` do Hero (`primary-gradient`); `"Start now"` permanece sem borda conic.
   - `CM-10` + `D6`: Em `#depoimentos`, os 5 elementos do banner revelam-se em sequencia dentro de `0.65s`, as malhas dos cantos exibem onda radial enquanto visiveis e o `TestimonialMarquee` mostra os 4 avatares locais com badge visivel `"Conteúdo provisório"`.
   - `D7`: Novo rodape em `#09090B` com feixe roxo/indigo, wordmark `"Border-IA"`, apenas links de `SITE_LINKS` e credito `"Desenvolvido por: João Gabriel"`.

---

## Cenario 3: Auditoria Estrita de `prefers-reduced-motion: reduce`

1. Ativar emulacao `prefers-reduced-motion: reduce` no navegador (testar tanto recarregando a pagina quanto alternando em tempo real com a pagina ja aberta).
2. Confirmar ausencia total (`0` ocorrencias) de movimento em:
   - Brilho conic do botao `"Usar no Figma"` (`D3`);
   - Luz perimetral do `MagicCopyCard` (`D2`);
   - Onda radial nas malhas `DotMatrixDecor` (`CM-10`);
   - Deslocamento do `TestimonialMarquee` (`D6`);
   - Transicoes/deslocamentos/escalas nos 6 hovers de `D4` (links do `Header`, `BorderIaLogo`, base do `CtaButton`, icones de `FeaturesSection`, links sociais do `Footer` e `"Start now"` do `MagicCopyCard`) e nos novos componentes `D5`/`D7`.

---

## Cenario 4: Lighthouse Final (`>= 90`), Trava de Publicacao (`D6`) e Higiene Textual

1. Executar `npm run lint` e `npm run build` (devem encerrar com codigo `0`).
2. Repetir a medicao do Lighthouse em build de producao e comparar contra o Cenario 0:
   - **Meta obrigatoria**: Nota de Performance `>= 90` mantendo paridade saudavel com a linha de base.
3. Executar a trava de prontidao para publicacao:
   ```powershell
   npm run verify:release
   ```
   **Resultado esperado enquanto os depoimentos forem provisorios**: Encerra com codigo `1` informando claramente que `TESTIMONIALS_VERIFIED` esta `false` / existem placeholders em `D6` aguardando a copy real do Joao Gabriel.
4. Varredura por travessao proibido (`U+2014`) e URLs temporarias em `src/`, `scripts/` e `specs/002-design-polish-21st/`: `0` ocorrencias.

---

## Resultado da Implementacao (Claude Code, 2026-11-06)

Medicao em build de producao na porta `3112` (a `3000` pertence ao gestao-termos), Lighthouse 12, mediana de 3 execucoes:

| Perfil | Baseline | Final | TBT | LCP | Meta `>= 90` |
|--------|----------|-------|-----|-----|---------------|
| Desktop | `80` | `93` (89, 93, 96) | `190 ms` | `0.9 s` | Atingida |
| Mobile | `64` | `67` (64, 67, 69) | `1.070 ms` | `3.7 s` | **Nao atingida** |

`T017` segue aberta por causa do Mobile. O bloqueio restante sao duas tarefas longas de cerca de `600 ms` no chunk do React (hidratacao).

**Contingencia de `T004`:** os 6 IDs retornaram `retrieval_limit_reached` (limite 2, renovacao em `2026-11-08`). Os componentes de `src/components/ui/21st/` sao reconstrucoes locais fieis a `contracts/ui-contracts.md`, marcadas com `shortcut:`. Nenhum deles usa `motion`.

**Divergencias entre contrato e codigo real (vale o codigo):** a malha e `/icons/dot-matrix.webp` (rasterizada do SVG, por custo de renderizacao); as variantes reais sao `primary-light` e `secondary-dark`; os cards sao `li`; `data-m="header"` fica na capsula; os hex da tabela de tokens diferem da paleta, entao vale o mapeamento por variavel.

**Otimizacao adicional fora da lista:** o Three.js so carrega apos a primeira interacao ou 6 s (`useDeferredStart`).

