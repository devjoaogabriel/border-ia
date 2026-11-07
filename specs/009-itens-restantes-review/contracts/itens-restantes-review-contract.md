# Contratos de Codigo e Invariantes: Itens Restantes do Review (`009-itens-restantes-review`)

**Feature**: `009-itens-restantes-review`
**Date**: 2026-11-07

---

## 1. Contratos TypeScript Exatos

### 1.1 `src/lib/svg-path-sanitizer.ts`

```typescript
/**
 * Valida a sintaxe de um caminho SVG para o atributo 'd'.
 * - Aceita estritamente comandos SVG validos (M, m, L, l, H, h, V, v, C, c, S, s, Q, q, T, t, A, a, Z, z) e seus argumentos numericos.
 * - Rejeita strings com tags XML, scripts, aspas ou caracteres perigosos.
 * - Lanca Error se a validacao falhar.
 */
export function sanitizeSvgPathD(d: string): string;
```

### 1.2 `src/lib/hero-beam-math.ts`

```typescript
export interface ShaderVerticalMaskConfig {
  halfH: number;
  centerY: number;
}

/**
 * Calcula a posicao do centro e a meia-altura da mascara vertical eliptica do shader.
 * Para height = 525, retorna estritamente { halfH: 218.5, centerY: 278.5 }.
 */
export function deriveShaderVerticalMask(height: number): ShaderVerticalMaskConfig;

/**
 * Redefine o objeto mutavel heroCardMotion para seus valores iniciais de repouso.
 */
export function resetHeroCardMotion(): void;
```

### 1.3 `src/lib/cursor-mesh-math.ts`

```typescript
export interface CursorCanvasDprMetrics {
  dpr: number;
  physicalSize: number;
}

/**
 * Deriva a razao de aspecto de pixels (dpr) e o tamanho fisico em pixels da textura 2D do cursor.
 * Garante que dpr permaneca entre 1 e 2.
 */
export function computeCursorDprMetrics(rawDpr: number): CursorCanvasDprMetrics;
```

---

## 2. Contrato de Seguranca de Cabecalhos HTTP (`next.config.ts`)

O metodo `headers()` em `next.config.ts` DEVE retornar a seguinte estrutura para a rota `"/(.*)"`:

```typescript
[
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
  },
]
```

E no nivel raiz de `nextConfig`:
```typescript
poweredByHeader: false
```

---

## 3. Invariantes Arquiteturais e de Ciclo de Vida

- **Invariante SEC-01**: Toda interpolacao de caminho SVG em geradores 3D DEVE passar por `sanitizeSvgPathD` antes de atingir o `SVGLoader`.
- **Invariante SEC-02**: O arquivo `package.json` DEVE manter `eslint-config-next` na linha `>= 16.0.0` e `eslint` na linha `>= 9.0.0`. O comando `npm audit fix --force` e terminantemente proibido.
- **Invariante GRAPHICS-01**: `PluginPrismLogo3D` DEVE invocar `dispose()` em todas as instancias de `ExtrudeGeometry` na desmontagem.
- **Invariante GRAPHICS-02**: O listener de `pointermove` global em `PluginPrismLogo3D` DEVE possuir a opcao `{ passive: true }`.
- **Invariante GLSL-01**: O fragment shader de `HeroBeamCanvas` NAO DEVE conter os literais fixos `278.5` e `218.5`, utilizando as expressoes derivadas de `uSize.y`.
- **Invariante A11Y-01**: A aplicacao DEVE fornecer um elemento de ancoragem no inicio do documento com `href="#conteudo-principal"` visivel sob foco de teclado.
- **Invariante A11Y-02**: O identificador `id="hero-heading"` DEVE pertencer ao elemento `<h1>` semantico.

---

## 4. Portao `verification-before-completion`

Para declarar a feature 009 pronta:
1. **Vitest**: `npm.cmd test` DEVE passar com 100% de sucesso (>= 135 testes, 0 falhas).
2. **Lint**: `npm.cmd run lint` DEVE concluir com sucesso (exit 0).
3. **Build**: `npm.cmd run build` DEVE compilar com sucesso em producao (exit 0).
4. **Lighthouse**: Executar 3 rodadas Mobile e 3 Desktop com `lighthouse@12.8.2`, comprovando que o TBT Mobile permanece no patamar conquistado (<= 2000 ms) e notas 100 em A11y, BP e SEO.
5. **Travessoes**: Zero ocorrencias de `U+2014` em todo o repositorio.
