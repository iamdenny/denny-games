import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

let choice: string | null;
let failStorage: boolean;
let buttons: Record<string, () => void>;
let sessionValues: Map<string, string>;
let win: Record<string, any>;
let panel: { hidden: boolean; querySelector: (selector: string) => unknown };

beforeEach(() => {
  vi.resetModules();
  choice = null;
  failStorage = false;
  buttons = {};
  sessionValues = new Map();
  win = { addEventListener: vi.fn() };
  panel = {
    hidden: true,
    querySelector: (selector) => ({
      addEventListener: (_name: string, fn: () => void) => {
        buttons[selector] = fn;
      },
    }),
  };
  vi.stubGlobal("window", win);
  vi.stubGlobal("location", {
    origin: "https://example.test",
    pathname: "/en/play/2048/",
    protocol: "https:",
    hostname: "example.test",
  });
  vi.stubGlobal("localStorage", {
    getItem: () => {
      if (failStorage) throw Error("blocked");
      return choice;
    },
    setItem: (_key: string, value: string) => {
      if (failStorage) throw Error("blocked");
      choice = value;
    },
  });
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => sessionValues.get(key) ?? null,
    setItem: (key: string, value: string) => sessionValues.set(key, value),
    removeItem: (key: string) => sessionValues.delete(key),
  });
  vi.stubGlobal("document", {
    cookie: "",
    referrer: "",
    title: "2048",
    documentElement: { lang: "en" },
    querySelector: (selector: string) =>
      selector === "#player" ? { dataset: { id: "2048" } } : panel,
    querySelectorAll: () => [],
  });
});
afterEach(() => vi.unstubAllGlobals());
const events = () =>
  (win.dataLayer ?? [])
    .map((entry: IArguments) => Array.from(entry))
    .filter((entry: unknown[]) => entry[0] === "event");

describe("consented analytics", () => {
  it("renews the previous game-only permission and never replays earlier activity", async () => {
    choice = "granted-v2";
    const {
      initAnalytics,
      trackGameAnalytics: track,
      trackCatalogueSearch,
    } = await import("../../src/lib/analytics");
    initAnalytics();
    expect(panel.hidden).toBe(false);
    track("start", "2048");
    trackCatalogueSearch({ hasQuery: true, filterCount: 0, resultCount: 0 });
    expect(win.dataLayer).toBeUndefined();
    buttons["[data-analytics-allow]"]!();
    expect(choice).toBe("granted-v3");
    track("end", "2048");
    trackCatalogueSearch({ hasQuery: true, filterCount: 0, resultCount: 0 });
    expect(events()).toEqual([]);
  });
  it("does not treat the legacy unversioned grant as permission", async () => {
    choice = "granted";
    const { initAnalytics, trackGameAnalytics: track } =
      await import("../../src/lib/analytics");
    initAnalytics();
    expect(panel.hidden).toBe(false);
    track("start", "2048");
    expect(win.dataLayer).toBeUndefined();
    expect(choice).toBe("granted");
  });
  it("consumes only a fresh, consented home-search submission marker", async () => {
    choice = "granted-v3";
    const {
      initAnalytics,
      markCatalogueSearchSubmission,
      consumeCatalogueSearchSubmission,
    } = await import("../../src/lib/analytics");
    initAnalytics();
    markCatalogueSearchSubmission();
    expect(consumeCatalogueSearchSubmission()).toBe(true);
    expect(consumeCatalogueSearchSubmission()).toBe(false);

    sessionValues.set(
      "denny-games.catalog-search-submitted",
      String(Date.now() - 15_001),
    );
    expect(consumeCatalogueSearchSubmission()).toBe(false);
  });
  it("does not mark homepage search when analytics is declined", async () => {
    choice = "denied";
    const {
      initAnalytics,
      markCatalogueSearchSubmission,
      consumeCatalogueSearchSubmission,
    } = await import("../../src/lib/analytics");
    initAnalytics();
    markCatalogueSearchSubmission();
    expect(consumeCatalogueSearchSubmission()).toBe(false);
  });
  it("counts only one real start and completion per round, without payload leakage", async () => {
    choice = "granted-v3";
    const { initAnalytics, trackGameAnalytics: track } =
      await import("../../src/lib/analytics");
    initAnalytics();
    for (const event of ["load", "restart", "end"]) track(event, "2048");
    expect(events()).toEqual([]);
    for (const event of ["start", "start", "pause", "resume", "end", "end"])
      track(event, "2048");
    expect(events()).toEqual([
      [
        "event",
        "game_start",
        {
          send_to: "G-5NZLTVBG5Y",
          game_id: "2048",
          page_location: "https://example.test/en/play/2048/",
          page_referrer: "",
        },
      ],
      [
        "event",
        "game_complete",
        {
          send_to: "G-5NZLTVBG5Y",
          game_id: "2048",
          page_location: "https://example.test/en/play/2048/",
          page_referrer: "",
        },
      ],
    ]);
    track("start", "private-input");
    expect(events()).toHaveLength(2);
    track("restart", "2048");
    track("start", "2048");
    expect(events()).toHaveLength(3);
  });
  it("sends only bounded aggregate search results on localized search routes", async () => {
    choice = "granted-v3";
    win.dataLayer = [];
    win.gtag = (...args: unknown[]) => {
      win.dataLayer.push(args);
    };
    const { initAnalytics, trackCatalogueSearch } =
      await import("../../src/lib/analytics");
    vi.stubGlobal("location", {
      origin: "https://example.test",
      pathname: "/ko/search/",
      protocol: "https:",
      hostname: "example.test",
    });
    initAnalytics();
    trackCatalogueSearch({ hasQuery: true, filterCount: 2, resultCount: 0 });
    expect(events()).toEqual([
      [
        "event",
        "catalog_search",
        {
          send_to: "G-5NZLTVBG5Y",
          search_has_query: true,
          search_filter_count: 2,
          search_result_count: 0,
          page_location: "https://example.test/ko/search/",
          page_referrer: "",
        },
      ],
    ]);

    trackCatalogueSearch({ hasQuery: false, filterCount: 0, resultCount: 0 });
    trackCatalogueSearch({ hasQuery: false, filterCount: 5, resultCount: 2 });
    trackCatalogueSearch({ hasQuery: true, filterCount: 1, resultCount: -1 });
    vi.stubGlobal("location", {
      origin: "https://example.test",
      pathname: "/ko/",
      protocol: "https:",
      hostname: "example.test",
    });
    trackCatalogueSearch({ hasQuery: true, filterCount: 1, resultCount: 2 });
    expect(events()).toHaveLength(1);
  });
  it("stops on withdrawal even if saving fails, and never counts a resumed old round", async () => {
    choice = "granted-v3";
    const { initAnalytics, trackGameAnalytics: track } =
      await import("../../src/lib/analytics");
    initAnalytics();
    track("start", "2048");
    failStorage = true;
    buttons["[data-analytics-deny]"]!();
    track("end", "2048");
    expect(events()).toHaveLength(1);
    expect(win["ga-disable-G-5NZLTVBG5Y"]).toBe(true);
    failStorage = false;
    buttons["[data-analytics-allow]"]!();
    track("resume", "2048");
    track("end", "2048");
    expect(events()).toHaveLength(1);
  });
  it("fails closed with denied consent or unavailable storage", async () => {
    choice = "denied";
    const { initAnalytics, trackGameAnalytics: track } =
      await import("../../src/lib/analytics");
    initAnalytics();
    track("start", "2048");
    failStorage = true;
    buttons["[data-analytics-allow]"]!();
    track("start", "2048");
    expect(win.dataLayer).toBeUndefined();
  });
});
