import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Script } from "node:vm";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const adapterRoot = path.join(root, "vendor/chogan-eightball");
const upstreamRoot = path.join(adapterRoot, "upstream");
const adapterSource = path.join(adapterRoot, "adapter");
const publicRoot = path.join(root, "public/vendor/chogan-eightball");
const licenseRoot = path.join(root, "public/licenses/chogan-eightball");
const provenance = JSON.parse(
  await readFile(path.join(adapterRoot, "provenance.json"), "utf8"),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const posix = (value) => value.split(path.sep).join("/");

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(absolute)));
    else files.push(absolute);
  }
  return files;
}

function replaceOnce(source, before, after, description) {
  assert.equal(
    source.split(before).length,
    2,
    `Chogan ${description} patch anchor changed.`,
  );
  return source.replace(before, () => after);
}

function replaceCount(source, before, after, expected, description) {
  const count = source.split(before).length - 1;
  assert.equal(
    count,
    expected,
    `Chogan ${description} patch anchor count changed: ${count}.`,
  );
  return source.split(before).join(after);
}

const upstreamFiles = (await filesUnder(upstreamRoot))
  .map((absolute) => [posix(path.relative(upstreamRoot, absolute)), absolute])
  .sort(([a], [b]) => a.localeCompare(b));
assert.deepEqual(
  upstreamFiles.map(([relative]) => relative),
  Object.keys(provenance.upstream_files).sort(),
  "Chogan upstream file inventory changed; review the source snapshot.",
);
for (const [relative, absolute] of upstreamFiles) {
  assert.equal(
    hash(await readFile(absolute)),
    provenance.upstream_files[relative],
    `Pinned Chogan upstream source changed: ${relative}`,
  );
}

for (const [relative, expected] of Object.entries(
  provenance.host_adapter.files,
)) {
  assert.equal(
    hash(await readFile(path.join(root, relative))),
    expected,
    `Reviewed Chogan adapter changed: ${relative}`,
  );
}
for (const [relative, expected] of Object.entries(provenance.product_artwork)) {
  assert.equal(
    hash(await readFile(path.join(root, relative))),
    expected,
    `Reviewed Chogan product artwork changed: ${relative}`,
  );
}

