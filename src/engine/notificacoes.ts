// Fila das notificações do Grimório (01-tema-e-hud.md §5): cada uma fica 3 s.
export const DURACAO_NOTIFICACAO_MS = 3000;
export const MAXIMO_NOTIFICACOES = 3;

export interface Notificacao {
  id: number;
  texto: string;
  expiraEm: number;
}

export function adicionarNotificacao(lista: Notificacao[], texto: string, agora: number, id: number): Notificacao[] {
  return [...lista, { id, texto, expiraEm: agora + DURACAO_NOTIFICACAO_MS }].slice(-MAXIMO_NOTIFICACOES);
}

export function removerExpiradas(lista: Notificacao[], agora: number): Notificacao[] {
  return lista.filter((notificacao) => notificacao.expiraEm > agora);
}
