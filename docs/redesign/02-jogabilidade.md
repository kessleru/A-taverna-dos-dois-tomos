# 02 — Jogabilidade

## 1. Princípio

A regra muda pouco; a experiência muda muito. O motor atual continua: **4 etapas**, votação entre **2 cartas** (Planejar × Adaptar), **Combinar** destravável na última etapa, **3 eventos**, indicadores entre 5 e 100, sem game over. A turma decide **uma coisa por etapa, levantando a mão**. Todo o resto acontece sozinho depois do voto.

O que entra:

| Mudança | Por que deixa mais divertido | Custo |
|---|---|---|
| **Leitura do Mapa** antes do voto (3 etiquetas: micro, meso, macro) | Dá assunto para a discussão e ensina a matriz do Artigo A | Só texto nos dados |
| **Pistas nas cartas** (quais indicadores a carta mexe, sem sinal nem valor) | Tensão: "essa mexe no Caixa... ganha ou gasta?" (Reigns) | Derivado do efeito, sem dado novo |
| **d20 com bônus do contexto** no lugar do d6 | A escolha certa fica provável, não garantida; o bônus mostra *por que* | Pequena mudança no motor |
| **Crônica** com os dois narradores e citação real | O momento "aha": o que a startup real fez | Texto nos dados |
| **Canvas que se acende** na consequência | Mostra o "Canvas em movimento" do Artigo B | Um campo novo no estado |
| **Forja do Combinar** (animação lendária) | Recompensa visível | Só animação; a regra de desbloqueio é a atual |
| **Rank da guilda** e título | Final com cara de conquista | Renomear estrelas e perfis |

---

## 2. O loop de cada etapa

```
desafio → votação → dado → consequência → crônica → evento (etapas 1–3) → [forja antes da etapa 4]
```

Única mudança de ordem em relação a hoje: o **dado vem antes da consequência**, porque agora ele decide quanto a carta rende.

| Passo | Tempo | O que acontece |
|---|---|---|
| **Desafio** | 20 s | A carta de Desafio cai na mesa. O Grimório digita fase e ano. O apresentador lê a situação |
| **Votação** | 45 s | As 2 cartas saem do baralho para a mão, grandes e numeradas (1 e 2). As 3 etiquetas da Leitura do Mapa viram uma a uma. A pergunta aparece grande. *"Quem vai de Planejar? Quem vai de Adaptar?"* O apresentador clica na vencedora ou tecla `1`/`2` (`3` para Combinar na etapa 4) |
| **Dado** | 15 s | A carta voa e bate no Desafio. Painel do d20: CD no topo, bônus do contexto embaixo. `→` rola, o dado quica, soma, e aparece a faixa |
| **Consequência** | 15 s | Os orbes mudam com números grandes. Os blocos do Canvas tocados pela carta se acendem na cor da lógica |
| **Crônica** | 30 s | A Cronista (Artigo B) conta o que a Healthy Skin fez; o Cartógrafo (Artigo A) diz o que a literatura mostra. Selo "Como na história real" ou "A Healthy Skin fez diferente" |
| **Evento** | 20 s | Carta do Destino vira; o desfecho depende do que a guilda fez |
| **Forja** | 20 s | Antes da etapa 4: se destravou, Planejar e Adaptar se fundem na lendária Combinar; senão, a Combinar treme acorrentada |

Qualquer `→` durante uma animação pula para o estado final.

---

## 3. Leitura do Mapa

Três etiquetas grandes, uma por nível da matriz do Artigo A. Cada uma tem uma frase curta e mostra ▲ ou ▼ sobre o sigilo das cartas da votação. Textos por etapa em [03](03-historia.md).

- **MICRO — quem decide**
- **MESO — a fase da empresa**
- **MACRO — o contexto**

A soma das setas de cada carta é o **bônus do contexto** no dado (▲ = +1, ▼ = −1).

## 4. Dado do Destino (d20)

```
total = d20 + bônus do contexto        CD = 11 em todas as etapas
```

| Faixa | Condição | Efeito da carta |
|---|---|---|
| **Crítico** | d20 = 20 ou total ≥ 19 | ganhos ×1,5 |
| **Sucesso** | total ≥ 11 | efeito normal |
| **Falha** | total < 11 | ganhos ×0,5 (perdas iguais) |

