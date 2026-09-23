import { motion, useReducedMotion } from 'framer-motion';
import type { Bloco, Logica } from '../../data/rodada';
import { COR, NOME, SIGILO } from '../cartas/logicas';
import { FormaGema } from '../cartas/FormaGema';
import { Icone } from '../ui/Icone';

// Blocos no desenho clássico do Business Model Canvas (5 colunas + base de
// custos e receitas), como os alunos o conhecem do Artigo B.
const BLOCOS: { id: Bloco; nome: string; icone: string; area: string }[] = [
  { id: 'parcerias', nome: 'Parcerias', icone: 'shaking-hands', area: '1 / 1 / 3 / 3' },
  { id: 'atividades', nome: 'Atividades', icone: 'gears', area: '1 / 3 / 2 / 5' },
  { id: 'recursos', nome: 'Recursos', icone: 'chest', area: '2 / 3 / 3 / 5' },
  { id: 'proposta', nome: 'Proposta de valor', icone: 'gem-pendant', area: '1 / 5 / 3 / 7' },
  { id: 'relacionamento', nome: 'Relacionamento', icone: 'conversation', area: '1 / 7 / 2 / 9' },
  { id: 'canais', nome: 'Canais', icone: 'shop', area: '2 / 7 / 3 / 9' },
  { id: 'segmentos', nome: 'Segmentos', icone: 'three-friends', area: '1 / 9 / 3 / 11' },
  { id: 'custos', nome: 'Custos', icone: 'money-stack', area: '3 / 1 / 4 / 6' },
  { id: 'receitas', nome: 'Receitas', icone: 'profit', area: '3 / 6 / 4 / 11' },
];

const LARGURA_BASE = 420;
const ORDEM: Logica[] = ['planejar', 'adaptar', 'combinar', 'bricolagem'];

// Uma lógica pinta o bloco; duas ou mais o deixam listrado ("Canvas em
// movimento", 02-jogabilidade.md §6).
function pintura(logicas: Logica[]): string | undefined {
  const unicas = [...new Set(logicas)];
  if (unicas.length === 0) return undefined;
  if (unicas.length === 1) return `color-mix(in srgb, ${COR[unicas[0]]} 72%, #140d08)`;
  const faixas = unicas.map((l, i) => `color-mix(in srgb, ${COR[l]} 72%, #140d08) ${i * 16}px ${(i + 1) * 16}px`).join(', ');
  return `repeating-linear-gradient(135deg, ${faixas})`;
}

interface TapecariaProps {
  canvas: Partial<Record<Bloco, Logica[]>>;
  // Blocos acesos agora (animação de tinta se espalhando).
  destaque?: Bloco[];
  largura?: number;
  titulo?: string;
  // Legenda de cores embaixo (a cor sozinha não diz qual lógica é).
  legenda?: boolean;
}

// A "Tapeçaria da Guilda": o Canvas da turma (ou o real) se acendendo.
export function Tapecaria({ canvas, destaque = [], largura = LARGURA_BASE, titulo = 'Tapeçaria da Guilda', legenda = true }: TapecariaProps) {
  const reduzido = useReducedMotion();
  const presentes = new Set(Object.values(canvas).flat());
  const naLegenda = presentes.size > 0 ? ORDEM.filter((l) => presentes.has(l)) : ORDEM.slice(0, 3);
  return (
    <div style={{ zoom: largura / LARGURA_BASE }} className="w-[420px]">
      <p className="mb-2 font-titulo text-[22px] font-bold text-ouro [text-shadow:0_2px_3px_rgb(0_0_0/0.9)]">{titulo}</p>
      <div className="grid h-[240px] grid-cols-10 grid-rows-3 gap-1 rounded-md border-2 border-ouro-escuro bg-madeira-profunda/90 p-1 shadow-carta">
        {BLOCOS.map((bloco) => {
          const logicas = canvas[bloco.id] ?? [];
          const fundo = pintura(logicas);
          const aceso = destaque.includes(bloco.id);
          return (
            <div
              key={bloco.id}
              className="relative flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-sm border border-pergaminho/15 bg-madeira text-center"
              style={{ gridArea: bloco.area }}
              title={bloco.nome}
            >
              {fundo && (
                <motion.div
                  className="absolute inset-0"
                  style={{ background: fundo }}
                  initial={aceso && !reduzido ? { clipPath: 'circle(0% at 50% 50%)' } : false}
                  animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}
              {/* Sigilos das lógicas que construíram o bloco. */}
              {fundo && (
                <span className="absolute right-0.5 top-0.5 flex gap-px">
                  {[...new Set(logicas)].map((l) => (
                    <span key={l} className="rounded-full bg-black/55 p-px text-pergaminho">
                      <Icone nome={SIGILO[l]} className="h-3.5 w-3.5" />
                    </span>
                  ))}
                </span>
              )}
              <span className={`relative ${fundo ? 'text-pergaminho' : 'text-pergaminho/35'}`}>
                <Icone nome={bloco.icone} className="h-7 w-7" />
              </span>
              <span
                className={`relative px-0.5 font-texto text-[13px] font-bold leading-none [text-shadow:0_1px_2px_rgb(0_0_0/0.9)] ${
                  fundo ? 'text-pergaminho' : 'text-pergaminho/40'
                }`}
              >
                {bloco.nome}
              </span>
            </div>
          );
        })}
      </div>
      {legenda && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-texto text-[17px] font-bold text-pergaminho [text-shadow:0_1px_2px_rgb(0_0_0/0.9)]">
          {naLegenda.map((l) => (
            <span key={l} className="flex items-center gap-1">
              <FormaGema logica={l} className="h-4 w-4" />
              <Icone nome={SIGILO[l]} className="h-4 w-4" />
              {NOME[l]}
            </span>
          ))}
          <span className="flex items-center gap-1 text-pergaminho/80">
            <span className="h-4 w-4 rounded-sm" style={{ background: `repeating-linear-gradient(135deg, ${COR.planejar} 0 4px, ${COR.adaptar} 4px 8px)` }} />
            listrado = mais de uma
          </span>
        </div>
      )}
    </div>
  );
}
