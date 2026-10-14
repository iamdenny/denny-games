import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { games, categories } from "../../src/data/games";
import crisp from "../../src/data/crisp.json";
import provenance from "../../vendor/crisp/provenance.json";
describe("import admission and catalogue", () => {
  it("has unique playable entries, bounded daily scope and nonempty categories", () => {
    expect(crisp).toHaveLength(191);
    expect(games).toHaveLength(200);
    expect(new Set(games.map((g) => g.id)).size).toBe(games.length);
    expect(games.filter((g) => g.tags.includes("daily"))).toHaveLength(3);
    for (const c of categories)
      expect(games.some((g) => g.category === c)).toBe(true);
    for (const g of games) {
      expect(existsSync("public" + g.artwork)).toBe(true);
      for (const l of ["en", "ko"] as const) {
        expect(g.text[l].title.trim().length).toBeGreaterThan(0);
        expect(g.text[l].rules.length).toBeGreaterThan(0);
        expect(g.text[l].description.length).toBeGreaterThan(20);
      }
    }
  });
  it("retains the audited game sources and sprite hashes exactly", () => {
    for (const g of provenance.games) {
      expect(
        createHash("sha256")
          .update(readFileSync(`public/vendor/crisp/games/${g.slug}/main.js`))
          .digest("hex"),
      ).toBe(g.vendored_sha256);
      expect(g.source_url).toContain(g.commit);
    }
    for (const a of provenance.image_assets)
      expect(
        createHash("sha256").update(readFileSync(a.path)).digest("hex"),
      ).toBe(a.sha256);
  });
  it("retains original MIT notices and marks all research dispositions", () => {
    for (const file of [
      "runtime",
      "crisp-game-lib-games",
      "crisp-game-lib-11-games",
      "crisp-game-lib-12-games",
      "lodash",
    ])
      expect(readFileSync(`public/licenses/crisp/${file}.txt`, "utf8")).toMatch(
        /Permission is hereby granted/,
      );
    const review = JSON.parse(
      readFileSync("vendor/catalogue-review.json", "utf8"),
    );
    expect(review.entries).toHaveLength(294);
    expect(
      review.entries.filter(
        (g: { status: string }) => g.status === "integrated",
      ),
    ).toHaveLength(193);
  });
});
