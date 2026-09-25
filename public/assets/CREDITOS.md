# Créditos dos assets visuais

Todas as imagens estão em WebP (qualidade 80). Os PNG/JPG originais ficam em
`assets-originais/imagens/` na raiz do projeto, ignorada pelo git e fora do
deploy.

## Arte das cartas (`cartas/`)

As 17 imagens originais (uma por carta: conselheiros, decisões, eventos,
etapas e a carta lendária) já vieram prontas no pacote do projeto. Os nomes
dos arquivos batem com os ids usados em `src/data/artes.ts`, que também traz o
`prompt` sugerido para cada carta caso seja preciso regenerar alguma.

| Arquivo | Carta |
|---|---|
| `artigo-A` / `artigo-B` | Conselheiros (CartaArtigo); no redesign, retratos do Cartógrafo e da Cronista |
| `planejar` / `adaptar` / `combinar` / `bricolagem` | Decisões (CartaDecisao) |
| `fundacao` / `lancamento` / `investidores` / `novo-mercado` | Cenas das etapas (CenaSituacao) |
| `crazy-quilt` / `porta-fechada` / `lemonade` / `plano-furou` / `incubadora` / `nao-foi` | Desfechos de evento (CartaEvento) |
| `aprendizados` | Carta Lendária (F5) |

**PREENCHER:** origem/licença de cada imagem acima.

## Imagens geradas para o redesign

Geradas com os prompts de `docs/redesign/08-assets.md` (seção 2). Ainda não
usadas no código; entram com o redesign.

| Arquivo | Uso previsto |
|---|---|
| `cenario/taverna-fundo.webp` | Fundo da taverna (1376×768) |
| `cenario/tampo-mesa.webp` | Tampo da mesa (1376×768) |
| `personagens/taverneiro.webp` | Retrato do Taverneiro, no tutorial (1024×1024) |
| `cartas/fabricante-parceiro.webp` | Evento 2 favorável, "Perda Aceitável" (1200×896) |
| `cartas/maquinas-caras.webp` | Evento 2 desfavorável, "Máquinas caras demais" (1200×896) |

**PREENCHER:** ferramenta usada para gerar cada uma.

## Entrega da equipe (setembro/2026)

Geradas pela equipe com os prompts de `docs/redesign/12-divulgacao-e-prompts.md`; originais em `entrega/`, convertidos para WebP:

- `cartas/planejar.webp` e `cartas/adaptar.webp`: artes novas só com objetos (planta azul; bússola na trilha), para não confundir as cartas de estratégia com os narradores.
- `personagens/cartografo.webp` e `personagens/cronista.webp`: retratos dos narradores nos balões da Crônica e do Confronto.
- `personagens/taverneiro-porta.webp`: o Taverneiro acenando na porta, na despedida dos créditos.
- Capas de divulgação em `docs/capa/`.

**PREENCHER:** ferramenta usada para gerar.

## Verso, texturas e favicon

Gerados pela equipe com os prompts de `docs/redesign/08-assets.md` (seção 6
e o prompt do verso). Os originais ficam em `assets-originais/`.

| Arquivo | Uso | Ajuste feito |
|---|---|---|
| `cartas/verso.webp` | Verso de todas as cartas | Recortado do fundo, cantos arredondados transparentes, 500×700 (5:7). Original do Gemini (`Gemini_Generated_Image_…jpg`) |
| `cenario/quadro-tabuas.webp` | Tábuas do quadro de missões (F1) | Só conversão para WebP |
| `cenario/pergaminho.webp` | Papéis pregados e página do Grimório | Só conversão para WebP |
| `../favicon.png` | Ícone da aba do navegador | Reduzido para 192×192 |

**PREENCHER:** ferramenta usada nas texturas e no favicon.

## Molduras, UI e texturas holográficas

Pacotes trazidos pela equipe (`assets-originais/texturas-e-cartas/`), só
convertidos para WebP: `molduras/` e `ui/` do "free fantasy card frames
deckbuilder UI sampler"; `texturas/holo*` e `texturas/estrelas.webp` do
"holographic card VFX"; `texturas/ferro-placas.webp` do pacote "Metal"
(material 4). Detalhes em `docs/redesign/08-assets.md` §7.

**PREENCHER:** autor, site e licença de cada pacote (vieram sem arquivo de licença).

## Ícones (`src/assets/icones/`)

De [game-icons.net](https://game-icons.net), licença
[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) (crédito
obrigatório; a tela de créditos da F5 deve listar os autores). O quadrado
preto de fundo do download foi removido e o preenchimento trocado por
`currentColor`, para colorir com as cores do tema.

| Arquivo | Autor | Uso previsto |
|---|---|---|
| `scroll-quill.svg`, `quill-ink.svg` | Delapouite, Lorc | Planejar |
| `compass.svg` | Lorc | Adaptar |
| `hammer-drop.svg`, `toolbox.svg` | Lorc, Delapouite | Bricolagem |
| `crossed-swords.svg` | Lorc | Combinar |
| `shiny-purse.svg`, `coins.svg` | Lorc, Delapouite | Caixa |
| `flying-flag.svg` | Lorc | Clientes |
| `flamer.svg` | Sbed | Moral |
| `dice-twenty-faces-one.svg` | Delapouite | Dado do Destino |
| `open-book.svg` | Lorc | Tomos |
| `padlock.svg`, `crossed-chains.svg`, `breaking-chain.svg` | Lorc, Lorc, Skoll | Combinar trancada e forja |
| `candle-light.svg`, `lantern.svg` | Lorc | Ambiente |
| `wax-seal.svg` | Lorc | Selo da Crônica e veredito |

## Fontes

Bungee, Rubik e IBM Plex Mono — [Google Fonts](https://fonts.google.com),
licença Open Font License, via pacotes `@fontsource/*` (npm). O redesign troca
por Cinzel, Alegreya e JetBrains Mono (mesma licença), ver
`docs/redesign/07-tipografia.md`.
