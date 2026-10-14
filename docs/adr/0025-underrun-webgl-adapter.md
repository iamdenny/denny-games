---
title: "UNDERRUN WebGL import and isolated runtime"
summary: "Pin the MIT WebGL shooter and add a restricted frame with touch and shared gamepad controls."
read_when:
  - Reviewing UNDERRUN source, rights, WebGL or input behavior
---

# UNDERRUN WebGL import and isolated runtime

## Status

Accepted — 2026-10-14.

## Context

The catalog needed an open-source 3D browser game. UNDERRUN is a compact 2018 WebGL twin-stick shooter with three levels and local source/assets. The upstream repository is MIT licensed; its modified Sonant-X module carries a separate zlib license, and the original music credit names Andreas Lösch. The upstream keyboard/mouse controls did not match the site's touch and gamepad lifecycle.

## Decision

- Pin upstream commit `f933e29152d7fc1ca61d4b3eaa8b29551d7d7a62`. Preserve the full checked-out file snapshot byte-for-byte under `vendor/underrun/upstream/` and verify all 31 files by SHA-256 on every build.
- Publish the complete MIT license, separate Sonant-X zlib notice, original author/music credits, upstream source link, and corresponding Denny Games adapter source link.
- Build a separate static WebGL frame. Keep it in `sandbox="allow-scripts"` without same-origin access. Its CSP denies connections, media, forms, nested frames and objects; game textures are inlined as data URLs so WebGL has no cross-origin image fetches.
- In the generated engine only, guard the upstream terminal timer so an omitted callback becomes a no-op function rather than `undefined`. Chromium treats `setTimeout(undefined, ...)` as string code and blocks it under the frame CSP. Keep the original upstream file unchanged and assert the patch anchor during each build.
- Validate the parent window, parent origin, opaque-origin response, and per-instance random channel. Expose only ready, pause, error and completion signals plus normalized input and sound controls.
- Pause the animation loop when the host pauses or the frame loses focus, report focus loss to the host, and reset elapsed frame time on resume. Keyboard/mouse remain available. A left-side touch drag moves; a right-side drag aims and fires. The host's standard gamepad mapping uses the left stick to move, A to fire, D-pad to aim, and Start to pause.
- Keep the three in-game levels inside one shell stage. Show no artificial stage selector, result score, saved campaign or daily challenge. Leaving the frame restarts the run.
- Keep physical phone, controller and Tesla compatibility unverified until tested on those devices.

## Consequences

The playable catalog grows to 201 games, with UNDERRUN in shooting. The runtime stays outside catalogue bundles and makes no external requests. The adapted source is inspectable from the source repository, and license notices are linked from both localized game pages.

Automated Chromium evidence can establish browser rendering, controls, isolation, no external requests, and pause/restart behavior. It cannot establish subjective fun, full-campaign completion, physical-device support, Tesla compatibility or revenue.

## Verification

The build verifies every upstream hash and file path before emitting the data-URL assets and frame runtime. Browser regression checks WebGL context creation, sandbox separation, keyboard/gamepad/touch input, pause/resume/restart and request isolation. `npm run verify`, the browser suite, PR CI, deployed release hash and public URL readback remain separate gates.
