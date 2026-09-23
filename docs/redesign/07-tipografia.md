# 07 — Tipografia

## 1. Famílias

Uma serifada medieval (em dois papéis: título e texto) e uma monoespaçada de terminal. Todas gratuitas (licença OFL) e empacotadas com `@fontsource`, então funcionam offline.

| Papel | Fonte | Por quê | Onde |
|---|---|---|---|
| **Títulos** (serifada) | **Cinzel** 600/700 | Capitulares romanas de inscrição: medieval e épica, e legível em tamanho grande. Não imita a Belwe do Hearthstone (fonte comercial), mas dá o mesmo clima de fantasia | Títulos de fase, nomes de carta, rótulos em caixa alta, rank |
| **Texto** (serifada) | **Alegreya** 500/700 e itálico | Serifada caligráfica e calorosa, feita para texto longo; mais robusta no projetor que Garamonds finas | Situações, falas dos narradores, texto das cartas, balões |
| **Terminal** (mono) | **JetBrains Mono** 500/700 | Muito legível, com zero cortado e letras bem distintas | Grimório, números dos orbes, dado, placas de teoria, dica de teclas |

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
| `sistema` | JetBrains Mono 500 | 28–32 / 1.4 | Grimório, maiúsculas, espaçamento +6% |
| `numero` | JetBrains Mono 700 | 48–72 / 1 | `font-variant-numeric: tabular-nums` |

## 3. Efeitos

- **Títulos em ouro:** gradiente `--ouro-claro` → `--ouro` → `--ouro-escuro` com `background-clip: text`, mais contorno escuro e sombra para aguentar qualquer fundo.
- **Capitular** na primeira letra da Crônica: Cinzel 96 px em ouro.
- **Grimório:** `text-shadow` ciano de brilho, cursor `█` piscando, digitação a ~40 caracteres/s.
- **Ornamentos** como separadores: ❦ ✦ ⚜.

## 4. Implementação

```bash
npm i @fontsource/cinzel @fontsource/alegreya @fontsource/jetbrains-mono
npm rm @fontsource/bungee @fontsource/rubik @fontsource/ibm-plex-mono
```

- `global.css` importa só os pesos usados (Cinzel 600 e 700, Alegreya 500, 700 e itálico 500, JetBrains Mono 500 e 700).
- `tailwind.config.ts`: `font-titulo` (Cinzel), `font-texto` (Alegreya), `font-sistema` (JetBrains Mono).
- As fontes carregam durante a abertura (F0), que já começa em mono; nenhuma tela seguinte pisca trocando de fonte.

## 5. Critérios de aceite

- Acentos do português (ç, ã, õ, é, ê) aparecem certos nas três famílias.
- Não sobra nenhum uso de Bungee, Rubik ou IBM Plex Mono.
- Todo texto em Cinzel tem pelo menos 36 px.
