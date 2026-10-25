import type { GameFactory } from "../../lib/types";

const validDimension = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value > 0 &&
  value <= 4096;

export const mount: GameFactory = (context) => {
  const frame = document.createElement("iframe");
  frame.title =
    context.locale === "ko" ? "8볼 풀 당구 게임" : "8-Ball Pool game";
  frame.className = "crisp-frame chogan-eightball-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "no-referrer";
  frame.tabIndex = 0;

  let channel = "";
  let loaded = false;
  let running = false;
  let destroyed = false;
  let loadTimer: number | undefined;
  let soundEnabled = false;
  let volume = 0.5;

  const send = (type: string, payload: Record<string, unknown> = {}) => {
    if (destroyed || !channel) return;
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  };

  const fail = () => {
    if (destroyed) return;
    if (loadTimer !== undefined) clearTimeout(loadTimer);
    loadTimer = undefined;
    loaded = false;
    running = false;
    frame.style.pointerEvents = "none";
    context.onError?.(
      context.locale === "ko"
        ? "8볼 풀을 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "8-Ball Pool could not load. Restart or refresh to try again.",
    );
  };

  const setAspect = (width: number, height: number) => {
    const ratio = width / height;
    frame.style.aspectRatio = `${width} / ${height}`;
    frame.style.setProperty("--frame-ratio", String(ratio));
  };

  const receive = (event: MessageEvent<unknown>) => {
    if (
      destroyed ||
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      !event.data ||
      typeof event.data !== "object"
    )
      return;
    const data = event.data as Record<string, unknown>;
    if (data.channel !== channel) return;

    if (data.type === "ready") {
      if (!validDimension(data.width) || !validDimension(data.height)) {
        fail();
        return;
      }
      if (loadTimer !== undefined) clearTimeout(loadTimer);
      loadTimer = undefined;
      loaded = true;
      setAspect(data.width, data.height);
      frame.style.pointerEvents = running ? "auto" : "none";
      context.onReady?.({ width: data.width, height: data.height });
      send("run", { running });
      send("sound", { enabled: soundEnabled, volume });
      return;
    }

    if (data.type === "focus-lost") {
      if (running) context.onPause?.();
      return;
    }

    if (data.type === "error") fail();
  };

  const load = () => {
    if (destroyed) return;
    if (loadTimer !== undefined) clearTimeout(loadTimer);
    channel = crypto.randomUUID();
    loaded = false;
    running = false;
    frame.style.pointerEvents = "none";
    const query = new URLSearchParams({
      channel,
      locale: context.locale,
      parentOrigin: location.origin,
      from: "shortcut",
    });
    const landscape = window.innerWidth >= window.innerHeight;
    setAspect(landscape ? 4 : 9, landscape ? 3 : 16);
    loadTimer = window.setTimeout(fail, 15000);
    frame.src = `/vendor/chogan-eightball/games/eightball/index.html?${query.toString()}`;
  };

  const onFrameError = () => fail();
  window.addEventListener("message", receive);
  frame.addEventListener("error", onFrameError);
  context.host.append(frame);
  load();

  const setRunning = (value: boolean) => {
    running = value && loaded;
    frame.style.pointerEvents = running ? "auto" : "none";
    send("run", { running });
  };

  return {
    handlesKeyboard: true,
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
      load();
    },
    action(action) {
      if (loaded && running) send("action", { action });
    },
    setSoundEnabled(enabled) {
      soundEnabled = enabled;
      send("sound", { enabled: soundEnabled, volume });
    },
    setVolume(nextVolume) {
      volume = Number.isFinite(nextVolume)
        ? Math.max(0, Math.min(1, nextVolume))
        : 0;
      send("sound", { enabled: soundEnabled, volume });
    },
    serialize() {
      return undefined;
    },
    destroy() {
      destroyed = true;
      if (loadTimer !== undefined) clearTimeout(loadTimer);
      window.removeEventListener("message", receive);
      frame.removeEventListener("error", onFrameError);
      frame.remove();
    },
  };
};
