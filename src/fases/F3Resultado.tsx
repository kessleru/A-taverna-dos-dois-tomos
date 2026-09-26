import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { perfis, calcularPerfil, etapas, canvasReal, briefing, revelacaoBricolagem, type Bloco, type Logica } from '../data/rodada';
import { pontuacao, type EstadoRodada } from '../engine/motor';
import { ControlesFase } from '../components/ui/ControlesFase';
import { ContadorAnimado } from '../components/ui/ContadorAnimado';
import { Tapecaria } from '../components/hud/Tapecaria';
import { Impacto } from '../components/ui/Particulas';
import { Poeira } from '../components/ui/Poeira';
import { Icone } from '../components/ui/Icone';
import { OURO_E_BRASA, chuvaDeOuro } from '../components/ui/confete';
import { COR, SIGILO } from '../components/cartas/logicas';
import { useSonsEmSequencia } from '../engine/useSonsEmSequencia';
import { TREMOR, useTremorAoMontar } from '../components/ui/Tremor';
import type { FaseProps } from '../types';

interface F3ResultadoProps extends FaseProps {
  estadoRodada: EstadoRodada;
}

const PERFIS_COM_CONFETE = ['lendario', 'camaleao'];
// As estrelas do rank batem na medalha uma a uma, depois de ela ser forjada.
const ESTRELA_INICIO_S = 0.75;
const ESTRELA_INTERVALO_S = 0.3;
const METAL_DO_RANK: Record<number, [string, string, string]> = {
  3: ['#fff3c4', '#e8b64a', '#8a5a12'],
  2: ['#f4f6f8', '#b9c0c8', '#5d646c'],
  1: ['#f3c9a2', '#b87333', '#5e3413'],
};
// A fundação real foi Adaptar com etiqueta Bricolagem (03-historia.md §5).
const LOGICA_REAL: Logica[] = ['bricolagem', 'adaptar', 'planejar', 'combinar'];

// Tapeçaria real acumulada até a última etapa (mesma regra da turma).
function canvasRealAcumulado(): Partial<Record<Bloco, Logica[]>> {
  const total: Partial<Record<Bloco, Logica[]>> = {};
  for (const etapa of canvasReal) {
    for (const [bloco, logicas] of Object.entries(etapa) as [Bloco, Logica[]][]) {
      total[bloco] = [...new Set([...(total[bloco] ?? []), ...logicas])];
    }
  }
  return total;
}

