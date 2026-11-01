---
type: C4 Actor
title: Bedside user
description: Reads the time and date from a bedside iPad.
status: stable
groma:
  id: bedside-user
---

Keeps the clock page open in Safari and needs large readable analog and digital time with a background suited to the time of day.

## Relationships

| Source | Target | Description | Technology |
| --- | --- | --- | --- |
| [bedside-user](bedside-user.md) | [browser-clock](../systems/nightstand-clock/containers/browser-clock/container.md) | Reads time and date | Safari display |
