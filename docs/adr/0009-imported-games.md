---
title: "Imported game runtime"
summary: "Self-host pinned Crisp games in restricted frames and keep rights and device evidence separate."
read_when:
  - Adding third-party games or changing the embedded runtime
---

# Imported game runtime

## Status

Accepted — 2026-10-11.

## Context

The user requested the researched open games organized by category. The research has 294 candidates, including native ports, asset exceptions and games with their own dependencies. A public repository does not make every file eligible for immediate release.

## Decision

Admit 191 of the 194 deduplicated Crisp sources after source/asset inventory. Keep source commits and hashes in `vendor/crisp/provenance.json`, the original runtime bundle in `vendor/crisp/runtime.upstream.js` and full MIT notices under `/licenses/crisp/`. The runtime commit is 4df7621bdacd97e6f66ce481902d2188d02b9930. A checked patch script adds input, pause, score, result and error hooks. Use canvas themes and shell-generated sound instead of optional Pixi/CDN/music dependencies. Inline bitmap characters and procedural drawings remain part of the MIT sources. Four titles also use pinned PNG sprites reviewed under the same repository MIT notice; their individual paths/hashes are recorded. Images are mapped to local data URLs inside the sandbox to avoid tainted sprite canvases.

Load only the selected game inside `sandbox="allow-scripts"`, without same-origin privileges. Its CSP denies connections, forms and foreign scripts. The bridge accepts only its parent window, exact parent origin and random channel; the host pins the frame window, opaque origin and channel. A frame-local memory store supports original high-score calls without access to site storage. Normal best scores stay in the shell. No seed/daily or mid-round restore claim is made for imported games.

Chain Drift, Comet Slash and Volt Keeper use independent arcade cycles and extra image/audio dependencies, so they remain outside this shared adapter. They were admitted in separate restricted frames with localized touch controls by [ADR 0027](0027-crisp-cycle-owned-games.md). Every research candidate has a disposition in `vendor/catalogue-review.json`; pending entries are not fake playable cards. Non-web games require a separate lawful port, runtime and asset review.

## Consequences

The catalogue contains 194 playable entries: three existing games and 191 imports, across puzzle, arcade, action, shooting, racing and sports. Pointer games use a mouse/touchscreen; the standard-pad bridge maps axes to a virtual pointer and A to a held press. DIGI10 also has accessible number buttons and controller selection. Physical controllers, phones and Tesla remain unverified.

Home previews are bounded; categories have real 24-entry static pages. Client sorting/filtering works over the full category index and maintains query/page state. The library renders only saved/recent IDs. Daily challenges stay limited to the three deterministic games.

## Verification

`npm run verify`, browser regressions, source-hash checks and the full imported-game load/input/pause audit are required. Automated short journeys verify loading and pause boundaries, not every late-game rule or device combination. The all-import audit is available as `npm run test:imports` against a running preview. Its report is written to ignored `test-results/import-audit.json`.
