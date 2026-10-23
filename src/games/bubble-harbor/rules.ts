import { finite, record, type Input } from "../prism-pop/host";
export const BW = 384,
  BH = 520,
  R = 16,
  ROW = 28;
export const layouts = [
  ["000111222000", "00111222000"],
  ["000111222333", "00111222333", "000...222..."],
  ["001122330011", "00112233001", "00..22..00.."],
  ["000222111333", "00022111333", "...222......"],
  ["001100223311", "00100223311", "00..00..33.."],
  ["000111222333", "00011222333", "000...222...", "00....22..."],
  ["001122001122", "00112001122", "00..2200..22", "00....00..."],
  ["000333111222", "00333111222", "000...111...", "00....11..."],
  ["001122330011", "00112233001", "0011..33..11", "001...33..."],
  ["000111222333", "00111222333", "000111...333", "00.11....33"],
  [
    "001122330011",
    "00112233001",
    "00..2233..11",
    "00..2233...",
    "00....33....",
  ],
  [
    "000111222333",
    "00011222333",
    "000111222333",
    "00.11.22.33",
    "00....22....",
  ],
];
export interface Bubble {
  row: number;
  col: number;
  color: number;
}
export interface Harbor {
  version: 1;
  stage: number;
  score: number;
  status: "playing" | "won" | "lost";
  board: Bubble[];
  angle: number;
  ammo: number;
  next: number;
  shots: number;
  misses: number;
  offset: number;
  flight: null | {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: number;
  };
  flash: number;
  dropped: number;
}
export const center = (b: { row: number; col: number }, offset = 0) => ({
  x: R + 32 * b.col + (b.row % 2 ? R : 0),
  y: 54 + ROW * b.row + offset,
});
export const validCell = (r: number, c: number) =>
  r >= 0 && r < 15 && c >= 0 && c < (r % 2 ? 11 : 12);
