# Nightstand Clock - Current State

Last updated: 2026-11-07. Based on source inspection; this is not a record of target-device validation or the currently uploaded deployment.

## What is implemented

- A static HTML/CSS/JavaScript clock in `src/`, with no external runtime dependencies.
- A circular analog dial with 60 generated tick marks: 12 large hour marks and smaller minute marks, without dial digits.
- Three hands animated with linear, repeating CSS keyframes. The second, minute, and hour hands complete a rotation in 60 seconds, 60 minutes, and 12 hours respectively.
- A digital 24-hour `HH:MM` readout and English weekday/month/day date in the lower half of the dial. CSS displays the date in uppercase.
- A fixed black production background, with a stationary Brasschaat-centered Earth providing calculated day/night appearance. The configurable clock-time palette remains available in the test harness.
- Local 512² NASA Blue Marble (September 2004) and Black Marble (2016) maps, identically projected north-up at approximate Brasschaat town center (51.293°N, 4.494°E). Globe diameter is 90vmin, default opacity 40%. Solar illumination varies with UTC date/time and season; twilight softness is artistic.
- Hidden production [brightness controls](brightness.md): a top-right corner tap opens a dark panel with independent 0–100% Clock and Earth sliders. Saved Day/Night profiles can be selected manually or automatically at local 08:00/20:00. Initial Clock intensity is 100% by day and 12% at night; Earth stays at 40% in both until adjusted. Settings apply before clock startup; the page initially uses a dim clock to avoid a bright flash. Controls and settings are included in the deployable `src/` bundle.

## Timing and control

`src/script.js` exposes `initNightstandClock(containerId, options)`. The production page initializes and starts the clock on DOMContentLoaded. Test pages can suppress automatic initialization with `window.__TEST_MODE__` and supply their own time provider.

JavaScript maintenance runs every 1000 ms by default. Digital text and palette maintenance normally update only when the visible minute changes. The production initializer supplies constant black color stops; test pages can still use the original palette. Hand motion runs through CSS animations rather than a JavaScript requestAnimationFrame loop. Negative animation delays align each hand with the supplied time, including milliseconds.

Hand animations resynchronize at startup, on a manual update or palette change, and when maintenance detects time moving backward or a forward jump greater than the maintenance interval plus the default 4000 ms threshold. The clock maintenance detects time jumps when it next runs. The independent Earth renderer explicitly pauses on visibility-hidden/page-hide and redraws current sunlight on resume. Actual resume behavior remains to be checked on the iPad.

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

## Earth backdrop implementation and acceptance

TASK-2.5 established the preferred stationary day/night appearance. The user approved moving toward the main implementation on the `earth-view` branch; TASK-3 integrates it into the normal `src/` entry point. See [candidate acceptance and checks](earth-integration.md).

`earth-math.js` implements the validated NOAA approximate solar direction in the fixed view basis. `earth.js` prepares day/night pixel buffers once and blends on a 512² Canvas once per minute, with no continuous Earth draw loop, new image requests during ordinary updates, or clock-hand animation changes. A hidden page cancels its Earth timer and pending load callbacks; resume uses current time without catch-up. A missing renderer/night image falls back to the local daytime still; a missing day image leaves the black clock. Source maps, transformations, terms and credits are bundled in [the deployed attribution file](../src/assets/earth/ATTRIBUTION.md).

The production candidate uses a black background so the Earth is the only changing background appearance. This is reviewable on the feature branch; no user-facing mode selector is added. The original palette editor and isolated experiments remain accessible under `test/`.

The user's operating model is a dedicated iPad clock running continuously for days/weeks. Priorities are hand smoothness during the minute redraw, low-light readability, bounded retained state and sustained stability. Startup-only download/decoding is secondary. Fixed working memory is an implementation estimate, not a reason by itself to reject the candidate.

TASK-2.4 remains pending for actual iPad behavior, including an overnight/longer trial. Simulation and desktop observations do not prove old-Safari compatibility or days of physical-device stability. Mainline merge and deployment require acceptance of the branch candidate. [Hosting](hosting.md) covers the complete source bundle; it has not been deployed by this work.
