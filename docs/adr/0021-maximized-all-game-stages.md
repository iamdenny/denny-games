---
title: "ADR 0021 — Maximize every game stage"
summary: "Fit all game surfaces to available space and choose side or bottom controls by game ratio."
read_when:
  - Changing game sizing or shared player tool placement
---

# Maximize every game stage

Status: Accepted · 2026-10-12. Extends ADR 0016, 0017 and 0020.

## Context

The user requested the larger classic-board layout for every other game. Circuit Loop, 2048, Orbit Break and imported games still reserved space for inline actions and had independent width caps. Always using a side rail can make wide games smaller, especially DIGI10's 96:18 surface.

## Decision

Every immersive host centers an aspect-correct surface against its available width and height, without a fixed width cap or a generic subtraction for inline controls. Put scores and primary actions in the shared tools area. Circuit hint/status and Orbit launch/lives use controlsHost with inline fallbacks; 2048 direction buttons use settingsHost with an inline fallback. DIGI10's number keys remain primary controls and remove themselves on destroy.

Below 600px, use compact bottom tools. At larger widths, measure the actual bottom toolbar and compare the available aspect-correct game scale with a 176px side rail. Choose the larger surface; ties keep bottom tools. Recalculate on player/header resize, game readiness and reversible view changes without remounting or resuming the engine. Imported readiness reports validated logical dimensions through the existing optional onReady callback. Keep its window/origin/channel fences intact.

The imported frame preserves the original logical ratio, and its host-owned stylesheet fills the frame canvas rather than leaving the upstream 5% inset. Pinned upstream source, rules, collision coordinates, pointer mapping and sandbox privileges remain unchanged. Keep browser chrome and pinch zoom available.

## Verification

Check every imported game at phone and 800×600 sizes, including actual inner canvas bounds and paused ticks after resizing. Cover square, portrait, wide, very wide and numeric-input families; preserve correct ratios, full surface bounds, reachable primary actions, optional arrows, settings, pause/resume, remount cleanup and standard-view round state. Run Chromium and WebKit layouts and inspect public screenshots after deployment. Physical Tesla confirmation remains separate from browser evidence.
