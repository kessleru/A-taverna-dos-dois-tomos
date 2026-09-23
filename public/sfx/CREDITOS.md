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

**Faltam** (nenhum pacote Kenney baixado tem): `tambor.ogg` (rufar antes da
revelação) e `chama.ogg` (carta queimando no descarte). Sugestão:
[Freesound](https://freesound.org) filtrando por CC0.

## Ambiente

`ambiente-taverna.mp3`: lareira crepitando, arquivo original
`freesound_community-fireplace-6354.mp3` (em `assets-originais/sons/`),
reduzido para mono a 56 kbps (3,4 MB para 1,2 MB). O padrão do nome é o do
Pixabay (usuário "freesound_community"), cuja licença dispensa crédito.
**PREENCHER:** confirmar a origem. Toca em loop a 0,08 de volume junto com a
música e silencia junto com ela.

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
