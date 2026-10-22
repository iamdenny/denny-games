import { gsap, type Motion } from "../../lib/motion";
import type { BoardKind, Move } from "./rules";
export function animateBoard(
  motion: Motion,
  board: HTMLElement,
  kind: BoardKind,
  before: number[],
  after: number[],
  move: Move,
  oldRects: Map<number, DOMRect>,
  oldBoxes: number[],
  boxes: number[],
) {
  if (!motion.enabled()) return;
  const animated: HTMLElement[] = [];
  const ghosts: HTMLElement[] = [];
  motion.run(
    (timeline) => {
      after.forEach((value, index) => {
        if (!value || value === before[index]) return;
        const cell = board.querySelector<HTMLElement>(
          `[data-cell="${index}"]`,
        )!;
        const piece = cell.querySelector<HTMLElement>(".board-piece") ?? cell;
        animated.push(piece);
        if (kind === "reversi" && before[index]) {
          const delay =
            0.025 *
            (Math.abs((index % 8) - (move.to % 8)) +
              Math.abs(Math.floor(index / 8) - Math.floor(move.to / 8)));
          const face = document.createElement("span");
          face.className = `board-flip-face side-${before[index]}`;
          face.setAttribute("aria-hidden", "true");
          cell.append(face);
          ghosts.push(face);
          timeline.to(
            face,
            { rotationY: 90, duration: 0.12, ease: "power1.in" },
            delay,
          );
          timeline.set(face, { visibility: "hidden" }, delay + 0.12);
          timeline.fromTo(
            piece,
            { rotationY: -90, scale: 0.95 },
            { rotationY: 0, scale: 1, duration: 0.18, ease: "power2.out" },
            delay + 0.12,
          );
        } else if (kind === "four-in-a-row") {
          const top = board.getBoundingClientRect().top;
          timeline.fromTo(
            piece,
            { y: top - piece.getBoundingClientRect().top - 24 },
            { y: 0, duration: 0.32, ease: "bounce.out" },
            0,
          );
        } else if (kind === "checkers" && move.from !== undefined) {
          const from = oldRects.get(move.from),
            to = cell.getBoundingClientRect();
          if (from)
            timeline.fromTo(
              piece,
              { x: from.left - to.left, y: from.top - to.top, scale: 1.08 },
              { x: 0, y: 0, scale: 1, duration: 0.25, ease: "power2.out" },
              0,
            );
        } else if (kind === "dots-and-boxes") {
          timeline.fromTo(
            piece,
            cell.classList.contains("horizontal")
              ? { scaleX: 0.05 }
              : { scaleY: 0.05 },
            { scaleX: 1, scaleY: 1, duration: 0.22, ease: "power2.out" },
            0,
          );
        } else {
          timeline.fromTo(
            piece,
            { scale: 1.5, y: -12, opacity: 0.25 },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: 0.26,
              ease: "back.out(1.4)",
            },
            0,
          );
        }
      });
      if (kind === "checkers")
        before.forEach((value, index) => {
          if (!value || after[index] || index === move.from) return;
          const rect = oldRects.get(index),
            bounds = board.getBoundingClientRect();
          if (!rect) return;
          const ghost = document.createElement("span");
          ghost.className = `board-capture side-${value === 2 || value === 4 ? 2 : 1}`;
          ghost.setAttribute("aria-hidden", "true");
          Object.assign(ghost.style, {
            left: `${rect.left - bounds.left + rect.width * 0.12}px`,
            top: `${rect.top - bounds.top + rect.height * 0.12}px`,
            width: `${rect.width * 0.76}px`,
            height: `${rect.height * 0.76}px`,
          });
          board.append(ghost);
          ghosts.push(ghost);
          timeline.to(
            ghost,
            {
              scale: 0.25,
              opacity: 0,
              y: -8,
              duration: 0.2,
              ease: "power2.in",
            },
            0.06,
          );
        });
      board.querySelectorAll<HTMLElement>(".box-fill").forEach((box, i) => {
        if (boxes[i] && !oldBoxes[i]) {
          animated.push(box);
          timeline.fromTo(
            box,
            { scale: 0.55, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.26, ease: "back.out(1.5)" },
            0.14,
          );
        }
      });
    },
    () => {
      ghosts.forEach((ghost) => ghost.remove());
      if (animated.length)
        gsap.set(animated, { clearProps: "transform,opacity" });
    },
  );
}
