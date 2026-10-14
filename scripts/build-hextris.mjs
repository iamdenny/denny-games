import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const base = process.cwd();
const adapterDir = path.join(base, "vendor/hextris");
const upstreamDir = path.join(adapterDir, "upstream");
const outputDir = path.join(base, "public/vendor/hextris");
const sourceDir = path.join(outputDir, "source/upstream");
const provenance = JSON.parse(
  fs.readFileSync(path.join(adapterDir, "provenance.json"), "utf8"),
);
const hash = (content) => createHash("sha256").update(content).digest("hex");

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(absolute) : [absolute];
  });
}

function replaceOnce(content, before, after, name) {
  assert.equal(
    content.split(before).length,
    2,
    `Hextris ${name} host patch anchor changed: ${before.slice(0, 70)}`,
  );
  return content.replace(before, after);
}

const upstreamFiles = filesUnder(upstreamDir)
  .map((absolute) => [
    path.relative(upstreamDir, absolute).split(path.sep).join("/"),
    absolute,
  ])
  .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
const actualPaths = upstreamFiles.map(([relative]) => relative);
const expectedPaths = Object.keys(provenance.upstream_files).sort();
assert.deepEqual(
  actualPaths,
  expectedPaths,
  "Hextris upstream inventory changed; review and update provenance.",
);
for (const [relative, absolute] of upstreamFiles) {
  assert.equal(
    hash(fs.readFileSync(absolute)),
    provenance.upstream_files[relative],
    `Pinned Hextris source changed: ${relative}`,
  );
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });
const runtimePaths = [
  ...filesUnder(path.join(upstreamDir, "js")).map((file) =>
    path.relative(upstreamDir, file),
  ),
  "vendor/jquery.js",
  "vendor/hammer.min.js",
  "vendor/keypress.min.js",
  "vendor/js.cookie.js",
];
const correspondingPaths = [
  ...runtimePaths,
  "LICENSE.md",
  "README.md",
  "images/btn_help.svg",
  "images/btn_pause.svg",
  "images/btn_restart.svg",
  "images/btn_resume.svg",
  "images/btn_back.svg",
];
for (const relative of correspondingPaths) {
  const absolute = path.join(upstreamDir, relative);
  const publicName = relative
    .replace(/\.md$/i, ".txt")
    .replace(/\.html$/i, ".html.txt");
  const target = path.join(sourceDir, publicName);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(absolute, target);
}

for (const relative of runtimePaths) {
  const target = path.join(outputDir, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(upstreamDir, relative), target);
}
fs.mkdirSync(path.join(outputDir, "images"), { recursive: true });
for (const name of [
  "btn_help.svg",
  "btn_pause.svg",
  "btn_restart.svg",
  "btn_resume.svg",
  "btn_back.svg",
])
  fs.copyFileSync(
    path.join(upstreamDir, "images", name),
    path.join(outputDir, "images", name),
  );
fs.copyFileSync(
  path.join(base, "vendor/hextris/index.html"),
  path.join(outputDir, "index.html"),
);
fs.copyFileSync(
  path.join(base, "vendor/hextris/game.css"),
  path.join(outputDir, "game.css"),
);
fs.copyFileSync(
  path.join(base, "vendor/hextris/bridge.js"),
  path.join(outputDir, "bridge.js"),
);
fs.copyFileSync(
  path.join(base, "vendor/hextris/host-jsonfn.js"),
  path.join(outputDir, "host-jsonfn.js"),
);
fs.copyFileSync(
  path.join(adapterDir, "SOURCE-README.md"),
  path.join(outputDir, "source/README.txt"),
);
fs.copyFileSync(
  path.join(adapterDir, "provenance.json"),
  path.join(outputDir, "source/provenance.json"),
);
fs.copyFileSync(
  path.join(adapterDir, "THIRD-PARTY-NOTICES.md"),
  path.join(outputDir, "source/THIRD-PARTY-NOTICES.txt"),
);
fs.mkdirSync(path.join(base, "public/licenses/hextris"), { recursive: true });
fs.copyFileSync(
  path.join(upstreamDir, "LICENSE.md"),
  path.join(base, "public/licenses/hextris/LICENSE.txt"),
);
fs.copyFileSync(
  path.join(adapterDir, "licenses/Apache-2.0.txt"),
  path.join(base, "public/licenses/hextris/APACHE-2.0.txt"),
);
fs.copyFileSync(
  path.join(adapterDir, "licenses/MIT-DEPENDENCIES.txt"),
  path.join(base, "public/licenses/hextris/MIT-DEPENDENCIES.txt"),
);

const patch = (name, before, after) => {
  const file = path.join(outputDir, name);
  fs.writeFileSync(
    file,
    replaceOnce(fs.readFileSync(file, "utf8"), before, after, name),
  );
};

patch(
  "vendor/jquery.js",
  'for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;',
  'for(f in{submit:!0,change:!0,focusin:!0})t[f+"Bubbles"]=!0;',
);

