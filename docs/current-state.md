# Nightstand Clock - Current State

Last updated: 2026-05-06

## What is implemented

- Full-screen analog clock layout with circular dial
- Three hands (hour, minute, second) with smooth motion via `requestAnimationFrame`
- Hour and minute tick marks (no digits)
- Digital readout inside dial (24h time + day/date)
- Time-of-day background color transitions (night, sunrise, day, sunset, evening)

## Recent session changes

### Hand origin and motion

- Fixed hand positioning so all hands originate from the exact center of the dial
- Removed hand geometry offsets that shifted the pivot point
- Fixed wrap-around glitch at 12 o'clock by using continuous angles:
  - prevents second hand from spinning backward when crossing 360 -> 0
  - same protection now applies to minute and hour hands

### Viewport scaling

- Clock now scales to fill available viewport space while staying circular
- Added small edge padding so it looks good in fullscreen and does not touch edges
- Sizing now uses `100vmin` minus padding for both width and height

### Digital section styling

- Removed glossy/glass background panel behind digital text
- Increased digital text size significantly for better low-light readability
- Repositioned digital block higher so it sits centered in the lower half of the dial
- Kept strong text contrast using white text plus shadow

## Current key style values

- `--clock-padding: 3vmin`
- `#digital-container`: `width: 78%`, `bottom: 27%`
- `#digital-time`: `18vmin` (capped at `116px` on wider screens)
- `#digital-date`: `7vmin` (capped at `44px` on wider screens)

## Compatibility notes

- Target environment includes old Safari on iPad 2
- Current CSS uses custom properties (`var(...)`), expected to work on iOS 9.3.x (latest iPad 2 OS)
- Prefixed fallbacks are present for some features (`-webkit-` transform/flex/animation paths)

## Suggested next steps (optional)

- Add a small compatibility fallback layer for critical CSS values in case of partial CSS variable support issues
- Remove temporary console logging once visual tuning is complete
- Optional final visual pass on hand proportions and dial contrast at night brightness
