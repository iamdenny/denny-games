/** Original small, finite expedition. All maps and dialogue are authored here. */
export const maps = [
  [
    "#########",
    "#@..g...#",
    "#.##.##.#",
    "#...e...#",
    "#.#.#.#.#",
    "#h..s..k#",
    "#.##.##.#",
    "#...e..>#",
    "#########",
  ],
  [
    "#########",
    "#@..e..g#",
    "#.#.#.#.#",
    "#s..#...#",
    "###.#.#.#",
    "#h..e.k.#",
    "#.#.#.#.#",
    "#......>#",
    "#########",
  ],
  [
    "#########",
    "#@..s..g#",
    "#.#.#.#.#",
    "#e..#..h#",
    "#.#.#.#.#",
    "#...e..k#",
    "#.#####.#",
    "#....b.>#",
    "#########",
  ],
] as const;
export type Direction = "up" | "down" | "left" | "right";
export interface Quest {
  chapter: number;
  x: number;
  y: number;
  hp: number;
  gold: number;
  attack: number;
  keys: number;
  cleared: string[];
  battle?: { id: string; hp: number; power: number; boss: boolean };
  won: boolean;
  lost: boolean;
  turn: number;
  event: string;
}
export function newQuest(): Quest {
  return {
    chapter: 0,
    x: 1,
    y: 1,
    hp: 30,
    gold: 0,
    attack: 6,
    keys: 0,
    cleared: [],
    won: false,
    lost: false,
    turn: 0,
    event: "arrival",
  };
}
export type QuestAction = Direction | "strike" | "guard" | "potion" | "upgrade";
export function questStep(s: Quest, action: QuestAction): Quest {
  if (s.won || s.lost) return s;
  const n: Quest = {
    ...s,
    cleared: [...s.cleared],
    battle: s.battle ? { ...s.battle } : undefined,
    event: "step",
  };
  if (n.battle) {
    if (!["strike", "guard", "potion"].includes(action)) return s;
    if (action === "potion") {
      if (n.gold < 5 || n.hp === 30) return s;
      n.gold -= 5;
      n.hp = Math.min(30, n.hp + 16);
      n.event = "heal";
    } else
      n.battle.hp -= action === "guard" ? Math.ceil(n.attack / 2) : n.attack;
    if (n.battle.hp <= 0) {
      n.cleared.push(n.battle.id);
      n.gold += n.battle.boss ? 15 : 8;
      n.battle = undefined;
      n.event = "victory";
    } else {
      n.hp -=
        action === "guard" ? Math.max(1, n.battle.power - 3) : n.battle.power;
      n.event = action === "guard" ? "guard" : "strike";
    }
  } else if (action === "potion") {
    if (n.gold < 5 || n.hp === 30) return s;
    n.gold -= 5;
    n.hp = Math.min(30, n.hp + 16);
    n.event = "heal";
  } else if (action === "upgrade") {
    if (n.gold < 10 || maps[n.chapter]![n.y]![n.x] !== "s" || n.attack >= 15)
      return s;
    n.gold -= 10;
    n.attack += 3;
    n.event = "upgrade";
  } else {
    const delta: Partial<Record<QuestAction, number[]>> = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };
    const d = delta[action];
    if (!d) return s;
    const x = n.x + d[0]!,
      y = n.y + d[1]!,
      tile = maps[n.chapter]?.[y]?.[x];
    if (!tile || tile === "#") return s;
    if (
      tile === ">" &&
      (!n.keys || (n.chapter === 2 && !n.cleared.includes("2:5:7")))
    )
      return { ...s, event: "locked" };
    n.x = x;
    n.y = y;
    const id = `${n.chapter}:${x}:${y}`;
    if (tile === "s") n.event = "shop";
    if (tile === ">") {
      if (n.chapter === 2) {
        n.won = true;
        n.event = "home";
      } else {
        n.chapter++;
        n.x = 1;
        n.y = 1;
        n.keys = 0;
        n.hp = Math.min(30, n.hp + 10);
        n.event = "arrival";
      }
    } else if (!n.cleared.includes(id)) {
      if (tile === "e" || tile === "b") {
        n.battle = {
          id,
          hp: tile === "b" ? 35 : 12 + n.chapter * 5,
          power: tile === "b" ? 7 : 3 + n.chapter,
          boss: tile === "b",
        };
        n.event = "encounter";
      } else if (["g", "h", "k"].includes(tile)) {
        if (tile === "g") {
          n.gold += 12;
          n.event = "treasure";
        }
        if (tile === "h") {
          n.hp = 30;
          n.event = "spring";
        }
        if (tile === "k") {
          n.keys = 1;
          n.event = "key";
        }
        n.cleared.push(id);
      }
    }
  }
  n.turn++;
  if (n.hp <= 0) {
    n.hp = 0;
    n.lost = true;
  }
  return n;
}
export function restoreQuest(history: unknown): {
  state: Quest;
  history: QuestAction[];
} {
  if (!Array.isArray(history) || history.length > 3000)
    return { state: newQuest(), history: [] };
  let state = newQuest();
  for (const a of history) {
    if (
      ![
        "up",
        "down",
        "left",
        "right",
        "strike",
        "guard",
        "potion",
        "upgrade",
      ].includes(a)
    )
      return { state: newQuest(), history: [] };
    state = questStep(state, a);
  }
  return { state, history: [...history] };
}
