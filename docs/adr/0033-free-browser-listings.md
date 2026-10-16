---
title: "Free browser game listings"
summary: "Catalog free browser play while keeping code rights, host terms and verification separate."
read_when:
  - Adding an external game whose source is proprietary or unavailable
---

# Free browser game listings

## Status

Accepted — 2026-10-16.

## Context

The catalog's external links previously focused on open-source projects. Many free browser games publish no source code or source license, while others publish proprietary terms. Free play does not grant permission to copy a game, its build, data or artwork. A live URL does not prove that the game itself is free, playable or compatible with a device.

## Decision

Permit an external listing when a public browser page is offered without an upfront payment gate. Record whether this comes from an explicit host statement or from a publicly accessible play page with no payment prompt; if price access remains unclear, hold the candidate. Keep source-code, game-data, asset and host-service terms distinct. Write "license not published" when no license is found; do not infer open-source status from free play, a public repository, or HTTP 200.

Link only to an official project, developer or host page. If source code is unavailable, label the link as developer or game information instead of source code. Do not embed the host or copy its build, game data, screenshots, logos, music or other artwork. Make original Denny Games title cards and label them as original artwork, not screenshots.

Each bilingual detail page must identify the external host, describe account, save, chat and purchase conditions supported by evidence, and say that full gameplay and device compatibility have not been verified until they are tested. Public-world chat and prototype status must be disclosed. Keep controls tied to the host's own current instructions. Only emit a structured-data license link when a license source is known.

## Consequences

The public catalog can include a broader range of 2D, WebGL and WebAssembly browser experiences without distributing third-party content. The game, its source license and its host can have different rights and rules. Visitors must leave Denny Games to play an external entry, and each host controls uptime, compatibility, privacy, moderation, accounts, saves and payment changes. HTTP reachability records remain reachability evidence only.

## Verification

The 2026-10-16 graphical wave adds ten external listings: Tessel, EkoScape, Astray 2, YourCraft, Brakeless, hotlapped, LEXTOWN-01, Cozy Cafe 3D, Paws & Play: 3D Pet Daycare and Nomad Life. Their play URLs returned HTTP 200 to direct GET. Source licenses were recorded where available; Mingat Pet Daycare's public README says all rights reserved, while several other developer pages did not expose a source license. No third-party build or artwork was copied. Complete gameplay, mobile/tablet behavior, controller support and Tesla browser behavior were not tested. See vendor/external-browser-listings.json for per-entry evidence.

The next five-link wave adds Warzone 2100 Web Edition, the experimental Mindustry TeaVM port, City Defense, YS Flight Simulator Web and NetCraft. Their play URLs returned HTTP 200 to direct GET on 2026-10-16. The four published source licenses are GPL-2.0-or-later, GPL-3.0, BSD-2-Clause/BSD-3-Clause and MIT; City Defense's source-code license is unpublished and is labeled separately from its free browser access. WebAssembly/WebGL requirements, first-load sizes, host privacy notes and prototype/legacy status are recorded per listing. No game build or artwork was copied. Reachability does not verify gameplay, mobile/tablet behavior, multiplayer, controller support or Tesla browser behavior; see vendor/external-browser-listings.json.
