export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

type Champion = {
  id: string;
  name: string;
  roles: Role[];
};

export type Challenge = {
  champion: Champion;
  role: Role;
  summoners: [string, string];
  difficulty: 1 | 2 | 3 | 4 | 5;
};

const roles: Role[] = ["Top", "Jungle", "Mid", "ADC", "Support"];

const champions: Champion[] = [
  { id: "aatrox", name: "Aatrox", roles: ["Top"] },
  { id: "ahri", name: "Ahri", roles: ["Mid"] },
  { id: "ashe", name: "Ashe", roles: ["ADC", "Support"] },
  { id: "lee-sin", name: "Lee Sin", roles: ["Jungle"] },
  { id: "leona", name: "Leona", roles: ["Support"] }
];

const nonJungleSummoners = [
  "Flash",
  "Ignite",
  "Exhaust",
  "Heal",
  "Barrier",
  "Cleanse",
  "Ghost",
  "Teleport"
];

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pick<T>(items: T[], cursor: number) {
  return items[cursor % items.length];
}

export function randomChallenge(seed: string): Challenge {
  const hash = hashSeed(seed);
  const role = pick(roles, hash);
  const championPool = champions.filter((champion) =>
    champion.roles.includes(role)
  );
  const champion = pick(championPool, hash >>> 3);

  const summoners: [string, string] =
    role === "Jungle"
      ? ["Smite", pick(nonJungleSummoners.filter((spell) => spell !== "Teleport"), hash >>> 5)]
      : [
          "Flash",
          pick(
            nonJungleSummoners.filter((spell) => spell !== "Flash"),
            hash >>> 7
          )
        ];

  return {
    champion,
    role,
    summoners,
    difficulty: role === champion.roles[0] ? 1 : 2
  };
}
