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
});
