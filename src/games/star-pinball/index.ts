import type { GameFactory } from "../../lib/types";
import { createMotion } from "../../lib/motion";
import { create, restore, launch, step, GOAL, BUMPERS } from "./rules";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko",
    saved = restore(ctx.saved);
  let s = saved ?? create(),
    active = false,
    dead = false,
    ended = false,
    frame = 0,
    last = 0,
    saveAt = 0;
  const abort = new AbortController(),
    options = { signal: abort.signal },
    keys = new Set<string>(),
    pointers = new Map<number, string>();
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 640;
  canvas.tabIndex = 0;
  canvas.dataset.game = "star-pinball";
  canvas.setAttribute(
    "aria-label",
    ko
      ? "별빛 핀볼 · 좌우 플리퍼와 발사 버튼"
      : "Star Pinball · left and right flippers and launcher",
  );
  canvas.style.cssText =
    "width:min(100%,calc(100cqh * 400 / 640));height:auto;max-width:100%;max-height:100%;aspect-ratio:400/640;min-width:0;min-height:0;display:block;object-fit:contain;touch-action:none;border-radius:18px;margin:auto";
  const g = canvas.getContext("2d");
  if (!g) throw Error(ko ? "화면을 만들 수 없어요." : "Canvas unavailable.");
  const panel = document.createElement("div");
  panel.dataset.pinballControls = "";
  panel.style.cssText =
    "display:grid;gap:4px;width:100%;max-width:500px;margin:auto";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.style.cssText = "font:700 12px system-ui;margin:0";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:5px";
  const hint = document.createElement("p");
  hint.style.cssText = "font:11px/1.35 system-ui;margin:0";
  hint.textContent = ko
    ? "← → / A D 길게: 플리퍼 · Space: 발사 · 공 3개로 1,500점!"
    : "Hold ← → / A D: flippers · Space: launch · 3 balls to reach 1,500!";
  function button(label: string) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.style.cssText =
      "min-width:48px;min-height:48px;flex:1;padding:5px;border:1px solid #9bbcc2;border-radius:12px;background:#20434f;color:#fff;font:700 12px system-ui;touch-action:none";
    row.append(b);
    return b;
  }
  const left = button(ko ? "왼쪽 플리퍼" : "Left flipper"),
    fire = button(ko ? "발사" : "Launch"),
    right = button(ko ? "오른쪽 플리퍼" : "Right flipper");
  [left, right].forEach((b, i) => {
    b.addEventListener(
      "pointerdown",
      (e) => {
        if (!active) return;
        pointers.set(e.pointerId, i ? "right" : "left");
        b.setPointerCapture(e.pointerId);
      },
      options,
    );
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      b.addEventListener(
        event,
        (e) => pointers.delete((e as PointerEvent).pointerId),
        options,
      );
    b.addEventListener(
      "keydown",
      (e) => {
        if (active && (e.key === " " || e.key === "Enter")) {
          e.preventDefault();
          keys.add(i ? "button-right" : "button-left");
        }
      },
      options,
    );
    b.addEventListener(
      "keyup",
      (e) => {
        if (e.key === " " || e.key === "Enter")
          keys.delete(i ? "button-right" : "button-left");
      },
      options,
    );
    b.addEventListener(
      "blur",
      () => keys.delete(i ? "button-right" : "button-left"),
      options,
    );
  });
  fire.addEventListener(
    "click",
    () => {
      if (active) {
        launch(s);
        ctx.sound();
        draw();
      }
    },
    options,
  );
  panel.append(status, row, hint);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const motion = createMotion(ctx.host);
  const trail: { x: number; y: number }[] = [];
  const label = () =>
    `${ko ? "공" : "Ball"} ${s.number}/3 · ${s.score.toLocaleString()} / ${GOAL.toLocaleString()} · ${s.phase === "ready" ? (ko ? "발사 대기" : "Ready to launch") : s.phase === "won" ? (ko ? "목표 달성!" : "Goal reached!") : s.phase === "lost" ? (ko ? "라운드 종료" : "Round over") : ko ? "범퍼 100 · 표적 200" : "Bumpers 100 · targets 200"}`;
  function draw() {
    if (!g) return;
    const grad = g.createLinearGradient(0, 0, 400, 640);
    grad.addColorStop(0, "#14263f");
    grad.addColorStop(1, "#20474f");
    g.fillStyle = grad;
    g.fillRect(0, 0, 400, 640);
    const line = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      color: string,
      width = 2,
    ) => {
      g.strokeStyle = color;
      g.lineWidth = width;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(ax, ay);
      g.lineTo(bx, by);
      g.stroke();
    };
    for (let i = 0; i < 45; i++) {
      const x = 35 + ((i * 79) % 330),
        y = 100 + ((i * 137) % 470);
      g.fillStyle = i % 3 ? "#b7e2df55" : "#fff4cb99";
      g.beginPath();
      g.arc(x, y, i % 3 ? 1 : 2, 0, 7);
      g.fill();
    }
    g.strokeStyle = "#9bcbd1";
    g.lineWidth = 4;
    g.beginPath();
    g.roundRect(18, 28, 364, 590, 48);
    g.stroke();
    g.strokeStyle = "#d9ed6833";
    g.lineWidth = 1;
    g.beginPath();
    g.roundRect(25, 35, 350, 576, 42);
    g.stroke();
    line(130, 180, 270, 180, "#a7f0e638");
    line(270, 180, 200, 280, "#a7f0e638");
    line(200, 280, 130, 180, "#a7f0e638");
    function star(x: number, y: number, r: number, color: string) {
      if (!g) return;
      g.fillStyle = color;
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5,
          rr = i % 2 ? r * 0.43 : r;
        i
          ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
          : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      g.closePath();
      g.fill();
    }
    for (let i = 0; i < 3; i++) {
      const x = 105 + i * 95;
      g.fillStyle = s.targets[i] ? "#d9ed68" : "#29485b";
      g.beginPath();
      g.roundRect(x - 24, 64, 48, 20, 6);
      g.fill();
      g.fillStyle = s.targets[i] ? "#17211d" : "#d0e7e2";
      g.font = "700 13px system-ui";
      g.textAlign = "center";
      g.fillText(["I", "II", "III"][i]!, x, 79);
    }
    BUMPERS.forEach((b, i) => {
      g.fillStyle = "#071e30";
      g.beginPath();
      g.arc(b.x, b.y + 5, 27, 0, 7);
      g.fill();
      g.fillStyle = ["#ef896b", "#a7f0e6", "#d9ed68"][i]!;
      g.beginPath();
      g.arc(b.x, b.y, 25, 0, 7);
      g.fill();
      g.strokeStyle = "#fff4cc";
      g.lineWidth = 2;
      g.stroke();
      star(b.x, b.y, 16, "#183744");
      if (s.cooldown[i]! > 0 && motion.enabled()) {
        g.strokeStyle = "#fff4cc99";
        g.beginPath();
        g.arc(b.x, b.y, 29 + (1 - s.cooldown[i]! / 0.2) * 14, 0, 7);
        g.stroke();
      }
    });
    g.textAlign = "center";
    g.fillStyle = "#f5f2e9";
    g.font = "800 25px system-ui";
    g.fillText(ko ? "별빛 핀볼" : "STAR PINBALL", 200, 363);
    g.font = "600 12px system-ui";
    g.fillStyle = "#a7f0e6";
    g.fillText(
      ko ? "별자리 표적 3개 = 보너스 500" : "LIGHT THREE TARGETS · BONUS 500",
      200,
      385,
    );
    line(28, 390, 100, 528, "#ef896b", 12);
    line(372, 390, 300, 528, "#a7f0e6", 12);
    line(100, 535, 175, 565 - s.left * 65, "#f5bd70", 17);
    line(300, 535, 225, 565 - s.right * 65, "#f5bd70", 17);
    line(100, 532, 175, 562 - s.left * 65, "#fff1b1", 4);
    line(300, 532, 225, 562 - s.right * 65, "#fff1b1", 4);
    g.fillStyle = "#0c1c2a";
    g.beginPath();
    g.roundRect(175, 600, 50, 22, 8);
    g.fill();
    g.fillStyle = "#b8d4cf";
    g.font = "10px system-ui";
    g.fillText(ko ? "드레인" : "DRAIN", 200, 615);
    if (motion.enabled()) {
      trail.forEach((p, i) => {
        g.fillStyle = `rgba(167,240,230,${(i / trail.length) * 0.35})`;
        g.beginPath();
        g.arc(p.x, p.y, 3 + i * 0.55, 0, 7);
        g.fill();
      });
    }
    const b = s.ball;
    g.fillStyle = "#0006";
    g.beginPath();
    g.arc(b.x + 3, b.y + 4, 10, 0, 7);
    g.fill();
    const shine = g.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, 10);
    shine.addColorStop(0, "#ffffff");
    shine.addColorStop(0.45, "#f5f2e9");
    shine.addColorStop(1, "#7ca1b7");
    g.fillStyle = shine;
    g.beginPath();
    g.arc(b.x, b.y, 9, 0, 7);
    g.fill();
    if (s.phase === "ready") {
      g.fillStyle = "#112c43ef";
      g.beginPath();
      g.roundRect(55, 414, 290, 48, 14);
      g.fill();
      g.fillStyle = "#fff2bf";
      g.font = "700 17px system-ui";
      g.fillText(
        ko ? "발사 버튼으로 다음 공 시작" : "Press Launch to send the ball",
        200,
        444,
      );
    }
    if (status.textContent !== label()) status.textContent = label();
    fire.disabled = !active || s.phase !== "ready";
    left.disabled = right.disabled = !active;
    left.setAttribute("aria-pressed", String(s.left > 0.5));
    right.setAttribute("aria-pressed", String(s.right > 0.5));
    canvas.dataset.phase = s.phase;
    canvas.dataset.time = s.time.toFixed(2);
    canvas.dataset.left = s.left.toFixed(2);
    canvas.dataset.ball = String(s.number);
    canvas.dataset.score = String(s.score);
  }
  function clear() {
    keys.clear();
    pointers.clear();
    trail.length = 0;
  }
  function pause() {
    active = false;
    cancelAnimationFrame(frame);
    last = 0;
    clear();
    motion.finish();
    draw();
  }
  function finish(restored = false) {
    if (ended) return;
    ended = true;
    pause();
    ctx.onEnd({
      score: s.score,
      won: s.phase === "won",
      restored,
      message: label(),
    });
  }
  function tick(now: number) {
    if (!active || dead) return;
    const score = s.score,
      hits = s.hits;
    step(
      s,
      last ? (now - last) / 1000 : 0,
      keys.has("left") ||
        keys.has("button-left") ||
        [...pointers.values()].includes("left"),
      keys.has("right") ||
        keys.has("button-right") ||
        [...pointers.values()].includes("right"),
    );
    last = now;
    if (motion.enabled() && s.phase === "playing") {
      trail.push({ x: s.ball.x, y: s.ball.y });
      if (trail.length > 8) trail.shift();
    } else trail.length = 0;
    draw();
    if (s.score !== score) {
      ctx.onChange(s.score);
      motion.finish();
      motion.run(
        (t) => {
          t.fromTo(status, { opacity: 0.4 }, { opacity: 1, duration: 0.22 });
        },
        () => {
          status.style.opacity = "1";
        },
      );
    }
    if (s.hits !== hits) ctx.sound();
    if (now - saveAt > 1200) {
      saveAt = now;
      ctx.onSave?.();
    }
    if (s.phase === "won" || s.phase === "lost") {
      finish();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (active || dead) return;
    if (s.phase === "won" || s.phase === "lost") {
      finish(!!saved);
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
        /INPUT|SELECT|TEXTAREA/.test((e.target as HTMLElement)?.tagName)
      )
        return;
      const k = e.key.toLowerCase();
      if (["arrowleft", "a", "arrowright", "d"].includes(k)) {
        e.preventDefault();
        keys.add(k === "a" || k === "arrowleft" ? "left" : "right");
      }
      if (
        (k === " " || k === "enter") &&
        !(e.target as HTMLElement)?.closest("button,a")
      ) {
        e.preventDefault();
        if (!e.repeat) launch(s);
      }
    },
    options,
  );
  window.addEventListener(
    "keyup",
    (e) => {
      const k = e.key.toLowerCase();
      if (k === "a" || k === "arrowleft") keys.delete("left");
      if (k === "d" || k === "arrowright") keys.delete("right");
    },
    options,
  );
  window.addEventListener("blur", clear, options);
  draw();
  ctx.onChange(s.score);
  ctx.onReady?.({ width: 400, height: 640 });
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
      if (a === "confirm") launch(s);
    },
    serialize() {
      return {
        ...s,
        ball: { ...s.ball },
        targets: [...s.targets],
        cooldown: [...s.cooldown],
      };
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
