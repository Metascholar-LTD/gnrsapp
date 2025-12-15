import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Database, BarChart3, Building2, GraduationCap, DollarSign, ArrowRight } from "lucide-react";

export const DatasetSummary = () => {
  // Icon colors
  const iconColor = "#000000"; // Black icons
  const iconBgColor = "rgba(6, 182, 212, 0.15)"; // Light cyan background

  const datasetCards = [
    {
      id: 1,
      title: "Government",
      description: "Access comprehensive government datasets including census data, economic indicators, and public sector statistics.",
      icon: Building2,
      link: "/directories/datasets/government",
      stats: "50+ Datasets",
      downloads: "125K+"
    },
    {
      id: 2,
      title: "Finance",
      description: "Explore financial datasets covering economic indicators, banking statistics, and market data for research and analysis.",
      icon: DollarSign,
      link: "/directories/datasets/finance",
      stats: "35+ Datasets",
      downloads: "89K+"
    },
    {
      id: 3,
      title: "Health",
      description: "Discover healthcare datasets including facility information, health statistics, and medical research data.",
      icon: BarChart3,
      link: "/directories/datasets/health",
      stats: "42+ Datasets",
      downloads: "156K+"
    },
    {
      id: 4,
      title: "Education",
      description: "Browse educational datasets covering enrollment statistics, academic performance, and institutional data.",
      icon: GraduationCap,
      link: "/directories/datasets/education",
      stats: "38+ Datasets",
      downloads: "98K+"
    }
  ];


  return (
    <section 
      className="py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
        backgroundColor: '#F5F5F5',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '3rem',
        paddingBottom: '3rem'
      }}
    >
      <style>{`
        #dss-section-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        #dss-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(15px, 5vw, 80px);
        }

        #dss-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        #dss-badge {
          display: inline-flex;
          align-items: center;
          padding: 10px 24px;
          background-color: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: 30px;
          color: #000000;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        #dss-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
          letter-spacing: -1px;
          margin-bottom: 0.75rem;
          font-family: 'Playfair Display', serif;
        }

        @media (min-width: 768px) {
          #dss-title {
            font-size: 2.75rem;
          }
        }

        #dss-description {
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(15, 23, 42, 0.7);
          max-width: 700px;
          margin: 0 auto 2rem;
        }

        #dss-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          #dss-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          #dss-cards-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }

        .dss-card {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .dss-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .dss-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .dss-card-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(6, 182, 212, 0.12);
        }

        .dss-card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 0.75rem 0;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        .dss-card-description {
          font-size: 0.8125rem;
          line-height: 1.6;
          color: rgba(15, 23, 42, 0.65);
          margin-bottom: 1rem;
          flex: 1;
        }

        .dss-card-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .dss-stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .dss-stat-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #000000;
        }

        .dss-stat-label {
          font-size: 0.6875rem;
          color: rgba(15, 23, 42, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dss-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .dss-card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: #000000;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .dss-card-link:hover {
          gap: 0.5rem;
          color: #000000;
        }

        #dss-button-section {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
        }

        .dss-view-all-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background-color: #000000;
          color: #FFFFFF;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 2px solid #000000;
        }

        .dss-view-all-button:hover {
          background-color: #FFFFFF;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div id="dss-section-wrapper">
        <div id="dss-container">
          {/* Header Section */}
          <motion.div
            id="dss-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span id="dss-badge">
              <Database size={16} style={{ marginRight: '8px' }} />
              Discover datasets
            </span>
            
            <p id="dss-description">
              Access a comprehensive collection of datasets covering government, finance, health, education, technology, and more. All datasets are verified, regularly updated, and ready for analysis.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            id="dss-cards-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {datasetCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Link
                    to={card.link}
                    className="dss-card"
                  >
                    <div className="dss-card-header">
                      <div 
                        className="dss-card-icon-wrapper"
                        style={{ backgroundColor: iconBgColor }}
                      >
                        <IconComponent size={20} style={{ color: iconColor }} />
                      </div>
                    </div>
                    <h3 className="dss-card-title">{card.title}</h3>
                    <p className="dss-card-description">
                      {card.description}
                    </p>
                    <div className="dss-card-stats">
                      <div className="dss-stat-item">
                        <span className="dss-stat-value">{card.stats}</span>
                        <span className="dss-stat-label">Available</span>
                      </div>
                      <div className="dss-stat-item">
                        <span className="dss-stat-value">{card.downloads}</span>
                        <span className="dss-stat-label">Downloads</span>
                      </div>
                    </div>
                    <div className="dss-card-footer">
                      <span className="dss-card-link">
                        Explore Category
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View All Button */}
          <motion.div
            id="dss-button-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/directories/datasets"
              className="dss-view-all-button"
            >
              View All Datasets
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

