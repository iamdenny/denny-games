import type { GameFactory } from "../../lib/types";
import {
  cardColor,
  cardRank,
  cardSuit,
  canMoveToFoundation,
  canMoveToTableau,
  cloneState,
  createGame,
  draw,
  findHint,
  foundationCount,
  isWon,
  moveToFoundation,
  moveToTableau,
  restore,
  type Card,
  type Destination,
  type DrawCount,
  type Hint,
  type Save,
  type Source,
  type State,
} from "./rules";
import "./style.css";

const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
const suitGlyphs = ["♥", "♦", "♣", "♠"] as const;
const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
const rankNames = [
  "Ace",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Jack",
  "Queen",
  "King",
] as const;
const koSuits = ["하트", "다이아몬드", "클럽", "스페이드"] as const;
const koRanks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;

function cardName(card: Card, ko: boolean): string {
  const suit = cardSuit(card);
  const rank = cardRank(card) - 1;
  return ko
    ? `${koSuits[suit]} ${koRanks[rank]}`
    : `${rankNames[rank]} of ${suits[suit]}`;
}

function makeButton(className: string, label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", label);
  button.title = label;
  return button;
}

function sourceFrom(button: HTMLButtonElement): Source | undefined {
  if (button.dataset.sourceType === "waste") return { type: "waste" };
  if (button.dataset.sourceType === "tableau") {
    const column = Number(button.dataset.sourceColumn);
    const index = Number(button.dataset.sourceIndex);
    if (Number.isInteger(column) && Number.isInteger(index))
      return { type: "tableau", column, index };
  }
  return undefined;
}

function sameSource(a: Source | undefined, b: Source | "stock"): boolean {
  if (!a || b === "stock" || a.type !== b.type) return false;
  return (
    a.type === "waste" ||
    (a.type === "tableau" &&
      b.type === "tableau" &&
      a.column === b.column &&
      a.index === b.index)
  );
}

function sameDestination(a: Destination | undefined, b: Destination): boolean {
  return (
    !!a &&
    a.type === b.type &&
    (a.type === "tableau"
      ? b.type === "tableau" && a.column === b.column
      : b.type === "foundation" && a.suit === b.suit)
  );
}

