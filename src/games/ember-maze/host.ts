import type { GameContext, GameInstance } from "../../lib/types";
export type Mode = "solo" | "local";
export type Controls = { x: number; y: number; fire: boolean };
export type ArcadeState = {
  mode: Mode;
  time: number;
  score: number;
  won: boolean;
  lost: boolean;
};
export type Spec<S extends ArcadeState> = {
  id: string;
  title: [string, string];
  hint: [string, string];
  action: [string, string];
  create(stage: number, mode: Mode): S;
  restore(raw: unknown, stage: number): S | null;
  step(s: S, stage: number, dt: number, input: Controls[]): void;
  draw(
    g: CanvasRenderingContext2D,
    s: S,
    stage: number,
    ko: boolean,
    effects: boolean,
  ): void;
  status(s: S, ko: boolean): string;
};
export const clamp = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, n));
export const finite = (x: unknown, a = -1e6, b = 1e6): x is number =>
  typeof x === "number" && Number.isFinite(x) && x >= a && x <= b;
export function validBase(raw: unknown): raw is ArcadeState {
  if (!raw || typeof raw !== "object") return false;
  const s = raw as ArcadeState;
  return (
    ["solo", "local"].includes(s.mode) &&
    finite(s.time, 0, 1e7) &&
    finite(s.score, 0, 1e7) &&
    typeof s.won === "boolean" &&
    typeof s.lost === "boolean" &&
    !(s.won && s.lost)
  );
}
export function text(
  g: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size = 18,
  color = "#fff4d6",
) {
  g.fillStyle = color;
  g.font = `700 ${size}px system-ui`;
  g.fillText(value, x, y);
}
export function disc(
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
export function host<S extends ArcadeState>(
  ctx: GameContext,
  spec: Spec<S>,
): GameInstance {
  const ko = ctx.locale === "ko";
  const stage = clamp(Math.floor(ctx.stage), 1, 6);
  const saved = ctx.saved as
    { version?: unknown; stage?: unknown; state?: unknown } | undefined;
  let s =
    saved?.version === 1 && saved.stage === stage
      ? spec.restore(saved.state, stage)
      : null;
  let restored = !!s;
  s ??= spec.create(stage, "solo");
  let begun = false;
  let active = false,
    ended = false,
    frame = 0,
    last = 0,
    saveAt = 0,
    destroyed = false;
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 520;
  canvas.tabIndex = 0;
  canvas.className = "retro-a-canvas";
  canvas.dataset.game = spec.id;
  canvas.setAttribute("aria-label", spec.title[ko ? 1 : 0]);
  canvas.style.cssText =
    "display:block;width:100%;height:100%;object-fit:contain;touch-action:none;border-radius:16px;background:#122330;";
  const g = canvas.getContext("2d");
  if (!g)
    throw Error(ko ? "게임 화면을 만들 수 없어요." : "Canvas unavailable.");
  const panel = document.createElement("div");
  panel.style.cssText =
    "display:grid;gap:8px;width:100%;max-width:760px;margin:auto;font:14px system-ui;";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.cssText = "margin:0;color:inherit;font-weight:700;";
  const hint = document.createElement("p");
  hint.textContent = spec.hint[ko ? 1 : 0];
  hint.style.cssText = "margin:0;font-size:12px;line-height:1.4;";
  const mode = document.createElement("select");
  mode.setAttribute("aria-label", ko ? "플레이 모드" : "Play mode");
  for (const [v, en, kr] of [
    ["solo", "Solo", "혼자"],
    ["local", "Local 2 players", "같은 기기 2명"],
  ]) {
    const o = document.createElement("option");
    o.value = v!;
    o.textContent = ko ? kr! : en!;
    mode.append(o);
  }
  mode.value = s.mode;
  mode.style.cssText = "font:inherit;padding:8px;border-radius:8px;";
  const setting = document.createElement("label");
  setting.textContent = ko
    ? "모드 · 변경하면 현재 판을 새로 시작해요 "
    : "Mode · changing starts a new round ";
  setting.append(mode);
  (ctx.settingsHost ?? panel).append(setting);
  const inputs: Controls[] = [
    { x: 0, y: 0, fire: false },
    { x: 0, y: 0, fire: false },
  ];
  const keys = new Set<string>();
  const pulses = new Map<string, number>();
  const pointers = new Map<number, { p: number; a: string }>();
  const rows: HTMLElement[] = [];
  const buttons: HTMLButtonElement[] = [];
  for (let p = 0; p < 2; p++) {
    const row = document.createElement("div");
    row.style.cssText =
      "display:flex;gap:5px;flex-wrap:wrap;align-items:center;";
    const label = document.createElement("strong");
    label.textContent = `P${p + 1}`;
    row.append(label);
    for (const [a, label] of [
      ["left", "←"],
      ["up", "↑"],
      ["down", "↓"],
      ["right", "→"],
      ["fire", spec.action[ko ? 1 : 0]],
    ]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label!;
      b.dataset.retroAction = `${p}:${a}`;
      b.setAttribute(
        "aria-label",
        `P${p + 1} ${a === "fire" ? label : ko ? ({ left: "왼쪽", right: "오른쪽", up: "위", down: "아래" }[a!] ?? a) : a}`,
      );
      b.style.cssText =
        "min-width:44px;min-height:44px;padding:8px;border:1px solid #758d9d;border-radius:10px;background:#203c4c;color:#fff4d6;touch-action:none;font:700 15px system-ui;";
      b.addEventListener("pointerdown", (e) => {
        if (!active) return;
        e.preventDefault();
        pointers.set(e.pointerId, { p, a: a! });
        pulses.set(`${p}:${a}`, performance.now() + 80);
        b.setPointerCapture(e.pointerId);
      });
      const release = (e: PointerEvent) => pointers.delete(e.pointerId);
      b.addEventListener("pointerup", release);
      b.addEventListener("pointercancel", release);
      b.addEventListener("lostpointercapture", release);
      b.addEventListener("click", (e) => {
        if (e.detail === 0 && active) {
          pulses.set(`${p}:${a}`, performance.now() + 160);
        }
      });
      row.append(b);
      buttons.push(b);
    }
    rows.push(row);
    panel.append(row);
  }
  panel.prepend(status, hint);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function clear() {
    keys.clear();
    pulses.clear();
    pointers.clear();
    inputs.forEach((i) => {
      i.x = i.y = 0;
      i.fire = false;
    });
  }
  const keyMap: Record<string, string> = {
    ArrowLeft: "0:left",
    ArrowRight: "0:right",
    ArrowUp: "0:up",
    ArrowDown: "0:down",
    " ": "0:fire",
    Enter: "0:fire",
    a: "1:left",
    d: "1:right",
    w: "1:up",
    s: "1:down",
    f: "1:fire",
  };
  function keydown(e: KeyboardEvent) {
    if (
      !active ||
      /INPUT|SELECT|TEXTAREA/.test((e.target as HTMLElement)?.tagName) ||
      ((e.key === "Enter" || e.key === " ") &&
        !!(e.target as HTMLElement)?.closest("button,a"))
    )
      return;
    const k = keyMap[e.key] ?? keyMap[e.key.toLowerCase()];
    if (k) {
      e.preventDefault();
      keys.add(k);
      pulses.set(k, performance.now() + 80);
    }
  }
  function keyup(e: KeyboardEvent) {
    const k = keyMap[e.key] ?? keyMap[e.key.toLowerCase()];
    if (k) keys.delete(k);
  }
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("blur", clear);
  function paint() {
    if (!g) return;
    spec.draw(
      g,
      s!,
      stage,
      ko,
      !reduced.matches && !ctx.host.closest(".low-effects"),
    );
    canvas.dataset.score = String(s!.score);
    canvas.dataset.time = s!.time.toFixed(2);
    canvas.dataset.mode = s!.mode;
    canvas.dataset.won = String(s!.won);
    canvas.dataset.lost = String(s!.lost);
    status.textContent = spec.status(s!, ko);
    rows[1]!.hidden = s!.mode !== "local";
    buttons.forEach((b) => (b.disabled = !active));
    mode.disabled = begun;
  }
  function finish() {
    if ((s!.won || s!.lost) && !ended) {
      ended = true;
      active = false;
      clear();
      ctx.onEnd({
        won: s!.won,
        score: s!.score,
        restored,
        message: spec.status(s!, ko),
      });
      paint();
    }
  }
  function tick(now: number) {
    if (!active || destroyed) return;
    const dt = last ? Math.min(0.033, (now - last) / 1000) : 0;
    last = now;
    for (const [key, expiry] of pulses) if (now > expiry) pulses.delete(key);
    for (let p = 0; p < 2; p++) {
      const has = (a: string) =>
        keys.has(`${p}:${a}`) ||
        pulses.has(`${p}:${a}`) ||
        [...pointers.values()].some((v) => v.p === p && v.a === a);
      inputs[p] = {
        x: Number(has("right")) - Number(has("left")),
        y: Number(has("down")) - Number(has("up")),
        fire: has("fire"),
      };
    }
    const before = s!.score;
    spec.step(s!, stage, dt, inputs);
    paint();
    if (before !== s!.score) {
      ctx.onChange(s!.score);
      ctx.sound();
    }
    if (now - saveAt > 1500) {
      saveAt = now;
      ctx.onSave?.();
    }
    finish();
    if (active) frame = requestAnimationFrame(tick);
  }
  function start() {
    if (active || destroyed) return;
    finish();
    if (ended) return;
    active = true;
    begun = true;
    restored = false;
    last = 0;
    paint();
    frame = requestAnimationFrame(tick);
  }
  function pause() {
    active = false;
    cancelAnimationFrame(frame);
    last = 0;
    clear();
    paint();
  }
  mode.addEventListener("change", () => {
    if (begun) return;
    pause();
    s = spec.create(stage, mode.value === "local" ? "local" : "solo");
    ended = false;
    restored = false;
    ctx.onChange(0);
    ctx.onSave?.();
    paint();
  });
  paint();
  ctx.onChange(s.score);
  ctx.onReady?.({ width: 800, height: 520 });
  return {
    handlesKeyboard: true,
    start,
    resume: start,
    pause,
    restart() {
      pause();
      s = spec.create(stage, s!.mode);
      ended = false;
      restored = false;
      paint();
      ctx.onChange(0);
      start();
    },
    action(a) {
      if (active) {
        pulses.set(
          `0:${a === "confirm" ? "fire" : a}`,
          performance.now() + 160,
        );
      }
    },
    serialize() {
      return { version: 1, stage, state: s };
    },
    destroy() {
      if (destroyed) return;
      pause();
      destroyed = true;
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", clear);
      canvas.remove();
      panel.remove();
      setting.remove();
    },
  };
}
