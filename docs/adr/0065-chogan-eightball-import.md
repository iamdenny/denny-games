---
title: "ADR 0065 — Chogan 8-Ball Pool local import"
summary: "Run pinned Chogan 8-Ball Pool locally with Korean UI, AI and pass-and-play modes, and an opaque no-network frame."
read_when:
  - Changing Chogan 8-Ball Pool source, licensing, controls, language or runtime isolation
---

# Chogan 8-Ball Pool local import

Status: Accepted · 2026-10-25

## Context

Chogan's 8-Ball Pool is a short-match billiards game with canvas table physics, three AI difficulties, a same-device two-player mode and a daily table mode. The selected upstream commit is `2c6d6d80b25aad8a6fc4987d0f347a445493780e` (`0.16.0`). The game, shared Chogan UI, cue-physics module and CSS declare MIT. The bundled Vazirmatn variable font has a separate SIL Open Font License 1.1 notice. This import includes only the game page, shared runtime/physics/style, font, version metadata, README and license; all retained files have SHA-256 entries in `vendor/chogan-eightball/provenance.json`.

The upstream page uses a Chogan application header, a first-run tutorial, local storage and app-specific currency/reward results. Its own language list does not include Korean. The daily challenge needs a game-specific seeded date and completion tracking, while Denny Games' shared daily completion callback does not own the imported game's internal result. The game does not require a network service, but the static catalogue must run games inside a restricted local frame.

## Decision

Add one sports catalogue entry. It represents one 8-ball game, not its AI difficulties as separate titles or stages. The existing New frame dialog exposes AI Easy/Medium/Hard or two players on one device. Each new frame creates a fresh rack. Do not expose the upstream daily-table route until its date seed and Denny Games completion reporting can be verified together. No online matchmaking is claimed.

Serve the game at `/vendor/chogan-eightball/games/eightball/index.html` with `sandbox="allow-scripts"` and no `allow-same-origin`. A restrictive CSP permits only local scripts, styles, fonts and generated canvas data; it blocks network connections, workers, forms, downloads, nested frames and external media. The upstream game uses only locally served assets and generated Web Audio. Preserve the MIT game license and the separate font OFL notice at `/licenses/chogan-eightball/`.

The host creates a random channel for each load. The player accepts messages only from that iframe's window, with opaque origin `null` and the current channel. The child accepts only parent messages matching its parent origin and the current channel. The bridge announces bounded viewport dimensions, gates requestAnimationFrame work and pointer input during pause, cancels held fine-aim repeats when paused, pauses on focus loss, forwards supported gamepad actions as the game's keyboard controls, and connects the host sound/volume settings. Restart rotates the channel and starts a fresh frame.

Select English or Korean from the Denny Games route. Add Korean labels to the imported game and shared controls. Use the Denny Games guide instead of the upstream first-run tutorial, keep the game's Help button available, hide the upstream back/fullscreen exits, and omit the upstream share action and currency rewards. The site player owns leave, fullscreen, pause and result shell behavior. Do not claim cross-load saves or persistent records. Provide original Denny Games cover artwork and a gameplay screenshot captured from the local runtime.

## Consequences

The public catalogue gains one locally playable billiards title with pointer, keyboard and mapped gamepad controls. Players can choose three AI difficulties or pass one device between two people. The gameplay itself displays a new match after a fresh rack is requested. The route description, rules, guide, license record and load errors are bilingual.

The upstream daily-table challenge is not exposed as a Denny Games daily completion because the shared shell cannot report this imported game's completion without a dedicated result contract. The game has no online matchmaking. Leaving or reloading discards the current frame. The upstream app's profile, persistent rewards, share destinations and navigation are outside this import's scope. Browser emulation does not certify physical phones, tablets, gamepads or vehicle browsers.

## Verification

The build checks the exact upstream file inventory and hashes, adapter hashes, and every source patch anchor before generating public files. It parses the bridge, runtime and game scripts before publication. `npm run verify` checks types, unit/scale rules, docs, static output and SEO. Chromium and mobile browser coverage checks local-only requests, opaque frame isolation, bilingual labels, mouse/touch/keyboard/gamepad actions, AI and two-player mode selection, pause/resume, fresh-channel restart and responsive bounds. Source/rights routes and public game/detail/guide routes are checked after deployment. Physical-device behavior, search indexing/rank, ad approval/serving and revenue remain separate evidence.
