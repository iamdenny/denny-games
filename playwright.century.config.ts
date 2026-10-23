import { defineConfig } from "@playwright/test";
const port = Number(process.env.PLAYWRIGHT_PORT ?? 43165);
export default defineConfig({
  testDir: "./tests/century",
  fullyParallel: true,
  workers: 1,
  timeout: 60000,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "century-webkit-touch", use: { browserName: "webkit" } },
    { name: "century-chromium-touch", use: { browserName: "chromium" } },
  ],
  webServer: {
    command: `npx astro preview --host 127.0.0.1 --port ${port} --ignore-lock`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});
