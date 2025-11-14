export const About = () => {
  return (
    <>
      <div id="about" className="container-fluid py-5" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>
        <div className="container" style={{ maxWidth: '100%', paddingLeft: 'clamp(15px, 5vw, 80px)', paddingRight: 'clamp(15px, 5vw, 80px)' }}>
          <div className="row g-5 align-items-center mb-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                <video 
                  className="img-fluid w-100" 
                  src="https://res.cloudinary.com/dsypclqxk/video/upload/v1763129131/5400711_Coll_wavebreak_People_3840x2160_ufldaq.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ 
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '16px',
                  pointerEvents: 'none'
                }}></div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <div style={{ 
                display: 'inline-block',
                padding: '8px 20px',
                backgroundColor: 'rgba(0, 107, 63, 0.08)',
                borderRadius: '30px',
                marginBottom: '20px',
                border: '1px solid rgba(0, 107, 63, 0.15)'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#006B3F', 
                  fontWeight: 600, 
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>About Us</p>
              </div>
              <h1 style={{ 
                fontSize: '2.75rem',
                fontWeight: 700,
                lineHeight: '1.2',
                marginBottom: '24px',
                color: '#2C2C2C',
                letterSpacing: '-0.5px'
              }}>Empowering Ghana Through Accessible National Resources</h1>
              <p style={{ 
                fontSize: '1.125rem',
                lineHeight: '1.8',
                color: '#555555',
                marginBottom: '32px'
              }}>The Ghana National Resource System (GNRS) is a comprehensive platform designed to connect Ghanaians with essential resources including education opportunities, job listings, news updates, and national information. Our mission is to make vital resources easily accessible to all citizens, fostering national development and individual growth.</p>
              
              <div style={{ 
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
              }}>
                <nav>
                  <div className="nav nav-tabs mb-4" id="nav-tab" role="tablist" style={{ borderBottom: '2px solid rgba(0, 107, 63, 0.1)' }}>
                    <button 
                      className="nav-link fw-semi-bold active" 
                      id="nav-story-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#nav-story" 
                      type="button" 
                      role="tab" 
                      aria-controls="nav-story" 
                      aria-selected="true"
                      style={{
                        border: 'none',
                        borderBottom: '3px solid transparent',
                        color: '#555555',
                        padding: '12px 20px',
                        borderRadius: '0',
                        transition: 'all 0.3s ease'
                      }}
                    >Story</button>
                    <button 
                      className="nav-link fw-semi-bold" 
                      id="nav-mission-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#nav-mission" 
                      type="button" 
                      role="tab" 
                      aria-controls="nav-mission" 
                      aria-selected="false"
                      style={{
                        border: 'none',
                        borderBottom: '3px solid transparent',
                        color: '#555555',
                        padding: '12px 20px',
                        borderRadius: '0',
                        transition: 'all 0.3s ease'
                      }}
                    >Mission</button>
                    <button 
                      className="nav-link fw-semi-bold" 
                      id="nav-vision-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#nav-vision" 
                      type="button" 
                      role="tab" 
                      aria-controls="nav-vision" 
                      aria-selected="false"
                      style={{
                        border: 'none',
                        borderBottom: '3px solid transparent',
                        color: '#555555',
                        padding: '12px 20px',
                        borderRadius: '0',
                        transition: 'all 0.3s ease'
                      }}
                    >Vision</button>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-story" role="tabpanel" aria-labelledby="nav-story-tab">
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555555', marginBottom: '16px' }}>The Ghana National Resource System was established to bridge the gap between Ghanaians and essential national resources. Recognizing the need for a centralized platform that provides easy access to education, employment opportunities, and national information, GNRS was created to serve as a one-stop portal for all resource needs.</p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555555', marginBottom: 0 }}>Through continuous innovation and collaboration with educational institutions, employers, and government agencies, we strive to create a more connected and informed Ghana where every citizen has access to the resources they need to succeed.</p>
                  </div>
                  <div className="tab-pane fade" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555555', marginBottom: '16px' }}>Our mission is to provide a comprehensive, user-friendly platform that connects all Ghanaians with essential national resources including education opportunities, job listings, news updates, and government services.</p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555555', marginBottom: 0 }}>We are committed to promoting transparency, accessibility, and efficiency in resource distribution, ensuring that every Ghanaian can access the information and opportunities they need to thrive in today's society.</p>
                  </div>
                  <div className="tab-pane fade" id="nav-vision" role="tabpanel" aria-labelledby="nav-vision-tab">
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555555', marginBottom: '16px' }}>Our vision is to become the leading national resource platform in Ghana, recognized for excellence in connecting citizens with opportunities and information that drive personal and national development.</p>
                    <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555555', marginBottom: 0 }}>We envision a future where every Ghanaian, regardless of location or background, can easily access education, employment, and information resources through our integrated platform, contributing to a more prosperous and informed nation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#F8F9FA',
            borderRadius: '20px',
            padding: '48px 32px',
            marginTop: '48px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }} className="wow fadeInUp" data-wow-delay="0.1s">
            <div className="row g-4">
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.1s">
                <div className="h-100" style={{ padding: '24px' }}>
                  <div className="d-flex align-items-start">
                    <div 
                      className="flex-shrink-0"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#006B3F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '20px',
                        boxShadow: '0 4px 12px rgba(0, 107, 63, 0.2)'
                      }}
                    >
                      <i className="fa fa-check text-white" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#2C2C2C'
                      }}>Free Access</h4>
                      <p style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}>All resources and services are freely accessible to all Ghanaians</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                <div className="h-100" style={{ padding: '24px' }}>
                  <div className="d-flex align-items-start">
                    <div 
                      className="flex-shrink-0"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#FCD116',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '20px',
                        boxShadow: '0 4px 12px rgba(252, 209, 22, 0.2)'
                      }}
                    >
                      <i className="fa fa-users text-white" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#2C2C2C'
                      }}>Comprehensive Resources</h4>
                      <p style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}>Access to education, jobs, news, and national information in one place</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 wow fadeIn" data-wow-delay="0.5s">
                <div className="h-100" style={{ padding: '24px' }}>
                  <div className="d-flex align-items-start">
                    <div 
                      className="flex-shrink-0"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#FF6B6B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '20px',
                        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)'
                      }}
                    >
                      <i className="fa fa-phone text-white" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#2C2C2C'
                      }}>24/7 Available</h4>
                      <p style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: '#555555',
                        margin: 0
                      }}>Access resources and information anytime, anywhere</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Section Separator */}
      <div style={{
        position: 'relative',
        margin: '40px 0 20px 0',
        padding: '20px 0'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'rgba(0, 107, 63, 0.15)',
            maxWidth: '45%'
          }}></div>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '3px solid rgba(0, 107, 63, 0.1)',
            margin: '0 20px',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: '#006B3F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 107, 63, 0.25)',
              transition: 'transform 0.3s ease'
            }}>
              <i className="fa fa-arrow-down text-white" style={{ fontSize: '20px' }}></i>
            </div>
          </div>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'rgba(0, 107, 63, 0.15)',
            maxWidth: '45%'
          }}></div>
        </div>
      </div>
    </>
  );
};
