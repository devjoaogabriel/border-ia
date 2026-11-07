# Handoff 07: ajustes aprovados depois da spec 006

Tudo abaixo foi pedido e aprovado pelo João depois da implementação da 006. Está na `main`, sem commit. Atualize a spec 006 (e o que mais for preciso) para refletir o estado real.

## 1. Malha do cursor virou o próprio cursor

- **Pedido:** "o efeito do mouse não aparece sobre essa tela" (o banner) e depois "a seta do mouse deve ser representada apenas pelo espectro ondulante", como no kc1t.
- **Camada:** a malha saiu de trás do conteúdo. Agora é `fixed inset-0 z-50`, acima de tudo, com blending normal. O `z-10` no `main` e no `footer` e o `relative isolate` no `LandingMotionController` foram desfeitos.
- **Seta escondida:** com a malha montada, o `html` ganha a classe `cursor-mesh`, e `.cursor-mesh, .cursor-mesh * { cursor: none !important }` fica em `globals.css`. A classe sai no cleanup. Toque, movimento reduzido e falha de JS mantêm a seta, porque a classe só entra depois do canvas pronto.
- **Visibilidade:** cor `#C9B3FF`, alpha máximo 0.9 (`field * 0.95`), acompanhamento com `FOLLOW_RATE = 24` (antes 11).
- **Card:** a atenuação sobre `[data-card-stage]` saiu, porque o cursor não pode sumir. `cardMute` e `targetCardMute` foram removidos de `CursorMeshRuntimeState`.
- Um teste anterior com `mix-blend-screen` foi descartado: sumia sobre o botão claro do banner.

## 2. Cor da seleção de texto

`::selection { background: rgb(167 81 251 / 0.45); color: #fff }` em `globals.css`. Saiu o azul padrão.

## 3. Brilho dos botões (hover e clique)

- **Pedido:** hover e clique mais visíveis, com referência em https://21st.dev/@designali-in/components/shiny-button. O código do 21st não foi baixado (cota diária esgotada). O efeito foi reconstruído a partir do "shiny CTA" original.
- **Classe:** `.btn-shine` em `@layer components` no `globals.css`, com `@property --shine-angle` e `@keyframes shine-spin` (2.4s). Em repouso fica igual ao Figma. No hover aparecem um arco cônico na borda (`::before` com máscara `exclude`/`xor`), pontos de 4px varridos pelo giro (`::after`) e um glow `box-shadow` interno e externo. No clique: `translate 0 1px`, `scale 0.98` e glow mais forte. Com movimento reduzido, sem giro e sem afundar.
- **Cor por variante** via `--shine` em `CtaButton`: `primary-gradient` branco, `primary-light` `#A751FB`, `secondary-dark` `#C082FF`. O "Start now" do `MagicCopyCard` também recebeu `btn-shine`, só a classe.
- Precisa ficar em `@layer components`. Fora da camada, o padrão `--shine: #fff` vencia o utilitário de cada variante.

## Arquivos

`src/components/motion/CursorDotMesh.tsx`, `src/components/motion/LandingMotionController.tsx`, `src/types/landing.ts`, `src/app/globals.css`, `src/components/ui/CtaButton.tsx`, `src/components/ui/MagicCopyCard.tsx`. Use o `git diff` para o estado exato.

Testado em Chromium e WebKit (Playwright), com lint, tipos e build passando. Lighthouse antes e depois ainda não foi medido (T001 e T010 da 006).
