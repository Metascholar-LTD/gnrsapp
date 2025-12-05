import { HomepageButton } from "@/components/ui/HomepageButton";

export const Services = () => {
  return (
    <div id="services" className="container-fluid service py-5" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="container" style={{ maxWidth: '100%', paddingLeft: 'clamp(15px, 5vw, 80px)', paddingRight: 'clamp(15px, 5vw, 80px)' }}>
        <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Services</p>
          <div style={{ 
            width: '100%', 
            height: '1px', 
            backgroundColor: 'rgba(0, 0, 0, 0.1)', 
            margin: '16px auto 24px auto',
            maxWidth: '200px'
          }}></div>
          <h1 className="display-5 mb-5">Comprehensive National Resources For All Ghanaians</h1>
        </div>
        <div className="row g-4 wow fadeInUp" data-wow-delay="0.3s">
          <div className="col-lg-4">
            <div className="nav nav-pills d-flex justify-content-between w-100 h-100 me-4">
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4 active" data-bs-toggle="pill" data-bs-target="#tab-pane-1" type="button">
                <h5 className="m-0"><i className="fa fa-graduation-cap me-3" style={{color: '#006B3F'}}></i>Education Resources</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-2" type="button">
                <h5 className="m-0"><i className="fa fa-briefcase me-3" style={{color: '#FCD116'}}></i>Job Opportunities</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-3" type="button">
                <h5 className="m-0"><i className="fa fa-newspaper me-3" style={{color: '#FF6B6B'}}></i>News & Updates</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-4" type="button">
                <h5 className="m-0"><i className="fa fa-database me-3" style={{color: '#4ECDC4'}}></i>National Resources</h5>
              </button>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="tab-content w-100">
              <div className="tab-pane fade show active" id="tab-pane-1">
                <div className="row g-4">
                  <div className="col-md-6" style={{ minHeight: '350px' }}>
                    <div className="position-relative h-100">
                      <img className="position-absolute rounded w-100 h-100" src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763129777/portrait-student-wearing-medical-mask_gokjyh.jpg"
                        style={{ objectFit: 'cover', filter: 'blur(1px)' }} alt="" />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '0.375rem',
                        pointerEvents: 'none'
                      }}></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="mb-4">Comprehensive Education Resources</h3>
                    <p className="mb-4">Access a wide range of educational opportunities including scholarships, courses, training programs, and educational institutions across Ghana. Find the right educational path for your career goals and personal development.</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Scholarship Opportunities</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Course Listings</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Educational Institutions</p>
                    <div className="mt-3">
                      <HomepageButton to="/education">Explore Education</HomepageButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="tab-pane-2">
                <div className="row g-4">
                  <div className="col-md-6" style={{ minHeight: '350px' }}>
                    <div className="position-relative h-100">
                      <img className="position-absolute rounded w-100 h-100" src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763130425/man-handshaking-his-employer-after-being-accepted-his-new-office-job_lo26fe.jpg"
                        style={{ objectFit: 'cover', filter: 'blur(1px)' }} alt="" />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '0.375rem',
                        pointerEvents: 'none'
                      }}></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="mb-4">Job Opportunities & Career Development</h3>
                    <p className="mb-4">Browse thousands of job listings from top employers across Ghana. Find opportunities that match your skills and career aspirations. Access career resources, resume building tools, and professional development opportunities.</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Job Listings</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Career Resources</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Professional Development</p>
                    <div className="mt-3">
                      <HomepageButton to="/jobs">Browse Jobs</HomepageButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="tab-pane-3">
                <div className="row g-4">
                  <div className="col-md-6" style={{ minHeight: '350px' }}>
                    <div className="position-relative h-100">
                      <img className="position-absolute rounded w-100 h-100" src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763130727/handsome-african-american-male-journalist_usk3kl.jpg"
                        style={{ objectFit: 'cover', filter: 'blur(1px)' }} alt="" />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '0.375rem',
                        pointerEvents: 'none'
                      }}></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="mb-4">Latest News & National Updates</h3>
                    <p className="mb-4">Stay informed with the latest news, announcements, and updates from across Ghana. Get real-time information about government policies, national events, and important developments affecting citizens.</p>
                    <p><i className="fa fa-check text-primary me-3"></i>National News</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Government Announcements</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Event Updates</p>
                    <div className="mt-3">
                      <HomepageButton to="/news">Read News</HomepageButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="tab-pane-4">
                <div className="row g-4">
                  <div className="col-md-6" style={{ minHeight: '350px' }}>
                    <div className="position-relative h-100">
                      <img className="position-absolute rounded w-100 h-100" src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763130880/african-woman-hold-small-ghana-flag-hands_wtybxo.jpg"
                        style={{ objectFit: 'cover', filter: 'blur(1px)' }} alt="" />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: '0.375rem',
                        pointerEvents: 'none'
                      }}></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h3 className="mb-4">National Resources & Information</h3>
                    <p className="mb-4">Access comprehensive national resources including government services, public information, statistics, and data. Find everything you need to know about Ghana's resources, services, and opportunities in one centralized location.</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Government Services</p>
                    <p><i className="fa fa-check text-primary me-3"></i>Public Information</p>
                    <p><i className="fa fa-check text-primary me-3"></i>National Statistics</p>
                    <div className="mt-3">
                      <HomepageButton to="/contact">Learn More</HomepageButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
