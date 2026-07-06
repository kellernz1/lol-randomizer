import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  DATA_DRAGON_VERSION,
  championIcon,
  championSplash,
  randomChallenge
} from "../features/randomizer/randomizer";

const roleIcons = {
  Top: "TOP",
  Jungle: "JG",
  Mid: "MID",
  ADC: "ADC",
  Support: "SUP"
};

export function App() {
  const [seed, setSeed] = useState(() => crypto.randomUUID());
  const challenge = useMemo(() => randomChallenge(seed), [seed]);
  const splashStyle = {
    "--splash": `url(${championSplash(challenge.champion)})`
  } as CSSProperties;

  return (
    <main className="shell" style={splashStyle}>
      <header className="topbar">
        <a className="brand" href={import.meta.env.BASE_URL}>
          LoL Randomizer <span>{DATA_DRAGON_VERSION}</span>
        </a>
        <button className="settings-button" type="button" aria-label="Configuracoes">
          Config
        </button>
      </header>

      <section className="stage" aria-live="polite" aria-label="Resultado">
        <nav className="role-strip" aria-label="Rotas">
          {Object.entries(roleIcons).map(([role, label]) => (
            <span
              className={role === challenge.role ? "role-token active" : "role-token"}
              key={role}
            >
              {label}
            </span>
          ))}
        </nav>

        <section className="champion-panel" aria-labelledby="champion-name">
          <div className="portrait-frame">
            <img
              src={championIcon(challenge.champion)}
              alt={`Imagem de ${challenge.champion.name}`}
            />
          </div>

          <div className="champion-copy">
            <p className="eyebrow">Champion</p>
            <h1 id="champion-name">{challenge.champion.name}</h1>
            <p>
              Role: <strong>{challenge.role}</strong>
            </p>
          </div>

          <button
            className="reroll-button"
            type="button"
            onClick={() => setSeed(crypto.randomUUID())}
          >
            Reroll
          </button>
        </section>

        <section className="loadout-grid">
          <article className="panel items-panel">
            <h2>Items</h2>
            <div className="item-grid">
              {challenge.items.map((item, index) => (
                <figure className="asset-tile" key={`${item.id}-${index}`}>
                  <img src={item.iconUrl} alt={item.name} />
                  <figcaption>
                    <span>{item.slot}</span>
                    {item.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>

          <article className="panel compact-panel">
            <h2>Summoners</h2>
            <div className="spell-row">
              {challenge.summoners.map((spell) => (
                <figure className="asset-tile square" key={spell.id}>
                  <img src={spell.iconUrl} alt={spell.name} />
                  <figcaption>{spell.name}</figcaption>
                </figure>
              ))}
            </div>
          </article>

          <article className="panel compact-panel">
            <h2>Abilities</h2>
            <div className="ability-row">
              {challenge.skillOrder.map((skill) => (
                <span className="ability-token" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <p className="muted">R em 6 / 11 / 16</p>
          </article>

          <article className="panel compact-panel">
            <h2>Ban</h2>
            <figure className="ban-tile">
              <img
                src={championIcon(challenge.banChampion)}
                alt={`Ban sugerido: ${challenge.banChampion.name}`}
              />
              <figcaption>{challenge.banChampion.name}</figcaption>
            </figure>
          </article>
        </section>
      </section>

      <footer>
        Este projeto nao e afiliado, endossado ou patrocinado pela Riot Games.
        League of Legends e Riot Games sao marcas registradas da Riot Games,
        Inc.
      </footer>
    </main>
  );
}
