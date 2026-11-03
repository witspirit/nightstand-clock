/* Classic ES5 script: native select controls, same-origin images, no Earth timers. */
(function () {
    'use strict';
    var presets = {
        off: { opacity: 0, size: 90, x: 50, y: 50 },
        full: { opacity: 20, size: 90, x: 50, y: 50 },
        offset: { opacity: 16, size: 140, x: 90, y: 35 },
        faint: { opacity: 8, size: 55, x: 50, y: 25 }
    };
    var hours = { night: 2, dawn: 6, day: 12, dusk: 18, evening: 22 };
    var keys = ['opacity', 'size', 'x', 'y'];
    function el(id) { return document.getElementById(id); }
    function parameters() {
        var result = {}, parts = location.search.substring(1).split('&'), i, pair;
        for (i = 0; i < parts.length; i++) {
            pair = parts[i].split('=');
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return result;
    }
    function selected(value, choices, fallback) {
        return Object.prototype.hasOwnProperty.call(choices, value) ? value : fallback;
    }
    function bounded(value, fallback, min, max) {
        var number = parseFloat(value);
        return isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
    }
    function diagnostics() {
        return navigator.userAgent + ' | actual viewport ' + window.innerWidth + ' × ' + window.innerHeight + ' | DPR ' + (window.devicePixelRatio || 1);
    }
    if (el('preview')) {
        var frame = el('preview'), space = el('frame-space');
        function fit() {
            var portrait = el('viewport').value === 'portrait';
            var width = portrait ? 768 : 1024, height = portrait ? 1024 : 768;
            var scale = Math.min(1, (document.documentElement.clientWidth - 32) / width);
            frame.width = width;
            frame.height = height;
            frame.style.webkitTransform = frame.style.transform = 'scale(' + scale + ')';
            space.style.width = (width * scale) + 'px';
            space.style.height = (height * scale) + 'px';
            el('diagnostics').textContent = 'Host: ' + diagnostics() + ' | preview ' + width + ' × ' + height + ', display scale ' + scale.toFixed(3);
        }
        function apply() {
            var query = '?composition=' + el('composition').value + '&condition=' + el('condition').value;
            var i;
            for (i = 0; i < keys.length; i++) query += '&' + keys[i] + '=' + el(keys[i]).value;
            frame.src = 'preview.html' + query;
            el('direct').href = frame.src;
            el('settings').textContent = el('composition').value + ' · ' + el('condition').value + ' · opacity ' + el('opacity').value + '% · diameter ' + el('size').value + '% · center ' + el('x').value + '%, ' + el('y').value + '%';
            fit();
        }
        function preset() {
            var values = presets[el('composition').value], i;
            for (i = 0; i < keys.length; i++) el(keys[i]).value = String(values[keys[i]]);
            apply();
        }
        el('composition').addEventListener('change', preset);
        el('condition').addEventListener('change', apply);
        el('viewport').addEventListener('change', fit);
        var i;
        for (i = 0; i < keys.length; i++) el(keys[i]).addEventListener('change', apply);
        window.addEventListener('resize', fit);
        preset();
    } else {
        var params = parameters();
        var composition = selected(params.composition, presets, 'full');
        var condition = selected(params.condition, hours, 'night');
        var defaults = presets[composition], image = el('earth');
        var opacity = composition === 'off' ? 0 : bounded(params.opacity, defaults.opacity, 0, 40);
        var size = bounded(params.size, defaults.size, 55, 170);
        var x = bounded(params.x, defaults.x, 10, 110), y = bounded(params.y, defaults.y, 10, 90);
        function position() {
            var diameter = Math.min(window.innerWidth, window.innerHeight) * size / 100;
            image.style.width = image.style.height = diameter + 'px';
            image.style.left = (window.innerWidth * x / 100 - diameter / 2) + 'px';
            image.style.top = (window.innerHeight * y / 100 - diameter / 2) + 'px';
        }
        image.style.opacity = opacity / 100;
        image.style.display = opacity === 0 ? 'none' : 'block';
        function missingImage() {
            image.style.display = 'none';
            el('image-status').textContent = 'Earth image unavailable — clock-only fallback.';
        }
        image.addEventListener('error', missingImage);
        if (image.complete && !image.naturalWidth) missingImage();
        position();
        window.addEventListener('resize', position);
        var fixedDate = new Date(2026, 10, 3, hours[condition], 0, 30, 0);
        var clock = window.initNightstandClock('clock-container', { timeProvider: function () { return fixedDate; } });
        clock.setAnimatedHands(false);
        clock.updateNow();
        // No start(): this is a fixed-time visual study with no maintenance timer.
        window.earthPreviewDiagnostics = diagnostics;
    }
}());
