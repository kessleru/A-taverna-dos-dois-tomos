import { Botao } from './Botao';

interface ControlesFaseProps {
  avancar: () => void;
  voltar: () => void;
  primeiraFase: boolean;
  ultimaFase: boolean;
  rotuloAvancar?: string;
}

export function ControlesFase({ avancar, voltar, primeiraFase, ultimaFase, rotuloAvancar }: ControlesFaseProps) {
  return (
    <div className="mt-10 flex items-center gap-4">
      {!primeiraFase && (
        <Botao variante="fantasma" onClick={voltar}>
          Voltar
        </Botao>
      )}
      {!ultimaFase && <Botao onClick={avancar}>{rotuloAvancar ?? 'Continuar'}</Botao>}
    </div>
  );
}
