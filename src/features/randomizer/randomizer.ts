export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

type Champion = {
  id: string;
  dataDragonId: string;
  name: string;
  roles: Role[];
};

type Item = {
  id: string;
  name: string;
  slot: string;
  iconUrl: string;
};

type SummonerSpell = {
  id: string;
  name: string;
  iconUrl: string;
};

type SkillOrder =
  | ["Q", "W", "E"]
  | ["Q", "E", "W"]
  | ["W", "Q", "E"]
  | ["W", "E", "Q"]
  | ["E", "Q", "W"]
  | ["E", "W", "Q"];

export type Challenge = {
  champion: Champion;
  role: Role;
  summoners: [SummonerSpell, SummonerSpell];
  items: Item[];
  skillOrder: SkillOrder;
  banChampion: Champion;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

export const DATA_DRAGON_VERSION = "16.13.1";

const roles: Role[] = ["Top", "Jungle", "Mid", "ADC", "Support"];

const champions: Champion[] = [
  { id: "aatrox", dataDragonId: "Aatrox", name: "Aatrox", roles: ["Top"] },
  { id: "ahri", dataDragonId: "Ahri", name: "Ahri", roles: ["Mid"] },
  { id: "ashe", dataDragonId: "Ashe", name: "Ashe", roles: ["ADC", "Support"] },
  {
    id: "ezreal",
    dataDragonId: "Ezreal",
    name: "Ezreal",
    roles: ["ADC", "Mid"]
  },
  { id: "garen", dataDragonId: "Garen", name: "Garen", roles: ["Top"] },
  { id: "jinx", dataDragonId: "Jinx", name: "Jinx", roles: ["ADC"] },
  {
    id: "lee-sin",
    dataDragonId: "LeeSin",
    name: "Lee Sin",
    roles: ["Jungle"]
  },
  { id: "leona", dataDragonId: "Leona", name: "Leona", roles: ["Support"] },
  { id: "lux", dataDragonId: "Lux", name: "Lux", roles: ["Support", "Mid"] },
  { id: "yasuo", dataDragonId: "Yasuo", name: "Yasuo", roles: ["Mid", "Top"] }
];

const summonerSpells: SummonerSpell[] = [
  { id: "flash", name: "Flash", iconUrl: spellIcon("SummonerFlash") },
  { id: "ignite", name: "Ignite", iconUrl: spellIcon("SummonerDot") },
  { id: "exhaust", name: "Exhaust", iconUrl: spellIcon("SummonerExhaust") },
  { id: "heal", name: "Heal", iconUrl: spellIcon("SummonerHeal") },
  { id: "barrier", name: "Barrier", iconUrl: spellIcon("SummonerBarrier") },
  { id: "cleanse", name: "Cleanse", iconUrl: spellIcon("SummonerBoost") },
  { id: "ghost", name: "Ghost", iconUrl: spellIcon("SummonerHaste") },
  { id: "teleport", name: "Teleport", iconUrl: spellIcon("SummonerTeleport") },
  { id: "smite", name: "Smite", iconUrl: spellIcon("SummonerSmite") }
];

const itemPool: Item[] = [
  item("1055", "Doran's Blade", "Start"),
  item("1056", "Doran's Ring", "Start"),
  item("1101", "Scorchclaw Pup", "Start"),
  item("1102", "Gustwalker Hatchling", "Start"),
  item("1103", "Mosstomper Seedling", "Start"),
  item("3006", "Berserker's Greaves", "Boots"),
  item("3047", "Plated Steelcaps", "Boots"),
  item("3020", "Sorcerer's Shoes", "Boots"),
  item("3153", "Blade of the Ruined King", "1st"),
  item("6672", "Kraken Slayer", "1st"),
  item("3089", "Rabadon's Deathcap", "1st"),
  item("4645", "Shadowflame", "2nd"),
  item("6692", "Eclipse", "2nd"),
  item("3068", "Sunfire Aegis", "2nd"),
  item("3072", "Bloodthirster", "3rd"),
  item("3135", "Void Staff", "3rd"),
  item("3119", "Winter's Approach", "3rd")
];

const skillOrders: Challenge["skillOrder"][] = [
  ["Q", "W", "E"],
  ["Q", "E", "W"],
  ["W", "Q", "E"],
  ["W", "E", "Q"],
  ["E", "Q", "W"],
  ["E", "W", "Q"]
];

export function championIcon(champion: Champion) {
  return `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/champion/${champion.dataDragonId}.png`;
}

export function championSplash(champion: Champion) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.dataDragonId}_0.jpg`;
}

function item(id: string, name: string, slot: string): Item {
  return {
    id,
    name,
    slot,
    iconUrl: `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/item/${id}.png`
  };
}

function spellIcon(id: string) {
  return `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/spell/${id}.png`;
}

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

  const flash = summonerSpells.find((spell) => spell.id === "flash")!;
  const smite = summonerSpells.find((spell) => spell.id === "smite")!;
  const nonJungleSummoners = summonerSpells.filter(
    (spell) => spell.id !== "smite" && spell.id !== "flash"
  );

  const summoners: [SummonerSpell, SummonerSpell] =
    role === "Jungle"
      ? [
          smite,
          pick(
            nonJungleSummoners.filter((spell) => spell.id !== "teleport"),
            hash >>> 5
          )
        ]
      : [flash, pick(nonJungleSummoners, hash >>> 7)];

  const starterPool =
    role === "Jungle"
      ? itemPool.filter(
          (item) => item.id === "1101" || item.id === "1102" || item.id === "1103"
        )
      : itemPool.filter(
          (item) =>
            item.slot === "Start" &&
            !item.name.includes("Hatchling") &&
            !item.name.includes("Seedling") &&
            !item.name.includes("Pup")
        );
  const bootsPool = itemPool.filter((item) => item.slot === "Boots");
  const corePool = itemPool.filter(
    (item) => item.slot !== "Start" && item.slot !== "Boots"
  );
  const items = [
    pick(starterPool, hash >>> 9),
    pick(bootsPool, hash >>> 11),
    pick(corePool, hash >>> 13),
    pick(corePool, hash >>> 15),
    pick(corePool, hash >>> 17),
    pick(corePool, hash >>> 19)
  ];
  const banPool = champions.filter((candidate) => candidate.id !== champion.id);

  return {
    champion,
    role,
    summoners,
    items,
    skillOrder: pick(skillOrders, hash >>> 21),
    banChampion: pick(banPool, hash >>> 23),
    difficulty: role === champion.roles[0] ? 1 : 2
  };
}
