import { describe, it, expect } from "vitest";
import { createBoard, isComplete, rotate } from "../../src/games/circuit/rules";
import { mergeLine, move, canMove } from "../../src/games/merge/rules";
import { createOrbit, advance, PADDLE_Y } from "../../src/games/orbit/rules";
import { dailySeed, validSeed } from "../../src/lib/random";
describe("Circuit Loop", () => {
  it("all thirty stages have a connected solution reachable by rotation across multiple seeds", () => {
    for (const seed of ["normal", "2026-10-11", "different"])
      for (let stage = 1; stage <= 30; stage++) {
        const board = createBoard(seed, stage);
        expect(isComplete(board.solved, board.size)).toBe(true);
        expect(isComplete(board.tiles, board.size)).toBe(false);
        for (let i = 0; i < board.tiles.length; i++) {
          let value = board.tiles[i]!;
          const variants = [];
          for (let n = 0; n < 4; n++) {
            variants.push(value);
            value = rotate(value);
          }
          expect(variants).toContain(board.solved[i]);
        }
        expect(createBoard(seed, stage)).toEqual(board);
      }
  });
  it("rejects an outward or disconnected connection", () => {
    const board = createBoard("normal", 1);
    const broken = [...board.solved];
    broken[0] = 1;
    expect(isComplete(broken, board.size)).toBe(false);
  });
});
describe("2048", () => {
  it("each tile merges at most once with the correct score", () => {
    expect(mergeLine([2, 2, 2, 2])).toEqual({ line: [4, 4, 0, 0], score: 8 });
    expect(mergeLine([4, 4, 8, 0])).toEqual({ line: [8, 8, 0, 0], score: 8 });
  });
  it("preserves input and supports vertical traversal", () => {
    const board = [2, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0];
    const result = move(board, "up");
    expect(result.board.filter(Boolean)).toEqual([4, 8]);
    expect(result.score).toBe(12);
    expect(board[4]).toBe(2);
    expect(move(result.board, "up").changed).toBe(false);
  });
  it("detects game over and a remaining merge", () => {
    expect(canMove([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2])).toBe(
      false,
    );
    expect(canMove(Array(16).fill(2))).toBe(true);
  });
});
describe("Orbit Break", () => {
  it("twelve distinct layouts are deterministic", () => {
    const layouts = new Set(
      Array.from({ length: 12 }, (_, i) =>
        JSON.stringify(
          createOrbit("daily", i + 1).bricks.map((b) => [b.x, b.y]),
        ),
      ),
    );
    expect(layouts.size).toBe(12);
    expect(createOrbit("daily", 4)).toEqual(createOrbit("daily", 4));
  });
  it("30 and 60 fps give equivalent fixed-substep simulation", () => {
    const a = createOrbit("seed", 1),
      b = structuredClone(a);
    a.launched = b.launched = true;
    for (let i = 0; i < 60; i++) advance(a, 1 / 60);
    for (let i = 0; i < 30; i++) advance(b, 1 / 30);
    expect(a.x).toBeCloseTo(b.x, 6);
    expect(a.y).toBeCloseTo(b.y, 6);
    expect(a.score).toBe(b.score);
  });
  it("miss loses one life and an unlaunched ball stays on the paddle", () => {
    const state = createOrbit("seed", 1);
    state.launched = true;
    state.y = 690;
    state.vy = 300;
    advance(state, 1 / 60);
    expect(state.lives).toBe(2);
    expect(state.launched).toBe(false);
    state.paddle = 80;
    advance(state, 20);
    expect(state.x).toBe(80);
    expect(state.y).toBe(PADDLE_Y - 18);
  });
});
it("UTC daily seed is timezone-independent and share seeds are bounded", () => {
  expect(dailySeed("2048", new Date("2026-10-12T00:30:00+09:00"))).toBe(
    "2048:v1:2026-10-11",
  );
  expect(validSeed("<script>")).toBeUndefined();
  expect(validSeed("x".repeat(101))).toBeUndefined();
});
