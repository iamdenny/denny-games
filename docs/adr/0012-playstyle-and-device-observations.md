---
title: "ADR 0012 — Play-style discovery and local device observations"
summary: "Curated static discovery, bounded URL filters and non-certified local test reports."
read_when:
  - Changing collection membership, catalogue filters or device evidence handling
---

# Play-style discovery and local device observations

Status: Accepted · 2026-10-11

## Decision

Describe interaction independently of hardware support. `controlStyle` is buttons, pointer, numbers or directional, derived from original controls and pinned Crisp pointer/digits metadata. It does not certify that an actual phone, controller or vehicle works. Curated membership is explicit and limited to 12 or fewer real titles per collection; no automatic rankings or volume padding.

Expose four bilingual static collections with selection criteria, practical answers, game detail links and a schema list matching the visible cards. Search remains noindex and combines text, category, control style and estimated round length. It renders 24 results per page while displaying the full matching count. URL values are validated against available controls; page values are finite integers and clamped. Native labels/selects, clear/reset and static fallback collections remain available.

A local device checklist generates a user-observation JSON download. All outcomes default to not-tested. Report values are pass, fail, not-applicable or not-tested; an unknown value never becomes pass. The report records the chosen game, optional manual environment, current public release SHA when available and the time. It always sets certified=false and source=user-observation. No remote submission or automatic public compatibility promotion exists. Inputs are not stored, so reload clears them. Personal identifiers are not requested. The checklist route is noindex; an indexable guide explains the method.

## Consequences

Users can distinguish one-button games from pointer games despite their shared input mappings. Static collections provide useful crawler-visible routes rather than indexing every filter combination. Curated IDs require membership and selection-boundary checks as games change. A downloaded report is useful preparation for physical QA but is not proof a test was run or a reviewed hardware result. Import state restoration and additional games remain separate work.
