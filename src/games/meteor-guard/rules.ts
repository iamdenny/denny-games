export interface State {
  version: 1;
  phase: "playing" | "won" | "lost";
  wave: number;
  elapsed: number;
  time: number;
  spawn: number;
  cooldown: number;
  score: number;
  rng: number;
  cities: boolean[];
  aim: { x: number; y: number };
  meteors: { x: number; y: number; target: number; speed: number }[];
  shots: { x: number; y: number; tx: number; ty: number }[];
  blasts: { x: number; y: number; age: number }[];
}
export function create(): State {
  return {
    version: 1,
    phase: "playing",
    wave: 1,
    elapsed: 0,
    time: 0,
    spawn: 1,
    cooldown: 0,
    score: 0,
    rng: 1107,
    cities: [true, true, true],
    aim: { x: 200, y: 200 },
    meteors: [],
    shots: [],
    blasts: [],
  };
}
export function fire(s: State, x = s.aim.x, y = s.aim.y) {
  if (
    s.phase !== "playing" ||
    s.cooldown > 0 ||
    s.shots.length >= 16 ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  )
    return;
  s.aim = {
    x: Math.max(20, Math.min(380, x)),
    y: Math.max(35, Math.min(440, y)),
  };
  s.shots.push({ x: 200, y: 480, tx: s.aim.x, ty: s.aim.y });
  s.cooldown = 0.32;
}
export function step(s: State, dt: number) {
  if (s.phase !== "playing" || !Number.isFinite(dt)) return;
  dt = Math.max(0, Math.min(0.04, dt));
  s.time += dt;
  s.elapsed = Math.min(20, s.elapsed + dt);
  s.cooldown = Math.max(0, s.cooldown - dt);
  s.spawn -= dt;
  if (s.elapsed < 20 && s.spawn <= 0 && s.meteors.length < 32) {
    s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
    s.meteors.push({
      x: 25 + (s.rng % 350),
      y: 0,
      target: s.rng % 3,
      speed: 25 + s.wave * 5,
    });
    s.spawn = 1.65 - s.wave * 0.12;
  }
  s.shots = s.shots.filter((p) => {
    const d = Math.hypot(p.tx - p.x, p.ty - p.y),
      move = 410 * dt;
    if (d <= move) {
      if (s.blasts.length < 24) s.blasts.push({ x: p.tx, y: p.ty, age: 0 });
      return false;
    }
    p.x += ((p.tx - p.x) / d) * move;
    p.y += ((p.ty - p.y) / d) * move;
    return true;
  });
  s.blasts = s.blasts.filter((b) => {
    b.age += dt;
    return b.age < 1.35;
  });
  s.meteors = s.meteors.filter((m) => {
    const dx = [80, 200, 320][m.target]! - m.x,
      dy = 480 - m.y,
      d = Math.hypot(dx, dy);
    if (d <= m.speed * dt || m.y >= 475) {
      s.cities[m.target] = false;
      return false;
    }
    m.x += (dx / d) * m.speed * dt;
    m.y += (dy / d) * m.speed * dt;
    if (
      s.blasts.some(
        (b) => Math.hypot(m.x - b.x, m.y - b.y) < Math.min(52, b.age * 150),
      )
    ) {
      s.score += 100;
      return false;
    }
    if (m.y >= 475) {
      s.cities[m.target] = false;
      return false;
    }
    return true;
  });
  if (!s.cities.some(Boolean)) {
    s.phase = "lost";
    return;
  }
  if (
    s.elapsed === 20 &&
    s.meteors.length === 0 &&
    s.shots.length === 0 &&
    s.blasts.length === 0
  ) {
    if (s.wave === 5) s.phase = "won";
    else {
      s.wave++;
      s.elapsed = 0;
      s.spawn = 1;
      s.score += 250;
    }
  }
}
export function restore(raw: unknown): State | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as State,
    n = (v: unknown, a: number, b: number) =>
      typeof v === "number" && Number.isFinite(v) && v >= a && v <= b;
  if (
    s.version !== 1 ||
    !["playing", "won", "lost"].includes(s.phase) ||
    !Number.isInteger(s.wave) ||
    !n(s.wave, 1, 5) ||
    !n(s.elapsed, 0, 20) ||
    !n(s.time, 0, 1e8) ||
    s.time + 1e-6 < (s.wave - 1) * 20 + s.elapsed ||
    !n(s.spawn, -1e8, 2) ||
    !n(s.cooldown, 0, 0.32) ||
    !Number.isInteger(s.score) ||
    !n(s.score, 0, 1e8) ||
    !Number.isInteger(s.rng) ||
    !n(s.rng, 0, 4294967295) ||
    !Array.isArray(s.cities) ||
    s.cities.length !== 3 ||
    s.cities.some((v) => typeof v !== "boolean") ||
    !s.aim ||
    !n(s.aim.x, 20, 380) ||
    !n(s.aim.y, 35, 440) ||
    !Array.isArray(s.meteors) ||
    s.meteors.length > 32 ||
    s.meteors.some(
      (m) =>
        !m ||
        !n(m.x, 0, 400) ||
        !n(m.y, 0, 480) ||
        !Number.isInteger(m.target) ||
        !n(m.target, 0, 2) ||
        !n(m.speed, 30, 50),
    ) ||
    !Array.isArray(s.shots) ||
    s.shots.length > 16 ||
    s.shots.some(
      (p) =>
        !p ||
        !n(p.x, 0, 400) ||
        !n(p.y, 0, 480) ||
        !n(p.tx, 20, 380) ||
        !n(p.ty, 35, 440),
    ) ||
    !Array.isArray(s.blasts) ||
    s.blasts.length > 24 ||
    s.blasts.some(
      (b) => !b || !n(b.x, 20, 380) || !n(b.y, 35, 440) || !n(b.age, 0, 1.35),
    ) ||
    (s.phase === "lost") === s.cities.some(Boolean) ||
    (s.phase === "won" &&
      (s.wave !== 5 ||
        s.elapsed !== 20 ||
        s.meteors.length + s.shots.length + s.blasts.length > 0))
  )
    return null;
  return {
    ...s,
    cities: [...s.cities],
    aim: { ...s.aim },
    meteors: s.meteors.map((m) => ({ ...m })),
    shots: s.shots.map((p) => ({ ...p })),
    blasts: s.blasts.map((b) => ({ ...b })),
  };
}
