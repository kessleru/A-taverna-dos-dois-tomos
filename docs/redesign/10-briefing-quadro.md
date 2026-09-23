# 10 — Briefing (F1) como quadro de missões da taverna

> Proposta aprovada (22/09/2026). Em implementação: peças base e folha 1 prontas; folhas 2 a 4 ainda com o conteúdo antigo.
> Complementa o §4 de [03-historia.md](03-historia.md), que define o conteúdo das quatro telas da F1, e usa a base visual da iteração 1 (palco, tokens, fontes, Grimório).

## 1. Problema

Hoje a F1 é uma coluna estreita (`max-w-3xl`) centralizada, com tudo empilhado e rolagem: título, texto, cartas pequenas (260 px), cartas de decisão (170 px) e lista de regras. No palco de 1920×1080 sobra fundo dos dois lados, o texto fica pequeno (14 a 18 px) e o conteúdo passa do fim da tela. Falta também o clima de taverna: não há nada de madeira, pergaminho ou ornamento.

## 2. Conceito

**O quadro de missões da taverna.** Em RPG, a taverna tem um quadro de madeira na parede onde se pregam avisos, pedidos e cartazes. A F1 vira esse quadro: uma moldura grande de tábuas ocupando quase todo o palco, com pergaminhos pregados por cravos de ferro. A missão da guilda é o aviso principal; os tomos, as cartas e as regras são os outros papéis pregados.

O que dá o ar de conforto e de "blog medieval":
- madeira quente com veios, cantoneiras de ferro e cravos;
- pergaminhos com bordas irregulares, levemente tortos, com sombra;
- capitular dourada na primeira letra do aviso principal;
- selo de cera vermelho fechando a missão;
- ornamentos ❦ e ⚜ como separadores;
- a luz de vela do cenário continua visível ao redor do quadro.

A peça memorável é o quadro em si. Todo o resto (tipografia, cores) fica contido.

## 3. Tokens

Reaproveita a paleta da iteração 1 e acrescenta só tons de madeira e cera:

| Nome | Valor | Uso |
|---|---|---|
| `--madeira-clara` (existe) | `#4A3222` | tábuas do quadro |
| `--madeira-veio` (novo) | `#5E4029` | veios claros das tábuas |
| `--madeira-moldura` (novo) | `#2E1D12` | moldura externa, mais escura |
| `--ferro` (novo) | `#3B3632` | cantoneiras e cravos |
| `--pergaminho` (existe) | `#F3E6C8` | papéis |
| `--tinta` (existe) | `#2A1D14` | texto sobre pergaminho (~13:1) |
| `--cera` (novo) | `#9E1F2B` | selo de cera |
| `--ouro` (existe) | `#E8B64A` | capitular, ornamentos |

Tipografia (já instalada): **Cinzel** nos títulos dos papéis, **Alegreya** no texto (36 px no texto essencial, 28 px nas etiquetas), **Alegreya itálico** nas falas dos narradores. O Grimório não aparece dentro do quadro; ele só mostra os números dos tomos numa notificação, como previsto em 03 §4.

## 4. Layout

Palco de 1920×1080, HUD no topo (56 px). O quadro ocupa de x 96 a 1824 e de y 96 a 952: moldura de 28 px, cantoneiras de ferro nos quatro cantos. Embaixo, fora do quadro, fica a navegação (§6).

Texto alinhado à **esquerda** em todos os papéis. Nada centralizado, exceto o selo.

A F1 passa a ter **quatro folhas**, trocadas com `→` e `←` dentro da própria fase, como em 03 §4.

### Folha 1 — A missão

```
╔═════════════════════════════════════════════════════════════════════╗
║  ┌───────────────────────────────────────────┐     ┌──────────────┐ ║
║  │ Vocês agora são fundadoras                │     │ Quando       │ ║
║  │ de uma startup                            │     │ 2016, Brasil │ ║
║  │ ─── ❦ ───                                 │     └──────────────┘ ║
║  │ S│entem-se, fundadoras. Esta noite vocês  │   ┌──────────────┐   ║
║  │  │vão reviver uma história real: a de uma │   │ A guilda     │   ║
║  │   farmacêutica que viu pacientes com      │   │ vocês, as    │   ║
║  │   câncer interromperem a quimioterapia... │   │ três funda-  │   ║
║  │                                  (selo)   │   │ doras        │   ║
║  └───────────────────────────────────────────┘   └──────────────┘   ║
║                                                   ┌──────────────┐  ║
║                                                   │ A fonte      │  ║
║                                                   │ Artigo B,    │  ║
║                                                   │ Healthy Skin │  ║
║                                                   └──────────────┘  ║
╚═════════════════════════════════════════════════════════════════════╝
```

