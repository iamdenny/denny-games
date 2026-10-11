---
title: "Testing"
summary: "Automated release checks and physical-device boundaries."
read_when:
  - Working on testing
---

# Testing

Tests cover puzzle solvability, deterministic UTC seeds, 2048 merges, arcade timestep behavior, storage failure, ad rejection/no-fill and game cleanup. Browser checks exercise home/detail/play/pause/restart, locale state persistence, favourites, search, daily challenges and no display ads in play.

Responsive checks use 320, 360, 390, 430 and 1440 CSS pixels and assert no horizontal overflow. Chromium automation and synthetic standard gamepad events are automated evidence only. Actual iOS Safari, Android Chrome, physical Xbox/DualSense controllers and Tesla firmware combinations remain unverified until a human device run is recorded.

## Manual evidence record

Record date, release SHA, OS/browser or Tesla model/computer/firmware, input device and USB/Bluetooth path. Check open/start/play/pause/restart/exit, disconnected pad, tab hidden, audio unlock, storage restore, rotation and any approved advertising return. A failed or partial result stays limited; do not promote it to verified.

## Release criteria

CI must pass on the PR head. Review the diff and public artifact. After merge, require successful deployment for the merge SHA and inspect root, both locales, detail/play routes, scripts, robots, sitemap, notices and HTTPS. Field Core Web Vitals, 20-minute device soak and ad revenue are not inferred from a passing build.

## Imported catalogue

Every admitted Crisp game has a Chromium load/input/pause journey at a 390px viewport, with no foreign requests and no horizontal overflow. Source and sprite hashes are checked by unit tests. Category tests cover cross-page alphabetical order and imported favorites/search. Held standard-controller input and frame isolation have synthetic regressions. These short automated journeys do not verify complete campaigns or physical phones/controllers/Tesla.
