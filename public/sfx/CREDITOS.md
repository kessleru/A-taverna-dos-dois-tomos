# Sons (pendente)

O PLANO.md pede efeitos do [Kenney Audio](https://kenney.nl/assets?q=audio)
(CC0) nesta pasta:

```
clique.ogg     virar-carta.ogg   escolha.ogg
ganho.ogg      perda.ogg         dado.ogg
evento.ogg     cadeado.ogg       fanfarra.ogg
musica-fundo.ogg
```

Esses arquivos não vieram no pacote do projeto e não havia acesso à
internet durante a implementação para baixá-los. O motor de som
(`src/engine/useSom.ts`) já está pronto para tocá-los: com som ligado (tecla
`M`), cada `tocar('nome')` tenta carregar `/sfx/<nome>.ogg` via Howler — se o
arquivo não existir, o Howler apenas ignora aquele efeito, sem quebrar o
jogo. Basta a equipe baixar os arquivos do Kenney Audio (ou similar, CC0/CC
BY) com esses nomes exatos e colocar aqui.

Música de fundo (`musica-fundo.ogg`) fica desligada por padrão conforme o
plano (seção 3) e ainda não tem um botão dedicado — pode ser adicionada ao
`useSom.ts` quando o arquivo existir.
