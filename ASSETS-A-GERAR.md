# Assets a gerar

Artes que hoje são ícones chapados (SVG do game-icons.net) ou cópias de outra imagem
e que ficariam melhores pintadas, no mesmo estilo do Taverneiro e do verso das cartas.
Em ordem de impacto: os primeiros aparecem na tela grande, por mais tempo.

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

## 1. Ampulheta pintada

- **Arquivo:** `public/assets/ui/ampulheta.png`
- **Onde aparece:** Passagem do Tempo, entre um capítulo e outro (vira 180° no começo).
  Hoje é o ícone chapado `hourglass.svg`.
- **Tela:** 150 × 150 px · **Gerar:** 1024 × 1024 · **Fundo:** transparente
- **Cuidado:** simétrica de cima para baixo (ela gira). Areia quase toda no bulbo de baixo:
  depois de virar, fica em cima e "começa a cair".

> Uma ampulheta de fantasia vista de frente, centralizada, inteira no quadro. Armação de
> madeira escura com tampas e colunas de latão dourado, simétrica de cima para baixo. Vidro
> âmbar translúcido com leve brilho, areia dourada luminosa quase toda no bulbo de baixo e um
> fio de areia caindo. Brilho dourado suave em volta. Fundo transparente.

## 2. Dado do Destino (d20 dourado)

- **Arquivo:** `public/assets/ui/dado-d20.png`
- **Onde aparece:** tela do Dado do Destino (300 px, balançando) e na Consequência (260 px,
  girando, com o número escrito por cima). Hoje é o ícone `dice-twenty-faces-one.svg`.
- **Tela:** 300 × 300 px · **Gerar:** 1024 × 1024 · **Fundo:** transparente
- **Cuidado:** **faces lisas, sem números**: o jogo escreve o resultado no centro. A face da
  frente precisa ficar bem de frente e um pouco mais escura, para o número branco aparecer.

> Um dado de vinte faces (icosaedro) de ouro envelhecido, visto de frente, com uma face
> triangular virada diretamente para o observador no centro. Faces lisas, sem números nem
> símbolos, arestas arredondadas e grossas, pequenas gemas âmbar nas pontas. A face central
> é um pouco mais escura e fosca. Brilho mágico dourado suave em volta. Fundo transparente.

## 3. Verso da Carta do Destino

- **Arquivo:** `public/assets/cartas/verso-destino.png`
- **Onde aparece:** a Carta do Destino chega virada e gira para mostrar o desfecho. Hoje, no
  meio do giro, aparece a frente espelhada; com este verso, a carta mostra as costas antes.
- **Tela:** 520 × 720 px · **Gerar:** 1040 × 1440 (retrato) · **Fundo:** a carta ocupa o
  quadro inteiro, cantos levemente arredondados
- **Cuidado:** tem que ser claramente **diferente** do verso das cartas de decisão (que é
  marrom e dourado, `public/assets/cartas/verso.webp`): aqui é **noite**, azul-violeta com
  prata e ouro. Ornamentos grossos, nada de filigrana fina.

> Verso de carta de tarô de fantasia, formato retrato, simétrico. Fundo azul-noite profundo
> com um céu estrelado pintado e nuvens violeta suaves. No centro, uma lua crescente de prata
> abraçando um olho místico dourado, com raios de luz suaves. Moldura larga de metal escuro
> com cantos de prata e pequenas gemas violeta, ornamentos grossos e simples. Luz fria de
> luar com brilhos dourados, sem texto.

## 4. Retrato do Cartógrafo (narrador do Tomo A)

- **Arquivo:** `public/assets/personagens/cartografo.png`
- **Onde aparece:** balões da Crônica e do Confronto (132 a 170 px, recorte quadrado). Hoje é
  uma cópia da arte da carta do Tomo A (um mapa, sem pessoa).
- **Tela:** até 170 × 170 px · **Gerar:** 1024 × 1024 · **Fundo:** cenário pintado desfocado
- **Cuidado:** rosto grande e centralizado (é reduzido bastante), mesmo enquadramento do
  retrato do Taverneiro: busto, olhando para a frente.

