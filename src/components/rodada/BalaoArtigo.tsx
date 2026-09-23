export function BalaoArtigo({ letra, texto }: { letra: 'A' | 'B'; texto: string }) {
  const cor = letra === 'A' ? 'var(--tomo-a)' : 'var(--tomo-b)';
  return (
    <div className="flex-1 rounded-carta border-4 bg-pergaminho p-4 text-tinta" style={{ borderColor: cor }}>
      <span
        className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full font-titulo text-pergaminho"
        style={{ backgroundColor: cor }}
      >
        {letra}
      </span>
      <p className="text-sm font-medium">{texto}</p>
    </div>
  );
}
