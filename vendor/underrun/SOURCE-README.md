# UNDERRUN source and host adapter

UNDERRUN is Copyright © 2018 Dominic Szablewski and is distributed under the upstream MIT license. The upstream repository is pinned at commit `f933e29152d7fc1ca61d4b3eaa8b29551d7d7a62`; every checked-in upstream file is retained byte-for-byte under `upstream/` and SHA-256 recorded in `provenance.json`.

`source/sonantx-reduced.js` contains heavily modified Sonant-X code. It keeps the original Sonant-X zlib notice and author credits; that separate notice is published beside the MIT license. Music credit to Andreas Lösch is retained in the original source.

`scripts/build-underrun.mjs` verifies the pinned file inventory and hashes, then emits the isolated static frame at `public/vendor/underrun/`. `index.html` and `bridge.js` are Denny Games code. The generated engine has one asserted guard that replaces an omitted terminal callback with a no-op function; this prevents `setTimeout(undefined, ...)` from reaching Chromium's string-code fallback under CSP. The runtime uses an allow-scripts-only iframe, opaque origin, no-network CSP, validated message channel, parent-controlled pause/resume and sound, touch movement/aiming, and the site's standard gamepad input bridge.

The upstream intro, game code, levels and texture remain in the corresponding source distribution. The frame omits the upstream debug page; it is not required by the game. Browser automation does not certify physical devices or Tesla browsers.