export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  const saved = restore(ctx.saved, ctx.seed);
  let state = saved?.state ?? createGame(ctx.seed, 1);
  let history = saved?.history.map(cloneState) ?? [];
  let nextDrawCount = saved?.nextDrawCount ?? state.drawCount;
  let active = false;
  let ended = false;
  let selected: Source | undefined;
  let hint: Hint | undefined;
  let message = "";
  let dealSequence = 0;

  function newDealSeed(): string {
    return `${ctx.seed}:deal:${Date.now().toString(36)}:${(++dealSequence).toString(36)}:${Math.random().toString(36).slice(2, 9)}`;
  }

  const board = document.createElement("div");
  board.className = "klondike-board";
  board.dataset.game = "klondike-solitaire";
  board.setAttribute("role", "group");
  board.setAttribute(
    "aria-label",
    ko ? "클론다이크 솔리테어 보드" : "Klondike solitaire board",
  );
  const top = document.createElement("div");
  top.className = "klondike-top-row";
  const tableau = document.createElement("div");
  tableau.className = "klondike-tableau";
  tableau.setAttribute("role", "group");
  tableau.setAttribute(
    "aria-label",
    ko ? "카드 열 일곱 개" : "Seven tableau columns",
  );
  const status = document.createElement("p");
  status.className = "klondike-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  board.append(top, tableau, status);
  ctx.host.append(board);

  const tools = document.createElement("div");
  tools.className = "klondike-tools";
  const toolHeading = document.createElement("p");
  toolHeading.className = "klondike-tools-heading";
  toolHeading.textContent = ko ? "한 판 더" : "Deal controls";
  const modeLabel = document.createElement("span");
  modeLabel.className = "klondike-mode-label";
  modeLabel.textContent = ko ? "다음 판 뽑기" : "Next deal draw";
  const modeChoices = document.createElement("div");
  modeChoices.className = "klondike-mode-choices";
  modeChoices.setAttribute("role", "group");
  modeChoices.setAttribute(
    "aria-label",
    ko ? "다음 판 뽑을 카드 수" : "Cards to draw in the next deal",
  );
  const drawButtons = ([1, 3] as const).map((count) => {
    const button = makeButton("klondike-tool-button klondike-draw-choice", "");
    button.dataset.drawChoice = String(count);
    button.textContent = ko ? `${count}장` : `Draw ${count}`;
    modeChoices.append(button);
    return button;
  });
  const newDeal = makeButton(
    "klondike-tool-button klondike-new-deal",
    ko ? "새 판 시작" : "New deal",
  );
  newDeal.textContent = ko ? "새 판 시작" : "New deal";
  const undo = makeButton(
    "klondike-tool-button",
    ko ? "한 수 되돌리기" : "Undo move",
  );
  undo.textContent = ko ? "↶ 되돌리기" : "↶ Undo";
  const hintButton = makeButton(
    "klondike-tool-button",
    ko ? "다음 수 힌트" : "Show a hint",
  );
  hintButton.textContent = ko ? "✦ 힌트" : "✦ Hint";
  tools.append(toolHeading, modeLabel, modeChoices, newDeal, undo, hintButton);
  (ctx.controlsHost ?? ctx.host).append(tools);

  const setup = document.createElement("div");
  setup.className = "klondike-setup";
  const setupLabel = document.createElement("p");
  setupLabel.textContent = ko
    ? "뽑기 방식을 골라 시작하세요."
    : "Choose a draw style to start.";
  const setupChoices = document.createElement("div");
  setupChoices.className = "klondike-mode-choices";
  setupChoices.setAttribute("role", "group");
  setupChoices.setAttribute("aria-label", ko ? "뽑기 방식" : "Draw style");
  const setupButtons = ([1, 3] as const).map((count) => {
    const button = makeButton("klondike-tool-button klondike-draw-choice", "");
    button.dataset.drawChoice = String(count);
    button.textContent = ko ? `${count}장 뽑기` : `Draw ${count}`;
    setupChoices.append(button);
    return button;
  });
  setup.append(setupLabel, setupChoices);
  ctx.setupHost?.append(setup);

  function setNextDraw(count: DrawCount): void {
    nextDrawCount = count;
    message =
      state.drawCount === count
        ? ko
          ? `${count}장씩 뽑는 방식이 선택됐어요.`
          : `Draw ${count} is selected for the next deal.`
        : ko
          ? `현재 판은 그대로예요. 새 판 시작을 누르면 ${count}장씩 뽑아요.`
          : `This deal stays as it is. Choose New deal to draw ${count}.`;
    setupLabel.textContent = ko
      ? `${count}장 뽑기가 선택됐어요.`
      : `Draw ${count} is selected.`;
    render();
    ctx.onSave?.();
  }

  for (const button of [...drawButtons, ...setupButtons]) {
    button.addEventListener("click", () => {
      const count = Number(button.dataset.drawChoice);
      if (count === 1 || count === 3) setNextDraw(count);
    });
  }

  function save(): Save {
    return {
      version: 1,
      routeSeed: ctx.seed,
      state: cloneState(state),
      history: history.map(cloneState),
      nextDrawCount,
    };
  }

  function push(next: State, focusKey?: string): void {
    if (history.length >= 120) history.shift();
    history.push(cloneState(state));
    state = next;
    selected = undefined;
    hint = undefined;
    message = "";
    if (isWon(state)) finish();
    else render(focusKey);
    ctx.onChange(foundationCount(state));
    ctx.onSave?.();
    ctx.sound();
  }

  function focusKey(button: HTMLButtonElement): string {
    return button.dataset.focusKey ?? "";
  }

  function isHintSource(button: HTMLButtonElement): boolean {
    if (!hint) return false;
    if (hint.source === "stock")
      return button.dataset.klondikeAction === "stock";
    return sameSource(sourceFrom(button), hint.source);
  }

  function isHintTarget(button: HTMLButtonElement): boolean {
    if (!hint || hint.source === "stock" || !hint.destination) return false;
    const suit = button.dataset.targetFoundation;
    if (suit !== undefined)
      return sameDestination(hint.destination, {
        type: "foundation",
        suit: Number(suit),
      });
    const column = button.dataset.targetTableau;
    return (
      column !== undefined &&
      sameDestination(hint.destination, {
        type: "tableau",
        column: Number(column),
      })
    );
  }

  function cardButton(
    card: Card,
    source: Source,
    columnTarget?: number,
  ): HTMLButtonElement {
    const cardLabel = cardName(card, ko);
    const button = makeButton("klondike-card", cardLabel);
    if (source.type === "tableau")
      button.setAttribute(
        "aria-label",
        ko
          ? `${cardLabel}, ${source.column + 1}열 ${source.index + 1}번째 카드`
          : `${cardLabel}, column ${source.column + 1}, card ${source.index + 1}`,
      );
    button.classList.toggle("is-red", cardColor(card) === "red");
    button.dataset.sourceType = source.type;
    if (source.type === "tableau") {
      button.dataset.sourceColumn = String(source.column);
      button.dataset.sourceIndex = String(source.index);
      button.dataset.focusKey = `card-${source.column}-${source.index}`;
      button.dataset.targetTableau = String(columnTarget ?? source.column);
    } else {
      button.dataset.focusKey = "waste";
    }
    const rank = document.createElement("span");
    rank.className = "klondike-card-rank";
    rank.textContent = ranks[cardRank(card) - 1]!;
    const glyph = document.createElement("span");
    glyph.className = "klondike-card-suit";
    glyph.textContent = suitGlyphs[cardSuit(card)]!;
    glyph.setAttribute("aria-hidden", "true");
    button.append(rank, glyph);
    const isSelected = sameSource(selected, source);
    button.setAttribute("aria-pressed", String(isSelected));
    if (isSelected) button.classList.add("is-selected");
    if (isHintSource(button)) button.classList.add("is-hinted");
    if (isHintTarget(button)) button.classList.add("is-hinted");
    return button;
  }

  function emptyColumnButton(column: number): HTMLButtonElement {
    const label = ko
      ? `${column + 1}열 빈자리 · K를 놓으세요`
      : `Column ${column + 1} empty space · move a King here`;
    const button = makeButton("klondike-empty-pile", label);
    button.dataset.targetTableau = String(column);
    button.dataset.focusKey = `column-${column}`;
    button.textContent = "K";
    button.classList.toggle(
      "is-hinted",
      !!hint &&
        hint.source !== "stock" &&
        hint.destination.type === "tableau" &&
        hint.destination.column === column,
    );
    return button;
  }

  function foundationButton(suit: number): HTMLButtonElement {
    const pile = state.foundations[suit]!;
    const label = ko
      ? `${koSuits[suit]} 기초 더미${pile.length ? ` · 맨 위 ${cardName(pile.at(-1)!, true)}` : " · 비어 있음"}`
      : `${suits[suit]} foundation${pile.length ? ` · top card ${cardName(pile.at(-1)!, false)}` : " · empty"}`;
    const button = makeButton("klondike-pile klondike-foundation", label);
    button.dataset.targetFoundation = String(suit);
    button.dataset.focusKey = `foundation-${suit}`;
    if (pile.length) {
      button.classList.add("has-card");
      const card = pile.at(-1)!;
      button.classList.toggle("is-red", cardColor(card) === "red");
      button.append(cardFace(card));
    } else {
      const mark = document.createElement("span");
      mark.textContent = suitGlyphs[suit]!;
      mark.setAttribute("aria-hidden", "true");
      button.append(mark);
    }
    if (isHintTarget(button)) button.classList.add("is-hinted");
    return button;
  }

  function cardFace(card: Card): HTMLElement {
    const face = document.createElement("span");
    face.className = "klondike-card-face";
    face.classList.toggle("is-red", cardColor(card) === "red");
    const rank = document.createElement("span");
    rank.className = "klondike-card-rank";
    rank.textContent = ranks[cardRank(card) - 1]!;
    const glyph = document.createElement("span");
    glyph.className = "klondike-card-suit";
    glyph.textContent = suitGlyphs[cardSuit(card)]!;
    glyph.setAttribute("aria-hidden", "true");
    face.append(rank, glyph);
    return face;
  }

  function createBack(): HTMLElement {
    const back = document.createElement("span");
    back.className = "klondike-card-back";
    back.setAttribute("aria-hidden", "true");
    return back;
  }

  function render(focusAfter?: string): void {
    const activeInsideBoard = board.contains(document.activeElement);
    const priorFocus = activeInsideBoard
      ? focusKey(document.activeElement as HTMLButtonElement)
      : "";
    board.dataset.stock = String(state.stock.length);
    board.dataset.waste = String(state.waste.length);
    board.dataset.drawCount = String(state.drawCount);
    board.dataset.moves = String(state.moves);
    board.dataset.foundations = String(foundationCount(state));
    top.replaceChildren();
    tableau.replaceChildren();

    const stockLabel = state.stock.length
      ? ko
        ? `덱에서 ${state.drawCount}장 뽑기 · ${state.stock.length}장 남음`
        : `Draw ${state.drawCount} from stock · ${state.stock.length} cards left`
      : state.waste.length
        ? ko
          ? "버린 카드를 덱으로 되돌리기"
          : "Recycle the waste into the stock"
        : ko
          ? "덱이 비었어요"
          : "Stock is empty";
    const stockButton = makeButton("klondike-pile klondike-stock", stockLabel);
    stockButton.dataset.klondikeAction = "stock";
    stockButton.dataset.focusKey = "stock";
    stockButton.disabled =
      !active || (!state.stock.length && !state.waste.length);
    if (state.stock.length) stockButton.append(createBack());
    else
      stockButton.textContent = state.waste.length
        ? ko
          ? "되돌리기"
          : "↶"
        : "—";
    if (isHintSource(stockButton)) stockButton.classList.add("is-hinted");
    top.append(stockButton);

    const waste = makeButton(
      "klondike-pile klondike-waste",
      state.waste.length
        ? ko
          ? `버린 카드 더미 · 맨 위 ${cardName(state.waste.at(-1)!, true)}`
          : `Waste pile · top card ${cardName(state.waste.at(-1)!, false)}`
        : ko
          ? "버린 카드 더미 · 비어 있음"
          : "Waste pile · empty",
    );
    waste.dataset.focusKey = "waste";
    waste.dataset.sourceType = "waste";
    waste.setAttribute(
      "aria-pressed",
      String(sameSource(selected, { type: "waste" })),
    );
    if (state.waste.length) {
      waste.classList.add("has-card");
      if (state.drawCount === 3) {
        const fan = state.waste.slice(-3, -1);
        for (const [index, card] of fan.entries()) {
          const peek = document.createElement("span");
          peek.className = `klondike-peek-card peek-${index + 1}`;
          peek.classList.toggle("is-red", cardColor(card) === "red");
          peek.append(cardFace(card));
          peek.setAttribute("aria-hidden", "true");
          waste.append(peek);
        }
      }
      const topCard = state.waste.at(-1)!;
      waste.classList.toggle("is-red", cardColor(topCard) === "red");
      waste.append(cardFace(topCard));
      if (sameSource(selected, { type: "waste" }))
        waste.classList.add("is-selected");
      if (isHintSource(waste)) waste.classList.add("is-hinted");
    } else {
      waste.textContent = ko ? "버린 카드" : "Waste";
    }
    waste.disabled = !active || !state.waste.length;
    top.append(waste);

    const spacer = document.createElement("span");
    spacer.className = "klondike-top-spacer";
    spacer.setAttribute("aria-hidden", "true");
    top.append(spacer);
    for (let suit = 0; suit < 4; suit++) {
      const foundation = foundationButton(suit);
      foundation.disabled = !active;
      top.append(foundation);
    }

    state.tableau.forEach((column, columnIndex) => {
      const pile = document.createElement("div");
      pile.className = "klondike-column";
      pile.dataset.column = String(columnIndex + 1);
      if (!column.cards.length) {
        const empty = emptyColumnButton(columnIndex);
        empty.disabled = !active;
        pile.append(empty);
      } else {
        column.cards.forEach((card, index) => {
          if (index < column.down) {
            const back = createBack();
            back.classList.add("klondike-facedown");
            pile.append(back);
            return;
          }
          const button = cardButton(
            card,
            { type: "tableau", column: columnIndex, index },
            columnIndex,
          );
          button.classList.add(
            index === column.down ? "is-up-start" : "is-overlap",
          );
          button.disabled = !active;
          pile.append(button);
        });
      }
      tableau.append(pile);
    });

    const count = foundationCount(state);
    status.textContent =
      message ||
      (ko
        ? `기초 더미 ${count}/52장 · 이동 ${state.moves}회 · 현재 ${state.drawCount}장 뽑기${nextDrawCount !== state.drawCount ? ` · 다음 판 ${nextDrawCount}장` : ""}`
        : `Foundations ${count}/52 · ${state.moves} moves · Draw ${state.drawCount}${nextDrawCount !== state.drawCount ? ` · next deal: Draw ${nextDrawCount}` : ""}`);
    for (const button of drawButtons) {
      const chosen = Number(button.dataset.drawChoice) === nextDrawCount;
      button.setAttribute("aria-pressed", String(chosen));
      button.disabled = !active;
      button.setAttribute(
        "aria-label",
        ko
          ? `다음 판에서 ${button.dataset.drawChoice}장씩 뽑기${chosen ? " · 선택됨" : ""}`
          : `Draw ${button.dataset.drawChoice} ${button.dataset.drawChoice === "1" ? "card" : "cards"} in the next deal${chosen ? " · selected" : ""}`,
      );
    }
    for (const button of setupButtons) {
      const chosen = Number(button.dataset.drawChoice) === nextDrawCount;
      button.setAttribute("aria-pressed", String(chosen));
      button.setAttribute(
        "aria-label",
        ko
          ? `${button.dataset.drawChoice}장씩 뽑기${chosen ? " · 선택됨" : ""}`
          : `Draw ${button.dataset.drawChoice}${chosen ? " · selected" : ""}`,
      );
    }
    newDeal.textContent = ko
      ? `새 판 · ${nextDrawCount}장 뽑기`
      : `New deal · Draw ${nextDrawCount}`;
    newDeal.setAttribute("aria-label", newDeal.textContent);
    newDeal.disabled = !active;
    undo.disabled = !active || !history.length;
    hintButton.disabled = !active;

    if (activeInsideBoard) {
      const key = focusAfter || priorFocus;
      const focusTarget = [
        ...board.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
      ].find((button) => button.dataset.focusKey === key);
      (
        focusTarget ??
        board.querySelector<HTMLButtonElement>("button:not(:disabled)")
      )?.focus({
        preventScroll: true,
      });
    }
  }

  function stockAction(): void {
    if (!active) return;
    const next = draw(state);
    if (!next) return;
    hint = undefined;
    selected = undefined;
    message =
      next.stock.length || next.waste.length
        ? ""
        : ko
          ? "덱과 버린 카드가 모두 비었어요. 새 판을 시작할 수 있어요."
          : "The stock and waste are empty. You can start a new deal.";
    push(next, "stock");
  }

  function tryTableau(source: Source, column: number): boolean {
    if (!canMoveToTableau(state, source, column)) return false;
    const next = moveToTableau(state, source, column)!;
    push(next, `card-${column}-${next.tableau[column]!.cards.length - 1}`);
    return true;
  }

  function tryFoundation(source: Source, suit: number): boolean {
    if (!canMoveToFoundation(state, source, suit)) return false;
    push(moveToFoundation(state, source, suit)!, `foundation-${suit}`);
    return true;
  }

  function chooseSource(source: Source): void {
    selected = sameSource(selected, source) ? undefined : source;
    hint = undefined;
    message = selected
      ? ko
        ? "놓을 카드 열이나 기초 더미를 고르세요."
        : "Choose a tableau column or foundation for this card."
      : "";
    render();
  }

  const boardClick = (event: MouseEvent) => {
    if (!active) return;
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "button",
    );
    if (!button || !board.contains(button) || button.disabled) return;
    if (button.dataset.klondikeAction === "stock") {
      stockAction();
      return;
    }
    const targetFoundation = button.dataset.targetFoundation;
    if (targetFoundation !== undefined && selected) {
      if (tryFoundation(selected, Number(targetFoundation))) return;
      message = ko
        ? "이 카드는 그 기초 더미에 놓을 수 없어요."
        : "That card does not fit this foundation.";
      render(focusKey(button));
      return;
    }
    const targetColumn = button.dataset.targetTableau;
    if (targetColumn !== undefined && selected) {
      if (tryTableau(selected, Number(targetColumn))) return;
      const source = sourceFrom(button);
      if (source && !sameSource(selected, source)) {
        selected = source;
        hint = undefined;
        message = ko
          ? "선택을 바꿨어요. 카드를 놓을 열을 고르세요."
          : "Card selected. Choose a column for this sequence.";
        render(focusKey(button));
      } else if (source) chooseSource(source);
      else {
        message = ko
          ? "빈 열에는 K부터 놓을 수 있어요."
          : "Only a King can start an empty column.";
        render(focusKey(button));
      }
      return;
    }
    const source = sourceFrom(button);
    if (!source) return;
    chooseSource(source);
  };
  board.addEventListener("click", boardClick);

  function onToolClick(event: MouseEvent): void {
    if (!active) return;
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "button",
    );
    if (!button) return;
    if (button === newDeal) {
      state = createGame(newDealSeed(), nextDrawCount);
      history = [];
      selected = undefined;
      hint = undefined;
      ended = false;
      active = true;
      message = ko
        ? `${nextDrawCount}장씩 뽑는 새 판이에요.`
        : `A new Draw ${nextDrawCount} deal is ready.`;
      render();
      ctx.onChange(0);
      ctx.onSave?.();
      ctx.sound();
    } else if (button === undo) {
      const previous = history.pop();
      if (!previous) return;
      state = cloneState(previous);
      selected = undefined;
      hint = undefined;
      message = ko ? "방금 수를 되돌렸어요." : "The last move was undone.";
      render();
      ctx.onChange(foundationCount(state));
      ctx.onSave?.();
    } else if (button === hintButton) {
      hint = findHint(state);
      selected = undefined;
      message = !hint
        ? ko
          ? "가능한 수가 없어요. 새 판을 시작해 보세요."
          : "No legal move is available. Try a new deal."
        : hint.source === "stock"
          ? ko
            ? state.stock.length
              ? "덱을 눌러 카드를 뽑아 보세요."
              : "버린 카드를 덱으로 되돌려 보세요."
            : state.stock.length
              ? "Draw from the stock."
              : "Recycle the waste into the stock."
          : ko
            ? "빛나는 카드와 놓을 자리를 확인하세요."
            : "Move the highlighted card to the highlighted pile.";
      render();
    }
  }
  tools.addEventListener("click", onToolClick);

  function gameButtons(): HTMLButtonElement[] {
    return [
      ...board.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
      ...tools.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
    ];
  }

  function focusDirectional(direction: "up" | "down" | "left" | "right"): void {
    const buttons = gameButtons();
    if (!buttons.length) return;
    const current =
      document.activeElement instanceof HTMLButtonElement &&
      (board.contains(document.activeElement) ||
        tools.contains(document.activeElement))
        ? document.activeElement
        : buttons[0]!;
    const currentBox = current.getBoundingClientRect();
    const cx = currentBox.left + currentBox.width / 2;
    const cy = currentBox.top + currentBox.height / 2;
    const ranked = buttons
      .filter((button) => button !== current)
      .map((button) => {
        const box = button.getBoundingClientRect();
        const dx = box.left + box.width / 2 - cx;
        const dy = box.top + box.height / 2 - cy;
        const aligned =
          direction === "left"
            ? dx < -3
            : direction === "right"
              ? dx > 3
              : direction === "up"
                ? dy < -3
                : dy > 3;
        const primary =
          direction === "left" || direction === "right"
            ? Math.abs(dx)
            : Math.abs(dy);
        const cross =
          direction === "left" || direction === "right"
            ? Math.abs(dy)
            : Math.abs(dx);
        return { button, aligned, score: primary + cross * 2.5 };
      })
      .filter((entry) => entry.aligned)
      .sort((a, b) => a.score - b.score);
    (ranked[0]?.button ?? current).focus({ preventScroll: true });
  }

  const activateFocused = () => {
    const target =
      document.activeElement instanceof HTMLButtonElement &&
      (board.contains(document.activeElement) ||
        tools.contains(document.activeElement))
        ? document.activeElement
        : gameButtons()[0];
    target?.click();
  };

  function finish(): void {
    if (ended || !isWon(state)) return;
    ended = true;
    active = false;
    selected = undefined;
    hint = undefined;
    message = ko
      ? "네 기초 더미를 모두 완성했어요!"
      : "All four foundations are complete!";
    render();
    ctx.onChange(52);
    ctx.onEnd({ score: 52, won: true, message });
  }

  render();
  ctx.onChange(foundationCount(state));
  ctx.onReady?.({ width: 900, height: 620 });

  return {
    start() {
      if (isWon(state)) {
        state = createGame(newDealSeed(), nextDrawCount);
        history = [];
        selected = undefined;
        hint = undefined;
      }
      if (state.drawCount !== nextDrawCount) {
        state = createGame(ctx.seed, nextDrawCount);
        history = [];
      }
      ended = false;
      active = true;
      message = "";
      render();
      ctx.onChange(foundationCount(state));
    },
    pause() {
      active = false;
      render();
    },
    resume() {
      active = !ended;
      render();
    },
    restart() {
      state = createGame(state.dealSeed, state.drawCount);
      history = [];
      nextDrawCount = state.drawCount;
      selected = undefined;
      hint = undefined;
      ended = false;
      active = true;
      message = "";
      render();
      ctx.onChange(0);
      ctx.onSave?.();
    },
    action(action) {
      if (!active) return;
      if (action === "confirm") activateFocused();
      else focusDirectional(action);
    },
    serialize: () => save(),
    destroy() {
      active = false;
      board.removeEventListener("click", boardClick);
      tools.removeEventListener("click", onToolClick);
      tools.remove();
      setup.remove();
      board.remove();
    },
  };
};
