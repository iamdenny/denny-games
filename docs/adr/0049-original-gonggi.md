---
title: "ADR 0049 — Original Gonggi game"
summary: "A five-stage Korean five-stones game adapted for the Denny Games browser lifecycle."
read_when:
  - Developing or reviewing the Gonggi game
---

# Original Gonggi game

Status: Accepted · 2026-10-23

## Context

The current South Korea product experiment centers on Korean-language entry pages. A public query sample for Gonggi terms surfaced instructional content but did not surface a clearly dedicated browser game. This small sample does not establish query demand, an empty market, or rank potential. The National Folk Museum of Korea describes a common five-stone sequence and explicitly notes that play varies by group.

Denny Games already has Yutnori for local multi-player board play. Gonggi adds a different, short-session dexterity game that works for one player and does not require a backend, outside host or imported game assets.

## Decision

Create an original, lazily loaded, bilingual Gonggi game in `src/games/gonggi/` under MIT. The game uses original TypeScript, DOM controls, CSS and SVG art. The National Folk Museum of Korea webzine article is a rules reference only; no code, art, sound, font or game levels are copied.

Use five player-selectable stages:

1. Pick one stone on each of four throws.
2. Pick pairs on two throws.
3. Pick three stones, then the final one.
4. Pick all four stones on one throw.
5. Play a digital Kkeokgi variation with two timed catches. The first sets the count to recover on the second throw.

Each 3.6-second throw has an amber catch window centered at 2.6 seconds and spanning one second. Timing quality maps to zero through five stones. Stages 1–4 require a timing grade of at least three and the requested stone group. Kkeokgi requires at least three stones on each catch. A player gets three misses per stage; earlier successful groups remain collected on stages 1–4. A failed Kkeokgi attempt restarts that stage's two-catch sequence.

Use native stone and action buttons for touch, mouse and keyboard. Tab, Enter and Space work on the buttons; arrow actions move focus between available stones. The controls use no network requests. Progress and personal bests use the shared browser-local save lifecycle. An in-flight toss serializes as a ready toss so a reload cannot resume an expired timer.

Publish English and Korean detail pages, a rules guide, and a `traditional-games` collection pairing Gonggi with Yutnori. The collection distinguishes solo practice from same-device multi-player play and states that neither has online matchmaking. Do not add Gonggi to the board-game category, daily challenge, gamepad compatibility list or a ranking table.

## Consequences

The registry gains one locally playable arcade game with five stages and a visible solo challenge. Korean and English pages describe the common physical rules and identify the timer and scoring as digital variations. The search entry uses the canonical game, guide and collection routes; this does not prove indexing, impressions, rank, traffic, player retention or revenue.

The timing mechanic approximates a physical toss-and-catch action. It is a browser adaptation, not a validated simulation of real hand movement. Responsive screenshots and Playwright tests do not establish physical-phone, tablet, assistive-technology or controller compatibility.

## Verification

Pure tests cover all group plans, timing thresholds, stage score, misses, Kkeokgi and malformed-save rejection. Browser tests cover both locales, full stage progression, Kkeokgi, pause/reload, keyboard and 320–1440px viewports. Run the required repository verification and full Chromium browser suite before review. After merge, require the Pages workflow to complete and verify public detail, guide, collection and player routes against the deployed SHA. Search metrics and physical device evidence stay separate.
