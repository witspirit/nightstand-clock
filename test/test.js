document.addEventListener('DOMContentLoaded', function() {
    var modeSelect = document.getElementById('time-mode');
    var mockTimeInput = document.getElementById('mock-time');
    var mockSecondsInput = document.getElementById('mock-seconds');
    var mockTimeGroup = document.getElementById('mock-time-group');
    var mockSecondsGroup = document.getElementById('mock-seconds-group');
    var sizeSlider = document.getElementById('size-slider');
    var clockWrapper = document.getElementById('clock-wrapper');

    var useMock = false;
    var mockDate = new Date();

    function updateMockDate() {
        var timeVal = mockTimeInput.value;
        if (timeVal) {
            var parts = timeVal.split(':');
            mockDate.setHours(parseInt(parts[0], 10));
            mockDate.setMinutes(parseInt(parts[1], 10));
        }
        mockDate.setSeconds(parseInt(mockSecondsInput.value, 10));
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
            mockSecondsGroup.style.display = 'flex';
            updateMockDate();
            clock.updateNow();
        } else {
            mockTimeGroup.style.display = 'none';
            mockSecondsGroup.style.display = 'none';
        }
    });

    mockTimeInput.addEventListener('input', function() {
        updateMockDate();
        clock.updateNow();
    });

    mockSecondsInput.addEventListener('input', function() {
        updateMockDate();
        clock.updateNow();
    });

    sizeSlider.addEventListener('input', function() {
        var size = this.value;
        clockWrapper.style.width = size + '%';
        clockWrapper.style.height = size + 'vh';
    });
});
