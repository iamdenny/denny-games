import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

let choice: string | null;
let failStorage: boolean;
let buttons: Record<string, () => void>;
let win: Record<string, any>;
let panel: { hidden: boolean; querySelector: (selector: string) => unknown };

beforeEach(() => {
  vi.resetModules();
  choice = null;
  failStorage = false;
  buttons = {};
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

describe("consented game analytics", () => {
  it("renews old page-view-only permission and never replays an earlier round", async () => {
    choice = "granted";
    const { initAnalytics, trackGameAnalytics: track } =
      await import("../../src/lib/analytics");
    initAnalytics();
    expect(panel.hidden).toBe(false);
    track("start", "2048");
    expect(win.dataLayer).toBeUndefined();
    buttons["[data-analytics-allow]"]!();
    expect(choice).toBe("granted-v2");
    track("end", "2048");
    expect(events()).toEqual([]);
  });
  it("counts only one real start and completion per round, without payload leakage", async () => {
    choice = "granted-v2";
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
  it("stops on withdrawal even if saving fails, and never counts a resumed old round", async () => {
    choice = "granted-v2";
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
