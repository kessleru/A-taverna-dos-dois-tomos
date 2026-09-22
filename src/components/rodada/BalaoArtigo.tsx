export function BalaoArtigo({ letra, texto }: { letra: 'A' | 'B'; texto: string }) {
  const cor = letra === 'A' ? 'var(--artigo-a)' : 'var(--artigo-b)';
  return (
    <div className="flex-1 rounded-carta border-4 bg-papel p-4 text-tinta" style={{ borderColor: cor }}>
      <span
        className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full font-titulo text-papel"
        style={{ backgroundColor: cor }}
      >
        {letra}
      </span>
      <p className="text-sm font-medium">{texto}</p>
    </div>
  );
}
