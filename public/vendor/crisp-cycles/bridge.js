/* Denny Games MIT. Host bridge for pinned ABA Games cycles in an opaque frame. */
(() => {
  const channel = new URLSearchParams(location.search).get("channel");
  const match = location.pathname.match(
    /\/crisp-cycles\/([a-z0-9-]+)\/index\.html$/,
  );
  const slug = match?.[1];
  const config = {
    "chain-drift": {
      scripts: ["./main.js"],
      startKey: "Space",
      actionName: { en: "PUSH", ko: "밀기" },
    },
    "comet-slash": {
      scripts: ["./audio.js", "./main.js"],
      startKey: "Enter",
      actionName: { en: "SLASH", ko: "베기" },
    },
    "volt-keeper": {
      scripts: [
        "./audio/vk-dsp.js",
        "./audio/vk-kit.js",
        "./audio/vk-bus.js",
        "./main.js",
      ],
      startKey: "Space",
      actionName: { en: "GROUND", ko: "접지" },
    },
  }[slug];
  let parentOrigin = "";
  try {
    parentOrigin = new URL(document.referrer).origin;
  } catch {
    /* A frame without a same-site parent cannot complete the handshake. */
  }
  const send = (type, extra = {}) => {
    if (channel && parentOrigin)
      parent.postMessage({ channel, type, ...extra }, parentOrigin);
  };
  const inputKeys = new Set();
  const manualKeys = new Set();
  let currentScore = -1;
  let ended = false;
  let soundEnabled = false;
  let volume = 0;
  const audioOutputs = new Set();

  function keyEvent(code, pressed) {
    const key = code === "Space" ? " " : code;
    const keyCode =
      code === "Space"
        ? 32
        : code === "Enter"
          ? 13
          : code === "ArrowLeft"
            ? 37
            : code === "ArrowUp"
              ? 38
              : code === "ArrowRight"
                ? 39
                : code === "ArrowDown"
                  ? 40
                  : 0;
    document.dispatchEvent(
      new KeyboardEvent(pressed ? "keydown" : "keyup", {
        code,
        key,
        keyCode,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  function applyKeys() {
    const next = new Set([...inputKeys, ...manualKeys]);
    for (const code of [...activeKeys]) {
      if (!next.has(code)) {
        keyEvent(code, false);
        activeKeys.delete(code);
      }
    }
    for (const code of next) {
      if (!activeKeys.has(code)) {
        keyEvent(code, true);
        activeKeys.add(code);
      }
    }
    document.body.dataset.keys = [...activeKeys]
      .map(
        (code) =>
          ({
            ArrowLeft: "left",
            ArrowRight: "right",
            ArrowUp: "up",
            ArrowDown: "down",
            Space: "action",
            Enter: "confirm",
          })[code],
      )
      .filter(Boolean)
      .sort()
      .join(",");
  }
  const activeKeys = new Set();
  function releaseKeys() {
    inputKeys.clear();
    manualKeys.clear();
    applyKeys();
  }

  function setInput(data = {}) {
    inputKeys.clear();
    if (Number(data.x) < -0.3) inputKeys.add("ArrowLeft");
    if (Number(data.x) > 0.3) inputKeys.add("ArrowRight");
    if (Number(data.y) < -0.3) inputKeys.add("ArrowUp");
    if (Number(data.y) > 0.3) inputKeys.add("ArrowDown");
    if (data.pressed === true) inputKeys.add("Space");
    applyKeys();
  }

  function tapKey(code) {
    if (!allowedKeys.has(code)) return;
    manualKeys.add(code);
    applyKeys();
    setTimeout(() => {
      manualKeys.delete(code);
      applyKeys();
    }, 90);
  }
  const allowedKeys = new Set([
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Space",
    "Enter",
  ]);

  function updateAudioOutputs() {
    for (const output of audioOutputs) {
      output.gain.value = soundEnabled ? volume : 0;
    }
  }

  function installAudioVolume() {
    const NativeAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!NativeAudioContext) return;
    function DennyAudioContext(...args) {
      const context = new NativeAudioContext(...args);
      const nativeDestination = context.destination;
      const output = context.createGain();
      output.gain.value = soundEnabled ? volume : 0;
      output.connect(nativeDestination);
      Object.defineProperty(context, "destination", { value: output });
      audioOutputs.add(output);
      context.addEventListener("statechange", () => {
        if (context.state === "closed") audioOutputs.delete(output);
      });
      return context;
    }
    DennyAudioContext.prototype = NativeAudioContext.prototype;
    Object.setPrototypeOf(DennyAudioContext, NativeAudioContext);
    window.AudioContext = DennyAudioContext;
    window.webkitAudioContext = DennyAudioContext;
  }

  const bridge = (window.dennyBridge = {
    running: false,
    beforeUpdate() {},
    afterUpdate(score, ticks) {
      document.body.dataset.ticks = String(ticks);
      if (Number.isFinite(score) && score !== currentScore) {
        currentScore = score;
        send("score", { score });
      }
    },
    finish(score, won) {
      if (ended) return;
      ended = true;
      bridge.running = false;
      releaseKeys();
      send("end", { score, won });
    },
    fail(error) {
      bridge.running = false;
      releaseKeys();
      send("error", { error });
    },
  });

  addEventListener("error", (event) => bridge.fail(event.message));
  addEventListener("unhandledrejection", (event) =>
    bridge.fail(String(event.reason)),
  );
  addEventListener("message", (event) => {
    if (
      event.source !== parent ||
      event.origin !== parentOrigin ||
      !channel ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data;
    if (data.type === "run") {
      bridge.running = data.running === true && !ended;
      if (!bridge.running) releaseKeys();
    } else if (data.type === "input") {
      if (bridge.running) setInput(data);
      else releaseKeys();
    } else if (data.type === "key") {
      if (!allowedKeys.has(data.code)) return;
      if (data.pressed === true && bridge.running) manualKeys.add(data.code);
      else manualKeys.delete(data.code);
      applyKeys();
    } else if (data.type === "tap") {
      if (bridge.running) tapKey(data.code);
    } else if (data.type === "sound") {
      soundEnabled = data.enabled === true;
      if (Number.isFinite(data.volume))
        volume = Math.max(0, Math.min(1, Number(data.volume)));
      updateAudioOutputs();
      if (slug === "chain-drift" && window.CD?.setAudioMuted)
        window.CD.setAudioMuted(!soundEnabled);
    } else if (data.type === "destroy") {
      bridge.running = false;
      releaseKeys();
      for (const output of audioOutputs) {
        try {
          output.disconnect();
        } catch {
          /* The isolated frame is being removed. */
        }
      }
      audioOutputs.clear();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" || event.code === "KeyP") {
        event.preventDefault();
        event.stopImmediatePropagation();
        send("pause");
      }
    },
    true,
  );

  const memory = new Map();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, String(value)),
      removeItem: (key) => memory.delete(key),
    },
  });

  async function loadScript(source) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source;
      script.onload = resolve;
      script.onerror = () => reject(Error("Game script unavailable"));
      document.head.append(script);
    });
  }

  async function loadVoltAudioModule(source) {
    const previousModule = window.module;
    const previousRequire = window.require;
    window.module = { exports: {} };
    window.require = (name) => {
      if (name === "./vk-dsp.js") return window.VKDsp;
      if (name === "./vk-kit.js") return window.VKKit;
      throw Error(`Unsupported Volt Keeper audio dependency: ${name}`);
    };
    await loadScript(source);
    if (source.endsWith("vk-dsp.js")) window.VKDsp = window.module.exports;
    else if (source.endsWith("vk-kit.js")) window.VKKit = window.module.exports;
    else if (source.endsWith("vk-bus.js")) window.VKBus = window.module.exports;
    window.module = previousModule;
    window.require = previousRequire;
  }

  (async () => {
    if (!config || !channel || !parentOrigin) throw Error("Invalid game frame");
    installAudioVolume();
    window.module = {};
    await loadScript("/vendor/crisp/clone-deep.js");
    window.cloneDeep = window.module.exports;
    await loadScript("/vendor/crisp/runtime.js");
    for (const source of config.scripts) {
      if (slug === "volt-keeper" && source.startsWith("./audio/"))
        await loadVoltAudioModule(source);
      else await loadScript(source);
    }
    if (Array.isArray(window.characters)) {
      await loadScript("./assets.js").catch(() => {});
      window.characters = window.characters.map((value) =>
        typeof value === "string"
          ? (window.dennyCycleImages?.[value] ?? value)
          : value,
      );
    }
    const nativeOptions = window.options || {};
    window.options = {
      ...nativeOptions,
      viewSize: nativeOptions.viewSize || { x: 100, y: 100 },
      isCapturing: false,
      isRecording: false,
      isMinifying: false,
      isReplayEnabled: false,
      isSoundEnabled: false,
      isPlayingBgm: false,
    };
    window.title = "";
    window.description = "";
    window.play = () => send("sound");
    window.addEventListener("load", onLoad, { once: true });
    if (document.readyState === "complete") onLoad();
    const style = document.createElement("style");
    style.textContent =
      "html,body{width:100%;height:100%;margin:0;overflow:hidden;touch-action:none}canvas{image-rendering:pixelated;width:100%!important;height:100%!important;object-fit:contain}";
    document.head.append(style);
    send("ready", {
      width: window.options.viewSize.x,
      height: window.options.viewSize.y,
    });
  })().catch((error) => bridge.fail(String(error)));
})();
