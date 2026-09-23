# 11 — Ensaio e dia da apresentação

Roteiro para ensaiar com cronômetro e checklist para a sala. Os tempos vêm do [00](00-visao-geral.md) §4 (~21 min, folga de ~3 min dentro dos 25).

## 1. Antes de sair de casa

- [ ] Abrir a URL publicada (Vercel) no notebook que vai para a sala e deixar carregar até o fim uma vez, com internet boa. A tela de carregamento só libera o jogo depois de baixar imagens, fontes e sons.
- [ ] Levar o projeto também rodando local (`npm run build && npm run preview`), caso a rede da sala falhe.
- [ ] Preencher os `PREENCHER` (equipe em `src/data/conteudo.ts`, créditos em `public/assets/CREDITOS.md` e `public/sfx/CREDITOS.md`). A tela de créditos da F5 mostra o nome da equipe.
- [ ] Carregador do notebook e adaptador HDMI.

## 2. Na sala, antes de começar (5 min)

- [ ] Ligar o projetor e espelhar a tela (não estender), resolução 1920×1080 se der; 1366×768 também funciona, o palco escala inteiro.
- [ ] `F` para tela cheia. Conferir que nada ficou cortado nas bordas.
- [ ] Clicar em **Entrar na taverna** uma vez para destravar o som, conferir o volume da sala com a música e voltar com `←`, ou recarregar (`F5`): o progresso fica salvo na aba.
- [ ] Alguém no fundo da sala lê a pergunta de uma votação e os números dos orbes (critério do [04](04-visibilidade.md) §4).
- [ ] Se a luz da sala estiver forte, apagar as luzes da frente: o tema é escuro.
- [ ] `Shift+R` antes de começar, para zerar qualquer rodada de teste.

## 3. Roteiro cronometrado

| Marca | Fase | Quem fala | O que fazer |
|---|---|---|---|
| 0:00 | F0 Abertura | Apresentador 1 | Deixar o Grimório escrever; clicar em **Entrar na taverna** (a música entra aqui) |
| 0:45 | F1 A Taverna, 4 folhas | Apresentador 1 | Missão → os dois tomos (clicar em cada um, `1`/`2`) → as cartas de decisão → como funciona |
| 3:45 | F2 etapa 1 + tutorial | Apresentador 2 | O Taverneiro apresenta cada peça na primeira vez; `→` avança os balões. Turma vota levantando a mão, `1`/`2` escolhe |
| 5:15 | F2 etapas 2 a 4 | Apresentadores 2 e 3 | ~2:15 por etapa: desafio → votação → dado → consequência → Crônica → evento/forja |
| 12:45 | F3 Resultado | Apresentador 3 | Ler o rank e o título; comparar as duas Tapeçarias |
| 14:45 | F4 Confronto dos Tomos, 6 folhas | Apresentador 4 | Veredito, semelhanças, diferenças, atributos, a frase do Tomo B, tema central |
| 17:45 | F5 Aprendizados | Apresentador 4 | Um aprendizado por `→`; na última folha, os créditos e a despedida do Taverneiro |
| 19:15 | Perguntas | Todos | Folga até os 25 min |

Se o tempo apertar: pular o tutorial pelo link **Pular o tutorial** (o `Esc` também pula, mas em tela cheia o navegador sai dela junto), e na F2 não ler a Crônica inteira em voz alta (a turma lê).

## 4. Emergências

| Aconteceu | Fazer |
|---|---|
| Sem som | Conferir o botão de som no canto do HUD ou `M`; clicar na tela uma vez (o navegador só libera áudio depois de um clique) |
| O dado deu um resultado que atrapalha o roteiro | `Shift+1` / `Shift+2` / `Shift+3` antes de rolar forçam falha / sucesso / crítico. Aparece um aviso no Grimório |
| Rodada bagunçada no ensaio | `Shift+R` reinicia a rodada |
| Recarregou a página sem querer | O jogo volta para a mesma fase e folha (fica salvo na aba) |
| Internet caiu antes de carregar | Usar a versão local (`npm run preview`) |

## 5. Ensaio

- Ensaiar pelo menos uma vez inteira com cronômetro, no notebook da apresentação, anotando a marca real de cada fase na tabela acima.
- Ensaiar com o som ligado: as falas do Taverneiro tomam alguns segundos em cada passo, e é melhor não falar por cima.
- Combinar quem clica. O apresentador que está falando não precisa ser o que clica.
