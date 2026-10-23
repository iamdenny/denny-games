export const GONGGI_STAGE_COUNT = 5;
export const GONGGI_FLIGHT_MS = 3600;
export const GONGGI_TARGET_MS = 2600;
export const GONGGI_CATCH_WINDOW_MS = 500;
export const GONGGI_MAX_MISSES = 3;

export type GonggiPhase = "ready" | "airborne" | "flip-ready" | "won" | "lost";

export interface GonggiState {
  version: 1;
  stage: number;
  step: number;
  lives: number;
  score: number;
  combo: number;
  available: number[];
  selected: number[];
  handCaught: number;
  phase: GonggiPhase;
}

export interface GonggiCatchGrade {
  caught: number;
  delta: number;
}

const validStage = (stage: number) =>
  Number.isInteger(stage) && stage >= 1 && stage <= GONGGI_STAGE_COUNT;

export function groupPlan(stage: number): number[] {
  switch (stage) {
    case 1:
      return [1, 1, 1, 1];
    case 2:
      return [2, 2];
    case 3:
      return [3, 1];
    case 4:
      return [4];
    default:
      return [];
  }
}

export function createGonggiState(stage: number): GonggiState {
  const normalizedStage = validStage(stage) ? stage : 1;
  return {
    version: 1,
    stage: normalizedStage,
    step: 0,
    lives: GONGGI_MAX_MISSES,
    score: 0,
    combo: 0,
    available: normalizedStage === 5 ? [] : [0, 1, 2, 3],
    selected: [],
    handCaught: 0,
    phase: "ready",
  };
}

export function targetCount(state: GonggiState): number {
  if (state.stage === 5 || state.phase !== "airborne") return 0;
  return groupPlan(state.stage)[state.step] ?? 0;
}

export function startGonggiToss(state: GonggiState): GonggiState {
  if (state.phase !== "ready" && state.phase !== "flip-ready") return state;
  return { ...state, phase: "airborne", selected: [] };
}

export function toggleGonggiStone(
  state: GonggiState,
  stone: number,
): GonggiState {
  if (state.phase !== "airborne" || state.stage === 5) return state;
  if (!state.available.includes(stone)) return state;
  const selected = state.selected.includes(stone)
    ? state.selected.filter((item) => item !== stone)
    : state.selected.length < targetCount(state)
      ? [...state.selected, stone]
      : state.selected;
  return { ...state, selected };
}

export function gradeGonggiCatch(elapsedMs: number): GonggiCatchGrade {
  if (
    !Number.isFinite(elapsedMs) ||
    elapsedMs < 0 ||
    elapsedMs > GONGGI_FLIGHT_MS
  )
    return { caught: 0, delta: Number.POSITIVE_INFINITY };
  const delta = Math.abs(elapsedMs - GONGGI_TARGET_MS);
  const caught =
    delta <= 150
      ? 5
      : delta <= 300
        ? 4
        : delta <= GONGGI_CATCH_WINDOW_MS
          ? 3
          : delta <= 750
            ? 2
            : delta <= 1000
              ? 1
              : 0;
  return { caught, delta };
}

export function isGonggiCatchWindow(elapsedMs: number): boolean {
  return (
    Number.isFinite(elapsedMs) &&
    Math.abs(elapsedMs - GONGGI_TARGET_MS) <= GONGGI_CATCH_WINDOW_MS
  );
}

export function missGonggiToss(state: GonggiState): GonggiState {
  if (state.phase !== "airborne") return state;
  const lives = Math.max(0, state.lives - 1);
  if (state.stage === 5) {
    return {
      ...state,
      step: 0,
      lives,
      combo: 0,
      handCaught: 0,
      selected: [],
      phase: lives === 0 ? "lost" : "ready",
    };
  }
  return {
    ...state,
    lives,
    combo: 0,
    selected: [],
    phase: lives === 0 ? "lost" : "ready",
  };
}

