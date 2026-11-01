# Earth backdrop feasibility — TASK-2.1

Research date: 2026-11-01. Repository baseline: `48192cf830c15d90ba09f150a3c3b92c6943b6a3`.

## Recommendation

Start with one locally hosted, pre-rendered Earth image, subdued by opacity and a dark overlay. Compare full-globe, offset/cropped, and faint compositions using the existing clock in an isolated experiment. Keep Earth optional and preserve the current time-of-day background as the fallback. This recommendation is an engineering judgment, not a measured iPad performance result or approval to integrate.

If the still composition is attractive, try a small set of pre-rendered views updated infrequently. Only investigate a live rendered globe if those views cannot deliver the desired appearance. A CSS rotation of a globe photograph turns the photograph like a disc; it does not reveal new longitudes. Changing brightness with local time is also different from calculating Earth's sunlit hemisphere.

No production files were changed, no imagery was bundled, and no browser performance measurements were taken for this research task. Experiments belong to TASK-2.2 and TASK-2.3; target-device comparison belongs to TASK-2.4.

## Target and evidence boundaries

The user's iPad is currently unavailable. Its model variant, installed iOS build, Safari user agent, actual viewport, and available graphics contexts are **unknown**. Use iOS 9.3-era Safari as a provisional research target, not an observed device configuration. Apple lists the iPad 2 among devices supported by [iOS 9.3.5](https://support.apple.com/en-us/103628); that does not establish what is installed on this particular iPad.

