<!--
Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- Modified principles:
  - I. Fidelidade Visual e Contratual ao Figma (INEGOCIAVEL) -> I. Base Visual no Figma com Elevacoes Autorizadas (21st.dev)
  - II. Movimento Intencional e Shapes Realistas com Degradacao Graciosa -> II. Movimento Intencional, Componentes Elevados e Shapes Realistas com Degradacao Graciosa
- Unchanged non-negotiable principles:
  - III. Respeito Integral a prefers-reduced-motion (INEGOCIAVEL)
  - IV. Performance de Primeiro Paint e Orcamento de Renderizacao (INEGOCIAVEL)
  - V. Acessibilidade Semantica e Navegabilidade (INEGOCIAVEL)
- Modified sections:
  - Restricoes de Stack e Conteudo (autorizados shadcn/ui mapeado aos tokens do projeto, motion restrito a componentes 21st.dev e adaptacao de componentes da 21st.dev)
  - Fluxo de Trabalho e Portoes de Qualidade (adicionado portao de Lighthouse Performance >= 90 e trava contra publicacao de placeholders como conteudo real)
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (verificado, compativel via Constitution Check)
  - .specify/templates/spec-template.md (verificado, compativel)
  - .specify/templates/tasks-template.md (verificado, compativel)
- Follow-up TODOs: Substituir copy provisoria do Testimonial Marquee (D6) quando Joao Gabriel fornecer depoimentos reais antes de publicacao definitiva.
-->
# Border-IA Constitution

## Core Principles

### I. Base Visual no Figma com Elevacoes Autorizadas (21st.dev)

Os frames do Figma para Desktop (`307:78`, 1440px), Mobile (`335:10650`, 430px) e Documentação (`21:3195`) permanecem como base canônica de paleta (`Gray`, `Purple`, `Indigo`, fundo `#09090B`), tipografia (`Space Grotesk`), tokens (`--gradient-linear-degrade`) e estrutura das áreas não alteradas, ignorando `Desktop V2` e `Mobile V2`. Desvios visuais, interativos e estruturais em relação ao Figma SÃO PERMITIDOS exclusivamente quando listados e aprovados pelo João Gabriel em especificação ativa do Spec-Kit (como as melhorias da `21st.dev` na feature `002-design-polish-21st`: `Elevate Navbar` com menu mobile, `Glowing Effect`, `Animated Border`, `Shiny Button`, `Testimonial Marquee` e `Light Beam Footer`). As regras contratuais de conteúdo de `AGENTS.md` continuam invioláveis: banner com `"Mais de +5.000 designers já estão utilizando"`, card de avatar com `"Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."`, crédito fixo `"Desenvolvido por: João Gabriel"` no rodapé e exclusão da Status Bar do Mobile. Conteúdos provisórios (como depoimentos placeholder) NUNCA podem ir a público simulando declarações reais, exigindo marcação visível explícita e trava de publicação até a chegada do texto definitivo. Todos os assets visuais DEVEM ser servidos localmente no projeto, sem URLs temporárias externas.

### II. Movimento Intencional, Componentes Elevados e Shapes Realistas com Degradacao Graciosa

A orquestração global da página (timelines de entrada, animações vinculadas ao scroll via `ScrollTrigger` e traçado vetorial via `DrawSVGPlugin`) DEVE permanecer sob responsabilidade do GSAP com `@gsap/react` (`useGSAP` escopado e reversão automática), coordenado ao scroll suave via Lenis. A biblioteca `motion` (Framer Motion) é permitida exclusivamente para sustentar componentes importados/adaptados da `21st.dev` que dependam dela, sem substituir nem duplicar timelines já dirigidas pelo GSAP (como o pulso sincronizado `beamPulse` no card do Hero). Elementos 3D e shaders (`Three.js` com `@react-three/fiber`) DEVEM permanecer restritos onde volume físico ou luz volumétrica elevem o realismo no Hero, mantendo fallback estático imediato em SVG/CSS para o primeiro paint e para ambientes sem WebGL.

### III. Respeito Integral a prefers-reduced-motion (INEGOCIAVEL)

Toda animação de entrada, timeline contínua, efeito vinculado ao scroll, inércia do Lenis, renderização animada em WebGL, animação via `motion` e transição/transformação de hover em CSS DEVE respeitar a preferência de sistema `(prefers-reduced-motion: reduce)`. Quando um componente externo (como itens da `21st.dev`) ou utilitário CSS não implementar suporte nativo a movimento reduzido, ele DEVE ser envolvido por guarda reativa ou seletor `motion-safe:` sem descartar o componente. Com movimento reduzido ativo, nenhum brilho rotativo/conic, loop contínuo, marquee em deslocamento, paralaxe ou translação/escala de hover pode executar; a interface DEVE apresentar imediatamente seu estado visual final estático e completo.

