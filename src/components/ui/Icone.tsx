import { ICONES } from './icones';

// Ícone do game-icons.net pintado com a cor do texto (fill="currentColor").
// É SVG embutido, e não mask-image: o Chrome escala máscaras errado dentro de
// elementos com zoom, como as cartas. O HTML injetado vem só dos SVGs do
// próprio repositório (empacotados no build), nunca de dados de usuário.
interface IconeProps {
  nome: string;
  className?: string;
  // Texto para leitor de tela; sem ele o ícone é decorativo.
  titulo?: string;
}

export function Icone({ nome, className = '', titulo }: IconeProps) {
  return (
    <span
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      className={`inline-block shrink-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: ICONES[nome] ?? '' }}
    />
  );
}
