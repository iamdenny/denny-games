import { createMotion } from "../../lib/motion";
import { animateBoard } from "./motion";
import type { GameFactory, Action } from "../../lib/types";
import { read, write } from "../../lib/storage";
import {
  initial,
  restore,
  legal,
  play,
  owner,
  dimensions,
  type BoardKind,
  type Move,
} from "./rules";
import { chooseMove } from "./ai";
import "./style.css";
export const createMount =
  (kind: BoardKind): GameFactory =>
  (ctx) => {
    const ko = ctx.locale === "ko",
      tr = (en: string, kr: string) => (ko ? kr : en);
    const saved = ctx.saved as
      { position?: unknown; mode?: unknown; level?: unknown } | undefined;
    let position = restore(kind, saved?.position) ?? initial(kind),
      active = false,
      destroyed = false,
      worker: Worker | undefined,
      timer: ReturnType<typeof setTimeout> | undefined;
    let mode =
      saved?.mode === "local"
        ? "local"
        : saved?.mode === "ai"
          ? "ai"
          : read<string>(`board-mode:${kind}`, "ai") === "local"
            ? "local"
            : "ai";
    let level =
      typeof saved?.level === "number" && [1, 2, 3].includes(saved.level)
        ? saved.level
        : read<number>(`board-level:${kind}`, 2);
    if (![1, 2, 3].includes(level)) level = 2;
    let cursor = kind === "gomoku" ? 112 : 0,
      source = -1,
      preview: Move | undefined,
      revision = 0;
    const shell = document.createElement("div");
    shell.className = `classic-game ${kind}`;
    shell.dataset.boardKind = kind;
    const toolbar = document.createElement("div");
    toolbar.className = "board-toolbar";
    const modeChoice = document.createElement("fieldset");
    modeChoice.className = "board-mode-choice";
    modeChoice.dataset.boardModeChoice = "";
    const modeLegend = document.createElement("legend");
    modeLegend.textContent = tr("Choose who to play with", "누구와 둘까요?");
    modeChoice.append(modeLegend);
    const modeRadios: HTMLInputElement[] = [];
    function choice(
      label: string,
      values: [string, string][],
      value: string,
      change: (value: string) => void,
    ) {
      const wrap = document.createElement("label");
      wrap.textContent = label;
      const select = document.createElement("select");
      for (const [key, text] of values) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = text;
        select.append(option);
      }
      select.value = value;
      select.addEventListener("change", () => change(select.value));
      wrap.append(select);
      toolbar.append(wrap);
      return select;
    }
    let modeSelect: HTMLSelectElement | undefined;
    const changeMode = (value: string) => {
      if (value !== "ai" && value !== "local") return;
      mode = value;
      write(`board-mode:${kind}`, mode);
      if (modeSelect) modeSelect.value = mode;
      for (const radio of modeRadios) radio.checked = radio.value === mode;
      reset();
    };
    const modeChoices: [string, string, string][] = [
      [
        "ai",
        tr("Play against AI", "AI와 대국"),
        tr("Play solo", "혼자 플레이"),
      ],
      [
        "local",
        tr("Two players", "같은 기기 2인"),
        tr("Take turns on this device", "기기 하나에서 번갈아 두기"),
      ],
    ];
    for (const [value, title, detail] of modeChoices) {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `${kind}-mode-choice`;
      radio.value = value;
      radio.checked = mode === value;
      radio.dataset.boardModeSetup = value;
      radio.addEventListener("change", () => {
        if (radio.checked) changeMode(radio.value);
      });
      const copy = document.createElement("span");
      copy.className = "board-mode-copy";
      const heading = document.createElement("strong");
      heading.textContent = title;
      const description = document.createElement("small");
      description.textContent = detail;
      copy.append(heading, description);
      label.append(radio, copy);
      modeChoice.append(label);
      modeRadios.push(radio);
    }
    ctx.setupHost?.append(modeChoice);
    modeSelect = choice(
      tr("New game mode", "새 대국 방식"),
      [
        ["ai", tr("Against AI", "AI 대전")],
        ["local", tr("Local two-player", "같은 기기 2인")],
      ],
      mode,
      changeMode,
    );
    modeSelect.dataset.boardMode = "";
    const levelSelect = choice(
      tr("New game AI level", "새 대국 AI 난이도"),
      [
        ["1", tr("Easy", "쉬움")],
        ["2", tr("Normal", "보통")],
        ["3", tr("Hard", "어려움")],
      ],
      String(level),
      (v) => {
        level = Number(v);
        write(`board-level:${kind}`, level);
        reset();
      },
    );
    levelSelect.dataset.boardLevel = "";
    const status = document.createElement("p");
    status.className = "board-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const board = document.createElement("div");
    board.className = "classic-board";
    board.tabIndex = 0;
    board.setAttribute("role", "group");
    board.setAttribute(
      "aria-label",
      tr(
        "Game board. Arrows select, Enter previews and confirms.",
        "게임판. 방향키 선택, Enter 미리보기·확정.",
      ),
    );
    const selection = document.createElement("p");
    selection.className = "board-selection";
    selection.setAttribute("aria-live", "polite");
    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = "board-confirm";
    confirm.textContent = tr("Confirm move", "선택한 수 두기");
    confirm.dataset.boardConfirm = "";
    confirm.addEventListener("click", commit);
    const controls = document.createElement("div");
    controls.className = "board-directions";
    for (const [value, label] of [
      ["up", "↑"],
      ["left", "←"],
      ["down", "↓"],
      ["right", "→"],
    ] as [Action, string][]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.setAttribute(
        "aria-label",
        tr(
          `Select ${value}`,
          {
            up: "위 선택",
            left: "왼쪽 선택",
            down: "아래 선택",
            right: "오른쪽 선택",
            confirm: "확정",
          }[value],
        ),
      );
      button.addEventListener("click", () => action(value));
      controls.append(button);
    }
    const note = document.createElement("p");
    note.className = "board-help";
    note.textContent = tr(
      kind === "checkers"
        ? "Select a piece, then click a marked destination to move. Changing mode or level starts a new game."
        : "Select a space, column or edge to preview; select it again to play. Changing mode or level starts a new game.",
      kind === "checkers"
        ? "말을 고른 뒤 표시된 목적지를 누르면 이동합니다. 방식·난이도를 바꾸면 새 대국을 시작합니다."
        : "칸·열·선을 눌러 미리 보고 같은 곳을 다시 누르면 둡니다. 방식·난이도를 바꾸면 새 대국을 시작합니다.",
    );
    const options = document.createElement("div");
    options.className = "board-options";
    options.append(toolbar, note, controls);
    const actions = document.createElement("div");
    actions.className = "board-actions";
    actions.append(selection, confirm);
    const tools = document.createElement("div");
    tools.className = "board-tools";
    tools.append(status, actions);
    if (ctx.controlsHost) {
      ctx.controlsHost.append(tools);
      shell.dataset.externalControls = "true";
      shell.append(board);
    } else shell.append(status, board, actions);
    if (ctx.settingsHost) ctx.settingsHost.append(options);
    else shell.prepend(options);
    ctx.host.append(shell);
    const motion = createMotion(ctx.host);
    const resize = new ResizeObserver(() => motion.finish());
    resize.observe(board);
    const human = () =>
      active && !position.winner && (mode === "local" || position.turn === 1);
    const sideName = (side: number) =>
      side === 1 ? tr("Mint", "민트") : tr("Coral", "코랄");
    function resultText() {
      return position.winner === 3
        ? tr("Draw.", "무승부입니다.")
        : tr(
            `${sideName(position.winner)} wins.`,
            `${sideName(position.winner)} 승리!`,
          );
    }
    function stop() {
      revision++;
      if (timer) clearTimeout(timer);
      timer = undefined;
      worker?.terminate();
      worker = undefined;
    }
    function reset() {
      stop();
      position = initial(kind);
      source = -1;
      preview = undefined;
      cursor = kind === "gomoku" ? 112 : 0;
      ctx.onChange(0);
      render();
      schedule();
    }
    function render() {
      motion.finish();
      const moves = legal(position),
        [w] = dimensions(kind);
      shell.dataset.turn = String(position.turn);
      shell.dataset.moves = String(position.moves);
      shell.dataset.aiTurn = String(
        mode === "ai" && position.turn === 2 && !position.winner,
      );
      let count = "";
      if (kind === "reversi")
        count = ` · ${position.cells.filter((v) => v === 1).length} : ${position.cells.filter((v) => v === 2).length}`;
      if (kind === "dots-and-boxes")
        count = ` · ${position.boxes.filter((v) => v === 1).length} : ${position.boxes.filter((v) => v === 2).length}`;
      status.textContent = position.winner
        ? resultText()
        : `${sideName(position.turn)} ${mode === "ai" && position.turn === 2 ? tr("is thinking…", "생각 중…") : tr("to move", "차례")}${count}`;
      if (
        kind === "checkers" &&
        moves[0]?.from !== undefined &&
        Math.abs(
          Math.floor(moves[0].from / 8) - Math.floor(moves[0].to / 8),
        ) === 2 &&
        !position.winner
      )
        status.textContent +=
          position.forced >= 0
            ? tr(
                " · Continue jumping with the same piece",
                " · 같은 말로 연속 잡기",
              )
            : tr(" · Capture required", " · 잡기가 필수예요");
      status.dataset.side = String(position.turn);
      board.style.setProperty("--board-size", String(w));
      board.replaceChildren();
      function cell(index: number, value: number, extra = "") {
        const button = document.createElement("button");
        button.type = "button";
        button.tabIndex = -1;
        button.dataset.cell = String(index);
        button.className = `board-cell ${extra}`;
        const available = moves.some(
          (m) => m.to === index && (kind !== "checkers" || m.from === source),
        );
        button.classList.toggle("legal", available);
        button.classList.toggle(
          "movable",
          kind === "checkers" && moves.some((m) => m.from === index),
        );
        button.classList.toggle("cursor", index === cursor);
        button.classList.toggle("preview", preview?.to === index);
        button.classList.toggle("source", index === source);
        button.classList.toggle("last", index === position.last);
        if (value) {
          const stone = document.createElement("span");
          stone.className = `board-piece side-${owner(value)}`;
          if (value > 2) {
            stone.textContent = "♛";
            stone.classList.add("king");
          }
          button.append(stone);
        }
        button.setAttribute(
          "aria-label",
          kind === "dots-and-boxes"
            ? tr(
                `Edge ${index + 1}${value ? ", claimed" : ""}`,
                `선 ${index + 1}${value ? ", 선택됨" : ""}`,
              )
            : tr(
                `Row ${Math.floor(index / w!) + 1}, column ${(index % w!) + 1}, ${value ? `${sideName(owner(value))}${value > 2 ? " king" : ""}` : "empty"}${available ? ", legal move" : ""}`,
                `${Math.floor(index / w!) + 1}행 ${(index % w!) + 1}열, ${value ? `${sideName(owner(value))}${value > 2 ? " 킹" : ""}` : "빈칸"}${available ? ", 가능한 수" : ""}`,
              ),
        );
        button.setAttribute(
          "aria-pressed",
          String(preview?.to === index || source === index),
        );
        button.addEventListener("click", () => {
          if (!human()) return;
          if (kind === "checkers") {
            select(index);
            if (preview) commit();
          } else if (
            preview &&
            (kind === "four-in-a-row"
              ? preview.to % 7 === index % 7
              : preview.to === index)
          )
            commit();
          else select(index);
        });
        return button;
      }
      if (kind === "dots-and-boxes") {
        for (let y = 0; y < 9; y++)
          for (let x = 0; x < 9; x++) {
            if (y % 2 === 0 && x % 2 === 0) {
              const dot = document.createElement("span");
              dot.className = "box-dot";
              board.append(dot);
            } else if (y % 2 && x % 2) {
              const box = document.createElement("span");
              const v =
                position.boxes[Math.floor(y / 2) * 4 + Math.floor(x / 2)]!;
              box.className = `box-fill side-${v}`;
              box.textContent = v ? sideName(v).slice(0, 1) : "";
              board.append(box);
            } else {
              const index =
                y % 2 === 0
                  ? (y / 2) * 4 + Math.floor(x / 2)
                  : 20 + Math.floor(y / 2) * 5 + x / 2;
              const button = cell(
                index,
                0,
                y % 2 === 0 ? "edge horizontal" : "edge vertical",
              );
              button.dataset.side = String(position.cells[index]);
              button.setAttribute(
                "aria-label",
                tr(
                  `Edge ${index + 1}${position.cells[index] ? ", claimed" : ""}`,
                  `선 ${index + 1}${position.cells[index] ? ", 선택됨" : ""}`,
                ),
              );
              board.append(button);
            }
          }
      } else
        position.cells.forEach((v, i) =>
          board.append(
            cell(
              i,
              v,
              kind === "checkers"
                ? (Math.floor(i / 8) + (i % 8)) % 2
                  ? "dark-square"
                  : "light-square"
                : "",
            ),
          ),
        );
      confirm.disabled = !human() || !preview;
      levelSelect.disabled = mode === "local";
      selection.textContent =
        source >= 0 && !preview
          ? tr(
              "Piece selected. Choose a highlighted destination.",
              "말을 골랐어요. 표시된 목적지를 선택하세요.",
            )
          : preview
            ? kind === "dots-and-boxes"
              ? tr(
                  `Edge ${preview.to + 1}. Select again to draw.`,
                  `선 ${preview.to + 1} 선택. 다시 누르면 그립니다.`,
                )
              : tr(
                  `Row ${Math.floor(preview.to / w!) + 1}, column ${(preview.to % w!) + 1}. Select again to play.`,
                  `${Math.floor(preview.to / w!) + 1}행 · ${(preview.to % w!) + 1}열 선택. 다시 누르면 둡니다.`,
                )
            : kind === "checkers"
              ? tr(
                  "Choose a highlighted piece, then its destination.",
                  "표시된 말을 고른 뒤 목적지를 선택하세요.",
                )
              : tr("Choose a legal space.", "가능한 칸을 선택하세요.");
    }
    function select(index: number) {
      if (!human()) return;
      cursor = index;
      if (
        kind === "checkers" &&
        owner(position.cells[index]!) === position.turn &&
        (position.forced < 0 || position.forced === index) &&
        legal(position).some((m) => m.from === index)
      ) {
        source = index;
        preview = undefined;
      } else {
        const moves = legal(position);
        preview = moves.find((m) =>
          kind === "four-in-a-row"
            ? m.to % 7 === index % 7
            : m.to === index && (kind !== "checkers" || m.from === source),
        );
      }
      if (preview) cursor = preview.to;
      render();
      board.focus({ preventScroll: true });
    }
    function apply(move: Move) {
      const next = play(position, move);
      if (next === position) return;
      const cue = next.winner
        ? next.winner === 3
          ? "draw"
          : mode === "local" || next.winner === 1
            ? "win"
            : "lose"
        : kind === "gomoku"
          ? "stone"
          : kind === "four-in-a-row"
            ? "drop"
            : kind === "reversi"
              ? "flip"
              : kind === "checkers"
                ? Math.abs(
                    Math.floor(move.from! / 8) - Math.floor(move.to / 8),
                  ) === 2
                  ? "capture"
                  : "step"
                : next.boxes.some((v, i) => v !== position.boxes[i])
                  ? "box"
                  : "line";
      motion.finish();
      const before = position;
      const oldRects = new Map(
        Array.from(board.querySelectorAll<HTMLElement>("[data-cell]")).map(
          (cell) => [Number(cell.dataset.cell), cell.getBoundingClientRect()],
        ),
      );
      position = next;
      preview = undefined;
      source = position.forced;
      cursor = position.last;
      ctx.sound(cue);
      ctx.onChange(position.moves);
      render();
      animateBoard(
        motion,
        board,
        kind,
        before.cells,
        position.cells,
        move,
        oldRects,
        before.boxes,
        position.boxes,
      );
      if (position.winner) {
        active = false;
        ctx.onEnd({
          won:
            position.winner !== 3 &&
            (mode === "local" || position.winner === 1),
          score: position.moves,
          message: resultText(),
          draw: position.winner === 3,
        });
      } else schedule();
    }
    function commit() {
      if (human() && preview) apply(preview);
      board.focus({ preventScroll: true });
    }
    function fallback() {
      if (!active || destroyed) return;
      const move = chooseMove(position, 1);
      if (move) apply(move);
    }
    function schedule() {
      stop();
      if (
        !active ||
        destroyed ||
        position.winner ||
        mode !== "ai" ||
        position.turn !== 2
      )
        return;
      const request = revision;
      timer = setTimeout(() => {
        timer = undefined;
        try {
          worker = new Worker(new URL("./ai.worker.ts", import.meta.url), {
            type: "module",
          });
          worker.onmessage = (event: MessageEvent<Move>) => {
            if (request !== revision) return;
            worker?.terminate();
            worker = undefined;
            if (
              active &&
              !destroyed &&
              event.data &&
              legal(position).some(
                (m) => m.to === event.data.to && m.from === event.data.from,
              )
            )
              apply(event.data);
          };
          worker.onerror = () => {
            if (request !== revision) return;
            worker?.terminate();
            worker = undefined;
            fallback();
          };
          worker.postMessage({ position, level });
        } catch {
          fallback();
        }
      }, 220);
    }
    function action(value: Action) {
      if (!human()) return;
      if (value === "confirm") {
        if (preview && preview.to === cursor) commit();
        else select(cursor);
        return;
      }
      preview = undefined;
      if (kind === "dots-and-boxes")
        cursor =
          (cursor +
            (value === "left"
              ? -1
              : value === "right"
                ? 1
                : value === "up"
                  ? -4
                  : 4) +
            40) %
          40;
      else {
        const [w, h] = dimensions(kind);
        let x = cursor % w!,
          y = Math.floor(cursor / w!);
        if (value === "left") x = (x + w! - 1) % w!;
        if (value === "right") x = (x + 1) % w!;
        if (value === "up") y = (y + h! - 1) % h!;
        if (value === "down") y = (y + 1) % h!;
        cursor = y * w! + x;
      }
      render();
      board.focus({ preventScroll: true });
    }
    function run() {
      active = true;
      render();
      if (position.winner) {
        active = false;
        ctx.onEnd({
          won:
            position.winner !== 3 &&
            (mode === "local" || position.winner === 1),
          score: position.moves,
          message: resultText(),
          draw: position.winner === 3,
        });
      } else schedule();
    }
    render();
    ctx.onChange(position.moves);
    return {
      start: run,
      resume: run,
      pause() {
        motion.finish();
        active = false;
        stop();
      },
      restart: reset,
      action,
      serialize() {
        return { position, mode, level };
      },
      destroy() {
        resize.disconnect();
        motion.destroy();
        destroyed = true;
        active = false;
        stop();
        options.remove();
        modeChoice.remove();
        tools.remove();
        shell.remove();
      },
    };
  };
