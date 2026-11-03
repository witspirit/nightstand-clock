---
id: TASK-2.5
title: Experiment with a Brasschaat-centered Earth and calculated day/night imagery
status: To Do
assignee: []
created_date: '2026-11-03T15:49:00Z'
labels:
  - earth-backdrop
dependencies:
  - TASK-2.3
references:
  - test/earth/motion.html
  - test/earth/MOTION.md
  - test/earth/render-frames.py
  - docs/earth-backdrop-feasibility.md
  - >-
    https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/
  - https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/
documentation:
  - docs/earth-backdrop-feasibility.md
  - test/earth/MOTION.md
parent_task_id: TASK-2
type: spike
ordinal: 5500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Review of TASK-2.3 clarified that the desired backdrop is a stationary globe with the normal location, Brasschaat in Belgium, approximately centered, while day/night illumination moves across the geography. The rotating sequence and illustrative flat gradient do not meet that intent. A genuine nighttime Earth appearance is preferred over simply darkening the daytime image. Preserve the preferred full-globe composition (centered, 90% diameter, 28% starting opacity) as the starting point for review. HTTPS hosting and device geolocation are explicitly deferred; Brasschaat is sufficient for this experiment. Clouds and other live data layers are later possibilities, outside this task. Keep this a test-only experiment before TASK-2.4 device evaluation and the separate production-integration decision. NASA Blue Marble daytime maps and Black Marble nighttime-light composites are candidate sources; their globally mapped imagery can be projected for a chosen location without a per-location image service. Determine the appropriate low-cost rendering and asset preparation approach when executing the task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A test-only preview presents a stationary globe with Brasschaat approximately at its center, documenting the chosen coordinates and projection/orientation; the existing preferred composition is available alongside Earth-off and still baselines.
- [ ] #2 Day/night geography follows a documented date/time-based solar-position calculation, including seasonal variation, with deterministic preview dates and times spanning day, night, dawn and dusk; calculated illumination is distinguished from artistic twilight blending and historical imagery.
- [ ] #3 Distinct, geographically aligned daytime and nighttime imagery is visible on the respective sides of the globe, with a gradual transition; nighttime appearance is not implemented solely by dimming the daytime texture.
- [ ] #4 Day/night source selection, exact downloads, credits, usage terms, historical dates, transformations and alignment are documented. Browser assets are appropriately reduced and hosted locally, with no live imagery, cloud/weather or per-location rendering-service dependency.
- [ ] #5 Real-time and fixed-time previews allow readability and clock-hand animation comparisons in portrait and landscape. Record asset bytes, decoded-memory estimates, startup behavior, update cadence and observed clock impact, explicitly separating desktop evidence from pending iPad validation.
- [ ] #6 Unavailable assets or unsupported rendering retain a usable still or plain-background clock, and visibility/resume behavior is exercised; the entire preview remains reachable and its controls usable at narrow and desktop viewport sizes.
- [ ] #7 The experiment uses Brasschaat without geolocation permission or HTTPS hosting changes. Device-location adaptation, clouds/extra data layers, production src changes, deployment and integration are excluded; limitations and the handoff to TASK-2.4 are documented.
<!-- AC:END -->