- **Aviso principal** à esquerda (cerca de 1000 px de largura, girado −1°): título em Cinzel 64 px, separador ❦, texto da missão de 03 §4 em Alegreya 36 px com capitular dourada de 3 linhas, selo de cera no canto inferior direito.
- **Três notas menores** à direita, em alturas e ângulos diferentes (+2°, −1,5°, +1°), com título Cinzel 36 px e texto Alegreya 32 px: quando (2016, Brasil), a guilda (vocês, as três fundadoras) e a fonte (Artigo B, a Healthy Skin é um pseudônimo). São os dados que o apresentador costuma dizer em voz alta.

### Folha 2 — Os Dois Tomos

```
╔═════════════════════════════════════════════════════════════════════╗
║ ┌─────────────┐                                                     ║
║ │ Os Dois     │   ┌────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐
║ │ Tomos       │   │ carta  │  │ "Eu não      │  │ "Eu conheço  │  │ carta  │
║ └─────────────┘   │   A    │  │ conheço a    │  │ uma história │  │   B    │
║                   │ (1,5×) │  │ sua história │  │ só, e de     │  │ (1,5×) │
║                   │        │  │ ..."         │  │ perto..."    │  │        │
║                   └────────┘  │ — O Cartó-   │  │ — A Cronista │  └────────┘
║                               │   grafo      │  │              │
║                               └──────────────┘  └──────────────┘
╚═════════════════════════════════════════════════════════════════════╝
```

- As duas `CartaArtigo` escaladas 1,5× (390 px de largura), pregadas nas extremidades; as falas dos narradores (texto de 03 §4) em notas de pergaminho entre elas, em Alegreya itálico 32 px, assinadas com o nome do narrador e dos autores (Kogut, Mello e Skorupski, 2023 / Costa, Nelson e Pedroso, 2025).
- Uma plaquinha de título no canto superior esquerdo do quadro ("Os Dois Tomos").
- **Clique na carta virada:** vira (como hoje). **Clique de novo:** a nota do narrador troca para a **estratégia** e a **solução** do artigo (texto atual de `conteudo.ts`), com o mesmo tamanho de letra. Outro clique volta para a fala.
- Ao virar cada carta, o Grimório notifica os números do tomo ("Tomo A: 38 estudos, de 2001 a 2022.").

### Folha 3 — Os jeitos de decidir

```
╔═════════════════════════════════════════════════════════════════════╗
║ ┌──────────────────┐   ╱carta╲   ╱carta╲   ╱carta╲   ╱carta╲        ║
║ │ "Toda decisão    │   Planejar  Adaptar  Bricola-  Combinar        ║
║ │ vai ser entre    │                       gem     (acorrentada)    ║
║ │ duas cartas. A   │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐       ║
║ │ terceira... vocês│  │etiqueta│ │etiqueta│ │etiqueta│ │etiqueta│    ║
║ │ vão ter que      │  └───────┘ └───────┘ └───────┘ └───────┘       ║
║ │ forjar."         │                                                ║
║ └──────────────────┘                                                ║
╚═════════════════════════════════════════════════════════════════════╝
```

- À esquerda, a nota com a frase de 03 §4 (Alegreya 36 px).
- À direita, as quatro `CartaDecisao` em leque leve (−6°, −2°, +2°, +6°), escaladas 1,4×.
- Embaixo de cada carta, uma **etiqueta de pergaminho** legível do fundo da sala: nome (Cinzel 36 px), teoria (Alegreya itálico 24 px) e o resumo atual (Alegreya 28 px, até 14 palavras). As cartas continuam pequenas por dentro até a iteração 2; a etiqueta resolve a leitura agora.
- A Combinar fica cinza, com o ícone `crossed-chains` cruzado por cima e `padlock` no centro. Etiqueta: "Trancada. Descubram como forjá-la."

### Folha 4 — Como funciona

```
╔═════════════════════════════════════════════════════════════════════╗
║  ┌───────────────────────────────────────────────┐   ┌───────────┐  ║
║  │ Como funciona                                 │   │ retrato   │  ║
║  │ ─── ❦ ───                                     │   │ taverneiro│  ║
║  │ I.   [ícone] 4 decisões, da fundação ...      │   │           │  ║
║  │ II.  [ícone] A turma discute e vota ...       │   └───────────┘  ║
║  │ III. [ícone] Caixa, Clientes e Moral ...      │   "Puxem uma    ║
║  │ IV.  [ícone] Depois de cada decisão ...       │    cadeira!"    ║
║  │ V.   [ícone] No final, o perfil da turma      │                 ║
║  └───────────────────────────────────────────────┘                 ║
╚═════════════════════════════════════════════════════════════════════╝
```

