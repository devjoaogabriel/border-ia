# Contratos de Interface, Layout e Coreografia (UI Contracts)

**Feature**: `001-border-ia-landing` | **Data**: 2026-11-06

Este documento estabelece os contratos visuais, semanticos e comportamentais entre as secoes da pagina, os nodes do Figma e os modulos de movimento/3D.

## 1. Contrato de Extracao de Tokens do Figma (Pre-requisito de Implementacao)

Antes de codificar estilos finais, o agente implementador (Claude Code) DEVE carregar a skill `figma-design-to-code` e consultar `get_design_context` no arquivo `9INxBOvGlTfRVQ15bnmNwy` para resolver sem invencao:

| Item Pendente no Export Estatico | Node de Origem no Figma | Destino no Codigo |
|----------------------------------|-------------------------|-------------------|
| Stops, direcao e angulo exatos de `Linear-degrade` | `21:3195`, `307:78` | `--gradient-linear-degrade` em `src/app/globals.css` e `<linearGradient>` dos SVGs |
| Unidade exata da coluna `Espacamento` (`1` e `10`) e escala tipografica Mobile | `25:83`, `307:78`, `335:10650` | Classes tipograficas em `src/app/globals.css` |
| Raios de borda, espessuras de linha, sombras e visibilidade exata do CTA no Hero Mobile | `307:78`, `335:10650` | Componentes de secao em `src/components/sections/` |
| Assets locais (logo, oval H1, rabisco H2, 4 icones de recursos, 3 icones sociais, 4 avatares e fundo `WebProcess 2.0`) | `307:76`, `307:74`, `307:1386`, `307:2130`, `307:2227` | `public/images/` e `public/icons/` (zero URL temporaria do Figma) |

---

## 2. Contrato de Marcos Semanticos e Secoes DOM

O documento raiz DEVE obedecer a estrutura abaixo:

```html
<html lang="pt-BR">
  <body>
    <header> <!-- Node Desktop 307:76 (110px) / Mobile 335:10650 (sem Status Bar) -->
      <nav aria-label="Principal">...</nav>
    </header>
    <main id="conteudo-principal">
      <section id="hero" aria-labelledby="hero-heading"> <!-- Node 307:74 (1267px) / Mobile 773px -->
        <h1 id="hero-heading">Acelere sua criação de <span>interfaces</span></h1>
        <div id="sobre"> <!-- Vitrine WebProcess 2.0 + MagicCopyCard --> </div>
      </section>
      <section id="recursos" aria-labelledby="recursos-heading"> <!-- Node 307:1386 (597px) / Mobile 1110px -->
        <h2 id="recursos-heading">Como o <span>Border-IA</span> te ajuda no dia a dia</h2>
        <!-- 4 artigos/itens com <h3> para cada recurso -->
      </section>
      <section id="depoimentos" aria-labelledby="banner-heading"> <!-- Node 307:2130 (602px) / Mobile 628px -->
        <h2 id="banner-heading">Concentre-se no design, não na rotina.</h2>
      </section>
    </main>
    <footer> <!-- Node 307:2227 (262px) / Mobile 346px -->
      <!-- Logo + Redes Sociais + "Desenvolvido por: João Gabriel" -->
    </footer>
  </body>
</html>
```

### Regras de Layout Responsivo por Secao

1. **Container Padrao**: `max-w-[1216px] mx-auto` no Desktop (equivalente a `1440px - 2 * 112px`), com padding lateral fluido de `22px` no Mobile (`430px`) e protecao `overflow-x: clip` para zero scroll horizontal entre `320px` e `2560px`.
2. **Header**:
   - Desktop (`>= 1024px`): Logo a esquerda + lista de links (`Recursos`, `Sobre`, `Depoimentos`) + botao `COMUNIDADE` a direita.
   - Mobile (`< 1024px`): Logo a esquerda + botao `COMUNIDADE` a direita. Links centrais ocultos; nenhum botao de menu hamburgue adicionado.
