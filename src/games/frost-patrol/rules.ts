import {
  validBase,
  finite,
  clamp,
  type ArcadeState,
  type Mode,
  type Controls,
} from "../ember-maze/host";
export type Hero = {
  x: number;
  y: number;
  vy: number;
  face: number;
  hp: number;
  inv: number;
  cool: number;
  ground: boolean;
  jump: boolean;
};
export type Enemy = {
  x: number;
  y: number;
  left: number;
  right: number;
  vx: number;
  ice: number;
  thaw: number;
  roll: number;
  alive: boolean;
};
export type Snow = { x: number; y: number; vx: number; life: number };
export interface Frost extends ArcadeState {
  heroes: Hero[];
  enemies: Enemy[];
  shots: Snow[];
}
export const platforms = (stage: number) => {
  const shift = (stage - 1) * 12;
  return [
    { x: 20, y: 465, w: 760 },
    { x: 30 + shift, y: 370, w: 260 - shift / 2 },
    { x: 440 - shift / 2, y: 370, w: 280 },
    { x: 250 - shift / 2, y: 275, w: 290 + shift },
    { x: 70 + shift / 2, y: 180, w: 230 },
    { x: 500 - shift / 2, y: 180, w: 230 },
  ];
};
export function create(stage: number, mode: Mode): Frost {
  const p = platforms(stage);
  return {
    mode,
    time: 0,
    score: 0,
    won: false,
    lost: false,
    heroes: Array.from({ length: mode === "local" ? 2 : 1 }, (_, i) => ({
      x: 350 + i * 80,
      y: 450,
      vy: 0,
      face: i ? -1 : 1,
      hp: 3,
      inv: 1,
      cool: 0,
      ground: true,
      jump: false,
    })),
    enemies: Array.from({ length: 3 + stage }, (_, i) => {
      const a = p[1 + (i % 5)]!;
      return {
        x: a.x + 40 + (i % 2) * 100,
        y: a.y - 15,
        left: a.x + 15,
        right: a.x + a.w - 15,
        vx: (i % 2 ? -1 : 1) * (36 + stage * 4),
        ice: 0,
        thaw: 0,
        roll: 0,
        alive: true,
      };
    }),
    shots: [],
  };
}
export function restore(raw: unknown, stage: number): Frost | null {
  if (!validBase(raw)) return null;
  const s = raw as Frost;
  if (
    !Array.isArray(s.heroes) ||
    s.heroes.length !== (s.mode === "local" ? 2 : 1) ||
    !Array.isArray(s.enemies) ||
    s.enemies.length !== 3 + stage ||
    !Array.isArray(s.shots) ||
    s.shots.length > 40
  )
    return null;
  if (
    !s.heroes.every(
      (h) =>
        h &&
        finite(h.x, 10, 790) &&
        finite(h.y, 0, 500) &&
        finite(h.vy, -500, 1000) &&
        [-1, 1].includes(h.face) &&
        Number.isInteger(h.hp) &&
        finite(h.hp, 0, 3) &&
        finite(h.inv, 0, 3) &&
        finite(h.cool, 0, 1) &&
        typeof h.ground === "boolean" &&
        typeof h.jump === "boolean",
    )
  )
    return null;
  if (
    !s.enemies.every(
      (e) =>
        e &&
        finite(e.x, -100, 900) &&
        finite(e.y, 0, 500) &&
        finite(e.left, 0, 800) &&
        finite(e.right, e.left, 800) &&
        finite(e.vx, -500, 500) &&
        Number.isInteger(e.ice) &&
        finite(e.ice, 0, 3) &&
        finite(e.thaw, 0, 10) &&
        finite(e.roll, 0, 5) &&
        typeof e.alive === "boolean",
    ) ||
    !s.shots.every(
      (b) =>
        b &&
        finite(b.x, -100, 900) &&
        finite(b.y, 0, 550) &&
        finite(b.vx, -500, 500) &&
        finite(b.life, 0, 2),
    )
  )
    return null;
  return structuredClone(s);
}
export function step(s: Frost, stage: number, dt: number, inputs: Controls[]) {
  if (s.won || s.lost) return;
  s.time += dt;
  s.heroes.forEach((h, i) => {
    if (!h.hp) return;
    const input = inputs[i] ?? { x: 0, y: 0, fire: false };
    h.inv = Math.max(0, h.inv - dt);
    h.cool = Math.max(0, h.cool - dt);
    if (input.x) {
      h.face = Math.sign(input.x);
      h.x = clamp(h.x + input.x * 185 * dt, 18, 782);
    }
    if (input.y < 0 && !h.jump && h.ground) {
      h.vy = -445;
      h.ground = false;
    }
    h.jump = input.y < 0;
    const old = h.y;
    h.vy += 900 * dt;
    h.y += h.vy * dt;
    h.ground = false;
    for (const p of platforms(stage))
      if (
        h.vy >= 0 &&
        h.x > p.x - 10 &&
        h.x < p.x + p.w + 10 &&
        old + 15 <= p.y + 2 &&
        h.y + 15 >= p.y
      ) {
        h.y = p.y - 15;
        h.vy = 0;
        h.ground = true;
      }
    if (input.fire && !h.cool) {
      const frozen = s.enemies.find(
        (e) =>
          e.alive &&
          e.ice === 3 &&
          !e.roll &&
          Math.abs(e.x - h.x) < 58 &&
          Math.abs(e.y - h.y) < 30,
      );
      if (frozen) {
        frozen.roll = 3.5;
        frozen.vx = h.face * 330;
        s.score += 25;
      } else if (s.shots.length < 40)
        s.shots.push({
          x: h.x + h.face * 17,
          y: h.y - 3,
          vx: h.face * 360,
          life: 1.4,
        });
      h.cool = 0.25;
    }
    for (const e of s.enemies)
      if (
        e.alive &&
        !e.roll &&
        e.ice < 3 &&
        Math.abs(h.x - e.x) < 25 &&
        Math.abs(h.y - e.y) < 25 &&
        !h.inv
      ) {
        h.hp--;
        h.inv = 1.6;
        h.x = clamp(h.x - h.face * 35, 18, 782);
      }
  });
  for (const shot of s.shots) {
    shot.x += shot.vx * dt;
    shot.life -= dt;
    const e = s.enemies.find(
      (e) =>
        e.alive &&
        !e.roll &&
        e.ice < 3 &&
        Math.abs(e.x - shot.x) < 24 &&
        Math.abs(e.y - shot.y) < 22,
    );
    if (e) {
      e.ice++;
      e.thaw = 5;
      shot.life = 0;
      s.score += 10;
    }
  }
  s.shots = s.shots.filter((b) => b.life > 0 && b.x > 0 && b.x < 800);
  for (const e of s.enemies) {
    if (!e.alive) continue;
    if (e.roll) {
      e.roll = Math.max(0, e.roll - dt);
      e.x += e.vx * dt;
      if (e.x < 18 || e.x > 782) e.vx = -e.vx;
      e.x = clamp(e.x, 18, 782);
      for (const other of s.enemies)
        if (
          other !== e &&
          other.alive &&
          Math.abs(other.x - e.x) < 32 &&
          Math.abs(other.y - e.y) < 32
        ) {
          other.alive = false;
          s.score += 150;
        }
      if (!e.roll) {
        e.alive = false;
        s.score += 100;
      }
    } else {
      e.thaw = Math.max(0, e.thaw - dt);
      if (!e.thaw) e.ice = 0;
      if (e.ice < 3) {
        e.x += (e.vx * dt) / (1 + e.ice);
        if (e.x < e.left || e.x > e.right) {
          e.vx = -e.vx;
          e.x = clamp(e.x, e.left, e.right);
        }
      }
    }
  }
  s.lost = s.heroes.every((h) => h.hp === 0) || s.time >= 180;
  s.won = !s.lost && s.enemies.every((e) => !e.alive);
  if (s.won) s.score += 500;
}
