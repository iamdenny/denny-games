import "../styles/player.css";
import { createMotion, gsap } from "../lib/motion";
import { GameAudio, type SoundCue } from "../lib/audio";
import { t } from "../data/i18n";
import { read, write, addRecent } from "../lib/storage";
import { dailyPlayHref, dailyRounds, recordDailyRound } from "../lib/daily";
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
  requested = Number(
    query.get("stage") ??
      (query.get("daily") === "1" ? 1 : read(`stage:${id}`, 1)),
  );
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
const nextStageButton = el<HTMLButtonElement>("next-stage");
const stageProgress = el<HTMLElement>("stage-progress");
const nextLink = el<HTMLAnchorElement>("next-game");
const defaultNext = {
  href: nextLink.getAttribute("href")!,
  text: nextLink.textContent,
};
const dailyGames = JSON.parse(root.dataset.dailyGames!) as {
  id: string;
  version: number;
  title: string;
}[];
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
const audio = new GameAudio();
let sound = read<boolean>("sound-enabled", false) === true,
  result: GameResult | undefined;
document.body.dataset.game = id;
select.value = String(stage);
function updateStageProgress() {
  stageProgress.hidden = count < 2;
  stageProgress.textContent = `${text.stage} ${stage} / ${count}`;
}
updateStageProgress();
const formatScore = (value: number) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
const savedKey = () =>
  `progress:${id}:v${root.dataset.version}:${seed}:${stage}`;
