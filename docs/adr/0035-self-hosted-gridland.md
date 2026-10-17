---
title: "Self-host Gridland with local assets and a bounded save bridge"
summary: "Run the pinned MPL-2.0 match-and-survive game inside the Denny Games player."
read_when:
  - Reviewing Gridland redistribution, runtime isolation, browser storage or input support
---

# Self-host Gridland

## Status

Accepted — 2026-10-17.

## Context

Gridland was listed as an outbound browser game even though its source is published under MPL-2.0. The product requirement is that imported games begin and play inside Denny Games. The upstream runtime requests sprite sheets from a third-party CDN and includes analytics, donation, sharing and audio modules. Music has a separate composer credit, but its license was not confirmed. The browser game stores three save slots and options in `localStorage`.

## Decision

- Pin upstream commit `06af02c3af7062aead04a1e6f67b6e59f3e4b6a1`; hash every retained source file and document excluded files.
- Add Gridland to the typed game registry and remove its outbound listing. Its route runs the game from local Denny Games assets.
- Keep the original game code and graphics under MPL-2.0, publish the corresponding source, retain the complete MPL text and dependency notices, and attribute Michael Townsend.
- Replace remote sprite URLs with local files. Remove the developer-site link and upstream analytics, audio, social-share and donation behavior. Do not redistribute the unverified music.
- Run the game in an `allow-scripts`-only opaque-origin iframe with a no-network CSP and a per-instance message channel. The parent accepts messages only from that frame, from the opaque origin, on the matching channel.
- Bridge only `gameOptions` and `slot0`–`slot2`; bound each value and the total snapshot before saving through the existing browser-local player storage. A checkpoint request forces an upstream save before returning the bounded snapshot.
- Keep Gridland's three-slot picker interactive after the host start screen; never choose a save slot automatically.
- Support touch and mouse board gestures. Keep the game’s upstream interface in English while the Denny Games page, rules and controls remain bilingual.

## Consequences

Gridland becomes a locally playable game at `/en/play/gridland/` and `/ko/play/gridland/`; the catalog remains 356 pages, with 207 local games and 149 outbound listings. Progress is local to this browser and device. The game remains silent in this hosted version. Gamepad support and actual iPhone/iPad/Android/Tesla behavior are not claimed.

## Verification

The build verifies every pinned source hash and emits the license and corresponding source. Unit checks verify registry counts and rights records. Browser coverage exercises the sandbox, blocked off-site requests, real board input, save restoration, pause/resume and phone/tablet layouts. Automated browser evidence does not establish physical-device support or search ranking.
