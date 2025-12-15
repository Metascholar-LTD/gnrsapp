import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Building2, GraduationCap, UtensilsCrossed, Hospital, Landmark, ShoppingBag, MapPin, Database, School } from "lucide-react";

export const DirectoriesSummary = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Consistent light blue theme color for all icons
  const iconColor = "#3B82F6"; // Blue-500
  const iconBgColor = "rgba(59, 130, 246, 0.15)"; // Light blue background

  const directoryCards = [
    {
      id: 1,
      logo: "Hotels",
      logoColor: "#E91E63",
      title: "Hotels",
      description: "Find the perfect accommodation for your stay in Ghana. Browse through verified hotels with detailed information, ratings, and reviews from real guests.",
      rating: 5,
      icon: Building2,
      link: "/directories/hotels",
      color: "#E91E63"
    },
    {
      id: 2,
      logo: "Universities",
      logoColor: "#E50914",
      title: "Universities",
      description: "Explore Ghana's top universities and tertiary institutions. Get comprehensive information about programs, facilities, and admission requirements.",
      rating: 5,
      icon: GraduationCap,
      link: "/directories/universities",
      color: "#E50914"
    },
    {
      id: 3,
      logo: "Restaurants",
      logoColor: "#0052FF",
      title: "Restaurants",
      description: "Discover the best dining experiences across Ghana. From local favorites to international cuisine, find restaurants with authentic reviews and ratings.",
      rating: 4,
      icon: UtensilsCrossed,
      link: "/directories/restaurants",
      color: "#0052FF"
    },
    {
      id: 4,
      logo: "Hospitals",
      logoColor: "#10B981",
      title: "Hospitals",
      description: "Access comprehensive information about healthcare facilities in Ghana. Find hospitals, clinics, and medical centers with contact details and specialties.",
      rating: 5,
      icon: Hospital,
      link: "/directories/hospitals",
      color: "#10B981"
    },
    {
      id: 5,
      logo: "Banks",
      logoColor: "#8B5CF6",
      title: "Banks",
      description: "Locate banks and financial institutions across Ghana. Get branch locations, services offered, and contact information for all major banks.",
      rating: 5,
      icon: Landmark,
      link: "/directories/banks",
      color: "#8B5CF6"
    },
    {
      id: 6,
      logo: "Shopping Malls",
      logoColor: "#F59E0B",
      title: "Shopping Malls",
      description: "Explore shopping destinations in Ghana. Find malls, markets, and retail centers with store directories and location information.",
      rating: 4,
      icon: ShoppingBag,
      link: "/directories/malls",
      color: "#F59E0B"
    }
  ];

  const companyLogos = [
    { name: "Hotels", link: "/directories/hotels" },
    { name: "Universities", link: "/directories/universities" },
    { name: "Restaurants", link: "/directories/restaurants" },
    { name: "Hospitals", link: "/directories/hospitals" },
    { name: "Banks", link: "/directories/banks" }
  ];

  const visibleCards = directoryCards.slice(currentIndex, currentIndex + 3);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < directoryCards.length - 3;

  const nextCards = () => {
    if (canGoRight) {
      setCurrentIndex(prev => Math.min(prev + 1, directoryCards.length - 3));
    }
  };

  const prevCards = () => {
    if (canGoLeft) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <section 
      className="py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
        backgroundColor: '#FAFAFA',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}
    >
      <style>{`
        #ds-section-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        #ds-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(15px, 5vw, 80px);
        }

        #ds-content-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 4rem;
        }

        @media (min-width: 992px) {
          #ds-content-wrapper {
            grid-template-columns: 1fr 2fr;
            gap: 4rem;
          }
        }

        #ds-left-panel {
          background-color: #F5F5F5;
          padding: 2rem;
          border-radius: 12px;
        }

        #ds-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 20px;
          background-color: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 30px;
          color: #8B5CF6;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        #ds-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2C2C2C;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin-bottom: 1rem;
          font-family: 'Playfair Display', serif;
          position: relative;
        }

        #ds-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #F472B6, #EC4899);
          border-radius: 2px;
        }

        @media (min-width: 768px) {
          #ds-title {
            font-size: 3rem;
          }
        }

        #ds-description {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(44, 44, 44, 0.85);
          margin-bottom: 2rem;
        }

        #ds-navigation {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .ds-nav-button {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          background-color: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #8B5CF6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ds-nav-button:hover:not(.ds-nav-button-disabled) {
          background-color: #8B5CF6;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .ds-nav-button-disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        #ds-cards-container {
          display: flex;
          gap: 1.5rem;
          overflow: hidden;
          position: relative;
        }

        .ds-card {
          min-width: calc(33.333% - 1rem);
          background-color: #ffffff;
          border-radius: 12px;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
        }

        .ds-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .ds-card-logo {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ds-card-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: rgba(44, 44, 44, 0.75);
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .ds-card-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: auto;
        }

        .ds-card-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ds-card-info {
          flex: 1;
        }

        .ds-card-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #2C2C2C;
          margin: 0 0 2px 0;
        }

        .ds-card-title {
          font-size: 0.8125rem;
          color: rgba(44, 44, 44, 0.65);
          margin: 0;
        }

        #ds-companies-section {
          border-top: 1px solid #E5E7EB;
          padding-top: 2.5rem;
          margin-top: 2.5rem;
          background-color: #F9F9F9;
          padding: 2.5rem 2rem;
          border-radius: 12px;
        }

        #ds-companies-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(44, 44, 44, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        #ds-companies-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .ds-company-logo {
          font-size: 0.9375rem;
          font-weight: 600;
          color: rgba(44, 44, 44, 0.75);
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ds-company-logo:hover {
          color: #8B5CF6;
          background-color: rgba(139, 92, 246, 0.1);
        }

        @media (max-width: 991px) {
          #ds-cards-container {
            flex-direction: column;
          }

          .ds-card {
            min-width: 100%;
          }

          #ds-navigation {
            justify-content: center;
            margin-top: 1rem;
          }
        }
      `}</style>

      <div id="ds-section-wrapper">
        <div id="ds-container">
          <div id="ds-content-wrapper">
            {/* Left Panel */}
            <motion.div
              id="ds-left-panel"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span id="ds-badge">
                Ghana Directories
              </span>
              
              <h1 id="ds-title">
                What we offer
              </h1>
              
              <p id="ds-description">
                Discover everything Ghana has to offer. Browse comprehensive directories of hotels, universities, restaurants, hospitals, banks, and more. All organized and easy to find.
              </p>

              {/* Navigation Buttons */}
              <div id="ds-navigation">
                <button
                  className={`ds-nav-button ${!canGoLeft ? 'ds-nav-button-disabled' : ''}`}
                  onClick={prevCards}
                  disabled={!canGoLeft}
                  aria-label="Previous directories"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className={`ds-nav-button ${!canGoRight ? 'ds-nav-button-disabled' : ''}`}
                  onClick={nextCards}
                  disabled={!canGoRight}
                  aria-label="Next directories"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>

            {/* Right Panel - Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div id="ds-cards-container">
                {visibleCards.map((card) => {
                  const IconComponent = card.icon;
                  return (
                    <Link
                      key={card.id}
                      to={card.link}
                      className="ds-card"
                    >
                      <div className="ds-card-logo" style={{ color: '#000000' }}>
                        {card.logo}
                      </div>
                      <p className="ds-card-description">
                        {card.description}
                      </p>
                      <div className="ds-card-footer">
                        <div 
                          className="ds-card-icon-wrapper"
                          style={{ backgroundColor: iconBgColor }}
                        >
                          <IconComponent size={20} style={{ color: iconColor }} />
                        </div>
                        <div className="ds-card-info">
                          <p className="ds-card-name">{card.title}</p>
                          <p className="ds-card-title">Directory Category</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Companies Section */}
          <motion.div
            id="ds-companies-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p id="ds-companies-title">Explore All Directories</p>
            <div id="ds-companies-logos">
              {companyLogos.map((company, index) => (
                <Link
                  key={index}
                  to={company.link}
                  className="ds-company-logo"
                >
                  {company.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

