import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ALTURA_PALCO, LARGURA_PALCO } from '../../engine/palco';
import {
  atualizarParticulas,
  emitirFaiscas,
  emitirPoeira,
  forcaDaSequencia,
  opacidadeAtual,
  proximaSequencia,
  tamanhoAtual,
  type Particula,
  type Sequencia,
} from '../../engine/poeira';
import { useSomDoJogo } from '../../engine/SomContexto';
import { useEscalaPalco } from './Palco';
import { useTremor } from './Tremor';

// O que conta como "clicável": ali o clique solta faíscas, não poeira.
const CLICAVEL = 'button, a[href], [role="button"], label, .cursor-pointer';
// A partir do 4º clique seguido no mesmo lugar, a mesa inteira sente.
const SEQUENCIA_QUE_TREME = 3;
const TAMANHO_SPRITE = 64;
const TAMANHO_TEXTURA = 128;
// Texturas do Kenney Particle Pack (CC0), pré-carregadas na tela de carregamento.
const base = `${import.meta.env.BASE_URL}assets/particulas/`;
const FUMACAS = ['smoke-02', 'smoke-04', 'smoke-05', 'smoke-07', 'smoke-08'].map((nome) => `${base}${nome}.webp`);
const TERRAS = ['dirt-01', 'dirt-02'].map((nome) => `${base}${nome}.webp`);

function carregarTexturas(urls: string[]): HTMLImageElement[] {
  return urls.map((url) => {
    const imagem = new Image();
    imagem.src = url;
    return imagem;
  });
}

// Nuvem macia pré-desenhada (um degradê só): desenhar o sprite com drawImage
// é bem mais barato que montar um degradê por partícula a cada quadro.
function criarSprite(): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = TAMANHO_SPRITE;
  const ctx = sprite.getContext('2d')!;
  const meio = TAMANHO_SPRITE / 2;
  const degrade = ctx.createRadialGradient(meio, meio, 0, meio, meio, meio);
  degrade.addColorStop(0, 'rgb(255 255 255 / 1)');
  degrade.addColorStop(0.45, 'rgb(255 255 255 / 0.5)');
  degrade.addColorStop(1, 'rgb(255 255 255 / 0)');
  ctx.fillStyle = degrade;
  ctx.fillRect(0, 0, TAMANHO_SPRITE, TAMANHO_SPRITE);
  return sprite;
}

// Tinge uma textura branca com a cor da partícula (uma por textura e cor, em cache).
function spriteColorido(fonte: CanvasImageSource, chave: string, lado: number, cor: string, cache: Map<string, HTMLCanvasElement>): HTMLCanvasElement {
  const id = `${chave}|${cor}`;
  const pronto = cache.get(id);
  if (pronto) return pronto;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = lado;
  const ctx = sprite.getContext('2d')!;
  ctx.drawImage(fonte, 0, 0, lado, lado);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = cor;
  ctx.fillRect(0, 0, lado, lado);
  cache.set(id, sprite);
  return sprite;
}

interface Texturas {
  branco: HTMLCanvasElement;
  fumacas: HTMLImageElement[];
  terras: HTMLImageElement[];
}

// A textura pedida, tingida; o círculo desfocado fica de reserva se ela não carregou.
function sprite(t: Texturas, lista: HTMLImageElement[], nome: string, variante: number, cor: string, cache: Map<string, HTMLCanvasElement>) {
  const imagem = lista[variante % lista.length];
  if (imagem?.complete && imagem.naturalWidth > 0) return spriteColorido(imagem, `${nome}${variante}`, TAMANHO_TEXTURA, cor, cache);
  return spriteColorido(t.branco, 'branco', TAMANHO_SPRITE, cor, cache);
}

// Desenha a textura girada e achatada (a mesa é vista de cima, inclinada).
function desenharTextura(ctx: CanvasRenderingContext2D, imagem: HTMLCanvasElement, x: number, y: number, r: number, giro: number, achatado: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, achatado);
  ctx.rotate(giro);
  ctx.drawImage(imagem, -r, -r, r * 2, r * 2);
  ctx.restore();
}

