import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const args = process.argv.slice(2);
const option = (name) => args[args.indexOf(name) + 1];
const base = args.includes("--base")
  ? option("--base").replace(/\/$/, "")
  : "https://games.iamdenny.com";
const expected = args.includes("--sha") ? option("--sha") : undefined;
async function get(path) {
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  assert.equal(response.status, 200, `${path}: ${response.status}`);
  return response.text();
}
const release = JSON.parse(await get("/release.json"));
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
  assert([...html.matchAll(/data-game-card=/g)].length <= 21);
  const ids = JSON.parse(await get(`/${locale}/search-index.json`)).map(
    (item) => item.id,
  );
  await Promise.all(
    ids.map(async (id) => {
      await get(`/${locale}/games/${id}/`);
      const player = await get(`/${locale}/play/${id}/`);
      assert(player.includes("noindex, follow"));
      assert(!player.includes("data-ad-slot"));
    }),
  );
  for (const match of html.matchAll(/(?:src|href)="(\/_astro\/[^"?]+)"/g))
    await get(match[1]);
}
for (const path of [
  "/",
  "/robots.txt",
  "/sitemap.xml",
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
