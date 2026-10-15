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
  ],
  projects: [
    { name: "webkit-mobile-layout", use: { ...devices["Desktop Safari"] } },
  ],
});
