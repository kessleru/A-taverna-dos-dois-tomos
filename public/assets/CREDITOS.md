# Créditos dos assets visuais

## Imagens pintadas (`public/assets/*.png`, `*.jpg`)

As 17 imagens (uma por carta: conselheiros, decisões, eventos, etapas e a
carta lendária) já vieram prontas no pacote do projeto — a equipe deve
preencher aqui a origem de cada uma (gerador de IA usado, licença, ou
ilustrador) antes da entrega final. Os nomes dos arquivos batem com os ids
usados em `src/data/artes.ts`, e essa mesma seção lista o `prompt` sugerido
para cada carta caso seja preciso regenerar alguma.

| Arquivo | Carta |
|---|---|
| `artigo-A.png` / `artigo-B.png` | Conselheiros (CartaArtigo) |
| `planejar.png` / `adaptar.png` / `combinar.jpg` / `bricolagem.png` | Decisões (CartaDecisao) |
| `fundacao.jpg` / `lancamento.jpg` / `investidores.jpg` / `novo-mercado.jpg` | Cenas das etapas (CenaSituacao) |
| `crazy-quilt.jpg` / `porta-fechada.jpg` / `lemonade.jpg` / `plano-furou.jpg` / `incubadora.jpg` / `nao-foi.jpg` | Desfechos de evento (CartaEvento) |
| `aprendizados.jpg` | Carta Lendária (F5) |

**PREENCHER:** origem/licença de cada imagem acima.

## Ícones e ilustrações do PLANO.md (não usados)

O PLANO.md (seção 7.4) descreve um sistema de cena em SVG com ícones do
[game-icons.net](https://game-icons.net) (CC BY 3.0) e ilustrações
[unDraw](https://undraw.co). Como já existe uma imagem pintada para cada
carta, `CenaArte.tsx` usa essas imagens diretamente e esse acervo de ícones
não foi baixado (também não havia acesso à internet durante a implementação
para buscá-los). Se a equipe quiser adicionar as ilustrações do briefing
(`startup.svg`, `laboratorio.svg`, etc.) ou trocar alguma arte, essa é a
referência original.

## Fontes

Bungee, Rubik e IBM Plex Mono — [Google Fonts](https://fonts.google.com),
licença Open Font License, via pacotes `@fontsource/*` (npm).
