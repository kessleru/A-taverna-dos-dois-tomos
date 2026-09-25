// Imagens que a tela de carregamento baixa antes de o jogo abrir: a arte de
// todas as cartas (vinda de artes.ts, para não esquecer nenhuma) e as peças
// fixas do cenário. Sons e fontes entram pelo useSom e pelo App.
import { arteEventos, arteLendaria, artesArtigos, artesDecisoes, artesEtapas } from './artes';
import { ARTES_PINTADAS } from '../components/ui/ArtePintada';

const base = `${import.meta.env.BASE_URL}assets/`;

const FIXAS = [
  'cenario/taverna-fundo-noite.webp',
  'cenario/tampo-mesa-noite.webp',
  'cenario/pergaminho.webp',
  'cenario/quadro-tabuas.webp',
  'texturas/ferro-placas.webp',
  'cartas/verso.webp',
  'cartas/verso-destino.webp',
  // Peças pintadas (ArtePintada): ampulheta, dado, selo, vela e pergaminho.
  ...Object.values(ARTES_PINTADAS).map((nome) => `ui/${nome}.webp`),
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
  // Partículas do Kenney Particle Pack (CC0): poeira do clique, redemoinhos e
  // brilhos da passagem do tempo e da Carta do Destino.
  ...['smoke-02', 'smoke-04', 'smoke-05', 'smoke-07', 'smoke-08', 'dirt-01', 'dirt-02', 'twirl-01', 'twirl-02', 'twirl-03', 'star-06', 'star-07', 'star-08', 'light-01'].map(
    (nome) => `particulas/${nome}.webp`,
  ),
].map((arquivo) => base + arquivo);

const DAS_CARTAS = [
  ...Object.values(artesArtigos),
  ...Object.values(artesDecisoes),
  ...Object.values(artesEtapas),
  ...Object.values(arteEventos),
  arteLendaria,
].flatMap((arte) => (arte.imagem ? [arte.imagem] : []));

export const IMAGENS: string[] = [...new Set([...FIXAS, ...DAS_CARTAS])];
