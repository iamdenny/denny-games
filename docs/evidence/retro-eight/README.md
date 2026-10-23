---
title: "Retro arcade browser evidence"
summary: "Local browser validation for the eight-game original arcade expansion."
read_when:
  - Reviewing the original retro arcade release
---

# Retro arcade browser evidence

Captured from the built site on 2026-10-23. These are browser viewports, not physical-device qualification.

- [Crater Duel at 320px](crater-duel-320.png): running Korean play view, readable angle/power/wind/HP and reachable controls.
- [Bubble Harbor at 390px](bubble-harbor-390.png): running Korean play view, bubble board and labeled touch controls.
- Eight desktop gameplay screenshots are published in `public/art/screenshots/` and linked from each game's metadata.

Local verification: 157 unit tests, Astro checks, documentation checks, static artifact audit and SEO checks passed. The output contains 557 indexable pages, 448 bilingual game detail pages and 64 collection pages. Independent code, security and design reviews resolved mixed-input ownership, restored-terminal analytics and status contrast findings. Browser tests exercise actual outcomes, local multiplayer, save/reload, consent, discovery and 320/360/390/430/1440px layouts with minimum 44px controls.

CI and deployment results belong to the pull request and Pages workflow. GA event receipt and search indexing are separate from local verification. Pingus and OpenTyrian remain research candidates; see [port feasibility](../../guide/retro-port-feasibility.md).