// F3 (03-historia.md §6): o rank forjado como medalha, o título da guilda num
// estandarte, "Vocês × a Healthy Skin" com fio de ouro nas escolhas iguais e
// a Tapeçaria da turma ao lado da real.
export function F3Resultado({ estadoRodada, ...props }: F3ResultadoProps) {
  const reduzido = useReducedMotion();
  const { escolhas, ind, canvas, bricolagem } = estadoRodada;
  const { total, estrelas, rank } = pontuacao(ind);
  const completa = escolhas.length === etapas.length;
  const perfilId = completa ? calcularPerfil(escolhas) : undefined;
  const perfil = perfilId ? perfis[perfilId] : undefined;
  const acertos = etapas.filter((etapa, i) => escolhas[i] === etapa.ideal).length;
  const [claro, medio, escuro] = METAL_DO_RANK[estrelas];
  // Sons no compasso das animações: medalha forjada, moedas da contagem,
  // estandarte descendo, um ping por fio de ouro e o público no fim.
  useSonsEmSequencia([
    ['metal', 150],
    ['moedas', 500],
    ...Array.from({ length: estrelas }, (_, i) => ['brilho', (ESTRELA_INICIO_S + i * ESTRELA_INTERVALO_S) * 1000 + 120] as const),
    ['estandarte', 1250],
    ...(estrelas >= 2 ? ([['vitoria', 1000]] as const) : []),
    ...etapas.flatMap((etapa, i) => (escolhas[i] === etapa.ideal ? ([['ping', 1800 + i * 250]] as const) : [])),
    ...(perfilId && PERFIS_COM_CONFETE.includes(perfilId) ? ([['publico-comemora', 1600]] as const) : []),
  ]);

  // A medalha é forjada na bigorna.
  useTremorAoMontar(TREMOR.medio * 0.8, 250);

  useEffect(() => {
    if (!perfilId || !PERFIS_COM_CONFETE.includes(perfilId)) return;
    const id = setTimeout(() => {
      chuvaDeOuro({ particleCount: 140, spread: 100, origin: { y: 0.35 }, colors: OURO_E_BRASA });
    }, 1600);
    return () => clearTimeout(id);
  }, [perfilId]);

  return (
    <section className="flex h-full gap-14 px-20 pb-8 pt-10">
      {/* Rank e título */}
      <div className="relative flex w-[640px] shrink-0 flex-col items-center gap-6">
        {/* Poeira dourada só para o rank mais alto, sem exagero. */}
        {estrelas === 3 && <Poeira quantidade={20} semente={31} />}
        <motion.div
          className="relative flex h-[280px] w-[280px] flex-col items-center justify-center rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${claro}, ${medio} 45%, ${escuro})`,
            boxShadow: `0 0 0 10px ${escuro}, 0 0 0 14px ${medio}, 0 20px 40px rgb(0 0 0 / 0.7)`,
          }}
          initial={reduzido ? false : { scale: 0.4, filter: 'brightness(2.2) sepia(1) saturate(5) hue-rotate(-25deg)' }}
          animate={{ scale: 1, filter: 'brightness(1) sepia(0) saturate(1) hue-rotate(0deg)' }}
          transition={{ scale: { type: 'spring', stiffness: 160, damping: 14 }, filter: { duration: 1.6, ease: 'easeOut' } }}
        >
          {/* Fagulhas de bigorna quando a medalha é forjada. */}
          <Impacto cor="var(--brasa)" onda={300} raio={240} quantidade={16} atraso={0.25} />
          <span className="font-titulo text-[20px] font-bold uppercase tracking-[0.2em] text-tinta/80">Rank</span>
          <span className="px-6 text-center font-titulo text-[34px] font-bold leading-tight text-tinta">{rank}</span>
          <span className="mt-2 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => {
              const ganhou = i < estrelas;
              const atraso = ESTRELA_INICIO_S + i * ESTRELA_INTERVALO_S;
              return (
                <motion.span
                  key={i}
                  className={`relative font-titulo text-[40px] leading-none ${ganhou ? 'estrela-rank' : 'text-tinta/25'}`}
                  // Ganha: cai grande e girando, bate e assenta, com faíscas.
                  initial={reduzido || !ganhou ? false : { scale: 3.2, rotate: -140, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 15, delay: atraso }}
                >
                  ✦{ganhou && !reduzido && <Impacto cor="var(--ouro-claro)" onda={60} raio={46} quantidade={7} atraso={atraso + 0.12} />}
                </motion.span>
              );
            })}
          </span>
        </motion.div>

        <p className="font-titulo text-[34px] font-bold text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">
          <ContadorAnimado valor={total} /> pontos
        </p>

        {/* Estandarte com o título da guilda. */}
        <motion.div
          className="pergaminho-sombra w-full"
          initial={reduzido ? false : { scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.2, duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center gap-3 bg-gradient-to-b from-[#8a1c27] to-cera px-10 pb-14 pt-8 text-center text-pergaminho [clip-path:polygon(0_0,100%_0,100%_100%,50%_88%,0_100%)]">
            <p className="font-titulo text-[46px] font-bold leading-tight [text-shadow:0_2px_4px_rgb(0_0_0/0.6)]">
              {perfil?.nome ?? 'Crônica incompleta'}
            </p>
            <p className="font-texto text-[28px] leading-snug">{perfil?.texto ?? 'Joguem as 4 etapas para descobrir o título da guilda.'}</p>
          </div>
        </motion.div>
        <div className="mt-auto">
          <ControlesFase {...props} />
        </div>
      </div>

      {/* Vocês × a Healthy Skin */}
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <h2 className="titulo-ouro font-titulo text-[56px] font-bold leading-none">Vocês × a Healthy Skin</h2>
        <p className="font-texto text-[30px] italic text-pergaminho/85 [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">
          {acertos} de 4 escolhas iguais às da startup real.
        </p>

        <div className="grid grid-cols-4 gap-4">
          {etapas.map((etapa, i) => {
            // Quem descobriu a Bricolagem na fundação mostra a carta dela ali.
            const turma: Logica | undefined = bricolagem && i === revelacaoBricolagem.etapa ? 'bricolagem' : escolhas[i];
            const real = LOGICA_REAL[i];
            const igual = escolhas[i] === etapa.ideal;
            return (
              <div key={etapa.id} className="relative flex flex-col items-center gap-3 rounded-md bg-madeira-profunda/70 px-3 py-4">
                <p className="font-titulo text-[20px] font-bold text-pergaminho/85">{etapa.fase.replace(/^\d+\s*·\s*/, '')}</p>
                <span className="font-texto text-[20px] italic text-pergaminho/70">vocês</span>
                <span style={{ color: turma ? COR[turma] : 'rgb(243 230 200 / 0.3)' }}>
                  {turma ? <Icone nome={SIGILO[turma]} className="h-14 w-14" /> : <span className="font-titulo text-[40px]">—</span>}
                </span>
                {/* Fio de ouro ligando as escolhas iguais. */}
                <motion.span
                  className="h-10 w-1.5 rounded-full"
                  style={{ background: igual ? 'var(--ouro)' : 'rgb(243 230 200 / 0.12)', boxShadow: igual ? '0 0 12px var(--ouro)' : undefined }}
                  initial={reduzido ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.8 + i * 0.25 }}
                />
                <span style={{ color: COR[real] }}>
                  <Icone nome={SIGILO[real]} className="h-14 w-14" />
                </span>
                <span className="font-texto text-[20px] italic text-pergaminho/70">Healthy Skin</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-8">
          <Tapecaria canvas={canvas} titulo="Tapeçaria da turma" />
          <Tapecaria canvas={canvasRealAcumulado()} titulo="Tapeçaria real (Artigo B)" />
        </div>
        <p className="font-texto text-[26px] italic leading-snug text-pergaminho/85 [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">
          <strong className="font-titulo not-italic">{briefing.tomos.narradores.B.nome}:</strong> “Os blocos não nasceram juntos, nem seguiram a
          mesma lógica. É isso que eu chamo de Canvas em movimento.”
        </p>
      </div>
    </section>
  );
}
