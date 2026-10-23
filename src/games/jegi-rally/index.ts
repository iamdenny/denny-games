import "./style.css";
import type { Action, GameFactory } from "../../lib/types";
import {
  createJegiState,
  missJegi,
  requiredTechnique,
  restoreJegiState,
  selectJegiTechnique,
  serializeJegiState,
  stageRules,
  tryJegiKick,
  type JegiTechnique,
} from "./rules";

const TECHNIQUES: JegiTechnique[] = ["left", "right", "back"];

export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  const tr = (en: string, kr: string) => (ko ? kr : en);
  const stage = ctx.stage;
  let state = restoreJegiState(ctx.saved, stage) ?? createJegiState(stage);
  let active = false;
  let ended = false;
  let raf = 0;
  let flightStartedAt = 0;
  let elapsed = 0;
  let inWindow = false;
  let message = "";
  let reportedScore = -1;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const app = document.createElement("section");
  app.className = "jegi-game";
  app.setAttribute("aria-label", tr("Jegi Rally game", "제기 랠리 게임"));

  const header = document.createElement("div");
  header.className = "jegi-hud";
  const stageName = document.createElement("p");
  stageName.className = "jegi-stage-name";
  const counts = document.createElement("p");
  counts.className = "jegi-counts";
  header.append(stageName, counts);

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 420;
  canvas.dataset.game = "jegi-rally";
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    tr(
      "A handmade jegi follows an arc toward the timing gate. Use the controls below to select a foot or style, then kick inside the gate.",
      "직접 그린 제기가 타이밍 표시를 향해 날아갑니다. 아래 조작으로 발 기술을 고르고 표시 구간에 차세요.",
    ),
  );
  const context = canvas.getContext("2d");
  if (!context) {
    const error = tr("Canvas is unavailable.", "게임 화면을 만들 수 없어요.");
    ctx.onError?.(error);
    throw new Error(error);
  }
  const g: CanvasRenderingContext2D = context;

  const progress = document.createElement("div");
  progress.className = "jegi-flight-track";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  progress.setAttribute("aria-valuenow", "0");
  progress.setAttribute(
    "aria-label",
    tr("Jegi flight timing", "제기 비행 타이밍"),
  );
  const trackFill = document.createElement("span");
  trackFill.className = "jegi-flight-fill";
  const trackWindow = document.createElement("span");
  trackWindow.className = "jegi-window-mark";
  progress.append(trackWindow, trackFill);

  const status = document.createElement("p");
  status.className = "jegi-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  app.append(header, canvas, progress, status);
  ctx.host.append(app);

  const controls = document.createElement("div");
  controls.className = "jegi-controls";
  controls.dataset.actionControls = "jegi-rally";
  const techniqueButtons = new Map<JegiTechnique, HTMLButtonElement>();
  for (const technique of TECHNIQUES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `jegi-technique jegi-technique-${technique}`;
    button.dataset.technique = technique;
    button.setAttribute("aria-pressed", "false");
    const icon = document.createElement("span");
    icon.className = "jegi-technique-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent =
      technique === "left" ? "L" : technique === "right" ? "R" : "↶";
    const label = document.createElement("span");
    label.className = "jegi-technique-label";
    label.textContent = techniqueLabel(technique);
    button.append(icon, label);
    button.addEventListener("click", () => choose(technique));
    controls.append(button);
    techniqueButtons.set(technique, button);
  }
  const kickButton = document.createElement("button");
  kickButton.type = "button";
  kickButton.className = "jegi-kick";
  kickButton.dataset.action = "kick";
  kickButton.addEventListener("click", () => kick(performance.now()));
  controls.append(kickButton);
  (ctx.controlsHost ?? ctx.host).append(controls);

  function techniqueLabel(technique: JegiTechnique) {
    if (technique === "left") return tr("Left foot", "왼발");
    if (technique === "right") return tr("Right foot", "오른발");
    return tr("Back foot", "뒷발");
  }

  function stageLabel() {
    return [
      tr("Single-foot rally", "외발 랠리"),
      tr("Alternating-feet rally", "양발 번갈아 랠리"),
      tr("Back-foot sequence", "뒷발 기술 랠리"),
    ][stage - 1]!;
  }

  function currentMessage() {
    if (message) return message;
    if (state.phase === "won")
      return tr("Round cleared. Nice rhythm!", "판을 끝냈어요. 리듬이 좋네요!");
    if (state.phase === "lost")
      return tr(
        "Three misses. Restart this round to try again.",
        "세 번 놓쳤어요. 이 판을 다시 시작해 보세요.",
      );
    const required = requiredTechnique(state);
    if (inWindow)
      return tr(
        `Kick now with ${techniqueLabel(required ?? state.selectedTechnique)}!`,
        `${techniqueLabel(required ?? state.selectedTechnique)}으로 지금 차세요!`,
      );
    if (required && state.selectedTechnique !== required)
      return tr(
        `Select ${techniqueLabel(required)} for the next kick.`,
        `다음 차기는 ${techniqueLabel(required)}을 고르세요.`,
      );
    return tr(
      "Watch the arc. Kick when it reaches the bright gate.",
      "제기 궤적을 보고 밝은 표시 구간에 차세요.",
    );
  }

  function drawJegi(x: number, y: number, angle: number) {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    g.shadowColor = "rgb(0 0 0 / 40%)";
    g.shadowBlur = 15;
    g.fillStyle = "#e5ed68";
    for (let i = 0; i < 6; i++) {
      g.save();
      g.rotate((Math.PI * 2 * i) / 6);
      g.beginPath();
      g.moveTo(0, -8);
      g.quadraticCurveTo(6, -23, 2, -39);
      g.quadraticCurveTo(17, -24, 8, -7);
      g.closePath();
      g.fill();
      g.restore();
    }
    g.shadowBlur = 7;
    g.fillStyle = "#ef896b";
    g.beginPath();
    g.arc(0, 0, 13, 0, Math.PI * 2);
    g.fill();
    g.shadowBlur = 0;
    g.strokeStyle = "#fff4d8";
    g.lineWidth = 2;
    g.beginPath();
    g.arc(0, 0, 7, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }

  function positionAt(fraction: number) {
    const x = 95 + fraction * 530;
    const y = 318 - Math.sin(Math.PI * fraction) * 220;
    return { x, y };
  }

  function paint(frameElapsed = elapsed) {
    const rules = stageRules(state.stage);
    const fraction = Math.max(0, Math.min(1, frameElapsed / rules.flightMs));
    g.clearRect(0, 0, canvas.width, canvas.height);
    const glow = g.createRadialGradient(360, 177, 15, 360, 177, 390);
    glow.addColorStop(0, "#254b50");
    glow.addColorStop(1, "#10252b");
    g.fillStyle = glow;
    g.fillRect(0, 0, canvas.width, canvas.height);

    g.fillStyle = "rgb(167 240 230 / 8%)";
    g.beginPath();
    g.ellipse(360, 354, 254, 27, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgb(167 240 230 / 48%)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(54, 352);
    g.lineTo(666, 352);
    g.stroke();

    const from = positionAt(0.04);
    const to = positionAt(0.96);
    g.strokeStyle = "rgb(167 240 230 / 38%)";
    g.lineWidth = 3;
    g.setLineDash(reducedMotion ? [] : [5, 12]);
    g.beginPath();
    g.moveTo(from.x, from.y);
    g.quadraticCurveTo(360, 36, to.x, to.y);
    g.stroke();
    g.setLineDash([]);

    const target = positionAt(rules.targetMs / rules.flightMs);
    g.strokeStyle = inWindow ? "#e5ed68" : "#a7f0e6";
    g.lineWidth = inWindow ? 5 : 3;
    g.beginPath();
    g.arc(target.x, target.y, inWindow ? 38 : 30, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.moveTo(target.x - 48, target.y);
    g.lineTo(target.x - 35, target.y);
    g.moveTo(target.x + 35, target.y);
    g.lineTo(target.x + 48, target.y);
    g.stroke();

    const current = positionAt(fraction);
    if (!reducedMotion && inWindow) {
      g.strokeStyle = "rgb(229 237 104 / 26%)";
      g.lineWidth = 15;
      g.beginPath();
      g.arc(current.x, current.y, 49, 0, Math.PI * 2);
      g.stroke();
    }
    drawJegi(current.x, current.y, fraction * Math.PI * 2);

    const label = requiredTechnique(state) ?? state.selectedTechnique;
    g.fillStyle = "#f5f2e9";
    g.font = "700 19px system-ui, sans-serif";
    g.textAlign = "center";
    g.fillText(techniqueLabel(label).toLocaleUpperCase(ctx.locale), 360, 393);
  }

  function update() {
    const rules = stageRules(state.stage);
    stageName.textContent = `${tr("Stage", "단계")} ${stage}/3 · ${stageLabel()}`;
    counts.textContent = `${tr("Kicks", "성공")} ${state.hits}/${rules.kicks} · ${tr("Misses", "실수")} ${state.misses}/${3} · ${tr("Score", "점수")} ${state.score}`;
    const required = requiredTechnique(state);
    for (const technique of TECHNIQUES) {
      const button = techniqueButtons.get(technique)!;
      button.hidden = technique === "back" && stage < 3;
      button.disabled = !active || state.phase !== "play";
      button.setAttribute(
        "aria-label",
        required === technique
          ? tr(
              `${techniqueLabel(technique)}, required`,
              `${techniqueLabel(technique)}, 이번 차례`,
            )
          : techniqueLabel(technique),
      );
      button.setAttribute(
        "aria-pressed",
        String(state.selectedTechnique === technique),
      );
      button.classList.toggle("is-required", required === technique);
    }
    kickButton.disabled = !active || state.phase !== "play";
    kickButton.textContent = inWindow
      ? tr("Kick now!", "지금 차기!")
      : tr("Kick", "차기");
    kickButton.setAttribute(
      "aria-label",
      inWindow ? tr("Kick now", "지금 차기") : tr("Kick the jegi", "제기 차기"),
    );
    const nextStatus = currentMessage();
    if (status.textContent !== nextStatus) status.textContent = nextStatus;
    const fraction = Math.max(0, Math.min(1, elapsed / rules.flightMs));
    trackFill.style.width = `${fraction * 100}%`;
    trackWindow.style.left = `${(rules.windowStartMs / rules.flightMs) * 100}%`;
    trackWindow.style.width = `${((rules.windowEndMs - rules.windowStartMs) / rules.flightMs) * 100}%`;
    progress.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
    progress.classList.toggle("is-open", inWindow);
    canvas.dataset.phase = state.phase;
    canvas.dataset.hits = String(state.hits);
    canvas.dataset.misses = String(state.misses);
    canvas.dataset.selected = state.selectedTechnique;
    canvas.dataset.window = String(inWindow);
    paint();
    if (reportedScore !== state.score) {
      reportedScore = state.score;
      ctx.onChange(state.score);
    }
  }

  function finish(restored = false) {
    if (ended || state.phase === "play") return;
    ended = true;
    active = false;
    cancelAnimationFrame(raf);
    update();
    ctx.onEnd({
      score: state.score,
      won: state.phase === "won",
      restored,
      message:
        state.phase === "won"
          ? tr(`${state.hits} clean kicks.`, `깔끔하게 ${state.hits}번 찼어요.`)
          : tr(
              "Three misses. Try the sequence again.",
              "세 번 놓쳤어요. 순서를 다시 익혀 보세요.",
            ),
    });
    ctx.onSave?.();
  }

  function beginFlight(now: number) {
    elapsed = 0;
    inWindow = false;
    flightStartedAt = now;
  }

  function frame(now: number) {
    if (!active || ended) return;
    const rules = stageRules(state.stage);
    elapsed = Math.max(0, now - flightStartedAt);
    if (elapsed >= rules.flightMs) {
      state = missJegi(state);
      message = tr("Too late. The jegi fell.", "늦었어요. 제기를 놓쳤어요.");
      ctx.onSave?.();
      if (state.phase !== "play") {
        finish();
        return;
      }
      beginFlight(now);
    }
    const nowInWindow =
      elapsed >= rules.windowStartMs && elapsed <= rules.windowEndMs;
    if (nowInWindow && !inWindow) message = "";
    inWindow = nowInWindow;
    update();
    raf = requestAnimationFrame(frame);
  }

  function choose(technique: JegiTechnique) {
    if (!active || state.phase !== "play") return;
    const next = selectJegiTechnique(state, technique);
    if (next === state) return;
    state = next;
    message = "";
    update();
    ctx.onSave?.();
  }

  function kick(now: number) {
    if (!active || state.phase !== "play") return;
    elapsed = Math.max(0, now - flightStartedAt);
    const result = tryJegiKick(state, elapsed);
    if (result.result === "early") {
      message = tr(
        "Too soon. Wait for the bright gate.",
        "아직 일러요. 밝은 표시를 기다리세요.",
      );
      update();
      return;
    }
    if (result.result === "ignored") return;
    state = result.state;
    if (result.result === "wrong-technique")
      message = tr(
        "Wrong foot or style. Follow the cue and try again.",
        "발 기술이 달라요. 안내에 맞춰 다시 차세요.",
      );
    else if (result.result === "late")
      message = tr("Too late. The jegi fell.", "늦었어요. 제기를 놓쳤어요.");
    else {
      message = tr("Clean kick!", "좋은 차기예요!");
      ctx.sound("stone");
    }
    ctx.onSave?.();
    if (state.phase !== "play") {
      finish();
      return;
    }
    beginFlight(now);
    update();
  }

  function act(action: Action) {
    if (action === "confirm") kick(performance.now());
    else if (action === "left") choose("left");
    else if (action === "right") choose("right");
    else if (action === "up") choose("back");
  }

  stageName.textContent = `${tr("Stage", "단계")} ${stage}/3 · ${stageLabel()}`;
  ctx.onReady?.({ width: 720, height: 420 });
  update();

  return {
    start() {
      if (state.phase !== "play") {
        finish(true);
        return;
      }
      if (active) return;
      active = true;
      flightStartedAt = performance.now() - elapsed;
      update();
      raf = requestAnimationFrame(frame);
    },
    pause() {
      if (!active) return;
      elapsed = Math.max(0, performance.now() - flightStartedAt);
      active = false;
      cancelAnimationFrame(raf);
      update();
    },
    resume() {
      if (active || ended || state.phase !== "play") return;
      active = true;
      flightStartedAt = performance.now() - elapsed;
      update();
      raf = requestAnimationFrame(frame);
    },
    restart() {
      cancelAnimationFrame(raf);
      state = createJegiState(stage);
      elapsed = 0;
      inWindow = false;
      message = "";
      ended = false;
      active = true;
      beginFlight(performance.now());
      update();
      raf = requestAnimationFrame(frame);
    },
    action: act,
    serialize() {
      return serializeJegiState(state);
    },
    destroy() {
      active = false;
      cancelAnimationFrame(raf);
      app.remove();
      controls.remove();
    },
  };
};
