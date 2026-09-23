# 03 — História

## 1. Premissa

É a **história real da Healthy Skin** (pseudônimo usado no Artigo B), contada numa taverna. A turma é a guilda das três fundadoras. Dois narradores sentam à mesa com seus tomos e comentam cada decisão: um conhece o padrão de 38 histórias, a outra conhece de perto esta história. O efeito que queremos é o de um *podcast à beira da lareira*: a turma decide, e logo em seguida descobre o que aconteceu de verdade e o que a pesquisa diz.

Regras de tom:
- **Fatos reais, voz de taverna.** A fantasia está no jeito de falar e no visual, nunca nos fatos. Nada de doenças ou tratamentos inventados: pacientes com câncer, quimioterapia e radioterapia aparecem com respeito e com os nomes reais.
- **Frases curtas.** Situação com até 35 palavras, opção de carta com até 14, fala de narrador com até 40. Tudo precisa caber grande na tela.
- **Citações das fundadoras** são tradução livre do Artigo B (o artigo está em inglês) e aparecem entre aspas, com "Fundadora 1/2/3".

---

## 2. As vozes

| Voz | Quem é | Como fala | Visual |
|---|---|---|---|
| **O Cartógrafo** (Tomo A) | Kogut, Mello e Skorupski (2023). "Percorri 38 crônicas escritas entre 2001 e 2022." | Em padrões: "Nos meus mapas...", "Em 17 de 19 crônicas...". Nunca fala de uma empresa só | Retrato âmbar (arte atual `artigo-A`), balão com borda `--tomo-a` |
| **A Cronista** (Tomo B) | Costa, Nelson e Pedroso (2025). "Acompanhei uma única guilda, de 2016 a 2024, e ouvi suas fundadoras por 270 minutos." | Em fatos e citações: "Em 2019...", "Ela me contou...". Nunca generaliza | Retrato turquesa, balão com borda `--tomo-b` |
| **O Grimório** | O livro de registros | Frases curtas e neutras, escritas a pena: "Moral −10." | Página de pergaminho com marcador vermelho ([01](01-tema-e-hud.md) §5) |
| **O Taverneiro** | Anfitrião do tutorial | Caloroso e breve, como o Innkeeper do Hearthstone: "Puxem uma cadeira!" | Retrato próprio, só no tutorial |

---

## 3. F0 — Abertura

O Grimório se abre na tela escura e a pena escreve:

```
Abrindo as portas da taverna...
Tomo A: 38 estudos em 21 anos.
Tomo B: uma startup, 8 anos.
Dois caminhos: planejar ou improvisar.
Acendendo as velas.
```

As velas acendem, brasas sobem, e surge o título **A Taverna dos Dois Tomos** em Cinzel dourado. Botão **Entrar na taverna** (destrava o áudio).

---

## 4. F1 — A Taverna

Quatro telas, avançando com `→`. Conteúdo base: `briefing` em `rodada.ts`, com textos novos.

1. **A missão.** *"Sentem-se, fundadoras. Esta noite vocês vão reviver uma história real: a de uma farmacêutica que viu pacientes com câncer interromperem a quimioterapia por causa de feridas na pele, e decidiu criar um produto para isso."*
2. **Os Dois Tomos.** As cartas dos tomos entram viradas e giram uma por vez, quando o membro da equipe que apresenta cada artigo clica. Cada narrador se apresenta em um balão:
   - **Cartógrafo:** *"Eu não conheço a sua história. Conheço 38 outras. Li tudo o que se escreveu em 21 anos sobre quando as empresas planejam e quando improvisam. Trago um mapa: a Matriz dos 3 Níveis."*
   - **Cronista:** *"Eu conheço uma história só, e de perto. Segui esta guilda da primeira ideia até hoje, peça por peça do seu modelo de negócio. Trago o Canvas em Movimento."*
   - O Grimório mostra os números de cada tomo (os `numeros` de `conteudo.ts`).
   - Clicar de novo numa carta aberta **amplia** a carta e mostra `estrategia` e `solucao`, para o membro que apresenta o artigo.
3. **Os jeitos de decidir.** As cartas Planejar, Adaptar e Bricolagem em leque, e a Combinar acorrentada. *"Toda decisão vai ser entre duas cartas. A terceira... vocês vão ter que forjar."*
4. **Como funciona.** Cinco regras curtas com ícones (texto atual de `briefing.regras`, ajustado para o d20 e a Leitura do Mapa).

---

## 5. F2 — A Crônica, etapa por etapa

Cada etapa tem os campos: `situacao`, `perguntaParaTurma`, as duas opções (e a Combinar na etapa 4), `leitura` (micro, meso, macro com setas por carta), `cronica` (Cronista + citação), `tomoA` (fala do Cartógrafo) e `blocos` de cada opção. As opções e efeitos continuam os atuais de `rodada.ts`.

