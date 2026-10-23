import {
  validBase,
  finite,
  clamp,
  type ArcadeState,
  type Mode,
  type Controls,
} from "../ember-maze/host";
export interface Duel extends ArcadeState {
  terrain: number[];
  hp: number[];
  turn: number;
  angle: number;
  power: number;
  wind: number;
  shot: { x: number; y: number; vx: number; vy: number } | null;
  wait: number;
  fired: boolean;
  round: number;
  blast: { x: number; y: number; t: number } | null;
  winner: number;
}
export const ground = (s: Duel, x: number) =>
  s.terrain[clamp(Math.round(x / 10), 0, 80)]!;
export function create(stage: number, mode: Mode): Duel {
  return {
    mode,
    time: 0,
    score: 0,
    won: false,
    lost: false,
    terrain: Array.from({ length: 81 }, (_, i) =>
      clamp(
        390 +
          Math.sin(i * 0.11 + stage) * 35 +
          Math.sin(i * 0.3 + stage) * 15 -
          (stage % 3 === 0 ? Math.max(0, 70 - Math.abs(i - 40) * 3) : 0),
        275,
        450,
      ),
    ),
    hp: [100, 100],
    turn: 0,
    angle: 45,
    power: 390,
    wind: ((stage % 5) - 2) * 12,
    shot: null,
    wait: 0.3,
    fired: false,
    round: 1,
    blast: null,
    winner: -1,
  };
}
export function restore(raw: unknown, _stage: number): Duel | null {
  if (!validBase(raw)) return null;
  const s = raw as Duel;
  if (
    !Array.isArray(s.terrain) ||
    s.terrain.length !== 81 ||
    !s.terrain.every((y) => finite(y, 250, 490)) ||
    !Array.isArray(s.hp) ||
    s.hp.length !== 2 ||
    !s.hp.every((h) => finite(h, 0, 100)) ||
    ![0, 1].includes(s.turn) ||
    !finite(s.angle, 15, 85) ||
    !finite(s.power, 200, 500) ||
    !finite(s.wind, -24, 24) ||
    !finite(s.wait, 0, 3) ||
    typeof s.fired !== "boolean" ||
    !Number.isInteger(s.round) ||
    !finite(s.round, 1, 10000) ||
    ![-1, 0, 1].includes(s.winner)
  )
    return null;
  if (
    s.shot !== null &&
    (!s.shot ||
      !finite(s.shot.x, -20, 820) ||
      !finite(s.shot.y, -1500, 550) ||
      !finite(s.shot.vx, -1000, 1000) ||
      !finite(s.shot.vy, -1000, 1000))
  )
    return null;
  if (
    s.blast !== null &&
    (!s.blast ||
      !finite(s.blast.x, 0, 800) ||
      !finite(s.blast.y, -50, 550) ||
      !finite(s.blast.t, 0, 1))
  )
    return null;
  return structuredClone(s);
}
export function fire(s: Duel) {
  if (s.shot || s.wait > 0 || s.won || s.lost) return;
  const x = s.turn ? 680 : 120,
    sign = s.turn ? -1 : 1,
    rad = (s.angle * Math.PI) / 180;
  s.shot = {
    x: x + sign * 22 * Math.cos(rad),
    y: ground(s, x) - 19 - 22 * Math.sin(rad),
    vx: sign * Math.cos(rad) * s.power,
    vy: -Math.sin(rad) * s.power,
  };
  s.fired = true;
}
export function impact(s: Duel, x: number, y: number) {
  const positions = [120, 680];
  positions.forEach((tx, i) => {
    const distance = Math.hypot(tx - x, ground(s, tx) - 12 - y);
    const damage = Math.max(0, Math.round(65 * (1 - distance / 85)));
    s.hp[i] = Math.max(0, s.hp[i]! - damage);
    if (i !== s.turn) s.score += damage * 5;
  });
  s.terrain = s.terrain.map((height, i) => {
    const d = Math.abs(i * 10 - x);
    return d < 55
      ? Math.min(490, Math.max(height, y + Math.sqrt(55 * 55 - d * d)))
      : height;
  });
  s.blast = { x, y, t: 0.7 };
  s.shot = null;
  s.wait = 0.8;
  if (s.hp[0] === 0 || s.hp[1] === 0) {
    s.winner = s.hp[0] === 0 ? 1 : 0;
    s.won = s.mode === "local" || s.winner === 0;
    s.lost = !s.won;
  } else {
    s.turn = 1 - s.turn;
    s.round++;
    s.angle = 45;
    s.power = 390;
  }
}
function chooseAI(s: Duel) {
  let best = Infinity,
    angle = 45,
    power = 390;
  for (let a = 25; a <= 75; a += 5)
    for (let p = 260; p <= 500; p += 20) {
      let x = 680,
        y = ground(s, 680) - 25,
        vx = -Math.cos((a * Math.PI) / 180) * p,
        vy = -Math.sin((a * Math.PI) / 180) * p;
      for (let i = 0; i < 400; i++) {
        x += vx * 0.02;
        y += vy * 0.02;
        vx += s.wind * 0.02;
        vy += 230 * 0.02;
        if (x < 0 || x > 800 || y >= ground(s, x)) {
          const error = Math.abs(x - 120);
          if (error < best) {
            best = error;
            angle = a;
            power = p;
          }
          break;
        }
      }
    }
  s.angle = angle;
  s.power = power;
}
export function step(s: Duel, _stage: number, dt: number, inputs: Controls[]) {
  if (s.won || s.lost) return;
  s.time += dt;
  s.wait = Math.max(0, s.wait - dt);
  if (s.blast) {
    s.blast.t -= dt;
    if (s.blast.t <= 0) s.blast = null;
  }
  if (s.shot) {
    const b = s.shot;
    b.vx += s.wind * dt;
    b.vy += 230 * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    const tankHit = [120, 680].some(
      (x, i) =>
        i !== s.turn &&
        Math.abs(b.x - x) < 20 &&
        Math.abs(b.y - (ground(s, x) - 12)) < 20,
    );
    if (b.x < 0 || b.x > 800 || b.y > 530) {
      s.shot = null;
      s.turn = 1 - s.turn;
      s.round++;
      s.wait = 0.7;
    } else if (tankHit || b.y >= ground(s, b.x)) impact(s, b.x, b.y);
    return;
  }
  if (s.mode === "solo" && s.turn === 1) {
    if (!s.wait) {
      chooseAI(s);
      fire(s);
    }
    return;
  }
  const a = inputs[0] ?? { x: 0, y: 0, fire: false },
    b = s.turn === 1 ? (inputs[1] ?? a) : a;
  const input = { x: a.x || b.x, y: a.y || b.y, fire: a.fire || b.fire };
  s.angle = clamp(s.angle + input.x * 30 * dt, 15, 85);
  s.power = clamp(s.power - input.y * 100 * dt, 200, 500);
  if (!input.fire) s.fired = false;
  if (input.fire && !s.fired) fire(s);
}
