import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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
              margin: 20,
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
    <div className="container-fluid py-5" style={{ backgroundColor: '#FAFAFA' }}>
      <style>{`
        .project-item {
          max-width: 350px;
          margin: 0 auto;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .project-item .project-img {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .project-item .project-img img {
          width: 100%;
          height: auto;
          display: block;
          transition: all 0.3s ease;
        }
        
        .project-item .project-title {
          position: relative !important;
          top: auto !important;
          right: auto !important;
          bottom: auto !important;
          left: auto !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          border-radius: 8px;
          display: block;
          padding: 0.75rem 1rem !important;
          z-index: 1 !important;
          margin-top: 0.5rem;
          background: transparent !important;
          transition: all 0.3s ease;
        }
        
        .project-item:hover {
          transform: translateY(-5px);
        }
        
        .project-item:hover .project-title {
          background: #E8E8E8 !important;
          border-color: rgba(0, 0, 0, 0.2) !important;
        }
        
        .project-item .project-title h4 {
          color: inherit !important;
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          transition: all 0.3s ease;
        }
        
        .project-item:hover .project-title h4 {
          color: inherit !important;
        }
      `}</style>
      <div className="container" style={{ maxWidth: '100%', paddingLeft: 'clamp(15px, 5vw, 80px)', paddingRight: 'clamp(15px, 5vw, 80px)' }}>
        <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Initiatives</p>
          <div style={{ 
            width: '100%', 
            height: '1px', 
            backgroundColor: 'rgba(0, 0, 0, 0.1)', 
            margin: '16px auto 24px auto',
            maxWidth: '200px'
          }}></div>
          <h1 className="display-5 mb-4" style={{ fontSize: '2rem' }}>Key National Resource Initiatives</h1>
        </div>
        <div className="owl-carousel project-carousel wow fadeInUp" data-wow-delay="0.3s">
          <Link to="/education" className="project-item pe-3 pb-3" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="project-img mb-2">
              <img className="img-fluid rounded" src="/img/service-1.jpg" alt="" style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="project-title">
              <h4 className="mb-0" style={{ fontSize: '1rem' }}>Education Access Program</h4>
            </div>
          </Link>
          <Link to="/jobs" className="project-item pe-3 pb-3" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="project-img mb-2">
              <img className="img-fluid rounded" src="/img/service-2.jpg" alt="" style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="project-title">
              <h4 className="mb-0" style={{ fontSize: '1rem' }}>Employment Portal</h4>
            </div>
          </Link>
          <Link to="/news" className="project-item pe-3 pb-3" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="project-img mb-2">
              <img className="img-fluid rounded" src="/img/service-3.jpg" alt="" style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="project-title">
              <h4 className="mb-0" style={{ fontSize: '1rem' }}>News & Information Hub</h4>
            </div>
          </Link>
          <Link to="/directories" className="project-item pe-3 pb-3" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="project-img mb-2">
              <img className="img-fluid rounded" src="/img/service-4.jpg" alt="" style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="project-title">
              <h4 className="mb-0" style={{ fontSize: '1rem' }}>Resource Database</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
