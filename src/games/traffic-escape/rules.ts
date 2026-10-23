export const CARS = [
  { axis: "h", fixed: 2, length: 2 },
  { axis: "v", fixed: 2, length: 2 },
  { axis: "v", fixed: 3, length: 3 },
  { axis: "h", fixed: 4, length: 2 },
  { axis: "v", fixed: 0, length: 2 },
  { axis: "h", fixed: 0, length: 3 },
  { axis: "h", fixed: 5, length: 2 },
] as const;
export const STAGES: number[][] = [
  [0, 1, 2, 4, 0, 3, 0],
  [0, 3, 1, 0, 0, 3, 1],
  [1, 3, 1, 0, 2, 2, 3],
  [1, 4, 1, 0, 1, 2, 3],
  [0, 1, 3, 1, 0, 1, 4],
  [0, 2, 2, 4, 3, 2, 3],
  [0, 4, 1, 4, 4, 2, 3],
  [0, 1, 1, 4, 3, 0, 1],
  [0, 2, 2, 1, 4, 3, 2],
  [0, 3, 1, 3, 0, 3, 2],
  [0, 2, 1, 1, 0, 3, 3],
  [0, 2, 1, 1, 3, 1, 2],
];
export interface State {
  version: 1;
  stage: number;
  positions: number[];
  selected: number;
  moves: number;
  history: number[][];
  phase: "play" | "won";
}
export function fresh(stage = 1): State {
  return {
    version: 1,
    stage,
    positions: [...STAGES[stage - 1]!],
    selected: 0,
    moves: 0,
    history: [],
    phase: "play",
  };
}
const int = (v: unknown, a: number, b: number) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= a && v <= b;
export function validPositions(raw: unknown): raw is number[] {
  if (!Array.isArray(raw) || raw.length !== CARS.length) return false;
  const occupied = new Set<number>();
  for (let i = 0; i < CARS.length; i++) {
    const c = CARS[i]!,
      p = raw[i];
    if (!int(p, 0, 6 - c.length)) return false;
    for (let k = 0; k < c.length; k++) {
      const cell = c.axis === "h" ? c.fixed * 6 + p + k : (p + k) * 6 + c.fixed;
      if (occupied.has(cell)) return false;
      occupied.add(cell);
    }
  }
  return true;
}
export function move(s: State, car: number, direction: number): State {
  if (
    s.phase !== "play" ||
    !int(car, 0, CARS.length - 1) ||
    ![-1, 1].includes(direction)
  )
    return s;
  const positions = [...s.positions];
  positions[car]! += direction;
  if (!validPositions(positions)) return s;
  return {
    ...s,
    positions,
    selected: car,
    moves: s.moves + 1,
    history: [...s.history.slice(-99), [...s.positions]],
    phase: positions[0] === 4 ? "won" : "play",
  };
}
export function undo(s: State): State {
  if (s.phase !== "play" || !s.history.length) return s;
  return {
    ...s,
    positions: [...s.history[s.history.length - 1]!],
    history: s.history.slice(0, -1),
  };
}
export function score(s: State) {
  return Math.max(100, 1600 - s.moves * 20);
}
export function restore(raw: unknown, stage: number): State | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as State;
  if (
    s.version !== 1 ||
    s.stage !== stage ||
    !int(stage, 1, 12) ||
    !validPositions(s.positions) ||
    !int(s.selected, 0, 6) ||
    !int(s.moves, 0, 1e6) ||
    !Array.isArray(s.history) ||
    s.history.length > 100 ||
    s.history.length > s.moves ||
    !s.history.every((p) => validPositions(p) && p[0] !== 4) ||
    !["play", "won"].includes(s.phase) ||
    (s.phase === "won") !== (s.positions[0] === 4)
  )
    return null;
  return structuredClone(s);
}
/** Offline/unit acceptance solver; never imported by metadata or called by the renderer. */
export function solve(s: State): [number, number][] {
  const queue = [{ p: s.positions, path: [] as [number, number][] }],
    seen = new Set([s.positions.join(",")]);
  for (let at = 0; at < queue.length && at < 50000; at++) {
    const { p, path } = queue[at]!;
    if (p[0] === 4) return path;
    for (let car = 0; car < CARS.length; car++)
      for (const d of [-1, 1]) {
        const n = [...p];
        n[car]! += d;
        const key = n.join(",");
        if (!seen.has(key) && validPositions(n)) {
          seen.add(key);
          queue.push({ p: n, path: [...path, [car, d]] });
        }
      }
  }
  return [];
}
