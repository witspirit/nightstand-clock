# Earth motion and lighting experiment — TASK-2.3

## Outcome and launch

The preferred **centered, 90%-diameter globe at 28% opacity** now has a separate [motion/lighting comparison](motion.html). It includes Earth off, the original still, and twelve locally pre-rendered longitude views. Stationary mode and an independent illustrative lighting overlay remain available. No `src/` file or production deployment changed.

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/test/earth/motion.html**. For device access use the LAN binding/hosting instructions in [the still experiment](README.md). Serve the whole repository so `../../src/` resolves; never use the production sync/delete command for experiments.

1. Start with **Original still / Stationary / lighting off**, the default baseline. Compare **Earth off** in this same harness, and the linked untouched production page separately.
2. Select **Pre-rendered longitude views**. With Stationary selected, choose any of twelve views to inspect geography and lighting without movement. Choose **Step every 30 seconds** to advance through them; changing longitude becomes available only for this view type. Each image differs by 30° longitude, with at least six minutes per circuit. This is accelerated, illustrative stepped rotation, independent of actual Earth rotation, date, timezone and clock time.
3. Switch **lighting** independently. The overlay is an artistic flat CSS gradient for 02:00, 06:00, 12:00, 18:00 or 22:00. It does **not** calculate a solar terminator, season, axial tilt, geographical timezone, or sunlight. Original shading remains baked into each asset. There are no night lights or current cloud/weather layers. Night/evening darken most of the globe, dawn/dusk darken opposite sides and day leaves most exposed.
4. Fixed clock mode previews Tuesday, November 3, 2026 at the selected appearance time. **Real time** starts the unchanged production CSS hand animations and 1-second clock maintenance; in this mode the clock palette follows actual local time, while the illustrative lighting keeps the separately selected appearance time. This permits performance comparisons without forcing lighting to match local time.
5. Compare both viewport/orientation choices and 28%, 32% or 40% opacity. **Open preview alone** provides a shareable settings URL at the browser's actual viewport. The iframe retains the selected internal dimensions and scales to fit the harness. The small preview status line deliberately identifies illustrative lighting; keep it constant during comparisons.

## Cost, cadence and startup

| Option | Initial image bytes | Eventual unique image bytes | Earth update cadence |
| --- | ---: | ---: | --- |
| Earth off | 0 | 0 | None; no image request |
| Original still, overlay off/on | 76,205 | 76,205 | Load once; no Earth timer |
| Stationary pre-rendered view, overlay off/on | 16,054–31,350 (21,736 for default view 0) | Same selected frame | Load once; no Earth timer |
| Stepped views, overlay off/on | 21,736 for default view 0 | 292,646 across twelve views | Next request 30 seconds after previous image load; swaps only on successful load |

All images are 512 × 512 JPEGs. Original plus all frames total **368,851 bytes (360.2 KiB)**; the source texture, Python renderer and screenshots are never requested by the preview. Overlay adds no image download or animation timer. The new HTML/CSS/JS total 14,128 raw bytes, in addition to reused production CSS/JS. These are raw local/encoded byte counts, not compressed production traffic or total wire bytes. Per-request Resource Timing encoded/transfer sizes, durations and cache observations are retained in [raw desktop results](motion-results.json); warm test subresources were served from cache. The raw results exclude the document from their resource array.

The clock initializes **before** image loading. Earth appears after image `load`; during first load it is clock-only, and later swaps keep the previous view until the incoming image loads. There is no eager preloading of twelve images, no crossfade, Canvas, WebGL, filter, or continuous Earth draw loop. Code retains the displayed image and at most one incoming image; browsers may independently cache additional decoded images. Each approximate RGBA image costs 1 MiB; two images are about 2 MiB, while all twelve decoded frames would be about 12 MiB, excluding other copies/surfaces. These are arithmetic estimates, not measured memory bounds.

Hidden/page-hide events cancel the timer and pending image; resume restarts loading or the 30-second wait, without catching up missed frames. A failed or 10-second-timed-out frame stops stepping and loads the original still. Failure of that asset leaves the functioning clock/plain palette. Unsupported CSS gradients omit the overlay with an explicit status, retaining the selected image. Basic JPEG/timer support avoids dependence on Canvas/WebGL availability. The existing clock's CSS-variable requirement remains unchanged; actual old Safari support is unverified.

## Desktop evidence — 2026-11-03

Linux, headless Chromium **156.0.8078.4**, DPR 1, real-time samples at 1024 × 768, CPU **12th Gen Intel(R) Core(TM) i7-12700H**. Three cold-cache and three warm-cache loads were collected **per option**. The following image timings are from experiment JS start to the image `load` event, not navigation-to-first-paint or device timings. Clock initialization took 1–6 ms over these loads, also measured from script execution; visible paint was not separately instrumented.

