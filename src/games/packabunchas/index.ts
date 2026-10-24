import type { GameFactory } from "../../lib/types";

const allowedKeys = [
  "currentGameMode",
  "polyLeft",
  "storyState",
  "muted",
  "showTutorial",
] as const;
type SavedKey = (typeof allowedKeys)[number];
type SavedStorage = Partial<Record<SavedKey, string>>;
type SavedState = { version: 1; storage: SavedStorage };

function readStorage(value: unknown): SavedStorage {
  if (!value || typeof value !== "object") return {};
  const saved = value as { version?: unknown; storage?: unknown };
  if (
    saved.version !== 1 ||
    !saved.storage ||
    typeof saved.storage !== "object" ||
    Array.isArray(saved.storage)
  )
    return {};
  const storage: SavedStorage = {};
  const limits: Partial<Record<SavedKey, [number, number]>> = {
    currentGameMode: [0, 4],
    polyLeft: [0, 13312],
    storyState: [0, 4],
  };
  for (const key of allowedKeys) {
    const candidate = (saved.storage as Record<string, unknown>)[key];
    if (typeof candidate !== "string" || candidate.length > 16) continue;
    if (key === "muted" || key === "showTutorial") {
      if (candidate === "true" || candidate === "false")
        storage[key] = candidate;
      continue;
    }
    if (!/^\d{1,5}$/.test(candidate)) continue;
    const number = Number(candidate);
    const range = limits[key];
    if (range && number >= range[0] && number <= range[1])
      storage[key] = String(number);
  }
  return storage;
}

export const mount: GameFactory = (context) => {
  const channel = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title =
    context.locale === "ko" ? "PACKABUNCHAS 게임" : "PACKABUNCHAS game";
  frame.className = "crisp-frame packabunchas-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "no-referrer";
  frame.tabIndex = 0;
  frame.style.aspectRatio = "9 / 16";
  frame.style.setProperty("--frame-ratio", String(9 / 16));

  let loaded = false;
  let running = false;
  let destroyed = false;
  let generation = 0;
  let storage = readStorage(context.saved);
  const pendingFlushes = new Map<string, (saved: boolean) => void>();
  const sourceUrl = () =>
    `/vendor/packabunchas/index.html?channel=${encodeURIComponent(channel)}&generation=${generation}`;
  const send = (type: string, payload: Record<string, unknown> = {}) =>
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");

  const fail = () => {
    if (destroyed) return;
    loaded = false;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? "PACKABUNCHAS를 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "PACKABUNCHAS could not load. Restart or refresh to try again.",
    );
  };
  let loadTimer: number | undefined;
  const armLoadTimer = () => {
    if (loadTimer !== undefined) clearTimeout(loadTimer);
    loadTimer = window.setTimeout(fail, 15000);
  };
  const receive = (event: MessageEvent) => {
    if (
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data as Record<string, unknown>;
    if (data.type === "ready") {
      if (loadTimer !== undefined) clearTimeout(loadTimer);
      loadTimer = undefined;
      loaded = true;
      frame.style.aspectRatio = "9 / 16";
      frame.style.setProperty("--frame-ratio", String(9 / 16));
      context.onReady?.({ width: 9, height: 16 });
      send("run", { running });
    } else if (
      data.type === "checkpoint-data" &&
      typeof data.requestId === "string"
    ) {
      const complete = pendingFlushes.get(data.requestId);
      if (!complete) return;
      storage = readStorage({ version: 1, storage: data.storage });
      const persisted = data.captured === true && context.onSave?.() === true;
      pendingFlushes.delete(data.requestId);
      complete(persisted);
    } else if (data.type === "storage-change") {
      storage = readStorage({ version: 1, storage: data.storage });
      context.onSave?.();
    }
  };
  window.addEventListener("message", receive);

  const load = () => {
    loaded = false;
    armLoadTimer();
    frame.name = JSON.stringify({ version: 1, storage } satisfies SavedState);
    frame.src = sourceUrl();
  };
  load();
  context.host.append(frame);

  const soundButton =
    document.querySelector<HTMLButtonElement>("#sound-button");
  if (soundButton) soundButton.hidden = true;
  const volume = document.querySelector<HTMLInputElement>("#sound-volume");
  if (volume?.parentElement) volume.parentElement.hidden = true;

  return {
    handlesKeyboard: true,
    start() {
      running = true;
      if (loaded) send("run", { running: true });
      frame.focus({ preventScroll: true });
    },
    pause() {
      running = false;
      if (loaded) send("run", { running: false });
    },
    resume() {
      running = true;
      if (loaded) send("run", { running: true });
      frame.focus({ preventScroll: true });
    },
    restart() {
      if (destroyed) return;
      generation++;
      running = false;
      load();
    },
    action() {
      // PACKABUNCHAS supports direct touch and mouse gestures only.
    },
    flush() {
      if (!loaded || destroyed) return Promise.resolve(!destroyed);
      const requestId = crypto.randomUUID();
      return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          pendingFlushes.delete(requestId);
          resolve(false);
        }, 1200);
        pendingFlushes.set(requestId, (saved) => {
          clearTimeout(timeout);
          resolve(saved);
        });
        send("checkpoint", { requestId });
      });
    },
    serialize(): SavedState {
      return { version: 1, storage };
    },
    destroy() {
      destroyed = true;
      if (loadTimer !== undefined) clearTimeout(loadTimer);
      pendingFlushes.forEach((resolve) => resolve(false));
      pendingFlushes.clear();
      window.removeEventListener("message", receive);
      frame.remove();
    },
  };
};
