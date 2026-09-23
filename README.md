# Startup Arena — A Batalha dos Artigos

Jogo de apresentação (15 min) para a atividade de Empreendedorismo. Ver [PLANO.md](./PLANO.md) para o plano completo.

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

## Assets pendentes

`public/assets/CREDITOS.md` e `public/sfx/CREDITOS.md` listam o que falta preencher: a origem/licença de cada imagem já incluída e os arquivos de som (Kenney Audio, CC0) que o jogo já está pronto para tocar assim que forem adicionados.