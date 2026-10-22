import { readFile, mkdir, cp, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const root = "vendor/neverball",
  meta = JSON.parse(await readFile(`${root}/provenance.json`, "utf8"));
for (const [file, expected] of Object.entries(meta.upstream_files)) {
  const bytes = await readFile(`${root}/upstream/${file}`);
  if (createHash("sha256").update(bytes).digest("hex") !== expected)
    throw Error(`Neverball provenance mismatch: ${file}`);
}
await mkdir("public/vendor/neverball", { recursive: true });
for (const f of [
  "neverball.js",
  "neverball.wasm",
  "neverball.data",
  "set-easy.zip",
  "course-putt.zip",
])
  await cp(`${root}/upstream/${f}`, `public/vendor/neverball/${f}`);
for (const f of ["bridge.js", "index.html"])
  await cp(`${root}/${f}`, `public/vendor/neverball/${f}`);
console.log(
  "Neverball / Neverputt: verified upstream payloads and source archive; emitted local runtime.",
);

const original = await readFile(`${root}/upstream/neverball.js`, "utf8");
const anchor =
  "var xhr=new XMLHttpRequest;xhr.withCredentials=!!HEAPU8[fetch_attr+60]";
if (original.split(anchor).length !== 2)
  throw Error("Neverball network hook changed");
await writeFile(
  "public/vendor/neverball/neverball.js",
  original.replace(
    anchor,
    "var xhr=new DennyLocalRequest;xhr.withCredentials=!!HEAPU8[fetch_attr+60]",
  ),
);
