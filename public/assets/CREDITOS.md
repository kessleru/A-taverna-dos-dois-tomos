# Créditos dos assets visuais

Todas as imagens estão em WebP (qualidade 80). Os PNG/JPG originais ficam em
`assets-originais/` na raiz do projeto, ignorada pelo git e fora do deploy.

## Imagens pintadas (`public/assets/cartas/*.webp`)

As 17 imagens (uma por carta: conselheiros, decisões, eventos, etapas e a
carta lendária) já vieram prontas no pacote do projeto — a equipe deve
preencher aqui a origem de cada uma (gerador de IA usado, licença, ou
ilustrador) antes da entrega final. Os nomes dos arquivos batem com os ids
usados em `src/data/artes.ts`, e essa mesma seção lista o `prompt` sugerido
para cada carta caso seja preciso regenerar alguma.

| Arquivo | Carta |
|---|---|
| `artigo-A` / `artigo-B` | Conselheiros (CartaArtigo) |
| `planejar` / `adaptar` / `combinar` / `bricolagem` | Decisões (CartaDecisao) |
| `fundacao` / `lancamento` / `investidores` / `novo-mercado` | Cenas das etapas (CenaSituacao) |
| `crazy-quilt` / `porta-fechada` / `lemonade` / `plano-furou` / `incubadora` / `nao-foi` | Desfechos de evento (CartaEvento) |
| `aprendizados` | Carta Lendária (F5) |

**PREENCHER:** origem/licença de cada imagem acima.

## Imagens geradas para o redesign da taverna

Geradas com os prompts de `docs/redesign/08-assets.md` (seção 2). Ainda não
usadas no código; entram com o redesign.

| Arquivo | Uso previsto |
|---|---|
| `bg/tavern.webp` | Fundo da taverna (1376×768) |
| `taverneiro/taverneiro.webp` | Retrato do Taverneiro (1024×1024) |
| `fabricante/fabricante.webp` | Fabricante parceiro (1200×896) |
| `maquinas/maquinas.webp` | Máquinas caras (1200×896) |
| `tampo-mesa/tampo.webp` | Tampo da mesa (1376×768) |

**PREENCHER:** ferramenta usada para gerar cada uma.

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
