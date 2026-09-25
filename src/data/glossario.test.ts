import { describe, expect, it } from 'vitest';
import { GLOSSARIO } from './glossario';

describe('palavras-chave das cartas', () => {
  it('toda carta que amplia tem ao menos uma palavra-chave com texto', () => {
    for (const [carta, palavras] of Object.entries(GLOSSARIO)) {
      expect(palavras.length, carta).toBeGreaterThan(0);
      for (const { termo, texto } of palavras) {
        expect(termo.trim(), carta).not.toBe('');
        expect(texto.trim(), `${carta}: ${termo}`).not.toBe('');
      }
    }
  });

  it('cabe ao lado da carta ampliada (no máximo 3 caixas curtas)', () => {
    for (const palavras of Object.values(GLOSSARIO)) {
      expect(palavras.length).toBeLessThanOrEqual(3);
      for (const { texto } of palavras) expect(texto.length).toBeLessThanOrEqual(190);
    }
  });
});
