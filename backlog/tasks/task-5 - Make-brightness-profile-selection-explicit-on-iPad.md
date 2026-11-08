---
id: TASK-5
title: Make brightness profile selection explicit on iPad
status: Done
assignee:
  - '@codex'
created_date: '2026-11-08T12:13:00Z'
updated_date: '2026-11-08T12:16:00Z'
labels: []
dependencies: []
references:
  - src/index.html
  - src/brightness.js
  - src/style.css
modified_files:
  - src/index.html
  - src/brightness.js
  - src/style.css
  - test/check-brightness.cjs
  - test/check-production-cache.cjs
  - test/check-production-earth.cjs
  - docs/brightness.md
  - docs/hosting.md
  - docs/current-state.md
type: bug
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
First iPad 2 trial confirms brightness controls work, but the native profile dropdown does not visibly show its selected mode. Day clock and Earth can both be 100 percent; night evaluation is pending actual nighttime.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Auto, Day and Night are selectable through visible controls with an explicit selected state that survives reload and resume.
- [x] #2 New Day settings default to 100 percent clock and Earth; existing saved settings and Night defaults are preserved.
- [x] #3 Focused browser checks cover selection, persistence, schedule and layout; actual iPad observations are recorded without claiming nighttime acceptance.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace the native profile dropdown with three plain buttons, using aria-pressed plus a visible selected border and label. 2. Set new Day defaults to 100/100, preserve local storage and Night values, and bump shared asset revision. 3. Update focused browser checks and docs, verify Chromium touch selection, persistence, schedule and cache/layout. Record first device findings on TASK-2.4; nighttime and revised iPad UI acceptance remain pending.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Replaced native select with three plain buttons, using aria-pressed and visible underline/border/background for selection. Shared CSS/JS revision brightness-2. New Day default is 100/100; saved profiles including the prior 40 percent Earth setting are preserved, and Night remains 12/40. Chromium 156 focused brightness and cache/layout checks passed; portrait/landscape screenshots inspected. Test covers touch selection, selected state after reload, Auto schedule, storage failures and saved settings. Source syntax and diff checks passed. Existing Earth regression expectations updated for Day/Night opacity; long renderer regression not rerun because rendering is unchanged. Actual iPad first-trial observations recorded on TASK-2.4; revised selector and nighttime comfort still need actual device validation. No deployment.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Made profile choice explicit with Auto/Day/Night buttons instead of the iPad native dropdown. New Day defaults use full clock and Earth intensity while preserving saved values and Night defaults. Focused Chromium brightness and cache/layout regressions passed, with portrait/landscape visual inspection. Actual iPad nighttime evaluation and confirmation of the revised selector remain pending; no deployment performed.
<!-- SECTION:FINAL_SUMMARY:END -->
