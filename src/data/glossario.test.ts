import { describe, expect, it } from 'vitest';
import { GLOSSARIO } from './glossario';

describe('palavras-chave das cartas', () => {
  it('cada palavra-chave tem termo e texto', () => {
    for (const [carta, palavras] of Object.entries(GLOSSARIO)) {
      for (const { termo, texto } of palavras) {
        expect(termo.trim(), carta).not.toBe('');
        expect(texto.trim(), `${carta}: ${termo}`).not.toBe('');
      }
    }
  });

  it('poucas e curtas: é uma nota ao lado da carta, não uma aula', () => {
    for (const palavras of Object.values(GLOSSARIO)) {
      expect(palavras.length).toBeLessThanOrEqual(2);
      for (const { texto } of palavras) expect(texto.length).toBeLessThanOrEqual(130);
    }
  });

  it('termo repetido entre cartas tem o mesmo texto (aparece uma vez só na sessão)', () => {
    const textos = new Map<string, string>();
    for (const palavras of Object.values(GLOSSARIO)) {
      for (const { termo, texto } of palavras) {
        if (textos.has(termo)) expect(textos.get(termo)).toBe(texto);
        textos.set(termo, texto);
      }
    }
  });
});
