import { random } from "../../lib/random";
export type Kind = "lantern-grid" | "number-trail";
export interface Puzzle {
  kind: Kind;
  size: number;
  initial: number[];
  solution: number[];
}
export const STAGES = 24;
export function solved(kind: Kind, cells: readonly number[]): boolean {
  return cells.every(
    (v, i) => v === (kind === "lantern-grid" ? 0 : (i + 1) % cells.length),
  );
}
export function neighbours(index: number, size: number): number[] {
  const x = index % size,
    y = Math.floor(index / size);
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]
    .filter(([a, b]) => a! >= 0 && b! >= 0 && a! < size && b! < size)
    .map(([a, b]) => b! * size + a!);
}
export function play(
  puzzle: Puzzle,
  cells: readonly number[],
  index: number,
): number[] | undefined {
  if (!Number.isInteger(index) || index < 0 || index >= cells.length) return;
  const next = [...cells];
  if (puzzle.kind === "lantern-grid") {
    for (const i of [index, ...neighbours(index, puzzle.size)])
      next[i] = 1 - next[i]!;
  } else {
    const empty = cells.indexOf(0);
    if (!neighbours(empty, puzzle.size).includes(index)) return;
    [next[empty], next[index]] = [next[index]!, 0];
  }
  return next;
}
export function createPuzzle(kind: Kind, seed: string, stage: number): Puzzle {
  stage = Number.isInteger(stage) ? Math.max(1, Math.min(STAGES, stage)) : 1;
  const size =
    kind === "lantern-grid"
      ? 3 + Math.floor((stage - 1) / 8)
      : stage <= 12
        ? 3
        : 4;
  const puzzle: Puzzle = {
    kind,
    size,
    initial: Array.from({ length: size * size }, (_, i) =>
      kind === "lantern-grid" ? 0 : (i + 1) % (size * size),
    ),
    solution: [],
  };
  const rng = random(`${kind}:${seed}:${stage}`);
  if (kind === "lantern-grid") {
    const indices = Array.from({ length: size * size }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [indices[i], indices[j]] = [indices[j]!, indices[i]!];
    }
    for (const i of indices.slice(0, 1 + ((stage - 1) % 8))) {
      puzzle.initial = play(puzzle, puzzle.initial, i)!;
      puzzle.solution.push(i);
    }
  } else {
    let previous = -1;
    const seen = new Set([puzzle.initial.join(",")]);
    // Legal moves from the goal guarantee solvability, without parity repairs.
    for (let n = 0; n < 2 + stage * 2; n++) {
      const empty = puzzle.initial.indexOf(0);
      const options = neighbours(empty, size).filter(
        (i) =>
          i !== previous &&
          !seen.has(play(puzzle, puzzle.initial, i)!.join(",")),
      );
      if (!options.length) break;
      const index = options[Math.floor(rng() * options.length)]!;
      puzzle.initial = play(puzzle, puzzle.initial, index)!;
      seen.add(puzzle.initial.join(","));
      puzzle.solution.unshift(empty);
      previous = empty;
    }
  }
  if (solved(kind, puzzle.initial)) {
    const index =
      kind === "lantern-grid"
        ? 0
        : neighbours(puzzle.initial.indexOf(0), size)[0]!;
    const reverse = kind === "lantern-grid" ? index : puzzle.initial.indexOf(0);
    puzzle.initial = play(puzzle, puzzle.initial, index)!;
    puzzle.solution.unshift(reverse);
  }
  return puzzle;
}
export function replay(puzzle: Puzzle, history: unknown): number[] | undefined {
  if (!Array.isArray(history) || history.length > 2000) return;
  let cells = [...puzzle.initial];
  for (const index of history) {
    if (solved(puzzle.kind, cells)) return;
    const next = play(puzzle, cells, index);
    if (!next) return;
    cells = next;
  }
  return cells;
}
