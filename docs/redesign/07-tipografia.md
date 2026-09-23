# 07 — Tipografia

## 1. Famílias

Duas serifadas medievais: uma para títulos e uma para texto. Sem fonte monoespaçada: o tema é só medieval (decisão de 23/09). Ambas gratuitas (licença OFL) e empacotadas com `@fontsource`, então funcionam offline.

| Papel | Fonte | Por quê | Onde |
|---|---|---|---|
| **Títulos** (serifada) | **Cinzel** 600/700 | Capitulares romanas de inscrição: medieval e épica, e legível em tamanho grande. Não imita a Belwe do Hearthstone (fonte comercial), mas dá o mesmo clima de fantasia | Títulos de fase, nomes de carta, rótulos em caixa alta, rank |
| **Texto** (serifada) | **Alegreya** 500/700 e itálico | Serifada caligráfica e calorosa, feita para texto longo; mais robusta no projetor que Garamonds finas | Situações, falas dos narradores, texto das cartas, balões |

Cinzel só tem caixa alta de verdade (as minúsculas são versaletes), por isso não serve para texto corrido, e daí o par com a Alegreya.

## 2. Escala (palco de 1080p)

| Estilo | Fonte | Tamanho / altura de linha | Detalhes |
|---|---|---|---|
| `titulo-fase` | Cinzel 700 | 96–120 / 1.05 | espaçamento +4%, ouro com contorno escuro |
| `titulo` | Cinzel 700 | 64 / 1.1 | espaçamento +3% |
| `nome-carta` | Cinzel 700 | 36 / 1.1 | na fita do nome |
| `texto-grande` | Alegreya 500 | 36 / 1.35 | situações e falas |
| `texto-carta` | Alegreya 500 | 28 / 1.3 | miolo das cartas |
| `sabor` | Alegreya itálico | 24 / 1.3 | subtítulo das cartas |
| `grimorio` | Alegreya 500 | 30–34 / 1.4 | texto do Grimório, frases normais |
| `numero` | Cinzel 700 | 48–72 / 1 | números dos orbes, dado e contagens; `font-variant-numeric: tabular-nums` |

## 3. Efeitos

- **Títulos em ouro:** gradiente `--ouro-claro` → `--ouro` → `--ouro-escuro` com `background-clip: text`, mais contorno escuro e sombra para aguentar qualquer fundo.
- **Capitular** na primeira letra da Crônica: Cinzel 96 px em ouro.
- **Grimório:** escrita a ~40 caracteres/s com uma pena acompanhando o texto (01 §5).
- **Ornamentos** como separadores: ❦ ✦ ⚜.

## 4. Implementação

```bash
npm i @fontsource/cinzel @fontsource/alegreya
npm rm @fontsource/bungee @fontsource/rubik @fontsource/ibm-plex-mono @fontsource/jetbrains-mono
```

- `global.css` importa só os pesos usados (Cinzel 600 e 700, Alegreya 500, 700 e itálico 500).
- `tailwind.config.ts`: `font-titulo` (Cinzel) e `font-texto` (Alegreya).
- As fontes carregam durante a abertura (F0); nenhuma tela seguinte pisca trocando de fonte.

## 5. Critérios de aceite

- Acentos do português (ç, ã, õ, é, ê) aparecem certos nas três famílias.
- Não sobra nenhum uso de Bungee, Rubik, IBM Plex Mono ou JetBrains Mono (garantido por `src/styles/tema.test.ts`).
- Todo texto em Cinzel tem pelo menos 36 px.
