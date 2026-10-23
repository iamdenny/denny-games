export interface State {
  version: 1;
  stage: number;
  seed: string;
  size: number;
  first: number;
  mines: number[];
  open: number[];
  flags: number[];
  phase: "play" | "won" | "lost";
}
export const counts = [6, 9, 12];
export function fresh(stage = 1, seed = "mine"): State {
  stage = Math.max(1, Math.min(3, Math.floor(stage)));
  return {
    version: 1,
    stage,
    seed,
    size: stage + 5,
    first: -1,
    mines: [],
    open: [],
    flags: [],
    phase: "play",
  };
}
export function neighbors(i: number, n: number) {
  const a: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const x = (i % n) + dx,
        y = Math.floor(i / n) + dy;
      if ((dx || dy) && x >= 0 && x < n && y >= 0 && y < n) a.push(y * n + x);
    }
  return a;
}
export function generate(s: State, first: number) {
  let rng = 2166136261;
  for (const c of s.seed + ":" + s.stage + ":" + first)
    rng = Math.imul(rng ^ c.charCodeAt(0), 16777619);
  const safe = [first, ...neighbors(first, s.size)],
    pool = Array.from({ length: s.size * s.size }, (_, i) => i).filter(
      (i) => !safe.includes(i),
    );
  for (let i = pool.length - 1; i > 0; i--) {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
    const j = rng % (i + 1);
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, counts[s.stage - 1]).sort((a, b) => a - b);
}
export const adjacent = (s: State, i: number) =>
  neighbors(i, s.size).filter((j) => s.mines.includes(j)).length;
export function flag(s: State, i: number): State {
  if (
    s.phase !== "play" ||
    !Number.isInteger(i) ||
    i < 0 ||
    i >= s.size * s.size ||
    s.open.includes(i)
  )
    return s;
  return {
    ...s,
    flags: s.flags.includes(i)
      ? s.flags.filter((j) => j !== i)
      : [...s.flags, i].sort((a, b) => a - b),
  };
}
export function reveal(s: State, i: number): State {
  if (
    s.phase !== "play" ||
    !Number.isInteger(i) ||
    i < 0 ||
    i >= s.size * s.size ||
    s.open.includes(i) ||
    s.flags.includes(i)
  )
    return s;
  const n = structuredClone(s);
  if (n.first < 0) {
    n.first = i;
    n.mines = generate(n, i);
  }
  if (n.mines.includes(i)) {
    n.open.push(i);
    n.open.sort((a, b) => a - b);
    n.phase = "lost";
    return n;
  }
  const q = [i];
  while (q.length) {
    const j = q.pop()!;
    if (n.open.includes(j) || n.flags.includes(j) || n.mines.includes(j))
      continue;
    n.open.push(j);
    if (!adjacent(n, j)) q.push(...neighbors(j, n.size));
  }
  n.open.sort((a, b) => a - b);
  if (n.open.length === n.size * n.size - n.mines.length) n.phase = "won";
  return n;
}
export function restore(raw: unknown, stage: number, seed: string): State {
  const f = fresh(stage, seed);
  if (!raw || typeof raw !== "object") return f;
  const s = raw as State;
  const list = (a: unknown) =>
    Array.isArray(a) &&
    a.every((i) => Number.isInteger(i) && i >= 0 && i < f.size * f.size) &&
    new Set(a).size === a.length;
  if (
    s.version !== 1 ||
    s.stage !== f.stage ||
    s.seed !== seed ||
    s.size !== f.size ||
    !Number.isInteger(s.first) ||
    s.first < -1 ||
    s.first >= f.size * f.size ||
    !list(s.mines) ||
    !list(s.open) ||
    !list(s.flags) ||
    s.open.some((i) => s.flags.includes(i)) ||
    !["play", "won", "lost"].includes(s.phase)
  )
    return f;
  if (s.first < 0) {
    if (s.mines.length || s.open.length || s.phase !== "play") return f;
  } else {
    if (
      JSON.stringify(s.mines) !== JSON.stringify(generate(s, s.first)) ||
      !s.open.includes(s.first)
    )
      return f;
    const hit = s.open.filter((i) => s.mines.includes(i)).length;
    const won = s.open.length === s.size * s.size - s.mines.length && hit === 0;
    if (
      (s.phase === "lost" && hit !== 1) ||
      (s.phase !== "lost" && hit !== 0) ||
      (s.phase === "won") !== won
    )
      return f;
  }
  return structuredClone(s);
}
