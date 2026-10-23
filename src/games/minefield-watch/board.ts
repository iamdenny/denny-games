import type { GameContext, GameInstance } from "../../lib/types";
import { createMotion, gsap } from "../../lib/motion";
import "./style.css";
export interface Adapter<S> {
  id: string;
  title: string;
  size: number;
  fresh: () => S;
  restore: (raw: unknown) => S;
  phase: (s: S) => string;
  score: (s: S) => number;
  change: (s: S, i: number, alt: boolean) => S;
  cell: (s: S, i: number) => { text: string; kind: string; label: string };
  status: (s: S) => string;
  mode: [string, string];
  row?: number[][];
  col?: number[][];
}
export function boardGame<S>(ctx: GameContext, a: Adapter<S>): GameInstance {
  const ko = ctx.locale === "ko";
  let s = a.restore(ctx.saved),
    active = false,
    ended = false,
    restored = a.phase(s) !== "play",
    selected = 0,
    alt = false;
  const root = document.createElement("section");
  root.className = `watch-puzzle ${a.id}`;
  root.dataset.game = a.id;
  root.setAttribute("aria-label", a.title);
  const title = document.createElement("h2");
  title.textContent = a.title;
  const status = document.createElement("p");
  status.className = "watch-status";
  status.setAttribute("role", "status");
  const grid = document.createElement("div");
  grid.className = "watch-grid";
  grid.style.setProperty("--n", String(a.size));
  grid.tabIndex = 0;
  grid.setAttribute("role", "group");
  grid.setAttribute("aria-label", a.title);
  const cells: HTMLButtonElement[] = [];
  const abort = new AbortController();
  if (a.col) {
    grid.classList.add("with-clues");
    grid.append(document.createElement("span"));
    for (const c of a.col) {
      const el = document.createElement("span");
      el.className = "watch-col";
      el.textContent = c.join("\n");
      grid.append(el);
    }
  }
  for (let y = 0; y < a.size; y++) {
    if (a.row) {
      const el = document.createElement("span");
      el.className = "watch-row";
      el.textContent = a.row[y]!.join(" ");
      grid.append(el);
    }
    for (let x = 0; x < a.size; x++) {
      const i = y * a.size + x,
        b = document.createElement("button");
      b.type = "button";
      b.dataset.cell = String(i);
      b.addEventListener(
        "click",
        () => {
          if (!active) return;
          if (selected === i) commit();
          else {
            selected = i;
            render();
          }
        },
        { signal: abort.signal },
      );
      grid.append(b);
      cells.push(b);
    }
  }
  const note = document.createElement("p");
  note.className = "watch-note";
  note.textContent = ko
    ? "칸 선택 → 다시 누르거나 확인 · 방향키 이동"
    : "Select a cell → tap again or Confirm · Arrow keys move";
  root.append(title, status, grid, note);
  ctx.host.append(root);
  const controls = document.createElement("div");
  controls.className = "watch-controls";
  const mode = document.createElement("button"),
    confirm = document.createElement("button");
  mode.type = confirm.type = "button";
  mode.dataset.mode = "";
  confirm.dataset.confirm = "";
  confirm.textContent = ko ? "선택 칸 확인" : "Confirm cell";
  controls.append(mode, confirm);
  (ctx.controlsHost ?? root).append(controls);
  const motion = createMotion(root),
    resize = new ResizeObserver(() => {
      motion.finish();
      const css = getComputedStyle(root);
      const paddingX =
        parseFloat(css.paddingLeft) + parseFloat(css.paddingRight);
      const paddingY =
        parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
      const reserved =
        title.offsetHeight +
        status.offsetHeight +
        note.offsetHeight +
        parseFloat(css.rowGap) * 3;
      const size = Math.max(
        1,
        Math.floor(
          Math.min(
            540,
            root.clientWidth - paddingX,
            root.clientHeight - paddingY - reserved,
          ),
        ),
      );
      grid.style.width = `${size}px`;
      grid.style.height = `${size}px`;
    });
  resize.observe(root);
  resize.observe(title);
  resize.observe(status);
  resize.observe(note);
  mode.addEventListener(
    "click",
    () => {
      if (!active) return;
      alt = !alt;
      render();
    },
    { signal: abort.signal },
  );
  confirm.addEventListener("click", commit, { signal: abort.signal });
  function render() {
    root.dataset.phase = a.phase(s);
    root.dataset.score = String(a.score(s));
    root.dataset.active = String(active);
    root.dataset.selected = String(selected);
    status.textContent = a.status(s);
    mode.textContent = a.mode[alt ? 1 : 0];
    mode.setAttribute("aria-pressed", String(alt));
    mode.disabled = confirm.disabled = !active || a.phase(s) !== "play";
    cells.forEach((b, i) => {
      const c = a.cell(s, i);
      b.textContent = c.text;
      b.dataset.kind = c.kind;
      b.dataset.selected = String(i === selected);
      b.disabled = !active || a.phase(s) !== "play";
      b.tabIndex = i === selected ? 0 : -1;
      b.setAttribute(
        "aria-label",
        `${ko ? "행" : "Row"} ${Math.floor(i / a.size) + 1}, ${ko ? "열" : "column"} ${(i % a.size) + 1}: ${c.label}`,
      );
    });
  }
  function finish() {
    if (a.phase(s) === "play" || ended) return;
    ended = true;
    active = false;
    render();
    ctx.onEnd({
      won: a.phase(s) === "won",
      score: a.score(s),
      message: a.status(s),
      restored,
    });
  }
  function commit() {
    if (!active) return;
    const n = a.change(s, selected, alt);
    if (n === s) return;
    motion.finish();
    const old = cells.map((b) => b.textContent);
    s = n;
    render();
    const changed = cells.filter((b, i) => b.textContent !== old[i]);
    motion.run(
      (t) => {
        t.fromTo(
          changed,
          { scale: 0.72, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.22,
            stagger: 0.012,
            ease: "back.out(1.4)",
          },
        );
      },
      () => gsap.set(changed, { clearProps: "transform,opacity" }),
    );
    ctx.onChange(a.score(s));
    ctx.onSave?.();
    ctx.sound();
    finish();
  }
  const activate = () => {
    active = true;
    render();
    finish();
  };
  render();
  ctx.onChange(a.score(s));
  ctx.onReady?.({ width: a.col ? 650 : 600, height: a.col ? 720 : 690 });
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
      s = a.fresh();
      ended = false;
      restored = false;
      active = true;
      selected = 0;
      alt = false;
      render();
      ctx.onChange(a.score(s));
      ctx.onSave?.();
    },
    action(action) {
      if (!active) return;
      if (action === "confirm") {
        commit();
        return;
      }
      const x = selected % a.size,
        y = Math.floor(selected / a.size);
      selected =
        action === "left"
          ? y * a.size + Math.max(0, x - 1)
          : action === "right"
            ? y * a.size + Math.min(a.size - 1, x + 1)
            : action === "up"
              ? Math.max(0, y - 1) * a.size + x
              : Math.min(a.size - 1, y + 1) * a.size + x;
      render();
      cells[selected]!.focus();
    },
    serialize: () => structuredClone(s),
    destroy() {
      active = false;
      abort.abort();
      resize.disconnect();
      motion.destroy();
      controls.remove();
      root.remove();
    },
  };
}
