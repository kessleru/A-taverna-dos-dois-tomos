import { describe, expect, it } from 'vitest';
import { ICONES } from './icones';

describe('ICONES', () => {
  it('tem os ícones usados no jogo', () => {
    for (const nome of ['quill-ink', 'wax-seal', 'padlock', 'crossed-chains']) {
      expect(ICONES[nome]).toMatch(/^<svg/);
    }
  });

  it('todo ícone pinta com a cor do texto e não tem fundo preto', () => {
    for (const [nome, svg] of Object.entries(ICONES)) {
      expect(svg, nome).toContain('currentColor');
      expect(svg, nome).not.toContain('M0 0h512v512H0z');
    }
  });
});