### Etapa 1 — Fundação (2016) · "A ideia foi recusada"

- **Situação (atual):** Você propôs o produto na farmacêutica onde trabalha. A empresa recusou sem nem pedir um plano de negócios.
- **Pergunta:** Vocês largariam o emprego sem um plano no papel?
- **Cartas:** Planejar — pesquisa de mercado e plano completo antes de sair [segmentos, custos]. Adaptar — chamar duas colegas de confiança e começar com o que já sabem [parcerias, recursos, proposta].
- **Leitura do Mapa:**

| Nível | Texto | Planejar | Adaptar |
|---|---|---|---|
| Micro | "Anos de indústria farmacêutica e cosmética, e colegas de confiança" | ▲ | ▲▲ |
| Meso | "A empresa ainda nem existe" | ▼ | ▲ |
| Macro | "Não existe produto parecido no mercado" | ▼▼ | ▲ |

- **Crônica (Cronista):** *"A empregadora recusou. Ela não desistiu: chamou duas colegas que conhecia havia anos, uma de P&D farmacêutico e outra de cosméticos naturais. Três carreiras recombinadas numa empresa. Eu chamo isso de bricolagem: fazer com o que está à mão."*
- **Citação (Fundadora 1):** *"Fiquei feliz quando ela entrou comigo, porque conhece os processos e tem relação com fabricantes com quem podemos fazer parceria."*
- **Cartógrafo:** *"Curioso. Nos meus mapas, quem vem de grandes empresas costuma começar planejando."* **Cronista:** *"Pois é. A experiência corporativa delas não as empurrou para o planejamento."* (Artigo B: a exposição ao pensamento corporativo não as predispôs à causation.) Esse é o primeiro contraste entre os artigos, e vale o apresentador destacar.
- **Carta real:** Adaptar, com a etiqueta **Bricolagem**.

### Etapa 2 — Primeiros anos · "Remédio ou cosmético?"

- **Situação (atual):** O produto funciona. Registrar como medicamento leva anos e custa caro. Como cosmético é mais simples, mas ainda exige estudos.
- **Pergunta:** Vale a pena esperar anos pelo caminho "certo"?
- **Cartas:** Planejar — registrar como medicamento [atividades, custos]. Adaptar — registrar como cosmético e publicar estudos clínicos mesmo assim [atividades, canais, parcerias].
- **Leitura do Mapa:**

| Nível | Texto | Planejar | Adaptar |
|---|---|---|---|
| Micro | "Vocês conhecem pacientes e médicos de perto" | — | ▲ |
| Meso | "Empresa pequena, pagando com recursos próprios e um empréstimo" | ▼ | ▲ |
| Macro | "Registrar como remédio leva anos e custa caro" | ▼▼ | ▲▲ |

- **Crônica:** *"Registraram como cosmético Classe 2 na Anvisa, mais rápido e barato. Mas fizeram estudos clínicos e publicaram artigos, para ganhar a confiança dos médicos. E testaram protótipos com pacientes de hospitais parceiros, em ciclos rápidos, até chegar à fórmula."*
- **Citação (Fundadora 2):** *"Decidimos primeiro desenvolver um cosmético Classe 2. Também precisamos de estudos clínicos, mas é mais simples do que o exigido para medicamentos."*
- **Cartógrafo:** *"Em mercados complexos e incertos, planejar sozinho não é recomendado."*
- **Carta real:** Adaptar.

### Etapa 3 — Investidores anjo (2019) · "Os investidores chegaram"

- **Situação (atual):** Deu certo! Seis investidores anjo colocaram dinheiro na startup e querem saber para onde ele vai.
- **Pergunta:** O jeito que funcionou até aqui ainda serve com investidores olhando?
- **Cartas:** Planejar — conselho, metas, relatórios e reuniões regulares [atividades, custos, relacionamento]. Adaptar — continuar no improviso [atividades].
- **Leitura do Mapa:**

| Nível | Texto | Planejar | Adaptar |
|---|---|---|---|
| Micro | "Três anos de estrada: vocês já sabem improvisar" | — | ▲ |
| Meso | "A empresa cresce com dinheiro de terceiros" | ▲▲ | ▼ |
| Macro | "Seis investidores querem previsões e relatórios" | ▲▲ | ▼▼ |

