export interface State {
  version: 1;
  phase: "ready" | "rolling" | "falling" | "done";
  rolls: number[];
  score: number;
  aim: number;
  power: number;
  time: number;
  flight: number;
  pending: number;
  standing: number[];
  rng: number;
}
export function layout(rolls: number[]) {
  let i = 0;
  for (let f = 0; f < 9; f++) {
    if (i >= rolls.length) return { frame: f + 1, remaining: 10, done: false };
    if (rolls[i] === 10) {
      i++;
      continue;
    }
    if (i + 1 >= rolls.length)
      return { frame: f + 1, remaining: 10 - rolls[i]!, done: false };
    i += 2;
  }
  const t = rolls.slice(i);
  let remaining = 10,
    done = false;
  if (t.length === 1) remaining = t[0] === 10 ? 10 : 10 - t[0]!;
  if (t.length === 2) {
    done = t[0] !== 10 && t[0]! + t[1]! < 10;
    remaining = t[0] === 10 ? (t[1] === 10 ? 10 : 10 - t[1]!) : 10;
  }
  if (t.length === 3) done = true;
  return { frame: 10, remaining, done };
}
export function validRolls(r: number[]) {
  if (!Array.isArray(r) || r.length > 21) return false;
  const seen: number[] = [];
  for (const v of r) {
    const l = layout(seen);
    if (l.done || !Number.isInteger(v) || v < 0 || v > l.remaining)
      return false;
    seen.push(v);
  }
  return true;
}
export function score(r: number[]) {
  let total = 0,
    i = 0;
  for (let f = 0; f < 10 && i < r.length; f++) {
    if (f === 9) {
      total += r.slice(i).reduce((a, b) => a + b, 0);
      break;
    }
    if (r[i] === 10) {
      if (i + 2 >= r.length) break;
      total += 10 + r[i + 1]! + r[i + 2]!;
      i++;
    } else {
      if (i + 1 >= r.length) break;
      const n = r[i]! + r[i + 1]!;
      if (n === 10) {
        if (i + 2 >= r.length) break;
        total += 10 + r[i + 2]!;
      } else total += n;
      i += 2;
    }
  }
  return total;
}
export function create(): State {
  return {
    version: 1,
    phase: "ready",
    rolls: [],
    score: 0,
    aim: 0,
    power: 0.8,
    time: 0,
    flight: 0,
    pending: 0,
    standing: Array.from({ length: 10 }, (_, i) => i),
    rng: 7711,
  };
}
/** Visible lane conditions alternate by roll; the target is saved implicitly by the roll history. */
export function target(s: State) {
  return {
    aim: [0.2, -0.3, 0.4, -0.1][s.rolls.length % 4]!,
    power: [0.7, 0.9, 0.6, 0.8][s.rolls.length % 4]!,
  };
}
export function roll(s: State) {
  if (s.phase !== "ready") return;
  s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
  const remaining = layout(s.rolls).remaining;
  const accuracy = Math.abs(s.aim - target(s).aim),
    energy = Math.abs(s.power - target(s).power);
  s.pending = Math.min(
    remaining,
    Math.max(0, Math.floor(10.4 - accuracy * 18 - energy * 10)),
  );
  s.phase = "rolling";
  s.flight = 0;
}
export function step(s: State, dt: number) {
  if (s.phase === "done" || !Number.isFinite(dt)) return;
  dt = Math.max(0, Math.min(0.04, dt));
  s.time += dt;
  if (s.phase === "ready") return;
  s.flight += dt;
  if (s.phase === "rolling" && s.flight >= 1.2) {
    s.phase = "falling";
    s.flight = 0;
  } else if (s.phase === "falling" && s.flight >= 0.55) {
    s.rolls.push(s.pending);
    s.score = score(s.rolls);
    const l = layout(s.rolls);
    s.phase = l.done ? "done" : "ready";
    s.flight = 0;
    s.pending = 0;
    s.standing = Array.from({ length: l.remaining }, (_, i) => i);
  }
}
export function restore(raw: unknown): State | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as State;
  const n = (v: unknown, a: number, b: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= a && v <= b;
  if (
    s.version !== 1 ||
    !["ready", "rolling", "falling", "done"].includes(s.phase) ||
    !validRolls(s.rolls) ||
    s.score !== score(s.rolls) ||
    !n(s.aim, -1, 1) ||
    !n(s.power, 0.2, 1) ||
    !n(s.time, 0, 1e8) ||
    !n(s.flight, 0, 1.25) ||
    !Number.isInteger(s.pending) ||
    !n(s.pending, 0, layout(s.rolls).remaining) ||
    !Number.isInteger(s.rng) ||
    !n(s.rng, 0, 4294967295) ||
    !Array.isArray(s.standing) ||
    s.standing.length !== layout(s.rolls).remaining ||
    s.standing.some((v, i) => v !== i) ||
    ((s.phase === "ready" || s.phase === "done") &&
      (s.pending !== 0 || s.flight !== 0)) ||
    (s.phase === "rolling" && s.flight >= 1.2) ||
    (s.phase === "falling" && s.flight >= 0.55) ||
    (s.phase === "done") !== layout(s.rolls).done
  )
    return null;
  return { ...s, rolls: [...s.rolls], standing: [...s.standing] };
}
