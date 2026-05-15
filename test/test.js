document.addEventListener('DOMContentLoaded', function() {
    var modeSelect = document.getElementById('time-mode');
    var mockTimeInput = document.getElementById('mock-time');
    var mockTimeGroup = document.getElementById('mock-time-group');
    var sizeSlider = document.getElementById('size-slider');
    var clockWrapper = document.getElementById('clock-wrapper');

    var useMock = false;
    var mockDate = new Date();
    var pendingArrowDirection = 0;
    var pendingArrowBaseValue = null;

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
        var timeVal = mockTimeInput.value;
        if (timeVal) {
            var parsed = parseTimeValue(timeVal);
            mockDate.setHours(parsed.hours);
            mockDate.setMinutes(parsed.minutes);
            mockDate.setSeconds(parsed.seconds);
        }
    }

    function parseTimeValue(timeVal) {
        var parts = (timeVal || '').split(':');
        return {
            hours: parseInt(parts[0], 10) || 0,
            minutes: parseInt(parts[1], 10) || 0,
            seconds: parts.length > 2 ? (parseInt(parts[2], 10) || 0) : 0
        };
    }

    function formatTimeParts(parts) {
        return toTwoDigits(parts.hours) + ':' + toTwoDigits(parts.minutes) + ':' + toTwoDigits(parts.seconds);
    }

    function getWrappedSegmentValue(baseParts, section, direction) {
        var next = {
            hours: baseParts.hours,
            minutes: baseParts.minutes,
            seconds: baseParts.seconds
        };

        if (section === 'hour') {
            next.hours = (next.hours + direction + 24) % 24;
            return formatTimeParts(next);
        }

        if (section === 'minute') {
            next.minutes = (next.minutes + direction + 60) % 60;
            return formatTimeParts(next);
        }

        next.seconds = (next.seconds + direction + 60) % 60;
        return formatTimeParts(next);
    }

    function inferSteppedSection(baseValue, observedValue, direction) {
        var baseParts = parseTimeValue(baseValue);
        var normalizedObserved = formatTimeParts(parseTimeValue(observedValue));
        var sections = ['second', 'minute', 'hour'];

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var candidate = getWrappedSegmentValue(baseParts, section, direction);
            if (candidate === normalizedObserved) {
                return section;
            }
        }

        return 'minute';
    }

    function getSectionStepSeconds(section) {
        if (section === 'hour') {
            return 3600;
        }
        if (section === 'minute') {
            return 60;
        }
        return 1;
    }

    function stepMockTime(secondsDelta) {
        mockDate = new Date(mockDate.getTime() + (secondsDelta * 1000));
        syncMockInputWithDate();
        clock.updateNow();
    }

    var timeProvider = function() {
        if (useMock) {
            return mockDate;
        }
        return new Date();
    };

    // Initialize clock
    var clock = window.initNightstandClock('clock-container', {
        timeProvider: timeProvider
    });

    clock.start();

    // Event Listeners
    modeSelect.addEventListener('change', function() {
        useMock = (this.value === 'mock');
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
        if (useMock && pendingArrowDirection !== 0 && pendingArrowBaseValue) {
            var section = inferSteppedSection(pendingArrowBaseValue, mockTimeInput.value, pendingArrowDirection);
            var stepSeconds = getSectionStepSeconds(section);
            stepMockTime(pendingArrowDirection * stepSeconds);
            pendingArrowDirection = 0;
            pendingArrowBaseValue = null;
            return;
        }

        updateMockDateFromInput();
        clock.updateNow();
    });

    mockTimeInput.addEventListener('keydown', function(event) {
        if (!useMock) {
            return;
        }

        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return;
        }

        pendingArrowDirection = event.key === 'ArrowUp' ? 1 : -1;
        pendingArrowBaseValue = formatTimeParts(parseTimeValue(mockTimeInput.value));
    });

    sizeSlider.addEventListener('input', function() {
        var size = this.value;
        clockWrapper.style.width = size + '%';
        clockWrapper.style.height = size + 'vh';
    });
});
