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
  const cor = artigo.id === 'A' ? 'var(--tomo-a)' : 'var(--tomo-b)';

  return (
    <CartaBase
      corPrincipal={cor}
      virada={virada}
      tamanho={tamanho}
      onClick={onClick}
      layoutId={`artigo-${artigo.id}`}
      frente={
        <MolduraCarta
          nome={artigo.tituloCurto}
          arte={arte}
          corPrincipal={cor}
          tamanho={tamanho}
          gemaTopo={artigo.id}
          // Gemas de atributo nos cantos, como ataque e vida (01-tema-e-hud.md §8.2).
          gemaEsquerda={<span title="Abrangência">{artigo.atributos.abrangencia.valor}</span>}
          gemaDireita={<span title="Profundidade">{artigo.atributos.profundidade.valor}</span>}
          subtitulo={`Tomo ${artigo.id} · ${artigo.poderEspecial}`}
        >
          <p className="font-medium">{artigo.resumoUmaLinha}</p>
        </MolduraCarta>
      }
    />
  );
}
