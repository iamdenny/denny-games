import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const vendorRoot = path.join(root, "vendor/gridland");
const upstreamRoot = path.join(vendorRoot, "upstream");
const publicRoot = path.join(root, "public/vendor/gridland");
const runtimeRoot = path.join(publicRoot, "runtime");
const provenance = JSON.parse(
  await readFile(path.join(vendorRoot, "provenance.json"), "utf8"),
);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink(), "Gridland source contains a symlink.");
    if (entry.isDirectory()) files.push(...(await filesUnder(absolute)));
    else files.push(absolute);
  }
  return files;
}

function replaceOnce(source, before, after, label) {
  assert(
    source.includes(before),
    "Expected Gridland source hook missing: " + label,
  );
  return source.replace(before, after);
}

const upstreamFiles = (await filesUnder(upstreamRoot))
  .map((absolute) => [
    path.relative(upstreamRoot, absolute).split(path.sep).join("/"),
    absolute,
  ])
  .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
assert.deepEqual(
  upstreamFiles.map(([file]) => file),
  Object.keys(provenance.upstream_files).sort(),
  "Gridland upstream inventory changed; review and update provenance.",
);
for (const [relative, absolute] of upstreamFiles) {
  const actual = createHash("sha256")
    .update(await readFile(absolute))
    .digest("hex");
  assert.equal(
    actual,
    provenance.upstream_files[relative],
    "Pinned Gridland source changed: " + relative,
  );
}

await rm(publicRoot, { recursive: true, force: true });
await mkdir(path.dirname(runtimeRoot), { recursive: true });
await cp(path.join(upstreamRoot, "www"), runtimeRoot, { recursive: true });

const appPath = path.join(runtimeRoot, "js/app.js");
let app = await readFile(appPath, "utf8");
app = replaceOnce(
  app,
  '"jquery": [\n\t\t\t"https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",\n\t\t\t"jquery-2.0.3.min"\n\t\t],',
  '"jquery": "jquery-2.0.3.min",',
  "remote jQuery fallback",
);
app = app.replace(
  /\n\s*"google-analytics":\s*\[\s*"https:\/\/www\.google-analytics\.com\/analytics",\s*"analytics"\s*\]/,
  "",
);
await writeFile(appPath, app);

const spritesPath = path.join(runtimeRoot, "js/app/graphics/sprites.js");
let sprites = await readFile(spritesPath, "utf8");
sprites = replaceOnce(
  sprites,
  'var CDN_PATH = "https://glmedia.doublespeakgames.com/";',
  'var CDN_PATH = "/vendor/gridland/runtime/";',
  "sprite CDN path",
);
await writeFile(spritesPath, sprites);

const cssPath = path.join(runtimeRoot, "css/main.css");
let css = await readFile(cssPath, "utf8");
css = css.replaceAll(
  "https://glmedia.doublespeakgames.com/img/",
  "/vendor/gridland/runtime/img/",
);
assert(
  !/https?:\/\//i.test(css),
  "Gridland runtime CSS still has remote URLs.",
);
await writeFile(cssPath, css);

const moduleStubs = {
  "js/app/analytics.js":
    "define(function(){return {init:function(){},isReady:true};});\n",
  "js/app/graphics/share.js":
    "define(function(){return {init:function(){},isReady:true};});\n",
  "js/app/graphics/donate.js":
    "define(function(){return {init:function(){},isReady:true};});\n",
  "js/app/audio/audio.js":
    "define(function(){return {init:function(){},isReady:true,play:function(){},stop:function(){},setMusicVolume:function(){},setEffectsVolume:function(){}};});\n",
  "js/lib/base64.js":
    'define(function(){return {encode:function(value){return btoa(Array.from(new TextEncoder().encode(String(value)),function(byte){return String.fromCharCode(byte);}).join(""));},decode:function(value){return new TextDecoder().decode(Uint8Array.from(atob(String(value)),function(char){return char.charCodeAt(0);}));}};});\n',
};
for (const [relative, source] of Object.entries(moduleStubs)) {
  await writeFile(path.join(runtimeRoot, relative), source);
}

const indexPath = path.join(runtimeRoot, "index.html");
let html = await readFile(indexPath, "utf8");
html = html.replace(/<!--[\s\S]*?-->/g, "");
html = html.replace(/\s*<meta itemprop="image"[^>]*>/, "");
html = html.replace(/\s*<link rel="image_src"[^>]*>/, "");
html = html.replace(/\s*<link rel="apple-touch-icon"[^>]*>/, "");
html = html.replace(/\s*<link rel="shortcut icon"[^>]*>/, "");
html = html.replace(/\s*<style>[\s\S]*?<\/style>/, "");
html = html.replace(/\s*<div id="test"[^>]*><\/div>/, "");
html = html.replace(/\s*<div id="debug"[^>]*><\/div>/, "");
html = html.replace(
  /<a class="logo"[^>]*>[\s\S]*?<\/a>/,
  '<div class="logo" aria-hidden="true"><span class="nightSprite"></span></div>',
);
html = html.replace(
  '<meta name="viewport" content="width=device-width">',
  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n\t\t<meta name=\"robots\" content=\"noindex,follow\">\n\t\t<link rel=\"canonical\" href=\"https://games.iamdenny.com/en/games/gridland/\">\n\t\t<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'none'; connect-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'\">",
);
html = html.replace(
  '<script type="text/javascript" data-main="js/app" src="js/lib/require.js"></script>',
  '<script src="bridge.js"></script>\n\t\t<script data-main="js/app" src="js/lib/require.js"></script>',
);
await writeFile(indexPath, html);
await cp(
  path.join(root, "src/games/gridland/bridge.js"),
  path.join(runtimeRoot, "bridge.js"),
);

