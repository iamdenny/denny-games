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

Four requested classic open-source projects have browser access through independent services, but self-hosting their complete builds would add large downloads, separate license obligations and host-specific runtime requirements. NetHack's available browser route is remote play on a community server. Denny Games must not present a remote service as its own tested or supported game runtime.

## Decision

Keep the four projects in the typed game registry as bilingual, indexable detail pages with original Denny Games artwork, source/license links and useful game-specific rules and controls. The play action opens the independently hosted browser game in a new tab. Mark external hosts on catalogue cards, disclose host-specific account/session/save requirements, and state that Denny Games has not verified the external build's gameplay or device compatibility.

Do not iframe the external service or copy its executables, game data, artwork or other assets. Keep the linked project's license separate from the external host's web-wrapper terms. Record the source/host/license boundary and observed URL reachability in `vendor/external-browser-listings.json`. A response from the host is not proof that a playable session works. Do not imply affiliation or endorsement.

## Consequences

The public catalogue count includes both Denny Games-hosted titles and external-link pages, while detail pages clearly disclose which model applies. External entries do not receive local `/play/{id}/` routes, Denny Games save support, device checks, gamepad claims or import provenance hashes. The external host controls browser compatibility, data collection, accounts and saves. When a reviewed in-site port is later proposed, evaluate its code, data, dependencies, load size, inputs and license under ADR 0009 as a separate change.

## Verification

On 2026-10-15, the four play URLs returned HTTP 200 to a HEAD request. This confirms URL reachability only; no full game session, mobile device, controller or Tesla browser was tested. Project license information was checked against the linked upstream sources and official license pages. Recheck host availability and displayed requirements before a public release.
