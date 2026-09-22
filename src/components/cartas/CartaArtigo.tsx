import { artesArtigos } from '../../data/artes';
import type { conteudo } from '../../data/conteudo';
import { CartaBase } from './CartaBase';
import { MolduraCarta } from './MolduraCarta';

type Artigo = (typeof conteudo)['artigos'][number];

export function CartaArtigo({
  artigo,
  virada = true,
  tamanho = 'grande',
  onClick,
}: {
  artigo: Artigo;
  virada?: boolean;
  tamanho?: 'grande' | 'pequena';
  onClick?: () => void;
}) {
  const arte = artesArtigos[artigo.id as 'A' | 'B'];
  const cor = artigo.id === 'A' ? 'var(--artigo-a)' : 'var(--artigo-b)';

  return (
    <CartaBase
      corPrincipal={cor}
      virada={virada}
      tamanho={tamanho}
      onClick={onClick}
      layoutId={`artigo-${artigo.id}`}
      frente={
        <MolduraCarta tipo="conselheiro" nome={artigo.tituloCurto} orbe={artigo.id} arte={arte} corPrincipal={cor} tamanho={tamanho}>
          <p className="font-bold">{artigo.resumoUmaLinha}</p>
          {tamanho === 'grande' && (
            <>
              <div className="mt-2 flex flex-wrap gap-1">
                {artigo.numeros.map((n) => (
                  <span key={n.rotulo} className="rounded-full bg-tinta/10 px-1.5 py-0.5 text-[9px]" title={n.rotulo}>
                    {n.valor}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-tinta/70">
                ⚡ <strong>{artigo.poderEspecial}</strong>
              </p>
            </>
          )}
        </MolduraCarta>
      }
    />
  );
}
