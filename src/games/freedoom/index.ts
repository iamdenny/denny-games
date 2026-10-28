import "./style.css";
import type { GameFactory } from "../../lib/types";

const keys = [
  "forward",
  "back",
  "left",
  "right",
  "fire",
  "use",
  "run",
] as const;
type GameKey = (typeof keys)[number];

const labels = {
  en: {
    title: "Freedoom Phase 2 game screen",
    note: "First load downloads about 12.4 MiB (13 MB). The original game menu is in English. Progress resets when you restart or reload.",
    forward: "Forward",
    back: "Back",
    left: "Turn left",
    right: "Turn right",
    fire: "Fire",
    use: "Use / open",
    run: "Run",
    symbols: {
      forward: "↑",
      back: "↓",
      left: "←",
      right: "→",
      fire: "Fire",
      use: "Use",
      run: "Run",
    },
    loadError:
      "Freedoom could not load. Check your connection and WebAssembly support, then reload.",
  },
  ko: {
    title: "프리둠 페이즈 2 게임 화면",
    note: "처음 열 때 약 12.4 MiB(약 13 MB)를 내려받아요. 원작 게임 메뉴는 영어이며, 다시 시작하거나 새로고침하면 진행이 초기화돼요.",
    forward: "앞으로",
    back: "뒤로",
    left: "왼쪽 회전",
    right: "오른쪽 회전",
    fire: "발사",
    use: "사용·문 열기",
    run: "달리기",
    symbols: {
      forward: "↑",
      back: "↓",
      left: "←",
      right: "→",
      fire: "발사",
      use: "사용",
      run: "달리기",
    },
    loadError:
      "프리둠을 불러오지 못했어요. 연결과 WebAssembly 지원을 확인한 뒤 새로고침해 주세요.",
  },
} as const;

type RuntimeAssets = {
  script: ArrayBuffer;
  wasm: ArrayBuffer;
  data: ArrayBuffer;
};

