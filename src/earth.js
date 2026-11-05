/* Stationary Brasschaat Earth. NASA source credits: assets/earth/ATTRIBUTION.md.
 * ES5 + optional Canvas 2D. Local maps load once; buffers are reused each minute.
 */
(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        var globe = document.getElementById('earth-backdrop');
        if (!globe) return;
        var image = document.getElementById('earth-still'), canvas = document.getElementById('earth-surface');
        var context, day, night, output, depths, timer = null, pending = null, timeout = null;
        var suspended = !!document.hidden, ready = false, active = 'solar';
        function stop() { clearTimeout(timer); timer = null; }
        function cancel() {
            clearTimeout(timeout); timeout = null;
            if (pending) { pending.onload = pending.onerror = null; pending.removeAttribute('src'); pending = null; }
        }
        function fallback() {
            stop(); cancel(); ready = false; canvas.style.display = 'none';
            day = night = output = depths = null;
            if (active === 'solar') { active = 'still'; load(); }
            else { active = 'off'; globe.style.display = 'none'; }
        }
        function schedule() {
            stop();
            if (active === 'solar' && ready && !suspended) timer = setTimeout(function () { timer = null; draw(); }, 60000);
        }
        function draw() {
            if (suspended || active !== 'solar') return;
            try {
                var date = new Date();
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
                schedule();
            } catch (e) { fallback(); }
        }
        function load() {
            cancel();
            if (suspended || active === 'off') return;
            if (active === 'solar') {
                try {
                    context = canvas.getContext('2d');
                    if (!context || typeof Float32Array === 'undefined' || !window.EarthSolar) throw new Error('unsupported');
                } catch (e) { fallback(); return; }
            }
            var incoming = new Image(); pending = incoming;
            incoming.onload = function () {
                clearTimeout(timeout); timeout = null; pending = null; incoming.onload = incoming.onerror = null;
                if (active === 'still') {
                    image.src = incoming.src; image.style.display = 'block'; globe.style.display = 'block'; ready = true;
                    return;
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
                } catch (e) { fallback(); }
            };
            incoming.onerror = fallback;
            timeout = setTimeout(fallback,10000);
            incoming.src = 'assets/earth/' + (active === 'solar' && day ? 'night' : 'day') + '.jpg';
        }
        function pause() { suspended = true; stop(); cancel(); if (!ready) day = night = null; }
        function resume() {
            suspended = !!document.hidden;
            if (suspended) return;
            if (!ready) load(); else if (active === 'solar') draw();
        }
        document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else resume(); });
        window.addEventListener('pagehide', pause);
        window.addEventListener('pageshow', function (e) { if (e.persisted || suspended) resume(); });
        load();
    });
}());
