import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarMenu: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <ul className="menu-inner py-1">
      {/* Dashboard */}
      <li className={`menu-item ${isActive('/userprofile') ? 'active' : ''}`}>
        <Link to="/userprofile" className="menu-link">
          <i className="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Dashboard">Dashboard</div>
        </Link>
      </li>

      {/* LEARNING SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Learning</span>
      </li>
      
      {/* My Courses */}
      <li className="menu-item">
        <Link to="/userprofile/courses" className="menu-link">
          <i className="menu-icon tf-icons bx bx-book-open"></i>
          <div data-i18n="My Courses">My Courses</div>
        </Link>
      </li>

      {/* Past Questions */}
      <li className="menu-item">
        <Link to="/userprofile/past-questions" className="menu-link">
          <i className="menu-icon tf-icons bx bx-file"></i>
          <div data-i18n="Past Questions">Past Questions</div>
        </Link>
      </li>

      {/* Saved Questions */}
      <li className="menu-item">
        <Link to="/userprofile/saved-questions" className="menu-link">
          <i className="menu-icon tf-icons bx bx-bookmark"></i>
          <div data-i18n="Saved Questions">Saved Questions</div>
        </Link>
      </li>

      {/* OPPORTUNITIES SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Opportunities</span>
      </li>

      {/* Job Board */}
      <li className="menu-item">
        <a href="#" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-briefcase"></i>
          <div data-i18n="Jobs">Jobs</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <Link to="/userprofile/jobs/browse" className="menu-link">
              <div data-i18n="Browse Jobs">Browse Jobs</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/alerts" className="menu-link">
              <div data-i18n="Job Alerts">Job Alerts</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/applications" className="menu-link">
              <div data-i18n="My Applications">My Applications</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/jobs/preferences" className="menu-link">
              <div data-i18n="Career Preferences">Career Preferences</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Scholarships */}
      <li className="menu-item">
        <a href="#" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-trophy"></i>
          <div data-i18n="Scholarships">Scholarships</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <Link to="/userprofile/scholarships/browse" className="menu-link">
              <div data-i18n="Browse Scholarships">Browse Scholarships</div>
            </Link>
          </li>
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

      {/* COMMUNITY SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Community</span>
      </li>

      {/* Networking Hub */}
      <li className="menu-item">
        <Link to="/userprofile/networking" className="menu-link">
          <i className="menu-icon tf-icons bx bx-group"></i>
          <div data-i18n="Networking Hub">Networking Hub</div>
        </Link>
      </li>

      {/* Mentorship Program */}
      <li className="menu-item">
        <a href="#" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-user-voice"></i>
          <div data-i18n="Mentorship">Mentorship</div>
        </a>
        <ul className="menu-sub">
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
          <li className="menu-item">
            <Link to="/userprofile/mentorship/my-sessions" className="menu-link">
              <div data-i18n="My Sessions">My Sessions</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Messages */}
      <li className="menu-item">
        <Link to="/userprofile/messages" className="menu-link">
          <i className="menu-icon tf-icons bx bx-chat"></i>
          <div data-i18n="Messages">Messages</div>
          <span className="badge bg-danger rounded-pill ms-auto">5</span>
        </Link>
      </li>

      {/* MY BUSINESS SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">My Business</span>
      </li>

      {/* My Services */}
      <li className="menu-item">
        <a href="#" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-store"></i>
          <div data-i18n="My Services">My Services</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <Link to="/userprofile/services/manage" className="menu-link">
              <div data-i18n="Manage Services">Manage Services</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/services/create" className="menu-link">
              <div data-i18n="Post Service">Post Service/Job</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/services/inquiries" className="menu-link">
              <div data-i18n="Customer Inquiries">Customer Inquiries</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Performance Analytics */}
      <li className="menu-item">
        <Link to="/userprofile/analytics" className="menu-link">
          <i className="menu-icon tf-icons bx bx-bar-chart-alt-2"></i>
          <div data-i18n="Analytics">Performance Analytics</div>
        </Link>
      </li>

      {/* Nearby Map */}
      <li className="menu-item">
        <Link to="/userprofile/nearby-map" className="menu-link">
          <i className="menu-icon tf-icons bx bx-map"></i>
          <div data-i18n="Nearby Map">Nearby Clients & Jobs</div>
        </Link>
      </li>

      {/* Ratings & Reviews */}
      <li className="menu-item">
        <Link to="/userprofile/ratings" className="menu-link">
          <i className="menu-icon tf-icons bx bx-star"></i>
          <div data-i18n="Ratings">Ratings & Reviews</div>
        </Link>
      </li>

      {/* ACCOUNT & SETTINGS SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Account & Settings</span>
      </li>

      {/* My Profile */}
      <li className="menu-item">
        <Link to="/userprofile/profile" className="menu-link">
          <i className="menu-icon tf-icons bx bx-user"></i>
          <div data-i18n="My Profile">My Profile</div>
        </Link>
      </li>

      {/* Subscription */}
      <li className="menu-item">
        <a href="#" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-credit-card"></i>
          <div data-i18n="Subscription">Subscription</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <Link to="/userprofile/subscription/current" className="menu-link">
              <div data-i18n="Current Plan">Current Plan</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/subscription/upgrade" className="menu-link">
              <div data-i18n="Upgrade Plan">Upgrade Plan</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/userprofile/subscription/history" className="menu-link">
              <div data-i18n="Payment History">Payment History</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Settings */}
      <li className="menu-item">
        <a href="#" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-cog"></i>
          <div data-i18n="Settings">Settings</div>
        </a>
        <ul className="menu-sub">
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
          <i className="menu-icon tf-icons bx bx-help-circle"></i>
          <div data-i18n="Support">Help & Support</div>
        </Link>
      </li>
    </ul>
  );
};

export default SidebarMenu;
