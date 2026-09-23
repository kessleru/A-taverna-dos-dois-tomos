import { describe, expect, it } from 'vitest';
import { lerMudo } from './preferenciaSom';

describe('lerMudo', () => {
  it('sem nada salvo, o som começa ligado', () => {
    expect(lerMudo(null)).toBe(false);
  });

  it('respeita quem desligou o som nesta sessão', () => {
    expect(lerMudo('true')).toBe(true);
  });

  it('respeita quem religou o som', () => {
    expect(lerMudo('false')).toBe(false);
  });

  it('valor estranho no armazenamento não deixa o jogo mudo', () => {
    expect(lerMudo('talvez')).toBe(false);
  });
});