Com bônus +4, a carta certa dá sucesso em 70% dos lançamentos. Com bônus −3, só em 35%. A Combinar ganha +2 fixo de "Experiência" (Artigo A: quem já viveu as duas lógicas sabe combiná-las).

`Shift+1`, `Shift+2` e `Shift+3` forçam falha, sucesso ou crítico no próximo dado, para o ensaio e para emergências.

## 5. Pistas nas cartas

No rodapé da carta, os ícones dos indicadores que o efeito mexe (💰 👥 🔥, só os diferentes de zero), sem sinal nem valor. Vem direto de `opcao.efeito`.

## 6. Canvas que se acende

Cada opção ganha `blocos` (quais dos 9 blocos do Business Model Canvas ela toca). Na consequência, esses blocos se acendem na cor da carta num Canvas pequeno no canto da mesa. Um bloco tocado por lógicas diferentes em etapas diferentes fica listrado: é o "Canvas em movimento". No Resultado, o Canvas da turma aparece ao lado do real da Healthy Skin (`canvasReal` nos dados, tirado da Tabela 4 do Artigo B). **Não tem regra**: é só visual e didático.

## 7. Eventos (Cartas do Destino)

Continuam 3. Um ajuste de cronologia: hoje a pandemia (2020) aparece antes dos anjos (2019). O evento 2 passa a ser um fato real dos primeiros anos, e a pandemia vira fato da Crônica da etapa 4, onde a Limonada é explicada.

| Depois da etapa | Evento | Favorável se | Favorável | Desfavorável |
|---|---|---|---|---|
| 1 | Quem vocês conhecem? | Adaptou na etapa 1 | Colcha de Retalhos: hospitais testam os protótipos (+10 👥, +5 🔥) | Plano pronto, porta fechada (−5 👥, −5 🔥) |
| 2 | Quem vai fabricar? (novo) | Adaptou na etapa 1 (a rede de contatos das fundadoras) | Perda Aceitável: um fabricante conhecido produz lotes pequenos, sem comprar máquinas (+10 💰) | Máquinas caras demais (−10 💰, −5 🔥) |
| 3 | A incubadora abriu vagas (atual) | Caixa ≥ 50 e Moral ≥ 60 | Portas abertas (+10 👥, +5 🔥) | Não foi dessa vez (−5 🔥) |

## 8. Resultado

- As estrelas viram **rank da guilda**: 1 ★ Aprendiz, 2 ★ Mestre, 3 ★ Grão-Mestre (limiares atuais: 160 e 230, reajustar depois do d20).
- Os perfis continuam, com nomes no tema: Camaleão Lendário, Camaleão, Surfista do Improviso, **Arquiteto de Pergaminhos**, Caminho Invertido, Equilibrista.
- Mostra também quantas escolhas bateram com a história real (0 a 4).

## 9. Controles

Continuam os atuais (`→`, `←`, `1`–`3`, `M`, `F`, `Shift+R`). Entram:

| Tecla | Ação |
|---|---|
| `Z` | Ampliar a carta em foco; `Esc` fecha ([04](04-visibilidade.md)) |
| `T` | Abrir ou fechar o tutorial ([05](05-tutorial.md)) |
| `Shift+1`–`3` | Forçar a faixa do próximo dado |

## 10. Mudanças no código

- `src/data/rodada.ts`: `leitura` (micro, meso, macro com setas por carta) e `blocos` em cada opção de cada etapa; `canvasReal`; `cronica` (fato + citação) por etapa; evento 2 novo ("Quem vai fabricar?") e pandemia movida para a Crônica da etapa 4; `dadoDaIncerteza` vira `dadoDoDestino` (CD e multiplicadores); ranks e nomes de perfil.
- `src/engine/motor.ts`: `escolher` passa a levar para `'dado'` sem aplicar efeito; `rolarDado(estado, rng)` calcula d20, bônus e faixa e aplica o efeito ajustado, depois vai para `'consequencia'`; novo campo `canvas`; `forcarFaixa`. `'desbloqueio'` vira `'forja'`.
- `src/engine/motor.test.ts`: os testes atuais passam a forçar a faixa "sucesso", com os mesmos caminhos e perfis esperados; novos testes para as três faixas, o bônus da Combinar e o acúmulo do Canvas.
