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

        .layout-wrapper .app-brand-text {
          text-transform: uppercase !important;
        }

        .layout-wrapper .card {
          background-color: #fff !important;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4) !important;
          border: none !important;
        }

        .layout-wrapper .content-wrapper {
          background-color: #f5f5f9 !important;
        }

        /* Menu toggle button styling - match PastQuestions/LectureNotes pattern */
        .layout-wrapper .app-brand {
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }

        .layout-wrapper .menu-toggle-desktop {
          margin-left: auto !important;
          margin-right: 0.5rem !important;
          flex-shrink: 0 !important;
        }

        .layout-wrapper.layout-menu-collapsed .menu-toggle-desktop {
          margin: 0 auto !important;
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
          overflow-x: visible !important;
          overflow-y: auto !important;
        }

        .layout-wrapper.layout-menu-collapsed .app-brand {
          overflow: visible !important;
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
          padding: 0.75rem 1rem !important;
          width: 100% !important;
          margin: 0 auto !important;
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
          padding: 1.25rem 1rem !important;
          width: 100% !important;
        }

        .layout-wrapper.layout-menu-collapsed .app-brand-link {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
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

        /* Menu sub items - show when parent has open class or menu-sub has show class */
        .layout-wrapper .menu-item .menu-sub {
          display: none !important;
        }
        
        .layout-wrapper .menu-item.open .menu-sub,
        .layout-wrapper .menu-sub.show {
          display: block !important;
        }

        /* Fix menu sub items in collapsed state */
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

          /* Ensure sidebar brand text (Sneat) is visible on tablet - match desktop spacing */
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
            width: auto !important;
            gap: 0.5rem !important;
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
                <img src="https://res.cloudinary.com/dsypclqxk/image/upload/v1762441822/Metscholar_iyoxrw.png" alt="GNRS" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </span>
              <span className="app-brand-text demo menu-text fw-bolder ms-2">GNRS</span>
            </Link>

            {/* Desktop Menu Toggle Button - In Header */}
            <div className="menu-toggle-desktop d-none d-xl-block">
              <button 
                className="btn btn-sm" 
                onClick={toggleMenuCollapse}
              >
                <Icon 
                  icon={menuCollapsed ? 'iconamoon:arrow-right-2-duotone' : 'iconamoon:arrow-left-2-duotone'} 
                  style={{ fontSize: '18px', lineHeight: 1, color: '#697a8d' }}
                />
              </button>
            </div>

            <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none" onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}>
              <Icon icon="iconamoon:arrow-left-2-duotone" style={{ fontSize: '1.25rem' }} />
            </a>
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
                        <Icon icon="hugeicons:user-circle" style={{ fontSize: '1rem', marginRight: '0.5rem', display: 'inline-flex', verticalAlign: 'middle' }} />
                        <span className="align-middle">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <Icon icon="hugeicons:settings-01" style={{ fontSize: '1rem', marginRight: '0.5rem', display: 'inline-flex', verticalAlign: 'middle' }} />
                        <span className="align-middle">Settings</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <span className="d-flex align-items-center align-middle">
                          <Icon icon="hugeicons:wallet-01" style={{ fontSize: '1rem', marginRight: '0.5rem', flexShrink: 0 }} />
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
                        <Icon icon="hugeicons:logout-01" style={{ fontSize: '1rem', marginRight: '0.5rem', display: 'inline-flex', verticalAlign: 'middle' }} />
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
