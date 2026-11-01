---
type: C4 Container
title: Browser clock
status: stable
groma:
  id: browser-clock
  parent: nightstand-clock
  technology: HTML, CSS and vanilla JavaScript
description: Runs the full-screen clock from static web assets.
---

src/index.html supplies the dial DOM and loads style.css and script.js. On DOMContentLoaded the script initializes and starts the clock. CSS handles viewport sizing and continuous hand rotation, including WebKit-prefixed rules; JavaScript periodically maintains time and background state. Only src/ is deployed, using the documented S3 static website hosting. The development page is outside this runtime boundary.

## Relationships

| Source | Target | Description | Technology |
| --- | --- | --- | --- |
| [browser-clock](container.md) | [static-website-hosting](../../../../externals/static-website-hosting.md) | Loads clock assets | HTTP |
