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
      { id: 'bricolagem', icone: '🔧', nome: 'Bricolagem', teoria: 'Bricolage', resumo: 'Faça com o que está à mão. Aparece dentro do Adaptar, na fundação.' },
      { id: 'combinar', icone: '🔒', nome: 'Combinar', teoria: 'Carta secreta', resumo: 'Trancada. Descubram como forjá-la durante o jogo.' },
    ],
  },
  regras: {
    titulo: 'Como funciona',
    itens: [
      '4 decisões, da fundação até a empresa crescer.',
      'Em cada uma, a turma discute rapidinho e vota levantando a mão.',
      'Três barras mostram a saúde da startup: 💰 Caixa, 👥 Clientes e 🔥 Moral.',
      'Depois de cada decisão, rola o Dado da Incerteza e podem surgir eventos.',
      'No final, vocês descobrem o perfil empreendedor da turma.',
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// ETAPAS — a jornada segue o ciclo de vida descrito nos dois artigos
// ─────────────────────────────────────────────────────────────
interface Opcao { texto: string; efeito: Indicadores; resultado: string }
export interface Etapa {
  id: string;
  fase: string;
  titulo: string;
  situacao: string;
  planejar: Opcao;
  adaptar: Opcao;
  combinar?: Opcao;
  ideal: Escolha;
  perguntaParaTurma: string; // aparece na votação para puxar a discussão
  artigoA: string; // o que a teoria diz
  artigoB: string; // o que a startup real fez
}

export const etapas: Etapa[] = [
  {
    id: 'fundacao',
    fase: '1 · Fundação',
    titulo: 'A ideia foi recusada',
    situacao: 'Você propôs o produto na farmacêutica onde trabalha. A empresa recusou sem nem pedir um plano de negócios.',
    planejar: { texto: 'Fazer pesquisa de mercado e um plano completo antes de sair.', efeito: { caixa: -15, clientes: 0, moral: -10 }, resultado: 'Meses de planilhas para um mercado que ainda não existe.' },
    adaptar: { texto: 'Chamar duas colegas de confiança e começar com o que vocês já sabem.', efeito: { caixa: -5, clientes: 5, moral: 20 }, resultado: 'Farmácia, P&D e cosméticos naturais: uma equipe montada com o que estava à mão.' },
    ideal: 'adaptar',
    perguntaParaTurma: 'Vocês largariam o emprego sem um plano no papel?',
    artigoA: 'No início, empresas de sucesso focam em parcerias, não em pesquisas de mercado sofisticadas.',
    artigoB: 'A Healthy Skin nasceu assim em 2016: três colegas recombinando suas experiências. Isso é bricolagem!',
  },
  {
    id: 'lancamento',
    fase: '2 · Primeiros anos',
    titulo: 'Remédio ou cosmético?',
    situacao: 'O produto funciona. Registrar como medicamento leva anos e custa caro. Como cosmético é mais simples, mas ainda exige estudos.',
    planejar: { texto: 'Seguir o caminho tradicional e registrar como medicamento.', efeito: { caixa: -20, clientes: -5, moral: -5 }, resultado: 'Anos de espera sem vender nada.' },
    adaptar: { texto: 'Registrar como cosmético e publicar estudos clínicos mesmo assim.', efeito: { caixa: 5, clientes: 20, moral: 10 }, resultado: 'No mercado rápido e barato, sem perder a confiança dos médicos.' },
    ideal: 'adaptar',
    perguntaParaTurma: 'Vale a pena esperar anos pelo caminho "certo"?',
    artigoA: 'Em mercados complexos e incertos, planejar sozinho não é recomendado.',
    artigoB: 'A Healthy Skin contornou as regras e testou o produto com pacientes em ciclos rápidos até chegar à fórmula final.',
  },
  {
    id: 'investidores',
    fase: '3 · Investidores anjo',
    titulo: 'Os investidores chegaram',
    situacao: 'Deu certo! Seis investidores anjo colocaram dinheiro na startup e querem saber para onde ele vai.',
    planejar: { texto: 'Criar conselho, metas, relatórios e reuniões regulares.', efeito: { caixa: 20, clientes: 5, moral: 5 }, resultado: 'Investidores confiantes e operação mais estável.' },
    adaptar: { texto: 'Continuar decidindo tudo no improviso, como no começo.', efeito: { caixa: -20, clientes: -5, moral: -15 }, resultado: 'Os investidores ficaram nervosos.' },
    ideal: 'planejar',
    perguntaParaTurma: 'O jeito que funcionou até aqui ainda serve com investidores olhando?',
    artigoA: 'Quando a empresa cresce, investidores e reguladores exigem planejamento. É a hora da causation.',
    artigoB: 'Depois dos anjos, em 2019, a Healthy Skin criou um conselho e passou a apresentar relatórios.',
  },
  {
    id: 'novo-mercado',
    fase: '4 · Anos recentes',
    titulo: 'Um mercado novo apareceu',
    situacao: 'O produto também ajuda em outras doenças de pele. Mas o mercado é mais caro: cerca de 12 mil dermatologistas, contra 3 mil oncologistas.',
    planejar: { texto: 'Montar uma equipe de vendas própria com plano nacional.', efeito: { caixa: -20, clientes: 10, moral: -5 }, resultado: 'O custo de distribuição engoliu o caixa.' },
    adaptar: { texto: 'Entrar aos poucos, testando com médicos conhecidos.', efeito: { caixa: 0, clientes: 10, moral: 5 }, resultado: 'Cresce devagar, mas sem grandes riscos.' },
    combinar: { texto: 'Licenciar para uma farmacêutica como marca branca, com contrato de royalties e estudos planejados.', efeito: { caixa: 20, clientes: 25, moral: 10 }, resultado: 'Parceria para chegar longe, plano para chegar com segurança.' },
    ideal: 'combinar',
    perguntaParaTurma: 'Dá para arriscar e ter segurança ao mesmo tempo?',
    artigoA: 'Empreendedores experientes combinam as duas lógicas conforme a decisão. Mas combinar exige experiência!',
    artigoB: 'A Healthy Skin está licenciando seus produtos para farmacêuticas, para atender outras doenças como a psoríase.',
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
  seSim: Desfecho;
  seNao: Desfecho;
  conceito: string;
}

export const eventos: Evento[] = [
  {
    depoisDaEtapa: 0,
    nome: 'Quem vocês conhecem?',
    condicao: (e) => e[0] === 'adaptar',
    seSim: { titulo: '🧵 Crazy Quilt!', texto: 'Um hospital conhecido topou testar os protótipos com pacientes.', efeito: { clientes: 10, moral: 5 } },
    seNao: { titulo: '🚪 Plano pronto, porta fechada', texto: 'O plano ficou lindo, mas nenhum hospital conhece vocês para testar o produto.', efeito: { clientes: -5, moral: -5 } },
    conceito: 'Parcerias como colcha de retalhos (Artigo A). A startup real testou com hospitais parceiros (Artigo B).',
  },
  {
    depoisDaEtapa: 1,
    nome: 'A pandemia chegou',
    condicao: (e) => e[1] === 'adaptar',
    seSim: { titulo: '🍋 Lemonade!', texto: 'Vocês já vendiam online e passaram a atender por telefone e WhatsApp.', efeito: { caixa: 5, clientes: 10 } },
    seNao: { titulo: '📉 O plano não previa isso', texto: 'Sem produto no mercado e sem canal digital, tudo parou.', efeito: { caixa: -10, moral: -5 } },
    conceito: 'Transformar imprevistos em oportunidades (Artigo A). A startup real abriu televendas e WhatsApp na Covid (Artigo B).',
  },
  {
    depoisDaEtapa: 2,
    nome: 'A incubadora abriu vagas',
    condicao: (_e, ind) => ind.caixa >= 50 && ind.moral >= 60,
    seSim: { titulo: '🏥 Portas abertas', texto: 'Vocês entraram na incubadora de um grande hospital.', efeito: { clientes: 10, moral: 5 } },
    seNao: { titulo: '😮‍💨 Não foi dessa vez', texto: 'Com caixa ou moral baixos, a incubadora preferiu outra startup.', efeito: { moral: -5 } },
    conceito: 'A startup real foi incubada na Eretz.bio, do Hospital Albert Einstein (Artigo B).',
  },
];

// ─────────────────────────────────────────────────────────────
// DADO DA INCERTEZA — rola depois de cada decisão (d6)
// ─────────────────────────────────────────────────────────────
export const dadoDaIncerteza = {
  explicacao: 'Nenhuma lógica controla tudo: o contexto também joga (Artigo A).',
  faces: {
    1: { titulo: 'Mercado azedou', efeito: { clientes: -8 } },
    2: { titulo: 'Mercado estável', efeito: {} },
    3: { titulo: 'Mercado estável', efeito: {} },
    4: { titulo: 'Mercado estável', efeito: {} },
    5: { titulo: 'Mercado estável', efeito: {} },
    6: { titulo: 'Mercado a favor', efeito: { clientes: 8 } },
  } as Record<number, { titulo: string; efeito: Partial<Indicadores> }>,
};

// ─────────────────────────────────────────────────────────────
// REGRAS NUMÉRICAS
// ─────────────────────────────────────────────────────────────
export const regras = {
  inicial: { caixa: 50, clientes: 50, moral: 50 } as Indicadores,
  minimo: 5,    // nunca zera: com a turma, não existe game over
  maximo: 100,
  alertaQuaseQuebrou: 15, // abaixo disso, a barra pisca e aparece "Quase quebrou!"
  estrelas: [
    { minimo: 230, estrelas: 3 },
    { minimo: 160, estrelas: 2 },
    { minimo: 0, estrelas: 1 },
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
  planejador: { emoji: '📐', nome: 'Arquiteto de Planilhas', texto: 'Planejaram desde o começo. Funciona em mercados estáveis, mas em mercados incertos o plano sozinho não segura.' },
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
