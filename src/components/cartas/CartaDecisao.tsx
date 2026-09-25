import { motion } from 'framer-motion';
import { artesDecisoes, type ArteCarta } from '../../data/artes';
import type { Escolha } from '../../data/rodada';
import { CartaBase } from './CartaBase';
import { MolduraCarta } from './MolduraCarta';
import { FormaGema } from './FormaGema';
import { Icone } from '../ui/Icone';
import { COR as CORES, SIGILO as SIGILOS } from './logicas';
import { GLOSSARIO } from '../../data/glossario';

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
  // Tecla da votação (posição da carta na mesa); fora da votação a gema mostra o sigilo.
  tecla?: number;
}

export function CartaDecisao({ id, nome, teoria, resumo, trancada = false, tamanho = 'pequena', onClick, rotacao = 0, emDestaque = false, tecla }: CartaDecisaoProps) {
  const cor = CORES[id];
  const arteOriginal = artesDecisoes[id];
  const arte: ArteCarta = trancada ? { ...arteOriginal, cores: ['#555', '#222'] } : arteOriginal;
  const gemaTopo = tecla ?? <Icone nome={SIGILOS[id]} className="h-[62%] w-[62%]" />;

  return (
    <motion.div
      layout
      animate={
        emDestaque
          ? // Levanta da mesa, balança e assenta em destaque.
            { rotate: [rotacao, -6, 4, 0], y: [0, -70, -20], scale: [1, 1.25, 1.18] }
          : { rotate: rotacao, y: 0, scale: 1 }
      }
      transition={emDestaque ? { duration: 0.9, ease: 'easeOut' } : { type: 'spring', stiffness: 200, damping: 22 }}
      style={emDestaque ? { filter: `drop-shadow(0 0 22px ${cor}) drop-shadow(0 0 10px var(--ouro))` } : undefined}
    >
      <CartaBase
        corPrincipal={cor}
        tamanho={tamanho}
        onClick={trancada ? undefined : onClick}
        layoutId={`decisao-${id}`}
        holografica={arteOriginal.raridade === 'lendaria' && !trancada}
        palavrasChave={GLOSSARIO[id]}
        frente={
          <div className="relative">
            <div className={trancada ? 'grayscale' : undefined}>
              <MolduraCarta
                nome={nome}
                arte={arte}
                corPrincipal={cor}
                tamanho={tamanho}
                gemaTopo={gemaTopo}
                gemaEsquerda={<Icone nome={SIGILOS[id]} className="h-[64%] w-[64%]" />}
                gemaDireita={<FormaGema logica={id} className="h-[62%] w-[62%]" />}
                subtitulo={teoria}
              >
                <p className="font-medium">{resumo}</p>
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
