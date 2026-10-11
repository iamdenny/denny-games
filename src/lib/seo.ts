import { t } from "../data/i18n";
import type { Game } from "../data/games";
import type { Locale } from "./types";
export const SITE = "https://games.iamdenny.com";
export const pageUrl = (locale: Locale, path = "") =>
  `${SITE}/${locale}/${path ? path + "/" : ""}`;

export function discoverySchema({
  locale,
  path,
  title,
  description,
  game,
  items,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  game?: Game;
  items?: Game[];
}) {
  const url = pageUrl(locale, path);
  const text = t(locale);
  const publisher = {
    "@type": "Organization",
    "@id": `${SITE}/#publisher`,
    name: "Denny Games",
    url: SITE,
    sameAs: ["https://github.com/iamdenny/denny-games"],
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Denny Games",
    alternateName: "데니 게임즈",
    inLanguage: ["en", "ko"],
    publisher: { "@id": publisher["@id"] },
  };
  const entity = game
    ? {
        "@type": "VideoGame",
        "@id": `${url}#game`,
        name: game.text[locale].title,
        description,
        url,
        image: `${SITE}${game.screenshot ?? game.artwork}`,
        inLanguage: locale,
        gamePlatform: "Web browser",
        playMode: "https://schema.org/SinglePlayer",
        genre: text[game.category],
        isAccessibleForFree: true,
        author: {
          "@type":
            game.imported || game.id === "2048" ? "Person" : "Organization",
          name: game.author,
        },
        license: game.notice
          ? `${SITE}${game.notice}`
          : "https://opensource.org/license/mit",
        isBasedOn: game.source,
      }
    : undefined;
  const crumbs = [{ name: text.home, item: pageUrl(locale) }];
  if (game)
    crumbs.push({
      name: text[game.category],
      item: pageUrl(locale, `category/${game.category}`),
    });
  if (path.startsWith("collections/"))
    crumbs.push({
      name: locale === "ko" ? "게임 모음" : "Collections",
      item: pageUrl(locale, "collections"),
    });
  if (path) crumbs.push({ name: title, item: url });
  const breadcrumb = path
    ? {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...crumb,
        })),
      }
    : undefined;
  const list = items
    ? {
        "@type": "ItemList",
        "@id": `${url}#games`,
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.text[locale].title,
          url: pageUrl(locale, `games/${item.id}`),
        })),
      }
    : undefined;
  const page = {
    "@type": items ? "CollectionPage" : "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: { "@id": website["@id"] },
    publisher: { "@id": publisher["@id"] },
    ...(breadcrumb ? { breadcrumb: { "@id": breadcrumb["@id"] } } : {}),
    ...(entity || list
      ? { mainEntity: { "@id": (entity ?? list)!["@id"] } }
      : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [publisher, website, page, entity, breadcrumb, list].filter(
      Boolean,
    ),
  };
}
