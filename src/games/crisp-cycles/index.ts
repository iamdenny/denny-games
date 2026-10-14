import type { Action, GameFactory, GameInstance } from "../../lib/types";

const games = {
  "crisp-chain-drift": {
    slug: "chain-drift",
    title: "Chain Drift",
    startKey: "Space",
    action: { en: "PUSH", ko: "밀기" },
  },
  "crisp-comet-slash": {
    slug: "comet-slash",
    title: "Comet Slash",
    startKey: "Enter",
    startDelay: 650,
    action: { en: "SLASH", ko: "베기" },
  },
  "crisp-volt-keeper": {
    slug: "volt-keeper",
    title: "Volt Keeper",
    startKey: "Space",
    action: { en: "GROUND", ko: "접지" },
  },
} as const;

type GameId = keyof typeof games;
type KeyCode =
  "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Space" | "Enter";

function createTouchControls(
  context: Parameters<GameFactory>[0],
  active: () => boolean,
  setInput: (state: { x: number; y: number; pressed: boolean }) => void,
  actionName: string,
) {
  const host = context.controlsHost;
  if (!host) return { clear() {}, destroy() {} };
  host.classList.add("crisp-cycle-controls");
  host.replaceChildren();
  const label = context.locale === "ko" ? "터치 조작" : "Touch controls";
  host.setAttribute("role", "group");
  host.setAttribute("aria-label", label);

  const movement = document.createElement("div");
  movement.className = "cycle-dpad";
  movement.setAttribute("role", "group");
  movement.setAttribute(
    "aria-label",
    context.locale === "ko" ? "이동" : "Movement",
  );
  const pointers = new Map<number, Action>();
  const keys = new Map<string, Action>();
  const buttons = new Map<Action, HTMLButtonElement[]>();
  let lastKeyboardActivation = -Infinity;

  const update = () => {
    const held = new Set([...pointers.values(), ...keys.values()]);
    setInput({
      x: (held.has("right") ? 1 : 0) - (held.has("left") ? 1 : 0),
      y: (held.has("down") ? 1 : 0) - (held.has("up") ? 1 : 0),
      pressed: held.has("confirm"),
    });
    for (const [action, targets] of buttons) {
      const isPressed = held.has(action);
      targets.forEach((button) =>
        button.setAttribute("aria-pressed", String(isPressed)),
      );
    }
  };

  const makeButton = (
    action: Action,
    className: string,
    text: string,
    accessibleName: string,
  ) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.setAttribute("aria-label", accessibleName);
    button.setAttribute("aria-pressed", "false");
    const targets = buttons.get(action) ?? [];
    targets.push(button);
    buttons.set(action, targets);

    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !active()) return;
      event.preventDefault();
      try {
        button.setPointerCapture(event.pointerId);
      } catch {
        /* Pointer capture is unavailable for synthetic and virtual clicks. */
      }
      pointers.set(event.pointerId, action);
      update();
    });
    for (const name of [
      "pointerup",
      "pointercancel",
      "lostpointercapture",
    ] as const) {
      button.addEventListener(name, (event) => {
        pointers.delete(event.pointerId);
        update();
      });
    }
    button.addEventListener("keydown", (event) => {
      if (!active() || (event.code !== "Space" && event.code !== "Enter"))
        return;
      event.preventDefault();
      event.stopPropagation();
      lastKeyboardActivation = performance.now();
      keys.set(event.code, action);
      update();
    });
    button.addEventListener("keyup", (event) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      event.preventDefault();
      event.stopPropagation();
      keys.delete(event.code);
      update();
    });
    button.addEventListener("click", (event) => {
      if (
        event.detail !== 0 ||
        !active() ||
        performance.now() - lastKeyboardActivation < 500
      )
        return;
      pointers.set(-1, action);
      update();
      setTimeout(() => {
        pointers.delete(-1);
        update();
      }, 120);
    });
    return button;
  };

  const directions: {
    action: Action;
    position: string;
    glyph: string;
    en: string;
    ko: string;
  }[] = [
    {
      action: "up",
      position: "up",
      glyph: "↑",
      en: "Move up",
      ko: "위로 이동",
    },
    {
      action: "left",
      position: "left",
      glyph: "←",
      en: "Move left",
      ko: "왼쪽 이동",
    },
    {
      action: "right",
      position: "right",
      glyph: "→",
      en: "Move right",
      ko: "오른쪽 이동",
    },
    {
      action: "down",
      position: "down",
      glyph: "↓",
      en: "Move down",
      ko: "아래로 이동",
    },
  ];
  for (const direction of directions) {
    movement.append(
      makeButton(
        direction.action,
        `cycle-direction cycle-${direction.position}`,
        direction.glyph,
        context.locale === "ko" ? direction.ko : direction.en,
      ),
    );
  }
  const actionButton = makeButton(
    "confirm",
    "cycle-action",
    actionName,
    actionName,
  );
  const movementCaption = document.createElement("span");
  movementCaption.className = "cycle-control-caption";
  movementCaption.textContent = context.locale === "ko" ? "이동" : "MOVE";
  const actionCaption = document.createElement("span");
  actionCaption.className = "cycle-control-caption";
  actionCaption.textContent = context.locale === "ko" ? "동작" : "ACTION";
  const movementGroup = document.createElement("div");
  movementGroup.className = "cycle-control-group";
  movementGroup.append(movementCaption, movement);
  const actionGroup = document.createElement("div");
  actionGroup.className = "cycle-control-group cycle-action-group";
  actionGroup.append(actionCaption, actionButton);
  host.append(movementGroup, actionGroup);

  const clear = () => {
    pointers.clear();
    keys.clear();
    update();
  };
  const destroy = () => {
    clear();
    host.replaceChildren();
    host.removeAttribute("role");
    host.removeAttribute("aria-label");
    host.classList.remove("crisp-cycle-controls");
  };
  return { clear, destroy };
}

