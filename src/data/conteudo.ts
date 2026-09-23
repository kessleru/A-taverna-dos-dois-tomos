// src/data/conteudo.ts
// Conteúdo extraído dos dois artigos (REGEPE 2023 e 2025).
// ESTE ARQUIVO PREVALECE sobre o schema da seção 5 de docs/plano-original.md.
// Dados fixos dos artigos (cartas, comparação e aprendizados).
// A mecânica do jogo (etapas, eventos, perfis) fica em rodada.ts.
// Itens marcados com PREENCHER ou REVISAR precisam de conferência da equipe.

export type Atributo = 'abrangencia' | 'profundidade' | 'aplicabilidade' | 'originalidade' | 'arsenal';

export const rotulosAtributos: Record<Atributo, string> = {
  abrangencia: 'Abrangência',
  profundidade: 'Profundidade',
  aplicabilidade: 'Aplicabilidade prática',
  originalidade: 'Originalidade',
  arsenal: 'Arsenal de lógicas',
};

export interface Indicadores { caixa: number; clientes: number; moral: number }

export const conteudo = {
  equipe: {
    nome: 'PREENCHER',
    membros: ['PREENCHER'],
  },

  artigos: [
    {
      id: 'A',
      titulo: 'Combining effectuation and causation approaches in entrepreneurship: A 20+ years review',
      tituloCurto: 'O Mapa dos 20 Anos',
      autores: [
        { nome: 'Clarice Secches Kogut', avatarSeed: 'kogut' },
        { nome: 'Renato Dourado Cotta de Mello', avatarSeed: 'mello' },
        { nome: 'Robert Skorupski', avatarSeed: 'skorupski' },
      ],
      instituicoes: 'IAG/PUC-Rio e Coppead/UFRJ',
      ano: 2023,
      periodico: 'REGEPE Entrepreneurship and Small Business Journal, v. 12, n. 3',
      doi: '10.14211/regepe.esbj.e2226',
      referenciaABNT:
        'KOGUT, C. S.; MELLO, R. D. C. de; SKORUPSKI, R. Combining effectuation and causation approaches in entrepreneurship: a 20+ years review. REGEPE Entrepreneurship and Small Business Journal, São Paulo, v. 12, n. 3, e2226, set./dez. 2023. DOI: https://doi.org/10.14211/regepe.esbj.e2226.',
      tipo: 'Revisão sistemática da literatura',
      resumoUmaLinha: 'Revisou 38 artigos de 2001 a 2022 para descobrir quando as empresas combinam planejar e improvisar.',
      numeros: [
        { valor: '38', rotulo: 'artigos analisados' },
        { valor: '21', rotulo: 'anos de pesquisa (2001–2022)' },
        { valor: '17 de 19', rotulo: 'estudos ligam a alternância ao ciclo de vida' },
      ],
      estrategia:
        'Mapeia duas lógicas de decisão. Causation parte de uma meta definida e escolhe os meios para alcançá-la, com planos e previsões. Effectuation parte dos meios disponíveis (quem sou, o que sei, quem conheço) e deixa as metas emergirem, limitando as perdas ao que se pode perder.',
      solucao:
        'Propõe uma matriz que cruza o perfil do decisor (analítico/novato ou empreendedor experiente) com o contexto (complexo e incerto ou simples e maduro). A escolha da lógica depende de três níveis: micro (a pessoa), meso (a fase da empresa) e macro (o contexto).',
      poderEspecial: 'Matriz dos 3 Níveis',
      principiosEffectuation: [
        { nome: 'Bird-in-Hand', explicacao: 'Use o que você já tem.' },
        { nome: 'Affordable Loss', explicacao: 'Arrisque só o que pode perder, em vez de calcular o lucro máximo.' },
        { nome: 'Crazy Quilt', explicacao: 'Forme parcerias como uma colcha de retalhos para ampliar recursos.' },
        { nome: 'Lemonade', explicacao: 'Transforme imprevistos em oportunidades.' },
        { nome: 'Pilot-in-the-Plane', explicacao: 'O empreendedor pilota: o futuro é construído, não previsto.' },
      ],
      atributos: {
        abrangencia: { valor: 10, justificativa: 'Cobre 38 estudos de vários países, setores e métodos em 21 anos.' },
        profundidade: { valor: 5, justificativa: 'Resume cada estudo em poucas linhas; não acompanha nenhuma empresa de perto.' },
        aplicabilidade: { valor: 7, justificativa: 'A matriz ajuda o empreendedor a reconhecer seu perfil e o contexto em que está.' },
        originalidade: { valor: 7, justificativa: 'Segundo os autores, é o primeiro trabalho a reunir os níveis micro, meso e macro num só quadro.' },
        arsenal: { valor: 6, justificativa: 'Foca em duas lógicas: causation e effectuation.' },
      },
    },
    {
      id: 'B',
      titulo: 'Business model development in startups: A study of causation, effectuation and bricolage',
      tituloCurto: 'Canvas em Movimento',
      autores: [
        { nome: 'Renato Machado Costa', avatarSeed: 'costa' },
        { nome: 'Reed Elliot Nelson', avatarSeed: 'nelson' },
        { nome: 'Marcelo Caldeira Pedroso', avatarSeed: 'pedroso' },
      ],
      instituicoes: 'USP e Fundação Dom Cabral',
      ano: 2025,
      periodico: 'REGEPE Entrepreneurship and Small Business Journal, v. 14',
      doi: '10.14211/regepe.esbj.e2535',
      referenciaABNT:
        'COSTA, R. M.; NELSON, R. E.; PEDROSO, M. C. Business model development in startups: a study of causation, effectuation and bricolage. REGEPE Entrepreneurship and Small Business Journal, São Paulo, v. 14, e2535, jan./dez. 2025. DOI: https://doi.org/10.14211/regepe.esbj.e2535.',
      tipo: 'Estudo de caso longitudinal',
      resumoUmaLinha: 'Acompanha uma startup brasileira de biotecnologia da ideia à expansão, fase por fase do modelo de negócio.',
      numeros: [
        { valor: '+50 mil', rotulo: 'pacientes atendidos (maio/2024)' },
        { valor: '270 min', rotulo: 'de entrevistas com as fundadoras' },
        { valor: '2%', rotulo: 'do mercado potencial no Brasil' },
      ],
      caso: {
        nome: 'Healthy Skin (pseudônimo)',
        fundacao: 2016,
        problema: 'Pacientes com câncer interrompiam a quimio ou a radioterapia por causa de lesões graves na pele.',
        produto: 'Produtos para pele e mucosa oral de pacientes oncológicos, com ingredientes naturais e eficácia comprovada em estudos clínicos.',
        trajetoria: [
          { fase: 'Até a fundação', logica: 'bricolagem', fato: 'A empregadora recusou a ideia; a fundadora juntou duas colegas de confiança da indústria farmacêutica e de cosméticos.' },
          { fase: 'Primeiros anos', logica: 'effectuation', fato: 'Recursos próprios e empréstimo de banco de desenvolvimento; protótipos testados com pacientes em hospitais parceiros.' },
          { fase: 'Investidores anjo', logica: 'effectuation', fato: 'Em 2019, seis investidores anjo e criação de um conselho, com reuniões e relatórios regulares.' },
          { fase: 'Incubação', logica: 'effectuation', fato: 'Parceria com a Eretz.bio, no ecossistema do Hospital Albert Einstein, e financiamento do PIPE Fapesp.' },
          { fase: 'Anos recentes', logica: 'effectuation + causation', fato: 'Vendas por e-commerce, telefone, WhatsApp e B2B; licenciamento como marca branca para farmacêuticas.' },
        ],
      },
      estrategia:
        'Analisa como três lógicas aparecem em cada componente do Business Model Canvas ao longo do tempo: bricolagem na fundação (fazer com o que está à mão), effectuation dominando o crescimento (experimentar, parcerias, perdas limitadas) e causation para estabilizar e dar eficiência.',
      solucao:
        'Propõe ver o Canvas "em movimento": os componentes não nascem juntos nem seguem a mesma lógica. Sua proposição central é que o que está à mão na fundação se torna quem você é, criando uma identidade estável, mas que pode travar a proposta de valor.',
      poderEspecial: 'Canvas em Movimento',
      atributos: {
        abrangencia: { valor: 3, justificativa: 'Estuda uma única startup, como os próprios autores reconhecem nas limitações.' },
        profundidade: { valor: 10, justificativa: 'Entrevistas longas, dados internos e toda a trajetória de 2016 a 2024.' },
        aplicabilidade: { valor: 8, justificativa: 'Conecta as lógicas ao Canvas, ferramenta que empreendedores já usam.' },
        originalidade: { valor: 8, justificativa: 'Traz a bricolagem para a discussão e cria a proposição "o que está à mão vira quem você é".' },
        arsenal: { valor: 9, justificativa: 'Trabalha com três lógicas: causation, effectuation e bricolagem.' },
      },
    },
  ],

  // Aparece no briefing (F1) e na etapa 1 da rodada, onde a bricolagem acontece.
  cartaSurpresa: {
    nome: 'Bricolagem',
    subtitulo: 'Fazer com o que está à mão',
    origem: 'Lévi-Strauss (1966); Baker e Nelson (2005)',
    descricao:
      'Recombina recursos, pessoas e relações próximas para resolver um problema novo. É mais concreta e menos arriscada que a effectuation, mas também menos flexível e menos escalável.',
    apareceEm: 'B',
    fala: 'Eu estava lá na fundação da Healthy Skin, antes de todo mundo!',
  },

  veredito: 'complementares' as const,
  vereditoTexto:
    'Os dois artigos chegam à mesma conclusão por caminhos diferentes. O Artigo A olha de cima, para 20 anos de pesquisa, e mostra que as lógicas se combinam conforme a pessoa, a fase e o contexto. O Artigo B olha de perto, para uma empresa real, e mostra essa combinação acontecendo em cada peça do modelo de negócio.',

  temaCentral: 'Não existe lógica única: o empreendedor alterna e combina planejar e improvisar conforme a fase e o contexto.',

  aprendizados: [
    'Não existe lógica única: planejar e improvisar se combinam.',
    'A fase importa: effectuation abre caminhos no início, causation estabiliza o crescimento.',
    'Comece pelo que você tem: quem você é, o que sabe e quem conhece.',
    'As origens deixam marca: o que está à mão na fundação vira identidade, para o bem e para o mal.',
    'Combinar as lógicas exige experiência, e experiência se aprende.',
  ],
};
