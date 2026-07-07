import { mkdir, writeFile } from "node:fs/promises";

const language = "pt_BR";
const locale = "pt-BR";
const dataDragonBase = "https://ddragon.leagueoflegends.com";
const starterItemIds = new Set([
  "1054",
  "1055",
  "1056",
  "1082",
  "1101",
  "1102",
  "1103",
  "2003",
  "3865",
  "3866",
  "3867",
  "3869",
  "3870",
  "3871",
  "3876",
  "3877",
  "3878"
]);
const supportStarterItemIds = new Set([
  "3865",
  "3866",
  "3867",
  "3869",
  "3870",
  "3871",
  "3876",
  "3877",
  "3878"
]);
const supportOnlyCoreItemIds = new Set([
  "3107",
  "3222",
  "3504",
  "3879",
  "4643",
  "6617",
  "6620",
  "6653",
  "6690"
]);
const excludedItemIds = new Set([
  "1086",
  "1120",
  "2051",
  "3112",
  "3177",
  "3184"
]);
const excludedItemTags = new Set(["Consumable", "Trinket"]);

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

function itemIsSummonersRiftItem(item) {
  const tags = item.tags ?? [];

  return (
    item.maps?.["11"] === true &&
    item.gold?.purchasable === true &&
    item.inStore !== false &&
    !item.consumed &&
    !item.consumeOnFull &&
    !item.requiredChampion &&
    !item.requiredAlly &&
    !tags.some((tag) => excludedItemTags.has(tag))
  );
}

function normalizeItem([id, item], version) {
  const tags = item.tags ?? [];
  const isBoots = tags.includes("Boots");
  const isStarter = starterItemIds.has(id);

  return {
    id,
    name: item.name,
    iconUrl: `${dataDragonBase}/cdn/${version}/img/item/${id}.png`,
    tags,
    depth: item.depth ?? 1,
    goldTotal: item.gold?.total ?? 0,
    supportOnly: supportStarterItemIds.has(id) || supportOnlyCoreItemIds.has(id),
    category: isBoots ? "boots" : isStarter ? "starter" : "core"
  };
}

function itemIsStandardSummonersRiftId(id) {
  return id.length <= 4;
}

function itemIsFinalCoreItem(item) {
  return !item.into || item.into.length === 0;
}

function itemIsLegendaryCandidate(item) {
  const tags = item.tags ?? [];

  return (
    itemIsFinalCoreItem(item) &&
    (item.depth ?? 0) >= 2 &&
    (item.gold?.total ?? 0) >= 1500 &&
    !tags.includes("Lane")
  );
}

async function main() {
  const versions = await fetchJson(`${dataDragonBase}/api/versions.json`);
  const version = versions[0];
  const [championData, itemData] = await Promise.all([
    fetchJson(`${dataDragonBase}/cdn/${version}/data/${language}/champion.json`),
    fetchJson(`${dataDragonBase}/cdn/${version}/data/${language}/item.json`)
  ]);

  const champions = Object.values(championData.data)
    .map((champion) => ({
      id: champion.id,
      dataDragonId: champion.id,
      name: champion.name
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  const items = Object.entries(itemData.data)
    .filter(
      ([id, item]) =>
        itemIsStandardSummonersRiftId(id) && itemIsSummonersRiftItem(item)
    )
    .filter(([id]) => !excludedItemIds.has(id))
    .filter(
      ([id, item]) =>
        starterItemIds.has(id) ||
        item.tags?.includes("Boots") ||
        itemIsLegendaryCandidate(item)
    )
    .map((entry) => normalizeItem(entry, version))
    .sort((a, b) => a.name.localeCompare(b.name, locale));

  await mkdir("src/data", { recursive: true });
  await writeFile(
    "src/data/catalog.json",
    `${JSON.stringify({ version, champions, items }, null, 2)}\n`,
    "utf8"
  );

  console.log(
    `Updated catalog: ${champions.length} champions, ${items.length} items, patch ${version}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
