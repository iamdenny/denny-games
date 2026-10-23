import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  testMatch: [
    "mobile-player.spec.ts",
    "player-viewport.spec.ts",
    "game-tools.spec.ts",
    "quick-play.spec.ts",
    "daily-progress.spec.ts",
    "sokoban.spec.ts",
    "gridland.spec.ts",
    "yutnori.spec.ts",
    "klondike.spec.ts",
  ],
  projects: [
    { name: "webkit-mobile-layout", use: { ...devices["Desktop Safari"] } },
    {
      name: "webkit-ipad-touch",
      testMatch: [
        "sokoban.spec.ts",
        "gridland.spec.ts",
        "yutnori.spec.ts",
        "klondike.spec.ts",
      ],
      use: { ...devices["iPad Mini"] },
    },
  ],
});
