# 06 — Animações

## 1. Princípios

- **Três camadas por ação importante:** movimento + partícula + som. É o que Hearthstone chama de *sequenciamento e dramatização* e o que Balatro chama de *juice*.
- **Antecipação → ação → impacto → assentamento.** A carta recua antes de voar, bate com força, a tela treme, a poeira baixa.
- **Durações:** micro 150–250 ms, padrão 400–700 ms, momentos dramáticos 1,2–2,5 s (só revelações).
- **O apresentador manda:** `→` durante qualquer animação pula direto para o estado final.
- **Projetor:** nada depende do mouse. Brilhos e holo se movem sozinhos.

## 2. Ferramentas

Sem dependências novas pesadas:

| Ferramenta | Uso |
|---|---|
| **Framer Motion** (já instalado) | Molas, `layoutId` (carta da mão para a arena e para a ampliação), `AnimatePresence`, sequências com `useAnimate` |
| **CSS** (`@keyframes`, `@property`) | Loops de ambiente: velas, brasas, holo, borda girando, pulsos |
| **SVG** | Líquido dos orbes, correntes, seta do tutorial, queima (`feTurbulence` + `feDisplacementMap`), texturas das molduras |
| **canvas-confetti** (já instalado) | Explosões: faíscas, moedas e estrelas, com `shapeFromText` para ✦ e ◆ |
| **Howler** (já instalado) | Som sincronizado com o impacto |

Arquivos novos: `src/styles/movimento.ts` (molas e durações padronizadas), `src/engine/useTremor.ts` (tremor do palco), `src/components/efeitos/Explosao.ts` (atalhos do canvas-confetti: `faiscas(x, y)`, `moedas(x, y)`, `estrelas(x, y)`), `src/components/efeitos/FiltrosSVG.tsx` (filtros compartilhados).

```ts
// movimento.ts
export const mola = {
  carta:   { type: 'spring', stiffness: 260, damping: 22 },
  impacto: { type: 'spring', stiffness: 500, damping: 18 },
  suave:   { type: 'spring', stiffness: 120, damping: 20 },
};
```

## 3. Catálogo

### Cartas
| Momento | Animação | Tempo | Som |
|---|---|---|---|
| Compra | As cartas saem do baralho no canto em arco, viram no ar e param na mão | 600 ms, 150 ms entre cartas | deslizar de carta |
| Ociosa | "Respira": sobe e desce 3 px em loop de 4 s | loop | — |
| Jogável | Contorno pulsante na cor da lógica | loop | — |
| Foco | Sobe 40 px, cresce 1,2× e inclina levemente | 200 ms | — |
| Escolhida | A outra carta dessatura e desce; a escolhida sobe, borda de ouro, rufar de tambor | 1 s | tambor |
| Jogada | Recua, voa em arco até o Desafio, bate (escala 1,2 → 1), onda de choque dourada, poeira, **tremor do palco** de 8 px por 250 ms | 700 ms | batida |
| Descarte | A carta não escolhida queima de baixo para cima com borda de brasa e some em cinzas | 800 ms | chama |
| Virar | `rotateY` 180° com mola e um reflexo de luz cruzando no meio | 700 ms | virar carta |
| Holo | Reflexo arco-íris (`conic-gradient` + `mix-blend-mode: color-dodge`) varrendo a carta sozinho a cada 4 s; técnica do projeto pokemon-cards-css | loop | — |
| Ampliação | Voo até o centro com `layoutId`, fundo escurece e desfoca | 350 ms | — |

### Revelações
| Momento | Animação | Tempo |
|---|---|---|
| **Forja do Combinar** | Tela escurece 60%. Planejar e Adaptar voam para o centro, orbitam cada vez mais rápido, colidem num clarão branco. As correntes quebram em pedaços que caem. A Combinar desce girando 720°, pousa com onda de choque dourada, raios de luz girando atrás e 80 faíscas douradas | 2,5 s |
| Combinar não forjada | A carta treme, as correntes chacoalham, o cadeado pisca vermelho | 600 ms |
| Carta do Destino | O baralho embaralha (3 cartas se cruzando), a do topo vira com um balanço de suspense e pousa; favorável solta folhas verdes, desfavorável solta fumaça vermelha | 1,5 s |
| Selo da Crônica | Selo de cera cai de 3× para 1× com baque e respingo; "Como na história real" em ouro, "fez diferente" em carmim | 500 ms |
| Lendária Aprendizados | Os tomos orbitam, clarão, a carta desce com raios e estrelas | 2,5 s |
| Veredito "Complementares" | Selo de cera gigante batendo na tela, com tremor | 600 ms |

### Dado do Destino
1. O d20 (hexágono SVG com faces triangulares e número no centro) é lançado, gira, quica duas vezes na mesa com achatamento (*squash*) e para.
2. O bônus voa da Leitura do Mapa até o dado e soma com contagem animada (estilo Balatro, com "tic" a cada número).
3. A faixa aparece em faixa de pergaminho: **Crítico** com clarão dourado e estrelas, **Sucesso** em verde, **Falha** com rachadura e vinheta vermelha pulsando uma vez.

Tempo total ~1,8 s. Som: dado rolando, tics, acorde da faixa.

### HUD e mesa
| Momento | Animação |
|---|---|
| Orbe muda | O líquido sobe ou desce com mola e ondula; o número conta até o valor novo |
| Ganho | Número verde de 72 px sobe; moedas (Caixa), figuras (Clientes) ou brasas (Moral) voam do Desafio até o orbe |
| Perda | Número vermelho cai; o orbe treme e pisca |
| Quase quebrou | Orbe racha (SVG) e pulsa em vermelho |
| Canvas | Cada bloco tocado se acende como tinta se espalhando (`clip-path` circular crescendo) na cor da lógica |
| Mapa da jornada | O marco concluído recebe o sigilo da carta com um "carimbo"; o próximo começa a pulsar |
| Grimório | Linhas digitadas; notificação desliza da direita com "ping" |

### Ambiente e fases
| Onde | Animação |
|---|---|
| Sempre | Velas oscilando, brasas subindo, deriva lenta do fundo |
| Entre fases | Página de tomo virando (rotação 3D com sombra), 900 ms |
| F0 Abertura | Grimório digitando, runas acendendo em volta, título surgindo de brasas com varredura de luz |
| F3 Resultado | Contagem da pontuação, medalha do rank "forjada" (brilho de metal quente esfriando), estandarte do título desenrolando, fio de ouro ligando as escolhas iguais |
| F5 Créditos | Pergaminho desenrolando e subindo |

## 4. Desempenho

- Animar só `transform` e `opacity`; `will-change` só nas cartas em movimento.
- Filtros (`blur`, `feTurbulence`) só em elementos parados, nunca durante o voo da carta.
- Limite de 150 partículas por explosão.
- `prefers-reduced-motion`: giros, tremor e partículas viram fades curtos.
- Testar no notebook que vai para a sala, com o DevTools em "Performance": alvo de 60 fps.

## 5. Critérios de aceite

- Toda ação da tabela "Cartas" e toda revelação têm movimento e som.
- Nenhuma animação passa de 2,5 s, e todas pulam com `→`.
- A vitrine (`#vitrine`) tem botões para disparar cada animação isolada.
