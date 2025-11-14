import { useEffect, useRef, useState } from 'react';

export const Statistics = () => {
  const [counters, setCounters] = useState({
    happyClients: 0,
    projectsCompleted: 0,
    dedicatedStaff: 0,
    awardsAchieved: 0,
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
      happyClients: 1234,
      projectsCompleted: 1234,
      dedicatedStaff: 1234,
      awardsAchieved: 1234,
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
        happyClients: Math.floor(targetValues.happyClients * easeOutQuart),
        projectsCompleted: Math.floor(targetValues.projectsCompleted * easeOutQuart),
        dedicatedStaff: Math.floor(targetValues.dedicatedStaff * easeOutQuart),
        awardsAchieved: Math.floor(targetValues.awardsAchieved * easeOutQuart),
      });

      if (currentStep >= steps) {
        setCounters(targetValues);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div 
      ref={sectionRef}
      className="container-fluid py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
        background: 'linear-gradient(135deg, #355EFC 0%, #2a4fd4 100%)',
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
          opacity: 0.12,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.25) 3px, transparent 3px),
            radial-gradient(circle at 85% 75%, rgba(255, 255, 255, 0.25) 3px, transparent 3px),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 2px, transparent 2px),
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.08) 48%, rgba(255, 255, 255, 0.08) 52%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.08) 48%, rgba(255, 255, 255, 0.08) 52%, transparent 52%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 255, 255, 0.06) 40px, rgba(255, 255, 255, 0.06) 42px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255, 255, 255, 0.04) 60px, rgba(255, 255, 255, 0.04) 62px)
          `,
          backgroundSize: '150px 150px, 150px 150px, 200px 200px, 80px 80px, 80px 80px, 100px 100px, 120px 120px',
          backgroundPosition: '0 0, 100% 100%, 50% 50%, 0 0, 0 0, 0 0, 0 0',
        }}
      />

      <div className="container py-5">
        <div className="row g-4">
          {/* Happy Clients */}
          <div className="col-lg-3 col-md-6 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.1s">
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
                {counters.happyClients}
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
                Happy Clients
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

          {/* Projects Completed */}
          <div className="col-lg-3 col-md-6 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.3s">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-check"></i>
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
                {counters.projectsCompleted}
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
                Projects Completed
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

          {/* Dedicated Staff */}
          <div className="col-lg-3 col-md-6 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.5s">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-user-cog"></i>
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
                {counters.dedicatedStaff}
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
                Dedicated Staff
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

          {/* Awards Achieved */}
          <div className="col-lg-3 col-md-6 col-sm-6 text-center wow fadeInUp" data-wow-delay="0.7s">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mb-3" style={{ fontSize: '48px', color: '#FFFFFF' }}>
                <i className="fa fa-award"></i>
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
                {counters.awardsAchieved}
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
                Awards Achieved
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
  );
};

