import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const inventory = [
  ...JSON.parse(fs.readFileSync("src/data/crisp.json", "utf8")),
  ...(fs.existsSync("src/data/century-crisp.json")
    ? JSON.parse(fs.readFileSync("src/data/century-crisp.json", "utf8"))
    : []),
];
assert.equal(
  new Set(inventory.map((g) => g.id)).size,
  inventory.length,
  "Duplicate imported game IDs",
);
const base = process.env.IMPORT_BASE || "http://127.0.0.1:4322";
const baseOrigin = new URL(base).origin;
const admission = process.env.IMPORT_ADMISSION === "1";
const capture = process.argv.includes("--capture");
const idsFromFile = process.env.IMPORT_IDS_FILE
  ? JSON.parse(fs.readFileSync(process.env.IMPORT_IDS_FILE, "utf8"))
  : [];
assert(Array.isArray(idsFromFile), "IMPORT_IDS_FILE must contain a JSON array");
const ids = new Set([
  ...(process.env.IMPORT_IDS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean),
  ...idsFromFile.map((v) => (typeof v === "string" ? v : v.id)),
]);
assert(
  [...ids].every(
    (id) => typeof id === "string" && inventory.some((g) => g.id === id),
  ),
  "Unknown or invalid candidate ID; register candidates before browser admission",
);
assert(
  !capture || ids.size > 0,
  "--capture requires explicit IMPORT_IDS or IMPORT_IDS_FILE to preserve existing previews",
);
const games = ids.size ? inventory.filter((g) => ids.has(g.id)) : inventory;
assert(games.length > 0, "No imported games selected");
for (const game of games)
  assert(/^[a-z0-9-]+$/.test(game.slug), "Invalid game slug");
