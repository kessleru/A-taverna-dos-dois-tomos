import { describe, expect, it } from 'vitest';
import { proximoClipe } from './murmurio';

describe('proximoClipe', () => {
  it('nunca repete o clipe que está tocando', () => {
    for (const sorteio of [0, 0.3, 0.6, 0.99]) {
      expect(proximoClipe(3, 1, sorteio)).not.toBe(1);
    }
  });

  it('começa por qualquer clipe e aguenta sorteio 1', () => {
    expect(proximoClipe(3, -1, 0)).toBe(0);
    expect(proximoClipe(3, -1, 1)).toBe(2);
  });

  it('com um clipe só, repete ele', () => {
    expect(proximoClipe(1, 0, 0.5)).toBe(0);
  });
});
