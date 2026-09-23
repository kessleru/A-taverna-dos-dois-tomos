# 08 — Imagens, ícones e sons

## 1. Imagens que já existem (reaproveitar)

As imagens de `public/assets/cartas/` (17 originais e 2 geradas) já são pintura de fantasia e combinam com a taverna. Todas já estão em WebP (qualidade 80); os originais ficam em `assets-originais/imagens/`, fora do git.

| Imagem | Novo uso |
|---|---|
| `artigo-A` | Retrato do **Cartógrafo** (Tomo A) |
| `artigo-B` | Retrato da **Cronista** (Tomo B) |
| `planejar`, `adaptar`, `bricolagem`, `combinar` | Arte das cartas de decisão |
| `fundacao`, `lancamento`, `investidores`, `novo-mercado` | Arte das Cartas de Desafio |
| `crazy-quilt`, `porta-fechada` | Destino 1 |
| `fabricante-parceiro`, `maquinas-caras` | Destino 2 (geradas, ver seção 2) |
| `incubadora`, `nao-foi` | Destino 3 |
| `lemonade` | Ilustra a Limonada na Crônica da etapa 4 |
| `aprendizados` | Lendária Aprendizados |

## 2. Imagens geradas (feito)

Prompts em inglês, porque os geradores costumam responder melhor. Todos começam com o mesmo estilo, para combinar com as artes atuais:

> **Estilo base:** `Digital fantasy painting in the style of collectible card game art, painterly brushstrokes, warm candlelight and fireplace glow, rich saturated colors, strong rim light, cozy medieval atmosphere, no text, no letters, no logos, no watermark.`

| Arquivo | Pedido → gerado | Prompt (depois do estilo base) | Prioridade |
|---|---|---|---|
| `cenario/taverna-fundo.webp` | 2560×1440 → 1376×768 (entra desfocado, deve bastar) | `Interior of a cozy medieval tavern at night, seen from behind a large empty wooden table in the foreground, stone fireplace on the left, shelves with old books and potion bottles, candles and hanging lanterns, wooden beams, soft depth of field, the center of the image darker and less detailed to leave room for cards` | P0 |
| `personagens/taverneiro.webp` | 1024×1024 → 1024×1024 | `Portrait of a friendly middle-aged tavern keeper with a warm smile, apron, holding a lantern, leaning on a bar counter, bust shot, centered, dark warm background` | P0 |
| `cartas/fabricante-parceiro.webp` | 1600×1200 → 1200×896 | `A small artisan workshop where a craftswoman fills a short row of small glass jars of healing ointment, a modest machine, green leaves and herbs on the bench, hopeful mood` | P0 |
| `cartas/maquinas-caras.webp` | 1600×1200 → 1200×896 | `A huge, cold, overly complex brass machine filling an empty factory hall, a worried founder standing small in front of it, stacks of coins melting away, blue cold light` | P0 |
| `cenario/tampo-mesa.webp` | 2560×720 → 1376×768 (não repete sem emenda) | `Top-down view of a dark oak tavern table surface, worn wood grain, subtle candle wax drops, seamless texture, even lighting` | P1 (tem alternativa em CSS) |

Falta registrar a ferramenta usada em `public/assets/CREDITOS.md`.

**Não gerar como imagem** (fica melhor em CSS/SVG, nítido em qualquer escala e sem texto errado): molduras das cartas, verso, selo de cera, d20, orbes, correntes, Canvas.

## 3. Ícones (feito)

[game-icons.net](https://game-icons.net): mais de 4.000 ícones SVG de fantasia, licença **CC BY 3.0** (exige crédito ao autor de cada ícone). Baixar os SVGs e usar como componentes, preenchidos com as cores do tema.

Procurar por: `scroll` e `quill` (Planejar), `compass` (Adaptar), `hammer` e `toolbox` (Bricolagem), `crossed-swords` (Combinar), `coins` (Caixa), `flag` ou `banner` (Clientes), `flame` (Moral), `dice-twenty-faces` (d20), `open-book` (tomos), `padlock` e `chain` (Combinar trancada), `candle` e `lantern` (ambiente), `wax-seal` (selo).

Baixados em `public/assets/icones/`, com o quadrado preto de fundo removido e `fill="currentColor"`: importar como texto (`?raw`) ou componente para herdar a cor do tema (como `<img>` o SVG não herda cor). Autores e uso de cada um em `public/assets/CREDITOS.md`.

## 4. Sons (quase feito)

| Efeito | Arquivo | Onde buscar |
|---|---|---|
| Carta desliza, vira, é jogada | `carta-deslizar.ogg`, `virar-carta.ogg`, `carta-bater.ogg` | [Kenney Casino Audio](https://kenney.nl/assets/casino-audio) (CC0): 23 sons de carta |
| Dado rolando | `dado.ogg` | Kenney Casino Audio (12 sons de dado) |
| Tics da contagem, ping do Grimório, cliques | `tic.ogg`, `ping.ogg`, `clique.ogg` | [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) / [UI Audio](https://kenney.nl/assets/ui-audio) (CC0) |
| Página virando, moedas, metal, correntes quebrando | `pagina.ogg`, `moedas.ogg`, `correntes.ogg` | [Kenney RPG Audio](https://kenney.nl/assets/rpg-audio) (CC0) |
| Tambor antes da revelação, fanfarra da Forja, selo batendo | `tambor.ogg`, `fanfarra.ogg`, `selo.ogg` | Kenney RPG Audio ou [Freesound](https://freesound.org) filtrando por CC0 |
| Lareira e murmúrio de taverna (ambiente, opcional) | `ambiente-taverna.ogg` | Freesound (CC0) |
| Música de fundo (ligada por padrão, entra no primeiro clique) | `musica-taverna.ogg` | [Kevin MacLeod / incompetech](https://incompetech.com/music/royalty-free/music.html), categoria medieval (CC BY 4.0, exige crédito). Ex.: "Village Consort", "Angevin B" |

- **Já em `public/sfx/`:** todos os `.ogg` da tabela, exceto `tambor.ogg`, `chama.ogg` (descarte queimando, [06](06-animacoes.md)) e `ambiente-taverna.ogg`. Origem de cada um em `public/sfx/CREDITOS.md`.
- **Música:** a equipe escolheu "Playing with a Full Deck" (trilha do Hearthstone) em `public/sfx/musica-fundo.mp3`, no lugar da sugestão abaixo. É música comercial sem licença: ver o aviso em `public/sfx/CREDITOS.md`.
- Nomes exatos em `src/engine/useSom.ts`. O hook atual já ignora arquivos que faltam, então dá para adicionar aos poucos.
- Volume: efeitos 0,4; ambiente 0,08; música 0,12.
- **Bônus (P2):** a equipe gravar 4 ou 5 falas curtas do Taverneiro ("Puxem uma cadeira!", "Lendária!"), como o Innkeeper do Hearthstone.

## 5. Créditos

`public/assets/CREDITOS.md` e `public/sfx/CREDITOS.md` listam origem e licença de tudo. A tela de créditos da F5 mostra os autores de ícones (CC BY) e a música.
