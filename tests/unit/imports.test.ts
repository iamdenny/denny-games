import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { games, categories } from "../../src/data/games";
import crisp from "../../src/data/crisp.json";
import provenance from "../../vendor/crisp/provenance.json";
import cycleProvenance from "../../vendor/crisp-cycles/provenance.json";
import hextrisProvenance from "../../vendor/hextris/provenance.json";
describe("import admission and catalogue", () => {
  it("has unique playable entries, bounded daily scope and nonempty categories", () => {
    expect(crisp).toHaveLength(191);
    expect(games).toHaveLength(222);
    expect(games.filter((game) => game.externalPlay)).toHaveLength(17);
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
    for (const [file, expected] of Object.entries(
      hextrisProvenance.upstream_files,
    ))
      expect(
        createHash("sha256")
          .update(readFileSync(`vendor/hextris/upstream/${file}`))
          .digest("hex"),
      ).toBe(expected);
    expect(hextrisProvenance.license).toBe("GPL-3.0-or-later");
    expect(games.find((game) => game.id === "hextris")?.notice).toBe(
      "/licenses/hextris/",
    );
  });
  it("pins and locally builds the three independent Crisp arcade cycles", () => {
    expect(cycleProvenance.source_commit).toBe(
      "8c71950c93008235a7e63401aba66cbb67d82421",
    );
    expect(cycleProvenance.runtime_version).toBe("1.5.0");
    expect(cycleProvenance.games).toHaveLength(3);
    for (const game of cycleProvenance.games) {
      expect(games.find((entry) => entry.id === game.id)?.internalScore).toBe(
        true,
      );
      expect(game.source_url).toContain(cycleProvenance.source_commit);
      expect(
        existsSync(`public/vendor/crisp-cycles/${game.slug}/index.html`),
      ).toBe(true);
      expect(
        existsSync(`public/vendor/crisp-cycles/${game.slug}/assets.js`),
      ).toBe(true);
      for (const file of [...game.runtime_files, ...game.assets]) {
        expect(
          createHash("sha256").update(readFileSync(file.source)).digest("hex"),
        ).toBe(file.sha256);
        expect(
          existsSync(
            `public/vendor/crisp-cycles/${game.slug}/${file.source.split(`/upstream/${game.slug}/`)[1]}`,
          ),
        ).toBe(true);
      }
      const frame = readFileSync(
        `public/vendor/crisp-cycles/${game.slug}/index.html`,
        "utf8",
      );
      expect(frame).toContain("default-src 'none'");
      expect(frame).toContain("connect-src 'none'");
      expect(frame).toContain(
        `https://games.iamdenny.com/en/games/${game.id}/`,
      );
    }
    expect(
      readFileSync("public/licenses/crisp/crisp-game-lib-12-games.txt", "utf8"),
    ).toMatch(/Permission is hereby granted/);
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
    ).toHaveLength(198);
  });
});
