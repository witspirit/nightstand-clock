# Brasschaat Earth and calculated sunlight — TASK-2.5

## Open and compare

From repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/test/earth/solar.html**. The [still-composition entry page](index.html) links here. Serve the entire repository so the unchanged production clock CSS/JS resolves. For iPad LAN access follow [the existing hosting instructions](README.md); HTTPS hosting and deployment are unchanged. Do not run the production sync/delete command for experiments.

The default is a stationary Brasschaat globe, centered with diameter 90% of the smaller viewport dimension, opacity 28%, and deterministic March dawn. Compare **Earth off**, **Original still baseline**, and **Brasschaat daytime still** in the same harness. The last comparison isolates the lighting from a change in globe orientation/texture. The original still retains its historical clouds and baked shading. [Earlier motion/gradient comparisons](motion.html) remain separate.

Select a UTC solar preset: 20 March 2026 at 00:00 (night), 05:50 (dawn), 12:00 (day), 17:50 (dusk), or noon on the June/December solstices. These are approximate dawn/dusk examples at Brasschaat, not predictions of local civil sunrise/sunset. **Fixed UTC preset** holds sunlight constant; **Current date/time** follows the actual instant. The separate **Clock** selector chooses a fixed dial showing the preset's UTC fields, or the production clock with local real time and CSS hand animation. Thus animated hands can be compared under identical fixed lighting, and actual sunlight can be evaluated independently of dial time. Fixed dial fields are mirrored into a local Date only for the existing clock formatter; solar calculations always use the original UTC instant. Real clock and real sun can also run together.

Compare 1024 × 768 landscape and 768 × 1024 portrait, and optionally 32/40% opacity. The iframe scales to the available harness width; its internal viewport stays at the selected size. **Open preview alone** shares selected appearance settings and uses the actual browser viewport, including device orientation changes. Harness roots scroll; all controls and the entire preview remain reachable at narrow widths. Read diagnostics after Earth finishes loading for current mode, load/draw timings, sun vector and pause state. Diagnostic timing starts at script execution, not navigation or visible paint.

## Projection, sources and calculation

Coordinates are approximate Brasschaat town center **51.293°N, 4.494°E**. Both source maps are projected offline using the same north-up orthographic view, east to the right, no roll. This keeps the town at the globe's center and geography stationary. See [exact downloads, credits, terms, checksums and reproducible transformations](assets/brasschaat/ATTRIBUTION.md). The daytime base map is September 2004 Blue Marble Next Generation; the nighttime map is the distinct 2016 Black Marble color composite. Historical night lights are not obtained by darkening the daytime texture. No live image, weather/cloud layer or location service is requested. Browser assets are local 512² JPEGs; full maps are offline inputs only.

