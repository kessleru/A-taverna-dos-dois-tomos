// Poeira do clique (como no Hearthstone: clicar no campo levanta um pouco de
// pó e solta pedrinhas). Lógica pura das partículas: quem desenha é o
// PoeiraClique, num canvas por cima do palco. Tudo em px do palco de 1920×1080.

export type TipoParticula = 'nuvem' | 'grao' | 'anel' | 'faisca' | 'aro';

export interface Particula {
  tipo: TipoParticula;
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Segundos de vida já corridos e total.
  idade: number;
  vida: number;
  // Tamanho no início e no fim (raio em px).
  tamanho: number;
  tamanhoFinal: number;
  opacidade: number;
  // Altura da mesa sob o grão: ele quica ali uma vez.
  chao: number;
  quicou: boolean;
  giro: number;
  cor: string;
}

const GRAVIDADE = 1500;
const ARRASTO_NUVEM = 3.2;

// Cores de pó de madeira e pedra, sob a luz das velas.
const CORES_NUVEM = ['#e2c89c', '#cdb088', '#d8bf94'];
const CORES_GRAO = ['#5a3f28', '#7a5a3c', '#3c2a1b', '#9c8062'];
const CORES_FAISCA = ['#ffe39a', '#fff3c4', '#e8b64a'];

function base(tipo: TipoParticula, x: number, y: number): Particula {
  return { tipo, x, y, vx: 0, vy: 0, idade: 0, vida: 1, tamanho: 1, tamanhoFinal: 1, opacidade: 1, chao: y, quicou: false, giro: 0, cor: '#fff' };
}

function escolher<T>(lista: readonly T[], sorteio: () => number): T {
  return lista[Math.min(lista.length - 1, Math.floor(sorteio() * lista.length))];
}

// Cliques seguidos no mesmo lugar ficam mais fortes (até 5 em sequência),
// como os objetos do tabuleiro do Hearthstone que reagem mais a cada clique.
export const JANELA_SEQUENCIA_MS = 450;
export const RAIO_SEQUENCIA_PX = 90;
export const MAX_SEQUENCIA = 5;

export interface Sequencia {
  x: number;
  y: number;
  em: number;
  contagem: number;
}

export function proximaSequencia(anterior: Sequencia | null, x: number, y: number, agora: number): Sequencia {
  const perto = anterior && agora - anterior.em < JANELA_SEQUENCIA_MS && Math.hypot(x - anterior.x, y - anterior.y) < RAIO_SEQUENCIA_PX;
  return { x, y, em: agora, contagem: perto ? Math.min(MAX_SEQUENCIA, anterior.contagem + 1) : 0 };
}

export function forcaDaSequencia(contagem: number): number {
  return 1 + Math.min(MAX_SEQUENCIA, Math.max(0, contagem)) * 0.24;
}

// Clique na mesa: nuvens de pó que se espalham rente ao tampo, grãos que
// pulam e quicam, e um anel achatado (a onda do toque na madeira).
export function emitirPoeira(x: number, y: number, forca: number, sorteio: () => number): Particula[] {
  const lista: Particula[] = [];
  const anel = base('anel', x, y);
  anel.vida = 0.42;
  anel.tamanho = 6;
  anel.tamanhoFinal = 44 * forca;
  anel.opacidade = 0.32;
  anel.cor = '#f3e6c8';
  lista.push(anel);

  const nuvens = Math.round(7 + forca * 4);
  for (let i = 0; i < nuvens; i++) {
    const angulo = (i / nuvens) * Math.PI * 2 + sorteio() * 0.6;
    // Nasce já um pouco afastada do centro: juntas no ponto, as nuvens
    // somavam brilho e viravam uma bola clara no primeiro quadro.
    const afastamento = 6 + sorteio() * 8;
    const p = base('nuvem', x + Math.cos(angulo) * afastamento, y + Math.sin(angulo) * afastamento * 0.4);
    const velocidade = (70 + sorteio() * 110) * forca;
    p.vx = Math.cos(angulo) * velocidade;
    // Achatado (a mesa é vista de cima, inclinada) e subindo um pouco.
    p.vy = Math.sin(angulo) * velocidade * 0.4 - (20 + sorteio() * 40);
    p.vida = 0.6 + sorteio() * 0.45;
    p.tamanho = 10 + sorteio() * 6;
    p.tamanhoFinal = (22 + sorteio() * 22) * (0.8 + forca * 0.25);
    p.opacidade = 0.2 + sorteio() * 0.14;
    p.cor = escolher(CORES_NUVEM, sorteio);
    lista.push(p);
  }

  const graos = Math.round(3 + forca * 4);
  for (let i = 0; i < graos; i++) {
    const p = base('grao', x, y);
    const lado = sorteio() * 2 - 1;
    p.vx = lado * (60 + sorteio() * 160) * forca;
    p.vy = -(200 + sorteio() * 260) * (0.8 + forca * 0.2);
    p.vida = 0.55 + sorteio() * 0.35;
    p.tamanho = 1.6 + sorteio() * 2.2;
    p.tamanhoFinal = p.tamanho;
    p.chao = y + 4 + sorteio() * 10;
    p.giro = sorteio() * Math.PI;
    p.cor = escolher(CORES_GRAO, sorteio);
    lista.push(p);
  }
  return lista;
}

