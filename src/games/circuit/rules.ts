import { random } from "../../lib/random";
export interface Board {
  size: number;
  solved: number[];
  tiles: number[];
}
export const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const;
export function rotate(mask: number): number {
  return ((mask << 1) & 15) | (mask >> 3);
}
export function createBoard(seed: string, stage: number): Board {
  const size = Math.min(5, 3 + Math.floor((stage - 1) / 8));
  const rng = random(`${seed}:stage:${stage}`);
  const solved = Array<number>(size * size).fill(0);
  const seen = new Set([0]);
  const stack = [0];
  while (stack.length) {
    const here = stack[stack.length - 1]!;
    const x = here % size;
    const y = Math.floor(here / size);
    const candidates = directions
      .map(([dx, dy], dir) => ({ x: x + dx, y: y + dy, dir }))
      .filter(
        (p) =>
          p.x >= 0 &&
          p.x < size &&
          p.y >= 0 &&
          p.y < size &&
          !seen.has(p.y * size + p.x),
      );
    if (!candidates.length) {
      stack.pop();
      continue;
    }
    const next = candidates[Math.floor(rng() * candidates.length)]!;
    const index = next.y * size + next.x;
    solved[here] = solved[here]! | (1 << next.dir);
    solved[index] = solved[index]! | (1 << ((next.dir + 2) % 4));
    seen.add(index);
    stack.push(index);
  }
  const tiles = solved.map((mask) => {
    let value = mask;
    for (let n = Math.floor(rng() * 4); n > 0; n--) value = rotate(value);
    return value;
  });
  if (isComplete(tiles, size)) {
    const index = tiles.findIndex((v) => v !== 15);
    tiles[index] = rotate(tiles[index]!);
  }
  return { size, solved, tiles };
}
export function connected(tiles: number[], size: number): Set<number> {
  const found = new Set([0]);
  const queue = [0];
  while (queue.length) {
    const here = queue.shift()!;
    const x = here % size;
    const y = Math.floor(here / size);
    directions.forEach(([dx, dy], dir) => {
      if (!(tiles[here]! & (1 << dir))) return;
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) return;
      const index = ny * size + nx;
      if (tiles[index]! & (1 << ((dir + 2) % 4)) && !found.has(index)) {
        found.add(index);
        queue.push(index);
      }
    });
  }
  return found;
}
export function isComplete(tiles: number[], size: number): boolean {
  if (
    tiles.length !== size * size ||
    connected(tiles, size).size !== tiles.length
  )
    return false;
  return tiles.every((mask, index) =>
    directions.every(([dx, dy], dir) => {
      if (!(mask & (1 << dir))) return true;
      const nx = (index % size) + dx,
        ny = Math.floor(index / size) + dy;
      return (
        nx >= 0 &&
        nx < size &&
        ny >= 0 &&
        ny < size &&
        Boolean(tiles[ny * size + nx]! & (1 << ((dir + 2) % 4)))
      );
    }),
  );
}
