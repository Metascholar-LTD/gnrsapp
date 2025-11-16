import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { JoinUsButton } from "./JoinUsButton";

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
            <div className="ms-4 d-flex align-items-center">
              <a 
                className="btn btn-light btn-sm-square rounded-circle ms-2" 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-primary"></i>
              </a>
              <a 
                className="btn btn-light btn-sm-square rounded-circle ms-2" 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-primary"></i>
              </a>
              <a 
                className="btn btn-light btn-sm-square rounded-circle ms-2" 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in text-primary"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Top Bar End */}

        {/* Navbar Start */}
        <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
          <Link to="/" className="navbar-brand ms-4 ms-lg-0" onClick={closeMobileMenu}>
            <img 
              src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763063197/of_Participation_ovlz1n.png" 
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
              <Link 
                to="/" 
                className={`nav-item nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
              <div className="nav-item dropdown">
                <Link 
                  to="/education" 
                  className={`nav-link dropdown-toggle ${isActive("/education") ? "active" : ""}`}
                  id="educationDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Education
                </Link>
                <ul className="dropdown-menu" aria-labelledby="educationDropdown">
                  <li>
                    <Link 
                      to="/education/past-questions" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      Past Questions Repository
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/education/lecture-notes" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      Lecture Note
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/education/trial-questions" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      Trial Questions
                    </Link>
                  </li>
                </ul>
              </div>
              <Link 
                to="/scholarship-hub" 
                className={`nav-item nav-link ${isActive("/scholarship-hub") ? "active" : ""}`}
              >
                Scholarship Hub
              </Link>
              <div className="nav-item dropdown">
                <Link 
                  to="/jobs" 
                  className={`nav-link dropdown-toggle ${isActive("/jobs") ? "active" : ""}`}
                  id="jobsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Jobs
                </Link>
                <ul className="dropdown-menu" aria-labelledby="jobsDropdown">
                  <li>
                    <Link 
                      to="/jobs/listings" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      Job Listings
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/jobs/career-resources" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      Career Resources
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/jobs/professional-development" 
                      className="dropdown-item"
                      onClick={closeMobileMenu}
                    >
                      Professional Development
                    </Link>
                  </li>
                </ul>
              </div>
              <Link 
                to="/news" 
                className={`nav-item nav-link ${isActive("/news") ? "active" : ""}`}
              >
                News
              </Link>
              <Link 
                to="/contact" 
                className={`nav-item nav-link ${isActive("/contact") ? "active" : ""}`}
              >
                Contact
              </Link>
              <div className="d-flex align-items-center ms-3">
                <JoinUsButton />
              </div>
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
            src="https://res.cloudinary.com/dsypclqxk/image/upload/v1763063197/of_Participation_ovlz1n.png" 
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
                  <i className="fa fa-graduation-cap me-3"></i>Education
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <Link 
                  to="/education/past-questions" 
                  className="mobile-dropdown-item"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-file-alt me-3"></i>Past Questions Repository
                </Link>
                <Link 
                  to="/education/lecture-notes" 
                  className="mobile-dropdown-item"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-book-open me-3"></i>Lecture Note
                </Link>
                <Link 
                  to="/education/trial-questions" 
                  className="mobile-dropdown-item"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-question-circle me-3"></i>Trial Questions
                </Link>
              </div>
            </div>
            <Link 
              to="/scholarship-hub" 
              className={`mobile-nav-link ${isActive("/scholarship-hub") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span>
                <i className="fa fa-trophy me-3"></i>Scholarship Hub
              </span>
            </Link>
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
                  <i className="fa fa-briefcase me-3"></i>Jobs
                </span>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div className="mobile-dropdown-menu">
                <Link 
                  to="/jobs/listings" 
                  className="mobile-dropdown-item"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-list me-3"></i>Job Listings
                </Link>
                <Link 
                  to="/jobs/career-resources" 
                  className="mobile-dropdown-item"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-book me-3"></i>Career Resources
                </Link>
                <Link 
                  to="/jobs/professional-development" 
                  className="mobile-dropdown-item"
                  onClick={closeMobileMenu}
                >
                  <i className="fa fa-chart-line me-3"></i>Professional Development
                </Link>
              </div>
            </div>
            <Link 
              to="/news" 
              className={`mobile-nav-link ${isActive("/news") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span>
                <i className="fa fa-newspaper me-3"></i>News
              </span>
            </Link>
            <Link 
              to="/contact" 
              className={`mobile-nav-link ${isActive("/contact") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span>
                <i className="fa fa-envelope me-3"></i>Contact
              </span>
            </Link>
            <div className="px-4 mt-2">
              <JoinUsButton className="w-full justify-center" onClick={closeMobileMenu} />
            </div>
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
          background: linear-gradient(135deg, #006B3F 0%, #4ECDC4 100%);
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
      `}</style>
    </>
  );
};
