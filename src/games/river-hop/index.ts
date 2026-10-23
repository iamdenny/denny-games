import "./style.css";
import type { GameFactory, Action } from "../../lib/types";
import { createMotion } from "../../lib/motion";
import {
  fresh,
  restore,
  hop,
  step,
  objects,
  ROADS,
  WATER,
  score,
  type Direction,
} from "./rules";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko",
    saved = restore(ctx.saved, ctx.stage);
  let s = saved ?? fresh(ctx.stage),
    active = false,
    ended = false,
    dead = false,
    raf = 0,
    last = 0,
    saveAt = 0;
  const canvas = document.createElement("canvas");
  canvas.width = 450;
  canvas.height = 550;
  canvas.tabIndex = 0;
  canvas.dataset.game = "river-hop";
  canvas.setAttribute(
    "aria-label",
    ko
      ? "강 건너기 · 방향 버튼으로 건너편 꽃밭까지"
      : "River Hop · use directions to reach the flower bank",
  );
  canvas.style.cssText =
    "width:min(100%,calc(100cqh * 450 / 550));height:auto;max-height:100%;max-width:100%;aspect-ratio:450/550;display:block;object-fit:contain;border-radius:16px;margin:auto;touch-action:none;min-width:0;min-height:0";
  const g = canvas.getContext("2d");
  if (!g) throw Error(ko ? "화면을 만들 수 없어요." : "Canvas unavailable.");
  ctx.host.append(canvas);
  const panel = document.createElement("div");
  panel.className = "river-controls";
  panel.style.cssText =
    "display:grid;gap:2px;width:100%;max-width:650px;margin:auto;font:12px/1.35 system-ui";
  const status = document.createElement("p");
  status.style.cssText = "margin:0;font-weight:800";
  status.setAttribute("role", "status");
  const row = document.createElement("div");
  row.className = "river-actions";
  row.style.cssText = "display:grid;gap:4px";
  const hint = document.createElement("p");
  hint.style.margin = "0";
  hint.textContent = ko
    ? "차를 피하고 통나무를 타고 ↑ 꽃밭으로!"
    : "Dodge cars, ride logs. Reach the top bank!";
  panel.append(status, row, hint);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const abort = new AbortController(),
    motion = createMotion(ctx.host),
    pose = { x: 0, y: 0 };
  const buttons = (["left", "up", "down", "right"] as Direction[]).map(
    (d, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = ["←", "↑", "↓", "→"][i]!;
      b.setAttribute(
        "aria-label",
        ko
          ? ["왼쪽", "앞으로", "뒤로", "오른쪽"][i]!
          : ["Left", "Forward", "Back", "Right"][i]!,
      );
      b.dataset.riverAction = d;
      b.style.cssText =
        "min-width:48px;min-height:48px;border:1px solid #8eb8bd;border-radius:10px;background:#254554;color:#f5f2e9;font:800 20px system-ui;padding:3px;touch-action:manipulation";
      b.addEventListener("click", () => act(d), { signal: abort.signal });
      row.append(b);
      return b;
    },
  );
  function draw() {
    if (!g) return;
    g.clearRect(0, 0, 450, 550);
    for (let r = 0; r < 11; r++) {
      const water = WATER.includes(r),
        road = ROADS.includes(r);
      g.fillStyle = water
        ? "#286d80"
        : road
          ? "#364851"
          : r === 0
            ? "#8ebf8f"
            : "#6f9275";
      g.fillRect(0, r * 50, 450, 50);
      if (road) {
        g.strokeStyle = "#bec7b866";
        g.setLineDash([14, 18]);
        g.beginPath();
        g.moveTo(0, r * 50 + 25);
        g.lineTo(450, r * 50 + 25);
        g.stroke();
        g.setLineDash([]);
      } else if (water) {
        g.strokeStyle = "#9edbd44d";
        for (let k = 0; k < 9; k++) {
          g.beginPath();
          g.moveTo(k * 60, r * 50 + 12);
          g.quadraticCurveTo(
            k * 60 + 12,
            r * 50 + 18,
            k * 60 + 28,
            r * 50 + 12,
          );
          g.stroke();
        }
      } else {
        g.fillStyle = "#e4e9b455";
        for (let k = 0; k < 12; k++)
          g.fillRect((k * 47 + r * 23) % 450, r * 50 + ((k * 17) % 40), 3, 6);
      }
      if (water || road)
        for (const o of objects(s, r)) {
          const x = o.x * 50,
            w = o.width * 50;
          g.fillStyle = water
            ? "#bd8f61"
            : r === 8
              ? "#edaa7e"
              : r === 7
                ? "#a6d7dc"
                : "#d4c68a";
          g.beginPath();
          g.roundRect(x, r * 50 + 8, w, 34, water ? 13 : 8);
          g.fill();
          if (water) {
            g.strokeStyle = "#6d533e";
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(x + 12, r * 50 + 19);
            g.lineTo(x + w - 12, r * 50 + 19);
            g.moveTo(x + 18, r * 50 + 31);
            g.lineTo(x + w - 18, r * 50 + 31);
            g.stroke();
            g.lineWidth = 1;
          } else {
            g.fillStyle = "#203d4b";
            g.fillRect(x + w * 0.22, r * 50 + 12, w * 0.43, 9);
            g.fillRect(x + w * 0.22, r * 50 + 29, w * 0.43, 8);
            g.fillStyle = "#edf3dc";
            g.fillRect(x + w - 7, r * 50 + 14, 4, 6);
          }
        }
    }
    g.fillStyle = "#f9edba";
    g.font = "800 17px system-ui";
    g.textAlign = "center";
    g.fillText(ko ? "✿ 건너편 꽃밭 ✿" : "✿ FLOWER BANK ✿", 225, 32);
    const x = s.x * 50 + pose.x,
      y = (s.row + 0.5) * 50 + pose.y;
    g.fillStyle = "#102d3544";
    g.beginPath();
    g.ellipse(x, y + 13, 17, 7, 0, 0, 7);
    g.fill();
    g.fillStyle = "#f4e8bd";
    g.beginPath();
    g.ellipse(x, y, 15, 13, 0, 0, 7);
    g.fill();
    g.fillStyle = "#ef9e79";
    g.beginPath();
    g.moveTo(x - 5, y - 12);
    g.lineTo(x, y - 22);
    g.lineTo(x + 6, y - 11);
    g.fill();
    g.fillStyle = "#203e40";
    g.beginPath();
    g.arc(x - 5, y - 3, 2, 0, 7);
    g.arc(x + 5, y - 3, 2, 0, 7);
    g.fill();
    g.strokeStyle = "#fff6cf";
    g.lineWidth = 2;
    if (s.invulnerable > 0) {
      g.beginPath();
      g.arc(x, y, 21, 0, 7);
      g.stroke();
    }
    g.lineWidth = 1;
    const label = ko
      ? `강 ${ctx.stage}/5 · 목숨 ${s.lives}/3 · ${Math.floor(s.time)}초`
      : `RIVER ${ctx.stage}/5 · LIVES ${s.lives}/3 · ${Math.floor(s.time)}s`;
    if (status.textContent !== label) status.textContent = label;
    canvas.dataset.row = String(s.row);
    canvas.dataset.x = s.x.toFixed(3);
    canvas.dataset.time = s.time.toFixed(3);
    canvas.dataset.lives = String(s.lives);
    canvas.dataset.phase = s.phase;
    canvas.dataset.hops = String(s.hops);
    buttons.forEach((b) => (b.disabled = !active));
  }
  function end(restored = false) {
    if (ended || s.phase === "play") return;
    ended = true;
    pause();
    ctx.onEnd({
      won: s.phase === "won",
      score: score(s),
      restored,
      message: ko
        ? s.phase === "won"
          ? "꽃밭에 도착했어요!"
          : "목숨을 모두 사용했어요."
        : s.phase === "won"
          ? "You reached the flower bank!"
          : "All lives used.",
    });
  }
  function pause() {
    active = false;
    cancelAnimationFrame(raf);
    last = 0;
    motion.finish();
    draw();
  }
  function act(a: Action) {
    if (!active || a === "confirm") return;
    motion.finish();
    const x = s.x,
      r = s.row,
      lives = s.lives;
    hop(s, a);
    if (x !== s.x || r !== s.row) {
      pose.x = (x - s.x) * 50;
      pose.y = (r - s.row) * 50;
      if (lives === s.lives)
        motion.run(
          (t) => {
            t.to(pose, { x: 0, y: 0, duration: 0.13, ease: "power2.out" });
          },
          () => {
            pose.x = pose.y = 0;
          },
        );
      else pose.x = pose.y = 0;
      ctx.sound();
      ctx.onChange(score(s));
      ctx.onSave?.();
    }
    draw();
    end();
  }
  function tick(now: number) {
    if (!active || dead) return;
    const lives = s.lives;
    step(s, last ? (now - last) / 1000 : 0);
    last = now;
    if (lives !== s.lives) {
      motion.finish();
      pose.x = pose.y = 0;
      ctx.sound();
      ctx.onChange(score(s));
      ctx.onSave?.();
    }
    draw();
    if (now - saveAt > 1200) {
      saveAt = now;
      ctx.onSave?.();
    }
    if (s.phase !== "play") {
      end();
      return;
    }
    raf = requestAnimationFrame(tick);
  }
  function start() {
    if (dead || active) return;
    if (s.phase !== "play") {
      end(!!saved);
      return;
    }
    active = true;
    last = 0;
    draw();
    raf = requestAnimationFrame(tick);
  }
  const resize = new ResizeObserver(() => motion.finish());
  resize.observe(canvas);
  draw();
  ctx.onChange(score(s));
  ctx.onReady?.({ width: 450, height: 550 });
  return {
    start,
    resume: start,
    pause,
    restart() {
      pause();
      s = fresh(ctx.stage);
      ended = false;
      ctx.onChange(score(s));
      start();
      ctx.onSave?.();
    },
    action: act,
    serialize: () => ({ ...s }),
    destroy() {
      pause();
      dead = true;
      abort.abort();
      resize.disconnect();
      motion.destroy();
      canvas.remove();
      panel.remove();
    },
  };
};
