---
title: "Consented game lifecycle analytics"
summary: "Renew consent before measuring minimal game starts and completions."
read_when:
  - Changing analytics consent or game lifecycle measurement
---

# Consented game lifecycle analytics

## Status

Accepted — 2026-10-23. Supersedes the page-view-only event scope in [ADR 0031](0031-opt-in-ga4-page-views.md).

## Decision

The shell may send custom GA4 `game_start` and `game_complete` events, with only `game_id` plus the existing sanitized page context, after explicit consent. The existing consent key now stores `granted-v2`: an old `granted` value is undecided and must be renewed. Existing denials remain effective. Both language variants explain the expanded collection before acceptance.

Start means the shell starts a round, not a page load or restart button click. Resume does not count twice. Completion means a terminal round result, including a loss or draw; it does not imply winning. Restored results do not emit the shell end event. A completion requires a start observed while consent was active; historical events are never replayed. Restart/load reset the active round. Withdrawal resets the active round and disables future commands, even if persistence fails. Storage failure prevents new permission from enabling collection.

Do not send scores, result messages, inputs, search terms, seeds, stage selections or identifiers. The game ID must match the current player's built-in ID. Advertising consent remains separate. Keep Enhanced Measurement disabled in the provider stream; this implementation does not change account settings.

## Verification

Unit tests cover old consent, denial, storage failure, withdrawal, duplicate lifecycle events and payload fields. Browser consent tests cover both languages and direct game entry. Local command assertions establish instrumentation behavior, not provider receipt. After deployment, separately inspect GA4 Realtime/DebugView with an explicitly consenting test session; game-level reporting may require registering `game_id` as an event-scoped custom dimension in GA4. No dashboard receipt or custom-dimension configuration is implied by source changes.

API reference: [Google tag event command](https://developers.google.com/tag-platform/gtagjs/reference#event).

## Provider setup readback — 2026-10-23

The release operator inspected GA4 property `559130393` and the `Denny Games Web` stream `16134201570`. Its URL is `https://games.iamdenny.com`, and measurement ID `G-5NZLTVBG5Y` matches the website configuration. The stream interface reported data received during the preceding 48 hours; Enhanced Measurement was unchecked. The operator created and read back the event-scoped custom dimension **Game ID**, parameter `game_id`.

This confirms the selected provider destination and reporting dimension. It does not establish receipt of the newly implemented `game_start` or `game_complete` events, which still require a consenting post-deployment test. The operator's local setup screenshot is `/tmp/denny-retro-ga-game-id.jpg`; it is session evidence, not a published artifact.
