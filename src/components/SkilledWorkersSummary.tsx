import { Link } from "react-router-dom";
import { Hammer, Sparkles, ArrowRight, Users, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

export const SkilledWorkersSummary = () => {
  return (
    <section 
      className="py-5 wow fadeIn" 
      data-wow-delay="0.1s"
      style={{
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        #sws-section-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        #sws-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(15px, 5vw, 80px);
        }

        #sws-content-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          #sws-content-wrapper {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }

        #sws-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 20px;
          background-color: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 30px;
          color: #2563eb;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        #sws-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2C2C2C;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin-bottom: 1.5rem;
          font-family: 'Playfair Display', serif;
        }

        @media (min-width: 768px) {
          #sws-title {
            font-size: 3rem;
          }
        }

        #sws-description {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(44, 44, 44, 0.85);
          margin-bottom: 2rem;
        }

        #sws-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sws-feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sws-feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: rgba(37, 99, 235, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(37, 99, 235, 0.2);
          flex-shrink: 0;
        }

        .sws-feature-text {
          flex: 1;
        }

        .sws-feature-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2C2C2C;
          margin-bottom: 4px;
        }

        .sws-feature-desc {
          font-size: 0.9rem;
          color: rgba(44, 44, 44, 0.7);
          margin: 0;
        }

        #sws-cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          #sws-cta-buttons {
            flex-direction: row;
            gap: 1rem;
          }
        }

        .sws-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background-color: #2563eb;
          color: #ffffff;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .sws-btn-primary:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
          color: #ffffff;
        }

        .sws-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background-color: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .sws-btn-secondary:hover {
          background-color: #eff6ff;
          color: #1d4ed8;
          border-color: #1d4ed8;
        }

        #sws-image-wrapper {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        #sws-image-wrapper::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.3));
          z-index: 1;
          pointer-events: none;
        }

        #sws-image-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        #sws-stats-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5));
          padding: 2rem;
          color: #ffffff;
          z-index: 2;
        }

        .sws-stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .sws-stat-item:last-child {
          margin-bottom: 0;
        }

        .sws-stat-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .sws-stat-text {
          font-size: 0.9rem;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div id="sws-section-wrapper">
        <div id="sws-container">
          <div id="sws-content-wrapper">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <span id="sws-badge">
                  <Sparkles size={16} className="me-2" />
                  Skilled Workers Directory
                </span>
                
                <div style={{ 
                  width: '100%', 
                  height: '1px', 
                  backgroundColor: 'rgba(44, 44, 44, 0.1)', 
                  marginBottom: '24px',
                  maxWidth: '200px'
                }}></div>

                <h1 id="sws-title">
                  Find Trusted Skilled Workers
                </h1>
                
                <p id="sws-description">
                  Connect with verified skilled workers and artisans across Ghana. From electricians and plumbers to chefs and designers, find the right professional for your project.
                </p>

                {/* Features */}
                <div id="sws-features">
                  <div className="sws-feature-item">
                    <div className="sws-feature-icon">
                      <CheckCircle size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <div className="sws-feature-text">
                      <div className="sws-feature-title">Verified Professionals</div>
                      <p className="sws-feature-desc">All workers are verified and background checked</p>
                    </div>
                  </div>
                  <div className="sws-feature-item">
                    <div className="sws-feature-icon">
                      <Star size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <div className="sws-feature-text">
                      <div className="sws-feature-title">Ratings & Reviews</div>
                      <p className="sws-feature-desc">Read reviews from previous clients</p>
                    </div>
                  </div>
                  <div className="sws-feature-item">
                    <div className="sws-feature-icon">
                      <Users size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <div className="sws-feature-text">
                      <div className="sws-feature-title">Wide Selection</div>
                      <p className="sws-feature-desc">Browse hundreds of skilled workers by category</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div id="sws-cta-buttons">
                  <Link to="/skilled-workers" className="sws-btn-primary">
                    Browse Directory
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/skilled-workers/browse" className="sws-btn-secondary">
                    Explore Categories
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div id="sws-image-wrapper">
                <img 
                  src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764944090/gettyimages-1341637248_qax46l.jpg" 
                  alt="Skilled workers" 
                />
                <div id="sws-stats-overlay">
                  <div className="sws-stat-item">
                    <Hammer className="sws-stat-icon" />
                    <span className="sws-stat-text">100+ Skilled Trades</span>
                  </div>
                  <div className="sws-stat-item">
                    <Users className="sws-stat-icon" />
                    <span className="sws-stat-text">Verified Professionals</span>
                  </div>
                  <div className="sws-stat-item">
                    <Star className="sws-stat-icon" />
                    <span className="sws-stat-text">Trusted by Thousands</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

