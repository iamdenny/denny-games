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
async function get(path) {
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  assert.equal(response.status, 200, `${path}: ${response.status}`);
  return response.text();
}
const release = JSON.parse(await get("/release.json"));
const expectedKey = readFileSync(`public${KEY_PATH}`, "utf8").trim();
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
  const preview = inspectHomePreview(html, games.length);
  assert(
    preview.valid,
    `${locale} home preview is invalid: ${JSON.stringify(preview)}`,
  );
  await Promise.all(
    games.map(async (game) => {
      const detail = await get(`/${locale}/games/${game.id}/`);
      if (game.externalPlayUrl) {
        const publicUrl = game.externalPlayUrl.replaceAll("&", "&amp;");
        assert(
          detail.includes(`href="${publicUrl}"`),
          `/${locale}/games/${game.id}/: external play link missing`,
        );
        assert(
          detail.includes('class="external-host-note"'),
          `/${locale}/games/${game.id}/: external host label missing`,
        );
        return;
      }
      const player = await get(`/${locale}/play/${game.id}/`);
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