### IV. Performance de Primeiro Paint e Orcamento de Renderizacao (INEGOCIAVEL)

A arquitetura DEVE proteger o carregamento inicial e manter nota de Performance no Lighthouse igual ou superior a `90` (`>= 90`), comparada contra linha de base medida em build de produção. Módulos pesados de 3D (`three`, `@react-three/fiber`) e componentes interativos pesados abaixo da primeira dobra DEVEM carregar sob demanda (`next/dynamic` fora do caminho crítico de SSR/LCP). Animações contínuas DEVEM operar sobre propriedades compostas (`transform`, `opacity`/`autoAlpha`, `mask`/`background` controlado ou shaders), limitando o uso de WebGL a no máximo dois contextos leves restritos ao Hero e pausando loops de frame e animações cíclicas (como ondas de malha e marquees) quando fora da área visível.

### V. Acessibilidade Semantica e Navegabilidade (INEGOCIAVEL)

A página DEVE declarar `lang="pt-BR"`, estruturar marcos semânticos claros (`header`, `nav`, `main`, `section`, `footer`) e preservar hierarquia estrita de cabeçalhos (`h1` único no Hero, `h2` para títulos de seção e `h3` para cards). Todos os controles interativos (incluindo o menu mobile do `Header`, botões de CTA e links sociais) DEVEM ser plenamente navegáveis via teclado (`Tab`, `Enter`, `Escape`), exibir estado `:focus-visible` de alto contraste sobre `#09090B` e possuir atributos ARIA adequados (`aria-label`, `aria-expanded`, `aria-controls`). Camadas puramente decorativas (canvases 3D, bordas luminosas, feixes, malhas de pontos e rabiscos SVG) DEVEM conter `aria-hidden="true"`.

## Restricoes de Stack e Conteudo

A stack oficial do projeto compreende: Next.js (App Router), React, TypeScript, Tailwind CSS e `shadcn/ui` (configurado via `components.json` e `src/lib/utils.ts`, com variáveis semânticas mapeadas para as escalas `gray-*`, `purple-*` e `indigo-*` sem quebrar `globals.css`), gerenciados via `npm`. Para movimento e experiência visual: GSAP com `@gsap/react` (timelines globais, `ScrollTrigger`, `DrawSVGPlugin`), `motion` (Framer Motion, restrito aos componentes da `21st.dev` que dele dependem), componentes selecionados da `21st.dev` recoloridos e adaptados aos tokens do projeto, Lenis para scroll suave e Three.js com `@react-three/fiber` para shapes realistas no Hero. A tipografia única DEVE permanecer `Space Grotesk` via `next/font/google`, sobre o fundo `Gray-11` (`#09090B`). Em toda documentação, especificação, comentário e código do projeto, o idioma padrão é PT-BR e o caractere travessão (`U+2014`) é estritamente proibido.

## Fluxo de Trabalho e Portoes de Qualidade

O ciclo de execução segue três etapas: especificação completa em Spec-Kit pelo `agy` (`.specify/` e `specs/`), implementação pelo `Claude Code` e revisão humana (HITL) ao final pelo João Gabriel. Nenhum agente pode criar branches, realizar commits, executar `git push` ou criar repositórios remotos por conta própria; todo o trabalho permanece na branch `main` sob controle de commits ditados pelo usuário. É proibido ler arquivos `.env*` ou expor segredos. Nenhuma entrega é considerada concluída sem aprovação nos portões objetivos: `npm run lint` sem erros, `npm run build` concluído com sucesso, Lighthouse Performance `>= 90` frente à linha de base, ausência de quebra de layout em Desktop (`1440px`) e Mobile (`430px`), verificação rigorosa com `prefers-reduced-motion: reduce` ativo (zero brilhos, loops ou hovers de movimento), navegação completa por teclado e bloqueio explícito contra publicação de placeholders não validados.

## Governance

Esta Constituição prevalece sobre convenções implícitas e orienta obrigatoriamente os artefatos de especificação (`spec.md`), arquitetura (`plan.md`), tarefas (`tasks.md`) e implementação. Qualquer alteração nestes princípios exige documentação explícita da motivação, atualização do relatório de impacto no topo deste arquivo e incremento de versão segundo Versionamento Semântico: `MAJOR` para remoção ou redefinição incompatível de princípio anteriormente estrito, `MINOR` para adição de novo princípio ou expansão material de governança e `PATCH` para ajustes redacionais sem mudança de regra. Toda revisão técnica e execução de `speckit-analyze` DEVE auditar conformidade direta com os cinco princípios centrais antes de liberar ou concluir a implementação.

**Version**: 2.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