let main = fs.readFileSync(path.join(outputDir, "js/main.js"), "utf8");
main = replaceOnce(
  main,
  "\t\t\t$.get('http://54.183.184.126/' + String(score))",
  "\t\t\t// The upstream score-reporting request is not included in this host.",
  "js/main.js",
);
main = replaceOnce(
  main,
  "(function(){\n    \tvar script = document.createElement('script');\n\tscript.src = 'http://hextris.io/a.js';\n\tdocument.head.appendChild(script);\n})()",
  "// Upstream ad script omitted by the host.",
  "js/main.js",
);
main = replaceOnce(
  main,
  "function init(b) {",
  `function restoreBlock(data) {
  data = data && typeof data === "object" ? data : {};
  var block = new Block(data.fallingLane, data.color, data.iter, data.distFromHex, data.settled);
  ["settled", "height", "fallingLane", "checked", "angle", "angularVelocity", "targetAngle", "color", "deleted", "removed", "tint", "opacity", "initializing", "ict", "iter", "initLen", "attachedLane", "distFromHex"].forEach(function(key) {
    var value = data[key];
    if (key === "color" && typeof value === "string" && value.length <= 32) block[key] = value;
    else if (typeof value === "number" && Number.isFinite(value)) block[key] = value;
  });
  return block;
}

function restoreHex(data) {
  var hex = new Hex(settings.hexWidth);
  ["playThrough", "angularVelocity", "position", "dy", "dt", "sides", "angle", "targetAngle", "sideLength", "x", "y", "ct", "lastCombo", "comboTime"].forEach(function(key) {
    if (typeof data[key] === "number" && Number.isFinite(data[key])) hex[key] = data[key];
  });
  ["fillColor", "tempColor"].forEach(function(key) {
    if (Array.isArray(data[key]) && data[key].length === 3 && data[key].every(function(value) { return Number.isFinite(value); })) hex[key] = data[key];
  });
  ["lastColorScored", "strokeColor"].forEach(function(key) {
    if (typeof data[key] === "string" && data[key].length <= 32) hex[key] = data[key];
  });
  if (Array.isArray(data.shakes)) {
    hex.shakes = data.shakes.slice(0, 100).filter(function(shake) {
      return shake && Number.isFinite(shake.lane) && Number.isFinite(shake.magnitude);
    }).map(function(shake) { return { lane: shake.lane, magnitude: shake.magnitude }; });
  }
  if (Array.isArray(data.blocks) && data.blocks.length === 6) {
    hex.blocks = data.blocks.map(function(side) {
      return Array.isArray(side) ? side.slice(0, 100).map(restoreBlock) : [];
    });
  }
  return hex;
}

function init(b) {`,
  "js/main.js",
);
main = replaceOnce(
  main,
  "\tMainHex = saveState.hex || new Hex(settings.hexWidth);",
  "\tMainHex = saveState.hex ? restoreHex(saveState.hex) : new Hex(settings.hexWidth);",
  "js/main.js",
);
main = replaceOnce(
  main,
  "\tscore = saveState.score || 0;",
  "\tscore = Number.isFinite(saveState.score) ? Math.max(0, saveState.score) : 0;",
  "js/main.js",
);
main = replaceOnce(
  main,
  "\tif (saveState.blocks) {",
  "\tif (Array.isArray(saveState.blocks)) {\n\t\tsaveState.blocks = saveState.blocks.slice(0, 300);",
  "js/main.js",
);
main = replaceOnce(
  main,
  "\t\tsaveState.blocks.map(function(o) {\n\t\t\tif (rgbToHex[o.color]) {",
  '\t\tsaveState.blocks.map(function(o) {\n\t\t\tif (o && typeof o === "object" && rgbToHex[o.color]) {',
  "js/main.js",
);
main = replaceOnce(
  main,
  "\t\t\tblocks.push(block);",
  "\t\t\tblocks.push(restoreBlock(block));",
  "js/main.js",
);
main = replaceOnce(
  main,
  "\twaveone = saveState.wavegen || new waveGen(MainHex);",
  `\twaveone = new waveGen(MainHex);
\tif (saveState.wavegen && typeof saveState.wavegen === "object") {
\t\t["lastGen", "last", "nextGen", "start", "ct", "difficulty", "dt"].forEach(function(key) {
\t\t\tif (typeof saveState.wavegen[key] === "number" && Number.isFinite(saveState.wavegen[key])) waveone[key] = saveState.wavegen[key];
\t\t});
\t\tvar generation = saveState.wavegen.currentFunction;
\t\tvar generationName = generation && generation.__dennyHextrisFunction;
\t\tvar generationMethods = ["randomGeneration", "circleGeneration", "halfCircleGeneration", "crosswiseGeneration", "spiralGeneration", "doubleGeneration"];
\t\tif (generationMethods.indexOf(generationName) >= 0) waveone.currentFunction = waveone[generationName];
\t\twaveone.hex = MainHex;
\t}`,
  "js/main.js",
);
fs.writeFileSync(path.join(outputDir, "js/main.js"), main);
const helpStart = "function showHelp() {";
const helpEnd = "\n// Upstream ad script omitted by the host.";
main = fs.readFileSync(path.join(outputDir, "js/main.js"), "utf8");
const helpAt = main.indexOf(helpStart);
const endAt = main.indexOf(helpEnd, helpAt);
assert(
  helpAt >= 0 && endAt > helpAt,
  "Hextris help host patch anchor changed.",
);
fs.writeFileSync(
  path.join(outputDir, "js/main.js"),
  main.slice(0, helpAt) +
    `function showHelp() {\n  $("#inst_main_body").text(window.dennyHextris.locale === "ko" ? "같은 색 블록 3개 이상을 맞춰 지우세요. 방향 버튼으로 육각형을 돌립니다." : "Match at least three blocks of the same color. Rotate the hexagon with the direction buttons.");\n  if (gameState === 1) pause();\n  $("#helpScreen").fadeToggle(150, "linear");\n}\n` +
    main.slice(endAt),
);
patch(
  "js/initialization.js",
  `\t\t(function(i, s, o, g, r, a, m) {\n\t\t\ti['GoogleAnalyticsObject'] = r;\n\t\t\ti[r] = i[r] || function() {\n\t\t\t\t(i[r].q = i[r].q || []).push(arguments)\n\t\t\t}, i[r].l = 1 * new Date();\n\t\t\ta = s.createElement(o), m = s.getElementsByTagName(o)[0];\n\t\t\ta.async = 1;\n\t\t\ta.src = g;\n\t\t\tm.parentNode.insertBefore(a, m)\n\t\t})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');\n\t\tga('create', 'UA-51272720-1', 'teamsnowman.github.io');\n\t\tga('send', 'pageview');`,
  "\t\t// Upstream analytics omitted by the host.",
);
patch(
  "js/initialization.js",
  `\t\twindow.onblur = function(e) {
\t\t\tif (gameState == 1) {
\t\t\t\tpause();
\t\t\t}
\t\t};`,
  "\t\t// The parent player owns focus and pause behavior.",
);

