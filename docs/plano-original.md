# PLANO.md — Startup Arena: A Batalha dos Artigos

> Plano de implementação para o **Claude Code**. Leia este arquivo inteiro antes de escrever código.
> Execute uma iteração por vez, faça commit ao final de cada uma e **pare para pedir revisão**.

---

## 1. Contexto

Atividade acadêmica: comparar **dois artigos sobre estratégias empreendedoras e inovação** com um material digital criativo, respondendo: as estratégias são similares ou diferentes? Existe um tema central? Qual a solução proposta? Quais os aprendizados?

**Produto:** um jogo de **uma única rodada**, jogado **uma vez** com a turma no projetor, dentro de uma apresentação de **15 minutos**. A equipe conduz; a turma decide votando com a mão. **Não há cronômetro em nenhum momento:** o ritmo é do apresentador.

**Ideia central:** a turma funda uma startup baseada no caso real do Artigo B e toma 4 decisões. Em cada decisão, **os dois artigos aparecem juntos**: o Artigo A diz o que a teoria recomenda e o Artigo B mostra o que a startup real fez.

**Artigos:**
- **A — "O Mapa":** Kogut, Mello e Skorupski (2023). Revisão de 38 estudos sobre causation e effectuation.
- **B — "O Caso":** Costa, Nelson e Pedroso (2025). Estudo da startup Healthy Skin com causation, effectuation e bricolagem.

**Sem IA, sem backend, sem rede.** Tudo roda offline.

**Prioridade número um: beleza.** As cartas devem parecer cartas de um deckbuilder de verdade: **janela de arte ilustrada**, moldura por tipo, fita com o nome, orbe de custo e placa de tipo com gema de raridade. A seção 7 detalha cada elemento.

---

## 2. Arquivos de dados (já prontos — não reescrever)

| Arquivo | Conteúdo |
|---|---|
| `src/data/conteudo.ts` | Dados dos artigos: cartas, atributos, números, referências ABNT, carta Bricolagem, veredito, tema central, aprendizados |
| `src/data/rodada.ts` | Mecânica: briefing, 4 etapas (com pergunta para a turma), regra do Combinar, 3 eventos, dado, regras numéricas, perfis, caminho real, comparação |
| `src/data/artes.ts` | Arte de cada carta: ícone, fundo, cores, partículas, imagem opcional e prompt; tipos de carta (janela e raridade); orbe das decisões |

Nenhum texto de conteúdo fica hardcoded nos componentes. Se faltar algo, adicione ao arquivo de dados.

---

## 3. Stack

| Camada | Escolha |
|---|---|
| Build | Vite + React 18 + TypeScript |
| Estilo | Tailwind CSS + tokens em CSS custom properties |
| Animação | Framer Motion (springs, layout, AnimatePresence) |
| Efeitos | canvas-confetti |
| Som | Howler.js (mute global, efeitos 0.4, música 0.12 e desligada por padrão) |
| Fontes | `@fontsource/bungee`, `@fontsource/rubik`, `@fontsource/ibm-plex-mono` |
| Testes | Vitest (motor da rodada) |
| Arte das cartas | Cenas em SVG (`CenaArte`) com ícones de **game-icons.net** (CC BY 3.0) + imagens pintadas opcionais em `public/assets/arte/` |
| Ilustrações extras | unDraw (SVG, recolorir com os tokens) |
| Sons | Kenney Audio (CC0) |
| Deploy | GitHub Pages ou Netlify (site estático) |

---

## 4. Estrutura de pastas

