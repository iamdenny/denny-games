# Neverball / Neverputt local web runtime

Upstream engine/data source commit and binary hashes are in `provenance.json`. The matching official source bundle is retained as `upstream/neverball-source.zip`. Its `.github/workflows/web-deploy.yml` documents the Emscripten/gl4es build. The reviewed toolchain is Emscripten 3.1.65 and gl4es `c9895df34cd466c23bc60c2bd3db3d87e98fcbe7`.

`gl4es-source.zip` retains source and build files, excluding `traces/`: graphics captures of unrelated games are unnecessary to compile gl4es and were not admitted as distributable game assets. The original download hash, filtered archive hash and omission are recorded. No gl4es source code was changed.

`node scripts/build-neverball.mjs` verifies the retained inputs, emits the runtime and applies one checked JS adaptation to return an offline add-on catalogue. `bridge.js` supplies native audio no-ops, preinstalls reviewed courses, wraps optional user-gesture pointer capture, implements pause/resume and snapshots bounded native preferences/score files. These host changes are GPL-3.0-or-later. Original upstream files retain their original notices.

The iframe is opaque-origin and has no network permission. The host fetches only the local static Wasm/data/course files. Neither original accounts nor add-on downloads are available. Music and sound are omitted. Neverball records and preferences are durable locally; Neverputt only preserves preferences, not round scores. Restart remounts the engine while retaining native files. Replays larger than the snapshot limit are not retained.

The source archives and this directory are public repository source, not deployed web assets. Corresponding-source download links and legal texts are exposed in `public/licenses/neverball/`. Physical device qualification remains separate from automated Chromium tests.
