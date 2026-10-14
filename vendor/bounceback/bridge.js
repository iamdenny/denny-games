// Denny Games MIT host bridge. The game runs in an opaque-origin sandbox.
(() => {
  const params = new URLSearchParams(location.search);
  const channel = params.get("channel");
  const parentOrigin = document.referrer
    ? new URL(document.referrer).origin
    : location.origin;
  const allowedStorageKeys = new Set([
    "kbap_coins",
    "kbap_warp",
    "kbap_bestTime",
    "kbap_won",
  ]);
  let savedStorage = {};
  let finishStorage;
  const storageReady = new Promise((resolve) => {
    finishStorage = resolve;
  });
  const send = (type, payload = {}) =>
    parent.postMessage({ channel, type, ...payload }, parentOrigin);
  function cleanStorage(value) {
    const result = {};
    if (!value || typeof value !== "object") return result;
    for (const [key, candidate] of Object.entries(value)) {
      if (
        allowedStorageKeys.has(key) &&
        typeof candidate === "string" &&
        candidate.length <= 16 &&
        /^\d+$/.test(candidate) &&
        Number(candidate) <= 1000000000
      )
        result[key] = candidate;
    }
    return result;
  }
  function updateStorage(key, value) {
    if (!allowedStorageKeys.has(key)) return;
    const text = String(value);
    if (text.length > 16 || !/^\d+$/.test(text) || Number(text) > 1000000000)
      return;
    savedStorage[key] = text;
    send("storage-change", { storage: savedStorage });
  }
  const localStore = new Proxy(
    {
      getItem(key) {
        return savedStorage[key] ?? null;
      },
      setItem(key, value) {
        updateStorage(String(key), value);
      },
      removeItem(key) {
        if (!allowedStorageKeys.has(String(key))) return;
        delete savedStorage[key];
        send("storage-change", { storage: savedStorage });
      },
      clear() {
        savedStorage = {};
        send("storage-change", { storage: savedStorage });
      },
      key(index) {
        return Object.keys(savedStorage)[index] ?? null;
      },
      get length() {
        return Object.keys(savedStorage).length;
      },
    },
    {
      get(target, property, receiver) {
        if (typeof property === "string" && allowedStorageKeys.has(property))
          return savedStorage[property] ?? null;
        return Reflect.get(target, property, receiver);
      },
      set(_target, property, value) {
        if (typeof property === "string") updateStorage(property, value);
        return true;
      },
    },
  );
  Object.defineProperty(window, "localStorage", { value: localStore });

  let frameScheduled = false;
  let lastTick = 0;
  let ready = false;
  let padKeys = new Set();
  let touchKeys = new Set();
  let activeVirtualKeys = new Set();
  let padPressed = false;
  let mousePressed = false;
  let syntheticMouse = false;
  let padCursor;
  const touches = new Map();
  const keyCodes = { left: 65, right: 68, up: 87, down: 83 };
  const keyNames = { 65: "a", 68: "d", 87: "w", 83: "s" };
  function dispatchKey(type, code) {
    const name = keyNames[code];
    window.dispatchEvent(
      new KeyboardEvent(type, {
        key: name,
        code: "Key" + name.toUpperCase(),
        keyCode: code,
        which: code,
        bubbles: true,
        cancelable: true,
      }),
    );
  }
  function updateKeys() {
    const wanted = new Set([...padKeys, ...touchKeys]);
    for (const code of activeVirtualKeys)
      if (!wanted.has(code)) dispatchKey("keyup", code);
    for (const code of wanted)
      if (!activeVirtualKeys.has(code)) dispatchKey("keydown", code);
    activeVirtualKeys = wanted;
    document.body.dataset.virtualKeys = [...wanted]
      .map((code) => keyNames[code])
      .sort()
      .join(",");
  }
  function moveMouse(clientX, clientY) {
    syntheticMouse = true;
    window.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX,
        clientY,
        bubbles: true,
      }),
    );
    queueMicrotask(() => {
      syntheticMouse = false;
    });
  }
  function setMousePressed(value) {
    if (mousePressed === value) return;
    mousePressed = value;
    document.body.dataset.mousePressed = String(value);
    syntheticMouse = true;
    window.dispatchEvent(
      new MouseEvent(value ? "mousedown" : "mouseup", {
        button: 0,
        buttons: value ? 1 : 0,
        bubbles: true,
      }),
    );
    queueMicrotask(() => {
      syntheticMouse = false;
    });
  }
  function setPadInput(state) {
    const x = Math.max(-1, Math.min(1, Number(state.x) || 0));
    const y = Math.max(-1, Math.min(1, Number(state.y) || 0));
    padKeys = new Set();
    if (x < -0.3) padKeys.add(keyCodes.left);
    if (x > 0.3) padKeys.add(keyCodes.right);
    if (y < -0.3) padKeys.add(keyCodes.up);
    if (y > 0.3) padKeys.add(keyCodes.down);
    updateKeys();
    const canvas = document.getElementById("c1");
    if (canvas && ready) {
      const bounds = canvas.getBoundingClientRect();
      const next = {
        x: bounds.left + bounds.width * (0.5 + x * 0.42),
        y: bounds.top + bounds.height * (0.5 + y * 0.42),
      };
      if (
        !padCursor ||
        Math.abs(next.x - padCursor.x) > 1 ||
        Math.abs(next.y - padCursor.y) > 1
      ) {
        moveMouse(next.x, next.y);
        padCursor = next;
      }
    }
    padPressed = state.pressed === true;
    setMousePressed(
      padPressed || [...touches.values()].some((v) => v.kind === "aim"),
    );
  }
  function updateTouchInput() {
    const movement = [...touches.values()].find(
      (touch) => touch.kind === "move",
    );
    touchKeys = new Set();
    if (movement) {
      const dx = movement.x - movement.startX;
      const dy = movement.y - movement.startY;
      const threshold = Math.max(18, Math.min(innerWidth, innerHeight) * 0.08);
      if (dx < -threshold) touchKeys.add(keyCodes.left);
      if (dx > threshold) touchKeys.add(keyCodes.right);
      if (dy < -threshold) touchKeys.add(keyCodes.up);
      if (dy > threshold) touchKeys.add(keyCodes.down);
    }
    updateKeys();
    const aim = [...touches.values()].find((touch) => touch.kind === "aim");
    if (aim) {
      moveMouse(aim.x, aim.y);
      setMousePressed(true);
    } else setMousePressed(padPressed);
  }
  function startTouch(event) {
    if (!window.dennyBridge.running) return;
    event.preventDefault();
    for (const touch of event.changedTouches) {
      const wanted = touch.clientX < innerWidth / 2 ? "move" : "aim";
      const occupied = [...touches.values()].some(
        (item) => item.kind === wanted,
      );
      const kind = occupied ? (wanted === "move" ? "aim" : "move") : wanted;
      touches.set(touch.identifier, {
        kind,
        startX: touch.clientX,
        startY: touch.clientY,
        x: touch.clientX,
        y: touch.clientY,
      });
    }
    updateTouchInput();
  }
  function moveTouch(event) {
    if (!window.dennyBridge.running) return;
    event.preventDefault();
    for (const touch of event.changedTouches) {
      const active = touches.get(touch.identifier);
      if (active) {
        active.x = touch.clientX;
        active.y = touch.clientY;
      }
    }
    updateTouchInput();
  }
  function endTouch(event) {
    event.preventDefault();
    for (const touch of event.changedTouches) touches.delete(touch.identifier);
    updateTouchInput();
  }
  function schedule() {
    if (!window.dennyBridge.running || frameScheduled) return;
    frameScheduled = true;
    requestAnimationFrame(() => {
      frameScheduled = false;
      if (window.dennyBridge.running) window.EngineUpdate();
    });
  }
  const bridge = (window.dennyBridge = {
    running: false,
    soundEnabled: false,
    volume: 0.5,
    storageReady,
    schedule,
    ready(width, height) {
      ready = true;
      send("ready", { width, height });
    },
    frameTick() {
      document.body.dataset.ticks = String(++lastTick);
    },
  });
  function applySound(enabled, volume) {
    bridge.soundEnabled = enabled === true;
    bridge.volume = Math.max(0, Math.min(1, Number(volume) || 0));
    window.dispatchEvent(
      new CustomEvent("denny-bounceback-audio", {
        detail: { enabled: bridge.soundEnabled, volume: bridge.volume },
      }),
    );
  }
  window.addEventListener("message", (event) => {
    if (
      event.source !== parent ||
      event.origin !== parentOrigin ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data;
    if (data.type === "storage-init") {
      savedStorage = cleanStorage(data.storage);
      finishStorage();
    }
    if (data.type === "run") {
      bridge.running = data.running === true;
      if (bridge.running) schedule();
      else {
        padKeys = new Set();
        touchKeys = new Set();
        touches.clear();
        padPressed = false;
        updateKeys();
        setMousePressed(false);
      }
    }
    if (data.type === "input") setPadInput(data);
    if (data.type === "sound") applySound(data.enabled, data.volume);
    if (data.type === "restart") location.reload();
  });
  document.addEventListener(
    "mousemove",
    () => {
      if (!syntheticMouse) {
        padKeys = new Set();
        padPressed = false;
        updateKeys();
      }
    },
    true,
  );
  document.addEventListener("touchstart", startTouch, { passive: false });
  document.addEventListener("touchmove", moveTouch, { passive: false });
  document.addEventListener("touchend", endTouch, { passive: false });
  document.addEventListener("touchcancel", endTouch, { passive: false });
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
  window.addEventListener("blur", () => {
    if (bridge.running) send("pause");
  });
  window.addEventListener("error", (event) =>
    send("error", { message: event.message }),
  );
  window.addEventListener("unhandledrejection", () => send("error"));
  if (!/^[0-9a-f-]{36}$/i.test(channel || "")) throw Error("Invalid channel");
  send("storage-request");
})();
