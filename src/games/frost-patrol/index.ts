import type { GameFactory } from "../../lib/types";
import { host, text, disc } from "../ember-maze/host";
import { create, restore, step, platforms } from "./rules";
export const mount: GameFactory = (ctx) =>
  host(ctx, {
    id: "frost-patrol",
    title: ["Frost Patrol", "서리 순찰대"],
    hint: [
      "↑ jumps. Three snow hits freeze a foe; fire nearby to kick the snowball. P2: WASD + F.",
      "↑ 점프. 눈 세 발로 적을 얼리고 가까이에서 발사하면 굴려요. P2: WASD + F.",
    ],
    action: ["Snow / kick", "눈 / 굴리기"],
    create,
    restore,
    step,
    status: (s, ko) =>
      s.won
        ? ko
          ? "모두 굴려 보냈어요!"
          : "The patrol cleared the ridge!"
        : s.lost
          ? ko
            ? "순찰 종료. 다시 도전하세요!"
            : "Patrol ended. Try again!"
          : `${s.heroes.map((h, i) => `P${i + 1} ${"♥".repeat(h.hp) || "—"}`).join(" · ")} · ${ko ? "남은 적" : "Foes"} ${s.enemies.filter((e) => e.alive).length}`,
    draw(g, s, stage, ko, effects) {
      const sky = g.createLinearGradient(0, 0, 0, 520);
      sky.addColorStop(0, "#172c58");
      sky.addColorStop(1, "#6095a4");
      g.fillStyle = sky;
      g.fillRect(0, 0, 800, 520);
      disc(g, 665, 80, 36, "#fff1c6");
      for (let i = 0; i < 35; i++) {
        const x = (i * 137) % 800,
          y = (i * 79 + (effects ? s.time * 10 : 0)) % 500;
        disc(g, x, y, i % 3 === 0 ? 2 : 1, "#dcefff99");
      }
      g.fillStyle = "#325773";
      g.beginPath();
      g.moveTo(0, 465);
      for (let x = 0; x <= 800; x += 100)
        g.lineTo(x, 220 + Math.sin(x * 0.014) * 60);
      g.lineTo(800, 520);
      g.lineTo(0, 520);
      g.fill();
      for (const p of platforms(stage)) {
        g.fillStyle = "#385f73";
        g.fillRect(p.x, p.y, p.w, 17);
        g.fillStyle = "#ccebe8";
        g.fillRect(p.x, p.y, p.w, 6);
        for (let x = p.x + 12; x < p.x + p.w; x += 40) {
          g.fillStyle = "#9bd4dd";
          g.beginPath();
          g.moveTo(x, p.y + 5);
          g.lineTo(x + 8, p.y + 26);
          g.lineTo(x + 13, p.y + 5);
          g.fill();
        }
      }
      s.enemies.forEach((e, i) => {
        if (!e.alive) return;
        g.save();
        g.translate(e.x, e.y);
        if (e.roll && effects) g.rotate(s.time * 10);
        disc(
          g,
          0,
          0,
          14 + e.ice * 2,
          e.ice === 3 ? "#edfaff" : ["#f5a56b", "#d68dc9", "#edce7f"][i % 3]!,
        );
        if (e.ice) {
          g.strokeStyle = "#b9eafc";
          g.lineWidth = e.ice * 2;
          g.beginPath();
          g.arc(0, 0, 17, 0, 7);
          g.stroke();
        }
        g.fillStyle = "#24415a";
        g.fillRect(-8, -4, 4, 5);
        g.fillRect(4, -4, 4, 5);
        if (e.ice < 3) {
          g.fillRect(-12, 11, 8, 6);
          g.fillRect(4, 11, 8, 6);
        }
        g.restore();
      });
      s.shots.forEach((b) => {
        if (effects) {
          disc(g, b.x - b.vx * 0.02, b.y, 6, "#c6faff55");
        }
        disc(g, b.x, b.y, 5, "#ffffff");
      });
      s.heroes.forEach((h, i) => {
        if (!h.hp) return;
        g.save();
        if (h.inv > 0 && effects)
          g.globalAlpha = 0.5 + 0.3 * Math.sin(s.time * 25);
        disc(g, h.x, h.y, 14, i ? "#ffd08c" : "#a9eee4");
        g.fillStyle = "#fff4de";
        g.fillRect(h.x - 10, h.y - 5, 20, 12);
        g.fillStyle = "#25445a";
        g.fillRect(h.x - 6, h.y - 2, 3, 4);
        g.fillRect(h.x + 3, h.y - 2, 3, 4);
        g.fillStyle = i ? "#d46b63" : "#418b9c";
        g.fillRect(h.x - 14, h.y + 6, 28, 5);
        disc(g, h.x, h.y - 17, 5, i ? "#ffd08c" : "#a9eee4");
        g.restore();
      });
      text(g, `${ko ? "서리 순찰대" : "FROST PATROL"} / ${stage}`, 25, 33, 22);
      text(g, String(s.score), 685, 33, 22, "#ffe3a3");
    },
  });
