import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { Escolha, Etapa } from '../../data/rodada';
import { briefing } from '../../data/rodada';
import { retratosNarradores } from '../../data/artes';
import { ArtePintada } from '../ui/ArtePintada';
import { mola } from '../../styles/movimento';
import { Impacto } from '../ui/Particulas';
import { useSonsEmSequencia } from '../../engine/useSonsEmSequencia';
import { TREMOR, useTremorAoMontar } from '../ui/Tremor';

const NOMES: Record<Escolha, string> = { planejar: 'Planejar', adaptar: 'Adaptar', combinar: 'Combinar' };

function Retrato({ id }: { id: 'A' | 'B' }) {
  const cor = id === 'A' ? 'var(--tomo-a)' : 'var(--tomo-b)';
  return (
    <img
      src={retratosNarradores[id]}
      alt=""
      className="medalhao m-2 h-[132px] w-[132px] shrink-0 object-cover"
      style={{ '--gema': cor } as CSSProperties}
    />
  );
}

// Crônica (03-historia.md §5): a Cronista conta o que a Healthy Skin fez, com
// a citação real, e o Cartógrafo diz o que a literatura mostra. Um selo de
// cera diz se a turma fez como a startup real.
export function Cronica({ etapa, escolha }: { etapa: Etapa; escolha: Escolha }) {
  const { narradores } = briefing.tomos;
  const igual = escolha === etapa.ideal;
  // O tomo abre e o selo de cera bate junto com a animação dele.
  useSonsEmSequencia([
    ['livro-abrir', 0],
    ['selo', 1000],
  ]);
  useTremorAoMontar(TREMOR.leve, 1000);

  return (
    <div className="relative flex w-full max-w-[1320px] flex-col gap-6" data-guia="narradores">
      <motion.div
        className="absolute -right-2 -top-24 z-10 flex items-center gap-3"
        initial={{ scale: 3, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: -6 }}
        transition={{ ...mola.impacto, delay: 0.8 }}
      >
        <span className={`selo-pintado relative ${igual ? '' : '[&>img]:brightness-75 [&>img]:saturate-50'}`}>
          <Impacto cor={igual ? 'var(--cera)' : 'var(--dano)'} gotas onda={110} raio={80} quantidade={9} atraso={0.95} />
          <ArtePintada nome="selo" className="h-24 w-24" />
        </span>
        <span
          className={`max-w-[300px] font-titulo text-[28px] font-bold leading-tight [text-shadow:0_2px_4px_rgb(0_0_0/0.9)] ${igual ? 'text-ouro' : 'text-dano'}`}
        >
          {igual ? 'Como na história real' : `A Healthy Skin fez diferente: ${NOMES[etapa.ideal]}`}
        </span>
      </motion.div>

      {/* A Cronista (Tomo B): o que aconteceu de verdade. */}
      <motion.div className="flex items-start gap-6" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={mola.suave}>
        <Retrato id="B" />
        <div className="pergaminho-sombra flex-1">
          <div className="pergaminho pergaminho-nota border-l-8 [border-color:var(--tomo-b)]">
            <p className="font-titulo text-[26px] font-bold">
              {narradores.B.nome} <span className="font-texto text-[22px] font-medium italic text-tinta/70">· o que a Healthy Skin fez</span>
            </p>
            <p className="mt-2 font-texto text-[32px] italic leading-snug">“{etapa.cronica.texto}”</p>
            {etapa.cronica.citacao && (
              <p className="mt-3 font-texto text-[26px] leading-snug text-tinta/85">
                <strong>{etapa.cronica.citacao.autor}:</strong> “{etapa.cronica.citacao.texto}”
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* O Cartógrafo (Tomo A): o que a literatura mostra. */}
      <motion.div
        className="flex items-start gap-6 self-end"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...mola.suave, delay: 0.4 }}
      >
        <div className="pergaminho-sombra w-[900px]">
          <div className="pergaminho pergaminho-nota border-r-8 [border-color:var(--tomo-a)]">
            <p className="font-titulo text-[26px] font-bold">
              {narradores.A.nome} <span className="font-texto text-[22px] font-medium italic text-tinta/70">· o que a literatura mostra</span>
            </p>
            <p className="mt-2 font-texto text-[32px] italic leading-snug">“{etapa.artigoA}”</p>
          </div>
        </div>
        <Retrato id="A" />
      </motion.div>
    </div>
  );
}
