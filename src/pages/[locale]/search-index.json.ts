import type { APIRoute } from "astro";
import { games } from "../../data/games";
import { locales } from "../../data/i18n";
import type { Locale } from "../../lib/types";
export function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}
export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as Locale;
  return new Response(
    JSON.stringify(
      games.map((game) => ({
        id: game.id,
        title: game.text[locale].title,
        description: game.text[locale].description,
        tags: [...game.tags, game.category],
        url: `/${locale}/games/${game.id}/`,
        inputs: game.inputs,
        category: game.category,
        categoryName: {
          en: {
            puzzle: "Puzzle",
            arcade: "Arcade",
            action: "Action",
            shooting: "Shooting",
            racing: "Racing",
            sports: "Sports",
          },
          ko: {
            puzzle: "퍼즐",
            arcade: "아케이드",
            action: "액션",
            shooting: "슈팅",
            racing: "레이싱",
            sports: "스포츠",
          },
        }[locale][game.category],
        subtitle: game.text[locale].subtitle,
        artwork: game.artwork,
        color: game.color,
        duration: game.duration,
        added: game.added,
      })),
    ),
    { headers: { "Content-Type": "application/json" } },
  );
};
