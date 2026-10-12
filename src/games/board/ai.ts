import {
  legal,
  play,
  other,
  owner,
  boxEdges,
  type Position,
  type Move,
  type Side,
} from "./rules";
const weights = [0, 2, 18, 160, 2200, 100000];
export function evaluate(s: Position, side: Side): number {
  if (s.winner)
    return s.winner === 3 ? 0 : s.winner === side ? 1000000 : -1000000;
  if (s.kind === "dots-and-boxes")
    return s.boxes.reduce(
      (sum, v) => sum + (v === side ? 100 : v === other(side) ? -100 : 0),
      0,
    );
  if (s.kind === "checkers")
    return s.cells.reduce(
      (sum, v, i) =>
        sum +
        (!v
          ? 0
          : (owner(v) === side ? 1 : -1) *
            (v > 2
              ? 180
              : 100 +
                (owner(v) === 1 ? 7 - Math.floor(i / 8) : Math.floor(i / 8)) *
                  3)),
      0,
    );
  if (s.kind === "reversi")
    return (
      s.cells.reduce(
        (sum, v, i) =>
          sum +
          (!v
            ? 0
            : (v === side ? 1 : -1) *
              ([0, 7, 56, 63].includes(i)
                ? 100
                : [1, 6, 8, 9, 14, 15, 48, 49, 54, 55, 57, 62].includes(i)
                  ? -12
                  : 2)),
        0,
      ) +
      4 *
        (legal({ ...s, turn: side }).length -
          legal({ ...s, turn: other(side) }).length)
    );
  const w = s.kind === "gomoku" ? 15 : 7,
    h = s.kind === "gomoku" ? 15 : 6,
    need = s.kind === "gomoku" ? 5 : 4;
  let total = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
      ]) {
        const xx = x + dx! * (need - 1),
          yy = y + dy! * (need - 1);
        if (xx < 0 || xx >= w || yy < 0 || yy >= h) continue;
        let a = 0,
          b = 0;
        for (let k = 0; k < need; k++) {
          const v = s.cells[(y + dy! * k) * w + x + dx! * k];
          if (v === side) a++;
          else if (v) b++;
        }
        if (!b) total += weights[a]!;
        if (!a) total -= weights[b]!;
      }
  return total;
}
function candidates(s: Position): Move[] {
  const moves = legal(s);
  if (s.kind !== "gomoku") return moves;
  if (!s.moves) return [{ to: 112 }];
  return moves.filter((m) =>
    s.cells.some(
      (v, i) =>
        v &&
        Math.abs((i % 15) - (m.to % 15)) <= 2 &&
        Math.abs(Math.floor(i / 15) - Math.floor(m.to / 15)) <= 2,
    ),
  );
}
function rank(s: Position, m: Move): number {
  if (s.kind === "dots-and-boxes") {
    let score = 0;
    for (let i = 0; i < 16; i++)
      if (!s.boxes[i] && boxEdges(i).includes(m.to)) {
        const count = boxEdges(i).filter((e) => s.cells[e]).length;
        score += count === 3 ? 100 : count === 2 ? -30 : 2;
      }
    return score;
  }
  if (s.kind === "checkers")
    return Math.abs(Math.floor(m.from! / 8) - Math.floor(m.to / 8)) === 2
      ? 100
      : 3 - Math.abs((m.to % 8) - 3.5);
  if (s.kind === "reversi")
    return [0, 7, 56, 63].includes(m.to) ? 100 : flipsCount(s, m);
  // Local alignment ordering avoids evaluating every entire board at every branch.
  const w = s.kind === "gomoku" ? 15 : 7,
    h = s.kind === "gomoku" ? 15 : 6;
  let score = 0;
  for (const side of [s.turn, other(s.turn)])
    for (const [dx, dy] of [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ]) {
      let count = 1,
        open = 0;
      for (const sign of [-1, 1]) {
        let x = (m.to % w) + dx! * sign,
          y = Math.floor(m.to / w) + dy! * sign;
        while (
          x >= 0 &&
          x < w &&
          y >= 0 &&
          y < h &&
          s.cells[y * w + x] === side
        ) {
          count++;
          x += dx! * sign;
          y += dy! * sign;
        }
        if (x >= 0 && x < w && y >= 0 && y < h && !s.cells[y * w + x]) open++;
      }
      score +=
        weights[Math.min(count, 5)]! * (side === s.turn ? 1.1 : 1) * (open + 1);
    }
  return score;
}
function flipsCount(s: Position, m: Move) {
  return evaluate(play(s, m), s.turn);
}
export function chooseMove(s: Position, level: number): Move | undefined {
  const side = s.turn,
    depth = Math.max(1, Math.min(3, level)),
    limit = [0, 160, 600, 1600][depth]!;
  let visited = 0;
  const ordered = (p: Position) =>
    candidates(p)
      .map((move) => ({ move, rank: rank(p, move) }))
      .sort((a, b) => b.rank - a.rank)
      .slice(
        0,
        p.kind === "gomoku" ? 12 : p.kind === "dots-and-boxes" ? 14 : 32,
      )
      .map((v) => v.move);
  const search = (
    p: Position,
    d: number,
    alpha: number,
    beta: number,
  ): number => {
    if (p.winner || !d || ++visited > limit) return evaluate(p, side);
    const max = p.turn === side;
    let best = max ? -Infinity : Infinity;
    for (const move of ordered(p)) {
      const value = search(play(p, move), d - 1, alpha, beta);
      best = max ? Math.max(best, value) : Math.min(best, value);
      if (max) alpha = Math.max(alpha, best);
      else beta = Math.min(beta, best);
      if (beta <= alpha || visited > limit) break;
    }
    return Number.isFinite(best) ? best : evaluate(p, side);
  };
  let best: Move | undefined,
    score = -Infinity;
  for (const move of ordered(s)) {
    const next = play(s, move);
    // Always take an immediate win, regardless of difficulty/budget.
    if (next.winner === side) return move;
    const value = search(next, depth - 1, -Infinity, Infinity);
    if (value > score) {
      score = value;
      best = move;
    }
  }
  return best;
}
