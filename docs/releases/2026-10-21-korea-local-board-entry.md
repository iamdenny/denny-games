---
title: "South Korea local two-player entry"
summary: "A focused Korean-language search entry for five same-device board games."
read_when:
  - Reviewing the South Korea market experiment
---

# South Korea local two-player entry

## Delivered

- Started a low-cost South Korea market experiment for free two-player board games friends can play on one device. This does not establish that Korea is less competitive; evidence limits are in [market focus](../product/MARKET-FOCUS.md).
- Updated the bilingual collection title and question to match this intent naturally.
- Added a direct local-player link to each of the five classic-board cards. Every link has an accessible name that includes the game title.
- Kept the existing canonical collection route and its five verified games; added no country doorway or new locale.

## Local evidence

- Node `v22.22.3`; `npm ci` completed with zero reported vulnerabilities.
- `npm run verify`: passed Astro diagnostics (0 errors; 1 pre-existing hint), 77 unit tests, docs checks and lint, the 1,000-game scale fixture, static build, output audit and SEO checks (503 indexable pages).
- `PLAYWRIGHT_PORT=4324 npm run test:e2e`: 514 Chromium tests passed, including the bilingual collection answer and all five same-device game routes.
- `npm run format:check` and `git diff --check`: passed.
- The collection route fit 320, 360, 390, 430 and 1440 CSS-pixel widths in browser checks. A separate screenshot readback confirmed five direct-play links and no horizontal overflow at 390px and 1440px.
- [Desktop capture](assets/2026-10-21-ko-local-board-entry-desktop.png) · [390px mobile capture](assets/2026-10-21-ko-local-board-entry-mobile.png)

## Release and search evidence

- PR [#67](https://github.com/iamdenny/denny-games/pull/67) merged on 2026-10-21 at `10:27:52Z` as `fcf8bba31855d71a8681ab0e17894afa94fc70d1`.
- Pages workflow [39584770429](https://github.com/iamdenny/denny-games/actions/runs/39584770429) completed successfully. Its build, full Chromium suite, Pages deployment and IndexNow job passed.
- At `2026-10-21T10:34:15Z`, `node scripts/verify-public.mjs --sha fcf8bba31855d71a8681ab0e17894afa94fc70d1` passed. Public `release.json` carried the same SHA; Pages reported `built` with HTTPS enforced.
- Public EN and KO collection routes returned HTTP 200 with the expected localized heading and FAQ, five direct-play links each, and all ten localized play routes returned HTTP 200.
- IndexNow returned HTTP 200 for 503 sitemap URLs. This is a submission receipt, not evidence of crawling or indexing.
- Search Console metrics remain unavailable. No ranking or traffic improvement is claimed. After crawl time, compare exact query/page impressions, clicks, CTR and average position over consecutive completed 28-day windows.

Browser screenshots and automation do not establish physical-phone or tablet testing, player popularity, revenue or search-engine ranking.
