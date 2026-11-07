# Quickstart & Verification Protocol: Feature 007 (`007-testes-vitest`)

**Feature**: `007-testes-vitest`
**Date**: 2026-11-07
**Skills**: `test-driven-development` + `verification-before-completion`

## 1. Ciclo TDD Obrigatorio (Para Cada Suite)

1. Escrever apenas o arquivo `*.test.ts` daquela unidade.
2. Rodar `npx vitest run <caminho-do-teste>` e **assistir a falha esperada (RED)**.
3. Extrair o modulo puro correspondente em `src/lib/` e conectar ao componente consumidor.
4. Rodar `npx vitest run <caminho-do-teste>` e **assistir a aprovacao limpa (GREEN)**.

---

## 2. Comandos do Portao `verification-before-completion`

Nenhuma declaracao de conclusao pode ser emitida sem rodar integralmente na mesma sessao:

```powershell
npm test
npm run lint
npm run build
```

**Evidencias exigidas**:
- `npm test`: `8` arquivos de teste passando, `0` falhas, tempo `< 2s` em `environment: "node"`.
- `npm run lint`: codigo `0`, zero erros de ESLint.
- `npm run build`: codigo `0`, compilacao TypeScript e geracao estatica concluidas.

---

## 3. Protocolo Deterministico do Lighthouse (`antes` vs `depois`)

Para quitar a pendencia `T001` e `T010` das specs `005` e `006`:

1. **Medicao `antes` (commit base `333c3a4`)**:
   - Guardar temporariamente o estado atual: `git stash push -u -m "wip-spec-007-verification"`.
   - Gerar build limpo de `333c3a4`: `npm run build` e subir `npm run start -- -p 3099`.
   - Executar 3 rodadas Mobile e 3 rodadas Desktop contra `http://localhost:3099` e calcular a mediana de Performance, Accessibility, Best Practices, SEO, LCP, TBT e CLS.
   - Encerrar o servidor na porta `3099` e restaurar imediatamente a arvore: `git stash pop`.
2. **Medicao `depois` (estado atual + Spec `007` na `main`)**:
   - Rodar `npm run build` e subir `npm run start -- -p 3099`.
   - Executar 3 rodadas Mobile e 3 rodadas Desktop nas mesmas condicoes.
   - Registrar a tabela comparativa `antes vs depois` e marcar `T001` e `T010` em `specs/006-onda-e-malha-cursor/tasks.md`.
