import { describe, expect, it } from "vitest";
import {
  deadSquares,
  expandSolution,
  isWon,
  parseLevel,
  solve,
  stepPlayer,
} from "../../vendor/sokoban/upstream/src/sokoban";
import { LEVELS } from "../../vendor/sokoban/upstream/src/levels";

describe("locally playable Sokoban rules", () => {
  it("solves and replays every bundled original level", () => {
    expect(LEVELS).toHaveLength(6);
    for (const definition of LEVELS) {
      const level = parseLevel(definition.text);
      const result = solve(level);
      expect(result.gaveUp, definition.name).toBe(false);
      expect(result.pushes, definition.name).not.toBeNull();

      const steps = expandSolution(level, result.pushes!);
      let boxes = level.boxes.slice();
      let player = level.player;
      for (const cell of steps) {
        const direction = cell - player;
        const next = stepPlayer(level, boxes, player, direction);
        expect(next, definition.name).not.toBeNull();
        boxes = next!.boxes;
        player = next!.player;
      }
      expect(isWon(level, boxes), definition.name).toBe(true);
    }
  });

  it("marks a non-goal corner as dead and a goal as safe", () => {
    const level = parseLevel(`#####\n#@  #\n#$ .#\n#####`);
    const dead = deadSquares(level);
    const corner = 2 * level.width + 1;
    const goal = 2 * level.width + 3;
    expect(dead[corner]).toBe(true);
    expect(dead[goal]).toBe(false);
  });
});
