import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
const files = walk("dist");
assert(files.length < 10000, "Artifact file limit exceeded");
let bytes = 0;
for (const file of files) {
  const size = fs.statSync(file).size;
  bytes += size;
  assert(
    size <
      (file === "dist/vendor/neverball/neverball.data" ? 28 : 5) * 1024 * 1024,
    `Oversized file: ${file}`,
  );
  assert(
    !/\.(map|ts|astro|md)$|\.env|COMMERCIAL-GAMES|fixture-/i.test(file),
    `Private/source/fixture file: ${file}`,
  );
  if (!file.endsWith(".html")) continue;
  const html = fs.readFileSync(file, "utf8");
  assert(
    !/fixture-\d|ghp_[a-zA-Z0-9]{20}|github_pat_[a-zA-Z0-9_]{20}/.test(html),
    `Unexpected data: ${file}`,
  );
  assert(html.includes('rel="canonical"'), `Missing canonical: ${file}`);
  if (file.includes("/play/")) {
    assert(html.includes("noindex, follow"));
    assert(!html.includes("data-ad-slot"));
    assert(!html.includes("data-affiliate"));
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    const url = match[1];
    assert(
      fs.existsSync(
        path.join("dist", url, url.endsWith("/") ? "index.html" : ""),
      ),
      `Broken artifact link ${file}: ${url}`,
    );
  }
}
assert(bytes < 100 * 1024 * 1024, "Site exceeds 100MiB budget");
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
assert(!/\/play\/|\/search\/|\/library\//.test(sitemap));
for (const file of [
  "CNAME",
  ".nojekyll",
  "robots.txt",
  "licenses/2048.txt",
  "licenses/dependencies.json",
  "release.json",
])
  assert(fs.existsSync(`dist/${file}`), `Missing ${file}`);
console.log(
  `Artifact: ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB; links and deployment boundaries passed`,
);
