# LoL Randomizer

App frontend-only para sortear desafios de League of Legends. O projeto esta
preparado para publicar no GitHub Pages pelo workflow
`.github/workflows/pages.yml`.

## Scripts

- `npm run dev`: inicia o Vite localmente.
- `npm run test`: roda os testes unitarios.
- `npm run build`: valida TypeScript e gera `dist/`.
- `npm run preview`: serve a build localmente.

## GitHub Pages

O Vite esta configurado com `base: "/lol-randomizer/"`, que corresponde ao
repositorio `kellernz1/lol-randomizer`. Quando houver push na branch `main`, a
Action `Deploy GitHub Pages` instala dependencias, roda testes, faz build e
publica o conteudo de `dist/`.

No GitHub, confirme em **Settings > Pages** que a fonte esta como
**GitHub Actions**. Antes disso, o workflow ainda roda install, testes e build,
mas pula o deploy para evitar falha falsa de configuracao.

## Aviso legal

Este projeto nao e afiliado, endossado ou patrocinado pela Riot Games. League
of Legends e Riot Games sao marcas registradas da Riot Games, Inc.
