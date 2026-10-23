---
title: "Six original browser games"
summary: "Add six distinct original games through the existing static player and discovery contracts."
read_when:
  - Adding or reviewing the six-game release
---

# 0057 — Six original browser games

## Status

Accepted.

## Context

The catalogue needs distinct complete games with readable small-screen controls and original assets. Increasing catalogue size must preserve the existing lifecycle, localization, consent and rights boundaries.

## Decision

Add six original MIT games through typed registry entries and lazy player imports:

- Minefield Watch: three minefields, 6×6 with six mines, 7×7 with nine, and 8×8 with twelve. The first opened cell and its neighbors are safe. Reveal all safe cells to win; flags are reversible notes. Seeded layouts do not promise guess-free solutions.
- Mosaic Mystery: twelve original 5×5 or 6×6 nonograms with exactly one clue solution each. Paint or cross cells without a timer; crosses are optional and errors can be corrected. Complete the exact filled picture to win.
- Traffic Escape: twelve original sliding-vehicle stages with a target vehicle and exit.
- River Hop: five crossing stages, with three lives in each stage.
- Meteor Guard: one shell stage containing five twenty-second waves.
- Pocket Bowling: one shell stage containing a ten-frame round.

Keep rules in pure engines and decorative motion in the shared GSAP lifecycle. Motion callbacks never decide outcomes. Mines and nonograms share a small board presentation helper under minefield-watch; they keep independent rule engines and saved-state validators. Dense grids support selection plus a separate 48px confirmation control. Mode controls, pause, restart, resize settlement and destroy cleanup remain explicit.

Every game supplies English/Korean metadata, a substantive rules guide, original cover art and a separate actual-gameplay preview. Existing player analytics and advertising adapters remain responsible for consent. No new remote service or dependency is introduced.

## Consequences

Each completed stage reports one result. Restored terminal saves use the existing restored-result path to avoid duplicate completion events. Scores, browser-local checkpoints and stage selection use the existing shell, without account sync. Preview images and discovery markup do not establish search indexing, ranking, advertising delivery or provider-side analytics receipt.

## Verification

Required evidence includes pure rule tests, finite campaign or stage checks, nonogram uniqueness enumeration, malformed-save rejection, native input and pause/reload/restart journeys, restored terminal behavior, reduced motion, and 320/390/1440 plus short-landscape layouts. Run repository verification and browser regression checks before merge. CI, deployment, public readback and physical-device testing remain separate evidence states.