Each option then ran **35 seconds serially**, with real hand animation. Each stepped run completed one timed image change. rAF callback maximum gaps are **main-thread scheduling proxies**, not CSS hand FPS, visual smoothness, GPU cost or a benchmark ranking. All runs retained a progressing second-hand transform; a minute rollover was observed in the runs identified below. No claim of iPad performance or full five-minute protocol completion follows from these short samples.

| Option | First image loaded, cold / warm (ms, range of 3) | Max rAF gap (ms) | Successful image loads in 35 s | Digital clock before → after |
| --- | --- | ---: | ---: | --- |
| Earth off | — / — | 16.8 | 0 | 16:20 → 16:21 |
| Original still | 3–6 / 3–3 | 16.8 | 1 | 16:21 → 16:21 |
| Original still + overlay | 3–11 / 3–4 | 16.8 | 1 | 16:21 → 16:22 |
| Stationary pre-rendered view | 3–6 / 2–3 | 16.8 | 1 | 16:22 → 16:22 |
| Stepped views | 3–7 / 3–4 | 16.8 | 2 | 16:22 → 16:23 |
| Stepped views + overlay | 3–8 / 2–3 | 16.8 | 2 | 16:23 → 16:24 |

Controls and failure checks passed in Chromium: all twelve stationary frames; five times with both lighting modes; simulated-time stepping/wraparound; hidden/resume pause; missing frame → still; missing frame and original → plain; frame timeout; simulated rejected gradient assignments; zero Earth-off asset requests; both iframe dimensions; fitting a 768-pixel-wide host; settings URL; 60 generated tick marks; no page JavaScript errors. Syntax and whitespace checks passed. `git diff -- src/` was empty.

Ten full-size captures covered all five illustrative times in landscape and portrait. Two retained examples: [landscape dawn](previews/motion-landscape-dawn.jpg), [portrait night](previews/motion-portrait-night.jpg). At these desktop sizes, hands, digital time and date remain identifiable. Night/evening can make geography nearly disappear at 28%; day/dawn expose much more geography. The cloud-free pre-rendered texture looks different from the original cloudy still, so compare stationary pre-rendered against stepped pre-rendered to isolate motion. The coarse 30° jumps are noticeable changes of scene, not continuous Living Earth-style motion. No physical screen brightness or dark adaptation was evaluated.

## Repeating checks and device handoff

[Browser checks](check-motion.cjs) require an **externally available Playwright installation and Chromium**, not a new runtime dependency of this static project. From the repository root, with Playwright resolvable by Node:

```sh
node --check test/earth/motion.js
node test/earth/check-motion.cjs
```

If needed, set `PLAYWRIGHT_MODULE` to the existing Playwright module path and `BROWSER_EXECUTABLE` to its Chromium binary. The runner creates a temporary localhost server on port 8001, writes results/captures under `/tmp/`, runs functional checks, and takes about four minutes for six real-time samples. It does not overwrite tracked evidence. The offline frame renderer and [attribution/license](assets/motion/ATTRIBUTION.md) describe reproducibility; generated frames carry CC BY-SA 3.0.

**Recommendation:** retain the original still as the default candidate. The stepped sequence demonstrates low-frequency, locally hosted changing longitudes within the asset budget, but its visible jumps may distract. Keep the illustrative lighting optional: it is useful for judging darker appearances but does not provide correct geographical sunlight. No new renderer is justified by this short desktop experiment alone.

**Actual iPad evidence: none.** TASK-2.4 should follow the full [feasibility protocol](../../docs/earth-backdrop-feasibility.md): record actual OS/UA, viewport, brightness and cache; measure visible startup and three cold/warm loads; settle for 60 seconds, then compare each viable mode for five minutes including rollover; inspect hands across frame decode/swap; compare stationary and moving copies of the same texture; check touch controls, failure paths and 60-second background/resume; perform the minimum 30-minute stability run. Old WebKit behavior, cache/decode memory, GPU/compositor smoothness, thermal/battery cost and user preference remain unmeasured. Motion is neither approved nor ruled out on that device. Production integration still requires the separate review decision.

## Harness scrolling correction — 2026-11-03

The initial harness left `html` at the production stylesheet's `overflow: hidden`, so a tall page clipped the preview despite the body's scrolling rule. The comparison now applies its harness class to both document roots and restores root scrolling; the standalone clock retains its viewport layout. Verified actual wheel scrolling and bottom-of-preview reachability at 1280 × 720, 1024 × 768, 768 × 1024 and 390 × 844, including portrait selection and lighting changes. The browser checks now cover scrolling reachability as a regression. The load/runtime measurements above describe the initial experiment before this layout-only correction.
