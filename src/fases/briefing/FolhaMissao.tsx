import { briefing } from '../../data/rodada';
import { Pergaminho } from '../../components/ui/Pergaminho';
import { SeloCera } from '../../components/ui/SeloCera';

// Folha 1 do quadro de missões: o aviso da missão e três notas pregadas.
export function FolhaMissao() {
  const { missao } = briefing;
  // Notas da direita em alturas e ângulos diferentes, como papéis pregados à mão.
  const posicoes = [
    { left: 1170, top: 56, angulo: 2 },
    { left: 1215, top: 300, angulo: -1.5 },
    { left: 1160, top: 540, angulo: 1 },
  ];

  return (
    <>
      <Pergaminho variante="aviso" angulo={-1} className="absolute" style={{ left: 80, top: 60, width: 1000 }}>
        <h2 className="font-titulo text-[64px] font-bold leading-[1.1]">{missao.titulo}</h2>
        <div className="ornamento my-6" aria-hidden>
          ❦
        </div>
        <p className="capitular font-texto text-[36px] leading-[1.45]">{missao.texto}</p>
        <SeloCera className="absolute right-12 top-14 h-32 w-32 rotate-12" />
      </Pergaminho>

      {missao.notas.map((nota, i) => (
        <Pergaminho
          key={nota.titulo}
          angulo={posicoes[i].angulo}
          atraso={0.15 + i * 0.12}
          className="absolute"
          style={{ left: posicoes[i].left, top: posicoes[i].top, width: 420 }}
        >
          <h3 className="font-titulo text-[36px] font-bold leading-tight">{nota.titulo}</h3>
          <p className="mt-2 font-texto text-[32px] leading-snug">{nota.texto}</p>
        </Pergaminho>
      ))}
    </>
  );
}
