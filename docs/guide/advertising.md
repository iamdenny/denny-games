---
title: "Advertising"
summary: "Approval and consent gates for display and H5 ads."
read_when:
  - Working on advertising
---

# Advertising

Advertising is a P0 integration but serving requires external approval. Runtime modes are `off`, `verification`, `live`. Default is off; no publisher ID or live slots are guessed.

Display slots are shared components in content pages, with a maximum of two slots per page and no slots in live gameplay, search, diagnostics or empty library views. Disabled slots occupy no layout. Enabled slots reserve dimensions, show an advertisement label and retain space through no-fill. Game controls stay separated.

Live requests require configured publisher/slot IDs, site approval, verified Google-certified CMP integration and an affirmative policy decision from that CMP. A simple local consent toggle is not a substitute. If the CMP signal is missing, ads remain disabled. Verification mode may add only the configured verification tag and never requests slots.

H5 requests are offered only between rounds, after two completed rounds and at least three minutes since the previous opportunity. Pause the game and mute before the request; recover to an explicit-resume state for completed, rejected, failed or no-fill callbacks. Do not use a timeout to remove a playing advertisement. Never programmatically click ads. Vehicle large-screen mode disables H5 until a recorded device test permits it.

`ads.txt` is empty until an explicit authorized seller configuration supplies its contents. No placeholder publisher IDs are published. Existing iamdenny.com root sellers must be preserved; root-domain approval and ads.txt delegation are separate operations. Account/site approval, H5 approval, CMP certification, actual serving and revenue remain separate evidence. Pages commercial hosting suitability must be resolved before enabling live monetization; the same static output can move to a suitable free host.