```
startup-arena/
├── artigos/                          # PDFs de referência (não vão para o build)
│   ├── artigo-a.pdf
│   └── artigo-b.pdf
├── entrega/
│   └── plano-b.pdf                   # prints de cada tela (Iteração 6)
├── public/
│   ├── favicon.svg                   # 🃏 carta estilizada
│   ├── assets/
│   │   ├── CREDITOS.md               # origem e licença de cada asset
│   │   ├── ilustracoes/
│   │   │   ├── startup.svg           # unDraw: equipe/ideia (briefing)
│   │   │   ├── laboratorio.svg       # unDraw: ciência (etapa 1–2)
│   │   │   ├── investidores.svg      # unDraw: reunião (etapa 3)
│   │   │   ├── crescimento.svg       # unDraw: gráfico subindo (etapa 4)
│   │   │   └── trofeu.svg            # unDraw: conquista (resultado)
│   │   ├── arte/                     # OPCIONAL: imagens pintadas (webp 800×600), nome = id em artes.ts
│   │   │   └── LEIA-ME.md            # como gerar com os prompts de artes.ts
│   │   ├── avatares/                 # DiceBear "notionists", 1 SVG por autor
│   │   │   ├── kogut.svg  mello.svg  skorupski.svg
│   │   │   └── costa.svg  nelson.svg pedroso.svg
│   │   └── texturas/
│   │       └── ruido.svg             # grão sutil do fundo
│   └── sfx/
│       ├── clique.ogg     virar-carta.ogg   escolha.ogg
│       ├── ganho.ogg      perda.ogg         dado.ogg
│       ├── evento.ogg     cadeado.ogg       fanfarra.ogg
│       └── musica-fundo.ogg
├── src/
│   ├── main.tsx
│   ├── App.tsx                       # troca de fases + HUD + controles
│   ├── data/
│   │   ├── conteudo.ts               # pronto
│   │   ├── rodada.ts                 # pronto
│   │   └── artes.ts                  # pronto
│   ├── engine/
│   │   ├── motor.ts                  # funções puras da rodada
│   │   ├── motor.test.ts
│   │   ├── useRodada.ts              # useReducer em cima do motor
│   │   ├── useNavegacao.ts           # fases, teclado, passador, sessionStorage
│   │   └── useSom.ts                 # Howler + mute
│   ├── components/
│   │   ├── cartas/
│   │   │   ├── CartaBase.tsx         # moldura, tilt 3D, holo, frente/verso
│   │   │   ├── MolduraCarta.tsx      # orbe, fita do nome, janela, placa de tipo, texto
│   │   │   ├── CenaArte.tsx          # monta a ilustração (imagem ou cena SVG)
│   │   │   ├── fundos/               # 6 fundos SVG: Raios, Mapa, Laboratorio, Cidade, Colinas, Cosmos
│   │   │   ├── particulas/           # faíscas, poeira, bolhas, moedas, folhas, estrelas
│   │   │   ├── icones/               # SVGs de game-icons.net, nome = id em artes.ts
│   │   │   ├── CartaArtigo.tsx       # carta grande dos conselheiros A e B
│   │   │   ├── CartaDecisao.tsx      # Planejar / Adaptar / Combinar / Bricolagem
│   │   │   ├── CartaEvento.tsx       # carta horizontal de evento
│   │   │   ├── CartaLendaria.tsx     # carta dourada dos aprendizados
│   │   │   └── VersoCarta.tsx        # padrão do verso
│   │   ├── hud/
│   │   │   ├── Hud.tsx               # topo: equipe, trilha, barras, som
│   │   │   ├── BarraIndicador.tsx    # cápsula animada + número flutuante
│   │   │   └── TrilhaEtapas.tsx      # 4 marcos da jornada
│   │   ├── rodada/
│   │   │   ├── CenaSituacao.tsx
│   │   │   ├── Votacao.tsx           # cartas de decisão + pergunta para a turma
│   │   │   ├── Consequencia.tsx
│   │   │   ├── Dado3D.tsx
│   │   │   ├── BalaoArtigo.tsx       # balão estilo HQ com mini carta
│   │   │   ├── SeloRealidade.tsx     # "✓ Como na vida real"
│   │   │   └── Desbloqueio.tsx       # cadeado do Combinar
│   │   └── ui/
│   │       ├── Botao.tsx
│   │       ├── Titulo.tsx
│   │       ├── Fundo.tsx             # índigo + grão + grade de pontos + vinheta
│   │       ├── Confete.ts
│   │       └── Transicao.tsx         # transição única entre fases
│   ├── fases/
│   │   ├── F0Abertura.tsx
│   │   ├── F1Briefing.tsx
│   │   ├── F2Rodada.tsx
│   │   ├── F3Resultado.tsx
│   │   ├── F4Artigos.tsx
│   │   └── F5Fusao.tsx
│   ├── styles/
│   │   ├── tokens.css                # cores, sombras, raios, espaçamentos
│   │   ├── cartas.css                # holo, foil, bordas animadas
│   │   └── global.css
│   └── types.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── PLANO.md
└── README.md                         # como rodar, controles do apresentador
```

---

## 5. Roteiro de 15 minutos

