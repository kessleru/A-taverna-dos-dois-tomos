import { useState } from 'react';
import { motion } from 'framer-motion';
import { conteudo, rotulosAtributos, type Atributo } from '../data/conteudo';
import { comparacao } from '../data/rodada';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const ATRIBUTOS = Object.keys(rotulosAtributos) as Atributo[];

interface F4ArtigosProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F4Artigos({ som, ...props }: F4ArtigosProps) {
  const [viradas, setViradas] = useState<Record<string, boolean>>({});
  const [artigoA, artigoB] = conteudo.artigos;
  const ambasReveladas = conteudo.artigos.every((a) => viradas[a.id]);

  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">Os Artigos Lado a Lado</Titulo>
      <p className="text-sm text-pergaminho/60">Clique em cada carta para revelar.</p>

      <motion.div
        className="flex flex-wrap justify-center gap-6"
        animate={ambasReveladas ? { rotate: [0, 0] } : {}}
      >
        {conteudo.artigos.map((artigo, indice) => (
          <motion.div
            key={artigo.id}
            animate={ambasReveladas ? { rotate: indice === 0 ? -4 : 4 } : { rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            <CartaArtigo
              artigo={artigo}
              virada={!!viradas[artigo.id]}
              onClick={() => {
                som.tocar('virar-carta');
                setViradas((v) => ({ ...v, [artigo.id]: true }));
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {ambasReveladas && (
        <>
          <motion.div
            initial={{ scale: 2.5, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            className="mx-auto w-fit rounded-lg border-4 border-ouro px-6 py-2 text-center font-titulo text-xl uppercase tracking-widest text-ouro"
          >
            Complementares
          </motion.div>
          <p className="text-center text-pergaminho/90">{conteudo.vereditoTexto}</p>

          <h2 className="font-titulo text-2xl text-ouro">Semelhanças</h2>
          <ul className="space-y-1 pl-5 text-pergaminho/90">
            {comparacao.semelhancas.map((item, indice) => (
              <motion.li
                key={item}
                className="list-disc"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: indice * 0.15 }}
                style={{ color: 'var(--ouro)' }}
              >
                <span className="text-pergaminho">{item}</span>
              </motion.li>
            ))}
          </ul>

          <h2 className="font-titulo text-2xl text-ouro">Diferenças</h2>
          <table className="w-full text-left text-pergaminho/90">
            <tbody>
              {comparacao.diferencas.map((linha, indice) => (
                <motion.tr
                  key={linha.tema}
                  className="border-t border-pergaminho/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: indice * 0.1 }}
                >
                  <td className="py-2 pr-4 font-bold">{linha.tema}</td>
                  <td className="py-2 pr-4" style={{ color: 'var(--tomo-a)' }}>
                    {linha.A}
                  </td>
                  <td className="py-2" style={{ color: 'var(--tomo-b)' }}>
                    {linha.B}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          <h2 className="font-titulo text-2xl text-ouro">Atributos</h2>
          <div className="flex flex-col gap-3">
            {ATRIBUTOS.map((atributo) => {
              const a = artigoA.atributos[atributo].valor;
              const b = artigoB.atributos[atributo].valor;
              return (
                <div key={atributo} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                  <div className="flex justify-end">
                    <motion.div
                      className="h-3 rounded-l-full"
                      style={{ background: 'var(--tomo-a)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${a * 6}px` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                  </div>
                  <span className="w-32 text-center text-pergaminho/70">{rotulosAtributos[atributo]}</span>
                  <div className="flex justify-start">
                    <motion.div
                      className="h-3 rounded-r-full"
                      style={{ background: 'var(--tomo-b)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${b * 6}px` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="font-titulo text-2xl text-ouro">Tema central</h2>
          <p className="text-xl text-pergaminho/90">{conteudo.temaCentral}</p>
        </>
      )}

      <ControlesFase {...props} />
    </section>
  );
}
