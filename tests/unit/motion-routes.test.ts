import { expect, it } from "vitest";
import { move, type Direction } from "../../src/games/merge/rules";
for (const direction of ["left", "right", "up", "down"] as Direction[]) {
  it(`2048 ${direction}: every source travels once and merged targets match rules`, () => {
    for (const board of [
      [2, 2, 2, 2, 0, 4, 0, 4, 8, 0, 8, 0, 0, 2, 4, 8],
      [0, 0, 0, 2, 4, 0, 0, 0, 0, 8, 0, 0, 0, 0, 16, 0],
    ]) {
      const result = move(board, direction);
      expect(result.travels.map((r) => r.from).sort((a, b) => a - b)).toEqual(
        board.flatMap((v, i) => (v ? [i] : [])),
      );
      for (let to = 0; to < 16; to++) {
        const sources = result.travels.filter((r) => r.to === to);
        expect(sources.reduce((sum, r) => sum + r.value, 0)).toBe(
          result.board[to],
        );
        expect(sources.length).toBeLessThanOrEqual(2);
        expect(result.merges.includes(to)).toBe(sources.length === 2);
        for (const route of sources) {
          if (direction === "left" || direction === "right")
            expect(Math.floor(route.from / 4)).toBe(Math.floor(to / 4));
          else expect(route.from % 4).toBe(to % 4);
        }
      }
    }
  });
}
