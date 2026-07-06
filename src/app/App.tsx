import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  DATA_DRAGON_VERSION,
  championIcon,
  championSplash,
  defaultRollOptions,
  randomChallenge
} from "../features/randomizer/randomizer";
import type { RollOptions } from "../features/randomizer/randomizer";

const roleIcons = {
  Top: "TOP",
  Jungle: "JG",
  Mid: "MID",
  ADC: "ADC",
  Support: "SUP"
};

const rollOptionLabels: Record<keyof RollOptions, string> = {
  champion: "Champion",
  role: "Role",
  items: "Items",
  summoners: "Summoners",
  abilities: "Abilities",
  ban: "Ban"
};

export function App() {
  const [challenge, setChallenge] = useState(() =>
    randomChallenge(crypto.randomUUID())
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [rollOptions, setRollOptions] = useState(defaultRollOptions);
  const enabledOptionCount = useMemo(
    () => Object.values(rollOptions).filter(Boolean).length,
    [rollOptions]
  );
  const splashStyle = {
    "--splash": `url(${championSplash(challenge.champion)})`
  } as CSSProperties;

  function toggleRollOption(option: keyof RollOptions) {
    setRollOptions((currentOptions) => {
      const nextOptions = {
        ...currentOptions,
        [option]: !currentOptions[option]
      };

      return Object.values(nextOptions).some(Boolean) ? nextOptions : currentOptions;
    });
  }

  function reroll() {
    setChallenge((currentChallenge) =>
      randomChallenge(crypto.randomUUID(), currentChallenge, rollOptions)
    );
  }

  return (
    <main className="shell" style={splashStyle}>
      <header className="topbar">
        <a className="brand" href={import.meta.env.BASE_URL}>
          LoL Randomizer <span>{DATA_DRAGON_VERSION}</span>
        </a>
        <button
          aria-expanded={isConfigOpen}
          className={isConfigOpen ? "settings-button active" : "settings-button"}
          type="button"
          onClick={() => setIsConfigOpen((current) => !current)}
        >
          Config
        </button>
      </header>

      {isConfigOpen ? (
        <aside className="config-panel" aria-label="Configuracoes de roll">
          <div>
            <p className="eyebrow">Reroll Options</p>
            <h2>Escolha o que sortear</h2>
          </div>

          <div className="roll-options">
            {(Object.keys(rollOptionLabels) as Array<keyof RollOptions>).map(
              (option) => (
                <label className="toggle-row" key={option}>
                  <input
                    checked={rollOptions[option]}
                    type="checkbox"
                    onChange={() => toggleRollOption(option)}
                  />
                  <span>{rollOptionLabels[option]}</span>
                </label>
              )
            )}
          </div>

          <div className="config-actions">
            <button
              className="ghost-button"
              type="button"
              onClick={() => setRollOptions(defaultRollOptions)}
            >
              All
            </button>
            <span>{enabledOptionCount}/6 ativos</span>
          </div>
        </aside>
      ) : null}

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
            onClick={reroll}
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
        Este projeto não é afiliado, endossado ou patrocinado pela Riot Games.
        League of Legends e Riot Games sao marcas registradas da Riot Games,
        Inc.
      </footer>
    </main>
  );
}
