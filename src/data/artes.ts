// src/data/artes.ts
// Arte de cada carta. O PLANO.md descreve este arquivo como "já pronto",
// mas ele não veio no pacote do projeto — foi recriado aqui na Iteração 3
// seguindo a seção 7 do plano. Diferença deliberada: como já existe uma
// imagem pintada em public/assets/ para CADA carta do jogo (mesmos nomes
// usados aqui), CenaArte.tsx sempre encontra `imagem` e não precisa do
// motor de cena SVG em camadas (ícones do game-icons.net, 6 fundos
// temáticos, partículas) descrito no plano — não haveria internet para
// baixar aquele acervo de ícones de qualquer forma. Os campos `cores`,
// `particulas` e `icone` continuam aqui e alimentam um fallback simples
// (gradiente + emoji) caso alguma imagem falhe ao carregar.

import type { Escolha } from './rodada';

export type Raridade = 'comum' | 'rara' | 'lendaria';
export type FormatoJanela = 'arco' | 'retangulo' | 'ponta';
export type Particulas = 'faiscas' | 'poeira' | 'bolhas' | 'moedas' | 'folhas' | 'estrelas';

export type TipoCarta = 'conselheiro' | 'decisao' | 'evento' | 'lendaria';

export const tipos: Record<TipoCarta, { nome: string; janela: FormatoJanela }> = {
  conselheiro: { nome: 'Conselheiro', janela: 'arco' },
  decisao: { nome: 'Decisão', janela: 'retangulo' },
  evento: { nome: 'Evento', janela: 'ponta' },
  lendaria: { nome: 'Lendária', janela: 'arco' },
};

export interface ArteCarta {
  icone: string;
  cores: [string, string];
  particulas: Particulas;
  raridade: Raridade;
  imagem?: string;
  prompt?: string;
}

// Custo de risco mostrado no orbe da carta durante a votação.
export const orbeDecisao: Record<Escolha, number> = { planejar: 1, adaptar: 2, combinar: 3 };

const estiloPrompt =
  'ilustração pintada estilo deckbuilder de fantasia, cores saturadas, luz dramática, sem texto, 800x600';

export const artesArtigos: Record<'A' | 'B', ArteCarta> = {
  A: {
    icone: '🗺️',
    cores: ['#FFB27A', '#F86624'],
    particulas: 'poeira',
    raridade: 'rara',
    imagem: '/assets/artigo-A.png',
    prompt: `${estiloPrompt}. Um mapa antigo brilhante pairando sobre uma mesa de madeira, rosa dos ventos dourada, luz âmbar.`,
  },
  B: {
    icone: '🧪',
    cores: ['#7BEDE0', '#2EC4B6'],
    particulas: 'bolhas',
    raridade: 'rara',
    imagem: '/assets/artigo-B.png',
    prompt: `${estiloPrompt}. Um laboratório de biotecnologia acolhedor, frascos com luz turquesa, plantas em recipientes.`,
  },
};

export const artesDecisoes: Record<Escolha | 'bricolagem', ArteCarta> = {
  planejar: {
    icone: '📋',
    cores: ['#B9C9FA', '#6C8EF5'],
    particulas: 'poeira',
    raridade: 'comum',
    imagem: '/assets/planejar.png',
    prompt: `${estiloPrompt}. Uma prancheta flutuante com gráficos e réguas de luz azul, engrenagens girando ao fundo.`,
  },
  adaptar: {
    icone: '🧭',
    cores: ['#A6F0C6', '#5CC98A'],
    particulas: 'folhas',
    raridade: 'comum',
    imagem: '/assets/adaptar.png',
    prompt: `${estiloPrompt}. Uma bússola dourada girando sobre trilhas verdes sinuosas, brisa levando folhas.`,
  },
  combinar: {
    icone: '🔀',
    cores: ['#FFE9A3', '#F9C80E'],
    particulas: 'faiscas',
    raridade: 'lendaria',
    imagem: '/assets/combinar.jpg',
    prompt: `${estiloPrompt}. Duas correntes de luz, azul e verde, se entrelaçando e explodindo em faíscas douradas.`,
  },
  bricolagem: {
    icone: '🔧',
    cores: ['#E0B48A', '#C08552'],
    particulas: 'poeira',
    raridade: 'comum',
    imagem: '/assets/bricolagem.png',
    prompt: `${estiloPrompt}. Uma bancada de oficina com ferramentas recombinadas em algo novo, luz quente de cobre.`,
  },
};

