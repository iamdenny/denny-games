import { random } from "../../lib/random";

export type DrawCount = 1 | 3;
export type Card = number;
export type Source =
  | { type: "stock" }
  | { type: "waste" }
  | { type: "tableau"; column: number; index: number };
export type Destination =
  { type: "tableau"; column: number } | { type: "foundation"; suit: number };
export interface Column {
  cards: Card[];
  down: number;
}
export interface State {
  dealSeed: string;
  drawCount: DrawCount;
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Column[];
  moves: number;
}
export interface Save {
  version: 1;
  routeSeed: string;
  state: State;
  history: State[];
  nextDrawCount: DrawCount;
}
export type Hint =
  { source: Source; destination: Destination } | { source: "stock" };

export const cardSuit = (card: Card) => Math.floor(card / 13);
export const cardRank = (card: Card) => (card % 13) + 1;
export const cardColor = (card: Card) => (cardSuit(card) < 2 ? "red" : "black");
const otherColor = (a: Card, b: Card) => cardColor(a) !== cardColor(b);

export function cloneState(state: State): State {
  return {
    ...state,
    stock: [...state.stock],
    waste: [...state.waste],
    foundations: state.foundations.map((pile) => [...pile]),
    tableau: state.tableau.map((column) => ({
      cards: [...column.cards],
      down: column.down,
    })),
  };
}

export function createGame(seed: string, drawCount: DrawCount = 1): State {
  const rng = random(`klondike:${seed}`);
  const deck = Array.from({ length: 52 }, (_, card) => card);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
  const tableau = Array.from({ length: 7 }, (_, column) => ({
    cards: Array.from({ length: column + 1 }, () => deck.pop()!),
    down: column,
  }));
  return {
    dealSeed: seed,
    drawCount,
    stock: deck,
    waste: [],
    foundations: Array.from({ length: 4 }, () => []),
    tableau,
    moves: 0,
  };
}

export function draw(state: State): State | undefined {
  const next = cloneState(state);
  if (next.stock.length) {
    for (let i = 0; i < next.drawCount && next.stock.length; i++)
      next.waste.push(next.stock.pop()!);
  } else if (next.waste.length) {
    next.stock = next.waste.reverse();
    next.waste = [];
  } else return undefined;
  next.moves++;
  return next;
}

function sourceCards(state: State, source: Source): Card[] | undefined {
  if (source.type === "waste")
    return state.waste.length ? [state.waste.at(-1)!] : undefined;
  if (source.type === "stock") return undefined;
  const column = state.tableau[source.column];
  if (
    !column ||
    !Number.isInteger(source.index) ||
    source.index < column.down ||
    source.index >= column.cards.length
  )
    return undefined;
  return column.cards.slice(source.index);
}

export function canMoveToTableau(
  state: State,
  source: Source,
  targetColumn: number,
): boolean {
  const moving = sourceCards(state, source);
  const target = state.tableau[targetColumn];
  if (!moving?.length || !target || source.type === "stock") return false;
  if (source.type === "tableau" && source.column === targetColumn) return false;
  const first = moving[0]!;
  const top = target.cards.at(-1);
  return top === undefined
    ? cardRank(first) === 13
    : cardRank(top) === cardRank(first) + 1 && otherColor(top, first);
}

export function canMoveToFoundation(
  state: State,
  source: Source,
  targetSuit: number,
): boolean {
  if (
    source.type === "stock" ||
    !Number.isInteger(targetSuit) ||
    targetSuit < 0 ||
    targetSuit > 3
  )
    return false;
  const cards = sourceCards(state, source);
  if (!cards || cards.length !== 1) return false;
  const card = cards[0]!;
  return (
    cardSuit(card) === targetSuit &&
    cardRank(card) === state.foundations[targetSuit]!.length + 1
  );
}

function revealIfNeeded(column: Column): void {
  if (column.down > 0 && column.cards.length === column.down) column.down--;
}

export function moveToTableau(
  state: State,
  source: Source,
  targetColumn: number,
): State | undefined {
  if (!canMoveToTableau(state, source, targetColumn)) return undefined;
  const next = cloneState(state);
  const target = next.tableau[targetColumn]!;
  if (source.type === "waste") target.cards.push(next.waste.pop()!);
  else if (source.type === "tableau") {
    const from = next.tableau[source.column]!;
    target.cards.push(...from.cards.splice(source.index));
    revealIfNeeded(from);
  } else return undefined;
  next.moves++;
  return next;
}

export function moveToFoundation(
  state: State,
  source: Source,
  targetSuit: number,
): State | undefined {
  if (!canMoveToFoundation(state, source, targetSuit)) return undefined;
  const next = cloneState(state);
  let card: Card;
  if (source.type === "waste") card = next.waste.pop()!;
  else if (source.type === "tableau") {
    const column = next.tableau[source.column]!;
    if (source.index !== column.cards.length - 1) return undefined;
    card = column.cards.pop()!;
    revealIfNeeded(column);
  } else return undefined;
  next.foundations[targetSuit]!.push(card);
  next.moves++;
  return next;
}

