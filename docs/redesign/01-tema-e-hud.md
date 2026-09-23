# 01 — Tema, mesa, cartas e HUD

## 1. Conceito

A apresentação acontece numa **taverna medieval à noite**. A turma é a **guilda fundadora** sentada à grande mesa de madeira. Sobre a mesa estão **dois tomos**, os dois artigos, cada um com um narrador. Lareira, velas e brasas flutuando dão o clima. A referência mais próxima é o tabuleiro do Hearthstone: uma mesa física, cartas com peso, uma voz que recebe o jogador.

O **terminal** entra como o **Grimório**: um painel arcano de vidro escuro, com borda de runas, que "digita" em fonte monoespaçada tudo o que o sistema registra (ganhos, perdas, desbloqueios, números dos artigos). É o estilo das "janelas de sistema" dos animes de fantasia, **sem nenhuma referência a isekai ou reencarnação**: no jogo ele é só o grimório mágico da taverna.

Regra de ouro: **a fantasia veste, a história real conta.** Situações, números, instituições e citações continuam reais. A fantasia fica na arte, nas molduras, nos ícones, nos narradores e nos efeitos.

---

## 2. Vocabulário

| Real | No jogo |
|---|---|
| Os dois artigos | **Os Dois Tomos**: Tomo A "O Mapa dos 20 Anos" e Tomo B "Canvas em Movimento" |
| Autores do Artigo A | **O Cartógrafo**, que percorreu 38 crônicas escritas em 21 anos |
| Autores do Artigo B | **A Cronista**, que acompanhou uma única guilda de 2016 a 2024 |
| Sistema, log | **O Grimório** (voz neutra, monoespaçada) |
| A turma | **A Guilda** ("vocês são as fundadoras da Healthy Skin") |
| Situação da etapa | **Carta de Desafio** |
| Eventos | **Cartas do Destino** |
| Dado da incerteza | **Dado do Destino** (d20) |
| Business Model Canvas | **Tapeçaria da Guilda** (só visual) |
| Caixa, Clientes, Moral | Mesmos nomes; ícones de bolsa de moedas, estandarte e chama |
| Estrelas | **Rank**: Aprendiz, Mestre, Grão-Mestre |

Nome de sabor das cartas de decisão (o nome grande continua simples):

| Carta | Subtítulo | Teoria | Sigilo | Forma da gema |
|---|---|---|---|---|
| **Planejar** | Pergaminho do Estrategista | Causation | pergaminho e régua | quadrada |
| **Adaptar** | Bússola do Andarilho | Effectuation | bússola | redonda |
| **Bricolagem** | Caixa do Artífice | Bricolagem | martelo e engrenagem | hexagonal |
| **Combinar** | Lâminas Gêmeas | As duas juntas | lâminas cruzadas | estrela (lendária) |

A forma da gema repete a informação da cor, para quem tem daltonismo e para quem está longe.

---

## 3. Paleta

Substitui `src/styles/tokens.css`. Fundo quente e escuro de madeira, texto em pergaminho, destaques em ouro. O ciano arcano só aparece no Grimório, para o "terminal" se destacar do resto.

| Token | Valor | Uso |
|---|---|---|
| `--madeira-profunda` | `#140D08` | vinheta, sombras |
| `--madeira` | `#24170F` | fundo base |
| `--madeira-clara` | `#4A3222` | tampo da mesa, painéis |
| `--pergaminho` | `#F3E6C8` | miolo das cartas, balões, texto claro |
| `--tinta` | `#2A1D14` | texto sobre pergaminho (contraste ~13:1) |
| `--ouro` / `--ouro-claro` / `--ouro-escuro` | `#E8B64A` / `#FFE39A` / `#9C6B1E` | títulos, bordas, Combinar, Caixa |
| `--brasa` | `#FF7A2F` | partículas, Moral |
| `--planejar` | `#4F7BFF` | safira |
| `--adaptar` | `#3FBF7F` | esmeralda |
| `--bricolagem` | `#C7773A` | cobre |
| `--tomo-a` | `#F2862E` | Artigo A (combina com a arte âmbar já pronta) |
| `--tomo-b` | `#2FC7B8` | Artigo B (combina com a arte turquesa já pronta) |
| `--clientes` | `#9B7BFF` | violeta, diferente das lógicas |
| `--dano` / `--cura` | `#E0374A` / `#5ED17A` | perdas / ganhos |
| `--runa` / `--runa-fundo` | `#7FE8FF` / `rgb(8 20 32 / .82)` | Grimório |

