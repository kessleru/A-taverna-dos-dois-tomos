import { describe, expect, it } from 'vitest';
import { EFEITOS } from './useSom';
import { TODAS_AS_FALAS } from './falas';

// Lista os arquivos de public/sfx sem carregá-los (só as chaves do glob).
const ARQUIVOS = new Set(Object.keys(import.meta.glob('/public/sfx/**/*.{ogg,mp3}')).map((caminho) => caminho.replace('/public/sfx/', '')));
const existe = (arquivo: string) => ARQUIVOS.has(arquivo);

// Um arquivo que falta deixaria o momento mudo sem nenhum erro na tela.
describe('arquivos de som', () => {
  it('todo efeito tem o seu .ogg em public/sfx', () => {
    expect(EFEITOS.filter((efeito) => !existe(`${efeito}.ogg`))).toEqual([]);
  });

  it('toda fala do Taverneiro tem o seu .mp3', () => {
    expect(TODAS_AS_FALAS.filter((fala) => !existe(`falas/${fala}.mp3`))).toEqual([]);
  });

  it('música, lareira e os três murmúrios existem', () => {
    const fundo = ['musica-fundo.mp3', 'ambiente-taverna.mp3', 'murmurio-1.mp3', 'murmurio-2.mp3', 'murmurio-3.mp3'];
    expect(fundo.filter((arquivo) => !existe(arquivo))).toEqual([]);
  });
});
