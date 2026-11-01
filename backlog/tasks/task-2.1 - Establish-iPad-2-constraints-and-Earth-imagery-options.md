---
id: TASK-2.1
title: Establish iPad 2 constraints and Earth imagery options
status: To Do
assignee: []
created_date: '2026-11-01T19:45:00Z'
labels:
  - earth-backdrop
dependencies: []
references:
  - docs/description.md
  - docs/current-state.md
  - src/style.css
  - src/script.js
parent_task_id: TASK-2
type: spike
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The exact browser capabilities and rendering budget on the user's iPad 2 are not yet established. Existing notes report second-hand smoothness issues and may contain unverified compatibility claims. Before investing in a globe effect, establish a realistic baseline and identify imagery that can be distributed with a statically hosted experiment. Living Earth is visual inspiration, not an asset source.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Record the target iOS/Safari version when available, how it was identified, and any information still requiring the user's device.
- [ ] #2 Compare a still image, pre-rendered frames, Canvas 2D, and WebGL against the target browser, startup and runtime costs, asset size, and static hosting; cite authoritative compatibility sources and distinguish documented support from device verification.
- [ ] #3 Identify at least one suitable Earth imagery source with source links, license or usage terms, and attribution requirements; distinguish baked-in clouds or lighting from live data.
- [ ] #4 Recommend the simplest baseline and a bounded set of alternatives worth experimenting with, including a no-Earth fallback. Live weather/cloud feeds and geolocation are optional future scope.
- [ ] #5 Document a repeatable clock-only performance baseline and proposed comparison measures; leave actual device measurements explicitly pending if the iPad is unavailable.
<!-- AC:END -->
