---
id: TASK-2.1
title: Establish iPad 2 constraints and Earth imagery options
status: Done
assignee:
  - '@codex'
created_date: '2026-11-01T19:45:00Z'
updated_date: '2026-11-01T20:11:00Z'
labels:
  - earth-backdrop
dependencies: []
references:
  - docs/description.md
  - docs/current-state.md
  - src/style.css
  - src/script.js
  - docs/earth-backdrop-feasibility.md
modified_files:
  - docs/earth-backdrop-feasibility.md
  - docs/current-state.md
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
- [x] #1 Record the target iOS/Safari version when available, how it was identified, and any information still requiring the user's device.
- [x] #2 Compare a still image, pre-rendered frames, Canvas 2D, and WebGL against the target browser, startup and runtime costs, asset size, and static hosting; cite authoritative compatibility sources and distinguish documented support from device verification.
- [x] #3 Identify at least one suitable Earth imagery source with source links, license or usage terms, and attribution requirements; distinguish baked-in clouds or lighting from live data.
- [x] #4 Recommend the simplest baseline and a bounded set of alternatives worth experimenting with, including a no-Earth fallback. Live weather/cloud feeds and geolocation are optional future scope.
- [x] #5 Document a repeatable clock-only performance baseline and proposed comparison measures; leave actual device measurements explicitly pending if the iPad is unavailable.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Review existing clock and test constraints without changing production code.
2. Research authoritative legacy Safari support and redistributable Earth imagery.
3. Document rendering tradeoffs, recommended experiment scope, and a repeatable baseline protocol.
4. Verify the research deliverable and record device-specific checks as pending.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added docs/earth-backdrop-feasibility.md with primary-source compatibility research, rendering comparisons, NASA imagery and attribution guidance, measured local source byte sizes, and a reproducible comparison protocol. No target iPad or browser runtime measurements were available; all device-specific checks remain explicitly pending for TASK-2.4. Production files are unchanged.

Acceptance evidence: target/evidence section records unavailable device identification and provisional iOS 9.3 scope (AC1); rendering matrix and linked Apple/WebKit/Khronos sources cover compatibility and cost estimates (AC2); NASA source pages and media terms plus attribution/provenance guidance cover imagery (AC3); recommendation limits experiments to still imagery first with optional frames/live rendering and no-Earth fallback (AC4); measured raw source sizes and repeatable baseline/comparison protocol explicitly defer target runtime measurements (AC5). Verification: research document reread; repository references and source-size assertions passed; whitespace check passed; git status confirms only this task and its research document changed. No browser tests were run because this deliverable changes documentation only.

User-requested documentation follow-up: aligned docs/current-state.md with the current source, including CSS hand animations, maintenance/resynchronization, actual style values, test controls, and validation limits. Added a discoverable link to the feasibility research.

Updated the feasibility baseline paragraph to distinguish the historical stale state document from the corrected current-state document.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Documented Earth backdrop feasibility in docs/earth-backdrop-feasibility.md. Recommend a subdued local still image first, with bounded optional pre-rendered motion and live rendering only if justified. Compared four rendering approaches, identified NASA imagery and attribution requirements, and documented repeatable baseline/comparison procedures. All research acceptance criteria verified; actual iPad identification and runtime performance remain pending TASK-2.4. No production changes or integration.
<!-- SECTION:FINAL_SUMMARY:END -->
