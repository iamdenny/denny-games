import type { Action, GameContext, GameInstance } from "../../lib/types";
export type Input = {
  held: Set<string>;
  taps: Set<string>;
  pointer?: { x: number; y: number; down: boolean };
};
export interface ArcadeState {
  score: number;
  status: "playing" | "won" | "lost";
}
export interface ArcadeConfig<S extends ArcadeState> {
  width: number;
  height: number;
  title: string;
  controls: { id: string; label: string; keys: string[] }[];
  create: () => S;
  restore: (v: unknown) => S;
  update: (s: S, dt: number, input: Input) => void;
  draw: (g: CanvasRenderingContext2D, s: S, quiet: boolean) => void;
  status: (s: S) => string;
  action?: (a: Action) => string;
  pointer?: boolean;
}
export function arcade<S extends ArcadeState>(
  ctx: GameContext,
  c: ArcadeConfig<S>,
): GameInstance {
  let s = c.restore(ctx.saved),
    active = false,
    dead = false,
    reported = false,
    frame = 0,
    last = 0,
    oldScore = s.score;
  const input: Input = { held: new Set(), taps: new Set() };
  const root = document.createElement("section");
  root.className = "retro-b-stage";
  root.style.cssText =
    "width:100%;height:100%;min-height:0;display:flex;flex-direction:column;align-items:center;background:#101c31;color:#f2f7ff;overflow:hidden";
  const canvas = document.createElement("canvas");
  canvas.width = c.width;
  canvas.height = c.height;
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-label", c.title);
  canvas.style.cssText =
    "display:block;max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain;min-height:0;touch-action:none";
  const label = document.createElement("p");
  label.setAttribute("role", "status");
  label.style.cssText =
    "margin:0;padding:6px 10px;text-align:center;font-size:13px;line-height:1.35";
  root.append(canvas);
  ctx.host.append(root);
  const controls = document.createElement("div");
  controls.style.cssText =
    "display:flex;flex-wrap:wrap;justify-content:center;gap:6px;padding:5px";
  controls.dataset.retroControls = "true";
  const ctrlRoot = ctx.controlsHost ?? root;
  ctrlRoot.append(label, controls);
  const abort = new AbortController(),
    opts = { signal: abort.signal };
  const keyMap = new Map(
    c.controls.flatMap((x) => x.keys.map((k) => [k, x.id] as const)),
  );
  function clear() {
    input.held.clear();
    input.taps.clear();
    input.pointer = undefined;
  }
  function press(id: string) {
    if (!active) return;
    input.pointer = undefined;
    input.held.add(id);
    input.taps.add(id);
  }
  for (const spec of c.controls) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = spec.label;
    b.dataset.retroAction = spec.id;
    b.style.cssText =
      "min-width:48px;min-height:44px;border:1px solid #9eabb9;border-radius:10px;padding:8px 14px;font:inherit;background:#f5f7fa;color:#16243a;touch-action:none";
    b.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault();
        b.setPointerCapture(e.pointerId);
        press(spec.id);
      },
      opts,
    );
    b.addEventListener("pointerup", () => input.held.delete(spec.id), opts);
    b.addEventListener("pointercancel", () => input.held.delete(spec.id), opts);
    b.addEventListener(
      "lostpointercapture",
      () => input.held.delete(spec.id),
      opts,
    );
    b.addEventListener(
      "click",
      (e) => {
        if (e.detail === 0 && active) {
          input.pointer = undefined;
          input.taps.add(spec.id);
        }
      },
      opts,
    );
    controls.append(b);
  }
  function key(e: KeyboardEvent, down: boolean) {
    if (
      e.target instanceof HTMLElement &&
      (e.target.matches("input,select,textarea") ||
        (["Enter", "Space"].includes(e.code) && e.target.closest("button,a")))
    )
      return;
    const id = keyMap.get(e.code);
    if (!id || !active) return;
    e.preventDefault();
    input.pointer = undefined;
    if (down) {
      if (!e.repeat) input.taps.add(id);
      input.held.add(id);
    } else input.held.delete(id);
  }
  document.addEventListener("keydown", (e) => key(e, true), opts);
  document.addEventListener("keyup", (e) => key(e, false), opts);
  window.addEventListener("blur", stop, opts);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
    },
    opts,
  );
  function point(e: PointerEvent, down: boolean) {
    const r = canvas.getBoundingClientRect(),
      scale = Math.min(r.width / c.width, r.height / c.height),
      ox = (r.width - c.width * scale) / 2,
      oy = (r.height - c.height * scale) / 2;
    input.pointer = {
      x: Math.max(0, Math.min(c.width, (e.clientX - r.left - ox) / scale)),
      y: Math.max(0, Math.min(c.height, (e.clientY - r.top - oy) / scale)),
      down,
    };
  }
  if (c.pointer) {
    canvas.addEventListener(
      "pointerdown",
      (e) => {
        if (!active) return;
        canvas.setPointerCapture(e.pointerId);
        point(e, true);
        input.taps.add("pointer");
      },
      opts,
    );
    canvas.addEventListener(
      "pointermove",
      (e) => {
        if (active) point(e, e.buttons !== 0);
      },
      opts,
    );
    canvas.addEventListener("pointerup", (e) => point(e, false), opts);
    canvas.addEventListener(
      "pointerleave",
      () => {
        if (!input.pointer?.down) input.pointer = undefined;
      },
      opts,
    );
    canvas.addEventListener(
      "pointercancel",
      () => {
        input.pointer = undefined;
      },
      opts,
    );
    canvas.addEventListener(
      "lostpointercapture",
      () => {
        input.pointer = undefined;
      },
      opts,
    );
  }
  const g = canvas.getContext("2d");
  if (!g)
    throw Error(
      ctx.locale === "ko"
        ? "게임 화면을 열 수 없어요"
        : "Game canvas is unavailable",
    );
  const quiet = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !!root.closest(".low-effects") ||
    document.documentElement.dataset.effects === "low" ||
    document.documentElement.dataset.lowEffects === "true";
  function render() {
    c.draw(g!, s, quiet());
    const message = c.status(s);
    if (label.textContent !== message) label.textContent = message;
    root.dataset.status = s.status;
    root.dataset.score = String(s.score);
  }
  function end(restored = false) {
    if (s.status === "playing" || reported) return;
    reported = true;
    active = false;
    clear();
    ctx.onEnd({
      score: s.score,
      won: s.status === "won",
      message: c.status(s),
      ...(restored ? { restored: true } : {}),
    });
  }
  function stop() {
    active = false;
    clear();
    last = 0;
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function run() {
    if (!frame && !dead && active) frame = requestAnimationFrame(tick);
  }
  function tick(now: number) {
    frame = 0;
    if (dead) return;
    if (active && s.status === "playing") {
      const dt = last ? Math.min(0.035, (now - last) / 1000) : 0;
      c.update(s, dt, input);
      // Hover is an aim event, not an input that owns subsequent frames.
      if (input.pointer && !input.pointer.down) input.pointer = undefined;
      input.taps.clear();
      if (s.score !== oldScore) {
        oldScore = s.score;
        ctx.onChange(s.score);
        ctx.sound("capture");
      }
      end();
    }
    last = active ? now : 0;
    render();
    run();
  }
  render();
  ctx.onReady?.({ width: c.width, height: c.height });
  return {
    handlesKeyboard: true,
    start() {
      if (dead) return;
      active = s.status === "playing";
      last = 0;
      ctx.onChange(s.score);
      end(true);
      run();
    },
    pause() {
      stop();
    },
    resume() {
      if (!dead && s.status === "playing") {
        active = true;
        last = 0;
        run();
      }
    },
    restart() {
      s = c.create();
      reported = false;
      oldScore = 0;
      clear();
      last = 0;
      active = true;
      ctx.onChange(0);
      render();
      run();
    },
    action(a) {
      if (active) {
        input.pointer = undefined;
        input.taps.add(c.action?.(a) ?? (a === "confirm" ? "fire" : a));
      }
    },
    serialize() {
      return JSON.parse(JSON.stringify(s)) as unknown;
    },
    destroy() {
      if (dead) return;
      dead = true;
      active = false;
      cancelAnimationFrame(frame);
      abort.abort();
      clear();
      controls.remove();
      label.remove();
      root.remove();
    },
  };
}
export function circle(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}
export function backdrop(
  g: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
) {
  const grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#101b35");
  grad.addColorStop(1, "#233957");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);
  g.fillStyle = accent;
  g.globalAlpha = 0.14;
  for (let i = 0; i < 20; i++) {
    g.fillRect((i * 137) % w, (i * 83) % h, 2, 2);
  }
  g.globalAlpha = 1;
}
export const finite = (v: unknown, min: number, max: number): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
export const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
