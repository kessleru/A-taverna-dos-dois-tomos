import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { adicionarNotificacao, removerExpiradas, type Notificacao } from '../../engine/notificacoes';
import { mola } from '../../styles/movimento';
import { Grimorio } from './Grimorio';

const Notificar = createContext<(texto: string) => void>(() => {});

export function useGrimorio() {
  return { notificar: useContext(Notificar) };
}

interface GrimorioProviderProps {
  children: ReactNode;
  // Chamado a cada notificação (o App toca o "ping").
  aoNotificar?: () => void;
}

export function GrimorioProvider({ children, aoNotificar }: GrimorioProviderProps) {
  const [lista, setLista] = useState<Notificacao[]>([]);
  const proximoId = useRef(0);
  const aoNotificarRef = useRef(aoNotificar);
  aoNotificarRef.current = aoNotificar;

  const notificar = useCallback((texto: string) => {
    setLista((atual) => adicionarNotificacao(atual, texto, Date.now(), proximoId.current++));
    aoNotificarRef.current?.();
  }, []);

  useEffect(() => {
    if (lista.length === 0) return;
    const proxima = Math.min(...lista.map((n) => n.expiraEm));
    const id = setTimeout(() => setLista((atual) => removerExpiradas(atual, Date.now())), Math.max(0, proxima - Date.now()));
    return () => clearTimeout(id);
  }, [lista]);

  return (
    <Notificar.Provider value={notificar}>
      {children}
      <div className="pointer-events-none absolute right-8 top-24 z-40 flex w-[460px] flex-col gap-3">
        <AnimatePresence initial={false}>
          {lista.map((notificacao) => (
            <motion.div
              key={notificacao.id}
              initial={{ x: 520, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 520, opacity: 0 }}
              transition={mola.carta}
            >
              <Grimorio linhas={[notificacao.texto]} compacto />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Notificar.Provider>
  );
}
