import { createMotion, gsap } from "../../lib/motion";
import type { GameFactory, GameInstance } from "../../lib/types";
import {
  deadSquares,
  isWon,
  parseLevel,
  stepPlayer,
  type Level,
} from "../../../vendor/sokoban/upstream/src/sokoban";
import { LEVELS } from "../../../vendor/sokoban/upstream/src/levels";
import "./style.css";

type MoveSnapshot = {
  boxes: number[];
  player: number;
  pushed: boolean;
};
type Saved = {
  version: 1;
  level: number;
  completed: number[];
};

export const mount: GameFactory = (context) => {
  const ko = context.locale === "ko";
  const text = ko
    ? {
        puzzle: "퍼즐",
        moves: "이동",
        pushes: "밀기",
        undo: "되돌리기",
        reset: "초기화",
        solve: "풀이 보기",
        next: "다음 퍼즐",
        dead: "막힌 칸 표시",
        select: "퍼즐 선택",
        board: "소코반 퍼즐 보드",
        wall: "벽",
        floor: "바닥",
        void: "빈 공간",
        goal: "목표 칸",
        box: "상자",
        keeper: "관리인",
        solved: "퍼즐 완료!",
        replaying: "이전에 완료한 퍼즐이에요. 다시 플레이해 보세요.",
        allSolved: "여섯 퍼즐을 모두 풀었어요!",
        nextStatus: "다음 퍼즐로 이동하거나 이 퍼즐을 더 연습할 수 있어요.",
        unsolvable: "현재 배치로는 목표에 도달할 수 없어요. 되돌려 보세요.",
        limit:
          "풀이 검색 한도에 도달했어요. 되돌리거나 다른 수를 시도해 보세요.",
        searching: "최소 밀기 풀이를 찾는 중…",
        solverError:
          "풀이기가 시작되지 않았어요. 직접 이동으로 계속할 수 있어요.",
        loading: "게임 보드를 준비했어요.",
        up: "위로 이동",
        down: "아래로 이동",
        left: "왼쪽으로 이동",
        right: "오른쪽으로 이동",
        directionNames: {
          up: "위",
          down: "아래",
          left: "왼쪽",
          right: "오른쪽",
        },
        deadHint: "붉게 표시된 칸에 상자를 밀면 목표에 도달할 수 없어요.",
        resetHint: "현재 퍼즐을 처음 상태로 되돌립니다.",
        instructions: "방향키 또는 WASD 키로 이동해요.",
        moved:
          "{direction} 이동. 관리인 {row}행 {column}열. 이동 {moves}회, 밀기 {pushes}회.",
        pushed: "상자 {row}행 {column}열{goal}.",
        onGoal: ", 목표 칸",
        offGoal: "",
        undone:
          "한 수 되돌림. 관리인 {row}행 {column}열. 이동 {moves}회, 밀기 {pushes}회.",
      }
    : {
        puzzle: "Puzzle",
        moves: "Moves",
        pushes: "Pushes",
        undo: "Undo",
        reset: "Reset",
        solve: "Show solution",
        next: "Next puzzle",
        dead: "Show dead squares",
        select: "Choose puzzle",
        board: "Sokoban puzzle board",
        wall: "Wall",
        floor: "Floor",
        void: "Empty space",
        goal: "Goal",
        box: "Crate",
        keeper: "Keeper",
        solved: "Puzzle complete!",
        replaying: "Previously completed. Replay this puzzle.",
        allSolved: "All six puzzles solved!",
        nextStatus: "Go to the next puzzle or keep practicing this one.",
        unsolvable: "No solution from this arrangement. Try undoing a move.",
        limit: "The search limit was reached. Undo or try a different move.",
        searching: "Searching for a solution with the fewest pushes…",
        solverError: "The solver could not start. Continue with manual moves.",
        loading: "The board is ready.",
        up: "Move up",
        down: "Move down",
        left: "Move left",
        right: "Move right",
        directionNames: {
          up: "up",
          down: "down",
          left: "left",
          right: "right",
        },
        deadHint: "A crate on a red square cannot reach a goal.",
        resetHint: "Return the current puzzle to its starting position.",
        instructions: "Use the arrow keys or WASD to move.",
        moved:
          "Moved {direction}. Keeper at row {row}, column {column}. Moves: {moves}; pushes: {pushes}.",
        pushed: "Crate at row {row}, column {column}{goal}.",
        onGoal: ", on a goal",
        offGoal: "",
        undone:
          "Move undone. Keeper at row {row}, column {column}. Moves: {moves}; pushes: {pushes}.",
      };

  const root = document.createElement("div");
  root.className = "sokoban-root";
  root.dataset.game = "sokoban";
  const heading = document.createElement("h2");
  heading.className = "sokoban-level-title";
  const status = document.createElement("p");
  status.className = "sokoban-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const instructions = document.createElement("p");
  instructions.className = "sokoban-sr-only";
  instructions.id = "sokoban-instructions";
  instructions.textContent = text.instructions;
  const boardDescription = document.createElement("p");
  boardDescription.className = "sokoban-sr-only";
  boardDescription.id = "sokoban-board-description";
  const announcement = document.createElement("p");
  announcement.className = "sokoban-sr-only sokoban-announcement";
  announcement.id = "sokoban-announcement";
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  const counts = document.createElement("p");
  counts.className = "sokoban-counts";
  const boardElement = document.createElement("div");
  boardElement.className = "sokoban-board";
  boardElement.tabIndex = 0;
  boardElement.setAttribute("role", "grid");
  boardElement.setAttribute("aria-label", text.board);
  boardElement.setAttribute(
    "aria-describedby",
    instructions.id + " " + boardDescription.id,
  );
  root.append(
    heading,
    status,
    counts,
    instructions,
    boardDescription,
    announcement,
    boardElement,
  );
  context.host.append(root);

  let currentLevel = 0;
  let level = parseLevel(LEVELS[currentLevel]!.text);
  let boxes = level.boxes.slice();
  let player = level.player;
  let moves = 0;
  let pushes = 0;
  let history: MoveSnapshot[] = [];
  let completed = new Set<number>();
  let active = false;
  let ended = false;
  let showDead = false;
  let animating = false;
  let solving = false;
  let solverUnavailable = false;
  let solution: number[] = [];
  let solutionStep = 0;
  let solverRequestId = 0;
  let animationTimer: number | undefined;
  let resizeFrame: number | undefined;
  let destroyed = false;

  const saved = context.saved as Partial<Saved> | undefined;
  if (
    saved?.version === 1 &&
    Array.isArray(saved.completed) &&
    saved.completed.every(
      (entry) => Number.isInteger(entry) && entry >= 0 && entry < LEVELS.length,
    )
  ) {
    completed = new Set(saved.completed);
  }

  if (
    saved?.version === 1 &&
    Number.isInteger(saved.level) &&
    saved.level! >= 0 &&
    saved.level! < LEVELS.length
  ) {
    currentLevel = saved.level!;
    level = parseLevel(LEVELS[currentLevel]!.text);
    boxes = level.boxes.slice();
    player = level.player;
  }

  const setStatus = (message: string) => {
    status.textContent = message;
  };
  const announcePosition = (message: string, directionLabel = "") => {
    const row = Math.floor(player / level.width) + 1;
    const column = (player % level.width) + 1;
    const goal = level.goals[player] ? text.onGoal : text.offGoal;
    announcement.textContent = message
      .replaceAll("{direction}", directionLabel)
      .replaceAll("{row}", String(row))
      .replaceAll("{column}", String(column))
      .replaceAll("{moves}", String(moves))
      .replaceAll("{pushes}", String(pushes))
      .replaceAll("{goal}", goal);
  };
  const announceCrate = (index: number) => {
    const row = Math.floor(index / level.width) + 1;
    const column = (index % level.width) + 1;
    announcement.textContent +=
      " " +
      text.pushed
        .replace("{row}", String(row))
        .replace("{column}", String(column))
        .replace("{goal}", level.goals[index] ? text.onGoal : text.offGoal);
  };
  const describePosition = (index: number) => {
    const row = Math.floor(index / level.width) + 1;
    const column = (index % level.width) + 1;
    return ko ? `${row}행 ${column}열` : `row ${row}, column ${column}`;
  };
  const describeMapPositions = (indices: number[]) => {
    const rows = new Map<number, number[]>();
    for (const index of indices) {
      const row = Math.floor(index / level.width) + 1;
      const columns = rows.get(row) ?? [];
      columns.push((index % level.width) + 1);
      rows.set(row, columns);
    }
    return [...rows.entries()]
      .map(([row, columns]) => {
        columns.sort((a, b) => a - b);
        const ranges: Array<[number, number]> = [];
        for (const column of columns) {
          const last = ranges.at(-1);
          if (last && column === last[1] + 1) last[1] = column;
          else ranges.push([column, column]);
        }
        const columnText = ranges
          .map(([start, end]) => {
            if (ko) return start === end ? `${start}열` : `${start}~${end}열`;
            return start === end
              ? `column ${start}`
              : `columns ${start}–${end}`;
          })
          .join(", ");
        return ko ? `${row}행 ${columnText}` : `row ${row}: ${columnText}`;
      })
      .join("; ");
  };

  const settings = context.settingsHost;
  const settingsGroup = document.createElement("div");
  settingsGroup.className = "sokoban-settings";
  const levelLabel = document.createElement("label");
  levelLabel.textContent = text.select;
  const levelSelect = document.createElement("select");
  levelSelect.setAttribute("aria-label", text.select);
  LEVELS.forEach((_, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = text.puzzle + " " + String(index + 1);
    levelSelect.append(option);
  });
  levelSelect.value = String(currentLevel);
  levelLabel.append(levelSelect);
  const deadLabel = document.createElement("label");
  deadLabel.className = "sokoban-dead-option";
  const deadToggle = document.createElement("input");
  deadToggle.type = "checkbox";
  deadToggle.setAttribute("aria-label", text.dead);
  deadLabel.append(deadToggle, document.createTextNode(text.dead));
  const deadNote = document.createElement("p");
  deadNote.className = "sokoban-dead-note";
  deadNote.textContent = text.deadHint;
  settingsGroup.append(levelLabel, deadLabel, deadNote);
  settings?.append(settingsGroup);

  const controls = context.controlsHost ?? context.host;
  const tools = document.createElement("div");
  tools.className = "sokoban-tools";
  const pad = document.createElement("div");
  pad.className = "sokoban-pad";
  pad.setAttribute("role", "group");
  pad.setAttribute("aria-label", ko ? "이동 방향" : "Movement");
  const makeButton = (
    action: "up" | "down" | "left" | "right",
    label: string,
    symbol: string,
    place: string,
  ) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sokoban-direction";
    button.dataset.direction = action;
    button.style.gridArea = place;
    button.textContent = symbol;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => move(action));
    return button;
  };
  pad.append(
    makeButton("up", text.up, "▲", "1 / 2"),
    makeButton("left", text.left, "◀", "2 / 1"),
    makeButton("down", text.down, "▼", "2 / 2"),
    makeButton("right", text.right, "▶", "2 / 3"),
  );
  const actions = document.createElement("div");
  actions.className = "sokoban-actions";
  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.textContent = "↶ " + text.undo;
  undoButton.addEventListener("click", undo);
  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "↻ " + text.reset;
  resetButton.addEventListener("click", reset);
  const solveButton = document.createElement("button");
  solveButton.type = "button";
  solveButton.textContent = "✦ " + text.solve;
  solveButton.addEventListener("click", requestSolution);
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "→ " + text.next;
  nextButton.hidden = true;
  nextButton.addEventListener("click", nextLevel);
  actions.append(undoButton, resetButton, solveButton, nextButton);
  tools.append(pad, actions);
  controls.append(tools);

  const directionForKey = new Map<string, "up" | "down" | "left" | "right">([
    ["ArrowUp", "up"],
    ["w", "up"],
    ["W", "up"],
    ["ArrowDown", "down"],
    ["s", "down"],
    ["S", "down"],
    ["ArrowLeft", "left"],
    ["a", "left"],
    ["A", "left"],
    ["ArrowRight", "right"],
    ["d", "right"],
    ["D", "right"],
  ]);
  const keydown = (event: KeyboardEvent) => {
    const direction = directionForKey.get(event.key);
    if (!direction || !active) return;
    event.preventDefault();
    event.stopPropagation();
    move(direction);
  };
  root.addEventListener("keydown", keydown);
  tools.addEventListener("keydown", keydown);

  let worker: Worker | undefined;
  try {
    worker = new Worker(new URL("./solver.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch {
    solverUnavailable = true;
  }
  if (worker)
    worker.onmessage = (
      event: MessageEvent<{
        requestId: number;
        path?: number[] | null;
        gaveUp?: boolean;
        error?: boolean;
      }>,
    ) => {
      if (destroyed || event.data.requestId !== solverRequestId) return;
      solving = false;
      if (event.data.error) {
        setStatus(text.solverError);
        render();
        return;
      }
      if (event.data.path === null || !Array.isArray(event.data.path)) {
        setStatus(event.data.gaveUp ? text.limit : text.unsolvable);
        render();
        return;
      }
      solution = event.data.path;
      solutionStep = 0;
      animating = solution.length > 0;
      setStatus(text.searching);
      render();
      if (active) advanceSolution();
    };
  if (worker)
    worker.onerror = () => {
      solving = false;
      solverUnavailable = true;
      setStatus(text.solverError);
      render();
    };

  let floorLevel: Level | undefined;
  let floorCells: boolean[] = [];
  const getFloorCells = () => {
    if (floorLevel === level) return floorCells;
    const seen = new Array<boolean>(level.walls.length).fill(false);
    const queue = [level.player];
    seen[level.player] = true;
    for (let i = 0; i < queue.length; i++) {
      const cell = queue[i]!;
      for (const delta of [-level.width, level.width, -1, 1]) {
        const next = cell + delta;
        if (next < 0 || next >= level.walls.length || seen[next]) continue;
        if (
          (delta === -1 || delta === 1) &&
          Math.floor(cell / level.width) !== Math.floor(next / level.width)
        )
          continue;
        if (level.walls[next]) continue;
        seen[next] = true;
        queue.push(next);
      }
    }
    floorLevel = level;
    floorCells = seen;
    return floorCells;
  };

  const resizeBoard = () => {
    const available = Math.max(0, root.clientWidth - 30);
    const cell = Math.floor(
      Math.min(54, (available - (level.width - 1) * 4) / level.width),
    );
    const cellSize = Math.max(22, cell) + "px";
    if (boardElement.style.getPropertyValue("--sokoban-cell") !== cellSize) {
      motion.finish();
      boardElement.style.setProperty("--sokoban-cell", cellSize);
    }
  };
  const scheduleResize = () => {
    if (resizeFrame !== undefined) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = undefined;
      resizeBoard();
    });
  };
  const resizeObserver = new ResizeObserver(scheduleResize);
  resizeObserver.observe(root);

  const saveProgress = () => {
    context.onSave?.();
  };

  const motion = createMotion(context.host);
  let drawnPlayer = -1,
    drawnBoxes: number[] = [],
    drawnLevel = -1;
  const render = () => {
    motion.finish();
    const oldRects = new Map(
      Array.from(
        boardElement.querySelectorAll<HTMLElement>("[data-position]"),
      ).map((cell) => [
        Number(cell.dataset.position),
        cell.getBoundingClientRect(),
      ]),
    );
    const dead = showDead ? deadSquares(level) : [];
    const boxSet = new Set(boxes);
    const floor = getFloorCells();
    boardElement.replaceChildren();
    boardElement.style.setProperty("--sokoban-cols", String(level.width));
    boardElement.setAttribute("aria-rowcount", String(level.height));
    boardElement.setAttribute("aria-colcount", String(level.width));
    heading.textContent = text.puzzle + " " + String(currentLevel + 1);
    const goalPositions = level.goals
      .map((isGoal, index) => (isGoal ? index : -1))
      .filter((index) => index >= 0)
      .map(describePosition)
      .join(ko ? ", " : "; ");
    const cratePositions = boxes.map(describePosition).join(ko ? ", " : "; ");
    const wallPositions = level.walls
      .map((isWall, index) => (isWall ? index : -1))
      .filter((index) => index >= 0);
    const emptyPositions = level.walls
      .map((isWall, index) => (!isWall && !floor[index] ? index : -1))
      .filter((index) => index >= 0);
    const mapDescription = ko
      ? `행별 벽 위치: ${describeMapPositions(wallPositions)}. 빈 공간: ${describeMapPositions(emptyPositions) || "없음"}. 그 밖의 칸은 관리인, 상자, 목표 칸이 아닌 경우 걸을 수 있는 바닥이에요.`
      : `Walls by row: ${describeMapPositions(wallPositions)}. Empty spaces: ${describeMapPositions(emptyPositions) || "none"}. Other cells are walkable floor unless listed as the keeper, a crate, or a goal.`;
    boardDescription.textContent = ko
      ? `${currentLevel + 1}번 퍼즐. ${level.height}행 ${level.width}열 보드. 관리인 ${describePosition(player)}. 목표 칸: ${goalPositions}. 상자: ${cratePositions}. ${mapDescription}`
      : `Puzzle ${currentLevel + 1}. ${level.height} rows, ${level.width} columns. Keeper at ${describePosition(player)}. Goals: ${goalPositions}. Crates: ${cratePositions}. ${mapDescription}`;
    counts.textContent =
      text.moves +
      ": " +
      String(moves) +
      " · " +
      text.pushes +
      ": " +
      String(pushes);
    for (let rowIndex = 0; rowIndex < level.height; rowIndex++) {
      const row = document.createElement("div");
      row.className = "sokoban-row";
      row.setAttribute("role", "row");
      row.setAttribute("aria-rowindex", String(rowIndex + 1));
      for (let column = 0; column < level.width; column++) {
        const index = rowIndex * level.width + column;
        const cell = document.createElement("div");
        const isVoid = !level.walls[index] && !floor[index];
        cell.className = level.walls[index]
          ? "sokoban-cell sokoban-wall"
          : isVoid
            ? "sokoban-cell sokoban-void"
            : "sokoban-cell sokoban-floor";
        cell.dataset.position = String(index);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-colindex", String(column + 1));
        if (level.goals[index] && !level.walls[index])
          cell.classList.add("sokoban-goal");
        if (showDead && dead[index] && !isVoid)
          cell.classList.add("sokoban-dead");
        const labels = [
          level.walls[index] ? text.wall : isVoid ? text.void : text.floor,
          level.goals[index] ? text.goal : "",
        ].filter(Boolean);
        if (boxSet.has(index)) {
          const piece = document.createElement("span");
          piece.className = level.goals[index]
            ? "sokoban-piece sokoban-box sokoban-box-goal"
            : "sokoban-piece sokoban-box";
          piece.setAttribute("aria-hidden", "true");
          cell.append(piece);
          labels.push(text.box);
        } else if (player === index) {
          const piece = document.createElement("span");
          piece.className = "sokoban-piece sokoban-keeper";
          piece.setAttribute("aria-hidden", "true");
          cell.append(piece);
          labels.push(text.keeper);
        }
        cell.setAttribute("aria-label", labels.join(", "));
        row.append(cell);
      }
      boardElement.append(row);
    }
    const animated: HTMLElement[] = [];
    if (drawnLevel === currentLevel && drawnPlayer >= 0 && motion.enabled()) {
      const routes: { from: number; to: number; selector: string }[] = [];
      if (drawnPlayer !== player)
        routes.push({
          from: drawnPlayer,
          to: player,
          selector: ".sokoban-keeper",
        });
      const removed = drawnBoxes.filter((index) => !boxes.includes(index));
      const added = boxes.filter((index) => !drawnBoxes.includes(index));
      if (removed.length === 1 && added.length === 1)
        routes.push({
          from: removed[0]!,
          to: added[0]!,
          selector: ".sokoban-box",
        });
      if (routes.length)
        motion.run(
          (timeline) => {
            for (const route of routes) {
              const piece = boardElement.querySelector<HTMLElement>(
                `[data-position="${route.to}"] ${route.selector}`,
              );
              const from = oldRects.get(route.from),
                to = boardElement
                  .querySelector<HTMLElement>(`[data-position="${route.to}"]`)
                  ?.getBoundingClientRect();
              if (!piece || !from || !to) continue;
              animated.push(piece);
              timeline.fromTo(
                piece,
                { x: from.left - to.left, y: from.top - to.top },
                { x: 0, y: 0, duration: 0.16, ease: "power2.out" },
                0,
              );
              if (route.selector === ".sokoban-box" && level.goals[route.to])
                timeline.fromTo(
                  piece,
                  { scale: 1.12 },
                  { scale: 1, duration: 0.16, ease: "back.out(1.5)" },
                  0.16,
                );
            }
          },
          () => {
            if (animated.length)
              gsap.set(animated, { clearProps: "transform" });
          },
        );
    }
    drawnPlayer = player;
    drawnBoxes = [...boxes];
    drawnLevel = currentLevel;
    const won = isWon(level, boxes);
    undoButton.disabled =
      !active || history.length === 0 || animating || solving;
    resetButton.disabled = !active || solving;
    solveButton.disabled =
      !active || solverUnavailable || solving || animating || won;
    pad.querySelectorAll("button").forEach((button) => {
      (button as HTMLButtonElement).disabled =
        !active || solving || animating || won;
    });
    nextButton.hidden = !won || completed.size === LEVELS.length;
    nextButton.disabled = !active || solving || animating;
    deadToggle.checked = showDead;
    context.onChange(completed.size);
    resizeBoard();
  };

  const finishLevel = () => {
    if (moves === 0 || !isWon(level, boxes)) return;
    const wasCompleted = completed.has(currentLevel);
    completed.add(currentLevel);
    setStatus(completed.size === LEVELS.length ? text.allSolved : text.solved);
    if (!wasCompleted) {
      context.sound();
      saveProgress();
    }
    if (!ended && completed.size === LEVELS.length) {
      ended = true;
      active = false;
      context.onEnd({
        score: completed.size,
        won: true,
        message: text.allSolved,
      });
    }
  };

  function move(direction: "up" | "down" | "left" | "right") {
    if (!active || solving || animating || ended || isWon(level, boxes)) return;
    const delta =
      direction === "up"
        ? -level.width
        : direction === "down"
          ? level.width
          : direction === "left"
            ? -1
            : 1;
    const result = stepPlayer(level, boxes, player, delta);
    if (!result) return;
    const previousBoxes = boxes;
    history.push({
      boxes: boxes.slice(),
      player,
      pushed: result.pushed,
    });
    boxes = result.boxes;
    player = result.player;
    moves++;
    if (result.pushed) pushes++;
    announcePosition(text.moved, text.directionNames[direction]);
    if (result.pushed) {
      const crate = result.boxes.find((box) => !previousBoxes.includes(box));
      if (crate !== undefined) announceCrate(crate);
    }
    context.sound();
    finishLevel();
    render();
  }

  function undo() {
    if (!active || solving || animating) return;
    const previous = history.pop();
    if (!previous) return;
    const currentBoxes = boxes;
    boxes = previous.boxes;
    player = previous.player;
    moves = Math.max(0, moves - 1);
    if (previous.pushed) pushes = Math.max(0, pushes - 1);
    setStatus("");
    announcePosition(text.undone);
    if (previous.pushed) {
      const restoredCrate = boxes.find((box) => !currentBoxes.includes(box));
      if (restoredCrate !== undefined) announceCrate(restoredCrate);
    }
    render();
  }

  function cancelAnimation() {
    if (animationTimer !== undefined) {
      window.clearTimeout(animationTimer);
      animationTimer = undefined;
    }
  }

  function reset() {
    cancelAnimation();
    solverRequestId++;
    solving = false;
    animating = false;
    solution = [];
    solutionStep = 0;
    ended = false;
    boxes = level.boxes.slice();
    player = level.player;
    moves = 0;
    pushes = 0;
    history = [];
    setStatus(solverUnavailable ? text.solverError : text.loading);
    render();
    saveProgress();
  }

  function loadLevel(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= LEVELS.length) return;
    cancelAnimation();
    solverRequestId++;
    solving = false;
    animating = false;
    solution = [];
    solutionStep = 0;
    currentLevel = index;
    level = parseLevel(LEVELS[currentLevel]!.text);
    boxes = level.boxes.slice();
    player = level.player;
    moves = 0;
    pushes = 0;
    history = [];
    ended = false;
    levelSelect.value = String(currentLevel);
    setStatus(
      solverUnavailable
        ? text.solverError
        : completed.has(currentLevel)
          ? text.replaying
          : text.puzzle + " " + String(currentLevel + 1),
    );
    render();
    saveProgress();
  }

  function nextLevel() {
    if (!active || !isWon(level, boxes)) return;
    const next = LEVELS.findIndex(
      (_, index) => index > currentLevel && !completed.has(index),
    );
    const firstIncomplete = LEVELS.findIndex(
      (_, index) => !completed.has(index),
    );
    loadLevel(next >= 0 ? next : firstIncomplete >= 0 ? firstIncomplete : 0);
  }

  function requestSolution() {
    if (
      !active ||
      solverUnavailable ||
      !worker ||
      solving ||
      animating ||
      ended ||
      isWon(level, boxes)
    )
      return;
    solving = true;
    solverRequestId++;
    setStatus(text.searching);
    render();
    worker.postMessage({
      type: "solve",
      requestId: solverRequestId,
      level: {
        ...level,
        boxes: boxes.slice(),
        player,
      },
    });
  }

  function advanceSolution() {
    if (!active || destroyed || !animating) return;
    if (solutionStep >= solution.length) {
      animating = false;
      finishLevel();
      render();
      return;
    }
    const target = solution[solutionStep++]!;
    const delta = target - player;
    const result = stepPlayer(level, boxes, player, delta);
    if (!result) {
      animating = false;
      setStatus(text.solverError);
      render();
      return;
    }
    history.push({
      boxes: boxes.slice(),
      player,
      pushed: result.pushed,
    });
    boxes = result.boxes;
    player = result.player;
    moves++;
    if (result.pushed) pushes++;
    finishLevel();
    render();
    if (animating && active) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      animationTimer = window.setTimeout(advanceSolution, reduced ? 0 : 120);
    }
  }

  const onLevelChange = () => {
    const index = Number.parseInt(levelSelect.value, 10);
    loadLevel(index);
  };
  levelSelect.addEventListener("change", onLevelChange);
  deadToggle.addEventListener("change", () => {
    showDead = deadToggle.checked;
    render();
  });

  setStatus(solverUnavailable ? text.solverError : text.loading);
  render();
  context.onReady?.({ width: 1, height: 1 });
  const instance: GameInstance = {
    start() {
      active = true;
      if (animating) advanceSolution();
      render();
      boardElement.focus({ preventScroll: true });
    },
    pause() {
      active = false;
      cancelAnimation();
      render();
    },
    resume() {
      active = true;
      if (animating) advanceSolution();
      render();
      boardElement.focus({ preventScroll: true });
    },
    restart() {
      active = true;
      reset();
      boardElement.focus({ preventScroll: true });
    },
    action(action) {
      if (
        action === "up" ||
        action === "down" ||
        action === "left" ||
        action === "right"
      )
        move(action);
    },
    serialize(): Saved {
      return {
        version: 1,
        level: currentLevel,
        completed: [...completed].sort((a, b) => a - b),
      };
    },
    destroy() {
      motion.destroy();
      destroyed = true;
      active = false;
      cancelAnimation();
      if (resizeFrame !== undefined) {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = undefined;
      }
      worker?.terminate();
      root.removeEventListener("keydown", keydown);
      tools.removeEventListener("keydown", keydown);
      levelSelect.removeEventListener("change", onLevelChange);
      resizeObserver.disconnect();
      root.remove();
      settingsGroup.remove();
      tools.remove();
    },
  };
  return instance;
};
