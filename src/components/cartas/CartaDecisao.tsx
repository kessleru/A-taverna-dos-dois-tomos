import { motion } from 'framer-motion';
import { artesDecisoes, orbeDecisao, type ArteCarta } from '../../data/artes';
import type { Escolha } from '../../data/rodada';
import { CartaBase } from './CartaBase';
import { MolduraCarta } from './MolduraCarta';

const CORES: Record<Escolha | 'bricolagem', string> = {
  planejar: 'var(--planejar)',
  adaptar: 'var(--adaptar)',
  combinar: 'var(--ouro)',
  bricolagem: 'var(--bricolagem)',
};

interface CartaDecisaoProps {
  id: Escolha | 'bricolagem';
  nome: string;
  teoria: string;
  resumo: string;
  trancada?: boolean;
  tamanho?: 'grande' | 'pequena';
  onClick?: () => void;
  rotacao?: number;
  emDestaque?: boolean;
}

export function CartaDecisao({ id, nome, teoria, resumo, trancada = false, tamanho = 'pequena', onClick, rotacao = 0, emDestaque = false }: CartaDecisaoProps) {
  const cor = CORES[id];
  const arteOriginal = artesDecisoes[id];
  const arte: ArteCarta = trancada ? { ...arteOriginal, cores: ['#555', '#222'] } : arteOriginal;
  const orbe = id === 'bricolagem' ? '🔧' : orbeDecisao[id];

  const tamanhoEfetivo = emDestaque ? 'grande' : tamanho;

  return (
    <motion.div
      layout
      animate={
        emDestaque
          ? { rotate: [rotacao, rotacao + 360, 0], y: -16, scale: 1.15 }
          : { rotate: rotacao, y: 0, scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={emDestaque ? { filter: 'drop-shadow(0 0 18px var(--ouro))' } : undefined}
    >
      <CartaBase
        corPrincipal={cor}
        tamanho={tamanhoEfetivo}
        onClick={trancada ? undefined : onClick}
        layoutId={`decisao-${id}`}
        frente={
          <div className={trancada ? 'relative grayscale' : 'relative'}>
            <MolduraCarta tipo="decisao" nome={nome} orbe={orbe} arte={arte} corPrincipal={cor} tamanho={tamanhoEfetivo}>
              <p className="text-[10px] text-tinta/60">{teoria}</p>
              <p className="mt-1 font-medium">{resumo}</p>
            </MolduraCarta>
            {trancada && (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🔒</div>
            )}
          </div>
        }
      />
    </motion.div>
  );
}
