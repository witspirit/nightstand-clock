/* Classic ES5; no Canvas, WebGL, CSS filters, runtime libraries or remote requests. */
(function () {
    'use strict';
    function el(id) { return document.getElementById(id); }
    function params() {
        var result = {}, parts = location.search.substring(1).split('&'), i, pair;
        for (i = 0; i < parts.length; i++) {
            pair = parts[i].split('=');
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return result;
    }
    var query = params(), keys = ['view', 'motion', 'frame', 'lighting', 'condition', 'clock', 'opacity'];
    if (query.standalone !== '1') {
        document.documentElement.className = 'harness';
        document.body.className = 'harness';
        el('controls').hidden = false;
        var frame = el('preview'), space = el('frame-space');
        function fit() {
            var portrait = el('viewport').value === 'portrait';
            var width = portrait ? 768 : 1024, height = portrait ? 1024 : 768;
            var scale = Math.min(1, Math.max(0.1, (document.documentElement.clientWidth - 32) / width));
            frame.width = width; frame.height = height;
            frame.style.webkitTransform = frame.style.transform = 'scale(' + scale + ')';
            space.style.width = (width * scale) + 'px'; space.style.height = (height * scale) + 'px';
        }
        function readDiagnostics() {
            var win = frame.contentWindow;
            if (win && win.earthMotionDiagnostics) el('diagnostics').textContent = JSON.stringify(win.earthMotionDiagnostics(), null, 2);
        }
        function apply() {
            var url = 'motion.html?standalone=1', i;
            for (i = 0; i < keys.length; i++) url += '&' + keys[i] + '=' + encodeURIComponent(el(keys[i]).value);
            frame.src = url; el('direct').href = url;
            el('motion').disabled = el('view').value !== 'frames';
            el('frame').disabled = el('view').value !== 'frames';
            fit();
        }
        el('settings').addEventListener('submit', function (event) { event.preventDefault(); });
        var i;
        for (i = 0; i < keys.length; i++) el(keys[i]).addEventListener('change', apply);
        el('viewport').addEventListener('change', fit);
        el('read-diagnostics').addEventListener('click', readDiagnostics);
        frame.addEventListener('load', readDiagnostics);
        window.addEventListener('resize', fit);
        apply();
        return;
    }
    el('scene').hidden = false;
    function choice(value, values, fallback) { return values.indexOf(value) >= 0 ? value : fallback; }
    var hours = { night: 2, dawn: 6, day: 12, dusk: 18, evening: 22 };
    var view = choice(query.view, ['original', 'frames', 'off'], 'original');
    var motion = choice(query.motion, ['still', 'step'], 'still');
    var lighting = choice(query.lighting, ['off', 'illustrative'], 'off');
    var condition = Object.prototype.hasOwnProperty.call(hours, query.condition) ? query.condition : 'night';
    var real = query.clock === 'real', opacity = Number(choice(query.opacity, ['28', '32', '40'], '28')) / 100;
    var index = parseInt(query.frame, 10);
    if (!(index >= 0 && index < 12)) index = 0;
    var fixed = new Date(2026, 10, 3, hours[condition], 0, 30, 0);
    var started = Date.now(), clockVisibleMs;
    var clock = window.initNightstandClock('clock-container', { timeProvider: function () { return real ? new Date() : fixed; } });
    if (real) clock.start();
    else { clock.setAnimatedHands(false); clock.updateNow(); }
    clockVisibleMs = Date.now() - started;
    var globe = el('globe'), shade = el('shade'), current = el('earth');
    var timer = null, loadTimer = null, pending = null, swaps = 0, firstEarthMs = null, lastLoadMs = null;
    var failure = '', loaded = false, activeView = view;
    function position() {
        var diameter = Math.min(window.innerWidth, window.innerHeight) * 0.9;
        globe.style.width = globe.style.height = diameter + 'px';
        globe.style.left = (window.innerWidth - diameter) / 2 + 'px';
        globe.style.top = (window.innerHeight - diameter) / 2 + 'px';
    }
    position(); window.addEventListener('resize', position); globe.style.opacity = opacity;
    // Artwork only: the gradient is deliberately independent of longitude, date and real clock.
    var gradients = {
        night: 'linear-gradient(to right, rgba(0,0,0,.92) 55%, rgba(0,0,0,.25) 100%)',
        dawn: 'linear-gradient(to right, rgba(0,0,0,.9) 35%, rgba(0,0,0,0) 65%)',
        day: 'linear-gradient(to right, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 45%)',
        dusk: 'linear-gradient(to left, rgba(0,0,0,.9) 35%, rgba(0,0,0,0) 65%)',
        evening: 'linear-gradient(to left, rgba(0,0,0,.92) 55%, rgba(0,0,0,.25) 100%)'
    };
    shade.style.backgroundImage = gradients[condition];
    if (!shade.style.backgroundImage) shade.style.backgroundImage = gradients[condition].replace('linear-gradient(to right', '-webkit-linear-gradient(left').replace('linear-gradient(to left', '-webkit-linear-gradient(right');
    var gradientSupported = !!shade.style.backgroundImage;
    shade.style.display = lighting === 'illustrative' && gradientSupported ? 'block' : 'none';
    function status() {
        el('image-status').textContent = (failure ? failure + ' ' : '') +
            (activeView === 'off' ? 'Earth off' : activeView === 'original' ? 'Original still' : 'Pre-rendered view ' + index + (motion === 'step' ? ' · 30-second steps' : ' · stationary')) +
            ' · ' + (lighting === 'illustrative' && gradientSupported ? 'ILLUSTRATIVE lighting: ' + condition + ' (not solar position)' : lighting === 'illustrative' ? 'Lighting unsupported: unlit-overlay fallback' : 'Baked-in shading only') +
            ' · ' + (real ? 'real clock' : 'fixed clock');
    }
    function stopTimer() { clearTimeout(timer); timer = null; }
    function schedule() {
        stopTimer();
        if (activeView === 'frames' && motion === 'step' && loaded && !document.hidden) {
            timer = setTimeout(function () { timer = null; load((index + 1) % 12); }, 30000);
        }
    }
    function cancelLoad() {
        clearTimeout(loadTimer); loadTimer = null;
        if (pending) { pending.onload = pending.onerror = null; pending.removeAttribute('src'); pending = null; }
    }
    function fallback() {
        cancelLoad(); stopTimer();
        if (activeView === 'frames') {
            failure = 'Frame unavailable; original still fallback.'; activeView = 'original'; load(0);
        } else {
            failure = 'Earth unavailable; clock-only fallback.'; activeView = 'off';
            globe.style.display = 'none'; status();
        }
    }
    function load(next) {
        cancelLoad();
        var incoming = new Image(), loadStarted = Date.now(); pending = incoming;
        incoming.alt = ''; incoming.id = 'earth';
        incoming.onload = function () {
            clearTimeout(loadTimer); loadTimer = null; pending = null;
            lastLoadMs = Date.now() - loadStarted;
            if (firstEarthMs === null) firstEarthMs = Date.now() - started;
            current.parentNode.replaceChild(incoming, current); current = incoming;
            incoming.onload = incoming.onerror = null;
            index = next; loaded = true; swaps += 1; globe.style.display = 'block'; status(); schedule();
        };
        incoming.onerror = fallback;
        loadTimer = setTimeout(fallback, 10000);
        incoming.src = activeView === 'frames' ? 'assets/motion/view-' + ('0' + next).slice(-2) + '.jpg' : 'assets/blue-marble-512.jpg';
    }
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { stopTimer(); cancelLoad(); }
        else if (activeView !== 'off' && !loaded) load(index);
        else schedule();
    });
    window.addEventListener('pagehide', function () { stopTimer(); cancelLoad(); });
    window.addEventListener('pageshow', function () {
        if (activeView !== 'off' && !loaded && !pending) load(index);
        else schedule();
    });
    window.earthMotionDiagnostics = function () {
        return { userAgent: navigator.userAgent, viewport: [window.innerWidth, window.innerHeight], dpr: window.devicePixelRatio || 1,
            requestedView: view, activeView: activeView, motion: activeView === 'frames' ? motion : 'still', frame: index,
            lighting: lighting, gradientSupported: gradientSupported, appearance: condition, clock: real ? 'real' : 'fixed', opacity: opacity,
            cadenceMs: activeView === 'frames' && motion === 'step' ? 30000 : 0, timerActive: timer !== null,
            loading: !!pending, swaps: swaps, clockInitializedMs: clockVisibleMs, firstEarthLoadedMs: firstEarthMs,
            lastImageLoadMs: lastLoadMs, failure: failure };
    };
    status(); if (activeView !== 'off') load(index);
}());
