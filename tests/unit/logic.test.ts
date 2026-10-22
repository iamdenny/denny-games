import { describe, expect, it } from "vitest";
import {
  createPuzzle,
  neighbours,
  play,
  replay,
  solved,
  type Kind,
} from "../../src/games/logic/rules";
describe("original logic games", () => {
  for (const kind of ["lantern-grid", "number-trail"] as Kind[]) {
    it(`${kind}: all stages are deterministic, unfinished and solvable`, () => {
      for (const seed of ["normal", "daily-2026-10-22", "edge", "mobile"]) {
        for (let stage = 1; stage <= 24; stage++) {
          const puzzle = createPuzzle(kind, seed, stage);
          expect(createPuzzle(kind, seed, stage)).toEqual(puzzle);
          expect(solved(kind, puzzle.initial)).toBe(false);
          let cells = puzzle.initial;
          for (const index of puzzle.solution)
            cells = play(puzzle, cells, index)!;
          expect(solved(kind, cells)).toBe(true);
          if (kind === "number-trail")
            expect([...puzzle.initial].sort((a, b) => a - b)).toEqual(
              Array.from({ length: puzzle.size ** 2 }, (_, i) => i),
            );
        }
      }
    });
    it(`${kind}: validates saved actions`, () => {
      const puzzle = createPuzzle(kind, "save", 1);
      expect(replay(puzzle, [])).toEqual(puzzle.initial);
      for (const bad of [
        null,
        {},
        [-1],
        [999],
        [0.1],
        ["0"],
        new Array(2001).fill(0),
      ])
        expect(replay(puzzle, bad)).toBeUndefined();
      expect(replay(puzzle, puzzle.solution)).toEqual(playSolution(puzzle));
      expect(replay(puzzle, [...puzzle.solution, 0])).toBeUndefined();
    });
  }
  it("cross toggles do not wrap, and repeating a press cancels it", () => {
    expect(neighbours(0, 3)).toEqual([1, 3]);
    const p = createPuzzle("lantern-grid", "corner", 1);
    const blank = Array(9).fill(0);
    const changed = play(p, blank, 2)!;
    expect(changed).toEqual([0, 1, 1, 0, 0, 1, 0, 0, 0]);
    expect(play(p, changed, 2)).toEqual(blank);
  });
  it("sliding rejects non-adjacent moves and scales boards at stage 13", () => {
    const p = createPuzzle("number-trail", "slide", 1);
    const invalid = p.initial.findIndex(
      (_, i) => !neighbours(p.initial.indexOf(0), p.size).includes(i),
    );
    expect(play(p, p.initial, invalid)).toBeUndefined();
    expect(createPuzzle("number-trail", "x", 12).size).toBe(3);
    expect(createPuzzle("number-trail", "x", 13).size).toBe(4);
    expect(createPuzzle("lantern-grid", "x", 24).size).toBe(5);
  });
});
function playSolution(p: ReturnType<typeof createPuzzle>) {
  return p.solution.reduce((cells, i) => play(p, cells, i)!, p.initial);
}
