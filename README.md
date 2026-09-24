# A Taverna dos Dois Tomos

Jogo de apresentação para a atividade de Empreendedorismo (repositório "Startup Arena"). O redesign em andamento está em [docs/redesign/](./docs/redesign/00-visao-geral.md); o plano original fica em [docs/plano-original.md](./docs/plano-original.md) como histórico.

**Para estudar os artigos:** [docs/artigos-explicados.md](./docs/artigos-explicados.md) explica os dois artigos de forma simples e mostra onde cada ideia aparece no jogo.

## Pastas

```
docs/
  redesign/          plano atual, um arquivo por tópico
  artigos/           PDFs dos dois artigos (não vão para o build)
  artigos-explicados.md  os dois artigos em linguagem simples
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
- `1`, `2`, `3`: escolhem a carta pela posição na mesa (durante a votação; o número aparece na gema da carta)
- `Shift+1` / `Shift+2` / `Shift+3`: forçam o próximo dado para falha / sucesso / crítico (emergência no ensaio)
- `Esc`: pula as dicas do Taverneiro (tutorial) daquele momento; em tela cheia prefira o link "Pular o tutorial", porque o navegador também sai da tela cheia com `Esc`
- `M`: mudo, `F`: tela cheia, `Shift+R`: reinicia a rodada (ensaio)

Roteiro cronometrado e checklist do projetor: [`docs/redesign/11-ensaio.md`](docs/redesign/11-ensaio.md).

O estado da apresentação fica salvo em `sessionStorage`, então um recarregamento acidental não perde o progresso.

## Vitrine de cartas

`http://localhost:5173/#vitrine` (ou a URL publicada + `#vitrine`) mostra todas as cartas do jogo lado a lado, para revisão visual fora da apresentação.

## Deploy na Vercel

Importar o repositório na Vercel (framework Vite detectado sozinho; build `npm run build`, saída `dist`). Cada push na `main` publica. O `vite.config.ts` usa a raiz `/` quando roda na Vercel (variável `VERCEL`) e `/empreendedorismo/` no GitHub Pages.

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy.yml` builda e publica a cada push em `main`. Para ativar, uma vez: **Settings → Pages → Source: GitHub Actions** no repositório. A URL final fica em `https://<usuario>.github.io/empreendedorismo/` (o `base` em `vite.config.ts` já está configurado para esse caminho).

## Créditos

`public/assets/CREDITOS.md` e `public/sfx/CREDITOS.md` listam origem e licença de cada imagem, ícone e som, e o que ainda falta preencher.