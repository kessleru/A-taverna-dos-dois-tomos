import { beforeEach, describe, expect, it } from 'vitest';
import { avaliarEvento, destravar, travado, travar } from './trava';

describe('trava de cliques', () => {
  beforeEach(() => destravar());

  it('o primeiro clique passa e trava os seguintes até o efeito acabar', () => {
    expect(avaliarEvento({ tipo: 'click' }, 0)).toBe('aceitar');
    travar(700, 0);
    expect(avaliarEvento({ tipo: 'click' }, 300)).toBe('bloquear');
    expect(avaliarEvento({ tipo: 'click' }, 700)).toBe('aceitar');
  });

  it('cliques bloqueados não estendem a trava', () => {
    travar(700, 0);
    avaliarEvento({ tipo: 'click' }, 600);
    expect(travado(701)).toBe(false);
  });

  it('uma trava maior (virada de página) não é encurtada por uma menor', () => {
    travar(900, 0);
    travar(700, 100);
    expect(travado(850)).toBe(true);
    expect(travado(900)).toBe(false);
  });

  it('só as teclas de ação passam pela trava', () => {
    travar(700, 0);
    expect(avaliarEvento({ tipo: 'keydown', tecla: 'ArrowRight' }, 100)).toBe('bloquear');
    expect(avaliarEvento({ tipo: 'keydown', tecla: 'm' }, 100)).toBe('ignorar');
    expect(avaliarEvento({ tipo: 'keydown', tecla: 'ArrowRight' }, 800)).toBe('aceitar');
  });

  it('tecla segurada (repetição) nunca dispara ações em série', () => {
    expect(avaliarEvento({ tipo: 'keydown', tecla: ' ', repeticao: true }, 5000)).toBe('bloquear');
  });

  it('o clique sintético do Enter num botão não é barrado pela própria tecla', () => {
    travar(700, 0);
    expect(avaliarEvento({ tipo: 'click', doTeclado: true }, 10)).toBe('ignorar');
  });
});
