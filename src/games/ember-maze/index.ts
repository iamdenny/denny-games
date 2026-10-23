import type { GameFactory } from "../../lib/types";
import { host, disc, text } from "./host";
import { create, restore, step, W, type Maze } from "./rules";
export const mount: GameFactory = (ctx) => {
  const positions = new Map<number, { x: number; y: number }>();
  let previous: Maze | undefined;
  return host(ctx, {
    id: "ember-maze",
    title: ["Ember Maze", "불씨 미로"],
    hint: [
      "Move, drop a bomb and escape its cross-shaped blast. P2: WASD + F.",
      "이동하고 폭탄을 놓은 뒤 십자 폭발을 피하세요. P2: WASD + F.",
    ],
    action: ["Bomb", "폭탄"],
    create,
    restore,
    step,
    status: (s, ko) =>
      s.won
        ? s.mode === "local"
          ? `P${s.winner + 1} ${ko ? "승리!" : "wins!"}`
          : ko
            ? "미로를 지켰어요!"
            : "Maze cleared!"
        : s.lost
          ? ko
            ? "불길에 잡혔어요. 다시 도전!"
            : "Caught in the embers. Try again!"
          : `${ko ? "생존" : "Alive"} ${s.actors.filter((a) => a.alive).length} · ${Math.max(0, 180 - Math.floor(s.time))}s · ${ko ? "범위" : "Range"} ${s.actors[0]!.range}`,
    draw(g, s, stage, ko, effects) {
      if (previous !== s) {
        positions.clear();
        previous = s;
      }
      g.fillStyle = "#132a31";
      g.fillRect(0, 0, 800, 520);
      text(g, `${ko ? "불씨 미로" : "EMBER MAZE"}  /  ${stage}`, 30, 35, 22);
      text(g, `${s.score}`, 675, 35, 22, "#ffd88c");
      const size = 40,
        ox = 100,
        oy = 60;
      s.tiles.forEach((v, i) => {
        const x = ox + (i % W) * size,
          y = oy + Math.floor(i / W) * size;
        g.fillStyle =
          v === 1
            ? "#365762"
            : v === 2
              ? "#a86c47"
              : (i + Math.floor(i / W)) % 2
                ? "#1d3940"
                : "#203e44";
        g.fillRect(x + 1, y + 1, 38, 38);
        if (v === 1) {
          g.fillStyle = "#527784";
          g.fillRect(x + 4, y + 4, 32, 5);
        }
        if (v === 2) {
          g.strokeStyle = "#e2a268";
          g.strokeRect(x + 7, y + 7, 26, 26);
          g.beginPath();
          g.moveTo(x + 7, y + 7);
          g.lineTo(x + 33, y + 33);
          g.stroke();
        }
        if (v >= 3) {
          disc(g, x + 20, y + 20, 12, v === 3 ? "#ffc469" : "#8be2d5");
          text(g, v === 3 ? "+" : "B", x + 14, y + 26, 17, "#19333a");
        }
      });
      s.flames.forEach((f) => {
        const x = ox + f.x * size,
          y = oy + f.y * size;
        g.fillStyle = "#ffb347";
        g.fillRect(x + 2, y + 2, 36, 36);
        disc(
          g,
          x + 20,
          y + 20,
          effects ? 12 + Math.sin(s.time * 40) * 5 : 14,
          "#fff4b8",
        );
      });
      s.bombs.forEach((b) => {
        const x = ox + b.x * size + 20,
          y = oy + b.y * size + 22;
        disc(g, x, y, 14, "#101c29");
        g.strokeStyle = "#ffd19b";
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(x + 3, y - 12);
        g.lineTo(x + 6, y - 20);
        g.stroke();
        disc(g, x + 6, y - 20, b.t < 0.7 && effects ? 5 : 3, "#ff8055");
        text(g, b.t.toFixed(1), x - 11, y + 5, 11);
      });
      s.actors.forEach((a, i) => {
        if (!a.alive) return;
        const old = positions.get(i) ?? { x: a.x, y: a.y };
        const pos = effects
          ? { x: old.x + (a.x - old.x) * 0.35, y: old.y + (a.y - old.y) * 0.35 }
          : { x: a.x, y: a.y };
        positions.set(i, pos);
        const x = ox + pos.x * size + 20,
          y = oy + pos.y * size + 20;
        g.fillStyle = "#0c1c2588";
        g.beginPath();
        g.ellipse(x, y + 13, 15, 6, 0, 0, 7);
        g.fill();
        disc(g, x, y - 1, 13, ["#a4e9cd", "#ffd081", "#f2918e", "#b4a4eb"][i]!);
        g.fillStyle = "#16343a";
        g.fillRect(x - 7, y - 5, 4, 5);
        g.fillRect(x + 3, y - 5, 4, 5);
        text(g, String(i + 1), x - 4, y + 13, 10, "#16343a");
      });
    },
  });
};
