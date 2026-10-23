export type Direction = "up" | "down" | "left" | "right";
export interface State {
  version: 1;
  stage: number;
  x: number;
  row: number;
  time: number;
  lives: number;
  cooldown: number;
  invulnerable: number;
  hops: number;
  phase: "play" | "won" | "lost";
}
export const ROADS = [8, 7, 5],
  WATER = [3, 2];
export function fresh(stage = 1): State {
  return {
    version: 1,
    stage,
    x: 4.5,
    row: 10,
    time: 0,
    lives: 3,
    cooldown: 0,
    invulnerable: 1,
    hops: 0,
    phase: "play",
  };
}
export function speed(s: State, row: number) {
  return (row % 2 ? 1 : -1) * (0.48 + s.stage * 0.095 + (row === 7 ? 0.15 : 0));
}
export function objects(s: State, row: number) {
  const water = WATER.includes(row),
    period = water ? 5.2 : 4.4,
    width = water ? 3.65 : 1.15,
    offset =
      (((s.time * speed(s, row) + row * 0.87) % period) + period) % period;
  return Array.from({ length: 5 }, (_, i) => ({
    x: (i - 1) * period + offset,
    width,
  }));
}
function hit(s: State) {
  if (s.invulnerable > 0 || s.phase !== "play") return;
  s.lives--;
  s.x = 4.5;
  s.row = 10;
  s.cooldown = 0.2;
  s.invulnerable = 1.1;
  if (!s.lives) s.phase = "lost";
}
function inspect(s: State) {
  if (s.row === 0) {
    s.phase = "won";
    return;
  }
  if (
    ROADS.includes(s.row) &&
    objects(s, s.row).some(
      (o) => s.x + 0.25 > o.x && s.x - 0.25 < o.x + o.width,
    )
  )
    hit(s);
  if (
    WATER.includes(s.row) &&
    (!objects(s, s.row).some(
      (o) => s.x - 0.18 >= o.x && s.x + 0.18 <= o.x + o.width,
    ) ||
      s.x < 0.2 ||
      s.x > 8.8)
  )
    hit(s);
}
export function hop(s: State, d: Direction) {
  if (s.phase !== "play" || s.cooldown > 0) return;
  let x = s.x,
    row = s.row;
  if (d === "up") row--;
  else if (d === "down") row++;
  else x += d === "left" ? -1 : 1;
  if (row < 0 || row > 10 || x < 0.3 || x > 8.7) return;
  s.x = x;
  s.row = row;
  if (row < 9) s.invulnerable = 0;
  s.cooldown = 0.14;
  s.hops++;
  inspect(s);
}
export function step(s: State, dt: number) {
  if (s.phase !== "play" || !Number.isFinite(dt)) return;
  dt = Math.max(0, Math.min(0.05, dt));
  const n = Math.max(1, Math.ceil(dt / 0.01)),
    h = dt / n;
  for (let i = 0; i < n && s.phase === "play"; i++) {
    s.time += h;
    s.cooldown = Math.max(0, s.cooldown - h);
    s.invulnerable = Math.max(0, s.invulnerable - h);
    if (WATER.includes(s.row)) s.x += speed(s, s.row) * h;
    inspect(s);
  }
}
export function score(s: State) {
  return Math.max(100, 1000 + s.lives * 200 - Math.floor(s.time) * 3);
}
export function restore(raw: unknown, stage: number): State | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as State,
    num = (v: unknown, a: number, b: number) =>
      typeof v === "number" && Number.isFinite(v) && v >= a && v <= b,
    int = (v: unknown, a: number, b: number) =>
      num(v, a, b) && Number.isInteger(v);
  if (
    s.version !== 1 ||
    s.stage !== stage ||
    !int(stage, 1, 5) ||
    !num(s.x, -1, 10) ||
    !int(s.row, 0, 10) ||
    !num(s.time, 0, 1e7) ||
    !int(s.lives, 0, 3) ||
    !num(s.cooldown, 0, 0.2) ||
    !num(s.invulnerable, 0, 1.1) ||
    !int(s.hops, 0, 1e7) ||
    !["play", "won", "lost"].includes(s.phase) ||
    (s.phase === "won") !== (s.row === 0) ||
    (s.phase === "lost") !== (s.lives === 0)
  )
    return null;
  return { ...s };
}
