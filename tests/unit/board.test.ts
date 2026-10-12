import { describe, it, expect } from "vitest";
import {
  initial,
  legal,
  play,
  flips,
  boxEdges,
  restore,
  boardKinds,
  type Position,
} from "../../src/games/board/rules";
import { chooseMove } from "../../src/games/board/ai";
const blank = (kind: Position["kind"]) => {
  const s = initial(kind);
  s.cells.fill(0);
  return s;
};
describe("classic rules", () => {
  it("Gomoku wins on five, permits overlines and rejects occupied moves without mutation", () => {
    const s = blank("gomoku");
    for (const i of [105, 106, 107, 109, 110]) s.cells[i] = 1;
    const n = play(s, { to: 108 });
    expect(n.winner).toBe(1);
    expect(s.cells[108]).toBe(0);
    expect(play(n, { to: 108 })).toBe(n);
    const diagonal = blank("gomoku");
    for (const i of [0, 16, 32, 48]) diagonal.cells[i] = 1;
    expect(play(diagonal, { to: 64 }).winner).toBe(1);
  });
  it("does not wrap horizontal lines across rows", () => {
    const s = blank("gomoku");
    for (const i of [12, 13, 14, 15]) s.cells[i] = 1;
    expect(play(s, { to: 16 }).winner).toBe(0);
  });
  it("Four in a Row respects gravity, full columns and all winning axes", () => {
    let s = initial("four-in-a-row");
    expect(legal(s).map((m) => m.to)).toEqual([35, 36, 37, 38, 39, 40, 41]);
    expect(play(s, { to: 0 })).toBe(s);
    for (let i = 0; i < 6; i++)
      s = play(
        s,
        legal(s).find((m) => m.to % 7 === 0)!,
      );
    expect(legal(s).some((m) => m.to % 7 === 0)).toBe(false);
    for (const points of [
      [35, 36, 37],
      [35, 28, 21],
      [35, 29, 23],
    ]) {
      s = blank("four-in-a-row");
      for (const i of points) s.cells[i] = 1;
      const end = points[2]! + (points[1]! - points[0]!);
      for (let i = end + 7; i < 42; i += 7) if (!s.cells[i]) s.cells[i] = 2;
      expect(play(s, { to: end }).winner).toBe(1);
    }
  });
  it("Reversi flips multiple directions and excludes non-capturing moves", () => {
    const s = initial("reversi");
    expect(legal(s).map((m) => m.to)).toEqual([19, 26, 37, 44]);
    expect(play(s, { to: 0 })).toBe(s);
    expect(play(s, { to: 19 }).cells[27]).toBe(1);
    const multi = blank("reversi");
    for (const i of [25, 26, 35, 43]) multi.cells[i] = 2;
    multi.cells[24] = 1;
    multi.cells[51] = 1;
    expect(flips(multi, 27).sort((a, b) => a - b)).toEqual([25, 26, 35, 43]);
  });
  it("Reversi passes automatically and ends before a full board when neither can play", () => {
    const s = blank("reversi");
    s.cells.fill(1);
    s.cells[0] = 0;
    s.cells[1] = 2;
    s.cells[63] = 0;
    const n = play(s, { to: 0 });
    expect(n.winner).toBe(1);
    expect(n.cells[63]).toBe(0);
    const pass = blank("reversi");
    pass.cells.fill(1);
    pass.cells[0] = 0;
    pass.cells[1] = 2;
    pass.cells[7] = 0;
    pass.cells[6] = 2;
    const p = play(pass, { to: 0 });
    expect(p.winner).toBe(0);
    expect(p.turn).toBe(1);
    expect(legal(p)).toEqual([{ to: 7 }]);
  });
  it("checkers mandates captures and locks continued jumps to one piece", () => {
    const s = blank("checkers");
    s.cells[42] = 1;
    s.cells[35] = 2;
    s.cells[21] = 2;
    s.cells[56] = 1;
    s.cells[1] = 2;
    expect(legal(s)).toEqual([{ from: 42, to: 28 }]);
    const n = play(s, { from: 42, to: 28 });
    expect(n.turn).toBe(1);
    expect(n.forced).toBe(28);
    expect(n.cells[35]).toBe(0);
    expect(legal(n)).toEqual([{ from: 28, to: 14 }]);
    const end = play(n, { from: 28, to: 14 });
    expect(end.turn).toBe(2);
    expect(end.forced).toBe(-1);
    expect(end.cells[21]).toBe(0);
  });
  it("men cannot capture backward; kings can, and promotion stops the capture turn", () => {
    const s = blank("checkers");
    s.cells[28] = 1;
    s.cells[35] = 2;
    expect(legal(s).some((m) => m.to === 42)).toBe(false);
    s.cells[28] = 3;
    expect(legal(s)).toContainEqual({ from: 28, to: 42 });
    const crown = blank("checkers");
    crown.cells[17] = 1;
    crown.cells[10] = 2;
    crown.cells[12] = 2;
    const n = play(crown, { from: 17, to: 3 });
    expect(n.cells[3]).toBe(3);
    expect(n.turn).toBe(2);
    expect(n.forced).toBe(-1);
  });
  it("checkers detects no-move loss and the documented quiet-king draw", () => {
    const s = blank("checkers");
    s.cells[17] = 1;
    s.cells[10] = 2;
    const n = play(s, { from: 17, to: 3 });
    expect(n.winner).toBe(1);
    const q = blank("checkers");
    q.cells[56] = 3;
    q.cells[7] = 4;
    q.quiet = 79;
    expect(play(q, { from: 56, to: 49 }).winner).toBe(3);
  });
  it("Dots and Boxes grants extra turns and can finish two boxes at once", () => {
    const s = initial("dots-and-boxes");
    const shared = 21;
    for (const e of [...boxEdges(0), ...boxEdges(1)])
      if (e !== shared) s.cells[e] = 2;
    const n = play(s, { to: shared });
    expect(n.boxes.slice(0, 2)).toEqual([1, 1]);
    expect(n.turn).toBe(1);
    expect(s.boxes[0]).toBe(0);
    expect(play(n, { to: 2 }).turn).toBe(2);
  });
  it("Dots and Boxes scores its last box and draws tied games", () => {
    const s = initial("dots-and-boxes");
    s.cells.fill(1);
    s.cells[0] = 0;
    s.boxes = s.boxes.map((_, i) => (i === 0 ? 0 : i < 8 ? 1 : 2));
    const n = play(s, { to: 0 });
    expect(n.winner).toBe(3);
  });
  it("restores independent copies and rejects malformed board saves", () => {
    for (const kind of boardKinds) {
      const s = initial(kind),
        n = restore(kind, s)!;
      expect(n).toEqual(s);
      expect(n.cells).not.toBe(s.cells);
      expect(restore(kind, { ...s, cells: [NaN] })).toBeUndefined();
      expect(restore(kind, { ...s, turn: 7 })).toBeUndefined();
      expect(restore(kind, { ...s, boxes: null })).toBeUndefined();
    }
  });
});
describe("bounded board AI", () => {
  it("returns a legal move for each game and level without mutating the board", () => {
    for (const kind of boardKinds)
      for (const level of [1, 2, 3]) {
        const s = initial(kind),
          before = JSON.stringify(s),
          move = chooseMove(s, level);
        expect(legal(s)).toContainEqual(move);
        expect(JSON.stringify(s)).toBe(before);
      }
  });
  it("takes immediate wins and blocks a one-space forced loss at normal level", () => {
    const s = blank("four-in-a-row");
    for (const i of [35, 36, 37]) s.cells[i] = 1;
    expect(chooseMove(s, 2)?.to).toBe(38);
    s.cells = s.cells.map((v) => (v === 1 ? 2 : 0));
    expect(chooseMove(s, 2)?.to).toBe(38);
    const g = blank("gomoku");
    g.moves = 8;
    g.cells[104] = 1;
    for (const i of [105, 106, 107, 108]) g.cells[i] = 2;
    expect(chooseMove(g, 2)?.to).toBe(109);
  });
  it("prefers scoring a box over donating its last edge", () => {
    const s = initial("dots-and-boxes");
    for (const e of boxEdges(0).slice(0, 3)) s.cells[e] = 2;
    expect(chooseMove(s, 1)?.to).toBe(boxEdges(0)[3]);
  });
});

describe("full deterministic board journeys", () => {
  for (const kind of [
    "gomoku",
    "reversi",
    "four-in-a-row",
    "dots-and-boxes",
  ] as const)
    it(`${kind} can reach a terminal position through legal AI moves`, () => {
      let s = initial(kind);
      const max =
        kind === "gomoku"
          ? 225
          : kind === "reversi"
            ? 60
            : kind === "four-in-a-row"
              ? 42
              : 40;
      for (let i = 0; i < max && !s.winner; i++) {
        const move = chooseMove(s, 1);
        expect(move).toBeDefined();
        const before = s;
        s = play(s, move!);
        expect(s).not.toBe(before);
        expect(
          s.cells.every((v) => Number.isInteger(v) && v >= 0 && v <= 2),
        ).toBe(true);
      }
      expect(s.winner).not.toBe(0);
      expect(legal(s)).toEqual([]);
    });
});
