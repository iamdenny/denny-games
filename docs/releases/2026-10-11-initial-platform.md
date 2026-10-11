---
title: "Initial platform release"
summary: "Implementation scope, reproducible checks and external evidence boundaries."
read_when:
  - Reviewing the initial release or repeating validation
---

# Initial platform — 2026-10-11

## Delivered scope

AGENTS.md, eight accepted ADRs, PRD reconciliation, architecture, setup, onboarding, advertising and deployment runbooks were written before implementing the platform. The repository follows the /docs init/update/check workflow with Markdown checks and an ignored local Graphify AST graph (401 nodes, 657 edges at the first extraction).

Astro static output includes English/Korean catalogue, puzzle/arcade categories, search, favourites/recent, daily seeded challenges, game details and three playable games. Circuit Loop has 30 deterministic solvable boards; Orbit Break has 12 distinct layouts; 2048 is an MIT rule adaptation with original UI/assets and retained upstream notice. The player shares pause/resume, storage, keyboard/touch/standard-pad mapping, audio unlock, fullscreen fallback and result sharing.

Advertising is implemented as gated content slots and an H5 between-round adapter. Default mode is off, publisher IDs are absent and no live ad requests are sent. Account/site approval, H5 eligibility, certified CMP connection, hosting suitability and seller authorization remain external gates.

## Local evidence

- TypeScript/Astro: zero errors, warnings and hints.
- Unit tests: 15 passed, including 90 generated puzzle solutions, 12 arcade layouts, 30/60fps simulation, 2048 merge rules, UTC seeds, denied storage and ad callback recovery.
- Browser tests: 13 Chromium scenarios passed, including widths 320/360/390/430/1440, all games, locale/state restore, search/library/daily, pointer swipe, synthetic standard pad/disconnect, hints, clipboard fallback, late-stage 48px touch targets and canvas drag alignment.
- Docs: 23 Markdown files checked, 22 linted (historical PRD excluded from style lint); internal links passed.
- Scale fixture: 1,000 games, both locales, real category pagination and static detail/play pages passed. Fixtures are removed and excluded from production.
- Artifact: 85 files, approximately 0.38 MiB before this release record; output link audit passed, source/docs/research/maps excluded.
- Dependency audit: zero known vulnerabilities in the locked dependency tree at validation time. The glob-based Markdown CLI was replaced by direct Markdown linting; KaTeX is pinned to the patched version.
- Visual inspection: real Chrome desktop and 390px responsive viewport; actual board screenshots retained under public/art/screenshots.

These are automated/browser-emulation results, not physical phone, controller or Tesla evidence. Source-level rules and assets were reviewed; this is not external legal approval.

## CI, merge and public evidence

CI must pass on the final PR head. Deployment must pass on the resulting main SHA. Verify with:

```sh
node scripts/verify-public.mjs --sha <merge-sha>
```

The public release.json identifies the deployed source SHA. GitHub Actions and PR records are the authoritative CI/merge/deployment history. The public Pages certificate and HTTPS enforcement must be checked separately. No future CI or merge result is pre-labelled as passed in this pre-merge record.

## Still unverified

Actual iOS Safari/Android Chrome, physical Xbox/DualSense input, Tesla firmware and 20-minute device soak; field Core Web Vitals; Search Console/indexing; AdSense/H5/CMP approval, ad serving and revenue. These remain distinct from a deployable software release. No 90-day experiment plan is included.
