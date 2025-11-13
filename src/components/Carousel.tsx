export const Carousel = () => {
  return (
    <div className="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="0.1s">
      <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active" style={{ position: 'relative' }}>
            <div className="carousel-overlay"></div>
            <img className="w-100" src="/img/carousel-1.jpg" alt="Image" style={{ objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
            <div className="carousel-caption">
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-lg-8">
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={{
                      color: '#2C2C2C', 
                      borderColor: 'rgba(252, 209, 22, 0.3)', 
                      backgroundColor: 'rgba(255, 250, 230, 0.95)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0.5px',
                      borderRadius: '12px'
                    }}>Welcome to GNRS</p>
                    <h1 className="display-1 mb-4 animated slideInDown">Empowering Ghana Through National Resources</h1>
                    <a href="#about" className="btn btn-primary py-3 px-5 animated slideInDown">Explore More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ position: 'relative' }}>
            <div className="carousel-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))' }}></div>
            <img className="w-100" src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763066960/portrait-photorealistic-rastafari-woman-with-african-dreads_nwoicg.jpg" alt="Image" style={{ filter: 'blur(3px)', objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
            <div className="carousel-caption">
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-lg-7">
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={{
                      color: '#2C2C2C', 
                      borderColor: 'rgba(252, 209, 22, 0.3)', 
                      backgroundColor: 'rgba(255, 250, 230, 0.95)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0.5px',
                      borderRadius: '12px'
                    }}>Welcome to GNRS</p>
                    <h1 className="display-1 mb-4 animated slideInDown" style={{ 
                      color: '#FFFFFF', 
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                      fontWeight: '700'
                    }}>Your Gateway to Education, Jobs & Opportunities</h1>
                    <a href="#services" className="btn btn-primary py-3 px-5 animated slideInDown" style={{ 
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                      fontWeight: '600'
                    }}>Get Started</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ position: 'relative' }}>
            <div className="carousel-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))' }}></div>
            <img className="w-100" src="https://res.cloudinary.com/dsypclqxk/image/upload/v1758549899/map-ghana-polygonal-mesh-line-map-flag-map_srmd4c.jpg" alt="Ghana Map" style={{ filter: 'blur(3px)', objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
            <div className="carousel-caption">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-9 text-center">
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={{
                      color: '#2C2C2C', 
                      borderColor: 'rgba(252, 209, 22, 0.3)', 
                      backgroundColor: 'rgba(255, 250, 230, 0.95)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0.5px',
                      borderRadius: '12px'
                    }}>Nationwide Coverage</p>
                    <h1 className="display-1 mb-4 animated slideInDown" style={{ 
                      color: '#FFFFFF', 
                      textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 0, 0, 0.6)',
                      fontWeight: '700',
                      lineHeight: '1.2'
                    }}>Connecting Every Region, Empowering Every Citizen</h1>
                    <p className="lead mb-4 animated slideInDown" style={{
                      color: '#FFFFFF',
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                      fontSize: '1.3rem',
                      fontWeight: '400'
                    }}>From Accra to Tamale, from Cape Coast to Bolgatanga — Your opportunities await across all 16 regions</p>
                    <a href="#services" className="btn btn-primary py-3 px-5 animated slideInDown" style={{ 
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                      fontWeight: '600'
                    }}>Discover Opportunities</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item" style={{ position: 'relative' }}>
            <div className="row g-0 h-100">
              <div className="col-lg-6" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="carousel-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))' }}></div>
                <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763066817/OQT8S80_atfkkw.jpg" alt="Ghana Development" style={{ filter: 'blur(3px)', objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
              </div>
              <div className="col-lg-6" style={{ position: 'relative', background: '#F5F5F5' }}>
                <div className="carousel-caption" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto', display: 'flex', alignItems: 'center', height: '100%', padding: '3rem' }}>
                  <div className="w-100">
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={{
                      color: '#2C2C2C', 
                      borderColor: 'rgba(252, 209, 22, 0.3)', 
                      backgroundColor: 'rgba(255, 250, 230, 0.95)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0.5px',
                      borderRadius: '12px'
                    }}>Building the Future</p>
                    <h1 className="display-1 mb-4 animated slideInDown" style={{ 
                      color: '#2C2C2C', 
                      fontWeight: '700',
                      lineHeight: '1.2'
                    }}>Transforming Dreams Into Reality</h1>
                    <p className="lead mb-4 animated slideInDown" style={{
                      color: '#555555',
                      fontSize: '1.3rem',
                      fontWeight: '400'
                    }}>Access world-class education, unlock career opportunities, and shape the future of Ghana</p>
                    <a href="#about" className="btn btn-primary py-3 px-5 animated slideInDown" style={{ 
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                      fontWeight: '600'
                    }}>Start Your Journey</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel"
          data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#header-carousel"
          data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

