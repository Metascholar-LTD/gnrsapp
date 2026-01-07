import { useState, useEffect, useRef } from "react";
import { MEDIA_QUERIES } from "@/lib/breakpoints";
import { 
  Briefcase,
  Search,
  UserCheck,
  GraduationCap,
  Users,
  Building2,
  CheckCircle2,
  FileText
} from "lucide-react";
import VerifiedJobListingsManager from "./components/VerifiedJobListingsManager";
import InternshipListingsManager from "./components/InternshipListingsManager";
import NationalServiceSupportManager from "./components/NationalServiceSupportManager";
import GraduateRecruitmentManager from "./components/GraduateRecruitmentManager";
import YouthEmploymentAgencyManager from "./components/YouthEmploymentAgencyManager";

const AdminJobsHub = () => {
  const [activeTab, setActiveTab] = useState("verified-jobs");
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
      id: "verified-jobs",
      label: "Verified Job Listings",
      icon: CheckCircle2,
      description: "Manage verified and featured job listings"
    },
    {
      id: "internships",
      label: "Internship Listings",
      icon: FileText,
      description: "Manage internship opportunities"
    },
    {
      id: "nss",
      label: "National Service Support",
      icon: UserCheck,
      description: "Manage NSS programs and placements"
    },
    {
      id: "graduate-recruitment",
      label: "Graduate Recruitment",
      icon: GraduationCap,
      description: "Manage graduate recruitment programs"
    },
    {
      id: "yea",
      label: "Youth Employment Agency",
      icon: Users,
      description: "Manage YEA employment programs"
    }
  ];

  const isolatedStyles = `
    #ajh-wrapper {
      width: 100%;
      padding: 0;
      margin: 0;
      background: #f9fafb;
      min-height: 100vh;
    }

    /* Remove default content padding for this page */
    #admin-scope .content #ajh-wrapper {
      margin: -20px;
      padding: 0;
    }

    #ajh-header {
      padding: 2rem 2rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #ajh-header-content {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    #ajh-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #ajh-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    #ajh-section-header {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      margin: 0;
    }

    #ajh-section-header-content {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    #ajh-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    #ajh-section-title-icon {
      color: #bd9f67;
    }

    #ajh-tabs-container {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 2rem;
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
      position: sticky;
      top: -20px;
      margin-top: 0;
      margin-left: -20px;
      margin-right: -20px;
      padding-left: calc(20px + 2rem);
      padding-right: calc(20px + 2rem);
      z-index: 50;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      gap: 0.25rem;
    }
    
    #ajh-tabs-container.sticky-active {
      top: -20px;
      margin-top: 0;
    }

    #ajh-tabs-container::-webkit-scrollbar {
      height: 6px;
    }

    #ajh-tabs-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    #ajh-tabs-container::-webkit-scrollbar-thumb {
      background: #bd9f67;
      border-radius: 3px;
    }

    #ajh-tabs-container::-webkit-scrollbar-thumb:hover {
      background: #a88a59;
    }

    .ajh-tab {
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.8125rem;
      color: #6b7280;
      transition: all 0.2s;
      position: relative;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      border-bottom: 2px solid transparent;
      flex-shrink: 0;
    }

    .ajh-tab:hover {
      color: #111827;
      background: #f9fafb;
    }

    .ajh-tab-icon {
      display: flex;
      align-items: center;
      justify-center;
    }

    .ajh-tab-active {
      color: #bd9f67;
      border-bottom-color: #bd9f67;
    }

    .ajh-tab-active:hover {
      color: #a88a59;
      background: transparent;
    }

    #ajh-tabs-spacer {
      height: 0;
      transition: height 0.2s ease;
      background-color: #f9fafb;
      margin: 0;
    }
    
    #ajh-content {
      padding: 2rem;
      background-color: #f9fafb;
      margin: 0;
      padding-top: 2rem;
    }

    #ajh-content-wrapper {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }

    .ajh-tab-content {
      display: none;
    }

    .ajh-tab-content-active {
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
      #ajh-header {
        padding: 2rem 2rem 1.5rem;
      }

      #ajh-section-header {
        padding: 1.5rem 2rem;
      }

      #ajh-tabs-container {
        padding-left: calc(20px + 2rem);
        padding-right: calc(20px + 2rem);
      }

      #ajh-content {
        padding: 2rem;
      }
    }

    /* Desktop */
    @media ${MEDIA_QUERIES.DESKTOP} {
      #ajh-header {
        padding: 2.25rem 3rem 1.75rem;
      }

      #ajh-title {
        font-size: 2rem;
      }

      #ajh-section-header {
        padding: 1.5rem 3rem;
      }

      #ajh-tabs-container {
        padding-left: calc(20px + 3rem);
        padding-right: calc(20px + 3rem);
      }

      #ajh-content {
        padding: 2.5rem 3rem;
      }
    }

    /* Large Desktop */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      #ajh-header {
        padding: 2.5rem clamp(2rem, 5vw, 4rem) 2rem;
      }

      #ajh-title {
        font-size: 2.25rem;
      }

      #ajh-section-header {
        padding: 1.5rem clamp(2rem, 5vw, 4rem);
      }

      #ajh-tabs-container {
        padding-left: calc(20px + clamp(2rem, 5vw, 4rem));
        padding-right: calc(20px + clamp(2rem, 5vw, 4rem));
      }

      #ajh-content {
        padding: clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case "verified-jobs":
        return <VerifiedJobListingsManager />;
      case "internships":
        return <InternshipListingsManager />;
      case "nss":
        return <NationalServiceSupportManager />;
      case "graduate-recruitment":
        return <GraduateRecruitmentManager />;
      case "yea":
        return <YouthEmploymentAgencyManager />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{isolatedStyles}</style>
      <div id="ajh-wrapper">
        
        <div id="ajh-header">
          <div id="ajh-header-content">
            <h1 id="ajh-title">
              <Briefcase size={32} />
              <span>Career & Employment Management</span>
            </h1>
            <p id="ajh-subtitle">
              Manage all job listings, internships, and employment programs across the platform
            </p>
          </div>
        </div>

        <div id="ajh-section-header">
          <div id="ajh-section-header-content">
            <h2 id="ajh-section-title">
              <Briefcase id="ajh-section-title-icon" size={24} />
              <span>Job Portal</span>
            </h2>
          </div>
        </div>
        
        <div id="ajh-tabs-container" ref={tabsContainerRef}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`ajh-tab ${activeTab === tab.id ? "ajh-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="ajh-tab-icon">
                  <IconComponent size={14} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div id="ajh-tabs-spacer" ref={spacerRef}></div>
        
        <div id="ajh-content">
          <div id="ajh-content-wrapper">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`ajh-tab-content ${activeTab === tab.id ? "ajh-tab-content-active" : ""}`}
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

export default AdminJobsHub;

