import "../styles/player.css";
import { t } from "../data/i18n";
import { read, write, addRecent } from "../lib/storage";
import { dailySeed, validSeed } from "../lib/random";
import { connectGamepad, focusNext } from "../lib/input";
import { canServe, eligibleBreak, requestBreak, initH5Ads } from "../lib/ads";
import { ads } from "../data/ads";
import { track } from "../lib/events";
import type {
  GameFactory,
  GameInstance,
  GameResult,
  Locale,
  Action,
} from "../lib/types";
const root = document.querySelector<HTMLElement>("#player")!;
const id = root.dataset.id!,
  locale = root.dataset.locale as Locale,
  text = t(locale);
const query = new URL(location.href).searchParams;
const seed =
  validSeed(query.get("seed")) ??
  (query.get("daily") === "1" ? dailySeed(id) : `${id}:v1:normal`);
const count = Number(root.dataset.stages),
  requested = Number(query.get("stage") ?? read(`stage:${id}`, 1));
let stage = Number.isInteger(requested)
  ? Math.max(1, Math.min(count, requested))
  : 1;
const el = <T extends HTMLElement>(name: string) =>
  root.querySelector<T>(`#${name}`)!;
const host = el<HTMLDivElement>("game-host"),
  overlay = el<HTMLDivElement>("game-overlay"),
  start = el<HTMLButtonElement>("start-button");
const pauseButton = el<HTMLButtonElement>("pause-button"),
  restart = el<HTMLButtonElement>("restart-button"),
  select = el<HTMLSelectElement>("stage-select");
const share = el<HTMLButtonElement>("share-button"),
  fallback = el<HTMLTextAreaElement>("share-fallback");
let game: GameInstance | undefined,
  factory: GameFactory | undefined,
  state: "loading" | "ready" | "running" | "paused" | "ended" | "ad" =
    "loading",
  score = 0,
  rounds = 0,
  lastAd = performance.now(),
  generation = 0;
let audio: AudioContext | undefined,
  sound = false,
  result: GameResult | undefined;
document.body.dataset.game = id;
select.value = String(stage);
const savedKey = () =>
  `progress:${id}:v${root.dataset.version}:${seed}:${stage}`;
