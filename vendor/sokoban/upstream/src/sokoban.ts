// Sokoban, the search-and-proof way. Pure module (no DOM):
//
//  * DEAD SQUARES are computed statically before any search, by thinking
//    BACKWARD: a box can reach a goal iff the goal can be reached by PULLING
//    the box from its square. Pulls have no deadlocks, so a reverse BFS from
//    every goal marks every pull-reachable square; anything else is dead — a
//    box pushed there can provably never score. This kills most dead ends
//    before the solver ever runs.
//
//  * The SOLVER is a breadth-first search over PUSH states: a state is the box
//    set plus the player's reachable region (canonicalized to its smallest
//    cell), and a transition is one box push. Between pushes the player walks
//    for free, so BFS depth = number of pushes, and the first solution found
//    is push-optimal.
//
// Levels use the standard text format: # wall, @ player, $ box, . goal,
// * box on goal, + player on goal, space floor.

export interface Level {
  width: number;
  height: number;
  walls: boolean[]; // row-major
  goals: boolean[];
  boxes: number[]; // cell indices
  player: number; // cell index
}

export function parseLevel(text: string): Level {
  const lines = text.replace(/\n+$/, '').split('\n');
  const height = lines.length;
  const width = Math.max(...lines.map((l) => l.length));
  const size = width * height;
  const walls = new Array<boolean>(size).fill(false);
  const goals = new Array<boolean>(size).fill(false);
  const boxes: number[] = [];
  let player = -1;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      const i = r * width + c;
      switch (lines[r][c]) {
        case '#':
          walls[i] = true;
          break;
        case '.':
          goals[i] = true;
          break;
        case '$':
          boxes.push(i);
          break;
        case '*':
          boxes.push(i);
          goals[i] = true;
          break;
        case '@':
          player = i;
          break;
        case '+':
          player = i;
          goals[i] = true;
          break;
      }
    }
  }
  if (player < 0) throw new Error('level has no player (@ or +)');
  const goalCount = goals.filter(Boolean).length;
  if (boxes.length !== goalCount)
    throw new Error(`level has ${boxes.length} boxes but ${goalCount} goals`);
  return { width, height, walls, goals, boxes: boxes.sort((a, b) => a - b), player };
}

export function isWon(level: Level, boxes: number[]): boolean {
  return boxes.every((b) => level.goals[b]);
}

const DIRS = (w: number) => [-w, w, -1, 1]; // up, down, left, right

/**
 * Dead squares by reverse "pull" BFS from every goal.
 *
 * A pull from `from` to `to` needs the player standing beyond `to` (at
 * to + (to - from)), and both `to` and the player square must be floor. If a
 * box's square was never reached by any pull chain starting at a goal, no
 * push sequence can ever bring a box from that square to a goal.
 */
export function deadSquares(level: Level): boolean[] {
  const { width: w, walls, goals } = level;
  const size = walls.length;
  const alive = new Array<boolean>(size).fill(false);
  const queue: number[] = [];
  for (let i = 0; i < size; i++) {
    if (goals[i]) {
      alive[i] = true;
      queue.push(i);
    }
  }
  while (queue.length > 0) {
    const from = queue.shift()!;
    for (const d of DIRS(w)) {
      const to = from + d;
      const playerSq = to + d;
      if (!inRow(w, size, from, to, d) || !inRow(w, size, to, playerSq, d)) continue;
      if (walls[to] || walls[playerSq]) continue;
      if (!alive[to]) {
        alive[to] = true;
        queue.push(to);
      }
    }
  }
  const dead = new Array<boolean>(size).fill(false);
  for (let i = 0; i < size; i++) dead[i] = !walls[i] && !alive[i];
  return dead;
}

/** Row-safe neighbour check: horizontal steps must not wrap between rows. */
function inRow(w: number, size: number, from: number, to: number, d: number): boolean {
  if (to < 0 || to >= size) return false;
  if (d === -1 || d === 1) return Math.floor(from / w) === Math.floor(to / w);
  return true;
}

/** Cells the player can reach without pushing, and the region's canonical cell. */
export function playerRegion(level: Level, boxes: number[], player: number): {
  reach: boolean[];
  canon: number;
} {
  const { width: w, walls } = level;
  const size = walls.length;
  const boxSet = new Set(boxes);
  const reach = new Array<boolean>(size).fill(false);
  let canon = player;
  const queue = [player];
  reach[player] = true;
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur < canon) canon = cur;
    for (const d of DIRS(w)) {
      const nxt = cur + d;
      if (!inRow(w, size, cur, nxt, d)) continue;
      if (walls[nxt] || boxSet.has(nxt) || reach[nxt]) continue;
      reach[nxt] = true;
      queue.push(nxt);
    }
  }
  return { reach, canon };
}

/** One legal push from the current state. */
export interface Push {
  box: number; // index of box cell before the push
  dir: number; // +-1 / +-width
}