const sourceHtml = await readFile(
  path.join(upstreamRoot, "games/eightball/index.html"),
  "utf8",
);
const inlineScripts = [...sourceHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(
  inlineScripts.length,
  2,
  "8-Ball Pool inline script inventory changed.",
);
let engineScript = inlineScripts[0][1].trim();
let gameScript = inlineScripts[1][1].trim();
let html = sourceHtml.replace(inlineScripts[0][0], "");
html = html.replace(inlineScripts[1][0], "");

gameScript = replaceOnce(
  gameScript,
  "  var C = window.Chogan, el = C.el;\n",
  "  var C = window.Chogan, el = C.el;\n" +
    "  var requestedLocale = new URLSearchParams(location.search).get('locale');\n" +
    "  if (requestedLocale === 'en' || requestedLocale === 'ko') C.setLang(requestedLocale);\n",
  "requested locale",
);
gameScript = replaceOnce(
  gameScript,
  "    name: { fa: 'بیلیارد', en: '8-Ball Pool', zh: '八球', de: '8-Ball', es: 'Bola 8' },",
  "    name: { fa: 'بیلیارد', en: '8-Ball Pool', ko: '8볼 풀', zh: '八球', de: '8-Ball', es: 'Bola 8' },",
  "localized game name",
);
gameScript = replaceOnce(
  gameScript,
  "      zh: {\n        vsAi: '对战电脑'",
  `      ko: {
        vsAi: '컴퓨터와 대결', twoPlayers: '두 명이 함께', mode: '모드', level: '난이도', rival: '상대', player2: '두 번째 플레이어',
        solids: '단색 공', stripes: '줄무늬 공', openTable: '그룹 미정', groupFor: '{n}의 그룹: {g}',
        yourTurn: '내 차례', turnOf: '{n} 차례', thinking: '상대가 생각 중…',
        breakHint: '초구: 흰 공을 끌어 삼각형 공을 맞히세요', inHand: '흰 공을 원하는 자리에 놓고 조준하세요',
        foulScratch: '파울: 흰 공이 포켓에 들어갔어요', foulNoHit: '파울: 공을 맞히지 못했어요', foulWrong: '파울: 먼저 맞힌 공이 내 그룹 공이 아니에요',
        respot: '초구에 들어간 8번 공을 다시 놓았어요', potMore: '좋아요! 한 번 더 쳐요',
        eightEarly: '8번 공을 너무 일찍 넣었어요', eightFoul: '파울과 함께 8번 공이 들어갔어요', eightWin: '8번 공을 넣어 승리했어요',
        playerWon: '{n} 승리', power: '힘 조절', pull: '당겼다 놓기', fineLeft: '왼쪽으로 조금 조준', fineRight: '오른쪽으로 조금 조준',
        shots: '샷', fouls: '파울', ballsLeft: '{n}개 남음', potted: '넣은 공', newFrame: '새 게임', startFrame: '시작',
        dailyEb: '오늘의 테이블', dailyGoal: '가능한 적은 샷으로 모든 공을 넣으세요', outOfShots: '샷을 모두 썼어요', cleared: '테이블을 비웠어요!',
        tableLabel: '당구대', resetWarn: '진행 중인 게임을 끝낼까요?',
        rules: '먼저 단색 공(1~7)이나 줄무늬 공(9~15)을 넣은 사람이 해당 그룹을 맡고 상대는 다른 그룹을 맡아요. 내 공을 넣으면 계속 칠 수 있어요. 매 샷마다 내 그룹의 공을 먼저 맞혀야 해요. 흰 공이 들어가거나, 아무 공도 맞히지 못하거나, 상대 그룹 공을 먼저 맞히면 파울이에요. 상대는 흰 공을 원하는 곳에 놓을 수 있어요. 내 그룹 공을 모두 넣은 다음 8번 공을 넣으면 이겨요. 8번 공을 일찍 넣거나 파울과 함께 넣으면 져요. 초구에 들어간 8번 공은 다시 놓여요.',
        keyboard: '키보드', kbAim: '조준 방향 돌리기', kbFine: '조준 미세 조정', kbPower: '샷 힘', kbShoot: '샷하기', kbPlace: '흰 공 옮기기 (공 배치 차례)',
        tutTitle1: '조준하고 샷하기', tutText1: '당구대에서 드래그해 조준선을 돌리세요. 아래 힘 조절 막대를 당겼다 놓으면 샷을 해요. 흰 공을 직접 뒤로 당겼다 놓아도 돼요.',
        tutTitle2: '단색 공 또는 줄무늬 공', tutText2: '처음 넣은 공이 내 그룹을 정해요. 내 공을 넣으면 계속 칠 수 있어요.',
        tutTitle3: '파울과 8번 공', tutText3: '흰 공을 넣거나 내 공을 먼저 맞히지 못하면 상대에게 공 배치 차례가 넘어가요. 8번 공은 마지막에 넣어야 해요.',
      },
      zh: {
        vsAi: '对战电脑'`,
  "Korean in-game strings",
);
gameScript = replaceOnce(
  gameScript,
  "  var ai = null, aiAnim = null, lastHitSfx = 0;\n",
  `  var ai = null, aiAnim = null, lastHitSfx = 0;
  window.DennyGameBridge.actionHandler = function (action) {
    if (!F || !humanTurn()) return false;
    var keyMap = F.inHand
      ? { up: ['w', 'KeyW'], down: ['s', 'KeyS'], left: ['a', 'KeyA'], right: ['d', 'KeyD'] }
      : { up: ['ArrowUp', 'ArrowUp'], down: ['ArrowDown', 'ArrowDown'], left: ['ArrowLeft', 'ArrowLeft'], right: ['ArrowRight', 'ArrowRight'] };
    var key = action === 'confirm' ? [' ', 'Space'] : keyMap[action];
    if (!key) return false;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: key[0], code: key[1], bubbles: true, cancelable: true }));
    return true;
  };
`,
  "Denny Games controller action bridge",
);
gameScript = replaceOnce(
  gameScript,
  "    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { btn.addEventListener(t, stop); });\n",
  "    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { btn.addEventListener(t, stop); });\n" +
    "    window.addEventListener('denny-pause', stop);\n",
  "fine aim pause cancellation",
);
gameScript = replaceCount(
  gameScript,
  "    ctx.tutorialIfNew(TUT);\n",
  "    // The bilingual Denny Games guide replaces the upstream first-run tutorial.\n",
  2,
  "first-run tutorial",
);
gameScript = replaceOnce(
  gameScript,
  "      shareText: 'چوگان · بیلیارد' + (daily ? ('\\nروزانه ' + daily + '\\n' + C.num(F.shots) + ' ' + C.t('shots')) : '\\n' + title),\n",
  "",
  "third-party share link",
);
gameScript = replaceOnce(
  gameScript,
  "won: won, title: title, timeMs: Date.now() - startedAt, coins: coins, points: points, lines: lines,",
  "won: won, title: title, timeMs: Date.now() - startedAt, coins: 0, points: 0, lines: lines,",
  "in-game currency rewards",
);
gameScript = replaceOnce(
  gameScript,
  "  window.addEventListener('resize', function () { if (F) render(); });",
  "  window.addEventListener('resize', function () { if (F) render(); window.DennyGameBridge.ready(window.innerWidth, window.innerHeight); });",
  "responsive frame size announcement",
);
gameScript = replaceOnce(
  gameScript,
  "  setTimeout(function () { if (F) render(); }, 40);",
  "  setTimeout(function () { if (F) render(); window.DennyGameBridge.ready(window.innerWidth, window.innerHeight); }, 40);",
  "frame readiness announcement",
);

const csp =
  "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; media-src 'none'; worker-src 'none'; child-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'; manifest-src 'none'";
html = replaceOnce(
  html,
  '<html lang="fa" dir="rtl">',
  '<html lang="en" dir="ltr">',
  "document language",
);
html = replaceOnce(
  html,
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">',
  `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<link rel="canonical" href="https://games.iamdenny.com/ko/games/chogan-eightball/">
<meta http-equiv="Content-Security-Policy" content="${csp}">`,
  "isolated frame policy",
);
html = replaceOnce(
  html,
  "<title>بیلیارد — چوگان</title>",
  "<title>8-Ball Pool · Denny Games</title>",
  "document title",
);
const inlineStyle = html.match(/<style>([\s\S]*?)<\/style>/);
assert.ok(inlineStyle, "Upstream game stylesheet was not found.");
html = html.replace(inlineStyle[0], "");
html = replaceOnce(
  html,
  '<link rel="stylesheet" href="../../lib/chogan.css">',
  '<link rel="stylesheet" href="../../lib/chogan.css">\n' +
    '<link rel="stylesheet" href="../../lib/eightball.css">',
  "local stylesheet links",
);
html = replaceOnce(
  html,
  '<script src="../../version.js"></script>',
  '<script src="../../bridge.js"></script>\n<script src="../../version.js"></script>',
  "local lifecycle bridge",
);
html = replaceOnce(
  html,
  '<script src="../../lib/cue.js"></script>',
  '<script src="../../lib/cue.js"></script>\n<script src="../../game-engine.js"></script>\n<script src="../../game.js"></script>',
  "local game scripts",
);
assert.doesNotMatch(
  html,
  /<script>\s*[\s\S]*?<\/script>/,
  "Inline scripts must be externalized.",
);
assert.doesNotMatch(
  html.replace(/<link rel="canonical" href="[^"]*">/, ""),
  /https?:\/\//,
  "The game document must not load or link to remote resources.",
);

let chogan = await readFile(path.join(upstreamRoot, "lib/chogan.js"), "utf8");
chogan = replaceOnce(
  chogan,
  "      if (/^fa\\b|^fa-/.test(l)) return 'fa';\n",
  "      if (/^ko\\b|^ko-/.test(l)) return 'ko';\n      if (/^fa\\b|^fa-/.test(l)) return 'fa';\n",
  "Korean device language",
);
chogan = replaceOnce(
  chogan,
  "        return !!(document.fullscreenEnabled && e.requestFullscreen);",
  "        return false;",
  "disable iframe fullscreen exit",
);
chogan = replaceOnce(
  chogan,
  "    { code: 'en', label: 'English',  dir: 'ltr', tag: 'en',      date: 'en-US' },\n",
  "    { code: 'en', label: 'English',  dir: 'ltr', tag: 'en',      date: 'en-US' },\n" +
    "    { code: 'ko', label: '한국어', dir: 'ltr', tag: 'ko-KR', date: 'ko-KR' },\n",
  "Korean locale registration",
);
chogan = replaceOnce(
  chogan,
  "      tutorial: 'How to play', gotIt: 'Got it', stars: 'stars'\n    },\n    zh: {",
  `      tutorial: 'How to play', gotIt: 'Got it', stars: 'stars'
    },
    ko: {
      appName: 'Chogan', home: '홈', daily: '오늘', league: '리그', achievements: '기록', profile: '프로필', settings: '설정',
      play: '플레이', resume: '계속하기', newGame: '새 게임', again: '다시 하기',
      menu: '메뉴', back: '뒤로', close: '닫기', cancel: '취소', result: '결과', seeBoard: '당구대 보기',
      confirm: '확인', done: '완료', next: '다음', skip: '건너뛰기', start: '시작', pause: '일시정지', resumeGame: '계속하기', restart: '다시 시작',
      quit: '메뉴로 나가기', help: '도움말', share: '공유', copied: '복사했어요',
      best: '최고 기록', score: '점수', time: '시간', coins: '코인', won: '승리', lost: '패배', finished: '게임 종료',
      points: '점수', weeklyPoints: '주간 점수', you: '나',
      language: '언어', theme: '테마', themeAuto: '자동', themeLight: '밝게', themeDark: '어둡게',
      sfx: '효과음', music: '음악', haptics: '진동', resetWarn: '진행 중인 게임을 끝낼까요?',
      keyboard: '키보드', difficulty: '난이도', fullscreen: '전체 화면', exitFullscreen: '전체 화면 나가기',
      easy: '쉬움', medium: '보통', hard: '어려움', expert: '전문가', tutorial: '게임 방법', gotIt: '알겠어요', stars: '별',
      newFrame: '새 게임', startFrame: '시작', mode: '모드', level: '난이도', vsAi: '컴퓨터와 대결', twoPlayers: '두 명이 함께',
    },
    zh: {`,
  "Korean shared interface strings",
);
chogan = replaceOnce(
  chogan,
  "  var AC = null, master = null, sfxBus = null, musBus = null, audioReady = false;",
  "  var AC = null, master = null, sfxBus = null, musBus = null, audioReady = false, sfxVolume = 0.5;",
  "sound volume state",
);
chogan = replaceOnce(
  chogan,
  "    sfxBus = AC.createGain(); sfxBus.gain.value = 0.5; sfxBus.connect(master);",
  "    sfxBus = AC.createGain(); sfxBus.gain.value = sfxVolume; sfxBus.connect(master);",
  "sound volume initialization",
);
chogan = replaceOnce(
  chogan,
  "    setSfx: function (on) { state.settings.sfx = !!on; saveSettings(); },\n",
  "    setSfx: function (on) { state.settings.sfx = !!on; saveSettings(); },\n" +
    "    setVolume: function (value) { sfxVolume = Math.max(0, Math.min(1, Number(value) || 0)); if (sfxBus) sfxBus.gain.setTargetAtTime(sfxVolume, now(), 0.03); },\n",
  "host volume control",
);

const bridge = await readFile(path.join(adapterSource, "bridge.js"), "utf8");
const adapterCss = await readFile(
  path.join(adapterSource, "eightball.css"),
  "utf8",
);
new Script(bridge, { filename: "chogan-eightball-bridge.js" });
new Script(engineScript, { filename: "chogan-eightball-engine.js" });
new Script(gameScript, { filename: "chogan-eightball-game.js" });
new Script(chogan, { filename: "chogan.js" });

await rm(publicRoot, { recursive: true, force: true });
await rm(licenseRoot, { recursive: true, force: true });
await mkdir(path.join(publicRoot, "games/eightball"), { recursive: true });
await mkdir(path.join(publicRoot, "lib"), { recursive: true });
await mkdir(path.join(publicRoot, "fonts"), { recursive: true });
await mkdir(path.join(publicRoot, "source/upstream"), { recursive: true });
await mkdir(path.join(publicRoot, "source/adapter"), { recursive: true });
await mkdir(path.join(licenseRoot), { recursive: true });

for (const [relative, absolute] of upstreamFiles) {
  if (
    relative === "games/eightball/index.html" ||
    relative === "metadata/README.md"
  )
    continue;
  const source = await readFile(absolute);
  if (relative === "lib/chogan.js") {
    await writeFile(path.join(publicRoot, relative), chogan);
    continue;
  }
  const target = path.join(publicRoot, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, source);
  const sourceName = relative
    .replace(/\.html$/i, ".html.txt")
    .replace(/\.md$/i, ".txt")
    .replace(/LICENSE$/i, "LICENSE.txt");
  const sourceTarget = path.join(publicRoot, "source/upstream", sourceName);
  await mkdir(path.dirname(sourceTarget), { recursive: true });
  await writeFile(sourceTarget, source);
}

const originalCss = inlineStyle[1].trim();
await writeFile(
  path.join(publicRoot, "lib/eightball.css"),
  `${originalCss}\n\n/* Denny Games local layout adaptation */\n${adapterCss}`,
);
await writeFile(path.join(publicRoot, "bridge.js"), bridge);
await writeFile(path.join(publicRoot, "game-engine.js"), engineScript);
await writeFile(path.join(publicRoot, "game.js"), gameScript);
await writeFile(path.join(publicRoot, "games/eightball/index.html"), html);
await cp(
  path.join(adapterSource, "bridge.js"),
  path.join(publicRoot, "source/adapter/bridge.js.txt"),
);
await cp(
  path.join(adapterSource, "eightball.css"),
  path.join(publicRoot, "source/adapter/eightball.css.txt"),
);
await cp(
  path.join(adapterSource, "THIRD-PARTY-NOTICES.txt"),
  path.join(licenseRoot, "THIRD-PARTY-NOTICES.txt"),
);
await cp(
  path.join(upstreamRoot, "metadata/LICENSE"),
  path.join(licenseRoot, "LICENSE.txt"),
);
await cp(
  path.join(upstreamRoot, "fonts/OFL.txt"),
  path.join(licenseRoot, "OFL.txt"),
);
await cp(
  path.join(upstreamRoot, "metadata/LICENSE"),
  path.join(publicRoot, "source/upstream/LICENSE.txt"),
);
await cp(
  path.join(upstreamRoot, "metadata/README.md"),
  path.join(publicRoot, "source/upstream/README.txt"),
);
await cp(
  path.join(adapterRoot, "provenance.json"),
  path.join(publicRoot, "source/provenance.json"),
);

const noticeHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="8-Ball Pool MIT source, Vazirmatn OFL font notice, pinned files and Denny Games local adaptations.">
    <link rel="canonical" href="https://games.iamdenny.com/licenses/chogan-eightball/">
    <title>8-Ball Pool source and licenses · Denny Games</title>
  </head>
  <body>
    <main>
      <h1>8-Ball Pool source and licenses</h1>
      <p>8-Ball Pool, its game runtime and stylesheet are from Chogan, pinned at <code>${provenance.source_commit}</code> and distributed under the MIT license. The bundled Vazirmatn font has its own SIL Open Font License 1.1 notice.</p>
      <p><a href="LICENSE.txt">Read the MIT license</a> · <a href="OFL.txt">Read the font license</a> · <a href="THIRD-PARTY-NOTICES.txt">Read third-party notices</a></p>
      <p><a href="https://github.com/choganhq/chogan/tree/${provenance.source_commit}">Pinned upstream source</a> · <a href="/vendor/chogan-eightball/source/provenance.json">Source and build hashes</a> · <a href="/vendor/chogan-eightball/source/upstream/README.txt">Upstream README</a></p>
      <p>The game runs from files served by Denny Games inside an allow-scripts-only opaque-origin frame. Its CSP blocks network requests, nested frames, forms and workers. The host bridge pauses animation, translates controls and localizes the game interface; the host removes the upstream back/fullscreen exits, share links and currency rewards. Each new match racks a fresh table; progress and records are not kept after leaving or reloading.</p>
      <p>8-Ball Pool 게임과 런타임, 스타일은 Chogan의 원본이며 <code>${provenance.source_commit}</code>에 고정한 MIT 라이선스 버전입니다. 함께 제공하는 Vazirmatn 글꼴은 별도의 SIL Open Font License 1.1을 따릅니다.</p>
      <p><a href="LICENSE.txt">MIT 라이선스</a> · <a href="OFL.txt">글꼴 라이선스</a> · <a href="THIRD-PARTY-NOTICES.txt">제3자 고지</a></p>
      <p><a href="https://github.com/choganhq/chogan/tree/${provenance.source_commit}">고정한 원본 소스</a> · <a href="/vendor/chogan-eightball/source/provenance.json">소스 및 빌드 해시</a> · <a href="/vendor/chogan-eightball/source/upstream/README.txt">원본 안내</a></p>
      <p>게임 파일은 데니 게임즈에서 직접 제공하며, 스크립트 실행만 허용한 불투명 출처 프레임에서 실행돼요. CSP로 네트워크 요청·중첩 프레임·폼·워커를 막았습니다. 사이트 어댑터가 애니메이션을 멈추고 조작과 언어를 연결하며, 원작의 뒤로 가기·전체 화면 나가기·공유·코인 보상은 감췄어요. 새 게임마다 공을 다시 배열합니다. 페이지를 떠나거나 새로고침하면 진행과 기록은 저장되지 않아요.</p>
    </main>
  </body>
</html>
`;
await writeFile(path.join(licenseRoot, "index.html"), noticeHtml);

await writeFile(
  path.join(publicRoot, "source/README.txt"),
  [
    "Chogan 8-Ball Pool source snapshot and Denny Games adapter",
    `Source repository: ${provenance.source_repository}`,
    `Pinned commit: ${provenance.source_commit}`,
    "The game engine, cue physics, and shared UI are MIT-licensed by Chogan.",
    "Vazirmatn is separately licensed under OFL 1.1; see /licenses/chogan-eightball/OFL.txt.",
    "Original upstream files are retained below source/upstream/; local adapter sources are below source/adapter/.",
    "The published frame is local-only, opaque-origin, and uses a restrictive CSP.",
    "Game mode and difficulty are available in the New frame menu. The game supports fresh 8-ball racks, three AI difficulties, or two people on one device.",
    "There is no online matchmaking. The current round ends when its frame is left or reloaded.",
    "8볼 풀 원본 스냅샷과 데니 게임즈 어댑터",
    `원본 저장소: ${provenance.source_repository}`,
    `고정 커밋: ${provenance.source_commit}`,
    "게임 엔진, 당구 물리와 공용 UI는 Chogan의 MIT 라이선스입니다.",
    "Vazirmatn 글꼴은 별도 OFL 1.1 라이선스입니다. /licenses/chogan-eightball/OFL.txt 에서 확인할 수 있어요.",
    "원본 파일은 source/upstream/에, 데니 게임즈 어댑터 소스는 source/adapter/에 보관합니다.",
    "공개 프레임은 사이트에서 직접 제공하며 네트워크를 차단한 불투명 출처에서 실행돼요.",
    "새 게임 메뉴에서 AI 난이도와 모드를 고를 수 있어요. 새 8볼 배치, AI 3단계 또는 한 기기 2인 플레이를 지원합니다.",
    "온라인 대전은 없어요. 프레임을 떠나거나 새로고침하면 진행 중인 판은 끝나요.",
    "",
  ].join("\n"),
);

console.log(
  `Built Chogan 8-Ball Pool from ${provenance.source_commit} with ${upstreamFiles.length} hash-checked upstream files.`,
);
