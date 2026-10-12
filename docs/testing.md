---
title: "Testing"
summary: "Automated release checks and physical-device boundaries."
read_when:
  - Working on testing
---

# Testing

Tests cover puzzle solvability, deterministic UTC seeds, 2048 merges, arcade timestep behavior, storage failure, ad rejection/no-fill and game cleanup. Browser checks exercise home/detail/play/pause/restart, locale state persistence, favourites, search, daily challenges and no display ads in play.

Responsive checks use 320, 360, 390, 430 and 1440 CSS pixels and assert no horizontal overflow. Chromium automation and synthetic standard gamepad events are automated evidence only. Actual iOS Safari, Android Chrome, physical Xbox/DualSense controllers and Tesla firmware combinations remain unverified until a human device run is recorded.

## Manual evidence record

Record date, release SHA, OS/browser or Tesla model/computer/firmware, input device and USB/Bluetooth path. Check open/start/play/pause/restart/exit, disconnected pad, tab hidden, audio unlock, storage restore, rotation and any approved advertising return. A failed or partial result stays limited; do not promote it to verified.

## Release criteria

CI must pass on the PR head. Review the diff and public artifact. After merge, require successful deployment for the merge SHA and inspect root, both locales, detail/play routes, scripts, robots, sitemap, notices and HTTPS. Field Core Web Vitals, 20-minute device soak and ad revenue are not inferred from a passing build.

## Imported catalogue

Complete-catalogue tests follow all native next links in both languages with JavaScript disabled, compare every rendered card ID with the registry, open the final game's detail page and check 320/360/390/430/1440px layouts and same-page language navigation. SEO audits enforce exact catalogue coverage in both local and public HTML; the scale fixture repeats coverage for 1,000 entries across 42 pages.

Every admitted Crisp game has a Chromium load/input/pause journey at a 390px viewport, with no foreign requests and no horizontal overflow. Source and sprite hashes are checked by unit tests. Category tests cover cross-page alphabetical order and imported favorites/search. Held standard-controller input and frame isolation have synthetic regressions. These short automated journeys do not verify complete campaigns or physical phones/controllers/Tesla.

## Discovery and device-check release

Editorial checks require unique real picks with bilingual reasons, stable ties, complete registry coverage and consistent ordering across home/full/category/default search. Visual changes to the original three games reuse gameplay/pause/persistence/responsive regressions; inspect rendered boards and update actual screenshots. Optional 2048 tile motion and Orbit trail must stop under reduced motion or low-effects. Editorial placement is not a player popularity or fun measurement.

Collection membership must resolve to real games, and one-button/pointer/daily selection rules must agree with the registry. Search regressions cover combined filters, URL normalization, result pagination, language links, refresh, reset and browser history. Device-report tests assert that observed pass/fail stays distinct, missing checks remain not-tested, the report is not certified and no mutation request uploads it. Layout and JavaScript-disabled checks cover the static discovery fallback. These tests exercise the checklist software, not physical hardware or 20-minute stability.

## Classic board checks

Rules fixtures cover Gomoku overlines and row boundaries, gravity and line wins, Reversi multidirectional flips/pass/early finish, mandatory checkers captures/continued jumps/crowning/no-move loss/quiet-king draws, and double-box extra turns/ties. AI fixtures check legal moves, source nonmutation, immediate wins and forced defence. Browser scenarios exercise five AI/local journeys, worker replies, pause cancellation, reload/locale preservation, completed-result restoration, keyboard confirmation and 320/390/430px layouts. Bilingual category/collection/guide, play-mode schema and llms.txt are checked. These do not establish Elo strength, accessibility certification or physical-device compatibility.

Classic board sound browser journeys observe real AudioContext creation/state and oscillator scheduling for all five move cues, pause, resume, mute and persisted preferences. These checks prove browser audio scheduling, not subjective loudspeaker quality or physical-device output.

A fractional CYWALL result reproduces the prior mobile overflow deterministically through the authenticated iframe bridge. Display scores round to localized integers while saved scores retain precision. Audio readiness must not block a resumed game, including immediate mute after resume.

Player viewport regressions cover desktop, mobile portrait and short landscape across eight original engines and a representative import. Assertions cover viewport bounds, essential controls, no Fullscreen API, DOM preservation on view toggles, settings, and direct board confirmation. Imported loading/input regression covers all 191 games; this is not manual review or physical-device proof.

Mobile player acceptance includes short 320×568 and 360×640 portrait, 390/430px phones, 667×375 and 844×390 landscape. Check actual surface bounds, initial scroll position, footer row alignment, settings/remount cleanup, touch confirmation, orientation preservation and cancelled swipes, rather than only document overflow. See ADR 0017.

`npm run test:mobile` runs focused viewport and mobile input journeys on Playwright WebKit as a separate local/manual check. Existing CI/Pages run Chromium; the current OAuth deployment credential cannot edit workflows to add WebKit. This is a second browser engine, not an actual iPhone Safari/device certification. The CDP touch-swipe injection case runs in Chromium only.
