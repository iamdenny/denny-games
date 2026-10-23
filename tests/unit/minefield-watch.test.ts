import { it, expect } from "vitest";
import {
  fresh,
  reveal,
  flag,
  restore,
  neighbors,
} from "../../src/games/minefield-watch/engine";
it("first reveal and all neighbors safe in every stage", () => {
  for (let stage = 1; stage <= 3; stage++) {
    const s = reveal(fresh(stage, "seed"), 0);
    expect(s.mines.length).toBe([6, 9, 12][stage - 1]);
    for (const i of [0, ...neighbors(0, s.size)])
      expect(s.mines).not.toContain(i);
    expect(restore(s, stage, "seed")).toEqual(s);
  }
});
it("flags prevent accidental reveal and every safe cell wins", () => {
  let s = fresh(1, "a");
  s = flag(s, 0);
  expect(reveal(s, 0)).toBe(s);
  s = flag(s, 0);
  s = reveal(s, 0);
  for (let i = 0; i < 36; i++) if (!s.mines.includes(i)) s = reveal(s, i);
  expect(s.phase).toBe("won");
  expect(restore(s, 1, "a")).toEqual(s);
});
it("mine loses and malformed or altered saved mines rejected", () => {
  let s = reveal(fresh(2, "a"), 4);
  s = reveal(s, s.mines[0]!);
  expect(s.phase).toBe("lost");
  expect(restore(s, 2, "a")).toEqual(s);
  expect(restore({ ...s, first: NaN }, 2, "a")).toEqual(fresh(2, "a"));
  expect(restore({ ...s, mines: [0] }, 2, "a")).toEqual(fresh(2, "a"));
});
