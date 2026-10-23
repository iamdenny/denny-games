import type { GameFactory, Action } from "../../lib/types";
import { createMotion, gsap } from "../../lib/motion";
import {
  fresh,
  restore,
  move,
  rotate,
  down,
  drop,
  interval,
  fits,
  type State,
} from "./engine";
import "./style.css";
const colors = ["", "#ec896e", "#75d9ce", "#dcdf77", "#b6a1ef", "#7eb6ef"];
const symbols = ["", "◆", "●", "▲", "✦", "■"];
const make = (tag: string, cls = "", text = "") => {
  const e = document.createElement(tag);
  e.className = cls;
  e.textContent = text;
  return e;
};
function gem(v: number) {
  const e = make("span", "jewel-gem", symbols[v]);
  e.style.setProperty("--gem", colors[v]!);
  e.dataset.gem = String(v);
  return e;
}
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  let s = restore(ctx.saved),
    active = false,
    ended = false,
    restored = s.phase !== "play",
    elapsed = 0,
    last = 0,
    raf = 0;
  const root = make("section", "jewel-drop"),
    head = make("header", "jewel-heading", ko ? "보석 낙하" : "JEWEL DROP"),
    stats = make("div", "jewel-stats"),
    play = make("div", "jewel-play"),
    board = make("div", "jewel-board"),
    side = make("aside", "jewel-side"),
    preview = make("div", "jewel-preview"),
    note = make("p", "jewel-note"),
    controls = make("div", "jewel-controls");
  root.setAttribute("aria-label", ko ? "보석 낙하" : "Jewel Drop");
  board.setAttribute("role", "img");
  board.tabIndex = 0;
  note.setAttribute("role", "status");
  side.append(
    make("strong", "", ko ? "다음" : "NEXT"),
    preview,
    make(
      "p",
      "",
      ko ? "3개 연결\n가로·세로\n대각선" : "Match 3\nAcross\nDown\nDiagonals",
    ),
  );
  const cells = Array.from({ length: 72 }, () => {
    const e = make("div", "jewel-cell");
    board.append(e);
    return e;
  });
  play.append(board, side);
  root.append(head, stats, play, controls, note);
  ctx.host.append(root);
  const motion = createMotion(root),
    abort = new AbortController();
  const resize = new ResizeObserver(() => motion.finish());
  resize.observe(board);
  const labels = ko
    ? ["왼쪽", "순서 회전", "오른쪽", "한 칸 아래", "즉시 낙하"]
    : ["Left", "Rotate", "Right", "Step down", "Drop"];
  const commands = ["left", "up", "right", "down", "confirm"] as const;
  const buttons = commands.map((a, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = labels[i]!;
    b.dataset.jewelAction = a;
    b.addEventListener("click", () => act(a), { signal: abort.signal });
    controls.append(b);
    return b;
  });
  function render() {
    root.dataset.phase = s.phase;
    root.dataset.cleared = String(s.cleared);
    root.dataset.pieces = String(s.pieces);
    root.dataset.y = String(s.y);
    root.dataset.x = String(s.x);
    root.dataset.falling = s.falling.join(",");
    root.dataset.active = String(active);
    stats.textContent = ko
      ? `수집 ${s.cleared}/60 · 점수 ${s.score} · 연쇄 ${s.chain}`
      : `GEMS ${s.cleared}/60 · SCORE ${s.score} · CHAIN ${s.chain}`;
    cells.forEach((e, i) => {
      e.replaceChildren();
      if (s.board[i]) e.append(gem(s.board[i]!));
      e.classList.remove("jewel-active", "jewel-ghost");
    });
    if (s.phase === "play") {
      let y = s.y;
      while (fits(s, s.x, y + 1)) y++;
      s.falling.forEach((v, i) => {
        const ghost = cells[(y + i) * 6 + s.x]!;
        ghost.append(gem(v));
        ghost.classList.add("jewel-ghost");
      });
      s.falling.forEach((v, i) => {
        const e = cells[(s.y + i) * 6 + s.x]!;
        e.replaceChildren(gem(v));
        e.classList.add("jewel-active");
        e.classList.remove("jewel-ghost");
      });
    }
    preview.replaceChildren(...s.next.map(gem));
    board.setAttribute(
      "aria-label",
      ko
        ? `보석판. 수집 ${s.cleared}/60, 현재 ${s.x + 1}열`
        : `Gem board. ${s.cleared} of 60 cleared, column ${s.x + 1}`,
    );
    buttons.forEach((b) => (b.disabled = !active || s.phase !== "play"));
    note.textContent =
      s.phase === "won"
        ? ko
          ? "60개 수집 완료! 보석 장인!"
          : "60 gems collected! Jewel master!"
        : s.phase === "lost"
          ? ko
            ? "보석이 입구까지 쌓였어요. 다시 도전하세요!"
            : "The entry is blocked. Try again!"
          : s.chain > 1
            ? ko
              ? `${s.chain}연쇄!`
              : `${s.chain} CHAIN!`
            : ko
              ? "↑ 순서 회전 · ↓ 아래 · Space 낙하"
              : "↑ Rotate · ↓ Step · Space Drop";
  }
  function complete() {
    if (s.phase === "play" || ended) return;
    ended = true;
    active = false;
    render();
    ctx.onEnd({
      won: s.phase === "won",
      score: s.score,
      message: note.textContent ?? "",
      restored,
    });
  }
  function apply(n: State) {
    if (n === s) return;
    motion.finish();
    const old = s;
    const snapshots = cells.map((e) => e.cloneNode(true) as HTMLElement);
    s = n;
    render();
    ctx.onChange(s.score);
    ctx.onSave?.();
    if (old.pieces !== s.pieces) {
      let landing = old.y;
      while (fits(old, old.x, landing + 1)) landing++;
      const flight = make("div", "jewel-flight");
      flight.style.left = `${(old.x / 6) * 100}%`;
      flight.style.top = `${(old.y / 12) * 100}%`;
      flight.append(...old.falling.map(gem));
      board.append(flight);
      motion.run(
        (t) => {
          t.to(flight, {
            y: ((landing - old.y) * board.clientHeight) / 12,
            duration: 0.18,
            ease: "power2.in",
          });
          t.to(flight, { opacity: 0, duration: 0.12 });
        },
        () => flight.remove(),
      );
    }
    if (old.cleared < s.cleared) {
      const layer = make("div", "jewel-clear-layer");
      snapshots.forEach((e, i) => {
        if (old.board[i] || e.classList.contains("jewel-active"))
          layer.append(e);
        else layer.append(make("div"));
      });
      board.append(layer);
      motion.run(
        (t) => {
          t.to(layer, { opacity: 0, scale: 1.08, duration: 0.32 });
          t.fromTo(stats, { scale: 1.08 }, { scale: 1, duration: 0.35 }, 0);
        },
        () => {
          layer.remove();
          gsap.set(stats, { clearProps: "transform" });
        },
      );
      ctx.sound();
    } else {
      const targets = board.querySelectorAll(".jewel-active .jewel-gem");
      const dy =
        old.pieces === s.pieces ? ((old.y - s.y) * board.clientHeight) / 12 : 0;
      const dx =
        old.pieces === s.pieces ? ((old.x - s.x) * board.clientWidth) / 6 : 0;
      motion.run(
        (t) => {
          t.fromTo(
            targets,
            { x: dx, y: dy, scale: old.pieces !== s.pieces ? 0.7 : 1 },
            { x: 0, y: 0, scale: 1, duration: 0.12, ease: "power2.out" },
          );
        },
        () => gsap.set(targets, { clearProps: "transform" }),
      );
    }
    complete();
  }
  function act(a: Action) {
    if (!active || s.phase !== "play") return;
    apply(
      a === "left"
        ? move(s, -1)
        : a === "right"
          ? move(s, 1)
          : a === "up"
            ? rotate(s)
            : a === "down"
              ? down(s)
              : drop(s),
    );
    if (a === "down" || a === "confirm") elapsed = 0;
  }
  function frame(time: number) {
    if (active && s.phase === "play") {
      elapsed += Math.min(100, time - last);
      if (elapsed >= interval(s)) {
        elapsed = 0;
        apply(down(s));
      }
    }
    last = time;
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  const portrait = matchMedia("(max-width: 600px) and (orientation: portrait)");
  const size = () =>
    ctx.onReady?.(
      portrait.matches
        ? { width: 420, height: 660 }
        : { width: 520, height: 660 },
    );
  portrait.addEventListener("change", size);
  size();
  render();
  ctx.onChange(s.score);
  const activate = () => {
    active = true;
    last = performance.now();
    render();
    complete();
  };
  return {
    start: activate,
    resume: activate,
    pause() {
      active = false;
      motion.finish();
      render();
    },
    restart() {
      motion.finish();
      s = fresh();
      active = true;
      ended = false;
      restored = false;
      elapsed = 0;
      last = performance.now();
      render();
      ctx.onChange(0);
      ctx.onSave?.();
    },
    action: act,
    serialize: () => structuredClone(s),
    destroy() {
      active = false;
      cancelAnimationFrame(raf);
      abort.abort();
      portrait.removeEventListener("change", size);
      resize.disconnect();
      motion.destroy();
      root.remove();
    },
  };
};
