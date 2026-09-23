# 00 — Visão geral do redesign

> Um arquivo por tópico. Este resume o entendimento, os pilares, o roteiro e a ordem de implementação.
> Substitui as seções 5 a 7 e 10 do plano antigo ([`../plano-original.md`](../plano-original.md)), que fica como histórico.

| Arquivo | Tópico |
|---|---|
| [01-tema-e-hud.md](01-tema-e-hud.md) | Taverna, Grimório (livro de registros), paleta, mesa, cartas, HUD |
| [02-jogabilidade.md](02-jogabilidade.md) | O que muda na rodada (pouco na regra, muito na experiência) |
| [03-historia.md](03-historia.md) | Narradores, roteiro de cada etapa, como os artigos entram |
| [04-visibilidade.md](04-visibilidade.md) | Palco fixo, tamanhos mínimos, foco, ampliação de cartas |
| [05-tutorial.md](05-tutorial.md) | Tour com holofote, setas e balões |
| [06-animacoes.md](06-animacoes.md) | Catálogo de animações e como implementar |
| [07-tipografia.md](07-tipografia.md) | Duas serifadas medievais: títulos e texto |
| [08-assets.md](08-assets.md) | Imagens para gerar (com prompts), ícones, sons |
| [09-referencias.md](09-referencias.md) | Jogos e programas pesquisados |
| [10-briefing-quadro.md](10-briefing-quadro.md) | F1 como quadro de missões da taverna (proposta aprovada) |

---

## 1. Entendimento

**Pedido:** tema de fantasia medieval de taverna (estilo Hearthstone); HUD melhor; jogo mais divertido; história mais imersiva e que explique os artigos; cartas grandes e ampliáveis para a turma toda; tutorial visual com setas; muitas animações; tipografia serifada; pesquisa de referências.

**Respostas às perguntas:**
- A apresentação pode ter de 20 a 25 minutos.
- A turma inteira joga como a guilda fundadora.
- A história segue o caso real (Healthy Skin); a fantasia fica no visual.
- Nada de isekai ou reencarnação.
- **Só medieval (decisão de 23/09):** o toque de terminal pedido no início saiu. Nada de fonte monoespaçada, ciano, cursor ou janelas de "sistema"; o Grimório virou um livro de registros escrito a pena.
- A turma vota **só levantando a mão**, com **poucas opções por vez**.
- **Desenvolvimento simples:** a regra muda pouco; história, arte e animação podem ser ricas.

**Premissas (corrigir na revisão se estiverem erradas):** offline, projetor 16:9, apresentador com teclado ou passador, sem cronômetro, mesma stack (React 18 + Vite + TS + Tailwind + Framer Motion + Howler + canvas-confetti), deploy no GitHub Pages. "Offline" quer dizer que o jogo não depende de rede depois de carregado (fontes e assets vão no build); se a sala não tiver internet, apresentar do notebook com `npm run build && npm run preview`.

---

## 2. Nome

**A Taverna dos Dois Tomos** — *a crônica de uma startup real, jogada em cartas.* Os dois artigos viram dois tomos sobre a mesa, cada um com um narrador.

---

## 3. Pilares

1. **Legível do fundo da sala.** Nenhum texto essencial abaixo de 36 px num palco de 1920×1080; um foco por tela.
2. **Votar é simples.** 2 cartas por votação; a 3ª (Combinar) só na última etapa, se destravada. Todo o resto acontece sozinho depois do voto.
3. **A regra muda pouco.** O motor atual continua (4 etapas, 3 eventos, Combinar destravável). Entram só um dado d20 com bônus do contexto e textos novos.
4. **Juice em toda ação.** Cada ação importante tem movimento, partícula e som, como em Hearthstone e Balatro.
5. **Os artigos aparecem o tempo todo**, pela voz de dois narradores, e não só no fim.

### Onde cada artigo aparece

