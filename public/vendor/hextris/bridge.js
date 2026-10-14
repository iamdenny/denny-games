(() => {
  const channel = new URL(location.href).searchParams.get("channel");
  const locale =
    new URL(location.href).searchParams.get("lang") === "ko" ? "ko" : "en";
  window.dennyHextris = { locale };
  const send = (type, payload = {}) =>
    parent.postMessage({ channel, type, ...payload }, "*");
  let running = false;
  let ended = false;
  let fromHost = false;
  let storage = {};

  try {
    const saved = JSON.parse(window.name || "{}");
    if (
      saved &&
      saved.version === 1 &&
      saved.storage &&
      typeof saved.storage === "object"
    ) {
      storage = Object.fromEntries(
        Object.entries(saved.storage).filter(
          ([key, value]) =>
            ["saveState", "highscores", "visited"].includes(key) &&
            typeof value === "string" &&
            value.length <= 120_000,
        ),
      );
    }
  } catch {
    storage = {};
  }

  const notifyStorage = () => send("storage-change", { storage });
  const checkpoint = () => {
    if (window.gameState !== 1 && window.gameState !== -1) return true;
    if (typeof window.exportSaveState !== "function") return false;
    try {
      const snapshot = window.exportSaveState();
      if (typeof snapshot !== "string" || snapshot.length > 120_000)
        return false;
      window.localStorage.setItem("saveState", snapshot);
      return true;
    } catch {
      return false;
    }
  };
  const localStore = {
    get length() {
      return Object.keys(storage).length;
    },
    key(index) {
      return Object.keys(storage)[index] ?? null;
    },
    getItem(key) {
      return Object.hasOwn(storage, String(key)) ? storage[String(key)] : null;
    },
    setItem(key, value) {
      const name = String(key);
      const text = String(value);
      if (
        !["saveState", "highscores", "visited"].includes(name) ||
        text.length > 120_000
      )
        return;
      storage[name] = text;
      notifyStorage();
    },
    removeItem(key) {
      delete storage[String(key)];
      notifyStorage();
    },
    clear() {
      storage = {};
      notifyStorage();
    },
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStore,
  });

  const localizeText = () => {
    document.documentElement.lang = locale;
    const labels =
      locale === "ko"
        ? { high: "최고 기록", over: "게임 종료", scores: "최고 점수" }
        : { high: "HIGH SCORE", over: "GAME OVER", scores: "HIGH SCORES" };
    document
      .querySelectorAll("#HIGHSCORE, #highScoreInGameTextHeader")
      .forEach((node) => (node.textContent = labels.high));
    const over = document.querySelector("#gameOverBox");
    const scores = document.querySelector("#highScoresTitle");
    if (over) over.textContent = labels.over;
    if (scores) scores.textContent = labels.scores;
  };

  window.renderBeginningText = function () {
    const upper =
      trueCanvas.height / 2 -
      settings.rows * settings.blockHeight * (2 / Math.sqrt(3)) * (5 / 6);
    const lower =
      trueCanvas.height / 2 +
      settings.rows * settings.blockHeight * (2 / Math.sqrt(3)) * (11 / 16);
    const first =
      locale === "ko"
        ? "화면 양쪽이나 아래 버튼을"
        : "Tap either side or the buttons";
    const second =
      locale === "ko" ? "눌러 육각형을 돌려요" : "to rotate the hexagon";
    const score =
      locale === "ko"
        ? "같은 색 블록 3개 이상을 맞춰요"
        : "Match 3+ blocks to score";
    renderText(trueCanvas.width / 2, upper, 27, "#2c3e50", first);
    renderText(
      trueCanvas.width / 2,
      upper + 33 * settings.scale,
      27,
      "#2c3e50",
      second,
    );
    renderText(trueCanvas.width / 2, lower, 27, "#2c3e50", score);
  };

  const nativePause = window.pause;
  if (typeof nativePause === "function") {
    window.pause = (...args) => {
      const wasRunning = window.gameState === 1;
      const hostInitiated = fromHost;
      if (wasRunning) checkpoint();
      const result = nativePause(...args);
      if (wasRunning) {
        setTimeout(() => {
          if (window.gameState === -1) {
            window.localStorage.setItem(
              "saveState",
              window.exportSaveState?.() ?? "{}",
            );
            if (!hostInitiated) send("pause");
          }
        }, 450);
      }
      return result;
    };
  }

  const originalCheckGameOver = window.checkGameOver;
  if (typeof originalCheckGameOver === "function") {
    window.checkGameOver = (...args) => {
      const result = originalCheckGameOver(...args);
      if (result && !ended) {
        ended = true;
        running = false;
        send("end", { score: Number(window.score) || 0 });
      }
      return result;
    };
  }

  const start = () => {
    if (window.gameState === 0) window.startBtnHandler?.();
    else if (window.gameState === -1) window.resumeGame?.();
    running = true;
  };
  const pause = () => {
    if (window.gameState !== 1) return;
    fromHost = true;
    try {
      window.pause?.();
    } finally {
      fromHost = false;
    }
    running = false;
  };

  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.data?.channel !== channel) return;
    const data = event.data;
    if (data.type === "checkpoint" && typeof data.requestId === "string") {
      const captured = checkpoint();
      send("checkpoint-data", { requestId: data.requestId, captured, storage });
    } else if (data.type === "run") {
      if (data.running === true) start();
      else pause();
    } else if (data.type === "action" && running && window.MainHex) {
      if (data.action === "left") window.MainHex.rotate(1);
      if (data.action === "right") window.MainHex.rotate(-1);
      checkpoint();
    } else if (data.type === "restart") {
      ended = false;
      window.init?.(1);
    }
  });

  window.addEventListener("pagehide", checkpoint, { once: true });
  window.addEventListener("visibilitychange", () => {
    if (document.hidden) checkpoint();
  });
  window.setInterval(() => {
    if (window.gameState === 1) checkpoint();
  }, 500);

  const announceReady = () => {
    if (!document.getElementById("canvas") || !window.startBtnHandler)
      return false;
    localizeText();
    send("ready", { width: 1, height: 1 });
    return true;
  };
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const deadline = performance.now() + 5000;
      const poll = () => {
        if (announceReady()) return;
        if (performance.now() < deadline) setTimeout(poll, 25);
        else send("error");
      };
      poll();
    },
    { once: true },
  );
})();
