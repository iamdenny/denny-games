import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const games = JSON.parse(fs.readFileSync("src/data/crisp.json", "utf8"));
const base = process.env.IMPORT_BASE || "http://127.0.0.1:4322";
const capture = process.argv.includes("--capture");
const browser = await chromium.launch();
let next = 0;
const results = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    });
    const page = await context.newPage();
    while (next < games.length) {
      const game = games[next++];
      const errors = [],
        external = [];
      const error = (e) => errors.push(e.message);
      const consoleError = (m) => {
        if (m.type() === "error") errors.push(m.text());
      };
      const request = (r) => {
        if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
          external.push(r.url());
      };
      page.on("pageerror", error);
      page.on("console", consoleError);
      page.on("request", request);
      try {
        await page.goto(`${base}/en/play/${game.id}/`);
        await page.locator("#start-button:enabled").waitFor({ timeout: 17000 });
        const frame = page
          .frames()
          .find((f) => f.url().includes("/vendor/crisp/index.html"));
        assert(frame, "Embedded frame missing");
        await frame.locator("canvas").waitFor();
        await page.locator("#start-button").click();
        await frame.waitForFunction(
          () => Number(document.body.dataset.ticks) > 5,
        );
        await frame
          .locator("canvas")
          .dispatchEvent("mousedown", { clientX: 160, clientY: 160 });
        await page.waitForTimeout(130);
        await frame.locator("canvas").dispatchEvent("mouseup", {});
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          "Mobile overflow",
        );
        if (capture)
          await frame
            .locator("canvas")
            .screenshot({ path: `public/art/crisp/${game.slug}.png` });
        if (await page.locator("#pause-button").isEnabled())
          await page.locator("#pause-button").click();
        await frame.waitForFunction(() => !window.dennyBridge.running);
        const before = await frame.locator("body").getAttribute("data-ticks");
        await page.waitForTimeout(100);
        assert.equal(
          await frame.locator("body").getAttribute("data-ticks"),
          before,
          "Game advanced while paused",
        );
        assert.deepEqual(errors, []);
        assert.deepEqual(external, []);
        results.push({
          id: game.id,
          status: "passed",
          mobileViewport: 390,
          externalRequests: 0,
        });
      } catch (error) {
        results.push({
          id: game.id,
          status: "failed",
          error: String(error),
          errors,
        });
        console.log("FAIL", game.id, String(error), errors);
      }
      page.off("pageerror", error);
      page.off("console", consoleError);
      page.off("request", request);
    }
    await context.close();
  }),
);
await browser.close();
fs.mkdirSync("test-results", { recursive: true });
fs.writeFileSync(
  "test-results/import-audit.json",
  JSON.stringify(
    { checkedAt: new Date().toISOString(), base, results },
    null,
    2,
  ),
);
console.log(
  `${results.filter((r) => r.status === "passed").length}/${games.length} imported game load/input/pause journeys passed`,
);
assert(
  results.every((r) => r.status === "passed"),
  "Imported game audit failed",
);
