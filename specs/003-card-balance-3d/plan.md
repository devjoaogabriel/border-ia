# Implementation Plan: Balance Sutil e Arraste 3D com Retorno Elastico no Card Magic Copy

**Branch**: `003-card-balance-3d` (trabalho mantido na branch `main`) | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-card-balance-3d/spec.md`

## Summary

Adicionar presenca fisica tridimensional ao card `"Magic copy"` (`src/components/ui/MagicCopyCard.tsx`) no Hero da landing page **Border-IA** utilizando exclusivamente o pacote `gsap` ja instalado (`Draggable`, `ScrollTrigger`, `useGSAP`, `gsap.matchMedia` e `contextSafe`), sem adicionar nenhuma dependencia. A solucao cria um palco dedicado de perspectiva (`900px`) externo ao corpo `overflow-hidden` do card, estende uma sobreposicao oculta de `20px` na base do feixe (`src/components/three/HeroBeamLazy.tsx`) atras do fundo opaco do card para impedir qualquer fresta sob inclinacao, executa um ciclo continuo de balance sutil (`±2.0°` / `±2.8°` / `±0.6°` em `5.6s`) pausado fora da tela, habilita inclinacao 3D por arraste de mouse (`Draggable` sobre `proxy` invisivel, limiar `6px`, exclusao de `"Start now"`, limites amortecidos de `±14°` e `±16°`) com retorno elastico (`elastic.out(1, 0.45)`, `0.9s`) que emenda sem salto no balance, preserva a rolagem vertical livre no celular (`touch-pan-y`) e desativa integralmente o efeito sob `prefers-reduced-motion: reduce`.

## Technical Context

**Language/Version**: TypeScript 5 (`strict: true`), React `19.3.0`, Next.js `16.4.5` (App Router)

**Primary Dependencies**: `gsap` `^3.15.1` (`Draggable`, `ScrollTrigger`, `DrawSVGPlugin`), `@gsap/react` `^2.1.2`, `lenis` `^1.3.27`, `three` `^0.187.0`, `@react-three/fiber` `^9.8.2`, `tailwindcss` `^4` (mais `framer-motion` `^14.10.1`, `clsx` e `tailwind-merge` ja presentes na `main` exclusivamente para o `H1` aprovado em `src/components/ui/animated-shiny-text.tsx`)

**Storage**: N/A (estado de interacao transiente mantido em `useRef` dentro do ciclo `useGSAP`)

**Testing**: `npm run lint`, `npm run build` e roteiro de validacao interativa (balance, emenda do feixe, arraste 3D nas 4 direcoes, cliques em `"Start now"`, toque mobile, Lenis, teclado e `prefers-reduced-motion`) em `quickstart.md`

**Target Platform**: Navegadores web modernos em Desktop (`1440px` referencia, ponteiro preciso com balance + arraste 3D) e Mobile (`430px` referencia, balance sutil + rolagem vertical livre sem arraste bloqueante)

**Project Type**: Web application (Single-page marketing/portfolio landing page em Next.js App Router)

**Performance Goals**: Zero pacotes adicionais no bundle (`elastic.out` do core + `Draggable` ja presente em `gsap`), animacoes exclusivamente em propriedades compostas (`transform`: `rotationX`, `rotationY`, `rotationZ`, `scale`), zero re-renders React durante o arraste (`gsap.quickTo` + refs), pausa automatica fora da viewport via `ScrollTrigger` e preservacao da nota atual de Lighthouse sem adicionar novo contexto WebGL

**Constraints**: Zero novas dependencias em `package.json`; proibido alterar o brilho aprovado do `H1` (`animated-shiny-text.tsx`), o oval de `"interfaces"` ou o rabisco de `"Border-IA"`; proibido reabrir a `spec 002` ou usar componentes da `21st.dev`; `CM-10` e hovers CSS gerais fora de escopo; permanecer na branch `main` sem `git commit` nem `git push`; proibido ler `.env*`; proibido usar travessao (`U+2014`)

**Scale/Scope**: Alteracao cirurgica concentrada em 3 arquivos existentes (`src/lib/gsap.ts`, `src/components/three/HeroBeamLazy.tsx` e `src/components/ui/MagicCopyCard.tsx`), com tipos opcionais em `src/types/landing.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio da Constituicao (v1.1.0) | Avaliacao Pre-Pesquisa | Avaliacao Pos-Design (Phase 1) |
|------------------------------------|------------------------|--------------------------------|
| **I. Fidelidade Visual e Contratual ao Figma** | APROVADO: Pose de repouso `(0°, 0°, 0°)`: tamanho `324x405`, cores e copy do card permanecem identicos ao Figma | APROVADO: Sobreposicao `20px` do feixe fica oculta atras de `bg-gray-11` (`z-10`), mantendo `497px` visiveis exatos em repouso e `0px` de fresta ao inclinar |
| **II. Movimento Intencional e Shapes Realistas** | APROVADO: Usa exclusivamente GSAP (`useGSAP`, `Draggable`, `ScrollTrigger`) sem tocar no `H1` nem nos tracos SVG | APROVADO: Balance, `Draggable` em `proxy` e `elastic.out(1, 0.45)` convivem com `PluginPrismLogo3D`, `beamPulse` e `[data-card-arc]` sem conflito |
| **III. Respeito Integral a `prefers-reduced-motion`** | APROVADO: `gsap.matchMedia()` planejado para desligar balance, arraste e bounce | APROVADO: Condicoes `canAnimate` e `canDrag` em `gsap.matchMedia()` revertem instantaneamente animacoes, cursores e listeners sob `reduce` |
| **IV. Performance de Primeiro Paint e Renderizacao** | APROVADO: Zero pacotes novos, zero contextos WebGL adicionais, pausa fora da tela | APROVADO: Apenas `transform` acelerado por GPU via `gsap.quickTo`, sem carregar `InertiaPlugin`/`CustomBounce` e com pausa por `ScrollTrigger` |
| **V. Acessibilidade Semantica e Navegabilidade** | APROVADO: Arraste puramente decorativo; foco e teclado em `"Start now"` preservados | APROVADO: `dragClickables: false` + limiar `6px` protegem `"Start now"`, sem tab stops artificiais e com `touch-pan-y` livre no Mobile |
| **Restricoes de Stack (v1.1.0), Git e Conteudo** | APROVADO: Emenda `v1.1.0` regulariza `framer-motion` restrito ao `H1`; `003` usa apenas GSAP na `main`, PT-BR sem `U+2014` | APROVADO: Zero pacotes adicionados, zero leitura de `.env*`, zero commits/branches |

