import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const adapterRoot = path.join(root, "vendor/packabunchas");
const sourceRoot = path.join(adapterRoot, "upstream");
const publicRoot = path.join(root, "public/vendor/packabunchas");
const licenseRoot = path.join(root, "public/licenses/packabunchas");
const provenance = JSON.parse(
  await readFile(path.join(adapterRoot, "provenance.json"), "utf8"),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");

const sourceFiles = (await readdir(sourceRoot)).sort();
assert.deepEqual(
  sourceFiles,
  Object.keys(provenance.upstream_files).sort(),
  "PACKABUNCHAS upstream inventory changed; review and update provenance.",
);
for (const filename of sourceFiles) {
  const source = await readFile(path.join(sourceRoot, filename));
  assert.equal(
    hash(source),
    provenance.upstream_files[filename],
    `Pinned PACKABUNCHAS source changed: ${filename}`,
  );
}
for (const [filename, expectedHash] of Object.entries(
  provenance.product_artwork,
)) {
  const artwork = await readFile(path.join(root, filename));
  assert.equal(
    hash(artwork),
    expectedHash,
    `PACKABUNCHAS product artwork changed: ${filename}`,
  );
}

await rm(publicRoot, { recursive: true, force: true });
await rm(licenseRoot, { recursive: true, force: true });
await mkdir(path.join(publicRoot, "source/upstream"), { recursive: true });
await mkdir(licenseRoot, { recursive: true });

for (const filename of sourceFiles) {
  const targetName = filename === "LICENSE" ? "LICENSE.txt" : `${filename}.txt`;
  await cp(
    path.join(sourceRoot, filename),
    path.join(publicRoot, "source/upstream", targetName),
  );
}
await cp(
  path.join(sourceRoot, "LICENSE"),
  path.join(licenseRoot, "LICENSE.txt"),
);
await cp(
  path.join(adapterRoot, "licenses/THIRD-PARTY-MIT.txt"),
  path.join(licenseRoot, "THIRD-PARTY-MIT.txt"),
);
await writeFile(
  path.join(licenseRoot, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>PACKABUNCHAS source and licenses · Denny Games</title>
    <meta name="description" content="PACKABUNCHAS MIT source, generated audio notices and Denny Games host adaptations.">
    <link rel="canonical" href="https://games.iamdenny.com/licenses/packabunchas/">
  </head>
  <body>
    <main>
      <h1>PACKABUNCHAS source and licenses</h1>
      <p>PACKABUNCHAS was created by Mattia Fortunati for js13kGames 2021 and is distributed under the MIT license. This version is based on pinned revision <code>${provenance.source_commit}</code>.</p>
      <p><a href="LICENSE.txt">Read the complete MIT license</a> · <a href="THIRD-PARTY-MIT.txt">Read the ZzFX and ZzFXM MIT notices</a></p>
      <p><a href="${provenance.source_repository}/tree/${provenance.source_commit}">Pinned upstream source</a> · <a href="/vendor/packabunchas/source/README.txt">Corresponding source snapshot and host notes</a> · <a href="/vendor/packabunchas/source/provenance.json">Source hashes and provenance</a></p>
      <p>The host replaces upstream localStorage calls with an allowlisted browser save bridge. The game runs in an opaque-origin frame with external requests blocked; pause stops animation frames, timers and background music. Its original game UI remains in English.</p>
      <p>한국어 안내: PACKABUNCHAS는 Mattia Fortunati가 js13kGames 2021을 위해 만든 게임이며 MIT 라이선스를 따릅니다. 고정한 원본 소스와 생성형 오디오의 ZzFX·ZzFXM 라이선스 고지, 데니 게임즈의 저장·일시정지 어댑터를 위 링크에서 확인할 수 있어요. 외부 연결이 차단된 격리 프레임에서 실행하며 원작 게임 화면은 영어로 제공돼요.</p>
    </main>
  </body>
</html>
`,
);

let game = await readFile(path.join(sourceRoot, "game.js"), "utf8");
const replacements = [
  [
    'function saveData(item, data) {\n\tlocalStorage.setItem("packabunchas_" + item, data)\n}',
    "function saveData(item, data) {\n\twindow.__packabunchasSaveData(item, data)\n}",
  ],
  [
    'function loadData(item, _default) {\n\treturn localStorage.getItem("packabunchas_" + item) || _default\n}',
    "function loadData(item, _default) {\n\treturn window.__packabunchasLoadData(item, _default)\n}",
  ],
];
for (const [before, after] of replacements) {
  assert.equal(
    game.split(before).length,
    2,
    "PACKABUNCHAS storage patch anchor changed; review the upstream update.",
  );
  game = game.replace(before, after);
}
await writeFile(path.join(publicRoot, "game.js"), game);
await cp(
  path.join(adapterRoot, "bridge.js"),
  path.join(publicRoot, "bridge.js"),
);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <meta name="robots" content="noindex,nofollow">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; media-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'">
    <title>PACKABUNCHAS · Denny Games</title>
    <link rel="canonical" href="https://games.iamdenny.com/en/games/packabunchas/">
    <style>
      html,body,.game{width:100%;height:100%;margin:0;overflow:hidden}
      .game{display:grid;place-items:center;background:#172333;touch-action:none}
      canvas{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;touch-action:none}
    </style>
  </head>
  <body>
    <main class="game"><canvas id="v" width="1080" height="1920" aria-label="PACKABUNCHAS puzzle board"></canvas></main>
    <script src="./bridge.js"></script>
    <script src="./game.js"></script>
  </body>
</html>
`;
await writeFile(path.join(publicRoot, "index.html"), html);
await writeFile(
  path.join(publicRoot, "source/README.txt"),
  [
    "PACKABUNCHAS upstream source",
    "",
    `Repository: ${provenance.source_repository}`,
    `Commit: ${provenance.source_commit}`,
    "The original MIT license is available at /licenses/packabunchas/LICENSE.txt.",
    "ZzFX and ZzFXM MIT notices are available at /licenses/packabunchas/THIRD-PARTY-MIT.txt.",
    "The Denny Games lifecycle bridge is maintained in vendor/packabunchas/ and src/games/packabunchas/.",
    "",
  ].join("\n"),
);
await writeFile(
  path.join(publicRoot, "source/provenance.json"),
  JSON.stringify(provenance, null, 2) + "\n",
);
console.log(
  `Built PACKABUNCHAS ${provenance.source_commit}: verified ${sourceFiles.length} source files.`,
);
