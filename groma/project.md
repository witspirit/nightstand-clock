---
type: Groma Project
title: Nightstand Clock
groma:
  profile: architecture
description: Architecture of a statically hosted bedside clock for an older iPad.
---

The production application is the three static files under src/. The manual development harness under test/ reuses the clock API but is excluded from the product map. The JavaScript scanner owns src/script.js; HTML and CSS provide the entry document, DOM contract, responsive presentation and hand animation, but are not emitted as owned components by this scanner. Hosting follows docs/hosting.md; no live AWS deployment was verified.
