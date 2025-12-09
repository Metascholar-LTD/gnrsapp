import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { JoinUsButton } from "./JoinUsButton";

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // TODO: Replace with actual authentication check when auth is implemented
  // For now, default to false (not logged in) - will show Join Us button
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if we're on resume builder pages
  const isResumeBuilderPage = location.pathname.startsWith("/jobs/cv-builder");
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle mega-menu sidebar navigation
  useEffect(() => {
    const handleMegaMenuNav = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navItem = target.closest('.mega-menu-nav-item') as HTMLElement;
      
      if (navItem) {
        const section = navItem.getAttribute('data-section');
        if (section) {
          // Find the parent mega-menu-wrapper to scope the search
          const megaMenuWrapper = navItem.closest('.mega-menu-wrapper') as HTMLElement;
          
          if (megaMenuWrapper) {
            // Remove active class from all nav items in this mega-menu only
            const allNavItems = megaMenuWrapper.querySelectorAll('.mega-menu-nav-item');
            allNavItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked item
            navItem.classList.add('active');
            
            // Hide all sections in this mega-menu only
            const allSections = megaMenuWrapper.querySelectorAll('.mega-menu-section');
            allSections.forEach(sec => sec.classList.remove('active'));
            
            // Show selected section within this mega-menu only
            const targetSection = megaMenuWrapper.querySelector(`#section-${section}`) as HTMLElement;
            if (targetSection) {
              targetSection.classList.add('active');
            }
          }
        }
      }
    };

    document.addEventListener('click', handleMegaMenuNav);
    return () => {
      document.removeEventListener('click', handleMegaMenuNav);
    };
  }, []);

  return (
    <>
      <div className="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s">
        {/* Top Bar Start */}
        <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
          <div className="col-lg-6 px-5 text-start">
            <small><i className="fa fa-map-marker-alt text-primary me-2"></i>Accra, Ghana</small>
            <small className="ms-4"><i className="fa fa-clock text-primary me-2"></i>Mon - Fri: 8.00 am - 5.00 pm</small>
          </div>
          <div className="col-lg-6 px-5 text-end d-flex align-items-center justify-content-end">
            <small><i className="fa fa-envelope text-primary me-2"></i>info@gnrs.gov.gh</small>
            <small className="ms-4"><i className="fa fa-phone-alt text-primary me-2"></i>+233 XX XXX XXXX</small>
            <div className="ms-4 top-bar-social-icons">
              <a 
                className="top-bar-social-icon" 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                className="top-bar-social-icon" 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                className="top-bar-social-icon" 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Top Bar End */}

        {/* Navbar Start */}
        <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
          <Link to="/" className="navbar-brand ms-4 ms-lg-0" onClick={closeMobileMenu}>
            <img 
              src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" 
              alt="GNRS Logo" 
              style={{ 
                height: '65px', 
                width: 'auto',
                border: '1px solid rgba(240, 240, 240, 0.6)',
                borderRadius: '4px',
                padding: '4px'
              }}
            />
          </Link>
          
          {/* Desktop Navbar - Always visible on lg and above */}
          <div className="d-none d-lg-flex navbar-collapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0 d-flex align-items-center">
              {isResumeBuilderPage ? (
                <>
                  <Link 
                    to="/jobs/cv-builder" 
                    className={`nav-item nav-link ${isActive("/jobs/cv-builder") && location.pathname === "/jobs/cv-builder" ? "active" : ""}`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/jobs/cv-builder/templates" 
                    className={`nav-item nav-link ${isActive("/jobs/cv-builder/templates") ? "active" : ""}`}
                  >
                    Templates
                  </Link>
                  <Link 
                    to="/jobs/cv-builder/about" 
                    className={`nav-item nav-link ${isActive("/jobs/cv-builder/about") ? "active" : ""}`}
                  >
                    About
                  </Link>
                </>
              ) : (
                <>
              <Link 
                to="/" 
                className={`nav-item nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
              <div className="nav-item dropdown mega-menu">
                <Link 
                  to="/education" 
                  className={`nav-link dropdown-toggle ${isActive("/education") ? "active" : ""}`}
                  id="educationDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Education Hub
                </Link>
                <div className="dropdown-menu mega-menu-content" aria-labelledby="educationDropdown">
                  <div className="mega-menu-wrapper">
                    {/* Left Sidebar Navigation */}
                    <div className="mega-menu-sidebar">
                      <div className="mega-menu-nav-item active" data-section="academic">
                        <i className="fa fa-book me-2"></i>
                        <span>Academic Resources</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="engagement">
                        <i className="fa fa-users me-2"></i>
                        <span>Student Engagement</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="tools">
                        <i className="fa fa-tools me-2"></i>
                        <span>Tools & Calculators</span>
                      </div>
                    </div>
                    
                    {/* Vertical Divider */}
                    <div className="mega-menu-divider"></div>
                    
                    {/* Right Content Area */}
                    <div className="mega-menu-content-area">
                      {/* Academic Resources Section */}
                      <div className="mega-menu-section active" id="section-academic">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Study Materials</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/education/past-questions" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-file-alt me-2"></i>University Past Questions</Link></li>
                              <li><Link to="/education/shs-bece-questions" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-book me-2"></i>SHS and BECE Past Questions</Link></li>
                              <li><Link to="/education/lecture-notes" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-book-open me-2"></i>Lecture Notes & E-learning</Link></li>
                              <li><Link to="/education/trial-questions" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-question-circle me-2"></i>Trial Questions</Link></li>
                              <li><Link to="/education/study-guides" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-graduation-cap me-2"></i>Study Guides and Tutorials</Link></li>
                              <li><Link to="/education/ebooks" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-file-pdf me-2"></i>E-books and Training Resources</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Search & Discovery</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/education/course-recommendations" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-lightbulb me-2"></i>Course Recommendation Engine</Link></li>
                              <li><Link to="/education/departmental-resources" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-building me-2"></i>Departmental Resources</Link></li>
                              <li><Link to="/education/research-tools" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-microscope me-2"></i>Integrated Research Tools</Link></li>
                              <li><Link to="/education/internship-guidance" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-briefcase me-2"></i>Internship & Project Guidance</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg" alt="Students studying with books" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Featured Resource</h6>
                                  <p className="small mb-0">Access comprehensive study materials and past questions for all courses.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Student Engagement Section */}
                      <div className="mega-menu-section" id="section-engagement">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Community</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/education/discussion-forums" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-comments me-2"></i>Discussion Forums</Link></li>
                              <li><Link to="/education/study-groups" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-users me-2"></i>Study Groups</Link></li>
                              <li><Link to="/education/alumni-connect" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-network-wired me-2"></i>Alumni Connect</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Support & Guidance</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/education/mentorship" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-user-friends me-2"></i>Mentorship Program</Link></li>
                              <li><Link to="/education/campus-announcements" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-bullhorn me-2"></i>Campus Announcements</Link></li>
                              <li><Link to="/education/academic-notifications" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-bell me-2"></i>Academic Notifications</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80" alt="Students working together" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Student Community</h6>
                                  <p className="small mb-0">Connect with peers, mentors, and alumni for support and guidance.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tools Section */}
                      <div className="mega-menu-section" id="section-tools">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Academic Tools</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/education/cgpa-calculator" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-calculator me-2"></i>CGPA Calculator</Link></li>
                              <li><Link to="/education/timetable-builder" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-calendar-alt me-2"></i>Timetable Builder</Link></li>
                              <li><Link to="/education/ai-tutor" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-robot me-2"></i>AI Study Tutor</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">My Resources</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/education/my-resources" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-bookmark me-2"></i>My Saved Resources</Link></li>
                              <li><Link to="/education/learning-path" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-route me-2"></i>My Learning Path</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&q=80" alt="Academic tools and calculator" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Featured Resource</h6>
                                  <p className="small mb-0">Access comprehensive study materials and past questions for all courses.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nav-item dropdown mega-menu">
                <Link 
                  to="/scholarship-hub" 
                  className={`nav-link dropdown-toggle ${isActive("/scholarship-hub") ? "active" : ""}`}
                  id="scholarshipDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Scholarships Bank
                </Link>
                <div className="dropdown-menu mega-menu-content" aria-labelledby="scholarshipDropdown">
                  <div className="mega-menu-wrapper">
                    <div className="mega-menu-sidebar">
                      <div className="mega-menu-nav-item active" data-section="global">
                        <i className="fa fa-globe me-2"></i>
                        <span>Global Scholarships</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="local">
                        <i className="fa fa-map-marker-alt me-2"></i>
                        <span>Local Scholarships</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="tools">
                        <i className="fa fa-tools me-2"></i>
                        <span>Scholarship Tools</span>
                      </div>
                    </div>
                    <div className="mega-menu-divider"></div>
                    <div className="mega-menu-content-area">
                      <div className="mega-menu-section active" id="section-global">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Browse Global Scholarships</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/scholarship-hub" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-globe me-2"></i>Global Scholarships Bank</Link></li>
                              <li><Link to="/scholarship-hub/field-based" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-tags me-2"></i>Field-Based Scholarships</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg" alt="International students" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Global Opportunities</h6>
                                  <p className="small mb-0">Discover verified scholarships from around the world.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-local">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Ghana-Based Scholarships</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/scholarship-hub/getfund" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-university me-2"></i>GETFund Scholarships</Link></li>
                              <li><Link to="/scholarship-hub/gnpc" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-oil-can me-2"></i>GNPC Scholarships</Link></li>
                              <li><Link to="/scholarship-hub/mtn" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-mobile-alt me-2"></i>MTN Scholarships</Link></li>
                              <li><Link to="/scholarship-hub/other-local" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-building me-2"></i>Other Local Scholarships</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg" alt="Ghana students graduation" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Local Opportunities</h6>
                                  <p className="small mb-0">Access scholarships from Ghanaian institutions and organizations.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-tools">
                        <div className="row g-2">
                          <div className="col-lg-12">
                            <h6 className="mega-menu-section-title">Application Tools & Resources</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/scholarship-hub/essay-builder" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-file-alt me-2"></i>Essay/SoP Builder</Link></li>
                              <li><Link to="/scholarship-hub/saved" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-bookmark me-2"></i>My Saved Scholarships</Link></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nav-item dropdown mega-menu">
                <Link 
                  to="/jobs" 
                  className={`nav-link dropdown-toggle ${isActive("/jobs") ? "active" : ""}`}
                  id="jobsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Career & Employment
                </Link>
                <div className="dropdown-menu mega-menu-content" aria-labelledby="jobsDropdown">
                  <div className="mega-menu-wrapper">
                    <div className="mega-menu-sidebar">
                      <div className="mega-menu-nav-item active" data-section="search">
                        <i className="fa fa-search me-2"></i>
                        <span>Job Search</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="career">
                        <i className="fa fa-chart-line me-2"></i>
                        <span>Career Development</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="employer">
                        <i className="fa fa-briefcase me-2"></i>
                        <span>Employer Zone</span>
                      </div>
                    </div>
                    <div className="mega-menu-divider"></div>
                    <div className="mega-menu-content-area">
                      <div className="mega-menu-section active" id="section-search">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Browse Jobs</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/jobs/browse" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-search me-2"></i>Verified Job Listings</Link></li>
                              <li><Link to="/jobs/all" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-list me-2"></i>All Jobs</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Special Programs</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/jobs/internships" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-briefcase me-2"></i>Internship Listings</Link></li>
                              <li><Link to="/jobs/nss" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-user-tie me-2"></i>National Service Support</Link></li>
                              <li><Link to="/jobs/graduate-recruitment" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-graduation-cap me-2"></i>Graduate Recruitment</Link></li>
                              <li><Link to="/jobs/yea-jobs" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-users me-2"></i>Youth Employment Agency</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&q=80" alt="Job search and career opportunities" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Find Your Dream Job</h6>
                                  <p className="small mb-0">Browse thousands of verified job opportunities across Ghana.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-career">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Application Tools</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/jobs/cv-builder" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-file-alt me-2"></i>Smart CV Builder</Link></li>
                              <li><Link to="/jobs/cover-letter" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-envelope me-2"></i>Cover Letter Generator</Link></li>
                              <li><Link to="/jobs/ai-interview" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-robot me-2"></i>AI Interview Assistant</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Career Growth</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/jobs/skill-assessment" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-clipboard-check me-2"></i>Skill Assessment Tests</Link></li>
                              <li><Link to="/jobs/career-resources" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-book me-2"></i>Career Resources</Link></li>
                              <li><Link to="/jobs/professional-development" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-chart-line me-2"></i>Professional Development</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&q=80" alt="Career growth and development" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Career Development</h6>
                                  <p className="small mb-0">Build your career with our tools and resources.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-employer">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Job Management</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/jobs/post" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-plus-circle me-2"></i>Post New Job</Link></li>
                              <li><Link to="/jobs/manage-listings" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-tasks me-2"></i>Manage Job Listings</Link></li>
                              <li><Link to="/jobs/applicant-dashboard" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-dashboard me-2"></i>Applicant Dashboard</Link></li>
                              <li><Link to="/jobs/shortlisting" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-user-check me-2"></i>Candidate Shortlisting</Link></li>
                              <li><Link to="/jobs/download-cvs" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-download me-2"></i>Download Applicant CVs</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Business Tools</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/jobs/employer-analytics" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-chart-bar me-2"></i>Employer Analytics</Link></li>
                              <li><Link to="/jobs/employer-subscription" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-credit-card me-2"></i>Subscription & Billing</Link></li>
                              <li><Link to="/jobs/employer-verification" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-shield-alt me-2"></i>Employer Verification</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80" alt="Business office and employers" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>For Employers</h6>
                                  <p className="small mb-0">Post jobs, find talent, and manage your recruitment process efficiently.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nav-item dropdown mega-menu">
                <Link 
                  to="/skilled-workers" 
                  className={`nav-link dropdown-toggle ${isActive("/skilled-workers") ? "active" : ""}`}
                  id="skilledWorkersDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hands & Skills
                </Link>
                <div className="dropdown-menu mega-menu-content" aria-labelledby="skilledWorkersDropdown">
                  <div className="mega-menu-wrapper">
                    <div className="mega-menu-sidebar">
                      <Link 
                        to="/skilled-workers" 
                        className={`mega-menu-nav-item ${isActive("/skilled-workers") ? "active" : ""}`} 
                        onClick={closeMobileMenu}
                      >
                        <i className="fa fa-users me-2"></i>
                        <span>Worker Directory</span>
                      </Link>
                      <div className={`mega-menu-nav-item ${!isActive("/skilled-workers") ? "active" : ""}`} data-section="discover">
                        <i className="fa fa-search me-2"></i>
                        <span>Discover & Hire</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="workers">
                        <i className="fa fa-user-tie me-2"></i>
                        <span>For Workers</span>
                      </div>
                    </div>
                    <div className="mega-menu-divider"></div>
                    <div className="mega-menu-content-area">
                      <div className={`mega-menu-section ${!isActive("/skilled-workers") ? "active" : ""}`} id="section-discover">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Search & Browse</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/skilled-workers" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-map-marker-alt me-2"></i>Search by Location</Link></li>
                              <li><Link to="/skilled-workers" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-check-circle me-2"></i>Verified Workers</Link></li>
                              <li><Link to="/skilled-workers" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-calendar-check me-2"></i>Service Requests</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop&q=80" alt="Handshake and business agreement" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Hire with Confidence</h6>
                                  <p className="small mb-0">Connect with verified skilled workers and book services easily.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-workers">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Profile Management</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/skilled-workers/create-profile" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-user-plus me-2"></i>Create Professional Profile</Link></li>
                              <li><Link to="/skilled-workers/upload-samples" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-upload me-2"></i>Upload Work Samples</Link></li>
                              <li><Link to="/skilled-workers/pricing" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-dollar-sign me-2"></i>Pricing</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80" alt="Professional worker" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>For Skilled Workers</h6>
                                  <p className="small mb-0">Create your profile, showcase your work, and grow your business.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nav-item">
                <Link 
                  to="/directories" 
                  className={`nav-link ${isActive("/directories") ? "active" : ""}`}
                >
                  Directories
                </Link>
              </div>
              <div className="nav-item dropdown mega-menu">
                <Link 
                  to="/news" 
                  className={`nav-link dropdown-toggle ${isActive("/news") ? "active" : ""}`}
                  id="newsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  News & Info
                </Link>
                <div className="dropdown-menu mega-menu-content" aria-labelledby="newsDropdown">
                  <div className="mega-menu-wrapper">
                    <div className="mega-menu-sidebar">
                      <div className="mega-menu-nav-item active" data-section="categories">
                        <i className="fa fa-newspaper me-2"></i>
                        <span>News Categories</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="government">
                        <i className="fa fa-building me-2"></i>
                        <span>Government & Updates</span>
                      </div>
                      <div className="mega-menu-nav-item" data-section="quick">
                        <i className="fa fa-clock me-2"></i>
                        <span>Quick Access</span>
                      </div>
                    </div>
                    <div className="mega-menu-divider"></div>
                    <div className="mega-menu-content-area">
                      <div className="mega-menu-section active" id="section-categories">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">General News</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/news/national" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-globe me-2"></i>National News</Link></li>
                              <li><Link to="/news/regional" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-map-marker-alt me-2"></i>Regional News</Link></li>
                              <li><Link to="/news/politics" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-landmark me-2"></i>Politics</Link></li>
                              <li><Link to="/news/trending" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-fire me-2"></i>Trending News</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Specialized News</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/news/education" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-graduation-cap me-2"></i>Education News</Link></li>
                              <li><Link to="/news/jobs-recruitment" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-briefcase me-2"></i>Jobs & Recruitment News</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop&q=80" alt="News and media" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Stay Informed</h6>
                                  <p className="small mb-0">Get the latest news and updates from across Ghana.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-government">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Official Updates</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/news/government-updates" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-building me-2"></i>Official Government Updates</Link></li>
                              <li><Link to="/news/notifications" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-bell me-2"></i>Notifications & Alerts</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">My News</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/news/saved" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-bookmark me-2"></i>Saved News</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop&q=80" alt="Government building" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Government Updates</h6>
                                  <p className="small mb-0">Stay updated with official announcements and government news.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mega-menu-section" id="section-quick">
                        <div className="row g-2">
                          <div className="col-lg-4">
                            <h6 className="mega-menu-section-title">Popular Content</h6>
                            <ul className="mega-menu-list">
                              <li><Link to="/news/latest" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-clock me-2"></i>Latest News</Link></li>
                              <li><Link to="/news/popular" className="mega-menu-item" onClick={closeMobileMenu}><i className="fa fa-star me-2"></i>Popular Stories</Link></li>
                            </ul>
                          </div>
                          <div className="col-lg-4">
                            <div className="mega-menu-featured-image">
                              <div className="mega-menu-image-card">
                                <div className="mega-menu-image-placeholder">
                                  <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop&q=80" alt="Trending news" />
                                </div>
                                <div className="mega-menu-image-content">
                                  <h6>Trending Now</h6>
                                  <p className="small mb-0">Discover the most popular and latest news stories.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Account Dropdown - Only show when user is logged in */}
              {!isResumeBuilderPage && isLoggedIn && (
                <div className="nav-item dropdown">
                  <Link 
                    to="/account" 
                    className={`nav-link dropdown-toggle ${isActive("/account") ? "active" : ""}`}
                    id="accountDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user me-1"></i>Account
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                    <li>
                      <Link to="/account/profile" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-user-circle me-2"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/subscription" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-credit-card me-2"></i>Subscription Plans
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/payments" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-receipt me-2"></i>Bills & Payment History
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link to="/account/saved" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-bookmark me-2"></i>Saved Items
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/messages" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-envelope me-2"></i>Messages & Notifications
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/referrals" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-user-plus me-2"></i>Referral & Rewards
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link to="/account/settings" className="dropdown-item" onClick={closeMobileMenu}>
                        <i className="fa fa-cog me-2"></i>Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/logout" className="dropdown-item text-danger" onClick={closeMobileMenu}>
                        <i className="fa fa-sign-out-alt me-2"></i>Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              {/* Admin/Staff Dashboard - Conditionally rendered based on user role */}
              <div className="nav-item dropdown" id="adminDashboardNav" style={{ display: 'none' }}>
                <Link 
                  to="/admin" 
                  className={`nav-link dropdown-toggle ${isActive("/admin") ? "active" : ""}`}
                  id="adminDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-cog me-1"></i>Admin
                </Link>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
                  <li>
                    <h6 className="dropdown-header">Staff Features</h6>
                  </li>
                  <li>
                    <Link to="/admin/add-job" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-plus-circle me-2"></i>Add Job
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/add-scholarship" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-trophy me-2"></i>Add Scholarship
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/add-news" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-newspaper me-2"></i>Add News
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/add-past-questions" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-file-alt me-2"></i>Add Past Questions
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/manage-content" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-tasks me-2"></i>Manage Uploaded Content
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/verification" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-check-circle me-2"></i>Verification Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tickets" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-ticket-alt me-2"></i>User Tickets
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/moderation" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-shield-alt me-2"></i>Community Moderation
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <h6 className="dropdown-header">Super Admin</h6>
                  </li>
                  <li>
                    <Link to="/admin/users" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-users me-2"></i>Manage All Users
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/approve-posts" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-check-double me-2"></i>Approve/Reject Posts
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/subscription-plans" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-credit-card me-2"></i>Subscription Plans
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/analytics" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-chart-bar me-2"></i>Reports & Analytics
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/system-settings" className="dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-cog me-2"></i>System Settings
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Join Us Button - Only show when user is NOT logged in and NOT on resume builder */}
              {!isResumeBuilderPage && !isLoggedIn && (
                <div className="d-flex align-items-center ms-3">
                  <JoinUsButton />
                </div>
              )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="navbar-toggler d-lg-none me-4" 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={isMobileMenuOpen ? "navbar-toggler-icon-close" : "navbar-toggler-icon"}>
              {isMobileMenuOpen ? (
                <i className="fa fa-times"></i>
              ) : (
                <span></span>
              )}
            </span>
          </button>
        </nav>
        {/* Navbar End */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'mobile-sidebar-open' : ''}`}>
        <div className="mobile-sidebar-header">
          <img 
            src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" 
            alt="GNRS Logo" 
            style={{ 
              height: '50px', 
              width: 'auto',
              border: '1px solid rgba(240, 240, 240, 0.6)',
              borderRadius: '4px',
              padding: '4px'
            }}
          />
          <button 
            className="mobile-sidebar-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        <div className="mobile-sidebar-content">
          <div className="mobile-nav-links">
            {isResumeBuilderPage ? (
              <>
                <Link 
                  to="/jobs/cv-builder" 
                  className={`mobile-nav-link ${isActive("/jobs/cv-builder") && location.pathname === "/jobs/cv-builder" ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <span>Home</span>
                </Link>
                <Link 
                  to="/jobs/cv-builder/templates" 
                  className={`mobile-nav-link ${isActive("/jobs/cv-builder/templates") ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <span>Templates</span>
                </Link>
                <Link 
                  to="/jobs/cv-builder/about" 
                  className={`mobile-nav-link ${isActive("/jobs/cv-builder/about") ? "active" : ""}`}
                  onClick={closeMobileMenu}
                >
                  <span>About</span>
                </Link>
              </>
            ) : (
              <>
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span>
                <i className="fa fa-home me-3"></i>Home
              </span>
            </Link>
            <div className="mobile-nav-dropdown">
              <div 
                className={`mobile-nav-link ${isActive("/education") ? "active" : ""}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.parentElement;
                  if (dropdown) {
                    dropdown.classList.toggle('mobile-dropdown-open');
                  }
                }}
              >
                <span>
                  <i className="fa fa-graduation-cap me-3"></i>Education Hub
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Academic Resources</div>
                  <Link to="/education/past-questions" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-file-alt me-3"></i>University Past Questions
                  </Link>
                  <Link to="/education/shs-bece-questions" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-book me-3"></i>SHS and BECE Past Questions
                  </Link>
                  <Link to="/education/lecture-notes" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-book-open me-3"></i>Lecture Notes & E-learning
                  </Link>
                  <Link to="/education/trial-questions" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-question-circle me-3"></i>Trial Questions
                  </Link>
                  <Link to="/education/study-guides" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-graduation-cap me-3"></i>Study Guides and Tutorials
                  </Link>
                  <Link to="/education/ebooks" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-file-pdf me-3"></i>E-books and Training Resources
                  </Link>
                  <Link to="/education/ai-tutor" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-robot me-3"></i>AI Study Tutor
                  </Link>
                  <Link to="/education/research-tools" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-microscope me-3"></i>Integrated Research Tools
                  </Link>
                  <Link to="/education/cgpa-calculator" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-calculator me-3"></i>CGPA Calculator
                  </Link>
                  <Link to="/education/timetable-builder" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-calendar-alt me-3"></i>Timetable Builder
                  </Link>
                  <Link to="/education/academic-notifications" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bell me-3"></i>Academic Notifications
                  </Link>
                  <Link to="/education/course-recommendations" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-lightbulb me-3"></i>Course Recommendation Engine
                  </Link>
                  <Link to="/education/departmental-resources" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-building me-3"></i>Departmental Resources
                  </Link>
                  <Link to="/education/internship-guidance" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-briefcase me-3"></i>Internship & Project Guidance
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Student Engagement</div>
                  <Link to="/education/discussion-forums" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-comments me-3"></i>Discussion Forums
                  </Link>
                  <Link to="/education/mentorship" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-user-friends me-3"></i>Mentorship Program
                  </Link>
                  <Link to="/education/alumni-connect" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-network-wired me-3"></i>Alumni Connect
                  </Link>
                  <Link to="/education/study-groups" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-users me-3"></i>Study Groups
                  </Link>
                  <Link to="/education/campus-announcements" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bullhorn me-3"></i>Campus Announcements
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Quick Access</div>
                  <Link to="/education/my-resources" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bookmark me-3"></i>My Saved Resources
                  </Link>
                  <Link to="/education/learning-path" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-route me-3"></i>My Learning Path
                  </Link>
                </div>
              </div>
            </div>
            <div className="mobile-nav-dropdown">
              <div 
                className={`mobile-nav-link ${isActive("/scholarship-hub") ? "active" : ""}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.parentElement;
                  if (dropdown) {
                    dropdown.classList.toggle('mobile-dropdown-open');
                  }
                }}
              >
                <span>
                  <i className="fa fa-trophy me-3"></i>Global Scholarships Bank
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                  <div className="mobile-dropdown-section">
                    <div className="mobile-dropdown-section-title">Global Scholarships</div>
                    <Link to="/scholarship-hub" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-globe me-3"></i>Global Scholarships Bank
                    </Link>
                  <Link to="/scholarship-hub/field-based" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-tags me-3"></i>Field-Based Scholarships
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Local Scholarships</div>
                  <Link to="/scholarship-hub/getfund" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-university me-3"></i>GETFund Scholarships
                  </Link>
                  <Link to="/scholarship-hub/gnpc" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-oil-can me-3"></i>GNPC Scholarships
                  </Link>
                  <Link to="/scholarship-hub/mtn" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-mobile-alt me-3"></i>MTN Scholarships
                  </Link>
                  <Link to="/scholarship-hub/other-local" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-building me-3"></i>Other Local Scholarships
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Scholarship Tools</div>
                  <Link to="/scholarship-hub/essay-builder" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-file-alt me-3"></i>Essay/SoP Builder
                  </Link>
                  <Link to="/scholarship-hub/saved" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bookmark me-3"></i>My Saved Scholarships
                  </Link>
                </div>
              </div>
            </div>
            <div className="mobile-nav-dropdown">
              <div 
                className={`mobile-nav-link ${isActive("/jobs") ? "active" : ""}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.parentElement;
                  if (dropdown) {
                    dropdown.classList.toggle('mobile-dropdown-open');
                  }
                }}
              >
                <span>
                  <i className="fa fa-briefcase me-3"></i>Career & Employment
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Job Search</div>
                  <Link to="/jobs/browse" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-search me-3"></i>Verified Job Listings
                  </Link>
                  <Link to="/jobs/all" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-list me-3"></i>All Jobs
                  </Link>
                  <Link to="/jobs/internships" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-briefcase me-3"></i>Internship Listings
                  </Link>
                  <Link to="/jobs/nss" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-user-tie me-3"></i>National Service Support
                  </Link>
                  <Link to="/jobs/graduate-recruitment" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-graduation-cap me-3"></i>Graduate Recruitment
                  </Link>
                  <Link to="/jobs/yea-jobs" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-users me-3"></i>Youth Employment Agency
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Career Development</div>
                  <Link to="/jobs/cv-builder" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-file-alt me-3"></i>Smart CV Builder
                  </Link>
                  <Link to="/jobs/cover-letter" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-envelope me-3"></i>Cover Letter Generator
                  </Link>
                  <Link to="/jobs/ai-interview" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-robot me-3"></i>AI Interview Assistant
                  </Link>
                  <Link to="/jobs/skill-assessment" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-clipboard-check me-3"></i>Skill Assessment Tests
                  </Link>
                  <Link to="/jobs/career-resources" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-book me-3"></i>Career Resources
                  </Link>
                  <Link to="/jobs/professional-development" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-chart-line me-3"></i>Professional Development
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Employer Zone</div>
                  <Link to="/jobs/post" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-plus-circle me-3"></i>Post New Job
                  </Link>
                  <Link to="/jobs/manage-listings" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-tasks me-3"></i>Manage Job Listings
                  </Link>
                  <Link to="/jobs/applicant-dashboard" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-dashboard me-3"></i>Applicant Dashboard
                  </Link>
                  <Link to="/jobs/shortlisting" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-user-check me-3"></i>Candidate Shortlisting
                  </Link>
                  <Link to="/jobs/download-cvs" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-download me-3"></i>Download Applicant CVs
                  </Link>
                  <Link to="/jobs/employer-analytics" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-chart-bar me-3"></i>Employer Analytics
                  </Link>
                  <Link to="/jobs/employer-subscription" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-credit-card me-3"></i>Subscription & Billing
                  </Link>
                  <Link to="/jobs/employer-verification" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-shield-alt me-3"></i>Employer Verification
                  </Link>
                </div>
              </div>
            </div>
            <div className="mobile-nav-dropdown">
              <div 
                className={`mobile-nav-link ${isActive("/news") ? "active" : ""}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.parentElement;
                  if (dropdown) {
                    dropdown.classList.toggle('mobile-dropdown-open');
                  }
                }}
              >
                <span>
                  <i className="fa fa-newspaper me-3"></i>News & Info
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">News Categories</div>
                  <Link to="/news/national" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-globe me-3"></i>National News
                  </Link>
                  <Link to="/news/regional" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-map-marker-alt me-3"></i>Regional News
                  </Link>
                  <Link to="/news/politics" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-landmark me-3"></i>Politics
                  </Link>
                  <Link to="/news/education" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-graduation-cap me-3"></i>Education News
                  </Link>
                  <Link to="/news/jobs-recruitment" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-briefcase me-3"></i>Jobs & Recruitment News
                  </Link>
                  <Link to="/news/trending" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-fire me-3"></i>Trending News
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Government & Updates</div>
                  <Link to="/news/government-updates" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-building me-3"></i>Official Government Updates
                  </Link>
                  <Link to="/news/notifications" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bell me-3"></i>Notifications & Alerts
                  </Link>
                  <Link to="/news/saved" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bookmark me-3"></i>Saved News
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Quick Access</div>
                  <Link to="/news/latest" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-clock me-3"></i>Latest News
                  </Link>
                  <Link to="/news/popular" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-star me-3"></i>Popular Stories
                  </Link>
                </div>
              </div>
            </div>
            <div className="mobile-nav-dropdown">
              <div 
                className={`mobile-nav-link ${isActive("/skilled-workers") ? "active" : ""}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.parentElement;
                  if (dropdown) {
                    dropdown.classList.toggle('mobile-dropdown-open');
                  }
                }}
              >
                <span>
                  <i className="fa fa-tools me-3"></i>Hands & Skills
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Discover & Hire</div>
                  <Link to="/skilled-workers" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-search me-3"></i>Browse Directory
                  </Link>
                  <Link to="/skilled-workers" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-map-marker-alt me-3"></i>Search by Location
                  </Link>
                  <Link to="/skilled-workers" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-check-circle me-3"></i>Verified Workers
                  </Link>
                  <Link to="/skilled-workers" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-calendar-check me-3"></i>Service Requests
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">For Workers</div>
                  <Link to="/skilled-workers/create-profile" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-user-plus me-3"></i>Create Professional Profile
                  </Link>
                  <Link to="/skilled-workers/upload-samples" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-upload me-3"></i>Upload Work Samples
                  </Link>
                  <Link to="/skilled-workers/pricing" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-dollar-sign me-3"></i>Pricing
                  </Link>
                  <Link to="/skilled-workers/visibility" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-chart-line me-3"></i>Visibility Boost Packages
                  </Link>
                  <Link to="/skilled-workers/training" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-graduation-cap me-3"></i>Skill Training Resources
                  </Link>
                  <Link to="/skilled-workers/analytics" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-chart-bar me-3"></i>Customer Analytics
                  </Link>
                </div>
              </div>
            </div>
            <div className="mobile-nav-item">
              <Link 
                to="/directories" 
                className={`mobile-nav-link ${isActive("/directories") ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <span>
                  <i className="fa fa-folder me-3"></i>Directories
                </span>
              </Link>
            </div>
            {/* Admin/Staff Dashboard - Conditionally rendered based on user role */}
            <div className="mobile-nav-dropdown" id="mobileAdminDashboardNav" style={{ display: 'none' }}>
              <div 
                className={`mobile-nav-link ${isActive("/admin") ? "active" : ""}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.parentElement;
                  if (dropdown) {
                    dropdown.classList.toggle('mobile-dropdown-open');
                  }
                }}
              >
                <span>
                  <i className="fa fa-cog me-3"></i>Admin Dashboard
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Staff Features</div>
                  <Link to="/admin/add-job" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-plus-circle me-3"></i>Add Job
                  </Link>
                  <Link to="/admin/add-scholarship" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-trophy me-3"></i>Add Scholarship
                  </Link>
                  <Link to="/admin/add-news" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-newspaper me-3"></i>Add News
                  </Link>
                  <Link to="/admin/add-past-questions" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-file-alt me-3"></i>Add Past Questions
                  </Link>
                  <Link to="/admin/manage-content" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-tasks me-3"></i>Manage Uploaded Content
                  </Link>
                  <Link to="/admin/verification" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-check-circle me-3"></i>Verification Center
                  </Link>
                  <Link to="/admin/tickets" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-ticket-alt me-3"></i>User Tickets
                  </Link>
                  <Link to="/admin/moderation" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-shield-alt me-3"></i>Community Moderation
                  </Link>
                </div>
                <div className="mobile-dropdown-section">
                  <div className="mobile-dropdown-section-title">Super Admin</div>
                  <Link to="/admin/users" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-users me-3"></i>Manage All Users
                  </Link>
                  <Link to="/admin/approve-posts" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-check-double me-3"></i>Approve/Reject Posts
                  </Link>
                  <Link to="/admin/subscription-plans" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-credit-card me-3"></i>Subscription Plans
                  </Link>
                  <Link to="/admin/analytics" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-chart-bar me-3"></i>Reports & Analytics
                  </Link>
                  <Link to="/admin/system-settings" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-cog me-3"></i>System Settings
                  </Link>
                </div>
              </div>
            </div>
            {/* Account Dropdown - Only show when user is logged in and NOT on resume builder */}
            {!isResumeBuilderPage && isLoggedIn && (
              <div className="mobile-nav-dropdown">
                <div 
                  className={`mobile-nav-link ${isActive("/account") ? "active" : ""}`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    const dropdown = e.currentTarget.parentElement;
                    if (dropdown) {
                      dropdown.classList.toggle('mobile-dropdown-open');
                    }
                  }}
                >
                  <span>
                    <i className="fa fa-user me-3"></i>My Account
                  </span>
                  <i className="fa fa-chevron-down"></i>
                </div>
                <div className="mobile-dropdown-menu">
                  <Link to="/account/profile" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-user-circle me-3"></i>My Profile
                  </Link>
                  <Link to="/account/subscription" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-credit-card me-3"></i>Subscription Plans
                  </Link>
                  <Link to="/account/payments" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-receipt me-3"></i>Bills & Payment History
                  </Link>
                  <Link to="/account/saved" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-bookmark me-3"></i>Saved Items
                  </Link>
                  <Link to="/account/messages" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-envelope me-3"></i>Messages & Notifications
                  </Link>
                  <Link to="/account/referrals" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-user-plus me-3"></i>Referral & Rewards
                  </Link>
                  <Link to="/account/settings" className="mobile-dropdown-item" onClick={closeMobileMenu}>
                    <i className="fa fa-cog me-3"></i>Settings
                  </Link>
                  <Link to="/logout" className="mobile-dropdown-item text-danger" onClick={closeMobileMenu}>
                    <i className="fa fa-sign-out-alt me-3"></i>Logout
                  </Link>
                </div>
              </div>
            )}
            {/* Join Us Button - Only show when user is NOT logged in and NOT on resume builder */}
            {!isResumeBuilderPage && !isLoggedIn && (
              <div className="px-4 mt-2">
                <JoinUsButton className="w-full justify-center" onClick={closeMobileMenu} />
              </div>
            )}
              </>
            )}
          </div>

          {/* Mobile Social Media Icons */}
          <div className="mobile-sidebar-social mt-4 pt-4 border-top">
            <p className="text-muted mb-3">Follow Us</p>
            <div className="d-flex gap-3">
              <a 
                className="btn btn-light btn-sm-square rounded-circle" 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-primary"></i>
              </a>
              <a 
                className="btn btn-light btn-sm-square rounded-circle" 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-primary"></i>
              </a>
              <a 
                className="btn btn-light btn-sm-square rounded-circle" 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in text-primary"></i>
              </a>
            </div>
          </div>

          {/* Mobile Contact Info */}
          <div className="mobile-sidebar-contact mt-4 pt-4 border-top">
            <p className="text-muted mb-2"><i className="fa fa-map-marker-alt text-primary me-2"></i>Accra, Ghana</p>
            <p className="text-muted mb-2"><i className="fa fa-phone-alt text-primary me-2"></i>+233 XX XXX XXXX</p>
            <p className="text-muted mb-0"><i className="fa fa-envelope text-primary me-2"></i>info@gnrs.gov.gh</p>
          </div>
        </div>
      </div>

      <style>{`
        /* Mega Menu Styles */
        .mega-menu {
          position: static !important;
        }

        .mega-menu-content {
          width: 100vw;
          left: 0 !important;
          right: 0 !important;
          transform: none !important;
          margin-top: 0;
          padding: 0;
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border-radius: 0;
          background: #FFFFFF;
          overflow: hidden;
        }

        .mega-menu-wrapper {
          display: flex;
          min-height: 320px;
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 2rem clamp(2rem, 5vw, 4.5rem);
          box-sizing: border-box;
          gap: clamp(1.5rem, 2vw, 2.75rem);
        }

        @media (min-width: 1600px) {
          .mega-menu-wrapper {
            padding-left: clamp(4rem, 8vw, 6.5rem);
            padding-right: clamp(4rem, 8vw, 6.5rem);
            gap: clamp(2rem, 3vw, 3.5rem);
          }
        }

        @media (max-width: 1199.98px) {
          .mega-menu-wrapper {
            padding: 1.5rem 1.75rem;
            gap: 1.25rem;
          }
        }

        /* Left Sidebar */
        .mega-menu-sidebar {
          width: clamp(220px, 18vw, 320px);
          background: #F8F9FA;
          padding: 0;
          border-right: 2px solid rgba(0, 107, 63, 0.1);
          flex-shrink: 0;
        }

        .mega-menu-nav-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #2C2C2C;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 0.95rem;
          border-left: 3px solid transparent;
        }

        .mega-menu-nav-item:hover {
          background: rgba(0, 107, 63, 0.05);
          color: #006B3F;
        }

        .mega-menu-nav-item.active {
          background: rgba(0, 107, 63, 0.08);
          color: #006B3F;
          border-left-color: #006B3F;
          font-weight: 600;
        }

        .mega-menu-nav-item i {
          width: 20px;
          text-align: center;
          margin-right: 0.75rem;
        }

        /* Vertical Divider */
        .mega-menu-divider {
          width: 2px;
          background: rgba(0, 107, 63, 0.1);
          flex-shrink: 0;
        }

        /* Right Content Area */
        .mega-menu-content-area {
          flex: 1;
          padding: 0 2rem;
          position: relative;
        }

        .mega-menu-section {
          display: none;
          animation: fadeIn 0.3s ease;
        }

        .mega-menu-section.active {
          display: block;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mega-menu-section-title {
          color: #006B3F;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(0, 107, 63, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.85rem;
        }

        .mega-menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mega-menu-list li {
          margin-bottom: 0.25rem;
        }

        .mega-menu-item {
          display: flex;
          align-items: center;
          padding: 0.625rem 0.75rem;
          color: #2C2C2C;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .mega-menu-item:hover {
          background: rgba(0, 107, 63, 0.08);
          color: #006B3F;
          transform: translateX(4px);
        }

        .mega-menu-item i {
          color: #006B3F;
          width: 18px;
          text-align: center;
        }

        /* Featured Image Section */
        .mega-menu-featured-image {
          margin-top: 1.5rem;
        }

        .mega-menu-image-card {
          background: rgba(0, 107, 63, 0.05);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(0, 107, 63, 0.1);
        }

        .mega-menu-image-placeholder {
          height: 120px;
          background: #006B3F;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 2.5rem;
          overflow: hidden;
          position: relative;
        }

        .mega-menu-image-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .mega-menu-image-placeholder i {
          position: relative;
          z-index: 1;
          opacity: 0.3;
        }

        .mega-menu-image-content {
          padding: 1.25rem;
        }

        .mega-menu-image-content h6 {
          color: #006B3F;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .mega-menu-image-content p {
          color: #555555;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 991.98px) {
          .mega-menu-content {
            position: static !important;
            transform: none !important;
            width: 100% !important;
            left: auto !important;
            right: auto !important;
            box-shadow: none;
            padding: 0;
          }

          .mega-menu-wrapper {
            flex-direction: column;
            min-height: auto;
            padding: 1.5rem 1rem;
            max-width: 100%;
          }

          .mega-menu-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 2px solid rgba(0, 107, 63, 0.1);
            margin-bottom: 1rem;
            padding-bottom: 1rem;
          }

          .mega-menu-divider {
            display: none;
          }

          .mega-menu-content-area {
            padding: 0;
          }
        }

        /* Mobile Sidebar Styles */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          display: none;
        }

        @media (max-width: 991.98px) {
          .mobile-sidebar-overlay {
            display: block;
          }
        }

        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          max-width: 85vw;
          height: 100vh;
          background: #FFFFFF;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          z-index: 1050;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: none;
        }

        @media (max-width: 991.98px) {
          .mobile-sidebar {
            display: block;
          }
        }

        .mobile-sidebar-open {
          right: 0;
        }

        .mobile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(0, 107, 63, 0.1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 250, 248, 1) 100%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-sidebar-close {
          background: rgba(0, 107, 63, 0.1);
          border: none;
          font-size: 1.25rem;
          color: #006B3F;
          cursor: pointer;
          padding: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .mobile-sidebar-close:hover {
          background: #006B3F;
          color: #FFFFFF;
          transform: rotate(90deg);
        }

        .mobile-sidebar-content {
          padding: 0;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          overflow-y: auto;
          flex: 1;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          color: #2C2C2C;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
          background: transparent;
          gap: 0.75rem;
        }

        .mobile-nav-link > span {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .mobile-nav-link i.fa-chevron-down {
          flex-shrink: 0;
        }

        .mobile-nav-link:hover {
          background: rgba(0, 107, 63, 0.08);
          color: #006B3F;
          transform: translateX(4px);
        }

        .mobile-nav-link.active {
          background: #006B3F;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 107, 63, 0.2);
        }

        .mobile-nav-link.active i {
          color: #FFFFFF;
        }

        .mobile-nav-dropdown {
          display: flex;
          flex-direction: column;
        }

        .mobile-dropdown-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding-left: 0.5rem;
          margin-top: 0.25rem;
        }

        .mobile-nav-dropdown.mobile-dropdown-open .mobile-dropdown-menu {
          max-height: 500px;
        }

        .mobile-nav-dropdown .fa-chevron-down {
          transition: transform 0.3s ease;
          font-size: 0.75rem;
        }

        .mobile-nav-dropdown.mobile-dropdown-open .fa-chevron-down {
          transform: rotate(180deg);
        }

        .mobile-dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          color: #555555;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
          background: rgba(0, 107, 63, 0.03);
        }

        .mobile-dropdown-item:hover {
          background: rgba(0, 107, 63, 0.1);
          color: #006B3F;
          transform: translateX(4px);
        }

        .mobile-dropdown-item i {
          color: #006B3F;
          font-size: 0.85rem;
        }

        .mobile-dropdown-section {
          margin-bottom: 1.5rem;
        }

        .mobile-dropdown-section-title {
          color: #006B3F;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.75rem 1rem 0.5rem 2.5rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 107, 63, 0.1);
        }

        .mobile-sidebar-social,
        .mobile-sidebar-contact {
          font-size: 0.9rem;
          padding: 1.5rem;
          background: rgba(245, 250, 248, 0.5);
          border-top: 1px solid rgba(0, 107, 63, 0.1);
        }

        .mobile-sidebar-social p,
        .mobile-sidebar-contact p {
          margin-bottom: 0.75rem;
          color: #555555;
          font-weight: 500;
        }

        /* Ensure desktop navbar is always visible */
        @media (min-width: 992px) {
          .navbar-collapse {
            display: flex !important;
            flex-basis: auto;
            flex-grow: 1;
            align-items: center;
          }
        }

        /* Mobile toggle button styling */
        .navbar-toggler {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
        }

        .navbar-toggler-icon-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5em;
          height: 1.5em;
          font-size: 1.2rem;
          color: var(--primary);
        }

        /* Top Bar Social Icons */
        .top-bar-social-icons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 1rem;
        }

        .top-bar-social-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 50%;
          color: #000000;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .top-bar-social-icon:hover {
          background-color: #000000;
          border-color: #000000;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .top-bar-social-icon i {
          line-height: 1;
        }
      `}</style>
    </>
  );
};
