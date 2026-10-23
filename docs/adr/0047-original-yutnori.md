---
title: "ADR 0047 — Original Yutnori game"
summary: "A bilingual 2–4 player, same-device implementation with explicit local rules and no third-party assets."
read_when:
  - Developing or reviewing the Yutnori game
---

# Original Yutnori game

Status: Accepted · 2026-10-22

## Context

South Korea is the current low-cost localization experiment for free board games shared on one device. This is a product-fit hypothesis; query volume, first-page potential and lower competition are unverified. The five existing classic board games do not represent a Korean traditional game. The catalogue policy also requires the complete play experience to run on Denny Games.

## Decision

Add Yutnori as an original, lazy-loaded TypeScript game with a dedicated 29-space rules engine and renderer. The National Folk Museum of Korea's Yutnori entry is the rules reference. Write the rules implementation, board layout, CSS and SVG artwork in this repository under its MIT license; import no external code, art, fonts, sound or level assets.

Support 2–4 human players, four pieces per player and pass-and-play on one device. Use four independently generated 50/50 stick faces: Do 1, Gae 2, Geol 3, Yut 4 and Mo 5. Yut and Mo grant another throw. Choosing a same-space friendly group moves that stack together; landing on an opponent sends their whole stack to its yard and grants another throw. Passing a piece does not capture it.

Use the outer loop and two diagonal shortcuts. At an in-run corner, show the outer and shortcut choices; after a piece enters a diagonal, it follows that diagonal through the shared centre to its opposite corner. The reachable directed shortcuts are 5→15, 15→5 and 10→0; the finish at 0 has no outgoing route. This version requires landing exactly on the finish and does not implement Back-do. State both limits as Denny Games house rules because Yutnori conventions vary by region and group. The first player to finish all four pieces wins.

Keep the game local: no AI, online room, account, network opponent or external play link. Keep only the square board in the aspect-ratio stage. Put a compact score strip and actions in the player controls; short bottom-control screens may scroll vertically while keeping the complete board reachable. Use native buttons with touch and keyboard focus support; do not advertise gamepad support. Persist and validate the whole match through the existing browser-save lifecycle. Add bilingual catalogue copy, search title/tags, a rules guide in both locales and links from the existing classic-board collection. Do not claim measured search demand, ranking, traffic, retention or revenue.

## Consequences

The public catalogue grows from 214 to 215 games and adds one project-authored game and one bilingual guide. Yutnori appears in the Board category and classic-board collection, with multiplayer-only structured data. Existing five games keep their shared engine; this game remains a separate module. No third-party license notice or remote runtime is required.

The house-rule choices may differ from a family's preferred rules. Clear labels and direct controls make them visible before play. Automated desktop/mobile browser coverage does not prove physical-phone, controller, Tesla or assistive-technology compatibility. Search publication does not prove indexing or rank; advertising eligibility and revenue remain separate.

## Verification

Pure-rule tests cover throw mapping, every reachable diagonal route, exact finish, stack movement, capture, bonus throws and malformed saves. Browser journeys cover two, three and four players; Yut extra throws, shortcut choice, saved-win restoration, separate current/next match player counts, pause/reload, keyboard focus, both locales and responsive phone/tablet layouts. iPad Mini touch coverage checks portrait and landscape. Review a gameplay screenshot generated from the local browser. Run `npm run verify` and the focused Yutnori browser suite before PR; require reviewed passing CI, Pages deployment, and public detail/player/guide readback after merge. Device, indexing, ranking and revenue claims remain unverified unless separately observed.
