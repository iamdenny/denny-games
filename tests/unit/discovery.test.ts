import { describe, it, expect } from "vitest";
import { games } from "../../src/data/games";
import { collections, collectionGames } from "../../src/data/collections";
import {
  PAGE_SIZE,
  filterCatalogue,
  paginate,
  search,
  searchPage,
} from "../../src/lib/catalogue";
import { deviceChecks, makeDeviceReport } from "../../src/lib/device-check";
import { pagePaths } from "../../src/lib/routes";
import { playModesFor } from "../../src/data/play-styles";

describe("play-style discovery", () => {
  it("filters solo and same-device games without treating Yutnori as solo", () => {
    const filters = { category: "", control: "", length: "" };
    const together = filterCatalogue(games, {
      ...filters,
      mode: "multi-player",
    });
    expect(together.map((game) => game.id).sort()).toEqual([
      "checkers",
      "crater-duel",
      "dots-and-boxes",
      "ember-maze",
      "four-in-a-row",
      "frost-patrol",
      "gomoku",
      "iron-bastion",
      "reversi",
      "yutnori",
    ]);
    const solo = filterCatalogue(games, { ...filters, mode: "single-player" });
    expect(solo.some((game) => game.id === "yutnori")).toBe(false);
    expect(solo.some((game) => game.id === "gonggi")).toBe(true);
    expect(solo.some((game) => game.id === "gomoku")).toBe(true);
    expect(
      filterCatalogue(games, {
        ...filters,
        mode: "multi-player",
        category: "board",
      }),
    ).toHaveLength(6);
    const index = games.map((game) => ({
      ...game,
      classic: undefined,
      playModes: playModesFor(game),
    }));
    expect(
      filterCatalogue(index, { ...filters, mode: "multi-player" }).map(
        (game) => game.id,
      ),
    ).toEqual(together.map((game) => game.id));
  });
  it("includes a listed guide route for every game detail link", () => {
    const paths = pagePaths();
    for (const game of games) {
      if (game.guide) expect(paths).toContain(game.guide.path);
    }
  });

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
      "yutnori",
      "agentic-blink-scope",
      "agentic-draft-line",
      "agentic-head-rush",
      "agentic-overturn",
      "agentic-parallaxia",
      "agentic-pileup",
      "agentic-skyhaul",
      "agentic-twin-vector",
      "agentic-undertow",
      "agentic-wreckfall",
      "agentic-zig-saber",
      "crisp-chain-drift",
      "crisp-comet-slash",
      "crisp-volt-keeper",
      "klondike-solitaire",
      "snack-street",
      "pocket-pingpong",
      "star-pinball",
      "jewel-drop",
      "minefield-watch",
      "mosaic-mystery",
      "traffic-escape",
      "river-hop",
      "meteor-guard",
      "pocket-bowling",
      "lantern-grid",
      "number-trail",
      "jegi-rally",
      "gonggi",
      "amber-trail",
      "starlight-apprentice",
      "beacon-quest",
      "ember-maze",
      "frost-patrol",
      "crater-duel",
      "iron-bastion",
      "prism-pop",
      "bubble-harbor",
      "starfall-wing",
      "vault-runner",

      "neverball",
      "neverputt",
      "sgt-blackbox",
      "packabunchas",
      "gridland",
      "sokoban",
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
    expect(searchPage("999", games.length)).toBe(
      Math.ceil(games.length / PAGE_SIZE),
    );
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
