import { dailySeed } from "./random";
import { read, write } from "./storage";
import type { Locale } from "./types";

export const dailyGameIds = ["circuit-loop", "orbit-break", "2048"] as const;
export const dailyHistoryDays = 7;
export const utcDay = (date = new Date()) => date.toISOString().slice(0, 10);
export const dailyPlayHref = (locale: Locale, id: string) =>
  `/${locale}/play/${id}/?daily=1&stage=1`;
type DailyRound = { version: number; score: number };
export type DailyRounds = Partial<Record<string, DailyRound>>;

export type DailyHistoryDay = { date: string; results: DailyRounds };
type StoredDailyHistory = { format: 2; days: Record<string, DailyRounds> };

function recentUtcDates(date: Date): string[] {
  const end = Date.parse(`${utcDay(date)}T00:00:00.000Z`);
  return Array.from({ length: dailyHistoryDays }, (_, index) =>
    new Date(end - (dailyHistoryDays - index - 1) * 86_400_000)
      .toISOString()
      .slice(0, 10),
  );
}

function validRounds(value: unknown): DailyRounds {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const results: DailyRounds = {};
  for (const id of dailyGameIds) {
    const item = (value as Record<string, unknown>)[id];
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
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

function serializeHistory(
  history: Map<string, DailyRounds>,
  date: Date,
): StoredDailyHistory {
  const days: Record<string, DailyRounds> = {};
  for (const day of recentUtcDates(date)) {
    const rounds = history.get(day);
    if (rounds && Object.keys(rounds).length > 0) days[day] = rounds;
  }
  return { format: 2, days };
}

function storedHistory(date: Date): Map<string, DailyRounds> {
  const stored = read<unknown>("daily-rounds", undefined);
  const history = new Map<string, DailyRounds>();
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    const value = stored as {
      date?: unknown;
      results?: unknown;
      days?: unknown;
    };
    const dates = recentUtcDates(date);
    const allowed = new Set(dates);
    if (
      value.days &&
      typeof value.days === "object" &&
      !Array.isArray(value.days)
    ) {
      const days = value.days as Record<string, unknown>;
      for (const day of dates) {
        if (Object.hasOwn(days, day)) history.set(day, validRounds(days[day]));
      }
    } else if (typeof value.date === "string" && allowed.has(value.date)) {
      // Read the original one-day record so existing players keep their history.
      history.set(value.date, validRounds(value.results));
    }
  }
  if (stored !== undefined) {
    const canonical = serializeHistory(history, date);
    if (JSON.stringify(stored) !== JSON.stringify(canonical))
      write("daily-rounds", canonical);
  }
  return history;
}

export function dailyHistory(date = new Date()): DailyHistoryDay[] {
  const history = storedHistory(date);
  return recentUtcDates(date).map((day) => ({
    date: day,
    results: history.get(day) ?? {},
  }));
}

export function dailyRounds(date = new Date()): DailyRounds {
  return dailyHistory(date).at(-1)?.results ?? {};
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
  const history = storedHistory(date);
  const results = history.get(utcDay(date)) ?? {};
  const previous = results[id];
  results[id] = {
    version,
    score: Math.max(previous?.version === version ? previous.score : 0, score),
  };
  history.set(utcDay(date), results);
  write("daily-rounds", serializeHistory(history, date));
  return true;
}
