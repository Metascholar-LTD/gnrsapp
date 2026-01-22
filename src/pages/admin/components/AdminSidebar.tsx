import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import feather from "feather-icons";
import { Hotel } from "lucide-react";
import { getValidIconName } from "../utils/iconMap";
import { initializeSidebar } from "../modules/sidebar";

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
}

interface SidebarSection {
  header?: string;
  items: SidebarItem[];
}

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // TODO: Clear any authentication state/tokens here
    // localStorage.removeItem('adminToken');
    // sessionStorage.clear();
    navigate('/admin/sign-in');
  };

  useEffect(() => {
    // Initialize sidebar scroll and collapse after component mounts
    const timer = setTimeout(() => {
      initializeSidebar();
    }, 300);

    // Replace feather icons after render using safe replacement
    const iconTimer = setTimeout(() => {
      if (feather && feather.icons) {
        const elements = document.querySelectorAll('[data-feather]');
        elements.forEach((el) => {
          try {
            const iconName = el.getAttribute('data-feather');
            if (iconName && feather.icons[iconName]) {
              const svg = feather.icons[iconName].toSvg({
                width: '16',
                height: '16',
              });
              el.outerHTML = svg;
            }
          } catch (e) {
            // Skip invalid icons silently
          }
        });
      }
    }, 200);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(iconTimer);
    };
  }, [location.pathname]);

  const sidebarSections: SidebarSection[] = [
    {
      header: "Dashboard",
      items: [
        { icon: "sliders", label: "Overview", path: "/admin" },
      ],
    },
    {
      header: "Home Page",
      items: [
        { icon: "home", label: "Home Page", path: "/admin/home" },
      ],
    },
    {
      header: "Education Hub",
      items: [
        { icon: "book-open", label: "Academic Resources", path: "/admin/education" },
      ],
    },
    {
      header: "Scholarships Bank",
      items: [
        { icon: "award", label: "Scholarships", path: "/admin/scholarships" },
      ],
    },
    {
      header: "Career & Employment",
      items: [
        { icon: "briefcase", label: "Jobs", path: "/admin/jobs" },
        { icon: "building", label: "Companies", path: "/admin/jobs/companies" },
        { icon: "clock", label: "Jobs Approvals", path: "/admin/jobs/approvals" },
      ],
    },
    {
      header: "Hands & Skills",
      items: [
        { icon: "users", label: "Skilled Workers", path: "/admin/skilled-workers" },
        { icon: "briefcase", label: "Local Job Gigs", path: "/admin/local-job-gigs" },
      ],
    },
    {
      header: "Uni Ranking",
      items: [
        { icon: "award", label: "Uni Ranking", path: "/admin/uni-ranking" },
      ],
    },
    {
      header: "Directories",
      items: [
        { icon: "map-pin", label: "Directories", path: "/admin/directories" },
        { icon: "star", label: "Hotels", path: "/admin/directories/hotels" },
        { icon: "graduation-cap", label: "Universities", path: "/admin/directories/universities" },
        { icon: "school", label: "Senior High Schools", path: "/admin/directories/shs" },
        { icon: "utensils", label: "Restaurants", path: "/admin/directories/restaurants" },
        { icon: "heart", label: "Hospitals", path: "/admin/directories/hospitals" },
        { icon: "credit-card", label: "Banks", path: "/admin/directories/banks" },
        { icon: "database", label: "Datasets", path: "/admin/directories/datasets" },
      ],
    },
    {
      header: "News & Info",
      items: [
        { icon: "file", label: "News Articles", path: "/admin/news" },
        { icon: "info", label: "Info Hub", path: "/admin/info" },
        { icon: "help-circle", label: "FAQs", path: "/admin/info/faqs" },
      ],
    },
    {
      header: "Users",
      items: [
        { icon: "users", label: "All Users", path: "/admin/users" },
      ],
    },
    {
      header: "",
      items: [
        { icon: "log-out", label: "Log Out", path: "/admin/logout" },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    // Check if current path starts with the item path (for sub-routes)
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar">
        <Link className="sidebar-brand" to="/admin">
          <span className="align-middle">GNRS Admin</span>
        </Link>

        <ul className="sidebar-nav">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.header && (
                <li className="sidebar-header">{section.header}</li>
              )}
              {section.items.map((item, itemIndex) => {
                // Add separator before Log Out
                const isLogOut = item.label === "Log Out";
                return (
                  <React.Fragment key={itemIndex}>
                    {isLogOut && (
                      <li className="sidebar-separator">
                        <div className="sidebar-separator-line"></div>
                      </li>
                    )}
                    <li
                      className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                    >
                      {isLogOut ? (
                        <a className="sidebar-link" href="#" onClick={handleLogout}>
                          <i className="align-middle" data-feather={getValidIconName(item.icon)}></i>
                          <span className="align-middle">{item.label}</span>
                        </a>
                      ) : (
                        <Link className="sidebar-link" to={item.path}>
                          {item.label === "Hotels" ? (
                            <Hotel className="align-middle" size={16} />
                          ) : (
                            <i className="align-middle" data-feather={getValidIconName(item.icon)}></i>
                          )}
                          <span className="align-middle">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </ul>

        <div className="sidebar-cta">
          <div className="sidebar-cta-content">
            <strong className="d-inline-block mb-2">Admin Panel</strong>
            <div className="mb-3 text-sm">
              Manage all website content and data from here.
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;

