---
description: "Lista executavel de tarefas para implementacao da Landing Page Border-IA"
---

# Tasks: Landing Page do Plugin Border-IA

**Input**: Artefatos de design e especificacao em `/specs/001-border-ia-landing/` e `/docs/design/`

**Prerequisites**: `plan.md` (obrigatorio), `spec.md` (obrigatorio), `research.md`, `data-model.md`, `contracts/ui-contracts.md`, `quickstart.md`

**Tests**: Validacao estatica (`npm run lint`, `npm run build`) e criterios verificaveis de aceite em cada tarefa, sem suite TDD separada (nao solicitada na especificacao).

**Organization**: Tarefas agrupadas por historia de usuario (`US1` a `US4`) para permitir implementacao incremental e verificacao independente de cada entrega.

## Format: `[ID] [P?] [Story] Description | Aceite: Criterio`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependencia de tarefa incompleta da mesma fase)
- **[Story]**: Historia de usuario correspondente (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Todas as tarefas incluem caminhos exatos de arquivos e criterio objetivo de aceite

## Path Conventions

- Projeto unico Next.js App Router na raiz: `src/` e `public/`

---

## Phase 1: Setup (Extracao Figma e Estrutura de Pastas)

**Purpose**: Preparar a arvore de diretorios e baixar localmente todos os assets oficiais do Figma sem URLs temporarias

- [x] T001 Criar a estrutura de diretorios planejada (`src/components/sections`, `src/components/ui`, `src/components/motion`, `src/components/three`, `src/hooks`, `src/lib`, `src/types`, `public/icons`, `public/images/avatars`) a partir da raiz do projeto | Aceite: Todos os diretorios existem na arvore local sem alterar `package.json` nem `docs/design/`.
- [x] T002 Carregar a skill `figma-design-to-code`, consultar `get_design_context` no arquivo `9INxBOvGlTfRVQ15bnmNwy` (nodes `307:76`, `307:74`, `307:1386`, `307:2130`, `307:2227` e `335:10650`) e salvar os icones vetoriais locais em `public/icons/` (`figma-mark.svg`, `sparkle.svg`, `menu-lines.svg`, `feature-bg-remover.svg`, `feature-text-gen.svg`, `feature-image-upscaler.svg`, `feature-avatar-gen.svg`, `social-discord.svg`, `social-github.svg`, `social-instagram.svg`) | Aceite: Todos os 10 SVGs existem em `public/icons/`, possuem `viewBox` limpo e zero referencias a URLs externas.
- [x] T003 [P] Exportar do Figma (nodes `307:74`, `307:2130` e `335:10650`) e otimizar localmente os cenarios da janela `WebProcess 2.0` (`public/images/hero-figma-ui-desktop.webp` e `public/images/hero-figma-ui-mobile.webp`, sem achatar o card `"Magic copy"`) e os 4 avatares reais (`public/images/avatars/avatar-1.webp` a `public/images/avatars/avatar-4.webp`) | Aceite: Os 6 arquivos de imagem existem localmente em `public/images/` com nitidez 2x e tamanho otimizado para web.

---

## Phase 2: Foundational (Tokens, Tipografia, Contratos Tipados e Primitivos Base)

**Purpose**: Infraestrutura compartilhada de design system, fontes, constantes contratuais e componentes base que bloqueiam todas as secoes

**CRITICAL**: Nenhuma historia de usuario deve iniciar antes da conclusao desta fase

- [x] T004 Consultar `get_design_context` nos nodes `21:3195`, `25:83`, `25:98`, `307:78` e `335:10650` para extrair os stops exatos de `Linear-degrade` e as unidades de `letter-spacing`, configurando `@theme inline` com as 33 cores (`Gray-01..11`, `Purple-01..11`, `Indigo-01..11`), `--gradient-linear-degrade`, utilitarios tipograficos (`H1` a `H8`, `p-18` a `p-14`, `tag-text`), fundo `#09090B`, `overflow-x: clip` e anel `:focus-visible` de alto contraste em `src/app/globals.css` | Aceite: `src/app/globals.css` compila sem erros no Tailwind v4 e reflete os valores reais do Figma sem nenhum stop inventado.
- [x] T005 [P] Declarar as interfaces TypeScript `SiteLink`, `SiteLinksConfig`, `FeatureItem`, `SocialProofAvatar`, `CopyContract`, `MagicCopyState` e `MotionEnvironment` em `src/types/landing.ts` | Aceite: `npx tsc --noEmit` valida `src/types/landing.ts` sem erros em modo `strict`.
- [x] T006 Implementar `SITE_LINKS` (ancoras `#recursos`, `#sobre`, `#depoimentos` e links externos centralizados), `FEATURE_ITEMS`, `SOCIAL_PROOF_AVATARS` e `COPY_CONTRACT` em `src/lib/constants.ts` | Aceite: Textos conferem caractere por caractere com `AGENTS.md` (incluindo avatar completo, `"Mais de +5.000 designers já estão utilizando"` e `"Desenvolvido por: João Gabriel"`, sem nomes do layout original e sem travessao `U+2014`).
- [x] T007 [P] Implementar o modulo de registro unico client-side de `gsap`, `useGSAP`, `ScrollTrigger` e `DrawSVGPlugin` em `src/lib/gsap.ts` | Aceite: Importar `src/lib/gsap.ts` em Server ou Client Build nao dispara erro em SSR e exporta `gsap`, `useGSAP`, `ScrollTrigger` e `DrawSVGPlugin` prontos para uso.
- [x] T008 [P] Atualizar `src/app/layout.tsx` com `Space_Grotesk` (`weights: ["400", "500"]`, `subsets: ["latin"]`, `display: "swap"`), `<html lang="pt-BR">`, metadados `title` e `description` em PT-BR (`FR-017`) e classes base escuras (`bg-gray-11 text-gray-01 antialiased`) | Aceite: O HTML renderizado no servidor contem `lang="pt-BR"`, carrega exclusivamente `Space Grotesk` (removendo `Geist`) e exibe o titulo `"Border-IA | Acelere sua criação de interfaces no Figma"`.
- [x] T009 [P] Implementar os primitivos `BorderIaLogo` (`src/components/ui/BorderIaLogo.tsx`), `TagBadge` (`src/components/ui/TagBadge.tsx`) e `CtaButton` (`src/components/ui/CtaButton.tsx` com variantes `primary-gradient`, `primary-light` e `secondary-dark`, suporte a icone local e `target="_blank" rel="noopener noreferrer"` quando externo) | Aceite: Os tres componentes respeitam cores, raios, bordas e tipografia do Figma e exibem `:focus-visible` nitido ao navegar com `Tab`.
- [x] T010 [P] Implementar `AnimatedStrokeWord` em `src/components/ui/AnimatedStrokeWord.tsx` (ancorando os paths reais do Figma para `variant="oval"` e `variant="scribble"` com `data-stroke-path` e `aria-hidden="true"`) e `DotMatrixDecor` em `src/components/ui/DotMatrixDecor.tsx` (malha vetorial/CSS com mascara radial e `aria-hidden="true"`) | Aceite: Oval e rabisco alinham-se exatamente sobre a palavra envolvida sem deslocar o fluxo do texto em Desktop e Mobile.

**Checkpoint**: Fundacao concluida; implementacao das secoes e historias pode prosseguir.

---

## Phase 3: User Story 1 - Descoberta de Valor e Conversao no Topo: Header e Hero (Priority: P1) - MVP

**Goal**: Entregar o topo completo da landing page (`Header` + `Hero`) fiel aos frames Desktop (`1440px`) e Mobile (`430px`), com vitrine da interface do Figma e card interativo `"Magic copy"`

**Independent Test**: Abrir `http://localhost:3000` em `1440px` e `430px` e verificar paridade visual com o topo de `docs/design/screens/desktop.png` e `docs/design/screens/mobile.png`, ausencia da Status Bar no Mobile e funcionamento dos links/CTAs do topo

### Implementation for User Story 1

- [x] T011 [P] [US1] Implementar `Header` em `src/components/sections/Header.tsx` seguindo os nodes `307:76` (altura 110px, container 1216px, `BorderIaLogo`, `<nav aria-label="Principal">` com `"Recursos"`, `"Sobre"`, `"Depoimentos"` visivel em `>= 1024px`, e botao `"Comunidade"`) e `335:10650` (apenas Logo e `"Comunidade"` em `< 1024px`, sem Status Bar e sem menu hamburgue) | Aceite: Header coincide visualmente com `desktop.png` em `1440px` e `mobile.png` em `430px`, sem barra de status simulada.
- [x] T012 [P] [US1] Implementar o componente client `MagicCopyCard` em `src/components/ui/MagicCopyCard.tsx` com borda em gradiente roxo, cabecalho com emblema dois losangos (SVG estatico inicial) e icone de menu (`aria-hidden="true"`), titulo `"Magic copy"`, prompt `"Crie exemplos de headline para meu produto"`, linha `"Generating..."` com arco vetorial e botao `"Start now"` acionando estado local `ambient | burst` | Aceite: O card renderiza nitido como componente real de UI (nao imagem achatada), mantem dimensoes fieis ao Figma e responde a clique/teclado em `"Start now"` sem navegar para fora da pagina.
- [x] T013 [US1] Implementar `HeroSection` (`id="hero"`) em `src/components/sections/HeroSection.tsx` integrando `TagBadge` (`"Plugin Figma"`), `h1` unico `"Acelere sua criação de interfaces"` com `AnimatedStrokeWord` (`variant="oval"`) em `"interfaces"`, paragrafo e `CtaButton` `"Usar no Figma"` (alinhado ao lado do paragrafo no Desktop `307:78` e seguindo a visibilidade exata do node `335:10650` no Mobile), camada base estatica do feixe roxo + `DotMatrixDecor`, container `id="sobre"` com a imagem local `WebProcess 2.0` em fade inferior (`mask-image`) e `MagicCopyCard` sobreposto | Aceite: Secao Hero reproduz fielmente proporcoes, sobreposicoes e fade na base tanto em `1440px` quanto em `430px`, com `<h1>` semantico unico.
- [x] T014 [US1] Montar `Header` e `HeroSection` dentro de `<main id="conteudo-principal">` em `src/app/page.tsx` (mantendo `page.tsx` como Server Component) | Aceite: `npm run build` passa e o MVP acima e logo abaixo da primeira dobra renderiza completo em SSR sem erros de console.

**Checkpoint**: User Story 1 funcional e verificavel isoladamente como MVP em Desktop e Mobile.

---

## Phase 4: User Story 2 - Exploracao de Recursos, Prova Social e Credito Institucional (Priority: P2)

**Goal**: Completar todas as secoes restantes da landing page (`Recursos`, `Banner CTA` e `Footer`) com responsividade fiel e textos contratuais exatos

**Independent Test**: Rolar a pagina em `1440px` e `430px` (ou acionar os links `"Recursos"` e `"Depoimentos"` no Desktop) e validar alinhamentos, grade responsiva de 4 para 1 coluna, avatares locais, texto corrigido do banner e credito obrigatorio no rodape

### Implementation for User Story 2

- [x] T015 [P] [US2] Implementar `FeaturesSection` (`id="recursos"`) em `src/components/sections/FeaturesSection.tsx` conforme `307:1386` e `335:10650`, renderizando `TagBadge` (`"Recursos"`), `h2` `"Como o Border-IA te ajuda no dia a dia"` com `AnimatedStrokeWord` (`variant="scribble"`) sob `"Border-IA"` e os 4 cards de `FEATURE_ITEMS` com `h3` e icones locais (4 colunas alinhadas a esquerda em `>= 1024px` e 1 coluna centralizada em `< 1024px`) | Aceite: Os 4 cards exibem textos exatos (incluindo a frase completa do `"Gerador de avatar"`), alinhados a esquerda no Desktop e centralizados no Mobile.
- [x] T016 [P] [US2] Implementar `BannerSection` (`id="depoimentos"`) em `src/components/sections/BannerSection.tsx` conforme `307:2130` e `335:10650`, com card escuro arredondado, `DotMatrixDecor` nos cantos superior esquerdo e inferior direito, 4 avatares locais sobrepostos, texto `"Mais de +5.000 designers já estão utilizando"`, `h2` `"Concentre-se no design, não na rotina."` em gradiente e `CtaButton` claro (`variant="primary-light"`) `"Usar no Figma"` | Aceite: Banner reproduz fielmente o layout Desktop (avatares ao lado do texto) e Mobile (avatares acima do texto) com ortografia corrigida e avatares servidos localmente.
- [x] T017 [P] [US2] Implementar `Footer` em `src/components/sections/Footer.tsx` conforme `307:2227` e `335:10650`, com divisor superior, `BorderIaLogo`, 3 links sociais (`Discord`, `GitHub`, `Instagram` com `aria-label` explicito) e credito fixo `"Desenvolvido por: João Gabriel"` | Aceite: Rodape distribui os 3 blocos horizontalmente no Desktop, empilha-os a esquerda no Mobile e exibe exclusivamente `"Desenvolvido por: João Gabriel"`.
- [x] T018 [US2] Integrar `FeaturesSection`, `BannerSection` e `Footer` em `src/app/page.tsx` na ordem exata `Header -> main (HeroSection, FeaturesSection, BannerSection) -> Footer` | Aceite: As 5 secoes estao presentes na pagina, links `#recursos`, `#sobre` e `#depoimentos` navegam para os IDs corretos e a pagina inteira bate com `desktop.png` e `mobile.png`.

**Checkpoint**: Pagina completa em layout, conteudo e responsividade (`US1` + `US2` prontas).

---

## Phase 5: User Story 3 - Coreografia de Movimento e Shapes Realistas em Fluxo Continuo (Priority: P3)

**Goal**: Adicionar scroll suave sincronizado (Lenis), coreografia completa GSAP (`CM-01` a `CM-12`) e os dois shapes realistas sob demanda em Three.js / `@react-three/fiber` no Hero sem pesar o primeiro paint

**Independent Test**: Recarregar a pagina com movimento padrao ativo, confirmar primeiro paint imediato sem bloqueio por JS 3D, observar a sequencia de abertura do Hero, interagir com o card `"Magic copy"`, rolar ate o fim conferindo triggers de cada secao e verificar pausa dos canvases 3D fora da viewport

### Implementation for User Story 3

- [x] T019 [P] [US3] Implementar o hook `useMotionEnvironment` (`prefers-reduced-motion`, `(hover: hover) and (pointer: fine)` e `IntersectionObserver` de visibilidade) em `src/hooks/useMotionEnvironment.ts` e o componente `WebGLSafeBoundary` (deteccao de suporte WebGL + `ErrorBoundary` React) em `src/components/three/WebGLSafeBoundary.tsx` | Aceite: Hook atualiza estados reativamente sem erro em SSR e `WebGLSafeBoundary` renderiza o fallback estatico caso WebGL falhe ou nao exista.
- [x] T020 [P] [US3] Implementar `SmoothScrollProvider` em `src/components/motion/SmoothScrollProvider.tsx` acoplando `ReactLenis` (`options={{ autoRaf: false }}`) ao `gsap.ticker` (`gsap.ticker.lagSmoothing(0)`) e `useLenis(ScrollTrigger.update)` com suporte a rolagem suave nas ancoras internas (`CM-12`), envolvendo `{children}` em `src/app/layout.tsx` | Aceite: Rolagem de pagina e clique em `"Recursos"` / `"Sobre"` / `"Depoimentos"` fluem suavemente em sincronia com `ScrollTrigger` sem jitter.
- [x] T021 [P] [US3] Implementar `HeroBeamCanvas` em `src/components/three/HeroBeamCanvas.tsx` (usando `@react-three/fiber` + `THREE.ShaderMaterial` GLSL para renderizar o filamento vertical roxo, halo volumetrico, pulso descendente ate o card e cintilacao radial de pontos, com `frameloop={isActive ? "always" : "never"}`) e seu wrapper `HeroBeamLazy` (`next/dynamic` com `{ ssr: false }` sobre o fallback estatico) em `src/components/three/HeroBeamLazy.tsx` | Aceite: O bundle de Three.js nao bloqueia o HTML inicial, o feixe volumetrico alinha-se exatamente ao topo central do `MagicCopyCard` no Desktop e pausa quando o Hero sai da tela (`CM-04`).
- [x] T022 [P] [US3] Implementar `PluginPrismLogo3D` em `src/components/three/PluginPrismLogo3D.tsx` (dois prismas em losango arredondados chanfrados com `THREE.Shape` + `THREE.ExtrudeGeometry` e `THREE.MeshPhysicalMaterial` roxo/indigo, luz pontual roxa superior, inclinacao suave ate `8 graus` no ponteiro quando `canHover=true`, oscilacao autonoma leve em telas de toque e `frameloop` controlado) e seu wrapper `PluginPrismLogoLazy` (`next/dynamic` com `{ ssr: false }` sobre o SVG estatico) em `src/components/three/PluginPrismLogoLazy.tsx` | Aceite: O emblema 3D preserva a silhueta exata dos dois losangos da marca, reflete a luz roxa superior sem estourar limites do card e pausa fora da viewport (`CM-05`).
- [x] T023 [US3] Integrar `HeroBeamLazy` em `src/components/sections/HeroSection.tsx` e integrar `PluginPrismLogoLazy` + animacao GSAP escopada (`useGSAP` + `contextSafe`) dos estados `ambient` e `burst` (`"Generating..."` rotativo, pulso de borda na chegada do feixe e reinicio limpo com `overwrite: true` ao clicar em `"Start now"`) em `src/components/ui/MagicCopyCard.tsx` | Aceite: Na abertura do Hero o pulso do feixe alcanca o card sincronizado ao brilho da borda e ao emblema 3D, e cliques repetidos em `"Start now"` reiniciam o feedback sem empilhar tweens (`CM-04`, `CM-05`, `CM-06`).
- [x] T024 [US3] Implementar `LandingMotionController` em `src/components/motion/LandingMotionController.tsx` e integra-lo em `src/app/page.tsx` usando `useGSAP`, `gsap.matchMedia()`, `ScrollTrigger` e `DrawSVGPlugin` para orquestrar `CM-01` (Header + micro-hover logo), `CM-02` (stagger texto Hero), `CM-03` (`drawSVG` do oval em `"interfaces"`), `CM-07` (entrada e paralaxe da janela Figma), `CM-08` (`ScrollTrigger` + `drawSVG` do rabisco em `"Border-IA"`), `CM-09` (stagger dos 4 cards + micro-hover nos icones), `CM-10` (revelacao do Banner CTA + onda luminosa nas malhas dos cantos) e `CM-11` (revelacao e hovers do Footer), chamando `ScrollTrigger.refresh()` apos `document.fonts.ready` | Aceite: Todos os itens `CM-01` a `CM-12` animam somente `transform`, `opacity`/`autoAlpha` e `drawSVG` em fluidez de 60fps, na ordem exata de cima para baixo da pagina.

**Checkpoint**: Pagina completa com movimento coreografado e shapes realistas ativos (`US1` + `US2` + `US3` prontas).

---

## Phase 6: User Story 4 - Acessibilidade Plena, Teclado e Respeito a Movimento Reduzido (Priority: P4)

**Goal**: Garantir conformidade inegociavel com `prefers-reduced-motion: reduce` (inclusive em alternancia em tempo real), navegacao integral por teclado e semantica acessivel

**Independent Test**: Ativar `prefers-reduced-motion: reduce` com a pagina aberta e em novo carregamento, navegar do inicio ao fim exclusivamente com `Tab`/`Shift+Tab`/`Enter` e auditar semantica e contraste

### Implementation for User Story 4

- [x] T025 [US4] Revisar e endurecer o tratamento de `(prefers-reduced-motion: reduce)` em `src/components/motion/SmoothScrollProvider.tsx`, `src/components/motion/LandingMotionController.tsx`, `src/components/ui/MagicCopyCard.tsx`, `src/components/three/HeroBeamLazy.tsx` e `src/components/three/PluginPrismLogoLazy.tsx` | Aceite: Ativar reducao de movimento (no carregamento ou em tempo real) cessa em `< 100ms` o Lenis, os loops 3D e a rotacao de `"Generating..."`, mantendo 100% dos textos, cards, oval de `"interfaces"` e rabisco de `"Border-IA"` imediatamente opacos e desenhados (`SC-004`).
- [x] T026 [P] [US4] Auditar e refinar semantica HTML (`header`, `nav`, `main`, `section`, `footer`, hierarquia `h1 -> h2 -> h3`), ordem logica de foco, aneis `:focus-visible`, areas minimas de toque (`>= 44x44px` no Mobile), `aria-label` nos icones sociais e `aria-hidden="true"` em camadas decorativas em `src/components/sections/Header.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/FeaturesSection.tsx`, `src/components/sections/BannerSection.tsx`, `src/components/sections/Footer.tsx` e `src/components/ui/*.tsx` | Aceite: 100% dos links e botoes sao operaveis por teclado com foco visivel nitido, e nenhum canvas 3D, rabisco SVG ou malha de pontos captura foco ou polui a arvore de acessibilidade (`SC-005`).

**Checkpoint**: Todas as 4 historias de usuario (`US1` a `US4`) completas e resilientes.

---

## Phase 7: Polish & Cross-Cutting Concerns (Validacao Final de Producao)

**Purpose**: Refinamento trans-secao, verificacao em larguras extremas e aprovacao nos portoes de qualidade antes da revisao humana

- [x] T027 [P] Validar e ajustar responsividade fluida nas larguras intermediarias e extremas (`320px`, `375px`, `430px`, `768px`, `1024px`, `1440px`, `1920px` e `2560px`) em `src/app/globals.css` e `src/components/sections/*.tsx` | Aceite: `document.documentElement.scrollWidth <= window.innerWidth` em todas as larguras testadas, sem truncamento indevido do oval no H1, do card `"Magic copy"` ou do Banner CTA (`SC-001`).
- [x] T028 Executar validacao completa de entrega (`npm run lint`, `npm run build`), varredura automatizada por URLs externas temporarias e pelo caractere proibido `U+2014` em `src/` e execucao integral dos 4 cenarios de `specs/001-border-ia-landing/quickstart.md` | Aceite: `npm run lint` e `npm run build` encerram com codigo `0`, zero URLs temporarias do Figma, zero `U+2014` e 100% dos criterios `SC-001` a `SC-006` atendidos.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependencias; inicia imediatamente.
- **Foundational (Phase 2)**: Depende de Phase 1; bloqueia todas as historias de usuario.
- **User Story 1 (Phase 3 - P1 MVP)**: Depende de Phase 2.
- **User Story 2 (Phase 4 - P2)**: Depende de Phase 2 (integra-se a `src/app/page.tsx` apos `T014`).
- **User Story 3 (Phase 5 - P3)**: Depende das secoes visuais de `US1` e `US2` (`T014` e `T018`) para acoplar os gatilhos de coreografia e os shapes realistas nos containers definitivos.
- **User Story 4 (Phase 6 - P4)**: Depende de Phase 5 (`T024`) para validar e endurecer reducao de movimento e acessibilidade sobre todos os componentes ativos.
- **Polish (Phase 7)**: Depende da conclusao de todas as fases anteriores (`Phase 1` a `Phase 6`).

### User Story Dependencies

- **US1 (P1)**: Independente apos Foundational; constitui o MVP demonstravel do topo.
- **US2 (P2)**: Independente em seus componentes de secao (`T015`, `T016`, `T017` rodam em paralelo), acoplados a `page.tsx` em `T018`.
- **US3 (P3)**: `T019`, `T020`, `T021` e `T022` rodam em paralelo entre si; `T023` e `T024` conectam os shapes e timelines as secoes criadas em `US1` e `US2`.
- **US4 (P4)**: Audita transversalmente o resultado integrado de `US1` + `US2` + `US3`.

### Parallel Opportunities

- **Phase 1**: `T002` (icones SVG) e `T003` (imagens/avatares WebP) podem rodar em paralelo apos `T001`.
- **Phase 2**: `T005`, `T007`, `T008`, `T009` e `T010` operam em arquivos independentes e podem rodar em paralelo.
- **Phase 3 (US1)**: `T011` (`Header.tsx`) e `T012` (`MagicCopyCard.tsx`) podem rodar em paralelo antes de `T013` (`HeroSection.tsx`).
- **Phase 4 (US2)**: `T015` (`FeaturesSection.tsx`), `T016` (`BannerSection.tsx`) e `T017` (`Footer.tsx`) podem rodar totalmente em paralelo antes de `T018`.
- **Phase 5 (US3)**: `T019`, `T020`, `T021` e `T022` podem rodar em paralelo antes da integracao final em `T023` e `T024`.

---

## Parallel Example: User Story 3 (Movimento e Shapes Realistas)

```bash
# Executar em paralelo os 4 modulos independentes de infraestrutura de movimento e 3D:
Task T019: "useMotionEnvironment em src/hooks/useMotionEnvironment.ts + WebGLSafeBoundary em src/components/three/WebGLSafeBoundary.tsx"
Task T020: "SmoothScrollProvider (Lenis + gsap.ticker) em src/components/motion/SmoothScrollProvider.tsx"
Task T021: "HeroBeamCanvas + HeroBeamLazy (GLSL shader do feixe) em src/components/three/HeroBeamCanvas.tsx"
Task T022: "PluginPrismLogo3D + PluginPrismLogoLazy (prismas 3D chanfrados) em src/components/three/PluginPrismLogo3D.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Phase 1 (Setup e download de assets locais do Figma).
2. Concluir Phase 2 (Tokens reais do Figma em `globals.css`, `Space Grotesk`, constantes e primitivos).
3. Concluir Phase 3 (`US1`: `Header` + `HeroSection` + `MagicCopyCard`).
4. **PARAR E VALIDAR**: Conferir fidelidade do topo em `1440px` e `430px` antes de prosseguir.

### Incremental Delivery

1. `Phase 1 + Phase 2` -> Design system e assets locais prontos.
2. `Phase 3 (US1)` -> Header + Hero estaticos/interativos fieis ao Figma.
3. `Phase 4 (US2)` -> Pagina inteira completa (`Recursos` + `Banner CTA` + `Footer`).
4. `Phase 5 (US3)` -> Lenis, coreografia GSAP (`CM-01..CM-12`) e shapes realistas R3F sob demanda.
5. `Phase 6 (US4) + Phase 7` -> Blindagem de `prefers-reduced-motion`, teclado, semantica, build limpa e paridade final.

---

## Notes

- Regras de Git (`AGENTS.md`): **NAO** executar `git commit`, `git push` nem criar branches; manter todas as alteracoes na branch `main` para revisao final e commits ditados por Joao Gabriel.
- Seguranca (`AGENTS.md`): Nunca ler arquivos `.env*` nem usar URLs temporarias do Figma no codigo.
- Estilo textual: Todo texto, comentario e mensagem em PT-BR, sem travessao (`U+2014`).
