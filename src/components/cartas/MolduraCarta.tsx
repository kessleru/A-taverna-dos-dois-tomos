import type { ReactNode } from 'react';
import { tipos, type ArteCarta, type TipoCarta } from '../../data/artes';
import { CenaArte } from './CenaArte';
import { ESCALA_CARTA } from './escala';

const COR_GEMA: Record<ArteCarta['raridade'], string> = {
  comum: '#C7CCD6',
  rara: '#5AC8FA',
  lendaria: '#F9C80E',
};

const CLIP_JANELA: Record<'arco' | 'retangulo' | 'ponta', string> = {
  arco: '12px 12px 8px 8px / 22px 22px 8px 8px',
  retangulo: '10px',
  ponta: '',
};

interface MolduraCartaProps {
  tipo: TipoCarta;
  nome: string;
  orbe: ReactNode;
  arte: ArteCarta;
  corPrincipal: string;
  tamanho?: 'grande' | 'pequena';
  children: ReactNode;
}

export function MolduraCarta({ tipo, nome, orbe, arte, corPrincipal, tamanho = 'grande', children }: MolduraCartaProps) {
  const info = tipos[tipo];
  const janelaEstilo =
    info.janela === 'ponta'
      ? { clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)' }
      : { borderRadius: CLIP_JANELA[info.janela] };

  return (
    <div
      className="relative flex select-none flex-col overflow-visible rounded-carta p-3"
      style={{
        width: tamanho === 'grande' ? 260 : 170,
        aspectRatio: '5 / 7',
        zoom: ESCALA_CARTA,
        background: `linear-gradient(160deg, ${corPrincipal}dd, #171225)`,
        boxShadow: `var(--sombra-carta), 0 0 32px -8px ${corPrincipal}88`,
        border: `2px solid ${corPrincipal}`,
      }}
    >
      {/* orbe */}
      <div
        className="absolute -left-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-pergaminho/80 font-titulo text-sm text-pergaminho"
        style={{ background: corPrincipal, boxShadow: '0 4px 10px rgb(0 0 0 / 0.4)' }}
      >
        {orbe}
      </div>

      {/* fita do nome */}
      <div
        className="relative z-10 -mx-1 mb-2 rounded px-2 py-1 text-center font-titulo text-[11px] leading-tight text-pergaminho"
        style={{ background: `linear-gradient(90deg, transparent, ${corPrincipal}, transparent)` }}
      >
        {nome}
      </div>

      {/* janela de arte */}
      <div
        className="relative overflow-hidden border-2"
        style={{ ...janelaEstilo, borderColor: '#F9C80E88', height: tamanho === 'grande' ? '46%' : '42%' }}
      >
        <CenaArte arte={arte} nome={nome} />
      </div>

      {/* placa de tipo */}
      <div className="relative z-10 -mt-2 flex justify-center">
        <span
          className="flex items-center gap-1 rounded-full border border-pergaminho/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-pergaminho"
          style={{ background: '#17123aee' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: COR_GEMA[arte.raridade], boxShadow: arte.raridade === 'lendaria' ? '0 0 6px 2px #F9C80E' : undefined }} />
          {info.nome}
        </span>
      </div>

      {/* área de texto */}
      <div className="relative mt-2 flex-1 overflow-hidden rounded-md bg-pergaminho px-2 py-2 text-[11px] leading-snug text-tinta">
        {children}
      </div>
    </div>
  );
}
