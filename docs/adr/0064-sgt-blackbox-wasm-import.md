---
title: "ADR 0064 — Black Box local WebAssembly puzzle"
summary: "Run Simon Tatham's Black Box locally with a pinned MIT runtime and an isolated, pausable touch adapter."
read_when:
  - Changing Black Box source, licensing, runtime isolation, controls, or lifecycle
---

# Black Box local WebAssembly puzzle

Status: Accepted · 2026-10-25

## Context

Black Box is a deduction puzzle in Simon Tatham's Portable Puzzle Collection. Its grid hides five balls; beams enter at the edges and return hits, reflections or paired exit numbers. Different layouts can yield identical beam results. The source collection is MIT-licensed and publishes a browser build. This release pins source commit `616da16f25da428ccda805536209095bd062676e` (`20260923.616da16`) and the official HTML, JavaScript and WebAssembly bytes by SHA-256 in `vendor/sgt-blackbox/provenance.json`. The complete source archive and MIT notice are retained. The official archive host timed out during retrieval; the mirror copy was verified against an independently published digest and checked against the pinned source revision.

The original build expects same-origin `localStorage` for preferences and an externally fetched WebAssembly file. An opaque sandbox origin cannot use that storage, and allowing network access or `allow-same-origin` would weaken frame isolation. The official game menu is English-only, uses right-click to mark known squares, and has no host lifecycle or touch-specific marking control.

## Decision

Add one locally playable puzzle entry with a single player stage, no shared-shell score, touch and mouse metadata, bilingual host guidance, a rules guide, a local license/source page, original Denny Games cover art and a screenshot captured from the running game. Keep the engine out of the catalogue bundle through the lazy player loader. The original menu remains English; do not describe its independently generated puzzles as levels with guaranteed unique solutions. Puzzle progress is not saved. The upstream menu and status messages are documented as English-only.

Serve the official pinned runtime in a `sandbox="allow-scripts"` iframe without `allow-same-origin`, with a restrictive CSP that blocks connections, remote media, forms and nested frames. Inject the hash-checked WebAssembly bytes into the official JavaScript so startup makes no fetch. Replace preference storage with an in-frame memory value. Build output escapes the upstream script-close comment and parses both inline scripts before publication; every patch anchor and source hash fails closed if upstream changes.

The host adapter validates the iframe source, opaque message origin and per-load random channel before accepting readiness, errors or focus messages. It validates the reported canvas dimensions, gates input and animation until an explicit start, pauses animation and input together, and loads a fresh channel on restart. Leaving the frame or losing its focus pauses the shared player; only an explicit player action resumes. The Denny Games touch control maps taps to the upstream right-click marking action. Users turn Mark mode off before firing or changing guesses. No save bridge, score report, account data or online service is added.

Publish source commit, artifact hashes, complete archive and MIT notice at the local license page. Record the archive mirror retrieval and independent checksum evidence in the provenance note. Keep the upstream source and artifacts under `vendor/`; generated runtime and source copies live under `public/vendor/` and are produced by the build script.

## Consequences

The repository registry grows from 337 to 338 games; the local candidate ledger moves Black Box from port-required to integrated. Players get fresh puzzle generation, edge-beam clues, guess placement/removal, mouse marking and an accessible touch Mark mode. The upstream menu is still English, and a reload or restart starts a fresh puzzle. Browser emulation demonstrates the adapter contract but does not certify a physical iPhone, iPad, other tablet, controller or vehicle browser.

The long official JavaScript/WASM runtime is bundled locally so it works with network access blocked. This raises static artifact size and duplicates a source archive for license transparency; the 120 MiB aggregate budget remains the release ceiling. A compiler rebuild is not claimed: the deployed JavaScript and WASM are pinned official artifacts, with separate source revision and archive checks.

## Verification

The deterministic build verifies the official HTML, JavaScript, WebAssembly, archive, bridge and patch anchors, then parses both inline scripts before writing the isolated runtime and public notices. Unit coverage pins registry, source, license, archive and ledger counts. Chromium E2E checks English/Korean routes, local-only requests, opaque isolation, real canvas input, mouse marking, touch Mark mode, no input while paused, focus-loss pause, explicit resume, channel rotation on restart, stale-message rejection and destroy-by-navigation. WebKit/iPad-emulation coverage checks touch marking and phone/tablet/landscape bounds. Physical-device behavior, complete puzzle campaigns, search indexing/ranking, ad approval/serving and revenue remain separate evidence.
