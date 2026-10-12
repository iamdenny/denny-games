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
  const trail: { x: number; y: number }[] = [];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const effects = () =>
    !reducedMotion.matches && !ctx.host.closest("#player.low-effects");
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
  const background = g.createLinearGradient(0, 0, 0, HEIGHT);
  background.addColorStop(0, "#172d3c");
  background.addColorStop(1, "#101c2b");
  function rounded(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) {
    g.beginPath();
    g.moveTo(x + radius, y);
    g.arcTo(x + width, y, x + width, y + height, radius);
    g.arcTo(x + width, y + height, x, y + height, radius);
    g.arcTo(x, y + height, x, y, radius);
    g.arcTo(x, y, x + width, y, radius);
    g.closePath();
  }
  const launch = document.createElement("button");
  launch.type = "button";
  launch.className = "launch-button";
  launch.textContent = ctx.locale === "ko" ? "공 발사" : "Launch ball";
  const note = document.createElement("p");
  note.className = "board-note";
  const actions = document.createElement("div");
  actions.className = "game-actions";
  actions.append(launch, note);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(actions);
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
    g.fillStyle = background;
    g.fillRect(0, 0, WIDTH, HEIGHT);
    // Quiet, stationary guide dots keep the playfield readable.
    g.fillStyle = "#ffffff12";
    for (let x = 24; x < WIDTH; x += 32) {
      for (let y = 26; y < 620; y += 32) g.fillRect(x, y, 2, 2);
    }
    for (const brick of state.bricks) {
      if (!brick.alive) continue;
      g.fillStyle = "#080f1c80";
      rounded(brick.x, brick.y + 4, 64, 24, 7);
      g.fill();
      g.fillStyle = ["#a7f0e6", "#ffad94", "#e1ed8b", "#d2dfff"][brick.color]!;
      rounded(brick.x, brick.y, 64, 24, 7);
      g.fill();
      g.fillStyle = "#ffffff70";
      rounded(brick.x + 6, brick.y + 3, 52, 3, 1.5);
      g.fill();
    }
    if (effects())
      trail.forEach((point, i) => {
        g.fillStyle = `rgba(167,240,230,${((i + 1) / trail.length) * 0.25})`;
        g.beginPath();
        g.arc(
          point.x,
          point.y,
          (BALL * (i + 1)) / trail.length,
          0,
          Math.PI * 2,
        );
        g.fill();
      });
    g.fillStyle = "#a7f0e6";
    rounded(state.paddle - PADDLE_W / 2, PADDLE_Y, PADDLE_W, 12, 6);
    g.fill();
    g.fillStyle = "#ffffffa0";
    rounded(
      state.paddle - PADDLE_W / 2 + 12,
      PADDLE_Y + 2,
      PADDLE_W - 24,
      3,
      1.5,
    );
    g.fill();
    g.fillStyle = "#f5f2e9";
    g.beginPath();
    g.arc(state.x, state.y, BALL, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffffff08";
    g.fillRect(0, 630, WIDTH, 50);
    g.fillStyle = "#bdccd9";
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
    if (effects() && state.launched) {
      trail.push({ x: state.x, y: state.y });
      if (trail.length > 8) trail.shift();
    } else trail.length = 0;
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
    trail.length = 0;
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
      trail.length = 0;
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
      actions.remove();
      ctx.host.replaceChildren();
    },
  };
};
