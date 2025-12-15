import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { initializeAdminKit } from "../modules";
import "simplebar/dist/simplebar.min.css";
import "../admin.css";
import "../admin-scoped.css";
import "../admin-isolation.css";

// Dynamically load AdminKit CSS only for admin pages
let adminKitCSSLoaded = false;
const loadAdminKitCSS = () => {
  if (!adminKitCSSLoaded && typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/adminkit.css';
    link.id = 'adminkit-css';
    document.head.appendChild(link);
    adminKitCSSLoaded = true;
  }
};

const unloadAdminKitCSS = () => {
  if (adminKitCSSLoaded && typeof document !== 'undefined') {
    const link = document.getElementById('adminkit-css');
    if (link) {
      link.remove();
      adminKitCSSLoaded = false;
    }
  }
};

const AdminLayout = () => {
  useEffect(() => {
    // Prevent body scroll when admin layout mounts
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;
    
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    
    // Load AdminKit CSS only when admin layout mounts
    loadAdminKitCSS();
    
    // Wait for React to render DOM first
    const timer = setTimeout(() => {
      initializeAdminKit();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Restore body scroll when unmounting
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      // Don't unload CSS on unmount - keep it loaded while navigating admin routes
      // unloadAdminKitCSS();
    };
  }, []);

  return (
    <div id="admin-scope" className="admin-scope">
      <div className="wrapper">
        <AdminSidebar />
        <div className="main">
          <AdminNavbar />
          <main className="content">
            <Outlet />
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

