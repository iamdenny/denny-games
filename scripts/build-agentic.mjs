import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const provenance = JSON.parse(
  fs.readFileSync("vendor/agentic/provenance.json", "utf8"),
);
for (const entry of provenance.files) {
  const hash = createHash("sha256")
    .update(fs.readFileSync(entry.path))
    .digest("hex");
  if (hash !== entry.sha256)
    throw Error(`Agentic source hash mismatch: ${entry.path}`);
}
import { rolldown } from "rolldown";
const root = "vendor/agentic/sources";
const entries = {
  "blink-scope": {
    module: "main.js",
    canvas: "scope",
    start: "__blink.startGame(1729)",
    state: "__blink.game",
    end: 's.phase === "over" || s.phase === "complete"',
    win: 's.phase === "complete"',
  },
  "draft-line": {
    module: "src/main.js",
    start:
      "__game.startRun(); __game.setPageVisible(true); __game.setWindowFocused(true)",
    state: "__game.sim",
    end: "s.finished || s.gameOver",
    win: "s.finished",
  },
  "head-rush": {
    scripts: ["core", "bots", "psg", "audio", "main"],
    start: "__game.newGame()",
    state: "__game.state",
    end: 's.phase === "over"',
  },
  overturn: {
    scripts: ["core", "bots", "audio", "main"],
    start: "__game.button()",
    state: "__game.state",
    end: "s.over",
  },
  parallaxia: {
    module: "src/main.js",
    canvas: "game",
    start: "__game.reset({seed:1729}); __game.resume()",
    state: "__game.state",
    end: 's.phase === "gameover"',
  },
  pileup: {
    scripts: ["core", "audio", "demo", "main"],
    start: "__test.start()",
    state: "__test.state",
    end: "s.over || s.won",
    win: "s.won",
  },
  skyhaul: {
    scripts: ["core", "bots", "audio", "main"],
    start: "__sky.startGame(1729)",
    state: "__sky.app.game",
    end: 's.phase === "over"',
    win: "s.cleared",
  },
  "twin-vector": {
    scripts: ["rounds", "ranking", "engine", "audio", "human-policy", "game"],
    start: "__game.engine.start(__game.state)",
    state: "__game.state",
    end: 's.phase === "over" || s.phase === "win"',
    win: 's.phase === "win"',
  },
  undertow: {
    scripts: ["core", "bots", "audio", "main"],
    start: "__ut.start(false)",
    state: "__ut.game",
    end: 's.mode === "over"',
    win: 's.overWhy === "allclear"',
  },
  wreckfall: {
    scripts: ["core", "bots", "audio", "main"],
    start: "__wf.start(1729)",
    state: "__wf.game",
    end: 's.mode === "over"',
    win: "s.allClear",
  },
  "zig-saber": {
    scripts: ["core", "bots", "psg", "audio", "main"],
    start: "__game.newGame()",
    state: "__game.state",
    end: 's.phase === "over"',
    win: "s.cleared",
  },
};
const bridge = fs.readFileSync("vendor/agentic/bridge.js", "utf8");
fs.mkdirSync("public/vendor/agentic", { recursive: true });
for (const [slug, e] of Object.entries(entries)) {
  let code;
  if (e.module) {
    const b = await rolldown({ input: path.join(root, slug, e.module) });
    const r = await b.generate({ format: "iife" });
    code = r.output[0].code;
    await b.close();
  } else
    code = e.scripts
      .map((n) => fs.readFileSync(path.join(root, slug, n + ".js"), "utf8"))
      .join("\n;\n");
  if (slug === "twin-vector") {
    const from =
      "if(new URLSearchParams(location.search).has('test'))window.__game=";
    if (code.split(from).length !== 2) throw Error("Twin Vector hook changed");
    code = code.replace(from, "window.__game=");
  }
  const hook = `\nwindow.__agenticSetup({start(){${e.start}},read(){const s=${e.state}; return {score:s?.score??0,ended:!!(s&&(${e.end})),won:!!(s&&(${e.win || "false"})),phase:s?.phase??s?.mode??'playing'};}});`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${slug} · ABA Games</title><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="https://games.iamdenny.com/en/games/agentic-${slug}/"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; media-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#080c13;display:grid;place-items:center}canvas{width:100%!important;height:100%!important;max-width:100%;max-height:100%;object-fit:contain;image-rendering:pixelated;touch-action:none;display:block}</style></head><body><canvas width="${{ pileup: 504, skyhaul: 320, "twin-vector": 256, undertow: 256, wreckfall: 224 }[slug] || 300}" height="${{ pileup: 464, skyhaul: 240, "twin-vector": 288, undertow: 192, wreckfall: 256 }[slug] || 150}" id="${e.canvas || "screen"}"></canvas><script>${(bridge + "\n;\n" + code + hook).replaceAll("</script", "<\\/script")}</script></body></html>`;
  fs.writeFileSync(`public/vendor/agentic/${slug}.html`, html);
}
console.log("Built 11 pinned Agentic games");
