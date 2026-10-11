---
title: "Open catalogue expansion"
summary: "191 self-hosted imports, six categories and bounded catalogue rendering."
read_when:
  - Reviewing the open catalogue release
---

# Open catalogue expansion

## Changes

Add 191 pinned MIT Crisp games to the existing three playable titles. Six categories have static pagination and localized search. Home category previews are bounded; saved/recent cards are rendered only for local IDs. Category sorting/filtering uses the full category index instead of sorting one static page. Individual source attribution and complete dependency notices remain accessible.

The restricted iframe adapter connects held controller input, pause/resume, score/results, load errors and shared sound. DIGI10 has number buttons. Imported rounds restart when leaving the page and do not claim deterministic daily boards. Optional upstream CDNs, music and WebGL themes are not loaded.

## Evidence boundaries

The all-game Chromium audit covers loading, initial pointer input, mobile viewport overflow and a frozen pause boundary. Regression scenarios cover catalogue pagination, controller holds, search, favorites and embedded isolation. Full campaigns and real phones/controllers/Tesla remain unverified. Advertising stays behind the existing approval/consent gates.

Local checks, GitHub CI, merge, deployment and public readback are separate. The merged PR and Pages workflow are the authority for hosted release evidence; local test output alone does not prove deployment.

## Local validation

18 unit tests, 206 Chromium browser scenarios and the separate 191/191 import audit passed. The 1,000-entry fixture, documentation checks, artifact link audit and dependency audit passed. Artifact size is approximately 7 MiB.
