/* Test only. ES5 + optional Canvas 2D; projection happens offline. */
(function () {
    'use strict';
    function el(id) { return document.getElementById(id); }
    var query = {}, parts = location.search.substring(1).split('&'), i, pair;
    for (i = 0; i < parts.length; i++) { pair = parts[i].split('='); query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || ''); }
    var keys = ['view', 'preset', 'time', 'clock', 'opacity'];
    if (query.standalone !== '1') {
        document.documentElement.className = document.body.className = 'harness';
        el('controls').hidden = false;
        var frame = el('preview'), space = el('frame-space');
        function fit() {
            var portrait = el('viewport').value === 'portrait', w = portrait ? 768 : 1024, h = portrait ? 1024 : 768;
            var scale = Math.min(1, Math.max(.1, (document.documentElement.clientWidth - 32) / w));
            frame.width = w; frame.height = h;
            frame.style.webkitTransform = frame.style.transform = 'scale(' + scale + ')';
            space.style.width = w * scale + 'px'; space.style.height = h * scale + 'px';
        }
        function diagnostics() {
            if (frame.contentWindow && frame.contentWindow.earthSolarDiagnostics) el('diagnostics').textContent = JSON.stringify(frame.contentWindow.earthSolarDiagnostics(), null, 2);
        }
        function apply() {
            var url = 'solar.html?standalone=1', k;
            for (k = 0; k < keys.length; k++) url += '&' + keys[k] + '=' + encodeURIComponent(el(keys[k]).value);
            frame.src = url; el('direct').href = url; fit();
        }
        for (i = 0; i < keys.length; i++) {
            if (query[keys[i]]) el(keys[i]).value = query[keys[i]];
            el(keys[i]).addEventListener('change', apply);
        }
        el('settings').addEventListener('submit', function (e) { e.preventDefault(); });
        el('viewport').addEventListener('change', fit); window.addEventListener('resize', fit);
        el('read-diagnostics').addEventListener('click', diagnostics); frame.addEventListener('load', diagnostics);
        apply(); return;
    }
    el('scene').hidden = false;
    var dates = { dawn: [2,20,5,50], day: [2,20,12,0], dusk: [2,20,17,50], night: [2,20,0,0], summer: [5,21,12,0], winter: [11,21,12,0] };
    var preset = dates[query.preset] ? query.preset : 'dawn', values = dates[preset];
    var fixed = new Date(Date.UTC(2026, values[0], values[1], values[2], values[3], 0));
    // Production dial formats local time: mirror UTC fields into local date for fixed comparisons.
    var dialFixed = new Date(2026, values[0], values[1], values[2], values[3], 0);
    var realClock = query.clock === 'real', realSun = query.time === 'real';
    var view = ['solar','still','original','off'].indexOf(query.view) >= 0 ? query.view : 'solar', active = view;
    var started = Date.now(), clock = window.initNightstandClock('clock-container', { timeProvider: function () { return realClock ? new Date() : dialFixed; } });
    if (realClock) clock.start(); else { clock.setAnimatedHands(false); clock.updateNow(); }
    var clockMs = Date.now() - started, globe = el('globe'), image = el('earth'), canvas = el('solar');
    var opacity = ['28','32','40'].indexOf(query.opacity) >= 0 ? Number(query.opacity) / 100 : .28;
    globe.style.opacity = opacity;
    function position() {
        var d = Math.min(innerWidth, innerHeight) * .9;
        globe.style.width = globe.style.height = d + 'px';
        globe.style.left = (innerWidth-d)/2 + 'px'; globe.style.top = (innerHeight-d)/2 + 'px';
    }
    position(); window.addEventListener('resize', position);
    var context, day, night, output, depths, timer = null, pending = null, timeout = null;
    var suspended = !!document.hidden, ready = false, failure = '', firstMs = null, drawMs = null, draws = 0, solarDate = null, sunlight = null;
    function status() {
        el('image-status').textContent = (failure ? failure + ' ' : '') + active + ' · Brasschaat stationary · ' +
            (active === 'solar' && solarDate ? solarDate + ' · calculated sun / artistic twilight' : 'historical still / no calculated lighting') +
            ' · ' + (realClock ? 'local real clock' : 'UTC fixed dial');
    }
    function stop() { clearTimeout(timer); timer = null; }
    function cancel() {
        clearTimeout(timeout); timeout = null;
        if (pending) { pending.onload = pending.onerror = null; pending.removeAttribute('src'); pending = null; }
    }
    function fallback(reason) {
        stop(); cancel(); ready = false; failure = reason; canvas.style.display = 'none';
        day = night = output = depths = null;
        if (active === 'solar') { active = 'still'; load(); }
        else if (active === 'still') { active = 'original'; load(); }
        else { active = 'off'; globe.style.display = 'none'; status(); }
    }
    function schedule() {
        stop();
        if (active === 'solar' && realSun && ready && !suspended) timer = setTimeout(function () { timer = null; draw(); }, 60000);
    }
    function draw() {
        if (suspended || active !== 'solar') return;
        try {
            var begin = Date.now(), date = realSun ? new Date() : fixed;
            var sun = EarthSolar.sun(date), vector = sun.vector, pixels = output.data, a = day.data, b = night.data;
            var x, y, p, j, dot, mix, xx, yy;
            for (y = 0; y < 512; y++) {
                yy = -(y + .5 - 256) / 256;
                for (x = 0; x < 512; x++) {
                    p = y * 512 + x; j = p * 4;
                    if (depths[p] < 0) { pixels[j+3] = 0; continue; }
                    xx = (x + .5 - 256) / 256;
                    dot = xx * vector[0] + yy * vector[1] + depths[p] * vector[2];
                    mix = EarthSolar.blend(dot);
                    pixels[j] = a[j] * mix + b[j] * (1-mix);
                    pixels[j+1] = a[j+1] * mix + b[j+1] * (1-mix);
                    pixels[j+2] = a[j+2] * mix + b[j+2] * (1-mix); pixels[j+3] = 255;
                }
            }
            context.putImageData(output, 0, 0);
            image.style.display = 'none'; canvas.style.display = 'block'; globe.style.display = 'block';
            solarDate = date.toISOString(); sunlight = sun; draws++; drawMs = Date.now()-begin;
            if (firstMs === null) firstMs = Date.now()-started;
            status(); schedule();
        } catch (e) { fallback('Canvas draw failed; still fallback.'); }
    }
    function load() {
        cancel(); if (suspended || active === 'off') { status(); return; }
        if (active === 'solar') {
            try {
                context = canvas.getContext('2d');
                if (!context || typeof Float32Array === 'undefined') throw new Error('unsupported');
            } catch (e) { fallback('Canvas unsupported; still fallback.'); return; }
        }
        var incoming = new Image(); pending = incoming;
        incoming.onload = function () {
            clearTimeout(timeout); timeout = null; pending = null; incoming.onload = incoming.onerror = null;
            if (active !== 'solar') {
                image.src = incoming.src; image.style.display = 'block'; globe.style.display = 'block'; ready = true;
                if (firstMs === null) firstMs = Date.now()-started;
                status(); return;
            }
            try {
                context.drawImage(incoming, 0, 0, 512, 512);
                if (!day) { day = context.getImageData(0,0,512,512); load(); return; }
                night = context.getImageData(0,0,512,512); output = context.createImageData(512,512);
                depths = new Float32Array(512*512);
                var x, y, xx, yy, z;
                for (y=0; y<512; y++) for (x=0; x<512; x++) {
                    xx=(x+.5-256)/256; yy=(y+.5-256)/256; z=1-xx*xx-yy*yy;
                    depths[y*512+x] = z < 0 ? -1 : Math.sqrt(z);
                }
                ready = true; draw();
            } catch (e) { fallback('Canvas preparation failed; still fallback.'); }
        };
        incoming.onerror = function () { fallback('Image unavailable; fallback.'); };
        timeout = setTimeout(function () { fallback('Image timed out; fallback.'); },10000);
        incoming.src = active === 'original' ? 'assets/blue-marble-512.jpg' : 'assets/brasschaat/' + (active === 'solar' && day ? 'night' : 'day') + '.jpg';
    }
    function pause() { suspended = true; stop(); cancel(); if (!ready) day = night = null; }
    function resume() {
        suspended = !!document.hidden; if (suspended) return;
        if (!ready) load(); else if (active === 'solar') draw();
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else resume(); });
    window.addEventListener('pagehide', pause); window.addEventListener('pageshow', function (e) { if (e.persisted || suspended) resume(); });
    window.earthSolarDiagnostics = function () {
        return { userAgent:navigator.userAgent, viewport:[innerWidth,innerHeight], dpr:devicePixelRatio || 1,
            requestedView:view, activeView:active, preset:preset, realSun:realSun, realClock:realClock, opacity:opacity,
            coordinates:[51.293,4.494], solarUTC:solarDate, sun:sunlight, loading:!!pending, ready:ready,
            timerActive:timer !== null, suspended:suspended, cadenceMs:active === 'solar' && realSun ? 60000 : 0,
            draws:draws, lastDrawMs:drawMs, clockInitializedMs:clockMs, firstEarthLoadedMs:firstMs, failure:failure };
    };
    status(); if (active !== 'off') load();
}());
