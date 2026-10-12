import { spawnSync } from "node:child_process";
import fs from "node:fs";
import assert from "node:assert/strict";
const result = spawnSync(
  process.execPath,
  ["node_modules/astro/bin/astro.mjs", "build", "--outDir", ".scale-fixture"],
  {
    env: { ...process.env, SCALE_TEST: "1" },
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  },
);
if (result.status !== 0) {
  console.error(result.stdout, result.stderr);
  process.exit(1);
}
try {
  for (const locale of ["en", "ko"]) {
    const index = JSON.parse(
      fs.readFileSync(`.scale-fixture/${locale}/search-index.json`, "utf8"),
    );
    assert.equal(index.length, 1000);
    assert.equal(new Set(index.map((g) => g.id)).size, 1000);
    assert(
      fs.existsSync(`.scale-fixture/${locale}/games/fixture-999/index.html`),
    );
    assert(
      fs.existsSync(
        `.scale-fixture/${locale}/category/puzzle/page/21/index.html`,
      ),
    );
    const first = fs.readFileSync(
      `.scale-fixture/${locale}/category/puzzle/index.html`,
      "utf8",
    );
    assert.equal([...first.matchAll(/data-game-card=/g)].length, 24);
    const allIds = [];
    for (let page = 1; page <= Math.ceil(index.length / 24); page++) {
      const html = fs.readFileSync(
        `.scale-fixture/${locale}/all/${page > 1 ? `page/${page}/` : ""}index.html`,
        "utf8",
      );
      allIds.push(
        ...[...html.matchAll(/data-game-card="([^"]+)"/g)].map((m) => m[1]),
      );
    }
    assert.deepEqual(
      allIds,
      index.map((game) => game.id),
    );
    assert.equal(new Set(allIds).size, 1000);
  }
  console.log(
    "Scale: 1,000 fixture games, both languages, 24-per-page categories and static detail/play routes passed",
  );
} finally {
  fs.rmSync(".scale-fixture", { recursive: true, force: true });
}