export const mount: GameFactory = (context): GameInstance => {
  const player = context.host.closest<HTMLElement>("#player");
  const id = player?.dataset.id as GameId | undefined;
  const game = id && id in games ? games[id] : undefined;
  if (!id || !game) throw new Error("Unknown Crisp arcade cycle");

  const channel = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title =
    context.locale === "ko" ? `${game.title} 게임` : `${game.title} game`;
  frame.className = "crisp-frame crisp-cycle-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "same-origin";
  frame.tabIndex = 0;
  let loaded = false;
  let running = false;
  let destroyed = false;
  let soundEnabled = false;
  let volume = 0.5;
  let startRequested = false;
  let startTimer: ReturnType<typeof setTimeout> | undefined;
  let touchInput = { x: 0, y: 0, pressed: false };
  let gamepadInput = { x: 0, y: 0, pressed: false };
  const send = (type: string, payload: Record<string, unknown> = {}) =>
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  const fail = () => {
    if (destroyed) return;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? `${game.title}을 불러오지 못했어요. 다시 시작하거나 새로고침해주세요.`
        : `${game.title} could not load. Restart or refresh to try again.`,
    );
  };
  const timer = setTimeout(fail, 15000);
  const receive = (event: MessageEvent) => {
    if (
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data as Record<string, unknown>;
    if (data.type === "ready") {
      clearTimeout(timer);
      loaded = true;
      const width = Number(data.width);
      const height = Number(data.height);
      if (width > 0 && height > 0) {
        frame.style.aspectRatio = `${width} / ${height}`;
        frame.style.setProperty("--frame-ratio", String(width / height));
        context.onReady?.({ width, height });
      }
      send("sound", { enabled: soundEnabled, volume });
      send("run", { running });
    } else if (data.type === "score" && Number.isFinite(data.score)) {
      context.onChange(Number(data.score));
    } else if (data.type === "pause") {
      context.onPause?.();
    } else if (data.type === "error") {
      clearTimeout(timer);
      fail();
    } else if (data.type === "end" && Number.isFinite(data.score)) {
      running = false;
      context.onEnd({ score: Number(data.score), won: data.won === true });
    }
  };
  window.addEventListener("message", receive);
  frame.src = `/vendor/crisp-cycles/${game.slug}/index.html?channel=${encodeURIComponent(channel)}`;
  context.host.append(frame);

  const sendInput = () => {
    const state = {
      x: Math.max(-1, Math.min(1, touchInput.x + gamepadInput.x)),
      y: Math.max(-1, Math.min(1, touchInput.y + gamepadInput.y)),
      pressed: touchInput.pressed || gamepadInput.pressed,
    };
    if (running && loaded) send("input", state);
  };
  const touchControls = createTouchControls(
    context,
    () => running,
    (state) => {
      touchInput = state;
      sendInput();
    },
    game.action[context.locale],
  );
  const run = (value: boolean) => {
    running = value;
    if (!running) {
      touchInput = { x: 0, y: 0, pressed: false };
      gamepadInput = { x: 0, y: 0, pressed: false };
      touchControls.clear();
      if (loaded) send("input", { x: 0, y: 0, pressed: false });
    }
    if (loaded) send("run", { running });
  };
  const keyCode: Record<Action, KeyCode> = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    confirm: "Space",
  };
  const tap = (code: KeyCode) => send("tap", { code });
  const startCycle = () => {
    if (!loaded || startRequested || startTimer) return;
    const delay = "startDelay" in game ? game.startDelay : 0;
    const activate = () => {
      startTimer = undefined;
      if (destroyed || !running) return;
      startRequested = true;
      tap(game.startKey);
    };
    if (delay) startTimer = setTimeout(activate, delay);
    else activate();
  };

  return {
    start() {
      run(true);
      startCycle();
      frame.focus({ preventScroll: true });
    },
    pause() {
      if (!startRequested && startTimer) {
        clearTimeout(startTimer);
        startTimer = undefined;
      }
      run(false);
    },
    resume() {
      run(true);
      startCycle();
      frame.focus({ preventScroll: true });
    },
    restart() {
      if (!loaded) {
        location.reload();
        return;
      }
      startRequested = false;
      run(true);
      startCycle();
    },
    action(action: Action) {
      if (running) tap(keyCode[action]);
    },
    inputState(state) {
      gamepadInput = state;
      sendInput();
    },
    setSoundEnabled(enabled) {
      soundEnabled = enabled;
      if (loaded) send("sound", { enabled: soundEnabled, volume });
    },
    setVolume(value) {
      volume = Math.max(0, Math.min(1, value));
      if (loaded) send("sound", { enabled: soundEnabled, volume });
    },
    serialize() {
      return { restartOnly: true };
    },
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      if (startTimer) clearTimeout(startTimer);
      window.removeEventListener("message", receive);
      send("destroy");
      touchControls.destroy();
      frame.remove();
    },
  };
};
