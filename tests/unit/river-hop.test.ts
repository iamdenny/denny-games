import { describe, it, expect } from "vitest";
import {
  fresh,
  step,
  hop,
  restore,
  objects,
} from "../../src/games/river-hop/rules";
describe("River Hop", () => {
  it("limits time steps and respects movement cooldown", () => {
    let s = fresh(1);
    hop(s, "up");
    expect(s.row).toBe(9);
    hop(s, "up");
    expect(s.row).toBe(9);
    step(s, 99);
    expect(s.time).toBeCloseTo(0.05);
  });
  it("collision spends one life then protects the reset bank", () => {
    const s = fresh(1);
    s.invulnerable = 0;
    s.row = 8;
    s.x = objects(s, 8).find((o) => o.x >= 0)!.x + 0.4;
    step(s, 0.01);
    expect(s.lives).toBe(2);
    expect(s.row).toBe(10);
    for (let i = 0; i < 10; i++) step(s, 0.01);
    expect(s.lives).toBe(2);
  });
  it("carries a rider on a moving log and drowns off logs", () => {
    const s = fresh(3);
    s.invulnerable = 0;
    s.row = 3;
    s.x = objects(s, 3).find((o) => o.x >= 0)!.x + 1;
    const x = s.x;
    step(s, 0.04);
    expect(s.x).not.toBe(x);
    expect(s.lives).toBe(3);
    s.x = -0.4;
    step(s, 0.04);
    expect(s.lives).toBe(2);
  });
  it("wins at the far bank, loses at zero lives and roundtrips saves", () => {
    const s = fresh(5);
    s.row = 1;
    s.cooldown = 0;
    hop(s, "up");
    expect(s.phase).toBe("won");
    expect(restore(s, 5)).toEqual(s);
    const lost = fresh(1);
    lost.lives = 1;
    lost.invulnerable = 0;
    lost.row = 8;
    lost.x = objects(lost, 8).find((o) => o.x >= 0)!.x + 0.4;
    step(lost, 0.01);
    expect(lost.phase).toBe("lost");
    expect(restore(lost, 1)).toEqual(lost);
  });
  it("rejects malformed and impossible checkpoints", () => {
    const s = fresh(1);
    for (const bad of [
      { ...s, x: NaN },
      { ...s, lives: 5 },
      { ...s, phase: "won" },
      { ...s, time: Infinity },
    ])
      expect(restore(bad, 1)).toBeNull();
    expect(restore(s, 2)).toBeNull();
  });
});
it("every river can be crossed by finite timed directional inputs", () => {
  for (let stage = 1; stage <= 5; stage++) {
    let frontier = [fresh(stage)],
      won = false;
    for (let turn = 0; turn < 220 && !won; turn++) {
      const next = new Map<string, ReturnType<typeof fresh>>();
      for (const state of frontier)
        for (const direction of [
          "wait",
          "up",
          "left",
          "right",
          "down",
        ] as const) {
          const candidate = { ...state };
          if (direction !== "wait") hop(candidate, direction);
          for (let tick = 0; tick < 20; tick++) step(candidate, 0.01);
          if (candidate.phase === "won") {
            won = true;
            break;
          }
          if (candidate.phase === "lost") continue;
          const key = `${candidate.row}:${Math.round(candidate.x * 10)}:${candidate.lives}`;
          if (!next.has(key)) next.set(key, candidate);
        }
      frontier = [...next.values()]
        .sort((a, b) => a.row - b.row + (b.lives - a.lives) * 4)
        .slice(0, 200);
    }
    expect(won, `stage ${stage} has a real timed route`).toBe(true);
  }
}, 30000);
