import type { GameFactory } from "../../lib/types";
import { arcade, backdrop, circle } from "../prism-pop/host";
import {
  BW,
  BH,
  R,
  center,
  newHarbor,
  restoreHarbor,
  stepHarbor,
} from "./rules";
const colors = ["#77dfdc", "#ffafbe", "#ffe19b", "#b5a2ff"];
function orb(g: CanvasRenderingContext2D, x: number, y: number, color: number) {
  circle(g, x, y, R - 1, colors[color]!);
  circle(g, x - 4, y - 5, 4, "#ffffff77");
  g.fillStyle = "#213655";
  g.font = "bold 13px system-ui";
  g.textAlign = "center";
  g.fillText(["•", "+", "◇", "≡"][color]!, x, y + 5);
  g.textAlign = "left";
}
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  return arcade(ctx, {
    width: BW,
    height: BH,
    title: ko ? "버블 하버" : "Bubble Harbor",
    pointer: true,
    create: () => newHarbor(ctx.stage),
    restore: (v) => restoreHarbor(v, ctx.stage),
    update: stepHarbor,
    controls: [
      { id: "left", label: "↖", keys: ["ArrowLeft", "KeyA"] },
      { id: "fire", label: ko ? "발사" : "Shoot", keys: ["Space", "Enter"] },
      { id: "right", label: "↗", keys: ["ArrowRight", "KeyD"] },
      { id: "swap", label: ko ? "교환" : "Swap", keys: ["KeyX", "ArrowDown"] },
    ],
    status: (s) =>
      s.status === "won"
        ? ko
          ? "항구가 깨끗해졌어요!"
          : "Harbor cleared!"
        : s.status === "lost"
          ? ko
            ? "구슬이 제한선에 닿았어요"
            : "Bubbles reached the limit"
          : ko
            ? `${s.board.length}개 남음 · 같은 색 3개 · 실패 ${s.misses % 5}/5 후 하강`
            : `${s.board.length} left · Match 3 · ${s.misses % 5}/5 misses before descent`,
    draw(g, s, quiet) {
      backdrop(g, BW, BH, "#9de5e1");
      g.fillStyle = "#304d65";
      g.fillRect(0, 38 + s.offset, BW, 5);
      g.setLineDash([6, 6]);
      g.strokeStyle = "#ed9aa4";
      g.beginPath();
      g.moveTo(0, 420);
      g.lineTo(BW, 420);
      g.stroke();
      g.setLineDash([]);
      for (const b of s.board) {
        const p = center(b, s.offset);
        orb(g, p.x, p.y, b.color);
      }
      if (!s.flight) {
        let x = BW / 2,
          y = 475,
          vx = Math.cos(s.angle),
          vy = Math.sin(s.angle);
        for (let j = 0; j < 22; j++) {
          x += vx * 12;
          y += vy * 12;
          if (x < R) {
            x = 2 * R - x;
            vx = -vx;
          }
          if (x > BW - R) {
            x = 2 * (BW - R) - x;
            vx = -vx;
          }
          if (y < 54 + s.offset) break;
          circle(g, x, y, 2, "#ffffff77");
        }
        g.save();
        g.translate(BW / 2, 475);
        g.rotate(s.angle);
        g.fillStyle = "#b8d6e1";
        g.fillRect(0, -7, 32, 14);
        g.restore();
        orb(g, BW / 2, 475, s.ammo);
      } else orb(g, s.flight.x, s.flight.y, s.flight.color);
      orb(g, 54, 475, s.next);
      g.fillStyle = "#cde2f4";
      g.font = "12px system-ui";
      g.fillText(ko ? "다음" : "NEXT", 37, 510);
      g.font = "bold 15px system-ui";
      g.fillText(`${ko ? "항구" : "HARBOR"} ${s.stage} / 12`, 12, 25);
      g.textAlign = "right";
      g.fillText(String(s.score), BW - 12, 25);
      g.textAlign = "left";
      if (!quiet && s.flash > 0) {
        g.globalAlpha = s.flash * 0.5;
        g.fillStyle = "#bdf5e2";
        g.fillRect(0, 0, BW, BH);
        g.globalAlpha = 1;
      }
    },
  });
};
