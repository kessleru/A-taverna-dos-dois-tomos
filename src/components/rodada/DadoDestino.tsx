import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { dadoDoDestino, type Escolha, type Etapa } from '../../data/rodada';
import { bonusDoContexto } from '../../engine/motor';
import { Icone } from '../ui/Icone';
import { ReguaDado, minimoNoDado } from './ReguaDado';

function comSinal(valor: number) {
  return valor > 0 ? `+${valor}` : `${valor}`;
}

// Painel do Dado do Destino antes da rolagem (02-jogabilidade.md §4, no
// estilo do Baldur's Gate 3): a CD no alto, o bônus do contexto somado
// embaixo e o d20 esperando. Clique no dado ou → rola.
export function DadoDestino({ etapa, etapaIndice, escolha, onRolar }: { etapa: Etapa; etapaIndice: number; escolha: Escolha; onRolar: () => void }) {
  const reduzido = useReducedMotion();
  const niveis = [
    ['Micro', etapa.leitura.micro.setas[escolha] ?? 0],
    ['Meso', etapa.leitura.meso.setas[escolha] ?? 0],
    ['Macro', etapa.leitura.macro.setas[escolha] ?? 0],
  ] as const;
  const bonus = bonusDoContexto(etapaIndice, escolha);
  const { minimo, chance } = minimoNoDado(bonus);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.defaultPrevented) return;
      if (evento.key === 'ArrowRight' || evento.key === ' ' || evento.key === 'PageDown') {
        evento.preventDefault();
        onRolar();
      }
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, [onRolar]);

  return (
    <div className="flex items-center gap-16" data-guia="dado">
      <motion.button
        type="button"
        onClick={onRolar}
        className="relative text-ouro drop-shadow-[0_10px_20px_rgb(0_0_0/0.8)]"
        aria-label="Rolar o Dado do Destino"
        animate={reduzido ? undefined : { rotate: [-4, 4, -4], y: [0, -8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08 }}
      >
        <Icone nome="dice-twenty-faces-one" className="h-[300px] w-[300px]" />
      </motion.button>

      <div className="pergaminho-sombra w-[620px]">
        <div className="pergaminho pergaminho-aviso !py-8">
          <h2 className="font-titulo text-[48px] font-bold leading-none">Dado do Destino</h2>
          <p className="mt-3 font-texto text-[28px] leading-snug">
            Dado + bônus do contexto: <strong className="font-titulo text-[36px]">{dadoDoDestino.cd}</strong> ou mais faz a carta render o esperado.
          </p>
          <p className="mt-4 font-titulo text-[24px] font-bold">Bônus do contexto</p>
          <ul className="mt-1 space-y-0.5 font-texto text-[26px]">
            {niveis.map(([nome, valor]) => (
              <li key={nome} className="flex justify-between">
                <span>{nome}</span>
                <span className="font-titulo font-bold">{comSinal(valor)}</span>
              </li>
            ))}
            {escolha === 'combinar' && (
              <li className="flex justify-between">
                <span>Experiência (Combinar)</span>
                <span className="font-titulo font-bold">{comSinal(dadoDoDestino.bonusCombinar)}</span>
              </li>
            )}
            <li className="flex justify-between border-t-2 border-tinta/30 pt-1 font-bold">
              <span>Total</span>
              <span className="font-titulo text-[34px]" style={{ color: bonus >= 0 ? 'var(--cura)' : 'var(--dano)' }}>
                {comSinal(bonus)}
              </span>
            </li>
          </ul>
          <p className="mt-5 font-texto text-[26px] leading-tight">
            No dado, tirem <strong className="font-titulo text-[32px]">{minimo}</strong> ou mais
            <span className="italic text-tinta/70"> · {chance}% de chance</span>
          </p>
          <div className="mt-2">
            <ReguaDado bonus={bonus} claro />
          </div>
          <p className="mt-4 font-texto text-[22px] italic text-tinta/75">Clique no dado ou aperte → para rolar.</p>
        </div>
      </div>
    </div>
  );
}
