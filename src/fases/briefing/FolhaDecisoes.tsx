import { briefing } from '../../data/rodada';
import { CartaDecisao } from '../../components/cartas/CartaDecisao';
import { Pergaminho } from '../../components/ui/Pergaminho';

type IdDecisao = 'planejar' | 'adaptar' | 'combinar' | 'bricolagem';

// Leque leve: as cartas das pontas giram mais (10-briefing-quadro.md §4).
const ANGULOS = [-6, -2, 2, 6];
const LARGURA_COLUNA = 290;
const INICIO_COLUNAS = 470;

// Folha 3: a fala do Taverneiro à esquerda e as quatro cartas de decisão em
// leque, cada uma com uma etiqueta legível do fundo da sala embaixo.
export function FolhaDecisoes() {
  const { jeitosDeDecidir } = briefing;

  return (
    <>
      <Pergaminho variante="nota" angulo={-1.5} className="absolute" style={{ left: 50, top: 70, width: 370 }}>
        <h2 className="font-titulo text-[36px] font-bold leading-tight">{jeitosDeDecidir.titulo}</h2>
        <div className="ornamento my-4" aria-hidden>
          ❦
        </div>
        <p className="font-texto text-[32px] italic leading-snug">“{jeitosDeDecidir.fala}”</p>
        <p className="mt-4 font-titulo text-[24px] font-bold">O Taverneiro</p>
      </Pergaminho>

      {jeitosDeDecidir.cartas.map((carta, i) => {
        const trancada = carta.id === 'combinar';
        const left = INICIO_COLUNAS + i * LARGURA_COLUNA;
        return (
          <div key={carta.id}>
            {/* O zoom fica num div interno: no mesmo elemento ele também escalaria o left/top. */}
            <div className="absolute" style={{ left: left + 14, top: 40 + Math.abs(ANGULOS[i]) * 3, rotate: `${ANGULOS[i]}deg` }}>
              <div style={{ zoom: 0.85 }}>
                <CartaDecisao
                  id={carta.id as IdDecisao}
                  nome={carta.nome}
                  teoria={carta.teoria}
                  resumo={carta.resumo}
                  trancada={trancada}
                />
              </div>
            </div>
            <Pergaminho
              variante="etiqueta"
              angulo={ANGULOS[i] / 3}
              atraso={0.1 + i * 0.1}
              className="absolute"
              style={{ left, top: 430, width: LARGURA_COLUNA - 20 }}
            >
              <h3 className="font-titulo text-[34px] font-bold leading-tight">{carta.nome}</h3>
              <p className="font-texto text-[24px] italic leading-tight text-tinta/80">{carta.teoria}</p>
              <p className="mt-2 font-texto text-[26px] leading-snug">{carta.resumo}</p>
            </Pergaminho>
          </div>
        );
      })}
    </>
  );
}
