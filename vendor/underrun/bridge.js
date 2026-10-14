// Denny Games host adapter. The upstream game remains under upstream/ unchanged.
(() => {
  const channel = new URLSearchParams(location.search).get("channel");
  let parentOrigin = "";
  try {
    parentOrigin = new URL(document.referrer).origin;
  } catch {
    /* The frame fails closed if it was not opened by the same-site player. */
  }
  const send = (type, extra = {}) => {
    if (channel && parentOrigin)
      parent.postMessage({ channel, type, ...extra }, parentOrigin);
  };
  const receive = (event) => {
    if (
      event.source !== parent ||
      event.origin !== parentOrigin ||
      !channel ||
      event.data?.channel !== channel
    )
      return;
    const data = event.data;
    if (data.type === "run") setRunning(data.running === true);
    else if (data.type === "input") setPad(data);
    else if (data.type === "aim") aim(data.direction);
    else if (data.type === "sound")
      setSound(data.enabled === true, data.volume);
    else if (data.type === "restart") location.reload();
    else if (data.type === "destroy") {
      setRunning(false);
      try {
        audio_ctx.close();
      } catch {
        /* The document is being removed. */
      }
    }
  };
  addEventListener("message", receive);

  const canvas = document.getElementById("c");
  load_image = (name, callback) => {
    const dataUrl = globalThis.underrunAssetData?.[name];
    if (!dataUrl) {
      send("error", { code: "asset" });
      return;
    }
    const image = new Image();
    image.onload = callback;
    image.onerror = () => send("error", { code: "asset" });
    image.src = dataUrl;
    return image;
  };
  const gain = audio_ctx.createGain();
  gain.gain.value = 0;
  gain.connect(audio_ctx.destination);
  let soundEnabled = false;
  let soundVolume = 0.5;
  audio_play = (buffer, loop) => {
    if (!buffer) return;
    const source = audio_ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(gain);
    source.start();
  };
  let running = false;
  let started = false;
  let framePending = false;
  let ticks = 0;
  document.body.dataset.running = "false";
  document.body.dataset.ticks = "0";
  const upstreamGameTick = game_tick;
  game_tick = () => {
    framePending = false;
    if (!running) return;
    upstreamGameTick();
    document.body.dataset.ticks = String(++ticks);
    document.body.dataset.keys = [
      keys[key_left] ? "left" : "",
      keys[key_right] ? "right" : "",
      keys[key_up] ? "up" : "",
      keys[key_down] ? "down" : "",
      keys[key_shoot] ? "fire" : "",
    ]
      .filter(Boolean)
      .join(",");
    framePending = true;
  };
  function scheduleFrame() {
    if (running && !framePending) {
      framePending = true;
      requestAnimationFrame(game_tick);
    }
  }
  function clearInput() {
    keys[key_up] = 0;
    keys[key_down] = 0;
    keys[key_left] = 0;
    keys[key_right] = 0;
    keys[key_shoot] = 0;
    touches.clear();
  }
  function setRunning(value) {
    if (running === value) return;
    running = value;
    document.body.dataset.running = String(running);
    if (!running) {
      clearInput();
      void audio_ctx.suspend().catch(() => {});
      return;
    }
    time_last = performance.now();
    if (soundEnabled) void audio_ctx.resume().catch(() => {});
    if (started) scheduleFrame();
    else startGame();
  }
  function startGame() {
    if (started || typeof _document.onclick !== "function") return;
    started = true;
    document.body.dataset.started = "true";
    const begin = _document.onclick;
    _document.onclick = null;
    begin.call(_document);
  }
  function setSound(enabled, volume) {
    soundEnabled = enabled;
    if (Number.isFinite(volume))
      soundVolume = Math.max(0, Math.min(1, Number(volume)));
    gain.gain.value = soundEnabled ? soundVolume : 0;
    if (running && soundEnabled) void audio_ctx.resume().catch(() => {});
    else if (!soundEnabled) void audio_ctx.suspend().catch(() => {});
  }
  function setPad(data) {
    if (!running) return;
    const x = Number.isFinite(data.x) ? Number(data.x) : 0;
    const y = Number.isFinite(data.y) ? Number(data.y) : 0;
    keys[key_left] = x < -0.3 ? 1 : 0;
    keys[key_right] = x > 0.3 ? 1 : 0;
    keys[key_up] = y < -0.3 ? 1 : 0;
    keys[key_down] = y > 0.3 ? 1 : 0;
    keys[key_shoot] = data.pressed === true ? 1 : 0;
  }
  function aim(direction) {
    if (!running || !["up", "down", "left", "right"].includes(direction))
      return;
    const step = 36;
    mouse_x = Math.max(
      0,
      Math.min(
        c.width,
        mouse_x +
          (direction === "left" ? -step : direction === "right" ? step : 0),
      ),
    );
    mouse_y = Math.max(
      0,
      Math.min(
        c.height,
        mouse_y +
          (direction === "up" ? -step : direction === "down" ? step : 0),
      ),
    );
  }
  function movePointer(event) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      mouse_x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      mouse_y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    }
  }

  const touches = new Map();
  function updateTouchInputs() {
    const active = [...touches.values()];
    keys[key_left] = active.some(
      (touch) => touch.side === "left" && touch.x - touch.startX < -18,
    )
      ? 1
      : 0;
    keys[key_right] = active.some(
      (touch) => touch.side === "left" && touch.x - touch.startX > 18,
    )
      ? 1
      : 0;
    keys[key_up] = active.some(
      (touch) => touch.side === "left" && touch.y - touch.startY < -18,
    )
      ? 1
      : 0;
    keys[key_down] = active.some(
      (touch) => touch.side === "left" && touch.y - touch.startY > 18,
    )
      ? 1
      : 0;
    keys[key_shoot] = active.some((touch) => touch.side === "right") ? 1 : 0;
  }
  function releaseTouch(pointerId) {
    const touch = touches.get(pointerId);
    if (!touch) return;
    touches.delete(pointerId);
    updateTouchInputs();
  }
  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    if (!running) return;
    canvas.setPointerCapture(event.pointerId);
    const rect = canvas.getBoundingClientRect();
    const left = event.clientX < rect.left + rect.width / 2;
    touches.set(event.pointerId, {
      side: left ? "left" : "right",
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
    });
    if (!left) movePointer(event);
    updateTouchInputs();
  });
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch" || !running) return;
    const touch = touches.get(event.pointerId);
    if (!touch) return;
    event.preventDefault();
    if (touch.side === "left") {
      touch.x = event.clientX;
      touch.y = event.clientY;
      updateTouchInputs();
    } else {
      movePointer(event);
    }
  });
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    canvas.addEventListener(name, (event) => releaseTouch(event.pointerId));
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch") movePointer(event);
  });

  addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.code === "KeyP") {
      if (running) {
        event.preventDefault();
        send("pause");
      }
    } else if (event.code === "Space" && running) {
      event.preventDefault();
      keys[key_shoot] = 1;
    } else if (!started && ["Enter", "Space"].includes(event.code)) {
      startGame();
    }
  });
  addEventListener("keyup", (event) => {
    if (event.code === "Space") keys[key_shoot] = 0;
  });
  addEventListener("blur", () => {
    if (!running) return;
    setRunning(false);
    send("pause");
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    send("error", { code: "webgl-lost" });
  });

  const upstreamOutro = terminal_run_outro;
  terminal_run_outro = (callback) => {
    upstreamOutro(callback);
    running = false;
    clearInput();
    void audio_ctx.suspend().catch(() => {});
    send("end", {
      score: 0,
      won: true,
      message: "All three systems are back online.",
    });
  };

  let waitCount = 0;
  const readyTimer = setInterval(() => {
    waitCount++;
    if (!gl) {
      clearInterval(readyTimer);
      send("error", { code: "webgl" });
      return;
    }
    if (typeof _document.onclick === "function") {
      clearInterval(readyTimer);
      send("ready", { width: 320, height: 180 });
      return;
    }
    if (waitCount >= 150) {
      clearInterval(readyTimer);
      send("error", { code: "load" });
    }
  }, 100);
})();
