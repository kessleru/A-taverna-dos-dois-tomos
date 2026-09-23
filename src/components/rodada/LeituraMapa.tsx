import { motion } from 'framer-motion';
import type { Escolha, Etapa } from '../../data/rodada';
import { COR, NOME, SIGILO } from '../cartas/logicas';
import { Icone } from '../ui/Icone';
import { useSonsEmSequencia } from '../../engine/useSonsEmSequencia';

const NIVEIS = [
  { chave: 'micro', rotulo: 'Micro', pergunta: 'quem decide' },
  { chave: 'meso', rotulo: 'Meso', pergunta: 'a fase da empresa' },
  { chave: 'macro', rotulo: 'Macro', pergunta: 'o contexto' },
] as const;

function Setas({ valor }: { valor: number }) {
  if (valor === 0) return <span className="text-pergaminho/50">—</span>;
  const cor = valor > 0 ? 'var(--cura)' : 'var(--dano)';
  return (
    <span className="font-titulo font-bold" style={{ color: cor }}>
      {(valor > 0 ? '▲' : '▼').repeat(Math.abs(valor))}
    </span>
  );
}

// Leitura do Mapa (02-jogabilidade.md §3): as três etiquetas da matriz do
// Artigo A viram uma a uma; cada uma mostra quem o contexto ajuda.
export function LeituraMapa({ etapa, opcoes }: { etapa: Etapa; opcoes: Escolha[] }) {
  useSonsEmSequencia(NIVEIS.map((_, i) => ['virar-carta', 200 + i * 350]));
  return (
    <div className="flex gap-5" data-guia="leitura">
      {NIVEIS.map((nivel, i) => {
        const leitura = etapa.leitura[nivel.chave];
        return (
          <motion.div
            key={nivel.chave}
            className="pergaminho-sombra w-[400px]"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.35, duration: 0.45 }}
          >
            <div className="pergaminho pergaminho-etiqueta flex h-full flex-col gap-2 !py-5">
              <p className="font-titulo text-[24px] font-bold leading-none">
                {nivel.rotulo} <span className="font-texto text-[20px] font-medium italic text-tinta/70">· {nivel.pergunta}</span>
              </p>
              <p className="font-texto text-[26px] leading-tight">{leitura.texto}</p>
              {/* Plaquinhas escuras: sigilo e setas precisam ler de longe sobre o pergaminho. */}
              <div className="mt-auto flex flex-wrap gap-2 text-[24px]">
                {opcoes.map((escolha) => (
                  <span
                    key={escolha}
                    className="flex items-center gap-1.5 rounded-md border border-ouro-escuro/70 bg-madeira-profunda/90 px-2.5 py-1 shadow-carta"
                  >
                    <span style={{ color: COR[escolha] }}>
                      <Icone nome={SIGILO[escolha]} className="h-8 w-8" />
                    </span>
                    <span className="font-texto text-[20px] font-bold text-pergaminho">{NOME[escolha]}</span>
                    <Setas valor={leitura.setas[escolha] ?? 0} />
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
