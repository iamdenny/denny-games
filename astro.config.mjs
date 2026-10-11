import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://games.iamdenny.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  vite: { build: { sourcemap: false } },
  devToolbar: { enabled: false },
});
