---
title: "Crisp arcade cycles with localized touch controls"
summary: "Run selected ABA Games titles with their own arcade phases in restricted frames and expose comfortable touch and gamepad inputs."
read_when:
  - Adding or adapting a Crisp game that owns its arcade cycle
  - Reviewing touch controls, source hashes or local score behavior for these imports
---

# Crisp arcade cycles with localized touch controls

## Status

Accepted — 2026-10-14.

## Context

Chain Drift, Comet Slash and Volt Keeper are MIT browser games from the ABA Games Crisp 12-game repository. Each owns its title, campaign, score table and synthesized audio rather than using the shared Crisp mini-game lifecycle. They also use keyboard controls and, for two titles, additional local assets or audio modules. Routing them through the generic adapter would either lose their lifecycle or leave touch users without movement and action controls.

## Decision

- Pin the three game sources, Comet Slash's generated pixel-art sources, Chain Drift's logo and Volt Keeper's audio modules to upstream commit `8c71950c93008235a7e63401aba66cbb67d82421`. Record SHA-256 for every included file in `vendor/crisp-cycles/provenance.json`; reject symbolic links and paths outside each game's source directory before hashing or copying, then verify hashes before each production build.
- Keep the original files unchanged under `vendor/crisp-cycles/upstream/`. Build self-hosted game files and a separate index for each title under `public/vendor/crisp-cycles/`. Reuse the locally pinned Crisp 1.5.0 runtime; load no CDN scripts, fonts, images, audio or levels.
- Run each game in `sandbox="allow-scripts"` without same-origin access. Its CSP denies connections and forms. The parent and frame validate their window, origin and per-instance random channel before exchanging run, input, score or sound messages.
- Map an accessible, localized direction pad and action button to the original arrow and Space inputs. Standard gamepad axes, D-pad and primary-button events use the same frame bridge. Release every held key on pause and frame teardown.
- Keep each original attract, game-over and score-table flow in the frame. The host score panel remains hidden; scores stay in frame memory for the open play page and are not represented as saved progress. No campaign stage selector or daily seed is added.
- Keep source in-canvas text English and translate surrounding instructions, touch labels and errors. Browser input tests do not establish physical phone, controller or Tesla support.

## Consequences

The catalog grows to 205 games: 40 arcade and 63 action titles. These additions improve distinct arcade variety; their inclusion is not a popularity or player-demand measurement. The three score tables reset when the play page is left or reloaded. The remaining device and full-campaign evidence gates stay open.

## Verification

The build and unit tests check source and asset hashes. Chromium journeys cover all three starts, mobile direction/action input, pause/resume, touch layout, iframe isolation and no foreign requests. Full campaign completion and physical-device behavior remain separate evidence.
