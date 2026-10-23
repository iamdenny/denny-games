import { it, expect } from "vitest";
import {
  create,
  fire,
  step,
  restore,
} from "../../src/games/meteor-guard/rules";
it("survives five real waves with aimed interceptions", () => {
  const s = create();
  for (let i = 0; i < 10000 && s.phase === "playing"; i++) {
    const m = s.meteors[0];
    if (m) fire(s, m.x, m.y + 25);
    step(s, 0.04);
    if (i % 100 === 0) expect(restore(s)).not.toBeNull();
  }
  expect(s.phase).toBe("won");
  expect(s.cities.some(Boolean)).toBe(true);
  expect(s.wave).toBe(5);
});
it("waits for final threats and damages each meteor only once", () => {
  const s = create();
  s.wave = 5;
  s.elapsed = 20;
  s.time = 100;
  s.meteors = [{ x: 80, y: 475, target: 0, speed: 50 }];
  step(s, 0.04);
  expect(s.cities).toEqual([false, true, true]);
  expect(s.phase).toBe("won");
  const snap = JSON.stringify(s);
  step(s, 0.04);
  expect(JSON.stringify(s)).toBe(snap);
});
it("bounds shots and rejects nonfinite or impossible saves", () => {
  const s = create();
  for (let i = 0; i < 100; i++) fire(s, 200, 200);
  expect(s.shots.length).toBe(1);
  expect(restore({ ...s, wave: 6 })).toBeNull();
  expect(restore({ ...s, aim: { x: NaN, y: 200 } })).toBeNull();
  expect(
    restore({
      ...s,
      meteors: Array(100).fill({ x: 0, y: 0, target: 0, speed: 20 }),
    }),
  ).toBeNull();
});

it("rejects a later wave without its elapsed campaign time", () => {
  const s = create();
  expect(restore({ ...s, wave: 5, elapsed: 20, phase: "won" })).toBeNull();
});
