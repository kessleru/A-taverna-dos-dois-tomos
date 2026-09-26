import { useMemo, type CSSProperties } from 'react';
import { aleatorio } from '../../engine/brasas';

// Atmosfera da taverna, por cima da pintura do fundo. As posições são as das
// luzes pintadas no quadro (medidas na imagem, em % da caixa da pintura), para
// a luz animada nascer exatamente de cada vela, lampião e da lareira.
//
// Tudo anima só opacidade e transform (compositor). A cintilação do fogo soma
// camadas com durações primas entre si (0,9 s, 1,7 s, 2,3 s...): cada uma
// fecha o próprio loop sem emenda, e juntas só se repetem depois de muito
// tempo, então o olho não pega o padrão.

const PARTICULAS = `${import.meta.env.BASE_URL}assets/particulas/`;

// Lareira: centro do fogo pintado.
const LAREIRA = { x: 23.4, y: 64.5 };
// Velas e lampiões: [x %, y %, diâmetro da luz em px, duração s, animação].
const VELAS: [number, number, number, number, 'a' | 'b'][] = [
  [17.9, 33.8, 150, 1.9, 'a'],
  [14.3, 28.6, 120, 2.3, 'b'],
  [10.2, 56.1, 150, 1.3, 'a'],
  [33.5, 35.8, 120, 2.9, 'b'],
  [30.0, 56.1, 110, 1.7, 'b'],
  [40.2, 18.0, 170, 3.1, 'a'],
];
// Lampiões do alto à direita: tremulam menos que vela, então vão juntos numa
// camada só (três gradientes no fundo dela). [x %, y %, diâmetro px].
const LAMPIOES: [number, number, number][] = [
  [79.2, 8.2, 220],
  [97.3, 12.8, 260],
  [91.2, 28.5, 140],
];
// Caixa da pintura no palco (px), para converter % em px.
const CAIXA = { largura: 1944, altura: 1104 };
// Janela do fundo, de onde descem os fachos de luar.
const JANELA = { x: 77.2, y: 40 };
const FACHOS = [
  { largura: 150, comprimento: 820, giro: 38 },
  { largura: 90, comprimento: 700, giro: 47 },
  { largura: 60, comprimento: 900, giro: 31 },
];

