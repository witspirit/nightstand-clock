# Brightness controls

The production `src/index.html` page includes brightness calibration for use in the iPad Home Screen app. Tap the invisible **64 × 64 pixel target in the top-right corner** to show or hide the panel. The panel also has a Hide button; Escape closes it on a keyboard. It starts closed after every launch. The closed target has no icon, border, background or tap highlight, including when both intensity settings are zero.

Clock and Earth sliders independently control their layer opacity from 0–100%. Zero hides that layer; Earth 40% matches the preceding production appearance, and Clock 100% matches the original dial/hands. Percentages describe opacity, not measured luminance or the iPad hardware brightness setting. Dim hands can reveal the underlying Earth, so evaluate the two settings together. The black surround remains black. Controls have their own dark styling so they stay usable even with both layers hidden.

## Profiles

| Profile | Initial clock | Initial Earth |
| --- | ---: | ---: |
| Day | 100% | 40% |
| Night | 12% | 40% |

Auto is the default and selects Day from **08:00 inclusive to 20:00 exclusive**, using the device's local clock. It selects Night otherwise. This fixed schedule is separate from the Earth renderer's astronomical sunlight calculations: Black Marble remains naturally darker than the daylight image. No additional Earth dimming is imposed by default.

Select Day or Night to preview and edit that profile at any time. This is a persistent manual override; select **Auto again** to restore timed switching. In Auto, sliders edit whichever profile is currently active, named in the panel. Changes apply immediately and save locally, including the selected mode. The schedule is checked each minute and when the app resumes; automatic changes are discrete. There is no continuously running brightness animation or additional Earth redraw.

Settings belong to the browser/Home Screen app and website origin, rather than an account. Moving between the S3 endpoint and DNS alias can therefore use different saved settings. If local storage is blocked or full, changes still work for the session and the panel explains that they cannot save. Invalid saved data falls back to defaults. The page starts with a dim clock while assets load to avoid an initial full-white dial flash.

## iPad trial and deployment

Upload the **entire `src/` tree**, including the new `brightness.js`. The HTML retains `apple-mobile-web-app-capable=yes` and the `black` status bar style. Shared asset URLs now use `brightness-1`; serve HTML with revalidation so a normal reload discovers them. See [hosting](hosting.md). These changes do not themselves upload the bundle or replace the deployed website.

1. Open the updated production URL from the iPad Home Screen to use standalone mode. If creating the shortcut, use Safari's Add to Home Screen. Confirm the browser chrome is absent and the status bar is black on the actual iPad.
2. Disable the accessibility dimming filter and set hardware brightness low. Tap the top-right corner, select Night, and tune Clock first. Adjust Earth separately; hide the panel between comparisons.
3. Repeat for Day. Select Auto when finished, then relaunch and confirm settings persist and controls stay hidden.
4. Review portrait and landscape, resume after backgrounding, and clock-hand smoothness across an Earth minute redraw. Compare both day and night imagery during actual use. Repeat an overnight trial after selecting comfortable values.

Desktop checks cannot establish physical brightness comfort, old-Safari compatibility, status bar behavior or sustained iPad performance. Actual-device acceptance remains with TASK-2.4.

## Desktop verification

On 2026-11-08, the production brightness browser check passed in Chromium 156.0.8078.4. It covers touch opening/closing (including with both layers at zero), independent intensity, profile persistence, local 08:00/20:00 boundaries, resume, malformed and blocked storage, black background, standalone metadata, real CSS hand movement and versioned resource URLs. Portrait and landscape captures were inspected. The existing browser cache/layout regression also passed in three viewport sizes.

The full production Earth regression also passed: four illumination instants in both orientations, a simulated day of minute redraws with reused buffers and image requests, hide/resume cycles, renderer/image fallbacks, and two actual 65-second observations across clock/Earth updates. Results are in `/tmp/production-earth-results.json` for this run. No production rendering changes were needed; the brightness runner's animation assertion was corrected to observe real CSS animation time separately from simulated JavaScript time.

Run `node test/check-brightness.cjs` with Playwright available. As with the other browser runners, `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` can point to an existing external installation. Results and captures are written to `/tmp/brightness-*`. These desktop checks do not replace the iPad trial above.
