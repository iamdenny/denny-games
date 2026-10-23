---
title: "ADR 0060 — Original local Klondike Solitaire"
summary: "Add a bilingual, self-contained Klondike card game with two stock draw styles and validated local continuation."
read_when:
  - Changing Klondike rules, card interaction, or saved rounds
---

# Original local Klondike Solitaire

Status: Accepted · 2026-10-24

## Context

The catalogue has many arcade and board games but no locally playable classic solitaire card game. Research records include externally hosted card games, which cannot be published under the local-play-only policy. Klondike rules are a familiar card-game variant, but Denny Games must provide its own game code, UI and artwork rather than copy a researched host.

## Decision

Add `klondike-solitaire` as an original TypeScript game under the repository MIT license. Bundle no third-party code, card images, fonts, sounds or remote assets. Include the standard seven-column layout, four suit foundations, Draw 1 and Draw 3 stock modes, unlimited waste recycling, face-up sequence moves, King-only empty columns, undo, hint and a new shuffled deal.

Use large DOM card buttons with tap-to-select and tap-to-place interactions. Keep all game text bilingual. Expose nearby directional focus and confirm actions for keyboard/gamepad use. Store the current deal, draw style, move history and bounded undo snapshots in the existing per-game browser save. Validate card conservation, foundation order, tableau ordering and snapshot bounds before restoring. A new deal explicitly replaces the current one; selecting the next draw style alone does not.

Publish the game detail, static rules guide, search terms and gameplay screenshot through the typed registry. Add the title to the thinking-games home preview. Do not claim that every shuffle is solvable, popularity is measured, or a physical device has been certified.

## Consequences

The repository registry grows from 335 to 336 locally playable games. The game provides one card-table mode with two stock draw rules and unlimited redeals rather than presenting shuffles as campaign stages. Current progress remains in this browser; there is no account, online leaderboard or server connection.

## Verification

Unit tests cover deterministic full-deck deals, Draw 1/Draw 3, stock recycle, legal and illegal pile moves, card exposure, foundations, winning state and corrupted-save rejection. Browser tests cover both locales, selecting a draw style, drawing, undo, hints, new deals, reload persistence, keyboard/gamepad focus and 320–1440px viewport bounds. CI, deployment SHA and public English/Korean route readback remain separate release evidence. Search indexing, ranking, traffic, physical-device behavior, advertising approval and revenue are not established by these checks.
