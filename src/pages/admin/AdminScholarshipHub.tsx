import { useState, useEffect, useRef } from "react";
import { MEDIA_QUERIES } from "@/lib/breakpoints";
import { 
  Award,
  Briefcase,
  DollarSign,
  Globe,
  Smartphone,
  Tag
} from "lucide-react";
import ScholarshipsManager from "./components/ScholarshipsManager";

const AdminScholarshipHub = () => {
  const [activeTab, setActiveTab] = useState("all-scholarships");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle sticky tabs spacing - account for navbar
    const handleScroll = () => {
      if (!tabsContainerRef.current || !spacerRef.current) return;
      
      // Get navbar height
      const navbar = document.querySelector('#admin-scope .navbar');
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
      
      const rect = tabsContainerRef.current.getBoundingClientRect();
      const isSticky = rect.top <= navbarHeight;
      
      if (isSticky) {
        tabsContainerRef.current.classList.add('sticky-active');
        spacerRef.current.style.height = `${rect.height}px`;
      } else {
        tabsContainerRef.current.classList.remove('sticky-active');
        spacerRef.current.style.height = '0px';
      }
    };

    // Use the content area's scroll event instead of window
    const contentArea = document.querySelector('#admin-scope .content');
    if (contentArea) {
      contentArea.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      return () => contentArea.removeEventListener('scroll', handleScroll);
    }
    
    return () => {};
  }, []);

  const tabs = [
    {
      id: "all-scholarships",
      label: "All Scholarships",
      icon: Award,
      description: "View and manage all scholarships across all sources"
    },
    {
      id: "field-based",
      label: "Field-Based",
      icon: Tag,
      description: "International and field-based scholarships"
    },
    {
      id: "getfund",
      label: "GETFund",
      icon: DollarSign,
      description: "Ghana Education Trust Fund scholarships"
    },
    {
      id: "gnpc",
      label: "GNPC",
      icon: Briefcase,
      description: "GNPC Foundation scholarships"
    },
    {
      id: "mtn",
      label: "MTN",
      icon: Smartphone,
      description: "MTN Ghana Foundation scholarships"
    },
    {
      id: "other-local",
      label: "Other Local",
      icon: Globe,
      description: "Ghana Scholarships Secretariat and other local scholarships"
    }
  ];

  const isolatedStyles = `
    #ash-wrapper {
      width: 100%;
      padding: 0;
      margin: 0;
      background: #f9fafb;
      min-height: 100vh;
    }

    /* Remove default content padding for this page */
    #admin-scope .content #ash-wrapper {
      margin: -20px;
      padding: 0;
    }

    #ash-header {
      padding: 2rem 2rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #ash-header-content {
      max-width: 1600px;
      margin: 0 auto;
    }

    #ash-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #ash-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    #ash-section-header {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #ash-section-header-content {
      max-width: 1600px;
      margin: 0 auto;
    }

    #ash-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    #ash-section-title-icon {
      color: #bd9f67;
    }

    #ash-tabs-container {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 2rem;
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
      position: sticky;
      top: -20px; /* Account for content area padding */
      margin-top: 0;
      margin-left: -20px;
      margin-right: -20px;
      padding-left: calc(20px + 2rem);
      padding-right: calc(20px + 2rem);
      z-index: 50;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    /* When sticky, ensure it's right at the top */
    #ash-tabs-container.sticky-active {
      top: -20px;
      margin-top: 0;
    }

    #ash-tabs-container::-webkit-scrollbar {
      height: 6px;
    }

    #ash-tabs-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    #ash-tabs-container::-webkit-scrollbar-thumb {
      background: #bd9f67;
      border-radius: 3px;
    }

    #ash-tabs-container::-webkit-scrollbar-thumb:hover {
      background: #a88a59;
    }

    .ash-tab {
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      color: #6b7280;
      transition: all 0.2s;
      position: relative;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 3px solid transparent;
    }

    .ash-tab:hover {
      color: #111827;
      background: #f9fafb;
    }

    .ash-tab-icon {
      display: flex;
      align-items: center;
      justify-center;
    }

    .ash-tab-active {
      color: #bd9f67;
      border-bottom-color: #bd9f67;
    }

    .ash-tab-active:hover {
      color: #a88a59;
      background: transparent;
    }

    #ash-tabs-spacer {
      height: 0;
      transition: height 0.2s ease;
      background-color: #f9fafb;
      margin: 0;
    }
    
    #ash-content {
      padding: 2rem;
      background-color: #f9fafb;
      margin: 0;
      padding-top: 2rem;
    }

    #ash-content-wrapper {
      max-width: 1600px;
      margin: 0 auto;
    }

    .ash-tab-content {
      display: none;
    }

    .ash-tab-content-active {
      display: block;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Tablet */
    @media ${MEDIA_QUERIES.TABLET} {
      #ash-header {
        padding: 2rem 2rem 1.5rem;
      }

      #ash-section-header {
        padding: 1.5rem 2rem;
      }

      #ash-tabs-container {
        padding-left: calc(20px + 2rem);
        padding-right: calc(20px + 2rem);
      }

      #ash-content {
        padding: 2rem;
      }
    }

    /* Desktop */
    @media ${MEDIA_QUERIES.DESKTOP} {
      #ash-header {
        padding: 2.25rem 3rem 1.75rem;
      }

      #ash-title {
        font-size: 2rem;
      }

      #ash-section-header {
        padding: 1.5rem 3rem;
      }

      #ash-tabs-container {
        padding-left: calc(20px + 3rem);
        padding-right: calc(20px + 3rem);
      }

      #ash-content {
        padding: 2.5rem 3rem;
      }
    }

    /* Large Desktop */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      #ash-header {
        padding: 2.5rem clamp(2rem, 5vw, 4rem) 2rem;
      }

      #ash-title {
        font-size: 2.25rem;
      }

      #ash-section-header {
        padding: 1.5rem clamp(2rem, 5vw, 4rem);
      }

      #ash-tabs-container {
        padding-left: calc(20px + clamp(2rem, 5vw, 4rem));
        padding-right: calc(20px + clamp(2rem, 5vw, 4rem));
      }

      #ash-content {
        padding: clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  const renderTabContent = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return null;

    // Filter scholarships based on the active tab
    const sourceFilter = tabId === "all-scholarships" ? null : tabId;

    return <ScholarshipsManager sourceFilter={sourceFilter} />;
  };

  return (
    <>
      <style>{isolatedStyles}</style>
      <div id="ash-wrapper">
        
        <div id="ash-header">
          <div id="ash-header-content">
            <h1 id="ash-title">
              <Award size={32} />
              <span>Scholarship Management</span>
            </h1>
            <p id="ash-subtitle">
              Manage all scholarships across all sources and categories
            </p>
          </div>
        </div>

        <div id="ash-section-header">
          <div id="ash-section-header-content">
            <h2 id="ash-section-title">
              <Award id="ash-section-title-icon" size={24} />
              <span>Scholarship Bank</span>
            </h2>
          </div>
        </div>
        
        <div id="ash-tabs-container" ref={tabsContainerRef}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`ash-tab ${activeTab === tab.id ? "ash-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="ash-tab-icon">
                  <IconComponent size={16} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div id="ash-tabs-spacer" ref={spacerRef}></div>
        
        <div id="ash-content">
          <div id="ash-content-wrapper">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`ash-tab-content ${activeTab === tab.id ? "ash-tab-content-active" : ""}`}
              >
                {renderTabContent(tab.id)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminScholarshipHub;