// Clique em algo clicável (botão, carta): em vez de pó, um aro de ouro e
// fagulhas curtas, que dizem "pegou" sem sujar a carta.
export function emitirFaiscas(x: number, y: number, sorteio: () => number): Particula[] {
  const lista: Particula[] = [];
  const aro = base('aro', x, y);
  aro.vida = 0.35;
  aro.tamanho = 4;
  aro.tamanhoFinal = 30;
  aro.opacidade = 0.8;
  aro.cor = '#ffe39a';
  lista.push(aro);
  const quantidade = 7;
  for (let i = 0; i < quantidade; i++) {
    const p = base('faisca', x, y);
    const angulo = (i / quantidade) * Math.PI * 2 + sorteio() * 0.5;
    const velocidade = 160 + sorteio() * 140;
    p.vx = Math.cos(angulo) * velocidade;
    p.vy = Math.sin(angulo) * velocidade;
    p.vida = 0.28 + sorteio() * 0.2;
    p.tamanho = 2 + sorteio() * 1.6;
    p.tamanhoFinal = 0.6;
    p.cor = escolher(CORES_FAISCA, sorteio);
    lista.push(p);
  }
  return lista;
}

// Avança a simulação e devolve só as partículas ainda vivas.
export function atualizarParticulas(lista: Particula[], segundos: number): Particula[] {
  const dt = Math.min(0.05, Math.max(0, segundos));
  const vivas: Particula[] = [];
  for (const p of lista) {
    p.idade += dt;
    if (p.idade >= p.vida) continue;
    if (p.tipo === 'nuvem') {
      const freio = Math.exp(-ARRASTO_NUVEM * dt);
      p.vx *= freio;
      p.vy = p.vy * freio - 6 * dt;
    } else if (p.tipo === 'grao') {
      p.vy += GRAVIDADE * dt;
      p.giro += p.vx * 0.02 * dt;
    } else if (p.tipo === 'faisca') {
      const freio = Math.exp(-6 * dt);
      p.vx *= freio;
      p.vy *= freio;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    // O grão quica uma vez no tampo, perdendo quase toda a força, e depois para.
    if (p.tipo === 'grao' && p.y > p.chao && p.vy > 0) {
      p.y = p.chao;
      if (p.quicou) {
        p.vy = 0;
        p.vx *= 0.5;
      } else {
        p.quicou = true;
        p.vy *= -0.32;
        p.vx *= 0.6;
      }
    }
    vivas.push(p);
  }
  return vivas;
}

// Fração da vida (0 a 1) com saída suave: some devagar no fim.
export function progresso(p: Particula): number {
  return Math.min(1, p.idade / p.vida);
}

export function opacidadeAtual(p: Particula): number {
  const t = progresso(p);
  if (p.tipo === 'nuvem') return p.opacidade * (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85);
  if (p.tipo === 'grao') return t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
  return p.opacidade * (1 - t) ** 1.5;
}

export function tamanhoAtual(p: Particula): number {
  const t = progresso(p);
  // Sai rápido e desacelera (ease-out), como fumaça abrindo.
  const suave = 1 - (1 - t) ** 3;
  return p.tamanho + (p.tamanhoFinal - p.tamanho) * suave;
}
