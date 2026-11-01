# Nightstand Clock - Current State

Last updated: 2026-11-01. Based on source inspection; this is not a record of target-device validation or the currently uploaded deployment.

## What is implemented

- A static HTML/CSS/JavaScript clock in `src/`, with no external runtime dependencies.
- A circular analog dial with 60 generated tick marks: 12 large hour marks and smaller minute marks, without dial digits.
- Three hands animated with linear, repeating CSS keyframes. The second, minute, and hour hands complete a rotation in 60 seconds, 60 minutes, and 12 hours respectively.
- A digital 24-hour `HH:MM` readout and English weekday/month/day date in the lower half of the dial. CSS displays the date in uppercase.
- A background color interpolated between configurable local-time color stops for night, morning, day, sunset, and evening. These are fixed clock times, not calculated sunrise/sunset times.
- No Earth imagery or Earth rendering in the clock yet.

## Timing and control

`src/script.js` exposes `initNightstandClock(containerId, options)`. The production page initializes and starts the clock on DOMContentLoaded. Test pages can suppress automatic initialization with `window.__TEST_MODE__` and supply their own time provider.

JavaScript maintenance runs every 1000 ms by default. Digital text and background color normally update only when the visible minute changes; the background has a one-second CSS color transition. Hand motion runs through CSS animations rather than a JavaScript requestAnimationFrame loop. Negative animation delays align each hand with the supplied time, including milliseconds.

Hand animations resynchronize at startup, on a manual update or palette change, and when maintenance detects time moving backward or a forward jump greater than the maintenance interval plus the default 4000 ms threshold. There is no explicit visibility/resume event handler; a time jump can be detected when maintenance next runs. Actual resume behavior remains to be checked on the iPad.

The returned controller supports start, stop, immediate update, enabling/disabling hand animation, and reading, changing, or resetting the color palette. An optional callback reports hand resynchronizations. With animation disabled, hands use directly assigned transforms. Console logging remains for script load and clock startup.

## Layout and current style values

The dial is centered in the viewport. Both dial dimensions use `calc(100vmin - (2 * var(--clock-padding)))`, with `--clock-padding: 3vmin`. Hands pivot from the center of the dial. The face has a translucent dark fill, a light border, and shadows.

| Element | Current values in `src/style.css` |
| --- | --- |
| Digital container | `width: 72%`, `top: 68%`, `left: 50%`, `transform: translate(-50%, -50%)` |
| Digital time | `font-size: 14vmin`, weight 300, letter spacing 2px |
| Digital date | `font-size: 5vmin`, weight 400, letter spacing 1px, opacity 0.8 |
| Hour hand | Width 12px, height 25%, white by default |
| Minute hand | Width 8px, height 38%, `#eee` |
| Second hand | Width 4px, height 42%, accent `#ff3b30` by default |

The digital text has a shadow and no separate background panel. Font sizes currently follow the viewport's smaller dimension; there are no font-size caps or text-fitting calculations. Tick sizes, hand widths, and borders include fixed pixel values.

## Test page

`test/index.html` and `test/test.js` reuse the production stylesheet and clock initializer, with a separate test layout and controls. They provide real/mock time selection, editable mock time with keyboard stepping, clock scaling, and the last hand-resynchronization reason/time. Mock mode disables hand animation for fixed-time previews.

The palette panel shows the daily color timeline and current-time marker, offers presets and editable stops, and supports JSON import/export and resetting the default palette. These controls are outside the `src/` deployment bundle. This is an interactive test page, not an automated test suite.

## Compatibility and validation limits

The intended target is old Safari on an iPad 2. Prefixed transform, flex, and animation declarations are present, but they do not establish full compatibility. The production layout and colors depend on CSS custom properties; there is no complete fallback for browsers without them. The test layout additionally uses Flexbox `gap` and CSS `min()`, which are newer than the provisional iOS 9.3 target; see the linked feasibility research for compatibility sources.

The actual iPad is currently unavailable. Its installed OS/browser version and current runtime performance have not been verified in this work. [Earlier device observations](ipad2_observations.md) mention oversized digital text and imperfect second-hand smoothness; these are historical reports, not measurements of the current source.

## Earth backdrop research and follow-up

[Earth backdrop feasibility](earth-backdrop-feasibility.md), produced by TASK-2.1, compares rendering options, documents primary-source compatibility evidence and NASA imagery options, and defines a repeatable baseline/comparison protocol. Its recommendation is a subdued local still image first, with optional motion explored later.

TASK-2.2 covers still-image compositions, TASK-2.3 motion/lighting, and TASK-2.4 actual iPad evaluation and user review. Each follow-up task links directly to the feasibility document. Experiment code and assets must stay outside `src/`; production integration remains subject to explicit user approval after review. See [hosting](hosting.md) for the existing production upload arrangement.
