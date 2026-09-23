# A Taverna dos Dois Tomos

Jogo de apresentação para a atividade de Empreendedorismo (repositório "Startup Arena"). O redesign em andamento está em [docs/redesign/](./docs/redesign/00-visao-geral.md); o plano original fica em [docs/plano-original.md](./docs/plano-original.md) como histórico.

## Pastas

```
docs/
  redesign/          plano atual, um arquivo por tópico
  artigos/           PDFs dos dois artigos (não vão para o build)
  plano-original.md  primeiro plano, histórico
public/
  assets/cartas/     arte das cartas (WebP)
  assets/cenario/    fundo da taverna e tampo da mesa (WebP)
  assets/personagens/ retratos (WebP)
  assets/molduras/   molduras de carta; assets/ui/ cristal e orbe; assets/texturas/ holo
  sfx/               efeitos (.ogg) e música de fundo
src/
  assets/icones/     ícones SVG do game-icons.net, embutidos no bundle (cor via currentColor)
  data/              textos e dados do jogo
  engine/            motor da rodada, navegação e som
  components/        cartas, HUD, rodada, UI
  fases/             uma tela por fase (F0 a F5) e a vitrine
assets-originais/    PNG/JPG/pacotes de som originais (ignorada pelo git)
```

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

## Controles do apresentador

- `→`, `Espaço`, `PageDown`: avançar
- `←`, `PageUp`: voltar
- `1` Planejar, `2` Adaptar, `3` Combinar (durante a votação)
- `M`: mudo, `F`: tela cheia, `Shift+R`: reinicia a rodada (ensaio)

O estado da apresentação fica salvo em `sessionStorage`, então um recarregamento acidental não perde o progresso.

## Vitrine de cartas

`http://localhost:5173/#vitrine` (ou a URL publicada + `#vitrine`) mostra todas as cartas do jogo lado a lado, para revisão visual fora da apresentação.

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy.yml` builda e publica a cada push em `main`. Para ativar, uma vez: **Settings → Pages → Source: GitHub Actions** no repositório. A URL final fica em `https://<usuario>.github.io/empreendedorismo/` (o `base` em `vite.config.ts` já está configurado para esse caminho).

## Créditos

`public/assets/CREDITOS.md` e `public/sfx/CREDITOS.md` listam origem e licença de cada imagem, ícone e som, e o que ainda falta preencher.