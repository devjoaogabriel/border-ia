# Handoff 02: melhorias de design com a 21st.dev (pesquisa para Claude Code e agy)

## Como usar este documento

- **Claude Code:** leia, confira contra o código atual e repasse ao agy pelo canal de sempre (`orca terminal send`), junto com as duas pendências do fim deste arquivo. Quando a spec existir, implemente.
- **agy:** abra uma nova feature no Spec-Kit (`speckit-specify`, sugestão: `002-design-polish-21st`) a partir daqui, com S1–S4 como primeiras tarefas. Se a constituição exigir fidelidade estrita ao Figma, registre uma emenda: o João liberou os desvios desta lista.

## Objetivo

Elevar o visual da landing com componentes da 21st.dev. Todas as melhorias abaixo estão no escopo, inclusive as que mudam o layout do Figma. O João liberou essas mudanças em 07/11.

## Setup a resolver antes dos componentes (tarefas, não restrições)

- **S1. Iniciar shadcn:** `npx shadcn@latest init` compatível com Tailwind 4 e Next 16, criando `components.json` e `src/lib/utils.ts` (`cn` com `clsx` + `tailwind-merge`). Mapear as variáveis do shadcn para os tokens atuais (`gray-*`, `purple-*`, `indigo-*`), sem quebrar o `globals.css`.
- **S2. Adicionar `motion`** (Framer Motion) para os componentes que dependem dele. Ele convive com o GSAP: o GSAP segue cuidando de timelines e ScrollTrigger, e o `motion` fica com os componentes da 21st.
- **S3. Instalar pela 21st** com `npx shadcn add "https://21st.dev/r/<autor>/<componente>"` (a chave `API_KEY_21ST` precisa estar no ambiente) ou via `get_component` do MCP Magic. Depois, adaptar cores, fonte e copy aos tokens do projeto.
- **S4. Qualidade:** manter o padrão do AGENTS.md, ou seja, `prefers-reduced-motion` com estado final estático e código pesado carregado sob demanda. Se algum componente não oferecer isso, envolva-o, sem descartar o componente.

## Bibliotecas de referência na 21st.dev

- **Hyperiux:** CSS puro ou GSAP, já respeita reduced motion. A que melhor encaixa.
- **kevingirelli:** efeitos de borda e spotlight sem dependências.
- **Aceternity UI (manuarora700)** e **Magic UI (dillionverma):** efeitos mais conhecidos, usam `motion` (resolvido pelo S2).

## Melhorias propostas, por seção

Ordem sugerida: P1 primeiro, depois P2 e P3. Todas estão aprovadas.

