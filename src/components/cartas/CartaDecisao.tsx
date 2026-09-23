import { motion } from 'framer-motion';
import { artesDecisoes, orbeDecisao, type ArteCarta } from '../../data/artes';
import type { Escolha } from '../../data/rodada';
import { CartaBase } from './CartaBase';
import { MolduraCarta } from './MolduraCarta';
import { Icone } from '../ui/Icone';

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
          <div className="relative">
            <div className={trancada ? 'grayscale' : undefined}>
              <MolduraCarta tipo="decisao" nome={nome} orbe={orbe} arte={arte} corPrincipal={cor} tamanho={tamanhoEfetivo}>
                <p className="text-[10px] text-tinta/60">{teoria}</p>
                <p className="mt-1 font-medium">{resumo}</p>
              </MolduraCarta>
            </div>
            {/* Trancada: correntes de ferro cruzando a carta e cadeado dourado no
                centro (01-tema-e-hud.md §8.3), fora do filtro cinza da carta. */}
            {trancada && (
              <div className="absolute inset-0 flex items-center justify-center" aria-label="Carta trancada">
                <Icone
                  nome="crossed-chains"
                  className="absolute inset-[4%] text-[#2e2a27] [filter:drop-shadow(0_0_1px_#d8d0c6)_drop-shadow(0_6px_6px_rgb(0_0_0/0.8))]"
                />
                <Icone
                  nome="padlock"
                  className="relative h-[34%] w-[34%] text-ouro [filter:drop-shadow(0_0_2px_#3a2400)_drop-shadow(0_6px_8px_rgb(0_0_0/0.9))]"
                />
              </div>
            )}
          </div>
        }
      />
    </motion.div>
  );
}
