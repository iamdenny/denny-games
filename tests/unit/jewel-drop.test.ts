import { describe, it, expect } from "vitest";
import {
  fits,
  fresh,
  restore,
  matches,
  settle,
  move,
  drop,
  rotate,
} from "../../src/games/jewel-drop/engine";
describe("Jewel Drop", () => {
  it("unions intersecting and diagonal lines", () => {
    const b = Array(72).fill(0);
    for (const i of [55, 61, 67, 66, 68]) b[i] = 1;
    expect(matches(b)).toEqual([55, 61, 66, 67, 68]);
    const d = Array(72).fill(0);
    d[56] = d[63] = d[70] = 2;
    expect(matches(d)).toEqual([56, 63, 70]);
  });
  it("settles gravity and chains", () => {
    const b = Array(72).fill(0);
    b[66] = b[67] = b[68] = 1;
    b[60] = 2;
    b[49] = 2;
    b[44] = 2;
    const r = settle(b);
    expect(r.cleared).toBe(6);
    expect(r.chain).toBe(2);
    expect(r.board.every((v) => v === 0)).toBe(true);
  });
  it("rotates cyclically and hard drops without overlaps", () => {
    let s = fresh(7);
    const a = [...s.falling];
    s = rotate(s);
    expect(s.falling).toEqual([a[2], a[0], a[1]]);
    s = drop(s);
    expect(s.pieces).toBe(1);
    expect(s.board.filter(Boolean).length).toBe(3);
    expect(restore(s)).toEqual(s);
  });
  it("blocks walls and tops out at occupied spawn", () => {
    let s = fresh(1);
    s.x = 0;
    expect(move(s, -1)).toBe(s);
    s.x = 2;
    for (let y = 3; y < 12; y++) s.board[y * 6 + 2] = (y % 5) + 1;
    s.pieces = 3;
    s.falling = [1, 2, 3];
    s = drop(s);
    expect(s.phase).toBe("lost");
    expect(restore(s)).toEqual(s);
  });
  it("wins with 60 cleared gems", () => {
    let s = fresh(4);
    s.cleared = 57;
    s.score = 570;
    s.pieces = 19;
    s.falling = [2, 2, 2];
    s = drop(s);
    expect(s.phase).toBe("won");
    expect(s.cleared).toBe(60);
    expect(restore(s)).toEqual(s);
  });
  it("rejects malformed, overlapping and impossible terminal saves", () => {
    const base = fresh();
    for (const bad of [
      { ...base, score: Infinity },
      { ...base, phase: "won" },
      { ...base, board: [0] },
      { ...base, falling: [9, 1, 2] },
      { ...base, y: NaN },
      { ...base, rng: -1 },
      { ...base, phase: "lost" },
    ])
      expect(restore(bad)).toEqual(base);
    const overlap = structuredClone(base);
    overlap.board[2] = 1;
    expect(restore(overlap)).toEqual(base);
  });
  it("persists deterministic random state and speed progression", () => {
    let s = fresh(99);
    for (let i = 0; i < 6 && s.phase === "play"; i++) {
      s = move(s, i % 2 ? 1 : -1);
      s = drop(s);
      expect(drop(restore(s))).toEqual(drop(s));
    }
  });
});
it("a finite placement strategy can reach the campaign goal with valid saves", () => {
  let s = fresh(1837);
  for (let turn = 0; turn < 100 && s.phase === "play"; turn++) {
    let best = s,
      bestValue = -Infinity;
    for (let x = 0; x < 6; x++)
      for (let r = 0; r < 3; r++) {
        let candidate = { ...s, x };
        if (!fits(candidate)) continue;
        for (let i = 0; i < r; i++) candidate = rotate(candidate);
        candidate = drop(candidate);
        let height = 0;
        for (let col = 0; col < 6; col++) {
          const top = candidate.board.findIndex(
            (v, i) => i % 6 === col && v > 0,
          );
          if (top >= 0) height += (12 - Math.floor(top / 6)) ** 2;
        }
        const value =
          (candidate.cleared - s.cleared) * 100 -
          height -
          (candidate.phase === "lost" ? 10000 : 0);
        if (value > bestValue) {
          bestValue = value;
          best = candidate;
        }
      }
    s = best;
    expect(restore(s)).toEqual(s);
  }
  expect(s.phase).toBe("won");
});
