---
title: "ADR 0067 — Freedoom Phase 2 local WebAssembly campaign"
summary: "Publish the official Freedoom Phase 2 campaign with a locally hosted, paused and touch-controlled WebAssembly engine."
read_when:
  - Changing Freedoom data, Chocolate Doom source, artifact budget, frame isolation, controls or saves
---

# Freedoom Phase 2 local WebAssembly campaign

Status: Accepted · 2026-10-25

## Context

Freedoom is free game data that requires a Doom-compatible engine. Official release 0.13.0 includes three separate products: Phase 1, Phase 2 and FreeDM. This decision imports only `freedoom2.wad` from Phase 2. The 28,787,748-byte WAD matches the official release asset by SHA-256. No commercial Doom data, Phase 1, FreeDM or unreviewed music is included.

The Chocolate Doom 3.1.1-derived WebAssembly runtime comes from a pinned public browser port and is distributed under GPL-2.0-or-later. The runtime uses Emscripten 4.0.14 and includes browser-specific source changes for frame callbacks, pause/resume exports and runtime/canvas handling. The corresponding engine source archive, build notes, Emscripten/SDL2 notices, Freedoom BSD-3-Clause notice and credits are retained and published. The exact generated binaries have not been independently reproduced; provenance does not claim a bit-for-bit reproducible build.

The 28,787,748-byte engine data package is much larger than the normal 5 MiB artifact limit. Gzip compresses it to 11,112,488 bytes; splitting the stream into three local parts keeps every new file below 5 MiB. The existing total site ceiling is 120 MiB.

## Decision

Add one catalogue game for the official 32-map Phase 2 campaign. Keep its engine out of catalogue bundles and use the static player's lazy factory. The original game menu remains English; all Denny Games descriptions, guides, touch controls, download notes, errors and license information are bilingual. Do not advertise save persistence: browser progress is session-only and restart/reload resets it.

Serve checked JavaScript, WebAssembly and game data from fixed same-site paths. The host transfers their bytes to an `allow-scripts`-only iframe with an opaque origin. The child CSP sets `connect-src 'none'` and blocks frames, workers, media, forms and other resources. Validate frame source, opaque origin and random channel on every parent message. Pause/resume controls the engine main loop and releases held keys. Add touch buttons for movement, turning, firing, doors and running.

Deliver the compressed WAD in three fixed same-site parts, then use the browser's gzip stream decoder to reconstruct the verified 28,787,748-byte WAD in memory. Keep the 5 MiB per-file ceiling unchanged, including the existing Neverball-only exception, and raise the total artifact ceiling to 140 MiB. The exact output size and gameplay journey are recorded by the release verification; the total remains a hard stop.

## Consequences

The registry grows by one game. Players can run the Phase 2 campaign on Denny Games without an external game host; the first load transfers about 12.4 MiB (13 MB) of compressed game and engine data. The WAD expands in memory. No controller, physical phone/tablet or vehicle browser compatibility is implied. Restart and page reload return to the first map. Commercial Doom files remain outside the project.

The source archive and notices add a small bounded amount to the static output. The browser runtime and game data stay outside catalogue chunks and are loaded only on the play route. A successful host build or Chromium journey does not establish search ranking, physical-device behavior, advertising approval or revenue.

## Verification

Build verifies exact runtime, compressed-WAD, decoded-WAD and corresponding-source hashes. Artifact audit enforces the 140 MiB total and unchanged 5 MiB per-file ceiling, with only the existing Neverball data exception. Browser journeys cover local assets only, opaque origin, no-network CSP, gzip decoding, keyboard and touch input, pause/resume, restart channel rotation, destroy and responsive bounds from 320 to 1440 CSS pixels. Public Pages readback checks the deployed SHA, game, guide, play and license/source routes after merge. Physical-device, search, ads and revenue claims remain separate evidence states.
