import { describe, expect, it } from 'vitest';
import { DURACAO_NOTIFICACAO_MS, adicionarNotificacao, removerExpiradas } from './notificacoes';

describe('notificações do Grimório', () => {
  it('nova notificação expira 3 s depois', () => {
    expect(adicionarNotificacao([], 'CAIXA −15', 1000, 1)).toEqual([
      { id: 1, texto: 'CAIXA −15', expiraEm: 1000 + DURACAO_NOTIFICACAO_MS },
    ]);
  });

  it('mantém no máximo 3, descartando as mais antigas', () => {
    let lista = adicionarNotificacao([], 'a', 0, 1);
    lista = adicionarNotificacao(lista, 'b', 10, 2);
    lista = adicionarNotificacao(lista, 'c', 20, 3);
    lista = adicionarNotificacao(lista, 'd', 30, 4);
    expect(lista.map((n) => n.texto)).toEqual(['b', 'c', 'd']);
  });

  it('remove as vencidas, inclusive a que vence exatamente agora', () => {
    const lista = [
      { id: 1, texto: 'a', expiraEm: 100 },
      { id: 2, texto: 'b', expiraEm: 200 },
    ];
    expect(removerExpiradas(lista, 100)).toEqual([{ id: 2, texto: 'b', expiraEm: 200 }]);
  });
});
