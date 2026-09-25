# Desenvolvimento

Como rodar, testar, publicar e apresentar o jogo. Sobre o jogo em si, ver o [README](README.md).

## Rodando

```bash
npm install
npm run dev
```

## Build e testes

```bash
npm run build
npm test
```

## Pastas

```
public/
  assets/cartas/        arte das cartas
  assets/cenario/       fundo da taverna, tampo da mesa, pergaminho, tábuas do quadro
  assets/personagens/   Taverneiro, Cartógrafo e Cronista
  assets/molduras/      molduras das cartas (bronze, prata, ouro)
  assets/texturas/      estrelas, ferro
  assets/ui/            orbe dos indicadores
  sfx/                  efeitos, falas do Taverneiro, música e ambiente
src/
  assets/icones/        ícones SVG do game-icons.net (cor via currentColor)
  data/                 textos e dados do jogo
  engine/               motor da rodada, navegação, som e tutorial
  components/           cartas, HUD, rodada, guia, UI
  fases/                uma tela por fase (F0 a F5) e a vitrine
.github/readme/         imagens do README
```

## Controles do apresentador

- `→`, `Espaço`, `PageDown`: avançar
- `←`, `PageUp`: voltar
- `1`, `2`, `3`: escolhem a carta pela posição na mesa (o número aparece na gema da carta)
- `Shift+1` / `Shift+2` / `Shift+3`: forçam o próximo dado para falha / sucesso / crítico (emergência no ensaio)
- `Esc`: pula as dicas do Taverneiro daquele momento; em tela cheia prefira o link "Pular o tutorial", porque o navegador também sai da tela cheia com `Esc`
- `M`: mudo · `F`: tela cheia · `Shift+R`: reinicia a rodada

O estado da apresentação fica salvo na aba (`sessionStorage`): recarregar a página sem querer não perde o progresso.

## Vitrine de cartas

`http://localhost:5173/#vitrine` (ou a URL publicada + `#vitrine`) mostra todas as cartas lado a lado, para revisão visual.

## Deploy

Na Vercel: importar o repositório (Vite é detectado sozinho; build `npm run build`, saída `dist`). Cada push na `main` publica.

## Créditos

[`public/assets/CREDITOS.md`](public/assets/CREDITOS.md) e [`public/sfx/CREDITOS.md`](public/sfx/CREDITOS.md) listam a origem e a licença de cada imagem, ícone e som.