| Momento | Artigo A (Cartógrafo) | Artigo B (Cronista) |
|---|---|---|
| F1 A Taverna | Carta do tomo: 38 estudos, 21 anos, Matriz dos 3 Níveis | Carta do tomo: 1 startup, 2016–2024, Canvas em Movimento |
| Antes de cada voto | **Leitura do Mapa**: micro, meso e macro do momento | — |
| Dado | O bônus do contexto vem da Leitura do Mapa | — |
| Depois de cada voto | O que a literatura diz | **Crônica**: o que a Healthy Skin fez, com citação real |
| Consequência | — | Blocos do Canvas que a decisão tocou se acendem |
| Eventos | Princípios da effectuation (Colcha de Retalhos, Limonada) | Fatos reais (hospitais parceiros, Covid, incubadora) |
| F3 Resultado | — | Canvas da turma × Canvas real |
| F4 Confronto | Semelhanças, diferenças, atributos, veredito, tema central | idem |
| F5 Fusão | Aprendizados dos dois | idem |

---

## 4. Roteiro (~21 min)

| Fase | Tempo | O que acontece |
|---|---|---|
| F0 Abertura | 0:45 | O Grimório escreve a abertura a pena, as velas acendem, o título surge |
| F1 A Taverna | 3:00 | Missão; o Cartógrafo e a Cronista apresentam os tomos; as cartas de decisão |
| Tutorial | 1:30 | Tour com holofote e setas sobre a mesa da rodada |
| F2 A Crônica | 9:00 | 4 etapas de ~2:15 |
| F3 Resultado | 2:00 | Rank da guilda, título, caminho e Canvas da turma × os reais |
| F4 Confronto dos Tomos | 3:00 | Veredito, semelhanças, diferenças, atributos, tema central |
| F5 Fusão | 1:30 | Carta lendária "Aprendizados" e créditos |

Folga de ~3 min para perguntas e imprevistos dentro dos 25.

---

## 5. Ordem de implementação

Cada iteração termina com `npm run build` e `npm test` passando e um commit.

| # | Iteração | Entrega |
|---|---|---|
| 1 | Base visual | Palco 1920×1080, tokens, fontes, fundo da taverna, Grimório, transição entre fases — **feita** ([plano](../superpowers/plans/2026-09-22-iteracao-1-base-visual.md)) |
| 2 | Cartas e HUD | Molduras novas, ampliação de carta, orbes, mapa da jornada, vitrine atualizada — **feita** ([plano](../superpowers/plans/2026-09-23-iteracao-2-cartas-e-hud.md)) |
| 3 | Rodada | Dados novos, d20 com bônus, mesa, votação, jogada, Crônica, Canvas, eventos, forja do Combinar — **feita** |
| 4 | Tutorial e demais fases | Tour, abertura, taverna, resultado, confronto, fusão — **feita** (a fusão animada ficou em §7) |
| 5 | Assets e ensaio | Imagens geradas, sons, teste no projetor, ensaio cronometrado, deploy — **código feito** (murmúrio, sons em todos os momentos, Carta do Destino nova, textos maiores, [roteiro de ensaio](11-ensaio.md)); falta a equipe ensaiar, testar no projetor e gerar os sons da 08 §6 |

## 6. Fora do escopo

Backend, votação por celular, cronômetro, game over, narrativa de isekai. Ideias que ficam de fora para manter o desenvolvimento simples (podem voltar depois): runas com efeito, brasão, trilhas de experiência, aplausômetro, Canvas com regras, quinta etapa, modo curto, desfazer passo.

## 7. Melhorias futuras

Pedidas durante o desenvolvimento, para depois do essencial:

- Animação ao selecionar uma carta na votação (hoje a carta escolhida só ganha destaque antes da revelação).
- Fusão animada das cartas dos dois tomos virando a carta lendária de aprendizado na F5 (03-historia.md §8).
- Tela inicial (F0) mais grandiosa: hoje está feia e o título não fica no centro. O Grimório escreve a abertura e sai; depois entra a tela de título, bem grandiosa e com elementos de RPG.
- Mais partículas que combinem com o tema, sem exagero (brasas, poeira dourada, faíscas nos momentos certos).