## Project Structure

### Documentation (this feature)

```text
specs/003-card-balance-3d/
├── spec.md                       # Especificacao funcional, historias US1-US3 e criterios SC-001..SC-006
├── plan.md                       # Este plano de implementacao tecnica
├── research.md                   # Decisoes Fase 0 (Draggable proxy, elastic.out, emenda C0, sangria 20px, Lenis/touch)
├── data-model.md                 # Parametros fisicos CardTiltPhysicsConfig e maquina de estados
├── quickstart.md                 # Roteiro executavel de validacao dos 4 cenarios
├── contracts/
│   └── card-tilt-contract.md     # Contratos DOM, camadas feixe-card e matematica do mapeamento 3D
├── checklists/
│   └── requirements.md           # Checklist de qualidade da especificacao (16/16 validado)
└── tasks.md                      # Lista ordenada e verificavel de tarefas (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── sections/
│   │   └── HeroSection.tsx                   # [MANTIDO - verificar apenas z-index/overflow se necessario; brilho H1 intacto]
│   ├── three/
│   │   ├── HeroBeamCanvas.tsx                # [MANTIDO ou ajuste fino opcional da normalizacao de uPulse nos 20px ocultos]
│   │   ├── HeroBeamLazy.tsx                  # [MOD] Sangria inferior oculta de 20px (bottom-[calc(100%-20px)], z-0, height 517) contra fresta no topo do card
│   │   ├── PluginPrismLogo3D.tsx             # [MANTIDO]
│   │   └── PluginPrismLogoLazy.tsx           # [MANTIDO]
│   └── ui/
│       ├── animated-shiny-text.tsx           # [INTOCAVEL] Brilho aprovado no H1 (protegido pela emenda v1.1.0)
│       ├── AnimatedStrokeWord.tsx            # [INTOCAVEL] Oval de "interfaces" e rabisco de "Border-IA"
│       └── MagicCopyCard.tsx                 # [MOD] Palco [perspective:900px], balance 5.6s, pausa fora de tela, Draggable proxy 3D e bounce
├── lib/
│   └── gsap.ts                               # [MOD] Registro unico e exportacao de Draggable junto a ScrollTrigger e DrawSVGPlugin
└── types/
    └── landing.ts                            # [MOD - opcional] Interface CardTiltPhysicsConfig para tipagem limpa dos parametros
```

**Structure Decision**: Escopo estritamente contido na camada de movimento e UI do Hero existente na branch `main`, alterando apenas `src/lib/gsap.ts`, `src/components/three/HeroBeamLazy.tsx` e `src/components/ui/MagicCopyCard.tsx` (com tipagem opcional em `src/types/landing.ts`), sem criar novos subdiretorios nem tocar em `package.json` ou nas demais secoes.

## Complexity Tracking

Nenhuma violacao constitucional identificada. Tabela nao aplicavel.
