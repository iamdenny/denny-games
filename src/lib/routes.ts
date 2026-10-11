import { games, categories, categoryGames } from "../data/games";
import { articles } from "../data/pages";
import { locales } from "../data/i18n";
import { PAGE_SIZE } from "./catalogue";
export function pagePaths(): string[] {
  return [
    "",
    "daily",
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
    !["search", "library", "gamepad-test"].includes(path)
  );
}
export function allIndexableUrls() {
  return locales.flatMap((locale) =>
    pagePaths()
      .filter(indexable)
      .map((path) => `/${locale}/${path ? path + "/" : ""}`),
  );
}
