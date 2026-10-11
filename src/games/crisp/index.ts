import type { GameFactory, GameInstance } from "../../lib/types";
export const mount: GameFactory = (context) => {
  const id = context.host.closest<HTMLElement>("#player")!.dataset.id!;
  const slug = id.slice(6);
  context.onChange(0);
  const frame = document.createElement("iframe");
  const channel = crypto.randomUUID();
  frame.title = `${id} · ABA Games`;
  frame.className = "crisp-frame";
  frame.sandbox.add("allow-scripts");
  frame.referrerPolicy = "same-origin";
  frame.tabIndex = 0;
  let loaded = false,
    running = false,
    destroyed = false;
  const send = (type: string, payload: Record<string, unknown> = {}) => {
    // An opaque-origin frame cannot use a tuple targetOrigin. Pin the window and channel on receive.
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
  const receive = (e: MessageEvent) => {
    if (
      e.source !== frame.contentWindow ||
      e.origin !== "null" ||
      e.data?.channel !== channel
    )
      return;
    const d = e.data;
    if (d.type === "ready") {
      clearTimeout(timer);
      loaded = true;
      context.onReady?.();
      if (
        Number.isFinite(d.width) &&
        Number.isFinite(d.height) &&
        d.width > 0 &&
        d.height > 0
      )
        frame.style.aspectRatio = `${d.width} / ${d.height}`;
      send("run", { running });
    }
    if (d.type === "pause") context.onPause?.();
    if (d.type === "error") {
      clearTimeout(timer);
      fail();
    }
    if (d.type === "sound" && running) context.sound();
    if (d.type === "score" && Number.isFinite(d.score))
      context.onChange(d.score);
    if (d.type === "end" && Number.isFinite(d.score)) {
      running = false;
      context.onEnd({ score: d.score, won: d.won === true });
    }
  };
  window.addEventListener("message", receive);
  frame.src = `/vendor/crisp/index.html?game=${encodeURIComponent(slug)}&channel=${channel}`;
  context.host.append(frame);
  let selectedDigit = 1;
  const digitButtons: HTMLButtonElement[] = [];
  if (slug === "digi10") {
    const keys = document.createElement("div");
    keys.className = "crisp-digits";
    for (let i = 1; i <= 9; i++) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(i);
      button.addEventListener("click", () => send("digit", { key: String(i) }));
      keys.append(button);
      digitButtons.push(button);
    }
    context.host.append(keys);
  }
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
      location.reload();
    },
    action(value) {
      if (slug !== "digi10") return;
      if (value === "confirm") send("digit", { key: String(selectedDigit) });
      else {
        selectedDigit =
          ((selectedDigit - 1 + (value === "left" || value === "up" ? 8 : 1)) %
            9) +
          1;
        digitButtons.forEach((button, i) =>
          button.setAttribute("aria-pressed", String(i + 1 === selectedDigit)),
        );
      }
    },
    inputState(state) {
      if (running) send("input", state);
    },
    serialize() {
      return { restartOnly: true };
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
