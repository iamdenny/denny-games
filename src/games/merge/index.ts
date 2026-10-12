import type { GameFactory } from "../../lib/types";
import { random } from "../../lib/random";
import { move, canMove, type Direction } from "./rules";
export const mount: GameFactory = (ctx) => {
  let board = Array<number>(16).fill(0),
    score = 0,
    counter = 0,
    active = false,
    ended = false;
  const saved = ctx.saved as
    { board?: number[]; score?: number; counter?: number } | undefined;
  if (
    Array.isArray(saved?.board) &&
    saved.board.length === 16 &&
    saved.board.every(
      (v) =>
        Number.isInteger(v) &&
        v >= 0 &&
        (v === 0 || (v >= 2 && v <= 2048 && Number.isInteger(Math.log2(v)))),
    )
  ) {
    board = [...saved.board];
    score = Number.isFinite(saved.score) ? Math.max(0, saved.score!) : 0;
    counter = Number.isSafeInteger(saved.counter)
      ? Math.max(0, saved.counter!)
      : 0;
  }
  const grid = document.createElement("div");
  grid.className = "merge-board";
  grid.tabIndex = 0;
  grid.setAttribute("role", "group");
  grid.setAttribute(
    "aria-label",
    ctx.locale === "ko" ? "2048 보드" : "2048 board",
  );
  const buttons = document.createElement("div");
  buttons.className = "direction-controls";
  for (const [dir, symbol] of [
    ["up", "↑"],
    ["left", "←"],
    ["down", "↓"],
    ["right", "→"],
  ] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = symbol;
    button.setAttribute(
      "aria-label",
      ctx.locale === "ko"
        ? { up: "위로", left: "왼쪽으로", down: "아래로", right: "오른쪽으로" }[
            dir
          ]
        : dir,
    );
    button.addEventListener("click", () => slide(dir));
    buttons.append(button);
  }
  ctx.host.append(grid, buttons);
  function add() {
    const empty = board.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
    if (!empty.length) return;
    const rng = random(`${ctx.seed}:${counter++}`);
    board[empty[Math.floor(rng() * empty.length)]!] = rng() < 0.9 ? 2 : 4;
  }
  function render(previous?: number[]) {
    grid.replaceChildren(
      ...board.map((value, index) => {
        const cell = document.createElement("span");
        cell.className = "merge-cell";
        cell.dataset.power = String(value ? Math.min(11, Math.log2(value)) : 0);
        cell.dataset.changed = String(
          Boolean(previous && value && previous[index] !== value),
        );
        cell.textContent = value ? String(value) : "";
        return cell;
      }),
    );
    ctx.onChange(score);
  }
  function check() {
    if (!ended && (board.includes(2048) || !canMove(board))) {
      ended = true;
      active = false;
      ctx.onEnd({ score, won: board.includes(2048) });
    }
  }
  function slide(direction: Direction) {
    if (!active) return;
    const next = move(board, direction);
    if (!next.changed) return;
    const previous = board;
    board = next.board;
    score += next.score;
    add();
    ctx.sound();
    render(previous);
    check();
  }
  let startX = 0,
    startY = 0;
  let swipePointer: number | undefined;
  const down = (e: PointerEvent) => {
    if (!active || swipePointer !== undefined) return;
    swipePointer = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    grid.setPointerCapture(e.pointerId);
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId !== swipePointer) return;
    swipePointer = undefined;
    const dx = e.clientX - startX,
      dy = e.clientY - startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    slide(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up",
    );
  };
  const cancel = (e: PointerEvent) => {
    if (e.pointerId === swipePointer) swipePointer = undefined;
  };
  grid.addEventListener("pointercancel", cancel);
  grid.addEventListener("pointerdown", down);
  grid.addEventListener("pointerup", up);
  if (board.every((v) => v === 0)) {
    add();
    add();
  }
  render();
  return {
    start() {
      active = true;
      check();
    },
    pause() {
      swipePointer = undefined;
      active = false;
    },
    resume() {
      active = !ended;
    },
    restart() {
      board.fill(0);
      score = 0;
      counter = 0;
      ended = false;
      add();
      add();
      active = true;
      render();
    },
    action(action) {
      if (action !== "confirm") slide(action);
    },
    serialize: () => ({ board, score, counter }),
    destroy() {
      grid.removeEventListener("pointercancel", cancel);
      grid.removeEventListener("pointerdown", down);
      grid.removeEventListener("pointerup", up);
      ctx.host.replaceChildren();
    },
  };
};