- Um pergaminho alto à esquerda (cerca de 1150 px) com as cinco regras de `briefing.regras`, numeradas em algarismos romanos (são uma sequência de fato), Alegreya 36 px, cada uma com um ícone de `public/assets/icones/` em tinta: `scroll-quill` (decisões), `flying-flag` (votar levantando a mão), `shiny-purse` + `flying-flag` + `flamer` (os três indicadores, no lugar dos emojis), `dice-twenty-faces-one` (dado), `wax-seal` (perfil final).
- À direita, o retrato do Taverneiro (`personagens/taverneiro.webp`) numa moldura de madeira pregada, com a legenda "Puxem uma cadeira, fundadoras!".
- O texto das regras continua o atual. Quando a iteração 3 trocar o dado para d20 com a Leitura do Mapa, a regra IV muda junto (03 §4 já prevê isso).

## 5. Movimento e som

- **Uma entrada por folha:** os papéis caem no quadro um de cada vez (escala 1,06 → 1 e o ângulo final, 120 ms entre eles), com um toque curto de `carta-bater` no primeiro. Nada de animação em loop dentro do quadro.
- **Troca de folha:** os papéis da folha anterior saem juntos (fade de 200 ms) antes da próxima entrar. Som `pagina`.
- **Movimento reduzido:** tudo aparece direto, sem queda.
- A virada de página entre fases (iteração 1) continua valendo na entrada e na saída da F1.

## 6. Navegação

- `→` avança a folha; na folha 4, avança para a próxima fase. `←` volta a folha; na folha 1, volta para a fase anterior. A F1 intercepta as setas na fase de captura do `keydown`, antes do `useNavegacao`, e só deixa passar nas pontas.
- Embaixo do quadro: botões **Voltar** (à esquerda) e **Continuar** (à direita) no estilo de placa de madeira, e no centro quatro marcadores de cera mostrando a folha atual.
- A folha atual fica em `sessionStorage`, como a fase, para um recarregamento não voltar à folha 1.

## 7. Peças novas

| Arquivo | O que é |
|---|---|
| `src/components/ui/QuadroMadeira.tsx` + `src/styles/quadro.css` | Moldura de tábuas com veios (gradientes CSS), cantoneiras e cravos de ferro |
| `src/components/ui/Pergaminho.tsx` | Papel pregado: borda irregular (`clip-path`), ângulo, sombra, cravo no topo; variantes `aviso`, `nota`, `etiqueta` |
| `src/components/ui/Icone.tsx` | Ícone de `public/assets/icones/` via `mask-image`, colorido pela cor do texto (`currentColor` não funciona em `<img>`) |
| `src/components/ui/SeloCera.tsx` | Selo de cera (`wax-seal` em `--cera`, com relevo e sombra) |
| `src/engine/folhas.ts` + teste | Lógica pura da navegação entre folhas: dada a folha atual, o total e a direção, devolve a nova folha ou "sair para frente/trás" |
| `src/fases/F1Briefing.tsx` (reescrita) | As quatro folhas |
| `src/data/rodada.ts` | Textos novos do `briefing`: missão, notas da folha 1, falas dos narradores, frase da folha 3, legenda do Taverneiro (de 03 §4) |

As peças `QuadroMadeira`, `Pergaminho`, `Icone` e `SeloCera` servem também para F3, F4 e F5 na iteração 4.

## 8. Critérios de aceite

- Nenhuma folha tem rolagem; tudo cabe no palco de 1920×1080 e continua legível em 1366×768.
- Todo texto essencial dentro dos papéis tem pelo menos 36 px (etiquetas das cartas: 28 px); texto sempre em tinta sobre pergaminho.
- Texto alinhado à esquerda; o conteúdo usa a largura do quadro, sem coluna estreita no centro.
- `→`/`←` percorrem as quatro folhas e só então mudam de fase; os botões fazem o mesmo.
- Clique nos tomos: vira, depois mostra estratégia e solução, depois volta à fala.
- Movimento reduzido: sem quedas nem transições além de fades.
- Testes da navegação entre folhas passando; `npm run build` e `npm test` passando.

## 9. Em aberto

- **Textos das notas da folha 1:** propostos acima a partir de 03 §4 e do Artigo B; revisar com a equipe.
- **Cartas pequenas por dentro:** as cartas antigas continuam com texto de 9 a 11 px até a iteração 2 (molduras novas). As etiquetas e as notas cobrem a leitura enquanto isso.
