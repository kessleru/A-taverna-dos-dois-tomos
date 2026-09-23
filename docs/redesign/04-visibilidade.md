# 04 — Visibilidade

## 1. Problema

Hoje as cartas têm 260 px de largura, o texto delas tem 9 a 11 px e as telas são colunas estreitas (`max-w-3xl`) com rolagem. No projetor, quem senta no fundo não lê nada. Projetores também "lavam" a imagem: escuros viram cinza e contraste baixo some.

## 2. Estratégias

### 2.1 Palco fixo de 1920×1080
Todo o jogo é desenhado num palco de 1920×1080 px, escalado para caber na tela com tarjas pretas (letterbox). Componente `Palco.tsx`:

```ts
const escala = Math.min(innerWidth / 1920, innerHeight / 1080);
// <div style={{ width: 1920, height: 1080, transform: `scale(${escala})`, transformOrigin: 'top left' }} />
```

- O layout usa px absolutos do palco, sem breakpoints. O que se vê no notebook é exatamente o que se vê no projetor.
- A 1366×768 a escala é 0,71, então todo mínimo abaixo foi escolhido para continuar legível nesse caso.
- Coordenadas do mouse e do tutorial são divididas pela escala.
- Nada de rolagem em nenhuma tela: se não cabe, divide em passos.

### 2.2 Tamanhos mínimos (no palco de 1080p)

| Elemento | Tamanho |
|---|---|
| Título de fase | 88–120 px |
| Título de etapa / pergunta para a turma | 64 px |
| Texto de narrador, situação | 36 px (**mínimo para texto essencial**) |
| Texto dentro da carta na mão | 28 px, até 14 palavras |
| Números dos orbes | 48 px |
| Deltas de indicador (+15) | 72 px |
| Rótulos secundários, dica de teclas | 20–24 px (nunca essenciais) |

Regra adotada: nenhum texto essencial abaixo de 1/30 da altura da tela (36 px).

### 2.3 Um foco por passo
Em cada passo da rodada, **um** elemento ocupa o centro e pelo menos 40% da tela. O resto fica com opacidade 0,35 e `blur(2px)`. Hook `useFoco(passo)` devolve qual área está ativa; cada área recebe `data-foco` e o CSS faz o resto.

| Passo | Em foco |
|---|---|
| Desafio | Carta de Desafio |
| Votação | Leitura do Mapa, depois as 2 cartas e a pergunta |
| Dado | Dado e painel de bônus |
| Consequência | Orbes e Tapeçaria |
| Crônica | Balões dos narradores |
| Evento | Carta do Destino |

### 2.4 Ampliar carta (tecla `Z` ou clique)
Como o "inspecionar" do Hearthstone:
- A carta voa para o centro em ~2× (altura ~840 px) com `layoutId` do Framer Motion; o fundo escurece e desfoca.
- Na versão ampliada, o texto passa para o **modo leitura**: fonte maior e o texto completo da opção, a teoria e os blocos do Canvas.
- `Z` amplia a carta em foco; com duas cartas, `Z` e depois `1` ou `2`. `Esc`, `Z` ou clique fecham.
- Funciona em todas as cartas: tomos na F1 e na F4, decisões, destino, lendária.

### 2.5 Contraste pensado para projetor
- Texto longo sempre em **tinta escura sobre pergaminho** (contraste ~13:1).
- Texto claro sobre arte sempre com contorno escuro (`-webkit-text-stroke` + sombra).
- Pesos 600 ou mais; Cinzel só a partir de 36 px.
- Nada de cinza sobre cinza: os tons de madeira ficam longe do texto.

### 2.6 Cor nunca sozinha
Cada lógica tem cor + sigilo + forma da gema + nome ([01](01-tema-e-hud.md) §2). Ganho e perda têm cor + sinal + direção do movimento (sobe ou cai).

## 3. Arquivos afetados

- `src/components/ui/Palco.tsx` (novo), usado em `App.tsx` em volta de tudo.
- `src/engine/useFoco.ts` (novo).
- `src/components/cartas/Ampliacao.tsx` (novo): overlay com `AnimatePresence` e `layoutId`.
- `src/styles/global.css`: classes de foco e escala tipográfica.

## 4. Critérios de aceite

- Em 1920×1080 e em 1366×768, nenhuma tela tem rolagem e todo texto essencial mede pelo menos 36 px no palco.
- Um membro da equipe, no fundo da sala, lê a pergunta, as duas cartas e os números dos orbes.
- Qualquer carta pode ser ampliada e fechada só com o teclado.
