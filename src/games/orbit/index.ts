import type { GameFactory } from "../../lib/types";
import {
  createOrbit,
  advance,
  WIDTH,
  HEIGHT,
  PADDLE_Y,
  PADDLE_W,
  BALL,
  type OrbitState,
} from "./rules";
export const mount: GameFactory = (ctx) => {
  let state = createOrbit(ctx.seed, ctx.stage);
  const saved = ctx.saved as Partial<OrbitState> | undefined;
  if (
    saved &&
    ["x", "y", "vx", "vy", "paddle", "lives", "score"].every((key) =>
      Number.isFinite(saved[key as keyof OrbitState]),
    ) &&
    Array.isArray(saved.bricks) &&
    saved.bricks.length === state.bricks.length &&
    saved.bricks.every(
      (v, i) =>
        v &&
        v.x === state.bricks[i]?.x &&
        v.y === state.bricks[i]?.y &&
        typeof v.alive === "boolean",
    )
  ) {
    state = {
      ...state,
      ...saved,
      bricks: saved.bricks.map((v) => ({ ...v })),
      launched: Boolean(saved.launched),
    } as OrbitState;
    state.paddle = Math.max(
      PADDLE_W / 2,
      Math.min(WIDTH - PADDLE_W / 2, state.paddle),
    );
    state.lives = Math.max(0, Math.min(3, state.lives));
  }
  let active = false,
    ended = false,
    frame = 0,
    previous = 0,
    lastScore = state.score;
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.tabIndex = 0;
  canvas.className = "orbit-canvas";
  canvas.setAttribute(
    "aria-label",
    ctx.locale === "ko"
      ? "벽돌깨기 게임판. 아래 조작 띠를 드래그하세요."
      : "Brick breaker board. Drag in the lower control strip.",
  );
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas2D unavailable");
  const g = context;
  const launch = document.createElement("button");
  launch.type = "button";
  launch.className = "launch-button";
  launch.textContent = ctx.locale === "ko" ? "공 발사" : "Launch ball";
  const note = document.createElement("p");
  note.className = "board-note";
  ctx.host.append(canvas, launch, note);
  const serve = () => {
    if (active && !state.launched) {
      state.launched = true;
      ctx.sound();
    }
  };
  const point = (event: PointerEvent) => {
    if (!active) return;
    const rect = canvas.getBoundingClientRect();
    state.paddle = Math.max(
      PADDLE_W / 2,
      Math.min(
        WIDTH - PADDLE_W / 2,
        ((event.clientX - rect.left) / rect.width) * WIDTH,
      ),
    );
  };
  const down = (event: PointerEvent) => {
    canvas.setPointerCapture(event.pointerId);
    point(event);
    serve();
  };
  const pointer = (event: PointerEvent) => {
    if (event.buttons) point(event);
  };
  launch.addEventListener("click", serve);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", pointer);
  function render() {
    g.fillStyle = "#17211d";
    g.fillRect(0, 0, WIDTH, HEIGHT);
    g.strokeStyle = "#2e3b33";
    g.lineWidth = 1;
    for (let x = 0; x < WIDTH; x += 40) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, HEIGHT);
      g.stroke();
    }
    for (const brick of state.bricks) {
      if (!brick.alive) continue;
      g.fillStyle = ["#a7f0e6", "#ef896b", "#d9ed68", "#f5f2e9"][brick.color]!;
      g.fillRect(brick.x, brick.y, 64, 24);
    }
    g.fillStyle = "#a7f0e6";
    g.fillRect(state.paddle - PADDLE_W / 2, PADDLE_Y, PADDLE_W, 12);
    g.fillStyle = "#f5f2e9";
    g.beginPath();
    g.arc(state.x, state.y, BALL, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#27372f";
    g.fillRect(0, 630, WIDTH, 50);
    g.fillStyle = "#c5d2c7";
    g.font = "16px system-ui";
    g.textAlign = "center";
    g.fillText(
      ctx.locale === "ko"
        ? "이곳에서 좌우로 드래그하세요"
        : "DRAG LEFT / RIGHT HERE",
      WIDTH / 2,
      660,
    );
    note.textContent = `${ctx.locale === "ko" ? "남은 기회" : "Lives"}: ${state.lives} · ${state.bricks.filter((v) => v.alive).length} ${ctx.locale === "ko" ? "벽돌" : "bricks"}`;
    launch.disabled = !active || state.launched;
  }
  function check() {
    if (!ended && (state.lives <= 0 || state.bricks.every((v) => !v.alive))) {
      ended = true;
      active = false;
      ctx.onEnd({ score: state.score, won: state.lives > 0 });
    }
  }
  function tick(now: number) {
    if (!active) return;
    if (
      ctx.host.closest("#player.low-effects") &&
      previous &&
      now - previous < 32
    ) {
      frame = requestAnimationFrame(tick);
      return;
    }
    advance(state, previous ? (now - previous) / 1000 : 0);
    previous = now;
    if (state.score !== lastScore) {
      lastScore = state.score;
      ctx.onChange(state.score);
      ctx.sound();
    }
    render();
    check();
    if (active) frame = requestAnimationFrame(tick);
  }
  function run() {
    if (ended || active) return;
    active = true;
    previous = 0;
    check();
    render();
    if (active) frame = requestAnimationFrame(tick);
  }
  function stop() {
    active = false;
    previous = 0;
    cancelAnimationFrame(frame);
    render();
  }
  render();
  ctx.onChange(state.score);
  return {
    start: run,
    pause: stop,
    resume: run,
    restart() {
      stop();
      state = createOrbit(ctx.seed, ctx.stage);
      ended = false;
      lastScore = 0;
      ctx.onChange(0);
      run();
    },
    action(action) {
      if (!active) return;
      if (action === "confirm") serve();
      else if (action === "left" || action === "right")
        state.paddle = Math.max(
          PADDLE_W / 2,
          Math.min(
            WIDTH - PADDLE_W / 2,
            state.paddle + (action === "left" ? -22 : 22),
          ),
        );
    },
    serialize: () => structuredClone(state),
    destroy() {
      stop();
      launch.removeEventListener("click", serve);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", pointer);
      ctx.host.replaceChildren();
    },
  };
};
