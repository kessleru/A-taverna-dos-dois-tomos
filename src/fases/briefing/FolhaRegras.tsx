import { briefing } from '../../data/rodada';
import { Pergaminho } from '../../components/ui/Pergaminho';
import { Icone } from '../../components/ui/Icone';

const RETRATO = `${import.meta.env.BASE_URL}assets/personagens/taverneiro.webp`;
const ROMANOS = ['I', 'II', 'III', 'IV', 'V'];

// Folha 4: as regras num pergaminho, numeradas em romanos (são uma sequência
// de fato), e o retrato do Taverneiro pregado ao lado.
export function FolhaRegras() {
  const { regras } = briefing;

  return (
    <>
      <Pergaminho variante="aviso" angulo={-0.8} className="absolute" style={{ left: 70, top: 40, width: 1080 }}>
        <h2 className="font-titulo text-[56px] font-bold leading-none">{regras.titulo}</h2>
        <div className="ornamento my-5" aria-hidden>
          ❦
        </div>
        <ol className="space-y-5">
          {regras.itens.map((regra, i) => (
            <li key={regra.texto} className="flex items-center gap-5">
              <span className="w-16 shrink-0 text-right font-titulo text-[38px] font-bold text-ouro-escuro">{ROMANOS[i]}</span>
              <span className="flex w-[156px] shrink-0 justify-center gap-1 text-tinta">
                {regra.icones.map((icone) => (
                  <Icone key={icone} nome={icone} className="h-12 w-12" />
                ))}
              </span>
              <span className="font-texto text-[32px] leading-snug">{regra.texto}</span>
            </li>
          ))}
        </ol>
      </Pergaminho>

      {/* Retrato em moldura de madeira, pregado torto como os papéis. */}
      <div className="pergaminho-sombra absolute" style={{ left: 1200, top: 60, rotate: '2deg' }}>
        <div className="quadro-madeira !p-4">
          <img src={RETRATO} alt="O Taverneiro" className="block h-[400px] w-[400px] rounded-sm object-cover" draggable={false} />
        </div>
        <span className="cravo" aria-hidden />
      </div>
      <Pergaminho variante="etiqueta" angulo={-2} atraso={0.25} className="absolute" style={{ left: 1210, top: 530, width: 420 }}>
        <p className="font-texto text-[32px] italic leading-snug">“{regras.taverneiro.fala}”</p>
        <p className="mt-2 font-titulo text-[24px] font-bold">{regras.taverneiro.legenda}</p>
      </Pergaminho>
    </>
  );
}
