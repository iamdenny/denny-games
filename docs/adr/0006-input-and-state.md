---
title: "Input and state"
summary: "Normalize pointer, keyboard and standard gamepad into actions. Persist versioned seed-specific progress before navigation"
read_when:
  - Working on input and state
---

# Input and state

## Status

Accepted — 2026-10-11.

## Context

English/Korean browser arcade with free static hosting, expandable game inventory and advertising requirements. Later user decisions take precedence over the research draft.

## Decision

Normalize pointer, keyboard and standard gamepad into actions. Persist versioned seed-specific progress before navigation; explicitly resume after blur, hidden, pad disconnect or ads.

## Consequences

Physical device/vehicle support remains unverified. Games clean up event listeners and animation frames.

## Verification

Owning modules and release checks are mapped in [PRD](../product/PRD.md) and [testing](../testing.md).
