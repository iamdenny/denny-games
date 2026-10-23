import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  testDir: "./tests/devices",
  testMatch: "six-games.spec.ts",
  outputDir: "test-results/devices",
  reporter: process.env.CI ? "line" : "list",
  projects: [
    { name: "iphone-webkit", use: { ...devices["iPhone 13"] } },
    { name: "android-chromium", use: { ...devices["Pixel 7"] } },
    { name: "ipad-mini-webkit", use: { ...devices["iPad Mini"] } },
    { name: "ipad-pro-webkit", use: { ...devices["iPad Pro 11"] } },
    {
      name: "wide-touch-1280",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 800 },
        hasTouch: true,
      },
    },
    {
      name: "wide-touch-1920",
      use: {
        browserName: "chromium",
        viewport: { width: 1920, height: 1080 },
        hasTouch: true,
      },
    },
    {
      name: "compact-webkit",
      use: {
        browserName: "webkit",
        viewport: { width: 740, height: 360 },
        hasTouch: true,
      },
    },
  ],
});
