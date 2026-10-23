export type Phase = "play" | "won" | "lost";
export interface State {
  version: 1;
  board: number[];
  falling: number[];
  next: number[];
  x: number;
  y: number;
  rng: number;
  cleared: number;
  score: number;
  pieces: number;
  chain: number;
  phase: Phase;
}
const integer = (n: unknown, min: number, max: number) =>
  typeof n === "number" && Number.isSafeInteger(n) && n >= min && n <= max;
function random(s: State) {
  s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
  return (s.rng % 5) + 1;
}
function trio(s: State) {
  return [random(s), random(s), random(s)];
}
export function fresh(seed = 1837): State {
  const s: State = {
    version: 1,
    board: Array(72).fill(0),
    falling: [],
    next: [],
    x: 2,
    y: 0,
    rng: seed >>> 0 || 1837,
    cleared: 0,
    score: 0,
    pieces: 0,
    chain: 0,
    phase: "play",
  };
  s.falling = trio(s);
  s.next = trio(s);
  return s;
}
export function fits(s: State, x = s.x, y = s.y) {
  return (
    x >= 0 &&
    x < 6 &&
    y >= 0 &&
    y + 2 < 12 &&
    s.falling.every((_, i) => s.board[(y + i) * 6 + x] === 0)
  );
}
export function matches(b: number[]) {
  const found = new Set<number>();
  for (let y = 0; y < 12; y++)
    for (let x = 0; x < 6; x++) {
      const v = b[y * 6 + x];
      if (!v) continue;
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
      ]) {
        const line: number[] = [];
        let xx = x,
          yy = y;
        while (xx >= 0 && xx < 6 && yy < 12 && b[yy * 6 + xx] === v) {
          line.push(yy * 6 + xx);
          xx += dx!;
          yy += dy!;
        }
        if (line.length >= 3) line.forEach((i) => found.add(i));
      }
    }
  return [...found].sort((a, b) => a - b);
}
export function settle(input: number[]) {
  const board = [...input];
  let cleared = 0,
    chain = 0,
    score = 0;
  const waves: number[][] = [];
  for (;;) {
    const hit = matches(board);
    if (!hit.length) break;
    waves.push(hit);
    chain++;
    cleared += hit.length;
    score += hit.length * 10 * chain;
    hit.forEach((i) => (board[i] = 0));
    for (let x = 0; x < 6; x++) {
      const col = [];
      for (let y = 11; y >= 0; y--)
        if (board[y * 6 + x]) col.push(board[y * 6 + x]!);
      for (let y = 11; y >= 0; y--) board[y * 6 + x] = col[11 - y] ?? 0;
    }
  }
  return { board, cleared, chain, score, waves };
}
export function move(s: State, dx: number) {
  if (s.phase !== "play" || !fits(s, s.x + dx)) return s;
  return { ...s, x: s.x + dx };
}
export function rotate(s: State) {
  return s.phase !== "play"
    ? s
    : { ...s, falling: [s.falling[2]!, s.falling[0]!, s.falling[1]!] };
}
export function down(s: State): State {
  if (s.phase !== "play") return s;
  if (fits(s, s.x, s.y + 1)) return { ...s, y: s.y + 1 };
  return lock(s);
}
export function drop(s: State): State {
  if (s.phase !== "play") return s;
  let y = s.y;
  while (fits(s, s.x, y + 1)) y++;
  return lock({ ...s, y });
}
function lock(s: State): State {
  const board = [...s.board];
  s.falling.forEach((v, i) => (board[(s.y + i) * 6 + s.x] = v));
  const r = settle(board);
  const n: State = {
    ...s,
    board: r.board,
    cleared: s.cleared + r.cleared,
    score: s.score + r.score,
    pieces: s.pieces + 1,
    chain: r.chain,
    x: 2,
    y: 0,
    falling: [...s.next],
    next: [],
    phase: "play",
  };
  n.next = trio(n);
  if (n.cleared >= 60) n.phase = "won";
  else if (!fits(n)) n.phase = "lost";
  return n;
}
export function interval(s: State) {
  return Math.max(230, 900 - Math.floor(s.cleared / 12) * 110);
}
export function restore(raw: unknown): State {
  if (!raw || typeof raw !== "object") return fresh();
  const s = raw as State;
  const gems = (a: unknown, n: number, min: number) =>
    Array.isArray(a) && a.length === n && a.every((v) => integer(v, min, 5));
  if (
    s.version !== 1 ||
    !gems(s.board, 72, 0) ||
    !gems(s.falling, 3, 1) ||
    !gems(s.next, 3, 1) ||
    !integer(s.x, 0, 5) ||
    !integer(s.y, 0, 9) ||
    !integer(s.rng, 0, 0xffffffff) ||
    !integer(s.cleared, 0, 131) ||
    !integer(s.score, 0, 100000) ||
    !integer(s.pieces, 0, 100000) ||
    !integer(s.chain, 0, 24) ||
    !["play", "won", "lost"].includes(s.phase) ||
    s.score < s.cleared * 10 ||
    s.score % 10 !== 0 ||
    s.board.some((v, i) => v !== 0 && i < 66 && s.board[i + 6] === 0) ||
    s.cleared + s.board.filter(Boolean).length !== s.pieces * 3 ||
    matches(s.board).length
  )
    return fresh();
  if (
    (s.phase === "play" && (!fits(s) || s.cleared >= 60)) ||
    (s.phase === "won" && (s.cleared < 60 || s.x !== 2 || s.y !== 0)) ||
    (s.phase === "lost" &&
      (fits(s) || s.cleared >= 60 || s.x !== 2 || s.y !== 0))
  )
    return fresh();
  return structuredClone(s);
}
