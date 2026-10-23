---
title: "Testing"
summary: "Automated release checks and physical-device boundaries."
read_when:
  - Working on testing
---

# Testing

All-game stage fitting (ADR 0021) asserts maximal aspect-correct bounds across native and imported families. Every imported game's frame and actual inner canvas are checked at 390×844 and 800×600 while paused ticks stay unchanged. Bounce Back has a dedicated journey for isolated loading, keyboard/touch/gamepad input, save restoration, sound, pause and restart. UNDERRUN checks its opaque WebGL frame, separate stick-move and D-pad-aim mapping, touch, pause on host-control focus loss, restart and request isolation. Hextris checks both locales, source/license links, opaque-origin isolation, external request blocking, large touch buttons, portrait/landscape square fit, rotation, pause, hard-reload checkpoints, locale-save rejection and blocking of locale changes after missing acknowledgement or failed browser-storage writes. Gridland checks both routes, local asset loading, the opaque sandbox, no off-site requests, all three save slots, touch-drag and mouse tile moves that resolve to a settled match, bounded saves, pause/resume and phone/tablet viewport fit. Player viewport tests include portrait, square, wide, very wide and numeric-input surfaces; WebKit runs the same layout families. Native actions/settings must clean up on remount. Public screenshots and release SHA readback are required after deployment; physical Tesla repeat checks remain separate.

Tests cover puzzle solvability, deterministic UTC seeds, 2048 merges, arcade timestep behavior, storage failure, ad rejection/no-fill and game cleanup. Browser checks exercise home/detail/play/pause/restart, locale state persistence, favourites, search, daily challenges and no display ads in play.

Playwright starts its own static preview and does not reuse an arbitrary server already listening on the test port. The default port is 4321; set `PLAYWRIGHT_PORT` to another unused port when needed, for example `PLAYWRIGHT_PORT=56421 npm run test:e2e`.

Responsive checks use 320, 360, 390, 430 and 1440 CSS pixels and assert no horizontal overflow. Chromium automation and synthetic standard gamepad events are automated evidence only. Actual iOS Safari, Android Chrome, physical Xbox/DualSense controllers and Tesla firmware combinations remain unverified until a human device run is recorded.

## Manual evidence record

Record date, release SHA, OS/browser or Tesla model/computer/firmware, input device and USB/Bluetooth path. Check open/start/play/pause/restart/exit, disconnected pad, tab hidden, audio unlock, storage restore, rotation and any approved advertising return. A failed or partial result stays limited; do not promote it to verified.

Daily challenge browser checks cover the seven-date UTC window, previous-day retention, one-day storage migration, malformed and expired entries, browser-local summary, language routes and 320px layout. This does not establish real-player retention or physical-device behavior.

Daily challenge sharing checks the localized invite labels and titles, the same-site `daily=1&stage=1` launch URL, native share payload, manual URL fallback without JavaScript, successful stage-1 launch and phone/tablet widths. Link sharing does not establish that a recipient opened or played it.

## Release criteria

Root-entry browser checks cover Korean/English and unsupported browser locales, ordered preferences, query/fragment preservation, explicit locale URLs, manual switching, back navigation and JavaScript-disabled fallback links/metadata. See `tests/e2e/locale-entry.spec.ts` and ADR 0019.

CI must pass on the PR head. Review the diff and public artifact. After merge, require successful deployment for the merge SHA and inspect root, both locales, detail/play routes, scripts, robots, sitemap, notices and HTTPS. Field Core Web Vitals, 20-minute device soak and ad revenue are not inferred from a passing build.

## Imported catalogue

Complete-catalogue tests follow all native next links in both languages with JavaScript disabled, compare every rendered card ID with the registry, open the final game's detail page and check 320/360/390/430/1440px layouts and same-page language navigation. SEO audits enforce exact catalogue coverage in both local and public HTML; the scale fixture repeats coverage for 1,000 entries across 42 pages.

Every shared-adapter Crisp game has a Chromium load/input/pause journey at a 390px viewport, with no foreign requests and no horizontal overflow. Chain Drift, Comet Slash and Volt Keeper have separate cycle-frame journeys for start, touch direction/action input, pause/resume, no remote requests and responsive touch controls. Source, sprite and audio hashes are checked by unit tests and the build. Category tests cover cross-page alphabetical order and imported favorites/search. Held standard-controller input and frame isolation have synthetic regressions. These short automated journeys do not verify complete campaigns or physical phones/controllers/Tesla.

Bounce Back's dedicated Chromium journey checks its pinned GPL source hashes during build, iframe isolation, movement/aiming input, pause, restart and local save round-trip. These checks do not verify a full game campaign or physical-device behavior.

