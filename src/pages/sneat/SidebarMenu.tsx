import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const SidebarMenu: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  // State to track which menu items are open
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  
  // Auto-expand menu if current path matches a submenu item
  useEffect(() => {
    const path = location.pathname;
    const menusToOpen = new Set<string>();
    
    // Jobs menu - expand for jobs and local-job-gigs related paths
    if (path.startsWith('/userprofile/jobs/') || 
        path === '/jobs' || 
        path.startsWith('/jobs/') || 
        path === '/local-job-gigs' || 
        path.startsWith('/local-job-gigs/') ||
        path.startsWith('/skilled-workers/')) {
      menusToOpen.add('jobs');
    }
    if (path.startsWith('/userprofile/scholarships/')) {
      menusToOpen.add('scholarships');
    }
    if (path.startsWith('/userprofile/mentorship/')) {
      menusToOpen.add('mentorship');
    }
    if (path.startsWith('/userprofile/services/') || 
        path.startsWith('/userprofile/ratings') ||
        path.startsWith('/userprofile/analytics')) {
      menusToOpen.add('services');
    }
    if (path.startsWith('/userprofile/settings/')) {
      menusToOpen.add('settings');
    }
    
    setOpenMenus(menusToOpen);
  }, [location.pathname]);
  
  const toggleMenu = (menuKey: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuKey)) {
        newSet.delete(menuKey);
      } else {
        newSet.add(menuKey);
      }
      return newSet;
    });
  };
  
  const isMenuOpen = (menuKey: string) => openMenus.has(menuKey);

  return (
    <ul className="menu-inner py-1">
      {/* Dashboard */}
      <li className={`menu-item ${isActive('/userprofile') ? 'active' : ''}`}>
        <Link to="/userprofile" className="menu-link">
          <Icon icon="hugeicons:grid-view" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Dashboard">Dashboard</div>
        </Link>
      </li>

      {/* LEARNING SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Learning</span>
      </li>
      
      {/* My Resources */}
      <li className="menu-item">
        <Link to="/userprofile/courses" className="menu-link">
          <Icon icon="hugeicons:download-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="My Resources">My Resources</div>
        </Link>
      </li>

      {/* Past Questions */}
      <li className="menu-item">
        <Link to="/userprofile/past-questions" className="menu-link">
          <Icon icon="hugeicons:file-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Past Questions">Past Questions</div>
        </Link>
      </li>

      {/* Saved Resources */}
      <li className="menu-item">
        <Link to="/userprofile/saved-questions" className="menu-link">
          <Icon icon="hugeicons:bookmark-02" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Saved Resources">Saved Resources</div>
        </Link>
      </li>

      {/* OPPORTUNITIES SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Opportunities</span>
      </li>

      {/* Jobs - Career & Employment + Local Jobs */}
      <li className={`menu-item ${isMenuOpen('jobs') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('jobs', e)}>
          <Icon icon="hugeicons:briefcase-02" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Jobs">Jobs</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('jobs') ? 'show' : ''}`}>
          {/* Career & Employment Section */}
          <li className="menu-item" style={{ marginTop: '0.5rem' }}>
            <div style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: '#8E92BC', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Career & Employment
            </div>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/applications" className="menu-link">
              <div data-i18n="My Applications">My Applications</div>
              <span className="badge bg-label-primary rounded-pill ms-auto" style={{ fontSize: '0.65rem' }}>12</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/saved-jobs" className="menu-link">
              <div data-i18n="Saved Jobs">Saved Jobs</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/job-alerts" className="menu-link">
              <div data-i18n="Job Alerts">Job Alerts</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/jobs/cv-builder" className="menu-link">
              <div data-i18n="CV Builder">CV Builder</div>
            </Link>
          </li>

          {/* Divider */}
          <li className="menu-item" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e4e6ef' }}>
            <div style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: '#8E92BC', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Local Jobs & Gigs
            </div>
          </li>
          
          {/* Local Jobs & Gigs Section */}
          <li className="menu-item">
            <Link to="/userprofile/jobs/local-applications" className="menu-link">
              <div data-i18n="My Local Applications">My Local Applications</div>
              <span className="badge bg-label-info rounded-pill ms-auto" style={{ fontSize: '0.65rem' }}>5</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/artisan-profile" className="menu-link">
              <div data-i18n="My Artisan Profile">My Artisan Profile</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Scholarships */}
      <li className={`menu-item ${isMenuOpen('scholarships') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('scholarships', e)}>
          <Icon icon="hugeicons:school-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Scholarships">Scholarships</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('scholarships') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/userprofile/scholarships/applications" className="menu-link">
              <div data-i18n="My Applications">My Applications</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/scholarships/recommendations" className="menu-link">
              <div data-i18n="Recommendations">Recommendations</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* ACTIVITIES SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Activities</span>
      </li>

      {/* Messages */}
      <li className="menu-item">
        <Link to="/userprofile/messages" className="menu-link">
          <Icon icon="mage:message-dots" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Messages">Messages</div>
          <span className="badge bg-danger rounded-pill ms-auto">5</span>
        </Link>
      </li>

      {/* Mentorship Program */}
      <li className={`menu-item ${isMenuOpen('mentorship') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('mentorship', e)}>
          <Icon icon="hugeicons:user-group" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Mentorship">Mentorship</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('mentorship') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/userprofile/mentorship/my-sessions" className="menu-link">
              <div data-i18n="My Sessions">My Sessions</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/mentorship/find-mentor" className="menu-link">
              <div data-i18n="Find a Mentor">Find a Mentor</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/mentorship/become-mentor" className="menu-link">
              <div data-i18n="Become a Mentor">Become a Mentor</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* MY BUSINESS SECTION - Only for service providers/artisans */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">My Business</span>
      </li>

      {/* My Services */}
      <li className={`menu-item ${isMenuOpen('services') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('services', e)}>
          <Icon icon="hugeicons:store-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="My Services">My Services</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('services') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/userprofile/services/manage" className="menu-link">
              <div data-i18n="Manage Services">Manage Services</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/services/inquiries" className="menu-link">
              <div data-i18n="Customer Inquiries">Customer Inquiries</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/ratings" className="menu-link">
              <div data-i18n="Ratings">Ratings & Reviews</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/analytics" className="menu-link">
              <div data-i18n="Analytics">Performance Analytics</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* ACCOUNT & SETTINGS SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Account & Settings</span>
      </li>

      {/* My Profile */}
      <li className="menu-item">
        <Link to="/userprofile/profile" className="menu-link">
          <Icon icon="hugeicons:user-circle" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="My Profile">My Profile</div>
        </Link>
      </li>

      {/* Settings */}
      <li className={`menu-item ${isMenuOpen('settings') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('settings', e)}>
          <Icon icon="hugeicons:settings-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Settings">Settings</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('settings') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/userprofile/settings/account" className="menu-link">
              <div data-i18n="Account Settings">Account Settings</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/settings/privacy" className="menu-link">
              <div data-i18n="Privacy">Privacy Settings</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/settings/notifications" className="menu-link">
              <div data-i18n="Notifications">Notification Settings</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/settings/visibility" className="menu-link">
              <div data-i18n="Visibility">Profile Visibility</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Help & Support */}
      <li className="menu-item">
        <Link to="/userprofile/support" className="menu-link">
          <Icon icon="hugeicons:help-circle" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Support">Help & Support</div>
        </Link>
      </li>
    </ul>
  );
};

export default SidebarMenu;
