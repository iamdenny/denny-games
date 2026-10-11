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
      })),
    ),
    { headers: { "Content-Type": "application/json" } },
  );
};
