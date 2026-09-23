import { describe, expect, it } from 'vitest';
import { caminhoSeta, posicionarBalao } from './guia';

describe('posicionarBalao', () => {
  it('põe o balão embaixo de um alvo no alto do palco', () => {
    const balao = posicionarBalao({ x: 1400, y: 60, largura: 440, altura: 180 }, 720, 240);
    expect(balao.lado).toBe('abaixo');
    expect(balao.y).toBeGreaterThan(240);
    // Não sai do palco pela direita.
    expect(balao.x + balao.largura).toBeLessThanOrEqual(1920 - 32);
  });

  it('põe o balão em cima de um alvo no pé do palco', () => {
    const balao = posicionarBalao({ x: 800, y: 620, largura: 600, altura: 420 }, 720, 240);
    expect(balao.lado).toBe('acima');
    expect(balao.y + balao.altura).toBeLessThanOrEqual(620);
  });
});

describe('caminhoSeta', () => {
  it('liga a borda do balão à borda do alvo', () => {
    const alvo = { x: 800, y: 620, largura: 600, altura: 420 };
    const balao = posicionarBalao(alvo, 720, 240);
    const seta = caminhoSeta(balao, alvo);
    expect(seta.d.startsWith('M ')).toBe(true);
    expect(seta.fim.y).toBe(alvo.y - 12);
  });
});
