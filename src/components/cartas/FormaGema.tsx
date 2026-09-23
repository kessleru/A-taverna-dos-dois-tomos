import type { Logica } from '../../data/rodada';
import { COR } from './logicas';

// Forma da gema de raridade (01-tema-e-hud.md §2): repete a cor da lógica para
// quem tem daltonismo e para quem está longe.
const FORMA: Record<Logica, string> = {
  planejar: 'M18 18h64v64H18z',
  adaptar: 'M50 14a36 36 0 1 0 0.01 0z',
  bricolagem: 'M50 12l33 19v38L50 88 17 69V31z',
  combinar: 'M50 8l11 27 29 2-22 19 7 29-25-16-25 16 7-29-22-19 29-2z',
};

export function FormaGema({ logica, className }: { logica: Logica; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={`brilho-${logica}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <path d={FORMA[logica]} fill={COR[logica]} stroke="#1a120c" strokeWidth="5" strokeLinejoin="round" />
      <path d={FORMA[logica]} fill={`url(#brilho-${logica})`} />
    </svg>
  );
}
