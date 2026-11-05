# Earth production candidate — TASK-3

The normal clock page now uses the selected Brasschaat-centered day/night Earth. It is the visually approved implementation on **earth-view**. TASK-3 is complete; actual iPad sustained-use acceptance remains in TASK-2.4 before mainline. The user approved proceeding beyond isolated exploration; TASK-2.4 stays open for actual iPad evidence.

## Review the candidate

Serve the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/src/**. This is the normal clock page with animated hands and actual date/time. There are no experiment controls, debug status lines or location permission prompts. The background is fixed black; the Earth supplies the changing day/night appearance. Diameter remains 90% of the smaller viewport dimension, opacity 40%, north up, centered on approximate Brasschaat town coordinates. This preserves the selected settings while making the removal of the earlier time palette reviewable.

The [earlier comparison](../test/earth/solar.html) retains deterministic UTC presets and off/day-still/palette comparisons. Production does not depend on `test/`; its assets and code are all under `src/`. [Credits and exact imagery provenance](../src/assets/earth/ATTRIBUTION.md) accompany that bundle. Solar geometry and artistic twilight limitations are described in [the experiment report](../test/earth/SOLAR.md).

## What changed

The Earth renderer is independent of the clock's CSS hand animation. Its two local images load once. It allocates day/night/output ImageData and a depth table during preparation, then reuses them for a single 512² blend every 60 seconds after the preceding draw. There is no continuous Earth drawing, image frame sequence, polling or live weather request. Hidden/page-hide pauses pending work; resume calculates the current instant and restores one update timer. Unsupported Canvas/solar math, loading failure/timeout or a draw error selects the local daytime still; if that cannot load, the clock remains on black. Successful normal operation does not reload images on resume.

The existing clock initializer receives constant black color stops only for the normal production page. Its test API and palette editor keep the original palette, and hand animation/maintenance behavior is preserved.

## Evidence

Desktop verification passed on 2026-11-04 in Linux headless Chromium **156.0.8078.4**, Intel i7-12700H. [Raw results](../test/production-earth-results.json) distinguish simulated time from real-time observations.

- Four UTC illumination instants (dawn/day/dusk/night), each in 1024 × 768 and 768 × 1024, retained the fixed black surround, 90% diameter, 28% opacity, 60 ticks and no experiment controls. Captures were inspected; examples: [black-background dawn](../test/earth/previews/production-black-dawn.jpg) and [black-background night](../test/earth/previews/production-black-night.jpg). The dial uses local time while sunlight uses the UTC instant.
- **24 simulated hours** executed 1,440 periodic blends plus the initial draw, with exactly two image requests, two preparation pixel reads and one output ImageData allocation. This verifies reuse/request behavior; it does not measure total browser allocations or retained heap. Instrumented time in that simulation is virtual, so its zero draw-duration values have no performance meaning.
- Hidden/resume and four page-hide/page-show cycles restored current rendering with one subsequent minute update and no new image requests. Missing day/night images, missing solar script, rejected Canvas context and a thrown draw all left a functioning black-background clock, with the local still where available.
- Two **65-second real-time samples**, plain-clock fallback then Earth, each showed a changing second-hand transform and digital minute rollover (18:03→18:04 and 18:04→18:05 local). Earth drew twice, including startup. Maximum rAF callback gap was 16.8 ms in both samples. This is a main-thread scheduling proxy, not CSS hand FPS or perceived smoothness. The recorded putImageData timing covers only that API call, not the complete blend, so it is not a total-redraw benchmark.
- No page JavaScript errors occurred. Syntax and whitespace checks passed. Production solar math is checked against the already validated experiment math to prevent accidental divergence.

These are desktop implementation checks. Actual low-brightness readability, old Safari behavior and days/weeks of operation are still unverified. At the time of those initial checks, visual approval was still pending; acceptance is recorded below.

Run the integration checks with an externally available Playwright/Chromium installation:

```sh
node --check src/earth.js
node --check src/earth-math.js
node --check src/script.js
node test/check-production-earth.cjs
```

Set `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` when the tools are installed outside this repository. The runner serves localhost port 8003, stores raw results and screenshots under `/tmp/`, simulates one day, and runs two 65-second actual-clock observations. The exhaustive simulated-day run takes about eight minutes on the recorded desktop. Simulation proves scheduled behavior under a controlled clock; it does not establish physical memory use, graphics smoothness, thermal behavior or real-world long-duration stability.

## Acceptance before mainline

1. Review the black-background candidate in portrait/landscape, including daytime and near-dark room conditions. Confirm the globe prominence, time/date readability and the night-light appearance; adjust the selected opacity if the black surround changes that preference.
2. On the actual iPad, confirm the normal page works in its installed Safari and compare hands with Earth enabled versus the plain-clock fallback. Observe several minute redraws and minute rollovers. A periodic hitch deserves attention even if first load is slow or fast.
3. Check background/resume, orientation and unavailable-image behavior. Use the existing TASK-2.4 device context/checklist; startup timings are optional supporting context, not the primary acceptance threshold.
4. Run at least the 30-minute focused check already tracked in TASK-2.4, then leave the candidate running overnight and ideally for several days. Record reloads/crashes, increasing slowdown, clock drift, repeated requests or loss of the Earth/clock. An accelerated day cannot replace this trial. A modest fixed allocation is acceptable; growing retained state or browser reloads need investigation.
5. Record the user's acceptance and device observations, resolve material issues, then merge the reviewed feature branch into mainline. Deployment remains a separate explicit action using the complete `src/` bundle. No merge or deployment was performed by TASK-3.

Geolocation, HTTPS changes, live clouds/weather, selectable product backgrounds and a larger image-resolution experiment are outside this integration. The current images are 512², scaled to about 691 CSS pixels at the initial iPad dimensions; future detail changes should be judged on visible benefit and redraw smoothness rather than startup-byte targets.

## Cached-resource upgrade correction — 2026-11-04

A user screenshot showed the new rendered globe at its natural 512px size in normal document flow, with the clock pushed down and the old time palette active. The localhost server was serving the updated stylesheet, but a browser retaining the older bare `style.css` and `script.js` resources reproduced the same mismatch. Earlier clean-context integration checks missed this upgrade path.

The production entry point now uses the same explicit `?v=earth-1` revision on all four CSS/JS resources. An ordinary reload of the updated HTML requests these new URLs instead of reusing the older bare URLs. Keep that shared revision in sync and bump it when changing shipped CSS/JS; do not add random cache-busting requests or periodic reloads. This affects initial resource selection only, not the running clock's image loading or minute cadence. Configure the deployed HTML to revalidate (for example, `Cache-Control: no-cache`) so future entry-point revisions can be discovered; resource URL versioning cannot refresh HTML held indefinitely by a host's cache policy. No hosting configuration was changed here.

`test/check-production-cache.cjs` seeds the preceding CSS/clock initializer into a real Chromium HTTP cache, reproduces the unversioned failure, then reloads the fixed entry point without clearing the cache. It verifies black background, 28% opacity, matching Earth/dial centers, 90% globe diameter and a fully visible dial at 1896 × 1020, 1024 × 768 and 768 × 1024. Black remains after two simulated minute updates. [Raw regression results](../test/production-cache-results.json) and a [corrected capture from the actual localhost server](../test/earth/previews/production-cache-fixed.jpg) are retained. The actual `http://127.0.0.1:8000/src/index.html` page was separately verified, including the missing-math still fallback with versioned URLs. No user-browser cache was inspected directly.

Run this focused regression with the same external Playwright/Chromium environment:

```sh
node test/check-production-cache.cjs
```

## Opacity selection — 2026-11-05

After confirming the corrected black-background layout, the user selected **40% Earth opacity**. Production uses that value; globe size stays 90vmin. Earlier captures and timing evidence above used 28% and remain historical evidence. CSS/JS URLs now share revision `earth-2` so a normal reload picks up the new opacity. The existing layout/cache checks expect 40%.

## Integration acceptance — 2026-11-05

The user inspected the corrected main page at 40% opacity, confirmed criterion #1 looks correct, and requested verification and closure of TASK-3. Final focused verification passed: the normal entry point has no experiment controls; the seasonal solar directions differ correctly between June and December; and the browser cache/layout regression confirms black background, 40% Earth opacity and matching Earth/dial centers in three viewport sizes. Prior integration evidence covers the one-minute update cadence, local image reuse, fallback and lifecycle behavior.

All TASK-3 criteria are met and the integration task is Done. This records visual acceptance of the feature-branch implementation, not actual iPad stability evidence. TASK-2.4 remains pending for device evaluation. No mainline merge or deployment was performed.
