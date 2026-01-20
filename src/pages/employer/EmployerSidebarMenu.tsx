import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const EmployerSidebarMenu: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  // State to track which menu items are open
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  
  // Auto-expand menu if current path matches a submenu item
  useEffect(() => {
    const path = location.pathname;
    const menusToOpen = new Set<string>();
    
    if (path.startsWith('/employer/job-listings/')) {
      menusToOpen.add('job-listings');
    }
    if (path.startsWith('/employer/gigs-listing/')) {
      menusToOpen.add('gigs-listing');
    }
    if (path.startsWith('/employer/applications/')) {
      menusToOpen.add('applications');
    }
    if (path.startsWith('/employer/candidates/')) {
      menusToOpen.add('candidates');
    }
    if (path.startsWith('/employer/subscription/')) {
      menusToOpen.add('subscription');
    }
    if (path.startsWith('/employer/settings/')) {
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
      <li className={`menu-item ${isActive('/employer') ? 'active' : ''}`}>
        <Link to="/employer" className="menu-link">
          <Icon icon="hugeicons:grid-view" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Dashboard">Dashboard</div>
        </Link>
      </li>

      {/* JOB MANAGEMENT SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Job Management</span>
      </li>
      
      {/* Job Listings */}
      <li className={`menu-item ${isMenuOpen('job-listings') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('job-listings', e)}>
          <Icon icon="hugeicons:briefcase-02" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Job Listings">Job Listings</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('job-listings') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/employer/job-listings/all" className="menu-link">
              <div data-i18n="All Jobs">All Jobs</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/job-listings/post" className="menu-link">
              <div data-i18n="Post New Job">Post New Job</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/job-listings/drafts" className="menu-link">
              <div data-i18n="Drafts">Drafts</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Gigs Listing */}
      <li className={`menu-item ${isMenuOpen('gigs-listing') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('gigs-listing', e)}>
          <Icon icon="hugeicons:briefcase-02" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Gigs Listing">Gigs Listing</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('gigs-listing') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/employer/gigs-listing/all" className="menu-link">
              <div data-i18n="All Gigs">All Gigs</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/gigs-listing/post" className="menu-link">
              <div data-i18n="Post New Gig">Post New Gig</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* APPLICATIONS & CANDIDATES SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Applications & Candidates</span>
      </li>

      {/* Applications */}
      <li className={`menu-item ${isMenuOpen('applications') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('applications', e)}>
          <Icon icon="hugeicons:file-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Applications">Applications</div>
          <span className="badge bg-danger rounded-pill ms-auto">12</span>
        </a>
        <ul className={`menu-sub ${isMenuOpen('applications') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/employer/applications/all" className="menu-link">
              <div data-i18n="All Applications">All Applications</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/applications/pending" className="menu-link">
              <div data-i18n="Pending Review">Pending Review</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/applications/shortlisted" className="menu-link">
              <div data-i18n="Shortlisted">Shortlisted</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/applications/rejected" className="menu-link">
              <div data-i18n="Rejected">Rejected</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Candidates */}
      <li className={`menu-item ${isMenuOpen('candidates') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('candidates', e)}>
          <Icon icon="hugeicons:user-group" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Candidates">Candidates</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('candidates') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/employer/candidates/shortlist" className="menu-link">
              <div data-i18n="Browse Candidates">Browse Candidates</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/candidates/messages" className="menu-link">
              <div data-i18n="Messages">Messages</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/candidates/cvs" className="menu-link">
              <div data-i18n="Download CVs">Download CVs</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* ACCOUNT & SETTINGS SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Account & Settings</span>
      </li>

      {/* Subscription & Billing */}
      <li className={`menu-item ${isMenuOpen('subscription') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('subscription', e)}>
          <Icon icon="hugeicons:wallet-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Subscription">Subscription & Billing</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('subscription') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/employer/subscription/current" className="menu-link">
              <div data-i18n="Current Plan">Current Plan</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/subscription/upgrade" className="menu-link">
              <div data-i18n="Upgrade Plan">Upgrade Plan</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/subscription/billing" className="menu-link">
              <div data-i18n="Billing History">Billing History</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Settings */}
      <li className={`menu-item ${isMenuOpen('settings') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('settings', e)}>
          <Icon icon="hugeicons:settings-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Settings">Settings</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('settings') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/employer/settings/account" className="menu-link">
              <div data-i18n="Account Settings">Account Settings</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/employer/settings/notifications" className="menu-link">
              <div data-i18n="Notifications">Notification Settings</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Help & Support */}
      <li className="menu-item">
        <Link to="/employer/support" className="menu-link">
          <Icon icon="hugeicons:help-circle" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Support">Help & Support</div>
        </Link>
      </li>
    </ul>
  );
};

export default EmployerSidebarMenu;
