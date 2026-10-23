import { it, expect } from "vitest";
import {
  target,
  score,
  validRolls,
  create,
  roll,
  step,
  restore,
} from "../../src/games/pocket-bowling/rules";
it("scores perfect, gutter, spares and mixed ten-frame rounds", () => {
  expect(score(Array(12).fill(10))).toBe(300);
  expect(score(Array(20).fill(0))).toBe(0);
  expect(score([...Array(20).fill(5), 5])).toBe(150);
  expect(score([10, 3, 6])).toBe(28);
});
it("rejects impossible racks and tenth bonus combinations", () => {
  for (const rolls of [
    [8, 3],
    [...Array(18).fill(0), 10, 8, 3],
    [...Array(20).fill(0), 1],
    Array(13).fill(10),
  ])
    expect(validRolls(rolls)).toBe(false);
  expect(validRolls([...Array(18).fill(0), 10, 10, 10])).toBe(true);
});
it("wins a full game with actual pocket aim and power", () => {
  const s = create();
  for (let i = 0; i < 6000 && s.phase !== "done"; i++) {
    if (s.phase === "ready") {
      s.aim = target(s).aim;
      s.power = target(s).power;
      roll(s);
    }
    step(s, 0.04);
  }
  expect(s.phase).toBe("done");
  expect(s.score).toBeGreaterThanOrEqual(100);
  expect(restore(s)).toEqual(s);
});
it("freezes terminal play and rejects malformed snapshots", () => {
  const s = create();
  expect(restore({ ...s, power: Infinity })).toBeNull();
  expect(restore({ ...s, rolls: [9, 9] })).toBeNull();
  expect(restore({ ...s, phase: "done" })).toBeNull();
});

it("default repeated throws are not a perfect game", () => {
  const s = create();
  for (let i = 0; i < 6000 && s.phase !== "done"; i++) {
    if (s.phase === "ready") roll(s);
    step(s, 0.04);
  }
  expect(s.score).toBeLessThan(300);
});

it("rejects phase-inconsistent ball animation snapshots", () => {
  const s = create();
  for (const bad of [
    { ...s, pending: 1 },
    { ...s, flight: 0.2 },
    { ...s, phase: "rolling", flight: 1.2 },
    { ...s, phase: "falling", flight: 0.55 },
  ])
    expect(restore(bad)).toBeNull();
  const done = { ...s, rolls: Array(12).fill(10), score: 300, phase: "done" };
  expect(restore(done)).not.toBeNull();
  expect(restore({ ...done, pending: 1 })).toBeNull();
});