function desenhar(ctx: CanvasRenderingContext2D, particulas: Particula[], t: Texturas, cache: Map<string, HTMLCanvasElement>) {
  for (const p of particulas) {
    const alfa = opacidadeAtual(p);
    if (alfa <= 0.01) continue;
    const r = tamanhoAtual(p);
    ctx.globalAlpha = alfa;
    if (p.tipo === 'nuvem') {
      ctx.globalCompositeOperation = 'source-over';
      desenharTextura(ctx, sprite(t, t.fumacas, 'fumaca', p.variante, p.cor, cache), p.x, p.y, r, p.giro, 0.75);
    } else if (p.tipo === 'terra') {
      ctx.globalCompositeOperation = 'source-over';
      desenharTextura(ctx, sprite(t, t.terras, 'terra', p.variante, p.cor, cache), p.x, p.y, r, p.giro, 0.55);
    } else if (p.tipo === 'grao') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.cor;
      ctx.fillRect(-r, -r * 0.7, r * 2, r * 1.4);
      ctx.restore();
    } else if (p.tipo === 'anel') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, r, r * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.tipo === 'aro') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Fagulha: ponto quente com rastro curto na direção do voo.
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = r;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

// Camada de efeitos do clique, por cima de toda a mesa. Um canvas só, sem
// receber o mouse; o laço de desenho só roda enquanto há partículas vivas,
// então parado não custa nada.
export function PoeiraClique() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const escala = useEscalaPalco();
  const reduzido = useReducedMotion();
  const som = useSomDoJogo();
  const tremer = useTremor();
  const refs = useRef({ som, tremer, reduzido, escala });
  refs.current = { som, tremer, reduzido, escala };

  useEffect(() => {
    const elemento = canvas.current;
    const ctx = elemento?.getContext('2d');
    if (!elemento || !ctx) return;
    const texturas: Texturas = { branco: criarSprite(), fumacas: carregarTexturas(FUMACAS), terras: carregarTexturas(TERRAS) };
    const cache = new Map<string, HTMLCanvasElement>();
    let particulas: Particula[] = [];
    let quadro: number | null = null;
    let anterior = 0;
    let sequencia: Sequencia | null = null;
    // Resolução do canvas = tamanho real na tela, para o pó não sair borrado.
    let resolucao = 0;

    function ajustarResolucao() {
      const nova = Math.max(0.25, refs.current.escala * (window.devicePixelRatio || 1));
      if (nova === resolucao || !elemento || !ctx) return;
      resolucao = nova;
      elemento.width = Math.round(LARGURA_PALCO * nova);
      elemento.height = Math.round(ALTURA_PALCO * nova);
    }

    function passo(agora: number) {
      if (!elemento || !ctx) return;
      particulas = atualizarParticulas(particulas, (agora - anterior) / 1000);
      anterior = agora;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, elemento.width, elemento.height);
      ctx.setTransform(resolucao, 0, 0, resolucao, 0, 0);
      desenhar(ctx, particulas, texturas, cache);
      quadro = particulas.length > 0 ? requestAnimationFrame(passo) : null;
    }

    function aoApertar(evento: PointerEvent) {
      if (!elemento || (evento.pointerType === 'touch' && !evento.isPrimary)) return;
      const caixa = elemento.getBoundingClientRect();
      const { escala: e } = refs.current;
      if (!(e > 0)) return;
      const x = (evento.clientX - caixa.left) / e;
      const y = (evento.clientY - caixa.top) / e;
      if (x < 0 || y < 0 || x > LARGURA_PALCO || y > ALTURA_PALCO) return;
      const alvo = evento.target instanceof Element ? evento.target : null;
      const clicavel = !!alvo?.closest(CLICAVEL);

      if (clicavel) {
        sequencia = null;
        if (!refs.current.reduzido) particulas.push(...emitirFaiscas(x, y, Math.random));
      } else {
        sequencia = proximaSequencia(sequencia, x, y, performance.now());
        const forca = forcaDaSequencia(sequencia.contagem);
        refs.current.som?.batida(forca);
        if (!refs.current.reduzido) particulas.push(...emitirPoeira(x, y, forca, Math.random));
        if (sequencia.contagem >= SEQUENCIA_QUE_TREME) refs.current.tremer(0.12 + (sequencia.contagem - SEQUENCIA_QUE_TREME) * 0.08);
      }
      if (particulas.length > 0 && quadro === null) {
        ajustarResolucao();
        anterior = performance.now();
        quadro = requestAnimationFrame(passo);
      }
    }

    window.addEventListener('pointerdown', aoApertar, { capture: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', aoApertar, true);
      if (quadro !== null) cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className="pointer-events-none absolute left-0 top-0 z-[65]"
      style={{ width: LARGURA_PALCO, height: ALTURA_PALCO }}
      aria-hidden
    />
  );
}
