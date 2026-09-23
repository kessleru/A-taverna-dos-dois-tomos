import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { conteudo } from '../data/conteudo';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { CartaLendaria } from '../components/cartas/CartaLendaria';
import type { FaseProps } from '../types';

const DURACAO_ORBITA_MS = 2600;

export function F5Fusao(props: FaseProps) {
  const [orbitando, setOrbitando] = useState(true);
  const [flash, setFlash] = useState(false);
  const [aprendizadoAtual, setAprendizadoAtual] = useState(0);
  const [creditos, setCreditos] = useState(false);
  const [artigoA, artigoB] = conteudo.artigos;

  useEffect(() => {
    const t1 = setTimeout(() => setFlash(true), DURACAO_ORBITA_MS);
    const t2 = setTimeout(() => {
      setFlash(false);
      setOrbitando(false);
    }, DURACAO_ORBITA_MS + 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function proximoAprendizado() {
    if (aprendizadoAtual < conteudo.aprendizados.length - 1) {
      setAprendizadoAtual((i) => i + 1);
    } else if (!creditos) {
      setCreditos(true);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#F9C80E', '#FFF8E7', '#2EC4B6', '#F86624'] });
    }
  }

  return (
    <section className="mx-auto flex h-full max-w-[1400px] flex-col items-center gap-6 overflow-y-auto px-6 py-10">
      {orbitando ? (
        <div className="relative flex h-64 w-64 shrink-0 items-center justify-center">
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0px 0px' }}
          >
            <div style={{ transform: 'translate(-70px, -190px) scale(0.55)' }}>
              <CartaArtigo artigo={artigoA} />
            </div>
          </motion.div>
          <motion.div
            className="absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0px 0px' }}
          >
            <div style={{ transform: 'translate(-70px, 60px) scale(0.55)' }}>
              <CartaArtigo artigo={artigoB} />
            </div>
          </motion.div>
        </div>
      ) : (
        <CartaLendaria />
      )}

      {flash && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}

      {!orbitando && (
        <>
          <Titulo className="text-4xl">Aprendizados</Titulo>
          <ol className="w-full space-y-2 pl-5 text-lg text-pergaminho/90">
            <AnimatePresence>
              {conteudo.aprendizados.slice(0, aprendizadoAtual + 1).map((item, indice) => (
                <motion.li
                  key={item}
                  className="list-decimal"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: indice === aprendizadoAtual ? 0.1 : 0 }}
                >
                  {item}
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>

          {!creditos && (
            <button
              onClick={proximoAprendizado}
              className="rounded-full bg-ouro px-8 py-3 text-lg font-bold text-tinta shadow-carta hover:brightness-110"
            >
              {aprendizadoAtual < conteudo.aprendizados.length - 1 ? 'Próximo aprendizado →' : 'Ver créditos →'}
            </button>
          )}

          {creditos && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-4 border-t border-pergaminho/15 pt-6 text-center text-sm text-pergaminho/70"
            >
              <div>
                <p className="font-titulo text-ouro">Equipe</p>
                <p>{conteudo.equipe.membros.join(' · ')}</p>
              </div>
              <div>
                <p className="font-titulo text-ouro">Referências</p>
                {conteudo.artigos.map((artigo) => (
                  <p key={artigo.id} className="mx-auto max-w-xl">
                    {artigo.referenciaABNT}
                  </p>
                ))}
              </div>
              <p className="text-xs text-pergaminho/40">Créditos de assets em public/assets/CREDITOS.md</p>
            </motion.div>
          )}
        </>
      )}

      <ControlesFase {...props} />
    </section>
  );
}
