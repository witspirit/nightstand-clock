---
type: C4 Component
title: Clock renderer and time maintenance
status: stable
groma:
  id: clock-renderer
  parent: browser-clock
  code:
    - scanner: javascript
      file: src/script.js
  technology: JavaScript DOM APIs, Date, setInterval and CSS animations
description: Synchronizes the analog hands, digital readout and daily color palette.
---

initNightstandClock binds an existing clock DOM, creates 60 tick marks and exposes start, stop, updateNow, hand animation and palette controls. It reads an injectable timeProvider, defaulting to the local device Date. Continuous CSS hand animations are phase-aligned with negative delays; a default one-second maintenance interval resynchronizes after clock jumps and updates digital time/date and interpolated background color when the minute changes. Palette changes and explicit updates also force synchronization. The manual test harness disables auto-init with __TEST_MODE__, injects mock time and changes palettes through this API; palettes remain in memory.
