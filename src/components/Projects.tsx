import { useEffect, useRef } from 'react';

export const Projects = () => {
  const carouselInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (carouselInitialized.current) return;

    // Initialize Owl Carousel for projects
    const initCarousel = () => {
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        if ($.fn.owlCarousel && !carouselInitialized.current) {
          // Check if carousel already exists
          const $carousel = $(".project-carousel");
          if ($carousel.length > 0 && $carousel.data('owl.carousel')) {
            return; // Already initialized
          }

          try {
            $carousel.owlCarousel({
              autoplay: true,
              smartSpeed: 1000,
              margin: 25,
              loop: true,
              center: true,
              dots: false,
              nav: true,
              navText: [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
              ],
              responsive: {
                0: {
                  items: 1
                },
                576: {
                  items: 1
                },
                768: {
                  items: 2
                },
                992: {
                  items: 3
                }
              }
            });
            carouselInitialized.current = true;
          } catch (e) {
            console.warn('Owl Carousel initialization error:', e);
          }
        }
      }
    };

    // Wait for DOM and scripts
    const tryInit = () => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Small delay to ensure DOM is ready
        setTimeout(initCarousel, 100);
      } else {
        window.addEventListener('load', () => setTimeout(initCarousel, 100), { once: true });
      }
    };

    tryInit();

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        if ($.fn.owlCarousel) {
          try {
            $(".project-carousel").owlCarousel('destroy');
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
      }
      carouselInitialized.current = false;
    };
  }, []);

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Initiatives</p>
          <h1 className="display-5 mb-5">Key National Resource Initiatives</h1>
        </div>
        <div className="owl-carousel project-carousel wow fadeInUp" data-wow-delay="0.3s">
          <div className="project-item pe-5 pb-5">
            <div className="project-img mb-3">
              <img className="img-fluid rounded" src="/img/service-1.jpg" alt="" />
              <a href="/education"><i className="fa fa-link fa-3x text-primary"></i></a>
            </div>
            <div className="project-title">
              <h4 className="mb-0">Education Access Program</h4>
            </div>
          </div>
          <div className="project-item pe-5 pb-5">
            <div className="project-img mb-3">
              <img className="img-fluid rounded" src="/img/service-2.jpg" alt="" />
              <a href="/jobs"><i className="fa fa-link fa-3x text-primary"></i></a>
            </div>
            <div className="project-title">
              <h4 className="mb-0">Employment Portal</h4>
            </div>
          </div>
          <div className="project-item pe-5 pb-5">
            <div className="project-img mb-3">
              <img className="img-fluid rounded" src="/img/service-3.jpg" alt="" />
              <a href="/news"><i className="fa fa-link fa-3x text-primary"></i></a>
            </div>
            <div className="project-title">
              <h4 className="mb-0">News & Information Hub</h4>
            </div>
          </div>
          <div className="project-item pe-5 pb-5">
            <div className="project-img mb-3">
              <img className="img-fluid rounded" src="/img/service-4.jpg" alt="" />
              <a href="/contact"><i className="fa fa-link fa-3x text-primary"></i></a>
            </div>
            <div className="project-title">
              <h4 className="mb-0">Resource Database</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
