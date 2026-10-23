import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { games, categories } from "../../src/data/games";
import crisp from "../../src/data/crisp.json";
import provenance from "../../vendor/crisp/provenance.json";
import cycleProvenance from "../../vendor/crisp-cycles/provenance.json";
import hextrisProvenance from "../../vendor/hextris/provenance.json";
import sokobanProvenance from "../../vendor/sokoban/provenance.json";
import gridlandProvenance from "../../vendor/gridland/provenance.json";
import { categoryCopy } from "../../src/data/discovery";
import { copy } from "../../src/data/i18n";
import { controlStyles } from "../../src/data/play-styles";
const externalResearch = JSON.parse(
  readFileSync("vendor/external-browser-listings.json", "utf8"),
) as {
  entries: {
    id: string;
    projectLicense: string;
    archivedArtwork: string;
  }[];
};
describe("import admission and catalogue", () => {
  it("has unique playable entries, bounded daily scope and nonempty categories", () => {
    expect(crisp).toHaveLength(191);
    expect(games).toHaveLength(336);
    expect(games.filter((game) => game.externalPlay)).toHaveLength(0);
    expect(new Set(games.map((g) => g.id)).size).toBe(games.length);
    expect(games.filter((g) => g.tags.includes("daily"))).toHaveLength(3);
    const solitaire = games.find((game) => game.id === "klondike-solitaire");
    expect(solitaire?.license).toBe("MIT");
    expect(solitaire?.externalPlay).toBeUndefined();
    expect(solitaire?.guide?.path).toBe("guides/klondike-solitaire");
    expect(
      categories.filter((category) =>
        games.every((game) => game.category !== category),
      ),
    ).toEqual([]);
    for (const g of games) {
      expect(existsSync("public" + g.artwork)).toBe(true);
      for (const l of ["en", "ko"] as const) {
        expect(g.text[l].title.trim().length).toBeGreaterThan(0);
        expect(g.text[l].rules.length).toBeGreaterThan(0);
        expect(g.text[l].description.length).toBeGreaterThan(20);
      }
    }
  });
  it("publishes only games with an in-site player route", () => {
    expect(externalResearch.entries).toHaveLength(149);
    const publishedIds = new Set(games.map((game) => game.id));
    expect(games.every((game) => !game.externalPlay)).toBe(true);
    for (const candidate of externalResearch.entries) {
      expect(publishedIds.has(candidate.id), candidate.id).toBe(
        candidate.id === "neverball",
      );
      const archivedArtwork = candidate.archivedArtwork.replace(
        "vendor/external-listing-art/",
        "",
      );
      expect(candidate.archivedArtwork).toMatch(
        /^vendor\/external-listing-art\//,
      );
      expect(existsSync(candidate.archivedArtwork), candidate.id).toBe(true);
      if (candidate.id === "neverball") {
        expect(readFileSync(`public/art/${archivedArtwork}`, "utf8")).not.toBe(
          readFileSync(candidate.archivedArtwork, "utf8"),
        );
        expect(existsSync("vendor/neverball/provenance.json")).toBe(true);
      } else {
        expect(existsSync(`public/art/${archivedArtwork}`), candidate.id).toBe(
          false,
        );
      }
    }
  });
  it("keeps public discovery copy and search filters local-play only", () => {
    const activeCopy = [copy.en.intro, copy.ko.intro].concat(
      categories.flatMap((category) => [
        categoryCopy[category].en,
        categoryCopy[category].ko,
      ]),
    );
    expect(activeCopy.join(" ").toLowerCase()).not.toMatch(
      /external|independent host|host rules|호스트|외부/,
    );
    expect(controlStyles).not.toContain("host");
  });
  it("keeps mixed-license and unpublished-license candidates out of the catalogue", () => {
    const byId = new Map(
      externalResearch.entries.map((entry) => [entry.id, entry]),
    );
    for (const [id, licenseText] of [
      ["openfront", "AGPL-3.0"],
      ["hypersomnia", "AGPL-3.0"],
      ["hotlapped", "No source-code license"],
      ["scorched-tanks", "No code license"],
      ["friday-night-funkin", "proprietary"],
    ] as const) {
      const candidate = byId.get(id);
      expect(candidate?.projectLicense, id).toContain(licenseText);
      expect(
        games.some((game) => game.id === id),
        id,
      ).toBe(false);
    }
  });
  it("retains original-project license evidence for removed candidates", () => {
    const byId = new Map(
      externalResearch.entries.map((entry) => [entry.id, entry]),
    );
    expect(byId.get("friday-night-funkin")?.projectLicense).toContain(
      "Apache-2.0 software code",
    );
    expect(byId.get("friday-night-funkin")?.projectLicense).toContain(
      "proprietary",
    );
    expect(byId.get("trust")?.projectLicense).toContain("CC0 core");
    expect(byId.get("bananabread")?.projectLicense).toContain("zlib code");
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
    expect(review.entries).toHaveLength(295);
    expect(
      review.entries.filter(
        (g: { status: string }) => g.status === "integrated",
      ),
    ).toHaveLength(201);
    expect(
      review.entries.filter(
        (g: { status: string }) => g.status === "rights-or-integration-review",
      ),
    ).toHaveLength(21);
    const gridland = games.find((game) => game.id === "gridland")!;
    expect(gridland.externalPlay).toBeUndefined();
    expect(gridland.license).toBe("MPL-2.0");
    expect(gridland.notice).toBe("/licenses/gridland/");
    expect(gridland.imported).toBe(true);
    expect(gridland.inputs).toEqual(["touch", "mouse"]);
    expect(gridland.screenshot).toBe("/art/open-games/gridland-preview.png");
    expect(existsSync("public" + gridland.screenshot)).toBe(true);
    expect(gridland.text.en.controls.join(" ")).toContain(
      "Music and sound are omitted",
    );
    expect(gridland.text.ko.controls.join(" ")).toContain(
      "음악과 효과음을 제외",
    );
    expect(
      JSON.parse(
        readFileSync("vendor/external-browser-listings.json", "utf8"),
      ).entries.some((entry: { id: string }) => entry.id === "gridland"),
    ).toBe(false);
    for (const [file, expected] of Object.entries(
      gridlandProvenance.upstream_files,
    )) {
      expect(
        createHash("sha256")
          .update(readFileSync("vendor/gridland/upstream/" + file))
          .digest("hex"),
      ).toBe(expected);
    }
    expect(readFileSync("vendor/gridland/provenance.json", "utf8")).toContain(
      "www/audio/",
    );
    const sokoban = games.find((game) => game.id === "sokoban")!;
    expect(sokoban.externalPlay).toBeUndefined();
    expect(sokoban.license).toBe("MIT");
    expect(sokoban.notice).toBe("/licenses/sokoban/LICENSE.txt");
    expect(sokoban.imported).toBe(true);
    expect(sokoban.inputs).toContain("touch");
    expect(sokoban.inputs).toContain("keyboard");
    expect(sokoban.inputs).toContain("gamepad");
    expect(sokoban.text.en.controls.join(" ")).toContain(
      "physical controllers are not verified",
    );
    expect(sokoban.text.ko.controls.join(" ")).toContain(
      "실물 컨트롤러 동작은 검증하지 않았어요",
    );
    for (const [file, expected] of Object.entries(
      sokobanProvenance.upstream_files,
    )) {
      expect(
        createHash("sha256")
          .update(readFileSync("vendor/sokoban/upstream/" + file))
          .digest("hex"),
      ).toBe(expected);
    }
    expect(readFileSync("public/licenses/sokoban/LICENSE.txt", "utf8")).toMatch(
      /Permission is hereby granted/,
    );
    for (const [file, expected] of Object.entries(
      sokobanProvenance.product_artwork,
    )) {
      expect(
        createHash("sha256").update(readFileSync(file)).digest("hex"),
      ).toBe(expected);
    }
    expect(
      existsSync("public/vendor/sokoban/source/upstream/src/sokoban.ts.txt"),
    ).toBe(true);
    expect(
      existsSync("public/vendor/sokoban/source/upstream/index.html.txt"),
    ).toBe(true);
  });
});
