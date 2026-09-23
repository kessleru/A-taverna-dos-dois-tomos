import { Icone } from './Icone';

// Selo de cera vermelho que fecha avisos e missões.
export function SeloCera({ className = '' }: { className?: string }) {
  return (
    <span className={`selo-cera inline-block ${className}`}>
      <Icone nome="wax-seal" className="h-full w-full" />
    </span>
  );
}
