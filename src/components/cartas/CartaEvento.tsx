import { motion, useReducedMotion } from 'framer-motion';
import { arteEventos } from '../../data/artes';
import { CenaArte } from './CenaArte';
import { Icone } from '../ui/Icone';
import { Chuva, Cintilas } from '../ui/Particulas';

// Quanto tempo (s) a carta fica de costas na mesa antes de virar.
export const VIRA_EM = 0.5;
export const VERSO_DESTINO = `${import.meta.env.BASE_URL}assets/cartas/verso-destino.webp`;

// Estrelas que piscam na moldura noturna depois que a carta vira.
const BRILHOS_MOLDURA = [
  { x: 4, y: 3, tamanho: 44, atraso: 0 },
  { x: 96, y: 8, tamanho: 34, atraso: 0.6 },
  { x: 97, y: 55, tamanho: 30, atraso: 1.2 },
  { x: 3, y: 42, tamanho: 36, atraso: 0.9 },
  { x: 6, y: 96, tamanho: 32, atraso: 1.5 },
  { x: 94, y: 97, tamanho: 42, atraso: 0.3 },
];

interface CartaEventoProps {
  depoisDaEtapa: number;
  nome: string;
  desfecho: { titulo: string; texto: string; efeito: Partial<{ caixa: number; clientes: number; moral: number }> };
  sucesso: boolean;
}

// Mesmos ícones e cores dos orbes do HUD.
const INDICADORES = {
  caixa: { rotulo: 'Caixa', icone: 'shiny-purse', cor: 'var(--ouro)' },
  clientes: { rotulo: 'Clientes', icone: 'flying-flag', cor: 'var(--clientes)' },
  moral: { rotulo: 'Moral', icone: 'flamer', cor: 'var(--brasa)' },
} as const;

// Carta do Destino (03-historia.md §5, eventos): não é uma decisão, é o mundo
// respondendo ao que a turma construiu. Por isso não tem o formato do
// desafio (a mesa de madeira): é uma carta vertical, noturna, com moldura de
// estrelas, que vira na mesa mostrando o desfecho e o que ele muda nos orbes.
export function CartaEvento({ depoisDaEtapa, nome, desfecho, sucesso }: CartaEventoProps) {
  const reduzido = useReducedMotion();
  const arte = arteEventos[`${depoisDaEtapa}-${sucesso ? 'sim' : 'nao'}`];

  return (
    // A carta pousa na mesa de costas (o verso noturno), espera um instante e
    // vira. Cada face esconde as costas (backface-visibility), então no meio do
    // giro aparece o verso, e não a frente espelhada. A opacidade da entrada
    // fica no invólucro de fora: opacidade abaixo de 1 no mesmo elemento do
    // preserve-3d faz o Chrome achatar a cena e mostrar a frente ao contrário.
    <motion.div
      className="relative h-[720px] w-[520px] shrink-0"
      initial={reduzido ? false : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ scale: { duration: 0.4, ease: 'easeOut' }, opacity: { duration: 0.3 } }}
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ transformPerspective: 1600 }}
        initial={reduzido ? false : { rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: VIRA_EM }}
      >
        <img
          src={VERSO_DESTINO}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-[18px] shadow-[0_0_40px_-6px_rgb(155_123_255/0.55),0_24px_48px_-12px_rgb(0_0_0/0.75)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
        />
        <div className="carta-destino absolute inset-0 flex flex-col [backface-visibility:hidden]">
          <span className="carta-destino-ceu" aria-hidden />
          {/* Faixa do topo: o nome do tipo de carta, para ninguém confundir com um desafio. */}
          <p className="relative flex items-center justify-center gap-3 py-3 font-titulo text-[22px] font-bold uppercase tracking-[0.2em] text-ouro-claro [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">
            <span className="text-[14px] text-ouro/80" aria-hidden>
              ✦
            </span>
            Carta do Destino
            <span className="text-[14px] text-ouro/80" aria-hidden>
              ✦
            </span>
          </p>
          <div className="relative mx-5 h-[230px] shrink-0 overflow-hidden rounded-[6px]">
            {arte && <CenaArte arte={arte} nome={nome} />}
            <span className="moldura-ilustracao pointer-events-none absolute inset-0" aria-hidden />
          </div>
          <div className="pergaminho relative m-5 mt-4 flex flex-1 flex-col items-center justify-center gap-2 !px-7 !py-5 text-center [clip-path:none]">
            <p className="font-titulo text-[20px] font-bold uppercase tracking-[0.06em] text-ouro-escuro">{nome}</p>
            <h2 className="font-titulo text-[36px] font-bold leading-[1.05]" style={{ color: sucesso ? '#2f7a45' : 'var(--cera)' }}>
              {desfecho.titulo}
            </h2>
            <p className="font-texto text-[25px] leading-snug">{desfecho.texto}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {(Object.keys(INDICADORES) as (keyof typeof INDICADORES)[])
                .filter((chave) => desfecho.efeito[chave])
                .map((chave) => {
                  const valor = desfecho.efeito[chave]!;
                  const { rotulo, icone, cor } = INDICADORES[chave];
                  return (
                    <span
                      key={chave}
                      className="placa-ferro-pequena flex items-center gap-1.5 px-3 py-1 font-titulo text-[20px] font-bold text-pergaminho shadow-carta"
                    >
                      <span style={{ color: cor }}>
                        <Icone nome={icone} className="h-6 w-6" />
                      </span>
                      {rotulo}
                      <span style={{ color: valor > 0 ? 'var(--cura)' : 'var(--dano)' }}>{valor > 0 ? `▲ +${valor}` : `▼ −${Math.abs(valor)}`}</span>
                    </span>
                  );
                })}
            </div>
          </div>
          <Cintilas pontos={BRILHOS_MOLDURA} cor={sucesso ? 'var(--ouro-claro)' : '#b9a6ff'} atraso={VIRA_EM + 0.7} />
          {/* Depois de virar: pó de ouro sobe no desfecho bom, cinzas caem no ruim. */}
          <Chuva tipo={sucesso ? 'ouro' : 'cinzas'} quantidade={sucesso ? 22 : 18} janela={1.4} atraso={VIRA_EM + 0.7} semente={depoisDaEtapa + 40} />
        </div>
      </motion.div>
    </motion.div>
  );
}
