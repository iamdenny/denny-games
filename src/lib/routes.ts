import { games, categories, categoryGames } from "../data/games";
import { collections } from "../data/collections";
import { articles } from "../data/pages";
import { locales } from "../data/i18n";
import { PAGE_SIZE } from "./catalogue";
export function pagePaths(): string[] {
  return [
    "",
    "daily",
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
    ...games.flatMap((game) => [`games/${game.id}`, `play/${game.id}`]),
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
