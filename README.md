# LoL Randomizer

Randomizador frontend-only para criar desafios de League of Legends com campeão,
rota, spells, itens, ordem de habilidades e ban sugerido.

O app foi feito para ser rapido de usar durante o champ select: um clique em
`Reroll` gera um novo desafio, e a aba `Config` permite escolher exatamente o
que deve ser sorteado no proximo roll.

## Funcionalidades

- Sorteio de campeao com imagem via Data Dragon.
- Role sorteada independentemente do campeao.
- Summoner spells com regras de validade, incluindo Smite apenas na Jungle.
- Build com starter, botas e itens principais.
- Itens sem repeticao no mesmo roll.
- Ordem de habilidades com ultimate fixo em 6 / 11 / 16.
- Ban sugerido diferente do campeao sorteado.
- Aba `Config` para escolher se o proximo roll muda Champion, Role, Items,
  Summoners, Abilities e/ou Ban.
- Visual dark inspirado em ferramentas de randomizer para League of Legends.
- Deploy preparado para GitHub Pages.

## Stack

- React
- TypeScript
- Vite
- Vitest
- GitHub Actions
- GitHub Pages

## Rodando Localmente

```bash
npm install
npm run dev
```

Por padrao, o Vite abre em uma URL local como:

```text
http://localhost:5173/lol-randomizer/
```

## Scripts

```bash
npm run dev
npm run test
npm run build
npm run preview
```

- `npm run dev`: inicia o app em modo desenvolvimento.
- `npm run test`: roda os testes unitarios com Vitest.
- `npm run build`: valida TypeScript e gera a build em `dist/`.
- `npm run preview`: serve a build localmente.

## GitHub Pages

O projeto esta configurado para o repositorio:

```text
kellernz1/lol-randomizer
```

O Vite usa:

```ts
base: "/lol-randomizer/"
```

O workflow `.github/workflows/pages.yml` roda install, testes, build e publica
o conteudo de `dist/` quando o GitHub Pages estiver configurado para usar
**GitHub Actions**.

No GitHub, confirme em:

```text
Settings > Pages > Source > GitHub Actions
```

Depois disso, pushes na branch `main` disparam o workflow de deploy.

## Dados e Imagens

As imagens de campeoes, itens e summoner spells são consumidas diretamente do
CDN oficial Data Dragon em tempo de uso. Elas não são versionadas no repositorio.

## Aviso Legal

Este projeto não é afiliado, endossado ou patrocinado pela Riot Games. League
of Legends e Riot Games são marcas registradas da Riot Games, Inc.
