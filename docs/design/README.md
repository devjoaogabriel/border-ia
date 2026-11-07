# Pacote de design do Border-IA

Exportado do Figma pelo Claude Code, para agentes sem acesso ao MCP do Figma.
Arquivo de origem: https://www.figma.com/design/9INxBOvGlTfRVQ15bnmNwy

## Telas (alvo visual)

| Arquivo | Conteúdo | Tamanho | Node |
|---|---|---|---|
| `screens/desktop.png` | Landing Desktop, resolução real | 1440x2838 | `307:78` |
| `screens/mobile.png` | Landing Mobile, resolução real | 430x2978 | `335:10650` |
| `screens/tipografia.png` | Página de fontes (reduzida) | 624x1400 | `25:83` |
| `screens/cores.png` | Paleta completa | 1380x1012 | `25:98` |

## Estrutura da página

Desktop (1440px), altura de cada seção:

| Seção | Node | Altura |
|---|---|---|
| header | `307:76` | 110 |
| section-hero | `307:74` | 1267 |
| section-itens | `307:1386` | 597 |
| section-banner | `307:2130` | 602 |
| section-footer | `307:2227` | 262 |

Mobile (430px): frame+link 122, hero-section 773, itens-section 1110, banner-section 628, Section footer 346. A Status Bar faz parte do mockup e não entra no código.

Conteúdo útil em 1216px no Desktop (margem de 112px). O Mobile usa margem de cerca de 22px.

## Cores

Fundo da página: Gray-11 (`#09090B`).

| Tom | Gray | Purple | Indigo |
|---|---|---|---|
| 01 | `#FAFAFA` | `#FAF5FF` | `#F3F2FF` |
| 02 | `#F4F4F5` | `#F3E7FF` | `#E8E8FF` |
| 03 | `#E4E4E7` | `#E9D4FF` | `#D4D5FF` |
| 04 | `#D4D4D8` | `#D8B2FF` | `#B4B1FF` |
| 05 | `#A1A1AA` | `#C082FF` | `#8E85FF` |
| 06 | `#71717A` | `#A751FB` | `#7A67FF` |
| 07 | `#52525B` | `#922EEF` | `#5530F7` |
| 08 | `#3F3F46` | `#7D1ED2` | `#481EE3` |
| 09 | `#27272A` | `#6A1EAB` | `#3B18BF` |
| 10 | `#18181B` | `#58198A` | `#32169C` |
| 11 | `#09090B` | `#3B0566` | `#1C0B6A` |

O Figma tem uma variável `Linear-degrade` usada em botões e destaques, mas sem valor exportado. Os stops exatos saem do `get_design_context` na implementação.

## Tipografia

Família única: Space Grotesk.

| Estilo | Peso | Tamanho | Altura de linha | Espaçamento |
|---|---|---|---|---|
| H1 | 500 | 64 | 1.3 | 1 |
| H3 | 500 | 48 | 1.3 | 1 |
| H4 | 500 | 40 | 1.3 | 1 |
| H6 | 500 | 24 | 1.3 | 1 |
| H7 | 500 | 18 | 1.3 | 1 |
| H8 | 500 | 16 | 1.3 | 1 |
| p-18 | 400 | 18 | 1.5 | 1 |
| p-16 | 400 | 16 | 1.5 | 1 |
| p-14 | 400 | 14 | 1.5 | 1 |
| tag-text | 500 | 16 | 1.3 | 10 |

Só listei os estilos usados na tela Desktop. A unidade do espaçamento veio sem identificação no export e deve ser confirmada na implementação.

## Copy final

Já com as decisões do `AGENTS.md` aplicadas.

**Header:** logo Border-IA, links Recursos, Sobre e Depoimentos, botão Comunidade.

**Hero**
- Tag: Plugin Figma
- H1: Acelere sua criação de interfaces
- Parágrafo: Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde.
- Botão: Usar no Figma
- Visual: interface do Figma com o card do plugin (Magic copy, "Crie exemplos de headline para meu produto", Generating..., Start now)

**Recursos**
- Tag: Recursos
- H2: Como o Border-IA te ajuda no dia a dia
- Removedor de fundo: Torne o fundo transparente em qualquer foto.
- Gerador de texto: Gere textos de espaço reservado para suas interfaces.
- Amplificador de imagem: Amplie imagens e melhore sua resolução.
- Gerador de avatar: Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc.

**Banner CTA**
- Avatares de pessoas reais
- Texto: Mais de +5.000 designers já estão utilizando
- H3: Concentre-se no design, não na rotina.
- Botão: Usar no Figma

**Footer:** logo, Discord, GitHub, Instagram, "Desenvolvido por: João Gabriel".

## Elementos de movimento e shapes

Pontos do layout que pedem movimento ou tratamento realista, vistos nas telas:
- Oval desenhado em volta de "interfaces" no H1.
- Rabisco sob "Border-IA" no H2 de Recursos.
- Feixe de luz vertical roxo no hero, que desce até o card do plugin.
- Malha de pontos no hero e nos cantos do banner.
- Card do plugin com estado "Generating...".
- Mockup da interface do Figma que some em fade na base.
- Logo em dois losangos com gradiente.

A coreografia é decisão da especificação. O pedido do João: movimento presente e shapes realistas, sem perder fidelidade ao layout.
