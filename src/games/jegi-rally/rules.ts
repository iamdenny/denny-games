export type JegiStage = 1 | 2 | 3;
export type JegiTechnique = "left" | "right" | "back";
export type JegiPhase = "play" | "won" | "lost";
export type KickResult =
  "early" | "late" | "wrong-technique" | "hit" | "ignored";

export interface JegiState {
  version: 1;
  stage: JegiStage;
  hits: number;
  misses: number;
  score: number;
  streak: number;
  firstTechnique: "left" | "right" | null;
  selectedTechnique: JegiTechnique;
  phase: JegiPhase;
}

export interface JegiStageRules {
  stage: JegiStage;
  kicks: number;
  flightMs: number;
  windowStartMs: number;
  windowEndMs: number;
  targetMs: number;
}

export const MAX_MISSES = 3;
export const JEGI_STAGES: JegiStageRules[] = [
  {
    stage: 1 as const,
    kicks: 6,
    flightMs: 2200,
    windowStartMs: 1150,
    windowEndMs: 1850,
    targetMs: 1500,
  },
  {
    stage: 2 as const,
    kicks: 8,
    flightMs: 2000,
    windowStartMs: 1025,
    windowEndMs: 1575,
    targetMs: 1300,
  },
  {
    stage: 3 as const,
    kicks: 10,
    flightMs: 1800,
    windowStartMs: 825,
    windowEndMs: 1275,
    targetMs: 1050,
  },
];

export function validJegiStage(stage: number): stage is JegiStage {
  return Number.isInteger(stage) && stage >= 1 && stage <= JEGI_STAGES.length;
}

function stageIndex(stage: JegiStage) {
  return stage - 1;
}

export function stageRules(stage: JegiStage): JegiStageRules {
  return JEGI_STAGES[stageIndex(stage)]!;
}

export function techniquesForStage(stage: JegiStage): JegiTechnique[] {
  return stage === 3 ? ["left", "right", "back"] : ["left", "right"];
}

export function createJegiState(stage: number): JegiState {
  const validStage: JegiStage = validJegiStage(stage) ? stage : 1;
  return {
    version: 1,
    stage: validStage,
    hits: 0,
    misses: 0,
    score: 0,
    streak: 0,
    firstTechnique: null,
    selectedTechnique: "left",
    phase: "play",
  };
}

export function requiredTechnique(state: JegiState): JegiTechnique | null {
  if (state.phase !== "play") return null;
  if (state.stage === 1) return state.firstTechnique;
  if (state.stage === 2) {
    if (!state.firstTechnique) return null;
    const nextIsFirst = state.hits % 2 === 0;
    if (nextIsFirst) return state.firstTechnique;
    return state.firstTechnique === "left" ? "right" : "left";
  }
  return (["left", "right", "back"] as const)[state.hits % 3]!;
}

export function selectJegiTechnique(
  state: JegiState,
  technique: JegiTechnique,
): JegiState {
  if (
    state.phase !== "play" ||
    !techniquesForStage(state.stage).includes(technique)
  )
    return state;
  return { ...state, selectedTechnique: technique };
}

function missJegiKick(state: JegiState): JegiState {
  const misses = Math.min(MAX_MISSES, state.misses + 1);
  return {
    ...state,
    misses,
    streak: 0,
    selectedTechnique: requiredTechnique(state) ?? state.selectedTechnique,
    phase: misses >= MAX_MISSES ? "lost" : "play",
  };
}

function accuracyPoints(stage: JegiStage, elapsedMs: number) {
  const { targetMs, windowStartMs, windowEndMs } = stageRules(stage);
  const halfWindow = (windowEndMs - windowStartMs) / 2;
  const closeness = Math.min(1, Math.abs(elapsedMs - targetMs) / halfWindow);
  return Math.round(100 - closeness * 50);
}

export function tryJegiKick(
  state: JegiState,
  elapsedMs: number,
): { state: JegiState; result: KickResult } {
  if (state.phase !== "play" || !Number.isFinite(elapsedMs))
    return { state, result: "ignored" };
  const { windowStartMs, windowEndMs, kicks } = stageRules(state.stage);
  if (elapsedMs < windowStartMs) return { state, result: "early" };
  if (elapsedMs > windowEndMs)
    return { state: missJegiKick(state), result: "late" };

  const required = requiredTechnique(state);
  if (required && state.selectedTechnique !== required)
    return { state: missJegiKick(state), result: "wrong-technique" };

  const hits = state.hits + 1;
  const streak = state.streak + 1;
  const points = accuracyPoints(state.stage, elapsedMs) + state.streak * 10;
  const selectedFoot =
    state.selectedTechnique === "back" ? null : state.selectedTechnique;
  return {
    result: "hit",
    state: {
      ...state,
      hits,
      score: state.score + points,
      streak,
      firstTechnique:
        state.firstTechnique ?? (state.stage === 3 ? null : selectedFoot),
      phase: hits >= kicks ? "won" : "play",
    },
  };
}

export function missJegi(state: JegiState): JegiState {
  if (state.phase !== "play") return state;
  return missJegiKick(state);
}

export function serializeJegiState(state: JegiState): JegiState {
  return { ...state };
}

export function restoreJegiState(
  raw: unknown,
  stage: number,
): JegiState | null {
  if (!raw || typeof raw !== "object" || !validJegiStage(stage)) return null;
  const value = raw as Partial<JegiState>;
  const first = value.firstTechnique;
  const state: JegiState = {
    version: value.version as 1,
    stage: value.stage as JegiStage,
    hits: value.hits as number,
    misses: value.misses as number,
    score: value.score as number,
    streak: value.streak as number,
    firstTechnique: first as "left" | "right" | null,
    selectedTechnique: value.selectedTechnique as JegiTechnique,
    phase: value.phase as JegiPhase,
  };
  if (
    state.version !== 1 ||
    state.stage !== stage ||
    !validJegiStage(state.stage) ||
    !Number.isInteger(state.hits) ||
    state.hits < 0 ||
    state.hits > stageRules(state.stage).kicks ||
    !Number.isInteger(state.misses) ||
    state.misses < 0 ||
    state.misses > MAX_MISSES ||
    !Number.isInteger(state.score) ||
    state.score < 0 ||
    state.score > 10000 ||
    !Number.isInteger(state.streak) ||
    state.streak < 0 ||
    state.streak > state.hits ||
    !(first === null || first === "left" || first === "right") ||
    !techniquesForStage(state.stage).includes(state.selectedTechnique) ||
    !(
      state.phase === "play" ||
      state.phase === "won" ||
      state.phase === "lost"
    ) ||
    (state.phase === "won") !==
      (state.hits === stageRules(state.stage).kicks) ||
    (state.phase === "lost") !== (state.misses === MAX_MISSES) ||
    (state.hits > 0 && state.stage < 3 && first === null) ||
    (state.hits === 0 && first !== null) ||
    (state.stage === 3 && first !== null)
  )
    return null;
  return state;
}
