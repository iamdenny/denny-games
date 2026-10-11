// The pinned upstream bundle is kept intact; only these checked host hooks are added.
import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
let code = fs.readFileSync("vendor/crisp/runtime.upstream.js", "utf8");
const replacements = [
  [
    "        const now = window.performance.now();\n        if (now < nextFrameTime",
    "        if (!window.dennyBridge?.running) return;\n        const now = window.performance.now();\n        if (now < nextFrameTime",
  ],
  [
    "        _update$1();",
    "        window.dennyBridge.beforeUpdate();\n        _update$1();\n        window.dennyBridge.afterUpdate(exports.score, exports.ticks);",
  ],
  [
    '    function end(_gameOverText = "GAME OVER") {',
    '    function end(_gameOverText = "GAME OVER") {\n        window.dennyBridge.finish(exports.score, false);',
  ],
  [
    '    function complete(completeText = "COMPLETE") {',
    '    function complete(completeText = "COMPLETE") {\n        window.dennyBridge.finish(exports.score, true);',
  ],
  [
    "    function handleUpdateError(error) {",
    "    function handleUpdateError(error) {\n        window.dennyBridge.fail(String(error));",
  ],
];
for (const [from, to] of replacements) {
  assert.equal(code.split(from).length, 2, `Upstream hook changed: ${from}`);
  code = code.replace(from, to);
}
fs.writeFileSync(
  "public/vendor/crisp/runtime.js",
  "// ABA Games MIT — /licenses/crisp/runtime.txt. Host hooks: scripts/build-crisp.mjs\n" +
    code,
);
const pinned = JSON.parse(
  fs.readFileSync("vendor/crisp/provenance.json", "utf8"),
);
assert.equal(
  createHash("sha256")
    .update(fs.readFileSync("vendor/crisp/runtime.upstream.js"))
    .digest("hex"),
  pinned.runtime_upstream_sha256,
);
assert.equal(
  createHash("sha256")
    .update(fs.readFileSync("public/vendor/crisp/clone-deep.js"))
    .digest("hex"),
  pinned.clone_deep_sha256,
);
// Local data URLs keep sprite canvases untainted inside the opaque-origin frame.
const provenance = JSON.parse(
  fs.readFileSync("vendor/crisp/provenance.json", "utf8"),
);
const images = Object.fromEntries(
  provenance.image_assets.map((asset) => [
    "./" + asset.path.split("public/vendor/crisp/")[1],
    `data:image/png;base64,${fs.readFileSync(asset.path).toString("base64")}`,
  ]),
);
fs.writeFileSync(
  "public/vendor/crisp/images.js",
  "window.dennyImages=" + JSON.stringify(images) + ";\n",
);

// DANGO builds only integer addition/multiplication expressions. Keep its
// upstream bytes for provenance, but execute an audited CSP-safe derivative.
const dango = pinned.games.find((game) => game.slug === "dango");
const dangoSource = fs.readFileSync("public/vendor/crisp/games/dango/main.js");
assert.equal(
  createHash("sha256").update(dangoSource).digest("hex"),
  dango.vendored_sha256,
);
const fromExpression = "Function(`return ${expStr};`)()";
assert.equal(dangoSource.toString().split(fromExpression).length, 2);
const arithmetic = `function dennyDangoValue(expression) {
  if (!/^\\d+(?:[+*]\\d+)*$/.test(expression)) throw Error("Invalid DANGO expression");
  return expression.split("+").reduce((sum, term) =>
    sum + term.split("*").reduce((product, value) => product * Number(value), 1), 0);
}
`;
fs.writeFileSync(
  "public/vendor/crisp/games/dango/main.csp.js",
  "// ABA Games MIT. CSP arithmetic adaptation: scripts/build-crisp.mjs\n" +
    arithmetic +
    dangoSource.toString().replace(fromExpression, "dennyDangoValue(expStr)"),
);
