import { Howl } from 'howler';

const VOLUME_MURMURIO = 0.07;
// Sobreposição entre um clipe e o próximo, para não dar para ouvir a emenda.
const CRUZAMENTO_MS = 2500;

// Próximo clipe: sorteado entre os outros, para não repetir o que está tocando.
export function proximoClipe(total: number, atual: number, sorteio: number): number {
  if (total <= 1) return 0;
  const opcoes = Array.from({ length: total }, (_, i) => i).filter((i) => i !== atual);
  return opcoes[Math.min(opcoes.length - 1, Math.floor(sorteio * opcoes.length))];
}

// Murmúrio da taverna (08-assets.md): três clipes curtos de público que se
// revezam com crossfade, formando um fundo contínuo sem emenda audível.
export class Murmurio {
  readonly clipes: Howl[];
  private atual = -1;
  private temporizador: number | null = null;

  constructor(arquivos: string[]) {
    this.clipes = arquivos.map((src) => new Howl({ src: [src], volume: 0 }));
  }

  get tocando(): boolean {
    return this.temporizador !== null;
  }

  iniciar(): void {
    if (this.tocando) return;
    this.proximo();
  }

  parar(): void {
    if (this.temporizador !== null) window.clearTimeout(this.temporizador);
    this.temporizador = null;
    for (const clipe of this.clipes) clipe.stop();
    this.atual = -1;
  }

  descarregar(): void {
    this.parar();
    for (const clipe of this.clipes) clipe.unload();
  }

  private proximo(): void {
    const indice = proximoClipe(this.clipes.length, this.atual, Math.random());
    const anterior = this.clipes[this.atual];
    if (anterior?.playing()) {
      anterior.fade(anterior.volume(), 0, CRUZAMENTO_MS);
      anterior.once('fade', () => anterior.stop());
    }
    this.atual = indice;
    const clipe = this.clipes[indice];
    clipe.volume(0);
    clipe.play();
    clipe.fade(0, VOLUME_MURMURIO, CRUZAMENTO_MS);
    // Clipe ainda sem duração (não carregou): tenta de novo em 20 s.
    const duracao = clipe.duration() * 1000 || 20000;
    this.temporizador = window.setTimeout(() => this.proximo(), Math.max(4000, duracao - CRUZAMENTO_MS));
  }
}
