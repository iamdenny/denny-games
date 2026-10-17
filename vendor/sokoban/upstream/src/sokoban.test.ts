import { describe, it, expect } from 'vitest';
import {
  parseLevel,
  isWon,
  deadSquares,
  playerRegion,
  solve,
  walkPath,
  expandSolution,
  stepPlayer,
  type Level,
} from './sokoban';
import { LEVELS } from './levels';

const L = (text: string): Level => parseLevel(text);

describe('parseLevel', () => {
  it('parses walls, goals, boxes, player', () => {
    const lv = L(`#####
#@$.#
#####`);
    expect(lv.width).toBe(5);
    expect(lv.height).toBe(3);
    expect(lv.player).toBe(6);
    expect(lv.boxes).toEqual([7]);
    expect(lv.goals[8]).toBe(true);
  });

  it('rejects box/goal count mismatch', () => {
    expect(() => L(`#####\n#@$ #\n#####`)).toThrow(/boxes but/);
  });

  it('handles * and + combined cells', () => {
    const lv = L(`######
#+*$ #
######`);
    expect(lv.goals[lv.player]).toBe(true);
    expect(lv.boxes).toHaveLength(2);
  });
});

describe('player movement (stepPlayer)', () => {
  const lv = L(`#####
#@$.#
#####`);
  it('walks into free floor', () => {
    const wide = L(`#####
#@  #
#####`);
    const r = stepPlayer(wide, wide.boxes, wide.player, 1)!;
    expect(r.player).toBe(wide.player + 1);
    expect(r.pushed).toBe(false);
  });
  it('pushes a box into free floor', () => {
    const r = stepPlayer(lv, lv.boxes, lv.player, 1)!;
    expect(r.pushed).toBe(true);
    expect(r.boxes).toEqual([8]);
    expect(isWon(lv, r.boxes)).toBe(true);
  });
  it('cannot push a box into a wall', () => {
    const blocked = L(`####
#@$#
#.##
####`);
    expect(stepPlayer(blocked, blocked.boxes, blocked.player, 1)).toBeNull();
  });
  it('cannot walk through walls', () => {
    expect(stepPlayer(lv, lv.boxes, lv.player, -5)).toBeNull();
  });
});

describe('dead squares (reverse pull BFS)', () => {
  it('non-goal corners are dead', () => {
    const lv = L(`#####
#   #
# $ #
#  .#
#@  #
#####`);
    const dead = deadSquares(lv);
    const idx = (r: number, c: number) => r * lv.width + c;
    expect(dead[idx(1, 1)]).toBe(true); // top-left floor corner
    expect(dead[idx(1, 3)]).toBe(true); // top-right floor corner
    expect(dead[idx(3, 3)]).toBe(false); // the goal itself is alive
    expect(dead[idx(2, 2)]).toBe(false); // open middle is alive
  });

  it('a wall-hugging edge with no goal on it is entirely dead', () => {
    const lv = L(`######
#    #
# $. #
#@   #
######`);
    const dead = deadSquares(lv);
    // top edge row (r=1): a box pushed against that wall can never leave it,
    // and the row has no goal — every floor cell there must be dead.
    for (let c = 1; c <= 4; c++) expect(dead[1 * lv.width + c]).toBe(true);
  });

  it('goals are never dead', () => {
    for (const def of LEVELS) {
      const lv = L(def.text);
      const dead = deadSquares(lv);
      for (let i = 0; i < lv.goals.length; i++) {
        if (lv.goals[i]) expect(dead[i]).toBe(false);
      }
    }
  });
});

describe('player region', () => {
  it('boxes block reachability; canon is the smallest reachable cell', () => {
    const lv = L(`#####
#@$ #
# #.#
#####`);
    const { reach, canon } = playerRegion(lv, lv.boxes, lv.player);
    expect(reach[lv.player]).toBe(true);
    expect(reach[lv.player + 1]).toBe(false); // the box cell itself isn't entered
    expect(canon).toBe(lv.player);
  });
});

describe('solver', () => {
  it('solves every bundled level, replay-verified', () => {
    for (const def of LEVELS) {
      const lv = L(def.text);
      const r = solve(lv);
      expect(r.pushes, `${def.name} should be solvable`).not.toBeNull();
      expect(r.gaveUp).toBe(false);
      // replay pushes directly on box sets
      let boxes = lv.boxes.slice();
      for (const p of r.pushes!) {
        expect(boxes).toContain(p.box);
        boxes = boxes.filter((b) => b !== p.box).concat(p.box + p.dir).sort((a, b) => a - b);
      }
      expect(isWon(lv, boxes), `${def.name} replay must win`).toBe(true);
    }
  });

  it('level 1 is a single push', () => {
    const r = solve(L(LEVELS[0].text));
    expect(r.pushes).toHaveLength(1);
  });

  it('proves a deadlocked level unsolvable (box in a dead corner)', () => {
    const lv = L(`#####
#$@ #
#. ##
#####`);
    // box already in the top-left non-goal corner: nothing can ever move it
    const r = solve(lv);
    expect(r.pushes).toBeNull();
    expect(r.gaveUp).toBe(false); // exhausted the space, not the budget: a proof
  });

  it('expandSolution produces a step-by-step walk that also wins', () => {
    for (const def of LEVELS) {
      const lv = L(def.text);
      const r = solve(lv);
      const steps = expandSolution(lv, r.pushes!);
      // simulate the steps with stepPlayer
      let boxes = lv.boxes.slice();
      let player = lv.player;
      for (const cell of steps) {
        const dir = cell - player;
        const res = stepPlayer(lv, boxes, player, dir);
        expect(res, `${def.name}: step into ${cell} must be legal`).not.toBeNull();
        boxes = res!.boxes;
        player = res!.player;
      }
      expect(isWon(lv, boxes)).toBe(true);
    }
  });
});

describe('walkPath', () => {
  it('routes around boxes', () => {
    const lv = L(`######
#@$  #
#  . #
######`);
    const path = walkPath(lv, lv.boxes, lv.player, lv.player + 2)!;
    expect(path[0]).toBe(lv.player);
    expect(path[path.length - 1]).toBe(lv.player + 2);
    expect(path).not.toContain(lv.boxes[0]); // detours below the box
  });

  it('returns null when walled off', () => {
    const lv = L(`#####
#@#.#
##$##
#####`);
    expect(walkPath(lv, lv.boxes, lv.player, lv.player + 2)).toBeNull();
  });
});
