# Bounce Back source distribution

Bounce Back is Copyright © 2019 Frank Force and is licensed under GPL-2.0-or-later. The original files, including the tile sprite and screenshot, are preserved byte-for-byte in upstream/. Their SHA-256 hashes and the source commit are recorded in provenance.json.

The playable frame uses index.html, bridge.js, and two derived runtime files. scripts/build-bounceback.mjs checks every upstream hash before applying its asserted host patches. gameEngineDebug.js remains in the source distribution but is deliberately not loaded; its debug console evaluates input with eval.

The host additions provide an opaque-origin sandbox, a strict frame CSP, a random-channel message bridge, pause/resume, touch movement and aiming, standard gamepad movement and aiming, shell sound controls, and a four-key save bridge. The shell bridge accepts only numeric values for kbap_coins, kbap_warp, kbap_bestTime, and kbap_won.

Physical phone, controller, and Tesla behavior is not certified by Chromium automation.
