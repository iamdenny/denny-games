import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "vendor/sokoban/upstream");
const adapterRoot = path.join(root, "vendor/sokoban");
const publicRoot = path.join(root, "public/vendor/sokoban");
const provenance = JSON.parse(
  await readFile(path.join(adapterRoot, "provenance.json"), "utf8"),
);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink(), "Sokoban source contains a symlink.");
    if (entry.isDirectory()) files.push(...(await filesUnder(absolute)));
    else files.push(absolute);
  }
  return files;
}

const upstreamFiles = (await filesUnder(sourceRoot))
  .map((absolute) => [
    path.relative(sourceRoot, absolute).split(path.sep).join("/"),
    absolute,
  ])
  .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
const actualPaths = upstreamFiles.map(([relative]) => relative);
const expectedPaths = Object.keys(provenance.upstream_files).sort();
assert.deepEqual(
  actualPaths,
  expectedPaths,
  "Sokoban source inventory changed; review and update provenance.",
);

for (const [relative, absolute] of upstreamFiles) {
  const actual = createHash("sha256")
    .update(await readFile(absolute))
    .digest("hex");
  assert.equal(
    actual,
    provenance.upstream_files[relative],
    "Pinned Sokoban source changed: " + relative,
  );
}

for (const [relative, expected] of Object.entries(provenance.product_artwork)) {
  const actual = createHash("sha256")
    .update(await readFile(path.join(root, relative)))
    .digest("hex");
  assert.equal(
    actual,
    expected,
    "Denny Games Sokoban artwork changed: " + relative,
  );
}

await rm(publicRoot, { recursive: true, force: true });
await mkdir(path.join(publicRoot, "source/upstream"), { recursive: true });
await mkdir(path.join(root, "public/licenses/sokoban"), { recursive: true });

for (const [relative, absolute] of upstreamFiles) {
  const filename =
    relative === ".gitignore"
      ? "GITIGNORE.txt"
      : relative === "LICENSE"
        ? "LICENSE.txt"
        : relative === "README.md"
          ? "README.md.txt"
          : /\.(?:html|ts)$/.test(relative)
            ? relative + ".txt"
            : relative;
  const target = path.join(publicRoot, "source/upstream", filename);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(absolute, target);
}

await cp(
  path.join(sourceRoot, "LICENSE"),
  path.join(root, "public/licenses/sokoban/LICENSE.txt"),
);
await writeFile(
  path.join(publicRoot, "source/README.txt"),
  [
    "Sokoban upstream source",
    "",
    "Repository: " + provenance.source_repository,
    "Commit: " + provenance.source_commit,
    "The original MIT license is available at /licenses/sokoban/LICENSE.txt.",
    "The Denny Games lifecycle adapter is maintained in src/games/sokoban/.",
    "",
  ].join("\n"),
);
await writeFile(
  path.join(publicRoot, "source/provenance.json"),
  JSON.stringify(provenance, null, 2) + "\n",
);

console.log(
  "Sokoban " +
    provenance.source_commit +
    ": verified " +
    upstreamFiles.length +
    " upstream files and published source/license.",
);
