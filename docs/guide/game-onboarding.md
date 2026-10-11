---
title: "Game onboarding"
summary: "Rights review and typed module registration."
read_when:
  - Working on game onboarding
---

# Game onboarding

1. Record author, fixed source commit, code/assets/fonts/music/levels licenses and exceptions. A root LICENSE alone is insufficient.
2. Keep original notices and corresponding source where required. Remove unreviewed assets; never import commercial ROM collections.
3. Implement the common lifecycle and normalized actions. Scope pointer capture to the board, release listeners and animation frames on destroy.
4. Add a registry entry with English/Korean content, primary category, original thumbnail, controls, expected duration, source, rights review and evidence.
5. Add rules tests and a playable browser journey. Mark physical input/device evidence honestly.
6. Generate static routes/search/sitemap and run all release checks.

Initial titles are Circuit Loop and Orbit Break (original rules/rendering) plus a clean-asset adaptation of MIT 2048. 2048 attribution and pinned upstream provenance are retained. No font, screenshot, music or packaging from the original is bundled. 191 Crisp sources are now individually recorded and loaded through the restricted shared adapter; three other Crisp titles and remaining native/homebrew candidates retain pending dispositions. See [inventory](open-game-inventory.md) and [ADR 0009](../adr/0009-imported-games.md).
