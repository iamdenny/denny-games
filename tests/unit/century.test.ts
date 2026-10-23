import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import century from "../../src/data/century-crisp.json";
import original from "../../src/data/crisp.json";
import provenance from "../../vendor/crisp/provenance.json";
import { games } from "../../src/data/games";

describe("century game admission", () => {
  it("adds 89 distinct pinned Crisp games without replacing the original 191", () => {
    expect(century).toHaveLength(89);
    const previous = new Set(original.map((game) => game.id));
    const hashes = new Set<string>();
    const titles = new Set(
      original.map((game) =>
        game.title.toLowerCase().replace(/[^a-z0-9]/g, ""),
      ),
    );
    for (const game of century) {
      expect(previous.has(game.id), game.id).toBe(false);
      const title = game.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      expect(titles.has(title), game.id).toBe(false);
      titles.add(title);
      expect(game.id).toBe(`crisp-${game.slug}`);
      expect(game.slug).toMatch(/^[a-z0-9-]+$/);
      const hash = createHash("sha256")
        .update(readFileSync(`public/vendor/crisp/games/${game.slug}/main.js`))
        .digest("hex");
      if ("original" in game && game.original) {
        const evidence = JSON.parse(
          readFileSync("vendor/signal-crossing/provenance.json", "utf8"),
        );
        expect(hash).toBe(evidence.source_sha256);
        expect(games.find((entry) => entry.id === game.id)?.author).toBe(
          "Denny Games",
        );
      } else {
        const evidence = provenance.games.find(
          (entry) => entry.id === game.id,
        )!;
        expect(evidence, game.id).toBeDefined();
        expect(hash).toBe(evidence.vendored_sha256);
        expect(game.source).toContain(evidence.commit);
      }
      expect(hashes.has(hash), game.id).toBe(false);
      hashes.add(hash);
      expect(games.find((entry) => entry.id === game.id)?.added).toBe(
        "2026-10-23",
      );
      expect(game.summary.length).toBeGreaterThan(50);
      expect(game.summaryKo.length).toBeGreaterThanOrEqual(25);
    }
  });

  it("keeps new repository licenses and no-network source adaptations reviewable", () => {
    for (const repo of [
      "claude-one-button-game-creation",
      "one-button-game-builder",
    ]) {
      expect(
        readFileSync(`public/licenses/crisp/${repo}/LICENSE.txt`, "utf8"),
      ).toContain("Permission is hereby granted");
    }
    const bridge = readFileSync("public/vendor/crisp/bridge.js", "utf8");
    expect(bridge.indexOf("window.audioFiles = undefined")).toBeLessThan(
      bridge.indexOf("onLoad();"),
    );
  });
});
