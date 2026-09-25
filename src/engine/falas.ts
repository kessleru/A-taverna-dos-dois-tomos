// Falas do Taverneiro por momento do jogo. Cada momento tem um grupo de
// falas; o sorteio escolhe uma sem repetir a última dita.
export const FALAS = {
  'boas-vindas': ['boas-vindas'],
  historia: ['historia-hoje'],
  'inicio-rodada': ['puxem-uma-cadeira'],
  desafio: ['novo-desafio', 'ficando-interessante'],
  votacao: ['duas-opcoes', 'pensem-com-cuidado', 'nao-tenham-pressa', 'prestem-atencao', 'toda-decisao'],
  dado: ['escolha-feita', 'quero-ver'],
  acerto: ['escolha-sabia'],
  'evento-bom': ['bela-jogada'],
  'evento-ruim': ['outros-planos', 'sem-sorte'],
  resultado: ['onde-vai-levar'],
  despedida: ['ate-a-proxima'],
  // Gravadas juntas pela equipe (entrega/audio/audio.mp3) e separadas por fala.
  'tutorial-desafio': ['tutorial-desafio'],
  'tutorial-orbes': ['tutorial-orbes'],
  'tutorial-tapecaria': ['tutorial-tapecaria'],
  'tutorial-mapa': ['tutorial-mapa'],
  'tutorial-votacao': ['tutorial-votacao'],
  'tutorial-dado': ['tutorial-dado'],
  critico: ['critico', 'critico-2'],
  falha: ['falha', 'falha-2'],
  cronica: ['cronica'],
  'forja-livre': ['forja-livre'],
  'forja-presa': ['forja-presa'],
  'rank-grao-mestre': ['rank-grao-mestre'],
  'rank-mestre': ['rank-mestre'],
  'rank-aprendiz': ['rank-aprendiz'],
  confronto: ['confronto'],
  veredito: ['veredito'],
  fusao: ['fusao'],
  aprendizados: ['aprendizados'],
} as const satisfies Record<string, readonly string[]>;

export type Momento = keyof typeof FALAS;

export const TODAS_AS_FALAS: string[] = Object.values(FALAS).flat();

export function escolherFala(grupo: readonly string[], sorteio: number, ultima?: string): string | undefined {
  const opcoes = grupo.length > 1 ? grupo.filter((fala) => fala !== ultima) : grupo;
  if (opcoes.length === 0) return undefined;
  const indice = Math.min(opcoes.length - 1, Math.max(0, Math.floor(sorteio * opcoes.length)));
  return opcoes[indice];
}
