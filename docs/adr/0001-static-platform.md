---
title: "Static platform"
summary: "Astro static output and strict TypeScript"
read_when:
  - Working on static platform
---

# Static platform

## Status

Accepted — 2026-10-11.

## Context

English/Korean browser arcade with free static hosting, expandable game inventory and advertising requirements. Later user decisions take precedence over the research draft.

## Decision

Astro static output and strict TypeScript; real paths, no server or database. Use lightweight Canvas/DOM games first rather than Phaser, because the initial rules need no scene engine. Reassess engine adoption when a game needs it.

## Consequences

Smaller first-load bundles and no backend costs; original game lifecycle must be tested.

## Verification

Owning modules and release checks are mapped in [PRD](../product/PRD.md) and [testing](../testing.md).
