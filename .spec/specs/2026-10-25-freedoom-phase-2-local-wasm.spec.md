---
summary: "Add Freedoom Phase 2 as an in-site, locally hosted WebAssembly campaign."
read_when:
  - Changing Freedoom source, licenses, runtime isolation, touch controls, saves, or artifact budgets
title: "Freedoom Phase 2 local WebAssembly import"
status: "in-progress"
date: "2026-10-25"
base_commit: "448fbb2c8412c491c097ee265386142d28b8c59b"
target: "."
project: "src/data, src/games, public/vendor/freedoom, vendor/freedoom, scripts, tests, docs"
context_hint: "denny-games.architect"
tier: "L"
test_approach: "tdd"
---

# Freedoom Phase 2 local WebAssembly import

## Overview

Add exactly one local game entry for the official Freedoom Phase 2 campaign, using Chocolate Doom 3.1.1 compiled to WebAssembly and Freedoom 0.13.0 game data. Phase 2 contains 32 maps. Do not bundle commercial Doom files or describe this release as including Phase 1 or FreeDM. The upstream engine interface remains English; the Denny Games guide, host controls, loading/error states, and license information are bilingual.

The browser runtime must use the site's lazy player lifecycle. The host fetches its fixed local runtime files and transfers them into an opaque-origin iframe. The frame cannot make network requests or access the parent DOM. It receives touch controls for movement, firing, and use, and pauses its engine loop whenever the player pauses, leaves the foreground, or focuses host controls.

## Must Have

- Pin the Chocolate Doom source snapshot, Emscripten adaptation, engine build version, official Freedoom 0.13.0 release, WAD SHA-256, generated JavaScript/WebAssembly/data hashes, and every applicable license and credit.
- Keep the corresponding engine source and build instructions available in the public source repository. Do not claim an independently reproducible binary build unless the exact compiler inputs and output are reproduced.
- Add one typed registry entry for Freedoom Phase 2. Keep the engine out of catalogue bundles and use one shell stage; the 32-map campaign remains internal game progression and is not presented as 32 catalogue games or shell scores.
- Load only fixed same-site files. Use an `allow-scripts`-only opaque iframe and CSP with `connect-src 'none'`; pass the runtime script, WASM bytes, and official WAD from the parent through a channel-bound message. Reject stale frames and messages.
- Keep the play action disabled and show localized loading copy until the child reports that the engine is initialized and ready.
- Preserve the game's 16:10 stage with a 640×400 Emscripten buffer scaled 2× to fit the rendered 320×200 scene. Provide bilingual keyboard and touch controls for moving, turning, firing and using doors. Do not expose save/load controls or browser persistence because save round-trip safety is not established.
- Implement start, pause, resume, restart, no game-state serialization, flush acknowledgement without durable game data, and destroy. Pausing releases held input and suspends both the game loop and pending Emscripten Asyncify sleeps. Destroy aborts host fetches, timers, listeners, and the iframe.
- Explain before play that the first load downloads about 12.4 MiB (13 MB) of gzip-compressed game and engine files. Clearly disclose that Chocolate Doom's in-game menu remains English. Do not claim physical phone, tablet, controller, or Tesla support from browser emulation.
- Publish the game, guide, source/license page, original catalogue art, and a screenshot captured from local gameplay. Keep all user-facing copy and errors in English and Korean.
- Keep the existing 5 MiB per-file ceiling by compressing and splitting the Freedoom data. ADR 0067 updates the total static output ceiling to 140 MiB, with the existing Neverball-only 28 MiB exception unchanged.

## Acceptance

- Exactly one public local game is added. Its route, controls, source and license links, title, guide, sitemap and search metadata agree in both languages.
- The selected campaign loads from the official Freedoom WAD whose hash matches release 0.13.0. No commercial Doom IWAD is present.
- Chromium starts a playable map in an opaque-origin frame. The frame has no network permission, only locally hosted game files load, and no external request or uncaught runtime error occurs.
- A delayed engine script keeps Start disabled during loading and enables it only after the child reports ready.
- Keyboard and touch controls change gameplay. At 320, 360, 390, 430, 820 and 1440 CSS-pixel widths, the stage keeps its aspect ratio, controls stay reachable, and the page has no horizontal overflow.
- Pause freezes the game including its initial screen wipe; held keys are cleared; paused input cannot advance it; explicit resume works. Restart starts a fresh map. Destroy removes the frame, aborts pending work, and ignores messages from older frames.
- Do not expose browser save persistence unless the exact WAD/runtime round-trip is separately validated. This release keeps progress in the current session and discloses that restart/reload resets it.
- `npm run verify`, the complete browser suite, the targeted Freedoom browser journey, format checks, and artifact/license audits pass before PR. After merge, verify the Pages deployment SHA and public game, guide, play, and license routes.
- Browser automation is not physical-device, controller, Tesla, search-ranking, or advertising evidence.