// Cena grande da situação de cada etapa (id bate com etapas[].id em rodada.ts).
export const artesEtapas: Record<string, ArteCarta> = {
  fundacao: {
    icone: '💡',
    cores: ['#FFE29A', '#C08552'],
    particulas: 'poeira',
    raridade: 'comum',
    imagem: '/assets/fundacao.jpg',
    prompt: `${estiloPrompt}. Três silhuetas ao redor de uma mesa de cozinha à noite, uma lâmpada acesa entre elas.`,
  },
  lancamento: {
    icone: '🚀',
    cores: ['#7BEDE0', '#2EC4B6'],
    particulas: 'bolhas',
    raridade: 'comum',
    imagem: '/assets/lancamento.jpg',
    prompt: `${estiloPrompt}. Um frasco de produto saindo de uma linha de produção artesanal, luz turquesa.`,
  },
  investidores: {
    icone: '🤝',
    cores: ['#B9C9FA', '#6C8EF5'],
    particulas: 'poeira',
    raridade: 'rara',
    imagem: '/assets/investidores.jpg',
    prompt: `${estiloPrompt}. Uma mesa de reunião elegante com seis cadeiras, gráficos de luz azul projetados.`,
  },
  'novo-mercado': {
    icone: '🌐',
    cores: ['#D9B8FF', '#8E6FD9'],
    particulas: 'estrelas',
    raridade: 'rara',
    imagem: '/assets/novo-mercado.jpg',
    prompt: `${estiloPrompt}. Um horizonte de cidade se abrindo em novos caminhos luminosos, roxo profundo.`,
  },
};

// Desfechos de evento, indexados por "<depoisDaEtapa>-sim" | "<depoisDaEtapa>-nao".
export const arteEventos: Record<string, ArteCarta> = {
  '0-sim': {
    icone: '🧵',
    cores: ['#A6F0C6', '#5CC98A'],
    particulas: 'folhas',
    raridade: 'comum',
    imagem: '/assets/crazy-quilt.jpg',
    prompt: `${estiloPrompt}. Uma colcha de retalhos costurada com fios de luz verde conectando pontos.`,
  },
  '0-nao': {
    icone: '🚪',
    cores: ['#FFB0B8', '#EA3546'],
    particulas: 'poeira',
    raridade: 'comum',
    imagem: '/assets/porta-fechada.jpg',
    prompt: `${estiloPrompt}. Uma porta de madeira fechada com uma pilha de papéis empoeirados no chão.`,
  },
  '1-sim': {
    icone: '🍋',
    cores: ['#FFF3A3', '#F9C80E'],
    particulas: 'faiscas',
    raridade: 'comum',
    imagem: '/assets/lemonade.jpg',
    prompt: `${estiloPrompt}. Um copo de limonada brilhante virando uma tela de smartphone com um ícone de venda.`,
  },
  '1-nao': {
    icone: '📉',
    cores: ['#FFB0B8', '#EA3546'],
    particulas: 'poeira',
    raridade: 'comum',
    imagem: '/assets/plano-furou.jpg',
    prompt: `${estiloPrompt}. Um gráfico de plano furado rasgado ao meio, tinta vermelha escorrendo.`,
  },
  '2-sim': {
    icone: '🏥',
    cores: ['#B9C9FA', '#6C8EF5'],
    particulas: 'bolhas',
    raridade: 'rara',
    imagem: '/assets/incubadora.jpg',
    prompt: `${estiloPrompt}. Portas de vidro de um hospital-incubadora se abrindo, luz azul acolhedora.`,
  },
  '2-nao': {
    icone: '😮‍💨',
    cores: ['#FFB0B8', '#EA3546'],
    particulas: 'poeira',
    raridade: 'comum',
    imagem: '/assets/nao-foi.jpg',
    prompt: `${estiloPrompt}. Uma sala de espera vazia com uma cadeira única iluminada por luz fria.`,
  },
};

export const arteLendaria: ArteCarta = {
  icone: '🏆',
  cores: ['#FFE9A3', '#F9C80E'],
  particulas: 'estrelas',
  raridade: 'lendaria',
  imagem: '/assets/aprendizados.jpg',
  prompt: `${estiloPrompt}. Um troféu dourado orbitado por partículas de luz, fundo em explosão suave de brilho.`,
};