## Discovery and device-check release

Collection-preview regressions verify that thumbnails come from actual members, have localized alternatives, load without JavaScript, link to their collection and fit 320/360/390/430/1440px layouts on home, collection indexes and related details. Counts represent full collection membership, not preview-image counts.

Editorial checks require unique real picks with bilingual reasons, stable ties, complete registry coverage and consistent ordering across home/full/category/default search. Visual changes to the original three games reuse gameplay/pause/persistence/responsive regressions; inspect rendered boards and update actual screenshots. Optional 2048 tile motion and Orbit trail must stop under reduced motion or low-effects. Editorial placement is not a player popularity or fun measurement.

Collection membership must resolve to real games, and one-button/pointer/daily selection rules must agree with the registry. Search regressions cover combined filters, URL normalization, result pagination, language links, refresh, reset and browser history. Device-report tests assert that observed pass/fail stays distinct, missing checks remain not-tested, the report is not certified and no mutation request uploads it. Layout and JavaScript-disabled checks cover the static discovery fallback. These tests exercise the checklist software, not physical hardware or 20-minute stability.

## Classic board checks

`compact-search-growth.spec.ts` checks initial mobile game visibility, disclosure keyboard/submit behavior, filter counts, canonical guide answers, GA4 query sanitization and consent separation, plus sparse/error search ad suppression using intercepted provider requests. These are instrumentation and browser checks, not provider dashboard receipt or advertising fill/revenue proof.

`search-players.spec.ts` checks solo/same-device membership, combined board filtering, bilingual result labels, reload/history/locale/reset behavior, invalid URL values, 320–1440px layouts and direct local play. Registry and serialized-index unit checks exclude multiplayer-only Yutnori from solo results. These checks do not certify physical devices or online multiplayer.

Rules fixtures cover Gomoku overlines and row boundaries, gravity and line wins, Reversi multidirectional flips/pass/early finish, mandatory checkers captures/continued jumps/crowning/no-move loss/quiet-king draws, and double-box extra turns/ties. AI fixtures check legal moves, source nonmutation, immediate wins and forced defence. Browser scenarios exercise five AI/local journeys, worker replies, pause cancellation, reload/locale preservation, completed-result restoration, keyboard confirmation and 320/390/430px layouts. Bilingual category/collection/guide, play-mode schema and llms.txt are checked. These do not establish Elo strength, accessibility certification or physical-device compatibility.

Ready-screen two-player choices are visible in both locales across all five board games. Each game confirms that both players can complete alternating local moves without an AI reply. Mode controls are removed during pause/results and cleaned up on stage remount.

Classic board sound browser journeys observe real AudioContext creation/state and oscillator scheduling for all five move cues, pause, resume, mute and persisted preferences. These checks prove browser audio scheduling, not subjective loudspeaker quality or physical-device output.

Yutnori has a separate rules engine and browser journey. Fixtures cover the reachable outer/diagonal paths, Do/Gae/Geol/Yut/Mo, exact finish, stacked movement, full-stack capture, bonus throws and malformed-save rejection. Browser checks cover 2/3/4-player setup, outer-versus-shortcut choice, extra throws, pause/reload, restored wins, saved next-match preferences, both locales and keyboard focus. Chromium checks include 320–1440px phone/tablet widths; iPad Mini touch checks exercise portrait and landscape throw/move flows. Review the captured actual board screenshot. These checks do not certify physical phones, gamepads, Tesla browsers or assistive technology.

A fractional CYWALL result reproduces the prior mobile overflow deterministically through the authenticated iframe bridge. Display scores round to localized integers while saved scores retain precision. Audio readiness must not block a resumed game, including immediate mute after resume.

Player viewport regressions cover desktop, mobile portrait and short landscape across eight original engines and a representative import. Assertions cover viewport bounds, essential controls, no Fullscreen API, DOM preservation on view toggles, settings, and direct board confirmation. Crisp loading/input regression reads the combined shared-runtime inventory; Bounce Back has a separate journey above. This is not manual review or physical-device proof.

Mobile player acceptance includes short 320×568 and 360×640 portrait, 390/430px phones, 667×375 and 844×390 landscape. Check actual surface bounds, initial scroll position, footer row alignment, settings/remount cleanup, touch confirmation, orientation preservation and cancelled swipes, rather than only document overflow. See ADR 0017.

`npm run test:mobile` runs focused viewport and mobile input journeys on Playwright WebKit as a separate local/manual check. Existing CI/Pages run Chromium; the current OAuth deployment credential cannot edit workflows to add WebKit. This is a second browser engine, not an actual iPhone Safari/device certification. The CDP touch-swipe injection case runs in Chromium only.

