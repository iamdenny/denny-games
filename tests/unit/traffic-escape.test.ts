import { describe, it, expect } from "vitest";
import {
  fresh,
  move,
  undo,
  restore,
  solve,
  CARS,
  STAGES,
} from "../../src/games/traffic-escape/rules";
describe("Traffic Escape", () => {
  it("has twelve distinct original solvable layouts", () => {
    expect(STAGES).toHaveLength(12);
    expect(new Set(STAGES.map((s) => s.join(","))).size).toBe(12);
    for (let stage = 1; stage <= 12; stage++) {
      let s = fresh(stage);
      const path = solve(s);
      expect(path.length).toBeGreaterThan(0);
      for (const [car, dir] of path) {
        const next = move(s, car, dir);
        expect(next).not.toBe(s);
        s = next;
        expect(restore(s, stage)).toEqual(s);
      }
      expect(s.phase).toBe("won");
    }
  });
  it("rejects walls and collisions and undoes positions without refunding moves", () => {
    let s = fresh(1);
    const original = structuredClone(s);
    const [car, dir] = solve(s)[0]!;
    s = move(s, car, dir);
    expect(s.moves).toBe(1);
    s = undo(s);
    expect(s.positions).toEqual(original.positions);
    expect(s.moves).toBe(1);
    for (let i = 0; i < CARS.length; i++) {
      const n = move(s, i, -99);
      expect(n).toBe(s);
    }
  });
  it("rejects overlap, mismatched stage, malformed history and false victory", () => {
    const s = fresh(1);
    expect(restore({ ...s, phase: "won" }, 1)).toBeNull();
    expect(restore({ ...s, moves: Infinity }, 1)).toBeNull();
    expect(restore(s, 2)).toBeNull();
    expect(
      restore({ ...s, positions: s.positions.map(() => 0) }, 1),
    ).toBeNull();
    expect(restore({ ...s, history: [[99]] }, 1)).toBeNull();
  });
});
