---
description: "Lista ordenada de tarefas para implementacao da feature 002-design-polish-21st"
---

# Tasks: Polimento Visual e Componentes Elevados da Landing Page Border-IA

**Input**: Design documents from `/specs/002-design-polish-21st/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contracts.md`, `quickstart.md`)

**Prerequisites**: `plan.md` (obrigatorio), `spec.md` (obrigatorio), codigo-fonte atual em `main` (`commit 325dbfb`), `docs/handoff/02-melhorias-design-21st.md`

**Tests**: Validacao estatica (`npm run lint`, `npm run build`), medicao comparativa Lighthouse Performance (`>= 90`), verificador `npm run verify:release` e roteiro completo em `specs/002-design-polish-21st/quickstart.md`.

**Organization**: Sequencia estrita definida pelo handoff: linha de base e setup (`S1`-`S4`) em Phase 1, pendencias da feature 001 (`CM-10` e `D4`) em Phase 2, seguidas pelas melhorias `D1` a `D7` agrupadas por prioridade nas historias de usuario (`US1 = P1`, `US2 = P2`, `US3 = P3`) e validacao final em Phase 6.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta na mesma fase)
- **[Story]**: Rotulo da historia de usuario (`[US1]`, `[US2]`, `[US3]`), exclusivo das fases de User Story
- Toda tarefa traz caminho exato de arquivo e criterio objetivo de aceite

---

## Phase 1: Setup (Linha de Base Lighthouse e Infraestrutura S1 a S4)

**Purpose**: Medir a linha de base de performance antes de qualquer mudanca e resolver `S1` a `S4` sem quebrar estilos nem build

