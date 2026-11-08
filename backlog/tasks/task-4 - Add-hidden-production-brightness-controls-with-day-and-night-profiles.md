---
id: TASK-4
title: Add hidden production brightness controls with day and night profiles
status: Done
assignee:
  - '@codex'
created_date: '2026-11-07T17:46:00Z'
updated_date: '2026-11-08T11:08:00Z'
labels: []
dependencies: []
references:
  - src/index.html
  - src/style.css
  - src/script.js
  - src/earth.js
  - src/brightness.js
modified_files:
  - src/index.html
  - src/style.css
  - src/brightness.js
  - docs/brightness.md
  - test/check-brightness.cjs
  - docs/hosting.md
  - test/check-production-earth.cjs
  - docs/current-state.md
type: enhancement
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The iPad 2 dial and hands are too bright for nighttime use without the accessibility dimming filter; that filter makes the Earth hard to see. The user needs independent clock and Earth adjustment in the standalone production page, with controls completely hidden while judging brightness.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Production offers independent Clock and Earth intensity controls with saved Day and Night profiles and an automatic local-time schedule.
- [x] #2 A corner tap shows and hides a dark control panel; controls start hidden and leave no visible marker when closed.
- [x] #3 Settings survive reload when storage is available; blocked or malformed storage leaves working controls and safe defaults.
- [x] #4 The standalone page retains its black status-bar metadata, black surround, Earth rendering and animated clock; desktop browser checks cover controls, persistence and schedule, with actual iPad acceptance explicitly pending.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add a hidden top-right toggle and dark panel in the production page, retaining standalone metadata and bumping shared resource URLs. 2. Add ES5 brightness management with independent 0-100 percent layer opacity, persisted Day/Night profiles, Auto at local 08:00/20:00, immediate manual preview and resume updates; night defaults clock 12 percent and Earth 40 percent, day 100/40. 3. Verify production behavior, storage failure, schedule boundaries and existing cache/Earth behavior in a desktop browser; document deployment and actual iPad evaluation steps.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented the production corner panel, independent opacity sliders, saved Day/Night and Auto profiles, and versioned assets. Node VM controller checks passed for independent layers, persistence, schedule boundaries, resume timer deduplication and malformed/blocked storage. Browser regression runner added; actual browser execution pending because IDE launcher has no stable Chrome executable. User has been asked per browser skill whether another installed Chromium may be located. No deployment performed; actual iPad acceptance remains TASK-2.4.

Final local review: node --check passes for brightness.js and both affected browser runners; git diff --check passes. Controller execution in a Node VM with mocked DOM confirms criteria 1 and 3. UI and actual browser coverage remain unverified, so criteria 2 and 4 and task completion remain pending. The production bundle is prepared for upload but not deployed.

Browser checks resumed with user authorization using installed Chromium 1248. Cache/layout regression passed. Brightness runner exposed a test timing issue: simulated JS time does not advance CSS animation timeline; changed the hand-motion check to observe actual browser animation after resuming time.

2026-11-08: production brightness runner passed in Chromium 156.0.8078.4 with no page errors, covering both schedule boundaries, touch toggle, both layers off, saved profiles, blocked/malformed storage, portrait/landscape bounds, standalone metadata and actual CSS hand movement. Inspected panel landscape and hidden portrait screenshots; no control marker remains when closed. Existing cache/layout regression passed in all three viewports. Full Earth integration regression is running. Browser results: /tmp/brightness-results.json and captures /tmp/brightness-*.png.

Full production Earth regression passed on 2026-11-08 in Chromium 156.0.8078.4: four illumination instants in two orientations, full simulated day, buffer/image reuse, resume cycles, fallbacks, and two real-time minute observations. Results /tmp/production-earth-results.json. All browser checks now pass; no product code fixes were needed. Documented verification in docs/brightness.md. Actual iPad comfort/standalone behavior and sustained device acceptance remain TASK-2.4; nothing deployed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added hidden top-right production brightness controls with independent Clock/Earth intensity and persisted Day/Night/Auto profiles. Night defaults to a 12% clock with the existing 40% Earth intensity; Auto uses local 08:00/20:00. Preserved standalone metadata and versioned resources. Verified brightness behavior, persistence/storage failures, schedule boundaries, touch/hidden UI, portrait/landscape, real CSS motion, existing cache/layout regression and full Earth integration in Chromium 156.0.8078.4. Corrected the browser test to distinguish CSS animation time from mocked JS time. Physical iPad acceptance remains separate; no deployment performed.
<!-- SECTION:FINAL_SUMMARY:END -->
