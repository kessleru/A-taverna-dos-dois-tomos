# Créditos dos sons

Todos os efeitos vêm dos pacotes [Kenney](https://kenney.nl) (licença CC0,
crédito opcional). Os pacotes completos ficam fora de `public/` (pasta
`assets-originais/sfx/kenney/`, ignorada pelo git) para não irem no deploy;
aqui fica só o que o jogo toca. Nomes exatos em `src/engine/useSom.ts`.

| Arquivo | Pacote | Arquivo original |
|---|---|---|
| `clique.ogg` | [UI Audio](https://kenney.nl/assets/ui-audio) | `click1.ogg` |
| `virar-carta.ogg` | [RPG Audio](https://kenney.nl/assets/rpg-audio) | `bookFlip1.ogg` |
| `escolha.ogg` | RPG Audio | `bookPlace1.ogg` |
| `ganho.ogg` | RPG Audio | `handleCoins.ogg` |
| `perda.ogg` | [Music Jingles](https://kenney.nl/assets/music-jingles) | `Hit jingles/jingles_HIT01.ogg` |
| `dado.ogg` | RPG Audio | `handleSmallLeather2.ogg` |
| `evento.ogg` | RPG Audio | `doorOpen_1.ogg` |
| `cadeado.ogg` | RPG Audio | `metalLatch.ogg` |
| `fanfarra.ogg` | Music Jingles | `Pizzicato jingles/jingles_PIZZI01.ogg` |

## Música

`musica-fundo.mp3`: "Playing with a Full Deck", de Peter McConnell, da
trilha sonora de *Hearthstone: Heroes of Warcraft* (© 2013, 2014 Azeroth
Music / Blizzard Entertainment). Reduzida de 320 para 96 kbps (7,3 MB para
2,2 MB); o original fica em `assets-originais/sfx/Music/`.

**Atenção:** música comercial protegida por direitos autorais, sem licença de
uso. Está aqui só para a apresentação em sala, trabalho acadêmico sem fins
lucrativos. Se houver pedido de remoção, voltar para uma faixa livre (a
anterior, "Fantasy RPG Exploration v2" de rubyzephyr, está no histórico do
git, commit 8c6a90b).

Toca em loop a 0,12 de volume quando o som está ligado (tecla `M` ou botão do
HUD); o jogo começa mudo.
