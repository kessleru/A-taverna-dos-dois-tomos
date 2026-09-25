import { motion, useReducedMotion } from 'framer-motion';
import type { Etapa } from '../../data/rodada';
import { nomeDaFase, type AteAqui } from '../../engine/historia';
import { useSonsEmSequencia } from '../../engine/useSonsEmSequencia';
import { COR, NOME, SIGILO } from '../cartas/logicas';
import { Icone } from '../ui/Icone';

// Abertura de capítulo, acima do desafio: o número e a época (o tempo passa
// entre as etapas), uma frase que liga o capítulo anterior a este e, do
// segundo em diante, o "Até aqui" com a carta que a turma jogou e o destino
// que ela trouxe. A história da turma continua, não recomeça a cada etapa.
export function AberturaCapitulo({ etapa, ateAqui }: { etapa: Etapa; ateAqui: AteAqui | null }) {
  const reduzido = useReducedMotion();
  const { numero, periodo, abertura } = etapa.capitulo;
  const entrar = (atraso: number) => ({
    initial: reduzido ? false : { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduzido ? 0 : atraso },
  });
  useSonsEmSequencia([['pagina', 0]]);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <motion.p className="filigrana font-titulo text-[26px] font-bold uppercase tracking-[0.14em] text-ouro [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]" {...entrar(0)}>
        Capítulo {numero} · {nomeDaFase(etapa.fase)} · {periodo}
      </motion.p>
      <motion.p
        className="max-w-[1180px] font-texto text-[30px] italic leading-snug text-pergaminho/90 [text-shadow:0_2px_4px_rgb(0_0_0/0.95)]"
        {...entrar(0.25)}
      >
        {abertura}
      </motion.p>
      {ateAqui && (
        <motion.div className="mt-1 flex items-center gap-3" {...entrar(0.5)}>
          <span className="font-titulo text-[18px] font-bold uppercase tracking-[0.14em] text-ouro/75 [text-shadow:0_2px_3px_rgb(0_0_0/0.9)]">Até aqui</span>
          <span className="placa-ferro-pequena flex items-center gap-2 px-4 py-1 font-texto text-[22px] text-pergaminho">
            <span style={{ color: COR[ateAqui.logica] }}>
              <Icone nome={SIGILO[ateAqui.logica]} className="h-6 w-6" />
            </span>
            {ateAqui.fase}: {NOME[ateAqui.logica]}
          </span>
          {ateAqui.destino && (
            <>
              <span className="font-titulo text-[20px] text-ouro/70" aria-hidden>
                ➝
              </span>
              <span className="placa-ferro-pequena flex items-center gap-2 px-4 py-1 font-texto text-[22px] text-pergaminho">
                <span className="text-[#b9a6ff]">
                  <Icone nome="candle-light" className="h-6 w-6" />
                </span>
                Destino: {ateAqui.destino}
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
