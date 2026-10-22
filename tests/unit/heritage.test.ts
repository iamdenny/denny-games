import { expect, it } from "vitest";
import {
  newAcademy,
  train,
  restoreAcademy,
  academyEnding,
  type Course,
} from "../../src/games/heritage/academy";
import {
  newQuest,
  questStep,
  restoreQuest,
  maps,
  type QuestAction,
} from "../../src/games/heritage/quest";
import {
  newWild,
  stepWild,
  level,
  restoreWild,
} from "../../src/games/heritage/wild";
it("academy activities cannot overspend; all seven careers have reachable 24-week paths", () => {
  const endings = new Set<string>();
  let states = [newAcademy()];
  // Deterministic policy sweep samples specialization, savings, care and balance.
  for (const preferred of [
    "craft",
    "study",
    "explore",
    "work",
    "rest",
    "balanced",
    "mixed",
  ]) {
    let s = newAcademy();
    for (let i = 0; i < 24; i++) {
      let c: Course =
        preferred === "balanced"
          ? (["craft", "study", "explore"] as const)[i % 3]!
          : preferred === "mixed"
            ? "craft"
            : (preferred as Course);
      if (preferred === "mixed" && i > 8) c = "rest";
      if (s.energy < 12) c = "rest";
      if (s.gold < 3 && c !== "rest" && c !== "work") c = "work";
      s = train(s, c)!;
      expect(s.energy).toBeGreaterThanOrEqual(0);
      expect(s.gold).toBeGreaterThanOrEqual(0);
    }
    endings.add(academyEnding(s));
    expect(restoreAcademy(s.history)).toEqual(s);
    expect(train(s, "work")).toBeUndefined();
    states.push(s);
  }
  expect(endings.has("artisan")).toBe(true);
  expect(endings.has("scholar")).toBe(true);
  expect(endings.has("ranger")).toBe(true);
  expect(endings.has("merchant")).toBe(true);
  expect(endings.has("healer")).toBe(true);
  expect(endings.has("steward")).toBe(true);
  const citizen = restoreAcademy(
    Array.from({ length: 24 }, (_, i) =>
      i % 4 === 0
        ? "rest"
        : i % 4 === 1
          ? "work"
          : i % 4 === 2
            ? "craft"
            : "study",
    ),
  );
  expect(academyEnding(citizen)).toBe("citizen");
  expect(restoreAcademy(["nope"])).toEqual(newAcademy());
  expect(train({ ...newAcademy(), gold: 0 }, "craft")).toBeUndefined();
});
it("RPG full expedition is reachable with legal exploration and combat; replay restores exact state", () => {
  let s = newQuest();
  const history: QuestAction[] = [];
  const act = (a: QuestAction) => {
    s = questStep(s, a);
    history.push(a);
  };
  function navigate(tx: number, ty: number) {
    const queue: [number, number, QuestAction[]][] = [[s.x, s.y, []]],
      seen = new Set<string>();
    let route: QuestAction[] | undefined;
    while (queue.length) {
      const [x, y, p] = queue.shift()!;
      if (x === tx && y === ty) {
        route = p;
        break;
      }
      if (seen.has(`${x},${y}`)) continue;
      seen.add(`${x},${y}`);
      for (const [a, dx, dy] of [
        ["up", 0, -1],
        ["down", 0, 1],
        ["left", -1, 0],
        ["right", 1, 0],
      ] as const) {
        const t = maps[s.chapter]?.[y + dy]?.[x + dx];
        if (t && t !== "#" && (t !== ">" || (x + dx === tx && y + dy === ty)))
          queue.push([x + dx, y + dy, [...p, a]]);
      }
    }
    expect(route).toBeDefined();
    for (const a of route!) {
      act(a);
      while (s.battle && !s.lost) {
        if (s.hp <= s.battle.power && s.gold >= 5) act("potion");
        else act("guard");
      }
      expect(s.lost).toBe(false);
    }
  }
  for (let chapter = 0; chapter < 3; chapter++) {
    navigate(7, 1);
    if (chapter === 0) {
      navigate(4, 5);
      if (s.gold >= 10) act("upgrade");
    }
    if (chapter === 1) {
      navigate(1, 3);
      if (s.gold >= 10) act("upgrade");
    }
    if (chapter === 2) {
      navigate(4, 1);
      if (s.gold >= 10) act("upgrade");
    }
    navigate(7, 5);
    if (chapter === 2) navigate(5, 7);
    navigate(7, 7);
  }
  expect(s.won).toBe(true);
  expect(restoreQuest(history).state).toEqual(s);
  expect(questStep(s, "left")).toBe(s);
  expect(restoreQuest(["bad"]).state).toEqual(newQuest());
});
it("platform collisions, combat, gate and corrupted saves obey bounds", () => {
  for (let stage = 1; stage <= 6; stage++) {
    expect(level(stage).gems).toHaveLength(12);
    let s = newWild();
    for (let i = 0; i < 120; i++)
      s = stepWild(s, stage, 1 / 60, { x: 0, jump: false, hit: false });
    expect(s.y).toBe(376);
    expect(s.hp).toBe(4);
    s = stepWild(s, stage, 1 / 60, { x: 0, jump: true, hit: false });
    expect(s.y).toBeLessThan(376);
    expect(s.ground).toBe(false);
    expect(
      stepWild(
        { ...newWild(), x: 2320, collected: [0, 1, 2, 3, 4, 5] },
        stage,
        0.01,
        { x: 0, jump: false, hit: false },
      ).won,
    ).toBe(true);
    expect(
      stepWild({ ...newWild(), x: 2320 }, stage, 0.01, {
        x: 0,
        jump: false,
        hit: false,
      }).won,
    ).toBe(false);
  }
  expect(restoreWild({ ...newWild(), x: Infinity })).toEqual(newWild());
});
