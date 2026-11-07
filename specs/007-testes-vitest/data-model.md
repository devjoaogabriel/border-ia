# Phase 1 Data Model & Module Map: Suite Vitest (`007-testes-vitest`)

**Feature**: `007-testes-vitest`
**Date**: 2026-11-07

## 1. Mapa de Extracao de Modulos Puros (`src/lib/*`)

| Modulo Destino (Novo) | Arquivo(s) de Origem | Simbolos Exportados | Consumidores Atualizados |
|-----------------------|----------------------|---------------------|--------------------------|
| `src/lib/cursor-mesh-math.ts` | `src/components/motion/CursorDotMesh.tsx` | `CURSOR_MESH_CONSTANTS` (`PATCH`, `HALF`, `STEP`, `CROWN_RADIUS`, `OUTER_CUTOFF`, `FOLLOW_RATE`, `PRESENCE_IN`, `PRESENCE_OUT`, `INTERACTIVE_RATE`, `MAX_ALPHA`, `COLOR`, `BAYER`), `smoothstep`, `approach`, `createInitialCursorState`, `computeCursorCellAlpha`, `advanceCursorMeshState` | `CursorDotMesh.tsx` |
| `src/lib/hero-beam-math.ts` | `src/components/three/HeroBeamLazy.tsx` + `src/lib/gsap.ts` | `BEAM_GEOMETRY` (`BEAM_WIDTH`, `BEAM_VISIBLE_HEIGHT`, `BEAM_OVERLAP`, `BEAM_HEIGHT`, `BEAM_CENTER`, `BEAM_TUCK`, `BEAM_REST_TIP`, `MESH_HALF_WIDTH`, `CANVAS_WIDTH`), `projectBeamContact`, `stepBeamSpring`, `beamPath`, `BEAM_REST_PATH` | `HeroBeamLazy.tsx`, `src/lib/gsap.ts` (`tipY: BEAM_REST_TIP`) |
| `src/lib/card-tilt-math.ts` | `src/components/ui/MagicCopyCard.tsx` | `CARD_TILT_CONFIG`, `computeCardHoverAngles` | `MagicCopyCard.tsx` |
| `src/lib/links.ts` | `src/components/ui/CtaButton.tsx`, `Header.tsx`, `Footer.tsx` | `SafeAnchorAttributes`, `resolveSiteLinkAttributes` | `CtaButton.tsx`, `Header.tsx`, `Footer.tsx` |
| `src/lib/mask-style.ts` | `src/components/ui/MaskIcon.tsx` | `buildMaskStyle` | `MaskIcon.tsx` |

## 2. Catalogo das Suites de Teste Vitest (`src/**/*.test.ts`)

| Arquivo de Teste | Area | Casos Principais Verificados |
|------------------|------|------------------------------|
| `src/lib/cursor-mesh-math.test.ts` | Desempenho | `484` celulas totais (`22x22`), exatamente `168` descartes em `dist >= 40` (`316` avaliadas), teto `alpha <= 0.9`, expansao `+22%` com `interactive = 1`, `dt` grampeado em `0.05s` para salto de `10s`, convergencia para hibernacao (`presence === 0`, `rafId === -1`) em `< 60` frames a `60Hz`. |
| `src/lib/hero-beam-math.test.ts` | Desempenho | Repouso `(0, 0, 0) -> { tipX: 0, tipY: 511, targetBendX: 0 }`, simetria `±rotationY`, clamp de radianos em `[-1, 1]`, convergencia estavel de `stepBeamSpring` em `60Hz` e `dt = 0.05s` sem divergencia, formato exato de `beamPath`. |
| `src/lib/card-tilt-math.test.ts` | Desempenho | Centro `(0, 0) -> (0, 0)`, saturacao `Math.tanh` dentro de `±10` (`X`) e `±12` (`Y`) inclusive para `|norm| > 1`, inversao de sinal em `rotationX`, reducao exata `0.35x` quando `overCta = true`. |
| `src/lib/scalability-budget.test.ts` | Escalabilidade | `CANVAS_WIDTH === 504` cabendo em `1024px` (`0.621 * 1007 + 97 + 252 < 1007`), teto constante de pixels em `4K` (`504 * 525 * 4 = 1.058.400`), existencia de todos os icones/avatares em `public/`, `@property --shine-angle` com `inherits: false` e `paused` em repouso em `globals.css`. |
| `src/lib/links.test.ts` | Seguranca | Validacao integral de `SITE_LINKS` (`navItems`, `ctas`, `socialLinks`), `target="_blank"` + `rel="noopener noreferrer"` obrigatorios em `https://`, rejeicao de `javascript:`, `data:`, `http:` e de `https://` com `external: false`, existencia de `public/icons/social-${id}.svg`. |
| `src/lib/mask-style.test.ts` | Seguranca | Aceita `/icons/*.svg` emitindo `url("/icons/...") center / contain no-repeat`, rejeita `..`, espacos, aspas, `;`, parenteses e URLs externas, valida `LOGO_MARK.back.d` e `LOGO_MARK.front.d` contra gramatica SVG path segura. |
| `src/security/svg-assets.test.ts` | Seguranca | Varre todos os `.svg` em `public/` e `src/app/` bloqueando `<script`, `<foreignObject`, `on[a-z]+=`, `javascript:`, `data:` e URLs `http(s)://` fora dos namespaces XML padrao. |
| `src/security/source-and-config.test.ts` | Seguranca | Varre `src/**/*.{ts,tsx}` garantindo `0` ocorrencias de `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `eval(`, `new Function(`, `document.write(`, `process.env` e `\u2014`; verifica `rel="noopener noreferrer"` em todo `target="_blank"`; valida `.env*` no `.gitignore` e `dangerouslyAllowSVG !== true` em `next.config.ts`. |
