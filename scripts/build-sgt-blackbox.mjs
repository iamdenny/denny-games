import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Script } from "node:vm";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const adapterRoot = path.join(root, "vendor/sgt-blackbox");
const sourceRoot = path.join(adapterRoot, "upstream");
const publicRoot = path.join(root, "public/vendor/sgt-blackbox");
const licenseRoot = path.join(root, "public/licenses/sgt-blackbox");
const provenance = JSON.parse(
  await readFile(path.join(adapterRoot, "provenance.json"), "utf8"),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");

for (const [filename, expected] of Object.entries(
  provenance.vendored_source_hashes,
)) {
  const bytes = await readFile(path.join(sourceRoot, filename));
  assert.equal(
    hash(bytes),
    expected,
    `Black Box upstream artifact changed: ${filename}`,
  );
}

const archive = await readFile(path.join(root, provenance.source_archive));
assert.equal(
  hash(archive),
  provenance.source_archive_sha256,
  "Black Box source archive hash changed.",
);
const wasm = await readFile(path.join(sourceRoot, "blackbox.wasm"));
let runtime = await readFile(path.join(sourceRoot, "blackbox.js"), "utf8");
const bridge = await readFile(path.join(adapterRoot, "bridge.js"), "utf8");
assert.equal(
  hash(bridge),
  provenance.host_adapter.bridge_sha256,
  "Black Box host bridge changed; review and update provenance.",
);
assert.doesNotMatch(
  bridge,
  /<\/script/i,
  "Inline bridge contains a script terminator.",
);

function replaceOnce(source, before, after, description) {
  assert.equal(
    source.split(before).length,
    2,
    `Black Box patch anchor changed: ${description}`,
  );
  return source.replace(before, () => after);
}

const wasmBase64 = wasm.toString("base64");
runtime = replaceOnce(
  runtime,
  "var Module = {\n  'preRun': function () {",
  `var Module = {\n  'wasmBinary': Uint8Array.from(atob('${wasmBase64}'), (byte) => byte.charCodeAt(0)),\n  'postRun': function () {\n    const canvas = document.getElementById('puzzlecanvas');\n    window.__sgtBlackBoxReady(canvas.width, canvas.height);\n  },\n  'preRun': function () {`,
  "Module WASM and readiness hooks",
);
runtime = replaceOnce(
  runtime,
  'load_prefs_from_string(localStorage.getItem(location.pathname + " preferences"));',
  "load_prefs_from_string(window.__sgtBlackBoxPrefs);",
  "preference read",
);
runtime = replaceOnce(
  runtime,
  'localStorage.setItem(location.pathname + " preferences", prefsdata);',
  "window.__sgtBlackBoxPrefs = prefsdata;",
  "preference write",
);
runtime = runtime.replace(/[\t ]+$/gm, "");
runtime = runtime.replace(/<\/script/gi, "<\\/script");
assert.doesNotMatch(
  runtime,
  /<\/script/i,
  "Inline runtime contains a script terminator.",
);
new Script(bridge, { filename: "sgt-blackbox-bridge.js" });
new Script(runtime, { filename: "sgt-blackbox-runtime.js" });

const frameCsp =
  "default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; worker-src 'none'; media-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'";
let html = await readFile(path.join(sourceRoot, "blackbox.html"), "utf8");
html = replaceOnce(html, "<html>", '<html lang="en">', "document language");
html = replaceOnce(
  html,
  '<meta http-equiv="Content-Type" content="text/html; charset=ASCII" />',
  `<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="robots" content="noindex,nofollow">\n<link rel="canonical" href="https://games.iamdenny.com/en/games/sgt-blackbox/">\n<meta http-equiv="Content-Security-Policy" content="${frameCsp}">`,
  "document metadata",
);
html = replaceOnce(
  html,
  "<title>Black Box, from Simon Tatham's Portable Puzzle Collection</title>",
  "<title>Black Box · Denny Games</title>",
  "document title",
);
html = replaceOnce(
  html,
  "</ul></form>",
  '<li class="denny-mark-toggle"><button type="button" id="denny-mark" aria-pressed="false">Mark known squares</button></li></ul></form>',
  "touch mark control",
);
html = replaceOnce(
  html,
  "</style>\n</head>\n<body>\n<h1 align=center>Black Box</h1>",
  `<style id="denny-blackbox-layout">\nhtml,body{width:100%;height:100%;margin:0;overflow:hidden;background:#14262b;color:#f5f1e7}\nbody>h1,body>h2,body>hr,body>p{display:none!important}\n#puzzle{position:fixed;inset:0;box-sizing:border-box;width:100vw;height:100vh;height:100dvh;display:flex;flex-direction:column;overflow:hidden;margin:0;padding:6px;background:#14262b;color:#f5f1e7}\n#gamemenu{flex:0 0 auto;max-height:24%;overflow:auto;margin:0 0 4px;font:700 12px/1.25 system-ui,sans-serif;color:#f5f1e7}\n#gamemenu li>*{min-height:44px;box-sizing:border-box;padding:8px 10px}\n#gamemenu :disabled{color:rgba(245,241,231,.45)}\n#gamemenu ul ul{background:#24383f;color:#f5f1e7}\n#gamemenu button:focus-visible,#gamemenu [tabindex]:focus-visible{outline:3px solid #d9f05c;outline-offset:2px}\n#gamemenu .denny-mark-toggle>button{border-radius:999px;background:#d9f05c;color:#17282d;font:700 12px/1.2 system-ui,sans-serif}\n#gamemenu .denny-mark-toggle>button[aria-pressed=true]{background:#1d5960;color:#fff}\n@media(pointer:fine){#gamemenu .denny-mark-toggle{display:none!important}}\n#resizable{position:relative;box-sizing:border-box;flex:0 1 auto;width:min(calc(100vw - 16px),calc(100dvh - 116px))!important;height:min(calc(100vw - 16px),calc(100dvh - 116px))!important;min-width:0;min-height:0;margin:auto;overflow:hidden}\n#puzzlecanvas{display:block;width:100%!important;height:100%!important;max-width:100%;max-height:100%;object-fit:contain;touch-action:none}\n#statusbar{position:absolute;left:50%;bottom:-1.45em;transform:translateX(-50%);box-sizing:border-box;width:min(100%,32rem);color:#f5f1e7;background:transparent;font:12px/1.2 system-ui,sans-serif;text-align:center}\n#resizehandle{display:none!important}\n#puzzle>p{display:none!important}\n#apology{position:fixed;inset:0;z-index:100;display:grid;place-content:center;box-sizing:border-box;overflow:auto;padding:1rem;background:#14262b;color:#f5f1e7;text-align:center}\n</style>\n</head>\n<body>`,
  "responsive isolated layout",
);
html = replaceOnce(
  html,
  '<script defer type="text/javascript" src="blackbox.js"></script>',
  "",
  "remove upstream external script tag",
);
html = replaceOnce(
  html,
  "</body>\n</html>",
  `<script>${bridge}</script>\n<script>${runtime}</script>\n</body>\n</html>`,
  "run checked scripts after the document body",
);

await rm(publicRoot, { recursive: true, force: true });
await rm(licenseRoot, { recursive: true, force: true });
await mkdir(path.join(publicRoot, "source/upstream"), { recursive: true });
await mkdir(path.join(publicRoot, "source/runtime"), { recursive: true });
await mkdir(licenseRoot, { recursive: true });
await writeFile(path.join(publicRoot, "index.html"), html);
await writeFile(
  path.join(publicRoot, "source/README.txt"),
  [
    "Simon Tatham Black Box source and runtime",
    "",
    `Source repository: ${provenance.source_repository}`,
    `Source commit: ${provenance.source_commit}`,
    `Official browser build: ${provenance.official_runtime_page}`,
    "The original MIT license is available at /licenses/sgt-blackbox/LICENCE.txt.",
    "The upstream source archive, official HTML, JavaScript and WebAssembly are retained under this directory.",
    "The local bridge and its source adaptations are described in provenance.json.",
    "Puzzle progress is not saved; upstream preferences last only while the frame remains loaded.",
    "The upstream in-game menu and status text remain in English. Denny Games host instructions and touch mark control are bilingual.",
    "",
    "사이먼 태덤 Black Box 소스와 런타임",
    "",
    `원본 저장소: ${provenance.source_repository}`,
    `고정한 소스 커밋: ${provenance.source_commit}`,
    `공식 브라우저 빌드: ${provenance.official_runtime_page}`,
    "원본 MIT 라이선스는 /licenses/sgt-blackbox/LICENCE.txt 에서 확인할 수 있습니다.",
    "원본 소스 아카이브와 공식 HTML, JavaScript, WebAssembly 파일을 이 디렉터리에 보관합니다.",
    "로컬 브리지와 적용한 변경 사항은 provenance.json 에 기록했습니다.",
    "퍼즐 진행은 저장하지 않습니다. 원본 설정은 프레임이 열려 있는 동안에만 유지됩니다.",
    "게임 안 메뉴와 상태 문구는 영어로 제공됩니다. 데니 게임즈의 안내와 터치 표시 조작은 한국어와 영어를 제공합니다.",
    "",
  ].join("\n"),
);
await cp(
  path.join(sourceRoot, "puzzles-20260923.616da16.tar.gz"),
  path.join(publicRoot, "source/upstream/puzzles-20260923.616da16.tar.gz"),
);
await cp(
  path.join(sourceRoot, "blackbox.html"),
  path.join(publicRoot, "source/upstream/blackbox.html.txt"),
);
await cp(
  path.join(sourceRoot, "blackbox.js"),
  path.join(publicRoot, "source/runtime/blackbox.js.txt"),
);
await cp(
  path.join(sourceRoot, "blackbox.wasm"),
  path.join(publicRoot, "source/runtime/blackbox.wasm"),
);
await cp(
  path.join(adapterRoot, "bridge.js"),
  path.join(publicRoot, "source/runtime/bridge.js.txt"),
);
await writeFile(
  path.join(publicRoot, "source/provenance.json"),
  `${JSON.stringify(provenance, null, 2)}\n`,
);
await cp(
  path.join(sourceRoot, "LICENCE"),
  path.join(licenseRoot, "LICENCE.txt"),
);
await writeFile(
  path.join(licenseRoot, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="Black Box upstream source, official WebAssembly artifacts, MIT license and local host adaptations.">
    <link rel="canonical" href="https://games.iamdenny.com/licenses/sgt-blackbox/">
    <title>Black Box source and license · Denny Games</title>
  </head>
  <body>
    <main>
      <h1>Black Box source and license</h1>
      <p>Black Box is part of Simon Tatham’s Portable Puzzle Collection. The source snapshot is ${provenance.source_version}, commit <code>${provenance.source_commit}</code>, distributed under the MIT license.</p>
      <p><a href="LICENCE.txt">Read the upstream MIT license</a> · <a href="/vendor/sgt-blackbox/source/upstream/puzzles-20260923.616da16.tar.gz">Download the pinned source archive</a></p>
      <p><a href="${provenance.source_repository}/commit/${provenance.source_commit}">Pinned upstream source commit</a> · <a href="${provenance.official_runtime_page}">Official Black Box browser build</a> · <a href="/vendor/sgt-blackbox/source/provenance.json">Source and runtime hashes</a></p>
      <p>The official HTML, JavaScript and WebAssembly were checked by SHA-256 and are inlined into a local opaque-origin frame. The local adapter injects the checked WebAssembly bytes to block runtime fetches, keeps upstream preferences in frame memory, gates input and animation while paused, and maps touch taps to the original right-click marking action. Puzzle progress is not saved.</p>
      <p>한국어 안내: Black Box는 Simon Tatham의 Portable Puzzle Collection에 포함된 게임입니다. 소스 스냅샷은 ${provenance.source_version} (${provenance.source_commit})이며 MIT 라이선스를 따릅니다.</p>
      <p><a href="LICENCE.txt">원본 MIT 라이선스</a> · <a href="/vendor/sgt-blackbox/source/upstream/puzzles-20260923.616da16.tar.gz">고정된 원본 소스 받기</a></p>
      <p><a href="${provenance.source_repository}/commit/${provenance.source_commit}">고정한 원본 커밋</a> · <a href="${provenance.official_runtime_page}">공식 Black Box 브라우저 빌드</a> · <a href="/vendor/sgt-blackbox/source/provenance.json">소스와 런타임 해시</a></p>
      <p>공식 HTML, JavaScript, WebAssembly를 SHA-256으로 확인한 뒤 외부 연결이 차단된 로컬 격리 프레임에 포함했습니다. 확인한 WebAssembly 바이트를 직접 주입하고, 게임 설정은 프레임 메모리에만 유지하며, 일시정지 중 입력과 애니메이션을 멈춥니다. 터치 모드에서는 누른 칸을 원작의 우클릭 표시 동작으로 바꿀 수 있습니다. 퍼즐 진행은 저장하지 않습니다.</p>
    </main>
  </body>
</html>
`,
);

console.log(
  `Built Black Box ${provenance.source_commit}: verified ${Object.keys(provenance.vendored_source_hashes).length} upstream artifacts.`,
);
