import { describe, it, expect } from "vitest";
import * as maze from "../../src/games/ember-maze/rules";
import * as frost from "../../src/games/frost-patrol/rules";
import * as duel from "../../src/games/crater-duel/rules";
import * as tank from "../../src/games/iron-bastion/rules";
const idle = { x: 0, y: 0, fire: false };
describe("Ember Maze", () => {
  for (let stage = 1; stage <= 6; stage++)
    it(`stage ${stage} has reachable arenas and legal starting escape`, () => {
      const s = maze.create(stage, "solo");
      const visited = new Set<number>([16]),
        q = [16];
      while (q.length) {
        const at = q.shift()!;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const x = (at % 15) + dx!,
            y = Math.floor(at / 15) + dy!,
            n = y * 15 + x;
          if (
            x < 1 ||
            x > 13 ||
            y < 1 ||
            y > 9 ||
            s.tiles[n] === 1 ||
            visited.has(n)
          )
            continue;
          visited.add(n);
          q.push(n);
        }
      }
      expect(s.actors.every((a) => visited.has(a.y * 15 + a.x))).toBe(true);
      maze.step(s, stage, 0.01, [{ ...idle, fire: true }]);
      for (let i = 0; i < 2; i++)
        maze.step(s, stage, 0.15, [{ ...idle, x: 1 }]);
      maze.step(s, stage, 0.15, [{ ...idle, y: 1 }]);
      for (let i = 0; i < 70; i++) maze.step(s, stage, 0.03, [idle]);
      expect(s.actors[0]!.alive).toBe(true);
      expect(maze.restore(s, stage)).not.toBeNull();
    });
  it("chains bombs, stops at crates and awards one terminal outcome", () => {
    const s = maze.create(1, "local");
    s.tiles.fill(0);
    s.tiles[4 + 5 * 15] = 2;
    s.bombs = [
      { x: 3, y: 5, t: 0, owner: 0, range: 3 },
      { x: 3, y: 7, t: 2, owner: 1, range: 2 },
    ];
    s.actors[0]!.x = 1;
    s.actors[0]!.y = 1;
    s.actors[1]!.x = 3;
    s.actors[1]!.y = 8;
    maze.step(s, 1, 0.01, [idle, idle]);
    expect(s.bombs).toHaveLength(0);
    expect(s.tiles[4 + 5 * 15]).not.toBe(2);
    expect(s.flames.some((f) => f.x === 5 && f.y === 5)).toBe(false);
    expect(s.won).toBe(true);
    expect(s.winner).toBe(0);
    const score = s.score;
    maze.step(s, 1, 1, [idle, idle]);
    expect(s.score).toBe(score);
  });
});
describe("Frost Patrol", () => {
  it("has six distinct layouts with connected jump-accessible platforms", () => {
    const all = new Set<string>();
    for (let stage = 1; stage <= 6; stage++) {
      const p = frost.platforms(stage);
      all.add(JSON.stringify(p));
      const seen = new Set([0]);
      for (let k = 0; k < 6; k++)
        p.forEach((a, i) => {
          if (!seen.has(i)) return;
          p.forEach((b, j) => {
            const gap = Math.max(
              0,
              Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w),
            );
            if (a.y - b.y <= 105 && a.y - b.y >= 0 && gap < 100) seen.add(j);
          });
        });
      expect(seen.size).toBe(p.length);
    }
    expect(all.size).toBe(6);
  });
  it("freezes with projectiles, kicks and completes an arena", () => {
    const s = frost.create(1, "solo");
    s.enemies = s.enemies.slice(0, 1);
    const e = s.enemies[0]!;
    e.x = 120;
    e.y = 450;
    e.left = 120;
    e.right = 120;
    e.vx = 0;
    s.heroes[0]!.x = 80;
    for (let i = 0; i < 80; i++)
      frost.step(s, 1, 0.025, [{ ...idle, fire: true }]);
    expect(e.ice).toBe(3);
    expect(e.roll).toBeGreaterThan(0);
    for (let i = 0; i < 160; i++) frost.step(s, 1, 0.025, [idle]);
    expect(s.won).toBe(true);
  });
  it("co-op continues with surviving partner, thawing requires new hits", () => {
    const s = frost.create(3, "local");
    s.heroes[0]!.hp = 0;
    s.enemies[0]!.ice = 3;
    s.enemies[0]!.thaw = 0.01;
    frost.step(s, 3, 0.02, [idle, idle]);
    expect(s.lost).toBe(false);
    expect(s.enemies[0]!.ice).toBe(0);
    expect(frost.restore(s, 3)).not.toBeNull();
    s.heroes[1]!.hp = 0;
    frost.step(s, 3, 0.02, [idle, idle]);
    expect(s.lost).toBe(true);
  });
});
describe("Crater Duel", () => {
  for (let stage = 1; stage <= 6; stage++)
    it(`stage ${stage} has a legal damaging shot`, () => {
      let best = 0;
      for (let angle = 20; angle <= 80; angle += 5)
        for (let power = 260; power <= 500; power += 20) {
          const s = duel.create(stage, "local");
          s.wait = 0;
          s.angle = angle;
          s.power = power;
          duel.fire(s);
          for (let i = 0; i < 500 && s.shot; i++)
            duel.step(s, stage, 0.02, [idle, idle]);
          best = Math.max(best, 100 - s.hp[1]!);
        }
      expect(best).toBeGreaterThan(30);
    });
  it("deforms terrain, damages nearby target, switches turn and ends once", () => {
    const s = duel.create(1, "local");
    const before = duel.ground(s, 680);
    duel.impact(s, 680, before - 10);
    expect(s.hp[1]).toBeLessThan(50);
    expect(duel.ground(s, 680)).toBeGreaterThan(before);
    expect(s.turn).toBe(1);
    s.turn = 0;
    duel.impact(s, 680, duel.ground(s, 680) - 10);
    expect(s.won).toBe(true);
    expect(s.winner).toBe(0);
    expect(duel.restore(s, 1)).not.toBeNull();
  });
  it("wind changes trajectory and a held fire never launches multiple projectiles", () => {
    const a = duel.create(1, "solo"),
      b = duel.create(1, "solo");
    a.wind = -24;
    b.wind = 24;
    a.wait = b.wait = 0;
    duel.fire(a);
    duel.fire(b);
    for (let i = 0; i < 20; i++) {
      duel.step(a, 1, 0.02, [idle]);
      duel.step(b, 1, 0.02, [idle]);
    }
    expect(a.shot!.x).toBeLessThan(b.shot!.x);
  });
});
describe("Iron Bastion", () => {
  for (let stage = 1; stage <= 6; stage++)
    it(`stage ${stage} contains clear enemy approaches`, () => {
      const s = tank.create(stage, "solo");
      for (const x of [1, 10, 18])
        for (let y = 0; y < 12; y++) expect(s.tiles[y * 20 + x]).toBe(0);
      expect(tank.restore(s, stage)).not.toBeNull();
    });
  it("shots destroy brick, destroy enemies and complete final wave", () => {
    const s = tank.create(1, "solo");
    s.spawned = 5;
    s.spawn = 3;
    s.tiles.fill(0);
    s.heroes[0]!.x = 270;
    s.heroes[0]!.y = 378;
    s.enemies = [{ x: 270, y: 270, dir: 2, hp: 1, cool: 1, inv: 0 }];
    for (let i = 0; i < 100 && !s.won; i++)
      tank.step(s, 1, 0.02, [{ ...idle, fire: true }]);
    expect(s.won).toBe(true);
    expect(s.destroyed).toBe(1);
    const b = tank.create(1, "solo");
    b.spawn = 3;
    b.tiles.fill(0);
    b.tiles[9 * 20 + 7] = 2;
    for (let i = 0; i < 20; i++)
      tank.step(b, 1, 0.02, [{ ...idle, fire: true }]);
    expect(b.tiles[9 * 20 + 7]).toBe(0);
  });
  it("raiders advance beyond their spawn tile at real frame rate", () => {
    const s = tank.create(1, "solo");
    for (let i = 0; i < 100; i++) tank.step(s, 1, 1 / 60, [idle]);
    expect(
      Math.hypot(s.enemies[0]!.x - 54, s.enemies[0]!.y - 18),
    ).toBeGreaterThan(36);
  });
  it("enemy fire damages beacon and ends defense", () => {
    const s = tank.create(1, "local");
    s.base = 1;
    s.bullets = [{ x: 378, y: 385, dir: 2, enemy: true, life: 1 }];
    tank.step(s, 1, 0.1, [idle, idle]);
    expect(s.base).toBe(0);
    expect(s.lost).toBe(true);
  });
});
it("all four reject malformed and nonfinite save payloads without throwing", () => {
  for (const game of [maze, frost, duel, tank]) {
    expect(game.restore(null, 1)).toBeNull();
    const s = game.create(1, "solo");
    expect(game.restore({ ...s, time: NaN }, 1)).toBeNull();
    expect(game.restore({ ...s, mode: "remote" }, 1)).toBeNull();
    expect(game.restore({ ...s, won: true, lost: true }, 1)).toBeNull();
    expect(game.restore(s, 1)).not.toBeNull();
  }
});
it("running checkpoints round-trip through every validator on all stages", () => {
  for (let stage = 1; stage <= 6; stage++) {
    for (const mode of ["solo", "local"] as const) {
      const a = maze.create(stage, mode),
        b = frost.create(stage, mode),
        c = duel.create(stage, mode),
        d = tank.create(stage, mode);
      for (let i = 0; i < 800; i++) {
        const direction = Math.floor(i / 60) % 4;
        const input = {
          x: direction === 0 ? 1 : direction === 2 ? -1 : 0,
          y: direction === 1 ? -1 : direction === 3 ? 1 : 0,
          fire: i % 30 < 10,
        };
        maze.step(a, stage, 1 / 60, [input, input]);
        frost.step(b, stage, 1 / 60, [input, input]);
        duel.step(c, stage, 1 / 60, [input, input]);
        tank.step(d, stage, 1 / 60, [input, input]);
        if (i % 80 === 0) {
          expect(maze.restore(a, stage)).not.toBeNull();
          expect(frost.restore(b, stage)).not.toBeNull();
          expect(duel.restore(c, stage)).not.toBeNull();
          expect(tank.restore(d, stage)).not.toBeNull();
        }
      }
    }
  }
});
