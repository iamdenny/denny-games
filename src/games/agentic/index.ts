import type { GameFactory } from "../../lib/types";
import { agenticGames } from "../../data/agentic-games";
export const mount: GameFactory = (context) => {
  const id = context.host.closest<HTMLElement>("#player")?.dataset.id ?? "";
  const game = agenticGames.find((g) => g.id === id);
  if (!game)
    throw new Error(
      context.locale === "ko" ? "게임을 찾지 못했어요." : "Game not found.",
    );
  const slug = id.slice(8),
    frame = document.createElement("iframe"),
    controls = document.createElement("div");
  frame.title = game.text[context.locale].title;
  frame.className = "crisp-frame";
  frame.sandbox.add("allow-scripts");
  frame.allow = "autoplay";
  frame.referrerPolicy = "same-origin";
  controls.style.cssText =
    "display:grid;grid-template-columns:repeat(3,minmax(48px,1fr));gap:4px;width:100%;max-width:220px";
  let channel = crypto.randomUUID(),
    loaded = false,
    running = false,
    dead = false,
    ended = false,
    sound = false,
    volume = 1,
    timer: ReturnType<typeof setTimeout>;
  const send = (type: string, payload: Record<string, unknown> = {}) =>
    frame.contentWindow?.postMessage({ channel, type, ...payload }, "*");
  const fail = () => {
    if (dead) return;
    running = false;
    context.onError?.(
      context.locale === "ko"
        ? "게임을 불러오지 못했어요. 다시 시작하거나 새로고침해주세요."
        : "Game could not load. Restart or refresh to try again.",
    );
  };
  const load = () => {
    clearTimeout(timer);
    loaded = false;
    ended = false;
    channel = crypto.randomUUID();
    context.onChange(0);
    timer = setTimeout(fail, 15000);
    frame.src = `/vendor/agentic/${slug}.html?channel=${channel}`;
  };
  const receive = (event: MessageEvent) => {
    if (
      dead ||
      event.source !== frame.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== channel
    )
      return;
    const d = event.data;
    if (d.type === "ready" && !loaded) {
      if (
        !Number.isFinite(d.width) ||
        !Number.isFinite(d.height) ||
        d.width <= 0 ||
        d.height <= 0 ||
        d.width > 4096 ||
        d.height > 4096
      ) {
        fail();
        return;
      }
      clearTimeout(timer);
      loaded = true;
      frame.style.aspectRatio = `${d.width}/${d.height}`;
      frame.style.setProperty("--frame-ratio", String(d.width / d.height));
      context.onReady?.({ width: d.width, height: d.height });
      send("sound", { enabled: sound });
      send("volume", { volume });
      send("run", { running });
    }
    if (d.type === "pause" && running) context.onPause?.();
    if (d.type === "error") {
      clearTimeout(timer);
      fail();
    }
    if (d.type === "score" && Number.isFinite(d.score) && d.score >= 0)
      context.onChange(d.score);
    if (
      d.type === "end" &&
      !ended &&
      Number.isFinite(d.score) &&
      d.score >= 0
    ) {
      ended = true;
      running = false;
      context.onEnd({ score: d.score, won: d.won === true });
    }
  };
  window.addEventListener("message", receive);
  const one = ["blink-scope", "zig-saber"].includes(slug);
  const horizontal = ["overturn", "wreckfall"].includes(slug);
  const actions: [string, string][] = one
    ? [["Space", context.locale === "ko" ? "행동" : "Action"]]
    : horizontal
      ? [
          ["ArrowLeft", "←"],
          ["Space", context.locale === "ko" ? "행동" : "Action"],
          ["ArrowRight", "→"],
        ]
      : [
          ["ArrowLeft", "←"],
          ["ArrowUp", "↑"],
          ["ArrowRight", "→"],
          ["Space", context.locale === "ko" ? "행동" : "Action"],
          ["ArrowDown", "↓"],
        ];
  for (const [code, label] of actions) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.setAttribute("aria-label", label);
    b.style.cssText =
      "min-width:48px;min-height:48px;padding:4px;touch-action:none";
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      if (running) send("key", { code, down: true });
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
      b.addEventListener(type, () => send("key", { code, down: false }));
    b.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!e.repeat && running) send("key", { code, down: true });
      }
    });
    b.addEventListener("keyup", () => send("key", { code, down: false }));
    b.addEventListener("blur", () => send("key", { code, down: false }));
    controls.append(b);
  }
  context.host.append(frame);
  (context.controlsHost ?? context.host).append(controls);
  load();
  const run = (value: boolean) => {
    running = value && !ended;
    if (loaded) send("run", { running });
  };
  const keyMap = {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
    confirm: "Space",
  };
  return {
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
      running = true;
      load();
    },
    action(a) {
      if (!running) return;
      const code = keyMap[a];
      send("key", { code, down: true });
      send("key", { code, down: false });
    },
    inputState(state) {
      if (running) send("input", state);
    },
    setSoundEnabled(value) {
      sound = value;
      send("sound", { enabled: value });
    },
    setVolume(value) {
      if (!Number.isFinite(value)) return;
      volume = Math.min(1, Math.max(0, value));
      send("volume", { volume });
    },
    serialize() {
      return { restartOnly: true };
    },
    destroy() {
      dead = true;
      clearTimeout(timer);
      window.removeEventListener("message", receive);
      frame.remove();
      controls.remove();
    },
  };
};
