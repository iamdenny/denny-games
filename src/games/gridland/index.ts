import type { Action, GameFactory, GameInstance } from "../../lib/types";

const allowedKeys = ["gameOptions", "slot0", "slot1", "slot2"] as const;
type StorageKey = (typeof allowedKeys)[number];
type GameStorage = Partial<Record<StorageKey, string>>;
const maxValueLength = 200_000;
const maxStorageLength = 320_000;

function readStorage(value: unknown): GameStorage {
  if (!value || typeof value !== "object") return {};
  const saved = value as { version?: unknown; storage?: unknown };
  if (
    saved.version !== 1 ||
    !saved.storage ||
    typeof saved.storage !== "object"
  )
    return {};
  const storage: GameStorage = {};
  let total = 0;
  for (const key of allowedKeys) {
    const candidate = (saved.storage as Record<string, unknown>)[key];
    if (typeof candidate !== "string" || candidate.length > maxValueLength)
      continue;
    total += candidate.length;
    if (total <= maxStorageLength) storage[key] = candidate;
  }
  return storage;
}

export const mount: GameFactory = (context) => {
  const channel = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title = context.locale === "ko" ? "Gridland 게임" : "Gridland game";
  frame.className = "crisp-frame gridland-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "same-origin";
  frame.tabIndex = 0;
  let loaded = false;
  let destroyed = false;
  let storage = readStorage(context.saved);
  const flushes = new Map<string, (saved: boolean) => void>();
  const send = (type: string, payload: Record<string, unknown> = {}) =>
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  const fail = () => {
    if (destroyed) return;
    context.onError?.(
      context.locale === "ko"
        ? "Gridland를 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "Gridland could not load. Restart or refresh to try again.",
    );
  };
  const timeout = window.setTimeout(fail, 20_000);
  const receive = (event: MessageEvent) => {
    if (
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data as Record<string, unknown>;
    if (data.type === "ready") {
      window.clearTimeout(timeout);
      loaded = true;
      frame.style.aspectRatio = "1 / 1";
      frame.style.setProperty("--frame-ratio", "1");
      context.onReady?.({ width: 1, height: 1 });
    } else if (data.type === "storage-change") {
      storage = readStorage({ version: 1, storage: data.storage });
      context.onSave?.();
    } else if (
      data.type === "checkpoint-data" &&
      typeof data.requestId === "string"
    ) {
      storage = readStorage({ version: 1, storage: data.storage });
      const resolve = flushes.get(data.requestId);
      if (resolve) {
        flushes.delete(data.requestId);
        resolve(data.captured === true && context.onSave?.() === true);
      }
    } else if (data.type === "pause") {
      context.onPause?.();
    } else if (data.type === "error") {
      window.clearTimeout(timeout);
      fail();
    }
  };
  window.addEventListener("message", receive);
  frame.name = JSON.stringify({
    version: 1,
    storage,
    parentOrigin: location.origin,
  });
  frame.src =
    "/vendor/gridland/runtime/index.html?silent&channel=" +
    encodeURIComponent(channel);
  context.host.append(frame);

  const soundButton =
    document.querySelector<HTMLButtonElement>("#sound-button");
  if (soundButton) soundButton.hidden = true;
  const volume = document.querySelector<HTMLInputElement>("#sound-volume");
  if (volume?.parentElement) volume.parentElement.hidden = true;

  const instance: GameInstance = {
    start() {
      // Reveal Gridland's own save-slot picker; the player must choose a slot.
      frame.focus({ preventScroll: true });
    },
    pause() {
      if (loaded) send("pause");
    },
    resume() {
      if (loaded) send("resume");
      frame.focus({ preventScroll: true });
    },
    restart() {
      storage = {};
    },
    action(_action: Action) {},
    flush() {
      if (destroyed) return Promise.resolve(false);
      if (!loaded) return Promise.resolve(context.onSave?.() === true);
      const requestId = crypto.randomUUID();
      return new Promise<boolean>((resolve) => {
        const timer = window.setTimeout(() => {
          flushes.delete(requestId);
          resolve(false);
        }, 1500);
        flushes.set(requestId, (saved) => {
          window.clearTimeout(timer);
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
      window.clearTimeout(timeout);
      flushes.forEach((resolve) => resolve(false));
      flushes.clear();
      window.removeEventListener("message", receive);
      frame.remove();
    },
  };
  return instance;
};
