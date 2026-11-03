# Still Earth composition experiment — TASK-2.2

For the subsequent motion and lighting study, open [the comparison page](motion.html) and read [TASK-2.3 results and instructions](MOTION.md). The still study below retains its original presets.

An isolated, statically hostable visual study. All experimental files live in `test/earth/`; the preview loads the existing `src/style.css` and `src/script.js` unchanged. No production deployment or integration is included.

## Launch and controls

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/test/earth/**. Serve the repository root, not only this folder: the relative references to `../../src/` must resolve. Any ordinary static host can serve the same tree; the page needs no build, CDN, live service, or API. For an iPad on your local network, bind to the computer's LAN address (or `0.0.0.0`) and open `http://COMPUTER-LAN-IP:8000/test/earth/`. Use a separate experiment host if publishing; do not use the production `src/` sync or its delete option.

1. Select Earth off, full, offset/cropped, or faint upper globe. Selecting a composition restores its geometry defaults.
2. Select night (02:00), dawn (06:00), daytime (12:00), dusk (18:00), or late evening (22:00). These use the clock's existing local-time palette, not astronomical sunrise/sunset. Fixed date: Tuesday, November 3, 2026; seconds: 30, to expose the second hand across the lower dial/text.
3. Select the internal landscape (1024 × 768) or portrait (768 × 1024) viewport. The iframe scales down to fit the page width while retaining that internal viewport. Scroll the page to see the full preview; the controls remain outside the clock.
4. Adjust opacity, diameter, horizontal center, and vertical center with native select controls. Geometry adjustments are preserved when changing time or orientation. Earth off stays off regardless of adjustment values.
5. Use **Open preview alone** for a full-browser preview and a copyable URL containing composition, time, and geometry. That standalone preview uses the actual browser viewport rather than the harness's selected dimensions. Compare **Untouched production baseline** separately; that page uses real time and animated hands.

The iframe isolates viewport units and the clock's document-body palette updates. Its clock controller disables hand animation and calls `updateNow()` without `start()`: there is no running clock maintenance interval or Earth animation. The experimental CSS only layers/clips the image, positions the clock container above it, displays image failure status, and removes the background transition for repeatable stills. Dial sizing, hands, ticks, text, colors, and shadows come from production CSS.

Native `select`/`change`, classic ES5 functions/`var`, ordinary image loading, and explicit iframe sizing avoid the newer layout features in the existing test harness. This is a conservative implementation choice, not verified support on the unavailable iPad. The existing clock still requires CSS custom properties; no compatibility repair is part of this task.

## Presets and asset cost

| Preset | Opacity | Diameter / shorter side | Center x / y | Purpose |
| --- | ---: | ---: | --- | --- |
| Off | 0% | 90% | 50% / 50% | Same-harness clock-only baseline |
| Full | 20% | 90% | 50% / 50% | Recognizable globe within the dial |
| Offset | 16% | 140% | 90% / 35% | Oversized globe cropped at the top/right |
| Faint | 8% | 55% | 50% / 25% | Small globe above the digital text |

One 512 × 512 JPEG adds **76,205 bytes (74.4 KiB)**, below the proposed 500 KiB imagery budget. Approximate decoded RGBA size: **1 MiB**, excluding browser copies/compositor surfaces. These are byte counts and arithmetic, not measured device memory or transfer timings. The 512-pixel image is visibly soft when enlarged in the offset composition; a larger alternative is deferred because broad subdued texture is sufficient for this comparison. Black JPEG corner pixels are clipped into a circle so they do not make a rectangular patch on the daytime palette. The circle can still read as a dark disc, especially in the faint preset on bright backgrounds.

[Image source, exact URL, complete credit and transformations](assets/ATTRIBUTION.md). The image is a historical NASA composite with fixed shading. Screenshot sheets below are review artifacts and are not loaded by the experiment (about 1.9 MiB total).

## Desktop visual comparison

Reviewed 2026-11-03 on Linux, headless Chromium **156.0.8078.4**, Playwright, DPR 1, at **1024 × 768** and **768 × 1024**. Source baseline: `1433546` plus this experiment. All four compositions were captured for each of night, dawn, daytime and dusk, yielding 32 views combined into eight labelled JPEG sheets. These are subjective desktop visual observations; no physical display brightness, dark adaptation, GPU/memory behavior, performance, or iPad Safari compatibility was measured.

Each sheet places **off / full** in the top row and **offset / faint** in the bottom row. JPEG compression/resizing can hide subtle contrast differences; use the live preview for final judgment.

| Condition | Landscape | Portrait |
| --- | --- | --- |
| Night, 02:00 | [Compare](previews/landscape-night.jpg) | [Compare](previews/portrait-night.jpg) |
| Dawn, 06:00 | [Compare](previews/landscape-dawn.jpg) | [Compare](previews/portrait-dawn.jpg) |
| Daytime, 12:00 | [Compare](previews/landscape-day.jpg) | [Compare](previews/portrait-day.jpg) |
| Dusk, 18:00 | [Compare](previews/landscape-dusk.jpg) | [Compare](previews/portrait-dusk.jpg) |

| Composition | Hands and tick marks | Digital time and date | Prominence and night brightness |
| --- | --- | --- | --- |
| Off | Cleanest reference; white hands and hour marks separate clearly. Minute ticks remain less prominent by design. | Least visual texture behind both text lines. The red second hand crosses the digital area in every preset, including off. | No added imagery; preserves the existing dark blue night palette. |
| Full | Hands remain distinguishable; clouds add competing edges behind the upper hands and around minute ticks. | Time remains easy to identify; smaller date has more texture behind it than off/faint, especially at night and dawn. | Most immediately recognizable complete Earth. Broad cloud areas add visible night luminance within the dial. |
| Offset | Left side stays cleaner; right/top marks and hands cross more cloud texture. | Text remains readable on desktop, but texture varies across the date line and behind the right-hand digits. | Strongest overall visual presence despite lower opacity, because it covers more area and extends outside the dial. Largest visible bright area at night; least quiet candidate. |
| Faint | Hands/ticks largely retain off-like separation; small upper globe overlaps the upper hand region. | Time/date area is clear of the globe in both orientations. | Least competing candidate at night. On dawn/day/dusk the dark circular silhouette is more noticeable than its geography; may feel like a decorative disc. |

Night exposes the added cloud brightness most clearly. Dawn's muted background keeps the full globe identifiable; daytime blue and dusk orange tint the image strongly through opacity, and make its dark circular outline more apparent. Daytime/dusk have less apparent white-mark contrast than night across every preset, including off. Portrait retains identical dial size at these paired viewport sizes, but its extra vertical space makes the faint globe sit higher relative to the dial and exposes more of the cropped globe above it. The offset horizon is conspicuous in both orientations. No composition visibly clips the time/date in these captures.

## User preference — 2026-11-03

After reviewing the experiment, the user selected:

- **Full globe**, centered horizontally and vertically (50% / 50%).
- **90% diameter** relative to the shorter viewport side; this feels like the most natural fit.
- **At least 28% opacity**; 40% may be a bit much. Use 28% as the starting point for further evaluation, with the exact opacity above that still open.

Carry this composition into subsequent experiments and device review, retaining Earth off as the comparison baseline. This preference supersedes the initial suggestion to carry both faint and full forward. The original presets and captured comparisons above retain their original settings, including the full preset at 20%; they do not represent the newly preferred opacity. Actual iPad validation and the integration decision remain pending.

## Verification and pending device work

Browser-driven checks exercised all four presets, all five time choices (including 22:00), each geometry control, both iframe dimensions, fit at a 768-pixel host width, 60 generated ticks, and missing-image fallback by aborting the JPEG request. The fallback hides Earth, retains a working clock, and displays a small status message. No page JavaScript errors occurred. `node --check test/earth/experiment.js` passed. `git diff -- src/` was empty. No runtime dependencies were added.

To repeat manually, run through the controls above; verify the displayed time, preview dimensions, globe position/size and opacity. In browser developer tools block `assets/blue-marble-512.jpg` and reload the standalone preview: the clock should remain visible with an image-unavailable message. With Earth off, compare the same fixed condition against the other presets, then inspect `/src/` as the real-time baseline.

TASK-2.4 still needs the actual device/OS/user agent, usable viewport/DPR, touch-select operation, low-brightness/night readability, performance/load/memory/stability/resume trials and confirmation of the preferred composition on the device. `window.earthPreviewDiagnostics()` on the standalone preview reports user agent, viewport and DPR; host diagnostics appear below the iframe. Follow the protocol in [TASK-2.1 feasibility research](../../docs/earth-backdrop-feasibility.md) for device records. This fixed-time study cannot establish hand smoothness or real-time rollover behavior; use real time in the later performance evaluation. TASK-2.3 motion/lighting and production integration remain separate work.
