import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { perfis, caminhoReal, calcularPerfil, etapas } from '../data/rodada';
import { pontuacao, type EstadoRodada } from '../engine/motor';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import { ContadorAnimado } from '../components/ui/ContadorAnimado';
import type { FaseProps } from '../types';

interface F3ResultadoProps extends FaseProps {
  estadoRodada: EstadoRodada;
}

const ICONE_ESCOLHA = { planejar: '📋', adaptar: '🧭', combinar: '🔀' } as const;
const PERFIS_COM_CONFETE = ['lendario', 'camaleao'];

export function F3Resultado({ estadoRodada, ...props }: F3ResultadoProps) {
  const { escolhas, ind } = estadoRodada;
  const { total, estrelas } = pontuacao(ind);
  const perfilId = escolhas.length === etapas.length ? calcularPerfil(escolhas) : undefined;
  const perfil = perfilId ? perfis[perfilId] : undefined;

  useEffect(() => {
    if (!perfilId || !PERFIS_COM_CONFETE.includes(perfilId)) return;
    const id = setTimeout(() => {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ['#F9C80E', '#FFF8E7', '#F86624'] });
    }, 600);
    return () => clearTimeout(id);
  }, [perfilId]);

  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col items-center gap-8 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">Resultado</Titulo>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
        className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-4 text-7xl"
        style={{ borderColor: 'var(--moeda)', boxShadow: '0 0 32px -4px var(--moeda), inset 0 0 0 6px #17123a' }}
      >
        {perfil?.emoji ?? '❔'}
      </motion.div>

      <div className="text-center">
        <p className="font-titulo text-3xl text-moeda">{perfil?.nome ?? 'Rodada incompleta'}</p>
        <p className="mt-2 max-w-lg text-papel/80">{perfil?.texto ?? 'Complete as 4 decisões para ver o perfil da turma.'}</p>
        <p className="mt-3 font-titulo text-2xl">
          <ContadorAnimado valor={total} /> pontos
        </p>
        <p className="mt-1 text-2xl">
          {Array.from({ length: 3 }).map((_, indice) => (
            <motion.span
              key={indice}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: indice < estrelas ? 1 : 0.2, scale: 1 }}
              transition={{ delay: 0.8 + indice * 0.25 }}
            >
              ⭐
            </motion.span>
          ))}
        </p>
      </div>

      <h2 className="font-titulo text-2xl text-moeda">Vocês vs. a startup real</h2>
      <ol className="w-full space-y-2">
        {caminhoReal.map((passo, indice) => {
          const escolhaTurma = escolhas[indice];
          const igual = escolhaTurma === passo.escolha;
          return (
            <li
              key={passo.etapa}
              className={`relative flex items-center justify-between overflow-hidden rounded-carta border p-3 ${
                igual ? 'border-moeda/60 bg-moeda/10' : 'border-papel/15'
              }`}
            >
              {igual && (
                <motion.span
                  className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-moeda"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
              <span className="relative z-10 w-32 text-sm text-papel/70">{passo.etapa}</span>
              <span className="relative z-10">{escolhaTurma ? ICONE_ESCOLHA[escolhaTurma] : '—'}</span>
              <span className="relative z-10">{igual ? '✨🔗✨' : ''}</span>
              <span className="relative z-10 text-sm" style={{ color: 'var(--artigo-b)' }}>
                {passo.logica}
              </span>
            </li>
          );
        })}
      </ol>

      <ControlesFase {...props} />
    </section>
  );
}
