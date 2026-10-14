import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "vendor/underrun/upstream");
const outputRoot = path.join(root, "public/vendor/underrun");
const adapterRoot = path.join(root, "vendor/underrun");
const provenance = JSON.parse(
  await readFile(path.join(adapterRoot, "provenance.json"), "utf8"),
);
const sourceOrder = [
  "game.js",
  "random.js",
  "renderer.js",
  "entity.js",
  "entity-player.js",
  "entity-cpu.js",
  "entity-plasma.js",
  "entity-spider.js",
  "entity-sentry.js",
  "entity-particle.js",
  "entity-health.js",
  "entity-explosion.js",
  "sonantx-reduced.js",
  "music-dark-meat-beat.js",
  "sound-effects.js",
  "audio.js",
  "terminal.js",
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(absolute)));
    else files.push(absolute);
  }
  return files;
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function replaceOnce(content, before, after) {
  if (content.split(before).length !== 2) {
    throw new Error(`UNDERRUN host patch anchor changed: ${before}`);
  }
  return content.replace(before, after);
}

const upstreamFiles = (await filesUnder(sourceRoot))
  .map((absolute) => [
    path.relative(sourceRoot, absolute).split(path.sep).join("/"),
    absolute,
  ])
  .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
const actualPaths = upstreamFiles.map(([relative]) => relative);
const expectedPaths = Object.keys(provenance.upstream_files).sort();
if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
  throw new Error(
    "UNDERRUN upstream file inventory changed; update provenance after review.",
  );
}
for (const [relative, absolute] of upstreamFiles) {
  const actual = sha256(await readFile(absolute));
  if (actual !== provenance.upstream_files[relative]) {
    throw new Error(`UNDERRUN upstream hash changed: ${relative}`);
  }
}

const source = await Promise.all(
  sourceOrder.map((file) =>
    readFile(path.join(sourceRoot, "source", file), "utf8"),
  ),
);
const expectedSources = new Set(sourceOrder.map((file) => `source/${file}`));
for (const relative of expectedSources) {
  if (!provenance.upstream_files[relative])
    throw new Error(`UNDERRUN source is missing from provenance: ${relative}`);
}
const engine = replaceOnce(
  source.join("\n"),
  "terminal_timeout_id = setTimeout(callback, terminal_line_wait);",
  "terminal_timeout_id = setTimeout(typeof callback === 'function' ? callback : function(){}, terminal_line_wait);",
);

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "engine.js"), engine);
const assets = Object.fromEntries(
  await Promise.all(
    ["q2", "l1", "l2", "l3"].map(async (name) => [
      name,
      `data:image/png;base64,${(await readFile(path.join(sourceRoot, `m/${name}.png`))).toString("base64")}`,
    ]),
  ),
);
await writeFile(
  path.join(outputRoot, "assets.js"),
  `globalThis.underrunAssetData = ${JSON.stringify(assets)};\n`,
);
await writeFile(
  path.join(outputRoot, "main.js"),
  await readFile(path.join(sourceRoot, "source/main.js")),
);
await cp(
  path.join(adapterRoot, "bridge.js"),
  path.join(outputRoot, "bridge.js"),
);
await cp(
  path.join(adapterRoot, "index.html"),
  path.join(outputRoot, "index.html"),
);
const servedFiles = await filesUnder(outputRoot);
const executable = await Promise.all(
  servedFiles
    .filter((file) => /\.(?:js|html)$/.test(file))
    .map((file) => readFile(file, "utf8")),
);
const forbidden =
  /(?:\beval\s*\(|\bnew\s+Function\s*\(|\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\()/i;
const remoteResource =
  /<(?:script|img|iframe)\b[^>]*\bsrc=["']https?:\/\/|url\(\s*["']?https?:\/\//i;
if (
  executable.some(
    (content) => forbidden.test(content) || remoteResource.test(content),
  )
) {
  throw new Error(
    "UNDERRUN runtime contains dynamic code or an external connection.",
  );
}
console.log(
  `UNDERRUN ${provenance.source_commit}: verified ${upstreamFiles.length} upstream files; emitted ${servedFiles.length} runtime files.`,
);