const sourceRoot = path.join(publicRoot, "source/upstream");
for (const [relative, absolute] of upstreamFiles) {
  const targetName = /\.(?:html|js|css|md)$/.test(relative)
    ? relative + ".txt"
    : relative === "LICENSE"
      ? "LICENSE.txt"
      : relative;
  const target = path.join(sourceRoot, targetName);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(absolute, target);
}
const runtimeSourceRoot = path.join(publicRoot, "source/runtime");
for (const absolute of await filesUnder(runtimeRoot)) {
  const relative = path
    .relative(runtimeRoot, absolute)
    .split(path.sep)
    .join("/");
  if (!/\.(?:html|js|css)$/.test(relative)) continue;
  const target = path.join(runtimeSourceRoot, relative + ".txt");
  await mkdir(path.dirname(target), { recursive: true });
  await cp(absolute, target);
}
await mkdir(path.join(root, "public/licenses/gridland"), { recursive: true });
await cp(
  path.join(upstreamRoot, "LICENSE"),
  path.join(root, "public/licenses/gridland/LICENSE.txt"),
);
await writeFile(
  path.join(root, "public/licenses/gridland/README.txt"),
  [
    "Gridland on Denny Games",
    "",
    "Upstream: " + provenance.source_repository,
    "Commit: " + provenance.source_commit,
    "Author: Michael Townsend (game code, design and graphics)",
    "License: MPL-2.0; see LICENSE.txt.",
    "Corresponding source files are published under /vendor/gridland/source/upstream/.",
    "The corresponding modified runtime source is published under /vendor/gridland/source/runtime/.",
    "Denny Games lifecycle adapter source is in /vendor/gridland/source/runtime/bridge.js.txt.",
    "Music, analytics, social sharing and donation integrations are omitted.",
    "jQuery 2.0.3 is MIT licensed; RequireJS 2.1.8 is available under MIT or new BSD.",
    "",
  ].join("\n"),
);
await writeFile(
  path.join(root, "public/licenses/gridland/DEPENDENCIES.txt"),
  [
    "Bundled dependencies",
    "",
    "jQuery 2.0.3 — MIT License",
    "Copyright 2013 jQuery Foundation and other contributors",
    "",
    "RequireJS 2.1.8 — MIT License (also available under the new BSD license)",
    "Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.",
    "",
    'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
    "",
    "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
    "",
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
    "",
    "The legacy Base64 helper from the upstream repository is excluded from this source subset because it does not state a redistribution license. The hosted runtime uses a small browser TextEncoder and TextDecoder adapter instead.",
    "",
  ].join("\n"),
);
await writeFile(
  path.join(root, "public/licenses/gridland/index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Gridland source and licenses · Denny Games</title>
    <meta name="description" content="Gridland MPL-2.0 source, local runtime changes and dependency notices." />
    <link rel="canonical" href="https://games.iamdenny.com/licenses/gridland/" />
  </head>
  <body>
    <main>
      <h1>Gridland source and licenses</h1>
      <p>Gridland was created by Michael Townsend. Game code and graphics are published under MPL-2.0. This version is based on pinned revision <code>${provenance.source_commit}</code>.</p>
      <p><a href="LICENSE.txt">Read the complete MPL-2.0 license</a> · <a href="DEPENDENCIES.txt">Runtime dependency notices</a></p>
      <p><a href="${provenance.source_repository}/tree/${provenance.source_commit}">Pinned upstream source</a> · <a href="/vendor/gridland/source/upstream/README.md.txt">Corresponding upstream source snapshot</a> · <a href="/vendor/gridland/source/runtime/bridge.js.txt">Modified runtime source and save bridge</a> · <a href="/vendor/gridland/source/provenance.json">Source hashes and exclusions</a></p>
      <p>Denny Games serves the game and sprite sheets from this site in an opaque-origin sandbox with off-site connections blocked. The hosted runtime removes upstream analytics, audio, social sharing and donation integrations. Original music is omitted because its separate license was not verified.</p>
      <p>한국어 안내: Gridland는 Michael Townsend가 만든 게임이며 코드와 그림은 MPL-2.0으로 공개됐습니다. 고정 원본, 수정된 런타임 소스와 해시를 위에서 확인할 수 있습니다. 게임과 타일 그림은 이 사이트에서 직접 제공하며, 외부 연결이 차단된 격리 프레임에서 실행합니다. 별도 라이선스를 확인하지 못한 음악과 분석·공유·기부 기능은 제외했습니다.</p>
    </main>
  </body>
</html>
`,
);
await writeFile(
  path.join(publicRoot, "source/provenance.json"),
  JSON.stringify(provenance, null, 2) + "\n",
);

const remoteRuntime = /https?:\/\//i.test(
  [
    (await readFile(indexPath, "utf8")).replace(
      /<link rel="canonical"[^>]*>/,
      "",
    ),
    await readFile(cssPath, "utf8"),
    await readFile(appPath, "utf8"),
    await readFile(spritesPath, "utf8"),
  ].join("\n"),
);
assert(!remoteRuntime, "Gridland runtime entry files contain remote URLs.");
console.log(
  "Gridland " +
    provenance.source_commit +
    ": verified " +
    upstreamFiles.length +
    " pinned files, emitted local runtime and corresponding source.",
);
