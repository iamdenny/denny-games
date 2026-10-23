import type { GameFactory } from "../../lib/types";
import { createMotion } from "../../lib/motion";
import { create, restore, serve, step, clamp, type Shot } from "./rules";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  let s = restore(ctx.saved) ?? create(),
    active = false,
    frame = 0,
    last = 0,
    ended = false,
    destroyed = false,
    saveAt = 0;
  const initialRestored = !!restore(ctx.saved);
  const keys = new Set<string>();
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 520;
  canvas.tabIndex = 0;
  canvas.dataset.game = "pocket-pingpong";
  canvas.setAttribute(
    "aria-label",
    ko
      ? "포켓 탁구 리그 · 좌우로 라켓 이동"
      : "Pocket Table Tennis · move paddle left and right",
  );
  canvas.style.cssText =
    "width:100%;height:100%;display:block;object-fit:contain;touch-action:none;border-radius:16px";
  const g = canvas.getContext("2d");
  if (!g) throw Error(ko ? "화면을 만들 수 없어요." : "Canvas unavailable.");
  const panel = document.createElement("div");
  panel.dataset.pingpongControls = "";
  panel.style.cssText =
    "display:grid;gap:4px;width:100%;max-width:680px;margin:auto";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.cssText = "font-size:13px;font-weight:700;margin:0";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:5px;flex-wrap:wrap";
  const hint = document.createElement("p");
  hint.style.cssText = "font-size:11px;margin:0;line-height:1.4";
  hint.textContent = ko
    ? "드래그 / ← → 이동 · ↑ ↓ 타법 · Space 서브 · 정면에서 자동 반격 · 먼저 5점! 스매시는 정확히 맞춰요."
    : "Drag / ← → move · ↑ ↓ shot · Space serve · aligned paddles return automatically · first to 5! Smashes need precision.";
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let held = 0,
    drag: number | null = null;
  function button(label: string, fn: () => void) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.style.cssText =
      "min-width:48px;min-height:48px;padding:5px 10px;border:1px solid #89a9af;border-radius:10px;background:#173e49;color:#fff;font:700 13px system-ui;touch-action:none";
    b.addEventListener(
      "click",
      () => {
        if (active) fn();
      },
      options,
    );
    row.append(b);
    return b;
  }
  const left = button("←", () => {
    s.paddle = clamp(s.paddle - 0.08, 0.07, 0.93);
    draw();
  });
  left.setAttribute("aria-label", ko ? "왼쪽" : "Move left");
  const right = button("→", () => {
    s.paddle = clamp(s.paddle + 0.08, 0.07, 0.93);
    draw();
  });
  right.setAttribute("aria-label", ko ? "오른쪽" : "Move right");
  [left, right].forEach((b, i) => {
    b.addEventListener(
      "pointerdown",
      (e) => {
        if (!active) return;
        held = i ? 1 : -1;
        b.setPointerCapture(e.pointerId);
      },
      options,
    );
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      b.addEventListener(event, () => (held = 0), options);
  });
  const serveButton = button(ko ? "서브" : "Serve", () => serve(s));
  const shotButtons: HTMLButtonElement[] = [];
  for (const [shot, en, kr] of [
    ["drive", "Drive", "안정타"],
    ["spin", "Topspin", "회전"],
    ["smash", "Smash", "스매시"],
  ] as const) {
    const b = button(ko ? kr : en, () => {
      s.shot = shot as Shot;
      draw();
    });
    b.dataset.shot = shot;
    shotButtons.push(b);
  }
  panel.append(status, row, hint);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const motion = createMotion(ctx.host);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const names = ko
    ? ["동네 클럽", "회전 달인", "리그 챔피언"]
    : ["Club rookie", "Spin specialist", "League champion"];
  const label = () =>
    `${ko ? "리그" : "League"} ${s.opponent + 1}/3 · ${names[s.opponent]} · ${s.points[0]} : ${s.points[1]} · ${ko ? "랠리" : "Rally"} ${s.rally}`;
  const project = (x: number, y: number, z = 0) => ({
    x: 400 + (x - 0.5) * (350 + y * 300),
    y: 125 + y * 325 - z,
  });
  function draw() {
    if (!g) return;
    const grad = g.createLinearGradient(0, 0, 0, 520);
    grad.addColorStop(0, "#102634");
    grad.addColorStop(1, "#224d54");
    g.fillStyle = grad;
    g.fillRect(0, 0, 800, 520);
    g.strokeStyle = "#ffffff08";
    g.lineWidth = 1;
    for (let i = 0; i < 800; i += 60) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 520);
      g.stroke();
    }
    const poly = (coords: number[][], fill: string) => {
      g.fillStyle = fill;
      g.beginPath();
      coords.forEach(([x, y], i) => (i ? g.lineTo(x!, y!) : g.moveTo(x!, y!)));
      g.closePath();
      g.fill();
    };
    poly(
      [
        [225, 145],
        [575, 145],
        [725, 470],
        [75, 470],
      ],
      "#071e29",
    );
    poly(
      [
        [225, 125],
        [575, 125],
        [725, 450],
        [75, 450],
      ],
      "#198c8c",
    );
    g.strokeStyle = "#d2fff0";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(225, 125);
    g.lineTo(575, 125);
    g.lineTo(725, 450);
    g.lineTo(75, 450);
    g.closePath();
    g.stroke();
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(400, 125);
    g.lineTo(400, 450);
    g.stroke();
    const netY = project(0, 0.5).y;
    g.fillStyle = "#0d283bbb";
    g.fillRect(143, netY - 28, 514, 28);
    g.strokeStyle = "#c6e9db";
    g.lineWidth = 2;
    g.strokeRect(143, netY - 28, 514, 28);
    for (let x = 150; x < 657; x += 12) {
      g.beginPath();
      g.moveTo(x, netY - 28);
      g.lineTo(x, netY);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(143, netY - 14);
    g.lineTo(657, netY - 14);
    g.stroke();
    const paddle = (x: number, y: number, color: string) => {
      const p = project(x, y);
      g.strokeStyle = "#e5bf8e";
      g.lineWidth = 9;
      g.beginPath();
      g.moveTo(p.x, p.y + 8);
      g.lineTo(p.x + 8, p.y + 30);
      g.stroke();
      g.fillStyle = color;
      g.beginPath();
      g.ellipse(p.x, p.y, 27 + y * 7, 17 + y * 5, -0.15, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#ffe5bc";
      g.lineWidth = 2;
      g.stroke();
    };
    paddle(s.ai, 0, "#f19069");
    const y = s.ball.y;
    const distance = s.ball.vy < 0 ? 1 - y : y;
    const height =
      s.phase === "rally"
        ? distance < 0.77
          ? Math.sin((distance / 0.77) * Math.PI) * 49
          : Math.sin((((distance - 0.77) / 0.23) * Math.PI) / 2) * 22
        : 20;
    const floor = project(s.ball.x, y);
    g.fillStyle = "#072e3b70";
    g.beginPath();
    g.ellipse(floor.x, floor.y, 9 + y * 4, 3 + y * 2, 0, 0, 7);
    g.fill();
    const p = project(s.ball.x, y, height);
    if (
      !reduced.matches &&
      !ctx.host.closest(".low-effects") &&
      s.phase === "rally"
    ) {
      g.strokeStyle = "#ffe6b16b";
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(p.x - s.ball.vx * 25, p.y + s.ball.vy * 17);
      g.lineTo(p.x, p.y);
      g.stroke();
    }
    g.fillStyle = "#fff6cc";
    g.beginPath();
    g.arc(p.x, p.y, 6 + y * 3, 0, 7);
    g.fill();
    paddle(s.paddle, 1, "#f4c35d");
    if (s.flash > 0 && !reduced.matches && !ctx.host.closest(".low-effects")) {
      g.strokeStyle = "#fff2a6";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(p.x, p.y, 12 + (1 - s.flash / 0.3) * 20, 0, 7);
      g.stroke();
    }
    g.textAlign = "center";
    g.fillStyle = "#e6fff1";
    g.font = "800 24px system-ui";
    g.fillText(`${s.points[0]}   :   ${s.points[1]}`, 400, 53);
    g.font = "600 15px system-ui";
    g.fillText(`${names[s.opponent]} · ${s.opponent + 1}/3`, 400, 80);
    if (s.phase !== "rally") {
      g.fillStyle = "#102a38e8";
      g.fillRect(110, 210, 580, 72);
      g.fillStyle = "#fff2cc";
      g.font = "700 21px system-ui";
      g.fillText(
        s.phase === "serve"
          ? ko
            ? "서브를 눌러 랠리 시작"
            : "Press Serve to start the rally"
          : s.phase === "between"
            ? ko
              ? "승리! 다음 상대에게 도전"
              : "Match won! Challenge the next opponent"
            : s.phase === "won"
              ? ko
                ? "리그 우승!"
                : "League champion!"
              : ko
                ? "경기 종료 · 다시 도전해요"
                : "Match over · try again",
        400,
        252,
      );
    }
    if (status.textContent !== label()) status.textContent = label();
    serveButton.textContent =
      s.phase === "between"
        ? ko
          ? "다음 경기"
          : "Next match"
        : ko
          ? "서브"
          : "Serve";
    serveButton.disabled = !active || !["serve", "between"].includes(s.phase);
    left.disabled = right.disabled = !active;
    shotButtons.forEach((b) => {
      b.disabled = !active;
      b.setAttribute("aria-pressed", String(b.dataset.shot === s.shot));
      b.style.background = b.dataset.shot === s.shot ? "#92521c" : "#173e49";
    });
    canvas.dataset.phase = s.phase;
    canvas.dataset.paddle = s.paddle.toFixed(3);
    canvas.dataset.time = s.time.toFixed(2);
    canvas.dataset.rally = String(s.rally);
    canvas.dataset.points = s.points.join(":");
  }
  function cycleShot(direction: number) {
    const shots: Shot[] = ["drive", "spin", "smash"];
    s.shot =
      shots[(shots.indexOf(s.shot) + direction + shots.length) % shots.length]!;
    draw();
  }
  function clear() {
    keys.clear();
    held = 0;
    drag = null;
  }
  function pause() {
    active = false;
    motion.finish();
    cancelAnimationFrame(frame);
    last = 0;
    clear();
    draw();
  }
  function tick(now: number) {
    if (!active || destroyed) return;
    const before = s.score,
      oldRally = s.rally;
    step(
      s,
      last ? Math.min((now - last) / 1000, 0.04) : 0,
      held || Number(keys.has("right")) - Number(keys.has("left")),
    );
    last = now;
    draw();
    if (s.score !== before) {
      ctx.onChange(s.score);
      motion.finish();
      motion.run(
        (t) => {
          t.fromTo(status, { opacity: 0.45 }, { opacity: 1, duration: 0.25 });
        },
        () => {
          status.style.opacity = "1";
        },
      );
    }
    if (s.rally !== oldRally) ctx.sound();
    if (now - saveAt > 1500) {
      saveAt = now;
      ctx.onSave?.();
    }
    if (s.phase === "won" || s.phase === "lost") {
      pause();
      if (!ended) {
        ended = true;
        ctx.onEnd({ score: s.score, won: s.phase === "won", message: label() });
      }
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (active || destroyed) return;
    if (s.phase === "won" || s.phase === "lost") {
      if (!ended) {
        ended = true;
        ctx.onEnd({
          score: s.score,
          won: s.phase === "won",
          restored: initialRestored,
          message: label(),
        });
      }
      return;
    }
    active = true;
    last = 0;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function pointer(e: PointerEvent) {
    if (!active) return;
    const r = canvas.getBoundingClientRect();
    const scale = Math.min(r.width / 800, r.height / 520);
    const x = (e.clientX - r.left - (r.width - 800 * scale) / 2) / scale;
    s.paddle = clamp((x - 75) / 650, 0.07, 0.93);
    draw();
  }
  canvas.addEventListener(
    "pointerdown",
    (e) => {
      if (!active) return;
      drag = e.pointerId;
      canvas.setPointerCapture(e.pointerId);
      pointer(e);
    },
    options,
  );
  canvas.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerId === drag) pointer(e);
    },
    options,
  );
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    canvas.addEventListener(event, () => (drag = null), options);
  window.addEventListener(
    "keydown",
    (e) => {
      if (
        !active ||
        /INPUT|SELECT|TEXTAREA/.test((e.target as HTMLElement)?.tagName) ||
        ((e.key === " " || e.key === "Enter") &&
          !!(e.target as HTMLElement)?.closest("button,a"))
      )
        return;
      if (["ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) {
        e.preventDefault();
        keys.add(["a", "ArrowLeft"].includes(e.key) ? "left" : "right");
      }
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
        e.preventDefault();
        if (!e.repeat) cycleShot(["ArrowUp", "w"].includes(e.key) ? 1 : -1);
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!e.repeat) serve(s);
      }
    },
    options,
  );
  window.addEventListener(
    "keyup",
    (e) => {
      if (["a", "ArrowLeft"].includes(e.key)) keys.delete("left");
      if (["d", "ArrowRight"].includes(e.key)) keys.delete("right");
    },
    options,
  );
  window.addEventListener("blur", clear, options);
  draw();
  ctx.onChange(s.score);
  ctx.onReady?.({ width: 800, height: 520 });
  return {
    handlesKeyboard: true,
    start,
    pause,
    resume: start,
    restart() {
      pause();
      s = create();
      ended = false;
      ctx.onChange(0);
      start();
    },
    action(a) {
      if (!active) return;
      if (a === "confirm") serve(s);
      else if (a === "up" || a === "down") cycleShot(a === "up" ? 1 : -1);
      else if (a === "left" || a === "right") {
        s.paddle = clamp(s.paddle + (a === "left" ? -0.08 : 0.08), 0.07, 0.93);
        draw();
      }
    },
    serialize() {
      return { ...s, points: [...s.points], ball: { ...s.ball } };
    },
    destroy() {
      pause();
      destroyed = true;
      motion.destroy();
      abort.abort();
      canvas.remove();
      panel.remove();
    },
  };
};
