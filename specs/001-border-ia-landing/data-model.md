# Data Model & Estruturas de Conteudo: Landing Page Border-IA

**Feature**: `001-border-ia-landing` | **Data**: 2026-11-06

Como a aplicacao e uma landing page estatica sem banco de dados ou autenticacao, o modelo de dados governa as entidades tipadas em TypeScript (`src/lib/constants.ts` e `src/types/landing.ts`) que alimentam a interface, os destinos de links e a maquina de estados local do card demonstrativo.

## 1. Entidades de Conteudo e Configuracao

### 1.1 `SiteLink` e `SiteLinksConfig`

Centraliza todos os links internos de ancora e destinos externos da pagina (`FR-005`, `FR-012`).

| Campo | Tipo | Obrigatorio | Regra de Validacao |
|-------|------|-------------|--------------------|
| `id` | `string` | Sim | Identificador unico (`"recursos"`, `"sobre"`, `"depoimentos"`, `"comunidade"`, `"usar-no-figma"`, `"discord"`, `"github"`, `"instagram"`) |
| `label` | `string` | Sim | Texto visivel ou rotulo semantico em PT-BR |
| `href` | `string` | Sim | Ancora iniciada por `#` para navegacao interna ou URL `https://` valida para destino externo |
| `external` | `boolean` | Sim | Se `true`, renderiza `target="_blank"` e `rel="noopener noreferrer"` |
| `ariaLabel` | `string` | Condicional | Obrigatorio em links exibidos apenas com icone (redes sociais do rodape) |

**Valores Canonicos Padrao (`SITE_LINKS`)**:
- `navItems` (apenas Desktop):
  - `{ id: "recursos", label: "Recursos", href: "#recursos", external: false }`
  - `{ id: "sobre", label: "Sobre", href: "#sobre", external: false }`
  - `{ id: "depoimentos", label: "Depoimentos", href: "#depoimentos", external: false }`
- `ctas`:
  - `comunidade`: `{ id: "comunidade", label: "Comunidade", href: "https://discord.com", external: true }`
  - `usarNoFigma`: `{ id: "usar-no-figma", label: "Usar no Figma", href: "https://www.figma.com/community", external: true }`
- `socialLinks`:
  - `discord`: `{ id: "discord", label: "Discord", href: "https://discord.com", external: true, ariaLabel: "Comunidade do Border-IA no Discord" }`
  - `github`: `{ id: "github", label: "GitHub", href: "https://github.com", external: true, ariaLabel: "Codigo e portfolio no GitHub" }`
  - `instagram`: `{ id: "instagram", label: "Instagram", href: "https://instagram.com", external: true, ariaLabel: "Perfil do Border-IA no Instagram" }`

---

### 1.2 `FeatureItem` (Card de Recurso)

Representa cada um dos 4 itens da secao `section-itens` (`FR-008`, `FR-009`).

| Campo | Tipo | Obrigatorio | Regra de Validacao |
|-------|------|-------------|--------------------|
| `id` | `"bg-remover" \| "text-gen" \| "image-upscaler" \| "avatar-gen"` | Sim | Chave estavel em ordem exata do layout |
| `title` | `string` | Sim | Texto exato da pagina Documentacao do Figma |
| `description` | `string` | Sim | Texto exato com regras do `AGENTS.md` aplicadas |
| `iconPath` | `string` | Sim | Caminho local em `/icons/...` ou componente SVG inline local |

**Registros Canonicos (`FEATURE_ITEMS`)**:
1. `bg-remover`: `"Removedor de fundo"` -> `"Torne o fundo transparente em qualquer foto."`
2. `text-gen`: `"Gerador de texto"` -> `"Gere textos de espaço reservado para suas interfaces."`
3. `image-upscaler`: `"Amplificador de imagem"` -> `"Amplie imagens e melhore sua resolução."`
4. `avatar-gen`: `"Gerador de avatar"` -> `"Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc."`

---

### 1.3 `SocialProofAvatar`

