import { describe, it, expect } from "vitest";
import {
  clamp,
  create,
  serve,
  step,
  point,
  restore,
} from "../../src/games/pocket-pingpong/rules";
describe("Pocket Table Tennis rules", () => {
  it("serves from the paddle and bounces on the receiving half before return", () => {
    const s = create();
    s.paddle = 0.4;
    serve(s);
    expect(s.ball.x).toBe(0.4);
    for (let i = 0; i < 35; i++) step(s, 0.04);
    expect(s.bounce).toBe(1);
    expect(s.ball.y).toBeLessThan(0.23);
    expect(s.phase).toBe("rally");
  });
  it("requires alignment and makes the smash narrower and faster", () => {
    const s = create();
    serve(s);
    s.ball = { x: 0.5, y: 0.99, vx: 0, vy: 0.8 };
    s.paddle = 0.61;
    s.shot = "smash";
    step(s, 0.04);
    expect(s.points).toEqual([0, 1]);
    serve(s);
    s.paddle = 0.5;
    s.ball = { x: 0.5, y: 0.99, vx: 0, vy: 0.8 };
    step(s, 0.04);
    expect(s.ball.vy).toBe(-1.35);
    expect(s.rally).toBe(1);
  });
  it("awards out balls to the receiver and missed AI returns to the player", () => {
    const s = create();
    serve(s);
    s.ball = { x: 0.99, y: 0.5, vx: 1, vy: -1 };
    step(s, 0.04);
    expect(s.points).toEqual([0, 1]);
    serve(s);
    s.ai = 0.9;
    s.ball = { x: 0.1, y: 0.01, vx: 0, vy: -1 };
    step(s, 0.04);
    expect(s.points).toEqual([1, 1]);
  });
  it("wins three first-to-five matches and ends the league", () => {
    const s = create();
    for (let opponent = 0; opponent < 3; opponent++) {
      for (let p = 0; p < 5; p++) {
        serve(s);
        point(s, true);
      }
      expect(s.phase).toBe(opponent === 2 ? "won" : "between");
      if (opponent < 2) serve(s);
    }
    expect(s.opponent).toBe(2);
    expect(s.score).toBe(1500);
    expect(restore(s)).toEqual(s);
  });
  it("can win the whole league through finite-speed paddle input and timed smash rallies", () => {
    const s = create();
    s.shot = "smash";
    for (
      let frame = 0;
      frame < 20000 && !["won", "lost"].includes(s.phase);
      frame++
    ) {
      if (s.phase !== "rally") serve(s);
      const landing = clamp(
        s.ball.x +
          s.ball.vx * Math.max(0, (1 - s.ball.y) / Math.abs(s.ball.vy)),
        0,
        1,
      );
      const target = clamp(
        landing + (s.rally % 2 ? 0.065 : -0.065),
        0.07,
        0.93,
      );
      const before = s.paddle;
      step(s, 0.02, clamp((target - s.paddle) / (0.9 * 0.02), -1, 1));
      expect(Math.abs(s.paddle - before)).toBeLessThanOrEqual(
        0.9 * 0.02 + 1e-12,
      );
    }
    expect(s.phase).toBe("won");
    expect(s.opponent).toBe(2);
    expect(s.score).toBeGreaterThan(1500);
  });
  it("loses at five and does not score again after the match", () => {
    const s = create();
    for (let p = 0; p < 5; p++) {
      serve(s);
      point(s, false);
    }
    point(s, true);
    expect(s.phase).toBe("lost");
    expect(s.points).toEqual([0, 5]);
  });
  it("restores a detached snapshot and rejects invalid league/physics state", () => {
    const s = create();
    serve(s);
    const copy = restore(s)!;
    copy.ball.x = 0.2;
    copy.points[0] = 2;
    expect(s.ball.x).toBe(0.5);
    expect(s.points[0]).toBe(0);
    for (const bad of [
      { ...s, opponent: 3 },
      { ...s, phase: "won" },
      { ...s, ball: { ...s.ball, vx: Infinity } },
      { ...s, points: [5, 5] },
      { ...s, ball: { ...s.ball, vy: 0 } },
    ])
      expect(restore(bad)).toBeNull();
  });
});
