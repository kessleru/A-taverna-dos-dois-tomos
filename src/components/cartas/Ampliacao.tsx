import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALTURA_AMPLIADA, fatorAmpliacao } from '../../engine/ampliacao';
import { mola } from '../../styles/movimento';
import { ESCALA_CARTA } from './escala';
import type { PalavraChave } from '../../data/glossario';
import { jaVisto, marcarVisto, naoVistos } from '../../engine/vistos';

const AJUDA_FECHAR = 'ampliacao:fechar';
const idTermo = (palavra: PalavraChave) => `termo:${palavra.termo}`;

interface Ampliacao {
  // aoFechar avisa a carta que a ampliação dela saiu (clique, Esc ou outra carta).
  mostrar: (conteudo: ReactNode, alturaBase: number, aoFechar?: () => void, palavras?: PalavraChave[]) => void;
  esconder: () => void;
}

const Contexto = createContext<Ampliacao>({ mostrar: () => {}, esconder: () => {} });

export function useAmpliacao(): Ampliacao {
  return useContext(Contexto);
}

// Cópia grande da carta no centro do palco, com o fundo escurecido. Abre com
// o botão direito na carta (CartaBase) e fecha com qualquer clique ou Esc. A
// camada recebe o clique que a fecha, então ele nunca escolhe a carta de baixo
// sem querer. Sem backdrop-filter: desfocar o palco inteiro a cada quadro,
// com as brasas se mexendo atrás, pesava no projetor.
export function AmpliacaoProvider({ children }: { children: ReactNode }) {
  const [carta, setCarta] = useState<{ conteudo: ReactNode; fator: number; id: number; palavras: PalavraChave[]; dicaFechar: boolean } | null>(null);
  const aoFechar = useRef<(() => void) | undefined>(undefined);
  const contador = useRef(0);

  const esconder = useCallback(() => {
    aoFechar.current?.();
    aoFechar.current = undefined;
    setCarta(null);
  }, []);

  const valor = useMemo<Ampliacao>(
    () => ({
      mostrar: (conteudo, alturaBase, fechou, palavras = []) => {
        aoFechar.current?.();
        aoFechar.current = fechou;
        // Cada termo e o "clique para fechar" só na primeira vez da sessão.
        const novas = naoVistos(palavras, idTermo);
        const dicaFechar = !jaVisto(AJUDA_FECHAR);
        marcarVisto(AJUDA_FECHAR, ...novas.map(idTermo));
        setCarta({ conteudo, fator: fatorAmpliacao(alturaBase, ESCALA_CARTA, ALTURA_AMPLIADA), id: ++contador.current, palavras: novas, dicaFechar });
      },
      esconder,
    }),
    [esconder],
  );

  // Esc fecha antes de qualquer outro atalho (a fase não recua junto).
  useEffect(() => {
    if (!carta) return;
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return;
      evento.preventDefault();
      evento.stopImmediatePropagation();
      esconder();
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, [carta, esconder]);

  return (
    <Contexto.Provider value={valor}>
      {children}
      <AnimatePresence>
        {carta && (
          <motion.div
            key="ampliacao"
            className="absolute inset-0 z-[60] flex cursor-pointer flex-col items-center justify-center gap-6"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgb(20 13 8 / 0.55), rgb(8 5 3 / 0.88))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.18 }}
            onClick={esconder}
            onContextMenu={(evento) => {
              evento.preventDefault();
              esconder();
            }}
          >
            <div className="flex items-center gap-12">
              <motion.div
                key={carta.id}
                initial={{ scale: 0.8, rotateY: -25, y: 40 }}
                animate={{ scale: 1, rotateY: 0, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
                transition={mola.carta}
                style={{ zoom: carta.fator, transformPerspective: 1400 }}
              >
                {carta.conteudo}
              </motion.div>
              {/* Palavras-chave ao lado da carta, como no Hearthstone: uma
                  plaquinha por termo, entrando uma depois da outra. */}
              {carta.palavras.length > 0 && (
                <ul key={`palavras-${carta.id}`} className="flex w-[480px] flex-col gap-5">
                  {carta.palavras.map((palavra, i) => (
                    <motion.li
                      key={palavra.termo}
                      className="placa-ferro px-7 py-5"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      transition={{ ...mola.carta, delay: 0.12 + i * 0.08 }}
                    >
                      <p className="font-titulo text-[28px] font-bold leading-tight text-ouro">{palavra.termo}</p>
                      <p className="mt-1 font-texto text-[25px] leading-snug text-pergaminho">{palavra.texto}</p>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            {carta.dicaFechar && (
              <p className="font-texto text-[24px] italic text-pergaminho/70 [text-shadow:0_2px_4px_rgb(0_0_0)]">clique para fechar</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Contexto.Provider>
  );
}
