(function () {
  const params = new URLSearchParams(window.location.search);
  const channel = params.get("channel") || "";
  const parentOrigin = params.get("parentOrigin") || "";
  let allowedParentOrigin = "";
  try {
    allowedParentOrigin = new URL(parentOrigin).origin;
  } catch {
    allowedParentOrigin = "";
  }

  let running = false;
  let markMode = false;
  let readySent = false;
  let nextFrameId = 0;
  const callbacks = new Map();
  const activeFrames = new Map();
  const waitingFrames = new Set();
  const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  const send = (type, payload = {}) => {
    if (!channel) return;
    window.parent.postMessage({ channel, type, ...payload }, "*");
  };

  window.__sgtBlackBoxPrefs = null;
  window.__sgtBlackBoxReady = (width, height) => {
    if (readySent) return;
    readySent = true;
    send("ready", { width, height });
  };
  window.alert = (message) => {
    send("error", { message: String(message).slice(0, 240) });
  };

  const markButton = document.getElementById("denny-mark");
  const markLabels =
    params.get("locale") === "ko"
      ? { off: "확실한 칸 표시", on: "표시 모드: 켬" }
      : { off: "Mark known squares", on: "Mark mode: on" };
  markButton.textContent = markLabels.off;
  markButton.disabled = true;
  markButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (!running) return;
    markMode = !markMode;
    markButton.setAttribute("aria-pressed", String(markMode));
    markButton.textContent = markMode ? markLabels.on : markLabels.off;
  });

  function scheduleFrame(id) {
    const callback = callbacks.get(id);
    if (!callback || !running) {
      waitingFrames.add(id);
      return;
    }
    const nativeId = nativeRequestAnimationFrame((time) => {
      activeFrames.delete(id);
      if (!running) {
        waitingFrames.add(id);
        return;
      }
      callbacks.delete(id);
      callback(time);
    });
    activeFrames.set(id, nativeId);
  }

  window.requestAnimationFrame = (callback) => {
    const id = ++nextFrameId;
    callbacks.set(id, callback);
    if (running) scheduleFrame(id);
    else waitingFrames.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    const nativeId = activeFrames.get(id);
    if (nativeId !== undefined) nativeCancelAnimationFrame(nativeId);
    activeFrames.delete(id);
    callbacks.delete(id);
    waitingFrames.delete(id);
  };

  function setRunning(value) {
    const next = value === true;
    if (next === running) return;
    running = next;
    markButton.disabled = !running;
    if (!running) {
      for (const [id, nativeId] of activeFrames) {
        nativeCancelAnimationFrame(nativeId);
        waitingFrames.add(id);
      }
      activeFrames.clear();
      if (typeof timer_reference === "number")
        timer_reference = performance.now();
      return;
    }
    if (typeof timer_reference === "number")
      timer_reference = performance.now();
    for (const id of [...waitingFrames]) {
      waitingFrames.delete(id);
      scheduleFrame(id);
    }
  }

  window.addEventListener("blur", () => {
    if (!running) return;
    setRunning(false);
    send("focus-lost");
  });

  const inputTypes = [
    "click",
    "contextmenu",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseup",
    "pointercancel",
    "pointerdown",
    "pointermove",
    "pointerup",
    "touchcancel",
    "touchend",
    "touchmove",
    "touchstart",
  ];
  for (const type of inputTypes) {
    document.addEventListener(
      type,
      (event) => {
        if (running) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
  }

  let touchPointer;
  let touchCanvas;
  let touchButton = 0;
  function dispatchMouse(type, event) {
    if (!touchCanvas) return;
    const released = type === "mouseup";
    touchCanvas.dispatchEvent(
      new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
        button: touchButton,
        buttons: released ? 0 : touchButton === 2 ? 2 : 1,
      }),
    );
  }
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "touch") return;
      const target = event.target;
      if (!(target instanceof HTMLCanvasElement) || target.id !== "puzzlecanvas")
        return;
      touchPointer = event.pointerId;
      touchCanvas = target;
      touchButton = markMode ? 2 : 0;
      target.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
      dispatchMouse("mousedown", event);
    },
    true,
  );
  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "touch" || event.pointerId !== touchPointer)
        return;
      event.preventDefault();
      event.stopPropagation();
      dispatchMouse("mousemove", event);
    },
    true,
  );
  function finishTouch(event) {
    if (event.pointerId !== touchPointer) return;
    event.preventDefault();
    event.stopPropagation();
    dispatchMouse("mouseup", event);
    touchPointer = undefined;
    touchCanvas = undefined;
  }
  document.addEventListener("pointerup", finishTouch, true);
  document.addEventListener("pointercancel", finishTouch, true);

  window.addEventListener("message", (event) => {
    if (
      event.source !== window.parent ||
      event.origin !== allowedParentOrigin ||
      event.data?.channel !== channel
    )
      return;
    if (event.data.type === "run") setRunning(event.data.running);
  });
})();
