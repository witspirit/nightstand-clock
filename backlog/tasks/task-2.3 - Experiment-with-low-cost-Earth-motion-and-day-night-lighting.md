---
id: TASK-2.3
title: Experiment with low-cost Earth motion and day/night lighting
status: Done
assignee:
  - '@codex'
created_date: '2026-11-01T19:45:00Z'
updated_date: '2026-11-03T15:32:00Z'
labels:
  - earth-backdrop
dependencies:
  - TASK-2.2
references:
  - test/index.html
  - src/script.js
  - docs/earth-backdrop-feasibility.md
  - test/earth/motion.html
  - test/earth/motion.js
  - test/earth/motion.css
  - test/earth/render-frames.py
  - test/earth/MOTION.md
documentation:
  - docs/earth-backdrop-feasibility.md
  - test/earth/MOTION.md
modified_files:
  - test/earth/motion.html
  - test/earth/motion.css
  - test/earth/motion.js
  - test/earth/render-frames.py
  - test/earth/assets/motion/view-00.jpg
  - test/earth/assets/motion/view-01.jpg
  - test/earth/assets/motion/view-02.jpg
  - test/earth/assets/motion/view-03.jpg
  - test/earth/assets/motion/view-04.jpg
  - test/earth/assets/motion/view-05.jpg
  - test/earth/assets/motion/view-06.jpg
  - test/earth/assets/motion/view-07.jpg
  - test/earth/assets/motion/view-08.jpg
  - test/earth/assets/motion/view-09.jpg
  - test/earth/assets/motion/view-10.jpg
  - test/earth/assets/motion/view-11.jpg
  - test/earth/assets/motion/ATTRIBUTION.md
  - test/earth/check-motion.cjs
  - test/earth/README.md
  - test/earth/motion-results.json
  - test/earth/previews/motion-landscape-dawn.jpg
  - test/earth/previews/motion-portrait-night.jpg
  - test/earth/MOTION.md
parent_task_id: TASK-2
type: spike
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Motion or a day/night boundary may add the appeal of Living Earth, but either could distract at night or consume resources needed by the clock. Explore only the promising approaches from the feasibility and still-image experiments. Keep the still image as a valid outcome and keep all changes outside the deployed src/ bundle.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A test-only comparison includes the still-image baseline and at least one feasible moving Earth option, or records evidence explaining why motion is ruled out on the target device.
- [x] #2 Day/night appearance is reviewable at selected times; clearly label whether illumination is illustrative, pre-rendered, or calculated from date/time, and do not imply accurate sunlight where it is not implemented.
- [x] #3 Motion and lighting can be evaluated independently where supported, and a stationary mode remains available.
- [x] #4 Record asset download size, update cadence, startup behavior, and observed effect on clock animation for each implemented option, distinguishing desktop evidence from device evidence.
- [x] #5 Unsupported rendering features or unavailable assets leave a usable still or plain-background fallback; no production integration or live cloud/weather dependency is introduced.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Preserve the still experiment and add a separate motion/lighting comparison at the preferred full-globe composition (90%, centered, 28% opacity), with Earth off and real/fixed clock modes.
2. Generate a bounded set of local, pre-rendered longitude views from an attributed NASA texture; compare stationary and infrequent stepped views with an independent, explicitly illustrative lighting overlay. Keep the original still as the default and fallback.
3. Verify controls, loading/failure paths, visibility recovery and animated clock behavior in desktop Chromium; record asset costs, cadence, startup evidence and desktop measurement limits for Task 2.4. No src/ changes or deployment.

4. Fix the reported harness clipping by restoring scrolling on the document root, then verify wheel scrolling reaches the preview bottom at desktop and narrow viewport sizes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented test/earth/motion.html with the preferred centered 90%-diameter globe at 28% opacity; original still and Earth-off baselines, stationary or 30-second pre-rendered longitude steps, independent explicitly illustrative lighting at five times, real/fixed clock modes and both viewport orientations. Twelve attributed CC BY-SA frames total 292,646 bytes; combined original plus frames 368,851 bytes.
Validation: Chromium 156 functional browser checks passed for controls, all frames/times, timer wrap, hidden/resume behavior, missing frame/still, 10-second load timeout, unsupported gradient and Earth-off zero image requests. Thirty-six cold/warm load samples and six serial 35-second real-time samples retained in test/earth/motion-results.json; hands progressed and both moving runs included frame change and minute rollover. Maximum rAF scheduling gap was 16.8 ms in these short desktop runs; this does not measure CSS-animation FPS or iPad performance. Two visual review captures and reproducible browser checks included. JS/Python syntax, local documentation links and git diff --check passed; src/ diff empty.
AC evidence: #1 original/off plus local stepped views; #2 five labelled illustrative lighting previews and documented baked-in shading; #3 independent controls and stationary mode; #4 per-option byte/cadence/startup/runtime table and raw desktop results, device work explicitly pending; #5 exercised gradient/frame/still/timeout fallbacks with functioning clock, no production integration or live service.
Recommendation: retain original still as default; stepped 30-degree changes are visibly coarse and illumination is artistic. TASK-2.4 remains responsible for actual iPad/old Safari checks, full performance/stability protocol and user integration decision.

Corrected user-reported preview clipping: shared production CSS hid root overflow even though the harness body allowed scrolling. Apply harness class to html as well, restore root vertical scrolling and let the body grow normally. Reproduced failure before the fix (wheel scroll stayed at zero), then verified scrolling reaches the preview bottom at 1280x720, 1024x768, 768x1024 and 390x844, portrait changes and lighting controls; standalone viewport remains unchanged. Added a persistent browser regression assertion. Syntax and diff whitespace checks passed.
<!-- SECTION:NOTES:END -->

## Comments

<!-- COMMENTS:BEGIN -->
author: @codex
created: 2026-11-01T20:11:00Z

---

Before planning or executing this work, read docs/earth-backdrop-feasibility.md from TASK-2.1. It provides rendering comparisons, imagery attribution guidance, experiment recommendations, and the baseline comparison protocol. Device-specific findings remain pending; confirm the current implementation against source and docs/current-state.md.

---
<!-- COMMENTS:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added an isolated motion/lighting comparison using the preferred full-globe composition, twelve local pre-rendered longitude views, independent illustrative lighting, stationary/original/off baselines and robust still/plain fallbacks. Desktop browser behavior checks, 36 load samples and six short runtime comparisons passed; costs, startup/cadence, review captures, attribution and device handoff are documented in test/earth/MOTION.md. No src/ changes or deployment. Actual iPad evaluation and the integration decision remain TASK-2.4.

Follow-up: fixed harness document scrolling so the full preview is reachable; verified real wheel scrolling at four host sizes and added regression coverage.
<!-- SECTION:FINAL_SUMMARY:END -->
