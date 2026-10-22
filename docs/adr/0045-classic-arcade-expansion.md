---
title: "Classic arcade expansion"
summary: "Original campaigns and locally hosted GPL rolling-ball games, with separate port readiness gates."
read_when:
  - Adding classic-inspired games or native WebAssembly imports
---

# Classic arcade expansion

## Status

Accepted, 2026-10-22.

## Context

The requested classic-game expansion includes proprietary games, open games with native engines, and opportunities for original games. A port does not remove the original game's copyright. A source-code license alone does not clear every asset.

## Decision

- Publish three independently authored games: Amber Trail (six platform stages), Starlight Apprentice (24 weeks and seven career endings), and Beacon Quest (three connected valleys and a final boss). These are original short games, not complete remakes of Prehistorik, Princess Maker or Astonishia Story.
- Locally host Neverball's official easy set and Neverputt's original course. Keep the pinned matching source archive, hashes, legal notices, and host modifications in the repository. The source archive is excluded from deployed output but remains downloadable from the public repository.
- Run the native engine in an opaque iframe with script and user-gesture pointer-lock permissions. Parent fetches the fixed local asset list; the child has no network permission. Replace its generated add-on request constructor with an offline responder and preinstall the two reviewed courses. Original audio is omitted.
- Keep a 100 MiB total output budget. Permit only `vendor/neverball/neverball.data` up to 28 MiB; other files retain the 5 MiB limit. Download cost is disclosed before play. A large native port is not automatically an exception to this budget.
- Save original games locally. Native imports preserve native files and preferences, not a suspended in-progress physics attempt. Pause stops the native main loop. Unmount removes the frame and aborts loading.
- Other requested ports remain tracked in the classic expansion guide with actual implementation status. Do not publish placeholders, unlicensed original files, or external host links.

## Consequences

The native pair shares about 33 MB of cached assets. Menus retain the original interface; English/Korean host instructions describe this boundary. Neither automated Chromium tests nor CSS emulation establish physical phone/controller compatibility. Original campaign content is deliberately short and must be described honestly.

## Verification

Run unit rules tests, complete original campaign browser tests, native gameplay/pause/network tests, mobile layout checks, artifact/license checks and the full existing suite. Record deployment evidence separately from local tests. See [expansion tracking](../guide/classic-expansion.md).
