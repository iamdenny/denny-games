import { describe, expect, it } from "vitest";
import { createMazeMotion } from "../../src/games/ember-maze";
import { create, step } from "../../src/games/ember-maze/rules";

describe("Ember Maze decorative motion", () => {
  it("moves by simulation time, independent of redraw count, and freezes on pause", () => {
    const s = create(1, "local");
    const motion = createMazeMotion();
    motion(s, true);
    s.actors[0]!.x++;
    s.time = 0.02;
    expect(motion(s, true).positions[0]!.x).toBe(1);
    s.time = 0.07;
    const midway = motion(s, true).positions[0]!.x;
    expect(midway).toBeGreaterThan(1);
    expect(midway).toBeLessThan(2);
    for (let n = 0; n < 100; n++)
      expect(motion(s, true).positions[0]!.x).toBe(midway);
    s.time = 0.14;
    expect(motion(s, true).positions[0]!.x).toBe(2);
  });

  it("settles immediately with effects disabled and resets on replacement state", () => {
    const s = create(1, "local");
    const motion = createMazeMotion();
    motion(s, true);
    s.actors[0]!.x = 3;
    expect(motion(s, false).positions[0]!.x).toBe(3);
    expect(motion(create(1, "local"), true).positions[0]!.x).toBe(1);
  });

  it("bounds debris, expires it in simulation time and does not mutate saves", () => {
    const s = create(1, "local");
    const motion = createMazeMotion();
    motion(s, true);
    s.tiles = s.tiles.map((tile) => (tile === 2 ? 0 : tile));
    const saved = JSON.stringify(s);
    const visual = motion(s, true);
    expect(visual.fragments.length).toBeGreaterThan(0);
    expect(visual.fragments.length).toBeLessThanOrEqual(120);
    expect(motion(s, true).fragments).toEqual(visual.fragments);
    expect(JSON.stringify(s)).toBe(saved);
    s.time = 0.43;
    expect(motion(s, true).fragments).toHaveLength(0);
  });

  it("observes real chain explosions without changing collisions or scores", () => {
    const s = create(1, "local");
    s.tiles[1 * 15 + 4] = 2;
    s.bombs = [
      { x: 1, y: 1, t: 0.01, owner: 0, range: 2 },
      { x: 3, y: 1, t: 2, owner: 1, range: 2 },
    ];
    const motion = createMazeMotion();
    motion(s, true);
    step(s, 1, 0.02, []);
    const after = structuredClone(s);
    expect(s.bombs).toHaveLength(0);
    expect(s.flames.some((f) => f.x === 4 && f.y === 1)).toBe(true);
    expect(motion(s, true).fragments.length).toBeGreaterThan(0);
    expect(s).toEqual(after);
    expect(motion(s, false).fragments).toHaveLength(0);
  });
});