let stageRatio = Number(root.dataset.stageRatio) || 1;
function fitStage() {
  if (root.dataset.immersive !== "true") return;
  // Measure the real bottom toolbar, including game-specific actions, before
  // choosing the placement that leaves the larger aspect-correct surface.
  root.dataset.controlsLayout = "bottom";
  if (root.clientWidth < 600) return;
  const style = getComputedStyle(host);
  const width =
    host.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  const height =
    host.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom);
  const tools = root.querySelector<HTMLElement>(".player-tools")!;
  const gap = parseFloat(getComputedStyle(root).gap);
  const bottomScale = Math.min(width / stageRatio, height);
  const sideScale = Math.min(
    (width - 176 - gap) / stageRatio,
    height + tools.offsetHeight + gap,
  );
  if (sideScale > bottomScale + 1) root.dataset.controlsLayout = "side";
}
const overlayMotion = createMotion(root);
const scoreMotion = createMotion(root);
let stopVictory: (() => void) | undefined;
let victoryToken = 0;
function clearVictory() {
  victoryToken++;
  stopVictory?.();
  stopVictory = undefined;
}
function celebrate() {
  if (!overlayMotion.enabled()) return;
  const token = ++victoryToken;
  void import("../lib/motion/victory")
    .then(({ victory }) => {
      if (
        token === victoryToken &&
        state === "ended" &&
        overlayMotion.enabled()
      )
        stopVictory = victory(root);
    })
    .catch(() => {
      /* Optional graphics never block a result or replay. */
    });
}
const stageObserver = new ResizeObserver(fitStage);
stageObserver.observe(root);
stageObserver.observe(root.querySelector(".player-top")!);
function save(): boolean {
  if (!game) return false;
  const ok = write(savedKey(), game.serialize());
  const stageSaved = write(`stage:${id}`, stage);
  if (!ok || !stageSaved) el("game-message").textContent = text.storageError;
  return ok && stageSaved;
}
function best() {
  const value = read<unknown>(`best:${id}:${seed}:${stage}`, 0);
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function show(title: string, note = "", showSetup = false) {
  clearVictory();
  overlayMotion.finish();
  overlay.hidden = false;
  el("round-record").hidden = true;
  el("daily-result").hidden = true;
  el("next-game").hidden = true;
  nextStageButton.hidden = true;
  start.classList.add("primary");
  host.inert = true;
  el("game-controls").inert = true;
  const setup = el("game-mode-choice");
  setup.hidden = !showSetup || setup.childElementCount === 0;
  el("overlay-title").textContent = title;
  el("overlay-note").textContent = note;
  const card = overlay.firstElementChild!;
  overlayMotion.run(
    (timeline) => {
      timeline.fromTo(
        card,
        { y: 10, scale: 0.98, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.22, ease: "power2.out" },
      );
    },
    () => {
      gsap.set(card, { clearProps: "transform,opacity" });
    },
  );
}
function focusGame() {
  (
    host.querySelector<HTMLElement>('[tabindex="0"],button:not([disabled])') ??
    host
  ).focus({ preventScroll: true });
}
function pause(note = "", preserveFocus = false) {
  if (state !== "running") return;
  state = "paused";
  track("pause", id);
  game?.pause();
  void audio.suspend();
  save();
  show(text.paused, note);
  start.textContent = text.resume;
  pauseButton.textContent = `▶ ${text.resume}`;
  if (!preserveFocus) start.focus();
}
function soundTick(cue: SoundCue = "tick") {
  if (sound) audio.play(cue);
}

function end(value: GameResult) {
  state = "ended";
  if (!value.restored) track("end", id);
  result = value;
  if (!value.restored) rounds++;
  score = value.score;
  el("score").textContent = formatScore(score);
  const previousBest = best();
  const record = Math.max(previousBest, score);
  write(`best:${id}:${seed}:${stage}`, record);
  el("best").textContent = formatScore(record);
  show(
    value.draw
      ? locale === "ko"
        ? "무승부예요."
        : "A draw."
      : value.won
        ? text.won
        : text.lost,
    value.message ?? `${text.score}: ${formatScore(score)}`,
  );
  if (value.won && !value.draw) celebrate();
  if (root.dataset.scoreRecord === "true" && score > 0) {
    const recordNote = el("round-record");
    const improved = score > previousBest;
    recordNote.dataset.improved = String(improved);
    recordNote.textContent = improved
      ? locale === "ko"
        ? `${previousBest > 0 ? "새 최고 기록!" : "첫 기록!"} ${formatScore(score)}점 · 이 브라우저, 같은 판·스테이지 기준`
        : `${previousBest > 0 ? "New personal best!" : "First score!"} ${formatScore(score)} · This browser, same board and stage`
      : locale === "ko"
        ? `내 최고 기록 ${formatScore(record)}점 · 한 번 더 도전해 볼까요?`
        : `Your best: ${formatScore(record)} · Ready for another round?`;
    recordNote.hidden = false;
  }
  nextLink.href = defaultNext.href;
  nextLink.textContent = defaultNext.text;
  const dailyCompleted =
    dailyGames.some((item) => item.id === id) &&
    recordDailyRound(id, Number(root.dataset.version), seed, stage, score);
  if (dailyCompleted) {
    const completed = dailyRounds();
    const finished = dailyGames.filter(
      (item) => completed[item.id]?.version === item.version,
    ).length;
    const remaining = dailyGames.find(
      (item) => completed[item.id]?.version !== item.version,
    );
    const dailyResult = el("daily-result");
    dailyResult.textContent =
      locale === "ko"
        ? `오늘의 도전 ${finished} / ${dailyGames.length}판 완료 · 이 브라우저 기준`
        : `Daily challenges: ${finished} / ${dailyGames.length} rounds complete · This browser`;
    dailyResult.hidden = false;
    nextLink.href = remaining
      ? dailyPlayHref(locale, remaining.id)
      : `/${locale}/daily/`;
    nextLink.textContent = remaining
      ? `${locale === "ko" ? "다음 오늘의 도전" : "Next daily challenge"}: ${remaining.title} ↗`
      : locale === "ko"
        ? "오늘의 도전 모두 완료! 기록 보기 ↗"
        : "All daily challenges complete! View records ↗";
  }
  nextLink.hidden = false;
  if (value.won && count > 1 && query.get("daily") !== "1" && !dailyCompleted) {
    nextStageButton.hidden = false;
    nextStageButton.textContent =
      stage < count
        ? text.nextStageProgress
            .replace("{current}", String(stage + 1))
            .replace("{total}", String(count))
        : text.restartStages;
    start.classList.remove("primary");
  }
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
    settingsHost: el("game-settings"),
    controlsHost: el("game-controls"),
    setupHost: el("game-mode-choice"),
    locale,
    seed,
    stage,
    saved: saved ? read(savedKey(), undefined) : undefined,
    onChange: (value) => {
      const increased = value > score && state === "running";
      score = value;
      el("score").textContent = formatScore(value);
      if (increased) {
        scoreMotion.finish();
        const counter = el("score");
        scoreMotion.run(
          (timeline) => {
            timeline.fromTo(
              counter,
              { scale: 1.14 },
              { scale: 1, duration: 0.22, ease: "power2.out" },
            );
          },
          () => {
            gsap.set(counter, { clearProps: "transform" });
          },
        );
      }
    },
    onEnd: end,
    sound: soundTick,
    onReady: (size) => {
      if (size) stageRatio = size.width / size.height;
      fitStage();
      if (state === "ready") {
        show(text.ready, root.dataset.instructions);
        start.disabled = false;
      }
    },
    onPause: () => pause(),
    onSave: save,
    onError: (message) => {
      state = "paused";
      game?.pause();
      show(message);
      start.disabled = true;
    },
  });
  game.setSoundEnabled?.(sound);
  game.setVolume?.(Number(volume.value) / 100);
  el("best").textContent = formatScore(best());
  show(
    id.startsWith("crisp-") || id.startsWith("agentic-")
      ? text.loading
      : text.ready,
    root.dataset.instructions,
    true,
  );
  start.textContent = text.start;
  start.disabled =
    id.startsWith("crisp-") ||
    id.startsWith("agentic-") ||
    id === "gridland" ||
    id === "neverball" ||
    id === "neverputt";
  restart.disabled = false;
  pauseButton.disabled = true;
  fitStage();
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
  if (!game || state === "ad" || restart.disabled) return;
  if (id === "hextris") game.restart();
  pause();
  save();
  const nativeRecords = id === "neverball" || id === "neverputt";
  if (nativeRecords) {
    restart.disabled = true;
    start.disabled = true;
    await game.flush?.();
    save();
  }
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
  mount(
    id === "bounce-back" ||
      id === "hextris" ||
      id === "sokoban" ||
      nativeRecords,
  );
  save();
  start.focus();
}
start.addEventListener("click", async () => {
  if (!game || state === "ad" || state === "loading") return;
  if (state === "ended") {
    await restartRound();
    return;
  }
  // Audio readiness must never block or later revive a gameplay transition.
  // A rapid mute can suspend the context before its resume promise resolves.
  if (sound)
    void audio.resume().catch(() => {
      /* silent play */
    });
  const wasPaused = state === "paused";
  state = "running";
  clearVictory();
  overlayMotion.finish();
  overlay.hidden = true;
  host.inert = false;
  el("game-controls").inert = false;
  pauseButton.disabled = false;
  pauseButton.textContent = `Ⅱ ${text.pause}`;
  if (wasPaused) game.resume();
  else game.start();
  addRecent(id);
  if (state === "running") {
    track(wasPaused ? "resume" : "start", id);
    focusGame();
    if (!wasPaused) root.scrollTop = 0;
    // Ready dialogs can scroll the document while revealing Start on short screens.
    // Explicit play/resume returns to the full stage without locking promotion scrolling.
    if (root.dataset.immersive === "true")
      root.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "instant",
      });
  }
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
  updateStageProgress();
  mount(true);
  write(`stage:${id}`, stage);
});
nextStageButton.addEventListener("click", () => {
  if (state !== "ended" || !result?.won || count < 2) return;
  stage = stage < count ? stage + 1 : 1;
  select.value = String(stage);
  updateStageProgress();
  write(`stage:${id}`, stage);
  mount(false);
  save();
  start.focus();
});
function syncSound() {
  const button = el<HTMLButtonElement>("sound-button");
  button.setAttribute("aria-pressed", String(sound));
  button.textContent = `♪ ${text.sound}: ${sound ? text.on : text.off}`;
}
syncSound();
const volume = el<HTMLInputElement>("sound-volume");
const savedVolume = read<unknown>("sound-volume", 50);
volume.value = String(
  typeof savedVolume === "number" && Number.isFinite(savedVolume)
    ? Math.max(0, Math.min(100, savedVolume))
    : 50,
);
audio.setVolume(Number(volume.value) / 100);
volume.addEventListener("input", () => {
  audio.setVolume(Number(volume.value) / 100);
  game?.setVolume?.(Number(volume.value) / 100);
  write("sound-volume", Number(volume.value));
});
el<HTMLButtonElement>("sound-button").addEventListener("click", async () => {
  sound = !sound;
  if (sound) {
    try {
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
  game?.setSoundEnabled?.(sound);
  write("sound-enabled", sound);
  syncSound();
});
const low = el<HTMLInputElement>("low-effects");
low.checked = read<boolean>("low-effects", false) === true;
root.classList.toggle("low-effects", low.checked);
low.addEventListener("change", () => {
  root.classList.toggle("low-effects", low.checked);
  write("low-effects", low.checked);
});
el("fullscreen-button").addEventListener("click", () => {
  const immersive = root.dataset.immersive !== "true";
  root.dataset.immersive = String(immersive);
  document.body.classList.toggle("player-immersive", immersive);
  const button = el("fullscreen-button");
  button.setAttribute("aria-pressed", String(immersive));
  button.textContent =
    locale === "ko"
      ? immersive
        ? "기본 보기"
        : "게임 화면"
      : immersive
        ? "Standard view"
        : "Game view";
  fitStage();
});
share.addEventListener("click", async () => {
  if (!result) return;
  const url = new URL(location.href);
  url.searchParams.set("seed", seed);
  url.searchParams.set("stage", String(stage));
  url.searchParams.delete("daily");
  const hint =
    (game?.serialize() as { hint?: boolean } | undefined)?.hint === true;
  const value = `Denny Games · ${id} · ${text.stage} ${stage} · ${text.score} ${formatScore(result.score)}${hint ? " · " + text.hintUsed : ""}\n${url.href}`;
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
  id === "underrun" ? "dpad-aim-stick-move" : "standard",
);
const keyboard = (event: KeyboardEvent) => {
  if (
    (event.target as HTMLElement).closest(
      "input,select,textarea,summary,.player-promotions",
    )
  )
    return;
  if (event.key === "Escape" || event.code === "KeyP") {
    if (state === "running") {
      event.preventDefault();
      pause();
    }
    return;
  }
  if (game?.handlesKeyboard) return;
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
document
  .querySelector('.settings-panel a[href="#advertising"]')
  ?.addEventListener("click", () => {
    pause("", true);
    document
      .querySelector<HTMLDetailsElement>(".player-settings")
      ?.removeAttribute("open");
  });
document.addEventListener("focusin", (event) => {
  if ((event.target as HTMLElement).closest(".player-promotions")) {
    pause("", true);
    void audio?.suspend();
  }
});
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
document
  .querySelectorAll<HTMLAnchorElement>("[data-locale-link]")
  .forEach((link) =>
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      pause();
      save();
      const destination = link.href;
      const flush = game?.flush?.();
      if (!flush) {
        location.assign(destination);
        return;
      }
      void flush.then((saved) => {
        if (saved) location.assign(destination);
        else
          el("game-message").textContent =
            locale === "ko"
              ? "게임을 저장하지 못했어요. 브라우저 저장 공간을 확인하고 다시 시도해주세요."
              : "The game could not be saved. Check browser storage and retry here.";
      });
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
    clearVictory();
    overlayMotion.destroy();
    scoreMotion.destroy();
    void audio?.close();
  },
  { once: true },
);
const token = ++generation;
show(text.loading);
start.disabled = true;
try {
  const loaders: Record<string, () => Promise<{ mount: GameFactory }>> = {
    "minefield-watch": () => import("../games/minefield-watch"),
    "mosaic-mystery": () => import("../games/mosaic-mystery"),
    "traffic-escape": () => import("../games/traffic-escape"),
    "river-hop": () => import("../games/river-hop"),
    "meteor-guard": () => import("../games/meteor-guard"),
    "pocket-bowling": () => import("../games/pocket-bowling"),
    "star-pinball": () => import("../games/star-pinball"),
    "jewel-drop": () => import("../games/jewel-drop"),
    "snack-street": () => import("../games/snack-street"),
    "pocket-pingpong": () => import("../games/pocket-pingpong"),
    gonggi: () => import("../games/gonggi"),
    "ember-maze": () => import("../games/ember-maze"),
    "frost-patrol": () => import("../games/frost-patrol"),
    "crater-duel": () => import("../games/crater-duel"),
    "iron-bastion": () => import("../games/iron-bastion"),
    "prism-pop": () => import("../games/prism-pop"),
    "bubble-harbor": () => import("../games/bubble-harbor"),
    "starfall-wing": () => import("../games/starfall-wing"),
    "vault-runner": () => import("../games/vault-runner"),

    "lantern-grid": () =>
      import("../games/logic").then((m) => ({
        mount: m.createMount("lantern-grid"),
      })),
    "number-trail": () =>
      import("../games/logic").then((m) => ({
        mount: m.createMount("number-trail"),
      })),
    neverball: () =>
      import("../games/neverball").then((m) => ({
        mount: m.createMount("neverball"),
      })),
    neverputt: () =>
      import("../games/neverball").then((m) => ({
        mount: m.createMount("neverputt"),
      })),
    "amber-trail": () => import("../games/heritage/platform"),
    "starlight-apprentice": () =>
      import("../games/heritage").then((m) => ({ mount: m.mountAcademy })),
    "beacon-quest": () =>
      import("../games/heritage").then((m) => ({ mount: m.mountQuest })),
    "circuit-loop": () => import("../games/circuit"),
    "orbit-break": () => import("../games/orbit"),
    "2048": () => import("../games/merge"),
    hextris: () => import("../games/hextris"),
    "bounce-back": () => import("../games/bounceback"),
    underrun: () => import("../games/underrun"),
    sokoban: () => import("../games/sokoban"),
    gridland: () => import("../games/gridland"),
    "crisp-chain-drift": () => import("../games/crisp-cycles"),
    "crisp-comet-slash": () => import("../games/crisp-cycles"),
    "crisp-volt-keeper": () => import("../games/crisp-cycles"),
    gomoku: () =>
      import("../games/board").then((m) => ({
        mount: m.createMount("gomoku"),
      })),
    reversi: () =>
      import("../games/board").then((m) => ({
        mount: m.createMount("reversi"),
      })),
    "four-in-a-row": () =>
      import("../games/board").then((m) => ({
        mount: m.createMount("four-in-a-row"),
      })),
    checkers: () =>
      import("../games/board").then((m) => ({
        mount: m.createMount("checkers"),
      })),
    "dots-and-boxes": () =>
      import("../games/board").then((m) => ({
        mount: m.createMount("dots-and-boxes"),
      })),
    yutnori: () =>
      import("../games/yutnori").then((module) => ({
        mount: module.createMount,
      })),
  };
  const crispCycleIds = new Set([
    "crisp-chain-drift",
    "crisp-comet-slash",
    "crisp-volt-keeper",
  ]);
  const module = await (id.startsWith("crisp-") && !crispCycleIds.has(id)
    ? import("../games/crisp")
    : id.startsWith("agentic-")
      ? import("../games/agentic")
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
