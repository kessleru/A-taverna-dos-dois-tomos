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