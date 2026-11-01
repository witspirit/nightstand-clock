---
id: TASK-2.3
title: Experiment with low-cost Earth motion and day/night lighting
status: To Do
assignee: []
created_date: '2026-11-01T19:45:00Z'
labels:
  - earth-backdrop
dependencies:
  - TASK-2.2
references:
  - test/index.html
  - src/script.js
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
- [ ] #1 A test-only comparison includes the still-image baseline and at least one feasible moving Earth option, or records evidence explaining why motion is ruled out on the target device.
- [ ] #2 Day/night appearance is reviewable at selected times; clearly label whether illumination is illustrative, pre-rendered, or calculated from date/time, and do not imply accurate sunlight where it is not implemented.
- [ ] #3 Motion and lighting can be evaluated independently where supported, and a stationary mode remains available.
- [ ] #4 Record asset download size, update cadence, startup behavior, and observed effect on clock animation for each implemented option, distinguishing desktop evidence from device evidence.
- [ ] #5 Unsupported rendering features or unavailable assets leave a usable still or plain-background fallback; no production integration or live cloud/weather dependency is introduced.
<!-- AC:END -->
