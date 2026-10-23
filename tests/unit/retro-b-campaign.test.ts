import { expect, it } from "vitest";
import {
  newVault,
  moves,
  stepVault,
  digHole,
  type Vault,
} from "../../src/games/vault-runner/rules";
function route(s: Vault, target: { x: number; y: number }) {
  const queue = [
      { x: s.player.x, y: s.player.y, path: [] as { x: number; y: number }[] },
    ],
    seen = new Set<string>();
  while (queue.length) {
    const n = queue.shift()!;
    if (n.x === target.x && n.y === target.y) return n.path;
    const key = `${n.x},${n.y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const p of moves(s, n)) queue.push({ ...p, path: [...n.path, p] });
  }
  return [];
}
it("twelve vaults have actual winning input routes with all guards active", () => {
  for (let stage = 1; stage <= 12; stage++) {
    let won = false;
    for (let attempt = 0; attempt < 300 && !won; attempt++) {
      const s = newVault(stage);
      let rng = attempt + 17;
      const order = [...s.gold];
      for (let n = order.length - 1; n > 0; n--) {
        rng = (rng * 1664525 + 1013904223) >>> 0;
        const pick = rng % (n + 1);
        [order[n], order[pick]] = [order[pick]!, order[n]!];
      }
      for (const target of [...order, { x: 18, y: 1 }]) {
        for (const next of route(s, target)) {
          const threats = s.guards.filter(
            (g) =>
              g.alive &&
              !g.trapped &&
              g.y === s.player.y &&
              Math.abs(g.x - s.player.x) <= 5,
          );
          if (threats.length) {
            let dug = false;
            for (const guard of threats) {
              if (digHole(s, Math.sign(guard.x - s.player.x))) {
                dug = true;
                for (let wait = 0; wait < 3; wait++)
                  stepVault(s, 0.12, { held: new Set(), taps: new Set() });
              }
            }
            if (dug)
              for (let wait = 0; wait < 40 && s.status === "playing"; wait++)
                stepVault(s, 0.12, { held: new Set(), taps: new Set() });
          }
          const dx = next.x - s.player.x,
            dy = next.y - s.player.y;
          stepVault(s, 0.12, {
            held: new Set([
              dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : "down",
            ]),
            taps: new Set(),
          });
          if (s.status !== "playing") break;
        }
        if (s.status !== "playing") break;
      }
      won = s.status === "won";
    }
    expect(won, `vault ${stage}`).toBe(true);
  }
}, 30000);
