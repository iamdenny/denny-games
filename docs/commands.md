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

`npm run test:imports` audits the combined shared-runtime inventory in `crisp.json` and `century-crisp.json` against `http://127.0.0.1:4322` (override `IMPORT_BASE`). The century release candidate has 280 shared-runtime entries, including original Signal Crossing. Start a preview on that port first. `node scripts/build-crisp.mjs` regenerates the checked runtime and data-URL sprite map without network access.

`node scripts/build-agentic.mjs` verifies retained source/artwork hashes and generates the eleven independent Canvas frames. It runs during `npm run build`; when working through the dev server, run it explicitly after editing the owned adapter or source manifest. Generated frames belong in `public/vendor/agentic/`; retained sources and provenance belong in `vendor/agentic/`.

`npm run test:century-devices` runs all 100 new games in WebKit and Chromium with actual touch input and phone, tablet, wide and short-landscape containment checks. This manual matrix uses its own preview port (`PLAYWRIGHT_PORT`, default 43165); use a separate output directory if another browser suite is running. It does not certify physical devices.

## Filtered game admission

Use explicit IDs for new-game capture so existing screenshots are preserved:

```sh
IMPORT_BASE=http://127.0.0.1:4322 IMPORT_ADMISSION=1 IMPORT_IDS=crisp-signal-crossing npm run test:imports -- --capture
```

`IMPORT_IDS` accepts comma-separated registry IDs. `IMPORT_IDS_FILE` accepts a JSON array of IDs or objects with an `id` field. Unknown IDs fail before running a browser. `IMPORT_ADMISSION=1` defaults to two 20-second input rounds per game; `IMPORT_SECONDS` (1–120), `IMPORT_ROUNDS` (1–5), `IMPORT_WORKERS` (1–8), `IMPORT_INPUT_MS` (40–2000) and `IMPORT_INPUT_SEED` override bounded settings. `IMPORT_OUTPUT` defaults to `test-results/import-admission` and receives per-game JSON, screenshots and a combined `report.json`. An inconclusive game remains `needs-review`; review it and retain the rerun evidence instead of treating it as passed.

The import runner covers the shared Crisp adapter only. Run `npx playwright test tests/e2e/century-games.spec.ts` for the independent Canvas lifecycle, responsive stage and analytics journeys. Set `PLAYWRIGHT_PORT` to an unused port when another preview is running. Source/bridge regressions are in `tests/unit/agentic.test.ts` and `tests/unit/century.test.ts`.

## Search discovery

- `npm run seo:check`: audit the built `dist` sitemap and every indexable page. Runs during build.
- `npm run seo:check -- --base https://games.iamdenny.com`: audit the deployed sitemap and public metadata. This does not prove search-engine indexing.

Mobile WebKit regression: `npx playwright install webkit` then `npm run test:mobile`. Existing CI/Pages run the full Chromium suite. WebKit is a separate local/manual command; enabling it in CI additionally requires workflow write permission. Chromium-only CDP swipe injection is skipped on WebKit; tap, layout, settings and orientation tests run on both engines.

`npm run dev` generates the ignored Neverball/Neverputt local runtime from checked source payloads through `predev`; production builds run the same generator.

The output audit enforces a 120 MiB total artifact ceiling for the century expansion, while retaining the existing 5 MiB per-file and 28 MiB Neverball limits. See [ADR 0058](adr/0058-century-arcade.md); passing this budget is separate from browser performance evidence.
