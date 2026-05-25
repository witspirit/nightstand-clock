document.addEventListener('DOMContentLoaded', function() {
    var modeSelect = document.getElementById('time-mode');
    var mockTimeInput = document.getElementById('mock-time');
    var mockTimeGroup = document.getElementById('mock-time-group');
    var sizeSlider = document.getElementById('size-slider');
    var clockWrapper = document.getElementById('clock-wrapper');
    var resyncIndicator = document.getElementById('resync-indicator');

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
        } else {
            mockTimeGroup.style.display = 'none';
        }
    });

    mockTimeInput.addEventListener('input', function() {
        if (!useMock) {
            return;
        }

        if (updateMockDateFromInput()) {
            clock.updateNow();
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
        var size = this.value;
        clockWrapper.style.width = size + '%';
        clockWrapper.style.height = size + 'vh';
    });
});