Apple specifies a 1024 × 768 display and an A5 processor in the [iPad 2 technical specifications](https://support.apple.com/en-us/111990). Use 1024 × 768 and 768 × 1024 as initial desktop layout cases. Browser chrome can reduce the usable viewport; record the actual dimensions later. Desktop viewport emulation and CPU throttling cannot reproduce the old WebKit engine, GPU, memory limits, or thermal behavior.

| Evidence level | What we have |
| --- | --- |
| Repository inspection | Current implementation, raw source sizes, earlier user observations |
| Published compatibility | Apple/WebKit documentation and Khronos announcement linked below |
| Engineering estimates | Relative costs, decoded-image arithmetic, proposed budgets |
| Actual target-device verification | None in this task; pending TASK-2.4 |

## Compatibility findings

- CSS custom properties arrived in Safari on iOS 9.3 according to [WebKit's release article](https://webkit.org/blog/6008/new-web-features-in-safari/). The clock depends on them for geometry and color. An earlier installed OS may therefore fail before any Earth renderer is involved. Prefixed transforms do not supply a CSS-variable fallback.
- Apple documents Canvas 2D use on iPad in its archived [Safari HTML5 Canvas Guide](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/HTML-canvas-guide/Introduction/Introduction.html). Basic API availability does not establish animation performance or a safe canvas memory budget.
- [Khronos announced WebGL availability in iOS 8](https://www.khronos.org/news/permalink/webgl-arrives-on-safari-for-ios-and-os-x). Its linked report includes iPad 2 testing, but it is historical evidence rather than verification of this user's device. If explored, request WebGL 1 with an `experimental-webgl` fallback, handle context creation failure and context loss, and query texture limits. Do not assume WebGL 2 or extensions.
- The existing test page uses Flexbox `gap` and CSS `min()`. Flex gaps arrived much later, in [Safari 14.1 / iOS 14.5](https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/); the [WebKit implementation history for min/max](https://bugs.webkit.org/show_bug.cgi?id=167000) also postdates iOS 9. Use ordinary margins, explicit widths/max-widths, and simple controls in the new experiment. Reusing clock code does not make the surrounding test UI compatible.
- Keep experimental browser scripts in the project's existing conservative JavaScript style: classic scripts, `var`, and ordinary functions. Serve JPEG/PNG assets from the same origin. Avoid a new dependency on modern modules, image formats, network APIs, or remote CDNs for the baseline.

## Rendering choices

The cost assessments below are estimates to test, not benchmark rankings. All four approaches can be statically hosted with local assets; none inherently needs a server or live imagery feed.

| Approach | Compatibility and startup | Ongoing work and memory | Assets and suitability |
| --- | --- | --- | --- |
| Still JPEG/PNG globe | Ordinary image loading; lowest implementation risk. Download and decode once. | No Earth animation loop. Compositing and overlays still have a cost. | One display-sized image. Best baseline for visual subtlety. JPEG suits an opaque dark rectangular backdrop; PNG can preserve transparency where needed. |
| Pre-rendered frames | Ordinary images plus a simple timer; decode more than one image. | Low update frequency is possible, but swapping can stutter. Keep only a bounded working set; decoded frames multiply memory. | Download grows with frame count. A frame sequence or small atlas can provide genuine changing views; neither automatically models current sunlight. Avoid a giant sprite sheet or eagerly decoding every frame. |
| Canvas 2D | Documented legacy API; decode texture and prepare a canvas. | Reprojection and pixel lighting in JavaScript can compete with clock maintenance. Lower resolution and redraw only when needed. | Texture plus renderer code; additional canvas backing buffers. Worth trying only for a specific effect the still/frames cannot supply. A clipped scrolling map is not a perspective-correct globe. |
| WebGL 1 globe | Historically available; context, shader compilation, texture upload, and error handling add startup work. | GPU rendering may outperform CPU reprojection, but extra draw calls, fill, textures, and context instability remain unmeasured. | Texture(s), mesh/shaders, and any compatible renderer code. Highest complexity; optional later spike, not a prerequisite. |

Compressed file size is not decoded memory. An approximate 8-bit RGBA buffer costs width × height × 4 bytes: 512² ≈ 1 MiB; 1024² ≈ 4 MiB; 2048 × 1024 ≈ 8 MiB. Twelve decoded 1024² frames alone are about 48 MiB. Actual browsers may retain additional copies and GPU buffers; these are arithmetic examples, not measured allocations or safe device limits.

For TASK-2.2, propose a 512-pixel globe first, with a 1024-pixel alternative only if visibly useful. Aim for at most 500 KiB of additional compressed assets in the initial still experiment. This is a provisional experiment budget, not a known browser limit; report actual bytes and visual tradeoffs. Do not ship NASA's full-resolution source textures directly to the iPad.

## Imagery shortlist and attribution

1. **Preferred still-image source: NASA Blue Marble (2002).** The [NASA resource page](https://science.nasa.gov/resource/blue-marble/) provides JPEG downloads, including a listed 1600 × 1200 image of 547.82 KB. The [original dataset page](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/) explains the composite and provides globe/texture context. Clouds are historical composited imagery, not current weather; any photographed/rendered shading stays baked into that image. Inspect the selected download's composition before choosing a crop.
2. **Texture alternative: Blue Marble: Next Generation.** The [NASA dataset page](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/) links base maps and topographic variants. These are historical monthly composites for seasonal appearance, not a live cloud feed. Use a downsampled map for offline pre-rendering or a later globe experiment. The dataset requests credit to “NASA Earth Observatory.”

[NASA's media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) allow educational/informational uses including personal web pages, ask for source acknowledgment, prohibit implying endorsement, and identify exceptions for third-party copyrighted content. Verify the individual asset's credit and restrictions when selecting it; do not treat every image on NASA's website as unrestricted. No Living Earth artwork is proposed for redistribution.

Keep an attribution file alongside any future experiment assets with the source page, exact download URL, retrieval date, original credit, and transformations (resize, crop, dimming, pre-rendering). For the 2002 composite retain: NASA Goddard Space Flight Center; image by Reto Stöckli; enhancements by Robert Simmon, with the full source credit linked. This is a provenance recommendation, not a claim that an asset has already been downloaded or cleared. Host the resulting asset locally so the iPad does not depend on NASA's current HTTPS configuration or cross-origin Canvas access.

## Current clock baseline

Inspection of `src/script.js` and `src/style.css` shows CSS keyframe hand animations, with prefixed animation properties. A JavaScript maintenance interval defaults to 1000 ms. Digital text and background color normally update on minute changes; hand resynchronization occurs at startup, on detected clock jumps, and through exposed controls. At the baseline commit, `docs/current-state.md` described requestAnimationFrame-driven hands and had stale styling values. The [current-state document](current-state.md) has since been aligned with the source; recheck the source when starting each experiment.

Raw UTF-8 source bytes measured with `wc -c` at the baseline commit:

| Resource | Bytes |
| --- | ---: |
| `src/index.html` | 945 |
| `src/style.css` | 4,313 |
| `src/script.js` | 15,805 |
| Total | 21,063 |

These are local file sizes, not compressed HTTP transfer sizes, load timings, or runtime metrics. The earlier user report in `docs/ipad2_observations.md` says the second hand was not entirely smooth; it is qualitative historical evidence, not a measurement of this revision.

## Repeatable comparison protocol

1. Record the commit, device model, OS/build, browser user agent, viewport, pixel ratio, orientation, browser/fullscreen mode, brightness, power state, connection, and cache condition. On the iPad, read Settings → General → About; also capture `navigator.userAgent`, `innerWidth`, `innerHeight`, and `devicePixelRatio` through the future experiment's simple diagnostics. Feature tests supplement version data; they do not replace it.
2. Serve the repository root locally with `python3 -m http.server 8000 --bind 127.0.0.1` and open `http://127.0.0.1:8000/src/` for the untouched baseline. Use the same host, origin, and network path for each subsequent experiment. A separate temporary static experiment host will be needed for the iPad; do not upload experiments through the documented production `src/` sync or run its `--delete` command for this work.
3. On desktop, use both initial viewport cases and log browser/hardware. First confirm the clock works, then run three cold-cache and three warm-cache loads. Record requested resources, actual transferred bytes, and navigation-to-visible-clock time; later also record time to visible Earth. Use available browser network/timeline tools and retain traces. Without usable tools, label manual timings as approximate. No modern performance API is required for the iPad experiment to load.
4. After a 60-second settling period, observe the clock-only page for five minutes, including a minute boundary. Record visible hand stalls, digital rollover correctness, interaction responsiveness, and any reload/crash. Keep instrumentation off for a visual run; then optionally collect a separate trace. A requestAnimationFrame callback rate would only indicate main-thread scheduling, not prove CSS hand animation smoothness.
5. Compare Earth-off and Earth-on within the **same experiment harness** using the same settings, alongside the untouched `/src/` baseline. This separates test controls' overhead from Earth's overhead. Repeat the same load and five-minute trials for each composition/renderer. Record asset dimensions, decoded-memory estimates, Earth update frequency, draw resolution, and all quality settings.
6. Review fixed preview times (02:00, 06:00, 12:00, 18:00, 22:00) and both orientations. Mock time is for comparable appearance; use real time for smoothness measurements. Test text/hand readability, excessive night brightness, touch controls, missing-image fallback, and unsupported-renderer fallback. The background palette is based on local clock time, not astronomical sunrise/sunset.
7. In TASK-2.4, repeat on the real iPad and run a minimum 30-minute stability trial for viable candidates. Background the browser for 60 seconds, resume, and check time and renderer recovery. A repeatable regression versus Earth-off, new crash, unreadable clock, or failed fallback rejects that configuration until revised. Prefer the simplest variant the user likes; no absolute FPS target is established by this research.

Result template (use one row per run, with trace/screenshot links where available):

| Run / environment | Variant and settings | Cache / bytes | Visible clock / Earth time | Observation duration / stalls | Readability / responsiveness | Resume / failures |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | Clock only | Pending | Pending | Pending | Pending | Pending |

## Handoff and pending checks

TASK-2.2 can proceed with still compositions, local attributed imagery, simple legacy-oriented controls, and an Earth-off comparison. TASK-2.3 should remain limited to infrequent pre-rendered changes and an illustrative lighting option unless the visuals establish a reason for live rendering. These are research recommendations for later task planning, not implementation authorization.

Pending actual iPad access: installed OS and browser identification; usable viewport; image decode/load measurements; Canvas/WebGL feature and limit probes if relevant; actual hand smoothness, thermal/stability behavior, low-brightness readability, and suspend/resume recovery. Research completion does not check off device acceptance. The final user review and any production integration remain separate work.
