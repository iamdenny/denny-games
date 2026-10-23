import { expect, it } from "vitest";
import { collectionGames } from "../../src/data/collections";
import { games } from "../../src/data/games";
import { articles, guidePaths } from "../../src/data/pages";
import {
  JEGI_STAGES,
  createJegiState,
  requiredTechnique,
  restoreJegiState,
  selectJegiTechnique,
  serializeJegiState,
  tryJegiKick,
  type JegiTechnique,
} from "../../src/games/jegi-rally/rules";

it("defines three finite challenges with progressively tighter timing windows", () => {
  expect(JEGI_STAGES.map(({ kicks }) => kicks)).toEqual([6, 8, 10]);
  const windows = JEGI_STAGES.map(
    ({ windowStartMs, windowEndMs }) => windowEndMs - windowStartMs,
  );
  expect(windows[0]).toBeGreaterThan(windows[1]!);
  expect(windows[1]).toBeGreaterThan(windows[2]!);
});

it("keeps one foot in stage one and alternates from the player's first foot in stage two", () => {
  let state = createJegiState(1);
  state = selectJegiTechnique(state, "right");
  state = tryJegiKick(state, JEGI_STAGES[0]!.targetMs).state;
  expect(state.firstTechnique).toBe("right");
  expect(requiredTechnique(state)).toBe("right");

  state = createJegiState(2);
  state = selectJegiTechnique(state, "right");
  state = tryJegiKick(state, JEGI_STAGES[1]!.targetMs).state;
  expect(requiredTechnique(state)).toBe("left");
  state = selectJegiTechnique(state, "left");
  state = tryJegiKick(state, JEGI_STAGES[1]!.targetMs).state;
  expect(requiredTechnique(state)).toBe("right");
});

it("uses a deterministic left, right, back-foot sequence in stage three", () => {
  let state = createJegiState(3);
  const expected: JegiTechnique[] = ["left", "right", "back", "left"];
  for (const technique of expected) {
    expect(requiredTechnique(state)).toBe(technique);
    state = selectJegiTechnique(state, technique);
    state = tryJegiKick(state, JEGI_STAGES[2]!.targetMs).state;
  }
  expect(state.hits).toBe(expected.length);
});

it("rejects early kicks, scores accurate timing, and consumes a miss for a wrong technique", () => {
  const stage = JEGI_STAGES[1]!;
  const fresh = createJegiState(2);
  expect(tryJegiKick(fresh, stage.windowStartMs - 1)).toMatchObject({
    result: "early",
    state: fresh,
  });

  const accurate = tryJegiKick(fresh, stage.targetMs);
  const edge = tryJegiKick(fresh, stage.windowEndMs);
  expect(accurate.result).toBe("hit");
  expect(accurate.state.score).toBeGreaterThan(edge.state.score);

  const wrongState = tryJegiKick(
    selectJegiTechnique(fresh, "right"),
    stage.targetMs,
  ).state;
  const wrong = tryJegiKick(wrongState, stage.targetMs);
  expect(wrong.result).toBe("wrong-technique");
  expect(wrong.state.misses).toBe(1);
  expect(wrong.state.hits).toBe(wrongState.hits);
});

it("clears each challenge at its finite goal and ends after three misses", () => {
  for (let stage = 1; stage <= 3; stage++) {
    let state = createJegiState(stage);
    while (state.phase === "play") {
      const required = requiredTechnique(state) ?? "left";
      state = selectJegiTechnique(state, required);
      state = tryJegiKick(state, JEGI_STAGES[stage - 1]!.targetMs).state;
    }
    expect(state.phase).toBe("won");
    expect(state.hits).toBe(JEGI_STAGES[stage - 1]!.kicks);
  }

  let state = createJegiState(1);
  for (let i = 0; i < 3; i++)
    state = tryJegiKick(state, JEGI_STAGES[0]!.windowEndMs + 1).state;
  expect(state.phase).toBe("lost");
  expect(state.misses).toBe(3);
});

it("restores validated progress without persisting an in-flight timer", () => {
  let state = createJegiState(2);
  state = selectJegiTechnique(state, "right");
  state = tryJegiKick(state, JEGI_STAGES[1]!.targetMs).state;
  const saved = serializeJegiState(state);
  expect(restoreJegiState(saved, 2)).toEqual(state);
  expect(restoreJegiState(saved, 3)).toBeNull();
  expect(restoreJegiState({ ...saved, hits: 99 }, 2)).toBeNull();
  expect(
    restoreJegiState({ ...saved, selectedTechnique: "back" }, 2),
  ).toBeNull();

  let complete = createJegiState(1);
  for (let i = 0; i < JEGI_STAGES[0]!.kicks; i++)
    complete = tryJegiKick(
      selectJegiTechnique(complete, requiredTechnique(complete) ?? "left"),
      JEGI_STAGES[0]!.targetMs,
    ).state;
  expect(restoreJegiState(serializeJegiState(complete), 1)?.phase).toBe("won");
});

it("registers one bilingual, locally playable game in traditional discovery", () => {
  const game = games.find((entry) => entry.id === "jegi-rally");
  expect(game).toMatchObject({
    category: "sports",
    stages: 3,
    license: "MIT",
    playModes: ["single-player"],
    inputs: ["touch", "mouse", "keyboard", "gamepad"],
  });
  expect(game?.externalPlay).toBeUndefined();
  expect(game?.text.en.title).toBe("Jegi Rally");
  expect(game?.text.ko.title).toBe("제기 랠리");
  expect(collectionGames("traditional-games").map(({ id }) => id)).toEqual([
    "yutnori",
    "gonggi",
    "jegi-rally",
  ]);
  expect(guidePaths).toContain("guides/jegichagi-rules");
  expect(articles["guides/jegichagi-rules"]?.en.links?.[0]?.href).toBe(
    "/en/play/jegi-rally/",
  );
});
