---
title: "Quick discovery and replay"
summary: "Bilingual home picks, recent games, honest score feedback and replay choices."
read_when:
  - Reviewing the discovery and replay release
---

# Quick discovery and replay

## Delivered

- Put the new home picker before collections, with quick-reflex, thinking and same-screen two-player sets. Use registered artwork and direct play/rules links; retain static fallback.
- Show up to three real recent local games, excluding unknown IDs, duplicates and external hosts. No new tracking or storage key.
- Show actual comparable score records and a next-game link after a shell round ends. Keep these hidden during setup and pause; exclude classic and internally scored games from score badges.
- Disable the initial start control until the runtime attaches. Contain artwork in the mobile grid and keep result controls reachable in short landscape screens.
- Preserve iframe isolation, consent and advertising behavior. Update the Bounce Back restart check to wait for new-frame navigation before inspecting that frame.

## Local evidence

- `npm run verify`: passed type checks, unit tests, documentation, scale fixture, output audit and SEO checks (541 indexable pages).
- Full Chromium suite: 505 passed after correcting the iframe-navigation test race. The corrected Bounce Back test also passed five consecutive focused runs.
- Full WebKit mobile suite: 165 passed, one existing conditional skip.
- Screenshot inspection at 390px, 834px, 1194px and 1440px confirmed visible artwork and controls. The automated suite also covers 320px and short landscape results, slow script hydration and real Circuit completion/replay.
- Independent design review: both initial copy findings resolved; no remaining findings on final review. Direct code review checked history filtering, static link safety, runtime boundaries and result reset behavior.

[Mobile home](assets/2026-10-15-quick-play-mobile.png) · [iPad-sized home](assets/2026-10-15-quick-play-ipad.png)

## Evidence boundary

These are browser tests and viewport emulation, not physical iPhone/iPad/Tesla signoff. Increased enjoyment, repeat visits and revenue require actual player evidence. CI, merge, production SHA and public readback remain separate release gates.