| Fase | Tempo | Quem fala | Responde à atividade |
|---|---|---|---|
| F0 Abertura | 0:30 | Membro 1 | — |
| F1 Briefing | 2:30 | Membro 1 apresenta o jogo; membros 2 e 3 apresentam cada artigo ao virar sua carta | apresenta os artigos |
| F2 A Rodada | 7:00 (~1:45 por etapa) | Revezando por etapa | solução proposta, na prática |
| F3 Resultado | 1:30 | Membro 2 | — |
| F4 Artigos Lado a Lado | 2:30 | Membros 2 e 3 | similares/diferentes, tema central, soluções |
| F5 Fusão e Aprendizados | 1:00 | Membro 1 | aprendizados |

Ajustar os nomes conforme a equipe. Se for individual, a mesma pessoa conduz tudo.

---

## 6. As fases

### F0 — Abertura
Terminal em fósforo âmbar digita 3 linhas (`> buscando periódicos CAPES...`, `> 2 artigos encontrados`, `> iniciando arena...`), glitch de 400 ms e título "Startup Arena" em Bungee com brilho neon. Botão **Começar** (destrava o áudio).

### F1 — Briefing "Como jogar em 60 segundos"
Quatro telas, avançando com `→`, com o conteúdo de `briefing`:
1. **A missão:** título grande + ilustração `startup.svg`.
2. **Os conselheiros:** as duas **CartaArtigo** entram viradas e giram uma de cada vez quando o apresentador clica. Clicar de novo numa carta aberta amplia e mostra `estrategia` e `solucao` (para o membro que apresenta o artigo).
3. **Os jeitos de decidir:** 4 **CartaDecisao** em leque. A carta Combinar aparece trancada, com cadeado e correntes.
4. **Como funciona:** 5 regras com ícones, entrando uma a uma.

### F2 — A Rodada
HUD fixo no topo: 3 barras e a trilha de 4 etapas. Cada etapa percorre os passos abaixo, sempre avançando com `→`:

1. **Situação** — rótulo da fase, título e texto ao lado de uma **janela de arte grande** com a cena da etapa (`artes[etapa.id]`, via `CenaArte`), com zoom lento tipo Ken Burns.
2. **Votação** — a `perguntaParaTurma` aparece em destaque, as cartas de decisão sobem em leque. O apresentador pergunta "quem vai de Planejar?" e "quem vai de Adaptar?" e clica na carta vencedora (ou teclas `1`, `2`, `3`). **Sem cronômetro.** Ao escolher, as outras cartas descem e a escolhida vai ao centro e vira, com um rufar de tambor de ~1 s antes da revelação.
3. **Consequência** — `resultado` na carta; as barras animam com números flutuantes.
4. **Dado da Incerteza** — dado 3D rola; mostra a face e o efeito, com a legenda `explicacao`.
5. **O que dizem os artigos** — dois **BalaoArtigo** lado a lado (A laranja, B turquesa). Se a escolha foi a `ideal`, aparece o **SeloRealidade** "✓ Como na vida real"; senão, "A startup real fez diferente", mostrando a carta que ela escolheu.
6. **Evento** (depois das etapas 1, 2 e 3) — **CartaEvento** (arte via `arteEventos`) entra girando; `seSim` ou `seNao` conforme a `condicao`; aplica o efeito; rodapé com `conceito`.

**Antes da etapa 4:** tela **Desbloqueio**. Se `combinarDesbloqueado`, o cadeado treme, racha e explode em partículas douradas, as correntes caem e a carta Combinar ganha cor com som de fanfarra. Senão, a carta treme e continua trancada, com `mensagensCombinar.trancada`.

Barra abaixo de `alertaQuaseQuebrou` pulsa em vermelho com "Quase quebrou!". Nunca há game over.

### F3 — Resultado
1. As barras voam para o centro e somam num contador animado; as estrelas acendem uma a uma.
2. **Perfil da turma** (`calcularPerfil`) como um brasão: emoji gigante dentro de um medalhão, nome em Bungee, texto. Confete se for Camaleão ou Lendário.
3. **Vocês vs a startup real:** duas trilhas paralelas com mini cartas das 4 escolhas; as que coincidem com `caminhoReal` ganham um fio dourado ligando as duas.

### F4 — Os Artigos Lado a Lado
As duas CartaArtigo voltam, uma de cada lado. Revelados um por clique:
1. **Veredito:** "Complementares" num carimbo que "bate" na tela, com `vereditoTexto`.
2. **Semelhanças:** 3 itens surgindo entre as cartas, em dourado.
3. **Diferenças:** tabela de 4 linhas; cada célula sai da carta correspondente.
4. **Atributos:** barras horizontais espelhadas (A cresce para a esquerda, B para a direita).
5. **Tema central:** frase grande no centro, com as duas cartas se inclinando uma para a outra.

