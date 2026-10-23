import type { GameFactory } from "../../lib/types";
import { host, text, disc } from "../ember-maze/host";
import { create, restore, step, directions, type Tank } from "./rules";
export const mount: GameFactory = (ctx) =>
  host(ctx, {
    id: "iron-bastion",
    title: ["Iron Bastion", "강철 보루"],
    hint: [
      "Protect the beacon. Break brick walls, stop raiders and collect repair kits. P2: WASD + F.",
      "봉화를 지키세요. 벽돌을 부수고 적을 막으며 수리 상자를 모으세요. P2: WASD + F.",
    ],
    action: ["Fire", "발사"],
    create,
    restore,
    step,
    status: (s, ko) =>
      s.won
        ? ko
          ? "보루를 지켰어요!"
          : "Bastion defended!"
        : s.lost
          ? ko
            ? "방어선이 무너졌어요. 다시 도전!"
            : "Defenses fell. Try again!"
          : `${ko ? "봉화" : "Beacon"} ${"◆".repeat(s.base)} · ${s.heroes.map((h, i) => `P${i + 1} ${"♥".repeat(h.hp) || "—"}`).join(" · ")} · ${ko ? "격파" : "Defeated"} ${s.destroyed}`,
    draw(g, s, stage, ko, effects) {
      g.fillStyle = "#152e35";
      g.fillRect(0, 0, 800, 520);
      text(g, `${ko ? "강철 보루" : "IRON BASTION"} / ${stage}`, 25, 33, 22);
      text(g, String(s.score), 675, 33, 22, "#ffe0a0");
      g.save();
      g.translate(40, 60);
      g.fillStyle = "#24423f";
      g.fillRect(0, 0, 720, 432);
      s.tiles.forEach((v, i) => {
        const x = (i % 20) * 36,
          y = Math.floor(i / 20) * 36;
        g.strokeStyle = "#36534a";
        g.strokeRect(x, y, 36, 36);
        if (v === 1) {
          g.fillStyle = "#738d94";
          g.fillRect(x + 2, y + 2, 32, 32);
          g.strokeStyle = "#b3c6c5";
          g.strokeRect(x + 6, y + 6, 24, 24);
        }
        if (v === 2) {
          g.fillStyle = "#b57d5a";
          g.fillRect(x + 2, y + 2, 32, 32);
          g.strokeStyle = "#e0ac75";
          g.beginPath();
          g.moveTo(x + 2, y + 18);
          g.lineTo(x + 34, y + 18);
          g.moveTo(x + 18, y + 2);
          g.lineTo(x + 18, y + 18);
          g.moveTo(x + 10, y + 18);
          g.lineTo(x + 10, y + 34);
          g.stroke();
        }
      });
      const tank = (t: Tank, color: string) => {
        if (!t.hp) return;
        g.save();
        g.translate(t.x, t.y);
        g.rotate((t.dir * Math.PI) / 2);
        if (t.inv && effects)
          g.globalAlpha = 0.55 + 0.25 * Math.sin(s.time * 25);
        g.fillStyle = "#16282e";
        g.fillRect(-15, -15, 8, 30);
        g.fillRect(7, -15, 8, 30);
        g.strokeStyle = "#637d78";
        for (let y = -12; y <= 12; y += 6) {
          g.beginPath();
          g.moveTo(-15, y);
          g.lineTo(-7, y);
          g.moveTo(7, y);
          g.lineTo(15, y);
          g.stroke();
        }
        g.fillStyle = color;
        g.fillRect(-9, -12, 18, 24);
        disc(g, 0, 0, 8, color);
        g.fillStyle = "#d9e6be";
        g.fillRect(-3, -23, 6, 21);
        g.restore();
      };
      s.heroes.forEach((h, i) => tank(h, i ? "#f2c17e" : "#a5e2cb"));
      s.enemies.forEach((h) => tank(h, "#cf826d"));
      s.bullets.forEach((b) => {
        const d = directions[b.dir]!;
        if (effects) disc(g, b.x - d[0] * 8, b.y - d[1] * 8, 4, "#ffd28c55");
        disc(g, b.x, b.y, 3, b.enemy ? "#ffb08c" : "#fff4b3");
      });
      s.pickups.forEach((p) => {
        g.fillStyle = "#85c7b0";
        g.fillRect(p.x - 10, p.y - 10, 20, 20);
        g.fillStyle = "#eff7d6";
        g.fillRect(p.x - 2, p.y - 7, 4, 14);
        g.fillRect(p.x - 7, p.y - 2, 14, 4);
      });
      disc(g, 378, 414, 18, "#214447");
      disc(g, 378, 414, 11, s.base ? "#ffe296" : "#574945");
      if (effects && s.base) {
        g.strokeStyle = "#ffe29655";
        g.beginPath();
        g.arc(378, 414, 18 + Math.sin(s.time * 3) * 3, 0, 7);
        g.stroke();
      }
      g.restore();
    },
  });
