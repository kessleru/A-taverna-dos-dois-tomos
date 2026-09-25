# Assets a gerar

Artes pintadas no mesmo estilo do Taverneiro e do verso das cartas, para o lugar de
ícones chapados (SVG do game-icons.net).

Quando um arquivo ficar pronto, é só colocar no caminho indicado (qualquer formato: PNG,
JPG ou WebP). Eu faço o recorte, a redução e a conversão, e ligo a imagem no jogo.

## Estilo comum (vale para todos)

A ideia é **pintura de card game de fantasia**, não foto. O serrilhado aparece quando a
imagem tem detalhe fino demais (fios de cabelo, reflexos pontudos, texturas granuladas,
contornos de 1 px) e ela é reduzida para o tamanho da tela. Por isso:

- **Formas grandes e legíveis**, silhueta clara, poucos detalhes pequenos.
- **Pinceladas macias**, sombreado suave, bordas levemente pintadas (não recortadas a faca).
- **Sem linhas finas**: nada de filetes, gravuras, fios ou hachuras.
- **Sem texto, letras ou números** na imagem (o jogo escreve por cima).
- **Gere com o dobro do tamanho de tela** (o tamanho está em cada item). Eu reduzo com filtro
  Lanczos, que suaviza a borda.
- **Fundo**: onde diz "transparente", use fundo transparente se a ferramenta tiver. Se não
  tiver, peça **fundo liso cinza médio (#808080), sem sombra no chão**: eu recorto e suavizo a
  borda. Evite fundo verde ou magenta, que deixa halo colorido.

**Complemento de estilo** (colar no fim de todo prompt):

> ilustração pintada à mão estilo card game de fantasia (Hearthstone, Legends of Runeterra),
> pinceladas macias, formas simples e legíveis, sombreado suave, luz quente de vela, paleta
> de âmbar, ouro e marrom, sem texto, sem letras, sem números

**Prompt negativo** (se a ferramenta aceitar):

> fotorrealista, foto, 3D render, hiper-detalhado, textura granulada, ruído, linhas finas,
> contorno fino, hachura, gravura, texto, letras, números, marca d'água, moldura, borda cortada

---

## Já entregues e no jogo

| Arquivo no jogo | Onde aparece |
|---|---|
| `ui/ampulheta.webp` | Passagem do Tempo |
| `ui/dado-d20.webp` | Dado do Destino e Consequência |
| `cartas/verso-destino.webp` | Verso da Carta do Destino (ela pousa de costas e vira) |
| `ui/vela.webp` | Tela de carregamento |
| `ui/pergaminho-pena.webp` | "A crônica terminou" |
| `ui/selo-cera.webp` | Selos da missão, da Crônica, do fim da rodada e do Confronto |

Os originais ficam em `assets-originais/imagens/` (fora do git e do deploy).

## Falta gerar

### Taverneiro, duas expressões (opcional)

- **Arquivos:** `public/assets/personagens/taverneiro-comemora.png` e
  `public/assets/personagens/taverneiro-preocupado.png`
- **Onde apareceriam:** no balão do Taverneiro quando o dado dá crítico (comemora) ou falha
  (preocupado). Hoje é sempre o mesmo retrato sorrindo.
- **Tela:** 104 a 170 px · **Gerar:** 1024 × 1024 · **Fundo:** o mesmo cenário do retrato atual
- **Cuidado:** tem que ser **o mesmo homem** do `taverneiro.webp`. Se a ferramenta aceitar
  imagem de referência, envie o retrato atual junto com o prompt.

Comemora:

> O mesmo taverneiro da imagem de referência: homem robusto de meia-idade, cabelo grisalho
> penteado para trás, barba grisalha cheia, camisa escura, avental de couro gasto, molho de
> chaves no cinto. Rindo alto de boca aberta, erguendo uma caneca de madeira espumando em
> brinde. Mesmo enquadramento de busto e mesma taverna ao fundo com lareira e velas.

Preocupado:

> O mesmo taverneiro da imagem de referência: homem robusto de meia-idade, cabelo grisalho
> penteado para trás, barba grisalha cheia, camisa escura, avental de couro gasto. Testa
> franzida, coçando a nuca com uma mão e segurando a lanterna mais baixa com a outra,
> expressão de "isso não saiu como esperado". Mesmo enquadramento de busto e mesma taverna
> ao fundo, luz um pouco mais fria.
