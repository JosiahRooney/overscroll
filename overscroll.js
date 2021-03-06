window.overscroll = function (callback) {
    if (!navigator || !navigator.getBattery) {
        // getBattery is not supported on this browser
        return;
    }

    navigator.getBattery().then(function(battery) {
        if (navigator.platform !== 'MacIntel'
            || (battery.charging && battery.chargingTime === 0)) {
            // Not a MacBook
            return;
        }

        if (!window.overscroll.callbacks) {
            window.overscroll.callbacks = [callback];

            var mostReventScrollEvent = new Date().getTime();

            window.addEventListener('wheel', function (e) {
                var timeOfEvent = new Date().getTime();
                var direction = e.deltaY < 0 ? 'up' : 'down';

                setTimeout(function () {
                    if ((timeOfEvent - 1000) > mostReventScrollEvent
                        && (document.documentElement.scrollTop === 0 && direction === 'up')
                        || ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && direction === 'down')) {
                        for (var key in window.overscroll.callbacks) {
                            window.overscroll.callbacks[key]({
                                direction: direction
                            });
                        }
                    }
                });
            });

            window.addEventListener('scroll', function (e) { mostReventScrollEvent = new Date(); });
        } else {
            window.overscroll.callbacks.push(callback);
        }
    });
}
