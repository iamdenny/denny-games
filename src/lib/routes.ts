import { games, categories, categoryGames } from "../data/games";
import { collections } from "../data/collections";
import { articles, guidePaths } from "../data/pages";
import { locales } from "../data/i18n";
import { PAGE_SIZE } from "./catalogue";
export function pagePaths(): string[] {
  for (const game of games) {
    const guidePath = game.guide?.path;
    if (
      guidePath &&
      (!Object.hasOwn(articles, guidePath) || !guidePaths.includes(guidePath))
    ) {
      throw new Error(
        `Game "${game.id}" points to an unlisted guide: ${guidePath}`,
      );
    }
  }

  return [
    "",
    ...Array.from(
      { length: Math.ceil(games.length / PAGE_SIZE) },
      (_, i) => `all${i ? "/page/" + (i + 1) : ""}`,
    ),
    "daily",
    "promote",
    "collections",
    "device-check",
    ...collections.map((item) => `collections/${item.id}`),
    "search",
    "library",
    "compatibility",
    "gamepad-test",
    "guides",
    "licenses",
    ...Object.keys(articles),
    ...games.flatMap((game) => [
      `games/${game.id}`,
      ...(game.externalPlay ? [] : [`play/${game.id}`]),
    ]),
    ...categories.flatMap((category) =>
      Array.from(
        { length: Math.ceil(categoryGames(category).length / PAGE_SIZE) },
        (_, i) => `category/${category}${i ? "/page/" + (i + 1) : ""}`,
      ),
    ),
  ];
}
export function indexable(path: string): boolean {
  return (
    !path.startsWith("play/") &&
    !["search", "library", "gamepad-test", "device-check"].includes(path)
  );
}
export function allIndexableUrls() {
  return locales.flatMap((locale) =>
    pagePaths()
      .filter(indexable)
      .map((path) => `/${locale}/${path ? path + "/" : ""}`),
  );
}