function save() {
  if (!game) return;
  const ok = write(savedKey(), game.serialize());
  write(`stage:${id}`, stage);
  if (!ok) el("game-message").textContent = text.storageError;
}
function best() {
  const value = read<unknown>(`best:${id}:${seed}:${stage}`, 0);
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function show(title: string, note = "") {
  overlay.hidden = false;
  host.inert = true;
  el("overlay-title").textContent = title;
  el("overlay-note").textContent = note;
}
function focusGame() {
  (
    host.querySelector<HTMLElement>('[tabindex="0"],button:not([disabled])') ??
    host
  ).focus();
}
function pause(note = "") {
  if (state !== "running") return;
  state = "paused";
  track("pause", id);
  game?.pause();
  save();
  show(text.paused, note);
  start.textContent = text.resume;
  pauseButton.textContent = `▶ ${text.resume}`;
  start.focus();
}
function soundTick() {
  if (!sound || !audio || audio.state !== "running") return;
  const osc = audio.createOscillator(),
    gain = audio.createGain();
  osc.frequency.value = 350 + Math.min(score, 1000) / 4;
  gain.gain.setValueAtTime(0.025, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.07);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + 0.08);
}
function end(value: GameResult) {
  state = "ended";
  track("end", id);
  result = value;
  rounds++;
  score = value.score;
  el("score").textContent = String(score);
  const record = Math.max(best(), score);
  write(`best:${id}:${seed}:${stage}`, record);
  el("best").textContent = String(record);
  show(value.won ? text.won : text.lost, `${text.score}: ${score}`);
  start.textContent = text.restart;
  share.hidden = false;
  pauseButton.disabled = true;
  save();
  start.focus();
}
function mount(saved: boolean) {
  game?.destroy();
  host.replaceChildren();
  state = "ready";
  result = undefined;
  share.hidden = true;
  fallback.hidden = true;
  el("share-note").textContent = "";
  game = factory!({
    host,
    locale,
    seed,
    stage,
    saved: saved ? read(savedKey(), undefined) : undefined,
    onChange: (value) => {
      score = value;
      el("score").textContent = String(value);
    },
    onEnd: end,
    sound: soundTick,
    onReady: () => {
      if (state === "ready") {
        show(text.ready, root.dataset.instructions);
        start.disabled = false;
      }
    },
    onPause: () => pause(),
    onError: (message) => {
      state = "paused";
      game?.pause();
      show(message);
      start.disabled = true;
    },
  });
  el("best").textContent = String(best());
  show(
    id.startsWith("crisp-") ? text.loading : text.ready,
    root.dataset.instructions,
  );
  start.textContent = text.start;
  start.disabled = id.startsWith("crisp-");
  restart.disabled = false;
  pauseButton.disabled = true;
  const url = new URL(location.href);
  url.searchParams.set("stage", String(stage));
  history.replaceState(null, "", url);
  document
    .querySelectorAll<HTMLAnchorElement>("[data-locale-link]")
    .forEach((link) => {
      link.search = url.search;
    });
}
async function restartRound() {
  if (!game || state === "ad") return;
  pause();
  save();
  const consent =
    window.dennyCmp?.certified === true && window.dennyCmp.canRequestAds();
  const vehicle =
    /Tesla/i.test(navigator.userAgent) ||
    read<boolean>("large-screen", false) === true;
  if (
    ads.h5Approved &&
    canServe(Boolean(consent)) &&
    eligibleBreak(rounds, performance.now(), lastAd, vehicle)
  ) {
    state = "ad";
    start.disabled = true;
    restart.disabled = true;
    select.disabled = true;
    show(
      locale === "ko"
        ? "다음 라운드를 준비합니다."
        : "Preparing the next round.",
    );
    await requestBreak(
      window.adBreak,
      () => {
        game?.pause();
        void audio?.suspend();
      },
      () => {},
    );
    lastAd = performance.now();
    rounds = 0;
    select.disabled = false; // Never resume gameplay in an SDK callback.
  }
  track("restart", id);
  mount(false);
  save();
  start.focus();
}
start.addEventListener("click", async () => {
  if (!game || state === "ad" || state === "loading") return;
  if (state === "ended") {
    await restartRound();
    return;
  }
  if (sound) {
    try {
      await audio?.resume();
    } catch {
      /* silent play */
    }
  }
  const wasPaused = state === "paused";
  state = "running";
  overlay.hidden = true;
  host.inert = false;
  pauseButton.disabled = false;
  pauseButton.textContent = `Ⅱ ${text.pause}`;
  track(wasPaused ? "resume" : "start", id);
  if (wasPaused) game.resume();
  else game.start();
  addRecent(id);
  if (state === "running") focusGame();
  save();
});
// Focusing a parent control blurs the imported frame and may pause before
// click is dispatched. Preserve the pointer's intent rather than toggling twice.
let pointerPauseIntent: "pause" | "resume" | undefined;
pauseButton.addEventListener("pointerdown", () => {
  pointerPauseIntent = state === "paused" ? "resume" : "pause";
});
pauseButton.addEventListener("pointercancel", () => {
  pointerPauseIntent = undefined;
});
pauseButton.addEventListener("click", (event) => {
  const intent = event.detail > 0 ? pointerPauseIntent : undefined;
  pointerPauseIntent = undefined;
  if (intent === "resume" || (!intent && state === "paused")) start.click();
  else pause();
});
restart.addEventListener("click", () => {
  void restartRound();
});
select.addEventListener("change", () => {
  if (!factory || state === "ad") return;
  save();
  stage = Number(select.value);
  mount(true);
  write(`stage:${id}`, stage);
});
el<HTMLButtonElement>("sound-button").addEventListener("click", async () => {
  const button = el<HTMLButtonElement>("sound-button");
  sound = !sound;
  if (sound) {
    try {
      audio ??= new AudioContext();
      await audio.resume();
      soundTick();
    } catch {
      sound = false;
      el("game-message").textContent =
        locale === "ko"
          ? "소리를 사용할 수 없습니다."
          : "Sound is unavailable.";
    }
  } else {
    void audio?.suspend();
  }
  button.setAttribute("aria-pressed", String(sound));
  button.textContent = `♪ ${text.sound}: ${sound ? text.on : text.off}`;
});
const low = el<HTMLInputElement>("low-effects");
low.checked = read<boolean>("low-effects", false) === true;
root.classList.toggle("low-effects", low.checked);
low.addEventListener("change", () => {
  root.classList.toggle("low-effects", low.checked);
  write("low-effects", low.checked);
});
el("fullscreen-button").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (root.requestFullscreen) await root.requestFullscreen();
    else root.classList.toggle("expanded");
  } catch {
    root.classList.toggle("expanded");
  }
});
share.addEventListener("click", async () => {
  if (!result) return;
  const url = new URL(location.href);
  url.searchParams.set("seed", seed);
  url.searchParams.set("stage", String(stage));
  url.searchParams.delete("daily");
  const hint =
    (game?.serialize() as { hint?: boolean } | undefined)?.hint === true;
  const value = `Denny Games · ${id} · ${text.stage} ${stage} · ${text.score} ${result.score}${hint ? " · " + text.hintUsed : ""}\n${url.href}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Denny Games", text: value });
      return;
    }
    if (!navigator.clipboard?.writeText) throw Error("clipboard");
    await navigator.clipboard.writeText(value);
    el("share-note").textContent = text.copied;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    fallback.hidden = false;
    fallback.value = value;
    fallback.focus();
    fallback.select();
    el("share-note").textContent = text.copyResult;
  }
});
const action = (value: Action) => {
  if (state === "running") game?.action(value);
  else if (state !== "ad") focusNext(value);
};
const disconnect = connectGamepad(
  action,
  () => {
    if (state === "running") pause();
    else if (state === "paused") start.click();
  },
  () =>
    pause(locale === "ko" ? "패드가 분리됐어요." : "Controller disconnected."),
  (value) => {
    if (state === "running") game?.inputState?.(value);
  },
);
const keyboard = (event: KeyboardEvent) => {
  if ((event.target as HTMLElement).closest("input,select,textarea")) return;
  if (event.key === "Escape" || event.code === "KeyP") {
    if (state === "running") {
      event.preventDefault();
      pause();
    }
    return;
  }
  const keys: Record<string, Action> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    Enter: "confirm",
    " ": "confirm",
  };
  const value = keys[event.key];
  if (state !== "running" || !value) return;
  if (value === "confirm" && (event.target as HTMLElement).closest("button,a"))
    return;
  event.preventDefault();
  game?.action(value);
  save();
};
window.addEventListener("keydown", keyboard);
window.addEventListener("blur", () => {
  if (document.activeElement?.matches("iframe.crisp-frame")) return;
  pause();
  void audio?.suspend();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pause();
    void audio?.suspend();
  }
});
document.querySelectorAll("[data-locale-link]").forEach((link) =>
  link.addEventListener("click", () => {
    pause();
    save();
  }),
);
void initH5Ads();
window.addEventListener("denny-consent-changed", () => {
  void initH5Ads();
});
const autosave = setInterval(save, 1000);
window.addEventListener(
  "pagehide",
  () => {
    save();
    generation++;
    disconnect();
    clearInterval(autosave);
    window.removeEventListener("keydown", keyboard);
    game?.destroy();
    void audio?.close();
  },
  { once: true },
);
const token = ++generation;
show(text.loading);
start.disabled = true;
try {
  const loaders: Record<string, () => Promise<{ mount: GameFactory }>> = {
    "circuit-loop": () => import("../games/circuit"),
    "orbit-break": () => import("../games/orbit"),
    "2048": () => import("../games/merge"),
  };
  const module = await (id.startsWith("crisp-")
    ? import("../games/crisp")
    : loaders[id]!());
  if (token === generation) {
    factory = module.mount;
    track("load", id);
    mount(true);
  }
} catch {
  track("load_error", id);
  show(text.loadError);
  start.hidden = true;
  restart.disabled = true;
}
