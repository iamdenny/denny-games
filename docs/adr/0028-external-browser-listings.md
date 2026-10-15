---
title: "External browser game listings"
summary: "Describe classic projects while keeping their third-party web builds outside the Denny Games runtime."
read_when:
  - Listing a game that is playable on an independent browser host
---

# External browser game listings

## Status

Accepted — 2026-10-15.

## Context

Seventeen classic open-source projects now have browser access through independent services or browser builds, but self-hosting their complete builds would add separate license obligations and host-specific runtime requirements. Some routes run in a browser; NetHack and Dungeon Crawl: Stone Soup use remote community servers. Frozen Bubble 2: Fan Edition is an independent rewrite inspired by the 2002 game and is not affiliated with its original project. Neverball links to the project's Emscripten build; HexGL links to its creator's WebGL game. Denny Games must not present an external build or remote service as its own tested or supported game runtime.

## Decision

Keep each project in the typed game registry as a bilingual, indexable detail page with original Denny Games artwork, source/license links and useful game-specific rules and controls. The play action opens the independent browser host in a new tab. Mark external hosts on catalogue cards, disclose the host or browser build's account/session/save behavior, and state that Denny Games has not verified external gameplay or device compatibility.

Do not iframe the external service or copy its executables, game data, artwork or other assets. Keep the linked project's license separate from the external host's web-wrapper terms. Record the source/host/license boundary and observed URL reachability in `vendor/external-browser-listings.json`. A response from the host is not proof that a playable session works. Do not imply affiliation or endorsement.

## Consequences

The public catalogue count includes both Denny Games-hosted titles and external-link pages, while detail pages clearly disclose which model applies. External entries do not receive local `/play/{id}/` routes, Denny Games save support, device checks, gamepad claims or import provenance hashes. The external host controls browser compatibility, data collection, accounts and saves. When a reviewed in-site port is later proposed, evaluate its code, data, dependencies, load size, inputs and license under ADR 0009 as a separate change.

## Verification

On 2026-10-15, all seventeen play URLs returned HTTP 200 to a GET request. Neverball's initial browser page rendered a canvas in Chromium, and HexGL's creator-hosted keyboard/desktop start menu rendered. These checks establish reachability and initial-page behavior only; no complete game session, physical mobile device, controller or Tesla browser was tested. Project and browser-port license information was checked against the linked sources and official project license pages. Recheck host availability and displayed requirements before a public release.
