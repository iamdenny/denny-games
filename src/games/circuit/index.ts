import type { GameFactory } from "../../lib/types";
import {
  createBoard,
  connected,
  isComplete,
  rotate,
  directions,
} from "./rules";
import { t } from "../../data/i18n";
interface Saved {
  tiles: number[];
  moves: number;
  hint: boolean;
}
export const mount: GameFactory = (ctx) => {
  const board = createBoard(ctx.seed, ctx.stage);
  const text = t(ctx.locale);
  let tiles = [...board.tiles],
    moves = 0,
    selected = 0,
    active = false,
    ended = false,
    usedHint = false;
  const saved = ctx.saved as Partial<Saved> | undefined;
  // A restored board must consist of rotations of the same deterministic puzzle.
  if (
    Array.isArray(saved?.tiles) &&
    saved.tiles.length === tiles.length &&
    saved.tiles.every((mask, i) => {
      let value = board.solved[i]!;
      const variants = [];
      for (let n = 0; n < 4; n++) {
        variants.push(value);
        value = rotate(value);
      }
      return variants.includes(mask);
    })
  ) {
    tiles = [...saved.tiles];
    moves = Number.isFinite(saved.moves) ? Math.max(0, saved.moves!) : 0;
    usedHint = saved.hint === true;
  }
  const grid = document.createElement("div");
  grid.className = "circuit-board";
  grid.style.setProperty("--size", String(board.size));
  grid.setAttribute("role", "group");
  grid.setAttribute(
    "aria-label",
    ctx.locale === "ko" ? "회로 보드" : "Circuit board",
  );
  const cells = tiles.map((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "circuit-cell";
    button.addEventListener("click", () => {
      selected = index;
      turn();
    });
    grid.append(button);
    return button;
  });
  const hint = document.createElement("button");
  hint.type = "button";
  hint.className = "game-hint";
  hint.textContent = text.hint;
  const note = document.createElement("p");
  note.className = "board-note";
  const hintClick = () => {
    if (!active) return;
    const index = tiles.findIndex((v, i) => v !== board.solved[i]);
    if (index < 0) return;
    tiles[index] = board.solved[index]!;
    usedHint = true;
    moves++;
    check();
    render();
  };
  hint.addEventListener("click", hintClick);
  ctx.host.append(grid, hint, note);
  function render() {
    const live = connected(tiles, board.size);
    cells.forEach((button, index) => {
      button.classList.toggle("connected", live.has(index));
      button.classList.toggle("selected", index === selected);
      button.disabled = !active;
      button.tabIndex = index === selected ? 0 : -1;
      const names =
        ctx.locale === "ko"
          ? ["위", "오른쪽", "아래", "왼쪽"]
          : ["up", "right", "down", "left"];
      button.setAttribute(
        "aria-label",
        `${Math.floor(index / board.size) + 1}, ${(index % board.size) + 1}: ${names.filter((_, d) => tiles[index]! & (1 << d)).join(", ")}${index === 0 ? " ⚡" : ""}`,
      );
      button.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">${directions.map(([dx, dy], dir) => (tiles[index]! & (1 << dir) ? `<path d="M50 50L${50 + dx * 50} ${50 + dy * 50}"/>` : "")).join("")}<circle cx="50" cy="50" r="${index === 0 ? 12 : 6}"/>${index === 0 ? '<text x="50" y="56" text-anchor="middle">⚡</text>' : ""}</svg>`;
    });
    hint.disabled = !active;
    note.textContent = `${moves} ${ctx.locale === "ko" ? "회전" : "turns"} · ${live.size}/${tiles.length} ${ctx.locale === "ko" ? "연결" : "connected"}${usedHint ? " · " + text.hintUsed : ""}`;
    ctx.onChange(Math.max(0, 1000 - moves * 5 - (usedHint ? 100 : 0)));
  }
  function check() {
    if (!ended && isComplete(tiles, board.size)) {
      ended = true;
      active = false;
      ctx.onEnd({
        score: Math.max(0, 1000 - moves * 5 - (usedHint ? 100 : 0)),
        won: true,
      });
    }
  }
  function turn() {
    if (!active) return;
    tiles[selected] = rotate(tiles[selected]!);
    moves++;
    ctx.sound();
    check();
    render();
  }
  const setActive = (value: boolean) => {
    active = value && !ended;
    render();
  };
  render();
  return {
    start() {
      check();
      setActive(true);
    },
    pause() {
      setActive(false);
    },
    resume() {
      setActive(true);
    },
    restart() {
      tiles = [...board.tiles];
      moves = 0;
      usedHint = false;
      ended = false;
      setActive(true);
    },
    action(action) {
      if (!active) return;
      if (action === "confirm") {
        turn();
        return;
      }
      const dx = action === "left" ? -1 : action === "right" ? 1 : 0;
      const dy = action === "up" ? -1 : action === "down" ? 1 : 0;
      const x = Math.max(
        0,
        Math.min(board.size - 1, (selected % board.size) + dx),
      );
      const y = Math.max(
        0,
        Math.min(board.size - 1, Math.floor(selected / board.size) + dy),
      );
      selected = y * board.size + x;
      render();
      cells[selected]?.focus();
    },
    serialize: () => ({ tiles, moves, hint: usedHint }),
    destroy() {
      hint.removeEventListener("click", hintClick);
      ctx.host.replaceChildren();
    },
  };
};
