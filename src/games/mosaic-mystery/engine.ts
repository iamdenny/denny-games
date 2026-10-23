export interface Puzzle {
  name: [string, string];
  size: number;
  cells: number[];
}
const patterns: [string, string, string[]][] = [
  ["Heart", "하트", ["01110", "11111", "11111", "01110", "00100"]],
  ["Tree", "나무", ["00100", "01110", "11111", "00100", "00100"]],
  ["House", "집", ["00100", "01110", "11111", "11011", "11011"]],
  ["Cup", "찻잔", ["11110", "11111", "11111", "11110", "01100"]],
  ["Arrow", "화살표", ["00100", "00010", "11111", "00010", "00100"]],
  ["Sail", "돛배", ["10000", "11000", "11100", "11111", "11110"]],
  [
    "Rocket",
    "로켓",
    ["001100", "011110", "011110", "111111", "101101", "001100"],
  ],
  [
    "Castle",
    "성",
    ["101101", "111111", "011110", "011110", "010010", "111111"],
  ],
  [
    "Tulip",
    "튤립",
    ["101010", "111110", "011100", "001000", "011000", "001000"],
  ],
  ["Mug", "머그", ["111100", "111110", "111110", "111110", "111100", "011000"]],
  [
    "Mountain",
    "산",
    ["000100", "001110", "011111", "111111", "111111", "111111"],
  ],
  [
    "Lantern",
    "등불",
    ["001100", "011110", "111111", "111111", "011110", "001100"],
  ],
];
export const puzzles: Puzzle[] = patterns.map(([en, ko, rows]) => ({
  name: [en, ko],
  size: rows.length,
  cells: rows.join("").split("").map(Number),
}));
export function clues(line: number[]) {
  const out: number[] = [];
  let run = 0;
  for (const v of [...line, 0]) {
    if (v) run++;
    else if (run) {
      out.push(run);
      run = 0;
    }
  }
  return out.length ? out : [0];
}
export const rowClues = (p: Puzzle) =>
  Array.from({ length: p.size }, (_, y) =>
    clues(p.cells.slice(y * p.size, (y + 1) * p.size)),
  );
export const colClues = (p: Puzzle) =>
  Array.from({ length: p.size }, (_, x) =>
    clues(Array.from({ length: p.size }, (_, y) => p.cells[y * p.size + x]!)),
  );
export function solutions(p: Puzzle) {
  const rows = rowClues(p),
    cols = colClues(p);
  const variants = rows.map((c) =>
    Array.from({ length: 2 ** p.size }, (_, mask) =>
      Array.from({ length: p.size }, (_, x) => (mask >> x) & 1),
    ).filter((r) => JSON.stringify(clues(r)) === JSON.stringify(c)),
  );
  const cv = cols.map((c) =>
    Array.from({ length: 2 ** p.size }, (_, mask) =>
      Array.from({ length: p.size }, (_, x) => (mask >> x) & 1),
    ).filter((r) => JSON.stringify(clues(r)) === JSON.stringify(c)),
  );
  let count = 0;
  const board: number[][] = [];
  function visit(y: number) {
    if (count > 1) return;
    if (y === p.size) {
      count++;
      return;
    }
    for (const r of variants[y]!) {
      board.push(r);
      if (
        cv.every((v, x) =>
          v.some((col) => board.every((row, yy) => row[x] === col[yy])),
        )
      )
        visit(y + 1);
      board.pop();
    }
  }
  visit(0);
  return count;
}
export interface State {
  version: 1;
  stage: number;
  marks: number[];
  moves: number;
  phase: "play" | "won";
}
export function fresh(stage = 1): State {
  stage = Math.max(1, Math.min(12, Math.floor(stage)));
  return {
    version: 1,
    stage,
    marks: Array(puzzles[stage - 1]!.cells.length).fill(0),
    moves: 0,
    phase: "play",
  };
}
export function solved(s: State) {
  return puzzles[s.stage - 1]!.cells.every(
    (v, i) => v === (s.marks[i] === 1 ? 1 : 0),
  );
}
export function mark(s: State, i: number, mode: 1 | 2): State {
  if (
    s.phase !== "play" ||
    !Number.isInteger(i) ||
    i < 0 ||
    i >= s.marks.length
  )
    return s;
  const n = { ...s, marks: [...s.marks], moves: s.moves + 1 };
  n.marks[i] = n.marks[i] === mode ? 0 : mode;
  if (solved(n)) n.phase = "won";
  return n;
}
export function restore(raw: unknown, stage: number): State {
  const f = fresh(stage);
  if (!raw || typeof raw !== "object") return f;
  const s = raw as State;
  if (
    s.version !== 1 ||
    s.stage !== f.stage ||
    !Array.isArray(s.marks) ||
    s.marks.length !== f.marks.length ||
    s.marks.some((v) => !Number.isInteger(v) || v < 0 || v > 2) ||
    !Number.isSafeInteger(s.moves) ||
    s.moves < 0 ||
    s.moves > 100000 ||
    s.moves < s.marks.filter(Boolean).length ||
    !["play", "won"].includes(s.phase) ||
    (s.phase === "won") !== solved(s)
  )
    return f;
  return structuredClone(s);
}
