import { expect, it } from "vitest";
import {
  GONGGI_CATCH_WINDOW_MS,
  GONGGI_FLIGHT_MS,
  GONGGI_TARGET_MS,
  catchGonggiToss,
  createGonggiState,
  gradeGonggiCatch,
  groupPlan,
  isGonggiCatchWindow,
  missGonggiToss,
  restoreGonggiState,
  serializableGonggiState,
  startGonggiToss,
  toggleGonggiStone,
} from "../../src/games/gonggi/rules";

it("defines the five common Gonggi stages and one visible catch window", () => {
  expect(groupPlan(1)).toEqual([1, 1, 1, 1]);
  expect(groupPlan(2)).toEqual([2, 2]);
  expect(groupPlan(3)).toEqual([3, 1]);
  expect(groupPlan(4)).toEqual([4]);
  expect(groupPlan(5)).toEqual([]);
  expect(GONGGI_FLIGHT_MS).toBe(3600);
  expect(GONGGI_TARGET_MS).toBe(2600);
  expect(GONGGI_CATCH_WINDOW_MS).toBe(500);
  expect(isGonggiCatchWindow(2100)).toBe(true);
  expect(isGonggiCatchWindow(3100)).toBe(true);
  expect(isGonggiCatchWindow(2099)).toBe(false);
  expect(isGonggiCatchWindow(3101)).toBe(false);
});

it("grades catches around the target and rejects impossible elapsed times", () => {
  expect(gradeGonggiCatch(GONGGI_TARGET_MS).caught).toBe(5);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 150).caught).toBe(5);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 151).caught).toBe(4);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 300).caught).toBe(4);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 301).caught).toBe(3);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 500).caught).toBe(3);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 501).caught).toBe(2);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 750).caught).toBe(2);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 751).caught).toBe(1);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 1000).caught).toBe(1);
  expect(gradeGonggiCatch(GONGGI_TARGET_MS + 1001).caught).toBe(0);
  expect(gradeGonggiCatch(-1).caught).toBe(0);
  expect(gradeGonggiCatch(Number.NaN).caught).toBe(0);
});

it("clears all four picking stages with only the requested stones", () => {
  for (let stage = 1; stage <= 4; stage++) {
    let state = createGonggiState(stage);
    for (const need of groupPlan(stage)) {
      state = startGonggiToss(state);
      for (const stone of state.available.slice(0, need))
        state = toggleGonggiStone(state, stone);
      state = catchGonggiToss(state, GONGGI_TARGET_MS);
    }
    expect(state.phase).toBe("won");
    expect(state.available).toEqual([]);
    expect(state.score).toBeGreaterThan(0);
  }
});

it("does not accept a catch until the requested group is selected", () => {
  const state = startGonggiToss(createGonggiState(4));
  expect(catchGonggiToss(state, GONGGI_TARGET_MS)).toEqual(state);
  const first = toggleGonggiStone(state, 0);
  expect(first.selected).toEqual([0]);
  expect(toggleGonggiStone(first, 1).selected).toEqual([0, 1]);
});

it("keeps earlier groups after misses and ends a stage after three mistakes", () => {
  let state = startGonggiToss(createGonggiState(1));
  state = toggleGonggiStone(state, 2);
  state = catchGonggiToss(state, GONGGI_TARGET_MS);
  expect(state.step).toBe(1);
  expect(state.available).toEqual([0, 1, 3]);

  for (let miss = 0; miss < 3; miss++) {
    state = startGonggiToss(state);
    state = toggleGonggiStone(state, state.available[0]!);
    state = missGonggiToss(state);
  }
  expect(state.phase).toBe("lost");
  expect(state.lives).toBe(0);
  expect(state.step).toBe(1);
});

it("runs both Kkeokgi catches and records only the recovered stones", () => {
  let state = startGonggiToss(createGonggiState(5));
  state = catchGonggiToss(state, GONGGI_TARGET_MS);
  expect(state.phase).toBe("flip-ready");
  expect(state.handCaught).toBe(5);

  state = startGonggiToss(state);
  state = catchGonggiToss(state, GONGGI_TARGET_MS + 301);
  expect(state.phase).toBe("won");
  expect(state.score).toBe(550);

  const restored = restoreGonggiState(serializableGonggiState(state), 5);
  expect(restored.phase).toBe("won");
  expect(restored.score).toBe(550);
});

it("restores valid progress and rejects malformed or mismatched saves", () => {
  let state = startGonggiToss(createGonggiState(2));
  state = toggleGonggiStone(state, 3);
  state = toggleGonggiStone(state, 1);
  state = catchGonggiToss(state, GONGGI_TARGET_MS);
  const restored = restoreGonggiState(state, 2);
  expect(restored.step).toBe(1);
  expect(restored.available).toEqual([0, 2]);
  expect(restored.phase).toBe("ready");

  expect(restoreGonggiState(state, 3)).toEqual(createGonggiState(3));
  expect(restoreGonggiState({ ...state, available: [0, 0] }, 2)).toEqual(
    createGonggiState(2),
  );
  expect(restoreGonggiState({ ...state, lives: 9 }, 2)).toEqual(
    createGonggiState(2),
  );

  const inFlight = startGonggiToss(restored);
  const savedFlight = serializableGonggiState(inFlight);
  expect(savedFlight.phase).toBe("ready");
  expect(savedFlight.selected).toEqual([]);
  expect(restoreGonggiState(savedFlight, 2).step).toBe(1);
});