[solar-math.js](solar-math.js) implements [NOAA's approximate solar-position equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF): UTC day of year and fractional hour determine fractional year (365/366 denominator), equation of time and solar declination. Subsolar east longitude is `180 - (UTC minutes + equation-of-time minutes)/4`, wrapped to ±180°. Express that sun direction in the fixed view's east/north/center basis. The dot product with each sphere pixel's outward normal gives the cosine of the solar zenith angle. Dot zero defines the geometric terminator; negative means night. Axial-seasonal variation comes from the changing declination, not a static gradient or browser timezone. The noon solstice presets make the seasonal orientation difference inspectable. This low-order calculation is for backdrop experimentation, not navigation, precise sunrise prediction or an almanac.

A smoothstep between solar elevations **−6° and +6°** blends the independent day and night pixels. This band is an artistic choice, not a physical atmosphere model. It does not model refraction, solar disc size, terrain, scattering, moonlight or exposure. Both offline projections have the same neutral artistic limb falloff `0.65+0.35z`. No additional runtime dimming substitutes for the night image. The day/night blend operates directly on encoded RGB values, rather than radiometric linear-light color. Day geography/seasonal snow stays September 2004 even in the winter preset. NASA supplies the historical source imagery; this project supplies the projection and lighting visualization and implies no NASA endorsement.

## Rendering cost and lifecycle

Canvas 2D is used only to blend **already projected** images. This avoids a new 3D renderer, full map textures in the browser and per-frame geographic reprojection. The tradeoff is a brief CPU pixel loop. Globe position/orientation never animates, and there is no Earth requestAnimationFrame loop. Fixed sunlight renders once. Real sunlight renders on load, then **60 seconds after each completed draw**, and immediately after resume using the current instant; no missed-update catch-up. The astronomical boundary therefore moves in small one-minute steps. Resize changes CSS geometry without rerasterizing or increasing resolution/DPR. The unchanged clock starts before image preparation and keeps its independent maintenance/hand animations.

| View | Normal image bytes | Approximate decoded image cost | Earth work |
| --- | ---: | --- | --- |
| Earth off | 0 | 0 | No image request / Earth timer |
| Original still | 76,205 | 1 MiB | Load once |
| Brasschaat day still | 42,781 | 1 MiB | Load once |
| Calculated day/night | **72,107** (42,781 + 29,326) | About 7 MiB working storage; see below | Prepare once, then one 512² blend per minute in real mode |

For calculated mode, rough RGBA arithmetic: two source decodes ≈2 MiB, one Canvas backing store ≈1 MiB, three ImageData buffers (day/night/output) ≈3 MiB, plus a Float32 depth table ≈1 MiB. This is **not** measured browser memory or a bound; incoming images, caches, compositor surfaces, temporary copies and retained decoded resources may increase it. The displayed canvas is CSS-scaled to approximately 691px at both initial viewports, so 512px texture softness is visible; larger browser assets need a separate quality/cost decision. New browser HTML/JS and reused CSS/clock add to the image bytes; source downloads, Python and screenshots are never requested by the clock preview.

Day and night assets load serially with a 10-second timeout per request. The clock appears first; Earth remains hidden until preparation and the first draw complete. Failure/timeout of either image, missing 2D context/typed arrays, preparation errors or a draw error selects the Brasschaat daytime still. If that image fails it tries the original still, then leaves a plain clock if that also fails. Fallback is reported in the standalone status and diagnostics; it stops calculated updates. Earth off requests no images. The underlying production clock still requires its existing CSS support; the fallback does not guarantee operation on an arbitrary older OS.

Visibility-hidden/page-hide cancels the Earth timer and pending request callbacks. An incomplete preparation is discarded. On visible/page-show, incomplete loads restart; prepared sunlight draws once at current time and schedules its next update. Fixed-mode resume redraws the fixed instant. No geolocation API, permission prompt, HTTPS configuration, production `src/` file, deployment or integration is part of this experiment.

## Desktop evidence — 2026-11-04

Linux headless Chromium **156.0.8078.4**, 12th Gen Intel Core i7-12700H, DPR 1, 1024 × 768 for timed samples. [Raw desktop results](solar-results.json) retain per-request Resource Timing sizes/durations and diagnostics. Three cold-cache and three warm-cache loads per view were measured. The clock initialized in **1–7 ms** across those samples. Earth timings below mean script start to image-load/first-draw completion, **not navigation-to-visible paint**. Preparation and compositing/paint may add costs that these timers do not measure. Browser code totals **14,913 raw bytes** (HTML plus both JS files), plus reused production clock JS/CSS and `motion.css`; no new runtime package is needed.

| View | Earth available cold (ms, range of 3) | Warm (ms, range of 3) |
| --- | ---: | ---: |
| Earth off | — | — |
| Original still | 4–8 | 3–5 |
| Brasschaat day still | 5–11 | 3–4 |
| Calculated day/night | 26–47 | 18–25 |

Calculated first draws took **6–16 ms** across startup samples. After startup, three **65-second serial runs** used the actual clock and actual sunlight (no simulated time for these samples):

| View | Digital clock before → after (local) | Maximum rAF callback gap | Earth draws including startup |
| --- | --- | ---: | ---: |
| Earth off | 10:17 → 10:18 | 16.8 ms | 0 |
| Brasschaat day still | 10:18 → 10:19 | 16.8 ms | 0 |
| Calculated day/night | 10:19 → 10:20 | 16.8 ms | 2 |

All three retained a changing second-hand CSS transform and correct digital rollover. The calculated run's minute redraw took **9 ms**. rAF gaps measure main-thread callback scheduling, **not CSS animation FPS, perceived hand smoothness or GPU cost**. No scheduling regression appeared in these short desktop samples; this is not a ranking, a full five-minute protocol, or target-device evidence.

Functional checks passed: all six UTC presets and both orientations; source-pixel equality at pure day/night; equinox/solstice sun directions; 60 clock ticks; zero image requests with Earth off; missing night → Brasschaat still → original → plain; request timeout; rejected Canvas context and thrown draw; one-minute cadence; hidden/paged-out pause and current-time resume; cancellation during image preparation; harness control interaction and real scrolling at 1280 × 720, 768 × 1024 and 390 × 844. No page JavaScript errors occurred. A synthetic coordinate-map projection additionally verified approximate center, north-up/east-right orientation and identical day/night transforms, within 8-bit/JPEG quantization. Script syntax and whitespace checks passed; `git diff -- src/` remained empty.

Twelve fixed-time captures were inspected across both viewports. Retained examples: [landscape dawn](previews/solar-landscape-dawn.jpg), [landscape dusk](previews/solar-landscape-dusk.jpg), [portrait night](previews/solar-portrait-night.jpg). All use the same credited source maps and the preferred 28% opacity. No physical screen brightness or dark adaptation was evaluated.

## Repeat checks and TASK-2.4 handoff

[Browser checks](check-solar.cjs) use an externally installed Playwright and Chromium, matching the prior experiment; neither is a production dependency:

```sh
node --check test/earth/solar-math.js
node --check test/earth/solar.js
node --check test/earth/check-solar.cjs
node test/earth/check-solar.cjs
```

If needed set `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` to existing installations. The runner serves localhost port 8002, writes `/tmp/solar-results.json` and twelve preset/orientation JPEGs under `/tmp/`, and takes roughly four minutes. It does not overwrite committed evidence. It checks the sun's equinox/solstice declinations and unit vector, both blend endpoints, day/night source pixel selection, six presets, fallback chain, timeout/draw exceptions, real cadence, hidden/visible and page lifecycle recovery, cancellation while preparing, Earth-off requests, controls/scroll reachability, cold/warm startup and actual-time clock progression.

At 28% on desktop, the dial/hands/date remain identifiable in all twelve captures. Dawn exposes the east of the globe while western geography retains night lights; dusk reverses the day/night division. Night geography/lights are deliberately faint at the preferred opacity, and noon makes the day map more prominent. Landscape and portrait retain the same circular composition. These are desktop visual observations, not low-brightness bedside evaluation or user preference approval.

**Actual iPad evidence: none.** TASK-2.4 must record OS/UA, actual viewport, brightness/cache and power conditions, compare off/original/day-still/calculated at fixed lighting with the animated real clock, and repeat the [full feasibility protocol](../../docs/earth-backdrop-feasibility.md). Measure three cold/warm visible startups, settle 60 seconds, then compare each candidate for five minutes including minute rollover and a sunlight redraw. Watch hands during the CPU blend, test controls/orientation/failure fallback, background for 60 seconds, and run at least 30 minutes of stability. Desktop scheduling proxies cannot establish old WebKit behavior, GPU/compositor smoothness, memory retention, battery/thermal cost, physical brightness or dark adaptation. If redraw competes with hands, test lower blend resolution/cadence before considering integration.

Device-location adaptation, other locations, HTTPS hosting, clouds/live layers and production integration remain separate later decisions. The experiment is ready for TASK-2.4 comparison; no production integration recommendation follows from desktop results alone.
