---
id: TASK-2.5
title: Experiment with a Brasschaat-centered Earth and calculated day/night imagery
status: Done
assignee:
  - '@codex'
created_date: '2026-11-03T15:49:00Z'
updated_date: '2026-11-04T09:21:00Z'
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
  - test/earth/solar.html
  - test/earth/solar.js
  - test/earth/render-brasschaat.py
documentation:
  - docs/earth-backdrop-feasibility.md
  - test/earth/MOTION.md
  - test/earth/SOLAR.md
  - test/earth/assets/brasschaat/ATTRIBUTION.md
modified_files:
  - test/earth/render-brasschaat.py
  - test/earth/assets/brasschaat/day.jpg
  - test/earth/assets/brasschaat/night.jpg
  - test/earth/solar-math.js
  - test/earth/solar.html
  - test/earth/solar.js
  - test/earth/check-solar.cjs
  - test/earth/assets/brasschaat/ATTRIBUTION.md
  - test/earth/index.html
  - test/earth/SOLAR.md
  - test/earth/solar-results.json
  - test/earth/previews/solar-landscape-dawn.jpg
  - test/earth/previews/solar-landscape-dusk.jpg
  - test/earth/previews/solar-portrait-night.jpg
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
- [x] #1 A test-only preview presents a stationary globe with Brasschaat approximately at its center, documenting the chosen coordinates and projection/orientation; the existing preferred composition is available alongside Earth-off and still baselines.
- [x] #2 Day/night geography follows a documented date/time-based solar-position calculation, including seasonal variation, with deterministic preview dates and times spanning day, night, dawn and dusk; calculated illumination is distinguished from artistic twilight blending and historical imagery.
- [x] #3 Distinct, geographically aligned daytime and nighttime imagery is visible on the respective sides of the globe, with a gradual transition; nighttime appearance is not implemented solely by dimming the daytime texture.
- [x] #4 Day/night source selection, exact downloads, credits, usage terms, historical dates, transformations and alignment are documented. Browser assets are appropriately reduced and hosted locally, with no live imagery, cloud/weather or per-location rendering-service dependency.
- [x] #5 Real-time and fixed-time previews allow readability and clock-hand animation comparisons in portrait and landscape. Record asset bytes, decoded-memory estimates, startup behavior, update cadence and observed clock impact, explicitly separating desktop evidence from pending iPad validation.
- [x] #6 Unavailable assets or unsupported rendering retain a usable still or plain-background clock, and visibility/resume behavior is exercised; the entire preview remains reachable and its controls usable at narrow and desktop viewport sizes.
- [x] #7 The experiment uses Brasschaat without geolocation permission or HTTPS hosting changes. Device-location adaptation, clouds/extra data layers, production src changes, deployment and integration are excluded; limitations and the handoff to TASK-2.4 are documented.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Prepare aligned 512px Brasschaat-centered orthographic day/night assets offline from attributed NASA maps; retain exact provenance and reproducible projection. 2. Add a separate test-only ES5 Canvas 2D preview blending preprojected imagery from NOAA solar position once per minute, with deterministic UTC seasonal presets, fixed/real clock, off/still baselines and robust fallbacks. 3. Exercise solar/geographic correctness, image/render failures, lifecycle, scrolling and both orientations; collect desktop startup and clock scheduling evidence. 4. Document costs, limitations and TASK-2.4 device handoff, then verify acceptance and finalize.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented separate solar.html experiment: fixed Brasschaat orthographic maps, NOAA UTC solar direction, artistic ±6° twilight blend, real/fixed sunlight and dial, off/day/original comparisons. 72,107 image bytes; estimated ~7 MiB working storage plus browser overhead. check-solar.cjs passed in Chromium 156: six presets, both orientations, source pixel checks, fallback/timeout/draw failures, lifecycle/canceled preparation, narrow scrolling, 3 cold+3 warm loads per view, and three real 65s clock samples. Cold calculated startup 26–47ms from script start; startup blend 6–16ms, minute redraw 9ms; each run rolled digital minute and advanced hand transform, max rAF callback gap 16.8ms. Synthetic projection and syntax/whitespace checks passed. Evidence and limitations in SOLAR.md and solar-results.json; iPad/physical brightness/long stability remain TASK-2.4. No src or deployment changes.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a test-only Brasschaat-centered stationary Earth preview using aligned NASA historical day/night maps and date/time-based seasonal sunlight. Includes UTC presets, independent real/fixed clock and sun, baseline comparisons, one-minute Canvas blending and still/plain fallbacks. Full provenance, reproducible asset preparation, desktop timing/memory estimates and device handoff are documented. Browser functional checks, twelve visual captures, three cold/warm loads per view and three 65s real-clock samples passed; iPad validation and integration remain TASK-2.4/separate review.
<!-- SECTION:FINAL_SUMMARY:END -->
