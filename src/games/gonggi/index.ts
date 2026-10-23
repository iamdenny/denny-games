import type { Action, GameFactory } from "../../lib/types";
import {
  GONGGI_CATCH_WINDOW_MS,
  GONGGI_FLIGHT_MS,
  GONGGI_TARGET_MS,
  catchGonggiToss,
  createGonggiState,
  groupPlan,
  isGonggiCatchWindow,
  missGonggiToss,
  restoreGonggiState,
  serializableGonggiState,
  startGonggiToss,
  targetCount,
  toggleGonggiStone,
} from "./rules";
import "./style.css";

export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  const tr = (en: string, kr: string) => (ko ? kr : en);
  const stage = ctx.stage;
  let state = restoreGonggiState(ctx.saved, stage);
  let running = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let flightStartedAt = 0;
  let elapsed = 0;
  let inWindow = false;
  let message = "";

  const app = document.createElement("section");
  app.className = "gonggi-game";
  app.setAttribute("aria-label", tr("Gonggi game board", "공기놀이 게임판"));

  const top = document.createElement("div");
  top.className = "gonggi-board-top";
  const stageName = document.createElement("p");
  stageName.className = "gonggi-stage-name";
  const lives = document.createElement("p");
  lives.className = "gonggi-lives";
  lives.setAttribute("role", "group");
  lives.setAttribute("aria-label", tr("Mistakes remaining", "남은 실수 횟수"));
  top.append(stageName, lives);

  const field = document.createElement("div");
  field.className = "gonggi-field";
  field.dataset.stones = String(stage === 5 ? 5 : 4);
  field.setAttribute("role", "group");
  field.setAttribute("aria-label", tr("Stones on the mat", "놀이판의 공깃돌"));
  const stoneButtons = Array.from(
    { length: stage === 5 ? 5 : 4 },
    (_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gonggi-stone";
      button.dataset.stone = String(index);
      button.innerHTML =
        '<span class="gonggi-stone-shine" aria-hidden="true"></span>';
      button.addEventListener("click", () => {
        if (!running || state.phase !== "airborne" || stage === 5) return;
        state = toggleGonggiStone(state, index);
        message = describePickState();
        update();
        ctx.onSave?.();
      });
      field.append(button);
      return button;
    },
  );

  const flight = document.createElement("div");
  flight.className = "gonggi-flight";
  flight.hidden = true;
  const keeper = document.createElement("span");
  keeper.className = "gonggi-keeper";
  keeper.setAttribute("aria-hidden", "true");
  const track = document.createElement("div");
  track.className = "gonggi-flight-track";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", "100");
  track.setAttribute("aria-valuenow", "0");
  track.setAttribute(
    "aria-label",
    tr("Keeper stone flight", "기준돌이 날아가는 시간"),
  );
  const targetBand = document.createElement("span");
  targetBand.className = "gonggi-target-band";
  targetBand.setAttribute("aria-hidden", "true");
  const flightProgress = document.createElement("span");
  flightProgress.className = "gonggi-flight-progress";
  track.append(targetBand, flightProgress);
  const flightHint = document.createElement("p");
  flightHint.className = "gonggi-flight-hint";
  flight.append(keeper, track, flightHint);

  const status = document.createElement("p");
  status.className = "gonggi-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  app.append(top, field, flight, status);
  ctx.host.append(app);

  const controls = document.createElement("div");
  controls.className = "gonggi-controls";
  const toss = document.createElement("button");
  toss.type = "button";
  toss.className = "button primary gonggi-action";
  const catchButton = document.createElement("button");
  catchButton.type = "button";
  catchButton.className = "button primary gonggi-action gonggi-catch";
  const catchNote = document.createElement("p");
  catchNote.className = "gonggi-catch-note";
  catchNote.textContent = tr(
    "Tap Catch when the keeper reaches the amber band.",
    "기준돌이 황금색 띠에 들어오면 ‘받기’를 누르세요.",
  );
  toss.addEventListener("click", startToss);
  catchButton.addEventListener("click", catchKeeper);
  controls.append(toss, catchButton, catchNote);
  (ctx.controlsHost ?? ctx.host).append(controls);

  const stageLabels = [
    tr("Ready · pick one stone at a time", "준비 · 한 알씩 집기"),
    tr("Pairs · pick two stones at a time", "두 알씩 · 두 알씩 집기"),
    tr("Three, then one", "세 알, 다음 한 알"),
    tr("Four · pick them all at once", "네 알 · 한 번에 모두 집기"),
    tr("Kkeokgi · flip and catch", "꺾기 · 띄워 다시 잡기"),
  ];

  function describePickState(): string {
    if (stage === 5) {
      return state.step === 0
        ? tr(
            "Toss all five stones and catch them on the back of your hand.",
            "공깃돌 다섯 알을 띄워 손등으로 받아 보세요.",
          )
        : tr(
            `${state.handCaught} stones landed. Flick them up and catch them again.`,
            `${state.handCaught}알을 손등으로 받았어요. 다시 띄워 잡아 보세요.`,
          );
    }
    const need = groupPlan(stage)[state.step] ?? 0;
    const picked = state.selected.length;
    const prefix =
      stage === 1
        ? tr("Pick one stone", "한 알씩 집기")
        : stage === 2
          ? tr("Pick pairs", "두 알씩 집기")
          : stage === 3
            ? state.step === 0
              ? tr("Pick three stones", "세 알 집기")
              : tr("Pick the last stone", "마지막 한 알 집기")
            : tr("Pick all four stones", "네 알 모두 집기");
    return `${prefix} · ${picked}/${need}${
      state.phase === "airborne" ? tr(" · then catch", " · 그다음 받기") : ""
    }`;
  }

  function currentInstruction(): string {
    if (message) return message;
    if (state.phase === "won")
      return tr(
        "Stage cleared. Ready for the next stage?",
        "단계 완료! 다음 단계에 도전해 보세요.",
      );
    if (state.phase === "lost")
      return tr(
        "Three misses. Restart this stage to try again.",
        "세 번 실수했어요. 단계를 다시 시작해 보세요.",
      );
    if (state.phase === "airborne") {
      if (!inWindow)
        return stage === 5
          ? tr(
              "Watch the amber band, then catch.",
              "황금색 띠를 보고 알맞을 때 받으세요.",
            )
          : describePickState();
      return tr("Catch now!", "지금 받으세요!");
    }
    if (state.phase === "flip-ready") return describePickState();
    return stage === 5
      ? describePickState()
      : `${describePickState()} · ${tr("Throw to begin.", "던져서 시작하세요.")}`;
  }

  function updateFlight() {
    if (state.phase !== "airborne") return;
    elapsed = Math.min(GONGGI_FLIGHT_MS, performance.now() - flightStartedAt);
    const progress = Math.min(100, (elapsed / GONGGI_FLIGHT_MS) * 100);
    const currentWindow = isGonggiCatchWindow(elapsed);
    flightProgress.style.width = `${progress}%`;
    keeper.style.left = `${progress}%`;
    keeper.setAttribute("aria-hidden", "true");
    track.setAttribute("aria-valuenow", String(Math.round(progress)));
    catchButton.classList.toggle("in-window", currentWindow);
    if (currentWindow && !inWindow) {
      message = "";
      status.textContent = tr("Catch now!", "지금 받으세요!");
    }
    inWindow = currentWindow;
    if (elapsed >= GONGGI_FLIGHT_MS) {
      stopTimer();
      state = missGonggiToss(state);
      message =
        state.phase === "lost"
          ? tr(
              "The keeper fell. Three misses; restart the stage.",
              "기준돌을 놓쳤어요. 세 번 실수했으니 단계를 다시 시작하세요.",
            )
          : tr(
              "The keeper slipped. Toss again and keep your progress.",
              "기준돌을 놓쳤어요. 지금 단계에서 다시 던지세요.",
            );
      finishIfTerminal();
      update();
      ctx.onSave?.();
      return;
    }
    status.textContent = currentInstruction();
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = undefined;
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(updateFlight, 40);
  }

  function startToss() {
    if (!running || (state.phase !== "ready" && state.phase !== "flip-ready"))
      return;
    state = startGonggiToss(state);
    elapsed = 0;
    inWindow = false;
    message = "";
    flightStartedAt = performance.now();
    update();
    startTimer();
    ctx.sound("step");
    ctx.onSave?.();
  }

  function finishIfTerminal() {
    if (state.phase === "won") {
      running = false;
      stopTimer();
      ctx.onChange(state.score);
      ctx.onEnd({
        score: state.score,
        won: true,
        message:
          stage === 5
            ? tr(
                `You recovered ${Math.floor((state.score - state.handCaught * 50) / 100)} stones in Kkeokgi.`,
                `꺾기에서 공깃돌 ${Math.floor((state.score - state.handCaught * 50) / 100)}알을 다시 잡았어요.`,
              )
            : tr(
                "Clean catches all the way through.",
                "실수 없이 단계를 끝냈어요.",
              ),
      });
    } else if (state.phase === "lost") {
      running = false;
      stopTimer();
      ctx.onChange(state.score);
      ctx.onEnd({
        score: state.score,
        won: false,
        message: tr(
          "Three misses. Restart this stage and try the toss again.",
          "세 번 실수했어요. 단계를 다시 시작해 던져 보세요.",
        ),
      });
    }
  }

  function catchKeeper() {
    if (!running || state.phase !== "airborne") return;
    if (stage < 5 && state.selected.length !== targetCount(state)) {
      message = tr(
        `Pick ${targetCount(state)} stones before you catch.`,
        `받기 전에 공깃돌 ${targetCount(state)}알을 고르세요.`,
      );
      update();
      return;
    }
    const currentElapsed = performance.now() - flightStartedAt;
    if (currentElapsed < GONGGI_TARGET_MS - GONGGI_CATCH_WINDOW_MS) {
      message = tr(
        "Too early. Wait for the amber band.",
        "아직 일러요. 황금색 띠를 기다리세요.",
      );
      update();
      return;
    }
    if (!isGonggiCatchWindow(currentElapsed)) {
      stopTimer();
      state = missGonggiToss(state);
      message = tr(
        "Too late. The keeper slipped.",
        "늦었어요. 기준돌을 놓쳤어요.",
      );
      finishIfTerminal();
      update();
      ctx.onSave?.();
      return;
    }

    stopTimer();
    state = catchGonggiToss(state, currentElapsed);
    message =
      state.phase === "flip-ready"
        ? describePickState()
        : state.phase === "won"
          ? tr(
              "A perfect catch! Stage cleared.",
              "깔끔하게 받았어요! 단계 완료.",
            )
          : state.phase === "lost"
            ? tr(
                "The stones slipped away. Restart this stage.",
                "공깃돌을 놓쳤어요. 단계를 다시 시작하세요.",
              )
            : tr(
                "Nice catch. Toss again for the next group.",
                "잘 받았어요. 다음 묶음을 던지세요.",
              );
    elapsed = 0;
    inWindow = false;
    ctx.sound("stone");
    ctx.onChange(state.score);
    finishIfTerminal();
    update();
    ctx.onSave?.();
  }

  function update() {
    stageName.textContent = `${tr("Stage", "단계")} ${stage} / 5 · ${stageLabels[stage - 1]}`;
    lives.textContent = `${tr("Misses", "남은 실수")} ${"●".repeat(state.lives)}${"○".repeat(3 - state.lives)}`;
    lives.setAttribute(
      "aria-label",
      tr(`${state.lives} misses remaining`, `실수 ${state.lives}회 남음`),
    );
    stoneButtons.forEach((button, index) => {
      const collected = stage < 5 && !state.available.includes(index);
      const selected = state.selected.includes(index);
      const atLimit =
        stage < 5 && state.selected.length >= targetCount(state) && !selected;
      button.disabled =
        !running ||
        state.phase !== "airborne" ||
        stage === 5 ||
        collected ||
        atLimit;
      button.classList.toggle("is-collected", collected);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute(
        "aria-label",
        stage === 5
          ? tr(
              `Kkeokgi display stone ${index + 1}`,
              `꺾기 표시용 공깃돌 ${index + 1}`,
            )
          : collected
            ? tr(`Stone ${index + 1}, picked`, `공깃돌 ${index + 1}, 집음`)
            : selected
              ? tr(
                  `Stone ${index + 1}, selected`,
                  `공깃돌 ${index + 1}, 선택됨`,
                )
              : tr(`Pick up stone ${index + 1}`, `공깃돌 ${index + 1} 집기`),
      );
    });
    field.classList.toggle("is-collecting", state.phase === "airborne");
    field.classList.toggle(
      "is-amount-ready",
      state.selected.length === targetCount(state),
    );
    flight.hidden = state.phase !== "airborne";
    toss.hidden =
      state.phase === "airborne" ||
      state.phase === "won" ||
      state.phase === "lost";
    toss.textContent =
      state.phase === "flip-ready"
        ? tr("↗ Flick the stones", "↗ 공깃돌 다시 띄우기")
        : tr("↗ Toss the stones", "↗ 공깃돌 던지기");
    catchButton.hidden = state.phase !== "airborne";
    catchButton.disabled =
      state.phase !== "airborne" ||
      (stage < 5 && state.selected.length !== targetCount(state));
    catchButton.textContent =
      stage === 5 && state.step === 0
        ? tr("Catch on the back of your hand", "손등으로 받기")
        : tr("Catch the stones", "공깃돌 받기");
    catchNote.hidden = state.phase !== "airborne";
    flightHint.textContent =
      stage === 5
        ? tr(
            "Catch at the amber mark to keep more stones.",
            "황금색 표시에서 받으면 더 많이 건져요.",
          )
        : tr(
            `Pick ${targetCount(state)} stone${targetCount(state) === 1 ? "" : "s"}, then catch.`,
            `공깃돌 ${targetCount(state)}알을 고른 뒤 받으세요.`,
          );
    status.textContent = currentInstruction();
    if (state.phase === "airborne") {
      const progress = Math.min(100, (elapsed / GONGGI_FLIGHT_MS) * 100);
      flightProgress.style.width = `${progress}%`;
      keeper.style.left = `${progress}%`;
      track.setAttribute("aria-valuenow", String(Math.round(progress)));
      catchButton.classList.toggle("in-window", inWindow);
    } else {
      flightProgress.style.width = "0%";
      keeper.style.left = "0%";
      track.setAttribute("aria-valuenow", "0");
      catchButton.classList.remove("in-window");
    }
    ctx.onChange(state.score);
  }

  update();
  ctx.onReady?.({ width: 560, height: 560 });

  return {
    start() {
      if (state.phase === "won" || state.phase === "lost") {
        ctx.onEnd({
          score: state.score,
          won: state.phase === "won",
          restored: true,
        });
        return;
      }
      running = true;
      update();
    },
    pause() {
      running = false;
      if (state.phase === "airborne")
        elapsed = performance.now() - flightStartedAt;
      stopTimer();
      update();
    },
    resume() {
      running = true;
      if (state.phase === "airborne") {
        flightStartedAt = performance.now() - elapsed;
        startTimer();
      }
      update();
    },
    restart() {
      stopTimer();
      state = createGonggiState(stage);
      elapsed = 0;
      inWindow = false;
      message = "";
      running = true;
      update();
    },
    action(action: Action) {
      if (!running) return;
      if (action === "confirm") {
        if (state.phase === "ready" || state.phase === "flip-ready") {
          startToss();
        } else if (state.phase === "airborne") {
          const focusedStone = stoneButtons.find(
            (button) => button === document.activeElement,
          );
          if (focusedStone) focusedStone.click();
          else if (
            state.stage === 5 ||
            state.selected.length === targetCount(state)
          )
            catchKeeper();
          else stoneButtons.find((button) => !button.disabled)?.focus();
        }
        return;
      }
      if (state.phase === "ready" || state.phase === "flip-ready") {
        toss.focus({ preventScroll: true });
        return;
      }
      const usable = stoneButtons.filter((button) => !button.disabled);
      if (!usable.length) return;
      const activeIndex = usable.findIndex(
        (button) => button === document.activeElement,
      );
      const delta =
        action === "left"
          ? -1
          : action === "right"
            ? 1
            : action === "up"
              ? -2
              : 2;
      const nextIndex =
        activeIndex < 0
          ? 0
          : (activeIndex + delta + usable.length) % usable.length;
      usable[nextIndex]?.focus({ preventScroll: true });
    },
    serialize() {
      return serializableGonggiState(state);
    },
    destroy() {
      stopTimer();
      controls.remove();
      ctx.host.replaceChildren();
    },
  };
};
