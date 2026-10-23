import { describe, expect, it } from "vitest";
import {
  canMoveToFoundation,
  canMoveToTableau,
  cardRank,
  createGame,
  draw,
  findHint,
  foundationCount,
  isWon,
  moveToFoundation,
  moveToTableau,
  restore,
  validState,
  type Column,
  type Save,
  type State,
} from "../../src/games/klondike/rules";

function fixture(
  options: {
    tableau?: Column[];
    waste?: number[];
    foundations?: number[][];
  } = {},
): State {
  const tableau =
    options.tableau ??
    Array.from({ length: 7 }, () => ({ cards: [], down: 0 }));
  const waste = options.waste ?? [];
  const foundations =
    options.foundations ?? Array.from({ length: 4 }, () => []);
  const used = new Set([
    ...waste,
    ...foundations.flat(),
    ...tableau.flatMap((column) => column.cards),
  ]);
  return {
    dealSeed: "fixture",
    drawCount: 1,
    stock: Array.from({ length: 52 }, (_, card) => card).filter(
      (card) => !used.has(card),
    ),
    waste,
    foundations,
    tableau,
    moves: 0,
  };
}

describe("Klondike Solitaire", () => {
  it("creates deterministic full 52-card deals in both draw modes", () => {
    for (const drawCount of [1, 3] as const) {
      const first = createGame("same-deal", drawCount);
      expect(createGame("same-deal", drawCount)).toEqual(first);
      expect(validState(first)).toBe(true);
      expect(first.stock).toHaveLength(24);
      expect(first.tableau.map((column) => column.cards.length)).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
      expect(first.tableau.map((column) => column.down)).toEqual([
        0, 1, 2, 3, 4, 5, 6,
      ]);
      expect(
        new Set([
          ...first.stock,
          ...first.waste,
          ...first.foundations.flat(),
          ...first.tableau.flatMap((column) => column.cards),
        ]).size,
      ).toBe(52);
    }
  });

  it("draws one or three cards and recycles the waste in order", () => {
    const one = draw(createGame("draw-one", 1))!;
    expect(one.stock).toHaveLength(23);
    expect(one.waste).toHaveLength(1);

    let three = createGame("draw-three", 3);
    three = draw(three)!;
    expect(three.stock).toHaveLength(21);
    expect(three.waste).toHaveLength(3);
    for (let i = 0; i < 7; i++) three = draw(three)!;
    expect(three.stock).toHaveLength(0);
    expect(three.waste).toHaveLength(24);
    const recycled = draw(three)!;
    expect(recycled.stock).toHaveLength(24);
    expect(recycled.waste).toHaveLength(0);
    expect(validState(recycled)).toBe(true);
  });

  it("moves an alternating-color sequence and turns over the newly exposed card", () => {
    const state = fixture({
      tableau: [
        { cards: [8, 3], down: 1 },
        { cards: [43], down: 0 },
        ...Array.from({ length: 5 }, () => ({ cards: [], down: 0 })),
      ],
    });
    expect(validState(state)).toBe(true);
    expect(
      canMoveToTableau(state, { type: "tableau", column: 0, index: 1 }, 1),
    ).toBe(true);
    const next = moveToTableau(
      state,
      { type: "tableau", column: 0, index: 1 },
      1,
    )!;
    expect(next.tableau[0]).toEqual({ cards: [8], down: 0 });
    expect(next.tableau[1]).toEqual({ cards: [43, 3], down: 0 });
    expect(validState(next)).toBe(true);
  });

  it("rejects same-color or wrong-rank tableau moves and non-King empty-column moves", () => {
    const state = fixture({
      tableau: [
        { cards: [3], down: 0 },
        { cards: [4], down: 0 },
        ...Array.from({ length: 5 }, () => ({ cards: [], down: 0 })),
      ],
    });
    expect(
      canMoveToTableau(state, { type: "tableau", column: 0, index: 0 }, 1),
    ).toBe(false);
    expect(
      moveToTableau(state, { type: "tableau", column: 0, index: 0 }, 1),
    ).toBeUndefined();
    expect(
      canMoveToTableau(state, { type: "tableau", column: 0, index: 0 }, 2),
    ).toBe(false);
    expect(
      moveToTableau(state, { type: "tableau", column: 0, index: 0 }, 2),
    ).toBeUndefined();
  });

  it("builds foundations by suit and rank, and exposes only single top cards", () => {
    const ace = fixture({
      tableau: [
        { cards: [0, 13], down: 0 },
        ...Array.from({ length: 6 }, () => ({ cards: [], down: 0 })),
      ],
    });
    expect(
      canMoveToFoundation(ace, { type: "tableau", column: 0, index: 1 }, 1),
    ).toBe(true);
    expect(
      canMoveToFoundation(ace, { type: "tableau", column: 0, index: 0 }, 0),
    ).toBe(false);
    const first = moveToFoundation(
      ace,
      { type: "tableau", column: 0, index: 1 },
      1,
    )!;
    expect(first.foundations[1]).toEqual([13]);
    expect(cardRank(first.foundations[1]!.at(-1)!)).toBe(1);
    expect(canMoveToFoundation(first, { type: "waste" }, 1)).toBe(false);
    const wasteAce = fixture({ waste: [0] });
    const second = moveToFoundation(wasteAce, { type: "waste" }, 0)!;
    expect(second.foundations[0]).toEqual([0]);
    expect(foundationCount(second)).toBe(1);
    expect(validState(second)).toBe(true);
  });

  it("recognizes a completed set of four foundations and finds a useful next action", () => {
    const won = fixture({
      foundations: Array.from({ length: 4 }, (_, suit) =>
        Array.from({ length: 13 }, (_, rank) => suit * 13 + rank),
      ),
    });
    expect(validState(won)).toBe(true);
    expect(isWon(won)).toBe(true);
    expect(foundationCount(won)).toBe(52);
    expect(findHint(createGame("hint-seed", 3))).toBeDefined();
  });

  it("restores valid bounded saves and rejects duplicate cards or oversized history", () => {
    const previous = createGame("saved-deal", 3);
    const state = draw(previous)!;
    const save: Save = {
      version: 1,
      routeSeed: "route-seed",
      state,
      history: [previous],
      nextDrawCount: 1,
    };
    expect(restore(save, "route-seed")).toEqual(save);
    expect(restore(save, "another-route")).toBeUndefined();

    const corrupt = structuredClone(save);
    corrupt.state.stock[0] = corrupt.state.tableau[0]!.cards[0]!;
    expect(restore(corrupt, "route-seed")).toBeUndefined();

    const allFaceDown = createGame("face-down-column");
    allFaceDown.tableau[0]!.down = 1;
    expect(validState(allFaceDown)).toBe(false);

    const secondMove = draw(state)!;
    const corruptHistory = {
      ...save,
      state: secondMove,
      history: [{ ...previous, moves: 5 }, state],
    };
    expect(restore(corruptHistory, "route-seed")).toBeUndefined();

    const oversized = {
      ...save,
      history: Array.from({ length: 121 }, () => previous),
    };
    expect(restore(oversized, "route-seed")).toBeUndefined();
  });
});
