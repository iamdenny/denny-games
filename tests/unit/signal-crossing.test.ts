import { it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
interface Car {
  axis: number;
  pos: number;
  wait: number;
}
interface Crossing {
  cars: Car[];
  green: number;
  spawn: number[];
  time: number;
  score: number;
  ended: boolean;
  reason: string;
}
function engine() {
  const box = createContext({ Math });
  runInContext(
    readFileSync("public/vendor/crisp/games/signal-crossing/main.js", "utf8"),
    box,
  );
  return box as unknown as {
    signalCreate(): Crossing;
    signalStep(s: Crossing, flip: boolean): void;
  };
}
it("red queues stop at the line and green cars depart for points", () => {
  const e = engine(),
    s = e.signalCreate();
  s.spawn = [9999, 9999];
  s.cars = [{ axis: 1, pos: 39, wait: 0 }];
  for (let i = 0; i < 50; i++) e.signalStep(s, false);
  expect(s.cars[0]!.pos).toBe(40);
  expect(s.cars[0]!.wait).toBeGreaterThan(0);
  e.signalStep(s, true);
  for (let i = 0; i < 180; i++) e.signalStep(s, false);
  expect(s.score).toBe(1);
  expect(s.ended).toBe(false);
});
it("cars committed past the stop line continue after a signal change; crossing collision ends once", () => {
  const e = engine(),
    s = e.signalCreate();
  s.spawn = [9999, 9999];
  s.cars = [
    { axis: 0, pos: 48, wait: 0 },
    { axis: 1, pos: 42, wait: 0 },
  ];
  e.signalStep(s, true);
  expect(s.cars[0]!.pos).toBeGreaterThan(48);
  expect(s.ended).toBe(true);
  const snap = JSON.stringify(s);
  e.signalStep(s, true);
  expect(JSON.stringify(s)).toBe(snap);
});
it("starving a red queue loses; finite safe signal control earns points", () => {
  const e = engine(),
    s = e.signalCreate();
  for (let i = 0; i < 1800 && !s.ended; i++) e.signalStep(s, false);
  expect(s.ended).toBe(true);
  expect(["queue", "waiting"]).toContain(s.reason);
  const controlled = e.signalCreate();
  for (let i = 0; i < 3000 && !controlled.ended; i++) {
    const clear = !controlled.cars.some((c) => c.pos > 40 && c.pos < 61);
    e.signalStep(controlled, clear && i % 90 === 0);
  }
  expect(controlled.score).toBeGreaterThan(10);
});
