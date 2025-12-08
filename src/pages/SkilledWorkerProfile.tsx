import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  Award,
  Briefcase,
  Clock,
  MessageCircle,
  Share2,
  Heart,
  Image as ImageIcon,
  User,
  Shield,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const isolatedStyles = `
  #swp-page-wrapper {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: hsl(40 33% 96%);
    min-height: 100vh;
  }

  #swp-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  @media (min-width: 1024px) {
    #swp-container {
      padding: 3rem 2rem;
    }
  }

  /* Header Section */
  #swp-header {
    margin-bottom: 2rem;
  }

  #swp-back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(220 15% 45%);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    transition: color 0.2s;
  }

  #swp-back-button:hover {
    color: #2563eb;
  }

  #swp-back-icon {
    width: 18px;
    height: 18px;
  }

  /* Profile Header */
  #swp-profile-header {
    background-color: hsl(0 0% 100%);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid hsl(40 20% 88%);
    box-shadow: 0 4px 20px -4px hsl(220 30% 15% / 0.08);
  }

  @media (min-width: 768px) {
    #swp-profile-header {
      padding: 2.5rem;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
      align-items: start;
    }
  }

  #swp-avatar-wrapper {
    position: relative;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 768px) {
    #swp-avatar-wrapper {
      margin-bottom: 0;
    }
  }

  #swp-avatar {
    width: 150px;
    height: 150px;
    border-radius: 1rem;
    object-fit: cover;
    border: 4px solid #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    #swp-avatar {
      width: 200px;
      height: 200px;
    }
  }

  #swp-verified-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #2563eb;
    color: #ffffff;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    border: 3px solid #ffffff;
  }

  #swp-verified-icon {
    width: 18px;
    height: 18px;
  }

  #swp-profile-info {
    flex: 1;
  }

  #swp-name-row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 640px) {
    #swp-name-row {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  #swp-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0;
    font-family: 'Playfair Display', serif;
  }

  @media (min-width: 640px) {
    #swp-name {
      font-size: 2.25rem;
    }
  }

  #swp-title {
    font-size: 1.125rem;
    color: hsl(220 15% 45%);
    margin: 0 0 1rem 0;
    font-weight: 500;
  }

  #swp-rating-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  #swp-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  #swp-rating-stars {
    display: flex;
    gap: 0.25rem;
  }

  .swp-star {
    width: 20px;
    height: 20px;
    color: #fbbf24;
    fill: #fbbf24;
  }

  #swp-rating-text {
    font-size: 1rem;
    font-weight: 600;
    color: hsl(220 30% 15%);
  }

  #swp-review-count {
    font-size: 0.875rem;
    color: hsl(220 15% 45%);
  }

  #swp-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(220 15% 45%);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  #swp-location-icon {
    width: 18px;
    height: 18px;
  }

  #swp-action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .swp-btn {
    padding: 0.75rem 1.5rem;
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

  .swp-btn-primary {
    background-color: #2563eb;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .swp-btn-primary:hover {
    background-color: #1d4ed8;
    color: #ffffff !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  .swp-btn-secondary {
    background-color: hsl(0 0% 100%);
    color: #2563eb;
    border: 2px solid #2563eb;
  }

  .swp-btn-secondary:hover {
    background-color: #eff6ff;
    color: #1d4ed8;
    border-color: #1d4ed8;
  }

  .swp-btn-icon {
    width: 18px;
    height: 18px;
  }

  /* Main Content Grid */
  #swp-main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    #swp-main-content {
      grid-template-columns: 2fr 1fr;
    }
  }

  /* Left Column */
  #swp-left-column {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Section Styles */
  .swp-section {
    background-color: hsl(0 0% 100%);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid hsl(40 20% 88%);
    box-shadow: 0 4px 20px -4px hsl(220 30% 15% / 0.08);
  }

  .swp-section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .swp-section-icon {
    width: 24px;
    height: 24px;
    color: #2563eb;
  }

  .swp-section-content {
    color: hsl(220 30% 15%);
    line-height: 1.8;
    font-size: 1rem;
  }

  /* Services Grid */
  #swp-services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .swp-service-card {
    background-color: hsl(40 33% 96%);
    border: 1px solid hsl(40 20% 88%);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: all 0.2s;
  }

  .swp-service-card:hover {
    background-color: hsl(40 20% 90%);
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }

  .swp-service-name {
    font-weight: 600;
    color: hsl(220 30% 15%);
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }

  .swp-service-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(220 30% 15%);
    margin: 0.5rem 0 0 0;
    padding-top: 0.5rem;
    border-top: 1px solid hsl(40 20% 88%);
  }

  /* Portfolio Grid */
  #swp-portfolio-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (min-width: 640px) {
    #swp-portfolio-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .swp-portfolio-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 0.75rem;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid hsl(40 20% 88%);
  }

  .swp-portfolio-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .swp-portfolio-item:hover img {
    transform: scale(1.05);
  }

  /* Reviews */
  .swp-review {
    padding: 1.5rem;
    background-color: hsl(40 33% 96%);
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid hsl(40 20% 88%);
  }

  .swp-review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .swp-reviewer-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .swp-reviewer-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #e5e7eb;
  }

  .swp-reviewer-name {
    font-weight: 600;
    color: hsl(220 30% 15%);
    margin: 0;
  }

  .swp-review-date {
    font-size: 0.875rem;
    color: hsl(220 15% 45%);
  }

  .swp-review-text {
    color: hsl(220 30% 15%);
    line-height: 1.6;
    margin: 0;
  }

  /* Right Column - Sidebar */
  #swp-right-column {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Contact Card */
  #swp-contact-card {
    position: relative;
    border-radius: 1rem;
    padding: 2rem;
    color: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    background-color: hsl(220 15% 20%);
    border: 1px solid hsl(40 20% 75%);
  }

  #swp-contact-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    font-family: 'Playfair Display', serif;
    color: #ffffff;
  }

  .swp-contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    transition: background-color 0.2s;
  }

  .swp-contact-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .swp-contact-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  .swp-contact-text {
    flex: 1;
    font-size: 0.875rem;
  }

  .swp-contact-label {
    display: block;
    font-size: 0.75rem;
    opacity: 0.8;
    margin-bottom: 0.25rem;
  }

  .swp-contact-value {
    display: block;
    font-weight: 600;
  }

  /* Stats Card */
  .swp-stat-card {
    background-color: hsl(0 0% 100%);
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid hsl(40 20% 88%);
    text-align: center;
    box-shadow: 0 4px 20px -4px hsl(220 30% 15% / 0.08);
  }

  .swp-stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #2563eb;
    margin: 0 0 0.5rem 0;
  }

  .swp-stat-label {
    font-size: 0.875rem;
    color: hsl(220 15% 45%);
    margin: 0;
  }

  /* Badges */
  #swp-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .swp-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #eff6ff;
    color: #2563eb;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .swp-badge-icon {
    width: 16px;
    height: 16px;
  }
`;

