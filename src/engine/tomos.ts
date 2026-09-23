// Ciclo de clique numa carta de tomo na folha 2 do briefing
// (docs/redesign/10-briefing-quadro.md §4): vira, mostra estratégia e
// solução, volta para a fala do narrador.
export type EstadoTomo = 'fechado' | 'aberto' | 'detalhes';

export function proximoEstadoTomo(estado: EstadoTomo): EstadoTomo {
  return estado === 'aberto' ? 'detalhes' : 'aberto';
}