### F5 — Fusão e Aprendizados
As duas cartas giram em órbita cada vez mais rápido, clarão branco, e surge a **CartaLendaria** "Aprendizados". Os 5 aprendizados aparecem um por clique. Depois, créditos rolando: equipe, referências ABNT, créditos de assets. Confete final.

---

## 7. Sistema visual

### 7.1 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--noite` | `#241E4E` | fundo |
| `--noite-profunda` | `#17123A` | vinheta, sombras |
| `--papel` | `#FFF8E7` | texto, miolo das cartas |
| `--tinta` | `#2B2340` | texto sobre papel |
| `--artigo-a` | `#F86624` | tudo do Artigo A |
| `--artigo-b` | `#2EC4B6` | tudo do Artigo B |
| `--moeda` | `#F9C80E` | semelhanças, Combinar, lendária, estrelas |
| `--planejar` | `#6C8EF5` | carta Planejar |
| `--adaptar` | `#5CC98A` | carta Adaptar |
| `--bricolagem` | `#C08552` | carta Bricolagem |
| `--dano` | `#EA3546` | perdas, alertas |
| `--fosforo` | `#FFB000` | terminal da F0 |
| `--raio-carta` | `20px` | |
| `--sombra-carta` | `0 24px 48px -12px rgb(0 0 0 / .55)` | + uma sombra colorida da cor da carta a 35% |

Fontes: **Bungee** (títulos, números, nomes de carta), **Rubik** 500/700 (texto), **IBM Plex Mono** (só F0). Texto mínimo 24 px; títulos 64–96 px.

### 7.2 Fundo (`Fundo.tsx`)
Gradiente radial de `--noite` para `--noite-profunda` nas bordas, grade de pontos a 6% de opacidade, textura de grão (`ruido.svg`) a 5% e vinheta. Em F2, um brilho suave da cor da carta escolhida invade o fundo por alguns segundos.

### 7.3 Anatomia comum das cartas (`MolduraCarta.tsx`)
Inspirada nos deckbuilders de cartas. Proporção 5:7 (≈ 380×532 px em 1080p; decisões ≈ 240×336).

```
        ╭───╮
        │ 1 │ ← ORBE (topo-esquerdo, sobreposto à borda): letra do artigo,
        ╰───╯   custo de risco da decisão (orbeDecisao) ou emoji do evento
  ┌────╱─────────────────────────┐
  │  ══╡  O MAPA DOS 20 ANOS  ╞══ │ ← FITA do nome, dobrada nas pontas, Bungee
  │  ╭─────────────────────────╮  │
  │  │                         │  │ ← JANELA DE ARTE (formato depende do tipo)
  │  │    ilustração (CenaArte)│  │    com borda dourada fina e sombra interna
  │  │                         │  │
  │  ╰────────────┬────────────╯  │
  │         ┌─────┴─────┐         │ ← PLACA DE TIPO: "Conselheiro", "Decisão",
  │         │◆ Conselheiro│       │    "Evento" ou "Lendária" + gema de raridade
  │         └───────────┘         │
  │   texto da carta em papel     │ ← ÁREA DE TEXTO em pergaminho (--papel),
  │   com palavras-chave em       │    palavras-chave em negrito na cor da carta
  │   **negrito colorido**        │
  └───────────────────────────────┘ ← MOLDURA: textura de pedra/metal na cor da carta,
                                       cantos com rebites dourados
```

- **Janela por tipo** (`tipos` em `artes.ts`): Conselheiro e Lendária = **arco** (topo arredondado); Decisão = **retângulo**; Evento = **ponta** (base em V).
- **Gema de raridade:** comum = prata, rara = azul-cristal, lendária = dourada com brilho animado.
- **Moldura:** gradiente da cor da carta + textura de ruído (`feTurbulence`) a 15% para parecer metal gasto; bevel com duas bordas internas (clara em cima, escura embaixo).
- **Palavras-chave** destacadas no texto: Causation, Effectuation, Bricolagem, Planejar, Adaptar, Combinar.

### 7.4 Arte das cartas (`CenaArte.tsx`)
Cada carta tem uma entrada em `artes.ts`. Se `imagem` existir, usa a imagem; senão, monta a cena em SVG em camadas, de trás para frente:

