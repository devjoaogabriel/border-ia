# Handoff 10: itens restantes do review e da auditoria de segurança

## Pedido do João

Projetar a spec `009` com os itens que ficaram fora da 008, do code review (`docs/review/01-code-review.md`) e da auditoria de segurança (`docs/review/02-seguranca.md`).

## Estado atual (`main`, commit `628d392`)

- A spec 008 foi implementada. Lighthouse Mobile 58 (TBT 1,9 s), Desktop 79. São 10 suítes Vitest com 124 testes.
- **Já resolvidos, fora da 009:**
  - CR-01 a CR-05, CR-10 e CR-11.
  - SE-01 (`src/lib/links.ts`, `resolveSiteLinkAttributes`) e SE-02 (`src/lib/mask-style.ts`, `buildMaskStyle`).
  - Parte do CR-07: `BEAM_REST_TIP` vem de `src/lib/hero-beam-math.ts` e o `gsap.ts` não repete mais o 511.
- Os desvios da 008 estão no fim de `specs/008-correcoes-review/tasks.md`. Leia antes de propor CSS ou reset de estado.

## Itens da spec 009

**Code review**

1. **CR-06:** o cursor fica desfocado quando o `devicePixelRatio` muda (troca de monitor ou zoom).
2. **CR-07, o que falta:** helper de reset do singleton `heroCardMotion` para testes e a ordem de execução entre `syncMotion` e `follow` no `gsap.ticker` (1 quadro de atraso entre o path SVG e o shader).
3. **CR-08:** `getBoundingClientRect()` e um `gsap.to` novo a cada `pointermove` no `MagicCopyCard`. Avaliar cache do retângulo e `gsap.quickTo`, sem mudar a sensação do hover aprovada.
4. **CR-09:** `ExtrudeGeometry` sem `dispose()` e `pointermove` não passivo sempre ativo em `PluginPrismLogo3D`.
5. **CR-12:** constantes verticais fixas no shader (`278.5`, `218.5`) e `uniforms` sem sincronizar depois do mount em `HeroBeamCanvas`.
6. **CR-13:**
   - Falta link de pular para o conteúdo, e `id="hero-heading"` está na `div` e não no `h1`.
   - O giro da `.btn-shine` continua com foco de teclado parado.
   - `public/icons/dot-matrix.svg` (254 KB, usado por `DotMatrixDecor variant="asset"` no banner) pode virar a versão CSS, **desde que o banner fique visualmente igual**. Compare antes e depois.
   - `stroke-scribble.svg` está órfão.

**Segurança**

7. **NV-01:** cabeçalhos HTTP de segurança e CSP. O Next 16 com `cacheComponents` e scripts inline exige cuidado com a CSP (veja o SE-04). Proponha o conjunto de cabeçalhos em `next.config.ts` e diga o que só dá para validar no deploy.
8. **SA-INFO-01:** desligar o `X-Powered-By` (`poweredByHeader: false`).
9. **SE-03:** concatenação manual de XML em `createPrism` (`PluginPrismLogo3D.tsx`).
10. **SE-04:** documentar que `npm audit fix --force` não deve rodar (rebaixa o `eslint-config-next`). Avaliar se cabe uma guarda de teste.

## Regras para a spec

- TDD: cada item com lógica testável ganha teste Vitest antes. Os 124 testes seguem verdes.
- Lighthouse antes e depois (3 rodadas Mobile e 3 Desktop, `lighthouse@12.8.2`), sem piorar o TBT nem as notas 100.
- Testar em Chromium e WebKit.
- Sem dependência nova sem liberação do João.
- Não alterar o visual aprovado: brilho do H1, oval, rabisco, logo, card, corda, onda, cursor, botões e banner.
- Trabalhar na `main`, sem branch, sem commit e sem push.
- Proibido travessão (U+2014).
