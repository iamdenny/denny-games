---
title: "ADR 0063 — PACKABUNCHAS local puzzle import"
summary: "Host PACKABUNCHAS locally with a bounded save bridge, pauseable opaque frame and explicit five-mode scope."
read_when:
  - Changing PACKABUNCHAS source, controls, save behavior or runtime isolation
---

# PACKABUNCHAS local puzzle import

Status: Accepted · 2026-10-24

## Context

The reviewed open-game inventory includes PACKABUNCHAS, a colorful tile-packing game with five modes and touch controls. Its pinned upstream repository declares MIT and retains an MIT license. The game bundles generated ZzFX and ZzFXM audio code; upstream credits both libraries, and their MIT notices are retained separately. The source also contains Stack Exchange code excerpts with date-dependent CC BY-SA 3.0 and 4.0 terms. Their authors, dates, links, adaptation notes and licenses are recorded in the third-party notices and provenance. One linear-interpolation helper that linked to a CodePen Pen of unverifiable license status has been replaced with an equivalent local expression; both original and adapted source hashes are recorded. Its gameplay source has no remote asset or service requirement.

The catalogue must publish one locally playable title, not count its five modes as five games or as shell stages. The upstream game expects localStorage, runs an animation loop, schedules story and tutorial timers, and plays generated background music. It is English-only and exposes touch/mouse actions without keyboard or gamepad controls.

## Decision

Add PACKABUNCHAS as one puzzle game with five original modes, one shell stage, touch and mouse inputs, a hidden shell scoreboard and no shell score claim. Mark it as an internal-score game so the shared zero-valued scoreboard is not shown. Retain the pinned source repository and MIT license, documenting the local interpolation-helper replacement; publish separate ZzFX/ZzFXM MIT notices and date-specific CC BY-SA attributions. Pin the original and adapted source file hashes and publish corresponding license/source links.

Serve the game through an `allow-scripts`-only opaque-origin iframe with a no-network CSP. Keep the engine in its own static vendor runtime and behind the lazy player loader. The host bridge validates a random channel and message source, replaces the upstream storage calls with a five-key allowlist (`currentGameMode`, `polyLeft`, `storyState`, `muted`, `showTutorial`), and bounds saved values. Freeze animation frames and timers and suspend background music while paused. When the running iframe loses window focus, request a host pause so shared player state, save behavior and overlay stay synchronized. Keep host instructions and errors bilingual; disclose that the imported in-game story and controls remain in English.

Publish bilingual detail and how-to-play routes, an original Denny Games cover, an actual local gameplay screenshot, truthful touch/mouse-only metadata, a pre-start keyboard/gamepad limitation and one thinking-games quick-play entry. Do not claim physical phone/tablet/browser certification, keyboard/gamepad input, popularity, search ranking, ad approval or revenue.

## Consequences

The repository registry grows from 336 to 337 games. The title is searchable as a local tile-packing/polyomino puzzle. Its five modes remain modes within the same title; the imported game handles its own puzzle progression. Save data stays in this browser and never leaves the site. The upstream MIT project and embedded CC BY-SA excerpts retain distinct license scopes in the public notices. The unavailable external interpolation source is no longer included.

The upstream game interface is English-only, and its portrait board leaves space in landscape layouts. Denny Games localizes the description, rules, guide and host controls. Browser automation does not establish real-device behavior.

## Verification

The build verifies every pinned source hash and each localStorage patch anchor before generating the frame and notices. Unit/scale/build/SEO and docs checks run through `npm run verify`; browser coverage checks no external requests, opaque isolation, save restoration, mode selection, pause/resume, English/Korean host routes, phone/tablet layouts and overflow. CI, merge, Pages deployment, deployed SHA and public route readback are recorded separately. Physical devices, actual search indexing/rank, ad approval/serving and revenue remain unverified.
