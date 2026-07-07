import { describe, expect, it } from "vitest";
import { randomChallenge } from "./randomizer";
import catalog from "../../data/catalog.json";

describe("randomChallenge", () => {
  it("never puts Smite outside jungle", () => {
    for (let index = 0; index < 100; index += 1) {
      const challenge = randomChallenge(`seed-${index}`);
      const summonerNames = challenge.summoners.map((spell) => spell.name);

      if (challenge.role === "Jungle") {
        expect(summonerNames).toContain("Smite");
      } else {
        expect(summonerNames).not.toContain("Smite");
      }
    }
  });

  it("rolls roles independently from champion lanes", () => {
    const aatroxTop = randomChallenge("aatrox-top");
    const roleResults = new Set(
      Array.from({ length: 100 }, (_, index) =>
        randomChallenge(`role-roll-${index}`, aatroxTop, {
          champion: false,
          role: true,
          items: false,
          summoners: true,
          abilities: false,
          ban: false
        })
      ).map((challenge) => challenge.role)
    );

    expect(roleResults.size).toBeGreaterThan(1);
  });

  it("does not repeat items in the same roll", () => {
    for (let index = 0; index < 100; index += 1) {
      const challenge = randomChallenge(`seed-${index}`);
      const itemIds = challenge.items.map((item) => item.id);

      expect(new Set(itemIds).size).toBe(itemIds.length);
    }
  });

  it("does not repeat item slots in the same roll", () => {
    for (let index = 0; index < 100; index += 1) {
      const challenge = randomChallenge(`seed-${index}`);
      const itemSlots = challenge.items.map((item) => item.slot);

      expect(itemSlots).toEqual(["Start", "Boots", "1st", "2nd", "3rd", "4th"]);
    }
  });

  it("uses the generated Data Dragon catalog", () => {
    expect(catalog.champions.length).toBeGreaterThan(150);
    expect(catalog.items.length).toBeGreaterThan(100);
  });

  it("preserves disabled roll sections", () => {
    const initialChallenge = randomChallenge("initial-seed");
    const nextChallenge = randomChallenge("next-seed", initialChallenge, {
      champion: false,
      role: false,
      items: true,
      summoners: false,
      abilities: false,
      ban: false
    });

    expect(nextChallenge.champion.id).toBe(initialChallenge.champion.id);
    expect(nextChallenge.role).toBe(initialChallenge.role);
    expect(nextChallenge.summoners).toEqual(initialChallenge.summoners);
    expect(nextChallenge.skillOrder).toEqual(initialChallenge.skillOrder);
    expect(nextChallenge.banChampion.id).toBe(initialChallenge.banChampion.id);
  });

  it("keeps champion fixed while rerolling role", () => {
    for (let index = 0; index < 100; index += 1) {
      const initialChallenge = randomChallenge(`initial-${index}`);
      const nextChallenge = randomChallenge(`next-${index}`, initialChallenge, {
        champion: false,
        role: true,
        items: true,
        summoners: true,
        abilities: true,
        ban: true
      });

      expect(nextChallenge.champion.id).toBe(initialChallenge.champion.id);
    }
  });
});
