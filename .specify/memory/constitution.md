<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles: None (Principios I a V mantidos intactos, incluindo fidelidade estrita ao Figma no Principio I e prefers-reduced-motion no Principio III)
- Modified sections:
  - Restricoes de Stack e Conteudo (excecao minima e estritamente escopada autorizando framer-motion, clsx e tailwind-merge exclusivamente para o brilho animado aprovado no H1 em src/components/ui/animated-shiny-text.tsx, sem liberar shadcn/ui, 21st.dev ou desvios gerais do Figma)
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (verificado, compativel via Constitution Check)
  - .specify/templates/spec-template.md (verificado, compativel)
  - .specify/templates/tasks-template.md (verificado, compativel)
- Follow-up TODOs: None
-->
# Border-IA Constitution

## Core Principles

### I. Fidelidade Visual e Contratual ao Figma (INEGOCIAVEL)

Os frames aprovados no Figma para Desktop (`307:78`, 1440px), Mobile (`335:10650`, 430px) e Documentação (`21:3195`) DEVEM ser seguidos como alvo visual definitivo, ignorando `Desktop V2` e `Mobile V2`. Em qualquer divergência entre layout e texto, DEVE prevalecer a página Documentação com correção ortográfica e as regras explícitas de `AGENTS.md`: banner com `"Mais de +5.000 designers já estão utilizando"`, card de avatar com `"Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."`, crédito fixo `"Desenvolvido por: João Gabriel"` no rodapé e exclusão da Status Bar do Mobile (mockup). Todos os assets visuais DEVEM ser baixados e servidos localmente no projeto, sendo proibido o uso de URLs temporárias do Figma. Valores ausentes no export estático (como stops de `Linear-degrade` e unidades de espaçamento) DEVEM ser extraídos via `get_design_context` na implementação, nunca inventados.

### II. Movimento Intencional e Shapes Realistas com Degradacao Graciosa

A coreografia da página DEVE dar vida aos elementos gráficos do layout sem distorcer proporções, alinhamentos ou legibilidade aprovados no Figma. Sequenciamento de entrada, animações vinculadas ao scroll, interações físicas/inerciais e traçado de linhas vetoriais DEVEM utilizar GSAP com `@gsap/react` (`useGSAP` escopado e reversão automática em desmontagem), coordenados com scroll suave via Lenis. Elementos tridimensionais ou shaders (`Three.js` com `@react-three/fiber`) DEVEM ser aplicados estritamente onde volume físico, chanfro especular ou luz volumétrica elevarem o realismo visual (como o feixe energético do Hero e o emblema de prismas em losango), mantendo fallback estático imediato em SVG/CSS idêntico ao layout para o primeiro paint e para dispositivos sem WebGL.

### III. Respeito Integral a prefers-reduced-motion (INEGOCIAVEL)

Toda animação de entrada, timeline contínua, efeito vinculado ao scroll, inércia do Lenis e renderização animada em WebGL DEVE respeitar a preferência de sistema `(prefers-reduced-motion: reduce)` por meio de `gsap.matchMedia()` e verificação equivalente nos componentes interativos e 3D. Quando o movimento reduzido estiver ativo, a interface DEVE renderizar imediatamente o estado final estático de todos os textos, cards e traçados vetoriais (100% preenchidos e opacos), desativar a interpolação inercial de scroll e suspender loops contínuos, mantendo apenas transições instantâneas ou de opacidade discreta em foco/hover.

### IV. Performance de Primeiro Paint e Orcamento de Renderizacao (INEGOCIAVEL)

A arquitetura DEVE proteger o carregamento inicial: módulos pesados de 3D (`three`, `@react-three/fiber`) DEVEM carregar sob demanda no cliente (`next/dynamic` fora do caminho crítico de SSR/LCP), exibindo primeiro o shell estático em HTML/CSS/SVG. Animações de interface DEVEM operar exclusivamente sobre propriedades aceleradas por compositor (`transform`, `opacity`/`autoAlpha` e atributos de traço SVG), sendo proibido animar continuamente `width`, `height`, `top`, `left` ou `margin`. O uso de WebGL DEVE limitar-se a no máximo dois contextos leves restritos ao Hero, pausando loops de frame (`frameloop="never"` ou equivalente) quando fora da área visível para sustentar 60fps estáveis em Desktop e Mobile.

