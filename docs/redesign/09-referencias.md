# 09 — Referências: jogos e programas

O que foi pesquisado e o que cada referência dá ao projeto.

## 1. Jogos

| Jogo | O que aproveitar | Onde entra | Fontes |
|---|---|---|---|
| **Hearthstone** | Mesa física, cartas com peso, anfitrião da taverna (Innkeeper) guiando o tutorial com setas e destaques; revelação de cartas por raridade; animação como *sequenciamento e dramatização*, com várias camadas de feedback | Tema, tutorial, animações, Forja | [Arte dos pacotes (TouchArcade)](https://toucharcade.com/2017/04/04/designing-hearthstone-card-packs-animations-iterations-ungoro-and-more-with-art-director-ben-thompson/) · [Tutorial (wiki)](https://hearthstone.wiki.gg/wiki/Tutorial) · [Onboarding do Hearthstone](https://medium.com/@Derrick_L_Grant/onboarding-hearthstone-9fe6c96ef1b3) · [Análise das animações](https://jboger.substack.com/p/hearthstone) |
| **Reigns** | Decisão binária que mexe em barras; a carta mostra *quais* barras mudam, mas não para que lado. Escolhas simples ganham peso com consequências | Votação entre 2 cartas, pistas nas cartas | [Deep dive de design (Game Developer)](https://www.gamedeveloper.com/design/game-design-deep-dive-creating-an-adaptive-narrative-in-i-reigns-i-) |
| **Balatro** | *Juice*: cartas batendo com tremor de tela, números contando com "tic", inércia das cartas | Dado, contagem, tremor | [Análise de feedback](https://medium.com/@yyh19971004/balatro-design-analysis-visual-packaging-and-interactive-feedback-cc6fa6a65370) · [Guia de juice](https://blakecrosley.com/guides/design/balatro) · [Movimentos recriados (80.lv)](https://80.lv/articles/balatro-s-card-movements-shaders-recreated-in-unity) |
| **Baldur's Gate 3** | Painel de rolagem do d20: CD em destaque no topo, bônus listados embaixo e somados depois da rolagem | Dado do Destino | [Nova interface de dados](https://gamingrespawn.com/features/54148/baldurs-gate-iiis-new-dice-rolling-interface-truly-captures-the-feeling-of-dd-ability-checks/) · [Regras de rolagem](https://bg3.wiki/wiki/Dice_rolls) |
| **Slay the Spire** | Informação telegrafada (o jogador nunca se sente enganado) e hierarquia visual limpa | Leitura do Mapa, HUD | [Dicas de design](https://www.cloudfallstudios.com/blog/2020/11/2/game-design-tips-reverse-engineering-slay-the-spires-decisions) |
| **Inscryption** | Narrador que ensina as regras de dentro do mundo | Taverneiro, narradores | [Leshy (wiki)](https://inscryption.fandom.com/wiki/Leshy) |
| **Darkest Dungeon** | Um narrador de frases curtas e marcantes costura toda a experiência | Voz do Cartógrafo e da Cronista | [Narrador (wiki)](https://darkestdungeon.fandom.com/wiki/Narrator_(Darkest_Dungeon)) · [Contexto narrativo](https://www.matthewmarchitto.com/blog/2024/7/30/darkest-dungeon-and-narrative-context) |
| **Griftlands** | Negociação e persuasão como combate de cartas: prova de que um jogo de cartas funciona sem luta | Decisões de negócio como cartas | [Negociação (wiki)](https://griftlands.fandom.com/wiki/Negotiation) |
| **Marvel Snap** | O momento da revelação da carta como clímax; partidas curtas | Jogada e Forja | [Designing Marvel Snap (GDC)](https://gdcvault.com/play/1029024/Designing-MARVEL-SNAP) |
| **Kahoot / Jackbox** | Lição do que evitar: professores reclamam que o texto projetado é pequeno para o fundo da sala | Visibilidade | [Pedido de fonte maior (Kahoot)](https://support.kahoot.com/hc/en-us/community/posts/360020159194-Can-we-please-allow-the-teacher-to-increase-the-font-size-) |
| **Jogos de Business Model Canvas** | Jogos em sala sobre o Canvas geram conversa e reflexão | Tapeçaria do Canvas | [BMC Game (CBS)](https://teach.cbs.dk/tools-for-teaching/bmc-game/) · [Business Model Game](https://www.businessmodelgame.com/) |

## 2. Programas e técnicas

| Ferramenta | Para quê | Decisão | Fontes |
|---|---|---|---|
| **Framer Motion / Motion** | Molas, `layoutId`, sequências | **Manter** (já instalado). O pacote foi renomeado para `motion` (import `motion/react`); migrar é opcional | [Guia de upgrade](https://motion.dev/docs/react-upgrade-guide) |
| **GSAP** | Linhas do tempo complexas; 100% gratuito desde 2025 | Não usar: uma biblioteca de animação só já basta | [GSAP grátis (CSS-Tricks)](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) |
| **pokemon-cards-css** | Holo realista com gradientes, blend modes e variáveis CSS | **Copiar a técnica** para o holo das cartas raras | [Repositório](https://github.com/simeydotme/pokemon-cards-css) · [Demo](https://poke-holo.simey.me/) |
| **canvas-confetti** vs **tsParticles** | Partículas | **Manter canvas-confetti** (6 kB, já instalado); tsParticles é mais pesado | [Comparação](https://www.pkgpulse.com/guides/canvas-confetti-vs-tsparticles-vs-party-js-celebration-2026) |
| **driver.js**, Shepherd, Intro.js, Reactour | Tours guiados | Componente próprio; driver.js (MIT) como plano B. Shepherd e Intro.js são AGPL | [Comparação](https://inlinemanual.com/blog/driverjs-vs-introjs-vs-shepherdjs-vs-reactour/) · [Benchmark 2026](https://usertourkit.com/blog/react-tour-library-benchmark-2026) |
| **perfect-arrows**, **Rough Notation** | Setas e anotações desenhadas à mão | Inspiração para a seta do tutorial; a curva simples é feita à mão | [perfect-arrows](https://github.com/steveruizok/perfect-arrows) · [Rough Notation](https://roughnotation.com/) |
| **SVG feTurbulence** | Textura de metal, borda irregular, queima de carta | Molduras e descarte | [Codrops](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) · [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap) |
| **React Bits — Balatro** | Fundo animado em espiral no estilo Balatro | Opcional na abertura | [React Bits](https://reactbits.dev/backgrounds/balatro) |
| **Kenney** | Sons e bordas de UI de fantasia, CC0 | Sons | [RPG Audio](https://kenney.nl/assets/rpg-audio) · [Fantasy UI Borders](https://kenney.nl/assets/fantasy-ui-borders) |
| **game-icons.net** | 4.000+ ícones de fantasia, CC BY 3.0 | Sigilos e ícones | [Site](https://game-icons.net/) |
| **incompetech** | Música medieval de Kevin MacLeod, CC BY 4.0 | Música opcional | [Músicas](https://incompetech.com/music/royalty-free/music.html) |
| **Cinzel** e alternativas à Belwe | Fonte de fantasia gratuita | Cinzel nos títulos | [Cinzel (Fontpair)](https://fontpair.co/fonts/google/cinzel) · [Alternativas à Belwe (Typewolf)](https://www.typewolf.com/belwe-mono) |
