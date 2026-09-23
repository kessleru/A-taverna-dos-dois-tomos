import { describe, expect, it } from 'vitest';
import { navegarFolha } from './folhas';

describe('navegarFolha', () => {
  it('avança para a próxima folha', () => {
    expect(navegarFolha(0, 4, 1)).toEqual({ tipo: 'folha', folha: 1 });
  });

  it('volta para a folha anterior', () => {
    expect(navegarFolha(2, 4, -1)).toEqual({ tipo: 'folha', folha: 1 });
  });

  it('na última folha, avançar sai da fase para frente', () => {
    expect(navegarFolha(3, 4, 1)).toEqual({ tipo: 'sair', direcao: 1 });
  });

  it('na primeira folha, voltar sai da fase para trás', () => {
    expect(navegarFolha(0, 4, -1)).toEqual({ tipo: 'sair', direcao: -1 });
  });

  it('folha salva fora do intervalo (sessão antiga) é corrigida antes de navegar', () => {
    expect(navegarFolha(9, 4, -1)).toEqual({ tipo: 'folha', folha: 2 });
    expect(navegarFolha(-5, 4, 1)).toEqual({ tipo: 'folha', folha: 1 });
  });
});
