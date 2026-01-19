// ============================================================================
// SCHOLAR SIDEBAR MENU
// ============================================================================
// Sidebar navigation menu for scholar dashboard
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const ScholarSidebarMenu: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  // State to track which menu items are open
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  
  // Auto-expand menu if current path matches a submenu item
  useEffect(() => {
    const path = location.pathname;
    const menusToOpen = new Set<string>();
    
    if (path.startsWith('/scholar/dashboard') || path === '/scholar') {
      menusToOpen.add('dashboard');
    }
    if (path.startsWith('/scholar/submit-paper') || 
        path.startsWith('/scholar/papers')) {
      menusToOpen.add('papers');
    }
    if (path.startsWith('/scholarly/scholars/')) {
      menusToOpen.add('profile');
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
      <li className={`menu-item ${isActive('/scholar') || isActive('/scholar/dashboard') ? 'active' : ''}`}>
        <Link to="/scholar/dashboard" className="menu-link">
          <Icon icon="hugeicons:grid-view" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Dashboard">Dashboard</div>
        </Link>
      </li>

      {/* PUBLICATIONS SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Publications</span>
      </li>
      
      {/* My Papers */}
      <li className={`menu-item ${isMenuOpen('papers') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('papers', e)}>
          <Icon icon="hugeicons:file-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="My Papers">My Papers</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('papers') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/scholar/submit-paper" className="menu-link">
              <div data-i18n="Submit Paper">Submit New Paper</div>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/scholar/papers/pending') ? 'active' : ''}`}>
            <Link to="/scholar/papers/pending" className="menu-link">
              <div data-i18n="Pending">Pending Review</div>
            </Link>
          </li>
          <li className={`menu-item ${isActive('/scholar/papers') ? 'active' : ''}`}>
            <Link to="/scholar/papers" className="menu-link">
              <div data-i18n="All Papers">All Papers</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* PROFILE & METRICS SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Profile & Metrics</span>
      </li>

      {/* My Profile */}
      <li className={`menu-item ${isActive('/scholar/profile') ? 'active' : ''}`}>
        <Link to="/scholar/profile" className="menu-link">
          <Icon icon="hugeicons:user-circle" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="My Profile">My Profile</div>
        </Link>
      </li>

      {/* EXPLORE SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Explore</span>
      </li>

      {/* Rankings */}
      <li className="menu-item">
        <a href="/scholarly/rankings" target="_blank" rel="noopener noreferrer" className="menu-link">
          <Icon icon="hugeicons:ranking" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Rankings">University Rankings</div>
        </a>
      </li>

      {/* Articles */}
      <li className="menu-item">
        <a href="/scholarly/articles" target="_blank" rel="noopener noreferrer" className="menu-link">
          <Icon icon="hugeicons:book-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Articles">Browse Articles</div>
        </a>
      </li>

      {/* ACCOUNT SECTION */}
      <li className="menu-header small text-uppercase mt-3">
        <span className="menu-header-text">Account</span>
      </li>

      {/* Settings */}
      <li className={`menu-item ${isMenuOpen('settings') ? 'open' : ''}`}>
        <a href="#" className="menu-link menu-toggle" onClick={(e) => toggleMenu('settings', e)}>
          <Icon icon="hugeicons:settings-01" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Settings">Settings</div>
        </a>
        <ul className={`menu-sub ${isMenuOpen('settings') ? 'show' : ''}`}>
          <li className="menu-item">
            <Link to="/scholar/settings/account" className="menu-link">
              <div data-i18n="Account Settings">Account Settings</div>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/scholar/settings/notifications" className="menu-link">
              <div data-i18n="Notifications">Notification Settings</div>
            </Link>
          </li>
        </ul>
      </li>

      {/* Help & Support */}
      <li className="menu-item">
        <Link to="/scholar/support" className="menu-link">
          <Icon icon="hugeicons:help-circle" className="menu-icon" style={{ fontSize: '1.5rem' }} />
          <div data-i18n="Support">Help & Support</div>
        </Link>
      </li>
    </ul>
  );
};

export default ScholarSidebarMenu;