export function legalPushes(level: Level, boxes: number[], reach: boolean[]): Push[] {
  const { width: w, walls } = level;
  const size = walls.length;
  const boxSet = new Set(boxes);
  const dead = deadCache(level);
  const out: Push[] = [];
  for (const b of boxes) {
    for (const d of DIRS(w)) {
      const playerSq = b - d;
      const target = b + d;
      if (!inRow(w, size, b, playerSq, -d as number) || !inRow(w, size, b, target, d)) continue;
      if (!reach[playerSq]) continue; // player can't get behind the box
      if (walls[target] || boxSet.has(target)) continue; // blocked
      if (dead[target]) continue; // provably hopeless — prune now
      out.push({ box: b, dir: d });
    }
  }
  return out;
}

// deadSquares is pure per level; cache it keyed by the level object.
const deadMemo = new WeakMap<Level, boolean[]>();
function deadCache(level: Level): boolean[] {
  let d = deadMemo.get(level);
  if (!d) {
    d = deadSquares(level);
    deadMemo.set(level, d);
  }
  return d;
}

export interface SolveResult {
  /** Push sequence, or null if no solution exists (within the node budget). */
  pushes: Push[] | null;
  nodes: number;
  gaveUp: boolean;
}

/**
 * Push-optimal BFS. State key = canonical player-region cell + sorted boxes.
 * The dead-square pruning inside legalPushes keeps the frontier small.
 */
export function solve(level: Level, maxNodes = 500_000): SolveResult {
  const start = level.boxes;
  if (isWon(level, start)) return { pushes: [], nodes: 0, gaveUp: false };

  const key = (canon: number, boxes: number[]) => canon + ':' + boxes.join(',');
  const { reach: reach0, canon: canon0 } = playerRegion(level, start, level.player);
  const seen = new Set([key(canon0, start)]);
  interface Node {
    boxes: number[];
    player: number;
    path: Push[];
  }
  let frontier: Node[] = [{ boxes: start, player: level.player, path: [] }];
  let nodes = 0;
  void reach0;

  while (frontier.length > 0) {
    const next: Node[] = [];
    for (const cur of frontier) {
      const { reach } = playerRegion(level, cur.boxes, cur.player);
      for (const push of legalPushes(level, cur.boxes, reach)) {
        if (++nodes > maxNodes) return { pushes: null, nodes, gaveUp: true };
        const target = push.box + push.dir;
        const boxes = cur.boxes.filter((b) => b !== push.box).concat(target).sort((a, b) => a - b);
        const player = push.box; // player ends where the box was
        const path = cur.path.concat(push);
        if (isWon(level, boxes)) return { pushes: path, nodes, gaveUp: false };
        const { canon } = playerRegion(level, boxes, player);
        const k = key(canon, boxes);
        if (!seen.has(k)) {
          seen.add(k);
          next.push({ boxes, player, path });
        }
      }
    }
    frontier = next;
  }
  return { pushes: null, nodes, gaveUp: false }; // exhausted: provably unsolvable
}

/** Shortest player walk (list of cells) from `from` to `to` avoiding boxes. */
export function walkPath(level: Level, boxes: number[], from: number, to: number): number[] | null {
  if (from === to) return [from];
  const { width: w, walls } = level;
  const size = walls.length;
  const boxSet = new Set(boxes);
  const prev = new Map<number, number>([[from, -1]]);
  let frontier = [from];
  while (frontier.length > 0) {
    const next: number[] = [];
    for (const cur of frontier) {
      for (const d of DIRS(w)) {
        const nxt = cur + d;
        if (!inRow(w, size, cur, nxt, d)) continue;
        if (walls[nxt] || boxSet.has(nxt) || prev.has(nxt)) continue;
        prev.set(nxt, cur);
        if (nxt === to) {
          const path = [to];
          let p = cur;
          while (p !== -1) {
            path.push(p);
            p = prev.get(p)!;
          }
          return path.reverse();
        }
        next.push(nxt);
      }
    }
    frontier = next;
  }
  return null;
}

/** Expand a push sequence into per-cell player steps for animation. */
export function expandSolution(level: Level, pushes: Push[]): number[] {
  const steps: number[] = [];
  let boxes = level.boxes.slice();
  let player = level.player;
  for (const push of pushes) {
    const behind = push.box - push.dir;
    const walk = walkPath(level, boxes, player, behind);
    if (!walk) throw new Error('solution replay failed: no walk path');
    steps.push(...walk.slice(1), push.box); // walk behind the box, then step in (pushing)
    boxes = boxes.filter((b) => b !== push.box).concat(push.box + push.dir).sort((a, b) => a - b);
    player = push.box;
  }
  return steps;
}

/** Apply a single player step (move or push). Returns null if illegal. */
export function stepPlayer(
  level: Level,
  boxes: number[],
  player: number,
  dir: number,
): { boxes: number[]; player: number; pushed: boolean } | null {
  const { width: w, walls } = level;
  const size = walls.length;
  const to = player + dir;
  if (!inRow(w, size, player, to, dir) || walls[to]) return null;
  if (!boxes.includes(to)) return { boxes, player: to, pushed: false };
  const beyond = to + dir;
  if (!inRow(w, size, to, beyond, dir) || walls[beyond] || boxes.includes(beyond)) return null;
  const nb = boxes.filter((b) => b !== to).concat(beyond).sort((a, b) => a - b);
  return { boxes: nb, player: to, pushed: true };
}
