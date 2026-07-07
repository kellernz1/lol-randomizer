import catalog from "../../data/catalog.json";

export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

type Champion = {
  id: string;
  dataDragonId: string;
  name: string;
};

type CatalogItem = {
  id: string;
  name: string;
  iconUrl: string;
  category: "starter" | "boots" | "core";
};

type Item = CatalogItem & {
  slot: string;
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

export type RollOptions = {
  champion: boolean;
  role: boolean;
  items: boolean;
  summoners: boolean;
  abilities: boolean;
  ban: boolean;
};

export const DATA_DRAGON_VERSION = catalog.version;

export const defaultRollOptions: RollOptions = {
  champion: true,
  role: true,
  items: true,
  summoners: true,
  abilities: true,
  ban: true
};

const roles: Role[] = ["Top", "Jungle", "Mid", "ADC", "Support"];
const jungleStarterIds = new Set(["1101", "1102", "1103"]);
const coreItemSlots = ["1st", "2nd", "3rd", "4th"];

const champions = catalog.champions as Champion[];

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

const itemPool = catalog.items as CatalogItem[];

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

function pickUnused<T extends { id: string }>(
  items: T[],
  cursor: number,
  usedIds: Set<string>
) {
  const availableItems = items.filter((item) => !usedIds.has(item.id));
  const selectedItem = pick(availableItems, cursor);

  usedIds.add(selectedItem.id);

  return selectedItem;
}

function withSlot(item: CatalogItem, slot: string): Item {
  return {
    ...item,
    slot
  };
}

function resolveRole(hash: number, previous?: Challenge, options = defaultRollOptions) {
  if (!previous || options.role) {
    return pick(roles, hash);
  }

  return previous.role;
}

function resolveChampion(
  hash: number,
  previous?: Challenge,
  options = defaultRollOptions
) {
  if (previous && !options.champion) {
    return previous.champion;
  }

  return pick(champions, hash >>> 3);
}

function resolveSummoners(
  hash: number,
  role: Role,
  roleChanged: boolean,
  previous?: Challenge,
  options = defaultRollOptions
) {
  if (previous && !options.summoners && !roleChanged) {
    return previous.summoners;
  }

  const flash = summonerSpells.find((spell) => spell.id === "flash")!;
  const smite = summonerSpells.find((spell) => spell.id === "smite")!;
  const nonJungleSummoners = summonerSpells.filter(
    (spell) => spell.id !== "smite" && spell.id !== "flash"
  );

  return role === "Jungle"
    ? ([
        smite,
        pick(
          nonJungleSummoners.filter((spell) => spell.id !== "teleport"),
          hash >>> 5
        )
      ] satisfies [SummonerSpell, SummonerSpell])
    : ([flash, pick(nonJungleSummoners, hash >>> 7)] satisfies [
        SummonerSpell,
        SummonerSpell
      ]);
}

function resolveItems(
  hash: number,
  role: Role,
  roleChanged: boolean,
  previous?: Challenge,
  options = defaultRollOptions
) {
  if (previous && !options.items && !roleChanged) {
    return previous.items;
  }

  const starterPool =
    role === "Jungle"
      ? itemPool.filter((item) => jungleStarterIds.has(item.id))
      : itemPool.filter(
          (item) =>
            item.category === "starter" && !jungleStarterIds.has(item.id)
        );
  const bootsPool = itemPool.filter((item) => item.category === "boots");
  const corePool = itemPool.filter((item) => item.category === "core");
  const usedItemIds = new Set<string>();

  return [
    withSlot(pickUnused(starterPool, hash >>> 9, usedItemIds), "Start"),
    withSlot(pickUnused(bootsPool, hash >>> 11, usedItemIds), "Boots"),
    ...coreItemSlots.map((slot, index) =>
      withSlot(pickUnused(corePool, hash >>> (13 + index * 2), usedItemIds), slot)
    )
  ];
}

function resolveBan(
  hash: number,
  champion: Champion,
  championChanged: boolean,
  previous?: Challenge,
  options = defaultRollOptions
) {
  if (
    previous &&
    !options.ban &&
    !championChanged &&
    previous.banChampion.id !== champion.id
  ) {
    return previous.banChampion;
  }

  const banPool = champions.filter((candidate) => candidate.id !== champion.id);

  return pick(banPool, hash >>> 23);
}

export function randomChallenge(
  seed: string,
  previous?: Challenge,
  options: RollOptions = defaultRollOptions
): Challenge {
  const hash = hashSeed(seed);
  const role = resolveRole(hash, previous, options);
  const roleChanged = Boolean(previous && previous.role !== role);
  const champion = resolveChampion(hash, previous, options);
  const championChanged = Boolean(previous && previous.champion.id !== champion.id);
  const summoners = resolveSummoners(hash, role, roleChanged, previous, options);
  const items = resolveItems(hash, role, roleChanged, previous, options);
  const skillOrder =
    previous && !options.abilities
      ? previous.skillOrder
      : pick(skillOrders, hash >>> 21);
  const banChampion = resolveBan(
    hash,
    champion,
    championChanged,
    previous,
    options
  );

  return {
    champion,
    role,
    summoners,
    items,
    skillOrder,
    banChampion,
    difficulty: 1
  };
}