export function neighbors(b: Bubble) {
  const out: { row: number; col: number }[] = [];
  for (const [dr, dc] of [
    [0, -1],
    [0, 1],
    [-1, b.row % 2 ? 0 : -1],
    [-1, b.row % 2 ? 1 : 0],
    [1, b.row % 2 ? 0 : -1],
    [1, b.row % 2 ? 1 : 0],
  ]) {
    const row = b.row + dr!,
      col = b.col + dc!;
    if (validCell(row, col)) out.push({ row, col });
  }
  return out;
}
const key = (b: { row: number; col: number }) => `${b.row}:${b.col}`;
export function newHarbor(stage: number): Harbor {
  stage = Math.max(1, Math.min(12, Math.floor(stage)));
  const board = layouts[stage - 1]!.flatMap((line, row) =>
    [...line].flatMap((c, col) =>
      c === "." ? [] : [{ row, col, color: Number(c) }],
    ),
  );
  return {
    version: 1,
    stage,
    score: 0,
    status: "playing",
    board,
    angle: -Math.PI / 2,
    ammo: board[board.length - 1]!.color,
    next: board[0]!.color,
    shots: 0,
    misses: 0,
    offset: 0,
    flight: null,
    flash: 0,
    dropped: 0,
  };
}
export function resolveMatch(s: Harbor, added: Bubble) {
  const byKey = new Map(s.board.map((b) => [key(b), b]));
  const group = new Set<string>([key(added)]),
    todo = [added];
  while (todo.length) {
    for (const n of neighbors(todo.pop()!)) {
      const b = byKey.get(key(n));
      if (b && b.color === added.color && !group.has(key(b))) {
        group.add(key(b));
        todo.push(b);
      }
    }
  }
  if (group.size < 3) {
    s.misses++;
    if (s.misses % 5 === 0) s.offset += 28;
    return 0;
  }
  s.board = s.board.filter((b) => !group.has(key(b)));
  const attached = new Set<string>(),
    queue = s.board.filter((b) => b.row === 0);
  const remaining = new Map(s.board.map((b) => [key(b), b]));
  for (const b of queue) attached.add(key(b));
  while (queue.length) {
    for (const n of neighbors(queue.pop()!)) {
      const b = remaining.get(key(n));
      if (b && !attached.has(key(b))) {
        attached.add(key(b));
        queue.push(b);
      }
    }
  }
  s.dropped = s.board.filter((b) => !attached.has(key(b))).length;
  s.board = s.board.filter((b) => attached.has(key(b)));
  s.score += group.size * 100 + s.dropped * 180;
  s.flash = 0.35;
  if (s.board.length === 0) s.status = "won";
  return group.size;
}
export function attach(s: Harbor, x: number, y: number) {
  const occupied = new Set(s.board.map(key));
  const candidates: { row: number; col: number; dist: number }[] = [];
  for (let row = 0; row < 15; row++)
    for (let col = 0; validCell(row, col); col++) {
      const b = { row, col, color: s.flight?.color ?? s.ammo };
      if (occupied.has(key(b))) continue;
      if (row > 0 && !neighbors(b).some((n) => occupied.has(key(n)))) continue;
      const p = center(b, s.offset);
      candidates.push({ row, col, dist: Math.hypot(x - p.x, y - p.y) });
    }
  candidates.sort((a, b) => a.dist - b.dist);
  const slot = candidates[0];
  if (!slot) {
    s.status = "lost";
    s.flight = null;
    return;
  }
  const b = { row: slot.row, col: slot.col, color: s.flight?.color ?? s.ammo };
  s.board.push(b);
  resolveMatch(s, b);
  s.flight = null;
  const colors = [...new Set(s.board.map((b) => b.color))];
  s.ammo = colors.includes(s.next) ? s.next : (colors[0] ?? 0);
  s.next = colors[(s.shots + s.stage) % colors.length] ?? 0;
  if (s.board.some((b) => center(b, s.offset).y + R >= 420)) s.status = "lost";
}
export function stepHarbor(s: Harbor, dt: number, i: Input) {
  if (s.status !== "playing") return;
  s.flash = Math.max(0, s.flash - dt);
  const move = (i.held.has("right") ? 1 : 0) - (i.held.has("left") ? 1 : 0);
  s.angle = Math.max(
    -Math.PI + 0.18,
    Math.min(
      -0.18,
      s.angle +
        move * 1.6 * dt +
        (i.taps.has("right") ? 0.04 : 0) -
        (i.taps.has("left") ? 0.04 : 0),
    ),
  );
  if (i.pointer && i.pointer.y < 470)
    s.angle = Math.max(
      -Math.PI + 0.18,
      Math.min(-0.18, Math.atan2(i.pointer.y - 475, i.pointer.x - BW / 2)),
    );
  if (i.taps.has("swap") && !s.flight) [s.ammo, s.next] = [s.next, s.ammo];
  if ((i.taps.has("fire") || i.taps.has("pointer")) && !s.flight) {
    s.flight = {
      x: BW / 2,
      y: 475,
      vx: Math.cos(s.angle) * 470,
      vy: Math.sin(s.angle) * 470,
      color: s.ammo,
    };
    s.shots++;
  }
  if (s.flight) {
    const steps = Math.max(1, Math.ceil(dt / 0.008));
    for (let n = 0; n < steps && s.flight; n++) {
      const b = s.flight;
      b.x += (b.vx * dt) / steps;
      b.y += (b.vy * dt) / steps;
      if (b.x < R) {
        b.x = 2 * R - b.x;
        b.vx = Math.abs(b.vx);
      }
      if (b.x > BW - R) {
        b.x = 2 * (BW - R) - b.x;
        b.vx = -Math.abs(b.vx);
      }
      if (
        b.y <= 54 + s.offset ||
        s.board.some((o) => {
          const p = center(o, s.offset);
          return Math.hypot(p.x - b.x, p.y - b.y) < R * 2 - 0.5;
        })
      )
        attach(s, b.x, b.y);
    }
  }
}
export function restoreHarbor(v: unknown, stage: number): Harbor {
  const fresh = newHarbor(stage);
  if (
    !record(v) ||
    v.version !== 1 ||
    v.stage !== fresh.stage ||
    !finite(v.score, 0, 100000) ||
    !["playing", "won", "lost"].includes(String(v.status)) ||
    !finite(v.angle, -Math.PI + 0.18, -0.18) ||
    !finite(v.ammo, 0, 3) ||
    !Number.isInteger(v.ammo) ||
    !finite(v.next, 0, 3) ||
    !Number.isInteger(v.next) ||
    !finite(v.shots, 0, 10000) ||
    !Number.isInteger(v.shots) ||
    !finite(v.misses, 0, 10000) ||
    !Number.isInteger(v.misses) ||
    !finite(v.offset, 0, 420) ||
    !finite(v.flash, 0, 1) ||
    !finite(v.dropped, 0, 180) ||
    !Array.isArray(v.board) ||
    v.board.length > 180
  )
    return fresh;
  if (
    !v.board.every(
      (b) =>
        record(b) &&
        Number.isInteger(b.row) &&
        Number.isInteger(b.col) &&
        validCell(b.row as number, b.col as number) &&
        finite(b.color, 0, 3) &&
        Number.isInteger(b.color),
    )
  )
    return fresh;
  const cells = v.board as Bubble[];
  if (new Set(cells.map(key)).size !== cells.length) return fresh;
  if (
    v.flight !== null &&
    (!record(v.flight) ||
      !finite(v.flight.x, 0, BW) ||
      !finite(v.flight.y, 0, BH) ||
      !finite(v.flight.vx, -500, 500) ||
      !finite(v.flight.vy, -500, -1) ||
      !finite(v.flight.color, 0, 3) ||
      !Number.isInteger(v.flight.color) ||
      Math.abs(Math.hypot(v.flight.vx as number, v.flight.vy as number) - 470) >
        1)
  )
    return fresh;
  if (
    (v.status === "won" && cells.length) ||
    (v.status === "playing" && !cells.length)
  )
    return fresh;
  return structuredClone(v) as unknown as Harbor;
}
