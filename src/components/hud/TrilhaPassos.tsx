import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { eventos } from '../../data/rodada';
import type { Passo } from '../../engine/motor';
import { mola } from '../../styles/movimento';

interface No {
  id: string;
  rotulo: string;
  passos: Passo[];
}

// O ciclo de cada etapa, na ordem em que acontece (02-jogabilidade.md §2).
const CICLO: No[] = [
  { id: 'desafio', rotulo: 'Desafio', passos: ['situacao'] },
  { id: 'voto', rotulo: 'Voto', passos: ['votacao'] },
  { id: 'dado', rotulo: 'Dado', passos: ['dado', 'consequencia'] },
  { id: 'cronica', rotulo: 'Crônica', passos: ['bricolagem', 'cronica'] },
];
const DESTINO: No = { id: 'destino', rotulo: 'Destino', passos: ['evento'] };
const FORJA: No = { id: 'forja', rotulo: 'Forja', passos: ['forja'] };

// O que a turma faz agora, em uma linha (a explicação do jogo acompanha a rodada).
function dica(passo: Passo, opcoes: number): string {
  switch (passo) {
    case 'situacao':
      return 'Leiam o desafio: é o que a startup real enfrentou.';
    case 'votacao':
      return `Discutam e levantem a mão: carta ${opcoes === 3 ? '1, 2 ou 3' : '1 ou 2'}.`;
    case 'dado':
      return 'O contexto dá bônus. Rolem o Dado do Destino!';
    case 'consequencia':
      return 'Vejam o que a escolha causou nos marcadores.';
    case 'bricolagem':
      return 'O Adaptar da fundação escondia outra carta.';
    case 'cronica':
      return 'Agora os tomos contam o que aconteceu de verdade.';
    case 'evento':
      return 'Uma Carta do Destino: o acaso também escreve a história.';
    case 'forja':
      return 'Quem viveu as duas lógicas pode forjar a Combinar.';
  }
}

// Trilha no alto da rodada: onde a etapa está e o que fazer agora.
export function TrilhaPassos({ passo, etapa, opcoes }: { passo: Passo; etapa: number; opcoes: number }) {
  const reduzido = useReducedMotion();
  const temDestino = eventos.some((e) => e.depoisDaEtapa === etapa);
  const nos = [...(passo === 'forja' ? [FORJA] : []), ...CICLO, ...(temDestino ? [DESTINO] : [])];
  const atual = nos.findIndex((no) => no.passos.includes(passo));

  return (
    <div className="flex flex-col items-center gap-3" aria-label="Passos da etapa">
      <ol className="relative flex items-start">
        {nos.map((no, i) => {
          const feito = i < atual;
          const agora = i === atual;
          return (
            <li key={no.id} className="relative flex w-[128px] flex-col items-center gap-1.5">
              {/* Trecho da estrada até o próximo passo; enche de ouro quando passa. */}
              {i < nos.length - 1 && (
                <span className="absolute left-1/2 top-[14px] h-[3px] w-full bg-pergaminho/15" aria-hidden>
                  <motion.span
                    className="block h-full origin-left bg-gradient-to-r from-ouro to-ouro-escuro"
                    initial={false}
                    animate={{ scaleX: feito ? 1 : 0 }}
                    transition={{ duration: reduzido ? 0 : 0.5, ease: 'easeOut' }}
                  />
                </span>
              )}
              <motion.span
                className="relative flex h-[30px] w-[30px] items-center justify-center border-2"
                style={{
                  rotate: 45,
                  borderColor: feito || agora ? 'var(--ouro)' : 'rgb(243 230 200 / 0.3)',
                  background: feito ? 'var(--ouro)' : agora ? 'rgb(58 36 18)' : 'rgb(20 13 8 / 0.8)',
                  boxShadow: agora ? '0 0 16px var(--ouro)' : undefined,
                }}
                animate={agora && !reduzido ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={agora ? { duration: 1.4, repeat: Infinity } : mola.carta}
              >
                {agora && <span className="h-2.5 w-2.5 bg-ouro" />}
              </motion.span>
              <span
                className={`font-titulo text-[18px] font-bold uppercase tracking-[0.08em] [text-shadow:0_1px_3px_rgb(0_0_0/0.95)] ${
                  agora ? 'text-ouro' : feito ? 'text-pergaminho/80' : 'text-pergaminho/40'
                }`}
              >
                {no.rotulo}
              </span>
            </li>
          );
        })}
      </ol>
      <AnimatePresence mode="wait">
        <motion.p
          key={passo}
          className="max-w-[720px] text-center font-texto text-[24px] italic leading-tight text-pergaminho/90 [text-shadow:0_2px_4px_rgb(0_0_0/0.95)]"
          initial={reduzido ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
        >
          {dica(passo, opcoes)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
