---
title: "ADR 0014 — Editorial ordering and casual visual polish"
summary: "Promote reviewed picks consistently and improve three boards without changing game rules."
read_when:
  - Changing recommended ordering, game visuals or editorial claims
---

# Editorial ordering and casual visual polish

Status: Accepted · 2026-10-12

## Decision

The user chose clean, clear casual visuals. Orbit Break receives rounded pastel bricks, a rounded highlighted paddle, a quiet dotted field and an eight-sample ball trail. 2048 gains rounded tactile tiles and a brief scale animation only where nonempty values change. Circuit Loop gains rounded inset surfaces, higher-contrast rounded paths and distinct connected tiles. Shared player surfaces use restrained blue ink. Existing collision/rule logic, game dimensions, seeds and saved state versions are unchanged; new visual history is transient and resets on pause/restart. Reduced motion or low-effects disables optional trails/animation. Actual-board screenshots replace the previous captures.

`src/data/editorial.ts` owns twelve explicit picks and bilingual reasons. These are editorial screen/rule judgements from the current catalogue, not audience research, popularity statistics or evidence of full-game completion. Do not assign fabricated play counts, ratings or engagement scores. Home features the first pick and six recommended cards. All-games pages, category defaults, localized search indexes and client sorting use the same stable priority; unpicked entries retain their previous order and all 194 games remain reachable. User-selected name/newest sorting remains available. Curated play-style collections retain their explicit membership/order.

This supplements ADR 0013: exhaustive pages now use stable editorial order rather than raw registry order. Game engines remain outside catalogue bundles; the ordering helper imports no game runtime. Crisp original game files, hashes and licenses remain intact. Imported card borders/backgrounds improve presentation while preserving real screenshots; no in-game Crisp redesign is claimed.

## Verification and limitations

Check pick IDs/reasons, stable ordering, source nonmutation, exact catalogue coverage and consistent home/category/search defaults. Existing gameplay, persistence, pause and responsive browser checks remain release gates. Inspect actual rendered boards and recapture screenshots. Passing checks do not establish that users prefer these games; revisit editorial selection when real feedback is available. Further imported-game remakes require individual renderer and collision/color semantics review.
