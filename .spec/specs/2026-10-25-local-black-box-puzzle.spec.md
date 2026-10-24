---
summary: "Add Simon Tatham Black Box as a locally hosted WebAssembly puzzle."
read_when:
  - Changing Black Box source, licensing, runtime isolation, controls, or lifecycle
title: "Local Black Box WebAssembly puzzle"
status: "complete"
date: "2026-10-25"
base_commit: "9cc8d283d94957d6aff8d21f89b7f1732b6d68f9"
target: "."
project: "src/data, src/games, vendor/sgt-blackbox, public/vendor/sgt-blackbox, public/licenses/sgt-blackbox, public/art/open-games, tests, docs"
context_hint: "denny-games.architect"
tier: "L"
test_approach: "tdd"
---

# Local Black Box WebAssembly puzzle

## Overview

Add exactly one local game, sgt-blackbox, from Simon Tatham Portable Puzzle Collection source commit 616da16f25da428ccda805536209095bd062676e. The source collection uses the MIT license. The official collection provides a JavaScript and WebAssembly build. The game hides balls in a grid; players infer positions by firing beams from the edges and observing hits, reflections, and paired exits. Different arrangements may have identical beam behavior, so do not claim every puzzle has a unique solution.

## Must Have

- Preserve the complete pinned upstream source and MIT notice. Record exact source/runtime hashes, source commit, official artifact URLs or reproducible build/toolchain, and every host adaptation in vendor/sgt-blackbox/provenance.json.
- Verify the supplied official JavaScript and WebAssembly load in an opaque-origin allow-scripts iframe with network blocked. Keep all runtime bytes local. Do not widen permissions to allow same-origin or remote connections.
- Add a deterministic build step that validates provenance hashes and emits the isolated local runtime and public source/license notices.
- Add one registry entry with one shell stage, no external-play route, no shell score, and only verified input modes. Keep the engine behind the lazy game loader.
- Provide bilingual host instructions, errors, catalogue and guide copy. Clearly disclose any English-only upstream controls.
- Ensure phone and tablet layouts support firing, placing/removing guesses, checking a solution, and any essential secondary action. Provide an accessible touch alternative where required.
- Implement start, pause, resume, restart, serialize and destroy. Focus loss must pause and block input; only explicit user action resumes.
- Add original catalogue artwork and a screenshot captured from the local game.
- Update candidate disposition, ADR index, inventory and relevant release/product docs. Do not add Space Huggers.

## Acceptance

- Exactly one local title is added; no external game/runtime request occurs.
- The official runtime initializes in the opaque frame under restrictive CSP and cannot access the parent DOM.
- Runtime source and compiled artifacts have pinned hashes checked during build; public license/source information points to the exact upstream commit.
- English and Korean host copy covers controls, rules, hints and errors; no unsupported score, stage, save, compatibility, popularity or translation claim is made.
- Browser automation demonstrates mouse/touch core actions, focus-loss pause, blocked paused input, explicit resume, fresh restart, stale-message rejection and destroy cleanup.
- Automated browser evidence is not presented as physical-device certification.

## TODOs

- [x] Add source and runtime provenance tests, then pin the full upstream snapshot and verified official build artifacts.
- [x] Add a deterministic build script and public MIT/license/source page; prove the runtime works without external fetches.
- [x] Add the lazy adapter and narrow lifecycle bridge; validate source, opaque origin, channel and generation before accepting messages.
- [x] Add bilingual typed metadata, guide, artwork, quick-play placement and route entries.
- [x] Add unit, E2E, mobile-emulation, no-network, pause/resume/restart/destroy, and license-output coverage.
- [x] Update ADR 0064, ADR index, inventory, candidate ledger and docs.
- [x] Run npm run verify, browser tests, format check, and local preview readback before PR.

## Behavior Sequence Matrix

| ID    | Sequence                                                                                 | Expected                                                                    | Evidence      |
| ----- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| BSM-1 | Local play route, iframe load, WASM ready, explicit start, fire beam, place/remove guess | Board responds; only local assets loaded                                    | E2E game test |
| BSM-2 | Running game, pause or focus loss, attempt a second action                               | Player is paused and board does not change                                  | E2E game test |
| BSM-3 | Explicit resume, valid action, restart, stale old-frame message, destroy                 | Input resumes; restart is fresh; stale message is ignored; frame is removed | E2E game test |

## Stop Conditions

- Do not publish if source/license or runtime artifact provenance cannot be established.
- Stop if the WebAssembly runtime requires allow-same-origin, remote connections, or any unreviewed code.
- Do not publish until touch actions and pause/destroy semantics satisfy the lifecycle contract.

## Unknowns

- The official JavaScript and WebAssembly files are pinned by SHA-256 from Simon Tatham's published Black Box build alongside the matching source commit. Rebuilding the official compiled bytes independently from that source snapshot has not been verified, so this release makes no reproducible-build claim.
- Verify actual upstream pointer/touch behavior, runtime loop, keyboard handling and storage/network use.
- Verify the runtime works in browser automation under opaque-origin and no-network policy.
