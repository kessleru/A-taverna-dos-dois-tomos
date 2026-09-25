# Créditos dos sons

Todos os efeitos vêm dos pacotes [Kenney](https://kenney.nl) (licença CC0,
crédito opcional). Os pacotes completos ficam fora de `public/` (pasta
`assets-originais/sons/kenney/`, ignorada pelo git) para não irem no deploy;
aqui fica só o que o jogo toca. Nomes exatos em `src/engine/useSom.ts`.
Escolhidos pelo nome do arquivo, sem ouvir: vale escutar e trocar o que não
combinar.

| Arquivo | Pacote | Arquivo original |
|---|---|---|
| `clique.ogg` | [UI Audio](https://kenney.nl/assets/ui-audio) | `click1.ogg` |
| `tic.ogg` | UI Audio | `click2.ogg` |
| `ping.ogg` | UI Audio | `rollover2.ogg` |
| `virar-carta.ogg` | [Casino Audio](https://kenney.nl/assets/casino-audio) | `card-fan-1.ogg` |
| `carta-deslizar.ogg` | Casino Audio | `card-slide-1.ogg` |
| `carta-bater.ogg` | Casino Audio | `card-place-1.ogg` |
| `embaralhar.ogg` | Casino Audio | `card-shuffle.ogg` |
| `dado.ogg` | Casino Audio | `die-throw-1.ogg` |
| `escolha.ogg` | [RPG Audio](https://kenney.nl/assets/rpg-audio) | `bookPlace1.ogg` |
| `pagina.ogg` | RPG Audio | `bookFlip2.ogg` |
| `ganho.ogg` | RPG Audio | `handleCoins.ogg` |
| `moedas.ogg` | RPG Audio | `handleCoins2.ogg` |
| `evento.ogg` | RPG Audio | `doorOpen_1.ogg` |
| `cadeado.ogg` | RPG Audio | `metalLatch.ogg` |
| `correntes.ogg` | RPG Audio | `beltHandle1.ogg` |
| `selo.ogg` | RPG Audio | `dropLeather.ogg` |
| `perda.ogg` | [Music Jingles](https://kenney.nl/assets/music-jingles) | `Hit jingles/jingles_HIT01.ogg` |
| `fanfarra.ogg` | Music Jingles | `Pizzicato jingles/jingles_PIZZI01.ogg` |
| `vitoria.ogg` | Music Jingles | `Pizzicato jingles/jingles_PIZZI04.ogg` |
| `metal.ogg` | RPG Audio | `drawKnife1.ogg` |
| `estandarte.ogg` | RPG Audio | `cloth1.ogg` |
| `livro-abrir.ogg` | RPG Audio | `bookOpen.ogg` |

## Gerados pela equipe

Feitos num gerador de efeitos sonoros com os prompts de
`docs/redesign/08-assets.md` §6; originais em
`assets-originais/sons/efeitos-gerados/`, convertidos para OGG mono.

| Arquivo | Uso |
|---|---|
| `tambor.ogg` | Rufar antes de revelar a carta escolhida e o dado |
| `chama.ogg` | Carta descartada queimando |
| `correntes-quebrando.ogg` | Forja do Combinar |
| `publico-comemora.ogg` | Rank alto e carta lendária |
| `publico-lamenta.ogg` | Falha no dado e evento desfavorável |

**PREENCHER:** nome do gerador e licença.

## Falas do Taverneiro

18 falas gravadas/geradas pela equipe (originais em
`assets-originais/sons/falas/`, com o texto no nome do arquivo), em
`falas/*.mp3` mono a 64 kbps. Qual fala toca em cada momento está em
`src/engine/falas.ts`; nos momentos com mais de uma, o jogo sorteia sem
repetir a última. A música abaixa enquanto ele fala.

**PREENCHER:** quem gravou ou qual ferramenta de voz foi usada.

### Falas novas (setembro/2026)

20 falas gravadas num áudio só pela equipe (`entrega/audio/audio.mp3`, 2 min 34 s) e separadas por fala: os cortes foram escolhidos entre os silêncios de forma que cada trecho tenha a velocidade de fala esperada para o seu texto (10,5 a 14,5 letras por segundo em todas). Tutorial, crítico, falha, Crônica, forja, ranks, confronto, veredito, fusão e aprendizados; textos em `docs/redesign/12-divulgacao-e-prompts.md` §5. As 6 falas do vídeo de introdução ficaram em `higgsfield/audio/falas-video/`.

## Ambiente

`ambiente-taverna.mp3`: lareira crepitando, arquivo original
`freesound_community-fireplace-6354.mp3` (em `assets-originais/sons/lareira/`),
reduzido para mono a 56 kbps (3,4 MB para 1,2 MB). O padrão do nome é o do
Pixabay (usuário "freesound_community"), cuja licença dispensa crédito.
**PREENCHER:** confirmar a origem. Toca em loop a 0,08 de volume junto com a
música e silencia junto com ela.

## Murmúrio da taverna

`murmurio-1.mp3`, `murmurio-2.mp3`, `murmurio-3.mp3`: três clipes de ~22 s de
público conversando numa taverna, gerados pela equipe (originais em
`assets-originais/sons/som de publico/`, nomes "Cozy_medieval_fantas_#4-…").
Se revezam com crossfade de 2,5 s (`src/engine/murmurio.ts`) a 0,07 de volume,
por baixo da lareira, e silenciam junto com a música.
**PREENCHER:** ferramenta usada para gerar.

## Música

`musica-fundo.mp3`: "Playing with a Full Deck", de Peter McConnell, da
trilha sonora de *Hearthstone: Heroes of Warcraft* (© 2013, 2014 Azeroth
Music / Blizzard Entertainment). Reduzida de 320 para 96 kbps (7,3 MB para
2,2 MB); o original fica em `assets-originais/sons/musica/`.

**Atenção:** música comercial protegida por direitos autorais, sem licença de
uso. Está aqui só para a apresentação em sala, trabalho acadêmico sem fins
lucrativos. Se houver pedido de remoção, voltar para uma faixa livre: a
anterior, "Fantasy RPG Exploration v2" de rubyzephyr, está em
`assets-originais/sons/musica/` e no histórico do git (commit 8c6a90b).

Toca em loop a 0,12 de volume. O som começa ligado: a música entra no primeiro
clique ou tecla (o navegador não deixa tocar antes) e a tecla `M` ou o botão do
HUD desligam. Todos os efeitos são carregados ao abrir o jogo, para não
atrasarem na primeira vez que tocam.