const integer = (key, fallback, min, max) => {
  const v = Number(process.env[key] ?? fallback);
  assert(
    Number.isInteger(v) && v >= min && v <= max,
    `${key} must be an integer from ${min} to ${max}`,
  );
  return v;
};
const seconds = integer("IMPORT_SECONDS", admission ? 20 : 1, 1, 120);
const inputMilliseconds = integer("IMPORT_INPUT_MS", 120, 40, 2000);
const rounds = integer("IMPORT_ROUNDS", admission ? 2 : 1, 1, 5);
const workers = integer("IMPORT_WORKERS", admission ? 3 : 6, 1, 8);
const seed = integer("IMPORT_INPUT_SEED", 71023, 0, 4294967295);
const output = process.env.IMPORT_OUTPUT || "test-results/import-admission";
fs.mkdirSync(output, { recursive: true });
const results = [];
let next = 0;
const browser = await chromium.launch();
function randomFor(id, round) {
  let value = seed ^ round;
  for (const c of id) value = Math.imul(value ^ c.charCodeAt(0), 16777619);
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}
async function evidence(page) {
  return page.evaluate(
    () => window.__importAudit || { ends: [], scores: [], ready: 0 },
  );
}
async function frameFor(page) {
  await page.locator("#start-button:enabled").waitFor({ timeout: 17000 });
  const frame = page
    .frames()
    .find((f) => f.url().includes("/vendor/crisp/index.html"));
  assert(frame, "Embedded frame missing");
  assert.equal(
    await page.locator("iframe.crisp-frame").getAttribute("sandbox"),
    "allow-scripts",
  );
  await frame.locator("canvas").waitFor();
  return frame;
}
async function audit(game) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  await context.addInitScript(() => {
    window.__importAudit = { ends: [], scores: [], ready: 0 };
    addEventListener("message", (event) => {
      const frame = document.querySelector("iframe.crisp-frame");
      if (
        !frame ||
        event.source !== frame.contentWindow ||
        event.origin !== "null"
      )
        return;
      const channel = new URL(frame.src).searchParams.get("channel");
      if (event.data?.channel !== channel) return;
      const a = window.__importAudit,
        d = event.data;
      if (d.type === "ready") a.ready++;
      if (
        d.type === "score" &&
        Number.isFinite(d.score) &&
        a.scores.length < 500
      )
        a.scores.push(d.score);
      if (d.type === "end" && Number.isFinite(d.score) && a.ends.length < 10)
        a.ends.push({ score: d.score, won: d.won === true });
    });
  });
  const page = await context.newPage();
  const errors = [],
    external = [],
    badResponses = [],
    journeys = [];
  const bounded = (array, v) => {
    if (array.length < 100) array.push(v);
  };
  page.on("pageerror", (e) => bounded(errors, e.message));
  page.on("console", (m) => {
    if (m.type() === "error") bounded(errors, m.text());
  });
  page.on("request", (r) => {
    if (!r.url().startsWith("data:") && new URL(r.url()).origin !== baseOrigin)
      bounded(external, r.url());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) bounded(badResponses, `${r.status()} ${r.url()}`);
  });
  let status = "failed",
    failure;
  try {
    await page.goto(`${base}/en/play/${game.id}/`);
    for (let round = 0; round < rounds; round++) {
      const frame = await frameFor(page);
      await page.locator("#start-button").click();
      await frame.waitForFunction(
        () =>
          Number(document.body.dataset.ticks) > 5 ||
          !window.dennyBridge.running,
      );
      const canvas = frame.locator("canvas");
      const random = randomFor(game.id, round);
      const startedAt = Date.now();
      const until = startedAt + seconds * 1000;
      let actions = 0;
      while (Date.now() < until && !(await evidence(page)).ends.length) {
        const box = await canvas.boundingBox();
        assert(
          box && box.width > 0 && box.height > 0,
          "Canvas has no visible bounds",
        );
        await page.mouse.move(
          box.x + box.width * (0.1 + random() * 0.8),
          box.y + box.height * (0.1 + random() * 0.8),
        );
        // Alternate tap, held pointer, idle and keyboard press. This is an input
        // seed, not a claim that the unmodified upstream simulation is seeded.
        const mode = actions % 4;
        if (mode < 2) await page.mouse.down();
        if (mode === 3) {
          await canvas.focus();
          await page.keyboard.down("Space");
        }
        await page.waitForTimeout(
          mode === 1 ? Math.max(400, inputMilliseconds) : inputMilliseconds,
        );
        await page.mouse.up();
        await page.keyboard.up("Space");
        if (game.digits && actions % 3 === 0)
          await page.keyboard.press(String(1 + Math.floor(random() * 9)));
        actions++;
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "Mobile overflow",
      );
      const beforePause = await evidence(page);
      if (
        !beforePause.ends.length &&
        (await page.locator("#pause-button").isEnabled())
      )
        await page.locator("#pause-button").click();
      await frame.waitForFunction(() => !window.dennyBridge.running);
      const ticks = await frame.locator("body").getAttribute("data-ticks");
      await page.waitForTimeout(180);
      assert.equal(
        await frame.locator("body").getAttribute("data-ticks"),
        ticks,
        "Game advanced while paused/terminal",
      );
      const observed = await evidence(page);
      assert(observed.ends.length <= 1, "Duplicate terminal event");
      const screenshot = path.join(output, `${game.id}-round-${round + 1}.png`);
      await canvas.screenshot({ path: screenshot });
      if (capture && round === 0 && observed.ends.length === 0)
        await canvas.screenshot({ path: `public/art/crisp/${game.slug}.png` });
      let resumed = false;
      if (admission && !observed.ends.length) {
        await page.locator("#start-button").click();
        await frame.waitForFunction(
          (oldTicks) =>
            window.dennyBridge.running ||
            Number(document.body.dataset.ticks) > Number(oldTicks),
          ticks,
        );
        await frame.waitForFunction(
          (oldTicks) =>
            Number(document.body.dataset.ticks) > Number(oldTicks) ||
            !window.dennyBridge.running,
          ticks,
        );
        resumed = true;
        if (await page.locator("#pause-button").isEnabled())
          await page.locator("#pause-button").click();
        await frame.waitForFunction(() => !window.dennyBridge.running);
      }
      const finalObserved = await evidence(page);
      assert(
        finalObserved.ends.length <= 1,
        "Duplicate terminal event after resume",
      );
      journeys.push({
        round: round + 1,
        actions,
        playMilliseconds: Date.now() - startedAt,
        ticks,
        paused: true,
        resumed,
        readyEvents: finalObserved.ready,
        scores: finalObserved.scores,
        ends: finalObserved.ends,
        screenshot,
        publicPreviewCaptured:
          capture && round === 0 && observed.ends.length === 0,
      });
      if (round + 1 < rounds) {
        await page.locator("#restart-button").click();
        await page.waitForLoadState("load");
        await page.locator("#start-button:enabled").waitFor();
        const restarted = await evidence(page);
        assert.equal(
          restarted.ends.length,
          0,
          "Restart retained terminal evidence",
        );
      }
    }
    assert.deepEqual(errors, [], "Runtime/console errors");
    assert.deepEqual(external, [], "External network requests");
    assert.deepEqual(badResponses, [], "Failed local resources");
    const progressed = journeys.some(
      (j) => j.ends.length || j.scores.some((v) => v !== 0),
    );
    status = admission && !progressed ? "needs-review" : "passed";
  } catch (error) {
    failure = String(error);
    await page
      .screenshot({
        path: path.join(output, `${game.id}-failure.png`),
        timeout: 5000,
      })
      .catch(() => {});
    console.log("FAIL", game.id, failure);
  } finally {
    results.push({
      id: game.id,
      status,
      failure,
      errors,
      external,
      badResponses,
      journeys,
    });
    fs.writeFileSync(
      path.join(output, `${game.id}.json`),
      JSON.stringify(results.at(-1), null, 2),
    );
    await context.close();
  }
}
try {
  await Promise.all(
    Array.from({ length: Math.min(workers, games.length) }, async () => {
      while (next < games.length) await audit(games[next++]);
    }),
  );
} finally {
  await browser.close();
  results.sort((a, b) => a.id.localeCompare(b.id));
  const report = {
    checkedAt: new Date().toISOString(),
    base,
    admission,
    inputSeed: seed,
    inputMilliseconds,
    secondsPerRound: seconds,
    rounds,
    selectedIds: games.map((g) => g.id),
    limitation:
      "Seeded input smoke/soak, not deterministic engine replay, skillful play, full campaign completion or physical-device verification. needs-review means no score or terminal progress was observed.",
    results,
  };
  fs.mkdirSync("test-results", { recursive: true });
  fs.writeFileSync(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2),
  );
  fs.writeFileSync(
    "test-results/import-audit.json",
    JSON.stringify(report, null, 2),
  );
}
console.log(
  `${results.filter((r) => r.status === "passed").length}/${games.length} imported game admission journeys passed (${results.filter((r) => r.status === "needs-review").length} require gameplay review)`,
);
assert(
  results.length === games.length &&
    results.every((r) => r.status === "passed"),
  "Imported game admission failed or needs gameplay review",
);
