import { describe, expect, it } from 'vitest';
import { escolherFala } from './falas';

describe('escolherFala', () => {
  const grupo = ['a', 'b', 'c'];

  it('usa o sorteio (0 a 1) para escolher dentro do grupo', () => {
    expect(escolherFala(grupo, 0)).toBe('a');
    expect(escolherFala(grupo, 0.5)).toBe('b');
    expect(escolherFala(grupo, 0.99)).toBe('c');
  });

  it('não repete a última fala quando há outra opção', () => {
    expect(escolherFala(grupo, 0, 'a')).not.toBe('a');
    expect(escolherFala(grupo, 0.99, 'c')).not.toBe('c');
  });

  it('grupo de uma fala só repete sem problema', () => {
    expect(escolherFala(['a'], 0.7, 'a')).toBe('a');
  });

  it('grupo vazio não quebra', () => {
    expect(escolherFala([], 0.3)).toBeUndefined();
  });

  it('sorteio fora da faixa não sai do grupo', () => {
    expect(grupo).toContain(escolherFala(grupo, 1));
    expect(grupo).toContain(escolherFala(grupo, -0.2));
  });
});
