(function () {
  "use strict";

  var allowed = { gameOptions: true, slot0: true, slot1: true, slot2: true };
  function isAllowed(key) {
    return Object.prototype.hasOwnProperty.call(allowed, key);
  }
  var maxValue = 200000;
  var maxTotal = 320000;
  var channel = new URLSearchParams(location.search).get("channel");
  var parentOrigin = "";
  var initial = {};
  var initialTotal = 0;
  try {
    var parsed = JSON.parse(window.name);
    if (parsed && parsed.version === 1 && parsed.storage) {
      parentOrigin =
        typeof parsed.parentOrigin === "string" ? parsed.parentOrigin : "";
      Object.keys(allowed).forEach(function (key) {
        var value = parsed.storage[key];
        if (
          typeof value === "string" &&
          value.length <= maxValue &&
          initialTotal + value.length <= maxTotal
        ) {
          initial[key] = value;
          initialTotal += value.length;
        }
      });
    }
  } catch (_) {}
  window.name = "";

  var values = initial;
  var snapshotTimer = 0;
  var requestedPause = false;
  var requestedResume = false;
  var eventManager = null;
  var engine = null;
  var gameState = null;
  var reportedReady = false;

  function snapshot() {
    var clean = {};
    var total = 0;
    Object.keys(allowed).forEach(function (key) {
      var value = values[key];
      if (typeof value === "string" && value.length <= maxValue) {
        total += value.length;
        if (total <= maxTotal) clean[key] = value;
      }
    });
    return clean;
  }

  function sizeExcept(key) {
    return Object.keys(allowed).reduce(function (total, name) {
      var value = values[name];
      return name !== key && typeof value === "string"
        ? total + value.length
        : total;
    }, 0);
  }

  function post(type, payload) {
    if (!channel || !window.parent || window.parent === window) return;
    window.parent.postMessage(
      Object.assign({ channel: channel, type: type }, payload || {}),
      parentOrigin,
    );
  }

  function scheduleSnapshot() {
    window.clearTimeout(snapshotTimer);
    snapshotTimer = window.setTimeout(function () {
      post("storage-change", { storage: snapshot() });
    }, 100);
  }

  var storage = {
    get length() {
      return Object.keys(values).length;
    },
    key: function (index) {
      return Object.keys(values)[index] || null;
    },
    getItem: function (key) {
      key = String(key);
      return isAllowed(key) && Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : null;
    },
    setItem: function (key, value) {
      key = String(key);
      if (!isAllowed(key)) return;
      value = String(value);
      if (value.length > maxValue)
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      if (sizeExcept(key) + value.length > maxTotal)
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      values[key] = value;
      scheduleSnapshot();
    },
    removeItem: function (key) {
      key = String(key);
      if (isAllowed(key) && Object.prototype.hasOwnProperty.call(values, key)) {
        delete values[key];
        scheduleSnapshot();
      }
    },
    clear: function () {
      values = {};
      scheduleSnapshot();
    },
  };

  var localStorage = new Proxy(storage, {
    get: function (target, key) {
      if (typeof key === "string" && isAllowed(key)) {
        return Object.prototype.hasOwnProperty.call(values, key)
          ? values[key]
          : undefined;
      }
      return target[key];
    },
    set: function (target, key, value) {
      if (typeof key === "string" && isAllowed(key)) {
        target.setItem(key, value);
        return true;
      }
      return false;
    },
    deleteProperty: function (target, key) {
      if (typeof key === "string" && isAllowed(key)) {
        target.removeItem(key);
        return true;
      }
      return false;
    },
  });
  try {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorage,
    });
  } catch (_) {}

  function announceReady() {
    if (reportedReady || document.querySelectorAll(".saveSlot").length !== 3)
      return;
    reportedReady = true;
    post("ready");
    if (window.require) {
      window.require(
        ["app/eventmanager", "app/engine", "app/gamestate"],
        function (events, gameEngine, state) {
          eventManager = events;
          engine = gameEngine;
          gameState = state;
          eventManager.bind("pause", function () {
            if (requestedPause) requestedPause = false;
            else post("pause");
          });
          eventManager.bind("unpause", function () {
            if (requestedResume) requestedResume = false;
          });
          eventManager.bind("gameLoaded", function () {
            post("started");
          });
        },
      );
    }
  }

  window.addEventListener("message", function (event) {
    if (
      event.source !== window.parent ||
      event.origin !== parentOrigin ||
      !event.data ||
      event.data.channel !== channel
    )
      return;
    if (
      event.data.type === "pause" &&
      eventManager &&
      engine &&
      engine.isStarted()
    ) {
      requestedPause = true;
      eventManager.trigger("pause");
    } else if (
      event.data.type === "resume" &&
      eventManager &&
      engine &&
      engine.isStarted()
    ) {
      requestedResume = true;
      eventManager.trigger("unpause");
    } else if (event.data.type === "checkpoint") {
      var captured = false;
      try {
        if (gameState && engine && engine.isStarted()) gameState.save();
        captured = true;
      } catch (_) {}
      post("checkpoint-data", {
        requestId: event.data.requestId,
        captured: captured,
        storage: snapshot(),
      });
    }
  });

  var observer = new MutationObserver(announceReady);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  window.addEventListener("load", announceReady, { once: true });
})();
