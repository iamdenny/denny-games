---
title: "Open game inventory"
summary: "Where published games, provenance and the complete research disposition are recorded."
read_when:
  - Reviewing catalogue coverage or onboarding more open games
---

# Open game inventory

The playable registry includes Circuit Loop, Orbit Break, the credited 2048 adaptation, and 191 ABA Games Crisp titles. Each import has English/Korean controls, a primary category, a fixed source commit, original notices and a self-hosted game file. Names remain the authors' original English names. In-canvas bitmap text remains upstream English; navigation and instructions are bilingual.

The six primary categories are puzzle, arcade, action, shooting, racing and sports. They describe the main interaction, not an assertion that a miniature steering game is a full vehicle simulator. Counts are computed from the registry. No empty categories or placeholder games are published.

## Rights records

- `vendor/crisp/provenance.json`: fixed upstream revisions, per-game source hashes and procedural asset review.
- `public/licenses/crisp/`: original three game-bundle notices, runtime MIT and Lodash MIT.
- `vendor/catalogue-review.json`: a disposition for all 294 research entries. Integrated, port-required and rights-or-integration-review are distinct.
- `scripts/build-crisp.mjs`: reproducible, checked runtime hooks. Original game source files are not rewritten.

Three recently added Crisp titles (Chain Drift, Comet Slash, Volt Keeper) need their independent lifecycle and extra assets audited. Other candidates include native/homebrew ports and separately licensed assets. They are recorded for follow-up rather than offered as broken games or external embeds.

## Player differences

Imports restart on page reload or language change; the shell saves personal best scores, favorites and recent plays. They do not participate in daily seeded challenges. Optional upstream music/WebGL effects are disabled; the shared sound switch controls simple shell-generated effects. A connected standard controller can move a virtual pointer and hold A; Start and disconnect pause. Mouse/touch remains available after controller use. DIGI10 uses number keys or the on-screen number buttons.

See [runtime decision](../adr/0009-imported-games.md), [onboarding](game-onboarding.md) and [testing](../testing.md).

Sky Golf keeps its course/stroke counter inside the game and does not use the shell score panel. Imported games have no artificial numbered stages; their stage selector is hidden.