export const mount: GameFactory = (context) => {
  const controller = new AbortController();
  const channel = () => crypto.randomUUID();
  const copy = labels[context.locale];
  let frame: HTMLIFrameElement | undefined;
  let currentChannel = "";
  let active = false;
  let dead = false;
  let failed = false;
  let ready = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frameGeneration = 0;
  let assets: Promise<RuntimeAssets> | undefined;
  const held = new Map<number, GameKey>();

  function clearLoadTimer() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  const note = document.createElement("p");
  note.className = "freedoom-download-note";
  note.textContent = copy.note;
  context.controlsHost?.append(note);

  const controls = document.createElement("div");
  controls.className = "freedoom-controls";
  controls.setAttribute(
    "aria-label",
    context.locale === "ko" ? "터치 조작" : "Touch controls",
  );
  const pad = document.createElement("div");
  pad.className = "freedoom-control-group freedoom-pad";
  const actions = document.createElement("div");
  actions.className = "freedoom-control-group freedoom-actions";
  const buttonCopy: Record<GameKey, string> = {
    forward: copy.symbols.forward,
    back: copy.symbols.back,
    left: copy.symbols.left,
    right: copy.symbols.right,
    fire: copy.symbols.fire,
    use: copy.symbols.use,
    run: copy.symbols.run,
  };
  const buttons = new Map<GameKey, HTMLButtonElement>();

  function send(type: string, detail: Record<string, unknown> = {}) {
    frame?.contentWindow?.postMessage(
      { channel: currentChannel, type, ...detail },
      "*",
    );
  }

  function releaseAll() {
    for (const [pointer, key] of held) {
      send("key", { key, pressed: false });
      buttons.get(key)?.setAttribute("aria-pressed", "false");
      held.delete(pointer);
    }
  }

  function press(pointer: number, key: GameKey) {
    if (!active || !ready || dead || held.has(pointer)) return;
    held.set(pointer, key);
    buttons.get(key)?.setAttribute("aria-pressed", "true");
    send("resume");
    send("key", { key, pressed: true });
  }

  function release(pointer: number) {
    const key = held.get(pointer);
    if (!key) return;
    held.delete(pointer);
    buttons.get(key)?.setAttribute("aria-pressed", "false");
    send("key", { key, pressed: false });
  }

  for (const key of keys) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "freedoom-touch-button";
    button.textContent = buttonCopy[key];
    button.setAttribute("aria-label", copy[key]);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      press(event.pointerId, key);
    });
    button.addEventListener("pointerup", (event) => release(event.pointerId));
    button.addEventListener("pointercancel", (event) =>
      release(event.pointerId),
    );
    button.addEventListener("lostpointercapture", (event) =>
      release(event.pointerId),
    );
    button.addEventListener("click", (event) => {
      if (event.detail !== 0) return;
      const id = -Date.now();
      press(id, key);
      requestAnimationFrame(() => release(id));
    });
    buttons.set(key, button);
    (key === "forward" || key === "back" || key === "left" || key === "right"
      ? pad
      : actions
    ).append(button);
  }
  context.controlsHost?.append(controls);
  controls.append(pad, actions);

  async function loadAssets(): Promise<RuntimeAssets> {
    if (!assets) {
      const fetchFile = async (name: string) => {
        const response = await fetch(`/vendor/freedoom/${name}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("asset");
        return response.arrayBuffer();
      };
      assets = Promise.all([
        fetchFile("chocolate-doom.js"),
        fetchFile("chocolate-doom.wasm"),
        fetchFile("chocolate-doom-data-1.bin"),
        fetchFile("chocolate-doom-data-2.bin"),
        fetchFile("chocolate-doom-data-3.bin"),
      ]).then(async ([script, wasm, first, second, third]) => {
        const compressed = new Blob([first, second, third]);
        const stream = compressed
          .stream()
          .pipeThrough(new DecompressionStream("gzip"));
        const data = await new Response(stream).arrayBuffer();
        if (data.byteLength !== 28_787_748) throw new Error("data");
        return { script, wasm, data };
      });
    }
    return assets;
  }

  function fail() {
    if (dead || failed) return;
    failed = true;
    ready = false;
    active = false;
    releaseAll();
    clearLoadTimer();
    context.onError?.(copy.loadError);
  }

  function createFrame() {
    clearLoadTimer();
    const generation = ++frameGeneration;
    currentChannel = channel();
    ready = false;
    failed = false;
    const next = document.createElement("iframe");
    next.className = "crisp-frame freedoom-frame";
    next.title = copy.title;
    next.referrerPolicy = "no-referrer";
    next.sandbox.add("allow-scripts");
    next.style.aspectRatio = "16 / 10";
    next.style.setProperty("--frame-ratio", "1.6");
    next.src = `/vendor/freedoom/index.html?channel=${encodeURIComponent(currentChannel)}&parentOrigin=${encodeURIComponent(location.origin)}&locale=${context.locale}`;
    const old = frame;
    frame = next;
    old?.remove();
    context.host.append(next);
    timer = setTimeout(() => {
      if (generation === frameGeneration) fail();
    }, 90000);
  }

  async function receive(event: MessageEvent) {
    if (
      dead ||
      event.source !== frame?.contentWindow ||
      event.origin !== "null" ||
      event.data?.channel !== currentChannel
    )
      return;
    const message = event.data;
    if (message.type === "bridge-ready") {
      try {
        const loaded = await loadAssets();
        if (
          dead ||
          event.source !== frame?.contentWindow ||
          message.channel !== currentChannel
        )
          return;
        send("init", {
          script: loaded.script.slice(0),
          wasm: loaded.wasm.slice(0),
          data: loaded.data.slice(0),
        });
      } catch {
        fail();
      }
    } else if (message.type === "ready") {
      if (
        !Number.isFinite(message.width) ||
        !Number.isFinite(message.height) ||
        message.width !== 640 ||
        message.height !== 400
      )
        return fail();
      ready = true;
      clearLoadTimer();
      frame!.style.aspectRatio = `${message.width} / ${message.height}`;
      frame!.style.setProperty(
        "--frame-ratio",
        String(message.width / message.height),
      );
      context.onReady?.({ width: message.width, height: message.height });
      if (active) send("resume");
    } else if (message.type === "pause") {
      if (controls.contains(document.activeElement)) return;
      active = false;
      context.onPause?.();
    } else if (message.type === "error") {
      fail();
    }
  }

  window.addEventListener("message", receive);
  window.addEventListener("blur", releaseAll);
  createFrame();

  return {
    handlesKeyboard: true,
    start() {
      active = true;
      if (ready) send("resume");
      frame?.focus({ preventScroll: true });
    },
    resume() {
      active = true;
      if (ready) send("resume");
      frame?.focus({ preventScroll: true });
    },
    pause() {
      active = false;
      releaseAll();
      send("pause");
    },
    restart() {
      if (dead) return;
      releaseAll();
      active = true;
      createFrame();
    },
    action() {},
    serialize() {
      return undefined;
    },
    flush() {
      return Promise.resolve(!dead && !failed);
    },
    destroy() {
      dead = true;
      active = false;
      releaseAll();
      controller.abort();
      clearLoadTimer();
      window.removeEventListener("message", receive);
      window.removeEventListener("blur", releaseAll);
      frame?.remove();
      controls.remove();
      note.remove();
    },
  };
};
