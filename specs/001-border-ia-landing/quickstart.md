# Quickstart & Guia de Validacao: Landing Page Border-IA

**Feature**: `001-border-ia-landing` | **Data**: 2026-11-06

Este guia descreve como preparar, executar e validar de ponta a ponta todos os criterios de aceite da especificacao antes da revisao final.

## 1. Pre-requisitos

- Node.js 20+ e `npm` instalados.
- Dependencias ja declaradas em `package.json` instaladas (`npm install` caso `node_modules` nao esteja sincronizado).
- Para a etapa de implementacao pelo Claude Code: acesso ativo ao MCP do Figma no arquivo `9INxBOvGlTfRVQ15bnmNwy` com a skill `figma-design-to-code` carregada antes de `get_design_context`.

## 2. Comandos de Execucao e Build

```bash
# Servidor de desenvolvimento (Turbopack)
npm run dev

# Verificacao estatica de lint e tipos
npm run lint

# Build de producao (valida App Router, Cache Components e bundle client/server)
npm run build
```

## 3. Roteiro de Validacao Ponta a Ponta

### Cenario 1: Paridade Visual Desktop (`1440px`) e Mobile (`430px`)
1. Abrir `http://localhost:3000` com viewport ajustada para `1440x900` (inspecionando a altura completa da pagina) e comparar secao por secao contra `docs/design/screens/desktop.png`.
2. Confirmar largura util centralizada de `1216px`, fundo `#09090B`, tipografia `Space Grotesk` e ausencia de scroll horizontal.
3. Ajustar viewport para `430x932` e comparar contra `docs/design/screens/mobile.png`.
4. Confirmar que a Status Bar simulada (`13:13`, rede, bateria) **nao** existe no DOM, que os links textuais do Header estao ocultos no Mobile, que os 4 cards de Recursos estao centralizados em 1 coluna e que o Footer esta empilhado a esquerda.
5. Testar tambem em `320px` e `1920px` garantindo `scrollWidth === innerWidth`.

### Cenario 2: Contrato de Copy e Assets Locais
1. Verificar os textos obrigatorios:
   - Card 4 de Recursos: `"Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."`
   - Banner CTA: `"Mais de +5.000 designers já estão utilizando"`
   - Footer: `"Desenvolvido por: João Gabriel"` (sem nomes do layout original).
2. Na aba Network do navegador, confirmar que todas as imagens, avatares, fontes e icones sao servidos de origem local (`localhost`), com zero requisicoes para dominios temporarios do Figma (`figma.com/api` ou `s3-alpha`).

### Cenario 3: Coreografia de Movimento, Shapes Realistas e Primeiro Paint
1. Com preferencia de movimento padrao no sistema operacional, recarregar a pagina com cache limpo:
   - Verificar que o texto do Hero, o card `"Magic copy"` e o fallback visual do feixe aparecem imediatamente no primeiro paint antes da hidratacao 3D.
   - Observar a timeline de abertura (`CM-01` a `CM-07`): entrada do Header e Hero, tracado progressivo do oval em `"interfaces"`, descida do pulso luminoso no `HeroBeamCanvas`, reflexo e inclinacao suave nos prismas 3D `PluginPrismLogo3D` e rotacao do arco `"Generating..."`.
2. Clicar em `"Start now"` dentro do card `"Magic copy"` multiplas vezes seguidas: confirmar que o pulso demonstrativo reinicia de forma limpa sem redirecionar a pagina nem acumular animacoes.
3. Clicar em `"Recursos"` e `"Depoimentos"` no Header Desktop: confirmar rolagem suave via Lenis ate as respectivas secoes, desenho do rabisco sob `"Border-IA"`, cascata dos 4 cards e revelacao do Banner CTA.
4. Rolar ate o Footer e inspecionar performance: os canvases 3D do Hero devem estar pausados fora da viewport (`frameloop="never"`).

### Cenario 4: Movimento Reduzido (`prefers-reduced-motion: reduce`) e Acessibilidade
1. Ativar `Emulate CSS media feature prefers-reduced-motion: reduce` no DevTools (com a pagina ja aberta e tambem recarregando do zero):
   - Confirmar adaptacao imediata: sem interpolacao do Lenis, sem deslocamentos `y`, sem rotacao continua em `"Generating..."`, sem loops 3D e com o oval de `"interfaces"` e o rabisco de `"Border-IA"` 100% desenhados desde o inicio.
2. Percorrer toda a pagina apenas com `Tab` e `Shift+Tab`:
   - Confirmar foco visivel nitido em Logo, links do Header (no Desktop), `Comunidade`, `Usar no Figma`, `Start now`, `Usar no Figma` (Banner) e `Discord`, `GitHub`, `Instagram`.
3. Inspecionar semantica HTML: `<html lang="pt-BR">`, exatamente um `<h1>`, `<h2>` nas secoes Recursos e Banner CTA, `<h3>` nos 4 cards, `aria-label` nos links sociais e `aria-hidden="true"` nas camadas decorativas.
