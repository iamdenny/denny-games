import { describe, it, expect } from "vitest";
import { games, categories, categoryGames } from "../../src/data/games";
import { editorPicks, editorialOrder } from "../../src/data/editorial";

describe("editorial catalogue", () => {
  it("promotes real unique picks, preserving every other game and stable ties", () => {
    const ids = editorPicks.map((pick) => pick.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => games.some((game) => game.id === id))).toBe(true);
    for (const pick of editorPicks)
      for (const locale of ["en", "ko"] as const)
        expect(pick.reason[locale].trim().length).toBeGreaterThan(10);
    const original = games.map((game) => game.id);
    const ranked = editorialOrder(games).map((game) => game.id);
    expect(ranked.slice(0, ids.length)).toEqual(ids);
    expect(ranked.slice(ids.length)).toEqual(
      original.filter((id) => !ids.includes(id)),
    );
    expect(new Set(ranked).size).toBe(games.length);
    expect(games.map((game) => game.id)).toEqual(original);
    for (const category of categories)
      expect(categoryGames(category).map((game) => game.id)).toEqual(
        ranked.filter(
          (id) => games.find((game) => game.id === id)!.category === category,
        ),
      );
  });
});
