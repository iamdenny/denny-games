import { gsap } from "gsap";
export { gsap };
/** Decorative timelines never own game state. Settling is safe during input, resize or pause. */
export function createMotion(host: HTMLElement) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const player = host.closest("#player") ?? host;
  const running = new Set<gsap.core.Timeline>();
  let dead = false;
  const enabled = () =>
    !dead &&
    !preference.matches &&
    !player.classList.contains("low-effects") &&
    !document.hidden;
  function finish() {
    for (const timeline of [...running]) {
      timeline.progress(1);
      timeline.kill();
    }
    running.clear();
  }
  const changed = () => {
    if (!enabled()) finish();
  };
  preference.addEventListener("change", changed);
  document.addEventListener("visibilitychange", changed);
  const observer = new MutationObserver(changed);
  observer.observe(player, { attributes: true, attributeFilter: ["class"] });
  return {
    enabled,
    finish,
    run(
      build: (timeline: gsap.core.Timeline) => void,
      cleanup: () => void = () => {},
    ) {
      if (!enabled()) {
        cleanup();
        return;
      }
      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          running.delete(timeline);
          cleanup();
        },
      });
      running.add(timeline);
      build(timeline);
      timeline.play();
    },
    destroy() {
      finish();
      dead = true;
      observer.disconnect();
      preference.removeEventListener("change", changed);
      document.removeEventListener("visibilitychange", changed);
    },
  };
}
export type Motion = ReturnType<typeof createMotion>;
export interface Travel {
  from: number;
  to: number;
  value: number;
}
/** Clone just the moving pieces; the canonical board is committed immediately. */
export function travelTiles(
  motion: Motion,
  grid: HTMLElement,
  cells: HTMLElement[],
  routes: Travel[],
  merged: number[] = [],
  spawned: number[] = [],
) {
  if (!motion.enabled()) return;
  const bounds = grid.getBoundingClientRect();
  const rects = cells.map((cell) => cell.getBoundingClientRect());
  const layer = document.createElement("div");
  layer.className = "tile-travel-layer";
  layer.setAttribute("aria-hidden", "true");
  const targets = [...new Set([...routes.map((r) => r.to), ...spawned])];
  for (const index of targets) cells[index]!.style.opacity = "0";
  for (const rect of rects) {
    const slot = document.createElement("span");
    slot.className = "tile-travel-slot";
    Object.assign(slot.style, {
      left: `${rect.left - bounds.left - grid.clientLeft}px`,
      top: `${rect.top - bounds.top - grid.clientTop}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    layer.append(slot);
  }
  const ghosts = routes.map((route) => {
    const ghost = cells[route.to]!.cloneNode(true) as HTMLElement;
    ghost.className = "tile-traveller";
    ghost.removeAttribute("id");
    ghost.removeAttribute("aria-label");
    ghost.removeAttribute("disabled");
    ghost.tabIndex = -1;
    ghost.dataset.power = String(Math.min(11, Math.log2(route.value)));
    ghost.textContent = String(route.value);
    const rect = rects[route.from]!;
    Object.assign(ghost.style, {
      visibility: "visible",
      opacity: "1",
      position: "absolute",
      margin: "0",
      left: `${rect.left - bounds.left - grid.clientLeft}px`,
      top: `${rect.top - bounds.top - grid.clientTop}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    layer.append(ghost);
    return ghost;
  });
  grid.append(layer);
  motion.run(
    (timeline) => {
      routes.forEach((route, i) => {
        const from = rects[route.from]!,
          to = rects[route.to]!;
        timeline.to(
          ghosts[i]!,
          {
            x: to.left - from.left,
            y: to.top - from.top,
            duration: 0.18,
            ease: "power2.out",
          },
          0,
        );
      });
      timeline.set(layer, { visibility: "hidden" }, 0.18);
      timeline.set(
        targets.map((i) => cells[i]!),
        { opacity: 1 },
        0.18,
      );
      if (merged.length)
        timeline.fromTo(
          merged.map((i) => cells[i]!),
          { scale: 1.15 },
          { scale: 1, duration: 0.18, ease: "back.out(1.5)" },
          0.18,
        );
      if (spawned.length)
        timeline.fromTo(
          spawned.map((i) => cells[i]!),
          { scale: 0.35, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(1.8)" },
          0.18,
        );
    },
    () => {
      layer.remove();
      for (const i of targets) {
        cells[i]!.style.opacity = "";
        gsap.set(cells[i]!, { clearProps: "transform,opacity" });
      }
    },
  );
}
