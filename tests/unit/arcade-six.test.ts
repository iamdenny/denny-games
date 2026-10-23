import { describe, expect, it } from "vitest";
import { games } from "../../src/data/games";
import { articles, guidePaths } from "../../src/data/pages";
import { collections } from "../../src/data/collections";
const ids = [
  "minefield-watch",
  "mosaic-mystery",
  "traffic-escape",
  "river-hop",
  "meteor-guard",
  "pocket-bowling",
];
describe("original six-game discovery", () => {
  it("publishes six original local games with bilingual rules and independent guides", () => {
    for (const id of ids) {
      const matches = games.filter((g) => g.id === id);
      expect(matches).toHaveLength(1);
      const game = matches[0]!;
      expect(game.externalPlay).toBeUndefined();
      expect(game.license).toBe("MIT");
      expect(game.playModes).toEqual(["single-player"]);
      expect(game.source).toContain(`/src/games/${id}`);
      expect(game.screenshot).toBe(`/art/screenshots/${id}.png`);
      expect(guidePaths).toContain(`guides/${id}`);
      for (const locale of ["en", "ko"] as const) {
        const copy = game.text[locale];
        const guide = articles[`guides/${id}`]![locale];
        expect(copy.rules.length).toBeGreaterThanOrEqual(2);
        expect(copy.controls.length).toBeGreaterThanOrEqual(1);
        expect(guide.intro).not.toBe(copy.description);
        expect(
          guide.links?.some((l) => l.href === `/${locale}/play/${id}/`),
        ).toBe(true);
      }
    }
  });
  it("curates every new game once across two complete three-game collections", () => {
    const members = collections
      .filter((c) => ["logic-detectives", "cross-defend-roll"].includes(c.id))
      .flatMap((c) => c.ids);
    expect(members.sort()).toEqual([...ids].sort());
  });
});