---

## 4. Cenário (`Fundo.tsx` vira `Taverna.tsx`)

Camadas, de trás para frente:
1. Pintura da taverna (`taverna-fundo.webp`), desfocada e escurecida no centro para não competir com as cartas.
2. Luz de vela: dois gradientes radiais quentes que oscilam devagar (CSS).
3. Tampo da mesa na faixa inferior (imagem ou gradiente de madeira).
4. Brasas subindo (CSS, 20 a 30 elementos).
5. Vinheta.

No lugar do parallax com o mouse (no projetor ninguém mexe o mouse), a imagem faz uma deriva lenta de ±6 px em 20 s.

---

## 5. O Grimório (`Grimorio.tsx`)

- **Visual:** vidro `--runa-fundo` com `backdrop-filter: blur(8px)`, borda de 2 px `--runa` com brilho, cantos em colchete (L), aba `[ GRIMÓRIO ]` em mono maiúsculo, linhas de varredura sutis a 6%.
- **Texto:** JetBrains Mono 28–32 px, cor `--runa` com brilho, digitado a ~40 caracteres/s, cursor `█` piscando, cada linha começa com `›`.
- **Notificação:** entra deslizando da direita com um "ping" e fica 3 s. Exemplos: `› CAIXA −15   MORAL −10`, `› CARTA FORJADA: COMBINAR`, `› consultar tomo A → 38 estudos · 2001–2022`.
- **Onde aparece:** boot da abertura, log da rodada, números dos artigos na F1 e na F4.

---

## 6. A mesa da rodada

Palco fixo de 1920×1080 ([04](04-visibilidade.md)).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ (◉ CAIXA 55)   (◉ CLIENTES 60)   (◉ MORAL 70)          ①───②───③───④          │ HUD
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌──────┐        ┌─────────────── CARTA DE DESAFIO ───────────────┐  ┌──────┐ │
│ │CARTÓ-│        │ arte          │ 2 · PRIMEIROS ANOS              │  │CRONIS│ │
│ │GRAFO │        │               │ Remédio ou cosmético?           │  │-TA   │ │
│ └──────┘        └──────────────────────────────────────────────────┘  └──────┘ │
│ TAPEÇARIA        LEITURA DO MAPA:  [MICRO …]  [MESO …]  [MACRO …]    GRIMÓRIO │
│ ▣▣▣                                                                  › log…   │
│ ▣▣▣              ┌──────────┐            ┌──────────┐                        │
│ ▣▣▣              │ 1        │            │ 2        │   ← MÃO: 2 cartas      │
│                  │ PLANEJAR │            │ ADAPTAR  │                        │
│                  └──────────┘            └──────────┘                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Duas cartas grandes, bem separadas e numeradas, para a turma votar levantando a mão sem dúvida. O **foco automático** ([04](04-visibilidade.md)) destaca só o que importa em cada passo e escurece o resto.

---

## 7. HUD

| Componente | Descrição | Tamanho em 1080p |
|---|---|---|
| `OrboIndicador` ×3 (substitui `BarraIndicador`) | Globo de vidro com líquido que ondula (SVG), número em mono no centro e rótulo em Cinzel embaixo. Caixa dourada, Clientes violeta, Moral brasa | globo 120 px, número 48 px |
| `MapaJornada` (substitui `TrilhaEtapas`) | Estrada pintada com 4 marcos. O atual pulsa; os concluídos mostram o sigilo da carta jogada e um selo se bateu com a história real | 480×72 px |
| `Tapecaria` | Grade 3×3 dos blocos do Canvas, no canto; cresce na consequência | 240 px, 720 px ampliada |
| `Grimorio` | Log e notificações | 460×200 px |
| Dica de teclas | Rodapé: `→ avançar · Z ampliar · T tutorial`, mono 20 px a 40% | — |

- Todo ganho ou perda aparece como número de 72 px saindo do globo (verde subindo, vermelho caindo com tremor) e fica 1,5 s na tela.
- Abaixo de 15, o globo racha e pulsa em `--dano` com "Quase quebrou!".

---

## 8. Cartas reimaginadas

As molduras são **CSS e SVG** (nítidas em qualquer escala, cor por prop, sem texto embutido): gradiente da cor do tipo, textura de metal gasto (`feTurbulence` a 12%), bevel com duas bordas, filigrana dourada nos cantos. Só a arte da janela é imagem.

