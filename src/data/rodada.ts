// src/data/rodada.ts
// Mecânica de UMA rodada, jogada uma vez com a turma (~7 min dentro de 15 min de apresentação).
// Cada decisão aplica os dois artigos ao mesmo tempo:
//   Artigo A (a teoria, 38 estudos) + Artigo B (a prática, a startup real).

import type { Indicadores } from './conteudo';

export type Escolha = 'planejar' | 'adaptar' | 'combinar';

// ─────────────────────────────────────────────────────────────
// BRIEFING — "Como jogar em 60 segundos" (F1, 4 telas)
// ─────────────────────────────────────────────────────────────
export const briefing = {
  // Folha 1 do quadro de missões (docs/redesign/03-historia.md §4 e 10-briefing-quadro.md §4).
  missao: {
    titulo: 'Vocês agora são fundadoras de uma startup',
    texto: 'Sentem-se, fundadoras. Esta noite vocês vão reviver uma história real: a de uma farmacêutica que viu pacientes com câncer interromperem a quimioterapia por causa de feridas na pele, e decidiu criar um produto para isso.',
    notas: [
      { titulo: 'Quando', texto: '2016, no Brasil' },
      { titulo: 'A guilda', texto: 'Vocês, as três fundadoras' },
      { titulo: 'A fonte', texto: 'Artigo B. "Healthy Skin" é o nome que o artigo dá à startup real.' },
    ],
  },
  // Folha 2: cada narrador se apresenta quando sua carta vira (03-historia.md §4).
  tomos: {
    titulo: 'Os Dois Tomos',
    dica: 'Clique numa carta para abrir o tomo. Clique de novo para ver a estratégia e a solução.',
    narradores: {
      A: {
        nome: 'O Cartógrafo',
        autores: 'Kogut, Mello e Skorupski, 2023',
        fala: 'Eu não conheço a sua história. Conheço 38 outras. Li tudo o que se escreveu em 21 anos sobre quando as empresas planejam e quando improvisam. Trago um mapa: a Matriz dos 3 Níveis.',
      },
      B: {
        nome: 'A Cronista',
        autores: 'Costa, Nelson e Pedroso, 2025',
        fala: 'Eu conheço uma história só, e de perto. Segui esta guilda da primeira ideia até hoje, peça por peça do seu modelo de negócio. Trago o Canvas em Movimento.',
      },
    },
  },
  conselheiros: {
    titulo: 'Dois conselheiros vão ajudar vocês',
    A: 'O Mapa: revisou 38 estudos em 20 anos e sabe o que costuma funcionar.',
    B: 'O Caso: acompanhou a startup real de perto e sabe o que aconteceu de verdade.',
  },
  jeitosDeDecidir: {
    titulo: 'Existem jeitos diferentes de decidir',
    // Folha 3 do briefing (03-historia.md §4).
    fala: 'Toda decisão vai ser entre duas cartas. A terceira... vocês vão ter que forjar.',
    cartas: [
      { id: 'planejar', icone: '📋', nome: 'Planejar', teoria: 'Causation', resumo: 'Defina a meta, estude o mercado, faça o plano e execute.' },
      { id: 'adaptar', icone: '🧭', nome: 'Adaptar', teoria: 'Effectuation', resumo: 'Comece pelo que você tem, arrisque só o que pode perder e faça parcerias.' },
      { id: 'bricolagem', icone: '🔧', nome: 'Bricolagem', teoria: 'Bricolage', resumo: 'Faça com o que está à mão. Fica escondida no Adaptar da fundação.' },
      { id: 'combinar', icone: '🔒', nome: 'Combinar', teoria: 'Carta secreta', resumo: 'Trancada. Descubram como forjá-la durante o jogo.' },
    ],
  },
  // Folha 4: cada regra com seus ícones (src/assets/icones/).
  regras: {
    titulo: 'Como funciona',
    itens: [
      { texto: '4 decisões, da fundação até a empresa crescer.', icones: ['scroll-quill'] },
      { texto: 'Em cada uma, a turma discute rapidinho e vota levantando a mão.', icones: ['flying-flag'] },
      { texto: 'Três marcadores mostram a saúde da startup: Caixa, Clientes e Moral.', icones: ['shiny-purse', 'flying-flag', 'flamer'] },
      { texto: 'Depois de cada voto, o Dado do Destino (d20) decide quanto a carta rende; o contexto dá bônus.', icones: ['dice-twenty-faces-one'] },
      { texto: 'No final, vocês descobrem o perfil empreendedor da turma.', icones: ['wax-seal'] },
    ],
    taverneiro: {
      fala: 'Puxem uma cadeira, fundadoras!',
      legenda: 'O Taverneiro, seu anfitrião',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// ETAPAS — a jornada segue o ciclo de vida descrito nos dois artigos
// ─────────────────────────────────────────────────────────────
// Blocos do Business Model Canvas (a "Tapeçaria da Guilda", 02-jogabilidade.md §6).
export type Bloco =
  | 'parcerias'
  | 'atividades'
  | 'recursos'
  | 'proposta'
  | 'relacionamento'
  | 'canais'
  | 'segmentos'
  | 'custos'
  | 'receitas';

// Lógica de cada decisão; a bricolagem aparece na fundação real e nos tomos.
export type Logica = Escolha | 'bricolagem';

// A Bricolagem é uma carta escondida dentro do Adaptar (Artigo B, Tabela 4):
// na fundação, quem começa pelo que já tem à mão a descobre. Ela devolve o
// caixa que o Adaptar custou e pinta a Tapeçaria da turma com a cor dela, como
// na Tapeçaria real. Quem planeja vê a carta que a Healthy Skin jogou ali.
export const revelacaoBricolagem = {
  etapa: 0,
  gatilho: 'adaptar' as Escolha,
  bonus: { caixa: 5 } satisfies Partial<Indicadores>,
  descoberta: {
    titulo: 'Vocês descobriram a Bricolagem',
    texto:
      'Vocês não pediram dinheiro nem compraram nada: juntaram colegas, experiência e contatos que já tinham. Dentro do Adaptar, isso tem nome.',
    ganho: 'O que estava à mão não custou nada: +5 de Caixa.',
    tapecaria: 'Na Tapeçaria, esses blocos ganham a cor da Bricolagem, como na Healthy Skin.',
  },
  perdida: {
    titulo: 'Uma carta ficou na mesa',
    texto:
      'A Healthy Skin não planejou: juntou o que tinha à mão. Essa carta só aparece para quem começa pelo que já tem.',
  },
  // Proposição do Artigo B, que a carta antecipa para a turma.
  licao: 'O que está à mão na fundação vira quem você é.',
};

interface Opcao { texto: string; efeito: Indicadores; resultado: string; blocos: Bloco[] }

// Leitura do Mapa (02 §3): cada nível da matriz do Artigo A dá setas a cada
// carta (+1 por ▲, −1 por ▼); a soma é o bônus do contexto no d20.
interface NivelLeitura { texto: string; setas: Partial<Record<Escolha, number>> }

// Capítulo da história: abre cada etapa antes do desafio, marca a passagem do
// tempo e liga o que veio antes ao que vem agora (a ponte da narrativa).
export interface Capitulo {
  numero: string;
  periodo: string;
  abertura: string;
}

export interface Etapa {
  id: string;
  fase: string;
  capitulo: Capitulo;
  titulo: string;
  situacao: string;
  planejar: Opcao;
  adaptar: Opcao;
  combinar?: Opcao;
  ideal: Escolha;
  perguntaParaTurma: string; // aparece na votação para puxar a discussão
  artigoA: string; // fala do Cartógrafo: o que a literatura diz
  artigoB: string; // resumo curto do que a startup real fez
  leitura: { micro: NivelLeitura; meso: NivelLeitura; macro: NivelLeitura };
  // Crônica (03 §5): a Cronista conta o que a Healthy Skin fez, com citação real.
  cronica: { texto: string; citacao?: { autor: string; texto: string } };
}

export const etapas: Etapa[] = [
  {
    id: 'fundacao',
    fase: '1 · Fundação',
    capitulo: {
      numero: 'I',
      periodo: '2016',
      abertura: 'Pacientes com câncer interrompem a quimio e a radioterapia por causa de lesões graves na pele. Vocês têm uma ideia de produto para ajudar.',
    },
    titulo: 'A ideia foi recusada',
    situacao: 'Uma de vocês propôs o produto na farmacêutica onde trabalhava. A empresa recusou sem nem pedir um plano de negócios.',
    planejar: { texto: 'Fazer pesquisa de mercado e um plano completo antes de sair.', efeito: { caixa: -15, clientes: 0, moral: -10 }, resultado: 'Meses de planilhas para um mercado que ainda não existe.', blocos: ['segmentos', 'custos'] },
    adaptar: { texto: 'Chamar duas colegas de confiança e começar com o que vocês já sabem.', efeito: { caixa: -5, clientes: 5, moral: 20 }, resultado: 'Farmácia, P&D e cosméticos naturais: uma equipe montada com o que estava à mão.', blocos: ['parcerias', 'recursos', 'proposta'] },
    ideal: 'adaptar',
    perguntaParaTurma: 'Vocês largariam o emprego sem um plano no papel?',
    artigoA: 'Curioso. Nos meus mapas, quem vem de grandes empresas costuma começar planejando. No início, as que dão certo focam em parcerias.',
    artigoB: 'A Healthy Skin nasceu assim em 2016: três colegas recombinando suas experiências. Isso é bricolagem!',
    leitura: {
      micro: { texto: 'Anos de indústria farmacêutica e cosmética, e colegas de confiança', setas: { planejar: 1, adaptar: 2 } },
      meso: { texto: 'A empresa ainda nem existe', setas: { planejar: -1, adaptar: 1 } },
      macro: { texto: 'Não existe produto parecido no mercado', setas: { planejar: -2, adaptar: 1 } },
    },
    cronica: {
      texto: 'A empregadora recusou. Ela não desistiu: chamou duas colegas que conhecia havia anos, uma de P&D farmacêutico e outra de cosméticos naturais. Três carreiras recombinadas numa empresa. Eu chamo isso de bricolagem.',
      citacao: { autor: 'Fundadora 1', texto: 'Fiquei feliz quando ela entrou comigo, porque conhece os processos e tem relação com fabricantes com quem podemos fazer parceria.' },
    },
  },
  {
    id: 'lancamento',
    fase: '2 · Primeiros anos',
    capitulo: {
      numero: 'II',
      periodo: '2016 a 2018',
      abertura: 'A empresa nasceu e o primeiro produto ficou pronto. Mas ainda não pode ser vendido.',
    },
    titulo: 'Remédio ou cosmético?',
    situacao: 'Para vender, é preciso registrar o produto na Anvisa. Como medicamento leva anos e custa caro; como cosmético é mais simples, mas ainda exige estudos.',
    planejar: { texto: 'Seguir o caminho tradicional e registrar como medicamento.', efeito: { caixa: -20, clientes: -5, moral: -5 }, resultado: 'Anos de espera sem vender nada.', blocos: ['atividades', 'custos'] },
    adaptar: { texto: 'Registrar como cosmético e publicar estudos clínicos mesmo assim.', efeito: { caixa: 5, clientes: 20, moral: 10 }, resultado: 'No mercado rápido e barato, sem perder a confiança dos médicos.', blocos: ['atividades', 'canais', 'parcerias'] },
    ideal: 'adaptar',
    perguntaParaTurma: 'Vale a pena esperar anos pelo caminho "certo"?',
    artigoA: 'Em mercados complexos e incertos, planejar sozinho não é recomendado.',
    artigoB: 'A Healthy Skin contornou as regras e testou o produto com pacientes em ciclos rápidos até chegar à fórmula final.',
    leitura: {
      micro: { texto: 'Vocês conhecem pacientes e médicos de perto', setas: { adaptar: 1 } },
      meso: { texto: 'Empresa pequena, pagando com recursos próprios e um empréstimo', setas: { planejar: -1, adaptar: 1 } },
      macro: { texto: 'Registrar como remédio leva anos e custa caro', setas: { planejar: -2, adaptar: 2 } },
    },
    cronica: {
      texto: 'Registraram como cosmético Classe 2 na Anvisa, mais rápido e barato. Mas fizeram estudos clínicos e publicaram artigos, para ganhar a confiança dos médicos, e testaram protótipos com pacientes de hospitais parceiros.',
      citacao: { autor: 'Fundadora 2', texto: 'Decidimos primeiro desenvolver um cosmético Classe 2. Também precisamos de estudos clínicos, mas é mais simples do que o exigido para medicamentos.' },
    },
  },
  {
    id: 'investidores',
    fase: '3 · Investidores anjo',
    capitulo: {
      numero: 'III',
      periodo: '2019',
      abertura: 'O produto enfim está registrado e vendendo. A startup quer crescer, e crescer custa dinheiro.',
    },
    titulo: 'Os investidores chegaram',
    situacao: 'Seis investidores anjo colocaram dinheiro na startup e agora querem saber para onde ele vai.',
    planejar: { texto: 'Criar conselho, metas, relatórios e reuniões regulares.', efeito: { caixa: 20, clientes: 5, moral: 5 }, resultado: 'Investidores confiantes e operação mais estável.', blocos: ['atividades', 'custos', 'relacionamento'] },
    adaptar: { texto: 'Continuar decidindo tudo no improviso, como no começo.', efeito: { caixa: -20, clientes: -5, moral: -15 }, resultado: 'Os investidores ficaram nervosos.', blocos: ['atividades'] },
    ideal: 'planejar',
    perguntaParaTurma: 'O jeito que funcionou até aqui ainda serve com investidores olhando?',
    artigoA: 'Quando a empresa cresce, investidores e reguladores pedem planejamento. É a hora da causation.',
    artigoB: 'Depois dos anjos, em 2019, a Healthy Skin criou um conselho e passou a apresentar relatórios.',
    leitura: {
      micro: { texto: 'Três anos de estrada: vocês já sabem improvisar', setas: { adaptar: 1 } },
      meso: { texto: 'A empresa cresce com dinheiro de terceiros', setas: { planejar: 2, adaptar: -1 } },
      macro: { texto: 'Seis investidores querem previsões e relatórios', setas: { planejar: 2, adaptar: -2 } },
    },
    cronica: {
      texto: 'Com os anjos veio um conselho. Reuniões regulares, relatórios, planos discutidos com todos. Mas elas continuaram decidindo com base em testes e ouvindo pacientes e equipe.',
    },
  },
  {
    id: 'novo-mercado',
    fase: '4 · Anos recentes',
    capitulo: {
      numero: 'IV',
      periodo: '2020 em diante',
      abertura: 'A empresa já é conhecida entre os oncologistas. Então uma das investidoras aponta um caminho bem maior.',
    },
    titulo: 'Um mercado novo apareceu',
    situacao: 'O produto também ajuda em outras doenças de pele, como a psoríase. Mas esse mercado é caro de alcançar: cerca de 12 mil dermatologistas, contra 3 mil oncologistas.',
    planejar: { texto: 'Montar uma equipe de vendas própria com plano nacional.', efeito: { caixa: -20, clientes: 10, moral: -5 }, resultado: 'O custo de distribuição engoliu o caixa.', blocos: ['canais', 'relacionamento', 'custos'] },
    adaptar: { texto: 'Entrar aos poucos, testando com médicos conhecidos.', efeito: { caixa: 0, clientes: 10, moral: 5 }, resultado: 'Cresce devagar, mas sem grandes riscos.', blocos: ['canais', 'relacionamento'] },
    combinar: { texto: 'Licenciar para uma farmacêutica como marca branca, com contrato de royalties e estudos planejados.', efeito: { caixa: 20, clientes: 25, moral: 10 }, resultado: 'Parceria para chegar longe, plano para chegar com segurança.', blocos: ['parcerias', 'canais', 'receitas'] },
    ideal: 'combinar',
    perguntaParaTurma: 'Dá para arriscar e ter segurança ao mesmo tempo?',
    artigoA: 'Empreendedores experientes combinam as duas lógicas conforme a decisão. Mas combinar exige experiência.',
    artigoB: 'A Healthy Skin está licenciando seus produtos para farmacêuticas, para atender outras doenças como a psoríase.',
    leitura: {
      micro: { texto: 'Vocês já planejaram e já improvisaram', setas: { combinar: 1 } },
      meso: { texto: 'Empresa estabelecida, com só 2% do mercado', setas: { planejar: 1, combinar: 1 } },
      macro: { texto: 'Mercado quatro vezes maior e caro de alcançar', setas: { planejar: -2, adaptar: 1, combinar: 1 } },
    },
    cronica: {
      texto: 'Incubadas na Eretz.bio, do Hospital Albert Einstein, e com apoio do PIPE Fapesp. Na pandemia, abriram televendas e WhatsApp: um imprevisto virou canal, a Limonada. Para o mercado novo, escolheram licenciar como marca branca e receber royalties.',
      citacao: { autor: 'Fundadora 1', texto: 'Uma das nossas investidoras-anjo sugeriu que entrássemos nesse outro mercado. Mas, para nós, o investimento em distribuição seria alto demais neste momento.' },
    },
  },
];

// Regra de desbloqueio da carta Combinar (checada antes da etapa 4):
// a turma precisa ter ADAPTADO em pelo menos uma das etapas 1–2 e PLANEJADO na etapa 3.
// Ideia do Artigo A: só quem já viveu as duas lógicas sabe combiná-las.
export const combinarDesbloqueado = (e: Escolha[]) =>
  (e[0] === 'adaptar' || e[1] === 'adaptar') && e[2] === 'planejar';

export const mensagensCombinar = {
  desbloqueou: '🔓 Carta COMBINAR desbloqueada! Vocês já adaptaram e já planejaram. Agora sabem usar as duas.',
  trancada: '🔒 A carta Combinar continua trancada: só quem já adaptou E já planejou consegue combinar.',
};

// ─────────────────────────────────────────────────────────────
// EVENTOS — um depois de cada etapa 1, 2 e 3; reagem ao que a turma fez
// ─────────────────────────────────────────────────────────────
interface Desfecho { titulo: string; texto: string; efeito: Partial<Indicadores> }
export interface Evento {
  depoisDaEtapa: number; // índice 0–2
  nome: string;
  condicao: (escolhas: Escolha[], ind: Indicadores) => boolean;
  // Por que o destino saiu assim: a ligação com o que a turma fez antes.
  causa: (escolhas: Escolha[], ind: Indicadores) => string;
  seSim: Desfecho;
  seNao: Desfecho;
  conceito: string;
}

export const eventos: Evento[] = [
  {
    depoisDaEtapa: 0,
    nome: 'Quem vocês conhecem?',
    condicao: (e) => e[0] === 'adaptar',
    causa: (e) =>
      e[0] === 'adaptar'
        ? 'Na Fundação, vocês começaram pelas colegas e contatos que já tinham.'
        : 'Na Fundação, vocês ficaram no plano, sem trazer ninguém de fora.',
    seSim: { titulo: 'Colcha de Retalhos!', texto: 'Um hospital conhecido topou testar os protótipos com pacientes.', efeito: { clientes: 10, moral: 5 } },
    seNao: { titulo: 'Plano pronto, porta fechada', texto: 'O plano ficou lindo, mas nenhum hospital conhece vocês para testar o produto.', efeito: { clientes: -5, moral: -5 } },
    conceito: 'Parcerias como colcha de retalhos (Artigo A). A startup real testou com hospitais parceiros (Artigo B).',
  },
  {
    depoisDaEtapa: 1,
    nome: 'Quem vai fabricar?',
    // A rede de contatos das fundadoras vem da etapa 1 (03 §5).
    condicao: (e) => e[0] === 'adaptar',
    causa: (e) =>
      e[0] === 'adaptar'
        ? 'Na Fundação, vocês trouxeram colegas que conheciam a indústria.'
        : 'Na Fundação, vocês não trouxeram ninguém da indústria.',
    seSim: { titulo: 'Perda Aceitável!', texto: 'Uma das fundadoras conhecia um fabricante que produz lotes pequenos. Nada de comprar máquinas.', efeito: { caixa: 10 } },
    seNao: { titulo: 'Máquinas caras demais', texto: 'Ninguém para produzir em lotes pequenos: só sobrou comprar máquinas e montar uma fábrica.', efeito: { caixa: -10, moral: -5 } },
    conceito: 'Arrisque só o que pode perder (Artigo A). A Healthy Skin terceiriza a produção até hoje (Artigo B).',
  },
  {
    depoisDaEtapa: 2,
    nome: 'A incubadora abriu vagas',
    condicao: (_e, ind) => ind.caixa >= 50 && ind.moral >= 60,
    causa: (_e, ind) =>
      ind.caixa >= 50 && ind.moral >= 60
        ? `Caixa ${ind.caixa} e Moral ${ind.moral}: a startup chegou saudável até aqui.`
        : `Caixa ${ind.caixa} e Moral ${ind.moral}: a incubadora pedia pelo menos 50 e 60.`,
    seSim: { titulo: 'Portas abertas', texto: 'Vocês entraram na incubadora de um grande hospital.', efeito: { clientes: 10, moral: 5 } },
    seNao: { titulo: 'Não foi dessa vez', texto: 'A incubadora preferiu outra startup.', efeito: { moral: -5 } },
    conceito: 'A startup real foi incubada na Eretz.bio, do Hospital Albert Einstein (Artigo B).',
  },
];

// ─────────────────────────────────────────────────────────────
// DADO DO DESTINO — d20 + bônus do contexto contra CD 11 (02-jogabilidade.md §4)
// ─────────────────────────────────────────────────────────────
export const dadoDoDestino = {
  cd: 11,
  critico: 19, // total a partir do qual (ou 20 natural) a carta rende mais
  bonusCombinar: 2, // "Experiência": quem já viveu as duas lógicas sabe combiná-las
  faixas: {
    critico: { titulo: 'Crítico!', texto: 'Ganhos ×1,5', multiplicador: 1.5 },
    sucesso: { titulo: 'Sucesso', texto: 'A carta rende o esperado', multiplicador: 1 },
    falha: { titulo: 'Falha', texto: 'Ganhos pela metade', multiplicador: 0.5 },
  },
  explicacao: 'Nenhuma lógica controla tudo: o contexto dá bônus ou atrapalha (Artigo A).',
};

// ─────────────────────────────────────────────────────────────
// REGRAS NUMÉRICAS
// ─────────────────────────────────────────────────────────────
export const regras = {
  inicial: { caixa: 50, clientes: 50, moral: 50 } as Indicadores,
  minimo: 5,    // nunca zera: com a turma, não existe game over
  maximo: 100,
  alertaQuaseQuebrou: 15, // abaixo disso, a barra pisca e aparece "Quase quebrou!"
  // Rank da guilda pela soma dos três indicadores. Limiares conferidos por
  // simulação (4.000 rodadas por caminho, d20 aleatório, 23/09/2026): o caminho
  // real tem mediana 300, o camaleão 250, só adaptar 199, e quem planeja cedo
  // fica entre 50 e 110.
  estrelas: [
    { minimo: 230, estrelas: 3, nome: 'Grão-Mestre' },
    { minimo: 160, estrelas: 2, nome: 'Mestre' },
    { minimo: 0, estrelas: 1, nome: 'Aprendiz' },
  ],
};

// ─────────────────────────────────────────────────────────────
// PERFIL FINAL DA TURMA
// cedo = etapas 1–2 | tarde = etapas 3–4
// ─────────────────────────────────────────────────────────────
export const perfis = {
  lendario: { emoji: '🦎✨', nome: 'Camaleão Lendário', texto: 'Adaptaram no início, planejaram ao crescer e combinaram no fim. É o caminho que os dois artigos descrevem e o que a startup real fez.' },
  camaleao: { emoji: '🦎', nome: 'Camaleão', texto: 'Adaptaram no início e planejaram ao crescer: o padrão mais encontrado na revisão do Artigo A.' },
  improvisador: { emoji: '🏄', nome: 'Surfista do Improviso', texto: 'Adaptaram o tempo todo. Ótimo para começar, mas empresas maiores precisam de planejamento.' },
  planejador: { emoji: '📐', nome: 'Arquiteto de Pergaminhos', texto: 'Planejaram desde o começo. Funciona em mercados estáveis, mas em mercados incertos o plano sozinho não segura.' },
  invertido: { emoji: '🔄', nome: 'Caminho Invertido', texto: 'Planejaram cedo e adaptaram depois. É raro, mas a revisão do Artigo A mostra novatos que aprendem a improvisar com a experiência.' },
  equilibrista: { emoji: '⚖️', nome: 'Equilibrista', texto: 'Misturaram as lógicas desde cedo. Os dois artigos concordam: não existe lógica única.' },
};

export function calcularPerfil(e: Escolha[]): keyof typeof perfis {
  const adaptouCedo = [e[0], e[1]].filter((x) => x === 'adaptar').length; // 0, 1 ou 2
  const planejouTarde = [e[2], e[3]].filter((x) => x === 'planejar' || x === 'combinar').length;
  const cedo = adaptouCedo === 2 ? 'A' : adaptouCedo === 0 ? 'P' : 'misto';
  const tarde = planejouTarde === 2 ? 'P' : planejouTarde === 0 ? 'A' : 'misto';
  if (cedo === 'A' && tarde === 'P') return e[3] === 'combinar' ? 'lendario' : 'camaleao';
  if (cedo === 'A' && tarde === 'A') return 'improvisador';
  if (cedo === 'P' && tarde === 'P') return 'planejador';
  if (cedo === 'P' && tarde === 'A') return 'invertido';
  return 'equilibrista';
}

// Tapeçaria real por etapa (03-historia.md §6, Tabela 4 do Artigo B): cada
// bloco acende nas lógicas marcadas com ✓✓; duas lógicas = bloco listrado.
const EFETUAL_EXCETO_RECEITAS: Bloco[] = ['proposta', 'recursos', 'atividades', 'parcerias', 'segmentos', 'canais', 'relacionamento', 'custos'];
export const canvasReal: Partial<Record<Bloco, Logica[]>>[] = [
  { proposta: ['bricolagem'], recursos: ['bricolagem'], atividades: ['bricolagem'], parcerias: ['bricolagem'] },
  Object.fromEntries(EFETUAL_EXCETO_RECEITAS.map((b) => [b, ['adaptar']])),
  {
    ...Object.fromEntries(EFETUAL_EXCETO_RECEITAS.filter((b) => b !== 'segmentos').map((b) => [b, ['adaptar']])),
    atividades: ['planejar', 'adaptar'],
  },
  {
    ...Object.fromEntries(EFETUAL_EXCETO_RECEITAS.map((b) => [b, ['adaptar']])),
    atividades: ['planejar', 'adaptar'],
    parcerias: ['planejar', 'adaptar'],
    canais: ['planejar', 'adaptar'],
  },
];

// Linha do tempo exibida no final: "vocês vs a startup real"
export const caminhoReal: { etapa: string; escolha: Escolha; logica: string }[] = [
  { etapa: 'Fundação', escolha: 'adaptar', logica: '🔧 Bricolagem' },
  { etapa: 'Primeiros anos', escolha: 'adaptar', logica: '🧭 Effectuation' },
  { etapa: 'Investidores', escolha: 'planejar', logica: '📋 Causation' },
  { etapa: 'Anos recentes', escolha: 'combinar', logica: '🔀 Effectuation + Causation' },
];

// ─────────────────────────────────────────────────────────────
// COMPARAÇÃO DOS ARTIGOS (F4) — responde às perguntas da atividade
// ─────────────────────────────────────────────────────────────
export const comparacao = {
  semelhancas: [
    'As lógicas não são opostas: se combinam.',
    'Adaptar funciona melhor no início; planejar, quando a empresa cresce.',
    'Investidores e reguladores puxam a empresa para o planejamento.',
  ],
  diferencas: [
    { tema: 'Olhar', A: 'De cima: 38 estudos em 20 anos', B: 'De perto: uma startup, fase por fase' },
    { tema: 'Lógicas', A: 'Duas: causation e effectuation', B: 'Três: inclui a bricolagem' },
    { tema: 'Solução', A: 'Matriz perfil do decisor × contexto', B: 'Canvas em movimento' },
    { tema: 'Alerta', A: 'Combinar exige experiência', B: 'As origens podem travar a proposta de valor' },
  ],
};
