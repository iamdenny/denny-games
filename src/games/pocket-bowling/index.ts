import type { GameFactory } from "../../lib/types";
import { createMotion } from "../../lib/motion";
import { create, restore, step, roll, layout, target } from "./rules";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko",
    restored = restore(ctx.saved);
  let s = restored ?? create(),
    active = false,
    dead = false,
    ended = false,
    frame = 0,
    last = 0,
    saveAt = 0;
  const abort = new AbortController(),
    opts = { signal: abort.signal };
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 550;
  canvas.tabIndex = 0;
  canvas.dataset.game = "pocket-bowling";
  canvas.setAttribute("aria-label", ko ? "포켓 볼링" : "Pocket Bowling");
  canvas.style.cssText =
    "width:min(100%,calc(100cqh * 400 / 550));height:auto;max-width:100%;max-height:100%;aspect-ratio:400/550;min-width:0;min-height:0;display:block;object-fit:contain;touch-action:none;margin:auto;border-radius:16px";
  const g = canvas.getContext("2d");
  if (!g) throw Error(ko ? "화면을 만들 수 없어요." : "Canvas unavailable.");
  const panel = document.createElement("div");
  panel.dataset.actionControls = "pocket-bowling";
  panel.style.cssText =
    "display:grid;gap:4px;width:100%;max-width:500px;margin:auto";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.cssText =
    "margin:0;font:700 12px/14px system-ui;white-space:pre-line";
  const row = document.createElement("div");
  row.style.cssText =
    "display:grid;grid-template-columns:minmax(48px,1fr) minmax(48px,1fr) max-content;gap:4px;align-items:end";
  function button(name: string, fn: () => void) {
    const b = document.createElement("button");
    b.textContent = name;
    b.type = "button";
    b.style.cssText =
      "min-width:48px;min-height:48px;border-radius:10px;border:1px solid #a7f0e6;background:#234754;color:#fff;font:700 13px system-ui;padding:5px 4px";
    b.addEventListener(
      "click",
      () => {
        if (active) {
          fn();
          draw();
        }
      },
      opts,
    );
    row.append(b);
    return b;
  }
  function input(
    name: string,
    min: number,
    max: number,
    inc: number,
    value: number,
    fn: (v: number) => void,
  ) {
    const label = document.createElement("label");
    label.style.cssText =
      "display:grid;flex:1;min-width:48px;font:12px system-ui";
    label.append(name);
    const el = document.createElement("input");
    el.type = "range";
    el.min = String(min);
    el.max = String(max);
    el.step = String(inc);
    el.value = String(value);
    el.setAttribute("aria-label", name);
    el.style.cssText = "width:100%;min-width:48px;min-height:48px;margin:0";
    el.addEventListener(
      "input",
      () => {
        if (active) {
          fn(Number(el.value));
          draw();
        }
      },
      opts,
    );
    label.append(el);
    row.append(label);
    return el;
  }
  const aim = input(
    ko ? "조준" : "Aim",
    -1,
    1,
    0.02,
    s.aim,
    (v) => (s.aim = v),
  );
  const power = input(
    ko ? "힘" : "Power",
    0.2,
    1,
    0.05,
    s.power,
    (v) => (s.power = v),
  );
  const fireButton = button(ko ? "굴리기" : "Roll", () => roll(s));
  panel.append(status, row);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const motion = createMotion(ctx.host);
  const label = () =>
    `${ko ? "프레임" : "Frame"} ${layout(s.rolls).frame}/10 · ${s.score}/100\n${ko ? "추천" : "Target"} ${target(s).aim.toFixed(2)} / ${Math.round(target(s).power * 100)}%\n${s.phase === "ready" ? (ko ? "조준 후 굴리세요" : "Aim, then roll") : s.phase === "done" ? (ko ? "경기 종료" : "Game complete") : ko ? "공 진행 중" : "Ball in play"}`;
  function draw() {
    if (!g) return;
    g.fillStyle = "#142d40";
    g.fillRect(0, 0, 400, 550);
    const line = (
      x: number,
      y: number,
      a: number,
      b: number,
      c: string,
      w = 2,
    ) => {
      g.strokeStyle = c;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(a, b);
      g.stroke();
    };
    const l = layout(s.rolls);
    g.fillStyle = "#bcd6d8";
    g.fillRect(35, 30, 330, 470);
    const grad = g.createLinearGradient(0, 40, 0, 500);
    grad.addColorStop(0, "#c99761");
    grad.addColorStop(1, "#efd3a2");
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(100, 45);
    g.lineTo(300, 45);
    g.lineTo(350, 500);
    g.lineTo(50, 500);
    g.closePath();
    g.fill();
    for (let i = 0; i < 9; i++) {
      line(105 + i * 24, 45, 60 + i * 35, 500, "#85644233", 1);
    }
    line(57, 450, 343, 450, "#834b37", 4);
    for (let i = 0; i < 7; i++) {
      g.fillStyle = "#674e37";
      g.beginPath();
      g.arc(125 + i * 25, 320, 3, 0, 7);
      g.fill();
    }
    g.strokeStyle = "#c14436";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(200 + target(s).aim * 120, 160, 14, 0, 7);
    g.stroke();
    const positions = [
      [200, 160],
      [181, 140],
      [219, 140],
      [162, 120],
      [200, 120],
      [238, 120],
      [143, 100],
      [181, 100],
      [219, 100],
      [257, 100],
    ];
    s.standing.forEach((n, i) => {
      const [x, y] = positions[n]!;
      const fall =
        s.phase === "falling" && i < s.pending
          ? Math.min(1, s.flight / 0.4)
          : 0;
      g.save();
      g.translate(x!, y!);
      g.rotate(fall * (i % 2 ? 1 : -1) * 1.25);
      g.globalAlpha = 1 - fall * 0.65;
      g.fillStyle = "#f9fcf0";
      g.beginPath();
      g.roundRect(-6, -22, 12, 28, 6);
      g.fill();
      g.fillStyle = "#ef896b";
      g.fillRect(-6, -12, 12, 4);
      g.restore();
    });
    const t =
      s.phase === "rolling"
        ? Math.min(1, s.flight / 1.2)
        : s.phase === "falling"
          ? 1
          : 0;
    const x = 200 + s.aim * 120 * t,
      y = 450 - t * 300;
    g.fillStyle = "#193d65";
    g.beginPath();
    g.arc(x, y, 13 - t * 4, 0, 7);
    g.fill();
    g.fillStyle = "#a7f0e6";
    g.beginPath();
    g.arc(x - 3, y - 4, 3, 0, 7);
    g.fill();
    if (s.phase === "ready") {
      line(200, 440, 200 + s.aim * 120, 165, "#234b6b77", 2);
    }
    g.fillStyle = "#f5f2e9";
    g.textAlign = "center";
    g.font = "700 14px system-ui";
    g.fillText(`${ko ? "프레임" : "FRAME"} ${l.frame}/10`, 200, 26);
    g.fillText(s.rolls.slice(-8).join(" · ") || "—", 200, 530);
    if (status.textContent !== label()) status.textContent = label();
    fireButton.disabled = !active || s.phase !== "ready";
    panel
      .querySelectorAll("input")
      .forEach((el) => (el.disabled = !active || s.phase !== "ready"));
    canvas.dataset.phase = s.phase;
    canvas.dataset.time = s.time.toFixed(2);
    canvas.dataset.score = String(s.score);
  }
  function terminal() {
    return s.phase === "done";
  }
  function finish(initial = false) {
    if (ended) return;
    ended = true;
    pause();
    ctx.onEnd({
      score: s.score,
      won: s.score >= 100,
      restored: initial,
      message: label(),
    });
  }
  function pause() {
    active = false;
    cancelAnimationFrame(frame);
    last = 0;
    motion.finish();
    draw();
  }
  function tick(now: number) {
    if (!active || dead) return;
    const before = s.score;
    step(s, last ? (now - last) / 1000 : 0);
    last = now;
    draw();
    if (s.score !== before) {
      ctx.onChange(s.score);
      ctx.sound();
      motion.finish();
      motion.run(
        (t) => {
          t.fromTo(status, { opacity: 0.45 }, { opacity: 1, duration: 0.2 });
        },
        () => {
          status.style.opacity = "1";
        },
      );
    }
    if (now - saveAt > 1000) {
      saveAt = now;
      ctx.onSave?.();
    }
    if (terminal()) {
      finish();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (active || dead) return;
    if (terminal()) {
      finish(!!restored);
      return;
    }
    active = true;
    last = 0;
    draw();
    frame = requestAnimationFrame(tick);
  }
  window.addEventListener(
    "keydown",
    (e) => {
      if (
        !active ||
        /INPUT|SELECT|TEXTAREA/.test((e.target as HTMLElement)?.tagName) ||
        ((e.key === " " || e.key === "Enter") &&
          (e.target as HTMLElement)?.closest("button,a"))
      )
        return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!e.repeat) {
          roll(s);
          draw();
        }
      }
    },
    opts,
  );

  ctx.onChange(s.score);
  draw();
  ctx.onReady?.({ width: 400, height: 550 });
  return {
    handlesKeyboard: true,
    start,
    pause,
    resume: start,
    restart() {
      pause();
      s = create();
      aim.value = String(s.aim);
      power.value = String(s.power);
      ended = false;
      ctx.onChange(0);
      start();
    },
    action(a) {
      if (active && a === "confirm") roll(s);
    },
    serialize() {
      return restore(s);
    },
    destroy() {
      pause();
      dead = true;
      motion.destroy();
      abort.abort();
      canvas.remove();
      panel.remove();
    },
  };
};