- **Crônica:** *"Com os anjos veio um conselho. Reuniões regulares, relatórios, planos discutidos com todos. Mas elas continuaram decidindo com base em testes e ouvindo pacientes e equipe."*
- **Cartógrafo:** *"Quando a empresa cresce, investidores e reguladores pedem planejamento. É a hora da causation."*
- **Carta real:** Planejar.
- **Gancho da Forja:** se a turma adaptou antes e planejou agora, o Cartógrafo fecha: *"Vocês já improvisaram e já planejaram. Poucos chegam aqui com as duas lógicas nas mãos."*

### Etapa 4 — Anos recentes · "Um mercado novo apareceu"

- **Situação (atual, com um acréscimo):** Incubada no hospital e tendo atravessado a pandemia, a empresa descobre que o produto também ajuda em outras doenças de pele. Mas o mercado é mais caro: cerca de 12 mil dermatologistas, contra 3 mil oncologistas.
- **Pergunta:** Dá para arriscar e ter segurança ao mesmo tempo?
- **Cartas:** Planejar — equipe de vendas própria com plano nacional [canais, relacionamento, custos]. Adaptar — entrar aos poucos, testando com médicos conhecidos [canais, relacionamento]. Combinar (se forjada) — licenciar como marca branca para farmacêuticas, com royalties e estudos planejados [parcerias, canais, receitas].
- **Leitura do Mapa:**

| Nível | Texto | Planejar | Adaptar | Combinar |
|---|---|---|---|---|
| Micro | "Vocês já planejaram e já improvisaram" | — | — | ▲ |
| Meso | "Empresa estabelecida, com só 2% do mercado" | ▲ | — | ▲ |
| Macro | "Mercado quatro vezes maior e caro de alcançar" | ▼▼ | ▲ | ▲ |

- **Crônica:** *"Incubadas na Eretz.bio, do Hospital Albert Einstein, e com apoio do PIPE Fapesp. Na pandemia, abriram televendas e WhatsApp: um imprevisto virou canal, a Limonada. Quando uma investidora sugeriu outro mercado, elas acharam a distribuição cara demais. Escolheram licenciar como marca branca para farmacêuticas e receber royalties."*
- **Citação (Fundadora 1):** *"Uma das nossas investidoras-anjo sugeriu que entrássemos nesse outro mercado. Mas, para nós, o investimento em distribuição seria alto demais neste momento."*
- **Cartógrafo:** *"Empreendedores experientes combinam as duas lógicas conforme a decisão. Mas combinar exige experiência."*
- **Fecho do Grimório:** "Maio de 2024: mais de 50.000 pacientes, cerca de 1.000 médicos e enfermeiros visitados por mês, 2% do mercado potencial."
- **Carta real:** Combinar.

### Eventos (Cartas do Destino)

| Evento | Favorável | Desfavorável | Conceito no rodapé |
|---|---|---|---|
| 1. Quem vocês conhecem? | **Colcha de Retalhos!** Um hospital conhecido topou testar os protótipos com pacientes. | **Plano pronto, porta fechada.** O plano ficou lindo, mas nenhum hospital conhece vocês. | Parcerias como colcha de retalhos (A). A startup real testou com hospitais parceiros (B). |
| 2. Quem vai fabricar? | **Perda Aceitável!** Uma das fundadoras conhecia um fabricante que produz lotes pequenos. Nada de comprar máquinas. | **Máquinas caras demais.** Sem contatos na indústria, só sobrou montar uma fábrica. | Arrisque só o que pode perder (A). A Healthy Skin terceiriza a produção até hoje (B). |
| 3. A incubadora abriu vagas | **Portas abertas.** Vocês entraram na incubadora de um grande hospital. | **Não foi dessa vez.** Com caixa ou moral baixos, a incubadora preferiu outra startup. | A startup real foi incubada na Eretz.bio, do Hospital Albert Einstein (B). |

Citação do evento 2 (Fundadora 2): *"É difícil uma startup investir em todo o equipamento para produzir com a qualidade e a flexibilidade de que precisávamos. Encontramos um parceiro que faz isso em pequenas quantidades."*

---

## 6. F3 — Resultado

- O Grimório soma: "Caixa + Clientes + Moral = 245", e o **rank** é forjado como uma medalha (Aprendiz, Mestre, Grão-Mestre).
- O **título** aparece num estandarte, com o texto do perfil.
- **Vocês × a Healthy Skin:** duas trilhas de 4 cartas; um fio de ouro liga as escolhas iguais.
- **Tapeçaria da turma × Tapeçaria real**, lado a lado. A Cronista: *"Os blocos não nasceram juntos, nem seguiram a mesma lógica. É isso que eu chamo de Canvas em movimento."*

`canvasReal`, conferido com a **Tabela 4 do Artigo B** (p. 6). A tabela marca, para cada bloco e cada fase, causation (C), effectuation (E) e bricolagem (B) com ✓✓ (forte), ✓ (presente) ou ✕. Ela tem 5 fases e o jogo tem 4 etapas: a etapa 4 usa a coluna "Recent years" (a "Incubation" fica de fora; é quase igual).

