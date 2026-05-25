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
        var handAnimationEnabled = options.animateHands !== false;
        var maintenanceIntervalMs = options.maintenanceIntervalMs || 1000;
        var driftJumpThresholdMs = options.driftJumpThresholdMs || 4000;

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

        var isRunning = false;
        var maintenanceTimerId = null;
        var handAnimationInitialized = false;
        var lastObservedClockMs = null;
        var lastColorUpdateKey = -1;
        var lastDigitalMinuteKey = -1;

        function setHandTransform(hand, angle) {
            var value = 'rotate(' + angle + 'deg)';
            hand.style[transformProperty] = value;
            hand.style.webkitTransform = value;
        }

        function setHandAnimation(hand, durationMs, delayMs, playState) {
            hand.style.animationName = 'hand-rotate';
            hand.style.webkitAnimationName = 'hand-rotate';
            hand.style.animationDuration = durationMs + 'ms';
            hand.style.webkitAnimationDuration = durationMs + 'ms';
            hand.style.animationTimingFunction = 'linear';
            hand.style.webkitAnimationTimingFunction = 'linear';
            hand.style.animationIterationCount = 'infinite';
            hand.style.webkitAnimationIterationCount = 'infinite';
            hand.style.animationDelay = delayMs + 'ms';
            hand.style.webkitAnimationDelay = delayMs + 'ms';
            hand.style.animationFillMode = 'both';
            hand.style.webkitAnimationFillMode = 'both';
            hand.style.animationPlayState = playState;
            hand.style.webkitAnimationPlayState = playState;
        }

        function restartHandAnimation(hand) {
            hand.style.animationName = 'none';
            hand.style.webkitAnimationName = 'none';
            void hand.offsetWidth;
            hand.style.animationName = 'hand-rotate';
            hand.style.webkitAnimationName = 'hand-rotate';
        }

        function pauseHandAnimations() {
            secondHand.style.animationPlayState = 'paused';
            secondHand.style.webkitAnimationPlayState = 'paused';
            minuteHand.style.animationPlayState = 'paused';
            minuteHand.style.webkitAnimationPlayState = 'paused';
            hourHand.style.animationPlayState = 'paused';
            hourHand.style.webkitAnimationPlayState = 'paused';
        }

        function clearHandAnimations() {
            secondHand.style.animationName = 'none';
            secondHand.style.webkitAnimationName = 'none';
            minuteHand.style.animationName = 'none';
            minuteHand.style.webkitAnimationName = 'none';
            hourHand.style.animationName = 'none';
            hourHand.style.webkitAnimationName = 'none';
            pauseHandAnimations();
            handAnimationInitialized = false;
        }

        function syncHandPositions(now, forceResync) {
            var ms = now.getMilliseconds();
            var seconds = now.getSeconds();
            var minutes = now.getMinutes();
            var hours = now.getHours();

            var sAngle = (seconds + ms / 1000) * 6;
            var mAngle = (minutes + seconds / 60 + ms / 60000) * 6;
            var hAngle = ((hours % 12) + minutes / 60 + seconds / 3600 + ms / 3600000) * 30;

            if (!handAnimationEnabled) {
                setHandTransform(secondHand, sAngle);
                setHandTransform(minuteHand, mAngle);
                setHandTransform(hourHand, hAngle);
                clearHandAnimations();
                return;
            }

            if (!forceResync && handAnimationInitialized) {
                return;
            }

            var shouldRestart = forceResync || !handAnimationInitialized;
            var secondDelayMs = -((seconds * 1000) + ms);
            var minuteDelayMs = -((minutes * 60000) + (seconds * 1000) + ms);
            var hourDelayMs = -(((hours % 12) * 3600000) + (minutes * 60000) + (seconds * 1000) + ms);
            var playState = isRunning ? 'running' : 'paused';

            if (shouldRestart) {
                restartHandAnimation(secondHand);
                restartHandAnimation(minuteHand);
                restartHandAnimation(hourHand);
            }

            setHandAnimation(secondHand, 60000, secondDelayMs, playState);
            setHandAnimation(minuteHand, 3600000, minuteDelayMs, playState);
            setHandAnimation(hourHand, 43200000, hourDelayMs, playState);

            handAnimationInitialized = true;
        }

        function performMaintenance(forceHandResync) {
            if (!isRunning) return;

            try {
                var now = timeProvider();
                var minutes = now.getMinutes();
                var hours = now.getHours();
                var seconds = now.getSeconds();
                var shouldForceHandResync = !!forceHandResync;

                if (handAnimationEnabled && handAnimationInitialized && !shouldForceHandResync) {
                    var nowClockMs = now.getTime();
                    if (lastObservedClockMs !== null) {
                        var elapsedClockMs = nowClockMs - lastObservedClockMs;
                        if (elapsedClockMs < 0 || elapsedClockMs > (maintenanceIntervalMs + driftJumpThresholdMs)) {
                            shouldForceHandResync = true;
                        }
                    }
                    lastObservedClockMs = nowClockMs;
                } else {
                    lastObservedClockMs = now.getTime();
                }

                syncHandPositions(now, shouldForceHandResync);

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
                console.error("Error in maintenance tick:", e);
            }
        }

        return {
            start: function() {
                if (!isRunning) {
                    isRunning = true;
                    console.log("Starting clock...");
                    performMaintenance(true);
                    maintenanceTimerId = window.setInterval(function() {
                        performMaintenance(false);
                    }, maintenanceIntervalMs);
                }
            },
            stop: function() {
                isRunning = false;
                if (maintenanceTimerId) {
                    window.clearInterval(maintenanceTimerId);
                    maintenanceTimerId = null;
                }
                pauseHandAnimations();
            },
            updateNow: function() {
                // Force an immediate update
                var prevIsRunning = isRunning;
                isRunning = true;
                performMaintenance(true);
                if (!prevIsRunning) {
                    isRunning = false;
                    pauseHandAnimations();
                }
            },
            setAnimatedHands: function(enabled) {
                handAnimationEnabled = !!enabled;
                performMaintenance(true);
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
