---
title: "Classic game expansion tracking"
summary: "Playable implementations, provenance, port obstacles and rights boundaries."
read_when:
  - Continuing the classic game expansion
---

# Classic game expansion tracking

## Current repository status — 2026-10-25

The initial batch below is a historical implementation snapshot, not the current game count. The repository registry now contains 339 locally playable games and no external-play entries; production publication is checked separately against the deployed SHA and public routes. See the [open game inventory](open-game-inventory.md) for the current source count and candidate dispositions.

## Initial implementation batch — 2026-10-22

| Game | Scope | Rights and source |
| --- | --- | --- |
| Amber Trail | Six original platform levels, gems, combat, local progress | Original MIT code and drawings |
| Starlight Apprentice | 24-week raising simulation, resources, festivals, seven careers | Original MIT code and drawings |
| Beacon Quest | Three valleys, keys, workshops, combat, final boss | Original MIT code and drawings |
| Neverball | Official 25-map easy set, native preferences/records | Pinned upstream GPL source and separate notices |
| Neverputt | Original 18-hole course, native preferences (not round scores) | Same reviewed runtime, separately selected game mode |

Neverball provenance is in `vendor/neverball/provenance.json`. The matching source archive and unchanged runtime downloads are retained in `upstream/`; `scripts/build-neverball.mjs` checks every hash. The runtime request constructor is changed only in generated output. The adapter installs the local course list before starting the engine. Legal notices are exposed at `/licenses/neverball/NOTICE.txt` with upstream texts and font exceptions. Audio is omitted rather than fetching upstream music.

Original games are distinct short works, not ports or licensed remakes of commercial classics. The registry had 214 playable entries after these five additions in that release snapshot. That historical count does not describe today's catalogue.

## Remaining requested ports

| Candidate | Current evidence | Remaining work |
| --- | --- | --- |
| Freedoom | Official 0.13.0 free data downloaded; GPL wasm-doom source build attempted using Emscripten 3.1.65 | Local emulated build did not advance past SDL2 compilation and was stopped; needs a validated build, then license packaging, controls/save/audio and browser tests |
| SuperTux | Official wasm artifact from source `7a38ea7aa599200a9cacca7413d78e65026eebdf` inspected: 326,682,520-byte data and 8,095,863-byte Wasm | Review complete asset notices; design explicit large-asset distribution; adapt lifecycle and mobile controls |
| OpenTTD + open basesets | Upstream has an Emscripten build workflow | Build/pin engine and open graphics/audio, audit separate licenses, adapt UI/save, validate long sessions |
| Pingus | Native engine; upstream web/GLES port work is incomplete | Rendering/input port, assets audit and browser qualification |
| Battle for Wesnoth | Native strategy game and substantial campaign assets | Browser build, input/save, asset distribution and separate notices |
| SuperTuxKart | Large native 3D game | Web rendering/runtime port, size strategy and device qualification |

These are not published playable entries. No placeholder is counted as a game. A successful native build alone is not evidence of a usable web port.

## Commercial classics

Prehistorik (고인돌), Astonishia Story (어스토니시아 스토리) and Princess Maker (프린세스 메이커) original code, characters, music, dialogue, maps and branding are not copied. A newly written engine or port is not a substitute for permission to distribute protected game content. Original-inspired development can reuse general genre ideas while creating distinct expression. Any licensed original release still requires an applicable agreement; no rights-holder messages or licensing approvals are recorded here.

## Validation boundaries

Original rules include deterministic restoration tests; browser tests cover full campaign/season routes and all six platform stages. Native tests cover local course startup, rendering, input, pause and reload, with no upstream network requests. Responsive emulation covers original games at 320/360/390/430/1440 px. Actual physical devices remain unverified. See the test output and release record for executed results rather than treating this test description as a pass claim.
