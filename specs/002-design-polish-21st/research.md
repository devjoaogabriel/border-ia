# Phase 0 Research: Polimento Visual e Componentes Elevados (21st.dev)

**Feature**: `002-design-polish-21st`
**Date**: 2026-11-06
**Base Codebase**: `commit 325dbfb` na branch `main`

## R-01: Inicializacao do `shadcn/ui` em Tailwind CSS v4 + Next.js 16 sem quebrar `globals.css` (`S1`)

- **Decision**: Configurar `components.json` no formato Tailwind CSS v4 (`"tailwind": { "config": "", "css": "src/app/globals.css", "baseColor": "zinc", "cssVariables": true }`), instalar `clsx` e `tailwind-merge`, criar `src/lib/utils.ts` exportando `cn(...inputs)` e adicionar as variaveis semanticas do shadcn diretamente em `src/app/globals.css` apontando para os tokens ja declarados (`--color-gray-*`, `--color-purple-*`, `--color-indigo-*`), preservando intactos o bloco `@theme` e todas as classes utilitarias de `@layer components` (`.container-page`, `.t-h1`, `.t-h2`, `.t-h-banner`, `.t-tag`, `.t-p`, `.text-gradient`). Caso `npx shadcn@latest init` seja executado, inspecionar e restaurar imediatamente qualquer trecho sobrescrito de `src/app/globals.css`.
- **Rationale**: Em projetos Tailwind v4 com `@theme` customizado, o inicializador padrao do `shadcn` costuma injetar paletas `oklch` neutras e imports extras que alteram cor de fundo (`body`), bordas globais e tipografia. Mapear explicitamente `--background: var(--color-gray-11)`, `--foreground: var(--color-gray-01)`, `--card: var(--color-gray-10)`, `--primary: var(--color-purple-05)`, `--accent: var(--color-indigo-06)`, `--muted: var(--color-gray-09)`, `--muted-foreground: var(--color-gray-04)`, `--border: var(--color-gray-08)` e `--ring: var(--color-purple-05)` garante compatibilidade imediata com componentes da `21st.dev` mantendo 100% da identidade cromatica do Figma.
- **Alternatives considered**:
  - Rodar `npx shadcn@latest init --defaults` sem mesclagem manual: descartado porque sobrescreve variaveis globais e pode descaracterizar `#09090B` e as classes `.t-*`.
  - Criar um segundo arquivo CSS isolado apenas para componentes da `21st.dev`: descartado porque o CLI do shadcn e os componentes copiados esperam variaveis registradas no CSS global unico do Tailwind v4.

## R-02: Coexistencia entre `motion` (Framer Motion) e GSAP em React 19 (`S2`)

- **Decision**: Instalar o pacote `motion` via `npm` (importando primitivos por `motion/react`, compativel com React `19.3.0` e Next.js `16.4.5`) e delimitar responsabilidades de forma estrita: GSAP (`@gsap/react`, `ScrollTrigger`, `DrawSVGPlugin`) continua exclusivo para a coreografia macro da pagina (`LandingMotionController.tsx`), sincronia `beamPulse` (`MagicCopyCard.tsx`) e microinteracoes baseadas em GSAP (`Elevate Navbar`), enquanto `motion` atende apenas componentes da `21st.dev` que dependam dele internamente. Seletores `[data-m='...']` permanecem nos wrappers externos de secao/card para que GSAP e `motion` nunca disputem `transform` ou `opacity` no mesmo no DOM.
- **Rationale**: Conflitos de animacao surgem quando duas engines interpolam simultaneamente estilos inline do mesmo elemento. Separar casca de entrada (`[data-m]`, controlada por GSAP) e camada decorativa interna (controlada por CSS ou `motion`) elimina jitter e preserva `ScrollTrigger`.
- **Alternatives considered**:
  - Reescrever todos os componentes da `21st.dev` em GSAP puro: descartado porque o Handoff 02 autorizou explicitamente `motion` (`S2`) justamente para evitar reescrita desnecessaria de componentes Aceternity/Magic UI.
  - Migrar animacoes existentes da pagina para `motion`: descartado por violar o Principio II da Constituicao e `AGENTS.md`.

