import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { JoinUsButton } from "./JoinUsButton";

export const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn] = useState(false);
  const isResumeBuilderPage = location.pathname.startsWith("/jobs/cv-builder");

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleMegaMenuNav = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navItem = target.closest('.nav-mega-sidebar-item') as HTMLElement;
      if (navItem) {
        const section = navItem.getAttribute('data-section');
        if (section) {
          const megaMenuWrapper = navItem.closest('.nav-mega-wrapper') as HTMLElement;
          if (megaMenuWrapper) {
            megaMenuWrapper.querySelectorAll('.nav-mega-sidebar-item').forEach(item => item.classList.remove('nav-mega-sidebar-item-active'));
            navItem.classList.add('nav-mega-sidebar-item-active');
            megaMenuWrapper.querySelectorAll('.nav-mega-section').forEach(sec => sec.classList.remove('nav-mega-section-active'));
            const targetSection = megaMenuWrapper.querySelector(`#nav-section-${section}`) as HTMLElement;
            if (targetSection) targetSection.classList.add('nav-mega-section-active');
          }
        }
      }
    };
    document.addEventListener('click', handleMegaMenuNav);
    return () => document.removeEventListener('click', handleMegaMenuNav);
  }, []);

  const megaMenuData = {
    education: {
      sections: [
        { id: 'academic', label: 'Academic Resources', icon: 'fa-book' },
        { id: 'engagement', label: 'Student Engagement', icon: 'fa-users' },
        { id: 'tools', label: 'Tools & Calculators', icon: 'fa-tools' }
      ],
      content: {
        academic: [
          { title: 'Study Materials', items: [
            { to: '/education/past-questions', label: 'University Past Questions', icon: 'fa-file-alt' },
            { to: '/education/shs-bece-questions', label: 'SHS and BECE Past Questions', icon: 'fa-book' },
            { to: '/education/lecture-notes', label: 'Lecture Notes & E-learning', icon: 'fa-book-open' },
            { to: '/education/trial-questions', label: 'Trial Questions', icon: 'fa-question-circle' },
            { to: '/education/study-guides', label: 'Study Guides and Tutorials', icon: 'fa-graduation-cap' },
            { to: '/education/ebooks', label: 'E-books and Training Resources', icon: 'fa-file-pdf' }
          ]},
          { title: 'Search & Discovery', items: [
            { to: '/education/course-recommendations', label: 'Course Recommendation Engine', icon: 'fa-lightbulb' },
            { to: '/education/departmental-resources', label: 'Departmental Resources', icon: 'fa-building' },
            { to: '/education/research-tools', label: 'Integrated Research Tools', icon: 'fa-microscope' },
            { to: '/education/internship-guidance', label: 'Internship & Project Guidance', icon: 'fa-briefcase' }
          ]}
        ],
        engagement: [
          { title: 'Community', items: [
            { to: '/education/discussion-forums', label: 'Discussion Forums', icon: 'fa-comments' },
            { to: '/education/study-groups', label: 'Study Groups', icon: 'fa-users' },
            { to: '/education/alumni-connect', label: 'Alumni Connect', icon: 'fa-network-wired' }
          ]},
          { title: 'Support & Guidance', items: [
            { to: '/education/mentorship', label: 'Mentorship Program', icon: 'fa-user-friends' },
            { to: '/education/campus-announcements', label: 'Campus Announcements', icon: 'fa-bullhorn' },
            { to: '/education/academic-notifications', label: 'Academic Notifications', icon: 'fa-bell' }
          ]}
        ],
        tools: [
          { title: 'Academic Tools', items: [
            { to: '/education/cgpa-calculator', label: 'CGPA Calculator', icon: 'fa-calculator' },
            { to: '/education/timetable-builder', label: 'Timetable Builder', icon: 'fa-calendar-alt' },
            { to: '/education/ai-tutor', label: 'AI Study Tutor', icon: 'fa-robot' }
          ]},
          { title: 'My Resources', items: [
            { to: '/education/my-resources', label: 'My Saved Resources', icon: 'fa-bookmark' },
            { to: '/education/learning-path', label: 'My Learning Path', icon: 'fa-route' }
          ]}
        ]
      },
      images: {
        academic: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
        engagement: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80',
        tools: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&q=80'
      }
    },
    scholarship: {
      sections: [
        { id: 'global', label: 'Global Scholarships', icon: 'fa-globe' },
        { id: 'local', label: 'Local Scholarships', icon: 'fa-map-marker-alt' },
        { id: 'tools', label: 'Scholarship Tools', icon: 'fa-tools' }
      ],
      content: {
        global: [
          { title: 'Browse Global Scholarships', items: [
            { to: '/scholarship-hub', label: 'Global Scholarships Bank', icon: 'fa-globe' },
            { to: '/scholarship-hub/field-based', label: 'Field-Based Scholarships', icon: 'fa-tags' }
          ]}
        ],
        local: [
          { title: 'Ghana-Based Scholarships', items: [
            { to: '/scholarship-hub/getfund', label: 'GETFund Scholarships', icon: 'fa-university' },
            { to: '/scholarship-hub/gnpc', label: 'GNPC Scholarships', icon: 'fa-oil-can' },
            { to: '/scholarship-hub/mtn', label: 'MTN Scholarships', icon: 'fa-mobile-alt' },
            { to: '/scholarship-hub/other-local', label: 'Other Local Scholarships', icon: 'fa-building' }
          ]}
        ],
        tools: [
          { title: 'Application Tools & Resources', items: [
            { to: '/scholarship-hub/essay-builder', label: 'Essay/SoP Builder', icon: 'fa-file-alt' },
            { to: '/scholarship-hub/saved', label: 'My Saved Scholarships', icon: 'fa-bookmark' }
          ]}
        ]
      },
      images: {
        global: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg',
        local: 'https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg',
        tools: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&q=80'
      }
    },
    jobs: {
      sections: [
        { id: 'search', label: 'Job Search', icon: 'fa-search' },
        { id: 'career', label: 'Career Development', icon: 'fa-chart-line' },
        { id: 'employer', label: 'Employer Zone', icon: 'fa-briefcase' }
      ],
      content: {
        search: [
          { title: 'Browse Jobs', items: [
            { to: '/jobs/browse', label: 'Verified Job Listings', icon: 'fa-search' },
            { to: '/jobs/all', label: 'All Jobs', icon: 'fa-list' }
          ]},
          { title: 'Special Programs', items: [
            { to: '/jobs/internships', label: 'Internship Listings', icon: 'fa-briefcase' },
            { to: '/jobs/nss', label: 'National Service Support', icon: 'fa-user-tie' },
            { to: '/jobs/graduate-recruitment', label: 'Graduate Recruitment', icon: 'fa-graduation-cap' },
            { to: '/jobs/yea-jobs', label: 'Youth Employment Agency', icon: 'fa-users' }
          ]}
        ],
        career: [
          { title: 'Application Tools', items: [
            { to: '/jobs/cv-builder', label: 'Smart CV Builder', icon: 'fa-file-alt' },
            { to: '/jobs/cover-letter', label: 'Cover Letter Generator', icon: 'fa-envelope' },
            { to: '/jobs/ai-interview', label: 'AI Interview Assistant', icon: 'fa-robot' }
          ]},
          { title: 'Career Growth', items: [
            { to: '/jobs/skill-assessment', label: 'Skill Assessment Tests', icon: 'fa-clipboard-check' },
            { to: '/jobs/career-resources', label: 'Career Resources', icon: 'fa-book' },
            { to: '/jobs/professional-development', label: 'Professional Development', icon: 'fa-chart-line' }
          ]}
        ],
        employer: [
          { title: 'Job Management', items: [
            { to: '/jobs/post', label: 'Post New Job', icon: 'fa-plus-circle' },
            { to: '/jobs/manage-listings', label: 'Manage Job Listings', icon: 'fa-tasks' },
            { to: '/jobs/applicant-dashboard', label: 'Applicant Dashboard', icon: 'fa-dashboard' },
            { to: '/jobs/shortlisting', label: 'Candidate Shortlisting', icon: 'fa-user-check' },
            { to: '/jobs/download-cvs', label: 'Download Applicant CVs', icon: 'fa-download' }
          ]},
          { title: 'Business Tools', items: [
            { to: '/jobs/employer-analytics', label: 'Employer Analytics', icon: 'fa-chart-bar' },
            { to: '/jobs/employer-subscription', label: 'Subscription & Billing', icon: 'fa-credit-card' },
            { to: '/jobs/employer-verification', label: 'Employer Verification', icon: 'fa-shield-alt' }
          ]}
        ]
      },
      images: {
        search: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&q=80',
        career: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop&q=80',
        employer: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80'
      }
    },
    skilledWorkers: {
      sections: [
        { id: 'discover', label: 'Discover & Hire', icon: 'fa-search' },
        { id: 'workers', label: 'For Workers', icon: 'fa-user-tie' }
      ],
      content: {
        discover: [
          { title: 'Search & Browse', items: [
            { to: '/skilled-workers', label: 'Search by Location', icon: 'fa-map-marker-alt' },
            { to: '/skilled-workers', label: 'Verified Workers', icon: 'fa-check-circle' },
            { to: '/skilled-workers', label: 'Service Requests', icon: 'fa-calendar-check' }
          ]}
        ],
        workers: [
          { title: 'Profile Management', items: [
            { to: '/skilled-workers/create-profile', label: 'Create Professional Profile', icon: 'fa-user-plus' },
            { to: '/skilled-workers/upload-samples', label: 'Upload Work Samples', icon: 'fa-upload' },
            { to: '/skilled-workers/pricing', label: 'Pricing', icon: 'fa-dollar-sign' }
          ]}
        ]
      },
      images: {
        discover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop&q=80',
        workers: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80'
      }
    },
    news: {
      sections: [
        { id: 'categories', label: 'News Categories', icon: 'fa-newspaper' },
        { id: 'government', label: 'Government & Updates', icon: 'fa-building' },
        { id: 'quick', label: 'Quick Access', icon: 'fa-clock' }
      ],
      content: {
        categories: [
          { title: 'General News', items: [
            { to: '/news/national', label: 'National News', icon: 'fa-globe' },
            { to: '/news/regional', label: 'Regional News', icon: 'fa-map-marker-alt' },
            { to: '/news/politics', label: 'Politics', icon: 'fa-landmark' },
            { to: '/news/trending', label: 'Trending News', icon: 'fa-fire' }
          ]},
          { title: 'Specialized News', items: [
            { to: '/news/education', label: 'Education News', icon: 'fa-graduation-cap' },
            { to: '/news/jobs-recruitment', label: 'Jobs & Recruitment News', icon: 'fa-briefcase' }
          ]}
        ],
        government: [
          { title: 'Official Updates', items: [
            { to: '/news/government-updates', label: 'Official Government Updates', icon: 'fa-building' },
            { to: '/news/notifications', label: 'Notifications & Alerts', icon: 'fa-bell' }
          ]},
          { title: 'My News', items: [
            { to: '/news/saved', label: 'Saved News', icon: 'fa-bookmark' }
          ]}
        ],
        quick: [
          { title: 'Popular Content', items: [
            { to: '/news/latest', label: 'Latest News', icon: 'fa-clock' },
            { to: '/news/popular', label: 'Popular Stories', icon: 'fa-star' }
          ]}
        ]
      },
      images: {
        categories: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop&q=80',
        government: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop&q=80',
        quick: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop&q=80'
      }
    }
  };

  const MegaMenu = ({ menuKey, label, path }: { menuKey: keyof typeof megaMenuData, label: string, path: string }) => {
    const data = megaMenuData[menuKey];
    const firstSection = data.sections[0].id;
    
    return (
      <div className="nav-item-dropdown nav-mega-menu">
        <Link to={path} className={`nav-link nav-link-dropdown ${isActive(path) ? 'nav-link-active' : ''}`}>
          {label}
          <i className="fa fa-chevron-down nav-dropdown-icon"></i>
        </Link>
        <div className="nav-dropdown-menu nav-mega-content">
          <div className="nav-mega-wrapper">
            <div className="nav-mega-sidebar">
              {data.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`nav-mega-sidebar-item ${idx === 0 ? 'nav-mega-sidebar-item-active' : ''}`}
                  data-section={section.id}
                >
                  <i className={`fa ${section.icon} nav-mega-icon`}></i>
                  <span>{section.label}</span>
                </div>
              ))}
            </div>
            <div className="nav-mega-divider"></div>
            <div className="nav-mega-content-area">
              {data.sections.map((section, idx) => (
                <div
                  key={section.id}
                  id={`nav-section-${section.id}`}
                  className={`nav-mega-section ${idx === 0 ? 'nav-mega-section-active' : ''}`}
                >
                  <div className="nav-mega-grid">
                    {(data.content[section.id as keyof typeof data.content] as Array<{ title: string; items: Array<{ to: string; label: string; icon: string }> }>).map((group, gIdx) => (
                      <div key={gIdx} className="nav-mega-column">
                        <h6 className="nav-mega-section-title">{group.title}</h6>
                        <ul className="nav-mega-list">
                          {group.items.map((item, itemIdx) => (
                            <li key={`${item.to}-${item.label}-${itemIdx}`}>
                              <Link to={item.to} className="nav-mega-item" onClick={closeMobileMenu}>
                                <i className={`fa ${item.icon} nav-mega-item-icon`}></i>
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="nav-mega-column">
                      <div className="nav-mega-featured">
                        <div className="nav-mega-image-card">
                          <div className="nav-mega-image-placeholder">
                            <img src={data.images[section.id as keyof typeof data.images]} alt={section.label} />
                          </div>
                          <div className="nav-mega-image-content">
                            <h6>Featured Resource</h6>
                            <p>Discover comprehensive resources and opportunities.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MobileDropdown = ({ label, icon, path, children }: { label: string, icon: string, path?: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isActivePath = path ? isActive(path) : false;
    return (
      <div className={`nav-mobile-dropdown ${isOpen ? 'nav-mobile-dropdown-open' : ''}`}>
        <div className={`nav-mobile-link ${isActivePath ? 'nav-mobile-link-active' : ''}`} onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}>
          <span><i className={`fa ${icon} nav-mobile-icon`}></i>{label}</span>
          <i className={`fa fa-chevron-down nav-mobile-chevron`}></i>
        </div>
        <div className="nav-mobile-dropdown-menu">
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="nav-wrapper" className="nav-fixed-top">
        <div className="nav-top-bar">
          <div className="nav-top-bar-content">
            <div className="nav-top-bar-left">
              <small><i className="fa fa-map-marker-alt nav-top-icon"></i>Accra, Ghana</small>
              <small><i className="fa fa-clock nav-top-icon"></i>Mon - Fri: 8.00 am - 5.00 pm</small>
            </div>
            <div className="nav-top-bar-right">
              <small><i className="fa fa-envelope nav-top-icon"></i>info@gnrs.gov.gh</small>
              <small><i className="fa fa-phone-alt nav-top-icon"></i>+233 XX XXX XXXX</small>
              <div className="nav-top-social">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="nav-top-social-icon" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="nav-top-social-icon" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="nav-top-social-icon" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <nav id="nav-main" className="nav-main">
          <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
            <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" alt="GNRS Logo" className="nav-brand-img" />
          </Link>

          <div className="nav-desktop">
            <div className="nav-links-container">
              <div className="nav-links">
              {isResumeBuilderPage ? (
                <>
                  <Link to="/jobs/cv-builder" className={`nav-link ${isActive("/jobs/cv-builder") && location.pathname === "/jobs/cv-builder" ? "nav-link-active" : ""}`}>Home</Link>
                  <Link to="/jobs/cv-builder/templates" className={`nav-link ${isActive("/jobs/cv-builder/templates") ? "nav-link-active" : ""}`}>Templates</Link>
                  <Link to="/jobs/cv-builder/about" className={`nav-link ${isActive("/jobs/cv-builder/about") ? "nav-link-active" : ""}`}>About</Link>
                </>
              ) : (
                <>
                  <Link to="/" className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}>Home</Link>
                  <MegaMenu menuKey="education" label="Education Hub" path="/education" />
                  <MegaMenu menuKey="scholarship" label="Scholarships Bank" path="/scholarship-hub" />
                  <MegaMenu menuKey="jobs" label="Career & Employment" path="/jobs" />
                  <MegaMenu menuKey="skilledWorkers" label="Hands & Skills" path="/skilled-workers" />
                  <Link to="/directories" className={`nav-link ${isActive("/directories") ? "nav-link-active" : ""}`}>Directories</Link>
                  <MegaMenu menuKey="news" label="News & Info" path="/news" />
                  {isLoggedIn && (
                    <div className="nav-item-dropdown">
                      <Link to="/account" className={`nav-link nav-link-dropdown ${isActive("/account") ? "nav-link-active" : ""}`}>
                        <i className="fa fa-user nav-link-icon"></i>Account
                        <i className="fa fa-chevron-down nav-dropdown-icon"></i>
                      </Link>
                      <div className="nav-dropdown-menu nav-dropdown-menu-right">
                        <Link to="/account/profile" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-user-circle nav-dropdown-icon"></i>My Profile
                        </Link>
                        <Link to="/account/subscription" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-credit-card nav-dropdown-icon"></i>Subscription Plans
                        </Link>
                        <Link to="/account/payments" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-receipt nav-dropdown-icon"></i>Bills & Payment History
                        </Link>
                        <div className="nav-dropdown-divider"></div>
                        <Link to="/account/saved" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-bookmark nav-dropdown-icon"></i>Saved Items
                        </Link>
                        <Link to="/account/messages" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-envelope nav-dropdown-icon"></i>Messages & Notifications
                        </Link>
                        <Link to="/account/referrals" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-user-plus nav-dropdown-icon"></i>Referral & Rewards
                        </Link>
                        <div className="nav-dropdown-divider"></div>
                        <Link to="/account/settings" className="nav-dropdown-item" onClick={closeMobileMenu}>
                          <i className="fa fa-cog nav-dropdown-icon"></i>Settings
                        </Link>
                        <Link to="/logout" className="nav-dropdown-item nav-dropdown-item-danger" onClick={closeMobileMenu}>
                          <i className="fa fa-sign-out-alt nav-dropdown-icon"></i>Logout
                        </Link>
                      </div>
                    </div>
                  )}
                  {!isLoggedIn && (
                    <div className="nav-join-wrapper">
                      <JoinUsButton onClick={closeMobileMenu} />
                    </div>
                  )}
                </>
              )}
              </div>
            </div>
          </div>

          <button className="nav-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation" aria-expanded={isMobileMenuOpen}>
            <span className={`nav-toggle-icon ${isMobileMenuOpen ? 'nav-toggle-icon-open' : ''}`}>
              {isMobileMenuOpen ? <i className="fa fa-times"></i> : <span></span>}
            </span>
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && <div className="nav-mobile-overlay" onClick={closeMobileMenu}></div>}

      <div className={`nav-mobile-sidebar ${isMobileMenuOpen ? 'nav-mobile-sidebar-open' : ''}`}>
        <div className="nav-mobile-header">
          <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944554/Of_Participation_-_1_-_Edited_l53t4f.png" alt="GNRS Logo" className="nav-mobile-brand-img" />
          <button className="nav-mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="nav-mobile-content">
          <div className="nav-mobile-links">
            {isResumeBuilderPage ? (
              <>
                <Link to="/jobs/cv-builder" className={`nav-mobile-link ${isActive("/jobs/cv-builder") && location.pathname === "/jobs/cv-builder" ? "nav-mobile-link-active" : ""}`} onClick={closeMobileMenu}>
                  <span>Home</span>
                </Link>
                <Link to="/jobs/cv-builder/templates" className={`nav-mobile-link ${isActive("/jobs/cv-builder/templates") ? "nav-mobile-link-active" : ""}`} onClick={closeMobileMenu}>
                  <span>Templates</span>
                </Link>
                <Link to="/jobs/cv-builder/about" className={`nav-mobile-link ${isActive("/jobs/cv-builder/about") ? "nav-mobile-link-active" : ""}`} onClick={closeMobileMenu}>
                  <span>About</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className={`nav-mobile-link ${isActive("/") ? "nav-mobile-link-active" : ""}`} onClick={closeMobileMenu}>
                  <span><i className="fa fa-home nav-mobile-icon"></i>Home</span>
                </Link>
                <MobileDropdown label="Education Hub" icon="fa-graduation-cap" path="/education">
                  {Object.values(megaMenuData.education.content).flat().map((group, gIdx) => (
                    <div key={gIdx} className="nav-mobile-dropdown-section">
                      <div className="nav-mobile-dropdown-section-title">{group.title}</div>
                      {group.items.map((item, itemIdx) => (
                        <Link key={`${item.to}-${item.label}-${itemIdx}`} to={item.to} className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                          <i className={`fa ${item.icon} nav-mobile-dropdown-icon`}></i>{item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </MobileDropdown>
                <MobileDropdown label="Scholarships Bank" icon="fa-trophy" path="/scholarship-hub">
                  {Object.values(megaMenuData.scholarship.content).flat().map((group, gIdx) => (
                    <div key={gIdx} className="nav-mobile-dropdown-section">
                      <div className="nav-mobile-dropdown-section-title">{group.title}</div>
                      {group.items.map((item, itemIdx) => (
                        <Link key={`${item.to}-${item.label}-${itemIdx}`} to={item.to} className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                          <i className={`fa ${item.icon} nav-mobile-dropdown-icon`}></i>{item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </MobileDropdown>
                <MobileDropdown label="Career & Employment" icon="fa-briefcase" path="/jobs">
                  {Object.values(megaMenuData.jobs.content).flat().map((group, gIdx) => (
                    <div key={gIdx} className="nav-mobile-dropdown-section">
                      <div className="nav-mobile-dropdown-section-title">{group.title}</div>
                      {group.items.map((item, itemIdx) => (
                        <Link key={`${item.to}-${item.label}-${itemIdx}`} to={item.to} className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                          <i className={`fa ${item.icon} nav-mobile-dropdown-icon`}></i>{item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </MobileDropdown>
                <MobileDropdown label="Hands & Skills" icon="fa-tools" path="/skilled-workers">
                  {Object.values(megaMenuData.skilledWorkers.content).flat().map((group, gIdx) => (
                    <div key={gIdx} className="nav-mobile-dropdown-section">
                      <div className="nav-mobile-dropdown-section-title">{group.title}</div>
                      {group.items.map((item, itemIdx) => (
                        <Link key={`${item.to}-${item.label}-${itemIdx}`} to={item.to} className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                          <i className={`fa ${item.icon} nav-mobile-dropdown-icon`}></i>{item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </MobileDropdown>
                <Link to="/directories" className={`nav-mobile-link ${isActive("/directories") ? "nav-mobile-link-active" : ""}`} onClick={closeMobileMenu}>
                  <span><i className="fa fa-folder nav-mobile-icon"></i>Directories</span>
                </Link>
                <MobileDropdown label="News & Info" icon="fa-newspaper" path="/news">
                  {Object.values(megaMenuData.news.content).flat().map((group, gIdx) => (
                    <div key={gIdx} className="nav-mobile-dropdown-section">
                      <div className="nav-mobile-dropdown-section-title">{group.title}</div>
                      {group.items.map((item, itemIdx) => (
                        <Link key={`${item.to}-${item.label}-${itemIdx}`} to={item.to} className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                          <i className={`fa ${item.icon} nav-mobile-dropdown-icon`}></i>{item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </MobileDropdown>
                {isLoggedIn && (
                  <MobileDropdown label="My Account" icon="fa-user">
                    <Link to="/account/profile" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-user-circle nav-mobile-dropdown-icon"></i>My Profile
                    </Link>
                    <Link to="/account/subscription" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-credit-card nav-mobile-dropdown-icon"></i>Subscription Plans
                    </Link>
                    <Link to="/account/payments" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-receipt nav-mobile-dropdown-icon"></i>Bills & Payment History
                    </Link>
                    <Link to="/account/saved" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-bookmark nav-mobile-dropdown-icon"></i>Saved Items
                    </Link>
                    <Link to="/account/messages" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-envelope nav-mobile-dropdown-icon"></i>Messages & Notifications
                    </Link>
                    <Link to="/account/referrals" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-user-plus nav-mobile-dropdown-icon"></i>Referral & Rewards
                    </Link>
                    <Link to="/account/settings" className="nav-mobile-dropdown-item" onClick={closeMobileMenu}>
                      <i className="fa fa-cog nav-mobile-dropdown-icon"></i>Settings
                    </Link>
                    <Link to="/logout" className="nav-mobile-dropdown-item nav-mobile-dropdown-item-danger" onClick={closeMobileMenu}>
                      <i className="fa fa-sign-out-alt nav-mobile-dropdown-icon"></i>Logout
                    </Link>
                  </MobileDropdown>
                )}
                {!isLoggedIn && (
                  <div className="nav-mobile-join">
                    <JoinUsButton onClick={closeMobileMenu} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="nav-mobile-footer">
            <div className="nav-mobile-social">
              <p>Follow Us</p>
              <div className="nav-mobile-social-icons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="nav-mobile-social-icon" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="nav-mobile-contact">
              <p><i className="fa fa-map-marker-alt nav-mobile-contact-icon"></i>Accra, Ghana</p>
              <p><i className="fa fa-phone-alt nav-mobile-contact-icon"></i>+233 XX XXX XXXX</p>
              <p><i className="fa fa-envelope nav-mobile-contact-icon"></i>info@gnrs.gov.gh</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #nav-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transform: none;
          will-change: auto;
        }

        .nav-top-bar {
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(147, 197, 253, 0.05) 50%, rgba(96, 165, 250, 0.05) 100%);
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
          height: 45px;
          display: none;
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) {
          .nav-top-bar {
            display: block;
          }
        }

        .nav-top-bar-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.25rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-top-bar-left,
        .nav-top-bar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-top-bar-left small,
        .nav-top-bar-right small {
          font-size: 0.875rem;
          color: #2c2c2c;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-top-icon {
          color: #2c2c2c;
        }

        .nav-top-social {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 1rem;
        }

        .nav-top-social-icon {
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

        .nav-top-social-icon:hover {
          background-color: #000000;
          border-color: #000000;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

         #nav-main {
           position: relative;
           width: 100%;
           height: clamp(70px, 10vw, 80px);
           display: flex;
           align-items: center;
           justify-content: space-between;
           transform: none;
           isolation: isolate;
         }

         /* Tablet: 768px - 1199px */
         @media (min-width: 768px) {
           #nav-main {
             height: clamp(75px, 9vw, 80px);
           }
         }

         /* Desktop: 1200px+ */
         @media (min-width: 1200px) {
           #nav-main {
             height: 80px;
           }
         }

         .nav-brand {
           position: absolute;
           left: 0;
           top: 50%;
           transform: translateY(-50%);
           display: flex;
           align-items: center;
           text-decoration: none;
           padding-left: 0.75rem;
           flex-shrink: 0;
           z-index: 10;
         }

         /* Tablet: 768px - 1199px */
         @media (min-width: 768px) {
           .nav-brand {
             padding-left: clamp(1rem, 2vw, 1.25rem);
           }
         }

         /* Desktop: 1200px - 1599px */
         @media (min-width: 1200px) {
           .nav-brand {
             padding-left: clamp(1.25rem, 3vw, 1.5rem);
           }
         }

         /* Large screens: 1600px+ */
         @media (min-width: 1600px) {
           .nav-brand {
             padding-left: clamp(1.5rem, 4vw, 2rem);
           }
         }

        .nav-brand-img {
          height: clamp(50px, 8vw, 65px);
          width: auto;
          border: 1px solid rgba(240, 240, 240, 0.6);
          border-radius: 4px;
          padding: 4px;
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) {
          .nav-brand-img {
            height: clamp(55px, 7vw, 65px);
          }
        }

        /* Desktop: 1200px+ */
        @media (min-width: 1200px) {
          .nav-brand-img {
            height: 65px;
          }
        }

         .nav-desktop {
           display: none;
           position: absolute;
           right: 0;
           top: 0;
           height: 100%;
           z-index: 10;
           isolation: isolate;
         }

         /* Desktop: 1200px+ */
         @media (min-width: 1200px) {
           .nav-desktop {
             display: block;
           }
         }

         .nav-links-container {
           display: flex;
           align-items: center;
           height: 100%;
           padding-right: 0.75rem;
         }

         /* Tablet: 768px - 1199px */
         @media (min-width: 768px) {
           .nav-links-container {
             padding-right: clamp(1rem, 2vw, 1.25rem);
           }
         }

         /* Desktop: 1200px - 1599px */
         @media (min-width: 1200px) {
           .nav-links-container {
             padding-right: clamp(1.25rem, 3vw, 1.5rem);
           }
         }

         /* Large screens: 1600px+ */
         @media (min-width: 1600px) {
           .nav-links-container {
             padding-right: clamp(1.5rem, 4vw, 2rem);
           }
         }

         .nav-links {
           display: flex;
           align-items: center;
           gap: 0.5rem;
         }

        .nav-link {
          padding: clamp(1rem, 2vw, 1.5625rem) clamp(0.75rem, 1.5vw, 0.9375rem);
          color: #555555;
          text-decoration: none;
          font-weight: 500;
          font-size: clamp(0.875rem, 1.2vw, 0.95rem);
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(0.375rem, 0.8vw, 0.5rem);
        }

        .nav-link:hover {
          color: #555555;
        }

        .nav-link-active {
          color: #2563eb;
        }

        .nav-link:hover::after,
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0.9375rem;
          right: 0.9375rem;
          height: 3px;
          background: #2563eb;
        }

        .nav-link-icon {
          margin-right: 0.25rem;
          color: #2c2c2c;
        }

        .nav-link-active .nav-link-icon {
          color: #2563eb;
        }

        .nav-item-dropdown {
          position: relative;
        }

        .nav-mega-menu {
          position: static;
        }

        .nav-mega-menu .nav-mega-content {
          position: fixed !important;
          top: clamp(70px, 10vw, 80px) !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) {
          .nav-mega-menu .nav-mega-content {
            top: clamp(75px, 9vw, 80px) !important;
          }
        }

        /* Desktop: 1200px+ */
        @media (min-width: 1200px) {
          .nav-mega-menu .nav-mega-content {
            top: 125px !important;
          }
        }

        .nav-link-dropdown {
          position: relative;
        }

        .nav-dropdown-icon {
          margin-left: 0.5rem;
          font-size: 0.75rem;
          transition: transform 0.2s ease, color 0.2s ease;
          color: #2c2c2c;
        }

        .nav-link-active .nav-dropdown-icon,
        .nav-item-dropdown:hover .nav-dropdown-icon {
          color: #2563eb;
        }

        .nav-item-dropdown:hover .nav-dropdown-icon {
          transform: rotate(180deg);
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: #ffffff;
          min-width: 220px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 0.5rem 0;
          margin-top: 0.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .nav-item-dropdown:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .nav-dropdown-menu-right {
          left: auto;
          right: 0;
        }

        .nav-dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          color: #2c2c2c;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          gap: 0.75rem;
        }

        .nav-dropdown-item:hover {
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
        }

        .nav-dropdown-item .nav-dropdown-icon {
          color: #2c2c2c;
        }

        .nav-dropdown-item:hover .nav-dropdown-icon {
          color: #2563eb;
        }

        .nav-dropdown-item-danger {
          color: #dc3545;
        }

        .nav-dropdown-item-danger:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .nav-dropdown-divider {
          height: 1px;
          background: rgba(37, 99, 235, 0.1);
          margin: 0.5rem 0;
        }

        .nav-join-wrapper {
          margin-left: 0.75rem;
        }

         .nav-toggle {
           position: absolute;
           right: 0;
           top: 50%;
           transform: translateY(-50%);
           display: flex;
           align-items: center;
           justify-content: center;
           background: #ffffff;
           border: 1px solid rgba(0, 0, 0, 0.1);
           padding: 0.5rem;
           cursor: pointer;
           border-radius: 4px;
           margin-right: 0.75rem;
           z-index: 1001;
           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
         }

         /* Tablet: 768px - 1199px */
         @media (min-width: 768px) {
           .nav-toggle {
             margin-right: clamp(1rem, 2vw, 1.25rem);
           }
         }

         /* Desktop: 1200px+ */
         @media (min-width: 1200px) {
           .nav-toggle {
             display: none;
           }
         }

        .nav-toggle-icon {
          width: 1.5em;
          height: 1.5em;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #2c2c2c;
        }

        .nav-toggle-icon span {
          width: 20px;
          height: 2px;
          background: #2c2c2c;
          position: relative;
          display: block;
        }

        .nav-toggle-icon span::before,
        .nav-toggle-icon span::after {
          content: '';
          width: 20px;
          height: 2px;
          background: #2c2c2c;
          position: absolute;
          left: 0;
        }

        .nav-toggle-icon span::before {
          top: -6px;
        }

        .nav-toggle-icon span::after {
          top: 6px;
        }

        .nav-mega-content {
          position: fixed !important;
          top: clamp(70px, 10vw, 80px) !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: translateX(0) !important;
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border-radius: 0;
          background: #ffffff;
          overflow: hidden;
          max-width: none !important;
          z-index: 1001;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) {
          .nav-mega-content {
            top: clamp(75px, 9vw, 80px) !important;
          }
        }

        /* Desktop: 1200px+ */
        @media (min-width: 1200px) {
          .nav-mega-content {
            top: 125px !important;
          }
        }

        .nav-item-dropdown:hover .nav-mega-content {
          opacity: 1;
          visibility: visible;
        }

        .nav-mega-wrapper {
          display: flex;
          min-height: 320px;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 2rem clamp(2rem, 5vw, 4.5rem) !important;
          box-sizing: border-box;
          gap: clamp(1.5rem, 2vw, 2.75rem);
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) and (max-width: 1199px) {
          .nav-mega-wrapper {
            padding: clamp(1.5rem, 3vw, 2rem) clamp(1.75rem, 4vw, 2.5rem);
            gap: clamp(1.25rem, 2vw, 1.75rem);
          }
        }

        /* Desktop: 1200px - 1599px */
        @media (min-width: 1200px) and (max-width: 1599px) {
          .nav-mega-wrapper {
            padding: clamp(2rem, 4vw, 3rem) clamp(2.5rem, 5vw, 4rem);
            gap: clamp(1.75rem, 3vw, 2.5rem);
          }
        }

        /* Large screens: 1600px+ */
        @media (min-width: 1600px) {
          .nav-mega-wrapper {
            padding-left: clamp(4rem, 8vw, 6.5rem);
            padding-right: clamp(4rem, 8vw, 6.5rem);
            gap: clamp(2rem, 3vw, 3.5rem);
          }
        }

        .nav-mega-sidebar {
          width: clamp(220px, 18vw, 320px);
          background: #f8f9fa;
          padding: 0;
          border-right: 2px solid rgba(37, 99, 235, 0.1);
          flex-shrink: 0;
        }

        .nav-mega-sidebar-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #2c2c2c;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 0.95rem;
          border-left: 3px solid transparent;
        }

        .nav-mega-sidebar-item:hover {
          background: rgba(37, 99, 235, 0.05);
          color: #2563eb;
        }

        .nav-mega-sidebar-item-active {
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          border-left-color: #2563eb;
          font-weight: 600;
        }

        .nav-mega-icon {
          width: 20px;
          text-align: center;
          margin-right: 0.75rem;
          color: #2c2c2c;
        }

        .nav-mega-sidebar-item:hover .nav-mega-icon,
        .nav-mega-sidebar-item-active .nav-mega-icon {
          color: #2563eb;
        }

        .nav-mega-divider {
          width: 2px;
          background: rgba(37, 99, 235, 0.1);
          flex-shrink: 0;
        }

        .nav-mega-content-area {
          flex: 1;
          padding: 0 2rem;
          position: relative;
        }

        .nav-mega-section {
          display: none;
          animation: navFadeIn 0.3s ease;
        }

        .nav-mega-section-active {
          display: block;
        }

        @keyframes navFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-mega-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        /* Mobile: 0px - 767px */
        @media (max-width: 767px) {
          .nav-mega-content {
            position: static;
            transform: none;
            width: 100%;
            left: auto;
            right: auto;
            box-shadow: none;
            padding: 0;
            opacity: 1;
            visibility: visible;
          }

          .nav-mega-wrapper {
            flex-direction: column;
            min-height: auto;
            padding: clamp(1rem, 3vw, 1.5rem) clamp(0.75rem, 2vw, 1rem);
            max-width: 100%;
          }

          .nav-mega-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 2px solid rgba(37, 99, 235, 0.1);
            margin-bottom: 1rem;
            padding-bottom: 1rem;
          }

          .nav-mega-divider {
            display: none;
          }

          .nav-mega-content-area {
            padding: 0;
          }

          .nav-mega-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) and (max-width: 1199px) {
          .nav-mega-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(1.5rem, 3vw, 2rem);
          }
        }

        .nav-mega-section-title {
          color: #2563eb;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(37, 99, 235, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-mega-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-mega-list li {
          margin-bottom: 0.25rem;
        }

        .nav-mega-item {
          display: flex;
          align-items: center;
          padding: 0.625rem 0.75rem;
          color: #2c2c2c;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
          gap: 0.5rem;
        }

        .nav-mega-item:hover {
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          transform: translateX(4px);
        }

        .nav-mega-item-icon {
          color: #2c2c2c;
          width: 18px;
          text-align: center;
        }

        .nav-mega-item:hover .nav-mega-item-icon {
          color: #2563eb;
        }

        .nav-mega-featured {
          margin-top: 1.5rem;
        }

        .nav-mega-image-card {
          background: rgba(37, 99, 235, 0.05);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(37, 99, 235, 0.1);
        }

        .nav-mega-image-placeholder {
          height: 120px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 2.5rem;
          overflow: hidden;
          position: relative;
        }

        .nav-mega-image-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .nav-mega-image-content {
          padding: 1.25rem;
        }

        .nav-mega-image-content h6 {
          color: #2563eb;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .nav-mega-image-content p {
          color: #555555;
          line-height: 1.5;
          margin: 0;
          font-size: 0.875rem;
        }

        .nav-mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          display: none;
        }

        /* Mobile: 0px - 767px */
        @media (max-width: 767px) {
          .nav-mobile-overlay {
            display: block;
          }
        }

        .nav-mobile-sidebar {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          max-width: 85vw;
          height: 100vh;
          background: #ffffff;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          z-index: 1050;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: none;
          flex-direction: column;
        }

        /* Mobile: 0px - 767px */
        @media (max-width: 767px) {
          .nav-mobile-sidebar {
            display: flex;
          }
        }

        /* Tablet: 768px - 1199px */
        @media (min-width: 768px) and (max-width: 1199px) {
          .nav-mobile-sidebar {
            display: flex;
            width: clamp(320px, 40vw, 400px);
          }
        }

        .nav-mobile-sidebar-open {
          right: 0;
        }

        .nav-mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 1) 100%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          position: relative;
          flex-shrink: 0;
          z-index: 10;
        }

        .nav-mobile-brand-img {
          height: 50px;
          width: auto;
          border: 1px solid rgba(240, 240, 240, 0.6);
          border-radius: 4px;
          padding: 4px;
        }

        .nav-mobile-close {
          background: rgba(37, 99, 235, 0.1);
          border: none;
          font-size: 1.25rem;
          color: #2563eb;
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

        .nav-mobile-close:hover {
          background: #2563eb;
          color: #ffffff;
          transform: rotate(90deg);
        }

        .nav-mobile-content {
          padding: 0;
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .nav-mobile-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          overflow-y: auto;
          overflow-x: hidden;
          flex: 1;
          -webkit-overflow-scrolling: touch;
        }

        .nav-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          color: #2c2c2c;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
          background: transparent;
          gap: 0.75rem;
        }

        .nav-mobile-link > span {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .nav-mobile-link:hover {
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          transform: translateX(4px);
        }

        .nav-mobile-link-active {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }

        .nav-mobile-link-active i {
          color: #ffffff;
        }

        .nav-mobile-icon {
          margin-right: 0.75rem;
          color: #2c2c2c;
        }

        .nav-mobile-link:hover .nav-mobile-icon {
          color: #2563eb;
        }

        .nav-mobile-link-active .nav-mobile-icon {
          color: #ffffff;
        }

        .nav-mobile-dropdown {
          display: flex;
          flex-direction: column;
        }

        .nav-mobile-dropdown-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding-left: 0.5rem;
          margin-top: 0.25rem;
        }

        .nav-mobile-dropdown-open .nav-mobile-dropdown-menu {
          max-height: 1000px;
        }

        .nav-mobile-chevron {
          transition: transform 0.3s ease;
          font-size: 0.75rem;
        }

        .nav-mobile-dropdown-open .nav-mobile-chevron {
          transform: rotate(180deg);
        }

        .nav-mobile-dropdown-item-danger {
          color: #dc3545;
        }

        .nav-mobile-dropdown-item-danger:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .nav-mobile-dropdown-item {
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
          background: rgba(37, 99, 235, 0.03);
          gap: 0.75rem;
        }

        .nav-mobile-dropdown-item:hover {
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          transform: translateX(4px);
        }

        .nav-mobile-dropdown-icon {
          color: #2c2c2c;
          font-size: 0.85rem;
        }

        .nav-mobile-dropdown-item:hover .nav-mobile-dropdown-icon {
          color: #2563eb;
        }

        .nav-mobile-dropdown-section {
          margin-bottom: 1.5rem;
        }

        .nav-mobile-dropdown-section-title {
          color: #2563eb;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.75rem 1rem 0.5rem 2.5rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
        }

        .nav-mobile-join {
          padding: 1rem;
          margin-top: 1rem;
        }

        .nav-mobile-footer {
          padding: 1.5rem;
          background: rgba(239, 246, 255, 0.5);
          border-top: 1px solid rgba(37, 99, 235, 0.1);
        }

        .nav-mobile-social {
          margin-bottom: 1.5rem;
        }

        .nav-mobile-social p {
          margin-bottom: 0.75rem;
          color: #555555;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .nav-mobile-social-icons {
          display: flex;
          gap: 0.75rem;
        }

        .nav-mobile-social-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 50%;
          color: #2563eb;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .nav-mobile-social-icon:hover {
          background-color: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .nav-mobile-contact {
          font-size: 0.9rem;
        }

        .nav-mobile-contact p {
          margin-bottom: 0.5rem;
          color: #555555;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-mobile-contact-icon {
          color: #2c2c2c;
        }
      `}</style>
    </>
  );
};

