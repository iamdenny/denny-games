import { finite, record, type Input } from "../prism-pop/host";
export const COLS = 20,
  ROWS = 15,
  TILE = 28,
  VW = COLS * TILE,
  VH = ROWS * TILE;
interface Plan {
  ladders: [number[], number[], number[]];
  treasure: [number, number][];
  guards: [number, number][];
  gaps: [number, number][];
}
export const plans: Plan[] = [
  {
    ladders: [
      [4, 15],
      [7, 17],
      [3, 14],
    ],
    treasure: [
      [10, 13],
      [2, 9],
      [16, 5],
      [8, 1],
    ],
    guards: [[16, 9]],
    gaps: [],
  },
  {
    ladders: [
      [3, 16],
      [5, 13],
      [8, 17],
    ],
    treasure: [
      [16, 13],
      [9, 9],
      [2, 5],
      [14, 1],
    ],
    guards: [[15, 5]],
    gaps: [[11, 10]],
  },
  {
    ladders: [
      [6, 17],
      [3, 15],
      [5, 12],
    ],
    treasure: [
      [2, 13],
      [12, 9],
      [17, 5],
      [3, 1],
      [16, 1],
    ],
    guards: [[8, 9]],
    gaps: [[9, 6]],
  },
  {
    ladders: [
      [2, 12],
      [7, 16],
      [3, 15],
    ],
    treasure: [
      [16, 13],
      [3, 9],
      [12, 5],
      [7, 1],
      [17, 1],
    ],
    guards: [
      [17, 9],
      [7, 5],
    ],
    gaps: [[10, 10]],
  },
  {
    ladders: [
      [5, 16],
      [2, 12],
      [7, 17],
    ],
    treasure: [
      [10, 13],
      [17, 9],
      [5, 5],
      [2, 1],
      [13, 1],
    ],
    guards: [[10, 5]],
    gaps: [
      [8, 6],
      [14, 10],
    ],
  },
  {
    ladders: [
      [3, 14],
      [6, 17],
      [2, 12],
    ],
    treasure: [
      [17, 13],
      [9, 9],
      [2, 5],
      [15, 5],
      [8, 1],
    ],
    guards: [
      [12, 9],
      [17, 1],
    ],
    gaps: [[10, 6]],
  },
  {
    ladders: [
      [7, 17],
      [3, 12],
      [6, 16],
    ],
    treasure: [
      [2, 13],
      [12, 13],
      [16, 9],
      [8, 5],
      [3, 1],
      [12, 1],
    ],
    guards: [
      [3, 5],
      [15, 9],
    ],
    gaps: [
      [10, 10],
      [14, 6],
    ],
  },
  {
    ladders: [
      [2, 13],
      [7, 16],
      [4, 12],
    ],
    treasure: [
      [9, 13],
      [17, 9],
      [3, 9],
      [15, 5],
      [7, 1],
      [17, 1],
    ],
    guards: [
      [10, 9],
      [2, 5],
    ],
    gaps: [
      [5, 10],
      [9, 6],
    ],
  },
  {
    ladders: [
      [5, 17],
      [2, 11],
      [7, 15],
    ],
    treasure: [
      [13, 13],
      [7, 9],
      [16, 9],
      [3, 5],
      [12, 1],
      [2, 1],
    ],
    guards: [
      [16, 5],
      [8, 9],
    ],
    gaps: [
      [9, 10],
      [13, 6],
    ],
  },
  {
    ladders: [
      [3, 12],
      [6, 17],
      [2, 14],
    ],
    treasure: [
      [16, 13],
      [2, 9],
      [11, 9],
      [8, 5],
      [17, 5],
      [5, 1],
    ],
    guards: [
      [15, 5],
      [4, 1],
    ],
    gaps: [
      [8, 10],
      [10, 6],
    ],
  },
  {
    ladders: [
      [6, 16],
      [3, 13],
      [8, 17],
    ],
    treasure: [
      [2, 13],
      [12, 13],
      [17, 9],
      [6, 5],
      [2, 1],
      [14, 1],
    ],
    guards: [
      [16, 5],
      [3, 1],
    ],
    gaps: [
      [10, 10],
      [6, 6],
      [12, 2],
    ],
  },
  {
    ladders: [
      [2, 11, 17],
      [5, 14],
      [3, 10, 16],
    ],
    treasure: [
      [6, 13],
      [15, 13],
      [2, 9],
      [10, 9],
      [17, 5],
      [6, 5],
      [12, 1],
    ],
    guards: [
      [16, 9],
      [8, 5],
      [2, 1],
    ],
    gaps: [
      [8, 10],
      [12, 6],
      [7, 2],
    ],
  },
];
export interface Actor {
  x: number;
  y: number;
  px: number;
  py: number;
  anim: number;
  trapped: number;
  alive: boolean;
}
export interface Vault {
  version: 1;
  stage: number;
  score: number;
  status: "playing" | "won" | "lost";
  player: Actor;
  guards: Actor[];
  gold: { x: number; y: number }[];
  holes: { x: number; y: number; life: number }[];
  clock: number;
  move: number;
  guardMove: number;
  time: number;
  dig: number;
  collected: number;
  queued: string;
}
const actor = (x: number, y: number): Actor => ({
  x,
  y,
  px: x,
  py: y,
  anim: 0,
  trapped: 0,
  alive: true,
});
const mapCache = new Map<number, string[][]>();
export function mapFor(stage: number): string[][] {
  const cached = mapCache.get(stage);
  if (cached) return cached;
  const plan = plans[stage - 1]!,
    map: string[][] = Array.from({ length: ROWS }, (_, y) =>
      Array.from({ length: COLS }, (_, x) =>
        x === 0 || x === COLS - 1
          ? "X"
          : [2, 6, 10, 14].includes(y)
            ? y === 14
              ? "X"
              : "#"
            : ".",
      ),
    );
  for (let n = 0; n < 3; n++) {
    const bottom = 13 - n * 4,
      top = 9 - n * 4;
    for (const x of plan.ladders[n]!)
      for (let y = top; y <= bottom; y++) map[y]![x] = "H";
  }
  for (const [x, y] of plan.gaps) map[y]![x] = ".";
  mapCache.set(stage, map);
  return map;
}
export function newVault(stage: number): Vault {
  stage = Math.max(1, Math.min(12, Math.floor(stage)));
  const p = plans[stage - 1]!;
  return {
    version: 1,
    stage,
    score: 0,
    status: "playing",
    player: actor(1, 13),
    guards: p.guards.map(([x, y]) => actor(x, y)),
    gold: p.treasure.map(([x, y]) => ({ x, y })),
    holes: [],
    clock: 0,
    move: 0,
    guardMove: 0.65,
    time: 180,
    dig: 0,
    collected: 0,
    queued: "",
  };
}
export function tile(s: Vault, x: number, y: number) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return "X";
  if (s.holes.some((h) => h.x === x && h.y === y)) return ".";
  return mapFor(s.stage)[y]![x]!;
}
const solid = (t: string) => t === "#" || t === "X";
export function moves(s: Vault, a: { x: number; y: number }) {
  const here = tile(s, a.x, a.y),
    below = tile(s, a.x, a.y + 1);
  if (
    !solid(below) &&
    below !== "H" &&
    here !== "H" &&
    !s.holes.some((h) => h.x === a.x && h.y === a.y)
  )
    return [{ x: a.x, y: a.y + 1 }];
  const out: { x: number; y: number }[] = [];
  for (const dx of [-1, 1])
    if (!solid(tile(s, a.x + dx, a.y))) out.push({ x: a.x + dx, y: a.y });
  if (
    (here === "H" || s.holes.some((h) => h.x === a.x && h.y === a.y)) &&
    !solid(tile(s, a.x, a.y - 1))
  )
    out.push({ x: a.x, y: a.y - 1 });
  if ((here === "H" || below === "H") && !solid(below))
    out.push({ x: a.x, y: a.y + 1 });
  return out;
}
function relocate(a: Actor, p: { x: number; y: number }) {
  a.px = a.x;
  a.py = a.y;
  a.x = p.x;
  a.y = p.y;
  a.anim = 0.12;
}
export function digHole(s: Vault, dir: number) {
  if (s.dig > 0) return false;
  const x = s.player.x + dir,
    y = s.player.y + 1;
  if (tile(s, x, y) !== "#" || solid(tile(s, x, s.player.y))) return false;
  s.holes.push({ x, y, life: 4.5 });
  s.dig = 0.28;
  return true;
}
function chase(s: Vault, a: Actor) {
  const start = `${a.x},${a.y}`,
    goal = `${s.player.x},${s.player.y}`,
    queue = [
      { x: a.x, y: a.y, first: null as null | { x: number; y: number } },
    ],
    seen = new Set([start]);
  while (queue.length) {
    const n = queue.shift()!;
    for (const p of moves(s, n)) {
      const k = `${p.x},${p.y}`;
      if (seen.has(k)) continue;
      const first = n.first ?? p;
      if (k === goal) return first;
      seen.add(k);
      queue.push({ ...p, first });
    }
  }
  return null;
}
export function stepVault(s: Vault, dt: number, i: Input) {
  if (s.status !== "playing") return;
  s.clock = Math.min(180, s.clock + dt);
  s.time = Math.max(0, s.time - dt);
  s.move -= dt;
  s.guardMove -= dt;
  s.dig = Math.max(0, s.dig - dt);
  for (const a of [s.player, ...s.guards]) a.anim = Math.max(0, a.anim - dt);
  for (const h of s.holes) h.life -= dt;
  for (const a of s.guards) {
    if (!a.alive) continue;
    if (s.holes.some((h) => h.x === a.x && h.y === a.y)) {
      a.trapped = 1;
    }
    if (
      a.trapped &&
      s.holes.some((h) => h.x === a.x && h.y === a.y && h.life <= 0)
    ) {
      a.alive = false;
      s.score += 250;
    }
  }
  if (
    s.holes.some((h) => h.life <= 0 && h.x === s.player.x && h.y === s.player.y)
  )
    s.status = "lost";
  s.holes = s.holes.filter((h) => h.life > 0);
  if (i.taps.has("digLeft")) digHole(s, -1);
  if (i.taps.has("digRight") || i.taps.has("fire")) digHole(s, 1);
  for (const key of ["left", "right", "up", "down"])
    if (i.taps.has(key)) s.queued = key;
  if (s.move <= 0) {
    const options = moves(s, s.player);
    const forced =
      options.length === 1 &&
      options[0]!.y > s.player.y &&
      tile(s, s.player.x, s.player.y) !== "H" &&
      tile(s, s.player.x, s.player.y + 1) !== "H";
    let target = forced ? options[0] : undefined;
    if (!target) {
      for (const [name, dx, dy] of [
        ["left", -1, 0],
        ["right", 1, 0],
        ["up", 0, -1],
        ["down", 0, 1],
      ] as const) {
        if (i.held.has(name) || s.queued === name) {
          target = options.find(
            (p) => p.x === s.player.x + dx && p.y === s.player.y + dy,
          );
          if (target) break;
        }
      }
    }
    if (target) relocate(s.player, target);
    s.move = 0.12;
    s.queued = "";
  }
  if (s.guardMove <= 0) {
    for (const a of s.guards) {
      if (!a.alive || a.trapped) continue;
      const p = chase(s, a);
      if (p) relocate(a, p);
    }
    s.guardMove = Math.max(0.24, 0.48 - s.stage * 0.013);
  }
  const count = s.gold.length;
  s.gold = s.gold.filter((g) => g.x !== s.player.x || g.y !== s.player.y);
  s.collected += count - s.gold.length;
  s.score += (count - s.gold.length) * 300;
  if (
    s.guards.some(
      (a) => a.alive && !a.trapped && a.x === s.player.x && a.y === s.player.y,
    ) ||
    s.time <= 0
  )
    s.status = "lost";
  if (
    s.status === "playing" &&
    s.gold.length === 0 &&
    s.player.x === 18 &&
    s.player.y === 1
  ) {
    s.score += Math.floor(s.time) * 5;
    s.status = "won";
  }
}
export function reachableVault(stage: number) {
  const s = newVault(stage),
    seen = new Set<string>(["1,13"]),
    queue = [{ x: 1, y: 13 }];
  while (queue.length) {
    for (const p of moves(s, queue.shift()!)) {
      const k = `${p.x},${p.y}`;
      if (!seen.has(k)) {
        seen.add(k);
        queue.push(p);
      }
    }
  }
  return [...s.gold, { x: 18, y: 1 }].every((p) => seen.has(`${p.x},${p.y}`));
}
export function restoreVault(v: unknown, stage: number): Vault {
  const fresh = newVault(stage);
  if (
    !record(v) ||
    !["", "left", "right", "up", "down"].includes(String(v.queued)) ||
    v.version !== 1 ||
    v.stage !== fresh.stage ||
    !finite(v.score, 0, 100000) ||
    !["playing", "won", "lost"].includes(String(v.status)) ||
    !finite(v.clock, 0, 180) ||
    !finite(v.time, 0, 180) ||
    !finite(v.move, -1, 0.2) ||
    !finite(v.guardMove, -1, 1) ||
    !finite(v.dig, 0, 1) ||
    !finite(v.collected, 0, plans[fresh.stage - 1]!.treasure.length) ||
    !Number.isInteger(v.collected)
  )
    return fresh;
  const pos = (p: unknown) =>
    record(p) &&
    Number.isInteger(p.x) &&
    Number.isInteger(p.y) &&
    finite(p.x, 1, COLS - 2) &&
    finite(p.y, 0, ROWS - 2);
  const act = (a: unknown) =>
    pos(a) &&
    record(a) &&
    Number.isInteger(a.px) &&
    Number.isInteger(a.py) &&
    finite(a.px, 1, COLS - 2) &&
    finite(a.py, 0, ROWS - 2) &&
    finite(a.anim, 0, 0.13) &&
    finite(a.trapped, 0, 1) &&
    typeof a.alive === "boolean";
  if (
    !act(v.player) ||
    !Array.isArray(v.guards) ||
    v.guards.length !== fresh.guards.length ||
    !v.guards.every(act) ||
    !Array.isArray(v.gold) ||
    v.gold.length > fresh.gold.length ||
    !v.gold.every(
      (p) =>
        pos(p) &&
        record(p) &&
        fresh.gold.some((g) => g.x === p.x && g.y === p.y),
    ) ||
    !Array.isArray(v.holes) ||
    v.holes.length > 16 ||
    !v.holes.every(
      (h) =>
        pos(h) &&
        record(h) &&
        finite(h.life, 0, 4.5) &&
        mapFor(fresh.stage)[h.y as number]![h.x as number] === "#",
    )
  )
    return fresh;
  const gold = v.gold as { x: number; y: number }[],
    holes = v.holes as { x: number; y: number }[];
  if (
    new Set(gold.map((g) => `${g.x},${g.y}`)).size !== gold.length ||
    new Set(holes.map((g) => `${g.x},${g.y}`)).size !== holes.length ||
    gold.length + (v.collected as number) !== fresh.gold.length
  )
    return fresh;
  const s = structuredClone(v) as unknown as Vault;
  if (
    solid(tile(s, s.player.x, s.player.y)) ||
    (s.status === "won" &&
      (s.gold.length !== 0 || s.player.x !== 18 || s.player.y !== 1)) ||
    (s.status === "playing" && s.time === 0)
  )
    return fresh;
  return s;
}
