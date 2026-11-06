<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Border-IA

Landing page do plugin de Figma Border-IA. Vale para o agy e para o Claude Code.

## Fluxo de trabalho

1. O agy especifica com Spec-Kit (`.specify/`, skills `speckit-*`) e passa o handoff ao Claude Code ao finalizar.
2. O Claude Code implementa a partir de `specs/`.
3. Revisão humana (HITL) só no final do projeto.

## Git

- Commits são ditados pelo João Gabriel. Nenhum agente faz commit, push ou cria repositório remoto por conta própria.
- Branch principal: `main`.

## Fonte de design

- Figma: https://www.figma.com/design/9INxBOvGlTfRVQ15bnmNwy (file key `9INxBOvGlTfRVQ15bnmNwy`).
- Base Desktop: node `307:78` (1440px). Base Mobile: node `335:10650` (430px).
- `Desktop V2` e `Mobile V2` são idênticos à V1. Ignore.
- Tokens, tipografia, copy e assets: página Documentação, node `21:3195`.
- Fidelidade: antes de `get_design_context`, carregue a skill `figma-design-to-code`. O screenshot do node é o alvo visual. Assets baixados para o projeto, sem URL temporária do Figma no código.

## Decisões de conteúdo

- Em divergência entre layout e copy, vale a página Documentação, com correção ortográfica.
- Banner: "Mais de +5.000 designers já estão utilizando".
- Card de avatar: "Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."
- Crédito do footer: "Desenvolvido por: João Gabriel". Sempre. Não usar os nomes do layout original.
- A Status Bar do Mobile é mockup e não entra no código.

## Stack

- Next.js (App Router), React, TypeScript, Tailwind CSS. Gerenciador: npm.
- Movimento: GSAP com `@gsap/react` (timelines, ScrollTrigger, traçado de SVG). Skills `gsap-*`.
- Scroll suave: Lenis.
- Shapes realistas: Three.js com `@react-three/fiber`, só onde o efeito pedir 3D ou shader.
- Toda animação respeita `prefers-reduced-motion`. Código 3D carrega sob demanda, sem pesar o primeiro paint.

## Skills do projeto

Pack `frontend` ligado por junction, fora do git: `.claude/skills/` (Claude) e `_agents/skills` (Antigravity).
