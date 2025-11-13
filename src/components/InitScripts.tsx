import { useEffect, useRef } from 'react';

export const InitScripts = () => {
  const initialized = useRef(false);
  const scrollHandlersAttached = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    
    // Wait for jQuery and other scripts to load
    const initScripts = () => {
      if (typeof window !== 'undefined') {
        const $ = (window as any).jQuery;
        
        if ($ && !initialized.current) {
          initialized.current = true;

          // Spinner - hide immediately
          setTimeout(function () {
            if ($('#spinner').length > 0) {
              $('#spinner').removeClass('show');
            }
          }, 100);

          // Initiate WOW.js only once
          if ((window as any).WOW && !(window as any).wowInstance) {
            try {
              (window as any).wowInstance = new (window as any).WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: true,
                live: true,
                callback: function(box: any) {
                  // Callback when animation starts
                },
                scrollContainer: null
              });
              (window as any).wowInstance.init();
            } catch (e) {
              console.warn('WOW.js initialization error:', e);
            }
          }

          // Fixed Navbar - attach scroll handler only once
          if (!scrollHandlersAttached.current) {
            scrollHandlersAttached.current = true;
            
            $(window).off('scroll.navbar').on('scroll.navbar', function () {
              if ($(window).width() && $(window).width()! < 992) {
                if ($(this).scrollTop()! > 45) {
                  $('.fixed-top').addClass('bg-white shadow');
                } else {
                  $('.fixed-top').removeClass('bg-white shadow');
                }
              } else {
                if ($(this).scrollTop()! > 45) {
                  $('.fixed-top').addClass('bg-white shadow').css('top', -45);
                } else {
                  $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
                }
              }
            });

            // Back to top button - attach scroll handler only once
            $(window).off('scroll.backtotop').on('scroll.backtotop', function () {
              if ($(this).scrollTop()! > 300) {
                $('.back-to-top').fadeIn('slow');
              } else {
                $('.back-to-top').fadeOut('slow');
              }
            });
            
            // Back to top click handler - smooth native scroll
            $('.back-to-top').off('click.backtotop').on('click.backtotop', function (e: any) {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
              return false;
            });
          }
        }
      }
    };

    // Wait for DOM and scripts to be ready
    const tryInit = () => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initScripts();
      } else {
        window.addEventListener('load', initScripts, { once: true });
      }
    };

    // Try initialization
    tryInit();

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        const $ = (window as any).jQuery;
        if ($) {
          $(window).off('scroll.navbar scroll.backtotop');
          $('.back-to-top').off('click.backtotop');
        }
      }
    };
  }, []);

  return null;
};
