import { useEffect, useRef, useCallback, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { initializeAdminKit } from "../modules";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, LogOut, X } from "lucide-react";
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
  const navigate = useNavigate();
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const showWarningRef = useRef(false); // Ref to track warning state for event handlers

  // Auto-logout timer
  const AUTO_LOGOUT_TIME = 20 * 60 * 1000; // 20 minutes
  const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before logout

  const handleAutoLogout = useCallback(async () => {
    try {
      // Sign out from Supabase if authenticated
      await supabase.auth.signOut();
      
      // Clear any local storage
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      
      // Navigate to sign-in page
      navigate('/admin/sign-in');
    } catch (error) {
      console.error('Error during auto-logout:', error);
      // Still navigate even if signOut fails
      navigate('/admin/sign-in');
    }
  }, [navigate]);

  const resetLogoutTimer = useCallback(() => {
    // Clear existing timers
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    // Hide warning if showing
    setShowWarning(false);
    showWarningRef.current = false;
    setTimeRemaining(Math.floor(WARNING_TIME / 1000));
    
    // Set warning timer (shows 10 seconds before logout)
    const warningDelay = AUTO_LOGOUT_TIME - WARNING_TIME;
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      showWarningRef.current = true;
      setTimeRemaining(Math.floor(WARNING_TIME / 1000));
      
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningDelay);
    
    // Set logout timer
    logoutTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, AUTO_LOGOUT_TIME);
  }, [handleAutoLogout]);

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

    // Set up auto-logout timer
    resetLogoutTimer();

    // Reset timer on user activity (mouse move, click, keypress, scroll)
    // This ensures the timer resets when user is active
    // BUT: Don't reset if warning modal is showing (user needs to be able to click logout button)
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = (e: Event) => {
      // Don't reset timer if warning modal is showing - user needs to be able to click logout
      if (showWarningRef.current) {
        return;
      }
      
      // Don't reset if click is inside the modal
      const target = e.target as HTMLElement;
      if (target.closest('.admin-session-warning-modal')) {
        return;
      }
      
      resetLogoutTimer();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    return () => {
      clearTimeout(timer);
      // Clear auto-logout timer on unmount
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      // Remove activity listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      // Restore body scroll when unmounting
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      // Don't unload CSS on unmount - keep it loaded while navigating admin routes
      // unloadAdminKitCSS();
    };
  }, [navigate, resetLogoutTimer]);

  const handleLogoutNow = () => {
    handleAutoLogout();
  };

  return (
    <>
      {/* Session Warning Modal */}
      {showWarning && (
        <div className="admin-session-warning-overlay">
          <div className="admin-session-warning-modal">
            <button
              className="admin-session-warning-close"
              onClick={() => {
                setShowWarning(false);
                showWarningRef.current = false;
                resetLogoutTimer(); // Reset timer when closing modal
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            
            <div className="admin-session-warning-icon">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="admin-session-warning-title">Session Expiring Soon</h3>
            
            <p className="admin-session-warning-message">
              Your session will expire in <strong>{timeRemaining} second{timeRemaining !== 1 ? 's' : ''}</strong>.
              <br />
              Closing the warning modal will automatically extend your session, or you can logout now.
            </p>
            
            <div className="admin-session-warning-actions">
              <button
                className="admin-session-warning-btn admin-session-warning-btn--primary"
                onClick={handleLogoutNow}
              >
                <LogOut size={16} />
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}

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

      <style>{`
        .admin-session-warning-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .admin-session-warning-modal {
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 32px;
          max-width: 420px;
          width: 90%;
          position: relative;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .admin-session-warning-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #78716C;
          padding: 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .admin-session-warning-close:hover {
          background: #F5F5F4;
          color: #1C1917;
        }

        .admin-session-warning-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-radius: 16px;
          margin: 0 auto 20px;
          color: #D97706;
        }

        .admin-session-warning-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1C1917;
          text-align: center;
          margin: 0 0 12px 0;
        }

        .admin-session-warning-message {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.9375rem;
          color: #57534E;
          text-align: center;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .admin-session-warning-message strong {
          color: #D97706;
          font-weight: 600;
        }

        .admin-session-warning-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .admin-session-warning-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .admin-session-warning-btn--primary {
          background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
        }

        .admin-session-warning-btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(30, 58, 95, 0.4);
        }

        .admin-session-warning-btn--primary:active {
          transform: translateY(0);
        }

        .admin-session-warning-btn--secondary {
          background: #FFFFFF;
          color: #57534E;
          border: 1px solid #E7E5E4;
        }

        .admin-session-warning-btn--secondary:hover {
          background: #F5F5F4;
          border-color: #D6D3D1;
        }

        @media (max-width: 480px) {
          .admin-session-warning-modal {
            padding: 24px;
            margin: 16px;
          }

          .admin-session-warning-actions {
            flex-direction: column;
          }

          .admin-session-warning-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default AdminLayout;