1. **Céu:** gradiente radial de `cores[0]` (centro, 60%) para `cores[1]` (bordas).
2. **Fundo temático** (`fundos/`): silhuetas em 2 ou 3 planos com opacidades diferentes, dando profundidade.
   - `raios`: raios de luz girando devagar a partir do centro.
   - `mapa`: pergaminho com trilhas pontilhadas e rosa dos ventos.
   - `laboratorio`: prateleiras e frascos em silhueta.
   - `cidade`: skyline em camadas.
   - `colinas`: colinas sobrepostas com caminhos sinuosos.
   - `cosmos`: estrelas e nebulosa suave.
3. **Brilho atrás do ícone:** círculo com `feGaussianBlur` na cor de luz.
4. **Ícone principal** (`icones/`, 55% da janela): preenchido com gradiente claro→cor, **luz de contorno** (stroke claro de um lado), sombra projetada suave e leve flutuação (sobe e desce 4 px em loop).
5. **Partículas** (`particulas/`): 8 a 14 elementos animados subindo ou girando.
6. **Acabamento:** vinheta interna, grão a 8% e um reflexo diagonal sutil.

**Imagens pintadas (opcional, deixa ainda mais bonito):** gerar em qualquer gerador de imagens usando `estiloPrompt + prompt` de cada carta, exportar em webp 800×600 e salvar em `public/assets/arte/<id>.webp`. O `LEIA-ME.md` da pasta lista todos os prompts prontos. Sem as imagens, as cenas SVG já garantem o visual completo.

### 7.5 Tipos de carta
- **CartaArtigo** (Conselheiro): moldura na cor do artigo; orbe com "A" ou "B"; texto com `resumoUmaLinha`, os 3 `numeros` em pílulas e o `poderEspecial` com ⚡. Holo foil que segue o ponteiro (`conic-gradient` + `mix-blend-mode: color-dodge`, opacidade 0.35) e borda com brilho girando (`@property --angulo`).
- **CartaDecisao:** moldura na cor da lógica; orbe com o custo de `orbeDecisao`; texto com `resumo` e a teoria em pílula.
  - Em leque na votação (−8°, 0°, 8°); hover sobe 16 px e aumenta 5%.
  - Escolhida: vai ao centro com `layoutId`, borda dourada pulsante e a arte ganha zoom lento.
  - **Combinar trancada:** arte em `grayscale(.9)` e escurecida, correntes em SVG cruzando a carta, cadeado dourado no centro. Ao desbloquear, o cadeado racha, explode em partículas douradas e a cor volta com um flash.
- **CartaEvento:** janela em ponta; moldura verde-esmeralda (`seSim`) ou `--dano` (`seNao`); orbe com o emoji do evento; efeitos em pílulas (+10 👥). Entra girando 540° e aterrissa com quique.
- **CartaLendaria:** moldura dourada, gema lendária, partículas douradas subindo em volta da carta inteira, holo mais intenso.
- **VersoCarta:** padrão de losangos na cor da carta, monograma "SA" dourado no centro, moldura igual à frente.

### 7.6 Comportamento comum
- **Tilt 3D:** `perspective: 1000px`, até 10° seguindo o ponteiro, volta com spring. A arte da janela se move 6 px no sentido oposto (parallax).
- **Flip:** `rotateY` 180° em 700 ms com spring, som `virar-carta`.
- **Sombra:** `--sombra-carta` + sombra colorida da carta a 35%.

### 7.7 HUD e barras
- **BarraIndicador:** cápsula de 28 px de altura, ícone num círculo à esquerda, número em Bungee à direita, preenchimento com gradiente e brilho interno no topo. Anima com spring. Ganho: brilho verde e número "+10" subindo. Perda: tremor curto e "−10" vermelho caindo.
- **TrilhaEtapas:** 4 nós ligados por uma linha; o nó atual pulsa; os concluídos mostram o ícone da carta escolhida.

### 7.8 Dado3D
Cubo em CSS 3D (6 faces com pips em papel sobre fundo `--moeda`), rola ~1,2 s com rotações aleatórias e para na face sorteada; som `dado`.

### 7.9 BalaoArtigo
Balão estilo HQ, borda de 4 px na cor do artigo, cauda apontando para uma mini carta (60×84) do artigo. Texto aparece com efeito de digitação rápido. Os dois balões entram um de cada lado.

### 7.10 Movimento
- Uma animação marcante por fase; o resto responde a cliques.
- Transição única entre fases: cortina diagonal na cor `--noite-profunda`.
- `prefers-reduced-motion`: trocar tilt, giros e partículas por fades.
- Testar em 1920×1080 e 1366×768.

