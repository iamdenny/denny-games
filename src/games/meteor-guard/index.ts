import type { GameFactory } from "../../lib/types";
import { createMotion } from "../../lib/motion";
import { create, restore, step, fire } from "./rules";
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
  canvas.dataset.game = "meteor-guard";
  canvas.setAttribute("aria-label", ko ? "유성 방어대" : "Meteor Guard");
  canvas.style.cssText =
    "width:min(100%,calc(100cqh * 400 / 550));height:auto;max-width:100%;max-height:100%;aspect-ratio:400/550;min-width:0;min-height:0;display:block;object-fit:contain;touch-action:none;margin:auto;border-radius:16px";
  const g = canvas.getContext("2d");
  if (!g) throw Error(ko ? "화면을 만들 수 없어요." : "Canvas unavailable.");
  const panel = document.createElement("div");
  panel.dataset.actionControls = "meteor-guard";
  panel.style.cssText =
    "display:grid;gap:4px;width:100%;max-width:500px;margin:auto";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.cssText = "margin:0;font:700 12px system-ui";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:5px;align-items:end;flex-wrap:wrap";
  function button(name: string, fn: () => void) {
    const b = document.createElement("button");
    b.textContent = name;
    b.type = "button";
    b.style.cssText =
      "min-width:48px;min-height:48px;border-radius:10px;border:1px solid #a7f0e6;background:#234754;color:#fff;font:700 13px system-ui;padding:5px 10px";
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
      "display:grid;flex:1;min-width:65px;font:12px system-ui";
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
  const aimX = input(
    ko ? "가로 조준" : "Aim X",
    20,
    380,
    5,
    s.aim.x,
    (v) => (s.aim.x = v),
  );
  const aimY = input(
    ko ? "높이 조준" : "Aim Y",
    35,
    440,
    5,
    s.aim.y,
    (v) => (s.aim.y = v),
  );
  const fireButton = button(ko ? "발사" : "Fire", () => fire(s));
  panel.append(status, row);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const motion = createMotion(ctx.host);
  const label = () =>
    `${ko ? "웨이브" : "Wave"} ${s.wave}/5 · ${Math.ceil(20 - s.elapsed)}s · ${ko ? "도시" : "Cities"} ${s.cities.filter(Boolean).length}/3 · ${s.score}`;
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
    for (let i = 0; i < 36; i++) {
      g.fillStyle = "#b7e4e955";
      g.fillRect((i * 79) % 400, (i * 53) % 400, 2, 2);
    }
    for (let i = 0; i < 3; i++) {
      const x = [80, 200, 320][i]!;
      g.fillStyle = s.cities[i] ? "#91d9cc" : "#57616d";
      for (let j = 0; j < 3; j++) {
        const h = 22 + j * 9;
        g.fillRect(x - 25 + j * 17, 495 - h, 15, h);
        if (s.cities[i]) {
          g.fillStyle = "#f4e8a0";
          g.fillRect(x - 21 + j * 17, 480 - h, 5, 5);
          g.fillStyle = "#91d9cc";
        }
      }
      g.fillStyle = "#e8f4ed";
      g.font = "12px system-ui";
      g.textAlign = "center";
      g.fillText(
        s.cities[i] ? (ko ? "안전" : "SAFE") : ko ? "파괴" : "LOST",
        x,
        515,
      );
    }
    g.fillStyle = "#456579";
    g.fillRect(0, 495, 400, 6);
    s.meteors.forEach((m) => {
      line(m.x - 10, m.y - 20, m.x, m.y, "#ef896b", 3);
      g.fillStyle = "#ffe7a5";
      g.beginPath();
      g.arc(m.x, m.y, 6, 0, 7);
      g.fill();
    });
    s.shots.forEach((p) => {
      line(p.x, p.y + 12, p.x, p.y, "#a7f0e6", 3);
    });
    s.blasts.forEach((b) => {
      const r = Math.min(52, b.age * 150);
      g.fillStyle = "#a7f0e633";
      g.strokeStyle = "#d9ed68";
      g.lineWidth = 3;
      g.beginPath();
      g.arc(b.x, b.y, r, 0, 7);
      g.fill();
      g.stroke();
    });
    g.strokeStyle = "#f5f2e9";
    g.lineWidth = 2;
    g.beginPath();
    g.arc(s.aim.x, s.aim.y, 11, 0, 7);
    g.stroke();
    line(s.aim.x - 18, s.aim.y, s.aim.x + 18, s.aim.y, "#f5f2e9", 1);
    line(s.aim.x, s.aim.y - 18, s.aim.x, s.aim.y + 18, "#f5f2e9", 1);
    g.fillStyle = "#a7f0e6";
    g.beginPath();
    g.moveTo(186, 490);
    g.lineTo(200, 468);
    g.lineTo(214, 490);
    g.fill();
    if (status.textContent !== label()) status.textContent = label();
    fireButton.disabled = !active || s.phase !== "playing";
    panel
      .querySelectorAll("input")
      .forEach((el) => (el.disabled = !active || s.phase !== "playing"));
    canvas.dataset.phase = s.phase;
    canvas.dataset.time = s.time.toFixed(2);
    canvas.dataset.score = String(s.score);
  }
  function terminal() {
    return s.phase !== "playing";
  }
  function finish(initial = false) {
    if (ended) return;
    ended = true;
    pause();
    ctx.onEnd({
      score: s.score,
      won: s.phase === "won",
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
          fire(s);
          draw();
        }
      }
    },
    opts,
  );
  canvas.addEventListener(
    "pointerdown",
    (e) => {
      if (!active) return;
      const r = canvas.getBoundingClientRect();
      fire(
        s,
        ((e.clientX - r.left) / r.width) * 400,
        ((e.clientY - r.top) / r.height) * 550,
      );
      aimX.value = String(s.aim.x);
      aimY.value = String(s.aim.y);
      draw();
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
      aimX.value = String(s.aim.x);
      aimY.value = String(s.aim.y);
      ended = false;
      ctx.onChange(0);
      start();
    },
    action(a) {
      if (active && a === "confirm") fire(s);
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