3. **Hero**:
   - Desktop (`>= 1024px`): Tag + `h1` em duas linhas com oval vetorial sobre `"interfaces"`, linha inferior horizontal combinando o paragrafo descritivo e o botao `USAR NO FIGMA`, feixe luminoso vertical descendo desde `top: 0` ate o topo central do `MagicCopyCard`, e janela `WebProcess 2.0` em largura total (`1216px`) com fade na base.
   - Mobile (`< 1024px`): Tag + `h1` + paragrafo empilhados a esquerda, visibilidade do botao `USAR NO FIGMA` fiel ao node `335:10650`, e composicao compacta com a lateral esquerda da janela `WebProcess 2.0` ao fundo e o `MagicCopyCard` em destaque a direita/centro.
4. **Recursos**:
   - Desktop (`>= 1024px`): Cabecalho centralizado + grade de 4 colunas (`grid-cols-4`), cada card alinhado a esquerda (`items-start text-left`).
   - Mobile (`< 1024px`): Cabecalho centralizado + grade de 1 coluna (`grid-cols-1`), cada card centralizado (`items-center text-center`).
5. **Banner CTA**:
   - Card arredondado escuro com malhas de pontos nos cantos superior esquerdo e inferior direito (`aria-hidden="true"`).
   - Desktop: 4 avatares sobrepostos ao lado esquerdo do texto `"MAIS DE +5.000 DESIGNERS JÁ ESTÃO UTILIZANDO"`.
   - Mobile: 4 avatares sobrepostos centralizados acima do texto `"MAIS DE +5.000 DESIGNERS JÁ ESTÃO UTILIZANDO"`.
   - Botao `USAR NO FIGMA` com fundo claro (`Gray-01` `#FAFAFA`) e texto/icone escuros (`Gray-11` `#09090B`).
6. **Footer**:
   - Linha divisoria superior em largura util do container.
   - Desktop: `flex-row items-center justify-between` (Logo | 3 icones sociais | `"Desenvolvido por: João Gabriel"`).
   - Mobile: `flex-col items-start` empilhando Logo, linha dos 3 icones sociais e bloco `"Desenvolvido por: João Gabriel"`.

---

## 3. Contrato dos Componentes de Movimento e 3D

| Componente | Arquivo Alvo | Entradas (Props) | Garantias de Saida e Limpeza |
|------------|--------------|------------------|------------------------------|
| `SmoothScrollProvider` | `src/components/motion/SmoothScrollProvider.tsx` | `children: ReactNode` | Sincroniza `ReactLenis` ao `gsap.ticker` e `ScrollTrigger.update`; desativa Lenis imediatamente se `prefers-reduced-motion: reduce`; intercepta cliques em `#recursos`, `#sobre`, `#depoimentos` para `lenis.scrollTo` suave (ou salto nativo sem animacao em modo reduzido) |
| `HeroBeamCanvas` | `src/components/three/HeroBeamCanvas.tsx` | `isActive: boolean`, `introProgressRef?: RefObject<number>` | Carregado via `next/dynamic({ ssr: false })` sobre fallback CSS/SVG `HeroBeamFallback`; `aria-hidden="true"`, `pointer-events-none`, `frameloop={isActive ? "always" : "never"}` |
| `PluginPrismLogo3D` | `src/components/three/PluginPrismLogo3D.tsx` | `isActive: boolean`, `burstSignal: number`, `canHover: boolean` | Carregado via `next/dynamic({ ssr: false })` sobre `<BorderIaLogoMark />` estatico; renderiza 2 losangos chanfrados 3D com `MeshPhysicalMaterial`, responde a inclinacao no card quando `canHover=true` e pausa fora da tela |
| `MagicCopyCard` | `src/components/ui/MagicCopyCard.tsx` | `className?: string` | Gerencia estado `ambient \| burst`, hospeda `PluginPrismLogo3D` com `WebGLSafeBoundary`, anima `"Generating..."` via `useGSAP` escopado e trata clique/teclado em `"Start now"` com `contextSafe` |
| `AnimatedStrokeWord` | `src/components/ui/AnimatedStrokeWord.tsx` | `variant: "oval" \| "scribble"`, `children: ReactNode` | Posiciona o SVG decorativo (`aria-hidden="true"`) ancorado relativamente a palavra destacada (`"interfaces"` ou `"Border-IA"`), expondo `data-stroke-path` para `DrawSVGPlugin` |
