---
id: TASK-3
title: Integrate the Brasschaat day/night Earth backdrop into the production clock
status: Done
assignee:
  - '@codex'
created_date: '2026-11-04T16:54:00Z'
updated_date: '2026-11-05T17:29:00Z'
labels:
  - earth-backdrop
dependencies:
  - TASK-2.5
references:
  - test/earth/solar.js
  - test/earth/solar-math.js
  - test/earth/SOLAR.md
  - src/index.html
  - src/script.js
  - src/style.css
documentation:
  - docs/earth-integration.md
  - src/assets/earth/ATTRIBUTION.md
modified_files:
  - src/assets/earth/day.jpg
  - src/assets/earth/night.jpg
  - src/earth-math.js
  - src/earth.js
  - src/index.html
  - src/style.css
  - src/script.js
  - src/assets/earth/ATTRIBUTION.md
  - test/check-production-earth.cjs
  - docs/current-state.md
  - docs/hosting.md
  - docs/earth-integration.md
  - test/earth/previews/production-black-dawn.jpg
  - test/earth/previews/production-black-night.jpg
  - test/production-earth-results.json
  - test/check-production-cache.cjs
  - test/production-cache-results.json
  - test/earth/previews/production-cache-fixed.jpg
type: feature
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The user approved the TASK-2.5 stationary Brasschaat Blue Marble/Black Marble visual and requests a production candidate on earth-view, then mainline when acceptable. The clock runs alone on an old iPad for days or weeks: prioritize sustained hand smoothness, periodic redraws and stability over startup-only costs and modest fixed memory. A fixed black background is proposed in the current conversation. Integration is authorized; actual iPad acceptance, merging and deployment remain separate.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The normal src entry point shows the stationary Brasschaat Earth with calculated seasonal day/night, approved background and no experiment controls.
- [x] #2 The 90% globe diameter and 40% opacity support readable hands, time and date in portrait and landscape.
- [x] #3 Local images load once; normal visible Earth redraws occur at most once per minute, reusing bounded state with no continuous render loop.
- [x] #4 Missing assets or unsupported rendering leave a working clock; visibility/resume restores current illumination without timer accumulation or catch-up work.
- [x] #5 Integration checks cover clock progression, periodic redraw, fallback, lifecycle and layout; documentation preserves credits and separates desktop evidence from pending iPad sustained-use validation.
- [x] #6 Document the branch candidate and readiness criteria; do not merge or deploy in this task.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Promote the validated local day/night maps and solar math into src, removing the experiment harness and debug UI from the runtime. 2. Integrate a stationary 90%/40% Earth layer with a black production background; retain palette experimentation in test pages. Reuse pixel buffers, load assets once, update once per minute, pause/resume safely and fall back to still/plain. 3. Exercise the actual src page in both orientations, real and simulated long-running time, image/render failures and lifecycle; verify no repeated image loading or timer/buffer growth. 4. Update source credits/current-state/hosting and document feature-branch acceptance plus the pending iPad visual and sustained-use gate before mainline.

5. Investigate the reported main-page mismatch, reproduce upgrades from cached pre-Earth resources, and ensure the integrated entry point requests a coherent current CSS/JS version. Verify on a warm cache at the reported desktop size and portrait.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Integrated src candidate on earth-view: selected 90vmin/28% Brasschaat globe, historical NASA day/night maps, minute solar blend with reused pixel buffers, local daytime still/plain fallback and visibility/page lifecycle handling. Production initializer uses constant black; test palette API remains available. Black is the proposed candidate pending user visual approval; acceptance criterion 1 remains open for that review. Source attribution/current-state/hosting and mainline readiness checklist updated. Portrait/landscape black-background captures inspected; integrated simulated-day and real-clock checks running. No merge or deployment.

Final integrated checks PASS in Chromium 156. Simulated 24h: 1,441 draws including startup, exactly 2 image requests, 2 preparation reads and 1 output ImageData allocation. Hidden/resume and repeated page lifecycle cycles preserved one update timer and no extra normal image requests. Missing day/night/math, rejected Canvas and draw exceptions retained clock/still fallback. Four UTC lighting cases captured in both orientations with black background and readable dial. Two 65s real-time samples (plain fallback and Earth) advanced hands and rolled digital minutes, both max rAF callback gaps 16.8ms; no claim of CSS FPS or iPad acceptance. Evidence: test/production-earth-results.json and docs/earth-integration.md. Criteria 2–6 verified; criterion 1 remains open specifically for user visual/background approval. Task stays In Progress for review. No merge/deployment.

User reports main-page Earth at natural 512px in normal flow and the previous dynamic palette despite new Earth rendering. Source has correct Earth layout and black initializer. Investigating a mixed cached CSS/JS upgrade; previously clean-browser tests did not cover this path.

Resolved reported main-page mismatch via a warm-cache reproduction: old bare style.css/script.js resources plus new HTML/Earth renderer produced the natural-size globe in flow and old palette. Server CSS matched the branch. Added shared explicit ?v=earth-1 URLs for all production CSS/JS. Focused Chromium regression reproduced failure without cache clearing, then ordinary reload verified black, centered Earth/dial, 90%/28% and full dial at 1896x1020, 1024x768 and 768x1024; black persisted through two simulated minute updates. Separately verified exact localhost:8000/src/index.html and versioned missing-math fallback. Actual user cache was unavailable to inspect. Evidence in test/production-cache-results.json and corrected screenshot; doc explains revision/revalidation policy. Updated existing missing-math test route to include the resource query. No runtime renderer/clock animation changes; exhaustive simulated-day tests were not repeated for this URL-only fix. AC2 reverified; visual review remains open.

2026-11-05: user confirms corrected layout is better and selects 40% Earth opacity on black. Updated production CSS, shared asset revision to earth-2, existing layout/cache assertions and current candidate documentation. Historical 28% screenshots/results retained as such.

40% opacity verification passed: existing warm-cache browser regression confirms black background, 0.4 computed Earth opacity, correct Earth/dial alignment and full visibility at 1896x1020, 1024x768 and 768x1024. Shared earth-2 revision loads on ordinary reload. Syntax and git diff whitespace checks passed; no renderer/animation logic changed.

2026-11-05: user inspected the corrected main page at 40% opacity, confirmed AC1 looks fine and explicitly requested verification and resolution. Focused browser cache/layout check passed at three viewport sizes with black background, centered Earth/dial and 40% opacity. Normal src entry point has no experiment controls; June/December solar directions verified. Earlier evidence covers day/night pixel selection, minute cadence, image/buffer reuse, failures and lifecycle. Visual approval is now recorded; all six criteria met. TASK-2.4 device acceptance remains separate. No merge or deployment.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Integrated the stationary Brasschaat day/night Earth into the normal clock page on black at 90vmin diameter and user-selected 40% opacity. Local historical NASA maps load once; seasonal sunlight blends once per minute with reusable buffers and still/plain fallbacks. Added versioned resource URLs after reproducing a mixed-cache upgrade failure. Desktop integration, simulated-day reuse/cadence, real-clock, lifecycle/failure and warm-cache layout checks passed. User approved the corrected main page and final verification passed. iPad sustained-use validation remains TASK-2.4; no merge or deployment.
<!-- SECTION:FINAL_SUMMARY:END -->
