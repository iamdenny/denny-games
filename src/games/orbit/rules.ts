import { random } from "../../lib/random";
export interface Brick {
  x: number;
  y: number;
  alive: boolean;
  color: number;
}
export interface OrbitState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  paddle: number;
  launched: boolean;
  lives: number;
  score: number;
  bricks: Brick[];
}
export const WIDTH = 640,
  HEIGHT = 680,
  PADDLE_Y = 590,
  PADDLE_W = 104,
  BALL = 8;
export function createOrbit(seed: string, stage: number): OrbitState {
  const rng = random(`${seed}:stage:${stage}`);
  const bricks: Brick[] = [];
  for (let row = 0; row < 4 + (stage % 3); row++)
    for (let col = 0; col < 8; col++) {
      const skip =
        stage % 4 === 1
          ? row % 2 === 1 && col % 3 === 1
          : stage % 4 === 2
            ? Math.abs(col - 3.5) > 4 - row * 0.45
            : stage % 4 === 3
              ? (col + row) % 5 === 0
              : false;
      if (!skip)
        bricks.push({
          x: 25 + col * 74,
          y: 64 + row * 35,
          alive: true,
          color: Math.floor(rng() * 4),
        });
    }
  return {
    x: 320,
    y: PADDLE_Y - 18,
    vx: 110,
    vy: -300 - stage * 4,
    paddle: 320,
    launched: false,
    lives: 3,
    score: 0,
    bricks,
  };
}
// Fixed-size substeps prevent ball tunnelling and keep 30/60fps timing consistent.
export function advance(state: OrbitState, elapsed: number): void {
  if (!state.launched) {
    state.x = state.paddle;
    state.y = PADDLE_Y - 18;
    return;
  }
  let remaining = Math.min(0.1, Math.max(0, elapsed));
  while (remaining > 0 && state.launched) {
    const dt = Math.min(1 / 120, remaining);
    remaining -= dt;
    const previousY = state.y;
    state.x += state.vx * dt;
    state.y += state.vy * dt;
    if (state.x < BALL || state.x > WIDTH - BALL) {
      state.x = Math.max(BALL, Math.min(WIDTH - BALL, state.x));
      state.vx *= -1;
    }
    if (state.y < BALL) {
      state.y = BALL;
      state.vy = Math.abs(state.vy);
    }
    if (
      state.vy > 0 &&
      previousY + BALL <= PADDLE_Y &&
      state.y + BALL >= PADDLE_Y &&
      Math.abs(state.x - state.paddle) <= PADDLE_W / 2 + BALL
    ) {
      const ratio = Math.max(
        -1,
        Math.min(1, (state.x - state.paddle) / (PADDLE_W / 2)),
      );
      const speed = Math.min(480, Math.hypot(state.vx, state.vy) + 4);
      state.vx = ratio * speed * 0.82;
      state.vy = -Math.sqrt(speed * speed - state.vx * state.vx);
      state.y = PADDLE_Y - BALL;
    }
    for (const brick of state.bricks) {
      if (
        !brick.alive ||
        state.x + BALL < brick.x ||
        state.x - BALL > brick.x + 64 ||
        state.y + BALL < brick.y ||
        state.y - BALL > brick.y + 24
      )
        continue;
      brick.alive = false;
      state.score += 100;
      if (previousY + BALL <= brick.y || previousY - BALL >= brick.y + 24)
        state.vy *= -1;
      else state.vx *= -1;
      break;
    }
    if (state.y > HEIGHT) {
      state.lives--;
      state.launched = false;
      state.vy = -Math.abs(state.vy);
    }
  }
}
