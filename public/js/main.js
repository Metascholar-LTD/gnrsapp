(function ($) {
    "use strict";

    // Prevent double initialization - check if already initialized by React
    if (window.finanzaInitialized) {
        return;
    }

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 100);
    };
    spinner();
    
    // Initiate WOW.js only if not already initialized
    if (typeof WOW !== 'undefined' && !window.wowInstance) {
        try {
            window.wowInstance = new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: true,
                live: true
            });
            window.wowInstance.init();
        } catch (e) {
            console.warn('WOW.js initialization error:', e);
        }
    }

    // Mark as initialized
    window.finanzaInitialized = true;
    
})(jQuery);