// Shared worker names - same as in SkilledWorkersList
const WORKER_NAMES = [
  'Kwame Mensah', 'Ama Serwaa', 'Kofi Boateng', 'Efua Osei',
  'Yaw Asante', 'Akosua Adjei', 'Kojo Appiah', 'Adwoa Darko',
  'Nana Yeboah', 'Maame Owusu', 'Emmanuel Tetteh', 'Gifty Mensah'
];

const WORKER_LOCATIONS = [
  'Accra, Greater Accra', 'Kumasi, Ashanti', 'Tamale, Northern',
  'Cape Coast, Central', 'Takoradi, Western', 'Sunyani, Bono'
];

// Mock data - in real app, this would come from API
const getWorkerData = (id: string) => {
  // Parse ID format: "category-index" (e.g., "ac-repair-technician-8")
  const parts = id.split('-');
  const indexPart = parts[parts.length - 1];
  const workerIndex = parseInt(indexPart) - 1; // Convert to 0-based index
  
  // Extract category (everything except last part)
  const categoryParts = parts.slice(0, -1);
  const category = categoryParts.join('-');
  const categoryName = categoryParts.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Get actual worker name and location using the same logic as list page
  const workerName = WORKER_NAMES[workerIndex % WORKER_NAMES.length];
  const location = WORKER_LOCATIONS[workerIndex % WORKER_LOCATIONS.length];
  
  // Generate consistent data based on index (same seed for same index)
  const seed = workerIndex;
  const rating = (4.0 + (seed % 10) / 10).toFixed(1);
  const reviewCount = 20 + (seed % 200);
  const experience = 2 + (seed % 15);
  const phoneSuffix = 1000000 + (seed % 9000000);
  
  const defaultWorker = {
    name: workerName,
    title: `Professional ${categoryName}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(workerName)}&size=200&background=d97706&color=fff`,
    rating: parseFloat(rating),
    reviewCount: reviewCount,
    location: location,
    phone: `+233 24 ${phoneSuffix}`,
    email: `${workerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    verified: seed % 3 !== 0, // 66% verified
    about: `With ${experience}+ years of experience in ${categoryName.toLowerCase()}, I provide professional and reliable services. I am committed to delivering high-quality work and ensuring complete customer satisfaction.`,
    services: [
      { name: `${categoryName} Consultation`, price: 'GHS 200+' },
      { name: `Basic ${categoryName} Service`, price: 'GHS 300+' },
      { name: `Premium ${categoryName} Service`, price: 'GHS 500+' },
      { name: `${categoryName} Maintenance`, price: 'GHS 150+' },
      { name: `Emergency ${categoryName}`, price: 'GHS 400+' },
      { name: `${categoryName} Installation`, price: 'GHS 600+' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905252472-38af26273916?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop'
    ],
    reviews: [
      {
        name: 'Ama Asante',
        avatar: 'https://ui-avatars.com/api/?name=Ama+Asante&background=d97706&color=fff',
        rating: 5,
        date: '2 weeks ago',
        text: 'Excellent work! Professional, punctual, and completed the job perfectly. Highly recommended!'
      },
      {
        name: 'Kofi Boateng',
        avatar: 'https://ui-avatars.com/api/?name=Kofi+Boateng&background=d97706&color=fff',
        rating: 5,
        date: '1 month ago',
        text: 'Great service and fair pricing. The work was done quickly and efficiently.'
      },
      {
        name: 'Efua Osei',
        avatar: 'https://ui-avatars.com/api/?name=Efua+Osei&background=d97706&color=fff',
        rating: 4,
        date: '2 months ago',
        text: 'Very satisfied with the work. Professional and knowledgeable service provider.'
      }
    ],
    stats: {
      completedJobs: 100 + (seed % 500),
      yearsExperience: experience,
      responseTime: `${1 + (seed % 4)} hours`
    },
    badges: ['Licensed', 'Insured', 'Verified', 'Top Rated']
  };

  // Special cases for specific worker types with actual names
  const specialWorkers: Record<string, any> = {
    'electrician-1': {
      ...defaultWorker,
      name: 'Kwame Mensah',
      title: 'Licensed Electrician',
      about: 'With over 10 years of experience in electrical installations and repairs, I specialize in residential and commercial electrical work. I am fully licensed and insured, ensuring quality service and peace of mind for all my clients.',
      services: [
        { name: 'Electrical Installation', price: 'GHS 500+' },
        { name: 'Wiring & Rewiring', price: 'GHS 300+' },
        { name: 'Electrical Repairs', price: 'GHS 200+' },
        { name: 'Panel Upgrades', price: 'GHS 800+' },
        { name: 'Lighting Installation', price: 'GHS 150+' },
        { name: 'Emergency Service', price: 'GHS 400+' }
      ]
    },
    'cake-baker-&-designer-1': {
      ...defaultWorker,
      name: 'Ama Serwaa',
      title: 'Professional Cake Baker & Designer',
      about: 'Specializing in custom cakes, wedding cakes, and creative designs. I bring your sweetest dreams to life with attention to detail and artistic flair.',
      services: [
        { name: 'Custom Birthday Cakes', price: 'GHS 200+' },
        { name: 'Wedding Cakes', price: 'GHS 500+' },
        { name: 'Cupcakes & Pastries', price: 'GHS 100+' },
        { name: 'Cake Decorating Classes', price: 'GHS 300+' },
        { name: 'Corporate Cakes', price: 'GHS 400+' },
        { name: 'Specialty Designs', price: 'GHS 600+' }
      ]
    }
  };

  return specialWorkers[id] || defaultWorker;
};

export const SkilledWorkerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const worker = getWorkerData(id || 'electrician');

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className="swp-star"
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'}
      />
    ));
  };

  return (
    <div id="swp-page-wrapper">
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />
      <style>{isolatedStyles}</style>
      <InitScripts />
      <Spinner />
      <Navigation />

      <div id="swp-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} id="swp-back-button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft id="swp-back-icon" />
          Back
        </button>

        {/* Profile Header */}
        <motion.div
          id="swp-profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div id="swp-avatar-wrapper">
            <img id="swp-avatar" src={worker.avatar} alt={worker.name} />
            {worker.verified && (
              <div id="swp-verified-badge">
                <CheckCircle id="swp-verified-icon" />
              </div>
            )}
          </div>

          <div id="swp-profile-info">
            <div id="swp-name-row">
              <div>
                <h1 id="swp-name">{worker.name}</h1>
                <p id="swp-title">{worker.title}</p>
              </div>
              <div id="swp-action-buttons">
              <button
                className="swp-btn swp-btn-secondary"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className="swp-btn-icon" fill={isFavorite ? '#2563eb' : 'none'} />
              </button>
                <button className="swp-btn swp-btn-secondary">
                  <Share2 className="swp-btn-icon" />
                </button>
              </div>
            </div>

            <div id="swp-rating-row">
              <div id="swp-rating">
                <div id="swp-rating-stars">
                  {renderStars(worker.rating)}
                </div>
                <span id="swp-rating-text">{worker.rating}</span>
                <span id="swp-review-count">({worker.reviewCount} reviews)</span>
              </div>
            </div>

            <div id="swp-location">
              <MapPin id="swp-location-icon" />
              <span>{worker.location}</span>
            </div>

            <div id="swp-badges">
              {worker.badges.map((badge: string, index: number) => (
                <span key={index} className="swp-badge">
                  <Shield className="swp-badge-icon" />
                  {badge}
                </span>
              ))}
            </div>

            <div id="swp-action-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="swp-btn swp-btn-primary">
                <Phone className="swp-btn-icon" />
                Contact Now
              </button>
              <button className="swp-btn swp-btn-secondary">
                <MessageCircle className="swp-btn-icon" />
                Send Message
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div id="swp-main-content">
          {/* Left Column */}
          <div id="swp-left-column">
            {/* About Section */}
            <motion.section
              className="swp-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="swp-section-title">
                <User className="swp-section-icon" />
                About
              </h2>
              <p className="swp-section-content">{worker.about}</p>
            </motion.section>

            {/* Services Section */}
            <motion.section
              className="swp-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="swp-section-title">
                <Briefcase className="swp-section-icon" />
                Services & Pricing
              </h2>
              <div id="swp-services-grid">
                {worker.services.map((service: any, index: number) => (
                  <div key={index} className="swp-service-card">
                    <h3 className="swp-service-name">{service.name}</h3>
                    <p className="swp-service-price">{service.price}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Portfolio Section */}
            <motion.section
              className="swp-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="swp-section-title">
                <ImageIcon className="swp-section-icon" />
                Portfolio
              </h2>
              <div id="swp-portfolio-grid">
                {worker.portfolio.map((image: string, index: number) => (
                  <div key={index} className="swp-portfolio-item">
                    <img src={image} alt={`Portfolio ${index + 1}`} />
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Reviews Section */}
            <motion.section
              className="swp-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="swp-section-title">
                <Star className="swp-section-icon" />
                Reviews ({worker.reviewCount})
              </h2>
              {worker.reviews.map((review: any, index: number) => (
                <div key={index} className="swp-review">
                  <div className="swp-review-header">
                    <div className="swp-reviewer-info">
                      <img
                        className="swp-reviewer-avatar"
                        src={review.avatar}
                        alt={review.name}
                      />
                      <div>
                        <p className="swp-reviewer-name">{review.name}</p>
                        <p className="swp-review-date">{review.date}</p>
                      </div>
                    </div>
                    <div id="swp-rating-stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="swp-review-text">{review.text}</p>
                </div>
              ))}
            </motion.section>
          </div>

          {/* Right Column - Sidebar */}
          <div id="swp-right-column">
            {/* Contact Card */}
            <motion.div
              id="swp-contact-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 id="swp-contact-title">Get in Touch</h3>
              
              <div className="swp-contact-item">
                <Phone className="swp-contact-icon" />
                <div className="swp-contact-text">
                  <span className="swp-contact-label">Phone</span>
                  <span className="swp-contact-value">{worker.phone}</span>
                </div>
              </div>

              <div className="swp-contact-item">
                <Mail className="swp-contact-icon" />
                <div className="swp-contact-text">
                  <span className="swp-contact-label">Email</span>
                  <span className="swp-contact-value">{worker.email}</span>
                </div>
              </div>

              <div className="swp-contact-item">
                <MapPin className="swp-contact-icon" />
                <div className="swp-contact-text">
                  <span className="swp-contact-label">Location</span>
                  <span className="swp-contact-value">{worker.location}</span>
                </div>
              </div>

              <button className="swp-btn swp-btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255, 255, 255, 0.1)', border: '2px solid rgba(255, 255, 255, 0.2)' }}>
                <Calendar className="swp-btn-icon" />
                Book Appointment
              </button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="swp-stat-card">
                <p className="swp-stat-value">{worker.stats.completedJobs}+</p>
                <p className="swp-stat-label">Jobs Completed</p>
              </div>
              <div className="swp-stat-card">
                <p className="swp-stat-value">{worker.stats.yearsExperience}</p>
                <p className="swp-stat-label">Years Experience</p>
              </div>
            </motion.div>

            <motion.div
              className="swp-stat-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Clock className="swp-section-icon" style={{ margin: '0 auto 0.5rem' }} />
              <p className="swp-stat-value">{worker.stats.responseTime}</p>
              <p className="swp-stat-label">Average Response Time</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

