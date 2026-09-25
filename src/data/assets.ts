// Imagens que a tela de carregamento baixa antes de o jogo abrir: a arte de
// todas as cartas (vinda de artes.ts, para não esquecer nenhuma) e as peças
// fixas do cenário. Sons e fontes entram pelo useSom e pelo App.
import { arteEventos, arteLendaria, artesArtigos, artesDecisoes, artesEtapas } from './artes';

const base = `${import.meta.env.BASE_URL}assets/`;

const FIXAS = [
  'cenario/taverna-fundo-noite.webp',
  'cenario/tampo-mesa-noite.webp',
  'cenario/pergaminho.webp',
  'cenario/quadro-tabuas.webp',
  'texturas/ferro-placas.webp',
  'cartas/verso.webp',
  'personagens/taverneiro.webp',
  'personagens/cartografo.webp',
  'personagens/cronista.webp',
  'personagens/taverneiro-porta.webp',
  'molduras/carta-bronze.webp',
  'molduras/carta-prata.webp',
  'molduras/carta-ouro.webp',
  'ui/orbe.webp',
  // Cursores (sem eles pré-carregados, a seta do sistema piscava no começo).
  'ui/cursor-seta.svg',
  'ui/cursor-seta-apertando.svg',
  'ui/cursor-mao.svg',
  'ui/cursor-mao-apertando.svg',
  'texturas/estrelas-mascara.webp',
].map((arquivo) => base + arquivo);

const DAS_CARTAS = [
  ...Object.values(artesArtigos),
  ...Object.values(artesDecisoes),
  ...Object.values(artesEtapas),
  ...Object.values(arteEventos),
  arteLendaria,
].flatMap((arte) => (arte.imagem ? [arte.imagem] : []));

export const IMAGENS: string[] = [...new Set([...FIXAS, ...DAS_CARTAS])];