---

## 8. Motor da rodada (`src/engine/motor.ts`)

Funções **puras**, sem React, testadas com Vitest.

```ts
type Passo = 'situacao' | 'votacao' | 'consequencia' | 'dado' | 'artigos' | 'evento' | 'desbloqueio';

interface EstadoRodada {
  etapa: number;            // 0–3
  passo: Passo;
  ind: Indicadores;
  escolhas: Escolha[];
  ultimoDado?: number;
  ultimoEvento?: { titulo: string; texto: string; efeito: Partial<Indicadores> };
  terminou: boolean;
}

aplicarEfeito(ind, efeito): Indicadores      // soma e limita entre regras.minimo e regras.maximo
escolher(estado, escolha): EstadoRodada      // combinar só se desbloqueado
rolarDado(estado, rng = Math.random): EstadoRodada
resolverEvento(estado): EstadoRodada         // condição usa escolhas e indicadores atuais
proximoPasso(estado): EstadoRodada
pontuacao(ind): { total, estrelas }
```

Ordem por etapa: `situacao → votacao → consequencia → dado → artigos → evento (etapas 0–2) → [desbloqueio antes da etapa 3] → próxima etapa`.

**Testes obrigatórios** (dado fixado em 3, neutro):
- adaptar, adaptar, planejar, combinar → `lendario`, 295 pontos, 3 estrelas.
- adaptar ×4 → `improvisador`, 205 pontos, 2 estrelas; Combinar trancado.
- planejar ×4 → `planejador`, 80 pontos, 1 estrela; nenhuma barra abaixo de 5.
- planejar, planejar, adaptar, adaptar → `invertido`.
- `escolher(..., 'combinar')` sem desbloqueio lança erro.
- Evento da incubadora depende dos indicadores do momento.

---

## 9. Controles do apresentador

- `→`, `Espaço`, `PageDown`: avançar (compatível com passador). `←`, `PageUp`: voltar passo.
- `1` Planejar, `2` Adaptar, `3` Combinar (na votação).
- `M` som, `F` tela cheia, `Shift+R` reinicia a rodada (ensaio).
- Estado salvo em `sessionStorage`.
- O README lista todos os controles.

---

## 10. Iterações

Ao final de cada uma: `npm run build` e `npm test` sem erros, commit, resumo e **pausa para revisão**.

**1 — Esqueleto (~40 min).** Setup, estrutura de pastas completa, tokens, fontes, `Fundo`, navegação, HUD simples e as 6 fases como telas de texto. *Já dá para apresentar.*
Commit: `feat: esqueleto navegável`

**2 — Motor (~45 min).** `motor.ts` + testes + `useRodada`. F2 funcionando sem animações.
Commit: `feat: motor da rodada com testes`

**3 — Cartas e arte (~2h).** Baixar os ícones de game-icons.net listados em `artes.ts` e registrar em `CREDITOS.md`. Criar `MolduraCarta`, `CenaArte` com os 6 fundos e as partículas, `CartaBase` (tilt, parallax, holo, flip) e os tipos `CartaArtigo`, `CartaDecisao`, `CartaEvento`, `CartaLendaria`, `VersoCarta`. Gerar `public/assets/arte/LEIA-ME.md` com os prompts. Criar a rota `/#vitrine` mostrando **todas** as cartas e cenas de `artes.ts` lado a lado, frente e verso, para revisão visual.
Commit: `feat: sistema de cartas com arte`

**4 — Rodada viva (~1h30).** Votação em leque, revelação, barras animadas, Dado3D, balões, selo, eventos, desbloqueio do Combinar.
Commit: `feat: rodada animada`

**5 — Briefing e final (~1h).** F1 completa, F3 com brasão e trilhas, F4 comparativa.
Commit: `feat: briefing, resultado e comparação`

**6 — Polimento e entrega (~1h).** F0, F5 com CartaLendaria e créditos, sons, ilustrações, `CREDITOS.md`, revisão de textos. Ensaiar a apresentação inteira cronometrando os 15 minutos, testar nas duas resoluções, publicar e gerar `entrega/plano-b.pdf`.
Commit: `feat: abertura, fusão, polimento e deploy`

---

## 11. Fora do escopo

- IA, backend, login, qualquer chamada de rede.
- Cronômetros ou contagens regressivas.
- Múltiplas rodadas, placar entre equipes, votação pelo celular.
- Mais etapas ou eventos do que os definidos em `rodada.ts`.
