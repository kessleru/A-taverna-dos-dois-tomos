// Fio da história entre as etapas: o "Até aqui" que abre cada capítulo depois
// do primeiro lembra a escolha da etapa anterior e o destino que ela trouxe,
// para o novo desafio continuar a história da turma, e não começar do zero.
import { etapas, revelacaoBricolagem, type Escolha, type Logica } from '../data/rodada';

export interface AteAqui {
  // Nome curto da etapa anterior ("Fundação") e a carta que a turma jogou nela.
  fase: string;
  logica: Logica;
  // Título da Carta do Destino que fechou a etapa anterior, se houve.
  destino?: string;
}

export function nomeDaFase(fase: string): string {
  return fase.replace(/^\d+\s*·\s*/, '');
}

export function ateAqui(etapa: number, escolhas: Escolha[], bricolagem: boolean, ultimoDestino?: string): AteAqui | null {
  const anterior = etapa - 1;
  const escolha = escolhas[anterior];
  if (anterior < 0 || !escolha) return null;
  // Quem adaptou na fundação descobriu a Bricolagem: é ela que a história lembra.
  const logica: Logica = bricolagem && anterior === revelacaoBricolagem.etapa ? 'bricolagem' : escolha;
  return { fase: nomeDaFase(etapas[anterior].fase), logica, destino: ultimoDestino };
}

// Anos que a passagem do tempo folheia entre dois capítulos, do ano em que o
// anterior começou até o ano do novo (2017 → 2018 → 2019).
export function anosEntre(de: number, ate: number): number[] {
  if (!(ate > de)) return [ate];
  return Array.from({ length: ate - de + 1 }, (_, i) => de + i);
}
