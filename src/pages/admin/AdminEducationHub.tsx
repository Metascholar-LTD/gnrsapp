import { useState, useEffect, useRef } from "react";
import feather from "feather-icons";
import { MEDIA_QUERIES } from "@/lib/breakpoints";
import { 
  GraduationCap, 
  School, 
  FileText, 
  Target, 
  BookMarked, 
  Book,
  BookOpen
} from "lucide-react";
import PastQuestionsManager from "./components/PastQuestionsManager";
import ShsBeceQuestionsManager from "./components/ShsBeceQuestionsManager";

const AdminEducationHub = () => {
  const [activeTab, setActiveTab] = useState("university-past-questions");
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

  useEffect(() => {
    // Replace feather icons after render
    const timer = setTimeout(() => {
      if (feather && feather.icons) {
        const elements = document.querySelectorAll('[data-feather]');
        elements.forEach((el) => {
          try {
            const iconName = el.getAttribute('data-feather');
            if (iconName && feather.icons[iconName]) {
              const svg = feather.icons[iconName].toSvg({
                width: '18',
                height: '18',
              });
              el.outerHTML = svg;
            }
          } catch (e) {
            // Skip invalid icons silently
          }
        });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Study Materials is a SECTION, not a tab
  // These are the tabs UNDER Study Materials
  const tabs = [
    { 
      id: "university-past-questions", 
      label: "University Past Questions", 
      icon: GraduationCap,
      description: "Manage university examination past papers and questions"
    },
    { 
      id: "shs-bece-past-questions", 
      label: "SHS and BECE Past Questions", 
      icon: School,
      description: "Manage Senior High School and BECE past papers"
    },
    { 
      id: "lecture-notes", 
      label: "Lecture Notes & E-learning", 
      icon: FileText,
      description: "Manage digital lecture notes and e-learning content"
    },
    { 
      id: "trial-questions", 
      label: "Trial Questions", 
      icon: Target,
      description: "Manage practice questions and mock exams"
    },
    { 
      id: "study-guides", 
      label: "Study Guides and Tutorials", 
      icon: BookMarked,
      description: "Manage comprehensive guides and tutorial materials"
    },
    { 
      id: "ebooks-training", 
      label: "E-books and Training Resources", 
      icon: Book,
      description: "Manage digital books and training materials"
    },
  ];

  const isolatedStyles = `
    #aeh-wrapper {
      width: 100%;
      padding: 0;
      margin: 0;
      background: #f5f5f5;
      min-height: 100vh;
    }

    #aeh-header {
      padding: 2rem 2rem 1.5rem;
      background: #000000;
      color: white;
      border-bottom: 3px solid #dc2626;
      margin: 0;
    }

    #aeh-header-content {
      max-width: 1600px;
      margin: 0 auto;
    }

    #aeh-title {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #aeh-subtitle {
      font-size: 1rem;
      color: #e5e5e5;
      margin: 0;
      font-weight: 400;
    }

    #aeh-section-header {
      background: #ffffff;
      border-bottom: 2px solid #e5e5e5;
      padding: 1.5rem 2rem;
      margin: 0;
    }

    #aeh-section-header-content {
      max-width: 1600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    #aeh-section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    #aeh-section-title-icon {
      color: #0066cc;
    }

    #aeh-tabs-container {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e5e5;
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
    #aeh-tabs-container.sticky-active {
      top: -20px;
      margin-top: 0;
    }

    #aeh-tabs-container::-webkit-scrollbar {
      height: 6px;
    }

    #aeh-tabs-container::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    #aeh-tabs-container::-webkit-scrollbar-thumb {
      background: #0066cc;
      border-radius: 3px;
    }

    #aeh-tabs-container::-webkit-scrollbar-thumb:hover {
      background: #0052a3;
    }

    .aeh-tab {
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
    }

    .aeh-tab:hover {
      color: #374151;
      background-color: #f9fafb;
    }

    .aeh-tab-active {
      color: #0066cc;
      border-bottom-color: #0066cc;
    }

    .aeh-tab-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .aeh-tab-active .aeh-tab-icon {
      color: #0066cc;
    }

    #aeh-tabs-spacer {
      height: 0;
      transition: height 0.2s ease;
      background-color: #f5f5f5;
      margin: 0;
    }
    
    #aeh-content {
      padding: 2rem;
      background-color: #f5f5f5;
      margin: 0;
      padding-top: 2rem;
    }
    
    /* Remove default content padding for this page */
    #admin-scope .content #aeh-wrapper {
      margin: -20px;
      padding: 0;
    }

    #aeh-content-wrapper {
      max-width: 1600px;
      margin: 0 auto;
    }

    .aeh-tab-content {
      display: none;
      animation: fadeIn 0.3s ease-in-out;
    }

    .aeh-tab-content-active {
      display: block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .aeh-section-card {
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 0.5rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }

    .aeh-section-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #0066cc;
    }

    .aeh-section-header-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e5e5e5;
    }

    .aeh-section-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0066cc;
      flex-shrink: 0;
    }

    .aeh-section-icon {
      width: 28px;
      height: 28px;
      color: white;
    }

    .aeh-section-title-card {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0;
    }

    .aeh-section-description {
      font-size: 0.9375rem;
      color: #64748b;
      margin: 0.5rem 0 0 0;
      line-height: 1.6;
    }

    .aeh-placeholder {
      text-align: center;
      padding: 4rem 2rem;
      background: #ffffff;
      border-radius: 0.5rem;
      border: 2px dashed #cbd5e1;
    }

    .aeh-placeholder-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      color: #0066cc;
      opacity: 0.6;
    }

    .aeh-placeholder-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000000;
      margin: 0 0 0.5rem 0;
    }

    .aeh-placeholder-text {
      font-size: 0.9375rem;
      color: #64748b;
      margin: 0;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    /* Mobile: 0px - 767px */
    @media ${MEDIA_QUERIES.MOBILE} {
      #aeh-header {
        padding: 1.5rem 1rem 1.25rem;
      }

      #aeh-title {
        font-size: 1.5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      #aeh-subtitle {
        font-size: 0.875rem;
      }

      #aeh-section-header {
        padding: 1rem;
      }

      #aeh-section-title {
        font-size: 1.125rem;
      }

      #aeh-tabs-container {
        padding: 0 1rem;
      }

      .aeh-tab {
        padding: 0.75rem 1rem;
        font-size: 0.8125rem;
      }

      .aeh-tab-icon {
        width: 16px;
        height: 16px;
      }

      #aeh-content {
        padding: 1rem;
      }

      .aeh-section-card {
        padding: 1.25rem;
        border-radius: 0.5rem;
      }

      .aeh-section-header-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .aeh-section-icon-wrapper {
        width: 48px;
        height: 48px;
      }

      .aeh-section-icon {
        width: 24px;
        height: 24px;
      }

      .aeh-section-title-card {
        font-size: 1.25rem;
      }

      .aeh-section-description {
        font-size: 0.875rem;
      }

      .aeh-placeholder {
        padding: 3rem 1.5rem;
      }

      .aeh-placeholder-icon {
        width: 64px;
        height: 64px;
      }

      .aeh-placeholder-title {
        font-size: 1.125rem;
      }

      .aeh-placeholder-text {
        font-size: 0.875rem;
      }
    }

    /* Tablet: 768px - 1199px */
    @media ${MEDIA_QUERIES.TABLET} {
      #aeh-header {
        padding: 1.75rem 1.5rem 1.5rem;
      }

      #aeh-title {
        font-size: 1.75rem;
      }

      #aeh-subtitle {
        font-size: 0.9375rem;
      }

      #aeh-section-header {
        padding: 1.25rem 1.5rem;
      }

      #aeh-tabs-container {
        padding: 0 1.5rem;
      }

      .aeh-tab {
        padding: 0.875rem 1.25rem;
        font-size: 0.84375rem;
      }

      #aeh-content {
        padding: 1.5rem;
      }

      .aeh-section-card {
        padding: 1.75rem;
      }

      .aeh-section-title-card {
        font-size: 1.375rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media ${MEDIA_QUERIES.DESKTOP} {
      #aeh-header {
        padding: 2rem 2rem 1.5rem;
      }

      #aeh-title {
        font-size: 2rem;
      }

      #aeh-section-header {
        padding: 1.5rem 2rem;
      }

      #aeh-tabs-container {
        padding: 0 2rem;
      }

      .aeh-tab {
        padding: 1rem 1.25rem;
        font-size: 0.875rem;
      }

      #aeh-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      #aeh-header {
        padding: 2.5rem clamp(2rem, 5vw, 4rem) 2rem;
      }

      #aeh-title {
        font-size: 2.25rem;
      }

      #aeh-section-header {
        padding: 1.5rem clamp(2rem, 5vw, 4rem);
      }

      #aeh-tabs-container {
        padding: 0 clamp(2rem, 5vw, 4rem);
      }

      #aeh-content {
        padding: clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  const renderTabContent = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return null;

    // Render PastQuestionsManager for university past questions
    if (tabId === "university-past-questions") {
      return <PastQuestionsManager />;
    }

    // Render ShsBeceQuestionsManager for SHS and BECE past questions
    if (tabId === "shs-bece-past-questions") {
      return <ShsBeceQuestionsManager />;
    }

    const IconComponent = tab.icon;

    return (
      <div className="aeh-section-card">
        <div className="aeh-section-header-card">
          <div className="aeh-section-icon-wrapper">
            <IconComponent className="aeh-section-icon" />
          </div>
          <div>
            <h3 className="aeh-section-title-card">{tab.label}</h3>
            <p className="aeh-section-description">{tab.description}</p>
          </div>
        </div>
        
        <div className="aeh-placeholder">
          <IconComponent className="aeh-placeholder-icon" />
          <h4 className="aeh-placeholder-title">Coming Soon</h4>
          <p className="aeh-placeholder-text">
            The management interface for <strong>{tab.label}</strong> will be available here. 
            This section will allow you to add, edit, and manage all related content.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div id="aeh-wrapper">
      <style>{isolatedStyles}</style>
      <div id="aeh-header">
        <div id="aeh-header-content">
          <h1 id="aeh-title">
            <BookOpen size={32} />
            <span>Education Hub Management</span>
          </h1>
          <p id="aeh-subtitle">
            Manage all educational resources, materials, and content across the platform
          </p>
        </div>
      </div>

      <div id="aeh-section-header">
        <div id="aeh-section-header-content">
          <h2 id="aeh-section-title">
            <BookOpen id="aeh-section-title-icon" size={24} />
            <span>Study Materials</span>
          </h2>
        </div>
      </div>
      
      <div id="aeh-tabs-container" ref={tabsContainerRef}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`aeh-tab ${activeTab === tab.id ? "aeh-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="aeh-tab-icon">
                <IconComponent size={16} />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div id="aeh-tabs-spacer" ref={spacerRef}></div>
      
      <div id="aeh-content">
        <div id="aeh-content-wrapper">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`aeh-tab-content ${activeTab === tab.id ? "aeh-tab-content-active" : ""}`}
            >
              {renderTabContent(tab.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEducationHub;
