import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Building2, 
  GraduationCap, 
  School, 
  UtensilsCrossed, 
  Hospital, 
  Landmark, 
  ShoppingBag, 
  MapPin 
} from 'lucide-react';

const Directories: React.FC = () => {
  const directoryItems = [
    { 
      label: 'Datasets', 
      icon: Database, 
      link: '/directories/datasets',
      color: '#3B82F6'
    },
    { 
      label: 'Hotels', 
      icon: Building2, 
      link: '/directories/hotels',
      color: '#8B5CF6'
    },
    { 
      label: 'Universities', 
      icon: GraduationCap, 
      link: '/directories/universities',
      color: '#10B981'
    },
    { 
      label: 'Senior High Schools', 
      icon: School, 
      link: '/directories/shs',
      color: '#F59E0B'
    },
    { 
      label: 'Restaurants', 
      icon: UtensilsCrossed, 
      link: '/directories/restaurants',
      color: '#EF4444'
    },
    { 
      label: 'Hospitals', 
      icon: Hospital, 
      link: '/directories/hospitals',
      color: '#EC4899'
    },
    { 
      label: 'Banks', 
      icon: Landmark, 
      link: '/directories/banks',
      color: '#06B6D4'
    },
    { 
      label: 'Shopping Malls', 
      icon: ShoppingBag, 
      link: '/directories/malls',
      color: '#6366F1'
    },
    { 
      label: 'Tourist Sites', 
      icon: MapPin, 
      link: '/directories/tourist-sites',
      color: '#14B8A6'
    },
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

    .directories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .directory-box {
      background: white;
      border: 1px solid hsl(220 13% 91%);
      border-radius: 0.75rem;
      padding: 1.75rem 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      position: relative;
      overflow: hidden;
    }

    .directory-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.2s ease;
    }

    .directory-box:hover {
      border-color: currentColor;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .directory-box:hover::before {
      transform: scaleX(1);
    }

    .directory-box-icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      background: currentColor;
      color: white;
      transition: transform 0.2s ease;
    }

    .directory-box:hover .directory-box-icon {
      transform: scale(1.1);
    }

    .directory-box-label {
      font-size: 1rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      text-align: center;
      margin: 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .directory-box:hover .directory-box-label {
      color: currentColor;
    }

    .directory-box-number {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: currentColor;
      opacity: 0.4;
      transition: opacity 0.2s ease;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      pointer-events: none;
      user-select: none;
    }

    .directory-box:hover .directory-box-number {
      opacity: 1;
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

      .directories-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .directory-box {
        padding: 1.5rem 1rem;
      }

      .directory-box-icon {
        width: 2rem;
        height: 2rem;
      }

      .directory-box-label {
        font-size: 0.875rem;
      }

      .directory-box-number {
        top: 0.75rem;
        right: 0.75rem;
        font-size: 0.75rem;
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

      .directories-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.25rem;
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
        <div className="directories-main-content">
          <div className="directories-header">
            <h1 className="directories-title">Ghana Directories</h1>
            <p className="directories-subtitle">
              Discover everything Ghana has to offer. Browse hotels, universities, restaurants, 
              hospitals, banks, shopping malls, tourist sites, and more. All organized and easy to find.
            </p>
          </div>

          <div className="directories-grid">
            {directoryItems.map((item, index) => {
              const Icon = item.icon;
              const number = String(index + 1).padStart(2, '0');
              return (
                <Link
                  key={item.label}
                  to={item.link}
                  className="directory-box"
                  style={{ color: item.color }}
                  aria-label={item.label}
                >
                  <span className="directory-box-number">{number}</span>
                  <div className="directory-box-icon">
                    <Icon size={20} />
                  </div>
                  <p className="directory-box-label">{item.label}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Directories;

