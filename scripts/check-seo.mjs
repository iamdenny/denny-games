import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const SITE = "https://games.iamdenny.com";
const args = process.argv.slice(2);
const live = args.includes("--base")
  ? args[args.indexOf("--base") + 1].replace(/\/$/, "")
  : undefined;
async function read(url) {
  const route = new URL(url, SITE).pathname;
  if (!live)
    return readFileSync(
      `dist${route}${route.endsWith("/") ? "index.html" : ""}`,
      "utf8",
    );
  const response = await fetch(`${live}${route}`, {
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  assert.equal(response.status, 200, route);
  return response.text();
}
const sitemap = await read("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap entries");
assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
assert(
  !/\/play\/|\/search\/|\/library\/|\/gamepad-test\/|\/device-check\//.test(
    sitemap,
  ),
);
const titles = new Map(),
  descriptions = new Map();
let cursor = 0,
  gameCount = 0,
  collectionCount = 0;
async function inspect(url) {
  const html = await read(url);
  const route = new URL(url).pathname;
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(title && description, `Missing metadata: ${route}`);
  assert(
    !titles.has(title),
    `Duplicate title: ${route} and ${titles.get(title)}`,
  );
  assert(
    !descriptions.has(description),
    `Duplicate description: ${route} and ${descriptions.get(description)}`,
  );
  titles.set(title, route);
  descriptions.set(description, route);
  assert(html.includes(`rel="canonical" href="${url}"`), `Canonical: ${route}`);
  assert(
    !html.includes('content="noindex'),
    `Indexable page excluded: ${route}`,
  );
  assert.equal(
    [...html.matchAll(/<h1(?:\s|>)/g)].length,
    1,
    `One heading: ${route}`,
  );
  const path = route === "/" ? "" : route.slice(4);
  for (const locale of ["en", "ko"])
    assert(
      html.includes(`hreflang="${locale}" href="${SITE}/${locale}/${path}"`),
      `Language pair: ${route}`,
    );
  assert(
    html.includes(
      `hreflang="x-default" href="${path ? `${SITE}/en/${path}` : `${SITE}/`}"`,
    ),
    `Contextual fallback: ${route}`,
  );
  const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert(image && /\.png$/.test(image), `Raster preview: ${route}`);
  if (!live) assert(existsSync(`dist${new URL(image).pathname}`));
  if (route === "/") return;
  const graphs = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ].map((match) => JSON.parse(match[1]));
  assert.equal(graphs.length, 1, `Schema graph: ${route}`);
  const nodes = graphs[0]["@graph"];
  assert(nodes.some((node) => node["@type"] === "WebSite"));
  const page = nodes.find((node) =>
    ["WebPage", "CollectionPage"].includes(node["@type"]),
  );
  assert.equal(page.url, url);
  if (route.includes("/games/")) {
    gameCount++;
    const game = nodes.find((node) => node["@type"] === "VideoGame");
    assert(game && game.author.name);
    const hasSourceCodeLink =
      html.includes(">Source code</a>") || html.includes(">소스 코드</a>");
    const hasLicenseSource =
      html.includes("License details") ||
      html.includes("라이선스 안내") ||
      /href="\/licenses\/[^"]+"/.test(html);
    assert.equal(Boolean(game.isBasedOn), hasSourceCodeLink, "Source metadata");
    assert.equal(Boolean(game.license), hasLicenseSource, "License metadata");
    assert(!("aggregateRating" in game), "No invented ratings");
    assert.equal(
      game.description
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;"),
      description,
    );
  }
  if (
    route.includes("/category/") ||
    route.includes("/all/") ||
    /\/collections\/[^/]+\/$/.test(route)
  ) {
    collectionCount++;
    const list = nodes.find((node) => node["@type"] === "ItemList");
    const cards = [...html.matchAll(/data-game-card="([^"]+)"/g)].map(
      (m) => m[1],
    );
    assert.equal(list.numberOfItems, cards.length);
    assert.deepEqual(
      list.itemListElement.map(
        (item) => new URL(item.url).pathname.split("/")[3],
      ),
      cards,
    );
    if (/\/page\//.test(route)) assert(/Page \d|\d페이지/.test(title));
  }
}
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (cursor < urls.length) await inspect(urls[cursor++]);
  }),
);
// The complete static catalogue must expose every indexed game once per locale.
for (const locale of ["en", "ko"]) {
  const index = JSON.parse(await read(`/${locale}/search-index.json`));
  const catalogueUrls = urls.filter((url) =>
    new URL(url).pathname.startsWith(`/${locale}/all/`),
  );
  assert.equal(catalogueUrls.length, Math.ceil(index.length / 24));
  const ids = [];
  for (const url of catalogueUrls) {
    const html = await read(url);
    const cards = [...html.matchAll(/data-game-card="([^"]+)"/g)].map(
      (m) => m[1],
    );
    assert(
      cards.length > 0 && cards.length <= 24,
      `Catalogue page size: ${url}`,
    );
    ids.push(...cards);
    assert(
      html.includes('data-catalogue-pages="top"') &&
        html.includes('data-catalogue-pages="bottom"'),
    );
  }
  assert.deepEqual(
    ids,
    index.map((game) => game.id),
    `Complete catalogue: ${locale}`,
  );
  assert.equal(new Set(ids).size, index.length);
}
for (const path of [
  "/en/search/",
  "/ko/library/",
  "/en/gamepad-test/",
  "/ko/device-check/",
  "/ko/play/crisp-pakupaku/",
])
  assert((await read(path)).includes("noindex, follow"));
assert((await read("/robots.txt")).includes(`Sitemap: ${SITE}/sitemap.xml`));
console.log(
  JSON.stringify(
    {
      base: live ?? "dist",
      indexablePages: urls.length,
      gamePages: gameCount,
      collectionPages: collectionCount,
      status:
        "unique metadata, language pairs, schema, crawlable collections and index boundaries passed",
      checkedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);
