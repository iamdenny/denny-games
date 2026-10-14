import type { Action, GameFactory, GameInstance } from "../../lib/types";

export const mount: GameFactory = (context) => {
  const channel = crypto.randomUUID();
  const frame = document.createElement("iframe");
  frame.title = "UNDERRUN · Denny Games";
  frame.className = "crisp-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "same-origin";
  frame.tabIndex = 0;
  let loaded = false;
  let running = false;
  let destroyed = false;
  let soundEnabled = false;
  let volume = 0.5;
  const send = (type: string, payload: Record<string, unknown> = {}) => {
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  };
  const fail = () => {
    if (destroyed) return;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? "WebGL 게임을 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "WebGL game did not load. Restart or refresh to try again.",
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
      frame.style.aspectRatio = "16 / 9";
      frame.style.setProperty("--frame-ratio", String(16 / 9));
      context.onReady?.({ width: 16, height: 9 });
      send("sound", { enabled: soundEnabled, volume });
      send("run", { running });
    } else if (data.type === "pause") {
      context.onPause?.();
    } else if (data.type === "error") {
      clearTimeout(timer);
      fail();
    } else if (data.type === "end" && Number.isFinite(data.score)) {
      running = false;
      context.onEnd({
        score: Number(data.score),
        won: data.won === true,
        message:
          context.locale === "ko"
            ? "세 구역의 시스템을 모두 복구했습니다."
            : "All three facility systems are back online.",
      });
    }
  };
  window.addEventListener("message", receive);
  frame.src =
    "/vendor/underrun/index.html?channel=" + encodeURIComponent(channel);
  context.host.append(frame);

  const run = (value: boolean) => {
    running = value;
    if (loaded) send("run", { running: value });
  };
  const instance: GameInstance = {
    start() {
      run(true);
      frame.focus({ preventScroll: true });
    },
    pause() {
      run(false);
    },
    resume() {
      run(true);
      frame.focus({ preventScroll: true });
    },
    restart() {
      if (loaded) send("restart");
      else location.reload();
    },
    action(action: Action) {
      if (action !== "confirm") send("aim", { direction: action });
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
      return { restartOnly: true };
    },
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      window.removeEventListener("message", receive);
      send("destroy");
      frame.remove();
    },
  };
  return instance;
};
