import { useState, useEffect } from "react";
import feather from "feather-icons";
import { BREAKPOINTS, MEDIA_QUERIES } from "@/lib/breakpoints";
import CarouselManager from "./components/CarouselManager";
import AboutManager from "./components/AboutManager";
import ServicesManager from "./components/ServicesManager";
import WhyChooseUsManager from "./components/WhyChooseUsManager";

const AdminHomePage = () => {
  const [activeTab, setActiveTab] = useState("carousel");

  useEffect(() => {
    // Replace feather icons after render using safe replacement
    const timer = setTimeout(() => {
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
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = [
    { id: "carousel", label: "Carousel", icon: "image" },
    { id: "about", label: "About Section", icon: "info" },
    { id: "services", label: "Services", icon: "briefcase" },
    { id: "why-choose-us", label: "Why Choose Us", icon: "star" },
    { id: "gallery", label: "Image Gallery", icon: "image" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "faqs", label: "FAQs", icon: "help-circle" },
  ];

  const isolatedStyles = `
    #ahp-wrapper {
      width: 100%;
      padding: 0;
      background-color: #ffffff;
      min-height: 100vh;
    }

    #ahp-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      background-color: #ffffff;
    }

    #ahp-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    #ahp-tabs-container {
      border-bottom: 1px solid #e5e7eb;
      background-color: #ffffff;
      padding: 0 2rem;
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    #ahp-tabs-container::-webkit-scrollbar {
      height: 4px;
    }

    #ahp-tabs-container::-webkit-scrollbar-track {
      background: #f3f4f6;
    }

    #ahp-tabs-container::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 2px;
    }

    .ahp-tab {
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
    }

    .ahp-tab:hover {
      color: #374151;
      background-color: #f9fafb;
    }

    .ahp-tab-active {
      color: #2563eb;
      border-bottom-color: #2563eb;
    }

    .ahp-tab-icon {
      width: 16px;
      height: 16px;
      display: inline-block;
    }

    #ahp-content {
      padding: 2rem;
    }

    .ahp-tab-content {
      display: none;
    }

    .ahp-tab-content-active {
      display: block;
    }

    .ahp-section-card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .ahp-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1rem 0;
    }

    .ahp-placeholder {
      color: #6b7280;
      font-size: 0.875rem;
      padding: 2rem;
      text-align: center;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      border: 2px dashed #d1d5db;
    }

    /* Mobile: 0px - 767px */
    @media ${MEDIA_QUERIES.MOBILE} {
      #ahp-header {
        padding: 1rem;
      }

      #ahp-title {
        font-size: 1.25rem;
      }

      #ahp-tabs-container {
        padding: 0 1rem;
      }

      .ahp-tab {
        padding: 0.75rem 1rem;
        font-size: 0.8125rem;
      }

      #ahp-content {
        padding: 1rem;
      }

      .ahp-section-card {
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .ahp-section-title {
        font-size: 1rem;
      }

      .ahp-placeholder {
        padding: 1.5rem;
        font-size: 0.8125rem;
      }
    }

    /* Tablet: 768px - 1199px */
    @media ${MEDIA_QUERIES.TABLET} {
      #ahp-header {
        padding: 1.25rem 1.5rem;
      }

      #ahp-title {
        font-size: 1.375rem;
      }

      #ahp-tabs-container {
        padding: 0 1.5rem;
      }

      .ahp-tab {
        padding: 0.875rem 1.25rem;
        font-size: 0.84375rem;
      }

      #ahp-content {
        padding: 1.5rem;
      }

      .ahp-section-card {
        padding: 1.25rem;
        margin-bottom: 1.25rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media ${MEDIA_QUERIES.DESKTOP} {
      #ahp-header {
        padding: 1.5rem 1.5rem;
      }

      #ahp-title {
        font-size: 1.5rem;
      }

      #ahp-tabs-container {
        padding: 0 1.5rem;
      }

      .ahp-tab {
        padding: 1rem 1.25rem;
        font-size: 0.875rem;
      }

      #ahp-content {
        padding: 1.5rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      #ahp-header {
        padding: 1.5rem clamp(2rem, 4vw, 3rem);
      }

      #ahp-tabs-container {
        padding: 0 clamp(2rem, 4vw, 3rem);
      }

      #ahp-content {
        padding: clamp(2rem, 4vw, 3rem);
      }

      .ahp-section-card {
        padding: 1.5rem;
      }
    }
  `;

  const renderTabContent = (tabId: string) => {
    const contentMap: Record<string, JSX.Element> = {
      carousel: (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">Carousel Management</h3>
          <CarouselManager />
        </div>
      ),
      about: (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">About Section</h3>
          <AboutManager />
        </div>
      ),
      services: (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">Services Section</h3>
          <ServicesManager />
        </div>
      ),
      "why-choose-us": (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">Why Choose Us</h3>
          <WhyChooseUsManager />
        </div>
      ),
      gallery: (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">Image Gallery</h3>
          <div className="ahp-placeholder">
            Image gallery management will be implemented here.
            <br />
            Upload, organize, and manage images displayed in the gallery.
          </div>
        </div>
      ),
      projects: (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">Projects</h3>
          <div className="ahp-placeholder">
            Projects management will be implemented here.
            <br />
            Add, edit, and manage projects displayed on the homepage.
          </div>
        </div>
      ),
      faqs: (
        <div className="ahp-section-card">
          <h3 className="ahp-section-title">FAQs</h3>
          <div className="ahp-placeholder">
            FAQs management will be implemented here.
            <br />
            Add, edit, and reorder frequently asked questions.
          </div>
        </div>
      ),
    };

    return contentMap[tabId] || <div className="ahp-placeholder">Content not found</div>;
  };

  return (
    <div id="ahp-wrapper">
      <style>{isolatedStyles}</style>
      <div id="ahp-header">
        <h1 id="ahp-title">Home Page Management</h1>
      </div>
      <div id="ahp-tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`ahp-tab ${activeTab === tab.id ? "ahp-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className="align-middle" data-feather={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div id="ahp-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`ahp-tab-content ${activeTab === tab.id ? "ahp-tab-content-active" : ""}`}
          >
            {renderTabContent(tab.id)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomePage;

