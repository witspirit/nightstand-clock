---
id: TASK-2.2
title: Experiment with subtle still Earth backdrop compositions
status: To Do
assignee: []
created_date: '2026-11-01T19:45:00Z'
updated_date: '2026-11-01T20:11:00Z'
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
documentation:
  - docs/earth-backdrop-feasibility.md
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
- [ ] #1 A standalone, statically hostable experiment outside src/ has documented launch instructions and uses imagery with recorded source and attribution.
- [ ] #2 At least three visibly distinct subdued compositions can be compared, including a full globe and a cropped or offset globe; opacity, size, and position can be adjusted or selected through working target-browser controls.
- [ ] #3 The preview includes the existing clock and an Earth-off baseline, with selectable night, dawn, daytime, and dusk conditions and representative portrait and landscape sizes.
- [ ] #4 Document visual comparisons of hand, tick, time, and date readability, globe prominence, and night brightness; capture representative previews without treating desktop review as iPad validation.
- [ ] #5 No motion, live data service, or production changes are required to review the compositions.
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
author: @codex
created: 2026-11-01T20:11:00Z

---

Before planning or executing this work, read docs/earth-backdrop-feasibility.md from TASK-2.1. It provides rendering comparisons, imagery attribution guidance, experiment recommendations, and the baseline comparison protocol. Device-specific findings remain pending; confirm the current implementation against source and docs/current-state.md.

---
<!-- COMMENTS:END -->
