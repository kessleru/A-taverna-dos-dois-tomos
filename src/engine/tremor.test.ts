import { describe, expect, it } from 'vitest';
import { DESLOCAMENTO_MAX_PX, decairTrauma, deslocamentoTremor, somarTrauma } from './tremor';

describe('tremor por trauma', () => {
  it('trauma soma e não passa de 1', () => {
    expect(somarTrauma(0.6, 0.6)).toBe(1);
    expect(somarTrauma(0.2, 0.3)).toBeCloseTo(0.5);
  });

  it('trauma cai com o tempo até zero', () => {
    expect(decairTrauma(1, 0.3)).toBeLessThan(1);
    expect(decairTrauma(1, 5)).toBe(0);
  });

  it('sem trauma, a câmera fica parada', () => {
    const d = deslocamentoTremor(0, 1.23);
    expect([Math.abs(d.x), Math.abs(d.y), Math.abs(d.giro), d.escala]).toEqual([0, 0, 0, 1]);
  });

  it('tremor pequeno é bem menor que o grande (quadrado do trauma)', () => {
    let maxPequeno = 0;
    let maxGrande = 0;
    for (let t = 0; t < 2; t += 0.01) {
      maxPequeno = Math.max(maxPequeno, Math.abs(deslocamentoTremor(0.3, t).x));
      maxGrande = Math.max(maxGrande, Math.abs(deslocamentoTremor(1, t).x));
    }
    expect(maxGrande).toBeLessThanOrEqual(DESLOCAMENTO_MAX_PX);
    expect(maxPequeno).toBeLessThan(maxGrande * 0.15);
  });
});
