import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";

const root = "vendor/freedoom";
const output = "public/vendor/freedoom";
const files = {
  "chocolate-doom.js":
    "c5ed72bfc6875566aff22244083907cc5111aa87e33f4007e420368102faf51b",
  "chocolate-doom.wasm":
    "6922e97650ff306d0fef584eb515d52fd1e09bb77bc7e8287b658e09977b54f7",
};
const dataGzip = "chocolate-doom.data.gz";
const dataGzipHash =
  "fe0aa62547f85db54676bd66dfe01deb7b228d3bd20ff2e48df7d180817f17a4";
const dataHash =
  "a8772e088847032510d97ba2312406a6998f21cbab44d4ff10696faa9c0ecd4b";
const dataBytes = 28_787_748;
const chunkBytes = 4 * 1024 * 1024;
const sourceArchive = "source/chocolate-doom-emscripten.tar.gz";
const sourceHash =
  "e69a3dd6f9fa90e58043f7398495750ee9505aea5bb41d1fdd78ed4fa2c30b17";
const runtimePatch = JSON.parse(
  fs.readFileSync(
    path.join(root, "source/emscripten-sleep-patch.json"),
    "utf8",
  ),
);
const runtimePatchHash =
  "a68cac29d274cdb1ba2565510c2cdcd732ff18744b918c77878f4e2b98df3d67";

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

fs.mkdirSync(output, { recursive: true });
assert.equal(
  sha256(path.join(root, "source/emscripten-sleep-patch.json")),
  runtimePatchHash,
  "Freedoom Asyncify pause patch hash mismatch",
);
assert.equal(
  runtimePatch.sourceSha256,
  files["chocolate-doom.js"],
  "Freedoom pause patch input does not match the pinned runtime",
);
for (const [name, expected] of Object.entries(files)) {
  const source = path.join(root, "runtime", name);
  assert.equal(
    sha256(source),
    expected,
    `Freedoom runtime hash mismatch: ${name}`,
  );
  if (name === "chocolate-doom.js") {
    const original = fs.readFileSync(source, "utf8");
    assert.equal(
      original.split(runtimePatch.from).length,
      2,
      "Freedoom pause patch must match exactly once",
    );
    const patched = original.replace(runtimePatch.from, runtimePatch.to);
    const patchedHash = createHash("sha256").update(patched).digest("hex");
    assert.equal(
      patchedHash,
      runtimePatch.outputSha256,
      "Freedoom pause-patched runtime hash mismatch",
    );
    fs.writeFileSync(path.join(output, name), patched);
  } else {
    fs.copyFileSync(source, path.join(output, name));
  }
}

const compressedData = fs.readFileSync(path.join(root, "runtime", dataGzip));
assert.equal(
  createHash("sha256").update(compressedData).digest("hex"),
  dataGzipHash,
  "Freedoom compressed data hash mismatch",
);
const expandedData = gunzipSync(compressedData);
assert.equal(expandedData.byteLength, dataBytes, "Freedoom WAD size mismatch");
assert.equal(
  createHash("sha256").update(expandedData).digest("hex"),
  dataHash,
  "Freedoom WAD hash mismatch",
);
const previousData = fs
  .readdirSync(output)
  .filter(
    (name) => name.startsWith("chocolate-doom-data-") && name.endsWith(".bin"),
  );
for (const name of previousData) fs.rmSync(path.join(output, name));
fs.rmSync(path.join(output, "chocolate-doom.data"), { force: true });
const chunkCount = Math.ceil(compressedData.byteLength / chunkBytes);
for (let index = 0; index < chunkCount; index += 1) {
  const start = index * chunkBytes;
  const part = compressedData.subarray(start, start + chunkBytes);
  fs.writeFileSync(
    path.join(output, `chocolate-doom-data-${index + 1}.bin`),
    part,
  );
}

const archive = path.join(root, sourceArchive);
assert.equal(
  sha256(archive),
  sourceHash,
  "Chocolate Doom source archive hash mismatch",
);
const publicSource = path.join(output, "source");
fs.mkdirSync(publicSource, { recursive: true });
fs.copyFileSync(
  archive,
  path.join(publicSource, "chocolate-doom-emscripten.tar.gz"),
);
for (const name of fs.readdirSync(path.join(root, "source"))) {
  if (name === "chocolate-doom-emscripten.tar.gz") continue;
  fs.copyFileSync(
    path.join(root, "source", name),
    path.join(publicSource, name),
  );
}
fs.copyFileSync(
  path.join(root, "provenance.json"),
  path.join(output, "provenance.json"),
);
console.log(
  `Freedoom runtime, compressed WAD and corresponding source hashes passed (${chunkCount} local chunks).`,
);
