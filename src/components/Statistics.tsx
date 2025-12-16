import { useEffect, useRef, useState } from 'react';

export const Statistics = () => {
  const [counters, setCounters] = useState({
    registeredUsers: 0,
    visits24hrs: 0,
    totalVisits: 0,
    newsArticles: 0,
    totalResources: 0,
    skilledPersons: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targetValues = {
      registeredUsers: 1234,
      visits24hrs: 1234,
      totalVisits: 1234,
      newsArticles: 1234,
      totalResources: 1234,
      skilledPersons: 1234,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCounters({
        registeredUsers: Math.floor(targetValues.registeredUsers * easeOutQuart),
        visits24hrs: Math.floor(targetValues.visits24hrs * easeOutQuart),
        totalVisits: Math.floor(targetValues.totalVisits * easeOutQuart),
        newsArticles: Math.floor(targetValues.newsArticles * easeOutQuart),
        totalResources: Math.floor(targetValues.totalResources * easeOutQuart),
        skilledPersons: Math.floor(targetValues.skilledPersons * easeOutQuart),
      });

      if (currentStep >= steps) {
        setCounters(targetValues);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <>
      <style>{`
        .stat-item-separator {
          position: absolute;
          right: 0;
          top: 20%;
          bottom: 20%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3), transparent);
          display: none;
        }
        @media (min-width: 992px) {
          .stat-item-separator {
            display: block;
          }
        }
        .stat-item:last-child .stat-item-separator {
          display: none;
        }
      `}</style>
    <div 
      ref={sectionRef}
      className="container-fluid py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Geometric Pattern Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.4) 3px, transparent 3px),
            radial-gradient(circle at 85% 75%, rgba(255, 255, 255, 0.4) 3px, transparent 3px),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.25) 2px, transparent 2px),
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.12) 48%, rgba(255, 255, 255, 0.12) 52%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.12) 48%, rgba(255, 255, 255, 0.12) 52%, transparent 52%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 255, 255, 0.1) 40px, rgba(255, 255, 255, 0.1) 42px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255, 255, 255, 0.08) 60px, rgba(255, 255, 255, 0.08) 62px)
          `,
          backgroundSize: '150px 150px, 150px 150px, 200px 200px, 80px 80px, 80px 80px, 100px 100px, 120px 120px',
          backgroundPosition: '0 0, 100% 100%, 50% 50%, 0 0, 0 0, 0 0, 0 0',
        }}
      />

      <div className="container py-5" style={{ maxWidth: '100%', paddingLeft: 'clamp(15px, 5vw, 80px)', paddingRight: 'clamp(15px, 5vw, 80px)' }}>
        <div className="row g-4" style={{ justifyContent: 'center', alignItems: 'stretch' }}>
          {/* Registered Users */}
          <div className="col-lg-2 col-md-6 col-sm-6 text-center wow fadeInUp stat-item" data-wow-delay="0.1s" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-users"></i>
              </div>
              <h1 
                className="display-4 mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  fontSize: '3.5rem',
                  lineHeight: '1.2'
                }}
              >
                {counters.registeredUsers}
              </h1>
              <h5 
                className="mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                Registered Users
              </h5>
              <div 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#FFFFFF', 
                  margin: '0 auto',
                  marginTop: '8px'
                }}
              ></div>
            </div>
            <div className="stat-item-separator"></div>
          </div>

          {/* Visits in 24hrs */}
          <div className="col-lg-2 col-md-6 col-sm-6 text-center wow fadeInUp stat-item" data-wow-delay="0.2s" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-clock"></i>
              </div>
              <h1 
                className="display-4 mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  fontSize: '3.5rem',
                  lineHeight: '1.2'
                }}
              >
                {counters.visits24hrs}
              </h1>
              <h5 
                className="mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                Visits in 24hrs
              </h5>
              <div 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#FFFFFF', 
                  margin: '0 auto',
                  marginTop: '8px'
                }}
              ></div>
            </div>
            <div className="stat-item-separator"></div>
          </div>

          {/* Total Visit Count */}
          <div className="col-lg-2 col-md-6 col-sm-6 text-center wow fadeInUp stat-item" data-wow-delay="0.3s" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-chart-line"></i>
              </div>
              <h1 
                className="display-4 mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  fontSize: '3.5rem',
                  lineHeight: '1.2'
                }}
              >
                {counters.totalVisits}
              </h1>
              <h5 
                className="mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                Total Visit Count
              </h5>
              <div 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#FFFFFF', 
                  margin: '0 auto',
                  marginTop: '8px'
                }}
              ></div>
            </div>
            <div className="stat-item-separator"></div>
          </div>

          {/* News Articles */}
          <div className="col-lg-2 col-md-6 col-sm-6 text-center wow fadeInUp stat-item" data-wow-delay="0.4s" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-newspaper"></i>
              </div>
              <h1 
                className="display-4 mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  fontSize: '3.5rem',
                  lineHeight: '1.2'
                }}
              >
                {counters.newsArticles}
              </h1>
              <h5 
                className="mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                News Articles
              </h5>
              <div 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#FFFFFF', 
                  margin: '0 auto',
                  marginTop: '8px'
                }}
              ></div>
            </div>
            <div className="stat-item-separator"></div>
          </div>

          {/* Total Relevant Resources */}
          <div className="col-lg-2 col-md-6 col-sm-6 text-center wow fadeInUp stat-item" data-wow-delay="0.5s" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-database"></i>
              </div>
              <h1 
                className="display-4 mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  fontSize: '3.5rem',
                  lineHeight: '1.2'
                }}
              >
                {counters.totalResources}
              </h1>
              <h5 
                className="mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                Comprehensive Resource Collection
              </h5>
              <div 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#FFFFFF', 
                  margin: '0 auto',
                  marginTop: '8px'
                }}
              ></div>
            </div>
            <div className="stat-item-separator"></div>
          </div>

          {/* Skilled Professionals */}
          <div className="col-lg-2 col-md-6 col-sm-6 text-center wow fadeInUp stat-item" data-wow-delay="0.6s" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
               <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <img 
                   src="https://res.cloudinary.com/dsypclqxk/image/upload/v1765892770/electrical_h4tumf.png" 
                   alt="Skilled Professionals" 
                   style={{ width: '64px', height: '64px', filter: 'brightness(0) invert(1)' }}
                 />
              </div>
              <h1 
                className="display-4 mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  fontSize: '3.5rem',
                  lineHeight: '1.2'
                }}
              >
                {counters.skilledPersons}
              </h1>
              <h5 
                className="mb-2" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  textTransform: 'none'
                }}
              >
                Skilled Professionals
              </h5>
              <div 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  backgroundColor: '#FFFFFF', 
                  margin: '0 auto',
                  marginTop: '8px'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