let view = fs.readFileSync(path.join(outputDir, "js/view.js"), "utf8");
view = replaceOnce(
  view,
  "\t\t'paused': \"<div class='centeredHeader unselectable'>Game Paused</div>\",",
  `\t\t'paused': "<div class='centeredHeader unselectable'>" + (window.dennyHextris.locale === "ko" ? "잠시 멈춤" : "Paused") + "</div>",`,
  "js/view.js",
);
view = replaceOnce(
  view,
  "\t\t'pausedAndroid': \"<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'><a href = 'https://play.google.com/store/apps/details?id=com.hextris.hextrisadfree' target='_blank'Want to support the developers? Don't like ads? Tap for Hextris ad-free!</a></div>\",",
  `\t\t'pausedAndroid': "<div class='centeredHeader unselectable'>" + (window.dennyHextris.locale === "ko" ? "잠시 멈춤" : "Paused") + "</div>",`,
  "js/view.js",
);
view = replaceOnce(
  view,
  "\t\t'pausediOS': \"<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'><a href = 'https://itunes.apple.com/us/app/hextris-ad-free/id912895524?mt=8' target='_blank'>Want to support the developers? Don't like ads? Tap for Hextris ad-free!</a></div>\",",
  `\t\t'pausediOS': "<div class='centeredHeader unselectable'>" + (window.dennyHextris.locale === "ko" ? "잠시 멈춤" : "Paused") + "</div>",`,
  "js/view.js",
);
view = replaceOnce(
  view,
  "\t\t'pausedOther': \"<div class='centeredHeader unselectable'>Game Paused</div><div class='unselectable centeredSubHeader' style='margin-top:10px;position:absolute;left:50%;margin-left:-190px;max-width:380px;font-size:18px;'><a href = 'http://hextris.github.io/' target='_blank'>Want to support the developers? Click here to buy one of the ad-free mobile versions!</a></div>\",",
  `\t\t'pausedOther': "<div class='centeredHeader unselectable'>" + (window.dennyHextris.locale === "ko" ? "잠시 멈춤" : "Paused") + "</div>",`,
  "js/view.js",
);
fs.writeFileSync(path.join(outputDir, "js/view.js"), view);

const runtimeFiles = filesUnder(outputDir).filter(
  (file) => !file.includes(`${path.sep}source${path.sep}`),
);
const executable = runtimeFiles
  .filter((file) => /\.(?:js|html)$/.test(file))
  .map((file) => fs.readFileSync(file, "utf8"));
assert(
  executable.every(
    (content) =>
      !/<(?:script|iframe|img)\b[^>]*\bsrc=["']https?:\/\//i.test(content) &&
      !/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(content) &&
      !/\beval\s*\(|\bnew\s+Function\s*\(/.test(content),
  ),
  "Hextris runtime contains a dynamic code or network API.",
);
console.log(
  `Hextris ${provenance.source_commit}: verified ${upstreamFiles.length} upstream files; emitted ${runtimeFiles.length} runtime/source files.`,
);
