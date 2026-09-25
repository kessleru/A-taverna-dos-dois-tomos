import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { aleatorio } from '../../engine/brasas';

// Partículas de um disparo só, cada uma amarrada a um instante do jogo
// (06-animacoes.md): nascem, fazem o gesto e somem. Todas são decorativas,
// não recebem o mouse e não aparecem com movimento reduzido. Posições
// com semente fixa, para o ensaio ser igual à apresentação.

interface Comum {
  // Segundos até disparar, para bater com a animação de quem as usa.
  atraso?: number;
  semente?: number;
  className?: string;
}

// Poeira que levanta da mesa quando algo bate nela (carta, dado, placa).
// Fica presa à base do elemento pai, que precisa ser relative.
export function Baforada({ atraso = 0, semente = 3, largura = 1, className = '' }: Comum & { largura?: number }) {
  const reduzido = useReducedMotion();
  const nuvens = useMemo(() => {
    const sorte = aleatorio(semente);
    return Array.from({ length: 9 }, (_, i) => {
      const lado = i % 2 === 0 ? -1 : 1;
      return {
        x: lado * (40 + sorte() * 130) * largura,
        y: -(10 + sorte() * 40),
        tamanho: 26 + sorte() * 34,
        duracao: 0.8 + sorte() * 0.5,
      };
    });
  }, [semente, largura]);
  if (reduzido) return null;
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center ${className}`} aria-hidden>
      {nuvens.map((n, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            width: n.tamanho,
            height: n.tamanho * 0.7,
            // O degradê já some nas bordas; um blur por nuvem custava um passe de
            // filtro a cada quadro.
            background: 'radial-gradient(circle, rgb(226 200 156 / 0.7), rgb(170 132 88 / 0.3) 50%, transparent 70%)',
          }}
          initial={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
          animate={{ x: n.x, y: n.y, scale: 1.6, opacity: [0, 0.9, 0] }}
          transition={{ delay: atraso, duration: n.duracao, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

interface ChuvaProps extends Comum {
  // Brasas sobem acesas; cinzas descem devagar; motes dourados sobem e piscam.
  tipo: 'brasas' | 'cinzas' | 'ouro';
  quantidade?: number;
  // Por quantos segundos novas partículas continuam nascendo.
  janela?: number;
  // Duração de uma queima de baixo para cima: cada brasa nasce na linha de
  // fogo, no instante em que ela passa pela sua altura.
  queima?: number;
}

const ESTILO_CHUVA = {
  brasas: { cor: '#ffb070', brilho: '0 0 10px 4px rgb(255 122 47 / 0.85)', distancia: -260, duracao: 1.4, tamanho: [4, 8] },
  cinzas: { cor: '#8c847c', brilho: '0 0 2px rgb(0 0 0 / 0.6)', distancia: 180, duracao: 2.6, tamanho: [4, 8] },
  ouro: { cor: 'var(--ouro-claro)', brilho: '0 0 8px 3px rgb(232 182 74 / 0.8)', distancia: -200, duracao: 2, tamanho: [3, 5] },
} as const;

// Chuva curta de partículas espalhadas pela largura do elemento pai.
export function Chuva({ tipo, quantidade = 16, janela = 0.8, queima, atraso = 0, semente = 5, className = '' }: ChuvaProps) {
  const reduzido = useReducedMotion();
  const estilo = ESTILO_CHUVA[tipo];
  const pontos = useMemo(() => {
    const sorte = aleatorio(semente);
    return Array.from({ length: quantidade }, () => {
      const y = queima ? sorte() * 100 : tipo === 'cinzas' ? sorte() * 30 : 55 + sorte() * 45;
      return {
        x: 5 + sorte() * 90,
        y,
        deriva: (sorte() * 2 - 1) * 50,
        tamanho: estilo.tamanho[0] + sorte() * (estilo.tamanho[1] - estilo.tamanho[0]),
        atraso: queima ? (1 - y / 100) * queima : sorte() * janela,
        duracao: estilo.duracao * (0.7 + sorte() * 0.6),
      };
    });
  }, [quantidade, janela, queima, semente, tipo, estilo]);
  if (reduzido) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`} aria-hidden>
      {pontos.map((p, i) => (
        <motion.span
          key={i}
          className={tipo === 'cinzas' ? 'absolute rounded-[2px]' : 'absolute rounded-full'}
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.tamanho, height: p.tamanho, background: estilo.cor, boxShadow: estilo.brilho }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: [0, p.deriva * 0.4, p.deriva],
            y: estilo.distancia * (0.6 + (i % 3) * 0.2),
            opacity: tipo === 'ouro' ? [0, 1, 0.3, 1, 0] : [0, 1, 0.8, 0],
            rotate: tipo === 'cinzas' ? 360 : 0,
          }}
          transition={{ delay: atraso + p.atraso, duration: p.duracao, ease: tipo === 'cinzas' ? 'linear' : 'easeOut' }}
        />
      ))}
    </div>
  );
}

