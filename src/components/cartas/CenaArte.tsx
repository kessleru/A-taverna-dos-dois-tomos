import type { ArteCarta } from '../../data/artes';

const EMOJI_PARTICULAS: Record<ArteCarta['particulas'], string> = {
  faiscas: '✨',
  poeira: '·',
  bolhas: '○',
  moedas: '◆',
  folhas: '❀',
  estrelas: '★',
};

export function CenaArte({ arte, nome }: { arte: ArteCarta; nome: string }) {
  const emoji = EMOJI_PARTICULAS[arte.particulas];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `radial-gradient(circle at 50% 35%, ${arte.cores[0]}, ${arte.cores[1]})` }}
    >
      {arte.imagem ? (
        // Sem loading="lazy": todas as artes já vêm decodificadas da tela de
        // carregamento, e o lazy fazia a carta aparecer um quadro sem imagem.
        <img src={arte.imagem} alt={nome} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[3.5rem] drop-shadow-lg">
          {arte.icone}
        </span>
      )}

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 6 }).map((_, indice) => (
          <span
            key={indice}
            className="absolute text-xs opacity-60"
            style={{
              left: `${12 + indice * 14}%`,
              top: `${18 + ((indice * 37) % 70)}%`,
              color: arte.cores[0],
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 24px 6px rgb(0 0 0 / 0.35)' }}
      />
    </div>
  );
}
