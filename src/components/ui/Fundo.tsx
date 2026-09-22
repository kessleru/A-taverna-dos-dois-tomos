export function Fundo() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 40%, var(--noite) 0%, var(--noite-profunda) 100%)',
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]">
        <defs>
          <pattern id="grade-pontos" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grade-pontos)" />
      </svg>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          boxShadow: 'inset 0 0 220px 60px var(--noite-profunda)',
        }}
      />
    </div>
  );
}
