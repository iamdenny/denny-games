import { describe, it, expect } from "vitest";
import {
  create,
  launch,
  step,
  restore,
  BUMPERS,
  GOAL,
} from "../../src/games/star-pinball/rules";
describe("Star Pinball rules", () => {
  it("waits for a launch and advances through exactly three drained balls", () => {
    const s = create();
    step(s, 0.04);
    expect(s.phase).toBe("ready");
    for (let i = 1; i <= 3; i++) {
      launch(s);
      s.ball = { x: 200, y: 632, vx: 0, vy: 300 };
      step(s, 0.04);
      expect(s.number).toBe(i === 3 ? 3 : i + 1);
      expect(s.phase).toBe(i === 3 ? "lost" : "ready");
    }
    const snapshot = JSON.stringify(s);
    launch(s);
    step(s, 0.04);
    expect(JSON.stringify(s)).toBe(snapshot);
  });
  it("scores bumper contact once and separates the ball", () => {
    const s = create();
    launch(s);
    const b = BUMPERS[0]!;
    s.ball = { x: b.x, y: b.y + 32, vx: 0, vy: -200 };
    step(s, 0.01);
    expect(s.score).toBe(100);
    step(s, 0.01);
    expect(s.score).toBe(100);
  });
  it("moving flippers return a descending ball toward the targets", () => {
    const s = create();
    launch(s);
    s.lane = false;
    s.ball = { x: 150, y: 523, vx: 0, vy: 180 };
    for (let i = 0; i < 8; i++) step(s, 0.008, true, false);
    expect(s.ball.vy).toBeLessThan(0);
    expect(s.left).toBeGreaterThan(0);
  });
  it("lights three distinct targets and pays one bank bonus", () => {
    const s = create();
    launch(s);
    s.lane = false;
    for (let i = 0; i < 3; i++) {
      s.ball = { x: 105 + i * 95, y: 94, vx: 0, vy: -250 };
      step(s, 0.04);
    }
    expect(s.score).toBe(1100);
    expect(s.targets).toEqual([false, false, false]);
    expect(s.hits).toBe(3);
  });
  it("rejects noncanonical waiting and terminal snapshots", () => {
    const s = create();
    expect(restore({ ...s, ball: { ...s.ball, x: 200 } })).toBeNull();
    const end = {
      ...s,
      phase: "lost",
      number: 3,
      ball: { x: 200, y: 630, vx: 0, vy: 0 },
    };
    expect(restore(end)).not.toBeNull();
    expect(restore({ ...end, ball: { ...end.ball, vy: 10 } })).toBeNull();
    expect(restore({ ...end, ball: { ...end.ball, y: 550 } })).toBeNull();
  });
  it("caps stalled frames, rejects invalid saves and deep copies valid state", () => {
    const s = create();
    launch(s);
    step(s, 999);
    expect(s.time).toBeCloseTo(0.04);
    const copy = restore(s)!;
    expect(copy).toEqual(s);
    copy.ball.x = 10;
    expect(s.ball.x).not.toBe(10);
    for (const bad of [
      { ...s, number: 4 },
      { ...s, score: NaN },
      { ...s, phase: "won" },
      { ...s, ball: { ...s.ball, vx: Infinity } },
      { ...s, targets: [true] },
    ])
      expect(restore(bad)).toBeNull();
  });
  it("can reach the goal with timed flippers through actual launch and physics", () => {
    const s = create();
    for (let i = 0; i < 60000 && !["won", "lost"].includes(s.phase); i++) {
      if (s.phase === "ready") launch(s);
      step(
        s,
        0.008,
        s.score < GOAL && s.ball.y > 440 && s.ball.x < 220,
        s.score < GOAL && s.ball.y > 440 && s.ball.x > 180,
      );
      if (i % 200 === 0) expect(restore(s)).not.toBeNull();
    }
    expect(s.score).toBeGreaterThanOrEqual(GOAL);
    expect(s.phase).toBe("won");
  });
});
