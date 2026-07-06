import { useMemo, useState } from "react";
import { randomChallenge } from "../features/randomizer/randomizer";

export function App() {
  const [seed, setSeed] = useState(() => crypto.randomUUID());
  const challenge = useMemo(() => randomChallenge(seed), [seed]);

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">League of Legends Challenge</p>
          <h1 id="page-title">LoL Randomizer</h1>
          <p className="lede">
            Sorteie um desafio jogavel com campeao, rota e summoners validos.
            A base ja esta pronta para evoluir para builds, runas, historico e
            compartilhamento por seed.
          </p>
        </div>
        <button type="button" onClick={() => setSeed(crypto.randomUUID())}>
          Reroll All
        </button>
      </section>

      <section className="challenge" aria-live="polite" aria-label="Resultado">
        <div>
          <span className="label">Champion</span>
          <strong>{challenge.champion.name}</strong>
        </div>
        <div>
          <span className="label">Role</span>
          <strong>{challenge.role}</strong>
        </div>
        <div>
          <span className="label">Summoners</span>
          <strong>{challenge.summoners.join(" + ")}</strong>
        </div>
        <div>
          <span className="label">Difficulty</span>
          <strong>{"★".repeat(challenge.difficulty)}</strong>
        </div>
      </section>

      <footer>
        Este projeto nao e afiliado, endossado ou patrocinado pela Riot Games.
        League of Legends e Riot Games sao marcas registradas da Riot Games,
        Inc.
      </footer>
    </main>
  );
}
