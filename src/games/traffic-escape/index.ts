import type { GameFactory, Action } from "../../lib/types";
import { createMotion, gsap } from "../../lib/motion";
import { fresh, restore, move, undo, score, CARS } from "./rules";
import "./style.css";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko",
    saved = restore(ctx.saved, ctx.stage);
  let s = saved ?? fresh(ctx.stage),
    active = false,
    ended = false,
    dead = false,
    restored = !!saved;
  const root = document.createElement("div");
  root.className = "traffic-board";
  root.dataset.game = "traffic-escape";
  root.setAttribute(
    "aria-label",
    ko ? "교통 탈출 주차장" : "Traffic Escape parking lot",
  );
  root.tabIndex = 0;
  const exit = document.createElement("span");
  exit.className = "traffic-exit";
  exit.textContent = "➜";
  exit.setAttribute("aria-hidden", "true");
  root.append(exit);
  const panel = document.createElement("div");
  panel.className = "traffic-controls";
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  const buttons = document.createElement("div");
  buttons.className = "traffic-actions";
  const hint = document.createElement("p");
  hint.textContent = ko
    ? "차를 선택한 뒤 방향 버튼으로 이동 · A차를 오른쪽 출구로!"
    : "Select a car, then move along its lane. Send car A to the right exit.";
  panel.append(status, buttons, hint);
  ctx.host.append(root);
  (ctx.controlsHost ?? ctx.host).append(panel);
  const motion = createMotion(root),
    abort = new AbortController(),
    colors = [
      "#f1a07b",
      "#9bdecf",
      "#e7d47d",
      "#b6a2dc",
      "#8ebede",
      "#cfb493",
      "#b8ce88",
    ];
  const cars = CARS.map((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `traffic-car ${c.axis}`;
    b.textContent = String.fromCharCode(65 + i);
    b.style.setProperty("--car", colors[i]!);
    b.style.width = `${((c.axis === "h" ? c.length : 1) * 100) / 6}%`;
    b.style.height = `${((c.axis === "v" ? c.length : 1) * 100) / 6}%`;
    b.setAttribute(
      "aria-label",
      ko ? `${b.textContent} 차량 선택` : `Select car ${b.textContent}`,
    );
    b.addEventListener(
      "click",
      () => {
        if (active) {
          motion.finish();
          s.selected = i;
          render();
          ctx.onSave?.();
        }
      },
      { signal: abort.signal },
    );
    root.append(b);
    return b;
  });
  function control(label: string, action: Action | "undo") {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.dataset.trafficAction = action;
    b.addEventListener(
      "click",
      () => act(b.dataset.trafficAction as Action | "undo"),
      { signal: abort.signal },
    );
    buttons.append(b);
    return b;
  }
  const controls = [
    control("←", "left"),
    control("→", "right"),
    control(ko ? "다음 차량" : "Next car", "confirm"),
    control(ko ? "되돌리기" : "Undo", "undo"),
  ];
  function render() {
    root.dataset.moves = String(s.moves);
    root.dataset.selected = String(s.selected);
    root.dataset.positions = s.positions.join(",");
    root.dataset.phase = s.phase;
    root.dataset.active = String(active);
    cars.forEach((b, i) => {
      const c = CARS[i]!;
      b.style.left = `${((c.axis === "h" ? s.positions[i]! : c.fixed) * 100) / 6}%`;
      b.style.top = `${((c.axis === "v" ? s.positions[i]! : c.fixed) * 100) / 6}%`;
      b.classList.toggle("selected", i === s.selected);
      b.setAttribute("aria-pressed", String(i === s.selected));
      b.disabled = !active;
    });
    status.textContent = ko
      ? `${ctx.stage}/12 · 이동 ${s.moves} · ${String.fromCharCode(65 + s.selected)}차`
      : `${ctx.stage}/12 · ${s.moves} moves · ${String.fromCharCode(65 + s.selected)}`;
    const horizontal = CARS[s.selected]!.axis === "h";
    controls[0]!.dataset.trafficAction = horizontal ? "left" : "up";
    controls[1]!.dataset.trafficAction = horizontal ? "right" : "down";
    controls[0]!.textContent = horizontal ? "←" : "↑";
    controls[1]!.textContent = horizontal ? "→" : "↓";
    controls.forEach((b) => (b.disabled = !active));
    controls[3]!.disabled = !active || !s.history.length;
  }
  function finish() {
    if (s.phase !== "won" || ended) return;
    ended = true;
    active = false;
    motion.finish();
    render();
    ctx.onEnd({
      won: true,
      score: score(s),
      restored,
      message: ko ? "출구가 열렸어요!" : "The exit is clear!",
    });
  }
  function act(a: Action | "undo") {
    if (!active || s.phase !== "play") return;
    motion.finish();
    if (a === "confirm") {
      s.selected = (s.selected + 1) % CARS.length;
      render();
      ctx.onSave?.();
      return;
    }
    let n = s;
    if (a === "undo") n = undo(s);
    else {
      const c = CARS[s.selected]!;
      if (
        (c.axis === "h" && (a === "left" || a === "right")) ||
        (c.axis === "v" && (a === "up" || a === "down"))
      )
        n = move(s, s.selected, a === "left" || a === "up" ? -1 : 1);
    }
    if (n === s) return;
    const old = s;
    s = n;
    restored = false;
    render();
    ctx.onChange(score(s));
    ctx.onSave?.();
    const b = cars[s.selected]!,
      c = CARS[s.selected]!,
      offset =
        ((old.positions[s.selected]! - s.positions[s.selected]!) *
          (c.axis === "h" ? root.clientWidth : root.clientHeight)) /
        6;
    motion.run(
      (t) => {
        t.fromTo(b, c.axis === "h" ? { x: offset } : { y: offset }, {
          x: 0,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
        });
      },
      () => gsap.set(b, { clearProps: "transform" }),
    );
    ctx.sound();
    finish();
  }
  const resize = new ResizeObserver(() => motion.finish());
  resize.observe(root);
  const start = () => {
    if (dead) return;
    active = true;
    render();
    finish();
  };
  render();
  ctx.onChange(score(s));
  ctx.onReady?.({ width: 600, height: 600 });
  return {
    start,
    resume: start,
    pause() {
      active = false;
      motion.finish();
      render();
    },
    restart() {
      motion.finish();
      s = fresh(ctx.stage);
      ended = false;
      restored = false;
      active = true;
      render();
      ctx.onChange(score(s));
      ctx.onSave?.();
    },
    action: act,
    serialize: () => structuredClone(s),
    destroy() {
      dead = true;
      active = false;
      abort.abort();
      resize.disconnect();
      motion.destroy();
      root.remove();
      panel.remove();
    },
  };
};
