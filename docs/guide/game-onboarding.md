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

Do not publish a game whose play action opens an external site, remote server or lobby. Research candidates can remain in `vendor/external-browser-listings.json`, but they do not belong in the public game registry. Free browser access does not grant code or asset redistribution rights. Import only after checking each component's license, pinning the complete source snapshot, auditing dependencies and adapting the game to the local lifecycle. See [inventory](open-game-inventory.md), [ADR 0009](../adr/0009-imported-games.md) and [ADR 0038](../adr/0038-local-play-only-catalogue.md).

Initial titles are Circuit Loop and Orbit Break (original rules/rendering) plus a clean-asset adaptation of MIT 2048. 2048 attribution and pinned upstream provenance are retained. No font, screenshot, music or packaging from the original is bundled. 191 Crisp sources are individually recorded and loaded through the restricted shared adapter. Bounce Back is a separate GPL-2.0-or-later import: retain its complete upstream source, artwork and license, keep the eval debug console out of the hosted runtime, and use the bounded opaque-origin adapter described in [ADR 0024](../adr/0024-bounce-back-gpl-adapter.md). Three other Crisp titles and remaining native/homebrew candidates retain pending dispositions. See [inventory](open-game-inventory.md) and [ADR 0009](../adr/0009-imported-games.md).

When the product requires local play, choose a source with clear redistribution rights, pin and hash its complete tracked snapshot, audit every runtime dependency and asset, and load the game through the shared player under our own origin. Local source and licensing evidence do not prove physical-device compatibility. Sokoban's separate native-module adapter is documented in [ADR 0034](../adr/0034-self-hosted-sokoban.md).

Gridland is a pinned MPL-2.0 import. Keep its modified runtime source and license online, serve all sprite sheets locally, enforce a no-network CSP in an opaque-origin iframe, and bridge only the four allowlisted save keys. The game's separate music terms were not verified, so audio, analytics, social sharing and donation integrations are excluded. See [ADR 0035](../adr/0035-self-hosted-gridland.md).

Five traditional board games now have independently written MIT rules, bounded AI, renderer and original SVG artwork. No code/assets from the researched candidate repositories are bundled. See [board PRD](../product/CLASSIC-BOARD-GAMES.md) and [ADR 0015](../adr/0015-classic-board-games.md). Their original artwork and browser screenshots are maintained separately from pinned third-party source hashes. UNDERRUN is a pinned MIT WebGL import with a separate Sonant-X zlib notice, source/asset hashes, and a custom sandboxed lifecycle/input adapter; see [ADR 0025](../adr/0025-underrun-webgl-adapter.md). Hextris is pinned under GPL-3.0-or-later with its source, dependency notices and responsive touch adapter; see [ADR 0026](../adr/0026-hextris-responsive-adapter.md).

## Original logic games

`src/games/logic/` contains the shared renderer and pure seeded rules for Lantern Grid and Number Trail. `src/data/logic-games.ts` registers both bilingual campaigns. Their SVG artwork in `public/art/` is project-authored; no third-party files are used. See [ADR 0043](../adr/0043-original-logic-pack.md) before changing generation, saves or scoring.
