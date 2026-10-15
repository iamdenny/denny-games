---
title: "ADR 0029 — Quick game discovery and replay"
summary: "Offer play-style picks and local-history return paths without claiming popularity."
read_when:
  - Changing home discovery or end-of-round choices
---

# Quick game discovery and replay

Status: Accepted · 2026-10-15

## Decision

Replace the single editorial feature with a bilingual, static-first game picker. Three small editorial sets cover quick reflexes, thinking and same-screen two-player games. Only registered, locally hosted games with declared touch input qualify; registry filtering omits unavailable entries and browser-suite metadata assertions reject invalid production picks. The default Hextris artwork, description, play link and instructions link work without JavaScript. Progressive controls select a mood and cycle its games without navigation or loading game engines. Two-player picks explain the start-screen mode choice; they do not silently change a saved match mode.

Use actual registered screenshots or artwork, a dark ink feature panel, a lime play action and 48px mood controls. Place the picker immediately below the compact introduction so visitors can launch a game before scrolling through collections. Collection links follow the picker. This supersedes the earlier collection-first home ordering. This supersedes ADR 0014's single home feature, while the six editorial cards and catalogue ordering remain governed by that ADR. Motion is limited to a small optional artwork hover effect and respects reduced motion.

Show up to three recent locally hosted games using existing browser history. Validate IDs against the catalogue, remove duplicates and exclude external hosts. A return link opens the player; it does not promise that every game restores a round. Missing history, unavailable storage or failed catalogue loading leaves the static picker usable. No new storage key or remote analytics is introduced.

At an actual shell round-end, show a next-game link drawn from the local curated set. For games whose shell exposes a numeric score, compare with the existing best score for the exact game, seed and stage before updating it. Classic board results and games with internal scoring do not get a fabricated score badge. Reset all result-only content on setup, pause and restart. Render the start button disabled until the game runtime is ready so fast taps during script loading cannot be lost. Keep the result panel scrollable and safely aligned in short landscape viewports. The same-seed restriction remains in the existing storage key.

## Evidence boundary

Browser tests cover bilingual picks, cycling, static fallback, history filtering, denied storage, phone/iPad dimensions, reduced motion and real Circuit completion followed by record feedback and replay. These checks do not establish improved retention, audience preference, real iPad/iPhone behavior or physical controller support. Measure engagement only from real activity when an approved collection mechanism is available.
