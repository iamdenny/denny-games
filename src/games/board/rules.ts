export const boardKinds = [
  "gomoku",
  "reversi",
  "four-in-a-row",
  "checkers",
  "dots-and-boxes",
] as const;
export type BoardKind = (typeof boardKinds)[number];
export type Side = 1 | 2;
export interface Move {
  from?: number;
  to: number;
}
export interface Position {
  kind: BoardKind;
  cells: number[];
  turn: Side;
  winner: 0 | Side | 3;
  moves: number;
  last: number;
  forced: number;
  quiet: number;
  boxes: number[];
}
export const other = (side: Side): Side => (side === 1 ? 2 : 1);
export const owner = (piece: number) => (piece > 2 ? piece - 2 : piece);
export const dimensions = (kind: BoardKind) =>
  kind === "gomoku"
    ? [15, 15]
    : kind === "four-in-a-row"
      ? [7, 6]
      : kind === "dots-and-boxes"
        ? [9, 9]
        : [8, 8];
export function initial(kind: BoardKind): Position {
  const [w, h] = dimensions(kind);
  const cells = Array<number>(kind === "dots-and-boxes" ? 40 : w! * h!).fill(0);
  if (kind === "reversi") {
    cells[27] = 2;
    cells[28] = 1;
    cells[35] = 1;
    cells[36] = 2;
  }
  if (kind === "checkers")
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++)
        if ((x + y) % 2 && (y < 3 || y > 4)) cells[y * 8 + x] = y < 3 ? 2 : 1;
  return {
    kind,
    cells,
    turn: 1,
    winner: 0,
    moves: 0,
    last: -1,
    forced: -1,
    quiet: 0,
    boxes: kind === "dots-and-boxes" ? Array(16).fill(0) : [],
  };
}
const inside = (x: number, y: number, w = 8, h = w) =>
  x >= 0 && y >= 0 && x < w && y < h;