| # | Seção / componente atual | Proposta 21st.dev | Prioridade | Notas |
|---|---|---|---|---|
| D1 | Recursos: 4 cards (`FeaturesSection`) | [Glowing Effect](https://21st.dev/@manuarora700/components/glowing-effect) (borda que acende seguindo o cursor). Alternativa mais sutil: [Spotlight](https://21st.dev/@kevingirelli/components/spotlight) | P1 | Borda com `--gradient-linear-degrade`. Só em `(hover: hover)`. |
| D2 | `MagicCopyCard` (hero) | [Animated Border](https://21st.dev/@kevingirelli/components/animated-border) (luz que percorre a borda) | P1 | Sincronizar com o pulso do feixe (`beamPulse`) que já acende `[data-card-glow]`; não duplicar animação. |
| D3 | `CtaButton` variante `primary-gradient` | [Shiny Button](https://21st.dev/@hyperiux/components/shiny-button) (borda conic animada, CSS puro). Alternativa: [Shimmer Button](https://21st.dev/@dillionverma/components/shimmer-button) | P1 | Manter tamanho, copy e cores do Figma. Brilho para em reduced motion. |
| D4 | Hovers em CSS em geral | (pendência, ver abaixo) | P1 | Envolver transições de hover em `motion-safe:` ou media query. |
| D5 | `Header` | [Elevate Navbar](https://21st.dev/@hyperiux/components/elevate-navbar): pill glass com hover em GSAP e menu mobile | P2 | Pode substituir o header atual. Manter logo e CTA da comunidade. |
| D6 | `BannerSection` (prova social) | [Testimonial Marquee](https://21st.dev/@harshjadhavconnect/components/testimonial-marquee) | P3 | Novo no layout. Usar os avatares de `SOCIAL_PROOF_AVATARS`; a copy dos depoimentos entra como placeholder marcado até o João enviar a real. |
| D7 | `Footer` | [Light Beam Footer](https://21st.dev/@kedhareswer/components/beam-wordmark-footer): feixe diagonal + wordmark grande | P3 | Substitui o footer atual. O crédito continua "Desenvolvido por: João Gabriel". |

## Pendências da feature 001 a incluir

1. **CM-10:** a onda luminosa nas malhas do banner ficou só com fade e escala, mas a tarefa está marcada como feita. Reabrir e especificar a onda de verdade (pode reaproveitar o padrão de pontos do shader do hero ou um gradiente animado em `mask`).
2. **Reduced motion nos hovers CSS:** hoje não respeitam `prefers-reduced-motion` (vira D4).

## Critérios de aceite sugeridos

- `npm run build` e `npm run lint` passam depois de S1–S3.
- Desktop (1440) e Mobile (430) sem quebra de layout. As mudanças em relação a `docs/design/screens/` são só as desta lista.
- Com `prefers-reduced-motion: reduce`, nenhum brilho, loop ou deslocamento animado.
- Lighthouse de performance continua verde (≥ 90).
- Sem commit nem push por agente: o João dita os commits (AGENTS.md).

## Conferência contra o código (Claude Code, commit 325dbfb)

**Confirmado:** não existem `components.json`, `src/lib/utils.ts` nem `motion`. Tokens, `--gradient-linear-degrade`, `beamPulse`, `[data-card-glow]`, `SOCIAL_PROOF_AVATARS` e a variante `primary-gradient` existem como o documento descreve. Os 8 componentes citados existem na 21st.dev (IDs para o `get_component`: Glowing Effect 1567, Spotlight 35180, Animated Border 35188, Shiny Button 27265, Shimmer Button 833, Elevate Navbar 26786, Testimonial Marquee 24457, Light Beam Footer 35251).

**Ajustes para a spec:**

1. **Constituição:** a emenda precisa cobrir dois pontos. O Princípio I (fidelidade ao Figma) e a cláusula de stack, que proíbe de forma explícita Framer Motion e bibliotecas de UI não previstas. O Princípio III (reduced motion) fica intacto. A seção Stack do `AGENTS.md` também precisa citar `motion` e shadcn.
2. **S3:** `API_KEY_21ST` não está definida no ambiente do Claude Code. O caminho previsto é o `get_component` do MCP, que consome cota diária. Cada componente pode voltar bloqueado, então a tarefa precisa prever isso.
3. **CM-10 está mais incompleto do que o documento diz.** A spec 001 pede duas coisas e faltam as duas: a revelação em sequência de container, avatares, prova social, título e botão (`0.65s` no total; hoje é um bloco só) e a onda de luminância radial nas malhas em ciclo curto enquanto o banner estiver visível. Reabrir a T024 da 001 nesse ponto.
4. **D2:** o Animated Border traz loop próprio. A luz precisa ser dirigida pela timeline que já move `beamPulse` em `MagicCopyCard`, com o loop do componente desligado.
5. **D3:** a descrição do Shiny Button não cita reduced motion, ao contrário do que a seção de bibliotecas sugere para a Hyperiux. Prever o envoltório do S4. `primary-gradient` só é usado no hero; o "Start now" do card é um botão próprio e fica fora do D3.
6. **D4:** 6 pontos a tratar: link do `Header`, `BorderIaLogo` (`hover:scale`), base do `CtaButton`, ícones de `FeaturesSection` (`hover:-translate-y`), sociais do `Footer` (`hover:-translate-y`) e "Start now" do `MagicCopyCard`.
7. **D5:** o header atual não tem menu mobile (a navegação some abaixo de `lg`), então o menu é funcionalidade nova. O Elevate Navbar traz painéis dropdown que não temos conteúdo para preencher: usar só links diretos. A coreografia usa `[data-m='header']` e precisa ser mantida.
8. **D6:** depoimento placeholder não pode ir a público como se fosse real. Definir na spec a marcação visível e o bloqueio de publicação até a copy real chegar.
9. **D7:** o componente é azul-marinho e traz colunas de links que não existem aqui. Recolorir para `gray-11` e tokens roxos, usar só os links de `SITE_LINKS` e manter `[data-m='footer']` e o crédito.
10. **Lighthouse ≥ 90:** a feature 001 nunca mediu performance. Medir a linha de base antes de S1, senão o critério não tem comparação.
