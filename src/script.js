(function(global) {
    console.log("Script loaded...");

    function initNightstandClock(containerId, options) {
        options = options || {};
        var timeProvider = options.timeProvider || function() { return new Date(); };
        
        var container = document.getElementById(containerId);
        if (!container) {
            console.error("Clock container not found:", containerId);
            return;
        }

        var ticksContainer = container.querySelector('#ticks');
        if (!ticksContainer) console.error("Ticks container not found!");
        
        // Generate Ticks
        ticksContainer.innerHTML = ''; // Clear in case of re-init
        for (var i = 0; i < 60; i++) {
            var tickEl = document.createElement('div');
            tickEl.className = 'tick ' + (i % 5 === 0 ? 'tick-hour' : 'tick-minute');
            
            var rotation = 'rotate(' + (i * 6) + 'deg)';
            tickEl.style.transform = rotation;
            tickEl.style.webkitTransform = rotation;
            
            ticksContainer.appendChild(tickEl);
        }

        var hourHand = container.querySelector('#hour-hand');
        var minuteHand = container.querySelector('#minute-hand');
        var secondHand = container.querySelector('#second-hand');
        var digitalTime = container.querySelector('#digital-time');
        var digitalDate = container.querySelector('#digital-date');

        var transformProperty = ('transform' in secondHand.style) ? 'transform' : 'webkitTransform';

        var handAngleState = {
            second: { raw: null, offset: 0 },
            minute: { raw: null, offset: 0 },
            hour: { raw: null, offset: 0 }
        };

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        var colorStops = [
            [0, [10, 10, 30]],    // Midnight
            [4, [15, 15, 40]],    // Deep night
            [6, [80, 50, 60]],    // Sunrise
            [8, [135, 206, 235]], // Morning
            [12, [100, 180, 255]],// Noon
            [16, [135, 206, 235]],// Afternoon
            [18, [200, 100, 50]], // Sunset
            [20, [40, 30, 60]],   // Evening
            [24, [10, 10, 30]]    // Midnight
        ];

        function interpolateColor(color1, color2, factor) {
            var result = [];
            for (var i = 0; i < 3; i++) {
                result[i] = Math.round(color1[i] + factor * (color2[i] - color1[i]));
            }
            return result;
        }

        function getBackgroundColorForTime(hours, minutes, seconds) {
            var timeInHours = hours + (minutes / 60) + (seconds / 3600);
            
            var startStop = colorStops[0];
            var endStop = colorStops[colorStops.length - 1];

            for (var i = 0; i < colorStops.length - 1; i++) {
                if (timeInHours >= colorStops[i][0] && timeInHours <= colorStops[i+1][0]) {
                    startStop = colorStops[i];
                    endStop = colorStops[i+1];
                    break;
                }
            }

            var range = endStop[0] - startStop[0];
            if (range === 0) return startStop[1];
            
            var factor = (timeInHours - startStop[0]) / range;
            var rgb = interpolateColor(startStop[1], endStop[1], factor);
            
            return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
        }

        function updateDigitalTime(now) {
            var h = now.getHours();
            var m = now.getMinutes();

            var hStr = h < 10 ? '0' + h : h;
            var mStr = m < 10 ? '0' + m : m;

            digitalTime.textContent = hStr + ':' + mStr;

            var dayOfWeek = days[now.getDay()];
            var date = now.getDate();
            var month = months[now.getMonth()];
            digitalDate.textContent = dayOfWeek + ', ' + month + ' ' + date;
        }

        function getContinuousAngle(rawAngle, state) {
            if (state.raw === null) {
                state.raw = rawAngle;
                return rawAngle;
            }

            var delta = rawAngle - state.raw;

            if (delta < -180) {
                state.offset += 360;
            } else if (delta > 180) {
                state.offset -= 360;
            }

            state.raw = rawAngle;
            return rawAngle + state.offset;
        }

        var isRunning = false;
        var animationFrameId = null;
        var lastColorUpdateKey = -1;
        var lastDigitalMinuteKey = -1;

        function tick() {
            if (!isRunning) return;

            try {
                var now = timeProvider();
                var ms = now.getMilliseconds();
                var seconds = now.getSeconds();
                var minutes = now.getMinutes();
                var hours = now.getHours();

                // Smooth continuous calculations
                var sAngle = (seconds + ms / 1000) * 6;
                var mAngle = (minutes + seconds / 60 + ms / 60000) * 6;
                var hAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;

                var sContinuous = getContinuousAngle(sAngle, handAngleState.second);
                var mContinuous = getContinuousAngle(mAngle, handAngleState.minute);
                var hContinuous = getContinuousAngle(hAngle, handAngleState.hour);

                // Apply transformations
                secondHand.style[transformProperty] = 'rotate(' + sContinuous + 'deg)';
                minuteHand.style[transformProperty] = 'rotate(' + mContinuous + 'deg)';
                hourHand.style[transformProperty] = 'rotate(' + hContinuous + 'deg)';

                // Update digital info only when minute changes
                var minuteKey = (now.getDate() * 1440) + (hours * 60) + minutes;
                if (minuteKey !== lastDigitalMinuteKey) {
                    updateDigitalTime(now);
                    lastDigitalMinuteKey = minuteKey;
                }

                // Optimization: Update background color only when visible minute changes
                var colorKey = (now.getDate() * 1440) + (hours * 60) + minutes;
                if (colorKey !== lastColorUpdateKey) {
                    var bgColor = getBackgroundColorForTime(hours, minutes, seconds);
                    document.body.style.setProperty('--bg-color', bgColor);
                    lastColorUpdateKey = colorKey;
                }
                
            } catch (e) {
                console.error("Error in tick:", e);
            }

            if (window.requestAnimationFrame) {
                animationFrameId = window.requestAnimationFrame(tick);
            } else if (window.webkitRequestAnimationFrame) {
                animationFrameId = window.webkitRequestAnimationFrame(tick);
            } else {
                animationFrameId = window.setTimeout(tick, 1000/60);
            }
        }

        return {
            start: function() {
                if (!isRunning) {
                    isRunning = true;
                    console.log("Starting clock...");
                    tick();
                }
            },
            stop: function() {
                isRunning = false;
                if (animationFrameId) {
                    if (window.cancelAnimationFrame) {
                        window.cancelAnimationFrame(animationFrameId);
                    } else if (window.webkitCancelAnimationFrame) {
                        window.webkitCancelAnimationFrame(animationFrameId);
                    } else {
                        window.clearTimeout(animationFrameId);
                    }
                }
            },
            updateNow: function() {
                // Force an immediate update
                var prevIsRunning = isRunning;
                isRunning = true;
                tick();
                if (!prevIsRunning) this.stop();
            }
        };
    }

    // Expose to global scope
    global.initNightstandClock = initNightstandClock;

    // Auto-init if we're not in a test environment and default container is present
    document.addEventListener("DOMContentLoaded", function() {
        if (!global.__TEST_MODE__ && document.getElementById('clock-container')) {
            var clock = initNightstandClock('clock-container');
            if (clock) clock.start();
        }
    });

})(window);
