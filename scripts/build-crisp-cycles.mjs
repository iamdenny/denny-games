import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const manifest = JSON.parse(
  fs.readFileSync("vendor/crisp-cycles/provenance.json", "utf8"),
);
const outputRoot = "public/vendor/crisp-cycles";
const frame = (slug) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="robots" content="noindex,follow" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; media-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'" />
    <link rel="canonical" href="https://games.iamdenny.com/en/games/crisp-${slug}/" />
    <title>Denny Games arcade frame</title>
  </head>
  <body style="margin:0;overflow:hidden;background:#090c1b">
    <script src="/vendor/crisp-cycles/bridge.js"></script>
  </body>
</html>
`;

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function checkedSource(gameSlug, sourcePath) {
  const upstreamPath = path.resolve(`vendor/crisp-cycles/upstream/${gameSlug}`);
  const sourcePathResolved = path.resolve(sourcePath);
  const requestedRelative = path.relative(upstreamPath, sourcePathResolved);
  assert.ok(
    requestedRelative &&
      !requestedRelative.startsWith("../") &&
      !path.isAbsolute(requestedRelative),
    `Source escaped game directory: ${sourcePath}`,
  );
  assert.ok(
    !fs.lstatSync(upstreamPath).isSymbolicLink(),
    `Game source directory cannot be a symbolic link: ${upstreamPath}`,
  );

  let current = upstreamPath;
  for (const part of requestedRelative.split(path.sep)) {
    current = path.join(current, part);
    assert.ok(
      !fs.lstatSync(current).isSymbolicLink(),
      `Symbolic-link sources are not allowed: ${sourcePath}`,
    );
  }

  const upstreamRoot = fs.realpathSync(upstreamPath);
  const source = fs.realpathSync(sourcePathResolved);
  const relative = path.relative(upstreamRoot, source);
  assert.ok(
    relative && !relative.startsWith("../") && !path.isAbsolute(relative),
    `Resolved source escaped game directory: ${sourcePath}`,
  );
  assert.ok(
    fs.statSync(source).isFile(),
    `Source is not a file: ${sourcePath}`,
  );
  return { source, relative };
}

for (const game of manifest.games) {
  const destination = path.join(outputRoot, game.slug);
  fs.mkdirSync(destination, { recursive: true });
  fs.writeFileSync(path.join(destination, "index.html"), frame(game.slug));

  const files = [...game.runtime_files, ...game.assets];
  const images = {};
  for (const file of files) {
    const { source, relative } = checkedSource(game.slug, file.source);
    assert.equal(sha256(source), file.sha256, `Source changed: ${file.source}`);
    const target = path.join(destination, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    if (file.source.endsWith(".png")) {
      images[`./${relative.replaceAll(path.sep, "/")}`] =
        `data:image/png;base64,${fs.readFileSync(source).toString("base64")}`;
    }
  }
  fs.writeFileSync(
    path.join(destination, "assets.js"),
    `window.dennyCycleImages=${JSON.stringify(images)};\n`,
  );
}

console.log(`Built ${manifest.games.length} pinned Crisp arcade cycles.`);
