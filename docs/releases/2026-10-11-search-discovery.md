---
title: "Search discovery release"
summary: "SEO/GEO content and metadata changes with explicit evidence boundaries."
read_when:
  - Reviewing the search discovery release
---

# Search discovery release

## Changes

Localized game search titles, unique category pagination titles/descriptions, contextual language fallbacks and multilingual sitemap links. Added registry-derived entity/breadcrumb/collection data, PNG sharing previews, same-category related games and a bilingual source/device/save guide. Updated stale initial-catalogue and local-save copy. Added a sitewide SEO audit to every build and a no-JavaScript mobile discovery regression.

## Local validation

- `npm run verify`: passed, including 18 unit tests, documentation checks, 1,000-game scale check, static artifact audit and 441 indexable-page SEO audit (388 bilingual game detail pages and 22 category pages).
- All 207 Chromium regressions passed, including the new no-JavaScript 390px discovery scenario. The new scenario initially used an incorrect test heading label, corrected before the final full run.
- Schema property review used official schema.org definitions; source references use CreativeWork `isBasedOn`, and play mode uses the schema enumeration URL.

## External evidence

Google Search Console URL-prefix ownership was automatically verified on 2026-10-11 through the existing domain-name provider verification. No DNS changes were needed. Bing and Naver public HTML verification tags are included on the root selector page. Site verification, sitemap receipts, indexing, rankings and AI citations remain separate states; do not treat tags or deployment as submitted/verified.

PR checks, merge, deployment, public readback and submission receipts are recorded after completion. Physical-device certification, observed indexing/rankings and AI citation outcomes are not established by this release.
