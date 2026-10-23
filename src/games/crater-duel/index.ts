import type { GameFactory } from "../../lib/types";
import { host, text, disc } from "../ember-maze/host";
import { create, restore, step, ground } from "./rules";
export const mount: GameFactory = (ctx) =>
  host(ctx, {
    id: "crater-duel",
    title: ["Crater Duel", "분화구 결투"],
    hint: [
      "←/→ angle · ↑/↓ power · Fire. Wind bends every shot. Local mode alternates turns.",
      "←/→ 각도 · ↑/↓ 세기 · 발사. 바람을 읽으세요. 2명 모드는 번갈아 쏴요.",
    ],
    action: ["Fire", "발사"],
    create,
    restore,
    step,
    status: (s, ko) =>
      s.won
        ? `${s.mode === "solo" ? (ko ? "승리!" : "Victory!") : `P${s.winner + 1} ${ko ? "승리!" : "wins!"}`}`
        : s.lost
          ? ko
            ? "포대가 무너졌어요. 다시 도전!"
            : "Your turret fell. Try again!"
          : `P${s.turn + 1} · ${Math.round(s.angle)}° · ${ko ? "세기" : "Power"} ${Math.round(s.power)} · ${ko ? "바람" : "Wind"} ${s.wind} · HP ${s.hp.map(Math.round).join(" / ")}`,
    draw(g, s, stage, ko, effects) {
      const sky = g.createLinearGradient(0, 0, 0, 520);
      sky.addColorStop(0, "#25334c");
      sky.addColorStop(1, "#b9826d");
      g.fillStyle = sky;
      g.fillRect(0, 0, 800, 520);
      disc(g, 590, 100, 42, "#f5ce96");
      g.fillStyle = "#4f5065";
      g.beginPath();
      g.moveTo(0, 500);
      for (let x = 0; x <= 800; x += 50)
        g.lineTo(x, 300 + Math.sin(x * 0.017 + stage) * 45);
      g.lineTo(800, 520);
      g.lineTo(0, 520);
      g.fill();
      g.beginPath();
      g.moveTo(0, 520);
      s.terrain.forEach((y, i) => g.lineTo(i * 10, y));
      g.lineTo(800, 520);
      g.closePath();
      g.fillStyle = "#65514c";
      g.fill();
      g.strokeStyle = "#e2b786";
      g.lineWidth = 4;
      g.beginPath();
      s.terrain.forEach((y, i) => (i ? g.lineTo(i * 10, y) : g.moveTo(0, y)));
      g.stroke();
      [120, 680].forEach((x, i) => {
        const y = ground(s, x);
        g.fillStyle = "#263a48";
        g.fillRect(x - 24, y - 13, 48, 12);
        disc(g, x, y - 16, 17, i ? "#e6a47f" : "#8bd5c4");
        const a = ((i === s.turn ? s.angle : 45) * Math.PI) / 180;
        g.strokeStyle = i ? "#f8d0a3" : "#b9f4db";
        g.lineWidth = 8;
        g.beginPath();
        g.moveTo(x, y - 19);
        g.lineTo(
          x + (i ? -1 : 1) * Math.cos(a) * 34,
          y - 19 - Math.sin(a) * 34,
        );
        g.stroke();
        g.fillStyle = "#182d3b";
        g.fillRect(x - 30, y - 55, 60, 7);
        g.fillStyle = i ? "#efb18b" : "#a2e8d4";
        g.fillRect(x - 30, y - 55, s.hp[i]! * 0.6, 7);
        text(g, `P${i + 1}`, x - 12, y - 65, 14);
      });
      if (!s.shot && !s.won && !s.lost) {
        const x = s.turn ? 680 : 120,
          sign = s.turn ? -1 : 1,
          a = (s.angle * Math.PI) / 180;
        for (let t = 0.1; t < 0.6; t += 0.08) {
          const px = x + sign * Math.cos(a) * s.power * t,
            py = ground(s, x) - 20 - Math.sin(a) * s.power * t + 115 * t * t;
          disc(g, px, py, 2, "#fff2cf77");
        }
      }
      if (s.shot) {
        if (effects)
          disc(
            g,
            s.shot.x - s.shot.vx * 0.025,
            s.shot.y - s.shot.vy * 0.025,
            5,
            "#ffc88c66",
          );
        disc(g, s.shot.x, s.shot.y, 5, "#fff2bd");
      }
      if (s.blast) {
        const r = effects ? (1 - s.blast.t / 0.7) * 60 + 12 : 35;
        disc(g, s.blast.x, s.blast.y, r, "#ffba7166");
        disc(g, s.blast.x, s.blast.y, r * 0.5, "#ffe8acbb");
      }
      text(g, `${ko ? "분화구 결투" : "CRATER DUEL"} / ${stage}`, 25, 34, 22);
      text(
        g,
        `${s.wind < 0 ? "←" : "→"} ${Math.abs(s.wind)}`,
        670,
        34,
        20,
        "#ffe3ad",
      );
      text(g, `${ko ? "라운드" : "Round"} ${s.round}`, 25, 67, 16);
    },
  });
