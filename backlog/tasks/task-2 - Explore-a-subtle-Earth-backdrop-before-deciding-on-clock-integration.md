---
id: TASK-2
title: Explore a subtle Earth backdrop before deciding on clock integration
status: To Do
assignee: []
created_date: '2026-11-01T19:45:00Z'
updated_date: '2026-11-03T15:45:00Z'
labels:
  - earth-backdrop
dependencies: []
references:
  - docs/description.md
  - docs/hosting.md
  - docs/earth-backdrop-feasibility.md
documentation:
  - docs/earth-backdrop-feasibility.md
type: spike
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Living Earth inspires an Earth backdrop, but this nightstand clock must remain the visual priority and run in the user's old iPad 2 browser. Explore visual appeal and device feasibility in isolated experiments before committing to product integration. This initiative ends with a user review, including the option to keep the existing background. Production integration and deployment are outside this initiative; create separate integration work only after the user explicitly approves an experiment.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The experiment tasks provide reviewable visual alternatives and documented compatibility and performance evidence, clearly distinguishing actual iPad 2 observations from desktop results and unverified assumptions.
- [ ] #2 The user is presented with the results and an explicit choice to proceed, revise the experiments, or retain the current background; any decision received is recorded.
- [ ] #3 Experiment code and assets stay outside the deployed src/ bundle, and the production clock and deployment remain unchanged.
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

User review after TASK-2.3 (2026-11-03): revise the experiment direction. Preferred backdrop is a stationary globe with the user location approximately centered, while geographically appropriate day/night illumination moves over it. Use distinct daytime and nighttime Earth imagery on the respective sides rather than merely dimming a daytime photograph. Clouds and other data layers are possible later work, outside the initial revised experiment. Retain the preferred centered 90%-diameter composition and 28% starting opacity unless subsequent review changes them. Exact location requested and pending. This is a request to revise the prototype, not approval of production integration.

---

author: @codex
created: 2026-11-03T15:45:00Z

---

User confirmed the normal/default location is Brasschaat, Belgium. User is exploring optional adaptation to the display device location; this is a feasibility question, not yet an instruction to implement continuous tracking. Candidate behavior: explicit Use device location action, approximate low-power fix, retained manual Brasschaat fallback on denial/error, refresh on request or appropriate resume rather than continuous high-accuracy tracking. Browser geolocation requires permission and normally HTTPS on modern browsers; docs/hosting.md currently describes HTTP S3 website hosting, so hosting and old-iPad Safari behavior must be checked before relying on it. Location would determine globe orientation; date/time would determine illumination independently.

---
<!-- COMMENTS:END -->