Representa os 4 avatares circulares sobrepostos na `section-banner` (`FR-010`, `FR-014`).

| Campo | Tipo | Obrigatorio | Regra de Validacao |
|-------|------|-------------|--------------------|
| `id` | `string` | Sim | `"avatar-1"` a `"avatar-4"` |
| `src` | `string` | Sim | Caminho local em `/images/avatars/avatar-N.png` (ou `.webp`), nunca URL externa |
| `alt` | `string` | Sim | String vazia `""` quando o grupo inteiro e decorativo ao lado do texto de prova social |

---

### 1.4 `CopyContract` (Textos Imutaveis da Pagina)

Fonte unica dos textos validados por `AGENTS.md` e `docs/design/README.md`:

- `hero.tag`: `"Plugin Figma"`
- `hero.headingPrefix`: `"Acelere sua criação de "`
- `hero.headingHighlight`: `"interfaces"`
- `hero.description`: `"Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde."`
- `hero.cta`: `"Usar no Figma"`
- `pluginCard.title`: `"Magic copy"`
- `pluginCard.prompt`: `"Crie exemplos de headline para meu produto"`
- `pluginCard.statusGenerating`: `"Generating..."`
- `pluginCard.cta`: `"Start now"`
- `features.tag`: `"Recursos"`
- `features.headingBefore`: `"Como o "`
- `features.headingHighlight`: `"Border-IA"`
- `features.headingAfter`: `" te ajuda no dia a dia"`
- `banner.socialProof`: `"Mais de +5.000 designers já estão utilizando"`
- `banner.headingLine1`: `"Concentre-se no design,"`
- `banner.headingLine2`: `"não na rotina."`
- `banner.cta`: `"Usar no Figma"`
- `footer.creditLabel`: `"Desenvolvido por:"`
- `footer.creditAuthor`: `"João Gabriel"`

---

## 2. Estados de Interface e Movimento

### 2.1 Maquina de Estado do `MagicCopyCard` (`CM-06`, `FR-007`)

Controla a vitrine interativa do card no Hero sem alterar dimensoes nem textos base do layout:

- **`ambient`** (estado padrao pos-abertura):
  - Texto de status: `"Generating..."`
  - Com movimento padrao: rotacao suave continua do arco vetorial + brilho calmo na borda.
  - Com `prefers-reduced-motion: reduce`: arco estatico no angulo original do Figma, sem animacao continua.
- **`burst`** (disparado ao clicar/acionar `"Start now"`, duracao `~1.1s`):
  - Se ja estiver em `burst`, reinicia a timeline limpa (`overwrite: true`, sem empilhar chamadas).
  - Com movimento padrao: intensifica brevemente o pulso luminoso na borda superior e no emblema 3D, acelera suavemente uma volta do arco `"Generating..."` e realca a caixa de prompt antes de retornar suavemente a `ambient`.
  - Com `prefers-reduced-motion: reduce`: exibe confirmacao visual discreta de opacidade/contraste por `0.6s` sem rotacao nem escala, retornando a `ambient`.

### 2.2 Estado de Preferencia e Capacidade (`MotionEnvironment`)

Derivado no cliente para coordenar GSAP, Lenis e R3F:

| Propriedade | Tipo | Origem | Efeito |
|-------------|------|--------|--------|
| `reduceMotion` | `boolean` | `(prefers-reduced-motion: reduce)` | Desativa Lenis, define estados finais imediatos no GSAP e impede loops em WebGL |
| `canHover` | `boolean` | `(hover: hover) and (pointer: fine)` | Habilita inclinacao reativa ao cursor no `PluginPrismLogo3D` e hovers finos |
| `inViewport` | `boolean` | `IntersectionObserver` na `section-hero` | Alterna `frameloop` dos canvases R3F entre `"always"` e `"never"` |
| `webglSupported` | `boolean` | Deteccao de contexto WebGL + `ErrorBoundary` | Mantem o fallback SVG/CSS estatico visivel caso `false` |
