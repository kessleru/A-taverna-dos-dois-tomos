import { briefing } from '../../data/rodada';
import { Pergaminho } from '../../components/ui/Pergaminho';
import { Icone } from '../../components/ui/Icone';

const RETRATO = `${import.meta.env.BASE_URL}assets/personagens/taverneiro.webp`;
const ROMANOS = ['I', 'II', 'III', 'IV', 'V'];
// O ciclo de cada etapa, com os mesmos nomes da trilha no alto da rodada.
const CICLO = [
  { rotulo: 'Desafio', icone: 'scroll-quill' },
  { rotulo: 'Voto', icone: 'three-friends' },
  { rotulo: 'Dado', icone: 'dice-twenty-faces-one' },
  { rotulo: 'Crônica', icone: 'open-book' },
  { rotulo: 'Destino', icone: 'candle-light' },
];

// Folha 4: as regras num pergaminho, numeradas em romanos (são uma sequência
// de fato), e o retrato do Taverneiro pregado ao lado.
export function FolhaRegras() {
  const { regras } = briefing;

  return (
    <>
      <Pergaminho variante="aviso" angulo={-0.8} className="absolute" style={{ left: 70, top: 24, width: 1080 }}>
        <h2 className="font-titulo text-[56px] font-bold leading-none">{regras.titulo}</h2>
        <div className="ornamento my-3" aria-hidden>
          ❦
        </div>
        <ol className="space-y-2">
          {regras.itens.map((regra, i) => (
            <li key={regra.texto} className="flex items-center gap-5">
              <span className="w-16 shrink-0 text-right font-titulo text-[38px] font-bold text-ouro-escuro">{ROMANOS[i]}</span>
              <span className="flex w-[156px] shrink-0 justify-center gap-1 text-tinta">
                {regra.icones.map((icone) => (
                  <Icone key={icone} nome={icone} className="h-12 w-12" />
                ))}
              </span>
              <span className="font-texto text-[30px] leading-snug">{regra.texto}</span>
            </li>
          ))}
        </ol>
        {/* Cada etapa, em cinco passos: o mesmo desenho da trilha da rodada. */}
        <div className="mt-4 flex items-center gap-3 border-t-2 border-dashed border-tinta/25 pt-3">
          <span className="w-[150px] shrink-0 font-titulo text-[24px] font-bold leading-tight text-cera">Cada etapa:</span>
          {CICLO.map((passo, i) => (
            <span key={passo.rotulo} className="flex items-center gap-3">
              {i > 0 && (
                <span className="font-titulo text-[28px] text-ouro-escuro" aria-hidden>
                  ➝
                </span>
              )}
              <span className="flex flex-col items-center gap-1">
                <span className="text-tinta">
                  <Icone nome={passo.icone} className="h-10 w-10" />
                </span>
                <span className="font-titulo text-[20px] font-bold uppercase tracking-[0.06em]">{passo.rotulo}</span>
              </span>
            </span>
          ))}
        </div>
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
