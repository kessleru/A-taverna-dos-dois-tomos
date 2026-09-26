import { describe, expect, it } from 'vitest';
import { achatar, facesDoCaminho, QUIQUES, tombo, TROCAS_DE_FACE, voo } from './rolagem';

const ultimo = <T>(lista: readonly T[]): T => lista[lista.length - 1];

describe('rolagem do dado', () => {
  it('termina parado, reto e no lugar', () => {
    expect(ultimo(voo.x)).toBe(0);
    expect(ultimo(voo.y)).toBe(0);
    expect(ultimo(voo.rotate)).toBe(0);
    expect(ultimo(achatar.scaleX)).toBe(1);
    expect(ultimo(achatar.scaleY)).toBe(1);
    expect(ultimo(tombo.scaleX)).toBe(1);
  });

  it('cada trilha tem um instante por valor, em ordem, de 0 a 1', () => {
    const trilhas: [number[], number[][]][] = [
      [voo.tempos, [voo.x, voo.y, voo.rotate, voo.sombraEscala, voo.sombraOpacidade]],
      [achatar.tempos, [achatar.scaleX, achatar.scaleY]],
      [tombo.tempos, [tombo.scaleX]],
    ];
    for (const [tempos, valores] of trilhas) {
      expect(tempos[0]).toBe(0);
      expect(ultimo(tempos)).toBe(1);
      expect([...tempos].sort((a, b) => a - b)).toEqual(tempos);
      for (const v of valores) expect(v).toHaveLength(tempos.length);
    }
    expect(voo.easeY).toHaveLength(voo.tempos.length - 1);
  });

  it('quica no chão (y = 0) com força decrescente', () => {
    for (const { em } of QUIQUES) expect(voo.y[voo.tempos.indexOf(em)]).toBe(0);
    const forcas = QUIQUES.map((q) => q.forca);
    expect([...forcas].sort((a, b) => b - a)).toEqual(forcas);
  });

  it('troca de face nos perfis do tombo e mostra o resultado antes de assentar', () => {
    for (const t of TROCAS_DE_FACE) expect(tombo.scaleX[tombo.tempos.indexOf(t)]).toBeLessThan(0.7);
    expect(ultimo(TROCAS_DE_FACE)).toBeLessThan(ultimo(QUIQUES).em);
  });

  it('as faces do caminho acabam no resultado e não o antecipam', () => {
    let s = 0;
    const sorteio = () => (s = (s + 0.37) % 1);
    for (const resultado of [1, 7, 20]) {
      const faces = facesDoCaminho(resultado, sorteio);
      expect(faces).toHaveLength(TROCAS_DE_FACE.length);
      expect(ultimo(faces)).toBe(resultado);
      expect(faces.slice(0, -1)).not.toContain(resultado);
      for (let i = 1; i < faces.length; i++) expect(faces[i]).not.toBe(faces[i - 1]);
      for (const f of faces) {
        expect(f).toBeGreaterThanOrEqual(1);
        expect(f).toBeLessThanOrEqual(20);
      }
    }
  });
});
