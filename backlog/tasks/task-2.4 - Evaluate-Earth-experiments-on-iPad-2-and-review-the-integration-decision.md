---
id: TASK-2.4
title: Evaluate Earth experiments on iPad 2 and review the integration decision
status: To Do
assignee: []
created_date: '2026-11-01T19:46:00Z'
updated_date: '2026-11-03T15:50:00Z'
labels:
  - earth-backdrop
dependencies:
  - TASK-2.2
  - TASK-2.3
  - TASK-2.5
references:
  - docs/ipad2_observations.md
  - docs/hosting.md
  - test/index.html
  - docs/earth-backdrop-feasibility.md
  - TASK-2.5
documentation:
  - docs/earth-backdrop-feasibility.md
parent_task_id: TASK-2
type: spike
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Desktop appearance and nominal browser support cannot establish suitability for an old nightstand iPad. Compare the experiments on the actual target browser and let the user decide whether any result deserves integration. If no variant is satisfactory, retaining the existing background is a successful decision. This task authorizes evaluation and review, not integration or deployment.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Record reproducible on-device comparisons of the clock-only baseline, still Earth, and viable animated variants, including device/browser version, chosen settings, load time, clock-hand smoothness, control responsiveness, and stability during a timed run of at least 30 minutes.
- [ ] #2 Review portrait and landscape layouts, low-brightness nighttime readability, and behavior after backgrounding and resuming the browser; report failures and limitations.
- [ ] #3 Provide a concise comparison with recommended variant and settings, measured results where available, subjective observations clearly labeled, and unresolved risks. If the iPad is unavailable, device acceptance stays pending rather than being inferred from desktop tests.
- [ ] #4 Present the results for the user's explicit proceed/revise/stop decision and record their response when received; passing technical checks alone does not approve integration.
- [ ] #5 Only after explicit user approval, create a separate integration task referencing the chosen experiment, its settings, fallback behavior, and validation requirements. Without approval, src/ and deployment remain unchanged.
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
author: @codex
created: 2026-11-01T20:11:00Z

---

Before planning or executing this work, read docs/earth-backdrop-feasibility.md from TASK-2.1. It provides rendering comparisons, imagery attribution guidance, experiment recommendations, and the baseline comparison protocol. Device-specific findings remain pending; confirm the current implementation against source and docs/current-state.md.

---

author: @codex
created: 2026-11-03T15:42:00Z

---

User preference changed after TASK-2.3: evaluate a stationary location-centered day/night backdrop rather than treating globe rotation as the desired candidate. The next prototype should use time/date-based geographical illumination with distinct day/night imagery, retaining still/off fallbacks and old-iPad cost evidence. Current TASK-2.3 lighting remains illustrative and does not satisfy this new direction. Exact center location is pending. Clouds/extra data layers are deferred. Preserve the production integration approval boundary.

---

author: @codex
created: 2026-11-03T15:50:00Z

---

TASK-2.5 now captures the revised stationary Brasschaat-centered day/night experiment and should complete before device evaluation. Brasschaat is confirmed; HTTPS hosting and device geolocation are deferred, as are clouds and other live layers.

---
<!-- COMMENTS:END -->
