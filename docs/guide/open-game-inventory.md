---
title: "Open game inventory"
summary: "Where published games, provenance and the complete research disposition are recorded."
read_when:
  - Reviewing catalogue coverage or onboarding more open games
---

# Open game inventory

The playable registry includes Circuit Loop, Orbit Break, the credited 2048 adaptation, five original board games, 191 ABA Games Crisp titles, Bounce Back and UNDERRUN, for 201 games total. Each import has English/Korean controls, a primary category, a fixed source commit, original notices and self-hosted files. Names remain the authors' original English names. In-canvas bitmap text remains upstream English; navigation and instructions are bilingual.

The seven primary categories are board, puzzle, arcade, action, shooting, racing and sports. They describe the main interaction, not an assertion that a miniature steering game is a full vehicle simulator. Counts are computed from the registry. No empty categories or placeholder games are published.

## Rights records

- `vendor/crisp/provenance.json`: fixed upstream revisions, per-game source hashes and procedural asset review.
- `public/licenses/crisp/`: original three game-bundle notices, runtime MIT and Lodash MIT.
- `vendor/bounceback/provenance.json`: pinned GPL-2.0-or-later source and hashes for Bounce Back, its tile sprite and title-screen image. `public/licenses/bounceback/` provides the full license and corresponding-source links.
- `vendor/underrun/provenance.json`: pinned MIT source and hashes for UNDERRUN's game, level maps and texture; the modified Sonant-X module keeps its separate zlib notice. `public/licenses/underrun/` provides both notices and source links.
- `vendor/catalogue-review.json`: a disposition for all 294 research entries. Integrated, port-required and rights-or-integration-review are distinct.
- `scripts/build-crisp.mjs`: reproducible, checked runtime hooks. Original game source files are not rewritten.

Three recently added Crisp titles (Chain Drift, Comet Slash, Volt Keeper) need their independent lifecycle and extra assets audited. Other candidates include native/homebrew ports and separately licensed assets. They are recorded for follow-up rather than offered as broken games or external embeds.

Bounce Back adds a boomerang roguelite with generated rooms, enemy variants, pickups, a shop and a final boss. The original source and sprite are retained under GPL-2.0-or-later; the debug console containing eval is preserved as source but excluded from the hosted runtime. Its touch/gamepad bridge and local progress are automated in Chromium, while physical devices remain unverified.

UNDERRUN adds a three-level WebGL twin-stick shooter. Its MIT source and level/texture images are pinned; modified Sonant-X code has a separate zlib notice, and the composer credit is preserved. The host adds touch movement/aim, standard gamepad movement/fire/aim, sound and pause/resume in a no-network opaque-origin frame. Chromium coverage does not establish physical phone, controller, or Tesla support.

## Player differences

Imports restart on page reload or language change; the shell saves personal best scores, favorites and recent plays. They do not participate in daily seeded challenges. Optional upstream music/WebGL effects are disabled; the shared sound switch controls simple shell-generated effects. A connected standard controller can move a virtual pointer and hold A; Start and disconnect pause. Mouse/touch remains available after controller use. DIGI10 uses number keys or the on-screen number buttons.

See [runtime decision](../adr/0009-imported-games.md), [onboarding](game-onboarding.md) and [testing](../testing.md).

Sky Golf keeps its course/stroke counter inside the game and does not use the shell score panel. Imported games have no artificial numbered stages; their stage selector is hidden.

## DANGO CSP arithmetic adaptation

The original DANGO uses `Function` to calculate collected integer expressions. CI exposed a CSP failure when a scoring branch was reached. Its unchanged upstream `main.js` and source hash are retained. The build emits `main.csp.js` with a restricted addition/multiplication parser preserving normal precedence; only DANGO loads that derivative. No eval permission or sandbox privilege is added. A deterministic browser regression executes the scoring branch for ordinary, leading-operator and empty expressions. See `host_adaptations` in the provenance record.
