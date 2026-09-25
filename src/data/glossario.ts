// Palavras-chave das cartas: aparecem ao lado da carta ampliada (botão
// direito), como as caixas de palavra-chave do Hearthstone. Os textos saem dos
// próprios artigos (conteudo.ts), para não haver duas versões da mesma ideia.
import { conteudo } from './conteudo';

export interface PalavraChave {
  termo: string;
  texto: string;
}

const [artigoA, artigoB] = conteudo.artigos;
const principio = (nome: string) => (artigoA.principiosEffectuation ?? []).find((p) => p.nome === nome)?.explicacao ?? '';

const CAUSATION: PalavraChave = {
  termo: 'Causation',
  texto: 'Parte de uma meta definida e escolhe os meios para alcançá-la, com planos e previsões.',
};
const EFFECTUATION: PalavraChave = {
  termo: 'Effectuation',
  texto: 'Parte dos meios disponíveis (quem sou, o que sei, quem conheço) e deixa as metas emergirem.',
};

export const GLOSSARIO = {
  planejar: [CAUSATION, { termo: 'Quando rende mais', texto: 'Com a empresa madura e o mercado conhecido: dá eficiência e estabilidade.' }],
  adaptar: [
    EFFECTUATION,
    { termo: 'Affordable Loss', texto: principio('Affordable Loss') },
    { termo: 'Crazy Quilt', texto: principio('Crazy Quilt') },
  ],
  bricolagem: [
    { termo: 'Bricolagem', texto: conteudo.cartaSurpresa.descricao },
    { termo: 'De onde vem', texto: conteudo.cartaSurpresa.origem },
  ],
  combinar: [
    { termo: 'As duas juntas', texto: 'Alternar e combinar planejar e improvisar conforme a fase e o contexto.' },
    { termo: 'Forja', texto: 'Só se liberta depois de a guilda ter planejado e adaptado ao menos uma vez.' },
  ],
  A: [
    { termo: 'Matriz dos 3 Níveis', texto: 'A lógica certa depende de quem decide (micro), da fase da empresa (meso) e do contexto (macro).' },
    { termo: 'Gemas', texto: `Abrangência ${artigoA.atributos.abrangencia.valor} e profundidade ${artigoA.atributos.profundidade.valor}: ${artigoA.atributos.abrangencia.justificativa}` },
  ],
  B: [
    { termo: 'Canvas em Movimento', texto: 'Os blocos do modelo de negócio não nascem juntos nem seguem a mesma lógica.' },
    { termo: 'Gemas', texto: `Abrangência ${artigoB.atributos.abrangencia.valor} e profundidade ${artigoB.atributos.profundidade.valor}: ${artigoB.atributos.profundidade.justificativa}` },
  ],
  aprendizados: [{ termo: 'Lendária', texto: 'Nasce da fusão dos dois tomos: o que os dois artigos ensinam juntos.' }],
} satisfies Record<string, PalavraChave[]>;
