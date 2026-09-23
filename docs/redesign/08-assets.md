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

**Não gerar como imagem** (fica melhor em CSS/SVG, nítido em qualquer escala e sem texto errado): molduras das cartas, selo de cera, d20, orbes, correntes, Canvas.

## 3. Ícones (feito)

[game-icons.net](https://game-icons.net): mais de 4.000 ícones SVG de fantasia, licença **CC BY 3.0** (exige crédito ao autor de cada ícone). Baixar os SVGs e usar como componentes, preenchidos com as cores do tema.

Procurar por: `scroll` e `quill` (Planejar), `compass` (Adaptar), `hammer` e `toolbox` (Bricolagem), `crossed-swords` (Combinar), `coins` (Caixa), `flag` ou `banner` (Clientes), `flame` (Moral), `dice-twenty-faces` (d20), `open-book` (tomos), `padlock` e `chain` (Combinar trancada), `candle` e `lantern` (ambiente), `wax-seal` (selo).

Em `src/assets/icones/`, com o quadrado preto de fundo removido e `fill="currentColor"`, embutidos no bundle e desenhados pelo componente `Icone` (SVG inline, herda a cor do texto). Autores e uso de cada um em `public/assets/CREDITOS.md`.

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

- **Já em `public/sfx/`:** todos os `.ogg` da tabela, e os gerados da seção 6 (`tambor`, `chama`, `correntes-quebrando`, `publico-comemora`, `publico-lamenta`). A lareira ambiente está em `ambiente-taverna.mp3`. Origem de cada um em `public/sfx/CREDITOS.md`.
- **Música:** a equipe escolheu "Playing with a Full Deck" (trilha do Hearthstone) em `public/sfx/musica-fundo.mp3`, no lugar da sugestão abaixo. É música comercial sem licença: ver o aviso em `public/sfx/CREDITOS.md`.
- Nomes exatos em `src/engine/useSom.ts`. O hook atual já ignora arquivos que faltam, então dá para adicionar aos poucos.
- Volume: efeitos 0,4; ambiente 0,08; música 0,12.
- **Falas do Taverneiro:** as 18 falas estão em `public/sfx/falas/` e tocam nos momentos definidos em `src/engine/falas.ts` (entrada, briefing, cada passo da rodada, eventos, resultado e créditos).
- **Murmúrio:** os 3 trechos de público de taverna viraram `murmurio-1..3.mp3`, revezando com crossfade por baixo da lareira (`src/engine/murmurio.ts`).
- **Onde cada som toca (iteração 5):** todo botão faz `clique`; Leitura do Mapa vira com `virar-carta`; cartas distribuídas com `embaralhar`; a descartada queima com `chama`; a contagem do dado faz `tic`; falha soma `perda`; caixa subindo soma `moedas`; Crônica abre com `livro-abrir` e o selo bate com `selo`; balões do tutorial com `pagina`; Resultado com `metal` (medalha), `moedas` (pontos), `vitoria` (rank 2+ estrelas), `estandarte`, um `ping` por fio de ouro e `publico-comemora`; Confronto com `selo`, `ping`, `carta-deslizar`, `tic`, `livro-abrir` e `vitoria`; créditos com `fanfarra` e público. Um teste (`src/engine/sons.test.ts`) falha se algum arquivo sumir.
- **Pedidos à equipe (gerar, P1):** ver a tabela "Sons que ainda faltam" na seção 6.

## 5. Créditos

`public/assets/CREDITOS.md` e `public/sfx/CREDITOS.md` listam origem e licença de tudo. A tela de créditos da F5 mostra os autores de ícones (CC BY) e a música.

## 6. Novos assets

O que ainda falta para o briefing e as próximas iterações. Imagens: salvar os originais em `assets-originais/imagens/` (eu converto para WebP e coloco em `public/assets/`). Sons: salvar em `assets-originais/sons/` (eu converto e coloco em `public/sfx/`). Registrar a ferramenta ou o site de cada um, para os créditos.

### Imagens

Usar o **estilo base** da seção 2 antes de cada prompt, exceto no favicon e nas texturas, que já dizem o estilo.

| Arquivo | Proporção e tamanho | Para quê | Prompt | Prioridade |
|---|---|---|---|---|
| `favicon.png` | 1:1, 512×512, fundo transparente | Ícone da aba do navegador. **Feito** (`public/favicon.png`) | `Game icon of two closed leather-bound tomes stacked at a slight angle, sealed together with a red wax seal, bold simple shapes readable at 32 pixels, warm gold and brown colors, flat painterly style, transparent background, no text` | P0 |
| `quadro-tabuas.webp` | 2:1, 2048×1024 | Tábuas do quadro de missões (F1). **Feito** (`cenario/quadro-tabuas.webp`) | `Front view of a wall made of vertical dark oak planks, worn wood grain, small dark gaps between planks, even warm lighting, seamless horizontally, no objects, no text, texture only` | P2 (o CSS já funciona) |
| `pergaminho.webp` | 1:1, 1024×1024 | Fundo dos papéis pregados e do Grimório. **Feito** (`cenario/pergaminho.webp`) | `Seamless texture of aged light parchment paper, subtle fibers, faint stains only near the edges, even lighting, flat, no text, no writing, no folds` | P2 (o CSS já funciona) |

| `verso-carta` | 3:4 gerado, recortado para 5:7 | Verso de todas as cartas. **Feito** (`cartas/verso.webp`) | `Collectible card game card back, front view, perfectly symmetrical, vertical 3:4 format. Ornate frame of dark polished oak with gold filigree and iron corner brackets, rounded corners. In the center, a round golden emblem: two closed leather-bound tomes crossed behind a compass rose, sealed with a red wax seal. Background inside the frame: deep brown leather with subtle embossed geometric pattern and faint warm glow radiating from the emblem. Small amber gems set at the top and bottom of the frame. Warm candlelight, rich saturated colors, painterly digital art, high detail, crisp edges. Card centered, touching the top and bottom edges, with a thin plain dark margin on the left and right. No text, no letters, no numbers, no logos, no watermark, no hands, no table.` | P1 |

### Sons (feito: em `public/sfx/`, ainda não ligados às animações)

Prompts em inglês para gerador de efeitos sonoros (o mesmo usado no público de taverna); em banco de sons (Freesound, Pixabay), buscar pelas palavras-chave.

| Arquivo | Duração | Para quê | Prompt ou busca | Prioridade |
|---|---|---|---|---|
| `tambor` | 1,5–2 s | Rufar antes de revelar a carta escolhida e o resultado do dado ([06](06-animacoes.md)) | `Short medieval snare drum roll building tension, ending with a single hit, dry, no reverb tail` · busca: `drum roll short` | P1 |
| `chama` | 0,8–1 s | Carta descartada queimando de baixo para cima | `Quick whoosh of paper catching fire and burning up, short crackle at the end` · busca: `paper burn whoosh` | P1 |
| `correntes-quebrando` | 1–1,5 s | Forja do Combinar: as correntes se partem (hoje usa um som de fivela) | `Heavy iron chains snapping and falling onto a wooden table, metallic clatter` · busca: `chain break` | P1 |
| `publico-comemora` | 2–3 s | Rank alto no Resultado e carta lendária | `Small medieval tavern crowd cheering and clapping, mugs clinking, short and joyful` | P2 |
| `publico-lamenta` | 1,5–2 s | Falha no dado e evento desfavorável | `Small tavern crowd groaning in disappointment, a few "ohh" sounds, short` | P2 |

### Sons que ainda faltam (gerar)

Momentos que hoje usam um som emprestado do Kenney ou ficam mudos. Salvar em `assets-originais/sons/efeitos-gerados/`.

| Arquivo | Duração | Para quê | Prompt | Prioridade |
|---|---|---|---|---|
| `pena` | 1,5–2 s | Aprendizados da F5 escritos a pena (hoje mudo) | `Quill pen scratching quickly on parchment paper, a few strokes, dry, close microphone` | P1 |
| `bigorna` | 1–1,5 s | Medalha do rank sendo forjada na F3 (hoje `metal`, um saque de faca) | `Single blacksmith hammer strike on an anvil with a short metallic ring, medieval forge` | P1 |
| `fanfarra-grande` | 3–4 s | Rank Grão-Mestre e carta lendária (hoje um jingle curto de pizzicato) | `Short triumphant medieval brass fanfare with timpani, royal and grand, ending on a held chord` | P1 |
| `velas` | 1–2 s | Velas acendendo na tela inicial, quando ela for refeita | `Several candles igniting one after another, soft match strikes and small flame whooshes` | P2 |

As cartas, molduras, orbes, d20, correntes e selos continuam em CSS/SVG (seção 2), e os ícones que ainda faltarem eu busco no game-icons.net.

## 7. Pacotes recebidos (`assets-originais/texturas-e-cartas/`)

A equipe trouxe pacotes prontos; nenhum veio com arquivo de licença (**PREENCHER** a origem de cada um). O que foi aproveitado, já em WebP:

| Arquivo em `public/assets/` | Origem | Uso previsto |
|---|---|---|
| `molduras/carta-bronze.webp`, `carta-prata.webp`, `carta-ouro.webp` | Fantasy card frames (deckbuilder UI sampler), 1024×1440 | Molduras das cartas na iteração 2: comum, rara e lendária. Já são 5:7, com janela de arte, fita do nome, área de texto em pergaminho e gemas nos cantos |
| `molduras/carta-acao-bronze.webp` | idem | Cartas do Destino (eventos) ou de Desafio |
| `molduras/mascara-arte-carta.webp`, `mascara-arte-acao.webp` | idem | Recorte da arte. Janela da carta: 20,0% a 80,1% na largura e 13,8% a 54,7% na altura; da carta de ação: 30,4% a 69,9% e 20,0% a 48,5% |
| `ui/cristal.webp`, `ui/orbe.webp` | idem (UI Elements) | Base dos orbes do HUD e do custo/risco da carta |
| `texturas/holo.webp`, `holo-marmore.webp`, `estrelas.webp` | Holographic card VFX | Brilho holográfico das cartas raras e lendárias (01 §8.3) |
| `texturas/ferro-placas.webp` | Metal, material 4 (mapa `diffuseOriginal`, BMP convertido), 256×256 | Cantoneiras de ferro do quadro de missões |

**Não aproveitados agora:** as molduras "batareya" (pixel art de 64×96, ficariam serrilhadas ampliadas) e o resto das texturas 3D de madeira, metal e pedra (`Magical Wood Planks`, `Metal Plates`, `Metal`, `Stone Wall`, em BMP com mapas de relevo). Continuam em `assets-originais` se algum fundo pedir.
