(function() {
    console.log("Script initializing...");
    // Generate Ticks
    var ticksContainer = document.getElementById('ticks');
    if (!ticksContainer) console.error("Ticks container not found!");
    for (var i = 0; i < 60; i++) {
        var tickEl = document.createElement('div');
        tickEl.className = 'tick ' + (i % 5 === 0 ? 'tick-hour' : 'tick-minute');
        
        // Use standard and webkit prefixes
        var rotation = 'rotate(' + (i * 6) + 'deg)';
        tickEl.style.transform = rotation;
        tickEl.style.webkitTransform = rotation;
        
        ticksContainer.appendChild(tickEl);
    }

    var hourHand = document.getElementById('hour-hand');
    var minuteHand = document.getElementById('minute-hand');
    var secondHand = document.getElementById('second-hand');
    var digitalTime = document.getElementById('digital-time');
    var digitalDate = document.getElementById('digital-date');

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Define colors for specific hours (0-24)
    // Format: [Hour, [R, G, B]]
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
        
        // Pad zero
        var hStr = h < 10 ? '0' + h : h;
        var mStr = m < 10 ? '0' + m : m;
        
        var timeString = hStr + ':' + mStr;
        if (digitalTime.innerText !== timeString) {
            digitalTime.innerText = timeString;
            
            // Also update date when minute changes, safe enough
            var dayOfWeek = days[now.getDay()];
            var date = now.getDate();
            var month = months[now.getMonth()];
            digitalDate.innerText = dayOfWeek + ', ' + month + ' ' + date;
        }
    }

    var tickCount = 0;

    function tick() {
        try {
            var now = new Date();
            var ms = now.getMilliseconds();
            var seconds = now.getSeconds();
            var minutes = now.getMinutes();
            var hours = now.getHours();

            // Smooth continuous calculations
            var sAngle = (seconds + ms / 1000) * 6;
            var mAngle = (minutes + seconds / 60 + ms / 60000) * 6;
            var hAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;

            // Apply transformations
            secondHand.style.transform = 'rotate(' + sAngle + 'deg)';
            secondHand.style.webkitTransform = 'rotate(' + sAngle + 'deg)';
            
            minuteHand.style.transform = 'rotate(' + mAngle + 'deg)';
            minuteHand.style.webkitTransform = 'rotate(' + mAngle + 'deg)';
            
            hourHand.style.transform = 'rotate(' + hAngle + 'deg)';
            hourHand.style.webkitTransform = 'rotate(' + hAngle + 'deg)';

            // Update digital info
            updateDigitalTime(now);

            // Update background color smoothly
            var bgColor = getBackgroundColorForTime(hours, minutes, seconds);
            document.body.style.setProperty('--bg-color', bgColor);
            
            if (tickCount < 2) {
                console.log("Tick executed successfully. Time:", now);
                tickCount++;
            }
        } catch (e) {
            console.error("Error in tick:", e);
        }

        // Request next frame using prefix if necessary safely
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(tick);
        } else if (window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(tick);
        } else {
            window.setTimeout(tick, 1000/60);
        }
    }

    // Start the clock
    console.log("Starting clock...");
    tick();

})();
