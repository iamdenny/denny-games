---
title: "Cooking, table tennis and Ember Maze motion"
summary: "Two original saved solo campaigns and state-independent bomb maze effects."
read_when:
  - Changing Snack Street, Pocket Table Tennis or Ember Maze motion
---

# Cooking, table tennis and Ember Maze motion

## Status

Accepted — 2026-10-23.

## Decision

Add Snack Street (`snack-street`) and Pocket Table Tennis (`pocket-pingpong`) as original MIT games with lazy lifecycle modules, bilingual metadata, original SVG covers, visible rules guides and a three-game collection with Ember Maze. No commercial code, characters, maps or audio are imported.

Snack Street is a five-day, forty-customer campaign with three recipes, concurrent cooking, customer patience, coins, combos and day-end upgrades. Serving at least twenty-four customers wins. Its campaign is internal to one player stage. Pocket Table Tennis is a simplified solo league against three AI opponents, first to five points per match, with drive, spin and smash choices. It uses alignment-based automatic returns and a perspective canvas, not official table-tennis tournament rules. Both validate saved checkpoints and restore local progress through the shared player. Neither claims online or same-device multiplayer.

Ember Maze already implements solo and same-device duel modes. Improve that existing game rather than publish a duplicate: simulation-time actor interpolation, layered blasts, fuse urgency and bounded wall debris. Visuals never change bomb timing, collision rules, scores or saved data.

Reuse the existing motion controller and synthesized audio. Decoration does not own legal actions, timers or scoring. Pause, restart, reduced motion, low effects and destroy must settle or clear decoration; hidden/background play requires an explicit resume. New game IDs use the existing consent-aware GA4 start/completion path without sending inputs, recipes or scores. Advertising remains outside the live stage.

## Discovery and verification

Registry-driven routes produce bilingual canonical pages, structured data, search indexes and sitemap entries. Add substantive rules guides and `llms.txt` links; these do not guarantee indexing, ranking or AI inclusion. Do not call an implementation a verified analytics receipt or revenue result.

Require rules/save validation, real-input browser journeys, campaign progression, pause/reload/restart coverage, responsive screenshots and full repository verification. Keep browser emulation distinct from physical-device testing. Publish actual gameplay screenshots only after capturing the local runtime.
