// Som do clique na mesa (como no Hearthstone, onde clicar no campo solta um
// "toc" de pedrinha e um pouco de poeira). É sintetizado na hora com Web
// Audio, sem arquivo: cada clique sai um pouco diferente e não pesa no
// carregamento.

export interface ParametrosBatida {
  // Multiplica as frequências (variação de tom de clique a clique).
  tom: number;
  // Volume geral, já contando a força do clique.
  volume: number;
  // Grãos de poeira caindo depois do toque: atraso (s) e volume de cada um.
  graos: { atraso: number; volume: number }[];
}

export const VOLUME_BATIDA = 0.22;

// Força 1 é um clique comum; cliques seguidos no mesmo lugar sobem até ~2,
// e a batida fica mais cheia e um tom mais aguda, como no Hearthstone.
export function parametrosBatida(forca: number, sorteio: () => number): ParametrosBatida {
  const f = Math.min(2.2, Math.max(1, forca));
  const tom = (0.9 + sorteio() * 0.2) * (1 + (f - 1) * 0.12);
  const quantidade = 1 + Math.round((f - 1) * 3 + sorteio() * 2);
  const graos = Array.from({ length: quantidade }, () => ({
    atraso: 0.05 + sorteio() * 0.16 * f,
    volume: 0.12 + sorteio() * 0.18,
  }));
  return { tom, volume: VOLUME_BATIDA * (0.8 + (f - 1) * 0.35), graos };
}

let ruidoCache: AudioBuffer | null = null;

function ruido(ctx: BaseAudioContext): AudioBuffer {
  if (ruidoCache && ruidoCache.sampleRate === ctx.sampleRate) return ruidoCache;
  const tamanho = Math.floor(ctx.sampleRate * 0.5);
  const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1;
  ruidoCache = buffer;
  return buffer;
}

// Ruído filtrado com envelope curto: a base de todo o som.
function estalo(ctx: BaseAudioContext, destino: AudioNode, inicio: number, filtro: BiquadFilterType, freq: number, q: number, pico: number, duracao: number) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido(ctx);
  const passa = ctx.createBiquadFilter();
  passa.type = filtro;
  passa.frequency.value = freq;
  passa.Q.value = q;
  const ganho = ctx.createGain();
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(pico, inicio + 0.003);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
  fonte.connect(passa).connect(ganho).connect(destino);
  // Começa num ponto qualquer do ruído, para dois estalos não soarem iguais.
  fonte.start(inicio, Math.random() * 0.2, duracao + 0.02);
}

// Toque de madeira + baque grave + grãos caindo.
export function tocarBatida(ctx: BaseAudioContext, destino: AudioNode, p: ParametrosBatida) {
  const t = ctx.currentTime + 0.005;
  const saida = ctx.createGain();
  saida.gain.value = p.volume;
  saida.connect(destino);

  // Estalo seco da ponta (pedrinha batendo).
  estalo(ctx, saida, t, 'highpass', 2600 * p.tom, 0.7, 0.55, 0.035);
  // Corpo de madeira do tampo.
  estalo(ctx, saida, t, 'bandpass', 720 * p.tom, 1.3, 0.9, 0.13);
  // Baque grave: seno que cai de tom.
  const grave = ctx.createOscillator();
  grave.type = 'sine';
  grave.frequency.setValueAtTime(150 * p.tom, t);
  grave.frequency.exponentialRampToValueAtTime(52, t + 0.11);
  const ganhoGrave = ctx.createGain();
  ganhoGrave.gain.setValueAtTime(0.0001, t);
  ganhoGrave.gain.exponentialRampToValueAtTime(0.7, t + 0.004);
  ganhoGrave.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  grave.connect(ganhoGrave).connect(saida);
  grave.start(t);
  grave.stop(t + 0.16);
  // Grãos de poeira voltando para a mesa.
  for (const grao of p.graos) {
    estalo(ctx, saida, t + grao.atraso, 'bandpass', (3200 + Math.random() * 1800) * p.tom, 2.5, grao.volume, 0.025);
  }
}
