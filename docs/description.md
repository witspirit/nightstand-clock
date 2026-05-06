# Nightstand Clock

## Context

I have an old iPad 2 on my nightstand and it acts as a nightstand clock via an app called
Living Earth. While nice, the clock part is itself a bit minimal and I want to have that more
prominent.
The easiest way it seems to show some custom stuff is to use a web page in Safari.

I want to have a web page that shows a clock to my specifications.

## Desired Look

* Analog clock with 3 hands (hour, minute, second)
* Large hour marks and smaller minute marks
* No actual digits on the dial
* Inside the dial, horizontally centered in the bottom half, 2 lines:
** Digital time (hour:minute, 24-hour format)
** Day of week, date
* Background color should more or less match the time of day:
** Dark at night, lighter during the day
** Rest of the clock should maintain contrast with background
** Use soft gradient transitions between the different times of day (e.g. from night to day
and back)
* Hands should smoothly transition between ticks, no "jumpiness"

## Tech Stack

Prefer web technologies that are compatible with Safari on an old iPad 2 or at least can
produce such output. The resulting page should be easily statically hosted.

