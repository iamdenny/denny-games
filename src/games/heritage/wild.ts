export interface Wild {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  ground: boolean;
  score: number;
  collected: number[];
  defeated: number[];
  time: number;
  invincible: number;
  attack: number;
  facing: number;
  won: boolean;
  lost: boolean;
}
export interface Platform {
  x: number;
  y: number;
  w: number;
}
export function level(stage: number) {
  const n = Math.max(1, Math.min(6, stage));
  return {
    width: 2400,
    platforms: [
      { x: 0, y: 400, w: 2400 },
      ...Array.from({ length: 9 }, (_, i) => ({
        x: 230 + i * 225,
        y: 300 - ((i + n) % 3) * 40,
        w: 130,
      })),
    ],
    gems: Array.from({ length: 12 }, (_, i) => ({
      x: 170 + i * 180,
      y: i % 2 ? 250 - ((Math.floor(i / 2) + n) % 2) * 40 : 365,
    })),
    enemies: Array.from({ length: 4 + n }, (_, i) => ({
      x: 440 + i * 210,
      y: 376,
    })),
    exit: 2320,
  };
}
export function newWild(): Wild {
  return {
    x: 50,
    y: 376,
    vx: 0,
    vy: 0,
    hp: 4,
    ground: true,
    score: 0,
    collected: [],
    defeated: [],
    time: 0,
    invincible: 0,
    attack: 0,
    facing: 1,
    won: false,
    lost: false,
  };
}
export function stepWild(
  s: Wild,
  stage: number,
  dt: number,
  input: { x: number; jump: boolean; hit: boolean },
): Wild {
  if (s.won || s.lost) return s;
  const l = level(stage),
    n = { ...s, collected: [...s.collected], defeated: [...s.defeated] };
  dt = Math.max(0, Math.min(0.025, dt));
  n.time += dt;
  n.invincible = Math.max(0, n.invincible - dt);
  n.attack = Math.max(0, n.attack - dt);
  n.vx = Math.max(-1, Math.min(1, input.x)) * 210;
  if (n.vx) n.facing = Math.sign(n.vx);
  if (input.jump && n.ground) {
    n.vy = -510;
    n.ground = false;
  }
  if (input.hit && n.attack === 0) n.attack = 0.28;
  const oldBottom = n.y + 24;
  n.vy += 1250 * dt;
  n.x = Math.max(16, Math.min(l.width - 16, n.x + n.vx * dt));
  n.y += n.vy * dt;
  n.ground = false;
  for (const p of l.platforms) {
    if (
      n.vy >= 0 &&
      oldBottom <= p.y + 1 &&
      n.y + 24 >= p.y &&
      n.x + 12 > p.x &&
      n.x - 12 < p.x + p.w
    ) {
      n.y = p.y - 24;
      n.vy = 0;
      n.ground = true;
    }
  }
  l.gems.forEach((g, i) => {
    if (!n.collected.includes(i) && Math.hypot(n.x - g.x, n.y - g.y) < 32) {
      n.collected.push(i);
      n.score += 100;
    }
  });
  l.enemies.forEach((e, i) => {
    if (n.defeated.includes(i)) return;
    const x = e.x + Math.sin(n.time * 1.6 + i) * 45;
    if (
      n.attack > 0.08 &&
      Math.abs(n.x - x) < 68 &&
      Math.abs(n.y - e.y) < 40 &&
      (x - n.x) * n.facing >= -10
    ) {
      n.defeated.push(i);
      n.score += 150;
    } else if (Math.abs(n.x - x) < 26 && Math.abs(n.y - e.y) < 32) {
      if (n.vy > 80 && s.y < e.y - 15) {
        n.defeated.push(i);
        n.score += 150;
        n.vy = -340;
      } else if (n.invincible === 0) {
        n.hp--;
        n.invincible = 1.3;
        n.vy = -200;
      }
    }
  });
  if (n.hp <= 0) n.lost = true;
  if (n.x >= l.exit && n.collected.length >= 6) {
    n.won = true;
    n.score += n.hp * 200;
  }
  return n;
}
export function restoreWild(value: unknown): Wild {
  const fresh = newWild(),
    s = value as Wild | undefined;
  if (
    !s ||
    ![
      "x",
      "y",
      "vx",
      "vy",
      "hp",
      "score",
      "time",
      "invincible",
      "attack",
      "facing",
    ].every((k) => Number.isFinite(s[k as keyof Wild])) ||
    !Array.isArray(s.collected) ||
    !Array.isArray(s.defeated)
  )
    return fresh;
  if (
    s.x < 16 ||
    s.x > 2384 ||
    s.y < 0 ||
    s.y > 376 ||
    !Number.isInteger(s.hp) ||
    s.hp < 0 ||
    s.hp > 4 ||
    s.time < 0 ||
    s.time > 1e7 ||
    s.score < 0 ||
    s.score > 100000
  )
    return fresh;
  if (
    s.collected.some((i) => !Number.isInteger(i) || i < 0 || i >= 12) ||
    s.defeated.some((i) => !Number.isInteger(i) || i < 0 || i >= 10)
  )
    return fresh;
  return {
    ...fresh,
    ...s,
    collected: [...new Set(s.collected)],
    defeated: [...new Set(s.defeated)],
    vx: 0,
    vy: 0,
    invincible: 0,
    attack: 0,
    won: !!s.won,
    lost: !!s.lost,
  };
}
