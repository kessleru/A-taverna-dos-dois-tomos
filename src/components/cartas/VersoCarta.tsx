export function VersoCarta({ corPrincipal, tamanho = 'grande' }: { corPrincipal: string; tamanho?: 'grande' | 'pequena' }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-carta border-2"
      style={{
        width: tamanho === 'grande' ? 260 : 170,
        aspectRatio: '5 / 7',
        borderColor: corPrincipal,
        background: `repeating-linear-gradient(45deg, ${corPrincipal}33 0 10px, ${corPrincipal}55 10px 20px), linear-gradient(160deg, ${corPrincipal}dd, #171225)`,
        boxShadow: 'var(--sombra-carta)',
      }}
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-moeda font-titulo text-xl text-moeda"
        style={{ background: '#17123acc' }}
      >
        SA
      </span>
    </div>
  );
}