### V. Acessibilidade Semantica e Navegabilidade (INEGOCIAVEL)

A página DEVE declarar `lang="pt-BR"`, estruturar marcos semânticos claros (`header`, `nav`, `main`, `section`, `footer`) e preservar hierarquia estrita de cabeçalhos (`h1` único no Hero, `h2` para títulos de seção e `h3` para cards), desacoplando a tag HTML do nome do token tipográfico visual do Figma. Todos os controles interativos (links de navegação, botões de CTA e links sociais) DEVEM ser plenamente navegáveis via teclado, exibir estado `:focus-visible` de alto contraste sobre o fundo `#09090B` e possuir nomes acessíveis (`aria-label` explícito em botões/links apenas com ícone). Elementos puramente decorativos (canvases 3D, feixes luminosos, malhas de pontos, rabiscos SVG e mockups ornamentais) DEVEM conter `aria-hidden="true"`.

## Restricoes de Stack e Conteudo

A stack técnica é fixa conforme `AGENTS.md`: Next.js (App Router), React, TypeScript e Tailwind CSS gerenciados via `npm`, GSAP com `@gsap/react` para movimento, Lenis para scroll suave e Three.js com `@react-three/fiber` para shapes realistas. Nenhuma biblioteca da stack pode ser substituída ou duplicada por equivalentes concorrentes ou bibliotecas externas de UI não previstas (como `shadcn/ui` ou catálogos externos), com uma única exceção pontual aprovada pelo João Gabriel: o pacote `framer-motion` (acompanhado dos utilitários `clsx` e `tailwind-merge` em `src/lib/utils.ts`) é permitido exclusivamente para sustentar o brilho animado aprovado no título principal `H1` (`src/components/ui/animated-shiny-text.tsx`), sujeito integralmente ao Princípio III (`prefers-reduced-motion`) e vedado em qualquer outro componente do projeto. A tipografia única do projeto DEVE ser `Space Grotesk` carregada via `next/font/google`, e a paleta de cores DEVE seguir estritamente as escalas `Gray`, `Purple` e `Indigo` sobre o fundo `Gray-11` (`#09090B`). Em toda documentação, especificação, comentário e código do projeto, o idioma padrão é PT-BR e o caractere travessão (`U+2014`) é estritamente proibido.

## Fluxo de Trabalho e Portoes de Qualidade

O ciclo de execução segue três etapas: especificação completa em Spec-Kit pelo `agy` (`.specify/` e `specs/`), implementação pelo `Claude Code` com acesso ao MCP do Figma (`figma-design-to-code` antes de `get_design_context`) e revisão humana (HITL) ao final pelo João Gabriel. Nenhum agente pode criar branches, realizar commits, executar `git push` ou criar repositórios remotos por conta própria; todo o trabalho permanece na branch `main` sob controle de commits ditados pelo usuário. É proibido ler arquivos `.env*` ou expor segredos. Nenhuma entrega é considerada concluída sem aprovação nos portões objetivos: `npm run lint` sem erros, `npm run build` concluído com sucesso, paridade visual com `desktop.png` (1440px) e `mobile.png` (430px), verificação com `prefers-reduced-motion: reduce` ativo e navegação completa por teclado.

## Governance

Esta Constituição prevalece sobre convenções implícitas e orienta obrigatoriamente os artefatos de especificação (`spec.md`), arquitetura (`plan.md`), tarefas (`tasks.md`) e implementação. Qualquer alteração nestes princípios exige documentação explícita da motivação, atualização do relatório de impacto no topo deste arquivo e incremento de versão segundo Versionamento Semântico: `MAJOR` para remoção ou redefinição incompatível de princípio inegociável, `MINOR` para adição de novo princípio ou expansão material de governança e `PATCH` para ajustes redacionais sem mudança de regra. Toda revisão técnica e execução de `speckit-analyze` DEVE auditar conformidade direta com os cinco princípios centrais antes de liberar ou concluir a implementação.

**Version**: 1.1.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