// Luzes e efeitos presos à pintura: vão junto com o parallax e a deriva dela.
export function LuzesPintadas() {
  // Poeira e faíscas em grupos: cada grupo é um elemento só, com os grãos
  // desenhados como sombras (box-shadow) em volta dele. Uma camada por grupo
  // em vez de uma por grão, e o mesmo desenho na tela.
  const poeira = useMemo(() => {
    const sorte = aleatorio(11);
    return Array.from({ length: 3 }, (_, grupo) => {
      // Grãos espalhados ao longo dos fachos, da janela para baixo e à esquerda (px).
      const graos = Array.from({ length: 6 }, () => {
        const t = 0.12 + sorte() * 0.8;
        const giro = ((31 + sorte() * 16) * Math.PI) / 180;
        const distancia = t * 760;
        const lado = 1 + sorte() * 1.3;
        return `${Math.round(-Math.sin(giro) * distancia + (sorte() - 0.5) * 50)}px ${Math.round(Math.cos(giro) * distancia + (sorte() - 0.5) * 30)}px ${(lado * 1.6).toFixed(1)}px ${lado.toFixed(1)}px rgb(255 244 220 / 0.85)`;
      });
      return {
        sombras: graos.join(', '),
        duracao: 11 + grupo * 3.7,
        atraso: -grupo * 4.3,
        dx: (grupo - 1) * 18 + 8,
        dy: -14 - grupo * 9,
      };
    });
  }, []);
  const faiscas = useMemo(() => {
    const sorte = aleatorio(5);
    return Array.from({ length: 3 }, (_, grupo) => ({
      // Faíscas do grupo em alturas e lados diferentes: sobem juntas, mas
      // parecem soltas.
      sombras: Array.from({ length: 4 }, () => {
        const lado = 1 + sorte() * 1.2;
        return `${Math.round((sorte() - 0.5) * 50)}px ${Math.round(-sorte() * 70)}px ${(lado * 2.5).toFixed(1)}px ${lado.toFixed(1)}px rgb(255 190 110 / 0.95)`;
      }).join(', '),
      dx: (sorte() - 0.5) * 60,
      sobe: 170 + grupo * 60,
      duracao: 1.9 + grupo * 0.7,
      atraso: -grupo * 0.9,
    }));
  }, []);
  const fumaca = ['smoke-04', 'smoke-07', 'smoke-02', 'smoke-08', 'smoke-05'];

  return (
    <div className="absolute inset-0 z-[1]">
      {/* Lareira: brilho largo que banha a parede, núcleo quente e o reflexo no chão. */}
      {/* O brilho largo e o reflexo no chão são uma camada só (dois gradientes). */}
      <span className="luz luz-lareira-ambiente" style={pos(LAREIRA.x + 1.5, LAREIRA.y + 3, 1000, 900)} />
      <span className="luz luz-lareira-nucleo" style={pos(LAREIRA.x, LAREIRA.y, 420, 360)} />
      <span className="luz luz-lareira-miolo" style={pos(LAREIRA.x + 0.6, LAREIRA.y + 2, 230, 170)} />
      {/* Fumaça saindo da boca da lareira e subindo pela chaminé. */}
      {fumaca.map((textura, i) => (
        <span
          key={textura}
          className="fumaca-lareira"
          style={
            {
              ...pos(LAREIRA.x + (i - 2) * 0.9, LAREIRA.y - 5, 150, 150),
              WebkitMaskImage: `url(${PARTICULAS}${textura}.webp)`,
              maskImage: `url(${PARTICULAS}${textura}.webp)`,
              animationDuration: `${5.2 + i * 0.7}s`,
              animationDelay: `${-i * 1.3}s`,
            } as CSSProperties
          }
        />
      ))}
      {/* Faíscas pulando do fogo. */}
      {faiscas.map((f, i) => (
        <span
          key={i}
          className="faisca-lareira"
          style={
            {
              left: `${LAREIRA.x}%`,
              top: `${LAREIRA.y + 1}%`,
              boxShadow: f.sombras,
              animationDuration: `${f.duracao}s`,
              animationDelay: `${f.atraso}s`,
              '--dx': `${f.dx}px`,
              '--sobe': `${-f.sobe}px`,
            } as CSSProperties
          }
        />
      ))}
      {/* Velas e lampiões pintados, cada um no seu ritmo. */}
      {VELAS.map(([x, y, lado, duracao, anim], i) => (
        <span
          key={i}
          className={`luz luz-vela luz-vela-${anim}`}
          style={{ ...pos(x, y, lado, lado), animationDuration: `${duracao}s`, animationDelay: `${-i * 0.37}s` }}
        />
      ))}
      <span className="luz luz-vela luz-vela-b" style={{ ...grupoDeLuzes(LAMPIOES), animationDuration: '2.6s' }} />
      {/* Fachos de luar da janela, respirando devagar, com poeira dançando dentro. */}
      {/* Os fachos respiram juntos: uma camada só, os fachos parados dentro dela. */}
      <span className="fachos-luar" style={{ left: `${JANELA.x}%`, top: `${JANELA.y}%` }}>
        {FACHOS.map((f, i) => (
          <span
            key={i}
            className="facho-luar"
            style={{ width: f.largura, height: f.comprimento, marginLeft: -f.largura / 2, transform: `rotate(${f.giro}deg)` }}
          />
        ))}
      </span>
      {poeira.map((g, i) => (
        <span
          key={i}
          className="grao-poeira"
          style={
            {
              left: `${JANELA.x}%`,
              top: `${JANELA.y}%`,
              boxShadow: g.sombras,
              animationDuration: `${g.duracao}s`,
              animationDelay: `${g.atraso}s`,
              '--dx': `${g.dx}px`,
              '--dy': `${g.dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Luzes desfocadas bem na frente (bokeh), que andam mais no parallax: dão a
// sensação de que há mesa e velas entre a turma e a taverna.
export const BOKEH = [
  { x: 4, y: 88, lado: 260, cor: 'rgb(255 170 80 / 0.16)' },
  { x: 13, y: 97, lado: 170, cor: 'rgb(255 200 120 / 0.12)' },
  { x: 93, y: 92, lado: 300, cor: 'rgb(255 160 70 / 0.13)' },
  { x: 85, y: 101, lado: 180, cor: 'rgb(255 190 110 / 0.1)' },
];

function pos(x: number, y: number, largura: number, altura: number): CSSProperties {
  return { left: `${x}%`, top: `${y}%`, width: largura, height: altura, marginLeft: -largura / 2, marginTop: -altura / 2 };
}

// Várias luzes redondas numa camada só: a caixa cobre todas e cada uma vira um
// gradiente radial no fundo, na posição dela.
function grupoDeLuzes(luzes: [number, number, number][]): CSSProperties {
  const px = luzes.map(([x, y, lado]) => ({ x: (x / 100) * CAIXA.largura, y: (y / 100) * CAIXA.altura, r: lado / 2 }));
  const esquerda = Math.min(...px.map((l) => l.x - l.r));
  const topo = Math.min(...px.map((l) => l.y - l.r));
  const direita = Math.max(...px.map((l) => l.x + l.r));
  const base = Math.max(...px.map((l) => l.y + l.r));
  return {
    left: `${(esquerda / CAIXA.largura) * 100}%`,
    top: `${(topo / CAIXA.altura) * 100}%`,
    width: direita - esquerda,
    height: base - topo,
    borderRadius: 0,
    background: px
      .map(
        (l) =>
          `radial-gradient(circle ${l.r}px at ${l.x - esquerda}px ${l.y - topo}px, rgb(255 198 120 / 0.36), rgb(255 150 60 / 0.1) ${l.r * 0.5}px, transparent)`,
      )
      .join(', '),
  };
}
