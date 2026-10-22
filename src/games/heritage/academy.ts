/** Original 24-week apprenticeship campaign; no third-party narrative or assets. */
export const courses = ["craft", "study", "explore", "work", "rest"] as const;
export type Course = (typeof courses)[number];
export interface Academy {
  week: number;
  craft: number;
  wisdom: number;
  courage: number;
  gold: number;
  energy: number;
  kindness: number;
  history: Course[];
}
export function newAcademy(): Academy {
  return {
    week: 0,
    craft: 0,
    wisdom: 0,
    courage: 0,
    gold: 12,
    energy: 80,
    kindness: 0,
    history: [],
  };
}
export function train(s: Academy, course: Course): Academy | undefined {
  if (s.week >= 24 || !courses.includes(course)) return;
  const cost = course === "rest" || course === "work" ? 0 : 3;
  if (s.gold < cost || (course !== "rest" && s.energy < 12)) return;
  const n = {
    ...s,
    history: [...s.history, course],
    week: s.week + 1,
    gold: s.gold - cost,
  };
  if (course === "rest") {
    n.energy = Math.min(100, n.energy + 35);
    n.kindness += 2;
  } else {
    n.energy -= 12;
    if (course === "work") n.gold += 10;
    else if (course === "craft") n.craft += 9;
    else if (course === "study") n.wisdom += 9;
    else n.courage += 9;
  }
  // Every fourth week, the village festival rewards a different skill.
  if (n.week % 4 === 0) {
    const skill = [n.craft, n.wisdom, n.courage][(n.week / 4 - 1) % 3]!;
    n.gold += Math.floor(skill / 9);
    n.kindness += 1;
  }
  return n;
}
export function academyEnding(s: Academy) {
  if (s.craft >= 36 && s.wisdom >= 36 && s.courage >= 36) return "steward";
  if (s.craft >= 63) return "artisan";
  if (s.wisdom >= 63) return "scholar";
  if (s.courage >= 63) return "ranger";
  if (s.gold >= 80) return "merchant";
  if (s.kindness >= 24) return "healer";
  return "citizen";
}
export function restoreAcademy(value: unknown): Academy {
  if (!Array.isArray(value) || value.length > 24) return newAcademy();
  let s = newAcademy();
  for (const c of value) {
    const next = train(s, c as Course);
    if (!next) return newAcademy();
    s = next;
  }
  return s;
}
