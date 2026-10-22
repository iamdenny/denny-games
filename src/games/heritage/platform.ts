import type { GameFactory } from "../../lib/types";
import { newWild, restoreWild, stepWild, level } from "./wild";
import "./style.css";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  const saved = ctx.saved as { stage?: number; state?: unknown } | undefined;
  let s = saved?.stage === ctx.stage ? restoreWild(saved.state) : newWild(),
    active = false,
    ended = false,
    frame = 0,
    previous = 0,
    saveTime = 0,
    moveUntil = 0,
    keyX = 0,
    padX = 0,
    jump = false,
    hit = false;
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 450;
  canvas.className = "wild-canvas";
  canvas.tabIndex = 0;
  canvas.setAttribute(
    "aria-label",
    ko
      ? "호박빛 탐험. 방향키 이동, 위로 점프, Space 공격."
      : "Amber Trail. Arrows move, up jumps, Space attacks.",
  );
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas2D unavailable");
  const tools = document.createElement("div");
  tools.className = "heritage-tools";
  const note = document.createElement("p");
  note.className = "heritage-note";
  note.setAttribute("role", "status");
  const actions = document.createElement("div");
  actions.append(tools, note);
  ctx.host.append(canvas);
  (ctx.controlsHost ?? ctx.host).append(actions);
  const held = new Map<number, number>();
  const unbind: (() => void)[] = [];
  for (const [label, a] of [
    [ko ? "← 이동" : "← Move", "left"],
    [ko ? "이동 →" : "Move →", "right"],
    [ko ? "점프 ↑" : "Jump ↑", "jump"],
    [ko ? "공격" : "Strike", "hit"],
  ] as const) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.dataset.wildAction = a;
    tools.append(b);
    const down = (e: PointerEvent) => {
      if (!active) return;
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      if (a === "left" || a === "right")
        held.set(e.pointerId, a === "left" ? -1 : 1);
      else if (a === "jump") jump = true;
      else hit = true;
    };
    const up = (e: PointerEvent) => held.delete(e.pointerId);
    b.addEventListener("pointerdown", down);
    b.addEventListener("pointerup", up);
    b.addEventListener("pointercancel", up);
    b.addEventListener("lostpointercapture", up);
    b.addEventListener("click", (e) => {
      if (e.detail === 0 && active) {
        if (a === "jump") jump = true;
        else if (a === "hit") hit = true;
        else {
          keyX = a === "left" ? -1 : 1;
          moveUntil = performance.now() + 180;
        }
      }
    });
  }
  const release = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      keyX = 0;
      moveUntil = 0;
    }
  };
  window.addEventListener("keyup", release);
  unbind.push(() => window.removeEventListener("keyup", release));
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const effects = () =>
    !motion.matches && !ctx.host.closest("#player.low-effects");
  function paint() {
    if (!g) return;
    const l = level(ctx.stage),
      camera = Math.max(0, Math.min(l.width - 800, s.x - 260));
    g.clearRect(0, 0, 800, 450);
    const sky = g.createLinearGradient(0, 0, 0, 450);
    sky.addColorStop(0, "#204d61");
    sky.addColorStop(1, "#f1bb89");
    g.fillStyle = sky;
    g.fillRect(0, 0, 800, 450);
    g.fillStyle = "#ffe1a2";
    g.beginPath();
    g.arc(660, 75, 38, 0, Math.PI * 2);
    g.fill();
    for (let layer = 0; layer < 3; layer++) {
      g.fillStyle = ["#638c86", "#416d67", "#294f48"][layer]!;
      g.beginPath();
      g.moveTo(0, 450);
      for (let x = -100; x < 950; x += 50)
        g.lineTo(
          x,
          220 +
            layer * 50 +
            Math.sin((x + camera * (0.1 + layer * 0.12)) / 110) * 40,
        );
      g.lineTo(800, 450);
      g.fill();
    }
    g.save();
    g.translate(-camera, 0);
    for (const p of l.platforms) {
      g.fillStyle = "#655342";
      g.fillRect(p.x, p.y, p.w, 450 - p.y);
      g.fillStyle = "#9bb984";
      g.fillRect(p.x, p.y, p.w, 9);
      g.fillStyle = "#283f38";
      for (let x = p.x + 12; x < p.x + p.w; x += 28)
        g.fillRect(x, p.y + 18, 12, 5);
    }
    l.gems.forEach((v, i) => {
      if (s.collected.includes(i)) return;
      const y = v.y + (effects() ? Math.sin(s.time * 3 + i) * 3 : 0);
      g.fillStyle = "#ffe18c";
      g.beginPath();
      g.moveTo(v.x, y - 10);
      g.lineTo(v.x + 7, y);
      g.lineTo(v.x, y + 10);
      g.lineTo(v.x - 7, y);
      g.closePath();
      g.fill();
      g.fillStyle = "#fff6cf";
      g.fillRect(v.x - 2, y - 6, 3, 7);
    });
    l.enemies.forEach((v, i) => {
      if (s.defeated.includes(i)) return;
      const x = v.x + Math.sin(s.time * 1.6 + i) * 45;
      g.fillStyle = "#bd6c59";
      g.beginPath();
      g.ellipse(x, v.y + 10, 18, 13, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#e8b98b";
      g.beginPath();
      g.moveTo(x - 12, v.y);
      g.lineTo(x - 16, v.y - 9);
      g.lineTo(x - 5, v.y + 1);
      g.fill();
      g.fillStyle = "#162e35";
      g.fillRect(x - 9, v.y + 3, 4, 4);
      g.fillRect(x - 12, v.y + 20, 8, 4);
      g.fillRect(x + 5, v.y + 20, 8, 4);
    });
    g.fillStyle = s.collected.length >= 6 ? "#b9e5a4" : "#768d89";
    g.fillRect(l.exit, 300, 14, 100);
    g.beginPath();
    g.moveTo(l.exit + 14, 300);
    g.lineTo(l.exit + 65, 315);
    g.lineTo(l.exit + 14, 332);
    g.fill();
    g.save();
    g.translate(s.x, s.y);
    if (s.invincible > 0) g.globalAlpha = 0.55;
    g.scale(s.facing, 1);
    const stride =
      effects() && s.ground && s.vx ? Math.sin(s.time * 16) * 5 : 0;
    g.fillStyle = "#473a36";
    g.fillRect(-11, 14 + stride, 8, 10);
    g.fillRect(4, 14 - stride, 8, 10);
    g.fillStyle = "#e2a66e";
    g.beginPath();
    g.arc(0, -9, 12, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#463e3a";
    g.beginPath();
    g.arc(-2, -14, 12, Math.PI, Math.PI * 2);
    g.fill();
    g.fillStyle = "#f1ce82";
    g.beginPath();
    g.moveTo(-10, 2);
    g.lineTo(9, 2);
    g.lineTo(15, 17);
    g.lineTo(-14, 17);
    g.closePath();
    g.fill();
    g.fillStyle = "#20353d";
    g.fillRect(5, -11, 3, 3);
    g.save();
    g.translate(10, 4);
    g.rotate(s.attack > 0 ? -0.9 + s.attack * 7 : 0.3);
    g.fillStyle = "#7c5841";
    g.fillRect(0, -5, 35, 8);
    g.fillStyle = "#a9beb1";
    g.beginPath();
    g.ellipse(34, -2, 12, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
    if (s.attack > 0 && effects()) {
      g.strokeStyle = "#fff0b5";
      g.lineWidth = 3;
      g.beginPath();
      g.arc(15, 0, 48, -1.1, 1);
      g.stroke();
    }
    g.restore();
    g.restore();
    g.fillStyle = "#102b35cc";
    g.fillRect(12, 12, 330, 44);
    g.fillStyle = "#fff0c7";
    g.font = "bold 18px system-ui";
    g.fillText(
      `${ko ? "체력" : "HP"} ${"♥".repeat(Math.max(0, s.hp))}  ·  ◆ ${s.collected.length}/6  ·  ${s.score}`,
      24,
      40,
    );
    canvas.dataset.x = String(Math.round(s.x));
    canvas.dataset.gems = String(s.collected.length);
    canvas.dataset.hp = String(s.hp);
    note.textContent = ko
      ? "호박석 6개 이상을 모아 깃발로! 점프해서 공격을 피하거나 돌망치를 휘두르세요."
      : "Collect at least 6 amber gems and reach the flag. Jump over foes or swing your stone hammer.";
  }
  function clear() {
    held.clear();
    keyX = padX = 0;
    jump = hit = false;
    moveUntil = 0;
  }
  function complete() {
    if ((s.won || s.lost) && !ended) {
      ended = true;
      active = false;
      clear();
      ctx.onEnd({ won: s.won, score: s.score });
    }
  }
  function tick(now: number) {
    if (!active) return;
    const dt = previous ? Math.min(0.025, (now - previous) / 1000) : 0;
    previous = now;
    const oldScore = s.score;
    const x = held.size
      ? [...held.values()].at(-1)!
      : padX || (now < moveUntil ? keyX : 0);
    s = stepWild(s, ctx.stage, dt, { x, jump, hit });
    jump = hit = false;
    paint();
    if (s.score !== oldScore) {
      ctx.onChange(s.score);
      ctx.sound();
    }
    if (now - saveTime > 1000) {
      saveTime = now;
      ctx.onSave?.();
    }
    complete();
    if (active) frame = requestAnimationFrame(tick);
  }
  function start() {
    if (active) return;
    complete();
    if (ended) return;
    active = true;
    previous = 0;
    frame = requestAnimationFrame(tick);
  }
  const pause = () => {
    active = false;
    cancelAnimationFrame(frame);
    previous = 0;
    clear();
  };
  paint();
  ctx.onChange(s.score);
  ctx.onReady?.({ width: 800, height: 450 });
  return {
    start,
    resume: start,
    pause,
    restart() {
      pause();
      s = newWild();
      ended = false;
      paint();
      ctx.onChange(0);
      start();
    },
    action(a) {
      if (!active) return;
      if ((a === "left" || a === "right") && padX === 0) {
        keyX = a === "left" ? -1 : 1;
        moveUntil = Infinity;
      }
      if (a === "up") jump = true;
      if (a === "confirm") hit = true;
    },
    inputState(v) {
      if (!active) return;
      padX = v.x;
      if (v.pressed) hit = true;
    },
    serialize() {
      return { stage: ctx.stage, state: s };
    },
    destroy() {
      pause();
      unbind.forEach((f) => f());
      canvas.remove();
      actions.remove();
    },
  };
};
