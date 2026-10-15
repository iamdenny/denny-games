import { dailySeed } from "./random";
import { read, write } from "./storage";

export const dailyGameIds = ["circuit-loop", "orbit-break", "2048"] as const;
export const utcDay = (date = new Date()) => date.toISOString().slice(0, 10);
type DailyRound = { version: number; score: number };
export type DailyRounds = Partial<Record<string, DailyRound>>;

export function dailyRounds(date = new Date()): DailyRounds {
  const stored = read<unknown>("daily-rounds", undefined);
  if (!stored || typeof stored !== "object") return {};
  const value = stored as { date?: unknown; results?: unknown };
  if (
    value.date !== utcDay(date) ||
    !value.results ||
    typeof value.results !== "object"
  )
    return {};
  const results: DailyRounds = {};
  for (const id of dailyGameIds) {
    const item = (value.results as Record<string, unknown>)[id];
    if (!item || typeof item !== "object") continue;
    const round = item as DailyRound;
    if (
      Number.isInteger(round.version) &&
      round.version > 0 &&
      Number.isFinite(round.score) &&
      round.score >= 0
    )
      results[id] = { version: round.version, score: round.score };
  }
  return results;
}

// A completed round, including a loss, counts. Opening or pausing never does.
export function recordDailyRound(
  id: string,
  version: number,
  seed: string,
  stage: number,
  score: number,
  date = new Date(),
): boolean {
  if (
    !dailyGameIds.some((item) => item === id) ||
    seed !== dailySeed(id, date) ||
    stage !== 1 ||
    !Number.isInteger(version) ||
    version < 1 ||
    !Number.isFinite(score) ||
    score < 0
  )
    return false;
  const results = dailyRounds(date);
  const previous = results[id];
  results[id] = {
    version,
    score: Math.max(previous?.version === version ? previous.score : 0, score),
  };
  write("daily-rounds", { date: utcDay(date), results });
  return true;
}
