---
id: TASK-2.2
title: Experiment with subtle still Earth backdrop compositions
status: Done
assignee:
  - '@codex'
created_date: '2026-11-01T19:45:00Z'
updated_date: '2026-11-03T15:13:00Z'
labels:
  - earth-backdrop
dependencies:
  - TASK-2.1
references:
  - test/index.html
  - test/test.js
  - src/index.html
  - src/style.css
  - docs/earth-backdrop-feasibility.md
  - test/earth/index.html
  - test/earth/preview.html
  - test/earth/experiment.js
  - test/earth/README.md
documentation:
  - docs/earth-backdrop-feasibility.md
  - test/earth/README.md
modified_files:
  - test/earth/assets/blue-marble-512.jpg
  - test/earth/index.html
  - test/earth/preview.html
  - test/earth/preview.css
  - test/earth/experiment.js
  - test/earth/previews/landscape-night.jpg
  - test/earth/previews/landscape-dawn.jpg
  - test/earth/previews/landscape-day.jpg
  - test/earth/previews/landscape-dusk.jpg
  - test/earth/previews/portrait-night.jpg
  - test/earth/previews/portrait-dawn.jpg
  - test/earth/previews/portrait-day.jpg
  - test/earth/previews/portrait-dusk.jpg
  - test/earth/assets/ATTRIBUTION.md
  - test/earth/README.md
parent_task_id: TASK-2
type: spike
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A globe that looks attractive on its own may compete with hands, tick marks, and digital time at night. Provide a visual experiment where the user can judge subdued Earth compositions in context before introducing motion. Keep all experimental code and assets outside src/, reuse the existing clock for a test-only preview, and leave the deployed clock unchanged.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A standalone, statically hostable experiment outside src/ has documented launch instructions and uses imagery with recorded source and attribution.
- [x] #2 At least three visibly distinct subdued compositions can be compared, including a full globe and a cropped or offset globe; opacity, size, and position can be adjusted or selected through working target-browser controls.
- [x] #3 The preview includes the existing clock and an Earth-off baseline, with selectable night, dawn, daytime, and dusk conditions and representative portrait and landscape sizes.
- [x] #4 Document visual comparisons of hand, tick, time, and date readability, globe prominence, and night brightness; capture representative previews without treating desktop review as iPad validation.
- [x] #5 No motion, live data service, or production changes are required to review the compositions.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Bundle one locally hosted, attributed NASA still globe within a separate test/earth experiment.
2. Reuse the production clock in an isolated iframe with Earth-off, full, cropped/offset, and faint compositions; add legacy-style geometry and time/orientation controls.
3. Verify controls, missing-image fallback, and unchanged production sources; capture representative desktop previews and document visual tradeoffs and pending iPad checks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented a static test/earth harness and isolated fixed-time clock preview. One attributed NASA JPEG: 512x512, 76,205 bytes. Native controls compare off/full/offset/faint, five conditions and two viewport sizes; opacity/size/x/y adjustments work. Chromium 156.0.8078.4 browser checks passed for presets, times, geometry, iframe sizes, host fit, 60 ticks and blocked-image fallback, with no page JS errors. Captured and visually reviewed 32 desktop views in 8 labelled sheets. README records hand/tick/time/date readability, prominence, night brightness, attribution and launch instructions. JavaScript syntax, documentation links and git diff --check passed; src/ is unchanged. Actual iPad validation and user preference remain TASK-2.4; no subsequent task started.

User review (2026-11-03): prefers Full Globe, fully centered (x/y 50%/50%), at 90% size as the most natural fit. Opacity should be at least 28%; 40% may be a bit much. Carry 28% as the starting point for further evaluation; exact opacity above that remains open. This supersedes the initial faint/full recommendation. Preferences captured in test/earth/README.md; experiment defaults and historical captures retain their original values.
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
Added an isolated, statically hostable still Earth comparison at test/earth/, reusing the existing clock without production changes. Includes three adjustable subdued compositions, Earth-off, five fixed time conditions, portrait/landscape previews, local NASA imagery with attribution, image-failure fallback, and eight comparison sheets covering 32 desktop captures. Browser checks and source/document checks passed. Faint best protects the text area; full best conveys Earth; offset has the strongest visual/night-brightness cost. Actual iPad verification and final integration review remain in TASK-2.4.
<!-- SECTION:FINAL_SUMMARY:END -->