- [x] T001 Medir a linha de base de Performance no Lighthouse CLI (Desktop e Mobile) sobre o build de producao atual (`npm run build && npm run start` em `commit 325dbfb`), registrar as notas obtidas na secao `Cenario 0` de `specs/002-design-polish-21st/quickstart.md` e remover artefatos JSON temporarios | Aceite: Valores numericos de baseline Desktop e Mobile gravados em `specs/002-design-polish-21st/quickstart.md` antes de qualquer modificacao em `src/` ou `package.json` (`FR-001`, `SC-003`).
- [x] T002 **S1** - Inicializar `shadcn/ui` compativel com Tailwind CSS v4 e Next.js 16 instalando `clsx` e `tailwind-merge` em `package.json`, criando `components.json` e `src/lib/utils.ts` (`cn`) e mapeando as variaveis semanticas do shadcn (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--ring`) para `--color-gray-*`, `--color-purple-*` e `--color-indigo-*` em `src/app/globals.css` | Aceite: `components.json` e `src/lib/utils.ts` criados, todas as escalas `@theme` e classes `.container-page`, `.t-h1`, `.t-h2`, `.t-h-banner`, `.t-tag`, `.t-p` e `.text-gradient` preservadas sem regressao visual em `src/app/globals.css` (`FR-002`).
- [x] T003 **S2** - Instalar o pacote `motion` (Framer Motion, importado via `motion/react`) em `package.json` via `npm` para sustentar os componentes da `21st.dev` que dependem dele, mantendo `gsap` + `@gsap/react` em `src/lib/gsap.ts` responsavel exclusivo por timelines globais, `ScrollTrigger` e `DrawSVGPlugin` | Aceite: `motion` listado em `dependencies` de `package.json` e resolvido sem conflitos de peer dependencies com React `19.3.0` (`FR-002`).
- [x] T004 **S3** - Obter os componentes da `21st.dev` via `get_component` do MCP Magic em ordem estrita de prioridade (`P1 -> P2 -> P3`: ID `1567` ou alt `35180` para `D1`, ID `35188` para `D2`, ID `27265` ou alt `833` para `D3`, ID `26786` para `D5`, ID `24457` para `D6`, ID `35251` para `D7`), aplicando contingencia fiel ao contrato de `specs/002-design-polish-21st/contracts/ui-contracts.md` caso algum ID sofra bloqueio de cota diaria (ja que `API_KEY_21ST` nao existe no ambiente), salvando e adaptando tokens/tipografia em `src/components/ui/21st/GlowingEffect.tsx`, `src/components/ui/21st/AnimatedBorder.tsx`, `src/components/ui/21st/ShinyButton.tsx`, `src/components/ui/21st/ElevateNavbar.tsx`, `src/components/ui/21st/TestimonialMarquee.tsx` e `src/components/ui/21st/LightBeamFooter.tsx` | Aceite: Os 6 componentes existem tipados e recoloridos para os tokens do projeto em `src/components/ui/21st/`, e tanto `npm run lint` quanto `npm run build` passam com codigo `0` ao final de `S1`-`S3` (`FR-002`, `FR-003`).
- [x] T005 **S4** - Definir `MotionSafeWrapperProps` em `src/types/landing.ts`, criar o envoltorio reutilizavel `MotionSafeWrapper` em `src/components/motion/MotionSafeWrapper.tsx` (consumindo `useMotionEnvironment` para expor `prefersReducedMotion`, `canHover` e visibilidade por `IntersectionObserver`) e adicionar regras utilitarias `@media (prefers-reduced-motion: reduce)` em `src/app/globals.css` para travar animacoes `@keyframes`/`@property` de terceiros no estado final estatico | Aceite: `MotionSafeWrapper` permite proteger qualquer componente da `21st.dev` sem descarta-lo e suporta composicao com `next/dynamic` para itens pesados abaixo da dobra (`FR-003`, `SC-002`).

---

## Phase 2: Foundational - Pendencias da Feature 001 (`CM-10` e `D4`)

**Purpose**: Concluir as duas pendencias estruturais herdadas da feature `001` antes de acoplar as melhorias `D1` a `D7`

**CRITICAL**: Concluir integralmente esta fase antes de iniciar as fases das User Stories (`D1` a `D7`).

- [x] T006 **CM-10 (Parte 1: Revelacao Sequencial)** - Adicionar os subalvos `data-m="banner-avatars"`, `data-m="banner-proof"`, `data-m="banner-heading"` e `data-m="banner-cta"` em `src/components/sections/BannerSection.tsx` e refatorar o bloco de `#depoimentos` em `src/components/motion/LandingMotionController.tsx` para revelar em sequencia container, avatares, prova social, titulo e botao em uma `gsap.timeline` com duracao total de `0.65s` | Aceite: No primeiro scroll ate `#depoimentos` com movimento padrao, os 5 elementos surgem escalonados na ordem exata encerrando em `<= 0.65s`, e em `prefers-reduced-motion: reduce` aparecem 100% visiveis de imediato (`FR-004`, `SC-004`).
- [x] T007 **CM-10 (Parte 2: Onda Luminosa Radial)** - Evoluir `src/components/ui/DotMatrixDecor.tsx` e sua chamada em `src/components/sections/BannerSection.tsx` para substituir o fade/escala estatico por uma onda radial de luminancia em ciclo curto (`~2.4s`, mascarada por `/images/dot-matrix-banner.svg` nos tons `purple-05` / `indigo-05`) ativa nas duas malhas dos cantos enquanto `#depoimentos` estiver visivel no `ScrollTrigger` (pausada fora da tela e totalmente estatica em `prefers-reduced-motion: reduce`), marcando `[x]` na tarefa `T024` em `specs/001-border-ia-landing/tasks.md` | Aceite: Onda radial visivel em ciclo curto apenas com `#depoimentos` em viewport e movimento permitido; zero animacao com reduced motion; `T024` da spec `001` concluida (`FR-004`, `SC-002`, `SC-004`).
- [x] T008 **D4 (Reduced Motion nos 6 Hovers CSS)** - Envolver transicoes e deslocamentos/escalas de hover com `motion-safe:` exatamente nos 6 arquivos auditados: link de navegacao em `src/components/sections/Header.tsx`, escala do logo (`motion-safe:hover:scale-[1.03]`) em `src/components/ui/BorderIaLogo.tsx`, base do botao em `src/components/ui/CtaButton.tsx`, caixa de icone (`motion-safe:group-hover:-translate-y-0.5`) em `src/components/sections/FeaturesSection.tsx`, links sociais (`motion-safe:hover:-translate-y-0.5`) em `src/components/sections/Footer.tsx` e botao `"Start now"` em `src/components/ui/MagicCopyCard.tsx` | Aceite: Com `prefers-reduced-motion: reduce` ativo, passar o cursor sobre qualquer um dos 6 elementos produz zero transicao animada, escala ou deslocamento (`FR-005`, `SC-002`).

**Checkpoint**: Infraestrutura `S1`-`S4` pronta e pendencias `CM-10` + `D4` resolvidas.

---

## Phase 3: User Story 1 - Microinteracoes Luminosas nos Pontos de Conversao e Recursos (Priority: P1) - MVP

**Goal**: Integrar as melhorias de prioridade maxima `P1` (`D1`, `D2` e `D3`) nos cards de Recursos, no `MagicCopyCard` e no CTA principal do Hero

**Independent Test**: Abrir a pagina em `1440px` e `430px` (com movimento padrao e reduzido) e validar o cursor glow nos 4 cards apenas em `(hover: hover)`, a sincronia unica da borda do `MagicCopyCard` com `beamPulse` e o brilho perimetral restrito ao CTA `"Usar no Figma"` do Hero.

### Implementation for User Story 1

- [x] T009 [P] [US1] **D1** - Integrar `GlowingEffect` (`src/components/ui/21st/GlowingEffect.tsx`) nos 4 cards de `src/components/sections/FeaturesSection.tsx` aplicando `--gradient-linear-degrade` na borda iluminada, habilitando o rastreamento de cursor apenas em `(hover: hover) and (prefers-reduced-motion: no-preference)` e preservando `data-m="feat-card"` e `aria-hidden="true"` na camada luminosa | Aceite: Borda acende seguindo o cursor nos 4 cards no Desktop, permanece inativa em dispositivos touch (`hover: none`) e em `prefers-reduced-motion: reduce`, sem afetar o stagger `CM-09` (`FR-006`, `SC-001`, `SC-002`).
- [x] T010 [P] [US1] **D2** - Integrar `AnimatedBorder` (`src/components/ui/21st/AnimatedBorder.tsx`) em `src/components/ui/MagicCopyCard.tsx` mantendo desligado qualquer loop autonomo do componente e conduzindo o deslocamento da luz na borda diretamente pelo progresso de `beamPulse` na timeline GSAP existente e na acao `handleStartNow`, sem duplicar a animacao sobre `[data-card-glow]` | Aceite: Um unico ciclo sincronizado dirige chegada do feixe, trilha luminosa na borda e `[data-card-glow]`; cliques em `"Start now"` reiniciam o pulso de forma limpa; em reduced motion a borda fica estatica (`FR-007`, `SC-001`, `SC-002`).
- [x] T011 [P] [US1] **D3** - Integrar `ShinyButton` (`src/components/ui/21st/ShinyButton.tsx`) envolvido por `MotionSafeWrapper` (`S4`) exclusivamente na variante `primary-gradient` de `src/components/ui/CtaButton.tsx` (usada no CTA `"Usar no Figma"` de `src/components/sections/HeroSection.tsx`), preservando dimensoes, cores e copy do Figma e mantendo `"Start now"` de `src/components/ui/MagicCopyCard.tsx` e as variantes `outline-gradient`/`white-solid` fora de `D3` | Aceite: Brilho conic visivel apenas no `"Usar no Figma"` do Hero em movimento padrao, 100% parado em `prefers-reduced-motion: reduce` e sem alterar `"Start now"` (`FR-008`, `SC-001`, `SC-002`).

**Checkpoint**: Entregas `P1` (`D1`, `D2`, `D3`, `D4` e `CM-10`) completas e testaveis independentemente.

---

## Phase 4: User Story 2 - Navegacao Translucida Elevada com Menu Mobile Acessivel (Priority: P2)

**Goal**: Substituir o cabecalho atual pelo `Elevate Navbar` (`D5`) em pill glass com hover GSAP nos links diretos e novo menu mobile acessivel abaixo de `1024px`

**Independent Test**: Verificar o topo em `1440px` e `430px`, acionando links diretos no Desktop (sem dropdowns) e abrindo/fechando o menu mobile por toque e teclado (`Tab`, `Enter`, `Escape`).

### Implementation for User Story 2

- [x] T012 [US2] **D5** - Substituir a implementacao interna de `src/components/sections/Header.tsx` usando `src/components/ui/21st/ElevateNavbar.tsx` recolorido para `gray-10`/`gray-08` em capsula translucida, mantendo `data-m="header"`, `BorderIaLogo` e `SITE_LINKS.ctas.comunidade`, renderizando somente links diretos para `SITE_LINKS.navItems` (suprimindo todos os paineis dropdown) com hover GSAP protegido por `no-preference` no Desktop (`>= 1024px`) e implementando menu mobile acessivel abaixo de `lg` (`aria-expanded`, `aria-controls`, fechamento por clique em ancora e tecla `Escape`, sem animacao em reduced motion) | Aceite: Topo pill glass sem quebra em `1440px` e `430px`, zero dropdowns vazios, navegacao mobile funcional por toque e teclado e abertura `CM-01` preservada (`FR-009`, `FR-014`, `SC-001`, `SC-002`, `SC-005`).

**Checkpoint**: Historias `US1` (`P1`) e `US2` (`P2`) concluidas e integradas.

---

## Phase 5: User Story 3 - Prova Social Dinamica Protegida e Fechamento Editorial de Marca (Priority: P3)

**Goal**: Incorporar o `Testimonial Marquee` (`D6`) com avatares locais, marcacao provisoria visivel e trava de publicacao, e substituir o rodape pelo `Light Beam Footer` (`D7`) recolorido

**Independent Test**: Rolar ate `#depoimentos` e `footer` em `1440px` e `430px`, validar avatares locais, badge `"Conteúdo provisório"`, parada sob reduced motion, falha intencional em `npm run verify:release` e rodape em `#09090B`/roxo com credito `"Desenvolvido por: João Gabriel"`.

### Implementation for User Story 3

- [x] T013 [P] [US3] **D6 (Dados e Trava de Publicacao)** - Adicionar `TestimonialItem` em `src/types/landing.ts`, declarar `TESTIMONIALS_VERIFIED = false`, `TESTIMONIAL_PROVISIONAL_LABEL = "Conteúdo provisório"` e `TESTIMONIAL_ITEMS` (reutilizando `SOCIAL_PROOF_AVATARS` com `isPlaceholder: true`) em `src/lib/constants.ts`, criar o verificador Node ESM `scripts/verify-release-ready.mjs` (lendo `src/lib/constants.ts` sem jamais ler `.env*`) e registrar `"verify:release": "node scripts/verify-release-ready.mjs"` em `package.json` | Aceite: `npm run verify:release` encerra com codigo `1` e mensagem explicita enquanto `TESTIMONIALS_VERIFIED === false` ou houver `isPlaceholder: true`, sem impedir `npm run build` (`FR-010`, `FR-011`, `SC-006`).
- [x] T014 [US3] **D6 (Integracao UI no Banner)** - Integrar `src/components/ui/21st/TestimonialMarquee.tsx` (carregado sob demanda via `next/dynamic` e protegido por `MotionSafeWrapper`) em `src/components/sections/BannerSection.tsx`, exibindo os 4 avatares de `SOCIAL_PROOF_AVATARS`, badge visivel `"Conteúdo provisório"` em cada card, `aria-hidden="true"` nas trilhas duplicadas, pausa fora da viewport e exibicao 100% parada sob `prefers-reduced-motion: reduce`, mantendo intactos `"Mais de +5.000 designers já estão utilizando"`, a sequencia `CM-10` e a onda das malhas | Aceite: Marquee fluido em movimento padrao, pausado fora da tela, totalmente estatico em reduced motion e claramente rotulado como provisorio sem quebrar `1440px` nem `430px` (`FR-010`, `FR-011`, `FR-013`, `FR-014`, `SC-001`, `SC-002`, `SC-006`, `SC-007`).
- [x] T015 [P] [US3] **D7 (Light Beam Footer)** - Substituir `src/components/sections/Footer.tsx` usando `src/components/ui/21st/LightBeamFooter.tsx` recolorido do azul-marinho para `bg-gray-11` (`#09090B`), bordas `gray-08` e feixe diagonal em `--gradient-linear-degrade` (`purple-05` / `indigo-06`), removendo colunas de links inexistentes para renderizar apenas `SITE_LINKS.navItems` e `SITE_LINKS.socialLinks`, wordmark monumental `"Border-IA"` responsivo, `data-m="footer"`, hovers `motion-safe:` e o credito obrigatorio `"Desenvolvido por: João Gabriel"` | Aceite: Rodape em tons escuros e roxos da marca sem overflow horizontal em `320px`/`430px`/`1440px`, apenas links reais funcionando, feixe e hovers estaticos em reduced motion e credito autoral exato (`FR-012`, `FR-013`, `FR-014`, `SC-001`, `SC-002`, `SC-007`).

**Checkpoint**: Todas as melhorias `D1` a `D7`, `CM-10` e `D4` implementadas.

---

## Phase 6: Polish & Cross-Cutting Concerns (Auditoria Visual, Reduced Motion, Lighthouse e Release Gate)

**Purpose**: Verificacao transversal de todos os criterios de aceite do Handoff 02 e da Constituicao `v2.0.0`

- [x] T016 [P] Auditar layout e acessibilidade em `320px`, `430px` e `1440px` contra `docs/design/screens/` e auditar `prefers-reduced-motion: reduce` (no carregamento e em alternancia ao vivo) em `src/components/sections/*.tsx` e `src/components/ui/**/*.tsx`, corrigindo eventuais desvios residuais de espacamento, foco `:focus-visible` ou animacao | Aceite: `scrollWidth <= innerWidth` em todas as larguras, diferencas contra `docs/design/screens/` restritas exclusivamente a lista aprovada e zero brilho, loop ou hover animado em reduced motion (`FR-013`, `FR-014`, `SC-001`, `SC-002`, `SC-005`).
- [ ] T017 Executar os portoes finais de validacao (`npm run lint`, `npm run build`), medir novamente o Lighthouse Performance em build de producao registrando o comparativo contra a baseline de `T001` em `specs/002-design-polish-21st/quickstart.md`, validar que `npm run verify:release` retorna codigo `1` bloqueando publicacao de placeholders e varrer `src/`, `scripts/` e `specs/002-design-polish-21st/` por `U+2014` e URLs temporarias | Aceite: `lint` e `build` com codigo `0`, Lighthouse Performance `>= 90`, `verify:release` bloqueando com codigo `1`, zero `U+2014` e zero commits/pushes executados (`FR-001`, `FR-011`, `SC-003`, `SC-006`, `SC-007`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1: `T001`-`T005`)**: Inicia imediatamente; `T001` DEVE rodar antes de `T002`-`T005` para capturar a linha de base limpa de `commit 325dbfb`.
- **Foundational (Phase 2: `T006`-`T008`)**: Depende de Phase 1 (`S1`-`S4` concluidos); resolve `CM-10` e `D4` antes das mudancas de componentes nas secoes.
- **User Story 1 (Phase 3 - P1: `T009`-`T011`)**: Depende de Phase 2; implementa `D1`, `D2` e `D3`.
- **User Story 2 (Phase 4 - P2: `T012`)**: Depende de Phase 2 (executar apos `US1` para respeitar a ordem de prioridade `P1 -> P2 -> P3`); implementa `D5`.
- **User Story 3 (Phase 5 - P3: `T013`-`T015`)**: Depende de Phase 2 (executar apos `US2`, com `T014` apoia-se nos subalvos `CM-10` ja criados em `T006`/`T007`); implementa `D6` e `D7`.
- **Polish (Phase 6: `T016`-`T017`)**: Depende da conclusao de todas as fases anteriores (`Phase 1` a `Phase 5`).

### User Story Dependencies

- **US1 (P1)**: Independente apos Phase 2; `T009` (`FeaturesSection.tsx`), `T010` (`MagicCopyCard.tsx`) e `T011` (`CtaButton.tsx`) atuam em arquivos distintos.
- **US2 (P2)**: Independente apos Phase 2; atua em `Header.tsx` (`T012`).
- **US3 (P3)**: Independente de `US1` e `US2`; dentro de `US3`, `T014` depende de `T013`, enquanto `T015` (`Footer.tsx`) e independente de `T013`/`T014`.

### Parallel Opportunities

- **Phase 3 (`US1`)**: `T009`, `T010` e `T011` podem rodar em paralelo entre si.
- **Phase 5 (`US3`)**: `T013` (dados + script `verify:release`) e `T015` (`Footer.tsx`) podem rodar em paralelo antes de `T014` (`BannerSection.tsx`).

---

## Parallel Example: User Story 1 (`P1`)

```bash
# Apos concluir S1-S4 (Phase 1) e CM-10 + D4 (Phase 2), as 3 melhorias P1 operam em arquivos isolados:
Task T009: "D1 - Integrar GlowingEffect em src/components/sections/FeaturesSection.tsx"
Task T010: "D2 - Integrar AnimatedBorder sincronizado a beamPulse em src/components/ui/MagicCopyCard.tsx"
Task T011: "D3 - Integrar ShinyButton na variante primary-gradient em src/components/ui/CtaButton.tsx"
```

---

## Implementation Strategy

### Ordem Recomendada de Execucao (Single-Agent Sequential por Prioridade)

1. Executar `T001` (medir baseline Lighthouse antes de tocar no codigo).
2. Executar `T002` -> `T003` -> `T004` (validar `npm run lint` e `npm run build`) -> `T005` (`S1` a `S4`).
3. Executar `T006` -> `T007` (`CM-10` completo + marcar `T024` da `001`) -> `T008` (`D4` nos 6 hovers).
4. Executar `US1` (`P1`): `T009` (`D1`), `T010` (`D2`), `T011` (`D3`) e validar checkpoint `P1`.
5. Executar `US2` (`P2`): `T012` (`D5` Elevate Navbar + menu mobile).
6. Executar `US3` (`P3`): `T013` -> `T014` (`D6` Testimonial Marquee + trava) e `T015` (`D7` Light Beam Footer).
7. Executar `T016` e `T017` (auditoria final, Lighthouse `>= 90` contra baseline e bloqueio `verify:release`), sem executar `git commit` nem `git push`.

---

## Notes

- Nenhum agente realiza `git commit`, `git push` ou criacao de branches; todo o trabalho permanece na branch `main`.
- Nunca ler arquivos `.env` ou `.env.*`.
- Se o `get_component` do MCP Magic atingir cota diaria em `T004`, registrar quais IDs foram bloqueados e implementar o componente correspondente em `src/components/ui/21st/` seguindo `contracts/ui-contracts.md` sem interromper a entrega.
