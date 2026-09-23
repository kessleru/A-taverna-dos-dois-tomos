// Ícone de public/assets/icones/ (game-icons.net) pintado com a cor do texto.
// Usa mask-image porque um SVG em <img> não herda currentColor.
interface IconeProps {
  nome: string;
  className?: string;
  // Texto para leitor de tela; sem ele o ícone é decorativo.
  titulo?: string;
}

export function Icone({ nome, className = '', titulo }: IconeProps) {
  const url = `url(${import.meta.env.BASE_URL}assets/icones/${nome}.svg)`;
  return (
    <span
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}
