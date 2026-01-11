import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Icon } from '@iconify/react';
import NotificationMenu from './components/NotificationMenu';
import SidebarMenu from './SidebarMenu';

const SneatLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile on mount and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1200); // Bootstrap XL breakpoint
      
      // Auto-collapse on tablets and below
      if (width < 1200) {
        setMenuCollapsed(true);
      } else if (width >= 1200 && width < 1600) {
        // Medium desktop - collapsed by default
        setMenuCollapsed(true);
      } else {
        // Large desktop - expanded by default
        setMenuCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Load only essential Sneat JS (excluding menu.js to prevent conflicts with React)
    const scripts = [
      '/sneat-assets/vendor/js/helpers.js',
      '/sneat-assets/js/config.js',
      '/sneat-assets/vendor/libs/jquery/jquery.js',
      '/sneat-assets/vendor/libs/popper/popper.js',
      '/sneat-assets/vendor/js/bootstrap.js',
      // NOTE: menu.js is excluded - we handle menu behavior in React
    ];

    const loadedScripts: HTMLScriptElement[] = [];
    let scriptsLoaded = 0;

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
        loadedScripts.push(script);
      });
    };

    // Load scripts sequentially
    const loadScripts = async () => {
      for (const src of scripts) {
        try {
          await loadScript(src);
        } catch (e) {
          console.warn(`Failed to load script: ${src}`);
        }
      }
    };

    loadScripts();

    return () => {
      // Cleanup scripts
      loadedScripts.forEach(script => {
        if (script.parentNode) {
          try {
            script.parentNode.removeChild(script);
          } catch (e) {
            // Ignore removal errors
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    // Update wrapper class for collapsed state
    const wrapper = document.querySelector('.layout-wrapper');
    if (wrapper) {
      if (menuCollapsed) {
        wrapper.classList.add('layout-menu-collapsed');
      } else {
        wrapper.classList.remove('layout-menu-collapsed');
      }
    }
  }, [menuCollapsed]);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenuCollapse = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  return (
    <>
      {/* Scoped Sneat Styles - Only apply within this layout */}
      <style>{`
        /* Import Sneat CSS files - Scoped to .layout-wrapper */
        @import url('/sneat-assets/vendor/fonts/boxicons.css');
        @import url('/sneat-assets/vendor/css/core.css');
        @import url('/sneat-assets/vendor/css/theme-default.css');
        @import url('/sneat-assets/css/demo.css');
        @import url('simplebar-react/dist/simplebar.min.css');

        /* Apply Plus Jakarta Sans font from dnx - SCOPED to layout-wrapper */
        .layout-wrapper,
        .layout-wrapper * {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        /* Iconify icon styling for sidebar - match dnx */
        .layout-wrapper .menu-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 1.5rem !important;
          height: 1.5rem !important;
          min-width: 1.5rem !important;
          min-height: 1.5rem !important;
          color: #54577A !important;
          transition: color 0.2s ease !important;
          flex-shrink: 0 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Ensure all menu links have icons visible */
        .layout-wrapper .menu-link .menu-icon {
          opacity: 1 !important;
          visibility: visible !important;
          display: inline-flex !important;
        }

        .layout-wrapper .menu-item.active .menu-icon {
          color: #141522 !important;
        }

        .layout-wrapper .menu-item:hover .menu-icon {
          color: #141522 !important;
        }

        /* dnx sidebar menu item styling - exact match */
        .layout-wrapper .menu-item .menu-link div[data-i18n],
        .layout-wrapper .menu-item .menu-link span {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          color: #54577A !important;
        }

        /* dnx menu header styling */
        .layout-wrapper .menu-header .menu-header-text {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          color: #8E92BC !important;
        }

        /* Active menu item - match dnx */
        .layout-wrapper .menu-item.active .menu-link div[data-i18n],
        .layout-wrapper .menu-item.active .menu-link span {
          color: #141522 !important;
          font-weight: 700 !important;
        }

        /* Hover state */
        .layout-wrapper .menu-item .menu-link:hover div[data-i18n],
        .layout-wrapper .menu-item .menu-link:hover span {
          color: #141522 !important;
        }

        /* Ensure proper background colors - SCOPED */
        .layout-wrapper .layout-menu {
          background-color: #fff !important;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4) !important;
        }

        /* Sticky logo at top */
        .layout-wrapper .app-brand.demo {
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
          background-color: #fff !important;
          margin-bottom: 0 !important;
        }

        .layout-wrapper .card {
          background-color: #fff !important;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4) !important;
          border: none !important;
        }

        .layout-wrapper .content-wrapper {
          background-color: #f5f5f9 !important;
        }

        /* Menu toggle button styling */
        .layout-wrapper .menu-toggle-desktop {
          position: relative;
        }

        .layout-wrapper .menu-toggle-desktop .btn {
          background: #fff !important;
          border: 1px solid #d9dee3 !important;
          border-radius: 50% !important;
          width: 24px !important;
          height: 24px !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4) !important;
          cursor: pointer !important;
          transition: all 0.2s ease-in-out !important;
        }

        .layout-wrapper .menu-toggle-desktop .btn:hover {
          background: #f5f5f9 !important;
          transform: scale(1.1);
        }

        .layout-wrapper .menu-toggle-desktop .btn i {
          font-size: 16px !important;
          line-height: 1 !important;
          color: #697a8d !important;
        }

        /* Collapsed menu state */
        .layout-wrapper.layout-menu-collapsed .layout-menu {
          width: 80px !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        /* Custom thin scrollbar for collapsed menu */
        .layout-wrapper.layout-menu-collapsed .layout-menu::-webkit-scrollbar {
          width: 4px !important;
        }

        .layout-wrapper.layout-menu-collapsed .layout-menu::-webkit-scrollbar-track {
          background: transparent !important;
        }

        .layout-wrapper.layout-menu-collapsed .layout-menu::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1) !important;
          border-radius: 10px !important;
        }

        .layout-wrapper.layout-menu-collapsed .layout-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2) !important;
        }

        .layout-wrapper.layout-menu-collapsed .layout-page {
          padding-left: 80px !important;
        }

        /* Hide text elements in collapsed state */
        .layout-wrapper.layout-menu-collapsed .app-brand-text {
          display: none !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-item div[data-i18n] {
          display: none !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-header {
          display: none !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-sub {
          display: none !important;
        }

        /* Constrain menu items to sidebar width */
        .layout-wrapper.layout-menu-collapsed .menu-item {
          display: block !important;
          width: 100% !important;
          overflow: hidden !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-link {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 0.75rem 1.5rem !important;
          width: 100% !important;
        }

        /* Keep icons visible and perfectly centered */
        .layout-wrapper.layout-menu-collapsed .menu-icon {
          margin: 0 auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          font-size: 1.5rem !important;
          width: 1.5rem !important;
          height: 1.5rem !important;
        }

        .layout-wrapper.layout-menu-collapsed .app-brand {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 1.25rem 1.5rem !important;
          width: 100% !important;
        }

        .layout-wrapper.layout-menu-collapsed .app-brand-logo {
          margin: 0 auto !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }

        /* Hide chevrons for menu toggles */
        .layout-wrapper.layout-menu-collapsed .menu-toggle::after {
          display: none !important;
        }

        /* Force menu inner to respect width */
        .layout-wrapper.layout-menu-collapsed .menu-inner {
          width: 100% !important;
          padding: 0 !important;
        }

        /* Add thin divider lines between sections in collapsed state */
        .layout-wrapper.layout-menu-collapsed .menu-inner > .menu-item:first-of-type .menu-link {
          position: relative !important;
          margin-bottom: 0.5rem !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-inner > .menu-item:first-of-type .menu-link::after {
          content: '' !important;
          position: absolute !important;
          bottom: -0.5rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 50% !important;
          max-width: 40px !important;
          height: 1px !important;
          background-color: #e4e6ef !important;
          opacity: 0.8 !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-header + .menu-item .menu-link {
          position: relative !important;
          margin-top: 0.75rem !important;
          padding-top: 0.875rem !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-header + .menu-item .menu-link::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 50% !important;
          max-width: 40px !important;
          height: 1px !important;
          background-color: #e4e6ef !important;
          opacity: 0.8 !important;
        }

        /* Expanded menu state - Fixed layout */
        .layout-wrapper:not(.layout-menu-collapsed) .layout-menu {
          width: 260px !important;
        }

        .layout-wrapper:not(.layout-menu-collapsed) .layout-page {
          padding-left: 260px !important;
        }

        /* Remove any max-width constraints on content */
        .layout-wrapper .layout-page {
          width: 100% !important;
          max-width: none !important;
        }

        .layout-wrapper .container-xxl {
          max-width: 100% !important;
          padding-right: 1.5rem !important;
          padding-left: 1.5rem !important;
        }

        /* Smooth transitions */
        .layout-wrapper .layout-menu {
          transition: width 0.3s ease-in-out !important;
          position: fixed !important;
          top: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          z-index: 1000 !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          box-sizing: border-box !important;
        }

        /* Thin scrollbar for expanded menu */
        .layout-wrapper .layout-menu::-webkit-scrollbar {
          width: 6px !important;
        }

        .layout-wrapper .layout-menu::-webkit-scrollbar-track {
          background: transparent !important;
        }

        .layout-wrapper .layout-menu::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08) !important;
          border-radius: 10px !important;
        }

        .layout-wrapper .layout-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15) !important;
        }

        .layout-wrapper .layout-page {
          transition: padding-left 0.3s ease-in-out !important;
          margin-left: 0 !important;
        }

        /* Prevent menu items from wrapping */
        .layout-wrapper .menu-item {
          white-space: nowrap !important;
        }

        /* Fix menu sub items */
        .layout-wrapper.layout-menu-collapsed .menu-item.open .menu-sub {
          display: none !important;
        }

        /* Menu inner container */
        .layout-wrapper .menu-inner {
          display: block !important;
        }

        /* Ensure menu items are visible */
        .layout-wrapper.layout-menu-collapsed .menu-inner .menu-item {
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Active menu item in collapsed state */
        .layout-wrapper.layout-menu-collapsed .menu-item.active .menu-link {
          background-color: rgba(105, 108, 255, 0.16) !important;
        }

        /* Tooltip on hover for collapsed items */
        .layout-wrapper.layout-menu-collapsed .menu-item:hover .menu-link {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }

        /* RESPONSIVE BREAKPOINTS */
        
        /* Mobile devices (< 576px) */
        @media (max-width: 575.98px) {
          .layout-wrapper .layout-menu {
            position: fixed !important;
            top: 0 !important;
            left: -260px !important;
            width: 260px !important;
            height: 100vh !important;
            z-index: 1001 !important;
            transition: left 0.3s ease-in-out !important;
            transform: none !important;
          }

          .layout-wrapper .layout-menu.show {
            left: 0 !important;
          }

          .layout-wrapper .layout-page {
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-menu {
            width: 260px !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-page {
            padding-left: 0 !important;
            width: 100vw !important;
          }

          .layout-wrapper .menu-toggle-desktop {
            display: none !important;
          }

          .layout-wrapper .layout-menu .menu-item .menu-link {
            width: 100% !important;
            padding: 0.75rem 1.5rem !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            text-align: left !important;
            gap: 0.75rem !important;
            margin: 0 !important;
          }

          /* Ensure icon is properly aligned on mobile */
          .layout-wrapper .layout-menu .menu-item .menu-link .menu-icon {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 1.5rem !important;
            height: 1.5rem !important;
            min-width: 1.5rem !important;
            min-height: 1.5rem !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Ensure menu item text is properly aligned on mobile */
          .layout-wrapper .layout-menu .menu-item .menu-link div[data-i18n],
          .layout-wrapper .layout-menu .menu-item .menu-link span {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.5 !important;
            flex: 1 !important;
          }

          .layout-wrapper .layout-menu .app-brand-text,
          .layout-wrapper .layout-menu .menu-header,
          .layout-wrapper .layout-menu .menu-text {
            display: block !important;
            opacity: 1 !important;
            text-align: left !important;
          }

          .layout-wrapper .layout-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            z-index: 1000 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
          }

          .layout-wrapper .layout-overlay.show {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
        }

        /* Tablets (576px - 1199px) */
        @media (min-width: 576px) and (max-width: 1199.98px) {
          /* Ensure wrapper doesn't constrain fixed sidebar */
          .layout-wrapper {
            position: relative !important;
            overflow: visible !important;
            width: 100% !important;
            height: 100% !important;
          }

          /* Ensure menu item names are visible on tablet */
          .layout-wrapper .layout-menu .menu-item div[data-i18n],
          .layout-wrapper .layout-menu .menu-item .menu-link span {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.5 !important;
            flex: 1 !important;
          }

          .layout-wrapper .layout-menu .menu-item .menu-link {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 0.75rem !important;
            padding: 0.75rem 1.5rem !important;
            margin: 0 !important;
          }

          /* Ensure icon is properly aligned on tablet */
          .layout-wrapper .layout-menu .menu-item .menu-link .menu-icon {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 1.5rem !important;
            height: 1.5rem !important;
            min-width: 1.5rem !important;
            min-height: 1.5rem !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Fix overlay blocking sidebar toggle */
          .layout-wrapper .layout-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            z-index: 1000 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
          }

          .layout-wrapper .layout-overlay.show {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }

          /* Ensure navbar toggle is above overlay */
          .layout-wrapper .navbar {
            z-index: 1002 !important;
            position: relative !important;
          }

          .layout-wrapper .navbar .layout-menu-toggle {
            z-index: 1003 !important;
            position: relative !important;
          }

          .layout-wrapper .navbar .layout-menu-toggle a {
            z-index: 1004 !important;
            position: relative !important;
            pointer-events: auto !important;
          }

          .layout-wrapper .layout-menu {
            position: fixed !important;
            top: 0 !important;
            left: -260px !important;
            width: 260px !important;
            height: 100vh !important;
            z-index: 1001 !important;
            transition: left 0.3s ease-in-out !important;
            transform: none !important;
          }

          .layout-wrapper .layout-menu.show {
            left: 0 !important;
          }

          /* Ensure container doesn't constrain the fixed sidebar */
          .layout-wrapper .layout-container {
            position: relative !important;
            overflow: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          .layout-wrapper .layout-page {
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-menu {
            width: 260px !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-page {
            padding-left: 0 !important;
            width: 100vw !important;
          }

          .layout-wrapper .menu-toggle-desktop {
            display: none !important;
          }

          /* Ensure sidebar brand text (Sneat) is visible on tablet */
          .layout-wrapper .layout-menu .app-brand-text {
            display: inline-block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .layout-wrapper .layout-menu .app-brand {
            display: flex !important;
            align-items: center !important;
            flex-direction: row !important;
          }

          .layout-wrapper .layout-menu .app-brand-link {
            display: flex !important;
            align-items: center !important;
            flex-direction: row !important;
            width: 100% !important;
          }

          /* Ensure menu headers are visible on tablet */
          .layout-wrapper .layout-menu .menu-header {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        }

        /* Small Desktop (1200px - 1599px) */
        @media (min-width: 1200px) and (max-width: 1599.98px) {
          .layout-wrapper .layout-menu {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 260px !important;
            height: 100vh !important;
            transform: none !important;
          }

          .layout-wrapper .layout-page {
            padding-left: 260px !important;
            margin-left: 0 !important;
            width: calc(100% - 260px) !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-menu {
            width: 80px !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-page {
            padding-left: 80px !important;
            width: calc(100% - 80px) !important;
          }
        }

        /* Large Desktop (>= 1600px) */
        @media (min-width: 1600px) {
          .layout-wrapper .layout-menu {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 260px !important;
            height: 100vh !important;
            transform: none !important;
          }

          .layout-wrapper .layout-page {
            padding-left: 260px !important;
            margin-left: 0 !important;
            width: calc(100% - 260px) !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-menu {
            width: 80px !important;
          }

          .layout-wrapper.layout-menu-collapsed .layout-page {
            padding-left: 80px !important;
            width: calc(100% - 80px) !important;
          }
        }

        /* Ensure sidebar is always visible on desktop */
        @media (min-width: 1200px) {
          .layout-wrapper .layout-menu {
            left: 0 !important;
            position: fixed !important;
            transform: none !important;
          }

          .layout-wrapper .layout-overlay {
            display: none !important;
          }

          .layout-wrapper:not(.layout-menu-collapsed) .menu-item .menu-link div[data-i18n],
          .layout-wrapper:not(.layout-menu-collapsed) .menu-item .menu-link span,
          .layout-wrapper:not(.layout-menu-collapsed) .app-brand-text,
          .layout-wrapper:not(.layout-menu-collapsed) .menu-header {
            display: block !important;
          }

          .layout-wrapper.layout-menu-collapsed .app-brand-text,
          .layout-wrapper.layout-menu-collapsed .menu-item div[data-i18n],
          .layout-wrapper.layout-menu-collapsed .menu-item .menu-link span,
          .layout-wrapper.layout-menu-collapsed .menu-header,
          .layout-wrapper.layout-menu-collapsed .menu-sub {
            display: none !important;
          }

          .layout-wrapper.layout-menu-collapsed .menu-link {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }

          .layout-wrapper.layout-menu-collapsed .menu-icon {
            margin: 0 auto !important;
            display: flex !important;
          }
        }

        /* Fix for mobile menu toggle */
        @media (max-width: 1199.98px) {
          .layout-wrapper .layout-menu-toggle {
            display: block !important;
          }

          .layout-wrapper .navbar .layout-menu-toggle {
            display: flex !important;
          }
        }

        /* Ensure proper z-index stacking */
        .layout-wrapper .layout-menu {
          z-index: 1001 !important;
        }

        .layout-wrapper .layout-overlay {
          z-index: 1000 !important;
        }

        .layout-wrapper .layout-page {
          z-index: 1 !important;
        }
      `}</style>
      <div className={`layout-wrapper layout-content-navbar ${menuCollapsed ? 'layout-menu-collapsed' : ''}`}>
      <div className="layout-container">
        {/* Menu */}
        <aside id="layout-menu" className={`layout-menu menu-vertical menu bg-menu-theme ${menuOpen ? 'show' : ''}`}>
          <div className="app-brand demo">
            <Link to="/userprofile" className="app-brand-link">
              <span className="app-brand-logo demo">
                <svg width="25" viewBox="0 0 25 42" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <path d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z" id="path-1"></path>
                    <path d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z" id="path-3"></path>
                    <path d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z" id="path-4"></path>
                    <path d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z" id="path-5"></path>
                  </defs>
                  <g id="g-app-brand" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                      <g id="Icon" transform="translate(27.000000, 15.000000)">
                        <g id="Mask" transform="translate(0.000000, 8.000000)">
                          <mask id="mask-2" fill="white">
                            <use xlinkHref="#path-1"></use>
                          </mask>
                          <use fill="#696cff" xlinkHref="#path-1"></use>
                          <g id="Path-3" mask="url(#mask-2)">
                            <use fill="#696cff" xlinkHref="#path-3"></use>
                            <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3"></use>
                          </g>
                          <g id="Path-4" mask="url(#mask-2)">
                            <use fill="#696cff" xlinkHref="#path-4"></use>
                            <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4"></use>
                          </g>
                        </g>
                        <g id="Triangle" transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000)">
                          <use fill="#696cff" xlinkHref="#path-5"></use>
                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5"></use>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span className="app-brand-text demo menu-text fw-bolder ms-2">Sneat</span>
            </Link>

            <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none" onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}>
              <Icon icon="iconamoon:arrow-left-2-duotone" style={{ fontSize: '1.25rem' }} />
            </a>
          </div>

          {/* Desktop Menu Toggle Button */}
          <div 
            className="menu-toggle-desktop d-none d-xl-block" 
            style={{ 
              position: 'absolute', 
              right: '-12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              zIndex: 1050 
            }}
          >
            <button 
              className="btn btn-sm" 
              onClick={toggleMenuCollapse}
              style={{ 
                background: '#fff', 
                border: '1px solid #d9dee3', 
                borderRadius: '50%', 
                width: '28px', 
                height: '28px', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0.125rem 0.25rem rgba(161, 172, 184, 0.4)',
                cursor: 'pointer'
              }}
            >
              <Icon 
                icon={menuCollapsed ? 'iconamoon:arrow-right-2-duotone' : 'iconamoon:arrow-left-2-duotone'} 
                style={{ fontSize: '18px', lineHeight: 1, color: '#697a8d' }}
              />
            </button>
          </div>

          <div className="menu-inner-shadow"></div>

          <SidebarMenu />
        </aside>
        {/* / Menu */}

        {/* Layout container */}
        <div className="layout-page">
          {/* Navbar */}
          <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a className="nav-item nav-link px-0 me-xl-4" href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}>
                <Icon icon="hugeicons:menu-01" style={{ fontSize: '1.5rem' }} />
              </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              {/* Search */}
              <div className="navbar-nav align-items-center">
                <div className="nav-item d-flex align-items-center">
                  <Icon icon="hugeicons:search-01" style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: '#697a8d' }} />
                  <input type="text" className="form-control border-0 shadow-none" placeholder="Search..." aria-label="Search..." />
                </div>
              </div>
              {/* /Search */}

              <ul className="navbar-nav flex-row align-items-center ms-auto">
                {/* Notification Panel */}
                <li className="nav-item me-2">
                  <NotificationMenu />
                </li>
                
                {/* User */}
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img src="/sneat-assets/img/avatars/1.png" alt="" className="w-px-40 h-auto rounded-circle" />
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar avatar-online">
                              <img src="/sneat-assets/img/avatars/1.png" alt="" className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-semibold d-block">John Doe</span>
                            <small className="text-muted">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/userprofile/account-settings/account">
                        <i className="bx bx-user me-2"></i>
                        <span className="align-middle">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="bx bx-cog me-2"></i>
                        <span className="align-middle">Settings</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <span className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                          <span className="flex-grow-1 align-middle">Billing</span>
                          <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/join">
                        <i className="bx bx-power-off me-2"></i>
                        <span className="align-middle">Log Out</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                {/*/ User */}
              </ul>
            </div>
          </nav>
          {/* / Navbar */}

          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              <Outlet />
            </div>
            {/* / Content */}

            {/* / Footer */}

            <div className="content-backdrop fade"></div>
          </div>
          {/* Content wrapper */}
        </div>
        {/* / Layout page */}
      </div>

      {/* Overlay */}
      <div 
        className={`layout-overlay layout-menu-toggle ${menuOpen ? 'show' : ''}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </div>
    </>
  );
};

export default SneatLayout;
