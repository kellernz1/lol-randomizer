import { describe, expect, it } from "vitest";
import { randomChallenge } from "./randomizer";

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

  it("only picks champions valid for the selected role", () => {
    for (let index = 0; index < 100; index += 1) {
      const challenge = randomChallenge(`seed-${index}`);

      expect(challenge.champion.roles).toContain(challenge.role);
    }
  });

  it("does not repeat items in the same roll", () => {
    for (let index = 0; index < 100; index += 1) {
      const challenge = randomChallenge(`seed-${index}`);
      const itemIds = challenge.items.map((item) => item.id);

      expect(new Set(itemIds).size).toBe(itemIds.length);
    }
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

  it("keeps champion and role compatible on partial rerolls", () => {
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

      expect(nextChallenge.champion.roles).toContain(nextChallenge.role);
    }
  });
});
