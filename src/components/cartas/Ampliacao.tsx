import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALTURA_AMPLIADA, fatorAmpliacao } from '../../engine/ampliacao';
import { mola } from '../../styles/movimento';
import { ESCALA_CARTA } from './escala';

interface Ampliacao {
  mostrar: (conteudo: ReactNode, alturaBase: number) => void;
  esconder: () => void;
}

const Contexto = createContext<Ampliacao>({ mostrar: () => {}, esconder: () => {} });

export function useAmpliacao(): Ampliacao {
  return useContext(Contexto);
}

// Cópia grande da carta no centro do palco, com o fundo escurecido. Não
// recebe o mouse (pointer-events: none): a carta original continua sob o
// cursor, então sair dela fecha a ampliação e o clique continua funcionando.
export function AmpliacaoProvider({ children }: { children: ReactNode }) {
  const [carta, setCarta] = useState<{ conteudo: ReactNode; fator: number } | null>(null);

  const valor = useMemo<Ampliacao>(
    () => ({
      mostrar: (conteudo, alturaBase) =>
        setCarta({ conteudo, fator: fatorAmpliacao(alturaBase, ESCALA_CARTA, ALTURA_AMPLIADA) }),
      esconder: () => setCarta(null),
    }),
    [],
  );

  return (
    <Contexto.Provider value={valor}>
      {children}
      <AnimatePresence>
        {carta && (
          <motion.div
            key="ampliacao"
            className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-madeira-profunda/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={mola.carta}
              style={{ zoom: carta.fator }}
            >
              {carta.conteudo}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Contexto.Provider>
  );
}
