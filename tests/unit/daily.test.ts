import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  dailyHistory,
  dailyRounds,
  recordDailyRound,
} from "../../src/lib/daily";
import { dailySeed } from "../../src/lib/random";
import { read, write } from "../../src/lib/storage";
const date = new Date("2026-10-15T06:00:00Z");
beforeEach(() => write("daily-rounds", undefined));
describe("completed daily rounds", () => {
  it("counts zero-score completions and keeps the best per rule version", () => {
    expect(
      recordDailyRound("2048", 1, dailySeed("2048", date), 1, 0, date),
    ).toBe(true);
    expect(dailyRounds(date)["2048"]?.score).toBe(0);
    recordDailyRound("2048", 1, dailySeed("2048", date), 1, 50, date);
    recordDailyRound("2048", 1, dailySeed("2048", date), 1, 10, date);
    expect(dailyRounds(date)["2048"]?.score).toBe(50);
    recordDailyRound("2048", 2, dailySeed("2048", date), 1, 10, date);
    expect(dailyRounds(date)["2048"]).toEqual({ version: 2, score: 10 });
  });
  it("rejects normal, old, other-stage and unsupported results", () => {
    for (const [id, seed, stage, score] of [
      ["2048", "2048:v1:normal", 1, 50],
      ["2048", "2048:v1:2026-10-14", 1, 50],
      ["2048", dailySeed("2048", date), 2, 50],
      ["hextris", dailySeed("hextris", date), 1, 50],
      ["2048", dailySeed("2048", date), 1, NaN],
    ] as const)
      expect(recordDailyRound(id, 1, seed, stage, score, date)).toBe(false);
    expect(dailyRounds(date)).toEqual({});
  });
  it("rolls over at UTC midnight and validates stored records", () => {
    write("daily-rounds", {
      date: "2026-10-15",
      results: {
        "2048": { version: 1, score: 12 },
        "circuit-loop": { version: 1, score: -1 },
        "orbit-break": { version: "1", score: 10 },
        unknown: { version: 1, score: 10 },
      },
    });
    expect(dailyRounds(date)).toEqual({ "2048": { version: 1, score: 12 } });
    expect(dailyRounds(new Date("2026-10-16T00:00:00Z"))).toEqual({});
  });

  it("keeps a bounded seven-day UTC trail and drops older or future dates", () => {
    const today = new Date("2026-10-16T00:00:00Z");
    write("daily-rounds", {
      format: 2,
      days: {
        "2026-10-09": { "2048": { version: 1, score: 9 } },
        "2026-10-10": { "2048": { version: 1, score: 10 } },
        "2026-10-16": { "orbit-break": { version: 1, score: 0 } },
        "2026-10-17": { "circuit-loop": { version: 1, score: 20 } },
      },
    });
    const history = dailyHistory(today);
    expect(history.map(({ date: day }) => day)).toEqual([
      "2026-10-10",
      "2026-10-11",
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
    ]);
    expect(history[0]?.results["2048"]?.score).toBe(10);
    expect(history.at(-1)?.results["orbit-break"]?.score).toBe(0);
    expect(history.some(({ results }) => results["circuit-loop"])).toBe(false);
    expect(read("daily-rounds", undefined)).toEqual({
      format: 2,
      days: {
        "2026-10-10": { "2048": { version: 1, score: 10 } },
        "2026-10-16": { "orbit-break": { version: 1, score: 0 } },
      },
    });
  });

  it("migrates the existing one-day record when a new day is completed", () => {
    const yesterday = new Date("2026-10-15T06:00:00Z");
    const today = new Date("2026-10-16T06:00:00Z");
    write("daily-rounds", {
      date: "2026-10-15",
      results: { "circuit-loop": { version: 1, score: 15 } },
    });

    expect(dailyRounds(yesterday)["circuit-loop"]?.score).toBe(15);
    expect(
      recordDailyRound("2048", 1, dailySeed("2048", today), 1, 20, today),
    ).toBe(true);
    expect(dailyRounds(today)["2048"]?.score).toBe(20);
    expect(dailyHistory(today).at(-2)?.results["circuit-loop"]?.score).toBe(15);
  });

  it("does not rewrite canonical history on each read", () => {
    const original = Object.getOwnPropertyDescriptor(
      globalThis,
      "localStorage",
    );
    const values = new Map<string, string>();
    const setItem = vi.fn((key: string, value: string) => {
      values.set(key, value);
    });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem,
      },
    });

    try {
      values.set(
        "denny-games:v1:daily-rounds",
        JSON.stringify({
          format: 2,
          days: {
            "2026-10-15": { "2048": { version: 1, score: 50 } },
          },
        }),
      );
      dailyHistory(date);
      dailyHistory(date);
      expect(setItem).not.toHaveBeenCalled();
    } finally {
      if (original) Object.defineProperty(globalThis, "localStorage", original);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  });
});
