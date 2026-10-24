(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const channel = params.get("channel") ?? "";
  const parentOrigin = new URL(location.href).origin;
  const keys = new Set([
    "currentGameMode",
    "polyLeft",
    "storyState",
    "muted",
    "showTutorial",
  ]);
  const limits = {
    currentGameMode: [0, 4],
    polyLeft: [0, 13312],
    storyState: [0, 4],
  };
  const storage = Object.create(null);
  const isValidChannel = /^[0-9a-f-]{36}$/i.test(channel);
  const post = (type, values = {}) => {
    if (isValidChannel) parent.postMessage({ channel, type, ...values }, "*");
  };
  const cleanValue = (key, value) => {
    if (!keys.has(key) || typeof value !== "string" || value.length > 16)
      return undefined;
    if (key === "muted" || key === "showTutorial")
      return value === "true" || value === "false" ? value : undefined;
    const range = limits[key];
    if (!range || !/^\d{1,5}$/.test(value)) return undefined;
    const number = Number(value);
    return number >= range[0] && number <= range[1]
      ? String(number)
      : undefined;
  };
  const acceptStorage = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    for (const key of keys) {
      const clean = cleanValue(key, value[key]);
      if (clean !== undefined) storage[key] = clean;
    }
  };

  try {
    const envelope = JSON.parse(window.name || "null");
    if (envelope?.version === 1) acceptStorage(envelope.storage);
  } catch {
    // A malformed preload starts with the game's documented defaults.
  }
  window.name = "";

  window.__packabunchasLoadData = (key, fallback) =>
    (keys.has(key) && storage[key]) || fallback;
  window.__packabunchasSaveData = (key, value) => {
    const clean = cleanValue(key, String(value));
    if (clean === undefined) return;
    storage[key] = clean;
    post("storage-change", { storage: { ...storage } });
  };

  let running = false;
  let nextTimerId = 1;
  const timers = new Map();
  const nativeSetTimeout = window.setTimeout.bind(window);
  const nativeClearTimeout = window.clearTimeout.bind(window);
  const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  let pendingFrame;

  function clearTimer(id) {
    const timer = timers.get(id);
    if (!timer) return;
    if (timer.nativeId !== undefined) nativeClearTimeout(timer.nativeId);
    timers.delete(id);
  }

  function armTimer(id, timer) {
    if (!running || !timers.has(id)) return;
    const delay = Math.max(0, timer.remaining ?? timer.delay);
    timer.dueAt = performance.now() + delay;
    timer.nativeId = nativeSetTimeout(() => {
      timer.nativeId = undefined;
      if (!running) {
        timer.remaining = Math.max(0, timer.dueAt - performance.now());
        return;
      }
      if (!timer.repeat) timers.delete(id);
      timer.callback(...timer.args);
      if (timer.repeat && running && timers.has(id)) {
        timer.remaining = timer.delay;
        armTimer(id, timer);
      }
    }, delay);
  }

  function scheduleTimer(callback, delay, repeat, args) {
    if (typeof callback !== "function") return 0;
    const id = nextTimerId++;
    const timer = {
      callback,
      delay: Math.max(0, Number(delay) || 0),
      args,
      repeat,
      remaining: undefined,
      nativeId: undefined,
      dueAt: 0,
    };
    timers.set(id, timer);
    armTimer(id, timer);
    return id;
  }

  window.setTimeout = (callback, delay, ...args) =>
    scheduleTimer(callback, delay, false, args);
  window.setInterval = (callback, delay, ...args) =>
    scheduleTimer(callback, delay, true, args);
  window.clearTimeout = clearTimer;
  window.clearInterval = clearTimer;

  window.requestAnimationFrame = (callback) => {
    if (!running) {
      pendingFrame = callback;
      return 0;
    }
    return nativeRequestAnimationFrame((time) => {
      if (!running) pendingFrame = callback;
      else callback(time);
    });
  };

  function setRunning(value) {
    if (running === value) return;
    running = value;
    if (!running) {
      for (const timer of timers.values()) {
        if (timer.nativeId === undefined) continue;
        nativeClearTimeout(timer.nativeId);
        timer.nativeId = undefined;
        timer.remaining = Math.max(0, timer.dueAt - performance.now());
      }
      if (typeof window.windowUnfocus === "function") window.windowUnfocus();
      return;
    }
    if (typeof window.windowFocus === "function") window.windowFocus();
    for (const [id, timer] of timers) armTimer(id, timer);
    if (pendingFrame) {
      const callback = pendingFrame;
      pendingFrame = undefined;
      window.requestAnimationFrame(callback);
    }
  }

  function receive(event) {
    if (
      event.source !== parent ||
      event.origin !== parentOrigin ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data;
    if (data.type === "run" && typeof data.running === "boolean") {
      setRunning(data.running);
    } else if (
      data.type === "checkpoint" &&
      typeof data.requestId === "string"
    ) {
      post("checkpoint-data", {
        requestId: data.requestId,
        captured: true,
        storage: { ...storage },
      });
    }
  }

  window.addEventListener("message", receive);
  window.addEventListener("load", () => post("ready"), { once: true });
})();
