import {
  finite,
  validBase,
  type ArcadeState,
  type Mode,
  type Controls,
} from "./host";
export type Actor = {
  x: number;
  y: number;
  alive: boolean;
  cool: number;
  range: number;
  capacity: number;
  drop: number;
};
export type Bomb = {
  x: number;
  y: number;
  t: number;
  owner: number;
  range: number;
};
export type Flame = { x: number; y: number; t: number };
export interface Maze extends ArcadeState {
  tiles: number[];
  actors: Actor[];
  bombs: Bomb[];
  flames: Flame[];
  winner: number;
}
export const W = 15,
  H = 11;
const idx = (x: number, y: number) => y * W + x;
export function create(stage: number, mode: Mode): Maze {
  const tiles = Array.from({ length: W * H }, (_, i) => {
    const x = i % W,
      y = Math.floor(i / W);
    return !x ||
      !y ||
      x === W - 1 ||
      y === H - 1 ||
      (x % 2 === 0 && y % 2 === 0)
      ? 1
      : (x * 7 + y * 11 + stage * 3) % 5 < 3
        ? 2
        : 0;
  });
  const points =
    mode === "local"
      ? [
          [1, 1],
          [13, 9],
        ]
      : [[1, 1], [13, 9], [13, 1], ...(stage > 2 ? [[1, 9]] : [])];
  for (const [x, y] of points)
    for (let dx = -3; dx <= 3; dx++)
      for (let dy = -3; dy <= 3; dy++) {
        if (Math.abs(dx) + Math.abs(dy) > 3) continue;
        const xx = x! + dx,
          yy = y! + dy;
        if (xx < 1 || xx > 13 || yy < 1 || yy > 9) continue;
        const at = idx(xx, yy);
        if (tiles[at] !== 1) tiles[at] = 0;
      }
  return {
    mode,
    time: 0,
    score: 0,
    won: false,
    lost: false,
    tiles,
    actors: points.map(([x, y]) => ({
      x: x!,
      y: y!,
      alive: true,
      cool: 0,
      range: 2,
      capacity: 1,
      drop: 0,
    })),
    bombs: [],
    flames: [],
    winner: -1,
  };
}
export function restore(raw: unknown, stage: number): Maze | null {
  if (!validBase(raw)) return null;
  const s = raw as Maze;
  if (
    !Array.isArray(s.tiles) ||
    s.tiles.length !== W * H ||
    !s.tiles.every((n) => Number.isInteger(n) && n >= 0 && n <= 4) ||
    !Array.isArray(s.actors) ||
    s.actors.length !== (s.mode === "local" ? 2 : stage > 2 ? 4 : 3) ||
    !Array.isArray(s.bombs) ||
    s.bombs.length > 24 ||
    !Array.isArray(s.flames) ||
    s.flames.length > 400 ||
    !finite(s.winner, -1, 3)
  )
    return null;
  if (
    !s.actors.every(
      (a) =>
        a &&
        Number.isInteger(a.x) &&
        finite(a.x, 1, 13) &&
        Number.isInteger(a.y) &&
        finite(a.y, 1, 9) &&
        typeof a.alive === "boolean" &&
        finite(a.cool, 0, 1) &&
        finite(a.range, 2, 5) &&
        finite(a.capacity, 1, 3) &&
        finite(a.drop, 0, 2),
    )
  )
    return null;
  if (
    !s.bombs.every(
      (b) =>
        b &&
        Number.isInteger(b.x) &&
        finite(b.x, 1, 13) &&
        Number.isInteger(b.y) &&
        finite(b.y, 1, 9) &&
        finite(b.t, 0, 3) &&
        Number.isInteger(b.owner) &&
        finite(b.owner, 0, s.actors.length - 1) &&
        finite(b.range, 2, 5),
    ) ||
    !s.flames.every(
      (f) =>
        f &&
        Number.isInteger(f.x) &&
        finite(f.x, 0, 14) &&
        Number.isInteger(f.y) &&
        finite(f.y, 0, 10) &&
        finite(f.t, 0, 1),
    )
  )
    return null;
  return structuredClone(s);
}
function plant(s: Maze, n: number) {
  const a = s.actors[n]!;
  if (
    a.drop > 0 ||
    s.bombs.some((b) => b.x === a.x && b.y === a.y) ||
    s.bombs.filter((b) => b.owner === n).length >= a.capacity
  )
    return;
  s.bombs.push({ x: a.x, y: a.y, t: 2.1, owner: n, range: a.range });
  a.drop = 0.5;
}
export function explode(s: Maze, b: Bomb) {
  const hit = (x: number, y: number) => {
    s.flames.push({ x, y, t: 0.4 });
    for (const other of s.bombs)
      if (other.x === x && other.y === y) other.t = 0;
  };
  hit(b.x, b.y);
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])
    for (let k = 1; k <= b.range; k++) {
      const x = b.x + dx! * k,
        y = b.y + dy! * k;
      const tile = s.tiles[idx(x, y)];
      if (tile === undefined || tile === 1) break;
      hit(x, y);
      if (tile === 2) {
        s.tiles[idx(x, y)] =
          (x + y) % 4 === 0 ? 3 : (x * 3 + y) % 5 === 0 ? 4 : 0;
        s.score += 10;
        break;
      }
    }
}
export function step(s: Maze, stage: number, dt: number, inputs: Controls[]) {
  if (s.won || s.lost) return;
  s.time += dt;
  s.flames = s.flames
    .map((f) => ({ ...f, t: f.t - dt }))
    .filter((f) => f.t > 0);
  s.bombs.forEach((b) => (b.t -= dt));
  let ready = s.bombs.find((b) => b.t <= 0);
  while (ready) {
    s.bombs.splice(s.bombs.indexOf(ready), 1);
    explode(s, ready);
    ready = s.bombs.find((b) => b.t <= 0);
  }
  s.actors.forEach((a, n) => {
    if (!a.alive) return;
    a.cool = Math.max(0, a.cool - dt);
    a.drop = Math.max(0, a.drop - dt);
    let input = inputs[n] ?? { x: 0, y: 0, fire: false };
    if (s.mode === "solo" && n > 0) {
      const dirs = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
      const phase = Math.floor(s.time * 3 + n * 7 + stage);
      let d = dirs[phase % 4]!;
      const options = dirs.filter(
        ([dx, dy]) =>
          s.tiles[idx(a.x + dx!, a.y + dy!)] === 0 &&
          !s.bombs.some((b) => b.x === a.x + dx! && b.y === a.y + dy!),
      );
      const danger = (x: number, y: number) =>
        s.bombs.reduce(
          (v, b) =>
            v +
            ((b.x === x && Math.abs(b.y - y) <= b.range) ||
            (b.y === y && Math.abs(b.x - x) <= b.range)
              ? 1
              : 0),
          0,
        );
      if (options.length)
        d = options.sort(
          (l, r) =>
            danger(a.x + l[0]!, a.y + l[1]!) - danger(a.x + r[0]!, a.y + r[1]!),
        )[phase % options.length]!;
      input = {
        x: d[0]!,
        y: d[1]!,
        fire:
          Math.floor(s.time * 2 + n) % 9 === 0 &&
          s.bombs.every((b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y) > 2),
      };
    }
    if (input.fire) plant(s, n);
    if (!a.cool && (input.x || input.y)) {
      const x = a.x + Math.sign(input.x),
        y = a.y + (input.x ? 0 : Math.sign(input.y));
      const tile = s.tiles[idx(x, y)];
      if (
        tile !== undefined &&
        tile !== 1 &&
        tile !== 2 &&
        !s.bombs.some((b) => b.x === x && b.y === y)
      ) {
        a.x = x;
        a.y = y;
        if (tile === 3) {
          a.range = Math.min(5, a.range + 1);
          s.tiles[idx(x, y)] = 0;
          s.score += 25;
        }
        if (tile === 4) {
          a.capacity = Math.min(3, a.capacity + 1);
          s.tiles[idx(x, y)] = 0;
          s.score += 25;
        }
      }
      a.cool = n > 0 && s.mode === "solo" ? 0.24 : 0.14;
    }
    if (s.flames.some((f) => f.x === a.x && f.y === a.y)) {
      a.alive = false;
      if (n > 0) s.score += 100;
    }
  });
  const alive = s.actors.filter((a) => a.alive);
  if (s.mode === "local" && alive.length <= 1) {
    s.winner = s.actors.findIndex((a) => a.alive);
    s.won = s.winner >= 0;
    s.lost = !s.won;
  } else if (s.mode === "solo") {
    s.lost = !s.actors[0]!.alive;
    s.won = !s.lost && s.actors.slice(1).every((a) => !a.alive);
    if (s.won) s.score += 500;
  }
  if (s.time >= 180 && !s.won) s.lost = true;
}