### 8.1 Anatomia (carta de decisão)

```
  ╭──╮                              ╭──╮
  │ 1│ ← número da tecla            │◆ │ ← gema de raridade (forma = lógica)
┌─╰──╯──────────────────────────────╰──╯─┐
│  ╔════════════════════════════════════╗ │ ← moldura na cor da lógica + filigrana dourada
│  ║          janela de arte            ║ │   janela: retângulo (decisão), arco (tomo),
│  ║       (imagem com zoom lento)      ║ │   ponta (destino), oval (lendária)
│  ╚════════════════════════════════════╝ │
│ ══╡           PLANEJAR            ╞══   │ ← fita do nome, Cinzel 36 px
│       Pergaminho do Estrategista        │ ← subtítulo, Alegreya itálico 24 px
│  ┌────────────────────────────────────┐ │
│  │ texto da opção nesta etapa         │ │ ← pergaminho, Alegreya 28 px, até 14 palavras
│  └────────────────────────────────────┘ │
│   💰 🔥               ▣ ▣               │ ← pistas + blocos do Canvas
└────────────────────────────────────────┘
              [ CAUSATION ]                ← placa da teoria, mono 20 px
```

### 8.2 Tipos

| Tipo | Uso | Tamanho em 1080p | Particularidades |
|---|---|---|---|
| **Decisão** | Mão | 380×532 (320×448 quando houver 3); ampliada 600×840 | Número da tecla, pistas, blocos, placa da teoria |
| **Tomo** (substitui `CartaArtigo`) | F1, Crônica, F4 | 400×560; ampliada 640×896 | Retrato do narrador. **Gemas de atributo nos cantos inferiores, como ataque e vida no Hearthstone**: Abrangência (A 10 · B 3) e Profundidade (A 5 · B 10) |
| **Desafio** (nova) | Situação | 880×420, horizontal | Arte à esquerda, fase + título + situação à direita |
| **Destino** (substitui `CartaEvento`) | Eventos | 380×532 | Janela em ponta, moldura esmeralda (bom) ou carmim (ruim), efeitos em pílulas |
| **Lendária** | Combinar, Aprendizados | 440×616 | Moldura dourada com asas no topo, holo intenso, partículas em volta |
| **Verso** | Todas | igual à frente | Madeira escura, rosa dos ventos dourada, emblema de dois livros |

### 8.3 Estados

| Estado | Visual |
|---|---|
| Jogável | Contorno pulsante na cor da lógica (como o brilho das cartas jogáveis do Hearthstone) |
| Em foco | Sobe 40 px e cresce 1,2× |
| Escolhida | Borda de ouro pulsante; a outra dessatura e desce |
| Trancada (Combinar) | Cinza, correntes em SVG cruzando a carta, cadeado no centro |
| Descartada | Queima de baixo para cima com borda de brasa |
| Rara ou lendária | Reflexo holográfico que varre a carta sozinho a cada 4 s (sem depender do mouse) |

---

## 9. Transição entre fases

Uma só, usada em todas: **página de tomo virando** (rotação 3D de uma página de pergaminho com sombra, 900 ms) e som de folha. Com movimento reduzido, vira fade de 300 ms.

---

## 10. Arquivos afetados

- `src/styles/tokens.css`, `tailwind.config.ts`: paleta e fontes.
- `src/components/ui/Fundo.tsx` → `Taverna.tsx`; novo `Grimorio.tsx`; nova `TransicaoPagina.tsx`.
- `src/components/hud/*`: `OrboIndicador`, `MapaJornada`, `Tapecaria`, `Hud`.
- `src/components/cartas/*`: `MolduraCarta` reescrita por tipo, `CartaDecisao`, `CartaTomo`, `CartaDesafio`, `CartaDestino`, `CartaLendaria`, `VersoCarta`.
- `src/data/artes.ts`: sigilos, formas das gemas, novas imagens.
- `src/fases/Vitrine.tsx`: todos os tipos e estados para revisão.

## 11. Critérios de aceite

- Nenhuma tela usa os tokens antigos (`--noite`) nem Bungee/Rubik.
- Cada lógica é reconhecível por cor, sigilo, forma da gema e nome, inclusive em escala de cinza.
- O Grimório é o único elemento com estética de terminal e aparece em todas as fases.
- A vitrine (`#vitrine`) mostra todos os tipos de carta em todos os estados.
