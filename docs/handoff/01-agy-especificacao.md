# Handoff 01: especificação do Border-IA (Claude Code para agy)

## O projeto

Landing page do Border-IA, um plugin de Figma com IA que ajuda designers a criar interfaces mais rápido. É uma página única com header, hero, recursos (4 cards), banner CTA e footer, em Desktop e Mobile.

O design já existe no Figma e está aprovado. O objetivo é levar para código com alta fidelidade, somando movimento e shapes realistas. Vai para o portfólio técnico do João.

## Papéis

- agy: planejador. Responde pelo o que e pelo porquê. Especifica com Spec-Kit.
- Claude Code: implementa, com acesso ao Figma.
- João: revisa só no final do projeto. Não pare para perguntar a ele.

## Leia nesta ordem

1. `AGENTS.md`: contrato do projeto, com stack, decisões de conteúdo e regras de git.
2. `docs/design/README.md`: tokens, tipografia, estrutura, copy final e pontos de movimento.
3. `docs/design/screens/desktop.png` e `docs/design/screens/mobile.png`: alvo visual, em resolução real.

Você não tem o MCP do Figma. Esse pacote substitui o acesso. Se faltar um dado visual, peça ao Claude Code pelo canal abaixo, sem inventar valor.

## Sua entrega

Rode o pipeline do Spec-Kit com as skills `speckit-*`, nesta ordem:

1. `speckit-constitution`: princípios do projeto. Fidelidade ao Figma, performance, acessibilidade e `prefers-reduced-motion` são inegociáveis.
2. `speckit-specify`: especificação da landing page.
3. `speckit-clarify`: resolva as ambiguidades sozinho, com base no `AGENTS.md` e no pacote de design. O que for decisão real de produto, registre como premissa explícita.
4. `speckit-plan` e `speckit-tasks`.
5. `speckit-analyze`: consistência final entre os artefatos.

A especificação precisa definir a coreografia de movimento (o que anima, quando, em qual gatilho) e quais elementos viram shape realista. Parta da seção "Elementos de movimento e shapes" do pacote. O plano deve respeitar a stack do `AGENTS.md`, sem trocar biblioteca.

Tarefas pequenas e verificáveis, cada uma com critério de aceite. O Claude Code executa por `tasks.md`.

## Limites

- Não faça commit, push nem crie branch. O Spec-Kit pode tentar criar branch de feature: mantenha tudo na `main`. Commits são ditados pelo João.
- Não edite `src/`, `package.json` nem `docs/design/`. Sua escrita fica em `.specify/` e `specs/`.
- Não leia arquivos `.env`.
- Em texto e arquivos: PT-BR, sem travessão (U+2014).

## Canal de retorno

Fale com o Claude Code pelo terminal dele, com prefixo `[de agy]`:

```
orca terminal send --terminal term_94749158-b7f2-499d-ab4b-2888e8ddd8fa --text "[de agy] <mensagem>" --enter --json
```

Ao terminar, envie uma mensagem com o caminho de `tasks.md`, as premissas assumidas e os pontos em aberto. Essa mensagem é o gatilho para o Claude Code começar a implementação.
