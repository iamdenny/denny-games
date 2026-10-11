---
title: "Source and deployment"
summary: "Keep the already authorized public iamdenny/denny-games repository. Publish dist only via GitHub Actions. Supersedes the original PRD recommendation to introduce separate private source/public artifact repositories."
read_when:
  - Working on source and deployment
---

# Source and deployment

## Status

Accepted — 2026-10-11.

## Context

English/Korean browser arcade with free static hosting, expandable game inventory and advertising requirements. Later user decisions take precedence over the research draft.

## Decision

Keep the already authorized public iamdenny/denny-games repository. Publish dist only via GitHub Actions. Supersedes the original PRD recommendation to introduce separate private source/public artifact repositories.

## Consequences

Source and non-sensitive project documentation are public; secrets, private research and account credentials stay outside. No extra repository or paid service.

## Verification

Owning modules and release checks are mapped in [PRD](../product/PRD.md) and [testing](../testing.md).
