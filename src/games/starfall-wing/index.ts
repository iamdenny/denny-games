import type { GameFactory } from "../../lib/types";
import { arcade, backdrop, circle } from "../prism-pop/host";
import { SW, SH, newWing, restoreWing, stepWing, sectors } from "./rules";
function ship(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  scale = 1,
  flip = false,
) {
  g.save();
  g.translate(x, y);
  g.scale(scale, flip ? -scale : scale);
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(0, -20);
  g.lineTo(19, 14);
  g.lineTo(6, 9);
  g.lineTo(0, 15);
  g.lineTo(-6, 9);
  g.lineTo(-19, 14);
  g.closePath();
  g.fill();
  g.fillStyle = "#dff8ff";
  g.fillRect(-3, -8, 6, 13);
  g.restore();
}
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  return arcade(ctx, {
    width: SW,
    height: SH,
    title: ko ? "스타폴 윙" : "Starfall Wing",
    pointer: true,
    create: () => newWing(ctx.stage),
    restore: (v) => restoreWing(v, ctx.stage),
    update: stepWing,
    controls: [
      { id: "left", label: "←", keys: ["ArrowLeft", "KeyA"] },
      { id: "up", label: "↑", keys: ["ArrowUp", "KeyW"] },
      { id: "down", label: "↓", keys: ["ArrowDown", "KeyS"] },
      { id: "right", label: "→", keys: ["ArrowRight", "KeyD"] },
      { id: "bomb", label: ko ? "노바" : "Nova", keys: ["KeyX", "ShiftLeft"] },
      {
        id: "fire",
        label: ko ? "자동발사 전환" : "Toggle fire",
        keys: ["Space"],
      },
    ],
    action: (a) => (a === "confirm" ? "bomb" : a),
    status: (s) =>
      s.status === "won"
        ? ko
          ? "수호선을 돌파했어요!"
          : "Guardian defeated!"
        : s.status === "lost"
          ? ko
            ? "기체를 잃었어요 · 다시 출격하세요"
            : "Ship lost · Launch again"
          : ko
            ? `목숨 ${s.lives} · 무기 ${s.power} · 노바 ${s.bombs} · 자동발사 ${s.auto ? "켜짐" : "꺼짐"}`
            : `Lives ${s.lives} · Weapon ${s.power} · Nova ${s.bombs} · Auto fire ${s.auto ? "on" : "off"}`,
    draw(g, s, quiet) {
      backdrop(g, SW, SH, "#a8c9ff");
      if (!quiet) {
        for (let n = 0; n < 32; n++) {
          const x = (n * 117) % SW,
            y = (n * 71 + s.clock * (30 + (n % 3) * 20)) % SH;
          g.fillStyle = n % 3 ? "#6988ae" : "#c7e8ff";
          g.fillRect(x, y, 2, (n % 3) + 2);
        }
      }
      for (const p of s.pickups) {
        circle(g, p.x, p.y, 12, "#93e9b3");
        g.fillStyle = "#1f3e44";
        g.font = "bold 16px system-ui";
        g.fillText("P", p.x - 5, p.y + 6);
      }
      for (const e of s.enemies)
        ship(g, e.x, e.y, ["#f7b391", "#f38fae", "#b2a2f7"][e.kind]!, 1, true);
      if (s.boss) {
        const b = s.boss;
        ship(g, b.x, b.y, "#d6a0e9", 2.2, true);
        g.fillStyle = "#46354e";
        g.fillRect(30, 45, SW - 60, 7);
        g.fillStyle = "#f0acdd";
        g.fillRect(
          30,
          45,
          ((SW - 60) * Math.max(0, b.hp)) / sectors[s.stage - 1]!.boss,
          7,
        );
      }
      g.fillStyle = "#9df7f2";
      for (const b of s.shots) g.fillRect(b.x - 2, b.y - 8, 4, 15);
      for (const b of s.bullets) {
        circle(g, b.x, b.y, 5, "#ffb7a0");
        circle(g, b.x, b.y, 2, "#fff8dd");
      }
      if (s.shield > 0) {
        g.strokeStyle = "#a2eff0";
        g.lineWidth = 2;
        g.beginPath();
        g.arc(s.x, s.y, 25, 0, Math.PI * 2);
        g.stroke();
      }
      ship(g, s.x, s.y, "#8ee4de");
      if (!quiet) {
        g.fillStyle = "#ffc68c";
        g.beginPath();
        g.moveTo(s.x - 5, s.y + 14);
        g.lineTo(s.x, s.y + 24 + Math.sin(s.clock * 30) * 5);
        g.lineTo(s.x + 5, s.y + 14);
        g.fill();
      }
      g.fillStyle = "#dcecff";
      g.font = "bold 14px system-ui";
      g.fillText(
        `${s.stage}/6 ${sectors[s.stage - 1]!.name[ko ? 1 : 0]}`,
        14,
        25,
      );
      g.textAlign = "right";
      g.fillText(String(s.score), SW - 14, 25);
      g.textAlign = "left";
      if (!quiet && s.flash > 0) {
        g.globalAlpha = s.flash * 0.8;
        g.fillStyle = "#daeeff";
        g.fillRect(0, 0, SW, SH);
        g.globalAlpha = 1;
      }
    },
  });
};
