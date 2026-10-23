import type { GameFactory } from "../../lib/types";
import { arcade, backdrop, circle } from "../prism-pop/host";
import {
  VW,
  VH,
  TILE,
  newVault,
  restoreVault,
  stepVault,
  mapFor,
  type Actor,
} from "./rules";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  return arcade(ctx, {
    width: VW,
    height: VH,
    title: ko ? "볼트 러너" : "Vault Runner",
    create: () => newVault(ctx.stage),
    restore: (v) => restoreVault(v, ctx.stage),
    update: stepVault,
    controls: [
      { id: "left", label: "←", keys: ["ArrowLeft", "KeyA"] },
      { id: "up", label: "↑", keys: ["ArrowUp", "KeyW"] },
      { id: "down", label: "↓", keys: ["ArrowDown", "KeyS"] },
      { id: "right", label: "→", keys: ["ArrowRight", "KeyD"] },
      { id: "digLeft", label: ko ? "↙ 파기" : "Dig ↙", keys: ["KeyZ"] },
      {
        id: "digRight",
        label: ko ? "파기 ↘" : "Dig ↘",
        keys: ["KeyX", "Space"],
      },
    ],
    action: (a) => (a === "confirm" ? "digRight" : a),
    status: (s) =>
      s.status === "won"
        ? ko
          ? "보물을 가지고 탈출했어요!"
          : "Treasure secured. You escaped!"
        : s.status === "lost"
          ? ko
            ? "경비를 피해 다시 도전하세요"
            : "Try again and avoid the guards"
          : ko
            ? `보물 ${s.gold.length}개 · ${Math.ceil(s.time)}초 · 모두 모으면 오른쪽 위 출구`
            : `${s.gold.length} treasures · ${Math.ceil(s.time)}s · Collect all, exit at top right`,
    draw(g, s, quiet) {
      backdrop(g, VW, VH, "#f3d79a");
      const map = mapFor(s.stage);
      for (let y = 0; y < map.length; y++)
        for (let x = 0; x < map[y]!.length; x++) {
          const t = map[y]![x]!,
            px = x * TILE,
            py = y * TILE;
          if (t === "#" || t === "X") {
            const hole = s.holes.find((h) => h.x === x && h.y === y);
            if (hole) {
              g.strokeStyle = hole.life < 1.5 ? "#f1b77e" : "#668b9e";
              g.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
              if (hole.life < 1.5) {
                g.fillStyle = "#7a6a5c";
                g.fillRect(px, py + TILE - 4, TILE, 4);
              }
              continue;
            }
            g.fillStyle = t === "X" ? "#344359" : "#92755e";
            g.fillRect(px, py, TILE, TILE);
            g.strokeStyle = t === "X" ? "#536279" : "#ba9b7d";
            g.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);
            if (t === "#") {
              g.beginPath();
              g.moveTo(px, py + 14);
              g.lineTo(px + 28, py + 14);
              g.moveTo(px + 14, py);
              g.lineTo(px + 14, py + 14);
              g.stroke();
            }
          } else if (t === "H") {
            g.fillStyle = "#c4a76f";
            g.fillRect(px + 6, py, 3, TILE);
            g.fillRect(px + 19, py, 3, TILE);
            for (let n = 4; n < TILE; n += 8) g.fillRect(px + 6, py + n, 16, 2);
          }
        }
      for (const gold of s.gold) {
        const x = (gold.x + 0.5) * TILE,
          y = (gold.y + 0.5) * TILE;
        g.save();
        g.translate(x, y);
        if (!quiet) g.translate(0, Math.sin(s.clock * 3 + gold.x) * 2);
        g.fillStyle = "#ffe2a0";
        g.beginPath();
        g.moveTo(0, -9);
        g.lineTo(8, 0);
        g.lineTo(0, 9);
        g.lineTo(-8, 0);
        g.closePath();
        g.fill();
        g.restore();
      }
      g.fillStyle = s.gold.length ? "#526077" : "#9be8cf";
      g.fillRect(18 * TILE + 5, TILE + 2, 18, 25);
      g.fillStyle = "#172c3d";
      g.font = "bold 15px system-ui";
      g.fillText(s.gold.length ? "×" : "↑", 18 * TILE + 9, TILE + 20);
      function person(a: Actor, color: string) {
        if (!a.alive) return;
        const f = quiet ? 1 : 1 - a.anim / 0.12,
          x = (a.px + (a.x - a.px) * f + 0.5) * TILE,
          y = (a.py + (a.y - a.py) * f + 0.5) * TILE;
        circle(g, x, y - 5, 6, a.trapped ? "#efb69d" : "#ffe0b8");
        g.fillStyle = color;
        g.fillRect(x - 7, y + 1, 14, 9);
        g.fillStyle = "#1b2839";
        g.fillRect(x - 6, y + 10, 4, 4);
        g.fillRect(x + 2, y + 10, 4, 4);
        g.fillStyle = color;
        g.fillRect(x - 8, y - 11, 16, 4);
      }
      for (const a of s.guards) person(a, a.trapped ? "#c07b61" : "#df8d9a");
      person(s.player, "#82e1d1");
      g.fillStyle = "#e1e9f4";
      g.font = "bold 12px system-ui";
      g.fillText(`${ko ? "금고" : "VAULT"} ${s.stage}/12`, 35, 18);
      g.textAlign = "right";
      g.fillText(String(s.score), VW - 35, 18);
      g.textAlign = "left";
    },
  });
};
