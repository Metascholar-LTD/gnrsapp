import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { StaggeredMenu } from '@/components/ui/StaggeredMenu';
import { Link } from 'react-router-dom';

const Directories: React.FC = () => {
  const menuItems = [
    { label: 'Datasets', ariaLabel: 'Browse datasets', link: '/directories/datasets' },
    { label: 'Hotels', ariaLabel: 'Browse hotels in Ghana', link: '/directories/hotels' },
    { label: 'Universities', ariaLabel: 'Browse tertiary universities', link: '/directories/universities' },
    { label: 'Senior High Schools', ariaLabel: 'Browse SHS schools', link: '/directories/shs' },
    { label: 'Restaurants', ariaLabel: 'Browse restaurants', link: '/directories/restaurants' },
    { label: 'Hospitals', ariaLabel: 'Browse hospitals', link: '/directories/hospitals' },
    { label: 'Banks', ariaLabel: 'Browse banks', link: '/directories/banks' },
    { label: 'Shopping Malls', ariaLabel: 'Browse shopping malls', link: '/directories/malls' },
    { label: 'Tourist Sites', ariaLabel: 'Browse tourist attractions', link: '/directories/tourist-sites' },
  ];

  const socialItems = [
    { label: 'Facebook', link: 'https://facebook.com' },
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'Instagram', link: 'https://instagram.com' },
  ];

  const isolatedStyles = `
    .directories-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
      position: relative;
    }

    .directories-content-wrapper {
      position: relative;
      width: 100%;
      min-height: calc(100vh - 80px);
    }

    .directories-main-content {
      width: 100%;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .directories-header {
      margin-bottom: 3rem;
    }

    .directories-title {
      font-size: 3rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .directories-subtitle {
      font-size: 1.25rem;
      color: hsl(220 20% 40%);
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .directories-preview-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-top: 2rem;
    }

    .directories-preview-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .directories-preview-text {
      font-size: 1rem;
      color: hsl(220 20% 40%);
      line-height: 1.6;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .directories-content-wrapper {
        padding-top: 60px;
      }

      .directories-main-content {
        padding: 1rem;
      }

      .directories-title {
        font-size: 2rem;
      }

      .directories-subtitle {
        font-size: 1.125rem;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .directories-content-wrapper {
        padding-top: 70px;
      }

      .directories-main-content {
        padding: 1.5rem;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .directories-content-wrapper {
        padding-top: 120px;
      }

      .directories-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .directories-content-wrapper {
        padding-top: 120px;
      }

      .directories-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  return (
    <div className="directories-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="directories-content-wrapper">
        <StaggeredMenu
          position="left"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#2563eb"
          openMenuButtonColor="#1d4ed8"
          changeMenuColorOnOpen={true}
          colors={['#2563eb', '#1d4ed8']}
          accentColor="#2563eb"
          isFixed={false}
          closeOnClickAway={true}
        />
        
        <div className="directories-main-content">
          <div className="directories-header">
            <h1 className="directories-title">Ghana Directories</h1>
            <p className="directories-subtitle">
              Discover everything Ghana has to offer. Browse hotels, universities, restaurants, 
              hospitals, banks, shopping malls, tourist sites, and more. All organized and easy to find.
            </p>
          </div>

          <div className="directories-preview-section">
            <h2 className="directories-preview-title">Welcome to Ghana Directories</h2>
            <p className="directories-preview-text">
              This page will house comprehensive directories of various establishments and locations across Ghana. 
              Use the menu button in the top right corner to explore different categories. More content will be 
              added soon including detailed listings, locations, contact information, and more.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Directories;

