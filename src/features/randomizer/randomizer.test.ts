import { describe, expect, it } from "vitest";
import { randomChallenge } from "./randomizer";

describe("randomChallenge", () => {
  it("never puts Smite outside jungle", () => {
    for (let index = 0; index < 100; index += 1) {
      const challenge = randomChallenge(`seed-${index}`);

      if (challenge.role === "Jungle") {
        expect(challenge.summoners).toContain("Smite");
      } else {
        expect(challenge.summoners).not.toContain("Smite");
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