## TODOs

- [x] Verify the candidate WAD bytes against official Freedoom 0.13.0 release and record provenance facts.
- [x] Smoke-test the candidate engine in a local browser and prototype asset transfer into an opaque, no-network sandbox.
- [x] Audit and pin the engine source, Emscripten pause patch, build instructions, complete notices and generated runtime hashes.
- [x] Qualify automatic map start, pause/resume through an initial screen wipe, keyboard and touch input, and gzip WAD decoding with the pinned runtime.
- [x] Add the typed game entry, lazy adapter, opaque child, session-only progress disclosure, download note and bilingual touch controls.
- [x] Add and test original artwork, actual gameplay screenshot, bilingual guide, and public license/source page.
- [x] Add output-size, provenance, iframe isolation, no-network, pause/input, responsive and teardown regressions.
- [x] Update classic expansion candidate disposition, ADR index, inventory, commands/testing/codemap as needed.
- [ ] Run remaining release checks, review changes manually, create PR, merge, deploy, and read public routes against the merged SHA.

## Behavior Sequence Matrix

| ID    | Sequence                                                                | Expected                                                                                                                                        | Evidence                                    |
| ----- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| BSM-1 | Play route, host fetches fixed assets, sandbox receives runtime and WAD | Phase 2 starts; child origin is opaque; no foreign or child-origin network request                                                              | Targeted Chromium journey and network audit |
| BSM-2 | Start, hold movement/fire, release, pause, attempt input, resume        | Movement/fire respond while running; pause freezes and clears held input; explicit resume continues                                             | Targeted browser journey                    |
| BSM-3 | Play, restart frame, reload page                                        | Progress stays session-only and restarts at the first map; no browser save data is written                                                      | Targeted lifecycle browser journey          |
| BSM-4 | Restart, stale old-frame message, locale change/flush, destroy          | Fresh map starts; stale messages do not mutate state; the no-save flush allows navigation without claiming persistence; destroy leaves no frame | Targeted lifecycle journey                  |
| BSM-5 | Resize phone portrait, phone landscape, tablet, desktop                 | Canvas remains 16:10 and touch controls fit without page overflow                                                                               | Chromium/WebKit responsive journeys         |

## Plan Validation

- **Result:** manual-pass. The required architect persona file is absent; the repository's architect context was followed directly. Reviewed the PRD, architecture, ADRs 0009, 0045, 0058, and 0064, the testing and onboarding guides, current player/lifecycle types, and the Neverball and Black Box adapters.
- **Architecture:** fits the static registry, lazy game-loader, opaque-frame, fixed-asset parent transfer, localized host-copy, and public license/source patterns.
- **Product:** only the 32-map Phase 2 campaign is in scope. It is one game, not a claim to include every Freedoom mode or support every device.
- **Release risk:** the 140 MiB output budget is documented in ADR 0067; the unchanged per-file cap is 5 MiB with the existing 28 MiB Neverball exception. The 28,787,748-byte WAD is gzip-compressed and split into three parts, each below 4 MiB.

## Unknowns

- The candidate source repository identifies Chocolate Doom 3.1.1 and Emscripten 4.0.14, but its browser-specific source modifications and generated artifacts have not yet been independently rebuilt.
- Official Freedoom 0.13.0 release notes say savegame buffer overflow errors remain. This release omits save/load controls and durable host persistence.
- The current candidate browser page has no touch controls, durable save bridge, host pause integration, or opaque-origin policy. A local prototype confirmed that parent-transferred JS/WASM/WAD can run in an opaque frame under `connect-src 'none'`; product integration and browser regression remain required.
- The candidate runtime binaries have not been independently rebuilt. The Denny Games Asyncify pause patch is separately pinned and hash-checked during the static build.

## Stop Conditions

- Stop if the WAD hash or rights cannot be verified, the engine source and notices cannot be identified, or the actual runtime requires proprietary Doom data.
- Do not publish if the frame requires `allow-same-origin`, foreign network access, or unreviewed active dependencies.
- Do not claim durable saves until an actual save/load round-trip passes. If it fails, disclose restart/session behavior and keep user navigation from implying a successful save.
- Do not publish unless keyboard/touch input, pause/resume, no-network behavior, teardown, responsive stage fit, and the bounded release artifact all pass.
