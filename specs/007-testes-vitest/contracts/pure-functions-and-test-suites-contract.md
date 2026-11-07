# Pure Functions & Vitest Suites Contract (`007-testes-vitest`)

**Feature**: `007-testes-vitest`
**Date**: 2026-11-07

## 1. Assinaturas Exatas dos Modulos Puros Extraidos (`src/lib/*`)

### 1.1 `src/lib/cursor-mesh-math.ts`
Extraido de `src/components/motion/CursorDotMesh.tsx`:
```ts
import type { CursorMeshRuntimeState } from "@/types/landing";

export const CURSOR_MESH_CONSTANTS = {
  PATCH: 88,
  HALF: 44,
  STEP: 4,
  CROWN_RADIUS: 24,
  OUTER_CUTOFF: 40,
  FOLLOW_RATE: 24,
  PRESENCE_IN: 9,
  PRESENCE_OUT: 6.5,
  INTERACTIVE_RATE: 8,
  MAX_ALPHA: 0.9,
  COLOR: "#C9B3FF",
  BAYER: [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ],
} as const;

export function smoothstep(edge0: number, edge1: number, x: number): number;
export function approach(from: number, to: number, rate: number, dt: number): number;
export function createInitialCursorState(): CursorMeshRuntimeState;

/**
 * Retorna 0 se a celula estiver fora de OUTER_CUTOFF (168 de 484 celulas)
 * ou abaixo do limiar Bayer 4x4; caso contrario retorna alpha em (0, MAX_ALPHA].
 */
export function computeCursorCellAlpha(
  col: number,
  row: number,
  interactive: number,
  presence: number,
  elapsed: number,
): number;

/**
 * Grampeia rawDtSec em [0, 0.05], avanca x, y, presence, interactive e elapsed.
 * Retorna true quando deve hibernar (targetPresence === 0 && presence < 0.01),
 * zerando presence = 0 e definindo rafId = -1.
 */
export function advanceCursorMeshState(
  state: CursorMeshRuntimeState,
  rawDtSec: number,
): boolean;
```

### 1.2 `src/lib/hero-beam-math.ts`
Extraido de `src/components/three/HeroBeamLazy.tsx` e integrado com `src/lib/gsap.ts`:
```ts
export const BEAM_GEOMETRY = {
  BEAM_WIDTH: 340,
  BEAM_VISIBLE_HEIGHT: 497,
  BEAM_OVERLAP: 28,
  BEAM_HEIGHT: 525,
  BEAM_CENTER: 170,
  BEAM_TUCK: 14,
  BEAM_REST_TIP: 511,
  MESH_HALF_WIDTH: 247,
  CANVAS_WIDTH: 504,
} as const;

export function beamPath(bendX: number, tipX: number, tipY: number): string;
export const BEAM_REST_PATH: string;

export function projectBeamContact(anglesDeg: {
  rotationX: number;
  rotationY: number;
  rotation: number;
}): { tipX: number; tipY: number; targetBendX: number };

export function stepBeamSpring(
  bendX: number,
  velocity: number,
  targetBendX: number,
  rawDtSec: number,
): { bendX: number; velocity: number };
```

### 1.3 `src/lib/card-tilt-math.ts`
Extraido de `src/components/ui/MagicCopyCard.tsx`:
```ts
import type { CardTiltPhysicsConfig } from "@/types/landing";

export const CARD_TILT_CONFIG: CardTiltPhysicsConfig;

export function computeCardHoverAngles(
  normX: number,
  normY: number,
  overCta: boolean,
  config?: Pick<CardTiltPhysicsConfig, "hoverMaxRotateX" | "hoverMaxRotateY" | "hoverCtaDamping">,
): { rotationX: number; rotationY: number };
```

### 1.4 `src/lib/links.ts`
Extraido e padronizado para `CtaButton.tsx`, `Header.tsx` e `Footer.tsx`:
```ts
import type { SiteLink } from "@/types/landing";

export interface SafeAnchorAttributes {
  href: string;
  target?: "_blank";
  rel?: "noopener noreferrer";
}

/**
 * Valida allowlist estrita:
 * - external === true  -> exige /^https:\/\/[a-z0-9.-]+(\/[^\s]*)?$/i e retorna { href, target: "_blank", rel: "noopener noreferrer" }.
 * - external === false -> exige /^#[a-z0-9-]+$/i e retorna { href }.
 * Qualquer divergencia ou esquema inseguro (javascript:, data:, http:, //) lanca Error.
 */
export function resolveSiteLinkAttributes(link: SiteLink): SafeAnchorAttributes;
```

### 1.5 `src/lib/mask-style.ts`
Extraido de `src/components/ui/MaskIcon.tsx`:
```ts
import type { CSSProperties } from "react";

/**
 * Aceita exclusivamente caminhos locais /^\/icons\/[a-z0-9-]+\.svg$/i e size > 0.
 * Emite { width: size, height: size, mask: `url("${src}") center / contain no-repeat` }.
 * Lanca Error para qualquer path fora do padrao.
 */
export function buildMaskStyle(src: string, size?: number): CSSProperties;
```

---

## 2. Regras de Execucao TDD e Portao de Pronto (`verification-before-completion`)

1. **Proibido escrever o modulo puro antes do teste falhar**: cada arquivo `*.test.ts` deve ser criado primeiro e executado via `npx vitest run <arquivo.test.ts>` comprovando falha real (`Verify RED`).
2. **Proibido alterar visual ou instalar pacotes**: `package.json` nao recebe `jsdom` nem `@testing-library/react` sem autorizacao previa do Joao.
3. **Portao obrigatorio de evidencias antes de concluir**:
   - `npm test` -> `0` falhas, todas as 8 suites passando.
   - `npm run lint` -> `0` erros.
   - `npm run build` -> codigo de saida `0`.
   - Medicao Lighthouse Mobile e Desktop (`3` rodadas `antes` em `333c3a4` + `3` rodadas `depois` na `main`) registrada em `specs/006-onda-e-malha-cursor/tasks.md` (`T001`/`T010`) e no fechamento da `007`.
