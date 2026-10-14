---
title: "Bounce Back GPL import and isolated runtime"
summary: "Pin and distribute a GPL-2.0-or-later action roguelite in an opaque-origin frame."
read_when:
  - Reviewing Bounce Back source, licensing, runtime isolation or input behavior
---

# Bounce Back GPL import and isolated runtime

## Status

Accepted — 2026-10-14.

## Context

The catalog needed an action game with a longer progression loop than the existing short Crisp imports. Bounce Back adds boomerang aiming and return physics, procedural rooms, enemy variants, pickups, a shop and a final boss. Its upstream repository is GPL-2.0-or-later, and the source tree includes a debug console that evaluates entered text.

## Decision

- Pin upstream commit 395fd046338e6c5d5840d10e7fbd74132f90b8f6. Preserve and hash every upstream file, including the tile sprite, screenshot and debug source. Keep the complete GPL text and link to both upstream and corresponding Denny Games source.
- Serve the playable game in a dedicated iframe with sandbox allow-scripts only. Its CSP denies network, forms, object/embed and non-self scripts; no same-origin privilege is granted. The frame validates its parent, opaque origin, source window and per-instance random channel.
- Do not load gameEngineDebug.js. The complete debug file remains available in the source distribution, but its eval console is not part of the hosted runtime.
- Apply only asserted build-time changes: gate and restart the animation loop for pause/resume, initialize after the parent supplies saved data, honor the common sound and volume controls, and expose a ready signal.
- Bridge only the four upstream numeric progress keys kbap_coins, kbap_warp, kbap_bestTime and kbap_won. Validate them as bounded decimal strings on both sides. This preserves gems and unlocks locally; leaving the page starts a new run. No cloud state is added.
- Map keyboard and mouse controls directly. Touch uses a left-side movement drag and a right-side aim/throw drag. Standard gamepad axes move and aim, A throws, and Start pauses. Physical devices remain unverified.
- Keep the import separate from catalogue bundles and preserve GPL attribution on the game and license pages.

## Consequences

The catalog grows to 200 games in seven categories. Bounce Back is highlighted as an editorial selection based on its visible mechanics, not measured user preference. The special adapter and local-storage bridge need their own regression journey. The GPL files and host changes remain inspectable from the deployed source links.

Automated Chromium evidence does not establish a complete campaign, subjective fun, physical phone/controller support, or Tesla compatibility.

## Verification

The build verifies upstream SHA-256 hashes and exact patch anchors. Browser coverage checks load, sandbox isolation, no foreign requests, controls, save round-trip, sound, pause and restart. Public URLs and the deployment SHA must be read after release.
