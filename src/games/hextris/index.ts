import type { Action, GameFactory, GameInstance } from "../../lib/types";

const allowedKeys = ["saveState", "highscores", "visited"] as const;
type SavedKey = (typeof allowedKeys)[number];
type SavedStorage = Partial<Record<SavedKey, string>>;

function readStorage(value: unknown): SavedStorage {
  if (!value || typeof value !== "object") return {};
  const saved = value as { version?: unknown; storage?: unknown };
  if (
    saved.version !== 1 ||
    !saved.storage ||
    typeof saved.storage !== "object"
  )
    return {};
  const storage: SavedStorage = {};
  for (const key of allowedKeys) {
    const candidate = (saved.storage as Record<string, unknown>)[key];
    if (typeof candidate === "string" && candidate.length <= 120_000)
      storage[key] = candidate;
  }
  return storage;
}

export const mount: GameFactory = (context) => {
  const channel = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title = context.locale === "ko" ? "Hextris 게임" : "Hextris game";
  frame.className = "crisp-frame hextris-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "same-origin";
  frame.tabIndex = 0;
  let loaded = false;
  let running = false;
  let destroyed = false;
  const pendingFlushes = new Map<string, (saved: boolean) => void>();
  let storage = readStorage(context.saved);
  const send = (type: string, payload: Record<string, unknown> = {}) =>
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  const fail = () => {
    if (destroyed) return;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? "Hextris를 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "Hextris could not load. Restart or refresh to try again.",
    );
  };
  const timer = setTimeout(fail, 12000);
  const receive = (event: MessageEvent) => {
    if (
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data as Record<string, unknown>;
    if (data.type === "checkpoint-data" && typeof data.requestId === "string") {
      const complete = pendingFlushes.get(data.requestId);
      if (!complete) return;
      storage = readStorage({ version: 1, storage: data.storage });
      const persisted = data.captured === true && context.onSave?.() === true;
      complete(persisted);
      pendingFlushes.delete(data.requestId);
    } else if (data.type === "storage-change") {
      storage = readStorage({ version: 1, storage: data.storage });
      context.onSave?.();
    } else if (data.type === "ready") {
      clearTimeout(timer);
      loaded = true;
      frame.style.aspectRatio = "1 / 1";
      frame.style.setProperty("--frame-ratio", "1");
      context.onReady?.({ width: 1, height: 1 });
      send("run", { running });
    } else if (data.type === "pause") {
      context.onPause?.();
    } else if (data.type === "end" && Number.isFinite(data.score)) {
      running = false;
      context.onEnd({
        score: Math.max(0, Number(data.score)),
        won: false,
        message:
          context.locale === "ko"
            ? "최고 점수와 순위는 이 기기에 저장됩니다."
            : "Your high score stays on this device.",
      });
    } else if (data.type === "error") {
      clearTimeout(timer);
      fail();
    }
  };
  window.addEventListener("message", receive);

  frame.name = JSON.stringify({ version: 1, storage });
  frame.src =
    "/vendor/hextris/index.html?channel=" +
    encodeURIComponent(channel) +
    "&lang=" +
    context.locale;
  context.host.append(frame);

  const setRunning = (value: boolean) => {
    running = value;
    if (loaded) send("run", { running: value });
  };
  const controls = context.controlsHost;
  if (controls) {
    controls.classList.add("hextris-controls");
    const left = document.createElement("button");
    left.type = "button";
    left.textContent =
      context.locale === "ko" ? "↶ 왼쪽 회전" : "↶ Rotate left";
    left.setAttribute(
      "aria-label",
      context.locale === "ko" ? "육각형 왼쪽으로 회전" : "Rotate hexagon left",
    );
    left.addEventListener("click", () => {
      if (running) send("action", { action: "left" });
    });
    const right = document.createElement("button");
    right.type = "button";
    right.textContent =
      context.locale === "ko" ? "↷ 오른쪽 회전" : "↷ Rotate right";
    right.setAttribute(
      "aria-label",
      context.locale === "ko"
        ? "육각형 오른쪽으로 회전"
        : "Rotate hexagon right",
    );
    right.addEventListener("click", () => {
      if (running) send("action", { action: "right" });
    });
    controls.append(left, right);
  }
  const soundButton =
    document.querySelector<HTMLButtonElement>("#sound-button");
  if (soundButton) soundButton.hidden = true;
  const volume = document.querySelector<HTMLInputElement>("#sound-volume");
  if (volume?.parentElement) volume.parentElement.hidden = true;

  const instance: GameInstance = {
    start() {
      setRunning(true);
      frame.focus({ preventScroll: true });
    },
    pause() {
      setRunning(false);
    },
    resume() {
      setRunning(true);
      frame.focus({ preventScroll: true });
    },
    restart() {
      storage = { ...storage, saveState: "{}" };
    },
    action(action: Action) {
      if (action === "left" || action === "right") send("action", { action });
    },
    flush() {
      if (!loaded) return Promise.resolve(!destroyed);
      if (destroyed) return Promise.resolve(false);
      const requestId = crypto.randomUUID();
      return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          pendingFlushes.delete(requestId);
          resolve(false);
        }, 1000);
        pendingFlushes.set(requestId, (saved) => {
          clearTimeout(timeout);
          resolve(saved);
        });
        send("checkpoint", { requestId });
      });
    },
    serialize() {
      return { version: 1, storage };
    },
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      pendingFlushes.forEach((resolve) => resolve(false));
      pendingFlushes.clear();
      window.removeEventListener("message", receive);
      frame.remove();
      controls?.replaceChildren();
    },
  };
  return instance;
};
