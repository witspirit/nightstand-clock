---
id: TASK-1
title: Curate initial Groma architecture
status: Done
assignee:
  - '@codex'
created_date: '2026-10-19 19:20'
updated_date: '2026-10-19 19:22'
labels: []
dependencies: []
references:
  - nightstand-clock
  - browser-clock
  - clock-renderer
  - bedside-user
  - static-website-hosting
modified_files:
  - groma/config.json
  - groma/index.md
  - groma/project.md
  - groma/systems/nightstand-clock/system.md
  - groma/systems/nightstand-clock/containers/nightstand-clock-test/container.md
  - >-
    groma/systems/nightstand-clock/containers/nightstand-clock-test/components/test.md
  - groma/systems/nightstand-clock/containers/src/container.md
  - groma/systems/nightstand-clock/containers/src/components/script.md
  - groma/systems/nightstand-clock/containers/browser-clock/container.md
  - groma/systems/nightstand-clock/containers/browser-clock/components/script.md
  - >-
    groma/systems/nightstand-clock/containers/browser-clock/components/clock-renderer.md
  - groma/actors/bedside-user.md
  - groma/externals/static-website-hosting.md
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The initial scan reflects source folders and includes the development test harness. Curate it so a new contributor can understand the deployed clock from source and hosting documentation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Map describes the user, browser application, clock responsibility, and documented static hosting
- [x] #2 Test harness is excluded and scanner coverage limits are documented
- [x] #3 Two consecutive scans preserve curated records and source ownership
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Exclude and detach the manual test harness. 2. Rename the browser container and clock component. 3. Describe source-backed behavior, user and documented hosting. 4. Inspect the map and verify two stable rescans.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified the browser map at localhost:4747: user is west of the system and external hosting east; browser and component drill-down show authored responsibilities and How it is built lists src/script.js. Two consecutive groma scans created zero records and preserved all architecture Markdown SHA-256 hashes. Ownership checks confirm src/script.js maps to clock-renderer, test/test.js is excluded, and HTML/CSS have no scanner owner. Hosting is based on documentation, not a live AWS check. Source inspection superseded older current-state.md animation details.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Curated the production architecture into Nightstand Clock / Browser clock / Clock renderer and time maintenance. Added bedside user and documented S3 hosting relationships, excluded and removed the manual test harness from the map, and documented scanner coverage. Verified rendered map, exact JavaScript source ownership, plugin availability, and two unchanged rescans. Application source was unchanged.
<!-- SECTION:FINAL_SUMMARY:END -->
