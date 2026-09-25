import { describe, expect, it } from 'vitest';
import { avaliarTeclaAjuda } from './ajuda';

describe('teclas do painel de atalhos', () => {
  it('? e H abrem e fecham', () => {
    expect(avaliarTeclaAjuda('?', false, false)).toBe('alternar');
    expect(avaliarTeclaAjuda('h', false, true)).toBe('alternar');
  });

  it('com Ctrl/Alt não é o atalho (Ctrl+H do navegador)', () => {
    expect(avaliarTeclaAjuda('h', true, false)).toBe('passar');
  });

  it('fechado, as outras teclas vão para o jogo', () => {
    expect(avaliarTeclaAjuda('ArrowRight', false, false)).toBe('passar');
  });

  it('aberto, → só fecha o painel (a rodada não avança por baixo)', () => {
    expect(avaliarTeclaAjuda('ArrowRight', false, true)).toBe('fechar');
    expect(avaliarTeclaAjuda('Escape', false, true)).toBe('fechar');
  });

  it('aberto, som e tela cheia continuam valendo', () => {
    expect(avaliarTeclaAjuda('m', false, true)).toBe('passar');
    expect(avaliarTeclaAjuda('F', false, true)).toBe('passar');
  });
});
