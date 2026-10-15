---
title: "Daily completion and return"
summary: "Track actual daily round completion locally and link remaining challenges."
read_when:
  - Changing daily challenge discovery or completion
---

# Daily completion and return

## Status

Accepted — 2026-10-15.

## Context

Three native games already support a shared UTC-date seed, but their daily page did not show completion or comparable records. Opening a daily route could also inherit a saved stage, so different visitors did not necessarily start at the same stage.

## Decision

Use stage 1 for daily links and as the default for `daily=1`; explicit stage parameters still work. A daily completion requires a real shell end callback, a supported game, today's daily seed and stage 1. A loss or zero score still completes a round. Normal, earlier-date and other-stage rounds do not count. Merely opening, starting or pausing does not count.

Store only the current UTC day and each game's rule version and best completed score in the bounded `denny-games:v1:daily-rounds` key. Validate data when reading, ignore stale versions for display, replace the date on a new day's first completion, and use the existing memory fallback when storage is unavailable. These records are editable personal browser data, not competition results.

Show date, completed-round count and records on the daily page; show the summary on home. Explain that completion means finishing one round regardless of winning. Refresh after return, storage changes and UTC rollover while foregrounded; use the device clock. Static daily links remain available without JavaScript.

At a qualifying daily round end, replace ADR 0029's generic next-game action with the first remaining daily game. After all available challenges are complete, link the daily summary. Normal result recommendations remain governed by ADR 0029. Keep result-only text hidden during setup, pause and replay.

## Consequences

This adds one bounded local record and no remote collection, streak, ranking or reward claim. Clearing or blocking browser storage can erase or prevent records across page navigation. A round left open past UTC midnight can still finish, but does not mark the new day's board complete. Real retention and device behavior require separate evidence.

## Verification

Unit checks cover score/version validation, zero scores and UTC boundaries. Browser checks finish an actual Circuit round, verify persisted completion and the next daily route, exercise saved-stage defaults, pause, reload, home readback, date rollover, denied storage, no-JavaScript links and narrow/tablet layouts.
