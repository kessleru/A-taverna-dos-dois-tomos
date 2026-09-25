import { ArtePintada } from './ArtePintada';

// Selo de cera vermelho que fecha avisos e missões.
export function SeloCera({ className = '' }: { className?: string }) {
  return (
    <span className={`selo-pintado inline-block ${className}`}>
      <ArtePintada nome="selo" className="h-full w-full" />
    </span>
  );
}
