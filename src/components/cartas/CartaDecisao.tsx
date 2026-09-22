import { artesDecisoes, orbeDecisao, type ArteCarta } from '../../data/artes';
import type { Escolha } from '../../data/rodada';
import { CartaBase } from './CartaBase';
import { MolduraCarta } from './MolduraCarta';

const CORES: Record<Escolha | 'bricolagem', string> = {
  planejar: 'var(--planejar)',
  adaptar: 'var(--adaptar)',
  combinar: 'var(--moeda)',
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

  return (
    <div
      style={{
        transform: `rotate(${rotacao}deg) translateY(${emDestaque ? -16 : 0}px) scale(${emDestaque ? 1.05 : 1})`,
        transition: 'transform 300ms ease',
      }}
    >
      <CartaBase
        corPrincipal={cor}
        tamanho={tamanho}
        onClick={trancada ? undefined : onClick}
        layoutId={`decisao-${id}`}
        frente={
          <div className={trancada ? 'relative grayscale' : 'relative'}>
            <MolduraCarta tipo="decisao" nome={nome} orbe={orbe} arte={arte} corPrincipal={cor} tamanho={tamanho}>
              <p className="text-[10px] text-tinta/60">{teoria}</p>
              <p className="mt-1 font-medium">{resumo}</p>
            </MolduraCarta>
            {trancada && (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🔒</div>
            )}
          </div>
        }
      />
    </div>
  );
}
