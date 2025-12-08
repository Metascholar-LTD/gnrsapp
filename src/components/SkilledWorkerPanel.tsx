import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X,
  ArrowLeft,
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  Briefcase,
  Clock,
  MessageCircle,
  Share2,
  Heart,
  Image as ImageIcon,
  User,
  Shield,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Worker {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: string;
  reviewCount: number;
  location: string;
  phone: string;
  email: string;
  verified: boolean;
  experience: number;
  about?: string;
  services?: Array<{ name: string; price: string }>;
  portfolio?: string[];
  reviews?: Array<{ name: string; avatar: string; rating: number; date: string; text: string }>;
  stats?: {
    completedJobs: number;
    yearsExperience: number;
    responseTime: string;
  };
  badges?: string[];
}

interface SkilledWorkerPanelProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
}

const isolatedStyles = `
  @media (max-width: 1024px) {
    #swp-panel {
      max-width: 100% !important;
    }
  }

  #swp-panel-content {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  #swp-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid hsl(40 20% 88%);
  }

  #swp-panel-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(220 15% 45%);
    transition: color 0.2s;
    border-radius: 0.5rem;
  }

  #swp-panel-close:hover {
    background-color: hsl(40 20% 90%);
    color: hsl(220 30% 15%);
  }

  #swp-panel-close-icon {
    width: 24px;
    height: 24px;
  }

  #swp-panel-profile {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  #swp-panel-avatar {
    width: 100px;
    height: 100px;
    border-radius: 0.75rem;
    object-fit: cover;
    border: 3px solid #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  #swp-panel-info {
    flex: 1;
  }

  #swp-panel-name-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  #swp-panel-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0;
    font-family: 'Playfair Display', serif;
  }

  #swp-panel-title {
    font-size: 0.875rem;
    color: hsl(220 15% 45%);
    margin: 0 0 0.75rem 0;
  }

  #swp-panel-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .swp-panel-star {
    width: 16px;
    height: 16px;
    color: #fbbf24;
    fill: #fbbf24;
  }

  #swp-panel-rating-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(220 30% 15%);
  }

  #swp-panel-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(220 15% 45%);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  #swp-panel-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .swp-panel-btn {
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .swp-panel-btn-primary {
    background-color: #2563eb;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .swp-panel-btn-primary:hover {
    background-color: #1d4ed8;
    color: #ffffff !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  .swp-panel-btn-secondary {
    background-color: hsl(0 0% 100%);
    color: #2563eb;
    border: 2px solid #2563eb;
  }

  .swp-panel-btn-secondary:hover {
    background-color: #eff6ff;
    color: #1d4ed8;
    border-color: #1d4ed8;
  }

  .swp-panel-section {
    background-color: hsl(0 0% 100%);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid hsl(40 20% 88%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .swp-panel-section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0 0 1rem 0;
    font-family: 'Playfair Display', serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .swp-panel-section-icon {
    width: 20px;
    height: 20px;
    color: #2563eb;
  }

  .swp-panel-section-content {
    color: hsl(220 30% 15%);
    line-height: 1.7;
    font-size: 0.875rem;
  }

  #swp-panel-services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .swp-panel-service-card {
    background-color: hsl(40 33% 96%);
    border: 1px solid hsl(40 20% 88%);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .swp-panel-service-name {
    font-weight: 600;
    color: hsl(220 30% 15%);
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
  }

  .swp-panel-service-price {
    font-size: 1rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0.5rem 0 0 0;
    padding-top: 0.5rem;
    border-top: 1px solid hsl(40 20% 88%);
  }

  #swp-panel-view-full {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    margin-top: 1rem;
    transition: color 0.2s;
  }

  #swp-panel-view-full:hover {
    color: #1d4ed8;
  }

  #swp-panel-view-full-icon {
    width: 16px;
    height: 16px;
  }
`;

