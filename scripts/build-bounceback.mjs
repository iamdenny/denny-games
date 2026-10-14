import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const base = process.cwd();
const upstreamDir = path.join(base, "vendor/bounceback/upstream");
const outputDir = path.join(base, "public/vendor/bounceback");
const sourceDir = path.join(outputDir, "source");
const provenance = JSON.parse(
  fs.readFileSync(path.join(base, "vendor/bounceback/provenance.json"), "utf8"),
);
const hash = (content) => createHash("sha256").update(content).digest("hex");
const replaceOnce = (content, before, after) => {
  assert.equal(
    content.split(before).length,
    2,
    "Bounce Back upstream hook changed: " + before,
  );
  return content.replace(before, after);
};

for (const [name, expected] of Object.entries(provenance.upstream_files)) {
  const content = fs.readFileSync(path.join(upstreamDir, name));
  assert.equal(
    hash(content),
    expected,
    "Pinned Bounce Back source changed: " + name,
  );
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(path.join(sourceDir, "upstream"), { recursive: true });
fs.mkdirSync(path.join(base, "public/licenses/bounceback"), {
  recursive: true,
});
for (const name of Object.keys(provenance.upstream_files))
  fs.copyFileSync(
    path.join(upstreamDir, name),
    path.join(
      sourceDir,
      "upstream",
      name === "index.html"
        ? "index.html.txt"
        : name === "README.md"
          ? "README.md.txt"
          : name,
    ),
  );
fs.copyFileSync(
  path.join(upstreamDir, "LICENSE"),
  path.join(base, "public/licenses/bounceback/LICENSE.txt"),
);
fs.copyFileSync(
  path.join(upstreamDir, "tiles.png"),
  path.join(outputDir, "tiles.png"),
);
fs.copyFileSync(
  path.join(upstreamDir, "screenshot.png"),
  path.join(base, "public/art/bounce-back-title.png"),
);
for (const name of ["index.html", "bridge.js", "SOURCE-README.md"])
  fs.copyFileSync(
    path.join(base, "vendor/bounceback", name),
    path.join(
      name === "SOURCE-README.md" ? sourceDir : outputDir,
      name === "SOURCE-README.md" ? "README.txt" : name,
    ),
  );
fs.copyFileSync(
  path.join(base, "vendor/bounceback/bridge.js"),
  path.join(sourceDir, "bridge.js"),
);
fs.copyFileSync(
  path.join(base, "vendor/bounceback/provenance.json"),
  path.join(sourceDir, "provenance.json"),
);

let engine = fs
  .readFileSync(path.join(upstreamDir, "gameEngine.js"), "utf8")
  .replace(/\r\n/g, "\n");
engine = replaceOnce(
  engine,
  "let soundEnable = 1;",
  "let soundEnable = window.dennyBridge.soundEnabled ? 1 : 0;",
);
engine = replaceOnce(
  engine,
  "function EngineUpdate()\n{",
  "function EngineUpdate()\n{\n    if (!window.dennyBridge.running) return;",
);
engine = replaceOnce(
  engine,
  "    InitDebug();",
  "    // The eval-based debug console is not part of the hosted runtime.",
);
engine = replaceOnce(
  engine,
  "    UpdateDebug();",
  "    // The eval-based debug console is not part of the hosted runtime.",
);
engine = replaceOnce(
  engine,
  "    requestAnimationFrame(EngineUpdate);",
  "    window.dennyBridge.frameTick();\n    window.dennyBridge.schedule();",
);

let game = fs
  .readFileSync(path.join(upstreamDir, "game.js"), "utf8")
  .replace(/\r\n/g, "\n");
game = replaceOnce(
  game,
  '"use strict"; // strict mode',
  '"use strict"; // strict mode\n' +
    "window.addEventListener('denny-bounceback-audio', event => {\n" +
    "    const enabled = event.detail.enabled === true;\n" +
    "    soundEnable = enabled ? 1 : 0;\n" +
    "    zzfx_v = enabled ? .2 * Math.max(0, Math.min(1, Number(event.detail.volume) || 0)) : 0;\n" +
    "    if (zzfx_x) {\n" +
    "        if (enabled) void zzfx_x.resume().catch(() => {});\n" +
    "        else void zzfx_x.suspend().catch(() => {});\n" +
    "    }\n" +
    "});",
);
game = replaceOnce(
  game,
  "tileImage.onload=_=>Init();",
  "tileImage.onload=async _=>{\n" +
    "    await window.dennyBridge.storageReady;\n" +
    "    Init();\n" +
    "    window.dennyBridge.ready(mainCanvasSize.x, mainCanvasSize.y);\n" +
    "};",
);

const header =
  "// GPL-2.0-or-later. Copyright (C) 2019 Frank Force. Host adaptations are documented in source/README.txt.\n";
fs.writeFileSync(path.join(outputDir, "gameEngine.js"), header + engine);
fs.writeFileSync(path.join(outputDir, "game.js"), header + game);

const hostHtml = fs.readFileSync(path.join(outputDir, "index.html"), "utf8");
assert(!hostHtml.includes("gameEngineDebug.js"));
assert(!hostHtml.includes("unsafe-eval"));
