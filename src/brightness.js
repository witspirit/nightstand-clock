/* Production brightness calibration. ES5; no CSS filters or Earth redraws. */
(function () {
    'use strict';
    var clock = document.getElementById('clock-container');
    var earth = document.getElementById('earth-backdrop');
    var panel = document.getElementById('brightness-panel');
    if (!clock || !earth || !panel) return;

    var key = 'nightstand-brightness-v1';
    var settings = { mode: 'auto', day: { clock: 100, earth: 100 }, night: { clock: 12, earth: 40 } };
    var toggle = document.getElementById('brightness-toggle');
    var modeButtons = document.getElementById('brightness-mode').querySelectorAll('button');
    var clockInput = document.getElementById('clock-brightness');
    var earthInput = document.getElementById('earth-brightness');
    var storageNote = document.getElementById('brightness-storage');
    var timer = null, suspended = !!document.hidden, applied = '';

    function validMode(value) { return value === 'auto' || value === 'day' || value === 'night'; }
    function intensity(value, fallback) {
        return typeof value === 'number' && isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : fallback;
    }
    function storageUnavailable() {
        storageNote.textContent = 'Settings apply for this session; device storage is unavailable. Tap the top-right corner to hide controls.';
    }
    try {
        var saved = JSON.parse(window.localStorage.getItem(key));
        if (saved && typeof saved === 'object') {
            if (validMode(saved.mode)) settings.mode = saved.mode;
            var names = ['day', 'night'];
            for (var i = 0; i < names.length; i++) {
                var name = names[i], profile = saved[name];
                if (profile && typeof profile === 'object') {
                    settings[name].clock = intensity(profile.clock, settings[name].clock);
                    settings[name].earth = intensity(profile.earth, settings[name].earth);
                }
            }
        }
    } catch (e) {
        // Malformed data and old Safari private-mode storage must not break the clock.
    }
    // Some Safari versions allow reads but reject writes (including private mode).
    function save() {
        try { window.localStorage.setItem(key, JSON.stringify(settings)); }
        catch (e) { storageUnavailable(); }
    }
    function activeProfile() {
        if (settings.mode !== 'auto') return settings.mode;
        var hour = new Date().getHours();
        return hour >= 8 && hour < 20 ? 'day' : 'night';
    }
    function apply() {
        var name = activeProfile(), profile = settings[name];
        var signature = name + ':' + profile.clock + ':' + profile.earth;
        if (signature !== applied) {
            clock.style.opacity = profile.clock / 100;
            earth.style.opacity = profile.earth / 100;
            applied = signature;
        }
        for (var i = 0; i < modeButtons.length; i++) {
            var selected = modeButtons[i].getAttribute('data-profile') === settings.mode;
            modeButtons[i].setAttribute('aria-pressed', selected ? 'true' : 'false');
        }
        clockInput.value = profile.clock;
        earthInput.value = profile.earth;
        document.getElementById('clock-brightness-value').textContent = profile.clock + '%';
        document.getElementById('earth-brightness-value').textContent = profile.earth + '%';
        document.getElementById('brightness-profile').textContent = 'Adjusting ' + name + ' profile' + (settings.mode === 'auto' ? ' (Auto)' : ' (manual override)');
    }
    function schedule() {
        clearTimeout(timer); timer = null;
        if (!suspended) timer = setTimeout(function () {
            timer = null; apply(); schedule();
        }, 60000 - (new Date().getTime() % 60000));
    }
    function show(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Hide brightness controls' : 'Show brightness controls');
        if (open) apply();
    }
    toggle.addEventListener('click', function () { show(panel.hidden); });
    document.getElementById('brightness-close').addEventListener('click', function () { show(false); toggle.focus(); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) { show(false); toggle.focus(); }
    });
    for (var buttonIndex = 0; buttonIndex < modeButtons.length; buttonIndex++) {
        modeButtons[buttonIndex].addEventListener('click', function () {
            var nextMode = this.getAttribute('data-profile');
            if (validMode(nextMode)) { settings.mode = nextMode; apply(); save(); }
        });
    }
    function change(layer, input) {
        settings[activeProfile()][layer] = intensity(Number(input.value), settings[activeProfile()][layer]);
        apply(); save();
    }
    clockInput.addEventListener('input', function () { change('clock', clockInput); });
    clockInput.addEventListener('change', function () { change('clock', clockInput); });
    earthInput.addEventListener('input', function () { change('earth', earthInput); });
    earthInput.addEventListener('change', function () { change('earth', earthInput); });
    function pause() { suspended = true; clearTimeout(timer); timer = null; }
    function resume() { suspended = !!document.hidden; if (!suspended) { apply(); schedule(); } }
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else resume(); });
    window.addEventListener('pagehide', pause);
    window.addEventListener('pageshow', resume);
    apply(); schedule();
}());
