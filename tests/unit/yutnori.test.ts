import { describe, expect, it } from "vitest";
import {
  applyYutMove,
  classifyYutThrow,
  initialYutState,
  legalYutMoves,
  restoreYutState,
  type YutState,
} from "../../src/games/yutnori/rules";

const put = (
  state: YutState,
  player: number,
  token: number,
  node: number | null,
  route: "a-forward" | "a-reverse" | "b-forward" | null = null,
) => {
  state.players[player]!.tokens[token] = {
    node,
    finished: false,
    route,
  };
};

describe("Yutnori rules", () => {
  it("maps four stick faces to Do, Gae, Geol, Yut and Mo", () => {
    expect(classifyYutThrow([true, false, false, false])?.steps).toBe(1);
    expect(classifyYutThrow([true, true, false, false])?.steps).toBe(2);
    expect(classifyYutThrow([true, true, true, false])?.steps).toBe(3);
    expect(classifyYutThrow([true, true, true, true])?.steps).toBe(4);
    expect(classifyYutThrow([false, false, false, false])?.steps).toBe(5);
    expect(classifyYutThrow([true])).toBeNull();
  });

  it("creates a clean local match for two through four players", () => {
    for (const count of [2, 3, 4]) {
      const state = initialYutState(count);
      expect(state.players).toHaveLength(count);
      expect(state.players.every((player) => player.tokens.length === 4)).toBe(
        true,
      );
      expect(state.turn).toBe(0);
      expect(state.roll).toBeNull();
    }
  });

  it("offers the outer path and the diagonal shortcut from a corner", () => {
    const state = initialYutState();
    put(state, 0, 0, 5);
    const moves = legalYutMoves(state, 1);
    const selectedPieceMoves = moves.filter((move) => move.tokens[0] === 0);
    expect(selectedPieceMoves.map((move) => move.to)).toEqual([6, 20]);
    expect(selectedPieceMoves.find((move) => move.to === 20)?.route).toBe(
      "a-forward",
    );
  });

  it("follows a selected diagonal through the center to its paired corner", () => {
    const state = initialYutState();
    put(state, 0, 0, 22, "a-forward");
    const moves = legalYutMoves(state, 3).filter((move) => move.from === 22);
    expect(moves).toHaveLength(1);
    expect(moves[0]?.to).toBe(15);
    expect(moves[0]?.route).toBeNull();
    expect(moves[0]?.trace).toEqual([23, 24, 15]);
  });

  it("moves a same-space stack as one group", () => {
    const state = initialYutState();
    put(state, 0, 0, 5);
    put(state, 0, 1, 5);
    state.roll = { faces: [true, false, false, false], steps: 1 };
    const moves = legalYutMoves(state);
    const outer = moves.find((move) => move.to === 6)!;
    expect(outer.tokens).toEqual([0, 1]);
    const result = applyYutMove(state, outer);
    expect(result.invalid).toBe(false);
    expect(
      result.state.players[0]!.tokens.slice(0, 2).map((token) => token.node),
    ).toEqual([6, 6]);
  });

  it("captures the full opposing stack and grants another throw", () => {
    const state = initialYutState();
    put(state, 0, 0, 4);
    put(state, 1, 0, 6);
    put(state, 1, 1, 6);
    state.roll = { faces: [true, true, false, false], steps: 2 };
    const move = legalYutMoves(state).find((candidate) => candidate.to === 6)!;
    const result = applyYutMove(state, move);
    expect(result.captured).toBe(2);
    expect(result.bonusThrow).toBe(true);
    expect(result.state.turn).toBe(0);
    expect(
      result.state.players[1]!.tokens.slice(0, 2).map((token) => token.node),
    ).toEqual([null, null]);
  });

  it("requires an exact finish and declares the first player to finish four pieces", () => {
    const state = initialYutState();
    state.players[0]!.tokens = [
      { node: 19, finished: false, route: null },
      { node: null, finished: true, route: null },
      { node: null, finished: true, route: null },
      { node: null, finished: true, route: null },
    ];
    expect(legalYutMoves(state, 2)).toEqual([]);
    state.roll = { faces: [true, false, false, false], steps: 1 };
    const result = applyYutMove(state, legalYutMoves(state)[0]!);
    expect(result.state.winner).toBe(0);
    expect(
      result.state.players[0]!.tokens.every((token) => token.finished),
    ).toBe(true);
  });

  it("rejects malformed saved positions and moves not in the legal set", () => {
    const state = initialYutState();
    expect(restoreYutState(state)).toEqual(state);
    expect(restoreYutState({ ...state, turn: 99 })).toBeNull();
    state.roll = { faces: [true, false, false, false], steps: 1 };
    const illegal = {
      player: 0,
      tokens: [0],
      from: null,
      to: 5,
      trace: [5],
      route: null,
      finished: false,
    };
    expect(applyYutMove(state, illegal).invalid).toBe(true);
  });
});

describe("Yutnori save and directed-route regressions", () => {
  it("rejects malformed stick faces and diagonal positions", () => {
    expect(classifyYutThrow("abcd")).toBeNull();
    expect(classifyYutThrow({ length: 4 })).toBeNull();
    const state = initialYutState();
    for (const faces of ["abcd", { length: 4 }])
      expect(
        restoreYutState({ ...state, roll: { faces, steps: 1 } }),
      ).toBeNull();
    put(state, 0, 0, 22);
    expect(restoreYutState(state)).toBeNull();
    const completed = initialYutState();
    completed.players[0]!.tokens = Array.from({ length: 4 }, () => ({
      node: null,
      finished: true,
      route: null,
    }));
    expect(restoreYutState(completed)).toBeNull();
    completed.winner = 0;
    expect(restoreYutState(completed)?.winner).toBe(0);
    expect(restoreYutState({ ...completed, turn: 1 })).toBeNull();
  });
  it("offers the outer and diagonal routes at all reachable corners", () => {
    for (const [node, outer, shortcut, route] of [
      [5, 6, 20, "a-forward"],
      [10, 11, 25, "b-forward"],
      [15, 16, 24, "a-reverse"],
    ] as const) {
      const state = initialYutState();
      put(state, 0, 0, node);
      const moves = legalYutMoves(state, 1).filter(
        (move) => move.tokens[0] === 0,
      );
      expect(moves.map((move) => move.to)).toEqual([outer, shortcut]);
      expect(moves.find((move) => move.to === shortcut)?.route).toBe(route);
    }
  });
  it("follows every reachable diagonal to its endpoint", () => {
    for (const [node, route, trace, to, finished] of [
      [20, "a-forward", [21, 22, 23, 24, 15], 15, false],
      [24, "a-reverse", [23, 22, 21, 20, 5], 5, false],
      [25, "b-forward", [26, 22, 27, 28, 0], null, true],
    ] as const) {
      const state = initialYutState();
      put(state, 0, 0, node, route);
      const move = legalYutMoves(state, 5).find((move) => move.tokens[0] === 0);
      expect(move?.trace).toEqual(trace);
      expect(move?.to).toBe(to);
      expect(move?.finished).toBe(finished);
      expect(move?.route).toBeNull();
    }
  });
});