interface ImpactoProps extends Comum {
  cor?: string;
  // Diâmetro da onda de luz, em px, e alcance das fagulhas.
  onda?: number;
  raio?: number;
  quantidade?: number;
  // Gotas (cera) caem com peso; fagulhas (metal, magia) voam retas.
  gotas?: boolean;
}

// Onda curta e fagulhas no ponto de impacto, no centro do elemento pai.
// Versão contida das Faiscas, para selos, marcos e blocos da tapeçaria.
export function Impacto({ cor = 'var(--ouro)', onda = 90, raio = 70, quantidade = 8, gotas = false, atraso = 0, className = '' }: ImpactoProps) {
  const reduzido = useReducedMotion();
  if (reduzido) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center ${className}`} aria-hidden>
      <motion.span
        className="absolute rounded-full border-[3px]"
        style={{ width: onda, height: onda, borderColor: cor, boxShadow: `0 0 14px ${cor}` }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.8, opacity: [0, 0.9, 0] }}
        transition={{ delay: atraso, duration: 0.6, ease: 'easeOut' }}
      />
      {Array.from({ length: quantidade }, (_, i) => {
        const angulo = (i / quantidade) * Math.PI * 2 + 0.3;
        const alcance = raio * (0.75 + (i % 3) * 0.15);
        const x = Math.cos(angulo) * alcance;
        const y = Math.sin(angulo) * alcance;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: gotas ? 9 : 5,
              height: gotas ? 9 : 5,
              background: gotas ? cor : 'var(--ouro-claro)',
              boxShadow: gotas ? 'inset -2px -2px 0 rgb(0 0 0 / 0.35)' : `0 0 8px 2px ${cor}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
            // Gotas descrevem um arco e caem; fagulhas saem em linha e se apagam.
            animate={gotas ? { x, y: [0, y - 20, y + 30], opacity: [0, 1, 1, 0], scale: [1, 1, 0.6] } : { x, y, opacity: [0, 1, 0], scale: 0.3 }}
            transition={{ delay: atraso, duration: gotas ? 0.7 : 0.55, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

// Bolhas subindo no líquido de um frasco (orbe do HUD quando o valor sobe).
export function Bolhas({ cor = '#fff', semente = 9, className = '' }: Comum & { cor?: string }) {
  const reduzido = useReducedMotion();
  const bolhas = useMemo(() => {
    const sorte = aleatorio(semente);
    return Array.from({ length: 6 }, () => ({ x: 25 + sorte() * 50, tamanho: 4 + sorte() * 6, atraso: sorte() * 0.5, duracao: 0.9 + sorte() * 0.5 }));
  }, [semente]);
  if (reduzido) return null;
  return (
    <div className={`pointer-events-none absolute overflow-hidden rounded-full ${className}`} aria-hidden>
      {bolhas.map((b, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[8%] rounded-full border"
          style={{ left: `${b.x}%`, width: b.tamanho, height: b.tamanho, borderColor: cor, background: 'rgb(255 255 255 / 0.25)' }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -70, opacity: [0, 0.9, 0], x: [0, 3, -3, 0] }}
          transition={{ delay: b.atraso, duration: b.duracao, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

const PARTICULAS = `${import.meta.env.BASE_URL}assets/particulas/`;

export interface Cintila {
  // Posição em % do elemento pai, tamanho em px e atraso em s.
  x: number;
  y: number;
  tamanho: number;
  atraso: number;
}

// Brilhos em forma de estrela (Kenney Particle Pack) que acendem e apagam em
// volta de algo mágico: a Carta do Destino, o ano da passagem do tempo. A
// estrela é uma máscara pintada na cor pedida; o piscar é animação CSS, que
// roda no compositor sem repintar.
export function Cintilas({ pontos, cor = 'var(--ouro-claro)', atraso = 0, className = '' }: { pontos: Cintila[]; cor?: string; atraso?: number; className?: string }) {
  const reduzido = useReducedMotion();
  if (reduzido) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`} aria-hidden>
      {pontos.map((p, i) => {
        const textura = `url(${PARTICULAS}star-0${6 + (i % 3)}.webp)`;
        return (
          <span
            key={i}
            className="cintila absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.tamanho,
              height: p.tamanho,
              marginLeft: -p.tamanho / 2,
              marginTop: -p.tamanho / 2,
              background: `radial-gradient(circle, #fff 0 18%, ${cor} 45%)`,
              WebkitMaskImage: textura,
              maskImage: textura,
              animationDelay: `${atraso + p.atraso}s`,
            }}
          />
        );
      })}
    </div>
  );
}
