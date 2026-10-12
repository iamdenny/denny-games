---
title: "ADR 0017 — Mobile game controls"
summary: "Prioritize the playable board on compact touch screens."
read_when:
  - Changing mobile player controls or game settings
---

# Mobile game controls

## Status

Accepted · 2026-10-12. Extends ADR 0016.

## Context

At 320×568, persistent match selectors and help pushed the board into internal scrolling, while the shell controls wrapped into two rows. Default focus also scrolled the stage when starting. Merely preventing horizontal overflow did not establish mobile usability.

## Decision

The lifecycle context exposes an optional settings host. Classic boards place mode, difficulty and detailed help there and remove those nodes on destroy. Keep turn, board, selected coordinates, confirmation and precise direction buttons in the stage. Pair coordinates with confirmation; keep shell pause/restart/sound/settings on one 48px row on phones. Use safe-area viewport fitting, 44px language links and 16px settings selects. Focus game input without scrolling the stage. Preserve browser zoom and authoritative two-step board confirmation.

## Consequences

Match options take one additional settings tap. The board gets more space, especially on short phones. Games without a settings host fall back to inline options. Dense Gomoku intersections cannot each become 44px without making the board scroll; selected coordinates, second-tap confirmation and 48px direction buttons provide a precise alternative.

## Verification

Test 320×568, 360×640, 390×844, 430×932, 667×375 and 844×390, with desktop regression. Check full board bounds, initial stage scroll, single-row shell controls, settings access and cleanup, touch confirmation, swipe cancellation and orientation changes. Chromium checks and screenshots are browser evidence; physical iOS/Android/Tesla remain separate.
