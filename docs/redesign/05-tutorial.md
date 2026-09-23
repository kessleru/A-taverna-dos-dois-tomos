# 05 — Tutorial

## 1. Formato

Um **tour guiado pelo Taverneiro** sobre a própria mesa da rodada, logo depois da F1 e antes da etapa 1 (~1:30). Cada passo apaga a tela, abre um **holofote** no elemento, desenha uma **seta** até ele e mostra um **balão** curto. Avança com `→`, como todo o resto. A mesa aparece com um estado de exemplo (as cartas da etapa 1, orbes em 50), então nada do tutorial mexe na rodada de verdade.

Inspiração: o tutorial do Hearthstone (setas e destaques guiados pelo Innkeeper) e o narrador do Inscryption, que ensina as regras de dentro do jogo.

## 2. Passos

| # | Alvo | Balão do Taverneiro | Extra visual |
|---|---|---|---|
| 1 | Carta de Desafio | "Toda etapa começa com um desafio que aconteceu de verdade." | A carta cai na mesa |
| 2 | Leitura do Mapa | "O Cartógrafo lê o momento: quem decide, a fase da empresa e o mercado. As setas mostram a quem o contexto ajuda." | As etiquetas viram uma a uma |
| 3 | As 2 cartas | "Vocês votam levantando a mão. Carta 1 ou carta 2." | Mão fantasma aponta cada carta |
| 4 | Pistas da carta | "Estes ícones dizem o que a carta mexe. Para que lado... só jogando." | Círculo desenhado em volta dos ícones |
| 5 | Ampliação | "Não enxergou? A gente amplia." | A carta amplia sozinha e volta |
| 6 | Dado do Destino | "Depois do voto, o destino rola. O contexto dá bônus ou atrapalha." | O dado faz uma rolagem de demonstração |
| 7 | Orbes | "Caixa, Clientes e Moral. Não deixem nenhum secar." | Um +10 fantasma sobe de cada orbe |
| 8 | Combinar acorrentada | "Esta carta está presa. Descubram como forjá-la." | As correntes chacoalham |
| 9 | Narradores | "Depois de cada decisão, os dois tomos contam o que aconteceu de verdade. Boa sorte, fundadoras!" | Os retratos acendem |

## 3. Peças visuais

- **Holofote:** SVG em tela cheia com `<mask>`: retângulo preto a 70% com um buraco arredondado (margem de 16 px) em volta do alvo. O buraco anima de um alvo para o outro com spring.
- **Seta desenhada:** caminho SVG curvo (Bézier quadrática do balão até a borda do alvo), traço dourado de 6 px com brilho, desenhado com `pathLength` de 0 a 1 em 400 ms, ponta que "salta" no fim.
- **Balão:** pergaminho com o retrato do Taverneiro, texto em Alegreya 36 px digitado rápido, e `→ continuar` em mono no canto.
- **Mão fantasma:** ícone de mão que desliza até o alvo e "clica" (escala 0,9 → 1).
- **Anel pulsante:** círculo que expande e some em volta do alvo, repetindo a cada 1,2 s.

## 4. Implementação

Componente próprio, pequeno, em vez de biblioteca: o tour precisa obedecer às teclas do apresentador, usar o palco escalado e ter setas desenhadas no tema. (Se faltar tempo, [driver.js](https://driverjs.com), licença MIT, cobre holofote e balão, mas sem as setas curvas.)

```
src/components/guia/
  Tour.tsx          # lê os passos, controla o índice, escuta → e Esc
  Holofote.tsx      # máscara SVG
  SetaGuia.tsx      # caminho SVG animado
  BalaoGuia.tsx     # pergaminho + retrato + texto
src/data/tutorial.ts  # passos: { alvo, texto, lado, extra }
```

- Os alvos são marcados com `data-guia="orbes"`, `data-guia="mao"` etc. O `Tour` mede o elemento com `getBoundingClientRect()` e divide pela escala do palco.
- `T` abre o tour de novo a qualquer momento (útil se alguém perguntar "como funciona mesmo?").
- Com movimento reduzido: sem digitação nem desenho da seta; tudo aparece direto.

## 5. Critérios de aceite

- O tour completo leva no máximo 1:30 no ensaio.
- Todos os alvos ficam visíveis e bem enquadrados em 1920×1080 e 1366×768.
- `Esc` pula o tour inteiro; `T` reabre.
