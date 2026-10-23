import { finite, record, type Input } from "../prism-pop/host";
export const SW = 400,
  SH = 560;
export interface Ship {
  x: number;
  y: number;
  hp: number;
  kind: number;
  phase: number;
  fire: number;
}
export interface Shot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
}
export interface Wing {
  version: 1;
  stage: number;
  score: number;
  status: "playing" | "won" | "lost";
  x: number;
  y: number;
  lives: number;
  power: number;
  bombs: number;
  shield: number;
  clock: number;
  cooldown: number;
  wave: number;
  waveAt: number;
  kills: number;
  enemies: Ship[];
  shots: Shot[];
  bullets: Shot[];
  pickups: { x: number; y: number }[];
  boss: Ship | null;
  bossSpawned: boolean;
  flash: number;
  auto: boolean;
}
export const sectors = [
  { waves: 3, spacing: 5, boss: 65, name: ["Dawn Gate", "새벽 관문"] },
  { waves: 4, spacing: 5, boss: 80, name: ["Twin Comets", "쌍둥이 혜성"] },
  { waves: 4, spacing: 4.6, boss: 95, name: ["Amber Belt", "호박빛 궤도"] },
  { waves: 5, spacing: 4.5, boss: 110, name: ["Night Current", "밤의 흐름"] },
  { waves: 5, spacing: 4.2, boss: 125, name: ["Crystal Storm", "수정 폭풍"] },
  { waves: 6, spacing: 4, boss: 150, name: ["Aurora Crown", "오로라 왕관"] },
];
export function newWing(stage: number): Wing {
  stage = Math.max(1, Math.min(6, Math.floor(stage)));
  return {
    version: 1,
    stage,
    score: 0,
    status: "playing",
    x: 200,
    y: 470,
    lives: 3,
    power: 1,
    bombs: 2,
    shield: 2,
    clock: 0,
    cooldown: 0,
    wave: 0,
    waveAt: 1,
    kills: 0,
    enemies: [],
    shots: [],
    bullets: [],
    pickups: [],
    boss: null,
    bossSpawned: false,
    flash: 0,
    auto: true,
  };
}
export function enemyWave(s: Wing) {
  const kind = (s.wave + s.stage - 1) % 3;
  for (let n = 0; n < 5; n++) {
    const x =
      kind === 0 ? 55 + n * 72 : kind === 1 ? 200 + (n - 2) * 55 : 45 + n * 72;
    s.enemies.push({
      x,
      y: -40 - Math.abs(n - 2) * 30,
      hp: 2 + Math.floor(s.stage / 3),
      kind,
      phase: n * 0.9,
      fire: 1 + n * 0.27,
    });
  }
  s.wave++;
  s.waveAt = s.clock + sectors[s.stage - 1]!.spacing;
}
function fireAt(s: Wing, enemy: Ship, speed: number, spread = 0) {
  const a = Math.atan2(s.y - enemy.y, s.x - enemy.x);
  for (let j = -spread; j <= spread; j++)
    s.bullets.push({
      x: enemy.x,
      y: enemy.y + 16,
      vx: Math.cos(a + j * 0.23) * speed,
      vy: Math.sin(a + j * 0.23) * speed,
      damage: 1,
    });
}
function hit(s: Wing) {
  if (s.shield > 0) return;
  s.lives--;
  s.shield = 2.2;
  s.power = Math.max(1, s.power - 1);
  s.flash = 0.18;
  if (s.lives <= 0) s.status = "lost";
}
export function stepWing(s: Wing, dt: number, i: Input) {
  if (s.status !== "playing") return;
  s.clock += dt;
  s.shield = Math.max(0, s.shield - dt);
  s.cooldown = Math.max(0, s.cooldown - dt);
  s.flash = Math.max(0, s.flash - dt);
  if (i.taps.has("fire")) s.auto = !s.auto;
  const dx = (i.held.has("right") ? 1 : 0) - (i.held.has("left") ? 1 : 0),
    dy = (i.held.has("down") ? 1 : 0) - (i.held.has("up") ? 1 : 0);
  const norm = Math.hypot(dx, dy) || 1;
  s.x += (dx / norm) * 240 * dt;
  s.y += (dy / norm) * 240 * dt;
  for (const [key, x, y] of [
    ["left", -12, 0],
    ["right", 12, 0],
    ["up", 0, -12],
    ["down", 0, 12],
  ] as const)
    if (i.taps.has(key)) {
      s.x += x;
      s.y += y;
    }
  if (i.pointer?.down) {
    const d = Math.hypot(i.pointer.x - s.x, i.pointer.y - s.y),
      step = Math.min(1, (dt * 400) / (d || 1));
    s.x += (i.pointer.x - s.x) * step;
    s.y += (i.pointer.y - s.y) * step;
  }
  s.x = Math.max(18, Math.min(SW - 18, s.x));
  s.y = Math.max(85, Math.min(SH - 25, s.y));
  if (i.taps.has("bomb") && s.bombs > 0) {
    s.bombs--;
    s.bullets = [];
    s.flash = 0.5;
    s.shield = Math.max(1, s.shield);
    for (const e of s.enemies) e.hp -= 8;
    if (s.boss) s.boss.hp -= 22;
  }
  if (s.auto && s.cooldown === 0) {
    for (let n = 0; n < s.power; n++)
      s.shots.push({
        x: s.x + (n - (s.power - 1) / 2) * 12,
        y: s.y - 19,
        vx: (n - (s.power - 1) / 2) * 32,
        vy: -500,
        damage: 1,
      });
    s.cooldown = 0.16;
  }
  const sector = sectors[s.stage - 1]!;
  if (s.wave < sector.waves && s.clock >= s.waveAt) enemyWave(s);
  if (
    s.wave === sector.waves &&
    !s.bossSpawned &&
    s.clock > s.waveAt + 1 &&
    s.enemies.length === 0
  ) {
    s.boss = {
      x: 200,
      y: -50,
      hp: sector.boss,
      kind: s.stage,
      phase: 0,
      fire: 1,
    };
    s.bossSpawned = true;
  }
  for (const e of s.enemies) {
    e.phase += dt;
    e.y += (48 + s.stage * 5) * dt;
    if (e.kind === 1) e.x += Math.sin(e.phase * 2.3) * 55 * dt;
    if (e.kind === 2) e.x += Math.cos(e.phase * 1.7) * 45 * dt;
    e.x = Math.max(20, Math.min(SW - 20, e.x));
    e.fire = Math.max(0, e.fire - dt);
    if (e.fire <= 0 && e.y > 30 && e.y < SH - 80) {
      fireAt(s, e, 100 + s.stage * 9, s.stage > 3 && e.kind === 1 ? 1 : 0);
      e.fire = 2.2;
    }
    if (Math.hypot(e.x - s.x, e.y - s.y) < 25) hit(s);
  }
  if (s.boss) {
    const b = s.boss;
    b.phase += dt;
    b.y = Math.min(100, b.y + 65 * dt);
    b.x = 200 + Math.sin(b.phase * 0.75) * 125;
    b.fire -= dt;
    if (b.y >= 70 && b.fire <= 0) {
      if (s.stage % 3 === 1) fireAt(s, b, 125 + s.stage * 7, 2);
      else if (s.stage % 3 === 2) {
        for (let n = -2; n <= 2; n++)
          s.bullets.push({
            x: b.x + n * 12,
            y: b.y + 24,
            vx: n * 35,
            vy: 125 + s.stage * 5,
            damage: 1,
          });
      } else {
        for (let n = 0; n < 9; n++) {
          const a = (n * Math.PI * 2) / 9 + b.phase * 0.4;
          s.bullets.push({
            x: b.x,
            y: b.y,
            vx: Math.cos(a) * 125,
            vy: Math.sin(a) * 125,
            damage: 1,
          });
        }
      }
      b.fire = Math.max(0.45, 1.05 - s.stage * 0.07);
    }
    if (Math.hypot(b.x - s.x, b.y - s.y) < 42) hit(s);
  }
  for (const shot of s.shots) {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    const enemy = s.enemies.find(
      (e) => e.hp > 0 && Math.hypot(e.x - shot.x, e.y - shot.y) < 20,
    );
    if (enemy) {
      enemy.hp -= shot.damage;
      shot.y = -100;
    } else if (
      s.boss &&
      Math.abs(s.boss.x - shot.x) < 43 &&
      Math.abs(s.boss.y - shot.y) < 27
    ) {
      s.boss.hp -= shot.damage;
      shot.y = -100;
    }
  }
  s.shots = s.shots
    .filter((b) => b.y > -30 && b.x > -20 && b.x < SW + 20)
    .slice(-120);
  for (const b of s.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (Math.hypot(b.x - s.x, b.y - s.y) < 10) {
      hit(s);
      b.y = SH + 100;
    }
  }
  s.bullets = s.bullets
    .filter((b) => b.y > -50 && b.y < SH + 30 && b.x > -30 && b.x < SW + 30)
    .slice(-220);
  for (const e of s.enemies)
    if (e.hp <= 0) {
      s.score += 150;
      s.kills++;
      if (s.kills % 4 === 0) s.pickups.push({ x: e.x, y: e.y });
    }
  s.enemies = s.enemies.filter((e) => e.hp > 0 && e.y < SH + 30);
  for (const p of s.pickups) {
    p.y += 65 * dt;
    if (Math.hypot(p.x - s.x, p.y - s.y) < 27) {
      s.power = Math.min(3, s.power + 1);
      s.score += 100;
      p.y = SH + 100;
    }
  }
  s.pickups = s.pickups.filter((p) => p.y < SH + 20);
  if (s.boss && s.boss.hp <= 0 && s.status === "playing") {
    s.score += 1500 + s.lives * 250;
    s.status = "won";
    s.bullets = [];
    s.boss = null;
  }
}
export function restoreWing(v: unknown, stage: number): Wing {
  const fresh = newWing(stage);
  if (
    !record(v) ||
    v.version !== 1 ||
    v.stage !== fresh.stage ||
    !["playing", "won", "lost"].includes(String(v.status)) ||
    typeof v.auto !== "boolean" ||
    typeof v.bossSpawned !== "boolean"
  )
    return fresh;
  const fields: { [k: string]: [number, number] } = {
    score: [0, 1000000],
    x: [18, SW - 18],
    y: [85, SH - 25],
    lives: [0, 3],
    power: [1, 3],
    bombs: [0, 2],
    shield: [0, 3],
    clock: [0, 100000],
    cooldown: [0, 1],
    wave: [0, sectors[fresh.stage - 1]!.waves],
    waveAt: [0, 100001],
    kills: [0, 10000],
    flash: [0, 1],
  };
  for (const [k, [lo, hi]] of Object.entries(fields))
    if (!finite(v[k], lo, hi)) return fresh;
  for (const k of ["lives", "power", "bombs", "wave", "kills"])
    if (!Number.isInteger(v[k])) return fresh;
  const ship = (e: unknown) =>
    record(e) &&
    finite(e.x, -100, SW + 100) &&
    finite(e.y, -200, SH + 50) &&
    finite(e.hp, -50, 200) &&
    finite(e.kind, 0, 6) &&
    Number.isInteger(e.kind) &&
    finite(e.phase, 0, 100001) &&
    finite(e.fire, -1, 5);
  const shot = (b: unknown) =>
    record(b) &&
    finite(b.x, -40, SW + 40) &&
    finite(b.y, -50, SH + 40) &&
    finite(b.vx, -600, 600) &&
    finite(b.vy, -600, 600) &&
    finite(b.damage, 1, 3);
  if (
    !Array.isArray(v.enemies) ||
    v.enemies.length > 40 ||
    !v.enemies.every(ship) ||
    !Array.isArray(v.shots) ||
    v.shots.length > 120 ||
    !v.shots.every(shot) ||
    !Array.isArray(v.bullets) ||
    v.bullets.length > 220 ||
    !v.bullets.every(shot) ||
    !Array.isArray(v.pickups) ||
    v.pickups.length > 50 ||
    !v.pickups.every(
      (p) => record(p) && finite(p.x, 0, SW) && finite(p.y, -200, SH + 20),
    ) ||
    (v.boss !== null && !ship(v.boss))
  )
    return fresh;
  if (
    (v.status === "playing" && v.lives === 0) ||
    (v.status === "won" && (!v.bossSpawned || v.boss !== null))
  )
    return fresh;
  if (v.status === "playing" && v.bossSpawned && v.boss === null) return fresh;
  if (
    v.boss !== null &&
    (!v.bossSpawned || v.wave !== sectors[fresh.stage - 1]!.waves)
  )
    return fresh;
  return structuredClone(v) as unknown as Wing;
}
