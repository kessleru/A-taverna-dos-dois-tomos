import { motion } from 'framer-motion';
import { arteEventos } from '../../data/artes';
import { CenaArte } from './CenaArte';

interface CartaEventoProps {
  depoisDaEtapa: number;
  nome: string;
  desfecho: { titulo: string; texto: string; efeito: Partial<{ caixa: number; clientes: number; moral: number }> };
  sucesso: boolean;
}

const ROTULOS: Record<string, string> = { caixa: '💰', clientes: '👥', moral: '🔥' };

export function CartaEvento({ depoisDaEtapa, nome, desfecho, sucesso }: CartaEventoProps) {
  const arte = arteEventos[`${depoisDaEtapa}-${sucesso ? 'sim' : 'nao'}`];
  const cor = sucesso ? 'var(--adaptar)' : 'var(--dano)';

  return (
    <motion.div
      initial={{ rotate: 180, scale: 0.6, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      className="flex w-full max-w-xl overflow-hidden rounded-carta border-2"
      style={{ borderColor: cor, boxShadow: 'var(--sombra-carta)', background: 'linear-gradient(120deg, #17123add, #241e4edd)' }}
    >
      <div
        className="relative h-28 w-28 shrink-0"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)' }}
      >
        <CenaArte arte={arte} nome={nome} />
        <span
          className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-pergaminho/80 text-sm"
          style={{ background: cor }}
        >
          {arte.icone}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 p-4">
        <span className="font-texto text-[10px] uppercase tracking-wide text-pergaminho/50">Evento · {nome}</span>
        <h3 className="font-titulo text-lg" style={{ color: cor }}>
          {desfecho.titulo}
        </h3>
        <p className="text-sm text-pergaminho/85">{desfecho.texto}</p>
        <div className="mt-1 flex gap-2">
          {Object.entries(desfecho.efeito).map(([chave, valor]) => (
            <span key={chave} className="rounded-full bg-pergaminho/10 px-2 py-0.5 text-[10px]">
              {ROTULOS[chave]} {valor! > 0 ? `+${valor}` : valor}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
