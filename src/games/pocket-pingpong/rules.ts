export type Shot = "drive" | "spin" | "smash";
export type Phase = "serve" | "rally" | "between" | "won" | "lost";
export interface State {
  version: 1;
  phase: Phase;
  opponent: number;
  points: number[];
  score: number;
  paddle: number;
  ai: number;
  ball: { x: number; y: number; vx: number; vy: number };
  shot: Shot;
  rally: number;
  time: number;
  flash: number;
  bounce: number;
}
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
export function create(): State {
  return {
    version: 1,
    phase: "serve",
    opponent: 0,
    points: [0, 0],
    score: 0,
    paddle: 0.5,
    ai: 0.5,
    ball: { x: 0.5, y: 1, vx: 0, vy: 0 },
    shot: "drive",
    rally: 0,
    time: 0,
    flash: 0,
    bounce: 0,
  };
}
export function serve(s: State) {
  if (s.phase === "between") {
    s.opponent++;
    s.points = [0, 0];
    s.phase = "serve";
  }
  if (s.phase !== "serve") return;
  s.rally = 0;
  s.ball = { x: s.paddle, y: 1, vx: (0.5 - s.paddle) * 0.65, vy: -0.63 };
  s.phase = "rally";
  s.bounce = 0;
}
export function point(s: State, player: boolean) {
  if (s.phase !== "rally") return;
  s.points[player ? 0 : 1]!++;
  s.score += player ? 100 : 0;
  s.flash = 0.3;
  if (s.points[0]! >= 5) s.phase = s.opponent === 2 ? "won" : "between";
  else if (s.points[1]! >= 5) s.phase = "lost";
  else s.phase = "serve";
  s.ball = { x: s.paddle, y: 1, vx: 0, vy: 0 };
}
export function step(s: State, dt: number, direction = 0) {
  dt = clamp(dt, 0, 0.04);
  s.time += dt;
  s.flash = Math.max(0, s.flash - dt);
  s.paddle = clamp(s.paddle + direction * dt * 0.9, 0.07, 0.93);
  if (s.phase !== "rally") {
    s.ball.x = s.paddle;
    return;
  }
  const b = s.ball;
  // Each opponent tracks faster, with a smaller deliberate positional error.
  const error =
    Math.sin(s.rally * 2.1 + s.opponent) * [0.17, 0.09, 0.035][s.opponent]!;
  const target = clamp(b.x + error, 0.05, 0.95);
  s.ai += clamp(
    target - s.ai,
    -dt * [0.25, 0.37, 0.49][s.opponent]!,
    dt * [0.25, 0.37, 0.49][s.opponent]!,
  );
  const previous = b.y;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  if (
    (b.vy < 0 && previous > 0.23 && b.y <= 0.23) ||
    (b.vy > 0 && previous < 0.77 && b.y >= 0.77)
  ) {
    s.bounce++;
    s.flash = 0.09;
  }
  if (b.x < 0 || b.x > 1) {
    point(s, b.vy > 0);
    return;
  }
  if (b.y <= 0) {
    if (Math.abs(b.x - s.ai) > 0.14) {
      point(s, true);
      return;
    }
    b.y = 0;
    b.vy = 0.65 + s.opponent * 0.1 + Math.min(s.rally * 0.015, 0.2);
    const aim = 0.18 + ((s.rally * 37 + s.opponent * 19) % 65) / 100;
    b.vx = (aim - b.x) * b.vy;
    s.rally++;
    s.flash = 0.15;
  } else if (b.y >= 1) {
    const tolerance = s.shot === "smash" ? 0.085 : 0.15;
    if (Math.abs(b.x - s.paddle) > tolerance) {
      point(s, false);
      return;
    }
    b.y = 1;
    b.vy = -(s.shot === "smash" ? 1.35 : s.shot === "spin" ? 0.95 : 0.72);
    const aim = clamp(
      0.5 + (b.x - s.paddle) * 3 + (s.shot === "spin" ? 0.14 : 0),
      0.08,
      0.92,
    );
    b.vx = (aim - b.x) * -b.vy;
    s.rally++;
    s.score += 5;
    s.flash = 0.2;
  }
}
export function restore(raw: unknown): State | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as State;
  const num = (x: unknown, a: number, b: number) =>
    typeof x === "number" && Number.isFinite(x) && x >= a && x <= b;
  if (
    s.version !== 1 ||
    !["serve", "rally", "between", "won", "lost"].includes(s.phase) ||
    !Number.isInteger(s.opponent) ||
    !num(s.opponent, 0, 2) ||
    !["drive", "spin", "smash"].includes(s.shot) ||
    !Array.isArray(s.points) ||
    s.points.length !== 2 ||
    s.points.some((p) => !Number.isInteger(p) || !num(p, 0, 5)) ||
    !num(s.score, 0, 1e7) ||
    !num(s.paddle, 0.07, 0.93) ||
    !num(s.ai, 0, 1) ||
    !num(s.time, 0, 1e8) ||
    !num(s.flash, 0, 0.3) ||
    !Number.isInteger(s.rally) ||
    !num(s.rally, 0, 1e6) ||
    !Number.isInteger(s.bounce) ||
    !num(s.bounce, 0, 1e6) ||
    !s.ball ||
    !num(s.ball.x, 0, 1) ||
    !num(s.ball.y, 0, 1) ||
    !num(s.ball.vx, -2, 2) ||
    !num(s.ball.vy, -2, 2)
  )
    return null;
  if (
    (s.phase === "won" && (s.opponent !== 2 || s.points[0] !== 5)) ||
    (s.phase === "lost" && s.points[1] !== 5) ||
    (s.phase === "between" && (s.opponent === 2 || s.points[0] !== 5)) ||
    (["serve", "rally"].includes(s.phase) && s.points.some((p) => p >= 5)) ||
    (s.points[0] === 5 && s.points[1] === 5) ||
    (s.phase === "rally" && s.ball.vy === 0)
  )
    return null;
  return { ...s, points: [...s.points], ball: { ...s.ball } };
}
