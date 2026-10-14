import { describe, it, expect } from "vitest";
import { games } from "../../src/data/games";
import { collections, collectionGames } from "../../src/data/collections";
import {
  filterCatalogue,
  paginate,
  search,
  searchPage,
} from "../../src/lib/catalogue";
import { deviceChecks, makeDeviceReport } from "../../src/lib/device-check";

describe("play-style discovery", () => {
  it("curated lists have real unique games and honest selection boundaries", () => {
    for (const collection of collections) {
      expect(collectionGames(collection.id).length).toBe(collection.ids.length);
      expect(new Set(collection.ids).size).toBe(collection.ids.length);
    }
    expect(
      collectionGames("one-button").every(
        (game) => game.controlStyle === "buttons",
      ),
    ).toBe(true);
    expect(
      collectionGames("point-and-play").every(
        (game) => game.controlStyle === "pointer",
      ),
    ).toBe(true);
    expect(
      collectionGames("daily-challenges").every((game) =>
        game.tags.includes("daily"),
      ),
    ).toBe(true);
  });
  it("combines filters with text and caps pages without losing the full result count", () => {
    const filtered = filterCatalogue(games, {
      category: "racing",
      control: "buttons",
      length: "short",
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (game) => game.category === "racing" && game.controlStyle === "buttons",
      ),
    ).toBe(true);
    expect(
      filterCatalogue(games, {
        category: "sports",
        control: "numbers",
        length: "",
      }),
    ).toEqual([]);
    const long = filterCatalogue(games, {
      category: "",
      control: "",
      length: "long",
    });
    expect(long.map((game) => game.id)).toEqual([
      "circuit-loop",
      "2048",
      "hextris",
      "bounce-back",
      "underrun",
      "gomoku",
      "reversi",
      "four-in-a-row",
      "checkers",
      "dots-and-boxes",
      "crisp-chain-drift",
      "crisp-comet-slash",
      "crisp-volt-keeper",
    ]);
    expect(
      search(
        filtered.map((game) => ({
          ...game,
          title: game.text.en.title,
          description: game.text.en.description,
        })),
        "PARKING",
      ).map((game) => game.id),
    ).toEqual(["crisp-parking"]);
    expect(paginate(games, 1).length).toBe(24);
    for (const value of ["0", "-1", "1.5", "NaN", "Infinity"])
      expect(searchPage(value, games.length)).toBe(1);
    expect(searchPage("999", games.length)).toBe(9);
    expect(searchPage("2", 0)).toBe(1);
  });
});

describe("device observations", () => {
  it("never promotes missing or invalid results to success or certification", () => {
    const form = new FormData();
    form.set("game", "2048");
    form.set("pause", "pass");
    form.set("input", "fail");
    form.set("audio", "forged");
    const report = makeDeviceReport(form, "invalid-sha", ["2048"]);
    expect(report.certified).toBe(false);
    expect(report.source).toBe("user-observation");
    expect(report.releaseSha).toBeNull();
    expect(report.checks.pause).toBe("pass");
    expect(report.checks.input).toBe("fail");
    expect(report.checks.audio).toBe("not-tested");
    expect(report.checks.soak).toBe("not-tested");
    expect(Object.keys(report.checks)).toHaveLength(deviceChecks.length);
    form.set("game", "fake");
    expect(() => makeDeviceReport(form, null, ["2048"])).toThrow(
      "game-required",
    );
  });
});
