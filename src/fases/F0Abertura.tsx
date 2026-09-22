import { Titulo } from '../components/ui/Titulo';
import { Botao } from '../components/ui/Botao';
import type { FaseProps } from '../types';

export function F0Abertura({ avancar }: FaseProps) {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="font-mono text-fosforo">
        &gt; buscando periódicos CAPES...
        <br />
        &gt; 2 artigos encontrados
        <br />
        &gt; iniciando arena...
      </p>
      <Titulo>Startup Arena</Titulo>
      <Botao onClick={avancar}>Começar</Botao>
    </section>
  );
}
