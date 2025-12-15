import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Building2, MapPin, Star, Search, ArrowRight, GraduationCap, Hospital, UtensilsCrossed, Banknote } from "lucide-react";

const Directories = () => {

  const directories = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Universities & Schools",
      description: "Find and compare educational institutions across Ghana",
      link: "/directories/universities",
      color: "#0066cc",
      count: "500+"
    },
    {
      icon: <Hospital className="w-8 h-8" />,
      title: "Hospitals & Clinics",
      description: "Locate healthcare facilities and medical centers",
      link: "/directories/hospitals",
      color: "#0066cc",
      count: "300+"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Restaurants",
      description: "Discover dining options and read reviews",
      link: "/directories/restaurants",
      color: "#0066cc",
      count: "1,000+"
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "Banks & Financial",
      description: "Find banks, ATMs, and financial institutions",
      link: "/directories/banks",
      color: "#0066cc",
      count: "200+"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Hotels & Accommodation",
      description: "Search for hotels and places to stay",
      link: "/directories/hotels",
      color: "#0066cc",
      count: "400+"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "All Directories",
      description: "Browse all business and institution categories",
      link: "/directories",
      color: "#0066cc",
      count: "2,500+"
    }
  ];

  const features = [
    {
      title: "Comprehensive Listings",
      description: "Access thousands of verified businesses and institutions",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
    },
    {
      title: "Detailed Information",
      description: "Get contact details, locations, reviews, and ratings",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      title: "User Reviews",
      description: "Read authentic reviews from real customers and visitors",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
    }
  ];

  const styles = `
    .directories-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .dir-hero {
      background: #000000;
      color: white;
      padding: 8rem 2rem 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .dir-hero video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      z-index: 1;
      object-fit: cover;
    }

    .dir-hero::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 2;
    }


    .dir-hero-content {
      position: relative;
      z-index: 3;
      max-width: 800px;
      margin: 0 auto;
    }

    .dir-hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin: 0 0 1.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
      animation: fadeInUp 0.8s ease-out;
    }

    .dir-hero-subtitle {
      font-size: clamp(1.125rem, 2vw, 1.5rem);
      margin: 0 0 2rem;
      opacity: 0.95;
      line-height: 1.6;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dir-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .dir-section {
      padding: 5rem 0;
    }

    .dir-section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      text-align: center;
      color: #000000;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
      letter-spacing: -0.02em;
    }

    .dir-section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      color: #000000;
      margin: 0 0 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .dir-card {
      background: white;
      border: 2px solid #f0f0f0;
      border-radius: 1rem;
      padding: 2rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .dir-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--card-color);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .dir-card:hover::before {
      transform: scaleY(1);
    }

    .dir-card:hover {
      border-color: var(--card-color);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .dir-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .dir-card-icon {
      color: #000000;
      transition: transform 0.3s ease;
    }

    .dir-card:hover .dir-card-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .dir-card-count {
      background: var(--card-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-card-desc {
      font-size: 0.9375rem;
      color: #000000;
      margin: 0 0 1rem;
      line-height: 1.6;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-card-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #000000;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .dir-feature-card {
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .dir-feature-card:hover {
      transform: translateY(-5px);
    }

    .dir-feature-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .dir-feature-content {
      padding: 2rem;
      background: white;
    }

    .dir-feature-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000000;
      margin: 0 0 0.5rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-feature-desc {
      font-size: 1rem;
      color: #000000;
      line-height: 1.6;
      margin: 0;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }


    .dir-cta-section {
      background: #000000;
      color: white;
      padding: 4rem 2rem;
      border-radius: 1rem;
      text-align: center;
      margin-top: 4rem;
    }

    .dir-cta-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 700;
      margin: 0 0 1rem;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-cta-text {
      font-size: 1.125rem;
      margin: 0 0 2rem;
      opacity: 0.95;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: white;
      color: #0066cc;
      font-weight: 600;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      font-family: 'ReithSans', 'Helvetica', 'Arial', sans-serif;
    }

    .dir-cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .dir-grid,
      .dir-features {
        grid-template-columns: 1fr;
      }

    }
  `;

  return (
    <div className="directories-page">
      <style>{styles}</style>
      <Navigation />
      
      <section className="dir-hero">
        <video autoPlay loop muted playsInline>
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="dir-hero-content">
          <h1 className="dir-hero-title">Directories</h1>
          <p className="dir-hero-subtitle">
            Find businesses, institutions, and services across Ghana
          </p>
        </div>
      </section>

      <div className="dir-wrapper">
        <section className="dir-section">
          <h2 className="dir-section-title">Browse Directories</h2>
          <p className="dir-section-subtitle">
            Explore our comprehensive directory listings
          </p>
          
          <div className="dir-grid">
            {directories.map((directory, index) => (
              <Link
                key={index}
                to={directory.link}
                className="dir-card"
                style={{ '--card-color': directory.color } as React.CSSProperties}
              >
                <div className="dir-card-header">
                  <div className="dir-card-icon">{directory.icon}</div>
                  <span className="dir-card-count">{directory.count}</span>
                </div>
                <h3 className="dir-card-title">{directory.title}</h3>
                <p className="dir-card-desc">{directory.description}</p>
                <span className="dir-card-link">
                  Explore <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="dir-section">
          <h2 className="dir-section-title">Why Use Our Directories?</h2>
          <p className="dir-section-subtitle">
            Discover the benefits of using our directory platform
          </p>
          
          <div className="dir-features">
            {features.map((feature, index) => (
              <div key={index} className="dir-feature-card">
                <img src={feature.image} alt={feature.title} className="dir-feature-image" />
                <div className="dir-feature-content">
                  <h3 className="dir-feature-title">{feature.title}</h3>
                  <p className="dir-feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dir-cta-section">
          <h2 className="dir-cta-title">Start Exploring Today</h2>
          <p className="dir-cta-text">
            Discover thousands of businesses and institutions across Ghana
          </p>
          <Link to="/directories" className="dir-cta-button">
            Browse Directories
            <ArrowRight size={20} />
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Directories;

