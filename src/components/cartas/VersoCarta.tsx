import { ESCALA_CARTA } from './escala';

const VERSO = `${import.meta.env.BASE_URL}assets/cartas/verso.webp`;

// Verso único para todas as cartas (madeira, ouro e o emblema dos dois tomos);
// só o brilho em volta muda com a cor da carta, para mostrar de que tipo ela é.
export function VersoCarta({ corPrincipal, tamanho = 'grande' }: { corPrincipal: string; tamanho?: 'grande' | 'pequena' }) {
  return (
    <img
      src={VERSO}
      alt=""
      draggable={false}
      className="block select-none rounded-carta"
      style={{
        width: tamanho === 'grande' ? 260 : 170,
        aspectRatio: '5 / 7',
        zoom: ESCALA_CARTA,
        boxShadow: `var(--sombra-carta), 0 0 28px -8px ${corPrincipal}`,
      }}
    />
  );
}