export function isWon(state: State): boolean {
  return state.foundations.every((pile) => pile.length === 13);
}

export const foundationCount = (state: State) =>
  state.foundations.reduce((total, pile) => total + pile.length, 0);

export function findHint(state: State): Hint | undefined {
  const sources: Source[] = [];
  if (state.waste.length) sources.push({ type: "waste" });
  for (let column = 0; column < state.tableau.length; column++) {
    const pile = state.tableau[column]!;
    for (let index = pile.down; index < pile.cards.length; index++)
      sources.push({ type: "tableau", column, index });
  }
  const moves: { hint: Hint; priority: number }[] = [];
  for (const source of sources) {
    for (let suit = 0; suit < 4; suit++) {
      if (canMoveToFoundation(state, source, suit)) {
        const uncovers =
          source.type === "tableau" &&
          source.index === state.tableau[source.column]!.down &&
          state.tableau[source.column]!.down > 0;
        moves.push({
          hint: { source, destination: { type: "foundation", suit } },
          priority: uncovers ? 0 : 1,
        });
      }
    }
    for (let column = 0; column < state.tableau.length; column++) {
      if (!canMoveToTableau(state, source, column)) continue;
      const uncovers =
        source.type === "tableau" &&
        source.index === state.tableau[source.column]!.down &&
        state.tableau[source.column]!.down > 0;
      moves.push({
        hint: { source, destination: { type: "tableau", column } },
        priority: uncovers ? 0 : source.type === "waste" ? 2 : 3,
      });
    }
  }
  moves.sort((a, b) => a.priority - b.priority);
  if (moves.length) return moves[0]!.hint;
  return state.stock.length || state.waste.length
    ? { source: "stock" }
    : undefined;
}

export function validState(value: unknown): value is State {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<State>;
  if (
    typeof state.dealSeed !== "string" ||
    state.dealSeed.length > 180 ||
    (state.drawCount !== 1 && state.drawCount !== 3) ||
    !Array.isArray(state.stock) ||
    !Array.isArray(state.waste) ||
    !Array.isArray(state.foundations) ||
    state.foundations.length !== 4 ||
    !Array.isArray(state.tableau) ||
    state.tableau.length !== 7 ||
    !Number.isSafeInteger(state.moves) ||
    state.moves! < 0 ||
    state.moves! > 1_000_000
  )
    return false;
  if (
    !state.stock.every(Number.isInteger) ||
    !state.waste.every(Number.isInteger) ||
    !state.foundations.every(
      (pile) => Array.isArray(pile) && pile.every(Number.isInteger),
    ) ||
    !state.tableau.every(
      (column) =>
        column &&
        Array.isArray(column.cards) &&
        column.cards.every(Number.isInteger) &&
        Number.isSafeInteger(column.down) &&
        column.down >= 0 &&
        column.down <= column.cards.length &&
        (column.cards.length === 0
          ? column.down === 0
          : column.down < column.cards.length),
    )
  )
    return false;
  const cards = [
    ...state.stock,
    ...state.waste,
    ...state.foundations.flat(),
    ...state.tableau.flatMap((column) => column.cards),
  ];
  if (
    cards.length !== 52 ||
    new Set(cards).size !== 52 ||
    cards.some((card) => card < 0 || card > 51)
  )
    return false;
  for (let suit = 0; suit < 4; suit++) {
    const pile = state.foundations[suit]!;
    if (
      pile.some(
        (card, index) =>
          cardSuit(card) !== suit || cardRank(card) !== index + 1,
      )
    )
      return false;
  }
  for (const column of state.tableau) {
    for (let index = column.down + 1; index < column.cards.length; index++) {
      const lower = column.cards[index - 1]!;
      const upper = column.cards[index]!;
      if (cardRank(lower) !== cardRank(upper) + 1 || !otherColor(lower, upper))
        return false;
    }
  }
  return true;
}

export function restore(value: unknown, routeSeed: string): Save | undefined {
  if (!value || typeof value !== "object") return undefined;
  const save = value as Partial<Save>;
  if (
    save.version !== 1 ||
    save.routeSeed !== routeSeed ||
    !validState(save.state) ||
    !Array.isArray(save.history) ||
    save.history.length > 120 ||
    !save.history.every(validState) ||
    save.history.some(
      (snapshot) =>
        snapshot.dealSeed !== save.state?.dealSeed ||
        snapshot.drawCount !== save.state?.drawCount,
    ) ||
    save.history.some(
      (snapshot, index) =>
        index > 0 && snapshot.moves !== save.history![index - 1]!.moves + 1,
    ) ||
    (save.history.length > 0 &&
      save.state.moves !== save.history.at(-1)!.moves + 1) ||
    (save.nextDrawCount !== 1 && save.nextDrawCount !== 3)
  )
    return undefined;
  return {
    version: 1,
    routeSeed,
    state: cloneState(save.state),
    history: save.history.map(cloneState),
    nextDrawCount: save.nextDrawCount,
  };
}
