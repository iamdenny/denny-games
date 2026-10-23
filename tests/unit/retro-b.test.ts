import { describe, expect, it } from "vitest";
import {
  newPop,
  stepPop,
  split,
  restorePop,
} from "../../src/games/prism-pop/rules";
import {
  newHarbor,
  stepHarbor,
  resolveMatch,
  restoreHarbor,
  neighbors,
  center,
  type Harbor,
} from "../../src/games/bubble-harbor/rules";
import {
  newWing,
  stepWing,
  restoreWing,
  sectors,
} from "../../src/games/starfall-wing/rules";
import {
  newVault,
  stepVault,
  restoreVault,
  reachableVault,
  moves,
  digHole,
  plans,
  type Vault,
} from "../../src/games/vault-runner/rules";
import type { Input } from "../../src/games/prism-pop/host";
const input = (held: string[] = [], taps: string[] = []): Input => ({
  held: new Set(held),
  taps: new Set(taps),
});
describe("Prism Pop", () => {
  it("large spheres divide twice, preserve children bounds and end only after all small spheres clear", () => {
    const s = newPop(1);
    split(s, 0);
    expect(s.balls).toHaveLength(2);
    expect(s.balls.every((b) => b.size === 1)).toBe(true);
    while (s.balls.length) split(s, 0);
    expect(s.status).toBe("won");
    expect(restorePop(s, 1)).toEqual(s);
  });
  it("harpoons collide, cooldown prevents spam, vulnerability costs lives, and timer expires", () => {
    const s = newPop(1);
    s.balls = [{ x: 320, y: 300, vx: 0, vy: 0, size: 0 }];
    stepPop(s, 0.03, input(["fire"]));
    expect(s.ropes.length).toBe(1);
    for (let k = 0; k < 8; k++) stepPop(s, 0.03, input(["fire"]));
    expect(s.status).toBe("won");
    const danger = newPop(1);
    danger.shield = 0;
    danger.balls = [{ x: 320, y: 380, vx: 0, vy: 0, size: 0 }];
    stepPop(danger, 0.01, input());
    expect(danger.lives).toBe(2);
    stepPop(danger, 0.01, input());
    expect(danger.lives).toBe(2);
    danger.time = 0.01;
    stepPop(danger, 0.02, input());
    expect(danger.status).toBe("lost");
  });
  it("restores every real arena during simulation and rejects poisoned/oversized state", () => {
    for (let stage = 1; stage <= 8; stage++) {
      const s = newPop(stage);
      for (let n = 0; n < 100; n++) {
        stepPop(s, 0.02, input(["fire"]));
        expect(restorePop(s, stage)).toEqual(s);
      }
      expect(restorePop({ ...s, x: Infinity }, stage)).toEqual(newPop(stage));
      expect(
        restorePop({ ...s, balls: Array(100).fill(s.balls[0]) }, stage),
      ).toEqual(newPop(stage));
    }
  });
});
describe("Bubble Harbor", () => {
  it("matches hex neighbors and drops a disconnected differently colored branch", () => {
    const s = newHarbor(1);
    s.board = [
      { row: 0, col: 0, color: 0 },
      { row: 0, col: 1, color: 0 },
      { row: 1, col: 0, color: 0 },
      { row: 2, col: 0, color: 1 },
    ];
    expect(resolveMatch(s, s.board[2]!)).toBe(3);
    expect(s.dropped).toBe(1);
    expect(s.status).toBe("won");
    expect(s.score).toBe(480);
  });
  it("wall reflection preserves physical speed and live save round trips; zero-speed flight is rejected", () => {
    const s = newHarbor(1);
    s.angle = -0.2;
    stepHarbor(s, 0.01, input([], ["fire"]));
    for (let n = 0; n < 45; n++) {
      stepHarbor(s, 0.01, input());
      expect(restoreHarbor(s, 1)).toEqual(s);
    }
    expect(s.flight?.vx).toBeLessThan(0);
    expect(
      restoreHarbor(
        { ...s, flight: { x: 192, y: 475, vx: 0, vy: 0, color: 0 } },
        1,
      ),
    ).toEqual(newHarbor(1));
    expect(restoreHarbor({ ...s, board: [s.board[0], s.board[0]] }, 1)).toEqual(
      newHarbor(1),
    );
  });
  it("all twelve curated layouts can be cleared by legal aimed shots and swaps", () => {
    for (let stage = 1; stage <= 12; stage++) {
      let s = newHarbor(stage);
      for (let turn = 0; turn < 65 && s.status === "playing"; turn++) {
        let best: Harbor | undefined,
          bestValue = -Infinity;
        for (const swap of [false, true])
          for (let angle = -2.94; angle < -0.2; angle += 0.055) {
            const candidate = structuredClone(s);
            candidate.angle = angle;
            if (swap) stepHarbor(candidate, 0, input([], ["swap"]));
            stepHarbor(candidate, 0, input([], ["fire"]));
            for (let frame = 0; frame < 240 && candidate.flight; frame++)
              stepHarbor(candidate, 0.025, input());
            if (candidate.status === "lost") continue;
            let adjacency = 0;
            for (const b of candidate.board)
              adjacency += neighbors(b).filter((n) =>
                candidate.board.some(
                  (o) =>
                    o.row === n.row && o.col === n.col && o.color === b.color,
                ),
              ).length;
            const value =
              (s.board.length - candidate.board.length) * 1000 +
              (candidate.score - s.score) * 0.1 -
              candidate.offset * 5 +
              adjacency * 0.5 -
              candidate.board.reduce((sum, b) => sum + center(b).y * 0.005, 0);
            if (value > bestValue) {
              best = candidate;
              bestValue = value;
            }
          }
        if (!best) break;
        s = best;
      }
      expect(s.status, `board ${stage}: ${s.board.length} left`).toBe("won");
    }
  }, 30000);
});
describe("Starfall Wing", () => {
  it("six sectors have distinct pacing and bosses, real simulation round trips, and impossible boss state resets", () => {
    expect(new Set(sectors.map((s) => s.boss)).size).toBe(6);
    for (let stage = 1; stage <= 6; stage++) {
      const s = newWing(stage);
      for (let n = 0; n < 400; n++) {
        stepWing(s, 0.025, input());
        if (n % 20 === 0) expect(restoreWing(s, stage)).toEqual(s);
      }
      expect(
        restoreWing(
          {
            ...newWing(stage),
            bossSpawned: true,
            boss: null,
            wave: sectors[stage - 1]!.waves,
          },
          stage,
        ),
      ).toEqual(newWing(stage));
    }
  });
  it("weapon pickup upgrades, nova consumes a charge and damages boss, boss death wins once", () => {
    const s = newWing(1);
    s.pickups = [{ x: s.x, y: s.y }];
    stepWing(s, 0.01, input());
    expect(s.power).toBe(2);
    s.wave = 3;
    s.bossSpawned = true;
    s.boss = { x: 200, y: 100, hp: 20, kind: 1, phase: 0, fire: 1 };
    s.bullets = [{ x: 10, y: 10, vx: 0, vy: 10, damage: 1 }];
    stepWing(s, 0.01, input([], ["bomb"]));
    expect(s.bombs).toBe(1);
    expect(s.status).toBe("won");
    expect(s.bullets).toHaveLength(0);
    expect(restoreWing(s, 1)).toEqual(s);
    const score = s.score;
    stepWing(s, 1, input());
    expect(s.score).toBe(score);
  });
  it("unshielded bullets lose lives and the last life ends the stage", () => {
    const s = newWing(1);
    s.shield = 0;
    s.lives = 1;
    s.bullets = [{ x: s.x, y: s.y, vx: 0, vy: 0, damage: 1 }];
    stepWing(s, 0.01, input());
    expect(s.status).toBe("lost");
  });
});
function route(s: Vault, target: { x: number; y: number }) {
  const q = [
      {
        p: { x: s.player.x, y: s.player.y },
        path: [] as { x: number; y: number }[],
      },
    ],
    seen = new Set([`${s.player.x},${s.player.y}`]);
  while (q.length) {
    const { p, path } = q.shift()!;
    if (p.x === target.x && p.y === target.y) return path;
    for (const n of moves(s, p)) {
      const k = `${n.x},${n.y}`;
      if (!seen.has(k)) {
        seen.add(k);
        q.push({ p: n, path: [...path, n] });
      }
    }
  }
  throw Error("unreachable");
}
describe("Vault Runner", () => {
  it("all twelve maps can collect every treasure and exit through actual movement, climbing and falling rules", () => {
    for (let stage = 1; stage <= 12; stage++) {
      const s = newVault(stage);
      expect(reachableVault(stage)).toBe(true); // Isolate topology from pursuer AI, which is tested independently.
      s.guards.forEach((g) => {
        g.alive = false;
      });
      for (const target of [...s.gold, { x: 18, y: 1 }]) {
        for (const next of route(s, target)) {
          const dx = next.x - s.player.x,
            dy = next.y - s.player.y;
          const key =
            dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : "down";
          s.move = 0;
          stepVault(s, 0.12, input([key]));
          expect({ x: s.player.x, y: s.player.y }).toEqual(next);
          expect(restoreVault(s, stage)).toEqual(s);
        }
      }
      expect(s.status, `vault ${stage}`).toBe("won");
      expect(s.collected).toBe(plans[stage - 1]!.treasure.length);
    }
  });
  it("guards pursue, fall into holes and are removed when bricks close; trapped player can climb out", () => {
    const s = newVault(1);
    s.player = { x: 5, y: 9, px: 5, py: 9, anim: 0, trapped: 0, alive: true };
    expect(digHole(s, 1)).toBe(true);
    s.guards = [
      { x: 6, y: 10, px: 6, py: 9, anim: 0, trapped: 0, alive: true },
    ];
    for (let n = 0; n < 46; n++) stepVault(s, 0.1, input());
    expect(s.guards[0]!.alive).toBe(false);
    expect(s.score).toBe(250);
    const p = newVault(1);
    p.player = { x: 5, y: 9, px: 5, py: 9, anim: 0, trapped: 0, alive: true };
    digHole(p, 1);
    p.player.x = 6;
    p.player.y = 10;
    stepVault(p, 0.01, input(["up"]));
    expect(p.player.y).toBe(9);
    const chase = newVault(1),
      before = structuredClone(chase.guards);
    for (let n = 0; n < 10; n++) stepVault(chase, 0.1, input());
    expect(chase.guards).not.toEqual(before);
  });
  it("rejects out-of-bounds old positions, duplicated treasures and wrong stage", () => {
    const s = newVault(1);
    expect(restoreVault({ ...s, player: { ...s.player, py: 1e9 } }, 1)).toEqual(
      newVault(1),
    );
    expect(restoreVault({ ...s, gold: [s.gold[0], s.gold[0]] }, 1)).toEqual(
      newVault(1),
    );
    expect(restoreVault(s, 2)).toEqual(newVault(2));
  });
});
