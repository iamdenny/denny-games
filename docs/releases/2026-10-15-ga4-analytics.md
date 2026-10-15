---
title: "Opt-in Denny Games GA4 page views"
summary: "Add consent-gated Google Analytics page views with bilingual disclosure and controls."
read_when:
  - Reviewing Denny Games analytics setup or release evidence
---

# Opt-in Denny Games GA4 page views — 2026-10-15

## Changes

- Create the dedicated `Denny Games` GA4 property and `Denny Games Web` stream for `https://games.iamdenny.com`; Measurement ID: `G-5NZLTVBG5Y`.
- Set event and user data retention to 2 months and enable email plus 29 common sensitive URL query-key redactions in the stream.
- Send default page views only after an affirmative local analytics choice. Visitors can decline, or change their choice from the English or Korean privacy page.
- Keep query strings and fragments out of the page location, reduce referrers to their origin, scope the prefixed GA cookies to the games subdomain and set a 60-day expiry.
- Disable Enhanced Measurement, Google Signals and advertising personalization. Keep game events, search terms, form text, scores and account identifiers out of GA4.
- Update the bilingual privacy disclosure, product requirements, search guide and ADR 0031.

## Validation

`npm run verify` passed: Astro check (0 errors; one existing hint in `tests/e2e/discovery.spec.ts`), 68 unit tests, docs checks and lint, 1,000-game scale fixture, 960-page build, output audit and SEO check. `npm run format:check` passed. The Google tag queue uses the documented `Arguments` command format, and consent changes synchronize across open tabs. `PLAYWRIGHT_PORT=4331 npm run test:e2e` passed all 515 browser tests, including three analytics consent scenarios. [Main deployment run 38719763637](https://github.com/iamdenny/denny-games/actions/runs/38719763637) passed its build, browser tests, Pages deploy and IndexNow jobs. Public `/ko/`, `/en/`, `/ko/privacy/` and `/en/privacy/` returned HTTP 200; `release.json` reported deployed SHA `bc0aa5da49954e86f435b45607ab12cf6277590e`. After analytics opt-in in a clean browser session, GA4 Realtime showed one active user and the `page_view`, `first_visit` and `session_start` events.

## Evidence

- [Google tag setup](https://developers.google.com/tag-platform/gtagjs)
- [Consent mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [ADR 0031 — Opt-in GA4 page views](../adr/0031-opt-in-ga4-page-views.md)
