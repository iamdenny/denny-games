import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { games, categories } from "../../src/data/games";
import crisp from "../../src/data/crisp.json";
import provenance from "../../vendor/crisp/provenance.json";
import cycleProvenance from "../../vendor/crisp-cycles/provenance.json";
import hextrisProvenance from "../../vendor/hextris/provenance.json";
import { discoverySchema } from "../../src/lib/seo";
describe("import admission and catalogue", () => {
  it("has unique playable entries, bounded daily scope and nonempty categories", () => {
    expect(crisp).toHaveLength(191);
    expect(games).toHaveLength(350);
    expect(games.filter((game) => game.externalPlay)).toHaveLength(145);
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
  it("keeps the new external game hosts and their license boundaries explicit", () => {
    const openfront = games.find((game) => game.id === "openfront")!;
    expect(openfront.externalPlay?.url).toBe("https://openfront.io/");
    expect(openfront.license).toContain("AGPL-3.0");
    expect(openfront.licenseDescription?.en).toContain("proprietary");
    expect(openfront.licenseAppliesToGame).toBe(false);
    expect(openfront.tags).not.toContain("free open source browser game");
    expect(openfront.tags).not.toContain("무료 오픈소스 브라우저 게임");
    expect(openfront.externalPlay?.privacyUrl).toBe(
      "https://openfront.io/privacy-policy.html",
    );
    expect(openfront.externalPlay?.privacyNote?.en).toContain("chat");
    expect(openfront.externalPlay?.privacyNote?.ko).toContain("채팅");

    const hypersomnia = games.find((game) => game.id === "hypersomnia")!;
    expect(hypersomnia.externalPlay?.url).toBe("https://play.hypersomnia.io/");
    expect(hypersomnia.license).toContain("AGPL-3.0");
    expect(hypersomnia.licenseAppliesToGame).toBe(false);
    expect(hypersomnia.tags).not.toContain("free open source browser game");
    expect(hypersomnia.tags).not.toContain("무료 오픈소스 브라우저 게임");
  });
  it("does not label free proprietary listings as open source in search metadata", () => {
    const hotlapped = games.find((game) => game.id === "hotlapped")!;
    expect(hotlapped.tags).not.toContain("free open source browser game");
    expect(hotlapped.license).toContain("Source license not published");
    expect(hotlapped.sourceLabel?.en).toBe("Official game information");

    const schema = discoverySchema({
      locale: "en",
      path: "games/hotlapped",
      title: hotlapped.text.en.title,
      description: hotlapped.text.en.description,
      game: hotlapped,
    });
    const entity = schema["@graph"].find(
      (item) =>
        item !== undefined && "@type" in item && item["@type"] === "VideoGame",
    );
    expect(entity).toBeDefined();
    expect(entity).not.toHaveProperty("license");
    expect(entity).not.toHaveProperty("isBasedOn");

    const scorchedTanks = games.find((game) => game.id === "scorched-tanks")!;
    expect(scorchedTanks.tags).not.toContain("free open source browser game");
    expect(scorchedTanks.license).toContain("not published");
    expect(scorchedTanks.licenseUrl).toBeUndefined();
    const scorchedSchema = discoverySchema({
      locale: "en",
      path: "games/scorched-tanks",
      title: scorchedTanks.text.en.title,
      description: scorchedTanks.text.en.description,
      game: scorchedTanks,
    });
    const scorchedEntity = scorchedSchema["@graph"].find(
      (item) =>
        item !== undefined && "@type" in item && item["@type"] === "VideoGame",
    );
    expect(scorchedEntity).toBeDefined();
    expect(scorchedEntity).not.toHaveProperty("license");

    const lextown = games.find((game) => game.id === "lextown")!;
    const lextownSchema = discoverySchema({
      locale: "en",
      path: "games/lextown",
      title: lextown.text.en.title,
      description: lextown.text.en.description,
      game: lextown,
    });
    const lextownEntity = lextownSchema["@graph"].find(
      (item) =>
        item !== undefined && "@type" in item && item["@type"] === "VideoGame",
    );
    expect(lextownEntity).toMatchObject({
      playMode: ["https://schema.org/MultiPlayer"],
    });

    for (const id of [
      "brakeless",
      "hotlapped",
      "teebrawl",
      "littlewargame",
      "mingat-cozy-cafe",
      "mingat-pet-daycare",
      "mingat-nomad-life",
    ]) {
      const game = games.find((entry) => entry.id === id)!;
      expect(game.licenseDescription?.en.length).toBeGreaterThan(10);
      expect(game.licenseDescription?.ko.length).toBeGreaterThan(10);
    }

    for (const id of ["teebrawl", "littlewargame"]) {
      const game = games.find((entry) => entry.id === id)!;
      expect(game.tags).not.toContain("free open source browser game");
      expect(game.license.toLowerCase()).toContain("not published");
      const schema = discoverySchema({
        locale: "en",
        path: `games/${id}`,
        title: game.text.en.title,
        description: game.text.en.description,
        game,
      });
      const entity = schema["@graph"].find(
        (item) =>
          item !== undefined &&
          "@type" in item &&
          item["@type"] === "VideoGame",
      );
      expect(entity).toBeDefined();
      expect(entity).not.toHaveProperty("license");
      expect(entity).not.toHaveProperty("isBasedOn");
    }
  });
  it("keeps code-only licenses out of whole-game structured data", () => {
    const fnf = games.find((game) => game.id === "friday-night-funkin")!;
    expect(fnf.licenseAppliesToGame).toBe(false);
    expect(fnf.licenseUrl).toBe(
      "https://github.com/FunkinCrew/Funkin/blob/main/LICENSE.md",
    );
    expect(fnf.licenseUrlLabel).toEqual({
      en: "Apache-2.0 software code license",
      ko: "Apache-2.0 소프트웨어 코드 라이선스",
    });

    for (const locale of ["en", "ko"] as const) {
      const schema = discoverySchema({
        locale,
        path: "games/friday-night-funkin",
        title: fnf.text[locale].title,
        description: fnf.text[locale].description,
        game: fnf,
      });
      const entity = schema["@graph"].find(
        (item) =>
          item !== undefined &&
          "@type" in item &&
          item["@type"] === "VideoGame",
      );
      expect(entity).toBeDefined();
      expect(entity).not.toHaveProperty("license");
    }

    const trust = games.find((game) => game.id === "trust")!;
    expect(trust.licenseAppliesToGame).toBe(false);
    expect(trust.licenseUrlLabel?.en).toContain("license");
    expect(trust.tags).not.toContain("free open source browser game");

    const bananaBread = games.find((game) => game.id === "bananabread")!;
    expect(bananaBread.licenseAppliesToGame).toBe(false);
    expect(bananaBread.license).toContain("zlib");
    expect(bananaBread.license).toContain("CC-BY");
    expect(bananaBread.tags).toContain("free open source browser game");
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
