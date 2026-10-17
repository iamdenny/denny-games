---
title: "Self-host Sokoban as a bilingual local game"
summary: "Pin MIT rules and levels, then render them through the shared Denny Games player."
read_when:
  - Reviewing Sokoban source, licensing, localization, save behavior or input
---

# Self-hosted Sokoban

## Status

Accepted — 2026-10-17.

## Context

The latest game batch included outbound play links. Players should begin and play inside Denny Games. Candidate games also need a clear redistribution license, a pinned source snapshot and a playable integration that fits the common lifecycle.

sen-ltd/sokoban provides MIT-licensed TypeScript rules, a push-optimal breadth-first solver, dead-square analysis, and six original levels verified by its upstream tests. It has no runtime dependencies. The upstream DOM shell is a standalone Vite application and does not use the shared player.

## Decision

- Pin commit fb38f850151476809b6c65d86789912a9b0c4776 and retain every upstream tracked file in vendor/sokoban/upstream/.
- Verify every file path and SHA-256 before each build. Publish the complete source snapshot, provenance and MIT license under /vendor/sokoban/source/ and /licenses/sokoban/.
- Use only the upstream pure rules, solver and six level definitions from a separately loaded src/games/sokoban/ module. Draw the board with a Denny Games adapter rather than running the upstream application shell.
- Localize all visible game controls and status into English and Korean. Offer keyboard/WASD, touch direction buttons and the shared gamepad directions.
- Keep undo, reset, level selection, dead-square visualization and push-optimal solver in the game. Run solver search in a web worker and stop its animation when the shared player pauses.
- Save completed level numbers in this browser. An incomplete level restarts after a page reload; no account or network service is used.
- Use an original Denny Games title-card illustration. Do not use the upstream screenshot as product artwork.

## Consequences

The game is indexed and playable at /en/play/sokoban/ and /ko/play/sokoban/. The page remains the canonical Denny Games detail page, while its play route runs the local game module. The game adds one local game, not an outbound listing.

Chromium browser tests can verify route generation, one-tile movement, level completion, controls, local save boundaries and viewport fit. They do not verify physical phones, tablets, controllers, Tesla, subjective enjoyment or search ranking.

## Verification

npm run build checks the pinned upstream inventory and hashes before emitting the public source and license. Unit tests replay the solver's result through every bundled level. Browser journeys cover English and Korean gameplay, viewport sizes and same-site resource loading. Full repo verification, PR review, CI, deployment and public URL readback remain separate release gates.
