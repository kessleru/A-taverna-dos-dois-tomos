import { useSyncExternalStore, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ajudaAberta, assinarAjuda, definirAjuda } from '../../engine/ajuda';
import { mola } from '../../styles/movimento';

export function useAjudaAberta(): boolean {
  return useSyncExternalStore(assinarAjuda, ajudaAberta);
}

function Tecla({ children }: { children: ReactNode }) {
  return (
    <kbd className="placa-ferro-pequena inline-flex min-w-[46px] items-center justify-center px-3 py-1 font-titulo text-[22px] font-bold not-italic text-ouro-claro">
      {children}
    </kbd>
  );
}

function Linha({ teclas, children }: { teclas: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-5">
      <span className="flex w-[250px] shrink-0 flex-wrap items-center justify-end gap-2">{teclas}</span>
      <span className="font-texto text-[27px] leading-snug">{children}</span>
    </li>
  );
}

// "Como se joga aqui": os atalhos do apresentador num aviso grande do quadro.
// Abre com ? ou H (ou o botão do HUD) e fecha com qualquer tecla ou clique.
export function Ajuda() {
  const aberta = useAjudaAberta();
  return (
    <AnimatePresence>
      {aberta && (
        <motion.div
          key="ajuda"
          className="absolute inset-0 z-[62] flex cursor-pointer items-center justify-center"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgb(20 13 8 / 0.6), rgb(8 5 3 / 0.9))' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.2 }}
          onClick={() => definirAjuda(false)}
          role="dialog"
          aria-label="Atalhos da taverna"
        >
          <motion.div
            className="pergaminho-sombra w-[1320px]"
            initial={{ y: -40, rotate: -2, scale: 0.96 }}
            animate={{ y: 0, rotate: -0.6, scale: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.18 } }}
            transition={mola.carta}
          >
            <div className="pergaminho pergaminho-aviso !px-14 !py-10">
              <h2 className="font-titulo text-[52px] font-bold leading-none">Como se joga na taverna</h2>
              <div className="ornamento my-4" aria-hidden>
                ❦
              </div>
              <div className="grid grid-cols-2 gap-x-10">
                <section>
                  <h3 className="mb-3 font-titulo text-[28px] font-bold text-cera">No teclado</h3>
                  <ul className="space-y-3">
                    <Linha teclas={<><Tecla>→</Tecla><Tecla>Espaço</Tecla></>}>avança</Linha>
                    <Linha teclas={<Tecla>←</Tecla>}>volta</Linha>
                    <Linha teclas={<><Tecla>1</Tecla><Tecla>2</Tecla><Tecla>3</Tecla></>}>joga a carta da votação</Linha>
                    <Linha teclas={<Tecla>M</Tecla>}>liga e desliga o som</Linha>
                    <Linha teclas={<Tecla>F</Tecla>}>tela cheia</Linha>
                    <Linha teclas={<Tecla>Esc</Tecla>}>fecha o que estiver aberto</Linha>
                    <Linha teclas={<><Tecla>?</Tecla><Tecla>H</Tecla></>}>abre esta ajuda</Linha>
                  </ul>
                </section>
                <section>
                  <h3 className="mb-3 font-titulo text-[28px] font-bold text-cera">No mouse</h3>
                  <ul className="space-y-3">
                    <Linha teclas={<Tecla>clique</Tecla>}>escolhe a carta, rola o dado, abre os tomos</Linha>
                    <Linha teclas={<Tecla>botão direito</Tecla>}>amplia a carta para todos lerem</Linha>
                    <Linha teclas={<Tecla>na mesa</Tecla>}>levanta poeira (cliquem várias vezes...)</Linha>
                  </ul>
                  <h3 className="mb-3 mt-7 font-titulo text-[28px] font-bold text-cera">Para o ensaio</h3>
                  <ul className="space-y-3">
                    <Linha teclas={<><Tecla>Shift</Tecla><Tecla>1 2 3</Tecla></>}>força falha, sucesso ou crítico no próximo dado</Linha>
                    <Linha teclas={<><Tecla>Shift</Tecla><Tecla>R</Tecla></>}>recomeça a rodada</Linha>
                  </ul>
                </section>
              </div>
              <p className="mt-7 text-center font-texto text-[22px] italic text-tinta/70">qualquer tecla ou clique fecha</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