> Retrato de busto de um cartógrafo de fantasia de meia-idade, sorriso confiante, óculos
> redondos de latão na testa, casaco de couro marrom com alças e uma bússola dourada no
> peito, segurando um mapa enrolado. Rosto grande e bem iluminado, centralizado. Fundo:
> interior de taverna desfocado com mapas na parede e luz âmbar. Tons de laranja e âmbar
> (a cor do Tomo A).

## 5. Retrato da Cronista (narradora do Tomo B)

- **Arquivo:** `public/assets/personagens/cronista.png`
- **Onde aparece:** mesmo lugar do Cartógrafo. Hoje é uma cópia da arte do Tomo B.
- **Tela:** até 170 × 170 px · **Gerar:** 1024 × 1024 · **Fundo:** cenário pintado desfocado

> Retrato de busto de uma cronista e alquimista de fantasia, jovem adulta, olhar curioso e
> gentil, cabelo preso com uma pena, avental de laboratório sobre roupa de viagem, segurando
> um frasco com líquido turquesa luminoso. Rosto grande e bem iluminado, centralizado. Fundo:
> bancada de laboratório desfocada com frascos e plantas, luz turquesa misturada com luz
> quente de vela. Tons de turquesa e âmbar (a cor do Tomo B).

## 6. Vela da tela de carregamento

- **Arquivo:** `public/assets/ui/vela.png`
- **Onde aparece:** tela de carregamento (120 px, no centro). Hoje é o ícone `candle-light.svg`.
  O ícone pequeno de 24 px (no "Até aqui") continua SVG: arte pintada nesse tamanho vira borrão.
- **Tela:** 120 × 120 px · **Gerar:** 768 × 768 · **Fundo:** transparente

> Uma vela de cera grossa e curta em um castiçal de latão com alça, vista de frente,
> centralizada. Chama grande, macia e quente, com halo de luz suave. Cera escorrendo em
> gotas grandes e arredondadas. Fundo transparente.

## 7. Pergaminho com pena ("A crônica terminou")

- **Arquivo:** `public/assets/ui/pergaminho-pena.png`
- **Onde aparece:** fim da rodada, acima de "A crônica terminou" (170 px), com o selo de cera
  batendo no canto de baixo à direita. Hoje é o ícone `scroll-quill.svg`.
- **Tela:** 170 × 170 px · **Gerar:** 1024 × 1024 · **Fundo:** transparente
- **Cuidado:** deixar o **canto de baixo à direita livre** (o selo cai ali). Pergaminho sem
  escrita legível: no máximo manchas de tinta sugerindo linhas.

> Um pergaminho enrolado nas duas pontas, meio aberto, levemente inclinado, com uma pena de
> ganso branca e um tinteiro de vidro escuro ao lado esquerdo. Papel cor de creme envelhecido,
> sem escrita legível, só traços borrados sugerindo linhas. Canto inferior direito vazio.
> Luz quente de vela. Fundo transparente.

## 8. Selo de cera pintado

- **Arquivo:** `public/assets/ui/selo-cera.png`
- **Onde aparece:** fecha avisos, missões, a Crônica (96 px), o fim da rodada (80 px) e o
  Confronto (220 px). Hoje é o ícone `wax-seal.svg` pintado de vermelho por CSS.
- **Tela:** 80 a 220 px · **Gerar:** 768 × 768 · **Fundo:** transparente
- **Cuidado:** o símbolo no centro precisa ser **grosso e simples** (aparece a 80 px). Mesmo
  vermelho do selo do verso das cartas.

> Um selo de cera vermelho-escuro visto de cima, redondo com borda irregular e macia de cera
> derretida, com uma fita vermelha curta saindo por baixo. No centro, em relevo, uma rosa dos
> ventos simples com um livro aberto, formas grossas. Brilho suave na cera. Fundo transparente.

## 9. Taverneiro, duas expressões (opcional)

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
