---
title: "Classic expansion release evidence"
summary: "Five playable additions and explicitly unfinished native-port work."
read_when:
  - Checking classic expansion verification and publication
---

# Classic expansion release evidence

## Scope

Three original games (Amber Trail, Starlight Apprentice, Beacon Quest) and two local native imports (Neverball easy set, Neverputt original course) increase the catalogue from 209 to 214. Strategy and simulation categories contain real playable games. See [tracking](../guide/classic-expansion.md) for the remaining requested ports and proprietary-rights boundary.

## Local verification

- `npm run verify`: passed, including 90 unit tests, type diagnostics, documentation, scale fixture, build/artifact and SEO checks.
- Full Playwright suite: 578 passed. This includes all six platform stage completions, both language versions of the 24-week simulation and final RPG boss route, gamepad-neutral regression, native local gameplay/pause/reload and native restart persistence.
- `npm run format:check`: passed.
- CUA Chrome: Korean apprenticeship start/action rendered and advanced the week and resources. Playwright captures cover game previews and native 390px portrait layout. Physical phones/controllers remain unverified.
- Graphify: refreshed local ignored AST graph, 6,393 nodes and 10,379 edges. Fourteen metadata/source files produced no nodes; graph output is not runtime evidence.
- Read-only security, quality and architecture reviews produced three observations describing two defects: gamepad direction sticking and native restart erasing persistent records. Both were corrected; focused re-review found no remaining P0–P2 defect. No findings were silently omitted. The repository lacks the skill's optional CI review scripts; source review and repository-native checks were used.

## Remote CI follow-up

The first remote run passed 577/578 browser tests. Linux native pointer capture redirected a Neverputt host Pause click into the canvas. Native capture was disabled while retaining in-frame motion, and the test now explicitly asserts that the canvas does not hold pointer lock before using host controls. Subsequent CI status is recorded on the PR.

## Publication

PR, CI, merge and public deployment are separate gates. At this source checkpoint local checks are complete; remote CI and public readback are pending. The final task response records the actual PR and deployed SHA after verification.

## Remaining work

Freedoom's emulated native build was stopped before a usable artifact existed. SuperTux's official web package includes a 326.7 MB data file; its full asset review and delivery architecture remain incomplete. OpenTTD, Pingus, Wesnoth and SuperTuxKart remain unimplemented ports. None are counted as published. No proprietary original assets or licensing agreements were acquired.

## Follow-up verification

Combined main browser validation exposed an inherited locale-link loading race (579/580 passed). With external scripts blocked, both current local output and public main `76008ab1f4512e23093bcfa3896ee296f275e06f` dropped `?ref=shared` on the same locale switch. The shared site script and header had no task changes. Header query preservation now runs inline before interaction; a blocked-script regression covers both directions.

The remote combined run reached the 15-minute job limit before browser completion; two failure markers had no final details. CI now uses the line reporter to expose failures immediately. Workflow timeout changes were not pushed because the available GitHub credential lacks workflow scope.

The line-reporter run completed 579/580 browser tests, with only the Amber Trail stage-5 test failing after a win had already recorded a score and exposed the next-stage control. Its global repeated Space input could activate the newly focused Restart button between the visibility check and key dispatch. The test now atomically checks the overlay and dispatches attack input to the canvas; all six stages passed twice (12 runs). Locale navigation checks also passed (12 tests), and `npm run verify` passed after the inline-header fix.