Transcrição (só as marcas diferentes de ✕):

| Bloco | Até a fundação | Primeiros anos | Investidores anjo | Incubação | Anos recentes |
|---|---|---|---|---|---|
| Proposta de valor | B✓✓ | C✓ E✓✓ B✓ | C✓ E✓✓ B✓ | C✓ E✓✓ | C✓ E✓✓ |
| Recursos-chave | B✓✓ | E✓✓ B✓ | E✓✓ B✓ | C✓ E✓✓ | C✓ E✓✓ |
| Atividades-chave | B✓✓ | E✓✓ B✓ | **C✓✓** E✓✓ | C✓ E✓✓ | **C✓✓** E✓✓ |
| Parcerias-chave | B✓✓ | E✓✓ B✓ | C✓ E✓✓ | **C✓✓** E✓✓ | **C✓✓** E✓✓ |
| Segmentos de clientes | B✓ | C✓ E✓✓ | C✓ E✓ | C✓ E✓✓ | C✓ E✓✓ |
| Canais | — | E✓✓ | C✓ E✓✓ | C✓ E✓✓ | **C✓✓** E✓✓ |
| Relacionamento | B✓ | E✓✓ | E✓✓ | C✓ E✓✓ | C✓ E✓✓ |
| Receitas | — | E✓ | E✓ | C✓ E✓ | C✓ E✓ |
| Custos | — | E✓✓ | E✓✓ | C✓ E✓✓ | C✓ E✓✓ |

Regra para a Tapeçaria real: o bloco acende na cor de cada lógica marcada com ✓✓; com duas lógicas ✓✓, fica listrado. Resultado:

| Etapa | Tapeçaria real |
|---|---|
| Fundação | Proposta, Recursos, Atividades e Parcerias em **bricolagem**; o resto apagado |
| Primeiros anos | Tudo em **effectuation**, menos Receitas (só ✓) |
| Investidores | Tudo em **effectuation**, menos Segmentos e Receitas; Atividades **listrada** (causation + effectuation: conselho e relatórios) |
| Anos recentes | Tudo em **effectuation**, menos Receitas; Atividades, Parcerias e Canais **listrados** (causation + effectuation) |

Isso corrige a versão anterior desta seção, tirada só do texto do artigo: a effectuation domina todas as fases depois da fundação, e a causation nunca aparece sozinha, sempre somada a ela. Vale a Cronista dizer isso no Resultado.

Os `blocos` de cada opção das cartas (seção 5) continuam sendo escolha nossa, não da tabela: dizem o que *aquela decisão* mexeria no Canvas.

---

## 7. F4 — Confronto dos Tomos

Os dois tomos abrem frente a frente. Conteúdo atual de `comparacao` e `conteudo`, um item por `→`:
1. **Veredito:** selo de cera "COMPLEMENTARES" batendo na tela, com `vereditoTexto`.
2. **Semelhanças:** três fios dourados ligando os tomos, um por semelhança.
3. **Diferenças:** quatro linhas; cada lado sai do seu tomo (olhar, lógicas, solução, alerta).
4. **Atributos:** as gemas dos cantos das cartas crescem em barras espelhadas (Abrangência, Profundidade, Aplicabilidade, Originalidade, Arsenal).
5. **A proposição do Tomo B:** *"O que está à mão na fundação vira quem você é."* A Cronista lembra a etapa 1: as três carreiras viraram a identidade da empresa, que dá estabilidade, mas pode travar a proposta de valor.
6. **Tema central:** frase grande no centro, com os dois tomos se inclinando um para o outro.

---

## 8. F5 — Fusão e Aprendizados

Os tomos giram em órbita, cada vez mais rápido, clarão, e nasce a lendária **Aprendizados**. Os 5 `aprendizados` aparecem um por `→`, escritos a pena, com a tinta brilhando em ouro. O Taverneiro fecha: *"A lenda continua. Obrigado por puxarem uma cadeira."* Depois, os créditos sobem como um pergaminho: equipe, referências ABNT, créditos de arte e som.

---

## 9. Mudanças no código

- `src/data/rodada.ts`: `leitura`, `cronica`, `tomoA` e `blocos` por etapa; eventos com o novo evento 2; `canvasReal`; textos do briefing.
- `src/data/conteudo.ts`: `narradores` (nome, retrato, apresentação); citações das fundadoras; texto da proposição do Tomo B.
- Componentes: `BalaoNarrador` (substitui `BalaoArtigo`, com retrato e digitação), `Cronica` (substitui o passo "artigos"), `SeloRealidade` como selo de cera.
