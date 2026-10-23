import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { KEY_PATH } from "./indexnow.mjs";
import { inspectHomePreview } from "./public-preview.mjs";
const args = process.argv.slice(2);
const option = (name) => args[args.indexOf(name) + 1];
const base = args.includes("--base")
  ? option("--base").replace(/\/$/, "")
  : "https://games.iamdenny.com";
const expected = args.includes("--sha") ? option("--sha") : undefined;
const retiredExternalGames = JSON.parse(
  readFileSync("vendor/external-browser-listings.json", "utf8"),
).entries;
async function get(path) {
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
    redirect: "manual",
  });
  assert.equal(response.status, 200, `${path}: ${response.status}`);
  return response.text();
}
async function eachLimited(items, limit, action) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) await action(items[next++]);
    }),
  );
}
const release = JSON.parse(await get("/release.json"));
const expectedKey = readFileSync(`public${KEY_PATH}`, "utf8").trim();
let activeGamesById;
assert.equal(
  (await get(KEY_PATH)).trim(),
  expectedKey,
  "Public IndexNow key differs",
);
assert.equal(
  release.version,
  JSON.parse(readFileSync("package.json", "utf8")).version,
  "Public package version differs",
);
if (expected)
  assert.equal(
    release.sha,
    expected,
    "Public SHA differs from requested release",
  );
for (const locale of ["en", "ko"]) {
  const html = await get(`/${locale}/`);
  assert(html.includes(`lang="${locale}"`));
  const games = JSON.parse(await get(`/${locale}/search-index.json`));
  assert.equal(games.length, 215, `${locale}: published game count differs`);
  const localeGamesById = new Map(games.map((game) => [game.id, game]));
  if (activeGamesById)
    assert.deepEqual(
      [...localeGamesById.keys()].sort(),
      [...activeGamesById.keys()].sort(),
      `${locale}: localized catalogue IDs differ`,
    );
  else activeGamesById = localeGamesById;
  // Some retired external listings reuse their slug for a locally hosted game.
  const retiredRoutes = retiredExternalGames.filter(
    (game) => !localeGamesById.has(game.id),
  );
  assert(
    games.every((game) => !game.externalHost && !game.externalPlayUrl),
    `${locale}: search index contains an external play destination`,
  );
  const preview = inspectHomePreview(html, games.length);
  assert(
    preview.valid,
    `${locale} home preview is invalid: ${JSON.stringify(preview)}`,
  );
  await eachLimited(games, 24, async (game) => {
    const detail = await get(`/${locale}/games/${game.id}/`);
    assert(
      detail.includes(`href="/${locale}/play/${game.id}/"`),
      `/${locale}/games/${game.id}/: local play link missing`,
    );
    assert(
      !detail.includes('class="external-host-note"'),
      `/${locale}/games/${game.id}/: external host disclosure found`,
    );
    const player = await get(`/${locale}/play/${game.id}/`);
    assert(player.includes("noindex, follow"));
    assert(!player.includes("data-ad-slot"));
  });
  await eachLimited(retiredRoutes, 24, async (game) => {
    const response = await fetch(`${base}/${locale}/games/${game.id}/`, {
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
      redirect: "manual",
    });
    assert.equal(
      response.status,
      404,
      `/${locale}/games/${game.id}/: retired external listing is still public`,
    );
  });
  for (const match of html.matchAll(/(?:src|href)="(\/_astro\/[^"?]+)"/g))
    await get(match[1]);
}
const sitemap = await get("/sitemap.xml");
const retiredRoutes = retiredExternalGames.filter(
  (game) => !activeGamesById.has(game.id),
);
for (const locale of ["en", "ko"])
  for (const game of retiredRoutes)
    assert(
      !sitemap.includes(`/${locale}/games/${game.id}/`),
      `Sitemap still contains retired external game /${locale}/games/${game.id}/`,
    );
await eachLimited(retiredExternalGames, 24, async (game) => {
  assert.match(
    game.archivedArtwork,
    /^vendor\/external-listing-art\//,
    `${game.id}: archived artwork path is missing`,
  );
  const path = `/art/${game.archivedArtwork.slice(
    "vendor/external-listing-art/".length,
  )}`;
  const activeGame = activeGamesById.get(game.id);
  if (activeGame?.artwork === path) {
    const publishedArtwork = await get(path);
    assert.equal(
      publishedArtwork,
      readFileSync(`public${activeGame.artwork}`, "utf8"),
      `${path}: active local artwork differs from its source`,
    );
    assert.notEqual(
      publishedArtwork,
      readFileSync(game.archivedArtwork, "utf8"),
      `${path}: archived external artwork is still published`,
    );
    return;
  }
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
    redirect: "manual",
  });
  assert.equal(response.status, 404, `${path}: archived artwork is public`);
});
for (const path of [
  "/",
  "/robots.txt",
  "/licenses/2048.txt",
  "/licenses/dependencies.json",
  "/art/screenshots/circuit-loop.png",
])
  await get(path);
console.log(
  JSON.stringify(
    {
      base,
      sha: release.sha,
      version: release.version,
      status: "public HTML, games, assets, SEO and notices passed",
      checkedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);