## R-03: Obtencao de Componentes da `21st.dev` e Contingencia de Cota do MCP Magic (`S3`)

- **Decision**: Como `API_KEY_21ST` nao esta definida no ambiente do Claude Code (e a leitura de `.env*` e proibida), obter o codigo-fonte dos componentes via ferramenta `get_component` do MCP Magic em ordem estrita de prioridade (`P1 -> P2 -> P3`), consultando apenas o componente principal de cada item e acionando a alternativa apenas se necessario:
  1. `D1` (`P1`): `Glowing Effect` (`manuarora700/glowing-effect`, ID `1567`); alternativa sob demanda: `Spotlight` (`kevingirelli/spotlight`, ID `35180`).
  2. `D2` (`P1`): `Animated Border` (`kevingirelli/animated-border`, ID `35188`).
  3. `D3` (`P1`): `Shiny Button` (`hyperiux/shiny-button`, ID `27265`); alternativa sob demanda: `Shimmer Button` (`dillionverma/shimmer-button`, ID `833`).
  4. `D5` (`P2`): `Elevate Navbar` (`hyperiux/elevate-navbar`, ID `26786`).
  5. `D6` (`P3`): `Testimonial Marquee` (`harshjadhavconnect/testimonial-marquee`, ID `24457`).
  6. `D7` (`P3`): `Light Beam Footer` (`kedhareswer/beam-wordmark-footer`, ID `35251`).
  Se a cota diaria do `get_component` bloquear algum item, o implementador registra o ID bloqueado e constrói o componente correspondente em `src/components/ui/21st/` fiel a mecanica tecnica daquele padrao (mascara angular guiada por ponteiro em `D1`, borda conic guiada por variavel CSS em `D2`/`D3`, pill glass + hover GSAP + drawer mobile em `D5`, faixa infinita pausavel em `D6`, feixe diagonal + wordmark monumental em `D7`).
- **Rationale**: `get_component` consome franquia diaria limitada. Consultar 6 IDs por prioridade em vez dos 8 de uma vez reduz em 25% o consumo de cota e protege primeiro todas as entregas `P1`.
- **Alternatives considered**:
  - Exigir que o usuario configure `API_KEY_21ST` antes da implementacao: descartado porque o fluxo multi-agente exige execucao continua sem interromper o Joao Gabriel antes da revisao final (HITL).

## R-04: Guarda Universal de `prefers-reduced-motion` e Carregamento Sob Demanda (`S4`, `D3`, `D4`)

- **Decision**: Criar `src/components/motion/MotionSafeWrapper.tsx` apoiado no hook existente `useMotionEnvironment()` (`src/hooks/useMotionEnvironment.ts`) para expor estado reativo `prefersReducedMotion` e `canHover` aos componentes da `21st.dev`, combinado com regras CSS `@media (prefers-reduced-motion: reduce)` em `src/app/globals.css` que pausam/desligam animacoes de `@keyframes` e `@property` (cobrindo especificamente o `Shiny Button` de `D3`, cuja implementacao original nao declara media query de reduced motion). Nos 6 hovers CSS auditados em `D4`, aplicar o modificador `motion-safe:` do Tailwind v4 tanto nas classes `transition*` quanto nos deslocamentos/escalas `hover:scale-*` e `hover:-translate-y-*` / `group-hover:-translate-y-*`. Componentes novos abaixo da dobra com logica client pesada (`TestimonialMarquee` em `D6`) carregam via `next/dynamic`.
- **Rationale**: Garantir estado final estatico imediato sem descartar componentes da `21st.dev` cumpre `S4` e o Principio III da Constituicao, inclusive quando o usuario alterna a preferencia do sistema operacional com a aba ja aberta.
- **Alternatives considered**:
  - Ocultar componentes da `21st.dev` com `display: none` em reduced motion: descartado porque remove informacao visual (bordas, botoes, depoimentos, rodape) em vez de apresentar seu estado final estatico.

## R-05: Conclusao Integral de `CM-10` e Sincronizacao Unica de `D2` com `beamPulse`

