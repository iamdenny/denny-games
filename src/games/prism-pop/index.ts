import type { GameFactory } from "../../lib/types";
import { arcade, backdrop, circle } from "./host";
import {
  newPop,
  restorePop,
  stepPop,
  arenas,
  radius,
  W,
  H,
  FLOOR,
} from "./rules";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  return arcade(ctx, {
    width: W,
    height: H,
    title: ko ? "프리즘 팝" : "Prism Pop",
    create: () => newPop(ctx.stage),
    restore: (v) => restorePop(v, ctx.stage),
    update: stepPop,
    controls: [
      { id: "left", label: "←", keys: ["ArrowLeft", "KeyA"] },
      { id: "fire", label: ko ? "작살" : "Harpoon", keys: ["Space", "KeyJ"] },
      { id: "right", label: "→", keys: ["ArrowRight", "KeyD"] },
    ],
    status: (s) =>
      s.status === "won"
        ? ko
          ? "모든 구슬을 터뜨렸어요!"
          : "Every sphere cleared!"
        : s.status === "lost"
          ? ko
            ? "다시 도전해 보세요"
            : "Try the arena again"
          : ko
            ? `구슬 ${s.balls.length} · 목숨 ${s.lives} · ${Math.ceil(s.time)}초 · 이동하고 작살을 쏘세요`
            : `${s.balls.length} spheres · ${s.lives} lives · ${Math.ceil(s.time)}s · Move and fire a harpoon`,
    draw(g, s, quiet) {
      backdrop(g, W, H, "#93fff0");
      g.strokeStyle = "#35536d";
      g.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        g.beginPath();
        g.moveTo(x, 40);
        g.lineTo(x, FLOOR);
        g.stroke();
      }
      g.fillStyle = "#7de9cc";
      g.fillRect(0, FLOOR, W, 4);
      g.fillStyle = "#34445f";
      g.fillRect(0, FLOOR + 4, W, H - FLOOR);
      for (const x of arenas[s.stage - 1]!.pillars) {
        g.fillStyle = "#637aa3";
        g.fillRect(x - 10, FLOOR - 70, 20, 70);
        g.fillStyle = "#a1c1e8";
        g.fillRect(x - 12, FLOOR - 74, 24, 5);
      }
      for (const b of s.balls) {
        const r = radius(b.size);
        circle(g, b.x, b.y, r, ["#ffcf80", "#ab9cff", "#79e6d7"][b.size]!);
        g.strokeStyle = "#ffffff99";
        g.lineWidth = 2;
        g.beginPath();
        g.arc(b.x, b.y, r - 4, 3.5, 5.1);
        g.stroke();
        circle(g, b.x - r * 0.3, b.y - r * 0.35, r * 0.15, "#fff9");
      }
      for (const r of s.ropes) {
        g.strokeStyle = "#ffe7a9";
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(r.x, FLOOR - 26);
        g.lineTo(r.x, r.y);
        g.stroke();
        g.fillStyle = "#fff5db";
        g.beginPath();
        g.moveTo(r.x, r.y - 8);
        g.lineTo(r.x - 7, r.y + 5);
        g.lineTo(r.x + 7, r.y + 5);
        g.fill();
      }
      g.globalAlpha = s.shield > 0 ? 0.65 : 1;
      circle(g, s.x, FLOOR - 28, 10, "#ffdbb0");
      g.fillStyle = "#66d9cf";
      g.fillRect(s.x - 12, FLOOR - 19, 24, 17);
      g.fillStyle = "#18253a";
      g.fillRect(s.x - 8, FLOOR - 4, 6, 5);
      g.fillRect(s.x + 3, FLOOR - 4, 6, 5);
      g.globalAlpha = 1;
      if (s.shield > 0) {
        g.strokeStyle = "#a9fff3";
        g.beginPath();
        g.arc(s.x, FLOOR - 18, 25, 0, Math.PI * 2);
        g.stroke();
      }
      g.fillStyle = "#dcecff";
      g.font = "bold 16px system-ui";
      g.fillText(`${ko ? "경기장" : "ARENA"} ${s.stage} / 8`, 18, 24);
      g.textAlign = "right";
      g.fillText(String(s.score).padStart(5, "0"), W - 18, 24);
      g.textAlign = "left";
      if (!quiet && s.burst > 0) {
        g.globalAlpha = s.burst;
        g.fillStyle = "#bfffee";
        g.fillRect(0, 0, W, H);
        g.globalAlpha = 1;
      }
    },
  });
};
