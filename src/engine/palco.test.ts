import { describe, expect, it } from 'vitest';
import { enquadrarPalco } from './palco';

describe('enquadrarPalco', () => {
  it('1920×1080 fica em escala 1, sem tarjas', () => {
    expect(enquadrarPalco(1920, 1080)).toEqual({ escala: 1, x: 0, y: 0 });
  });

  it('1366×768 limita pela altura e centraliza na horizontal', () => {
    const { escala, x, y } = enquadrarPalco(1366, 768);
    expect(escala).toBeCloseTo(768 / 1080, 6);
    expect(x).toBeCloseTo((1366 - 1920 * escala) / 2, 6);
    expect(y).toBe(0);
  });

  it('ultralarga 2560×1080 tem tarjas só nos lados', () => {
    expect(enquadrarPalco(2560, 1080)).toEqual({ escala: 1, x: 320, y: 0 });
  });

  it('4:3 (1024×768) tem tarjas em cima e embaixo', () => {
    const { escala, x, y } = enquadrarPalco(1024, 768);
    expect(escala).toBeCloseTo(1024 / 1920, 6);
    expect(x).toBe(0);
    expect(y).toBeCloseTo((768 - 1080 * escala) / 2, 6);
  });

  it('janela minimizada (0×0 ou negativa) não gera escala negativa nem NaN', () => {
    expect(enquadrarPalco(0, 0)).toEqual({ escala: 0, x: 0, y: 0 });
    expect(enquadrarPalco(-10, 500)).toEqual({ escala: 0, x: 0, y: 0 });
  });
});