export const SkilledWorkerPanel = ({ worker, isOpen, onClose }: SkilledWorkerPanelProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className="swp-panel-star"
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
      />
    ));
  };

  const handleViewFullProfile = () => {
    if (worker) {
      navigate(`/skilled-workers/profile/${worker.id}`);
      onClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
  };

  // Reset closing state when panel opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!worker) return null;

  const shouldRender = isOpen || isClosing;

  return (
    <AnimatePresence>
      {shouldRender && (
        <>
          <motion.div
            id="swp-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          />
          <motion.div
            key="panel"
            id="swp-panel"
            initial={{ x: '100%' }}
            animate={{ x: isClosing ? '100%' : 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              if (isClosing) {
                onClose();
                setIsClosing(false);
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '50%',
              backgroundColor: 'hsl(40 33% 96%)',
              zIndex: 10000,
              overflowY: 'auto',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div id="swp-panel-content">
              <link 
                rel="stylesheet" 
                href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
              />
              <style>{isolatedStyles}</style>

              {/* Header */}
              <div id="swp-panel-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={handleClose}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(220 15% 45%)',
                    transition: 'all 0.2s',
                    borderRadius: '0.5rem',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(40 20% 90%)';
                    e.currentTarget.style.color = 'hsl(220 30% 15%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'hsl(220 15% 45%)';
                  }}
                >
                  <ArrowLeft style={{ width: '24px', height: '24px' }} />
                </button>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'hsl(220 30% 15%)', fontFamily: "'Playfair Display', serif", flex: 1 }}>
                  Worker Profile
                </h2>
              </div>

              {/* Profile Summary */}
              <div id="swp-panel-profile">
                <img id="swp-panel-avatar" src={worker.avatar} alt={worker.name} />
                <div id="swp-panel-info">
                  <div id="swp-panel-name-row">
                    <h3 id="swp-panel-name">{worker.name}</h3>
                    {worker.verified && (
                      <CheckCircle style={{ width: '20px', height: '20px', color: '#2563eb', flexShrink: 0 }} />
                    )}
                  </div>
                  <p id="swp-panel-title">{worker.title}</p>
                  
                  <div id="swp-panel-rating">
                    <div style={{ display: 'flex', gap: '0.125rem' }}>
                      {renderStars(parseFloat(worker.rating))}
                    </div>
                    <span id="swp-panel-rating-text">{worker.rating}</span>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 45%)' }}>
                      ({worker.reviewCount} reviews)
                    </span>
                  </div>

                  <div id="swp-panel-location">
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    <span>{worker.location}</span>
                  </div>

                  <div id="swp-panel-actions">
                    <button className="swp-panel-btn swp-panel-btn-primary">
                      <Phone style={{ width: '16px', height: '16px' }} />
                      Contact
                    </button>
                    <button className="swp-panel-btn swp-panel-btn-secondary">
                      <MessageCircle style={{ width: '16px', height: '16px' }} />
                      Message
                    </button>
                    <button
                      className="swp-panel-btn swp-panel-btn-secondary"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart style={{ width: '16px', height: '16px' }} fill={isFavorite ? '#2563eb' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {worker.about && (
                <div className="swp-panel-section">
                  <h4 className="swp-panel-section-title">
                    <User className="swp-panel-section-icon" />
                    About
                  </h4>
                  <p className="swp-panel-section-content">
                    {worker.about.length > 200 ? `${worker.about.substring(0, 200)}...` : worker.about}
                  </p>
                </div>
              )}

              {/* Services Section */}
              {worker.services && worker.services.length > 0 && (
                <div className="swp-panel-section">
                  <h4 className="swp-panel-section-title">
                    <Briefcase className="swp-panel-section-icon" />
                    Services & Pricing
                  </h4>
                  <div id="swp-panel-services-grid">
                    {worker.services.slice(0, 4).map((service, index) => (
                      <div key={index} className="swp-panel-service-card">
                        <h5 className="swp-panel-service-name">{service.name}</h5>
                        <p className="swp-panel-service-price">{service.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View Full Profile Link */}
              <a
                id="swp-panel-view-full"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewFullProfile();
                }}
              >
                View full profile
                <ExternalLink id="swp-panel-view-full-icon" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

