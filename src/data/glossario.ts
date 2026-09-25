// Palavras-chave das cartas: aparecem ao lado da carta ampliada (botão
// direito), como as caixas de palavra-chave do Hearthstone. Só para o que está
// escrito na carta e não se explica sozinho (termos dos artigos, as gemas dos
// tomos); nada do que a carta já diz. Cada termo aparece uma vez por sessão
// (engine/vistos.ts): "Gemas" explicada no Tomo A não volta no Tomo B.

export interface PalavraChave {
  termo: string;
  texto: string;
}

const GEMAS: PalavraChave = {
  termo: 'Gemas do tomo',
  texto: 'Os números dos cantos: abrangência, à esquerda, e profundidade, à direita, de 0 a 10.',
};

export const GLOSSARIO = {
  planejar: [{ termo: 'Causation', texto: 'Nome que os artigos dão ao planejar: parte de uma meta definida e escolhe os meios para chegar lá.' }],
  adaptar: [
    {
      termo: 'Effectuation',
      texto: 'Nome que os artigos dão ao adaptar: parte do que se tem (quem sou, o que sei, quem conheço) e deixa as metas surgirem.',
    },
  ],
  bricolagem: [{ termo: 'Bricolagem', texto: 'Recombinar o que já está à mão (recursos, pessoas, relações próximas) para resolver um problema novo.' }],
  // "As duas juntas" já diz tudo; e a trancada guarda o segredo da forja.
  combinar: [],
  A: [
    { termo: 'Matriz dos 3 Níveis', texto: 'A lógica certa depende de quem decide (micro), da fase da empresa (meso) e do contexto (macro).' },
    GEMAS,
  ],
  B: [{ termo: 'Canvas em Movimento', texto: 'Os blocos do modelo de negócio não nascem juntos nem seguem a mesma lógica.' }, GEMAS],
  aprendizados: [],
} satisfies Record<string, PalavraChave[]>;
