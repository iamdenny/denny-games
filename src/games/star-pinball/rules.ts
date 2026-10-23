export const GOAL = 1500;
export const BUMPERS = [
  { x: 130, y: 180 },
  { x: 270, y: 180 },
  { x: 200, y: 280 },
];
export interface State {
  version: 1;
  phase: "ready" | "playing" | "won" | "lost";
  number: number;
  score: number;
  time: number;
  rng: number;
  ball: { x: number; y: number; vx: number; vy: number };
  left: number;
  right: number;
  targets: boolean[];
  cooldown: number[];
  hits: number;
  lane: boolean;
}
export const clamp = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, n));
export function create(): State {
  return {
    version: 1,
    phase: "ready",
    number: 1,
    score: 0,
    time: 0,
    rng: 71837,
    ball: { x: 348, y: 550, vx: 0, vy: 0 },
    left: 0,
    right: 0,
    targets: [false, false, false],
    cooldown: [0, 0, 0, 0, 0, 0],
    hits: 0,
    lane: false,
  };
}
export function launch(s: State) {
  if (s.phase !== "ready") return;
  s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
  s.ball = { x: 348, y: 550, vx: -100 - (s.rng % 55), vy: -780 };
  s.phase = "playing";
  s.lane = true;
}
function collide(
  s: State,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  r: number,
  kick = 0,
) {
  const b = s.ball,
    dx = bx - ax,
    dy = by - ay,
    t = clamp(
      ((b.x - ax) * dx + (b.y - ay) * dy) / (dx * dx + dy * dy || 1),
      0,
      1,
    ),
    x = ax + t * dx,
    y = ay + t * dy;
  let nx = b.x - x,
    ny = b.y - y;
  const d = Math.hypot(nx, ny);
  if (d >= r) return false;
  nx = d ? nx / d : 0;
  ny = d ? ny / d : -1;
  b.x = x + nx * (r + 0.1);
  b.y = y + ny * (r + 0.1);
  const dot = b.vx * nx + b.vy * ny;
  if (dot < 0) {
    b.vx -= 1.8 * dot * nx;
    b.vy -= 1.8 * dot * ny;
    if (kick) {
      b.vy = -kick;
      b.vx = (200 - b.x) * 2.4;
    }
    return true;
  }
  return false;
}
export function step(s: State, dt: number, left = false, right = false) {
  if (s.phase === "won" || s.phase === "lost") return;
  if (!Number.isFinite(dt)) return;
  dt = clamp(dt, 0, 0.04);
  const n = Math.max(1, Math.ceil(dt / 0.004)),
    h = dt / n;
  for (let j = 0; j < n; j++) {
    s.time += h;
    s.left = clamp(s.left + (left ? 1 : -1) * h * 13, 0, 1);
    s.right = clamp(s.right + (right ? 1 : -1) * h * 13, 0, 1);
    s.cooldown = s.cooldown.map((v) => Math.max(0, v - h));
    if (s.phase !== "playing") continue;
    const b = s.ball;
    b.vy += 400 * h;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed > 850) {
      b.vx *= 850 / speed;
      b.vy *= 850 / speed;
    }
    b.x += b.vx * h;
    b.y += b.vy * h;
    if (b.x < 28) {
      b.x = 28;
      b.vx = Math.abs(b.vx) * 0.9;
    }
    if (b.x > 372) {
      b.x = 372;
      b.vx = -Math.abs(b.vx) * 0.9;
    }
    if (b.y < 45) {
      b.y = 45;
      b.vy = Math.abs(b.vy) * 0.9;
    }
    if (s.lane && b.y < 350) s.lane = false;
    BUMPERS.forEach((p, i) => {
      if (collide(s, p.x, p.y, p.x, p.y, 33) && s.cooldown[i] === 0) {
        s.score += 100;
        s.hits++;
        s.cooldown[i] = 0.2;
        const dx = b.x - p.x,
          dy = b.y - p.y,
          d = Math.hypot(dx, dy) || 1;
        b.vx = (dx / d) * 420;
        b.vy = (dy / d) * 420;
      }
    });
    for (let i = 0; i < 3; i++) {
      const x = 105 + i * 95;
      if (collide(s, x - 23, 75, x + 23, 75, 13) && s.cooldown[i + 3] === 0) {
        s.targets[i] = true;
        s.score += 200;
        s.hits++;
        s.cooldown[i + 3] = 0.3;
        if (s.targets.every(Boolean)) {
          s.score += 500;
          s.targets = [false, false, false];
        }
      }
    }
    if (!s.lane) {
      collide(s, 28, 390, 100, 528, 15);
      collide(s, 372, 390, 300, 528, 15);
      collide(
        s,
        100,
        535,
        175,
        565 - s.left * 65,
        18,
        s.left > 0.25 && left ? 650 : 0,
      );
      collide(
        s,
        300,
        535,
        225,
        565 - s.right * 65,
        18,
        s.right > 0.25 && right ? 650 : 0,
      );
    }
    if (b.y > 630) {
      if (s.number === 3) {
        s.phase = s.score >= GOAL ? "won" : "lost";
        b.y = 630;
        b.vx = b.vy = 0;
      } else {
        s.number++;
        s.phase = "ready";
        s.ball = { x: 348, y: 550, vx: 0, vy: 0 };
      }
      break;
    }
  }
}
export function restore(raw: unknown): State | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as State;
  const num = (v: unknown, a: number, b: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= a && v <= b;
  if (
    typeof s.lane !== "boolean" ||
    s.version !== 1 ||
    !["ready", "playing", "won", "lost"].includes(s.phase) ||
    !Number.isInteger(s.number) ||
    !num(s.number, 1, 3) ||
    !Number.isInteger(s.score) ||
    !num(s.score, 0, 1e9) ||
    !num(s.time, 0, 1e8) ||
    !Number.isInteger(s.rng) ||
    !num(s.rng, 0, 4294967295) ||
    !num(s.left, 0, 1) ||
    !num(s.right, 0, 1) ||
    !Number.isInteger(s.hits) ||
    !num(s.hits, 0, 1e8) ||
    !Array.isArray(s.targets) ||
    s.targets.length !== 3 ||
    s.targets.some((x) => typeof x !== "boolean") ||
    !Array.isArray(s.cooldown) ||
    s.cooldown.length !== 6 ||
    s.cooldown.some((x) => !num(x, 0, 0.3)) ||
    !s.ball ||
    !num(s.ball.x, 0, 400) ||
    !num(s.ball.y, 0, 630) ||
    !num(s.ball.vx, -900, 900) ||
    !num(s.ball.vy, -900, 900)
  )
    return null;
  if (
    (s.phase === "won" && (s.number !== 3 || s.score < GOAL)) ||
    (s.phase === "lost" && (s.number !== 3 || s.score >= GOAL)) ||
    (s.phase === "ready" &&
      (s.ball.x !== 348 ||
        s.ball.y !== 550 ||
        s.ball.vx !== 0 ||
        s.ball.vy !== 0)) ||
    (["won", "lost"].includes(s.phase) &&
      (s.ball.y !== 630 || s.ball.vx !== 0 || s.ball.vy !== 0))
  )
    return null;
  return {
    ...s,
    ball: { ...s.ball },
    targets: [...s.targets],
    cooldown: [...s.cooldown],
  };
}
