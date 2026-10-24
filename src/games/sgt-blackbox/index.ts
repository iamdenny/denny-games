import type { GameFactory } from "../../lib/types";

export const mount: GameFactory = (context) => {
  const frame = document.createElement("iframe");
  let channel = "";
  let loaded = false;
  let running = false;
  let dead = false;
  let timeout: ReturnType<typeof setTimeout>;

  frame.title =
    context.locale === "ko" ? "블랙 박스 게임 보드" : "Black Box game board";
  frame.className = "crisp-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "no-referrer";
  frame.setAttribute("aria-label", frame.title);

  function send(type: string, payload: Record<string, unknown> = {}) {
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  }

  function fail() {
    if (dead) return;
    clearTimeout(timeout);
    loaded = false;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? "블랙 박스를 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "Black Box could not load. Restart or refresh to try again.",
    );
  }

  function load() {
    clearTimeout(timeout);
    loaded = false;
    running = false;
    channel = crypto.randomUUID();
    const query = new URLSearchParams({
      channel,
      locale: context.locale,
      parentOrigin: location.origin,
    });
    timeout = setTimeout(fail, 15000);
    frame.src = `/vendor/sgt-blackbox/index.html?${query.toString()}`;
  }

  function receive(event: MessageEvent) {
    if (
      dead ||
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== channel
    )
      return;

    if (event.data.type === "ready" && !loaded) {
      const { width, height } = event.data;
      if (
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        width <= 0 ||
        height <= 0 ||
        width > 4096 ||
        height > 4096
      ) {
        fail();
        return;
      }
      clearTimeout(timeout);
      loaded = true;
      frame.style.aspectRatio = `${width}/${height}`;
      context.onReady?.({ width, height });
      send("run", { running });
      return;
    }

    if (event.data.type === "focus-lost") {
      running = false;
      context.onPause?.();
      return;
    }

    if (event.data.type === "error") fail();
  }

  window.addEventListener("message", receive);
  frame.addEventListener("error", fail);
  context.host.append(frame);
  load();

  function setRunning(value: boolean) {
    running = value && loaded;
    send("run", { running });
  }

  return {
    handlesKeyboard: true,
    start() {
      setRunning(true);
    },
    pause() {
      setRunning(false);
    },
    resume() {
      setRunning(true);
    },
    restart() {
      load();
    },
    action() {},
    setSoundEnabled() {},
    setVolume() {},
    serialize() {
      return undefined;
    },
    destroy() {
      dead = true;
      clearTimeout(timeout);
      window.removeEventListener("message", receive);
      frame.removeEventListener("error", fail);
      frame.remove();
    },
  };
};
