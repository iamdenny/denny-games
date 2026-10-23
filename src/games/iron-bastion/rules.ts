import {
  validBase,
  finite,
  type ArcadeState,
  type Mode,
  type Controls,
} from "../ember-maze/host";
export type Tank = {
  x: number;
  y: number;
  dir: number;
  hp: number;
  cool: number;
  inv: number;
};
export type Bullet = {
  x: number;
  y: number;
  dir: number;
  enemy: boolean;
  life: number;
};
export interface Bastion extends ArcadeState {
  tiles: number[];
  heroes: Tank[];
  enemies: Tank[];
  bullets: Bullet[];
  pickups: { x: number; y: number }[];
  base: number;
  spawned: number;
  spawn: number;
  destroyed: number;
}
export const COLS = 20,
  ROWS = 12,
  CELL = 36;
export const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const;
export function create(stage: number, mode: Mode): Bastion {
  const tiles = Array.from({ length: 240 }, (_, i) => {
    const x = i % 20,
      y = Math.floor(i / 20);
    if (y < 2 || y > 9 || [1, 9, 10, 18].includes(x)) return 0;
    return (x * 3 + y * 7 + stage) % 9 < 3
      ? 2
      : (x + y + stage) % 13 === 0
        ? 1
        : 0;
  });
  return {
    mode,
    time: 0,
    score: 0,
    won: false,
    lost: false,
    tiles,
    heroes: Array.from({ length: mode === "local" ? 2 : 1 }, (_, i) => ({
      x: 270 + i * 180,
      y: 378,
      dir: 0,
      hp: 3,
      cool: 0,
      inv: 1,
    })),
    enemies: [],
    bullets: [],
    pickups: [],
    base: 4,
    spawned: 0,
    spawn: 0.4,
    destroyed: 0,
  };
}
export function restore(raw: unknown, stage: number): Bastion | null {
  if (!validBase(raw)) return null;
  const s = raw as Bastion;
  if (
    !Array.isArray(s.tiles) ||
    s.tiles.length !== 240 ||
    !s.tiles.every((n) => [0, 1, 2].includes(n)) ||
    !Array.isArray(s.heroes) ||
    s.heroes.length !== (s.mode === "local" ? 2 : 1) ||
    !Array.isArray(s.enemies) ||
    s.enemies.length > 3 ||
    !Array.isArray(s.bullets) ||
    s.bullets.length > 60 ||
    !Array.isArray(s.pickups) ||
    s.pickups.length > 10 ||
    !Number.isInteger(s.base) ||
    !finite(s.base, 0, 4) ||
    !Number.isInteger(s.spawned) ||
    !finite(s.spawned, 0, 4 + stage) ||
    !finite(s.spawn, 0, 4) ||
    !Number.isInteger(s.destroyed) ||
    !finite(s.destroyed, 0, 4 + stage)
  )
    return null;
  const tank = (t: Tank) =>
    t &&
    finite(t.x, 12, 708) &&
    finite(t.y, 12, 420) &&
    [0, 1, 2, 3].includes(t.dir) &&
    Number.isInteger(t.hp) &&
    finite(t.hp, 0, 3) &&
    finite(t.cool, 0, 2) &&
    finite(t.inv, 0, 2);
  if (
    !s.heroes.every(tank) ||
    !s.enemies.every(tank) ||
    !s.bullets.every(
      (b) =>
        b &&
        finite(b.x, -10, 730) &&
        finite(b.y, -10, 442) &&
        [0, 1, 2, 3].includes(b.dir) &&
        typeof b.enemy === "boolean" &&
        finite(b.life, 0, 4),
    ) ||
    !s.pickups.every((p) => p && finite(p.x, 0, 720) && finite(p.y, 0, 432))
  )
    return null;
  return structuredClone(s);
}
const tileAt = (s: Bastion, x: number, y: number) =>
  s.tiles[Math.floor(y / CELL) * COLS + Math.floor(x / CELL)];