export function catchGonggiToss(
  state: GonggiState,
  elapsedMs: number,
): GonggiState {
  if (state.phase !== "airborne" || !isGonggiCatchWindow(elapsedMs))
    return state;
  const grade = gradeGonggiCatch(elapsedMs);
  if (grade.caught < 3) return missGonggiToss(state);

  if (state.stage === 5) {
    if (state.step === 0) {
      return {
        ...state,
        step: 1,
        handCaught: grade.caught,
        phase: "flip-ready",
        selected: [],
      };
    }
    const caught = Math.min(state.handCaught, grade.caught);
    return {
      ...state,
      score: state.score + state.handCaught * 50 + caught * 100,
      combo: 1,
      phase: "won",
      selected: [],
    };
  }

  const need = groupPlan(state.stage)[state.step] ?? 0;
  if (state.selected.length !== need) return state;
  const collected = new Set(state.selected);
  const step = state.step + 1;
  const plan = groupPlan(state.stage);
  return {
    ...state,
    step,
    score: state.score + 100 + grade.caught * 20 + state.combo * 15,
    combo: state.combo + 1,
    available: state.available.filter((stone) => !collected.has(stone)),
    selected: [],
    phase: step === plan.length ? "won" : "ready",
  };
}

export function restoreGonggiState(value: unknown, stage: number): GonggiState {
  const initial = createGonggiState(stage);
  if (
    !value ||
    typeof value !== "object" ||
    (value as Partial<GonggiState>).version !== 1 ||
    (value as Partial<GonggiState>).stage !== initial.stage
  )
    return initial;

  const saved = value as Partial<GonggiState>;
  const plan = groupPlan(initial.stage);
  const maxStep = initial.stage === 5 ? 1 : plan.length;
  const maxCombo = initial.stage === 5 ? 1 : plan.length;
  const step = saved.step;
  const lives = saved.lives;
  const score = saved.score;
  const combo = saved.combo;
  const handCaught = saved.handCaught;
  if (
    !Number.isInteger(step) ||
    step! < 0 ||
    step! > maxStep ||
    !Number.isInteger(lives) ||
    lives! < 0 ||
    lives! > GONGGI_MAX_MISSES ||
    !Number.isSafeInteger(score) ||
    score! < 0 ||
    score! > 100_000 ||
    !Number.isInteger(combo) ||
    combo! < 0 ||
    combo! > maxCombo ||
    !Number.isInteger(handCaught) ||
    handCaught! < 0 ||
    handCaught! > 5
  )
    return initial;

  const collectedCount =
    initial.stage === 5
      ? 0
      : plan.slice(0, step!).reduce((sum, count) => sum + count, 0);
  const expectedAvailableCount = initial.stage === 5 ? 0 : 4 - collectedCount;
  const savedPhase = saved.phase;
  if (
    (initial.stage < 5 &&
      ((step === plan.length && savedPhase !== "won") ||
        (step! < plan.length && savedPhase === "won") ||
        handCaught !== 0)) ||
    (initial.stage === 5 &&
      ((step === 0 && handCaught !== 0) ||
        (step === 1 && handCaught! < 3) ||
        (savedPhase === "won" && step !== 1))) ||
    (lives === 0 && savedPhase !== "lost") ||
    (savedPhase === "lost" && lives !== 0)
  )
    return initial;
  if (
    !Array.isArray(saved.available) ||
    saved.available.length !== expectedAvailableCount ||
    saved.available.some(
      (stone, index, all) =>
        !Number.isInteger(stone) ||
        stone! < 0 ||
        stone! > 3 ||
        all.indexOf(stone) !== index,
    )
  )
    return initial;

  const terminalWin = savedPhase === "won" && step === maxStep;
  const phase: GonggiPhase = terminalWin
    ? "won"
    : lives === 0
      ? "lost"
      : initial.stage === 5 && step === 1 && handCaught! >= 3
        ? "flip-ready"
        : "ready";
  return {
    ...initial,
    step: step!,
    lives: lives!,
    score: score!,
    combo: combo!,
    handCaught: handCaught!,
    phase,
    available: [...saved.available],
    selected: [],
  };
}

export function serializableGonggiState(state: GonggiState): GonggiState {
  if (state.phase !== "airborne") return { ...state, selected: [] };
  return {
    ...state,
    selected: [],
    phase: state.stage === 5 && state.step === 1 ? "flip-ready" : "ready",
  };
}
