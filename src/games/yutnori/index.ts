import type { GameFactory, GameInstance } from "../../lib/types";
import { read, write } from "../../lib/storage";
import {
  applyYutMove,
  classifyYutThrow,
  initialYutState,
  legalYutMoves,
  restoreYutState,
  type YutMove,
  type YutState,
} from "./rules";
import "./style.css";

const COLORS = ["#ee6d59", "#36b8ac", "#a47ae8", "#e8b84f"];

export const createMount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  const tr = (en: string, kr: string) => (ko ? kr : en);
  const saved = restoreYutState(ctx.saved);
  let newPlayerCount = read<number>(
    "yutnori-player-count",
    saved?.players.length ?? 2,
  );
  if (![2, 3, 4].includes(newPlayerCount)) newPlayerCount = 2;
  let state = saved ?? initialYutState(newPlayerCount);
  let running = false;
  let selected:
    | { kind: "yard"; token: number }
    | { kind: "node"; node: number }
    | undefined;
  let announcement = "";

  const app = document.createElement("section");
  app.className = "yut-game";
  app.setAttribute("aria-label", tr("Yutnori game", "윷놀이 게임"));
  const scoreboard = document.createElement("div");
  scoreboard.className = "yut-scoreboard";
  scoreboard.setAttribute("role", "group");
  scoreboard.setAttribute(
    "aria-label",
    tr("Players and pieces", "플레이어와 말"),
  );
  const board = document.createElement("div");
  board.className = "yut-board";
  board.setAttribute("role", "group");
  board.setAttribute(
    "aria-label",
    tr("29-space Yutnori board", "29칸 윷놀이판"),
  );
  const lines = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  lines.classList.add("yut-board-lines");
  lines.setAttribute("viewBox", "0 0 100 100");
  lines.setAttribute("aria-hidden", "true");
  lines.innerHTML =
    '<path d="M88 88H8V8H88V88M8 88L48 48L88 8M8 8L48 48L88 88" />';
  board.append(lines);

  const nodeButtons: HTMLButtonElement[] = [];
  const positions: [number, number][] = [
    [88, 88],
    [72, 88],
    [56, 88],
    [40, 88],
    [24, 88],
    [8, 88],
    [8, 72],
    [8, 56],
    [8, 40],
    [8, 24],
    [8, 8],
    [24, 8],
    [40, 8],
    [56, 8],
    [72, 8],
    [88, 8],
    [88, 24],
    [88, 40],
    [88, 56],
    [88, 72],
    [21.33, 74.67],
    [34.67, 61.33],
    [48, 48],
    [61.33, 34.67],
    [74.67, 21.33],
    [21.33, 21.33],
    [34.67, 34.67],
    [61.33, 61.33],
    [74.67, 74.67],
  ];
  const pointLabel = (node: number) =>
    node === 0 ? tr("finish", "도착") : tr(`space ${node}`, `${node}번 밭`);
  positions.forEach(([x, y], node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "yut-node";
    button.style.setProperty("--x", `${x}%`);
    button.style.setProperty("--y", `${y}%`);
    button.dataset.node = String(node);
    button.setAttribute("aria-label", pointLabel(node));
    button.addEventListener("click", () => chooseNode(node));
    nodeButtons.push(button);
    board.append(button);
  });
  app.append(board);
  ctx.host.append(app);

  const controls = document.createElement("div");
  controls.className = "yut-controls";
  const turnHeading = document.createElement("p");
  turnHeading.className = "yut-turn";
  turnHeading.setAttribute("aria-live", "polite");
  const status = document.createElement("p");
  status.className = "yut-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const sticks = document.createElement("div");
  sticks.className = "yut-sticks";
  sticks.setAttribute("aria-label", tr("Last throw", "최근 윷 결과"));
  const rollButton = document.createElement("button");
  rollButton.type = "button";
  rollButton.className = "yut-throw button primary";
  rollButton.addEventListener("click", throwSticks);
  const yard = document.createElement("div");
  yard.className = "yut-yard";
  const moveChoices = document.createElement("div");
  moveChoices.className = "yut-moves";
  const skipButton = document.createElement("button");
  skipButton.type = "button";
  skipButton.className = "button yut-skip";
  skipButton.textContent = tr("Skip this move", "이번 수 건너뛰기");
  skipButton.addEventListener("click", skipMove);
  const throwRow = document.createElement("div");
  throwRow.className = "yut-throw-row";
  throwRow.append(rollButton, sticks);
  controls.append(
    scoreboard,
    turnHeading,
    status,
    throwRow,
    yard,
    moveChoices,
    skipButton,
  );
  ctx.controlsHost?.append(controls);
  if (!ctx.controlsHost) app.append(controls);

  const setup = document.createElement("fieldset");
  setup.className = "yut-player-choice";
  const setupLegend = document.createElement("legend");
  setupLegend.textContent = tr("How many players?", "몇 명이 함께 하나요?");
  const setupSelect = document.createElement("select");
  setupSelect.setAttribute("aria-label", setupLegend.textContent);
  setup.append(setupLegend, setupSelect);
  const settings = document.createElement("fieldset");
  settings.className = "yut-player-choice";
  const settingsLegend = document.createElement("legend");
  settingsLegend.textContent = tr("Players in the next match", "다음 판 인원");
  const settingsSelect = document.createElement("select");
  settingsSelect.setAttribute("aria-label", settingsLegend.textContent);
  settings.append(settingsLegend, settingsSelect);
  for (let count = 2; count <= 4; count++) {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = tr(`${count} players`, `${count}명`);
    setupSelect.append(option.cloneNode(true));
    settingsSelect.append(option);
  }
  setupSelect.value = String(state.players.length);
  settingsSelect.value = String(newPlayerCount);
  setupSelect.addEventListener("change", () => {
    const count = Number(setupSelect.value);
    if (![2, 3, 4].includes(count)) return;
    newPlayerCount = count;
    settingsSelect.value = String(count);
    write("yutnori-player-count", count);
    state = initialYutState(count);
    selected = undefined;
    announcement = tr(
      "A new match is ready.",
      "새 대국을 시작할 준비가 됐어요.",
    );
    persist();
    render();
  });
  settingsSelect.addEventListener("change", () => {
    const count = Number(settingsSelect.value);
    if (![2, 3, 4].includes(count)) return;
    newPlayerCount = count;
    write("yutnori-player-count", count);
    announcement = tr(
      "Player count saved for the next match. Restart to apply it.",
      "다음 판 인원을 저장했어요. 재시작하면 적용됩니다.",
    );
    renderStatus();
  });
  ctx.setupHost?.replaceChildren(setup);
  ctx.settingsHost?.append(settings);

  function name(player: number) {
    return tr(`Player ${player + 1}`, `${player + 1}번 플레이어`);
  }

  function countFinished(player: number) {
    return state.players[player]!.tokens.filter((token) => token.finished)
      .length;
  }

  function routeName(move: YutMove) {
    return move.trace.some((node) => node >= 20)
      ? tr("Diagonal shortcut", "대각선 지름길")
      : tr("Outer route", "바깥길");
  }

  function destinationLabel(move: YutMove) {
    return move.finished ? tr("finish", "도착") : pointLabel(move.to ?? 0);
  }

  function candidatesForSelection(): YutMove[] {
    const moves = legalYutMoves(state);
    const selection = selected;
    if (!selection) return [];
    return moves.filter((move) =>
      selection.kind === "yard"
        ? move.from === null &&
          move.tokens.length === 1 &&
          move.tokens[0] === selection.token
        : move.from === selection.node,
    );
  }

  function renderScoreboard() {
    scoreboard.replaceChildren();
    state.players.forEach((player, playerIndex) => {
      const card = document.createElement("div");
      card.className = "yut-player";
      card.classList.toggle(
        "active",
        playerIndex === state.turn && state.winner === null,
      );
      card.style.setProperty("--player-color", COLORS[playerIndex]!);
      card.setAttribute("aria-current", String(playerIndex === state.turn));
      const title = document.createElement("strong");
      const active = playerIndex === state.turn && state.winner === null;
      title.textContent = `${active ? "▶ " : ""}${tr(`P${playerIndex + 1}`, `${playerIndex + 1}번`)}`;
      title.setAttribute(
        "aria-label",
        `${name(playerIndex)}${active ? tr("'s turn", " 차례") : ""}`,
      );
      const count = document.createElement("span");
      count.textContent = `${countFinished(playerIndex)}/4`;
      count.setAttribute(
        "aria-label",
        tr(
          `${countFinished(playerIndex)} of 4 finished`,
          `4개 중 ${countFinished(playerIndex)}개 완주`,
        ),
      );
      card.append(title, count);
      scoreboard.append(card);
    });
  }

  function renderNodes() {
    const moves = legalYutMoves(state);
    const chosenMoves = candidatesForSelection();
    nodeButtons.forEach((button, node) => {
      const tokens = state.players.flatMap((player, playerIndex) =>
        player.tokens.flatMap((token, tokenIndex) =>
          !token.finished && token.node === node
            ? [{ player: playerIndex, token: tokenIndex }]
            : [],
        ),
      );
      const owner = tokens[0]?.player;
      const tokenStack = document.createElement("span");
      tokenStack.className = "yut-stack";
      tokens.slice(0, 4).forEach(({ player, token }) => {
        const piece = document.createElement("span");
        piece.className = "yut-piece";
        piece.style.setProperty("--player-color", COLORS[player]!);
        piece.textContent = String(token + 1);
        tokenStack.append(piece);
      });
      if (tokens.length > 4) {
        const extra = document.createElement("span");
        extra.className = "yut-stack-count";
        extra.textContent = `+${tokens.length - 4}`;
        tokenStack.append(extra);
      }
      const label = document.createElement("span");
      label.className = "yut-node-label";
      label.textContent = String(node);
      label.setAttribute("aria-hidden", "true");
      button.replaceChildren(label, tokenStack);
      button.classList.toggle("goal", node === 0);
      button.classList.toggle(
        "selectable",
        running &&
          state.roll !== null &&
          owner === state.turn &&
          moves.some((move) => move.from === node),
      );
      button.classList.toggle(
        "selected",
        selected?.kind === "node" && selected.node === node,
      );
      button.classList.toggle(
        "destination",
        chosenMoves.some((move) => move.to === node),
      );
      button.disabled =
        node === 0 ||
        !running ||
        state.roll === null ||
        !(
          (owner === state.turn && moves.some((move) => move.from === node)) ||
          chosenMoves.some((move) => move.to === node)
        );
      const stackText = tokens.length
        ? tr(
            `, ${tokens.length} ${tokens.length === 1 ? "piece" : "pieces"}${owner === undefined ? "" : `, ${name(owner)}`}`,
            `, ${tokens.length}개 말${owner === undefined ? "" : `, ${name(owner)}`}`,
          )
        : "";
      button.setAttribute(
        "aria-label",
        `${pointLabel(node)}${stackText}${node === 0 ? tr("; goal", "; 도착점") : ""}`,
      );
    });
  }

  function renderYard() {
    yard.replaceChildren();
    const current = state.players[state.turn]!;
    const label = document.createElement("p");
    label.className = "yut-yard-label";
    label.textContent = tr("Waiting pieces", "대기 말");
    yard.append(label);
    current.tokens.forEach((token, index) => {
      if (token.finished || token.node !== null) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "yut-yard-piece";
      button.dataset.yardPiece = String(index);
      button.textContent = String(index + 1);
      button.setAttribute(
        "aria-label",
        tr(`Piece ${index + 1}`, `${index + 1}번 말`),
      );
      button.style.setProperty("--player-color", COLORS[state.turn]!);
      button.disabled = !running || state.roll === null;
      button.classList.toggle(
        "selected",
        selected?.kind === "yard" && selected.token === index,
      );
      button.setAttribute(
        "aria-pressed",
        String(selected?.kind === "yard" && selected.token === index),
      );
      button.addEventListener("click", () => chooseYard(index));
      yard.append(button);
    });
    yard.hidden = current.tokens.every(
      (token) => token.finished || token.node !== null,
    );
  }

  function rollName(steps: number) {
    return [
      "",
      tr("Do", "도"),
      tr("Gae", "개"),
      tr("Geol", "걸"),
      tr("Yut", "윷"),
      tr("Mo", "모"),
    ][steps]!;
  }

  function renderSticks() {
    sticks.replaceChildren();
    const roll = state.roll;
    if (!roll) {
      sticks.hidden = true;
      return;
    }
    sticks.hidden = false;
    roll.faces.forEach((face, index) => {
      const stick = document.createElement("span");
      stick.className = `yut-stick ${face ? "flat" : "round"}`;
      stick.textContent = face ? "●" : "╱";
      stick.setAttribute(
        "aria-label",
        tr(
          `Stick ${index + 1}: ${face ? "flat side" : "round side"} up`,
          `${index + 1}번 윷: ${face ? "평평한 면" : "둥근 면"} 위`,
        ),
      );
      sticks.append(stick);
    });
    const result = document.createElement("strong");
    result.className = "yut-result";
    result.textContent = `${rollName(roll.steps)} · ${tr(`${roll.steps} spaces`, `${roll.steps}칸`)}`;
    sticks.append(result);
  }

  function renderMoves() {
    moveChoices.replaceChildren();
    const choices = candidatesForSelection();
    if (selected && choices.length) {
      const heading = document.createElement("p");
      heading.className = "yut-move-label";
      heading.textContent = tr("Choose a route", "이동 경로를 선택하세요");
      moveChoices.append(heading);
      choices.forEach((move, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "yut-move-choice";
        const group = tr(
          `${move.tokens.length} ${move.tokens.length === 1 ? "piece" : "pieces"}`,
          `${move.tokens.length}개 말`,
        );
        const target = destinationLabel(move);
        const captures =
          move.to === null
            ? 0
            : state.players.flatMap((player, playerIndex) =>
                playerIndex === state.turn
                  ? []
                  : player.tokens.filter(
                      (token) => !token.finished && token.node === move.to,
                    ),
              ).length;
        button.textContent = `${routeName(move)} · ${target} · ${group}${
          move.finished ? tr(" · finish", " · 완주") : ""
        }${captures ? tr(` · capture ${captures}`, ` · ${captures}개 잡기`) : ""}`;
        button.setAttribute("aria-label", button.textContent);
        button.dataset.moveChoice = String(index);
        button.addEventListener("click", () => playMove(move));
        moveChoices.append(button);
      });
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "yut-cancel";
      cancel.textContent = tr("Choose another piece", "다른 말 선택");
      cancel.addEventListener("click", () => {
        const previous = selected;
        selected = undefined;
        announcement = tr("Choose a piece to move.", "움직일 말을 선택하세요.");
        render();
        if (previous?.kind === "node") focusAction(nodeButtons[previous.node]);
        else if (previous?.kind === "yard")
          focusAction(
            yard.querySelector<HTMLButtonElement>(
              `[data-yard-piece="${previous.token}"]`,
            ),
          );
      });
      moveChoices.append(cancel);
    }
    const noMoves = state.roll !== null && legalYutMoves(state).length === 0;
    skipButton.hidden = !running || !noMoves;
    skipButton.disabled = !running || !noMoves;
  }

  function renderStatus() {
    if (state.winner !== null) {
      turnHeading.textContent = tr(
        `${name(state.winner)} wins!`,
        `${name(state.winner)} 승리!`,
      );
      status.textContent = tr(
        "All four pieces reached the finish.",
        "네 말이 모두 도착했어요.",
      );
    } else {
      turnHeading.textContent = tr(
        `${name(state.turn)}'s turn`,
        `${name(state.turn)} 차례`,
      );
      status.textContent =
        announcement ||
        (state.roll
          ? state.roll.steps >= 4
            ? tr(
                "Yut or Mo: move, then throw again.",
                "윷·모가 나왔어요. 이동한 뒤 한 번 더 던지세요.",
              )
            : tr(
                "Choose one of your pieces to move.",
                "움직일 말을 선택하세요.",
              )
          : tr(
              "Throw the four sticks to begin your turn.",
              "윷가락 네 개를 던져 차례를 시작하세요.",
            ));
    }
    rollButton.disabled =
      !running || state.roll !== null || state.winner !== null;
    rollButton.hidden = state.roll !== null;
    rollButton.textContent = state.roll
      ? tr("Choose a piece", "말 선택하기")
      : tr("Throw the sticks", "윷 던지기");
  }

  function render() {
    renderScoreboard();
    renderNodes();
    renderYard();
    renderSticks();
    renderMoves();
    renderStatus();
  }

  function persist() {
    ctx.onChange(state.moves);
    ctx.onSave?.();
  }

  function focusAction(target: HTMLElement | null | undefined) {
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function throwSticks() {
    if (!running || state.roll || state.winner !== null) return;
    const result = classifyYutThrow(
      Array.from({ length: 4 }, () => Math.random() < 0.5),
    );
    if (!result) return;
    state = { ...state, roll: result };
    selected = undefined;
    announcement = tr(
      `${rollName(result.steps)} · move ${result.steps} spaces${result.steps >= 4 ? " · one more throw" : ""}`,
      `${rollName(result.steps)} · ${result.steps}칸 이동${result.steps >= 4 ? " · 한 번 더 던져요" : ""}`,
    );
    ctx.sound("drop");
    persist();
    render();
    const nextPiece =
      board.querySelector<HTMLButtonElement>(".yut-node.selectable") ??
      yard.querySelector<HTMLButtonElement>("button:not(:disabled)");
    focusAction(nextPiece ?? skipButton);
  }

  function chooseYard(token: number) {
    if (!running || !state.roll) return;
    selected =
      selected?.kind === "yard" && selected.token === token
        ? undefined
        : { kind: "yard", token };
    announcement = selected
      ? tr(`Piece ${token + 1} selected.`, `${token + 1}번 말을 선택했어요.`)
      : tr("Choose a piece to move.", "움직일 말을 선택하세요.");
    render();
    focusAction(
      yard.querySelector<HTMLButtonElement>(`[data-yard-piece="${token}"]`),
    );
    if (selected) moveChoices.scrollIntoView({ block: "nearest" });
  }

  function chooseNode(node: number) {
    if (!running || !state.roll || node === 0) return;
    const moves = legalYutMoves(state);
    const currentSelectionMoves = candidatesForSelection();
    const destinations = currentSelectionMoves.filter(
      (move) => move.to === node,
    );
    if (destinations.length === 1) {
      playMove(destinations[0]!);
      return;
    }
    if (destinations.length > 1) {
      announcement = tr(
        "Choose the route below.",
        "아래에서 경로를 선택하세요.",
      );
      render();
      return;
    }
    if (
      state.players[state.turn]!.tokens.some(
        (token) => !token.finished && token.node === node,
      ) &&
      moves.some((move) => move.from === node)
    ) {
      selected =
        selected?.kind === "node" && selected.node === node
          ? undefined
          : { kind: "node", node };
      announcement = selected
        ? tr(
            "Piece stack selected. Choose a route.",
            "업은 말을 선택했어요. 경로를 고르세요.",
          )
        : tr("Choose a piece to move.", "움직일 말을 선택하세요.");
      render();
      if (selected) moveChoices.scrollIntoView({ block: "nearest" });
    }
  }

  function playMove(move: YutMove) {
    if (!running || !state.roll) return;
    const outcome = applyYutMove(state, move);
    if (outcome.invalid) return;
    const previousPlayer = state.turn;
    state = outcome.state;
    selected = undefined;
    if (state.winner !== null) {
      announcement = tr(
        `${name(state.winner)} brought all four pieces home.`,
        `${name(state.winner)}가 네 말을 모두 도착시켰어요.`,
      );
      running = false;
      ctx.sound("win");
      ctx.onEnd({
        score: state.moves,
        won: true,
        message: announcement,
      });
    } else if (outcome.captured > 0) {
      announcement = tr(
        `Captured ${outcome.captured} opposing piece${outcome.captured === 1 ? "" : "s"}; throw again.`,
        `상대 말 ${outcome.captured}개를 잡았어요. 한 번 더 던지세요.`,
      );
      ctx.sound("capture");
    } else if (outcome.bonusThrow) {
      announcement = tr(
        "Yut or Mo: throw again.",
        "윷·모가 나왔어요. 한 번 더 던지세요.",
      );
      ctx.sound("step");
    } else {
      announcement = tr(
        `${name(previousPlayer)} moved. ${name(state.turn)} is next.`,
        `${name(previousPlayer)}가 이동했어요. ${name(state.turn)} 차례입니다.`,
      );
      ctx.sound("step");
    }
    persist();
    render();
    if (state.winner === null) focusAction(rollButton);
  }

  function skipMove() {
    if (!running || !state.roll || legalYutMoves(state).length > 0) return;
    const extra = state.roll.steps >= 4;
    const player = state.turn;
    state = {
      ...state,
      roll: null,
      turn: extra ? player : (player + 1) % state.players.length,
    };
    selected = undefined;
    announcement = tr(
      extra
        ? "No move available. Throw again."
        : "No move available. Turn passes.",
      extra
        ? "움직일 수 없어요. 다시 던지세요."
        : "움직일 수 없어 차례를 넘깁니다.",
    );
    persist();
    render();
    focusAction(rollButton);
  }

  render();
  ctx.onReady?.({ width: 1, height: 1 });

  const instance: GameInstance = {
    start() {
      if (state.winner !== null) {
        ctx.onEnd({
          score: state.moves,
          won: true,
          restored: true,
          message: tr(
            `${name(state.winner)} brought all four pieces home.`,
            `${name(state.winner)}가 네 말을 모두 도착시켰어요.`,
          ),
        });
        return;
      }
      announcement = "";
      running = true;
      render();
      const firstMove =
        board.querySelector<HTMLButtonElement>(".yut-node.selectable") ??
        yard.querySelector<HTMLButtonElement>("button:not(:disabled)");
      focusAction(state.roll ? (firstMove ?? skipButton) : rollButton);
    },
    pause() {
      running = false;
      render();
    },
    resume() {
      running = true;
      render();
    },
    restart() {
      state = initialYutState(newPlayerCount);
      selected = undefined;
      announcement = tr(
        "A new match is ready.",
        "새 대국을 시작할 준비가 됐어요.",
      );
      render();
      persist();
    },
    action(action) {
      if (action === "confirm") {
        if (!state.roll) throwSticks();
        else {
          const options = candidatesForSelection();
          if (options.length === 1) playMove(options[0]!);
        }
      }
    },
    setSoundEnabled() {},
    setVolume() {},
    serialize() {
      return JSON.parse(JSON.stringify(state)) as YutState;
    },
    destroy() {
      running = false;
      app.remove();
      controls.remove();
      setup.remove();
      settings.remove();
    },
  };
  return instance;
};
