import type { Action, GameFactory, GameInstance } from "../../lib/types";

const storageKeys = [
  "kbap_coins",
  "kbap_warp",
  "kbap_bestTime",
  "kbap_won",
] as const;
type StorageKey = (typeof storageKeys)[number];
type SavedStorage = Partial<Record<StorageKey, string>>;

function readStorage(value: unknown): SavedStorage {
  if (!value || typeof value !== "object") return {};
  const saved = value as { version?: unknown; storage?: unknown };
  if (
    saved.version !== 1 ||
    !saved.storage ||
    typeof saved.storage !== "object"
  )
    return {};
  const result: SavedStorage = {};
  for (const key of storageKeys) {
    const candidate = (saved.storage as Record<string, unknown>)[key];
    if (
      typeof candidate === "string" &&
      candidate.length <= 16 &&
      /^\d+$/.test(candidate) &&
      Number(candidate) <= 1_000_000_000
    )
      result[key] = candidate;
  }
  return result;
}

export const mount: GameFactory = (context) => {
  const channel = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title = "Bounce Back · Denny Games";
  frame.className = "crisp-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "same-origin";
  frame.tabIndex = 0;
  let loaded = false;
  let running = false;
  let destroyed = false;
  let soundEnabled = false;
  let volume = 0.5;
  let storage = readStorage(context.saved);
  const send = (type: string, payload: Record<string, unknown> = {}) => {
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  };
  const fail = () => {
    if (destroyed) return;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? "게임을 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "Game could not load. Restart or refresh to try again.",
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
    if (data.type === "storage-request") {
      send("storage-init", { storage });
      return;
    }
    if (data.type === "storage-change") {
      storage = readStorage({ version: 1, storage: data.storage });
      return;
    }
    if (data.type === "ready") {
      clearTimeout(timer);
      loaded = true;
      if (
        Number.isFinite(data.width) &&
        Number.isFinite(data.height) &&
        Number(data.width) > 0 &&
        Number(data.height) > 0
      ) {
        const width = Number(data.width);
        const height = Number(data.height);
        frame.style.aspectRatio = width + " / " + height;
        frame.style.setProperty("--frame-ratio", String(width / height));
        context.onReady?.({ width, height });
      }
      send("sound", { enabled: soundEnabled, volume });
      send("run", { running });
      return;
    }
    if (data.type === "pause") context.onPause?.();
    if (data.type === "error") fail();
  };
  window.addEventListener("message", receive);
  frame.src =
    "/vendor/bounceback/index.html?channel=" + encodeURIComponent(channel);
  context.host.append(frame);

  const run = (value: boolean) => {
    running = value;
    if (loaded) send("run", { running: value });
  };
  const instance: GameInstance = {
    start() {
      run(true);
    },
    pause() {
      run(false);
    },
    resume() {
      run(true);
    },
    restart() {
      send("restart");
    },
    action(action: Action) {
      if (action !== "confirm") send("action", { action });
    },
    inputState(state) {
      if (running) send("input", state);
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
      return { version: 1, storage };
    },
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      window.removeEventListener("message", receive);
      frame.remove();
    },
  };
  return instance;
};
