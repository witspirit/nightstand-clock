document.addEventListener('DOMContentLoaded', function() {
    var modeSelect = document.getElementById('time-mode');
    var mockTimeInput = document.getElementById('mock-time');
    var mockTimeGroup = document.getElementById('mock-time-group');
    var sizeSlider = document.getElementById('size-slider');
    var clockWrapper = document.getElementById('clock-wrapper');
    var resyncIndicator = document.getElementById('resync-indicator');
    var paletteStrip = document.getElementById('palette-strip');
    var paletteMarker = document.getElementById('palette-marker');
    var paletteLabels = document.getElementById('palette-labels');
    var paletteEditor = document.getElementById('palette-editor');
    var paletteApplyButton = document.getElementById('palette-apply');
    var paletteResetButton = document.getElementById('palette-reset');
    var paletteAddStopButton = document.getElementById('palette-add-stop');
    var palettePresetSelect = document.getElementById('palette-preset');
    var paletteApplyPresetButton = document.getElementById('palette-apply-preset');
    var paletteExportButton = document.getElementById('palette-export');
    var paletteImportButton = document.getElementById('palette-import');
    var paletteJsonInput = document.getElementById('palette-json');
    var paletteEditorStatus = document.getElementById('palette-editor-status');

    var useMock = false;
    var mockDate = new Date();

    var resyncReasonLabels = {
        start: 'Clock start',
        'manual-update': 'Manual updateNow()',
        'animation-mode-changed': 'Animation mode changed',
        'clock-jump-forward': 'Clock jumped forward',
        'clock-moved-backward': 'Clock moved backward',
        forced: 'Forced resync',
        unspecified: 'Unspecified'
    };

    var palettePresets = {
        natural: {
            label: 'Natural Day (Recommended)',
            stops: [
                [0, [8, 12, 28]],
                [5, [20, 28, 52]],
                [7, [110, 90, 95]],
                [9, [165, 210, 245]],
                [13, [125, 188, 245]],
                [17, [180, 206, 230]],
                [19, [198, 118, 78]],
                [21, [52, 44, 74]],
                [24, [8, 12, 28]]
            ]
        },
        cinematic: {
            label: 'Cinematic Contrast',
            stops: [
                [0, [6, 10, 24]],
                [4, [18, 24, 48]],
                [6.5, [125, 82, 70]],
                [9, [132, 188, 230]],
                [12, [102, 170, 248]],
                [16, [142, 202, 238]],
                [18.5, [214, 112, 62]],
                [20.5, [54, 40, 66]],
                [24, [6, 10, 24]]
            ]
        },
        highContrast: {
            label: 'High Contrast',
            stops: [
                [0, [0, 0, 0]],
                [6, [46, 35, 54]],
                [8, [148, 205, 240]],
                [12, [82, 172, 255]],
                [16, [148, 205, 240]],
                [18, [220, 118, 52]],
                [20, [32, 26, 44]],
                [24, [0, 0, 0]]
            ]
        },
        current: {
            label: 'Current Palette',
            stops: []
        }
    };

    function updateResyncIndicator(payload) {
        if (!resyncIndicator) {
            return;
        }

        if (!payload) {
            resyncIndicator.textContent = 'No resync yet';
            return;
        }

        var reason = payload.reason || 'unspecified';
        var label = resyncReasonLabels[reason] || reason;
        var stamp = new Date(payload.timestamp || Date.now());
        var hh = toTwoDigits(stamp.getHours());
        var mm = toTwoDigits(stamp.getMinutes());
        var ss = toTwoDigits(stamp.getSeconds());
        var ms = String(stamp.getMilliseconds());
        while (ms.length < 3) {
            ms = '0' + ms;
        }

        resyncIndicator.textContent = label + ' @ ' + hh + ':' + mm + ':' + ss + '.' + ms;
    }

    function rgbToHex(rgb) {
        var parts = [];
        for (var i = 0; i < rgb.length; i++) {
            var value = Math.max(0, Math.min(255, rgb[i]));
            var hex = value.toString(16).toUpperCase();
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            parts.push(hex);
        }
        return '#' + parts.join('');
    }

    function hexToRgb(hex) {
        var cleaned = String(hex || '').trim().replace('#', '');
        if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) {
            return null;
        }
        return [
            parseInt(cleaned.slice(0, 2), 16),
            parseInt(cleaned.slice(2, 4), 16),
            parseInt(cleaned.slice(4, 6), 16)
        ];
    }

    function setPaletteStatus(message, isError) {
        if (!paletteEditorStatus) {
            return;
        }
        paletteEditorStatus.textContent = message || '';
        paletteEditorStatus.style.color = isError ? '#ff9a9a' : '#c9d8ff';
    }

    function serializeStops(stops) {
        return JSON.stringify(stops, null, 2);
    }

    function getColorStops() {
        if (!clock || typeof clock.getColorStops !== 'function') {
            return [];
        }
        return clock.getColorStops();
    }

    function buildPaletteUI() {
        if (!paletteStrip || !paletteLabels) {
            return;
        }

        paletteLabels.innerHTML = '';
        var existingLines = paletteStrip.querySelectorAll('.palette-stop-line');
        for (var removeIdx = 0; removeIdx < existingLines.length; removeIdx++) {
            paletteStrip.removeChild(existingLines[removeIdx]);
        }

        var stops = getColorStops();
        if (!stops.length) {
            return;
        }

        var gradients = [];
        for (var i = 0; i < stops.length; i++) {
            var stopHour = Math.max(0, Math.min(24, stops[i][0]));
            var color = stops[i][1];
            var colorStr = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            var pct = (stopHour / 24) * 100;
            gradients.push(colorStr + ' ' + pct + '%');

            var stopLine = document.createElement('div');
            stopLine.className = 'palette-stop-line';
            stopLine.style.left = pct + '%';
            paletteStrip.appendChild(stopLine);

            var label = document.createElement('div');
            label.className = 'palette-label';

            var swatch = document.createElement('span');
            swatch.className = 'palette-swatch';
            swatch.style.backgroundColor = colorStr;

            var hourLabel = String(stopHour);
            if (hourLabel.length < 2) {
                hourLabel = '0' + hourLabel;
            }

            var text = document.createElement('span');
            text.textContent = hourLabel + ':00 ' + rgbToHex(color);

            label.appendChild(swatch);
            label.appendChild(text);
            paletteLabels.appendChild(label);
        }

        paletteStrip.style.background = 'linear-gradient(to right, ' + gradients.join(', ') + ')';
    }

    function createActionButton(label) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'palette-action-btn';
        button.textContent = label;
        return button;
    }

    function createPaletteEditorRow(stop, index) {
        var row = document.createElement('div');
        row.className = 'palette-editor-row';

        var orderLabel = document.createElement('span');
        orderLabel.textContent = 'Stop ' + (index + 1);

        var hourLabel = document.createElement('label');
        hourLabel.textContent = 'Hour';
        var hourInput = document.createElement('input');
        hourInput.type = 'number';
        hourInput.min = '0';
        hourInput.max = '24';
        hourInput.step = '0.25';
        hourInput.value = String(stop[0]);
        hourInput.className = 'palette-hour';

        var hexLabel = document.createElement('label');
        hexLabel.textContent = 'Hex';
        var hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.maxLength = 7;
        hexInput.value = rgbToHex(stop[1]);
        hexInput.className = 'palette-hex';

        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = rgbToHex(stop[1]);
        colorInput.className = 'palette-color';

        var deleteButton = createActionButton('Delete');
        deleteButton.className += ' palette-delete-stop';
        deleteButton.title = 'Delete this stop';
        deleteButton.style.padding = '4px 8px';
        deleteButton.style.fontSize = '12px';
        deleteButton.addEventListener('click', function() {
            if (!paletteEditor) {
                return;
            }
            var allRows = paletteEditor.querySelectorAll('.palette-editor-row');
            if (allRows.length <= 2) {
                setPaletteStatus('At least two stops are required.', true);
                return;
            }
            paletteEditor.removeChild(row);
            renumberPaletteRows();
            setPaletteStatus('Stop removed. Click Apply Palette to commit.');
        });

        colorInput.addEventListener('input', function() {
            hexInput.value = colorInput.value.toUpperCase();
        });

        hexInput.addEventListener('input', function() {
            var candidate = hexInput.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
                colorInput.value = candidate;
            }
        });

        row.appendChild(orderLabel);
        row.appendChild(hourLabel);
        row.appendChild(hourInput);
        row.appendChild(hexLabel);
        row.appendChild(hexInput);
        row.appendChild(colorInput);
        row.appendChild(deleteButton);
        return row;
    }

    function renumberPaletteRows() {
        if (!paletteEditor) {
            return;
        }
        var rows = paletteEditor.querySelectorAll('.palette-editor-row');
        for (var i = 0; i < rows.length; i++) {
            var label = rows[i].querySelector('span');
            if (label) {
                label.textContent = 'Stop ' + (i + 1);
            }
        }
    }

    function buildPaletteEditor() {
        if (!paletteEditor) {
            return;
        }

        paletteEditor.innerHTML = '';
        var stops = getColorStops();
        for (var i = 0; i < stops.length; i++) {
            paletteEditor.appendChild(createPaletteEditorRow(stops[i], i));
        }

        renumberPaletteRows();
        if (paletteJsonInput) {
            paletteJsonInput.value = serializeStops(stops);
        }
    }

    function collectPaletteStopsFromEditor() {
        if (!paletteEditor) {
            return null;
        }

        var rows = paletteEditor.querySelectorAll('.palette-editor-row');
        var nextStops = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var hourInput = row.querySelector('.palette-hour');
            var hexInput = row.querySelector('.palette-hex');

            var hour = parseFloat(hourInput.value);
            if (isNaN(hour) || hour < 0 || hour > 24) {
                return { error: 'Hour must be between 0 and 24 (row ' + (i + 1) + ').' };
            }

            var rgb = hexToRgb(hexInput.value);
            if (!rgb) {
                return { error: 'Hex color must be like #RRGGBB (row ' + (i + 1) + ').' };
            }

            nextStops.push([hour, rgb]);
        }

        if (nextStops.length < 2) {
            return { error: 'At least two color stops are required.' };
        }

        return { stops: nextStops };
    }

    function applyPaletteStops(stops, message) {
        if (!clock.setColorStops(stops)) {
            setPaletteStatus('Palette rejected by clock validation.', true);
            return false;
        }

        buildPaletteUI();
        buildPaletteEditor();
        updatePaletteMarker(timeProvider());
        setPaletteStatus(message || 'Palette applied.');
        return true;
    }

    function getMidHourForNewStop(stops) {
        if (!stops || stops.length < 2) {
            return 12;
        }

        var copy = stops.slice().sort(function(a, b) { return a[0] - b[0]; });
        var largestGap = -1;
        var largestIdx = 0;
        for (var i = 0; i < copy.length - 1; i++) {
            var gap = copy[i + 1][0] - copy[i][0];
            if (gap > largestGap) {
                largestGap = gap;
                largestIdx = i;
            }
        }
        if (largestGap <= 0) {
            return Math.min(24, Math.max(0, copy[copy.length - 1][0] + 1));
        }
        return Math.round((copy[largestIdx][0] + copy[largestIdx + 1][0]) * 2) / 4;
    }

    function addPaletteStop() {
        var collected = collectPaletteStopsFromEditor();
        if (!collected || collected.error) {
            setPaletteStatus(collected ? collected.error : 'Could not read palette editor.', true);
            return;
        }

        var stops = collected.stops;
        var hour = getMidHourForNewStop(stops);
        var sourceColor = stops[stops.length - 1][1];
        var nextStop = [hour, [sourceColor[0], sourceColor[1], sourceColor[2]]];

        paletteEditor.appendChild(createPaletteEditorRow(nextStop, stops.length));
        renumberPaletteRows();
        setPaletteStatus('Stop added. Adjust values and click Apply Palette.');
    }

    function populatePresetSelect() {
        if (!palettePresetSelect) {
            return;
        }

        palettePresetSelect.innerHTML = '';
        var keys = ['natural', 'cinematic', 'highContrast', 'current'];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var option = document.createElement('option');
            option.value = key;
            option.textContent = palettePresets[key].label;
            palettePresetSelect.appendChild(option);
        }
    }

    function importPaletteFromJson() {
        if (!paletteJsonInput) {
            return;
        }

        var raw = paletteJsonInput.value;
        var parsed = null;
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            setPaletteStatus('Invalid JSON. Check formatting and try again.', true);
            return;
        }

        if (!Array.isArray(parsed)) {
            setPaletteStatus('JSON must be an array of [hour,[r,g,b]] stops.', true);
            return;
        }

        if (!applyPaletteStops(parsed, 'Palette imported from JSON.')) {
            return;
        }

        if (palettePresetSelect) {
            palettePresetSelect.value = 'current';
        }
    }

    function exportPaletteToJson() {
        var stops = getColorStops();
        if (!paletteJsonInput) {
            return;
        }
        var serialized = serializeStops(stops);
        paletteJsonInput.value = serialized;
        paletteJsonInput.focus();
        paletteJsonInput.select();
        setPaletteStatus('Palette exported to JSON area (selected for copy).');
    }

    function updatePaletteMarker(now) {
        if (!paletteMarker) {
            return;
        }

        var time = now || timeProvider();
        var secondsIntoDay = (time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds() + (time.getMilliseconds() / 1000);
        var position = (secondsIntoDay / 86400) * 100;
        paletteMarker.style.left = position + '%';
    }

    function toTwoDigits(value) {
        return value < 10 ? '0' + value : String(value);
    }

    function syncMockInputWithDate() {
        var h = toTwoDigits(mockDate.getHours());
        var m = toTwoDigits(mockDate.getMinutes());
        var s = toTwoDigits(mockDate.getSeconds());
        mockTimeInput.value = h + ':' + m + ':' + s;
    }

    function updateMockDateFromInput() {
        var parsed = parseTimeValue(mockTimeInput.value);
        if (!parsed) return false;
        mockDate.setHours(parsed.hours);
        mockDate.setMinutes(parsed.minutes);
        mockDate.setSeconds(parsed.seconds);
        return true;
    }

    function parseTimeValue(timeVal) {
        var raw = String(timeVal || '').trim();
        var matched = raw.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
        if (!matched) {
            return null;
        }

        var hours = parseInt(matched[1], 10);
        var minutes = parseInt(matched[2], 10);
        var seconds = (matched[3] != null) ? parseInt(matched[3], 10) : 0;

        if (hours > 23 || minutes > 59 || seconds > 59) {
            return null;
        }

        return { hours: hours, minutes: minutes, seconds: seconds };
    }

    function formatTimeParts(parts) {
        return toTwoDigits(parts.hours) + ':' + toTwoDigits(parts.minutes) + ':' + toTwoDigits(parts.seconds);
    }

    function getSelectedSection(inputEl) {
        var position = inputEl.selectionStart;
        if (typeof position !== 'number') {
            return 'second';
        }
        if (position <= 2) {
            return 'hour';
        }
        if (position <= 5) {
            return 'minute';
        }
        return 'second';
    }

    function focusSection(inputEl, section) {
        if (section === 'hour') {
            inputEl.setSelectionRange(0, 2);
            return;
        }
        if (section === 'minute') {
            inputEl.setSelectionRange(3, 5);
            return;
        }
        inputEl.setSelectionRange(6, 8);
    }

    function getWrappedSegmentValue(baseParts, section, direction) {
        var stepped = new Date(2000, 0, 1, baseParts.hours, baseParts.minutes, baseParts.seconds, 0);

        if (section === 'hour') {
            stepped.setHours(stepped.getHours() + direction);
        } else if (section === 'minute') {
            stepped.setMinutes(stepped.getMinutes() + direction);
        } else {
            stepped.setSeconds(stepped.getSeconds() + direction);
        }

        return formatTimeParts({
            hours: stepped.getHours(),
            minutes: stepped.getMinutes(),
            seconds: stepped.getSeconds()
        });
    }

    function stepMockSection(section, direction) {
        var parsed = parseTimeValue(mockTimeInput.value) || {
            hours: mockDate.getHours(),
            minutes: mockDate.getMinutes(),
            seconds: mockDate.getSeconds()
        };

        var stepped = parseTimeValue(getWrappedSegmentValue(parsed, section, direction));
        mockDate.setHours(stepped.hours);
        mockDate.setMinutes(stepped.minutes);
        mockDate.setSeconds(stepped.seconds);
        syncMockInputWithDate();
        clock.updateNow();
        updatePaletteMarker(timeProvider());
        focusSection(mockTimeInput, section);
    }

    var timeProvider = function() {
        if (useMock) {
            return mockDate;
        }
        return new Date();
    };

    // Initialize clock
    var clock = window.initNightstandClock('clock-container', {
        timeProvider: timeProvider,
        onHandResync: updateResyncIndicator
    });

    buildPaletteUI();
    buildPaletteEditor();
    populatePresetSelect();
    updatePaletteMarker(timeProvider());

    clock.setAnimatedHands(!useMock);

    clock.start();

    // Event Listeners
    modeSelect.addEventListener('change', function() {
        useMock = (this.value === 'mock');
        clock.setAnimatedHands(!useMock);
        if (useMock) {
            mockTimeGroup.style.display = 'flex';
            syncMockInputWithDate();
            updateMockDateFromInput();
            clock.updateNow();
            updatePaletteMarker(timeProvider());
        } else {
            mockTimeGroup.style.display = 'none';
            updatePaletteMarker(timeProvider());
        }
    });

    mockTimeInput.addEventListener('input', function() {
        if (!useMock) {
            return;
        }

        if (updateMockDateFromInput()) {
            clock.updateNow();
            updatePaletteMarker(timeProvider());
        }
    });

    mockTimeInput.addEventListener('keydown', function(event) {
        if (!useMock) {
            return;
        }

        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return;
        }

        event.preventDefault();
        var direction = event.key === 'ArrowUp' ? 1 : -1;
        var section = getSelectedSection(mockTimeInput);
        stepMockSection(section, direction);
    });

    mockTimeInput.addEventListener('blur', function() {
        if (!useMock) {
            return;
        }

        if (!updateMockDateFromInput()) {
            syncMockInputWithDate();
        }
    });

    sizeSlider.addEventListener('input', function() {
        var size = parseInt(this.value, 10) || 100;
        var clamped = Math.max(1, Math.min(size, 100));
        var scale = clamped / 100;
        clockWrapper.style.setProperty('--clock-scale', String(scale));
    });

    if (paletteApplyButton) {
        paletteApplyButton.addEventListener('click', function() {
            var collected = collectPaletteStopsFromEditor();
            if (!collected || collected.error) {
                setPaletteStatus(collected ? collected.error : 'Could not read palette editor.', true);
                return;
            }

            if (!clock.setColorStops(collected.stops)) {
                setPaletteStatus('Palette rejected by clock validation.', true);
                return;
            }
            applyPaletteStops(collected.stops, 'Palette applied.');
            if (palettePresetSelect) {
                palettePresetSelect.value = 'current';
            }
        });
    }

    if (paletteResetButton) {
        paletteResetButton.addEventListener('click', function() {
            clock.resetColorStops();
            buildPaletteUI();
            buildPaletteEditor();
            updatePaletteMarker(timeProvider());
            setPaletteStatus('Palette reset to defaults.');
            if (palettePresetSelect) {
                palettePresetSelect.value = 'current';
            }
        });
    }

    if (paletteAddStopButton) {
        paletteAddStopButton.addEventListener('click', function() {
            addPaletteStop();
        });
    }

    if (paletteApplyPresetButton) {
        paletteApplyPresetButton.addEventListener('click', function() {
            if (!palettePresetSelect) {
                return;
            }
            var key = palettePresetSelect.value;
            if (key === 'current') {
                setPaletteStatus('Current palette is already active.');
                return;
            }
            var preset = palettePresets[key];
            if (!preset) {
                setPaletteStatus('Unknown preset.', true);
                return;
            }
            applyPaletteStops(preset.stops, 'Preset applied: ' + preset.label + '.');
            if (palettePresetSelect) {
                palettePresetSelect.value = 'current';
            }
        });
    }

    if (paletteExportButton) {
        paletteExportButton.addEventListener('click', function() {
            exportPaletteToJson();
        });
    }

    if (paletteImportButton) {
        paletteImportButton.addEventListener('click', function() {
            importPaletteFromJson();
        });
    }

    window.setInterval(function() {
        if (!useMock) {
            updatePaletteMarker(timeProvider());
        }
    }, 250);
});
