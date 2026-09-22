import { motion } from 'framer-motion';
import { arteLendaria } from '../../data/artes';
import { CartaBase } from './CartaBase';
import { MolduraCarta } from './MolduraCarta';

export function CartaLendaria({ nome = 'Aprendizados' }: { nome?: string }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 10 }).map((_, indice) => (
          <motion.span
            key={indice}
            className="absolute text-moeda"
            style={{ left: `${(indice * 37) % 100}%`, bottom: 0 }}
            animate={{ y: [-10, -220], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + (indice % 3), repeat: Infinity, delay: indice * 0.3, ease: 'easeOut' }}
          >
            ✦
          </motion.span>
        ))}
      </div>
      <CartaBase
        corPrincipal="var(--moeda)"
        tamanho="grande"
        frente={
          <MolduraCarta tipo="lendaria" nome={nome} orbe="🏆" arte={arteLendaria} corPrincipal="var(--moeda)">
            <p className="font-bold text-moeda">Os aprendizados dos dois artigos, juntos.</p>
          </MolduraCarta>
        }
      />
    </div>
  );
}
