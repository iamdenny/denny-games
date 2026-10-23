import { finite, record, type Input } from "./host";
export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}
export interface PopState {
  version: 1;
  stage: number;
  score: number;
  status: "playing" | "won" | "lost";
  x: number;
  lives: number;
  time: number;
  shield: number;
  cooldown: number;
  balls: Ball[];
  ropes: { x: number; y: number }[];
  burst: number;
}
export const W = 640,
  H = 440,
  FLOOR = 404;
export const arenas = [
  { balls: [2], pillars: [] },
  { balls: [2, 0], pillars: [270] },
  { balls: [1, 1], pillars: [150, 430] },
  { balls: [2, 1], pillars: [300] },
  { balls: [2, 2], pillars: [180, 420] },
  { balls: [1, 1, 1], pillars: [100, 300, 500] },
  { balls: [2, 1, 1], pillars: [220, 390] },
  { balls: [2, 2, 1], pillars: [120, 300, 480] },
];
export const radius = (size: number) => [12, 23, 38][size]!;
export function newPop(stage: number): PopState {
  stage = Math.max(1, Math.min(8, Math.floor(stage)));
  return {
    version: 1,
    stage,
    score: 0,
    status: "playing",
    x: 320,
    lives: 3,
    time: 100 + stage * 5,
    shield: 2,
    cooldown: 0,
    burst: 0,
    ropes: [],
    balls: arenas[stage - 1]!.balls.map((size, i) => ({
      x: 85 + i * 190,
      y: 100 + i * 25,
      vx: (i % 2 ? -1 : 1) * (86 + stage * 4),
      vy: -50,
      size,
    })),
  };
}
export function split(s: PopState, index: number) {
  const b = s.balls[index];
  if (!b) return;
  s.balls.splice(index, 1);
  s.score += b.size === 0 ? 150 : 50;
  s.burst = 0.3;
  if (b.size > 0) {
    const size = b.size - 1,
      r = radius(size);
    s.balls.push(
      {
        x: Math.max(r, Math.min(W - r, b.x - r / 2)),
        y: b.y,
        vx: -135 - size * 12,
        vy: -230 - size * 25,
        size,
      },
      {
        x: Math.max(r, Math.min(W - r, b.x + r / 2)),
        y: b.y,
        vx: 135 + size * 12,
        vy: -230 - size * 25,
        size,
      },
    );
  }
  if (!s.balls.length) s.status = "won";
}
export function stepPop(s: PopState, dt: number, i: Input) {
  if (s.status !== "playing") return;
  s.time = Math.max(0, s.time - dt);
  s.shield = Math.max(0, s.shield - dt);
  s.cooldown = Math.max(0, s.cooldown - dt);
  s.burst = Math.max(0, s.burst - dt);
  const dir = (i.held.has("right") ? 1 : 0) - (i.held.has("left") ? 1 : 0);
  s.x = Math.max(18, Math.min(W - 18, s.x + dir * 235 * dt));
  if (i.taps.has("left")) s.x = Math.max(18, s.x - 10);
  if (i.taps.has("right")) s.x = Math.min(W - 18, s.x + 10);
  if (
    (i.held.has("fire") || i.taps.has("fire")) &&
    s.cooldown === 0 &&
    s.ropes.length < 2
  ) {
    s.ropes.push({ x: s.x, y: FLOOR - 32 });
    s.cooldown = 0.34;
  }
  for (const b of s.balls) {
    const r = radius(b.size);
    b.vy += 420 * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.x < r) {
      b.x = r;
      b.vx = Math.abs(b.vx);
    }
    if (b.x > W - r) {
      b.x = W - r;
      b.vx = -Math.abs(b.vx);
    }
    if (b.y > FLOOR - r) {
      b.y = FLOOR - r;
      b.vy = -[205, 285, 355][b.size]!;
    }
    if (b.y < r + 30) {
      b.y = r + 30;
      b.vy = Math.abs(b.vy);
    }
    for (const px of arenas[s.stage - 1]!.pillars) {
      if (b.y + r > FLOOR - 70 && Math.abs(b.x - px) < r + 10) {
        b.x = px + (b.x < px ? -1 : 1) * (r + 10);
        b.vx = b.x < px ? -Math.abs(b.vx) : Math.abs(b.vx);
      }
    }
    if (s.shield === 0 && Math.hypot(b.x - s.x, b.y - (FLOOR - 17)) < r + 12) {
      s.lives--;
      s.shield = 2.2;
      s.x = 320;
      s.ropes = [];
      if (s.lives <= 0) s.status = "lost";
    }
  }
  for (let n = s.ropes.length - 1; n >= 0; n--) {
    const rope = s.ropes[n]!;
    rope.y -= 600 * dt;
    const idx = s.balls.findIndex(
      (b) =>
        Math.abs(b.x - rope.x) < radius(b.size) + 3 &&
        b.y + radius(b.size) >= rope.y &&
        b.y - radius(b.size) < FLOOR - 30,
    );
    if (idx >= 0) {
      split(s, idx);
      s.ropes.splice(n, 1);
    } else if (rope.y < 26) s.ropes.splice(n, 1);
  }
  if (s.time <= 0 && s.status === "playing") s.status = "lost";
}
export function restorePop(v: unknown, stage: number): PopState {
  const fresh = newPop(stage);
  if (
    !record(v) ||
    v.version !== 1 ||
    v.stage !== fresh.stage ||
    !finite(v.score, 0, 100000) ||
    !finite(v.x, 18, W - 18) ||
    !finite(v.lives, 0, 3) ||
    !Number.isInteger(v.lives) ||
    !finite(v.time, 0, 150) ||
    !finite(v.shield, 0, 3) ||
    !finite(v.cooldown, 0, 1) ||
    !finite(v.burst, 0, 1) ||
    !["playing", "won", "lost"].includes(String(v.status)) ||
    !Array.isArray(v.balls) ||
    v.balls.length > 32 ||
    !Array.isArray(v.ropes) ||
    v.ropes.length > 2
  )
    return fresh;
  if (
    !v.balls.every(
      (b) =>
        record(b) &&
        finite(b.x, 0, W) &&
        finite(b.y, 0, H) &&
        finite(b.vx, -300, 300) &&
        finite(b.vy, -500, 600) &&
        Number.isInteger(b.size) &&
        finite(b.size, 0, 2),
    ) ||
    !v.ropes.every((r) => record(r) && finite(r.x, 0, W) && finite(r.y, 0, H))
  )
    return fresh;
  if (
    (v.status === "won" && v.balls.length !== 0) ||
    (v.status === "playing" &&
      (v.balls.length === 0 || v.lives === 0 || v.time === 0))
  )
    return fresh;
  return structuredClone(v) as unknown as PopState;
}