function canMove(s: Bastion, x: number, y: number) {
  return (
    x >= 13 &&
    x <= 707 &&
    y >= 13 &&
    y <= 419 &&
    [-11, 11].every((dx) =>
      [-11, 11].every((dy) => tileAt(s, x + dx, y + dy) === 0),
    )
  );
}
function shoot(s: Bastion, t: Tank, enemy: boolean) {
  if (t.cool || s.bullets.length >= 60) return;
  const d = directions[t.dir]!;
  s.bullets.push({
    x: t.x + d[0] * 18,
    y: t.y + d[1] * 18,
    dir: t.dir,
    enemy,
    life: 3,
  });
  t.cool = enemy ? 1.25 : 0.3;
}
function nextDir(s: Bastion, t: Tank) {
  const start = Math.floor(t.y / CELL) * 20 + Math.floor(t.x / CELL),
    target = 230;
  const queue = [target],
    dist = new Map<number, number>([[target, 0]]);
  while (queue.length) {
    const cell = queue.shift()!;
    for (const [dx, dy] of directions) {
      const x = (cell % 20) + dx,
        y = Math.floor(cell / 20) + dy,
        n = y * 20 + x;
      if (
        x < 0 ||
        x >= 20 ||
        y < 0 ||
        y >= 12 ||
        s.tiles[n] === 1 ||
        dist.has(n)
      )
        continue;
      dist.set(n, dist.get(cell)! + 1);
      queue.push(n);
    }
  }
  let best = t.dir,
    value = Infinity;
  for (let dir = 0; dir < 4; dir++) {
    const d = directions[dir]!,
      x = (start % 20) + d[0],
      y = Math.floor(start / 20) + d[1];
    if (x < 0 || x >= 20 || y < 0 || y >= 12) continue;
    const n = y * 20 + x,
      v = dist.get(n) ?? Infinity;
    if (v < value) {
      best = dir;
      value = v;
    }
  }
  return best;
}
export function step(
  s: Bastion,
  stage: number,
  dt: number,
  inputs: Controls[],
) {
  if (s.won || s.lost) return;
  s.time += dt;
  s.spawn = Math.max(0, s.spawn - dt);
  if (!s.spawn && s.spawned < 4 + stage && s.enemies.length < 3) {
    const x = [54, 378, 666][s.spawned % 3]!;
    s.enemies.push({
      x,
      y: 18,
      dir: 2,
      hp: stage >= 4 ? 2 : 1,
      cool: 1,
      inv: 0,
    });
    s.spawned++;
    s.spawn = 2.8;
  }
  s.heroes.forEach((t, i) => {
    t.cool = Math.max(0, t.cool - dt);
    t.inv = Math.max(0, t.inv - dt);
    if (!t.hp) return;
    const a = inputs[i] ?? { x: 0, y: 0, fire: false };
    if (a.x || a.y) {
      t.dir = a.x ? (a.x > 0 ? 1 : 3) : a.y > 0 ? 2 : 0;
      const d = directions[t.dir]!,
        x = t.x + d[0] * 130 * dt,
        y = t.y + d[1] * 130 * dt;
      if (canMove(s, x, y)) {
        t.x = x;
        t.y = y;
      }
    }
    if (a.fire) shoot(s, t, false);
    s.pickups = s.pickups.filter((p) => {
      if (Math.hypot(p.x - t.x, p.y - t.y) < 25) {
        t.hp = Math.min(3, t.hp + 1);
        s.base = Math.min(4, s.base + 1);
        s.score += 50;
        return false;
      }
      return true;
    });
  });
  s.enemies.forEach((t) => {
    t.cool = Math.max(0, t.cool - dt);
    const cx = Math.floor(t.x / 36) * 36 + 18,
      cy = Math.floor(t.y / 36) * 36 + 18;
    const centered = Math.abs(t.x - cx) < 3 && Math.abs(t.y - cy) < 3;
    const dir = centered ? nextDir(s, t) : t.dir,
      d = directions[dir]!;
    if (centered && dir !== t.dir) {
      t.x = cx;
      t.y = cy;
    }
    t.dir = dir;
    const x = t.x + d[0] * (48 + stage * 3) * dt,
      y = t.y + d[1] * (48 + stage * 3) * dt;
    if (canMove(s, x, y)) {
      t.x = x;
      t.y = y;
    }
    shoot(s, t, true);
  });
  for (const b of s.bullets) {
    b.life -= dt;
    const d = directions[b.dir]!;
    b.x += d[0] * (b.enemy ? 185 : 330) * dt;
    b.y += d[1] * (b.enemy ? 185 : 330) * dt;
    if (b.x < 0 || b.x >= 720 || b.y < 0 || b.y >= 432) {
      b.life = 0;
      continue;
    }
    const cell = Math.floor(b.y / 36) * 20 + Math.floor(b.x / 36);
    if (s.tiles[cell]) {
      if (s.tiles[cell] === 2) s.tiles[cell] = 0;
      b.life = 0;
      continue;
    }
    if (b.enemy && Math.hypot(b.x - 378, b.y - 414) < 22) {
      s.base = Math.max(0, s.base - 1);
      b.life = 0;
      continue;
    }
    const targets = b.enemy ? s.heroes : s.enemies;
    const target = targets.find(
      (t) => t.hp > 0 && Math.abs(t.x - b.x) < 15 && Math.abs(t.y - b.y) < 15,
    );
    if (target) {
      if (!target.inv) {
        target.hp--;
        if (b.enemy) target.inv = 1;
      }
      b.life = 0;
      if (!target.hp && !b.enemy) {
        s.destroyed++;
        s.score += 150;
        if (s.destroyed % 2 === 0) s.pickups.push({ x: target.x, y: target.y });
      }
    }
  }
  s.bullets = s.bullets.filter((b) => b.life > 0);
  s.enemies = s.enemies.filter((t) => t.hp > 0);
  s.lost = s.base === 0 || s.heroes.every((t) => t.hp === 0);
  s.won = !s.lost && s.spawned === 4 + stage && !s.enemies.length;
  if (s.won) s.score += 500;
}
