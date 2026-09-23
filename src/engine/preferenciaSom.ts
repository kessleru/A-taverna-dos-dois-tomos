// Chave nova de propósito: a antiga ('sa-mudo') gravava "mudo" por padrão e
// deixaria mudas as abas que já abriram o jogo antes desta mudança.
export const CHAVE_MUDO = 'sa-mudo-v2';

// O som começa ligado; só fica mudo se alguém desligou nesta sessão (tecla M).
export function lerMudo(salvo: string | null): boolean {
  return salvo === 'true';
}
