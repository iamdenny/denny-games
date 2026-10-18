---
title: "Random home game spotlight"
summary: "Rotate the home feature through the complete locally hosted game catalogue."
read_when:
  - Changing home game rotation or featured-game selection
---

# Random home game spotlight

## Status

Accepted — 2026-10-18.

## Context

The home feature introduced a small, fixed set of touch-oriented games. Visitors who wanted to browse the wider catalogue had to leave the home page, so most registered local games never appeared in this prominent discovery surface. The complete `games` registry already excludes external-play candidates and carries the localized title, artwork, short description, controls and duration needed to render a feature without loading game engines.

## Decision

Use every entry in the locally hosted `games` registry as the default spotlight pool. Randomize the order and show each game once before reshuffling; avoid repeating the final pick at the boundary between cycles. Start with a random pick and advance every eight seconds. Keep visible pause/resume and next-game controls. The next action advances the current random order and stops automatic rotation.

Keep the curated quick-reflex, thinking and same-screen two-player filters as optional pools. Selecting one shows its first valid local touch game and pauses the rotation; its next action follows that small editorial set. Selecting “All games” returns to a newly shuffled complete local pool.

Respect motion and attention preferences: reduced-motion users start with rotation paused; keyboard focus pauses rotation until the user explicitly starts it again; pointer hover pauses temporarily; a hidden page stops its timer and resumes it when visible if rotation remains active. Automatic updates do not use a live announcement. Manual changes announce the selected title and description.

The initial static HTML keeps the existing Hextris feature, links and copy so the home page remains useful without JavaScript. The small localized metadata list is embedded with the page; no game engine, external destination, storage key or gameplay analytics is added.

## Consequences

Every local game can be discovered directly from the home spotlight, while curated mood filters remain available. Picks are random exposure, not a popularity or quality ranking. The home HTML becomes larger because it carries one lightweight metadata record per local game, but game runtime bundles remain lazy-loaded by the existing play routes.

## Verification

Browser checks compare the spotlight's complete ID set to the local registry, verify automatic change and pause/resume behavior, preserve bilingual mood cycling and the no-JavaScript fallback, and recheck 320px phone, iPad and desktop layouts with reduced motion. Build output inspection confirms external games and game engines are absent from the spotlight metadata.
