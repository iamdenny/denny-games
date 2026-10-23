import type { GameFactory } from "../../lib/types";
import { host, disc, text } from "./host";
import { create, restore, step, W, type Maze } from "./rules";
type Travel = {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  at: number;
};
type Fragment = {
  x: number;
  y: number;
  at: number;
  angle: number;
  speed: number;
};
/** Decorative state uses simulation time only: repainting a paused game never advances it. */
export function createMazeMotion() {
  let previous: Maze | undefined;
  let tiles: number[] = [];
  const actors = new Map<number, Travel>();
  let fragments: Fragment[] = [];
  const sample = (a: Travel, time: number) => {
    const t = Math.min(1, Math.max(0, (time - a.at) / 0.105));
    const ease = 1 - (1 - t) ** 3;
    return {
      x: a.fromX + (a.x - a.fromX) * ease,
      y: a.fromY + (a.y - a.fromY) * ease,
    };
  };
  return (s: Maze, effects: boolean) => {
    if (previous !== s) {
      actors.clear();
      fragments = [];
      tiles = [...s.tiles];
      previous = s;
    }
    if (effects)
      s.tiles.forEach((tile, i) => {
        if (tiles[i] !== 2 || tile === 2) return;
        for (let n = 0; n < 6; n++)
          fragments.push({
            x: i % W,
            y: Math.floor(i / W),
            at: s.time,
            angle: (n * Math.PI) / 3 + i * 0.37,
            speed: 24 + ((i + n * 11) % 29),
          });
      });
    tiles = [...s.tiles];
    fragments = effects
      ? fragments.filter((f) => s.time - f.at < 0.42).slice(-120)
      : [];
    const positions = s.actors.map((a, i) => {
      let motion = actors.get(i);
      if (!motion || !effects)
        motion = { x: a.x, y: a.y, fromX: a.x, fromY: a.y, at: s.time };
      else if (motion.x !== a.x || motion.y !== a.y) {
        const from = sample(motion, s.time);
        motion = { x: a.x, y: a.y, fromX: from.x, fromY: from.y, at: s.time };
      }
      actors.set(i, motion);
      return sample(motion, s.time);
    });
    return { positions, fragments };
  };
}
export const mount: GameFactory = (ctx) => {
  const motion = createMazeMotion();
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
      const visual = motion(s, effects);
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
        const life = Math.min(1, f.t / 0.4);
        g.fillStyle = effects
          ? `rgba(255,108,45,${0.35 + life * 0.5})`
          : "#ffb347";
        g.fillRect(x + 2, y + 2, 36, 36);
        g.fillStyle = "#ffcf71";
        g.fillRect(x + 5, y + 13, 30, 14);
        g.fillRect(x + 13, y + 5, 14, 30);
        if (effects) {
          g.strokeStyle = `rgba(255,224,150,${life * 0.65})`;
          g.lineWidth = 2;
          g.beginPath();
          g.arc(x + 20, y + 20, 8 + (1 - life) * 16, 0, Math.PI * 2);
          g.stroke();
        }
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
        const pulse = effects ? Math.sin(s.time * (b.t < 0.7 ? 28 : 12)) : 0;
        disc(g, x, y + 11, 14, "#0c1c2588");
        disc(g, x, y, 14 + pulse * (b.t < 0.7 ? 1.8 : 0.6), "#101c29");
        disc(g, x - 4, y - 5, 4, "#51616a");
        g.strokeStyle = b.t < 0.7 ? "#ff8055" : "#e7b67b";
        g.lineWidth = 2;
        g.beginPath();
        g.arc(
          x,
          y,
          17,
          -Math.PI / 2,
          -Math.PI / 2 + Math.max(0, b.t / 2.1) * Math.PI * 2,
        );
        g.stroke();
        g.strokeStyle = "#ffd19b";
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(x + 3, y - 12);
        g.lineTo(x + 6, y - 20);
        g.stroke();
        disc(g, x + 6, y - 20, b.t < 0.7 && effects ? 5 : 3, "#ff8055");
        text(g, b.t.toFixed(1), x - 11, y + 5, 11);
      });
      visual.fragments.forEach((f) => {
        const age = s.time - f.at;
        g.save();
        g.globalAlpha = Math.max(0, 1 - age / 0.42);
        g.translate(
          ox + f.x * size + 20 + Math.cos(f.angle) * f.speed * age,
          oy +
            f.y * size +
            20 +
            Math.sin(f.angle) * f.speed * age +
            age * age * 70,
        );
        g.rotate(f.angle + age * 7);
        g.fillStyle = "#e2a268";
        g.fillRect(-3, -3, 6, 6);
        g.restore();
      });
      s.actors.forEach((a, i) => {
        if (!a.alive) return;
        const pos = visual.positions[i]!;
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
