---
type: C4 System
title: Static website hosting
description: Serves the deployed clock assets.
status: stable
groma:
  id: static-website-hosting
  technology: Amazon S3 static website hosting over HTTP
---

docs/hosting.md documents uploading the three src/ files to an S3 bucket and serving them through its website endpoint and a DNS alias. It supplies HTML, CSS and JavaScript, with no server-side clock computation. This describes the documented deployment; current infrastructure and DNS were not checked.
