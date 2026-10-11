import type { Action } from "./types";
export function focusNext(action: Action): void {
  if (action === "confirm") {
    const focused = document.activeElement;
    if (focused instanceof HTMLElement) focused.click();
    return;
  }
  const elements = [
    ...document.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input,select,[tabindex="0"]',
    ),
  ].filter(
    (e) =>
      !e.closest("[hidden],[inert]") &&
      e.getBoundingClientRect().width > 0 &&
      e.getBoundingClientRect().height > 0,
  );
  const current = document.activeElement as HTMLElement;
  if (!elements.includes(current)) {
    elements[0]?.focus();
    return;
  }
  const box = current.getBoundingClientRect();
  const ranked = elements
    .filter((e) => e !== current)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const dx = rect.x + rect.width / 2 - box.x - box.width / 2;
      const dy = rect.y + rect.height / 2 - box.y - box.height / 2;
      const valid =
        action === "right"
          ? rect.left >= box.right - 2
          : action === "left"
            ? rect.right <= box.left + 2
            : action === "down"
              ? rect.top >= box.bottom - 2
              : rect.bottom <= box.top + 2;
      return {
        element,
        valid,
        score:
          action === "left" || action === "right"
            ? Math.abs(dx) + Math.abs(dy) * 2
            : Math.abs(dy) + Math.abs(dx) * 2,
      };
    })
    .filter((v) => v.valid)
    .sort((a, b) => a.score - b.score);
  ranked[0]?.element.focus();
  ranked[0]?.element.scrollIntoView({ block: "nearest" });
}
export function connectGamepad(
  onAction: (action: Action) => void,
  onPause: () => void,
  onDisconnect: () => void,
): () => void {
  let frame = 0,
    lastDirection = "",
    lastTime = 0;
  const previous = new Map<number, Set<number>>();
  const tick = (now: number) => {
    let pads: (Gamepad | null)[] = [];
    try {
      pads = [...(navigator.getGamepads?.() ?? [])];
    } catch {
      /* browser policy: retain touch/keyboard */
    }
    let direction = "";
    for (const pad of pads) {
      if (!pad || pad.mapping !== "standard") continue;
      const before = previous.get(pad.index) ?? new Set<number>();
      const pressed = new Set<number>();
      pad.buttons.forEach((button, index) => {
        if (button.pressed) pressed.add(index);
      });
      if (pressed.has(9) && !before.has(9)) onPause();
      if (pressed.has(0) && !before.has(0)) onAction("confirm");
      const x = pad.axes[0] ?? 0,
        y = pad.axes[1] ?? 0;
      direction =
        pressed.has(14) || x < -0.3
          ? "left"
          : pressed.has(15) || x > 0.3
            ? "right"
            : pressed.has(12) || y < -0.3
              ? "up"
              : pressed.has(13) || y > 0.3
                ? "down"
                : "";
      previous.set(pad.index, pressed);
    }
    if (
      direction &&
      (direction !== lastDirection ||
        now - lastTime >
          (document.body.dataset.game === "orbit-break" ? 35 : 180))
    ) {
      onAction(direction as Action);
      lastTime = now;
    }
    lastDirection = direction;
    frame = requestAnimationFrame(tick);
  };
  const disconnect = (event: GamepadEvent) => {
    previous.delete(event.gamepad.index);
    onDisconnect();
  };
  window.addEventListener("gamepaddisconnected", disconnect);
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("gamepaddisconnected", disconnect);
  };
}
