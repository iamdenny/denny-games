---
title: "Daily completion and return"
summary: "Actual daily completion, local records, UTC reset and remaining-game navigation."
read_when:
  - Reviewing the daily return release
---

# Daily completion and return

## Delivered

Daily and home show today's UTC date and actual completed-round count. Daily cards show each game's best completed score, including a zero-score finish, and offer another attempt. All three use stage 1; legacy daily links no longer inherit a saved stage. A qualifying result leads to the first unfinished daily game or to the completed summary.

Only real shell results on today's supported seed and stage count. Normal play, pause, old seeds and other stages do not. One validated current-date local record stores IDs, versions and scores. No remote collection, ranking or streak claim is introduced. Static links and storage-denied play remain available.

## Evidence

- `npm run verify`: type checks, 68 unit checks, docs, 1,000-entry scale fixture, production artifact and SEO audit passed (541 indexable pages).
- Final affected Chromium suites: 41 passed. The preceding full run exposed a missing date hook and relative-link restoration change, both corrected; collection-preview timeouts did not recur in the final affected run (baseline control: 7 passed). Full PR CI remains the release gate.
- Full WebKit mobile run: 170 passed, one conditional skip and two relative-href assertions subsequently corrected; final affected WebKit suites passed all 21 checks.
- Inspected 390px phone, 834px tablet portrait and 1194px landscape screenshots. Completed a real Circuit round with two prior completion fixtures and confirmed the all-three-complete summary link in an 844×390 result overlay.
- Corrected the missing semantic date hook discovered by the existing daily-route browser check.

## Boundaries

Browser emulation does not certify physical phones, iPads or Tesla. Completion means finishing a round regardless of winning. Scores are editable browser data, use the device clock and are lost if storage is cleared; blocked storage may prevent persistence across navigation. Retention and revenue effects are unmeasured. CI, merge, deployment and public readback are separate gates recorded in the PR.
