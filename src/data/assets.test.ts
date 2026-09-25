import { describe, expect, it } from 'vitest';
import { IMAGENS } from './assets';
import { arteEventos, arteLendaria, artesArtigos, artesDecisoes, artesEtapas } from './artes';

describe('IMAGENS a pré-carregar', () => {
  it('inclui a arte de todas as cartas do jogo', () => {
    const artes = [
      ...Object.values(artesArtigos),
      ...Object.values(artesDecisoes),
      ...Object.values(artesEtapas),
      ...Object.values(arteEventos),
      arteLendaria,
    ];
    for (const arte of artes) {
      if (arte.imagem) expect(IMAGENS).toContain(arte.imagem);
    }
  });

  it('inclui cenário, verso e texturas', () => {
    for (const trecho of ['cenario/taverna-fundo', 'cenario/tampo-mesa', 'cenario/pergaminho', 'cenario/quadro-tabuas', 'cartas/verso']) {
      expect(IMAGENS.some((url) => url.includes(trecho))).toBe(true);
    }
  });

  it('todo arquivo da lista existe em public/assets', () => {
    const arquivos = new Set(Object.keys(import.meta.glob('/public/assets/**/*.{webp,svg}')).map((c) => c.replace('/public/', import.meta.env.BASE_URL)));
    expect(IMAGENS.filter((url) => !arquivos.has(url))).toEqual([]);
  });

  it('não repete arquivos e usa o caminho base do site', () => {
    expect(new Set(IMAGENS).size).toBe(IMAGENS.length);
    for (const url of IMAGENS) expect(url.startsWith(import.meta.env.BASE_URL)).toBe(true);
  });
});
