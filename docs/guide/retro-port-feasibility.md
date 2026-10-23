---
title: "Pingus and OpenTyrian browser-port feasibility"
summary: "Pinned source inspection and bounded build evidence; neither candidate is a published game."
read_when:
  - Continuing the retro arcade expansion
  - Evaluating Pingus or OpenTyrian distribution
---

# Port audit — 2026-10-23

The eight original retro-inspired games are independent of these two upstream ports. This audit does not add either candidate to the playable registry, sitemap, structured data or analytics game counts. No third-party asset has been copied into the application by this audit.

## Pingus

Inspected upstream commit [`fe7dda65b50489cfda9d3299828041e819b1f1df`](https://github.com/Pingus/pingus/tree/fe7dda65b50489cfda9d3299828041e819b1f1df). Its README declares GPL-3.0-or-later. The source now includes `mk/wasm/scripts/build-app.sh`, `nix/wasm.nix`, an Emscripten main-loop adapter and pause/resume exports. Therefore the older description “native only” is incomplete: a real upstream web-build path exists, but it has not been qualified here.

The checked-out `data/` has 2,142 files totaling **32,721,744 bytes** (uncompressed source files, not a measured browser transfer). No built Wasm payload size is known. The upstream latest-release API returned HTTP 404; that only establishes that this API exposed no latest release, not that no web build exists anywhere.

### Dependency and rights work

- Upstream recommends `nix build .#pingus-wasm`. Its dependency recipe builds SDL2/image, zlib and libsigc++, provides glm headers, and optionally builds the audio stack. No Nix executable or ready cross-compiled dependency prefix was available in the inspected shell.
- The checked-in web script targets newer Emscripten behavior (including `GROWABLE_ARRAYBUFFERS=0`); the locally available SDK identifies as **3.1.65**. SDK compatibility remains untested.
- `CMakeLists.txt` still describes the GLES path as containing fixed-function-style rendering and a full ES2 rewrite as future work. This is a review risk, not a demonstrated runtime failure: the web script also enables Emscripten GL emulation.
- The project GPL declaration is not a substitute for asset attribution. `data/music/README` identifies eight Kev Bailey tracks from *Alien Shores* under CC BY-SA 3.0. Font documentation names ExpletiveDeletedEnhanced and Arphic ukai-derived glyphs. Preserve applicable licenses/attributions and resolve font redistribution provenance before packaging; do not assert these asset checks are complete.

### Executed spike

The official `mk/wasm/scripts/build-app.sh` was invoked from a temporary source checkout using the existing SDK. Without `DATA_DIR`, the local Bash failed on an empty `PRELOAD` array. Retrying with `DATA_DIR` pointing to the upstream assets advanced to `emcmake configure`, then stopped with:

```text
emcmake: error: ... failed: [Errno 13] Permission denied: 'cmake'
```

No native source compilation or browser execution took place. This is a local toolchain blocker, **not evidence that Pingus cannot run on the web**. No dummy SDL prefix, missing tool or attempted configure is counted as a successful port.

Next: provision the upstream-supported Nix build or equivalent pinned CMake/SDK/dependency toolchain, build the exact source, complete asset notices, then integrate the no-network frame, touch commands, saves, audio, pause/resume and teardown. Verify a complete level and reload on desktop/mobile browser viewports before publishing.

## OpenTyrian

Inspected upstream commit [`ac5d0e71f4245744350c6116ce24f10624da58f8`](https://github.com/opentyrian/opentyrian/tree/ac5d0e71f4245744350c6116ce24f10624da58f8). `COPYING` and source headers cover the engine under GPL-2.0-or-later. The README requires SDL2, with optional SDL2_net, and now says official native release packages include the Tyrian 2.1 data.

The [official FAQ](https://github.com/opentyrian/opentyrian/wiki/FAQ) distinguishes the open engine from the original game data and describes the latter as freeware without a specific license. The repository's `get_data.sh` fetches that separate data from the mirror linked by upstream. On this audit date, an HTTP HEAD request following its redirect returned HTTP 200 and **Content-Length 4,754,048** for `tyrian21.zip`. This is the archive's reported size, not a measured Wasm build or an authorization to redistribute it. The data was not downloaded or committed by this audit.

No explicit grant covering our redistribution of the original data on an advertising-supported browser site was established. Existing upstream bundling alone does not establish our terms. No rights-holder message was sent. Accordingly, this candidate is held from distribution until the applicable data terms are established; it is not described as prohibited by a legal ruling.

Next: establish the data redistribution terms (or supply fully original compatible content), then pin and build the engine without native UDP networking, adapt blocking loops for browser scheduling, and qualify canvas/input/audio/save lifecycle. A local-user-file approach could avoid hosting the data but still needs product design and technical verification; it has not been implemented. No OpenTyrian compile or gameplay test was claimed in this audit.

## Reporting boundary

These findings identify two concrete unfinished work items. They are not playable releases, completed license reviews, search indexing evidence or GA receipt evidence. The original arcade games may ship independently once their own checks pass; keep the two ports explicitly pending in release communication.
