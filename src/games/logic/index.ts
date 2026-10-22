import { createMotion, gsap, travelTiles } from "../../lib/motion";
import type { GameFactory } from "../../lib/types";
import {
  createPuzzle,
  play,
  replay,
  solved,
  neighbours,
  type Kind,
} from "./rules";
import "./style.css";
export const createMount =
  (kind: Kind): GameFactory =>
  (ctx) => {
    const puzzle = createPuzzle(kind, ctx.seed, ctx.stage);
    const ko = ctx.locale === "ko";
    const identity = `${kind}:${ctx.seed}:${ctx.stage}`;
    let cells = [...puzzle.initial],
      history: number[] = [],
      moves = 0,
      selected = 0,
      active = false,
      ended = false;
    const saved = ctx.saved as
      { identity?: unknown; history?: unknown; moves?: unknown } | undefined;
    const restored =
      saved?.identity === identity ? replay(puzzle, saved.history) : undefined;
    if (
      restored &&
      Number.isSafeInteger(saved?.moves) &&
      (saved!.moves as number) >= (saved!.history as number[]).length &&
      (saved!.moves as number) <= 1000000
    ) {
      cells = restored;
      history = [...(saved!.history as number[])];
      moves = saved!.moves as number;
    }
    const grid = document.createElement("div");
    grid.className = `logic-board ${kind}`;
    grid.style.setProperty("--size", String(puzzle.size));
    grid.setAttribute("role", "group");
    grid.setAttribute(
      "aria-label",
      ko
        ? kind === "lantern-grid"
          ? "랜턴 그리드 보드"
          : "넘버 트레일 보드"
        : kind === "lantern-grid"
          ? "Lantern Grid board"
          : "Number Trail board",
    );
    const buttons = cells.map((_, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "logic-cell";
      button.addEventListener("click", () => {
        selected = i;
        turn();
      });
      button.addEventListener("focus", () => {
        selected = i;
      });
      grid.append(button);
      return button;
    });
    const controls = document.createElement("div");
    controls.className = "logic-controls";
    const undo = document.createElement("button");
    undo.type = "button";
    undo.textContent = ko ? "한 수 되돌리기" : "Undo move";
    const note = document.createElement("p");
    note.className = "board-note";
    note.setAttribute("role", "status");
    controls.append(undo, note);
    ctx.host.append(grid);
    (ctx.controlsHost ?? ctx.host).append(controls);
    const motion = createMotion(ctx.host);
    const resize = new ResizeObserver(() => motion.finish());
    resize.observe(grid);
    function animate(previous: number[]) {
      if (kind === "number-trail") {
        const routes = cells.flatMap((value, to) =>
          value ? [{ from: previous.indexOf(value), to, value }] : [],
        );
        travelTiles(motion, grid, buttons, routes);
      } else {
        const changed = buttons.filter((_, i) => cells[i] !== previous[i]);
        motion.run(
          (timeline) => {
            timeline.fromTo(
              changed,
              { scale: 0.88 },
              {
                scale: 1,
                duration: 0.24,
                stagger: 0.018,
                ease: "back.out(1.7)",
              },
            );
          },
          () => {
            if (changed.length) gsap.set(changed, { clearProps: "transform" });
          },
        );
      }
    }
    const score = () => Math.max(0, 1000 - moves * 5);
    function render() {
      grid.dataset.moves = String(moves);
      grid.dataset.cells = cells.join(",");
      grid.dataset.ended = String(ended);
      const legal = neighbours(cells.indexOf(0), puzzle.size);
      buttons.forEach((button, i) => {
        const value = cells[i]!;
        button.disabled = !active;
        button.tabIndex = selected === i ? 0 : -1;
        button.classList.toggle("lit", kind === "lantern-grid" && value === 1);
        button.classList.toggle(
          "empty",
          kind === "number-trail" && value === 0,
        );
        button.classList.toggle(
          "movable",
          kind === "number-trail" && value !== 0 && legal.includes(i),
        );
        button.classList.toggle("selected", selected === i);
        button.textContent =
          kind === "lantern-grid"
            ? value
              ? "✦"
              : "·"
            : value
              ? String(value)
              : "";
        const state =
          kind === "lantern-grid"
            ? ko
              ? value
                ? "켜짐"
                : "꺼짐"
              : value
                ? "on"
                : "off"
            : value
              ? String(value)
              : ko
                ? "빈칸"
                : "empty";
        button.setAttribute(
          "aria-label",
          `${Math.floor(i / puzzle.size) + 1}, ${(i % puzzle.size) + 1}: ${state}`,
        );
      });
      undo.disabled = !active || !history.length;
      note.textContent = `${moves} ${ko ? "수" : "moves"} · ${kind === "lantern-grid" ? (ko ? `남은 불빛 ${cells.filter(Boolean).length}` : `${cells.filter(Boolean).length} lights left`) : ko ? "빈칸 옆 숫자를 누르세요" : "Tap a number beside the gap"}`;
      ctx.onChange(score());
    }
    function check() {
      if (!ended && solved(kind, cells)) {
        ended = true;
        active = false;
        ctx.onEnd({ score: score(), won: true });
      }
    }
    function turn() {
      if (!active) return;
      if (history.length >= 2000) {
        note.textContent = ko
          ? "저장 가능한 2,000수에 도달했어요. 되돌리거나 다시 시작하세요."
          : "The 2,000-move save limit is reached. Undo or restart to continue.";
        return;
      }
      const next = play(puzzle, cells, selected);
      if (!next) {
        note.textContent = ko
          ? "빈칸과 맞닿은 숫자만 움직일 수 있어요."
          : "Only a number beside the gap can move.";
        return;
      }
      motion.finish();
      const previous = cells;
      cells = next;
      history.push(selected);
      moves++;
      ctx.sound();
      check();
      render();
      animate(previous);
      ctx.onSave?.();
    }
    const undoMove = () => {
      if (!active || !history.length) return;
      motion.finish();
      const previous = cells;
      history.pop();
      cells = replay(puzzle, history)!;
      render();
      animate(previous);
      ctx.onSave?.();
    };
    undo.addEventListener("click", undoMove);
    const activate = (value: boolean) => {
      active = value && !ended;
      render();
    };
    render();
    return {
      start() {
        check();
        activate(true);
      },
      pause() {
        motion.finish();
        activate(false);
      },
      resume() {
        activate(true);
      },
      restart() {
        motion.finish();
        cells = [...puzzle.initial];
        history = [];
        moves = 0;
        ended = false;
        activate(true);
      },
      action(action) {
        if (!active) return;
        if (action === "confirm") {
          turn();
          return;
        }
        const x = Math.max(
          0,
          Math.min(
            puzzle.size - 1,
            (selected % puzzle.size) +
              (action === "left" ? -1 : action === "right" ? 1 : 0),
          ),
        );
        const y = Math.max(
          0,
          Math.min(
            puzzle.size - 1,
            Math.floor(selected / puzzle.size) +
              (action === "up" ? -1 : action === "down" ? 1 : 0),
          ),
        );
        selected = y * puzzle.size + x;
        render();
        buttons[selected]?.focus({ preventScroll: true });
      },
      serialize: () => ({ identity, history: [...history], moves }),
      destroy() {
        resize.disconnect();
        motion.destroy();
        undo.removeEventListener("click", undoMove);
        controls.remove();
        grid.remove();
      },
    };
  };
