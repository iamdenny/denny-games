(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var channel = params.get("channel") || "";
  var suppliedOrigin = params.get("parentOrigin") || "";
  var parentOrigin = "";
  try {
    var parsedOrigin = new URL(suppliedOrigin);
    if (
      parsedOrigin.origin === suppliedOrigin &&
      (parsedOrigin.protocol === "https:" || parsedOrigin.protocol === "http:")
    )
      parentOrigin = parsedOrigin.origin;
  } catch (error) {
    parentOrigin = "";
  }

  var running = false;
  var callbacks = new Map();
  var scheduled = new Map();
  var nextFrameId = 0;
  var nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  var nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  function post(type, payload) {
    if (!channel || !parentOrigin || window.parent === window) return;
    window.parent.postMessage(
      Object.assign({ channel: channel, type: type }, payload || {}),
      parentOrigin,
    );
  }

  function schedule(id) {
    if (!running || !callbacks.has(id) || scheduled.has(id)) return;
    var nativeId = nativeRequestAnimationFrame(function (timestamp) {
      scheduled.delete(id);
      var callback = callbacks.get(id);
      if (!running || !callback) return;
      callbacks.delete(id);
      callback(timestamp);
    });
    scheduled.set(id, nativeId);
  }

  window.requestAnimationFrame = function (callback) {
    var id = ++nextFrameId;
    callbacks.set(id, callback);
    schedule(id);
    return id;
  };

  window.cancelAnimationFrame = function (id) {
    callbacks.delete(id);
    if (scheduled.has(id)) {
      nativeCancelAnimationFrame(scheduled.get(id));
      scheduled.delete(id);
    }
  };

  function setRunning(value) {
    var next = value === true;
    if (running === next) return;
    running = next;
    if (!running) {
      window.dispatchEvent(new Event("denny-pause"));
      scheduled.forEach(function (nativeId) {
        nativeCancelAnimationFrame(nativeId);
      });
      scheduled.clear();
      return;
    }
    Array.from(callbacks.keys()).forEach(schedule);
  }

  function dispatchAction(action) {
    if (!running || typeof action !== "string") return;
    if (
      window.DennyGameBridge.actionHandler &&
      window.DennyGameBridge.actionHandler(action)
    )
      return;
    var keys = {
      up: ["ArrowUp", "ArrowUp"],
      down: ["ArrowDown", "ArrowDown"],
      left: ["ArrowLeft", "ArrowLeft"],
      right: ["ArrowRight", "ArrowRight"],
      confirm: [" ", "Space"],
    };
    var key = keys[action];
    if (!key) return;
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: key[0],
        code: key[1],
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  window.DennyGameBridge = {
    actionHandler: null,
    ready: function (width, height) {
      post("ready", { width: width, height: height });
    },
    get running() {
      return running;
    },
  };

  window.addEventListener("message", function (event) {
    if (
      event.source !== window.parent ||
      event.origin !== parentOrigin ||
      !event.data ||
      event.data.channel !== channel
    )
      return;

    if (event.data.type === "run") {
      setRunning(event.data.running === true);
    } else if (event.data.type === "action") {
      dispatchAction(event.data.action);
    } else if (event.data.type === "sound") {
      var audio = window.Chogan && window.Chogan.audio;
      if (!audio) return;
      audio.setSfx(event.data.enabled === true);
      audio.setVolume(event.data.volume);
    }
  });

  window.addEventListener("blur", function () {
    if (running) post("focus-lost");
  });
})();
