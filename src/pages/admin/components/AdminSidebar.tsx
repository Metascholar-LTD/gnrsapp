import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import feather from "feather-icons";
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
        { icon: "book-open", label: "Education Hub", path: "/admin/education" },
        { icon: "file-text", label: "Past Questions", path: "/admin/education/past-questions" },
        { icon: "book", label: "Lecture Notes", path: "/admin/education/lecture-notes" },
        { icon: "file", label: "Study Guides", path: "/admin/education/study-guides" },
        { icon: "book-open", label: "Ebooks", path: "/admin/education/ebooks" },
        { icon: "compass", label: "Course Recommendations", path: "/admin/education/course-recommendations" },
        { icon: "users", label: "Study Groups", path: "/admin/education/study-groups" },
        { icon: "message-circle", label: "Discussion Forums", path: "/admin/education/forums" },
        { icon: "bell", label: "Campus Announcements", path: "/admin/education/announcements" },
      ],
    },
    {
      header: "Scholarships Bank",
      items: [
        { icon: "award", label: "Scholarships", path: "/admin/scholarships" },
        { icon: "tag", label: "Field-Based", path: "/admin/scholarships/field-based" },
        { icon: "dollar-sign", label: "GetFund", path: "/admin/scholarships/getfund" },
        { icon: "briefcase", label: "GNPC", path: "/admin/scholarships/gnpc" },
        { icon: "smartphone", label: "MTN", path: "/admin/scholarships/mtn" },
        { icon: "globe", label: "Other Local", path: "/admin/scholarships/other-local" },
      ],
    },
    {
      header: "Career & Employment",
      items: [
        { icon: "briefcase", label: "Jobs", path: "/admin/jobs" },
        { icon: "briefcase", label: "All Jobs", path: "/admin/jobs/all" },
        { icon: "user-check", label: "Internships", path: "/admin/jobs/internships" },
        { icon: "user", label: "NSS Support", path: "/admin/jobs/nss" },
        { icon: "graduation-cap", label: "Graduate Recruitment", path: "/admin/jobs/graduate-recruitment" },
        { icon: "users", label: "YEA Jobs", path: "/admin/jobs/yea" },
        { icon: "building", label: "Companies", path: "/admin/jobs/companies" },
      ],
    },
    {
      header: "Hands & Skills",
      items: [
        { icon: "users", label: "Skilled Workers", path: "/admin/skilled-workers" },
        { icon: "tag", label: "Categories", path: "/admin/skilled-workers/categories" },
        { icon: "user-check", label: "Profiles", path: "/admin/skilled-workers/profiles" },
      ],
    },
    {
      header: "Directories",
      items: [
        { icon: "map-pin", label: "Directories", path: "/admin/directories" },
        { icon: "building", label: "Hotels", path: "/admin/directories/hotels" },
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
      header: "Settings",
      items: [
        { icon: "user", label: "Profile", path: "/admin/profile" },
        { icon: "settings", label: "Settings", path: "/admin/settings" },
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
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <Link className="sidebar-link" to={item.path}>
                    <i className="align-middle" data-feather={getValidIconName(item.icon)}></i>
                    <span className="align-middle">{item.label}</span>
                  </Link>
                </li>
              ))}
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

