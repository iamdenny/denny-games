import { it, expect } from "vitest";
import {
  puzzles,
  clues,
  solutions,
  fresh,
  mark,
  restore,
} from "../../src/games/mosaic-mystery/engine";
it("all twelve original puzzles have exactly one clue solution", () => {
  expect(puzzles).toHaveLength(12);
  for (const p of puzzles) expect(solutions(p), p.name[0]).toBe(1);
});
it("marks toggle and exact filled solution wins; crossmarks optional", () => {
  for (let stage = 1; stage <= 12; stage++) {
    let s = fresh(stage);
    const p = puzzles[stage - 1]!;
    for (let i = 0; i < p.cells.length; i++) if (p.cells[i]) s = mark(s, i, 1);
    expect(s.phase).toBe("won");
    expect(restore(s, stage)).toEqual(s);
  }
});
it("clues separate runs and malformed terminal saves rejected", () => {
  expect(clues([1, 1, 0, 1, 0])).toEqual([2, 1]);
  expect(clues([0, 0])).toEqual([0]);
  expect(restore({ ...fresh(1), phase: "won" }, 1)).toEqual(fresh(1));
  expect(restore({ ...fresh(1), marks: [NaN] }, 1)).toEqual(fresh(1));
});