const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
export function flips(s: Position, to: number): number[] {
  if (s.cells[to] !== 0) return [];
  const found: number[] = [];
  for (const [dx, dy] of directions) {
    let x = (to % 8) + dx!,
      y = Math.floor(to / 8) + dy!;
    const line: number[] = [];
    while (inside(x, y) && s.cells[y * 8 + x] === other(s.turn)) {
      line.push(y * 8 + x);
      x += dx!;
      y += dy!;
    }
    if (line.length && inside(x, y) && s.cells[y * 8 + x] === s.turn)
      found.push(...line);
  }
  return found;
}
function checkerMoves(s: Position): Move[] {
  const jumps: Move[] = [],
    steps: Move[] = [];
  for (let from = 0; from < 64; from++) {
    const piece = s.cells[from]!;
    if (owner(piece) !== s.turn || (s.forced >= 0 && from !== s.forced))
      continue;
    for (const dy of piece > 2 ? [-1, 1] : [s.turn === 1 ? -1 : 1])
      for (const dx of [-1, 1]) {
        const x = (from % 8) + dx,
          y = Math.floor(from / 8) + dy;
        if (!inside(x, y)) continue;
        if (!s.cells[y * 8 + x] && s.forced < 0)
          steps.push({ from, to: y * 8 + x });
        const xx = x + dx,
          yy = y + dy;
        if (
          owner(s.cells[y * 8 + x]!) === other(s.turn) &&
          inside(xx, yy) &&
          !s.cells[yy * 8 + xx]
        )
          jumps.push({ from, to: yy * 8 + xx });
      }
  }
  return jumps.length ? jumps : s.forced >= 0 ? [] : steps;
}
export function legal(s: Position): Move[] {
  if (s.winner) return [];
  if (s.kind === "checkers") return checkerMoves(s);
  if (s.kind === "four-in-a-row") {
    const moves: Move[] = [];
    for (let x = 0; x < 7; x++)
      for (let y = 5; y >= 0; y--)
        if (!s.cells[y * 7 + x]) {
          moves.push({ to: y * 7 + x });
          break;
        }
    return moves;
  }
  return s.cells.flatMap((v, to) =>
    !v && (s.kind !== "reversi" || flips(s, to).length) ? [{ to }] : [],
  );
}
export function boxEdges(box: number): number[] {
  const x = box % 4,
    y = Math.floor(box / 4);
  return [y * 4 + x, (y + 1) * 4 + x, 20 + y * 5 + x, 20 + y * 5 + x + 1];
}
function lineWin(s: Position, to: number, need: number, w: number, h: number) {
  for (const [dx, dy] of [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ]) {
    let count = 1;
    for (const sign of [-1, 1]) {
      let x = (to % w) + dx! * sign,
        y = Math.floor(to / w) + dy! * sign;
      while (inside(x, y, w, h) && s.cells[y * w + x] === s.turn) {
        count++;
        x += dx! * sign;
        y += dy! * sign;
      }
    }
    if (count >= need) return true;
  }
  return false;
}
export function play(s: Position, m: Move): Position {
  if (!legal(s).some((v) => v.to === m.to && v.from === m.from)) return s;
  const n: Position = {
    ...s,
    cells: [...s.cells],
    boxes: [...s.boxes],
    last: m.to,
    moves: s.moves + 1,
    forced: -1,
  };
  if (s.kind === "checkers") {
    const from = m.from!,
      piece = s.cells[from]!,
      capture = Math.abs(Math.floor(from / 8) - Math.floor(m.to / 8)) === 2;
    n.cells[from] = 0;
    n.cells[m.to] = piece;
    if (capture)
      n.cells[
        ((Math.floor(from / 8) + Math.floor(m.to / 8)) / 2) * 8 +
          ((from % 8) + (m.to % 8)) / 2
      ] = 0;
    const crowned = piece <= 2 && (m.to < 8 || m.to >= 56);
    if (crowned) n.cells[m.to] = piece + 2;
    n.quiet = capture || piece <= 2 ? 0 : s.quiet + 1;
    if (capture && !crowned) {
      n.forced = m.to;
      if (checkerMoves(n).length) return n;
      n.forced = -1;
    }
    n.turn = other(s.turn);
    if (!legal(n).length) n.winner = s.turn;
    else if (n.quiet >= 80) n.winner = 3;
    return n;
  }
  n.cells[m.to] = s.turn;
  if (s.kind === "dots-and-boxes") {
    let claimed = 0;
    n.boxes.forEach((v, i) => {
      if (!v && boxEdges(i).every((edge) => n.cells[edge])) {
        n.boxes[i] = s.turn;
        claimed++;
      }
    });
    if (!n.boxes.includes(0)) {
      const a = n.boxes.filter((v) => v === 1).length,
        b = 16 - a;
      n.winner = a === b ? 3 : a > b ? 1 : 2;
    } else if (!claimed) n.turn = other(s.turn);
    return n;
  }
  if (s.kind === "reversi") {
    for (const i of flips(s, m.to)) n.cells[i] = s.turn;
    n.turn = other(s.turn);
    if (!legal(n).length) {
      n.turn = s.turn;
      if (!legal(n).length) {
        const a = n.cells.filter((v) => v === 1).length,
          b = n.cells.filter((v) => v === 2).length;
        n.winner = a === b ? 3 : a > b ? 1 : 2;
      }
    }
    return n;
  }
  const [w, h] = dimensions(s.kind);
  if (lineWin(n, m.to, s.kind === "gomoku" ? 5 : 4, w!, h!)) n.winner = s.turn;
  else if (!n.cells.includes(0)) n.winner = 3;
  n.turn = other(s.turn);
  return n;
}
export function restore(kind: BoardKind, value: unknown): Position | undefined {
  if (!value || typeof value !== "object") return;
  const s = value as Position,
    base = initial(kind);
  if (
    s.kind !== kind ||
    !Array.isArray(s.cells) ||
    s.cells.length !== base.cells.length ||
    !s.cells.every(
      (v) =>
        Number.isInteger(v) && v >= 0 && v <= (kind === "checkers" ? 4 : 2),
    ) ||
    ![1, 2].includes(s.turn) ||
    ![0, 1, 2, 3].includes(s.winner) ||
    !Number.isInteger(s.moves) ||
    s.moves < 0 ||
    !Number.isInteger(s.last) ||
    s.last < -1 ||
    s.last >= s.cells.length ||
    !Number.isInteger(s.forced) ||
    s.forced < -1 ||
    s.forced >= s.cells.length ||
    !Number.isInteger(s.quiet) ||
    s.quiet < 0 ||
    !Array.isArray(s.boxes) ||
    s.boxes.length !== base.boxes.length ||
    !s.boxes.every((v) => [0, 1, 2].includes(v))
  )
    return;
  return { ...s, cells: [...s.cells], boxes: [...s.boxes] };
}
