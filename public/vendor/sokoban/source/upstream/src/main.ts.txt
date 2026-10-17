// UI shell for the Sokoban engine in ./sokoban. The engine is pure; this file
// owns the grid rendering, keyboard/d-pad input, undo, the animated BFS solve,
// and the dead-square overlay.

import {
  parseLevel,
  isWon,
  deadSquares,
  solve,
  expandSolution,
  stepPlayer,
  type Level,
} from './sokoban';
import { LEVELS } from './levels';

const boardEl = document.getElementById('board') as HTMLDivElement;
const statusEl = document.getElementById('status') as HTMLSpanElement;
const countsEl = document.getElementById('counts') as HTMLSpanElement;
const levelEl = document.getElementById('level') as HTMLSelectElement;
const undoBtn = document.getElementById('undo') as HTMLButtonElement;
const resetBtn = document.getElementById('reset') as HTMLButtonElement;
const solveBtn = document.getElementById('solve') as HTMLButtonElement;
const showDeadEl = document.getElementById('showdead') as HTMLInputElement;

LEVELS.forEach((l, i) => {
  const opt = document.createElement('option');
  opt.value = String(i);
  opt.textContent = l.name;
  levelEl.appendChild(opt);
});

let level: Level = parseLevel(LEVELS[0].text);
let dead: boolean[] = deadSquares(level);
let boxes: number[] = level.boxes.slice();
let player: number = level.player;
let moves = 0;
let pushes = 0;
let history: { boxes: number[]; player: number; pushed: boolean }[] = [];
let animating = false;

function loadLevel(i: number) {
  level = parseLevel(LEVELS[i].text);
  dead = deadSquares(level);
  reset();
}

function reset() {
  boxes = level.boxes.slice();
  player = level.player;
  moves = 0;
  pushes = 0;
  history = [];
  setStatus('');
  render();
}

function setStatus(text: string, cls = '') {
  statusEl.textContent = text;
  statusEl.className = cls;
}

function render() {
  const { width: w, height: h, walls, goals } = level;
  boardEl.style.gridTemplateColumns = `repeat(${w}, auto)`;
  boardEl.innerHTML = '';
  const boxSet = new Set(boxes);
  for (let i = 0; i < w * h; i++) {
    const cell = document.createElement('div');
    const isVoid = !walls[i] && !reachableFloor(i);
    cell.className = walls[i] ? 'cell wall' : isVoid ? 'cell void' : 'cell floor';
    if (goals[i] && !walls[i]) cell.classList.add('goal');
    if (showDeadEl.checked && dead[i] && !isVoid) cell.classList.add('dead');
    if (boxSet.has(i)) {
      const p = document.createElement('div');
      p.className = goals[i] ? 'piece box done' : 'piece box';
      cell.appendChild(p);
    } else if (player === i) {
      const p = document.createElement('div');
      p.className = 'piece player';
      cell.appendChild(p);
    }
    boardEl.appendChild(cell);
  }
  countsEl.textContent = `moves: ${moves} · pushes: ${pushes}`;
  if (isWon(level, boxes) && moves > 0) {
    setStatus(`solved — ${pushes} pushes, ${moves} moves 🎉`, 'win');
  }
}

// A floor cell is drawn only if it's inside the level (reachable from the
// player's start ignoring boxes) — hides the outside of jagged walls.
let floorCache: boolean[] | null = null;
let floorCacheLevel: Level | null = null;
function reachableFloor(i: number): boolean {
  if (floorCacheLevel !== level) {
    const { width: w, walls } = level;
    const size = walls.length;
    const seen = new Array<boolean>(size).fill(false);
    const queue = [level.player];
    seen[level.player] = true;
    while (queue.length > 0) {
      const cur = queue.shift()!;
      for (const d of [-w, w, -1, 1]) {
        const nxt = cur + d;
        if (nxt < 0 || nxt >= size || seen[nxt] || walls[nxt]) continue;
        if ((d === -1 || d === 1) && Math.floor(cur / w) !== Math.floor(nxt / w)) continue;
        seen[nxt] = true;
        queue.push(nxt);
      }
    }
    floorCache = seen;
    floorCacheLevel = level;
  }
  return floorCache![i];
}

function move(dir: number) {
  if (animating || isWon(level, boxes)) return;
  const r = stepPlayer(level, boxes, player, dir);
  if (!r) return;
  history.push({ boxes, player, pushed: r.pushed });
  boxes = r.boxes;
  player = r.player;
  moves++;
  if (r.pushed) pushes++;
  render();
}

const DIRMAP: Record<string, (w: number) => number> = {
  ArrowUp: (w) => -w,
  ArrowDown: (w) => w,
  ArrowLeft: () => -1,
  ArrowRight: () => 1,
  w: (w) => -w,
  s: (w) => w,
  a: () => -1,
  d: () => 1,
};

window.addEventListener('keydown', (e) => {
  const f = DIRMAP[e.key];
  if (!f) return;
  e.preventDefault();
  move(f(level.width));
});

document.querySelectorAll<HTMLButtonElement>('.dpad button').forEach((b) => {
  const dirs: Record<string, (w: number) => number> = {
    up: (w) => -w,
    down: (w) => w,
    left: () => -1,
    right: () => 1,
  };
  b.addEventListener('click', () => move(dirs[b.dataset.dir!](level.width)));
});

undoBtn.addEventListener('click', () => {
  if (animating) return;
  const prev = history.pop();
  if (!prev) return;
  boxes = prev.boxes;
  player = prev.player;
  moves--;
  if (prev.pushed) pushes--;
  setStatus('');
  render();
});

resetBtn.addEventListener('click', () => {
  if (!animating) reset();
});

solveBtn.addEventListener('click', () => {
  if (animating || isWon(level, boxes)) return;
  setStatus('searching…');
  setTimeout(() => {
    const t0 = performance.now();
    // solve from the CURRENT position, not the level start
    const current: Level = { ...level, boxes: boxes.slice(), player };
    const r = solve(current);
    const ms = Math.round(performance.now() - t0);
    if (r.pushes === null) {
      setStatus(
        r.gaveUp
          ? `gave up after ${r.nodes.toLocaleString()} states`
          : 'provably unsolvable from here — a box is deadlocked (try Undo)',
        'win',
      );
      if (!r.gaveUp) statusEl.className = '';
      return;
    }
    setStatus(`push-optimal: ${r.pushes.length} pushes (${r.nodes.toLocaleString()} states, ${ms} ms)`);
    animate(expandSolution(current, r.pushes));
  }, 30);
});

function animate(cells: number[]) {
  animating = true;
  let k = 0;
  const tick = () => {
    if (k >= cells.length) {
      animating = false;
      render();
      return;
    }
    const dir = cells[k] - player;
    const r = stepPlayer(level, boxes, player, dir);
    if (r) {
      boxes = r.boxes;
      player = r.player;
      moves++;
      if (r.pushed) pushes++;
    }
    k++;
    render();
    setTimeout(tick, 120);
  };
  tick();
}

levelEl.addEventListener('change', () => loadLevel(parseInt(levelEl.value, 10)));
showDeadEl.addEventListener('change', render);

loadLevel(0);
