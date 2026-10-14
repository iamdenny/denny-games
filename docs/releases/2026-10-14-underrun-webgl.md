---
title: "UNDERRUN WebGL game release"
summary: "Add a pinned MIT WebGL shooter with an isolated runtime and touch/gamepad controls."
read_when:
  - Reviewing the UNDERRUN open-source game release
---

# UNDERRUN — 2026-10-14

## Change

- Add UNDERRUN as the 201st title in shooting. It has three levels in one run, WebGL rendering and pixel-art textures; optional upstream music/effects stay disabled in the emitted runtime.
- Pin upstream commit `f933e29152d7fc1ca61d4b3eaa8b29551d7d7a62` and retain hashes for all 31 repository files.
- Publish the full MIT notice, the separate Sonant-X zlib notice, and the original game and composer credits.
- Add an opaque-origin `allow-scripts` frame with a no-network CSP, data-URL textures, parent message validation, pause/resume, and host sound controls.
- Add bilingual instructions for keyboard/mouse, split-screen touch and the site's standard gamepad mapping. Physical phone/controller and Tesla behavior remain unverified.

## Verification

- `npm run verify` passed: 64 unit tests, documentation checks, the 1,000-game scale fixture, the 902-page static build, artifact audit and SEO audit.
- `npm run test:e2e` passed: 454 Chromium tests, including the UNDERRUN WebGL isolation, gamepad, touch, pause, restart and CSP checks.
- `npm run format:check` passed.
- Independent security, gameplay-quality and page-design reviews found no open high-priority issues after fixes.
- PR CI, merge, deployment and public URL readback are tracked separately. Automated browser coverage does not establish full-campaign completion, subjective fun, physical-device compatibility or revenue.
