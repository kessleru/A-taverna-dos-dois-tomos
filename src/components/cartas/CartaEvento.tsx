import { motion, useReducedMotion } from 'framer-motion';
import { arteEventos } from '../../data/artes';
import { CenaArte } from './CenaArte';
import { Icone } from '../ui/Icone';

interface CartaEventoProps {
  depoisDaEtapa: number;
  nome: string;
  desfecho: { titulo: string; texto: string; efeito: Partial<{ caixa: number; clientes: number; moral: number }> };
  sucesso: boolean;
}

// Mesmos ícones e cores dos orbes do HUD.
const INDICADORES = {
  caixa: { rotulo: 'Caixa', icone: 'shiny-purse', cor: 'var(--ouro)' },
  clientes: { rotulo: 'Clientes', icone: 'flying-flag', cor: 'var(--clientes)' },
  moral: { rotulo: 'Moral', icone: 'flamer', cor: 'var(--brasa)' },
} as const;

// Carta do Destino (03-historia.md §5, eventos): horizontal como a Carta de
// Desafio, vira na mesa mostrando o desfecho e o que ele muda nos orbes.
export function CartaEvento({ depoisDaEtapa, nome, desfecho, sucesso }: CartaEventoProps) {
  const reduzido = useReducedMotion();
  const arte = arteEventos[`${depoisDaEtapa}-${sucesso ? 'sim' : 'nao'}`];

  return (
    <motion.div
      className="quadro-madeira flex h-[400px] w-[1180px] !p-5"
      style={{ transformPerspective: 1600 }}
      initial={reduzido ? false : { rotateY: 180, scale: 0.8, opacity: 0 }}
      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <div className="h-full w-[400px] shrink-0 overflow-hidden rounded-l-[4px] border-2 border-ouro-escuro">
        {arte && <CenaArte arte={arte} nome={nome} />}
      </div>
      <div className="pergaminho flex flex-1 flex-col justify-center gap-3 !px-12 [clip-path:none]">
        <p className="font-titulo text-[24px] font-bold uppercase tracking-[0.08em] text-ouro-escuro">Carta do Destino · {nome}</p>
        <h2 className="font-titulo text-[48px] font-bold leading-[1.05]" style={{ color: sucesso ? '#2f7a45' : 'var(--cera)' }}>
          {desfecho.titulo}
        </h2>
        <p className="font-texto text-[32px] leading-snug">{desfecho.texto}</p>
        <div className="mt-1 flex flex-wrap gap-3">
          {(Object.keys(INDICADORES) as (keyof typeof INDICADORES)[])
            .filter((chave) => desfecho.efeito[chave])
            .map((chave) => {
              const valor = desfecho.efeito[chave]!;
              const { rotulo, icone, cor } = INDICADORES[chave];
              return (
                <span
                  key={chave}
                  className="flex items-center gap-2 rounded-md border-2 border-ouro-escuro/70 bg-madeira-profunda/90 px-4 py-1.5 font-titulo text-[28px] font-bold text-pergaminho shadow-carta"
                >
                  <span style={{ color: cor }}>
                    <Icone nome={icone} className="h-8 w-8" />
                  </span>
                  {rotulo}
                  <span style={{ color: valor > 0 ? 'var(--cura)' : 'var(--dano)' }}>
                    {valor > 0 ? `▲ +${valor}` : `▼ −${Math.abs(valor)}`}
                  </span>
                </span>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
