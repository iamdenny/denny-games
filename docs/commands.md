---
title: "Commands"
summary: "Reproducible local development and CI commands."
read_when:
  - Working on commands
---

# Commands

Use Node 22.22.3 (`.nvmrc`) and npm. Run from repository root.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run dev` | Astro on localhost:4321 |
| `npm run build` | Static dist plus artifact audit |
| `npm run preview` | Preview production output on localhost:4321 |
| `npm run format` | Format Astro, TypeScript, styles and validation scripts |
| `npm run format:check` | Verify formatting |
| `npm run check` | Astro/TypeScript diagnostics |
| `npm test` | Game rules and shared services |
| `npm run test:e2e` | Chromium user journeys and mobile layouts |
| `npm run docs:check` | Frontmatter and internal documentation links |
| `npm run docs:lint` | Markdown style |
| `npm run test:scale` | Nonpublic 1,000-game registry and static generation |
| `node scripts/verify-public.mjs --sha <sha>` | Verify release SHA, public HTML/assets, internal play routes and external-host links |
| `npm run verify` | Types, unit tests, docs, scale and production build |

Use `npx playwright install chromium` once for local browser tests. No environment variables are required for development. Advertisement mode defaults to off. Do not copy another project's credentials.

`npm run test:imports` audits all 191 Crisp imports against `http://127.0.0.1:4322` (override `IMPORT_BASE`). Start a preview on that port first. `node scripts/build-crisp.mjs` regenerates the checked runtime and data-URL sprite map without network access.

## Search discovery

- `npm run seo:check`: audit the built `dist` sitemap and every indexable page. Runs during build.
- `npm run seo:check -- --base https://games.iamdenny.com`: audit the deployed sitemap and public metadata. This does not prove search-engine indexing.

Mobile WebKit regression: `npx playwright install webkit` then `npm run test:mobile`. Existing CI/Pages run the full Chromium suite. WebKit is a separate local/manual command; enabling it in CI additionally requires workflow write permission. Chromium-only CDP swipe injection is skipped on WebKit; tap, layout, settings and orientation tests run on both engines.

`npm run dev` generates the ignored Neverball/Neverputt local runtime from checked source payloads through `predev`; production builds run the same generator.