## Compact navigation and board space

`compact-layout.spec.ts` checks a bounded catalogue header, earlier thumbnails, native menu reachability without JavaScript, Escape focus restoration, and full-stage board sizing with a side rail at 800×600 and 960×640. Optional direction buttons remain in settings. Classic remount checks require one external tools group and one settings group; existing confirmation, pause, view/orientation and mobile journeys remain release gates. The user's attached Tesla screenshots establish the pre-change layout issue; post-change physical Tesla readback remains separate from browser automation.

## Quick discovery and replay

`quick-play.spec.ts` covers both languages, JavaScript-disabled links, mood selection and cycling, real local-history filtering, denied storage, 320px phones and iPad portrait/landscape widths, reduced motion, artwork containment, disabled start before script hydration, and actual Circuit completion with record feedback and replay on short screens. It runs in the Chromium suite and WebKit mobile suite. These are browser-emulation results, not physical device or retention evidence.

## Daily completion and return

`daily-progress.spec.ts` completes a real Circuit round and checks next-daily navigation, local persistence, home progress, date rollover, saved-stage defaults, pause without completion, corrupt records, static links, denied storage and phone/iPad widths. `daily.test.ts` covers supported seeds, versions, zero scores and date boundaries. These checks do not establish physical-device signoff or increased retention.

## Six-game touch matrix

Run `npm run test:devices` for the six original games introduced in ADR 0057. The dedicated matrix covers: iPhone 13 and iPad Mini/Pro 11 profiles in WebKit, Pixel 7 in Chromium, compact 740×360 WebKit, and 1280×800 / 1920×1080 Chromium touch viewports. Each profile checks both languages, actual touchscreen taps, board and 48px control containment, paused state during viewport rotation, reload, restart and uncaught page errors. Screenshots are captured for each journey and traces are retained on failures. This dedicated command is currently manual; the GitHub credential lacks workflow-write scope to add a CI job.

The wide touch profiles are generic layout probes, not Tesla firmware emulation. Playwright WebKit is not the shipping iOS Safari binary. Physical iPad/iPhone/Android/Tesla operation, hardware performance, audible audio and long-session reliability remain separate manual evidence. See the [Playwright browser documentation](https://playwright.dev/docs/browsers).

River Hop uses CSS container queries to change its direction-button columns without resizing an observed element from a ResizeObserver callback. The observer only finishes optional canvas motion. Traffic Escape keeps its English instructions short enough for the compact side toolbar.

## One hundred additional games

The century release candidate adds 88 imported shared-runtime games, 11 independently adapted ABA Canvas games and original Signal Crossing. Admission must identify distinct mechanics and source editions, preserve licenses and hashes, inspect actual gameplay PNGs, and exercise real input. The shared-runtime runner supports explicit ID filtering, bounded repeated input, pause and restart checks, foreign-request/page-error detection, and per-game JSON plus screenshots. `needs-review` is an unresolved result, not success. See [commands](commands.md) for its environment variables.

`tests/unit/agentic.test.ts` checks the eleven entries and unchanged provenance, isolated generated frames, authenticated lifecycle messages, frozen RAF/performance time/timers, one terminal callback and release of a native held keyboard alias on pause. `tests/e2e/century-games.spec.ts` exercises real independent-game input, pause pixels, explicit resume, frame restart, both catalogue languages, primary-control/stage containment and consent-aware start/completion events. Terminal analytics must come from a genuine game loss, not a fabricated result message.

Implementation evidence recorded on 2026-10-24: the 88 imported shared games and original Signal Crossing passed two bounded native-input admission rounds, each ending naturally or running up to 20 seconds. CLING HOP required a slower-input retry. Per-game scores, natural ends and pause/resume outcomes are recorded in `vendor/century-admission.json`; early terminal rounds do not count as resumed play. All eleven independent games completed a single-worker, 60-second-budget full-shell native keyboard/touch admission: every title produced a nonzero original score or one natural terminal result, with no page errors, bridge errors or foreign HTTP requests. No game state, clock or result was forced. Compact per-title results are retained in `vendor/agentic/admission.json`; actual gameplay PNGs were captured and visually inspected. The 25 targeted century browser tests, 229 unit tests and `npm run verify` passed. This records bounded local implementation evidence only. The touch matrix, complete regression/CI gates, deployed SHA and public-route readback remain separate release gates until their results are recorded. No complete-campaign, physical-device, audible-speaker, advertising-fill or search-indexing claim follows from these checks.