- **Decision (`CM-10`)**:
  1. **Sequencia de 5 elementos em `0.65s`**: Marcar container (`data-m="banner"`), grupo de avatares (`data-m="banner-avatars"`), texto de prova social (`data-m="banner-proof"`), heading (`data-m="banner-heading"`) e wrapper do CTA (`data-m="banner-cta"`) em `src/components/sections/BannerSection.tsx`. Em `LandingMotionController.tsx`, substituir o tween em bloco unico por uma `gsap.timeline` com `ScrollTrigger` (`trigger: "#depoimentos"`, `start: "top 82%"`, `once: true`) escalonando os 5 alvos com offsets `0.00s`, `0.10s`, `0.18s`, `0.26s` e `0.41s` e duracoes `0.24s-0.25s`, encerrando cravado em `0.65s`.
  2. **Onda radial real nas malhas dos cantos**: Evoluir `src/components/ui/DotMatrixDecor.tsx` para sobrepor a malha `/images/dot-matrix-banner.svg` com uma camada mascarada pela propria malha (`mask-image: url('/images/dot-matrix-banner.svg')`) percorrida por um gradiente radial luminoso (`purple-05` / `indigo-05`) em ciclo curto (`~2.4s`), controlado por `ScrollTrigger` (`toggleActions: "play pause resume pause"`) enquanto `#depoimentos` estiver visivel na tela e totalmente desativado sob `prefers-reduced-motion: reduce`.
- **Decision (`D2`)**: Adaptar `Animated Border` (`35188`) em `src/components/ui/MagicCopyCard.tsx` removendo qualquer loop CSS/JS proprio e expondo o angulo/progresso da luz perimetral via variavel CSS `--magic-border-progress` atualizada diretamente no `onUpdate` do tween de `beamPulse` (tanto no ciclo ambiente sincronizado ao feixe quanto no `handleStartNow` de burst), mantendo uma unica fonte de verdade temporal junto a `[data-card-glow]`.
- **Rationale**: Resolve exatamente as falhas apontadas nos itens 3 e 4 da Conferencia contra o codigo sem introduzir novos contextos WebGL fora do Hero (respeitando o limite constitucional de 2 contextos WebGL).
- **Alternatives considered**:
  - Criar um terceiro `<Canvas>` Three.js no banner para `CM-10`: descartado por violar o Principio IV da Constituicao (maximo de 2 contextos WebGL restritos ao Hero) e arriscar queda na nota do Lighthouse.

## R-06: Governanca de Placeholders em `D6` e Linha de Base do Lighthouse

- **Decision (`D6`)**: Armazenar os depoimentos em `src/lib/constants.ts` com a flag explicita `export const TESTIMONIALS_VERIFIED = false;` e `isPlaceholder: true` em cada item de `TESTIMONIAL_ITEMS` (usando os 4 avatares locais de `SOCIAL_PROOF_AVATARS`). Renderizar em cada card do marquee um badge visivel `"CONTEÚDO PROVISÓRIO"` enquanto `!TESTIMONIALS_VERIFIED || item.isPlaceholder`. Adicionar `scripts/verify-release-ready.mjs` (script Node ESM sem dependencias externas e sem ler `.env*`) registrado como `"verify:release"` em `package.json`, que encerra com `process.exit(1)` enquanto `TESTIMONIALS_VERIFIED` for `false` ou existir `isPlaceholder: true`.
- **Decision (Lighthouse)**: Medir e documentar em `specs/002-design-polish-21st/quickstart.md` a nota de Performance em build de producao (`npm run build && npm run start`) **antes de `S1`** (`T001`), repetindo o mesmo protocolo na validacao final (`T017`) para comprovar `Performance >= 90` frente a linha de base real.
- **Rationale**: Se a trava quebrasse `npm run build`, seria impossivel gerar o build de producao exigido para medir o Lighthouse `>= 90` antes de o Joao enviar os textos reais. Separar `npm run build` (build tecnico) de `npm run verify:release` (portao obrigatorio de publicacao) + selo visivel na UI atende simultaneamente os itens 8 e 10 da auditoria.
- **Alternatives considered**:
  - Falhar `npm run build` enquanto houver placeholder: descartado porque impediria validar `npm run build` pos-`S3` e impediria rodar o Lighthouse em producao local.
  - Exibir nomes e frases realistas sem badge visivel: descartado por violar o Principio I da Constituicao e a diretriz expressa do Handoff 02.
