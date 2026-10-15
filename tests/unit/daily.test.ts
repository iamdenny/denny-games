import { beforeEach, describe, expect, it } from "vitest";
import { dailyRounds, recordDailyRound } from "../../src/lib/daily";
import { dailySeed } from "../../src/lib/random";
import { write } from "../../src/lib/storage";
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
});
