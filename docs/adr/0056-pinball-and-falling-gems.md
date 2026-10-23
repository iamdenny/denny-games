---
title: "Original pinball and falling gems"
summary: "Two original solo games with deterministic rules, validated local saves and bilingual discovery."
read_when:
  - Changing Star Pinball or Jewel Drop
---

# Original pinball and falling gems

## Status

Accepted — 2026-10-23.

## Decision

Add Star Pinball (`star-pinball`) and Jewel Drop (`jewel-drop`) as original MIT games. All table geometry, code, gem graphics, cover art and bilingual copy are project-authored. No commercial game files, names, music or characters are imported. Both are solo games with lazy runtime modules, local progress and existing shared consent-aware analytics and advertising boundaries.

Star Pinball uses three balls, a waiting launch state, two player-controlled flippers, bumpers and targets. The result is decided after all three balls drain: finish with at least 1,500 points to win. Reaching the goal earlier does not stop the round. The fixed-step simulation owns collisions and scoring; visual effects cannot award points or extend ball life. This is a simplified original arcade table.

Jewel Drop uses a six-by-twelve board and vertical groups of three gems. Move, rotate, soft drop or hard drop the group. Equal-gem lines of at least three match horizontally, vertically and along both diagonals. Resolve intersecting matches once, apply gravity and repeat for chains before spawning the next group. Clear sixty gems to win; an obstructed spawn loses. Distinct shapes and colors identify gem types. Persist the generator state to retain the next preview when resuming.

Both use validated raw game state inside the shared save envelope. Restore score immediately; restored terminal rounds use the existing restored-result flag to avoid duplicate completion analytics. Pause stops simulation and clears held input. Restart and destroy settle decoration and release listeners/RAF. Shared GSAP feedback follows reduced-motion/low-effects settings; the shared optional Three.js victory effect remains separate from game rules.

## Discovery and evidence

Publish original covers, real gameplay screenshots after capture, English/Korean rules guides and a curated collection with Orbit Break. Registry routes generate canonical metadata, structured data, sitemap and search entries; `llms.txt` links visible rules. Search indexing, AI citation, advertising fill/revenue and GA4 provider receipt are separate outcomes, not implementation claims.

Verify pure rules, save boundaries, actual input journeys, pause/reload/restart, terminal restoration, collision/chain behavior, 48px controls and desktop/mobile viewport fit. Run full repository checks and browser tests before merge and read back public URLs after deployment. Browser emulation does not certify physical phones or vehicles.
