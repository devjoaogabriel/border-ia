# Guia de Execucao Rapida e TDD: Itens Restantes do Review (`009-itens-restantes-review`)

**Feature**: `009-itens-restantes-review`
**Date**: 2026-11-07

---

## 1. Roteiro de Implementacao TDD Passo a Passo

Para cumprir a lei de ferro de `test-driven-development`, siga a ordem abaixo:

### Passo 1: Hardening de Seguranca (NV-01, SA-INFO-01, SE-03, SE-04)
1. Criar `src/lib/svg-path-sanitizer.test.ts` com testes para `sanitizeSvgPathD` (caminhos validos vs strings com `<` ou `>`).
2. Adicionar testes em `src/security/source-and-config.test.ts` validando:
   - Presenca de `poweredByHeader: false` em `next.config.ts`.
   - Presenca do metodo `headers()` com os 5 cabecalhos de seguranca configurados.
   - Trava de versao de `eslint` e `eslint-config-next` no `package.json`.
3. Executar `npx vitest run src/lib/svg-path-sanitizer.test.ts src/security/source-and-config.test.ts` e confirmar falha (RED).
4. Implementar `src/lib/svg-path-sanitizer.ts`, atualizar `next.config.ts` e conectar `sanitizeSvgPathD` em `PluginPrismLogo3D.tsx`.
5. Executar os testes e confirmar que passam (GREEN).

### Passo 2: Parametrizacao do Shader e Reset do Singleton (CR-07, CR-12)
1. Adicionar testes em `src/lib/hero-beam-math.test.ts` para:
   - `deriveShaderVerticalMask(525)` retornando `{ halfH: 218.5, centerY: 278.5 }`.
   - `resetHeroCardMotion()` redefinindo todos os campos para os valores de repouso.
2. Executar `npx vitest run src/lib/hero-beam-math.test.ts` e confirmar falha (RED).
3. Implementar as funcoes em `src/lib/hero-beam-math.ts` e atualizar `HeroBeamCanvas.tsx` para usar a expressao derivada no GLSL e sincronizar uniforms em `useEffect`.
4. Executar os testes e confirmar que passam (GREEN).

### Passo 3: Nitidez do Cursor em Mudanca de Densidade (CR-06)
1. Adicionar testes em `src/lib/cursor-mesh-math.test.ts` para `computeCursorDprMetrics` (grampeando dpr entre 1 e 2).
2. Executar teste e confirmar falha (RED).
3. Implementar `computeCursorDprMetrics` em `src/lib/cursor-mesh-math.ts` e atualizar `CursorDotMesh.tsx` adicionando listener de `resize` `{ passive: true }` para reajustar o canvas caso `devicePixelRatio` mude.
4. Executar os testes e confirmar que passam (GREEN).

### Passo 4: Otimizacao do Card e Memoria 3D (CR-08, CR-09)
1. Em `MagicCopyCard.tsx`:
   - Cachear `stage.getBoundingClientRect()` em `pointerenter` (invalidando em scroll e resize).
   - Utilizar `gsap.quickTo` para `rotationX` e `rotationY`, garantindo que nao haja alocacoes de tweens a cada evento de movimento.
2. Em `PluginPrismLogo3D.tsx`:
   - Adicionar descarte das geometrias `back` e `front` via `dispose()` no cleanup do `useEffect`.
   - Adicionar `{ passive: true }` no listener de `pointermove`.

### Passo 5: Acessibilidade Semantica e Otimizacao de Assets (CR-13)
1. Criar `src/components/ui/SkipToContent.tsx` com link de ancoragem para `#conteudo-principal` e renderizar no inicio da pagina.
2. Em `src/components/ui/animated-shiny-text.tsx`, aplicar `id="hero-heading"` diretamente na tag `<motion.h1>`.
3. Em `src/app/globals.css`, ajustar `.btn-shine:is(:focus-visible:not(:hover))` para limitar o loop de giro continuo sob foco estatico de teclado.
4. Em `BannerSection.tsx`, testar `DotMatrixDecor variant="css"`. Confirmar visualmente se a equivalencia e identica; se aprovada, excluir o arquivo orfao `stroke-scribble.svg` e remover dependencia de `dot-matrix.svg`.

---

## 2. Protocolo de Medicao do Lighthouse (Antes vs Depois)

1. **Compilar e Iniciar Servidor de Producao**:
   ```powershell
   npm.cmd run build
   npx next start -p 3099
   ```

2. **Executar 3 Rodadas Mobile e 3 Desktop com `lighthouse@12.8.2`**:
   ```powershell
   # Mobile (3 rodadas)
   npx lighthouse http://localhost:3099 --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --output=json --output-path=./lh-mobile-009-1.json --chrome-flags="--headless"
   # Desktop (3 rodadas)
   npx lighthouse http://localhost:3099 --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --output=json --output-path=./lh-desktop-009-1.json --chrome-flags="--headless"
   ```

3. **Registrar a Tabela Comparativa no Encerramento de `tasks.md`**.

---

## 3. Comandos de Validacao do Portao

```powershell
# 1. Executar todos os testes unitarios
npm.cmd test

# 2. Executar linter sem erros
npm.cmd run lint

# 3. Compilar build de producao
npm.cmd run build

# 4. Validar ausencia de travessoes (U+2014)
Get-ChildItem -Path src, specs, docs -Recurse -File | Select-String -Pattern "\u2014"
```
